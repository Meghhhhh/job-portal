import { useState } from 'react';

function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
  
    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ prompt: input })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Log the API response
  
      // Make sure the correct field is being accessed
      const botResponse = data.result || data.response || "No response from chatbot";
  
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setMessages([...newMessages, { text: 'Error getting response from chatbot.', sender: 'bot' }]);
    }
  };
 

  return (
    <div className="fixed bottom-16 right-4 bg-white w-[30rem] h-[30rem] shadow-lg border border-gray-300 rounded-lg flex flex-col">
      <div className="p-4 bg-purple-600 text-white text-center text-xl font-bold">Chatbot</div>
      <div className="flex-1 overflow-y-auto p-4 text-black">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 my-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-300 text-right' : 'bg-gray-200 text-left'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border border-gray-400 rounded-lg bg-white text-black"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-4 px-5 bg-purple-600 text-white rounded-lg">Send</button>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-2xl">✖</button>
    </div>
  );
}

export default ChatModal;