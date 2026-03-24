import React from 'react';
import { GraduationCap, Code } from 'lucide-react'; 

export default function AboutUs() {
  const team = [
    {
      name: "Sandun Liyanage", 
      role: "Full-Stack Developer",
      bio: "Software Engineering Undergraduate. Focused on bridging the gap between student needs and digital solutions.",
      image: "/sandun.jpg" 
    },
    {
      name: "Hafsa Zinthikar", 
      role: "Full-Stack Developer",
      bio: "Software Engineering Undergraduate. Passionate about architecting scalable systems and intuitive user interfaces.",
      image: "/hafsa.png" 
    }
  ];

  return (
    // 1. FULL PAGE WRAPPER & FONT: Lato font and global background
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-['Lato'] transition-colors duration-300 pb-20">
      
      {/* 2. HERO SECTION (Matches Login/Register Gradient) */}
      <div className="relative bg-gradient-to-br from-[#1A237E] to-[#3949AB] dark:from-indigo-900 dark:to-slate-900 py-24 px-6 text-center text-white overflow-hidden shadow-lg">
        {/* Abstract circles decoration */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-white opacity-5 animate-pulse"></div>
        <div className="absolute bottom-[-20px] right-[-20px] w-60 h-60 rounded-full bg-white opacity-5"></div>
        
        <div className="relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-4 tracking-tight drop-shadow-md">
            OpenSocialM
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 font-light max-w-2xl mx-auto tracking-wide">
            Built by students, for students. We are simplifying the academic journey.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 animate-fade-in-up">
        
        {/* Mission & Identity */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white mb-6 tracking-tight">
              Who We Are
            </h2>
            <div className="w-16 h-1 bg-indigo-500 mb-8 rounded-full"></div>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6 font-medium">
              We are two undergraduate students following the <strong>Bachelor of Software Engineering</strong> degree program at <strong>Open university of Sri Lanka</strong>. 
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
              Facing the challenges of distance learning ourselves, we realized the need for a centralized, modern dashboard. This project started as a way to solve our own problems and grew into a mission to help the entire university community connect and thrive.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-white dark:bg-slate-800 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center h-48">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4">
                <GraduationCap className="w-10 h-10 text-[#1A237E] dark:text-indigo-400" />
              </div>
              <p className="font-bold text-slate-800 dark:text-white tracking-wider uppercase text-sm">Student Built</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-800 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center h-48 translate-y-8">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4">
                <Code className="w-10 h-10 text-[#1A237E] dark:text-indigo-400" />
              </div>
              <p className="font-bold text-slate-800 dark:text-white tracking-wider uppercase text-sm">SE Scholars</p>
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-[#1A237E] dark:text-white tracking-tight mb-4">
              Meet the Developers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">The team behind OpenSocialM</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-12">
            {team.map((member, index) => (
              <div key={index} className="w-full md:w-96 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative rounded-full w-40 h-40 object-cover border-[6px] border-white dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-bold font-['Playfair_Display'] text-slate-900 dark:text-white mb-2 group-hover:text-[#1A237E] dark:group-hover:text-indigo-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-6 tracking-wider uppercase text-xs">
                  {member.role}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features / Offering */}
        <div className="bg-[#1A237E] dark:bg-slate-800 rounded-[32px] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-12 text-center text-white tracking-tight">
              What We're Building
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard title="Peer Connection" desc="Breaking the isolation of distance learning with dedicated community rooms." />
              <FeatureCard title="Resource Hub" desc="Quick access to batch-specific academic materials and announcements." />
              <FeatureCard title="Progress Tracking" desc="Visualizing your degree path and celebrating academic accomplishments." />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white/10 dark:bg-slate-700/50 backdrop-blur-md p-8 rounded-[24px] hover:bg-white/20 dark:hover:bg-slate-700 transition-colors border border-white/10 dark:border-slate-600 group">
      <div className="w-10 h-1 bg-blue-400 mb-6 rounded-full group-hover:w-16 transition-all duration-300"></div>
      <h3 className="font-bold font-['Playfair_Display'] text-xl mb-3 text-white tracking-wide">{title}</h3>
      <p className="text-indigo-100 dark:text-slate-300 text-sm leading-relaxed font-light">{desc}</p>
    </div>
  );
}