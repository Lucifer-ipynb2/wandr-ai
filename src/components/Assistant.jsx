import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MapPin, Loader } from 'lucide-react';
import { askTravelQuestion } from '../services/openrouter';
import styles from './Assistant.module.css';

const SUGGESTIONS = [
  'What are the visa requirements for Japan?',
  'Best street food in Bangkok to try?',
  'When is the best time to visit Santorini?',
  'Tips for solo travel in Southeast Asia',
  'What currency should I bring to Morocco?',
  'How to get from Paris airport to the city?',
];

export default function Assistant({ apiKey, destination }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello, traveller! ✈️ I'm Wandr, your AI travel companion.\n\nAsk me anything about destinations, visa requirements, local culture, food recommendations, packing tips, or anything travel-related. I'm here to help you plan the perfect journey!`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isTyping) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const reply = await askTravelQuestion(msg, destination, apiKey);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please check your API key and try again.`,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            <Sparkles size={18} strokeWidth={1.5} />
          </div>
          <div className={styles.status} />
        </div>
        <div>
          <h2 className={styles.title}>Wandr AI Assistant</h2>
          <p className={styles.subtitle}>
            {destination ? (
              <span className={styles.destPill}><MapPin size={10} />{destination}</span>
            ) : 'Ask me anything about travel'}
          </p>
        </div>
        <div className={styles.model}>GPT-4o</div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className={styles.suggestions}>
          <p className={styles.suggestLabel}>Try asking:</p>
          <div className={styles.suggestGrid}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className={styles.suggestBtn}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.msgWrap} ${msg.role === 'user' ? styles.userWrap : styles.aiWrap}`}
          >
            {msg.role === 'assistant' && (
              <div className={styles.aiAvatar}>
                <Sparkles size={13} strokeWidth={1.5} />
              </div>
            )}
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble} ${msg.isError ? styles.errorBubble : ''}`}>
              <p className={styles.msgText}>{msg.content}</p>
              <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
            </div>
            {msg.role === 'user' && (
              <div className={styles.userAvatar}>
                <User size={13} strokeWidth={1.5} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.msgWrap} ${styles.aiWrap}`}>
            <div className={styles.aiAvatar}>
              <Sparkles size={13} strokeWidth={1.5} />
            </div>
            <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typingBubble}`}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrap}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Ask about visas, food, culture, tips..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={isTyping}
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? <Loader size={16} className={styles.spinning} /> : <Send size={16} />}
          </button>
        </div>
        <p className={styles.inputHint}>Press Enter to send</p>
      </div>
    </div>
  );
}
