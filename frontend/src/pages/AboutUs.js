import React from 'react';
import { GraduationCap, Code, Server, Users } from 'lucide-react'; // Optional: npm install lucide-react

export default function AboutUs() {
  const team = [
    {
      name: "Sandun Liyanage", // Replace with your name
      role: "Full-Stack Developer",
      bio: "BSE Student at OUSL. Focused on bridging the gap between student needs and digital solutions.",
      image: "/sandun.jpg" // Put your image in public folder
    },
    {
      name: "Hafsa Zinthikar", // Replace with your partner's name
      role: "Full-Stack Developer",
      bio: "BSE Student at OUSL. Passionate about architecting scalable systems and intuitive user interfaces.",
      image: "/hafsa.png" // Put partner image in public folder
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <div className="bg-indigo-700 dark:bg-indigo-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 italic dark:text-white">The Student Connection</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto dark:text-gray-200">
          Built by students, for students. We are simplifying the OUSL academic journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Mission & Identity */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">Who We Are</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
              We are two undergraduate students following the <strong>Bachelor of Software Engineering (BSE)</strong> degree at the Open University of Sri Lanka. 
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Facing the challenges of distance learning ourselves, we realized the need for a centralized, modern dashboard. This project started as a way to solve our own problems and grew into a mission to help the entire OUSL community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-center">
              <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <p className="font-bold text-indigo-900 dark:text-indigo-200 text-sm uppercase">OUSL Based</p>
            </div>
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-center">
              <Code className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <p className="font-bold text-indigo-900 dark:text-indigo-200 text-sm uppercase">BSE Scholars</p>
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet the Developers</h2>
          <div className="flex flex-col md:flex-row justify-center gap-10">
            {team.map((member, index) => (
              <div key={index} className="w-full md:w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-20"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative rounded-full w-40 h-40 object-cover border-4 border-white shadow-sm"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4 italic text-sm">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features / Offering */}
        <div className="bg-gray-900 dark:bg-gray-800 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-10 text-center dark:text-white">What We’re Building</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard title="Peer Connection" desc="Breaking the isolation of distance learning with community rooms." />
            <FeatureCard title="Resource Hub" desc="Quick access to batch-specific academic materials." />
            <FeatureCard title="Progress Tracking" desc="Visualizing your BSE degree path and accomplishments." />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-2xl hover:bg-gray-750 dark:hover:bg-gray-600 transition-colors">
      <div className="w-8 h-1 bg-indigo-500 mb-4 rounded-full"></div>
      <h3 className="font-bold text-lg mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-400 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  );
}