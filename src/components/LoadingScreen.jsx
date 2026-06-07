import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import styles from './LoadingScreen.module.css';

const STEPS = [
  'Researching your destination...',
  'Crafting the perfect itinerary...',
  'Finding hidden gems...',
  'Curating dining experiences...',
  'Adding insider tips...',
  'Polishing every detail...',
];

export default function LoadingScreen({ destination }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.globe}>
          <Compass size={32} strokeWidth={1} className={styles.compassIcon} />
          <div className={styles.ring} />
          <div className={styles.ring2} />
        </div>
        <h2 className={styles.title}>Planning your trip</h2>
        {destination && (
          <p className={styles.dest}>to <strong>{destination}</strong></p>
        )}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
            >
              <span className={styles.stepDot} />
              <span>{s}</span>
            </div>
          ))}
        </div>
        <p className={styles.note}>This usually takes 15–30 seconds</p>
      </div>
    </div>
  );
}
