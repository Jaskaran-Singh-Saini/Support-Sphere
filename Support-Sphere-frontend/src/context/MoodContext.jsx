import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

const SCORE_MAP = { awful: 1, bad: 2, okay: 3, good: 4, great: 5 };
const fmt = (date) => date.toLocaleDateString('en-us', { weekday: 'short' });

export const MoodProvider = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [reflectionCount, setReflectionCount] = useState(0);

  const loadFromBackend = useCallback(async () => {
    if (!localStorage.getItem('authToken')) return;
    try {
      const res = await axios.get(apiUrl('/reflections/'));
      const entries = res.data.map((r) => ({
        date: new Date(r.created_at).toLocaleDateString('en-us', { weekday: 'short', month: 'short', day: 'numeric' }),
        score: SCORE_MAP[r.mood?.toLowerCase()] ?? 3,
        mood: r.mood,
      }));
      setReflectionCount(res.data.length);
      if (entries.length > 0) setMoodEntries(entries);
    } catch {
      // Not logged in or network error — silently skip
    }
  }, []);

  useEffect(() => {
    loadFromBackend();
  }, [loadFromBackend]);

  // Called immediately after a successful POST to /reflections/
  // so the chart updates without needing a refetch
  const addMoodEntry = (moodName) => {
    const score = SCORE_MAP[moodName.toLowerCase()] ?? 3;
    const date = new Date().toLocaleDateString('en-us', { weekday: 'short', month: 'short', day: 'numeric' });
    setReflectionCount(prev => prev + 1);
    setMoodEntries((prev) => {
      const others = prev.filter((e) => e.date !== date);
      return [...others, { date, score, mood: moodName }];
    });
  };

  const refreshMoods = loadFromBackend;

  return (
    <MoodContext.Provider value={{ moodEntries, reflectionCount, addMoodEntry, refreshMoods }}>
      {children}
    </MoodContext.Provider>
  );
};