import React, { useState } from 'react';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const mockConversations = [
  {
    id: 'u1',
    name: 'Ramesh Bhai',
    lastMessage: 'Thank you for the meal!',
    unread: 2,
    messages: [
      { fromChef: false, text: 'Hello Chef!', time: '10:30 AM' },
      { fromChef: false, text: 'Thank you for the meal!', time: '10:35 AM' },
      { fromChef: true, text: 'Glad you liked it 😊', time: '10:40 AM' },
    ],
  },
  {
    id: 'u2',
    name: 'Sneha',
    lastMessage: 'When will my order arrive?',
    unread: 0,
    messages: [
      { fromChef: false, text: 'When will my order arrive?', time: '9:20 AM' },
      { fromChef: true, text: 'Reaching in 10 mins!', time: '9:23 AM' },
    ],
  },
];

const ChefMessages = () => {
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const updated = {
      ...selectedChat,
      messages: [...selectedChat.messages, { fromChef: true, text: newMessage, time: 'Now' }],
    };
    setSelectedChat(updated);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-80px)] max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg border border-orange-200 bg-white">
      
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4 bg-orange-50 overflow-y-auto">
        <h2 className="text-xl font-bold text-orange-600 mb-4">💬 Messages</h2>
        {mockConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedChat(conv)}
            className={`cursor-pointer px-4 py-2 rounded-lg mb-2 ${
              selectedChat.id === conv.id ? 'bg-orange-100' : 'hover:bg-orange-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">{conv.name}</p>
              {conv.unread > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {conv.unread}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col">
        <div className="border-b p-4 bg-white flex items-center gap-3">
          <FaUserCircle className="text-2xl text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-700">{selectedChat.name}</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {selectedChat.messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs p-3 rounded-lg shadow-sm text-sm ${
                msg.fromChef
                  ? 'ml-auto bg-orange-100 text-gray-800'
                  : 'mr-auto bg-white border text-gray-700'
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-xs text-right text-gray-400 mt-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t bg-white flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:border-orange-400"
          />
          <button
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChefMessages;
