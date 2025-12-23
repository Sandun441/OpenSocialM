// src/pages/Events.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('7');

  // State for ADD Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'Academic',
  });

  // State for DELETE Modal
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    eventId: null,
    eventTitle: '',
  });

  // 1. Initial Mock Data
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        title: 'Chemistry Mid-term',
        start: '2025-12-25',
        category: 'Exam',
        backgroundColor: '#ef4444',
      },
      {
        id: '2',
        title: 'Batch Trip Meeting',
        start: '2025-12-28',
        category: 'Batch',
        backgroundColor: '#3b82f6',
      },
      {
        id: '3',
        title: 'Guest Lecture: AI',
        start: '2025-12-30',
        category: 'Academic',
        backgroundColor: '#10b981',
      },
    ];
    setEvents(mockEvents);
  }, []);

  // 2. Timeline Filter Logic
  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates accurately

    const futureDate = new Date();

    if (filter === '7') futureDate.setDate(today.getDate() + 7);
    else if (filter === '30') futureDate.setDate(today.getDate() + 30);
    else futureDate.setFullYear(today.getFullYear() + 1);

    return events
      .filter((e) => {
        const eventDate = new Date(e.start);
        return eventDate >= today && eventDate <= futureDate;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  // 3. Helper: Calculate Days Left
  const getDaysLeft = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();

    // Reset time parts to ensure accurate day calculation
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `${diffDays} days left`;
  };

  // 4. Add Event Logic
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const colorMap = { Exam: '#ef4444', Batch: '#3b82f6', Academic: '#10b981' };

    const savedEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: newEvent.date,
      category: newEvent.category,
      backgroundColor: colorMap[newEvent.category] || '#3b82f6',
    };

    setEvents([...events, savedEvent]);
    setShowAddModal(false);
    setNewEvent({ title: '', date: '', category: 'Academic' });
  };

  // 5. Confirm Delete Logic
  const confirmDelete = () => {
    setEvents(events.filter((e) => e.id !== deleteModal.eventId));
    setDeleteModal({ show: false, eventId: null, eventTitle: '' });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* --- SECTION 1: TIMELINE --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Timeline</h2>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="border p-2 rounded-lg text-sm bg-gray-50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="7">Next 7 days</option>
            <option value="30">Next 30 days</option>
            <option value="all">All upcoming</option>
          </select>
          <input
            type="text"
            placeholder="Search events..."
            className="border p-2 rounded-lg text-sm bg-gray-50 flex-grow"
          />
        </div>

        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const daysText = getDaysLeft(event.start);
              const isUrgent =
                daysText === 'Today' ||
                daysText === 'Tomorrow' ||
                parseInt(daysText) <= 3;

              return (
                <div
                  key={event.id}
                  className="flex items-center p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                >
                  {/* Left: Date Box */}
                  <div className="w-12 text-center mr-4">
                    <div className="text-xs text-gray-500 uppercase font-bold">
                      {new Date(event.start).toLocaleString('default', {
                        month: 'short',
                      })}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {new Date(event.start).getDate()}
                    </div>
                  </div>

                  {/* Middle: Title & Tag */}
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {event.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white`}
                      style={{ backgroundColor: event.backgroundColor }}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Right: Days Left Countdown */}
                  <div
                    className={`ml-auto text-sm font-medium ${
                      isUrgent ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {daysText}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📋</div>
              <p>No activities require action</p>
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION 2: CALENDAR --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
          >
            <span>+</span> New event
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          💡 Tip: Right-click an event to delete it.
        </p>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          events={events}
          height="auto"
          contentHeight="600px"
          aspectRatio={1.5}
          // Custom Right Click
          eventDidMount={(info) => {
            info.el.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              setDeleteModal({
                show: true,
                eventId: info.event.id,
                eventTitle: info.event.title,
              });
            });
          }}
        />
      </div>

      {/* --- MODAL 1: ADD EVENT --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Add New Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEvent.category}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, category: e.target.value })
                  }
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Batch">Batch Community</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CONFIRM DELETE --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
            <div className="text-red-500 text-5xl mb-2">🗑️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Event?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete <br />
              <span className="font-semibold text-gray-800">
                "{deleteModal.eventTitle}"
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setDeleteModal({ show: false, eventId: null, eventTitle: '' })
                }
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
