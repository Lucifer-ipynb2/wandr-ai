import React, { useState } from 'react';
import {
  Sun, Sunset, Moon, Utensils, MapPin, Clock, Lightbulb,
  Star, Package, AlertCircle, ChevronDown, ChevronUp,
  Download, Share2, RotateCcw, Sparkles, Phone, Heart
} from 'lucide-react';
import styles from './Itinerary.module.css';

function DayCard({ day, isOpen, onToggle }) {
  return (
    <div className={styles.dayCard}>
      <button className={styles.dayHeader} onClick={onToggle}>
        <div className={styles.dayNum}>
          <span className={styles.dayLabel}>Day</span>
          <span className={styles.dayNumVal}>{day.day}</span>
        </div>
        <div className={styles.dayInfo}>
          <h3 className={styles.dayTheme}>{day.theme}</h3>
          <div className={styles.dayMeals}>
            {[day.meals?.breakfast, day.meals?.lunch, day.meals?.dinner]
              .filter(Boolean)
              .slice(0, 2)
              .map((m, i) => (
                <span key={i} className={styles.mealPill}>{m}</span>
              ))
            }
          </div>
        </div>
        <span className={styles.dayToggle}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {isOpen && (
        <div className={styles.dayBody}>
          {[
            { key: 'morning', icon: Sun, label: 'Morning', data: day.morning },
            { key: 'afternoon', icon: Sunset, label: 'Afternoon', data: day.afternoon },
            { key: 'evening', icon: Moon, label: 'Evening', data: day.evening },
          ].map(({ key, icon: Icon, label, data }) => data && (
            <div key={key} className={styles.timeBlock}>
              <div className={styles.timeHeader}>
                <Icon size={15} strokeWidth={1.5} />
                <span>{label}</span>
                {data.duration && (
                  <span className={styles.duration}>
                    <Clock size={11} />
                    {data.duration}
                  </span>
                )}
              </div>
              <div className={styles.timeContent}>
                <h4 className={styles.activityName}>{data.activity}</h4>
                <p className={styles.activityDesc}>{data.description}</p>
                {data.tip && (
                  <div className={styles.tip}>
                    <Lightbulb size={12} />
                    <span>{data.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {day.meals && (
            <div className={styles.mealsSection}>
              <div className={styles.mealsSectionHeader}>
                <Utensils size={14} strokeWidth={1.5} />
                <span>Where to Eat</span>
              </div>
              <div className={styles.mealsGrid}>
                {day.meals.breakfast && (
                  <div className={styles.mealItem}>
                    <span className={styles.mealTime}>Breakfast</span>
                    <span className={styles.mealName}>{day.meals.breakfast}</span>
                  </div>
                )}
                {day.meals.lunch && (
                  <div className={styles.mealItem}>
                    <span className={styles.mealTime}>Lunch</span>
                    <span className={styles.mealName}>{day.meals.lunch}</span>
                  </div>
                )}
                {day.meals.dinner && (
                  <div className={styles.mealItem}>
                    <span className={styles.mealTime}>Dinner</span>
                    <span className={styles.mealName}>{day.meals.dinner}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {day.accommodation && (
            <div className={styles.accommodation}>
              <MapPin size={13} strokeWidth={1.5} />
              <span>Stay: {day.accommodation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Itinerary({ plan, onReset, onAsk }) {
  const [openDay, setOpenDay] = useState(1);

  if (!plan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      {/* Trip Header */}
      <div className={styles.tripHeader}>
        <div className={styles.tripMeta}>
          <span className={styles.tripBadge}>
            <Sparkles size={11} />
            AI Generated
          </span>
        </div>
        <h1 className={styles.tripTitle}>{plan.tripTitle}</h1>
        <p className={styles.tripTagline}>{plan.tagline}</p>
        <p className={styles.tripOverview}>{plan.overview}</p>

        <div className={styles.tripActions}>
          <button className={styles.actionBtn} onClick={handlePrint}>
            <Download size={15} />
            Save PDF
          </button>
          <button className={styles.actionBtn} onClick={onAsk}>
            <Sparkles size={15} />
            Ask AI
          </button>
          <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={onReset}>
            <RotateCcw size={15} />
            New Trip
          </button>
        </div>
      </div>

      {/* Highlights */}
      {plan.highlights?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Star size={16} strokeWidth={1.5} />
            Trip Highlights
          </h2>
          <div className={styles.highlightsGrid}>
            {plan.highlights.map((h, i) => (
              <div key={i} className={styles.highlightCard}>
                <span className={styles.highlightNum}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.highlightText}>{h}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className={styles.quickInfo}>
        {plan.bestTime && (
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🌤</span>
            <div>
              <span className={styles.infoLabel}>Best Time to Visit</span>
              <span className={styles.infoValue}>{plan.bestTime}</span>
            </div>
          </div>
        )}
        {plan.estimatedCost && (
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>💰</span>
            <div>
              <span className={styles.infoLabel}>Estimated Cost</span>
              <span className={styles.infoValue}>{plan.estimatedCost}</span>
            </div>
          </div>
        )}
      </div>

      {/* Day-by-Day */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <MapPin size={16} strokeWidth={1.5} />
          Day-by-Day Itinerary
        </h2>
        <div className={styles.daysStack}>
          {plan.days?.map(day => (
            <DayCard
              key={day.day}
              day={day}
              isOpen={openDay === day.day}
              onToggle={() => setOpenDay(openDay === day.day ? null : day.day)}
            />
          ))}
        </div>
      </div>

      {/* Packing + Tips */}
      <div className={styles.twoCol}>
        {plan.packingEssentials?.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Package size={16} strokeWidth={1.5} />
              Packing Essentials
            </h2>
            <div className={styles.listCard}>
              {plan.packingEssentials.map((item, i) => (
                <div key={i} className={styles.listItem}>
                  <span className={styles.listDot} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {plan.localTips?.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Heart size={16} strokeWidth={1.5} />
              Local Tips
            </h2>
            <div className={styles.listCard}>
              {plan.localTips.map((tip, i) => (
                <div key={i} className={styles.listItem}>
                  <span className={styles.listDot} style={{ background: 'var(--gold)' }} />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Info */}
      {plan.emergencyInfo && (
        <div className={styles.section}>
          <div className={styles.emergencyCard}>
            <div className={styles.emergencyHeader}>
              <AlertCircle size={16} strokeWidth={1.5} />
              <span>Emergency Information</span>
            </div>
            <div className={styles.emergencyGrid}>
              {Object.entries(plan.emergencyInfo).map(([key, val]) => (
                <div key={key} className={styles.emergencyItem}>
                  <Phone size={12} />
                  <div>
                    <span className={styles.emergencyLabel}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={styles.emergencyVal}>{val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <p>Generated by <strong>Wandr AI</strong> · Powered by GPT-4o via OpenRouter</p>
        <button className={styles.newTripBtn} onClick={onReset}>
          Plan Another Trip
        </button>
      </div>
    </div>
  );
}
