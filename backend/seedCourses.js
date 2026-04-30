const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const courses = [
  // --- LEVEL 3 ---
  { code: 'EEI3372', name: 'Programming in Python',                       credits: 3, category: 'I', level: 3, isCompulsory: true,  semester: 1 },
  { code: 'EEI3366/EEI3266', name: 'Database Systems',                             credits: 3, category: 'I', level: 3, isCompulsory: true,  semester: 1 },
  { code: 'EEI3346', name: 'Web Application Development',                  credits: 3, category: 'I', level: 3, isCompulsory: true,  semester: 1 },
  { code: 'EEI3467', name: 'Software Engineering Concepts and Programming', credits: 4, category: 'I', level: 3, isCompulsory: true,  semester: 1 },
  { code: 'EEL3263/AGM3263', name: 'Communication Skills',                          credits: 2, category: 'L', level: 3, isCompulsory: true,  semester: 1 }, // spans 1&2, listed as 1
  { code: 'EEI3347/EEI4346', name: 'Web Technology',                                credits: 3, category: 'I', level: 3, isCompulsory: true,  semester: 2 },
  { code: 'EEI3262', name: 'Introduction to Object Oriented Programming',   credits: 2, category: 'I', level: 3, isCompulsory: true,  semester: 2 },
  { code: 'EEI3269', name: 'Mobile Application Design',                     credits: 2, category: 'I', level: 3, isCompulsory: true,  semester: 2 },
  { code: 'EEI3273/EEX3373', name: 'Communication and Computer Technology',         credits: 2, category: 'I', level: 3, isCompulsory: true,  semester: 2 },
  { code: 'MHZ3356/MHZ4256', name: 'Mathematics for Computing I',                   credits: 3, category: 'Z', level: 3, isCompulsory: true,  semester: 2 },
  { code: 'EEM3366', name: 'Introduction to Business Studies',              credits: 3, category: 'M', level: 3, isCompulsory: false, semester: 2 },
  { code: 'LTE34SI', name: ' English for Academic Purpose -Intermediate',              credits: 4, category: 'L', level: 3, isCompulsory: true, semester: 1 },
  // --- LEVEL 4 ---
  { code: 'EEI4267', name: 'Requirement Engineering',                        credits: 2, category: 'I', level: 4, isCompulsory: true,  semester: 3 },
  { code: 'MHZ4359/MHZ3459', name: 'Mathematics for Computing II',                   credits: 3, category: 'Z', level: 4, isCompulsory: true,  semester: 3 },
  { code: 'AGM4367', name: 'Economics and Marketing for Engineers',          credits: 3, category: 'M', level: 4, isCompulsory: true,  semester: 3 },
  { code: 'EEI4361', name: 'User Experience Engineering',                    credits: 3, category: 'I', level: 4, isCompulsory: true,  semester: 3 },
  { code: 'EEI4362', name: 'Object Oriented Design',                         credits: 3, category: 'I', level: 4, isCompulsory: true,  semester: 3 },
  { code: 'EER4189', name: 'Software Design in Group',                       credits: 1, category: 'R', level: 4, isCompulsory: true,  semester: 3 }, // spans 3&4
  { code: 'EEI4370/EEI5270', name: 'Computer Security Concepts',                     credits: 3, category: 'I', level: 4, isCompulsory: true,  semester: 4 },
  { code: 'EEI4360/EEX6340', name: 'Introduction to Artificial Intelligence',        credits: 3, category: 'I', level: 4, isCompulsory: true,  semester: 4 },
  { code: 'EEI4365/EEX4465', name: 'Data Structures and Algorithms',                 credits: 3, category: 'I', level: 4, isCompulsory: true,  semester: 4 },
  { code: 'CVM4402/CVM5402', name: 'Accounting for Engineers',                       credits: 4, category: 'M', level: 4, isCompulsory: true,  semester: 4 },
  { code: 'MHZ4377', name: 'Applied Statistics',                             credits: 3, category: 'Z', level: 4, isCompulsory: true,  semester: 4 },
  { code: 'EER4489', name: 'Higher Diploma Project - Software Engineering',  credits: 4, category: 'R', level: 4, isCompulsory: false, semester: 3 },

  // --- LEVEL 5 ---
  { code: 'EEI5364/EEX5464', name: 'Data Communication and Networking',              credits: 3, category: 'I', level: 5, isCompulsory: true,  semester: 5 },
  { code: 'MHJ5383/MHJ5372', name: 'Technology Society and Environment',             credits: 3, category: 'J', level: 5, isCompulsory: true,  semester: 5 },
  { code: 'MHZ5375', name: 'Discrete Mathematics',                           credits: 3, category: 'Z', level: 5, isCompulsory: true,  semester: 5 },
  { code: 'LLM5281/LLJ3265', name: 'Basic Laws Relating to Engineering and Technology', credits: 2, category: 'J', level: 5, isCompulsory: true, semester: 5 },
  { code: 'EEW5611/EEW5811', name: 'Industrial Training - Software',                 credits: 6, category: 'W', level: 5, isCompulsory: true,  semester: 5 }, // spans 5&6
  { code: 'EEI5265', name: 'Operating Systems',                              credits: 2, category: 'I', level: 5, isCompulsory: true,  semester: 5 },
  { code: 'EEI5369/EEI4369', name: 'Mobile App Development with Android',            credits: 3, category: 'I', level: 5, isCompulsory: false, semester: 5 },
  { code: 'EEI5263', name: 'Computer Organization and Architecture',         credits: 2, category: 'I', level: 5, isCompulsory: true,  semester: 6 },
  { code: 'EEI5467', name: 'Software Testing and Quality Assurance',         credits: 4, category: 'I', level: 5, isCompulsory: true,  semester: 6 },
  { code: 'EEI5486/EEI4366', name: 'Advanced Database Systems',                      credits: 4, category: 'I', level: 5, isCompulsory: true,  semester: 6 },
  { code: 'EEI5376', name: 'Embedded Systems and IoT',                       credits: 3, category: 'I', level: 5, isCompulsory: false, semester: 6 },
  { code: 'MHJ5282/MHJ4271', name: 'History of Technology',                          credits: 2, category: 'J', level: 5, isCompulsory: false, semester: 6 },
  { code: 'EEI5373/EEX4373', name: 'Data Science',                                   credits: 3, category: 'I', level: 5, isCompulsory: false, semester: 6 },
  { code: 'EEX5563', name: 'Computer Architecture and Operating Systems',         credits: 5, category: 'X', level: 5, isCompulsory: true,  semester: 6 },

  // --- LEVEL 6 ---
  { code: 'EEI6378', name: 'Neural Networks and Fuzzy Logic Applications',   credits: 3, category: 'I', level: 6, isCompulsory: false, semester: 5 },
  { code: 'EER6289/EEY6189', name: 'Research Methodology and Project Identification', credits: 2, category: 'R', level: 6, isCompulsory: true,  semester: 5 }, // spans 5&6
  { code: 'EEI6360', name: 'Software Project Management',                    credits: 3, category: 'I', level: 6, isCompulsory: true,  semester: 7 },
  { code: 'EEI6373/EEX5362', name: 'Performance Modelling',                          credits: 3, category: 'I', level: 6, isCompulsory: true,  semester: 7 },
  { code: 'EEI6567', name: 'Software Architecture and Design',               credits: 5, category: 'I', level: 6, isCompulsory: true,  semester: 7 }, // spans 7&8
  { code: 'EER6689', name: 'Final Project - Software',                       credits: 6, category: 'R', level: 6, isCompulsory: true,  semester: 7 }, // spans 7&8
  { code: 'EEI6279', name: 'Natural Language Processing',                    credits: 2, category: 'I', level: 6, isCompulsory: false, semester: 7 },
  { code: 'EEI6280/EEI5280', name: 'Creative Design',                                credits: 2, category: 'I', level: 6, isCompulsory: false, semester: 7 },
  { code: 'EEI6320', name: 'Intelligent Systems and Agent Technology',       credits: 3, category: 'I', level: 6, isCompulsory: false, semester: 7 },
  { code: 'EEI6366', name: 'Big Data Technologies and Distributed Systems',  credits: 3, category: 'I', level: 6, isCompulsory: false, semester: 7 },
  { code: 'EEI6377', name: 'Data Mining',                                    credits: 3, category: 'I', level: 6, isCompulsory: false, semester: 7 },
  { code: 'EEI6363', name: 'Compiler Construction',                          credits: 3, category: 'I', level: 6, isCompulsory: false, semester: 7 }, // spans 7&8
  { code: 'EEI6171', name: 'Emerging Technologies',                          credits: 1, category: 'I', level: 6, isCompulsory: true,  semester: 8 },
  { code: 'EEM6202', name: 'Professional Practice',                          credits: 2, category: 'M', level: 6, isCompulsory: true,  semester: 8 },
  { code: 'EEI6369', name: 'Cloud Computing',                                credits: 3, category: 'I', level: 6, isCompulsory: false, semester: 8 },
];

const seedCourses = async () => {
  try {
    console.log("🌱 Seeding courses...");

    for (const course of courses) {
      await Course.updateOne(
      { code: course.code },
      { $set: course },
      { upsert: true }
    );
        }

        console.log("✅ Courses synced successfully!");
      } catch (err) {
        console.error("❌ Seeding error:", err);
      }
    }

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