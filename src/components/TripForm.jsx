import React, { useState } from 'react';
import {
  MapPin, Calendar, DollarSign, Users, Sparkles,
  Mountain, Utensils, Camera, Waves, BookOpen,
  ShoppingBag, Music, Leaf, Landmark, Zap
} from 'lucide-react';
import styles from './TripForm.module.css';

const INTERESTS = [
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'beaches', label: 'Beaches', icon: Waves },
  { id: 'culture', label: 'Culture', icon: BookOpen },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'nature', label: 'Nature', icon: Leaf },
  { id: 'history', label: 'History', icon: Landmark },
  { id: 'wellness', label: 'Wellness', icon: Zap },
];

const STYLES = [
  { id: 'luxury', label: 'Luxury' },
  { id: 'backpacker', label: 'Backpacker' },
  { id: 'family', label: 'Family-Friendly' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'solo', label: 'Solo Explorer' },
  { id: 'business', label: 'Business + Leisure' },
];

const DESTINATIONS = [
  'Tokyo, Japan', 'Paris, France', 'Bali, Indonesia',
  'New York, USA', 'Santorini, Greece', 'Machu Picchu, Peru',
  'Safari, Kenya', 'Amalfi Coast, Italy', 'Kyoto, Japan',
  'Maldives', 'Iceland', 'Morocco'
];

export default function TripForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    destination: '',
    duration: 7,
    budget: 'moderate',
    travelers: 2,
    interests: [],
    style: 'luxury',
  });

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : [...f.interests, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.destination.trim()) return;
    if (form.interests.length === 0) {
      alert('Please select at least one interest.');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroTag}>
          <Sparkles size={12} />
          AI-Powered Travel Planning
        </div>
        <h1 className={styles.heroTitle}>
          Your perfect trip,<br />
          <em>thoughtfully crafted.</em>
        </h1>
        <p className={styles.heroSubtitle}>
          Tell Wandr where you dream of going. Our AI creates a bespoke itinerary
          tailored to your style, budget, and passions.
        </p>
      </div>

      {/* Quick Destinations */}
      <div className={styles.quickDests}>
        <p className={styles.quickLabel}>Popular destinations</p>
        <div className={styles.quickList}>
          {DESTINATIONS.map(d => (
            <button
              key={d}
              className={`${styles.quickDest} ${form.destination === d ? styles.quickDestActive : ''}`}
              onClick={() => setForm(f => ({ ...f, destination: d }))}
              type="button"
            >
              <MapPin size={11} />
              {d}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Destination */}
        <div className={styles.field}>
          <label className={styles.label}>
            <MapPin size={14} />
            Destination
          </label>
          <div className={styles.inputWrap}>
            <input
              type="text"
              placeholder="e.g. Tokyo, Japan or Amalfi Coast..."
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          {/* Duration */}
          <div className={styles.field}>
            <label className={styles.label}>
              <Calendar size={14} />
              Duration
            </label>
            <div className={styles.sliderWrap}>
              <input
                type="range"
                min="1"
                max="30"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))}
                className={styles.slider}
              />
              <div className={styles.sliderVal}>
                <span className={styles.sliderNum}>{form.duration}</span>
                <span className={styles.sliderUnit}>days</span>
              </div>
            </div>
          </div>

          {/* Travelers */}
          <div className={styles.field}>
            <label className={styles.label}>
              <Users size={14} />
              Travelers
            </label>
            <div className={styles.sliderWrap}>
              <input
                type="range"
                min="1"
                max="12"
                value={form.travelers}
                onChange={e => setForm(f => ({ ...f, travelers: +e.target.value }))}
                className={styles.slider}
              />
              <div className={styles.sliderVal}>
                <span className={styles.sliderNum}>{form.travelers}</span>
                <span className={styles.sliderUnit}>{form.travelers === 1 ? 'person' : 'people'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className={styles.field}>
          <label className={styles.label}>
            <DollarSign size={14} />
            Budget Level
          </label>
          <div className={styles.budgetGroup}>
            {[
              { id: 'budget', label: 'Budget', sub: '$50–100/day' },
              { id: 'moderate', label: 'Moderate', sub: '$100–250/day' },
              { id: 'luxury', label: 'Luxury', sub: '$250–500/day' },
              { id: 'ultra-luxury', label: 'Ultra', sub: '$500+/day' },
            ].map(b => (
              <button
                key={b.id}
                type="button"
                className={`${styles.budgetBtn} ${form.budget === b.id ? styles.budgetActive : ''}`}
                onClick={() => setForm(f => ({ ...f, budget: b.id }))}
              >
                <span className={styles.budgetLabel}>{b.label}</span>
                <span className={styles.budgetSub}>{b.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className={styles.field}>
          <label className={styles.label}>Travel Style</label>
          <div className={styles.styleGroup}>
            {STYLES.map(s => (
              <button
                key={s.id}
                type="button"
                className={`${styles.styleBtn} ${form.style === s.id ? styles.styleActive : ''}`}
                onClick={() => setForm(f => ({ ...f, style: s.id }))}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className={styles.field}>
          <label className={styles.label}>
            <Sparkles size={14} />
            Interests
            <span className={styles.labelSub}>(select all that apply)</span>
          </label>
          <div className={styles.interestsGrid}>
            {INTERESTS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`${styles.interestBtn} ${form.interests.includes(id) ? styles.interestActive : ''}`}
                onClick={() => toggleInterest(id)}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading || !form.destination.trim()}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} />
              Crafting your itinerary...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate My Itinerary
            </>
          )}
        </button>
      </form>
    </div>
  );
}
