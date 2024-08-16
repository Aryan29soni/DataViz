// src/components/Chatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [database, setDatabase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

 useEffect(()=>{
  scrollToBottom();
 if (isOpen){
  inputRef.current?.focus();
  fetchDatabase();
 } [messages,isOpen]}
);



 const fucntio = async () => {
  


 } 




  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const fetchDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/chatbot/database');
      setDatabase(response.data);
    } catch (error) {
      console.error('Error fetching database:', error);
      setDatabase(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { text: input, user: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/chatbot', { message: input });
      setIsTyping(false);
      const botMessage = { text: response.data.reply, user: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setIsTyping(false);
      const errorMessage = { text: "Sorry, I'm having trouble processing your request.", user: false };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition failed. Please type your query.');
    }
  };



  const message = (text, user ) => {}
  const Message = ({ text, user }) => {
    if (text.startsWith('```') && text.endsWith('```')) {
      return (
        <div className={`message ${user ? 'user' : 'bot'}`}>
          <pre>{text.slice(3, -3)}</pre>
        </div>
      );
    }
    return (
      <div className={`message ${user ? 'user' : 'bot'}`}>
        <div className="message-content">{text}</div>
        <div className="message-time">{new Date().toLocaleTimeString()}</div>
      </div>
    );
  };

  return (
    <>
      <button className="chat-toggle" onClick={toggleChat}>
        <span className="chat-toggle-icon">{isOpen ? '✕' : '💬'}</span>
      </button>
      <div className={`chatbot-container ${isOpen ? 'open' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <div className="chat-controls">
              <button className="control-button" onClick={toggleDarkMode}>
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className="control-button" onClick={toggleChat}>
                ✕
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="loading">Loading your database...</div>
          ) : database ? (
            <>
              <div className="database-info">
                <p>Current database: {database}</p>
              </div>
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <Message key={index} text={msg.text} user={msg.user} />
                ))}
                {isTyping && (
                  <div className="message bot typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="chat-input"
                />
                <button type="button" className={`voice-button ${isListening ? 'listening' : ''}`} onClick={startListening}>
                  🎤
                </button>
                <button type="submit" className="send-button">
                  <span className="send-icon">➤</span>
                </button>
              </form>
            </>
          ) : (
            <div className="no-database">
              <p>No database uploaded. Please upload a database file first.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;