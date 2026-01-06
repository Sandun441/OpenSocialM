import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <--- NEW: For navigation

const EventsCalendar = () => {
  const navigate = useNavigate(); // <--- NEW: Hook for navigation
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // <--- NEW: For viewing details
  const [deleteModal, setDeleteModal] = useState({ show: false, eventId: null, eventTitle: '' });

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    type: 'Lecture',
    faculty: 'Engineering',
    degree: 'Software Engineering'
  });

  // --- 1. FETCH EVENTS ---
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      const res = await axios.get('http://localhost:5000/api/events', config);

      const formattedEvents = res.data.map((event) => ({
        id: event._id,
        title: event.title,
        start: event.start || event.date,
        allDay: true,
        extendedProps: {
          type: event.type || event.category || 'Event', // Fallback for old data
          faculty: event.faculty || 'General',
          degree: event.degree || 'General',
          
          // ✅ FIXED: Look for 'event.user' OR 'event.createdBy'
          userName: event.user?.name || event.createdBy?.name || 'Unknown',
          userId: event.user?._id || event.createdBy?._id || event.user // Handle object or ID string
        },
        backgroundColor: event.backgroundColor || '#3b82f6',
        borderColor: 'transparent'
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- 2. HANDLERS ---
  
  // NEW: Handle clicking an event on the calendar
  const handleEventClick = (info) => {
    // Populate the modal with the clicked event's data
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      ...info.event.extendedProps // Spreads type, faculty, degree, userName, userId
    });
  };

  // NEW: Handle clicking the profile name
  const handleProfileClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`); // Navigate to profile page
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start) return;
    if (isSaving) return; 

    setIsSaving(true); 
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      const body = {
        title: newEvent.title,
        date: newEvent.start,
        type: newEvent.type,
        faculty: newEvent.faculty,
        degree: newEvent.degree
      };

      await axios.post('http://localhost:5000/api/events', body, config);
      await fetchEvents();
      setShowAddModal(false);
      setNewEvent({ title: '', start: '', type: 'Lecture', faculty: 'Engineering', degree: 'Software Engineering' });
    } catch (err) {
      alert('Failed to save event.');
    } finally {
      setIsSaving(false); 
    }
  };

  const confirmDelete = async () => {
    if (isSaving) return; 
    setIsSaving(true); 
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      await axios.delete(`http://localhost:5000/api/events/${deleteModal.eventId}`, config);
      
      setEvents(events.filter((e) => e.id !== deleteModal.eventId));
      setDeleteModal({ show: false, eventId: null, eventTitle: '' });
      setSelectedEvent(null); // Close detail modal if open
    } catch (err) {
      alert('Failed to delete event. (Are you the creator?)');
    } finally {
      setIsSaving(false); 
    }
  };

  // --- FILTER LOGIC (Timeline) ---
  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    
    if (filter === '7') futureDate.setDate(today.getDate() + 7);
    else if (filter === '30') futureDate.setDate(today.getDate() + 30);
    else futureDate.setFullYear(today.getFullYear() + 1);

    return events.filter((e) => {
      const eventDate = new Date(e.start);
      const matchesDate = eventDate >= today && eventDate <= futureDate;
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const getDaysLeft = (dateString) => {
    const diff = new Date(dateString) - new Date().setHours(0,0,0,0);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days left`;
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="container mx-auto max-w-6xl">
        <style>{`
          .dark .fc-theme-standard td, .dark .fc-theme-standard th { background-color: #1f2937; border-color: #374151; }
          .dark .fc-toolbar-title, .dark .fc-col-header-cell-cushion, .dark .fc-daygrid-day-number { color: white; }
          .dark .fc-button-primary { background-color: #3b82f6; border-color: #3b82f6; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        `}</style>

        {/* --- TIMELINE --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <div className="flex flex-wrap gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mr-auto">Timeline</h2>
            <select className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none" 
              value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="7">Next 7 days</option>
              <option value="30">Next 30 days</option>
              <option value="all">All upcoming</option>
            </select>
            <input type="text" placeholder="Search events..." className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} onClick={() => setSelectedEvent({ ...event, ...event.extendedProps, start: event.start })} 
                  className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-lg cursor-pointer">
                  <div className="w-12 text-center mr-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{new Date(event.start).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-lg font-bold text-gray-800 dark:text-white">{new Date(event.start).getDate()}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{event.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: event.backgroundColor }}>{event.extendedProps.type}</span>
                  </div>
                  <div className="ml-auto text-right text-sm font-bold text-gray-500 dark:text-gray-400">{getDaysLeft(event.start)}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No events found</div>
            )}
          </div>
        </div>

        {/* --- CALENDAR --- */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar</h2>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">+ New event</button>
          </div>

          <div className="dark:text-gray-100">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
              events={events}
              height="auto"
              contentHeight="600px"
              aspectRatio={1.5}
              eventClick={handleEventClick} // <--- CLICK HANDLER
              eventDidMount={(info) => {
                info.el.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                  setDeleteModal({ show: true, eventId: info.event.id, eventTitle: info.event.title });
                });
              }}
            />
          </div>
        </div>

        {/* --- MODAL: EVENT DETAILS (NEW) --- */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-gray-700 animate-fade-in-up relative">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><span className="text-xl">×</span></button>
              
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider`} 
                  style={{ backgroundColor: selectedEvent.type === 'Exam' ? '#ef4444' : selectedEvent.type === 'Deadline' ? '#f97316' : '#3b82f6' }}>
                  {selectedEvent.type}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-3 mb-1">{selectedEvent.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {new Date(selectedEvent.start).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Faculty</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedEvent.faculty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Degree</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedEvent.degree}</span>
                </div>
                
                {/* --- PROFILE LINK --- */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Posted by</span>
                  <button 
                    onClick={() => handleProfileClick(selectedEvent.userId)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    <span>{selectedEvent.userName}</span>
                    <span className="text-xs">↗</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                 <button onClick={() => { setDeleteModal({ show: true, eventId: selectedEvent.id, eventTitle: selectedEvent.title }); setSelectedEvent(null); }} 
                   className="flex-1 py-2 text-red-500 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-bold transition">
                   Delete
                 </button>
                 <button onClick={() => setSelectedEvent(null)} 
                   className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                   Close
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL: ADD EVENT --- */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Event</h3>
              <form onSubmit={handleAddEvent}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input type="text" required className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" 
                    value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" required className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none" 
                    value={newEvent.start} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Type</label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                      value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                      <option>Lecture</option><option>Exam</option><option>Deadline</option><option>Activity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Faculty</label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                      value={newEvent.faculty} onChange={(e) => setNewEvent({ ...newEvent, faculty: e.target.value })}>
                      <option>Engineering</option><option>Science</option><option>Humanities</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                    value={newEvent.degree} onChange={(e) => setNewEvent({ ...newEvent, degree: e.target.value })}>
                    <option>Software Engineering</option><option>Computer Science</option><option>Civil Engineering</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">{isSaving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: DELETE CONFIRM --- */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80 text-center border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <div className="text-red-500 text-5xl mb-2">🗑️</div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Delete Event?</h3>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={() => setDeleteModal({ show: false, eventId: null, eventTitle: '' })} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">No</button>
                <button onClick={confirmDelete} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default EventsCalendar;