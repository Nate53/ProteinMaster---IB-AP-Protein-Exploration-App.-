import React, { useState } from 'react';
import { PROTEIN_FUNCTIONS } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

const FunctionMatcher: React.FC = () => {
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Shuffle definitions for display
  const [shuffledDefs] = useState(() => [...PROTEIN_FUNCTIONS].sort(() => Math.random() - 0.5));

  const handleProteinClick = (id: string) => {
    if (matched.includes(id)) return;
    setSelectedProtein(id);
    setError(null);
  };

  const handleDefClick = (id: string) => {
    if (!selectedProtein) return;
    
    if (selectedProtein === id) {
      setMatched([...matched, id]);
      setSelectedProtein(null);
    } else {
      setError("Not quite! Try again.");
      setTimeout(() => setError(null), 1500);
    }
  };

  const isComplete = matched.length === PROTEIN_FUNCTIONS.length;

  return (
    <div className="flex flex-col p-6 animate-fade-in max-w-6xl mx-auto w-full">
      <div className="text-center mb-8">
         <h2 className="text-3xl font-bold text-slate-800 mb-2">Protein Functions Gallery</h2>
         <p className="text-slate-600">Select a protein on the left, then click its matching function/description on the right.</p>
      </div>

      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full shadow-xl z-50 animate-bounce">
            {error}
        </div>
      )}

      {isComplete ? (
          <div className="text-center p-12 bg-green-50 rounded-2xl border-2 border-green-200">
              <h3 className="text-4xl font-bold text-green-600 mb-4">Mastery Achieved!</h3>
              <p className="text-xl text-green-800">You've correctly identified the functions of key biological proteins.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                  Reset Module
              </button>
          </div>
      ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Protein List */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-2 gap-4 auto-rows-min">
                {PROTEIN_FUNCTIONS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => handleProteinClick(p.id)}
                        disabled={matched.includes(p.id)}
                        className={`
                            p-4 rounded-xl shadow-sm border-2 text-left transition-all relative overflow-hidden
                            ${matched.includes(p.id) ? 'bg-slate-100 border-slate-200 opacity-50' : 'hover:shadow-md'}
                            ${selectedProtein === p.id ? 'border-indigo-500 bg-indigo-50' : 'border-white bg-white'}
                        `}
                    >
                        <h4 className="font-bold text-lg text-slate-800">{p.name}</h4>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{p.category}</span>
                        {matched.includes(p.id) && <CheckCircle className="absolute top-2 right-2 text-green-500 w-5 h-5"/>}
                    </button>
                ))}
            </div>

            {/* Definition List */}
            <div className="flex-1 space-y-4">
                 {shuffledDefs.map((p) => {
                     // Hide matched definitions to clean up UI
                     if (matched.includes(p.id)) return null;

                     return (
                        <button
                            key={p.id}
                            onClick={() => handleDefClick(p.id)}
                            className={`
                                w-full p-4 rounded-xl shadow-sm border-2 text-left bg-white hover:bg-slate-50 transition-all
                                ${selectedProtein ? 'cursor-pointer hover:border-indigo-300' : 'cursor-default'}
                            `}
                        >
                            <p className="text-slate-700 text-sm leading-relaxed">{p.description}</p>
                        </button>
                     );
                 })}
            </div>
          </div>
      )}
    </div>
  );
};

export default FunctionMatcher;
