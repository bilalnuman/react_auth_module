import React, { useState } from 'react';
import styles from './Chatbot.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        // try {
        //     const response = await axios.post('http://localhost:5000/api/chat', {
        //         message: input,
        //     });

        //     const botMessage: Message = {
        //         role: 'assistant',
        //         content: response.data.reply,
        //     };
        //     setMessages((prev) => [...prev, botMessage]);
        // } catch (error) {
        //     console.error(error);
        //     const errorMessage: Message = {
        //         role: 'assistant',
        //         content: '⚠️ Error fetching response.',
        //     };
        //     setMessages((prev) => [...prev, errorMessage]);
        // }
    };

    return (
        <div className={styles.container}>
            <div className={styles.chatWindow}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage
                            }`}
                    >
                        <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className={`${styles.inputField}`}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} className={`${styles.sendButton} ${!input ? styles.disabled : ''}`}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
