import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { FiMessageSquare, FiX, FiSend, FiMic } from 'react-icons/fi';
import { useProducts } from '../context/ProductContext'; // Assuming this context provides products

const Markdown = ({ content }) => {
    // This component renders markdown-like text into HTML
    const html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\* (.*?)(?:\n|$)/g, '<li>$1</li>') // List items
        .replace(/(\n)/g, '<br />'); // New lines to <br />
    // Basic conversion for lists - might need more robust markdown parser for complex cases
    return <div dangerouslySetInnerHTML={{ __html: html.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!<li>)/g, '</li></ul>') }} />;
};

const Chatbot = () => {
    const { products } = useProducts(); // Get products from context
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

    // Scroll to the bottom of the chat window when new messages arrive
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    // Function to send user query to the backend and get bot response
    const getBotResponse = async (userMessage) => {
        setIsLoading(true);

        // Prepare the product database for the prompt
        const productDatabase = JSON.stringify(products.map(p => ({
            id: p.id, name: p.name, price: p.price, category: p.category, stock: p.stock
        })), null, 2);

        // Construct the prompt for the chatbot
        const prompt = `
            You are FreshLink's friendly shopping assistant chatbot. Your task is to respond to user queries about buying ingredients based ONLY on the provided data.
            You have access to the following LIVE product data in JSON format:
            ${productDatabase}
            User query: "${userMessage}"
        `;

        // --- The Fix: Call our own backend using the environment variable ---
        // Get the full backend URL from the Vercel Environment Variable
        const backendApiUrl = import.meta.env.VITE_API_URL;
        // Construct the full endpoint URL for the chatbot query
        const chatbotEndpoint = `${backendApiUrl}/api/chatbot/query`; // Matches backend/routes/chatbotRoutes.js

        try {
            const response = await fetch(chatbotEndpoint, { // Use the correct endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }) // Send the prompt in the request body
            });

            const result = await response.json();

            if (!response.ok) {
                // Use the specific error message from our backend if available
                return `I encountered an error: ${result.message || 'Something went wrong on the server.'}`;
            }

            return result.reply; // Get the reply from our backend's response

        } catch (error) {
            console.error("Error calling backend chatbot API:", error);
            // Provide a user-friendly error message
            return "I can't connect to the server right now. Please make sure it's running and try again later.";
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for sending a message
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
