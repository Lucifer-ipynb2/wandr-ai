import React, { useState } from 'react';
import { Key, ExternalLink, Eye, EyeOff, Shield } from 'lucide-react';
import styles from './ApiKeyModal.module.css';

export default function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-or-')) {
      setError('OpenRouter keys start with "sk-or-". Please check your key.');
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <Key size={24} strokeWidth={1.5} />
        </div>
        <h2 className={styles.title}>Connect Your AI</h2>
        <p className={styles.subtitle}>
          Enter your OpenRouter API key to unlock AI-powered travel planning with GPT-4o.
        </p>

        <div className={styles.infoBox}>
          <Shield size={14} />
          <span>Your key is stored locally in your browser and never sent to our servers.</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrap}>
            <input
              type={show ? 'text' : 'password'}
              placeholder="sk-or-v1-..."
              value={key}
              onChange={e => { setKey(e.target.value); setError(''); }}
              className={styles.input}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShow(!show)}
              tabIndex={-1}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={!key.trim()}>
            Start Planning
          </button>
        </form>

        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Get a free API key at OpenRouter
          <ExternalLink size={12} />
        </a>

        <div className={styles.models}>
          <span className={styles.modelsLabel}>Powered by</span>
          <span className={styles.modelPill}>GPT-4o</span>
          <span className={styles.modelPill}>via OpenRouter</span>
        </div>
      </div>
    </div>
  );
}
