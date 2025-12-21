import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from '../utils/api';
import { Send, ChevronLeft, Info } from 'lucide-react';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const userRes = await axios.get(`/api/users/${id}`);
        setRecipient(userRes.data);
        const chatRes = await axios.get(`/api/chat/${id}`);
        setMessages(chatRes.data);
      } catch (err) {
        console.error("Error loading chat", err);
      } finally {
        setLoadingChat(false);
      }
    };
    if (user) fetchChatData();
  }, [id, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post('/api/chat', { receiverId: id, text: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center font-bold">Verifying OUSL Student...</div>;
  if (!user) return <div className="text-center mt-20">Please log in.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center space-x-3 shadow-sm">
        <button onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          {recipient?.avatar ? <img src={recipient.avatar} className="rounded-full object-cover w-full h-full" alt="" /> : recipient?.firstName?.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-gray-900">{recipient?.firstName} {recipient?.lastName}</h2>
          <p className="text-xs text-gray-500">{recipient?.degreeProgram}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`} >
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${msg.sender === user?._id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className="text-[9px] mt-1 opacity-70 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full shadow-lg"><Send size={20} /></button>
      </form>
    </div>
  );
};

export default Chat;