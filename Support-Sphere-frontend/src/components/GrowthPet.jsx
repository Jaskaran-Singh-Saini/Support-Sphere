import { Link } from 'react-router-dom';
import { useMood } from '../context/MoodContext';

// Tree grows through 5 stages based on reflection count
function TreeSVG({ stage }) {
  const stages = [
    // Stage 0 — seed
    <svg key={0} viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="100" rx="20" ry="6" fill="#A8C0A0" opacity="0.3"/>
      <ellipse cx="60" cy="95" rx="8" ry="5" fill="#8B6914"/>
      <ellipse cx="60" cy="93" rx="6" ry="4" fill="#A07830"/>
    </svg>,
    // Stage 1 — sprout
    <svg key={1} viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="105" rx="22" ry="7" fill="#A8C0A0" opacity="0.3"/>
      <rect x="58" y="70" width="4" height="35" rx="2" fill="#8B6914"/>
      <ellipse cx="60" cy="68" rx="10" ry="8" fill="#2D5A3D"/>
      <ellipse cx="50" cy="75" rx="7" ry="5" fill="#3D7A50" transform="rotate(-20 50 75)"/>
      <ellipse cx="70" cy="75" rx="7" ry="5" fill="#3D7A50" transform="rotate(20 70 75)"/>
    </svg>,
    // Stage 2 — small tree
    <svg key={2} viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="108" rx="25" ry="7" fill="#A8C0A0" opacity="0.4"/>
      <rect x="57" y="65" width="6" height="43" rx="3" fill="#8B6914"/>
      <ellipse cx="60" cy="60" rx="18" ry="14" fill="#2D5A3D"/>
      <ellipse cx="45" cy="70" rx="12" ry="8" fill="#3D7A50" transform="rotate(-15 45 70)"/>
      <ellipse cx="75" cy="70" rx="12" ry="8" fill="#3D7A50" transform="rotate(15 75 70)"/>
      <ellipse cx="60" cy="50" rx="14" ry="11" fill="#4D8A60"/>
    </svg>,
    // Stage 3 — medium tree
    <svg key={3} viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="110" rx="28" ry="8" fill="#A8C0A0" opacity="0.4"/>
      <rect x="56" y="58" width="8" height="52" rx="4" fill="#8B6914"/>
      <ellipse cx="60" cy="50" rx="24" ry="18" fill="#2D5A3D"/>
      <ellipse cx="40" cy="63" rx="16" ry="10" fill="#3D7A50" transform="rotate(-20 40 63)"/>
      <ellipse cx="80" cy="63" rx="16" ry="10" fill="#3D7A50" transform="rotate(20 80 63)"/>
      <ellipse cx="60" cy="38" rx="18" ry="14" fill="#4D8A60"/>
      <ellipse cx="45" cy="45" rx="10" ry="7" fill="#5DA070" transform="rotate(-10 45 45)"/>
      <ellipse cx="75" cy="45" rx="10" ry="7" fill="#5DA070" transform="rotate(10 75 45)"/>
      <circle cx="62" cy="58" r="3" fill="#FFCC00" opacity="0.8"/>
      <circle cx="53" cy="52" r="2" fill="#FFCC00" opacity="0.6"/>
    </svg>,
    // Stage 4 — full tree in bloom
    <svg key={4} viewBox="0 0 120 120" className="w-32 h-32">
      <ellipse cx="60" cy="112" rx="32" ry="9" fill="#A8C0A0" opacity="0.5"/>
      <rect x="55" y="52" width="10" height="60" rx="5" fill="#8B6914"/>
      <ellipse cx="60" cy="42" rx="30" ry="22" fill="#2D5A3D"/>
      <ellipse cx="35" cy="58" rx="18" ry="12" fill="#3D7A50" transform="rotate(-25 35 58)"/>
      <ellipse cx="85" cy="58" rx="18" ry="12" fill="#3D7A50" transform="rotate(25 85 58)"/>
      <ellipse cx="60" cy="28" rx="22" ry="16" fill="#4D8A60"/>
      <ellipse cx="40" cy="38" rx="13" ry="9" fill="#5DA070" transform="rotate(-12 40 38)"/>
      <ellipse cx="80" cy="38" rx="13" ry="9" fill="#5DA070" transform="rotate(12 80 38)"/>
      <ellipse cx="60" cy="18" rx="15" ry="11" fill="#6DB880"/>
      <circle cx="55" cy="32" r="3.5" fill="#E07A5F" opacity="0.9"/>
      <circle cx="68" cy="28" r="3" fill="#E07A5F" opacity="0.8"/>
      <circle cx="48" cy="42" r="2.5" fill="#FFCC00" opacity="0.9"/>
      <circle cx="73" cy="45" r="3" fill="#FFCC00" opacity="0.8"/>
      <circle cx="60" cy="52" r="2" fill="#E07A5F" opacity="0.7"/>
      <circle cx="42" cy="55" r="2.5" fill="#FFCC00" opacity="0.7"/>
    </svg>,
  ];
  return stages[Math.min(stage, stages.length - 1)];
}

const STAGE_LABELS = ['Seed 🌰', 'Sprout 🌱', 'Sapling 🌿', 'Tree 🌳', 'Blooming 🌸'];
const STAGE_THRESHOLDS = [0, 1, 4, 10, 20]; // reflections needed per stage

function GrowthPet({ showButtons = true }) {
  const { moodEntries, reflectionCount } = useMood();
  // Use actual reflection count from backend if available, else fall back to mood entries
  const count = reflectionCount ?? moodEntries.length;
  const stage = STAGE_THRESHOLDS.reduce((acc, t, i) => (count >= t ? i : acc), 0);
  const nextThreshold = STAGE_THRESHOLDS[stage + 1];
  const progress = nextThreshold
    ? Math.min(((count - STAGE_THRESHOLDS[stage]) / (nextThreshold - STAGE_THRESHOLDS[stage])) * 100, 100)
    : 100;

  return (
    <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-moss/20 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-2">
        <h2 className="text-base font-semibold text-forest">Your Growth</h2>
        <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full font-medium">{STAGE_LABELS[stage]}</span>
      </div>

      <div className="relative my-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 bg-moss/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        <TreeSVG stage={stage} />
      </div>

      {nextThreshold && (
        <div className="w-full mt-2 mb-3">
          <div className="flex justify-between text-[11px] text-bark/50 mb-1">
            <span>{count} reflections</span>
            <span>{nextThreshold} to next stage</span>
          </div>
          <div className="w-full bg-moss/20 rounded-full h-1.5">
            <div
              className="bg-forest h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {stage === 4 && (
        <p className="text-xs text-terra font-medium mb-2">🌸 Fully bloomed! Amazing dedication.</p>
      )}

      {showButtons && (
        <div className="w-full flex flex-col space-y-2 mt-1">
          <Link to="/reflection" className="text-center bg-forest text-cream font-semibold py-2.5 px-4 rounded-xl hover:bg-forest/90 transition-colors text-sm">
            Daily Reflection
          </Link>
          <Link to="/tasks" className="text-center bg-white text-forest font-semibold py-2.5 px-4 rounded-xl hover:bg-cream transition-colors border border-moss/30 text-sm">
            Self-Care Tasks
          </Link>
        </div>
      )}
    </div>
  );
}

export default GrowthPet;