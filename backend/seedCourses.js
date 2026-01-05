const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const courses = [
  // --- LEVEL 3 (Ignored for GPA, but needed for credits) ---
  { code: 'EEX3467', name: 'Software Engineering Concepts', credits: 4, category: 'X', level: 3, isCompulsory: true },
  { code: 'EEI3346', name: 'Web Application Development', credits: 3, category: 'I', level: 3, isCompulsory: true },
  { code: 'EEI3262', name: 'Intro to Object Oriented Programming', credits: 2, category: 'I', level: 3, isCompulsory: true },
  { code: 'EEI3266', name: 'Information Systems & Data Management', credits: 2, category: 'I', level: 3, isCompulsory: true },
  { code: 'EEX3373', name: 'Communication and Computer Technology', credits: 3, category: 'X', level: 3, isCompulsory: true },
  { code: 'AGM3263', name: 'Communication Skills', credits: 2, category: 'M', level: 3, isCompulsory: true },
  { code: 'MHZ3459', name: 'Basic Mathematics for Computing', credits: 4, category: 'Z', level: 3, isCompulsory: true },
  { code: 'EEI3269', name: 'Intro to Mobile App Development', credits: 2, category: 'I', level: 3, isCompulsory: false }, // Elective
  { code: 'EEM3366', name: 'Introduction to Business Studies', credits: 3, category: 'M', level: 3, isCompulsory: false }, // Elective

  // --- LEVEL 4 (Compulsory counts for Priority 3) ---
  { code: 'EEI4267', name: 'Requirement Engineering', credits: 2, category: 'I', level: 4, isCompulsory: true },
  { code: 'EEI4362', name: 'Object Oriented Design', credits: 3, category: 'I', level: 4, isCompulsory: true },
  { code: 'EEX4465', name: 'Data Structures and Algorithms', credits: 4, category: 'X', level: 4, isCompulsory: true },
  { code: 'MHZ4256', name: 'Mathematics for Computing', credits: 2, category: 'Z', level: 4, isCompulsory: true },
  { code: 'EEI4361', name: 'User Experience Engineering', credits: 3, category: 'I', level: 4, isCompulsory: true },
  { code: 'EEI4366', name: 'Data Modelling and Database Systems', credits: 3, category: 'I', level: 4, isCompulsory: true },
  { code: 'AGM4367', name: 'Economics and Marketing for Engineers', credits: 3, category: 'M', level: 4, isCompulsory: true },
  { code: 'EEY4189', name: 'Software Design in Group', credits: 1, category: 'Y', level: 4, isCompulsory: true },
  { code: 'MHZ4377', name: 'Applied Statistics', credits: 3, category: 'Z', level: 4, isCompulsory: true },
  { code: 'EEI5467', name: 'Software Testing and QA', credits: 4, category: 'I', level: 4, isCompulsory: true }, // Note: Guide sometimes lists this in L4/5 block, assumed L4 based on digit '4' or context. Adjust if needed.

  // --- LEVEL 5 (Priority 1 & 2) ---
  { code: 'EEI5270', name: 'Information Security', credits: 2, category: 'I', level: 5, isCompulsory: true },
  { code: 'MHZ5375', name: 'Discrete Mathematics', credits: 3, category: 'Z', level: 5, isCompulsory: true },
  { code: 'EEX5563', name: 'Computer Architecture & OS', credits: 5, category: 'X', level: 5, isCompulsory: true },
  { code: 'EEW5811', name: 'Industrial Training', credits: 8, category: 'W', level: 5, isCompulsory: true },
  { code: 'CVM5402', name: 'Accounting for Engineers', credits: 4, category: 'M', level: 5, isCompulsory: true },
  { code: 'EEX5362', name: 'Performance Modelling', credits: 3, category: 'X', level: 5, isCompulsory: true },
  { code: 'MHJ5372', name: 'Technology, Society and Environment', credits: 3, category: 'J', level: 5, isCompulsory: true },
  // Electives
  { code: 'EEX5376', name: 'Embedded Systems & IoT', credits: 3, category: 'X', level: 5, isCompulsory: false },
  { code: 'EEX5464', name: 'Data Communication & Networking', credits: 4, category: 'X', level: 5, isCompulsory: false },
  { code: 'EEI5280', name: 'Creative Design', credits: 2, category: 'I', level: 5, isCompulsory: false },

  // LEVEL 6 (Priority 1 & 2) 
  { code: 'EEY6189', name: 'Research Methodology', credits: 1, category: 'Y', level: 6, isCompulsory: true },
  { code: 'DMM6601', name: 'Management for Engineers', credits: 6, category: 'M', level: 6, isCompulsory: true },
  { code: 'EEI6360', name: 'Software Project Management', credits: 3, category: 'I', level: 6, isCompulsory: true },
  { code: 'EEI6171', name: 'Emerging Technologies', credits: 1, category: 'I', level: 6, isCompulsory: true },
  { code: 'EEI6567', name: 'Software Architecture and Design', credits: 5, category: 'I', level: 6, isCompulsory: true },
  { code: 'EEM6202', name: 'Professional Practice', credits: 2, category: 'M', level: 6, isCompulsory: true },
  { code: 'EEX6363', name: 'Compiler Construction', credits: 3, category: 'X', level: 6, isCompulsory: true },
  { code: 'EEY6689', name: 'Final Project', credits: 6, category: 'Y', level: 6, isCompulsory: true },
  { code: 'EEX6340', name: 'AI Techniques', credits: 3, category: 'X', level: 6, isCompulsory: false }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('✅ Courses with Compulsory flags seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seedDB();