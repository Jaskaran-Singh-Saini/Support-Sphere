import { Link } from 'react-router-dom';

function GrowthPet({ showButtons = true }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center relative overflow-hidden"> {/* Added relative and overflow-hidden */}
      <h2 className="text-2xl font-bold text-gray-800">
        GrowthPet
      </h2>
      
      <div className="relative my-4"> {/* Container for the pet and animation */}
        <img 
          src="https://api.iconify.design/twemoji/seedling.svg" 
          alt="A cute green sprout pet" 
          className="w-40 h-40 relative z-10" 
        />
        {/* Simple animation circles */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-28 h-28 bg-blue-200 opacity-30 rounded-full animate-pulse-slow"></div>
            <div className="absolute w-36 h-36 bg-blue-200 opacity-20 rounded-full animate-pulse-slower"></div>
        </div>
      </div>
      
      {showButtons && (
        <div className="w-full flex flex-col space-y-3">
          <Link 
            to="/reflection" 
            className="text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow"
          >
            Start Daily Reflection
          </Link>
          <Link 
            to="/tasks" 
            className="text-center bg-white text-blue-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Explore Self-Care Tasks
          </Link>
        </div>
      )}
    </div>
  );
}

export default GrowthPet;