const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Course = require('../models/Course');
const StudentResult = require('../models/StudentResult');

// OUSL Grade Points
const getGradePoint = (grade) => {
  switch (grade) {
    case 'A+': return 4.0;
    case 'A':  return 4.0;
    case 'A-': return 3.7;
    case 'B+': return 3.3;
    case 'B':  return 3.0;
    case 'B-': return 2.7;
    case 'C+': return 2.3;
    case 'C':  return 2.0;
    case 'C-': return 1.7;
    case 'D+': return 1.3;
    case 'D':  return 1.0;
    default: return 0.0;
  }
};

const getDegreeClass = (gpa) => {
  const gpaNum = parseFloat(gpa);
  if (gpaNum >= 3.70) return 'First Class';
  if (gpaNum >= 3.30) return 'Second Class (Upper)';
  if (gpaNum >= 3.00) return 'Second Class (Lower)';
  if (gpaNum >= 2.00) return 'Pass';
  return 'Pending';
};

// @route   GET api/academic/progress
// @desc    Calculate GPA and Degree Status based on OUSL Rules
router.get('/progress', protect, async (req, res) => {
  try {
    const results = await StudentResult.find({ user: req.user.id }).populate('course');

    // 1. Separate results for Display vs Calculation
    let completedCredits = 0;
    let levelBreakdown = { 3: 0, 4: 0, 5: 0, 6: 0 };
    
    // Filter out valid results
    const validResults = results.filter(r => r.course);

    // Calculate Total Credits & Level Breakdown
    const formattedCourses = validResults.map(result => {
      const gp = getGradePoint(result.grade);
      const credits = result.course.credits;
      const level = result.course.level;
      
      if (gp >= 1.0) {
        completedCredits += credits;
        if (levelBreakdown[level] !== undefined) levelBreakdown[level] += credits;
      }

      return {
        id: result._id,
        code: result.course.code,
        name: result.course.name,
        credits: credits,
        level: level,
        grade: result.grade,
        semester: result.semester, // ✅ THIS LINE WAS MISSING!
        status: gp >= 2.0 ? 'Completed' : (gp >= 1.0 ? 'Conditional Pass' : 'Failed')
      };
    });

    // --- 2. THE 70-CREDIT GPA ALGORITHM ---
    
    const rankedCourses = validResults.map(r => {
      const level = r.course.level;
      const isCompulsory = r.course.isCompulsory;
      let priority = 99; 

      if (level >= 5 && isCompulsory) priority = 1;      
      else if (level >= 5 && !isCompulsory) priority = 2; 
      else if (level === 4 && isCompulsory) priority = 3; 
      
      return { ...r.toObject(), gp: getGradePoint(r.grade), priority };
    })
    .filter(r => r.priority !== 99 && r.gp >= 2.0) 
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.gp - a.gp; 
    });

    let creditsCounted = 0;
    let totalWeightedPoints = 0;
    const TARGET_CREDITS = 70;

    for (let item of rankedCourses) {
      if (creditsCounted >= TARGET_CREDITS) break;

      const available = item.course.credits;
      const needed = TARGET_CREDITS - creditsCounted;
      const creditsToTake = Math.min(available, needed);

      totalWeightedPoints += (creditsToTake * item.gp);
      creditsCounted += creditsToTake;
    }

    const divisor = creditsCounted > 0 ? creditsCounted : 1;
    const gpa = (totalWeightedPoints / divisor).toFixed(2);

    res.json({
      gpa,
      degreeClass: getDegreeClass(gpa),
      totalCreditsRequired: 130,
      completedCredits,
      levelBreakdown,
      courses: formattedCourses
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ... Keep existing add-result and catalog routes ...
// (Add them here if you wiped the file, otherwise just replace the GET /progress route)
// Re-adding essential routes just in case:

router.get('/catalog', protect, async (req, res) => {
  const courses = await Course.find().select('code name credits');
  res.json(courses);
});

router.post('/add-result', protect, async (req, res) => {
  const { courseCode, grade, semester } = req.body;
  try {
    const course = await Course.findOne({ code: courseCode });
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    let result = await StudentResult.findOne({ user: req.user.id, course: course._id });
    if (result) {
      result.grade = grade;
      result.semester = semester;
      await result.save();
    } else {
      result = new StudentResult({ user: req.user.id, course: course._id, grade, semester });
      await result.save();
    }
    res.json(result);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/academic/add-results-batch
// @desc    Add MULTIPLE results at once
router.post('/add-results-batch', protect, async (req, res) => {
  const { results } = req.body; // Expecting an array: [{ courseCode, grade, semester }, ...]

  try {
    if (!results || results.length === 0) {
      return res.status(400).json({ msg: 'No results provided' });
    }

    const processedResults = [];

    // Process each result in the array
    for (const item of results) {
      const { courseCode, grade, semester } = item;

      // 1. Find the course ID
      const course = await Course.findOne({ code: courseCode });
      if (!course) continue; // Skip invalid codes (safety check)

      // 2. Update or Create the result
      let result = await StudentResult.findOne({ user: req.user.id, course: course._id });
      
      if (result) {
        result.grade = grade;
        result.semester = semester;
        await result.save();
      } else {
        result = new StudentResult({
          user: req.user.id,
          course: course._id,
          grade,
          semester
        });
        await result.save();
      }
      processedResults.push(result);
    }

    res.json({ msg: `Successfully saved ${processedResults.length} results`, data: processedResults });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   DELETE api/academic/result/:id
// @desc    Delete a saved result
router.delete('/result/:id', protect, async (req, res) => {
  try {
    const result = await StudentResult.findById(req.params.id);

    // 1. Check if result exists
    if (!result) {
      return res.status(404).json({ msg: 'Result not found' });
    }

    // 2. Security Check: Ensure the user owns this result
    if (result.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await result.deleteOne();
    res.json({ msg: 'Result removed' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;