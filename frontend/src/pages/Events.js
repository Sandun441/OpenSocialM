// src/pages/Events.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Events = () => {
  const [events, setEvents] = useState([]);

  // Mock Data (Temporary for testing)
  const mockEvents = [
    {
      id: 1,
      title: 'Chemistry Mid-term',
      start: '2025-12-25',
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
    },
    {
      id: 2,
      title: 'Batch Trip Meeting',
      start: '2025-12-28T14:00:00',
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    {
      id: 3,
      title: 'Guest Lecture: AI',
      start: '2025-12-30',
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    },
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Events & Calendar
          </h1>
          <p className="text-gray-600 mt-2">
            View upcoming academic schedules and university events.
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-sm hidden md:flex">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Exams
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Batch
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Academic
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          height="auto"
          contentHeight="600px"
          aspectRatio={1.5}
          eventClick={(info) => {
            alert(`Event: ${info.event.title}`);
          }}
        />
      </div>
    </div>
  );
};

export default Events;
