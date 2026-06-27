import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { useLanguage } from '../context/LanguageContext';

// Fallback content shown when DB has no resources seeded yet
const FALLBACK_RESOURCES = [
  { id: 'f1', category: 'meditation', title: '5-Minute Box Breathing', description: 'Inhale 4s → hold 4s → exhale 4s → hold 4s. Repeat 4 times. Instantly calms the nervous system.', content_url: '' },
  { id: 'f2', category: 'meditation', title: 'Body Scan Relaxation', description: 'Lie down, close your eyes, slowly bring attention from your toes to your head, releasing tension as you go.', content_url: '' },
  { id: 'f3', category: 'article',    title: 'Understanding Exam Anxiety', description: 'Learn why your brain feels anxious before exams and three science-backed techniques to reduce it.', content_url: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/' },
  { id: 'f4', category: 'article',    title: 'How Sleep Affects Mental Health', description: 'Poor sleep worsens anxiety and depression. This guide explains how to build a healthier sleep routine as a student.', content_url: '' },
  { id: 'f5', category: 'exercise',   title: '7-Minute Morning Stretch', description: 'A gentle full-body stretch routine you can do before class. No equipment needed — just floor space.', content_url: '' },
  { id: 'f6', category: 'exercise',   title: 'Walk & Talk Therapy', description: 'Even a 10-minute walk outdoors significantly reduces cortisol. Try calling a friend while walking.', content_url: '' },
  { id: 'f7', category: 'assessment', title: 'Check Your Stress Level', description: 'Take the GAD-7 or PHQ-9 self-assessment to better understand your mental health and get matched guidance.', content_url: '/assessments' },
  { id: 'f8', category: 'assessment', title: 'Grounding: The 5-4-3-2-1 Technique', description: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. Stops panic in its tracks.', content_url: '' },
];

const CATEGORY_LABELS = {
  all:        { label: 'All',        color: 'bg-gray-100 text-gray-700' },
  meditation: { label: 'Meditation', color: 'bg-purple-100 text-purple-800' },
  article:    { label: 'Articles',   color: 'bg-blue-100 text-blue-800' },
  exercise:   { label: 'Exercise',   color: 'bg-green-100 text-green-800' },
  assessment: { label: 'Assessment', color: 'bg-orange-100 text-orange-800' },
};

function ResourceCard({ resource }) {
  const cat = CATEGORY_LABELS[resource.category] || CATEGORY_LABELS.all;
  const isInternal = resource.content_url?.startsWith('/');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
      <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start capitalize mb-3 ${cat.color}`}>
        {resource.category}
      </span>
      <h2 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h2>
      <p className="text-gray-600 text-sm flex-1">{resource.description}</p>
      {resource.content_url && (
        <div className="mt-4">
          {isInternal ? (
            <Link to={resource.content_url} className="text-sm text-blue-600 font-medium hover:underline">
              Go →
            </Link>
          ) : (
            <a href={resource.content_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium hover:underline">
              Learn more →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function SelfHelpPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    axios.get(apiUrl(`/resources/?lang=${language}`))
      .then((res) => setResources(res.data.length > 0 ? res.data : FALLBACK_RESOURCES))
      .catch(() => setResources(FALLBACK_RESOURCES))
      .finally(() => setLoading(false));
  }, [language]);

  const visible = filter === 'all'
    ? resources
    : resources.filter((r) => r.category === filter);

  const setFilter = (cat) => {
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ filter: cat });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Self-Help Resources</h1>
        <p className="text-gray-600 mb-6">Verified tools and techniques for your wellness journey.</p>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {Object.entries(CATEGORY_LABELS).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filter === key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse h-44" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No resources found for this category.</p>
            <button onClick={() => setFilter('all')} className="mt-3 text-blue-600 hover:underline text-sm">Show all</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((r) => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SelfHelpPage;