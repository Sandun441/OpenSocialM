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
router.get('/progress', protect, async (req, res) => {
  try {
    const results = await StudentResult.find({ user: req.user.id }).populate('course');

    // 1. Separate results for Display vs Calculation
    let completedCredits = 0;
    let levelBreakdown = { 3: 0, 4: 0, 5: 0, 6: 0 };
    
    // Filter out valid results (must have a course attached)
    const validResults = results.filter(r => r.course);

    // Calculate Total Credits & Level Breakdown (Includes Level 3)
    const formattedCourses = validResults.map(result => {
      const gp = getGradePoint(result.grade);
      const credits = result.course.credits;
      const level = result.course.level;
      
      // Pass Condition: GP >= 2.0 (C) is standard pass, but D (1.0) often counts for credit accumulation
      // We'll count anything D (1.0) or above as "Credits Earned" for the total count
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
        status: gp >= 2.0 ? 'Completed' : (gp >= 1.0 ? 'Conditional Pass' : 'Failed')
      };
    });

    // --- 2. THE 70-CREDIT GPA ALGORITHM ---
    
    // Step A: Assign Priority based on OUSL Rules
    const rankedCourses = validResults.map(r => {
      const level = r.course.level;
      const isCompulsory = r.course.isCompulsory;
      let priority = 99; // Default: Ignore (e.g. Level 3)

      if (level >= 5 && isCompulsory) priority = 1;      // (1) Compulsory L5 & L6
      else if (level >= 5 && !isCompulsory) priority = 2; // (2) Elective L5 & L6
      else if (level === 4 && isCompulsory) priority = 3; // (3) Compulsory L4
      
      return { ...r.toObject(), gp: getGradePoint(r.grade), priority };
    })
    .filter(r => r.priority !== 99 && r.gp >= 2.0) // Only include Passed courses in Priority 1-3
    .sort((a, b) => {
      // Sort by Priority (1 -> 2 -> 3)
      if (a.priority !== b.priority) return a.priority - b.priority;
      // If same priority, pick best grades first to maximize GPA (Student friendly assumption)
      return b.gp - a.gp; 
    });

    // Step B: Select exactly 70 Credits
    let creditsCounted = 0;
    let totalWeightedPoints = 0;
    const TARGET_CREDITS = 70;

    for (let item of rankedCourses) {
      if (creditsCounted >= TARGET_CREDITS) break;

      const available = item.course.credits;
      const needed = TARGET_CREDITS - creditsCounted;
      
      // "Part Credit" Logic: Take strictly what is needed to reach 70
      const creditsToTake = Math.min(available, needed);

      totalWeightedPoints += (creditsToTake * item.gp);
      creditsCounted += creditsToTake;
    }

    // Step C: Compute Final GPA
    // If student has < 70 eligible credits, divide by what they have (Running Average)
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

module.exports = router;