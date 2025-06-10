import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 text-center">About Us</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          At OUSL Student Dashboard, our mission is to empower students at the Open University of Sri Lanka
          by providing an intuitive, all-in-one platform to access academic resources, communicate with peers, and stay updated on university events.
          We believe in fostering a collaborative and supportive student community.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
          <li>Personalized Profile Management</li>
          <li>Faculty Announcements & Event Calendars</li>
          <li>Batch Community Chat Rooms</li>
          <li>Discussion Forums for Peer Support</li>
          <li>Academic Progress Tracking</li>
          <li>And much more...</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Meet The Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Example team member */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="Team member"
              className="rounded-full w-32 h-32 mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900">Sandun Liyanage</h3>
            <p className="text-indigo-600 font-medium mb-2">Lead Developer</p>
            <p className="text-gray-600 text-center">
              Passionate about building great user experiences and connecting students through technology.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/150?img=15"
              alt="Team member"
              className="rounded-full w-32 h-32 mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900">Sandun Liyanage</h3>
            <p className="text-indigo-600 font-medium mb-2">UI/UX Designer</p>
            <p className="text-gray-600 text-center">
              Dedicated to crafting intuitive interfaces and seamless design flows for users.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/150?img=56"
              alt="Team member"
              className="rounded-full w-32 h-32 mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900">Sandun Liyanage</h3>
            <p className="text-indigo-600 font-medium mb-2">Backend Engineer</p>
            <p className="text-gray-600 text-center">
              Ensures the platform runs smoothly and securely with robust backend infrastructure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
