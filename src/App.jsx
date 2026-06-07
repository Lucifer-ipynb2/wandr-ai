import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import Itinerary from './components/Itinerary';
import Assistant from './components/Assistant';
import ApiKeyModal from './components/ApiKeyModal';
import LoadingScreen from './components/LoadingScreen';
import { generateTravelPlan } from './services/openrouter';

const STORAGE_KEY = 'wandr_api_key';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [view, setView] = useState('home');
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  const handleApiKey = (key) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  };

  const handleGeneratePlan = async (formData) => {
    setIsLoading(true);
    setError('');
    setDestination(formData.destination);
    try {
      const result = await generateTravelPlan(formData, apiKey);
      setPlan(result);
      setView('itinerary');
    } catch (err) {
      setError(err.message);
      alert(`Error generating plan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setView('home');
    setDestination('');
  };

  const handleNavigate = (v) => {
    if (v === 'itinerary' && !plan) return;
    setView(v);
  };

  return (
    <>
      {!apiKey && <ApiKeyModal onSave={handleApiKey} />}
      {isLoading && <LoadingScreen destination={destination} />}

      <Header currentView={view} onNavigate={handleNavigate} />

      <main>
        {view === 'home' && (
          <TripForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
        )}
        {view === 'itinerary' && plan && (
          <Itinerary
            plan={plan}
            onReset={handleReset}
            onAsk={() => setView('assistant')}
          />
        )}
        {view === 'assistant' && (
          <Assistant apiKey={apiKey} destination={destination} />
        )}
      </main>
    </>
  );
}
