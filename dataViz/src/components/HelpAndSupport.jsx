import React, { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import './HelpAndSupport.css';

const HelpAndSupport = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/send-support-email', { email, subject, message });
      toast.success('Support message sent successfully!');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending support email:', error);
      toast.error('Failed to send support message. Please try again.');
    }
  };

  const faqData = [
    {
      question: "How do I upload a file?",
      answer: "To upload a file, go to the home page and click on the 'Upload' button. Select the file you want to upload and click 'Submit'."
    },
    {
      question: "What file types are supported?",
      answer: "We support CSV, Excel, PDF, .sql extension files and Word documents. Make sure your file is in one of these formats before uploading."
    },
    {
      question: "How can I generate a Dashboard?",
      answer: "After uploading your file, go to the 'Databases' section. Select the file you want to generate a report for and click 'Generate Dashboard'."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All uploaded files and generated reports are encrypted and stored securely."
    },
    
  ];

  return (
    <div className="help-and-support">
      <h2>Help and Support</h2>
      <div className="support-content">
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
              >
                {faq.question}
              </div>
              {activeQuestion === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
        <div className="contact-form">
          <h3>Contact Us</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="send-button">➤</button>
          </form>
        </div>
      </div>
      <div className="contact-info">
        <p>If you need immediate assistance, please email us at <a>yoyoaryansoni@gmail.com</a></p>
        <p>We will respond as soon as possible!.</p>
      </div>
    </div>
  );
};

export default HelpAndSupport;