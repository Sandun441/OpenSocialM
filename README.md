# University Community Platform

![Project Banner](https://via.placeholder.com/1200x400?text=OUSL+Community+Platform) 
A comprehensive social and academic collaboration platform built for the students of the **Open University of Sri Lanka**. This application bridges the gap between distance learning and campus life by providing tools for networking, academic tracking, and event management.

## 🚀 Live Demo
[View Live Demo](#) 

## ✨ Key Features

### 🔐 Authentication & Security
* Secure User Registration & Login (JWT Authentication).
* Faculty-based access control.
* **Dark Mode** support across the entire application.

### 🏠 Student Hub & Social Feed
* **Faculty Feeds:** A Facebook-style timeline for students to share updates, news, and announcements specific to their faculty.
* **Batch Directory:** Searchable student directory with filters for Faculty, Degree Program, and Batch Year.

### 📅 Academic Management
* **Interactive Calendar:** Integrated **FullCalendar** to manage exams, assignments, and batch trips.
* **GPA Calculator:** A dynamic tool to track credits, calculate GPA, and visualize degree progress.

### 💬 Collaboration
* **Discussion Forum:** StackOverflow-style Q&A section with upvoting and categorization (Academic, General, Events).
* **Student Profiles:** Customizable profiles with avatars, cover photos, biographies, and social media links.

## 🛠️ Tech Stack

**Frontend:**
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React.js** (Hooks, Context API)
* ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS** (Styling & Dark Mode)
* **FullCalendar** (Event Management)
* **Axios** (API Requests)

**Backend:**
* ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js**
* ![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) **Express.js** (REST API)
* **JWT** (JSON Web Tokens for Auth)

**Database:**
* ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB** (Mongoose ODM)

## 📸 Screenshots

| **Dark Mode Dashboard** | **Faculty Feed** |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+Dark+Mode) | ![Feed](https://via.placeholder.com/400x200?text=Faculty+Feed) |

| **Events Calendar** | **GPA Calculator** |
|:---:|:---:|
| ![Calendar](https://via.placeholder.com/400x200?text=Events+Calendar) | ![GPA](https://via.placeholder.com/400x200?text=Academic+Progress) |

## 💻 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js installed (v14 or higher)
* MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ousl-community.git](https://github.com/your-username/ousl-community.git)
cd ousl-community
