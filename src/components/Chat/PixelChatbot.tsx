import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';


export const PixelChatbot: React.FC = () => {
    const { user, assets } = useGame();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; sender: 'bot' | 'user' }[]>([
        { text: `Greetings, ${user.name}! I am the Oracle. Ask me about your treasures.`, sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        // Add User Message
        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInputText('');

        // Simulate Bot Response (Mock Logic)
        setTimeout(() => {
            let botResponse = "The mists are thick... I cannot see that clearly yet.";

            const lowerMsg = userMsg.toLowerCase();
            if (lowerMsg.includes('bitcoin') || lowerMsg.includes('btc')) {
                const btc = assets.find(a => a.symbol === 'BTC');
                if (btc) botResponse = `Ah, Bitcoin! It trades at ${btc.price}. A fine digital artifact.`;
                else botResponse = "You do not possess Bitcoin in your inventory yet.";
            } else if (lowerMsg.includes('price')) {
                botResponse = "Prices fluctuate like the tides. Red means danger, Green means loot!";
            } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                botResponse = `Hail, ${user.name}!`;
            }

            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        }, 800);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '600px',
            padding: '0 16px',
            zIndex: 100,
            pointerEvents: 'none' // Allow clicking through empty space
        }}>
            {/* Bot Avatar / Toggle */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="animate-float"
                style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-ui-bg)',
                    border: '4px solid var(--color-ui-border)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    position: 'absolute',
                    bottom: isOpen ? '320px' : '16px',
                    right: '16px',
                    transition: 'bottom 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                }}
            >
                🧙‍♂️
            </div>

            {/* Chat Window */}
            <div style={{
                backgroundColor: 'var(--color-ui-bg)',
                border: '4px solid var(--color-ui-border)',
                borderBottom: 'none',
                height: '300px',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                display: isOpen ? 'flex' : 'none',
                flexDirection: 'column',
                pointerEvents: 'auto',
                boxShadow: '0px -4px 20px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '8px',
                    backgroundColor: 'var(--color-ui-border)',
                    color: 'var(--color-ui-bg)',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                }}>
                    The Oracle
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === 'user' ? '#fff' : 'var(--color-bg)',
                            color: msg.sender === 'user' ? '#000' : '#fff',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            maxWidth: '80%',
                            fontSize: '0.8rem',
                            border: '2px solid var(--color-ui-border)',
                            position: 'relative'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    padding: '8px',
                    borderTop: '4px solid var(--color-ui-border)',
                    display: 'flex',
                    gap: '8px'
                }}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask the Oracle..."
                        style={{ flex: 1 }}
                    />
                    <button onClick={handleSend} style={{ padding: '8px' }}>Send</button>
                </div>
            </div>
        </div>
    );
};
