import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { FiMessageSquare, FiX, FiSend, FiMic } from 'react-icons/fi';
import { useProducts } from '../context/ProductContext';

const Markdown = ({ content }) => {
    const html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*?)(?:\n|$)/g, '<li>$1</li>')
        .replace(/(\n)/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!<li>)/g, '</li></ul>') }} />;
};

const Chatbot = () => {
  const { products } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm FreshBot. How can I help you find the best produce today? \n\nTry asking: 'I want 10kg tomatoes' or 'show me onions by price'."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    setIsLoading(true);
    
    const productDatabase = JSON.stringify(products.map(p => ({
        id: p.id, name: p.name, price: p.price, category: p.category, stock: p.stock
    })), null, 2);

    const prompt = `
        You are FreshLink's friendly shopping assistant chatbot. Your task is to respond to user queries about buying ingredients based ONLY on the provided data.
        You have access to the following LIVE product data in JSON format:
        ${productDatabase}
        User query: "${userMessage}"
    `;

    // --- The Fix: Call our own backend instead of Google's API ---
    const backendApiUrl = 'https://freshlink-g6tl.onrender.com';

    try {
        const response = await fetch(backendApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }) // Send the prompt in the request body
        });

        const result = await response.json();

        if (!response.ok) {
            // Use the specific error message from our backend
            return `I encountered an error: ${result.message}`;
        }
        
        return result.reply; // Get the reply from our backend's response

    } catch (error) {
        console.error("Error calling our backend:", error);
        return "I can't connect to the server right now. Please make sure it's running.";
    } finally {
        setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');

    const botResponse = await getBotResponse(userMessage);
    setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.botInfo}>
              <div className={styles.botAvatar}><FiMessageSquare /></div>
              <div>
                <div className={styles.botName}>FreshBot</div>
                <div className={styles.botStatus}>Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}><FiX /></button>
          </div>
          <div className={styles.chatMessages} ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                <Markdown content={msg.text} />
              </div>
            ))}
            {isLoading && <div className={styles.loadingIndicator}>FreshBot is thinking...</div>}
          </div>
          <div className={styles.chatFooter}>
            <FiMic className={styles.micIcon} />
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className={styles.sendBtn} onClick={handleSend}><FiSend /></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={styles.chatButton}>
        {isOpen ? <FiX /> : <FiMessageSquare />}
      </button>
    </div>
  );
};

export default Chatbot;
