import { createContext, useState, useContext } from 'react';

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const MoodProvider = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState([
    { date: 'Mon', score: 3 },
    { date: 'Tue', score: 4 },
    { date: 'Wed', score: 2 },
  ]);

  const addMoodEntry = (moodName) => {
    const scoreMap = { Awful: 1, Bad: 2, Okay: 3, Good: 4, Great: 5 };
    const score = scoreMap[moodName] || 3;
    const date = new Date().toLocaleDateString('en-us', { weekday: 'short' });
    
    const newEntry = { date, score };
    
    setMoodEntries(prevEntries => {
        const otherEntries = prevEntries.filter(entry => entry.date !== date);
        return [...otherEntries, newEntry];
    });
  };

  const value = { moodEntries, addMoodEntry };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};