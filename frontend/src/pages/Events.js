// src/pages/Events.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('7');
  const [searchTerm, setSearchTerm] = useState('');

  // Loading State to prevent double-clicks
  const [isSaving, setIsSaving] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'Academic',
  });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    eventId: null,
    eventTitle: '',
  });

  // --- 1. FETCH EVENTS ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get('http://localhost:5000/api/events', config);

        const formattedEvents = res.data.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.start,
          allDay: true, // <--- FIX 1: Hides the "5:30" time
          category: event.category,
          backgroundColor: event.backgroundColor,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching events:', err.message);
      }
    };

    fetchEvents();
  }, []);

  // --- 2. FILTER LOGIC ---
  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date();
    if (filter === '7') futureDate.setDate(today.getDate() + 7);
    else if (filter === '30') futureDate.setDate(today.getDate() + 30);
    else futureDate.setFullYear(today.getFullYear() + 1);

    return events
      .filter((e) => {
        const eventDate = new Date(e.start);
        const matchesDate = eventDate >= today && eventDate <= futureDate;
        const matchesSearch =
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.category.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDate && matchesSearch;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  // --- 3. HELPER: DAYS LEFT ---
  const getDaysLeft = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `${diffDays} days left`;
  };

  // --- 4. SAVE EVENT (With Anti-Double-Click) ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    if (isSaving) return; // Prevent double click

    setIsSaving(true); // Disable button

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const body = {
        title: newEvent.title,
        date: newEvent.date,
        category: newEvent.category,
      };

      const res = await axios.post(
        'http://localhost:5000/api/events',
        body,
        config
      );

      const savedEvent = {
        id: res.data._id,
        title: res.data.title,
        start: res.data.start,
        allDay: true, // <--- FIX 1: Ensure new events are also all-day
        category: res.data.category,
        backgroundColor: res.data.backgroundColor,
      };

      setEvents([...events, savedEvent]);
      setShowAddModal(false);
      setNewEvent({ title: '', date: '', category: 'Academic' });
    } catch (err) {
      console.error('Error saving event:', err.message);
      alert('Failed to save event.');
    } finally {
      setIsSaving(false); // Re-enable button
    }
  };

  // --- 5. DELETE EVENT (With Anti-Double-Click) ---
  const confirmDelete = async () => {
    if (isSaving) return; // Prevent double click
    setIsSaving(true); // Disable button

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(
        `http://localhost:5000/api/events/${deleteModal.eventId}`,
        config
      );

      setEvents(events.filter((e) => e.id !== deleteModal.eventId));
      setDeleteModal({ show: false, eventId: null, eventTitle: '' });
    } catch (err) {
      console.error('Error deleting event:', err.message);
      alert('Failed to delete event.');
    } finally {
      setIsSaving(false); // Re-enable button
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="container mx-auto max-w-6xl">
        <style>{`
          @keyframes slideFade {
            0% { opacity: 0; transform: translateX(-20px); }
            10% { opacity: 1; transform: translateX(0); }
            80% { opacity: 1; transform: translateX(0); }
            90% { opacity: 0; transform: translateX(10px); }
            100% { opacity: 0; transform: translateX(10px); }
          }
          .animate-tip {
            animation: slideFade 6s infinite ease-in-out;
          }
          .dark .fc-theme-standard td, 
          .dark .fc-theme-standard th,
          .dark .fc-theme-standard .fc-scrollgrid { 
            background-color: #1f2937; 
            border-color: #374151; 
          }
          .dark .fc-col-header-cell-cushion, 
          .dark .fc-daygrid-day-number { 
            color: #e5e7eb; 
          }
          .dark .fc-toolbar-title { color: white; }
          .dark .fc-button-primary { 
            background-color: #3b82f6; 
            border-color: #3b82f6; 
          }
          .dark .fc-button-active { 
            background-color: #2563eb !important; 
            border-color: #2563eb !important; 
          }
        `}</style>

        {/* --- TIMELINE SECTION --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Timeline
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <select
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white flex-grow focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-lg"
                  >
                    <div className="w-12 text-center mr-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                        {new Date(event.start).toLocaleString('default', {
                          month: 'short',
                        })}
                      </div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {new Date(event.start).getDate()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {event.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full text-white font-medium`}
                        style={{ backgroundColor: event.backgroundColor }}
                      >
                        {event.category}
                      </span>
                    </div>
                    <div
                      className={`ml-auto text-sm font-bold ${
                        isUrgent
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {daysText}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>
                  {searchTerm
                    ? 'No matching events found'
                    : 'No activities require action'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- CALENDAR SECTION --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 relative transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Calendar
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
            >
              <span>+</span> New event
            </button>
          </div>

          <div className="h-6 mb-4 overflow-hidden">
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-tip flex items-center gap-2">
              <span>💡</span> Tip: Right-click an event to delete it.
            </p>
          </div>

          <div className="dark:text-gray-100">
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
        </div>

        {/* --- MODAL 1: ADD EVENT --- */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Event
              </h3>
              <form onSubmit={handleAddEvent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    disabled={isSaving} // FIX 2: Disable during save
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving} // FIX 2: Disable during save
                    className={`px-4 py-2 text-white rounded transition-colors shadow-md ${
                      isSaving
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 2: CONFIRM DELETE --- */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-center border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <div className="text-red-500 dark:text-red-400 text-5xl mb-2">
                🗑️
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                Delete Event?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                Are you sure you want to delete <br />
                <span className="font-semibold text-gray-900 dark:text-white">
                  "{deleteModal.eventTitle}"
                </span>
                ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    setDeleteModal({
                      show: false,
                      eventId: null,
                      eventTitle: '',
                    })
                  }
                  disabled={isSaving}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors disabled:opacity-50"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSaving}
                  className={`px-6 py-2 text-white rounded-lg font-medium transition-colors shadow-md ${
                    isSaving
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700'
                  }`}
                >
                  {isSaving ? 'Deleting...' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
