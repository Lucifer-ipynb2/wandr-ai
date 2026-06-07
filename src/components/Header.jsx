import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ currentView, onNavigate }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button className={styles.logo} onClick={() => onNavigate('home')}>
          <div className={styles.logoIcon}>
            <Compass size={18} strokeWidth={1.5} />
          </div>
          <span className={styles.logoText}>Wandr</span>
          <span className={styles.logoBadge}>
            <Sparkles size={10} />
            AI
          </span>
        </button>

        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${currentView === 'home' ? styles.active : ''}`}
            onClick={() => onNavigate('home')}
          >
            Plan a Trip
          </button>
          <button
            className={`${styles.navBtn} ${currentView === 'itinerary' ? styles.active : ''}`}
            onClick={() => onNavigate('itinerary')}
            disabled={currentView === 'home'}
          >
            Itinerary
          </button>
          <button
            className={`${styles.navBtn} ${currentView === 'assistant' ? styles.active : ''}`}
            onClick={() => onNavigate('assistant')}
          >
            Ask AI
          </button>
        </nav>

        <div className={styles.pill}>
          <span className={styles.pillDot} />
          GPT-4o Powered
        </div>
      </div>
    </header>
  );
}
