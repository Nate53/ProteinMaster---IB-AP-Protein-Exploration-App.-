import React, { useState, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';

const PARTS = [
  { id: 'amine', label: 'Amine Group (-NH₂)', color: 'bg-blue-500', correctZone: 'left' },
  { id: 'carboxyl', label: 'Carboxyl Group (-COOH)', color: 'bg-red-500', correctZone: 'right' },
  { id: 'hydrogen', label: 'Hydrogen (-H)', color: 'bg-gray-400', correctZone: 'top' },
  { id: 'r-group', label: 'R Group (Side Chain)', color: 'bg-green-500', correctZone: 'bottom' },
];

const AminoAcidBuilder: React.FC = () => {
  const [placedParts, setPlacedParts] = useState<Record<string, string | null>>({
    top: null,
    bottom: null,
    left: null,
    right: null,
  });
  const [completed, setCompleted] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handleZoneClick = (zone: string) => {
    if (!selectedPart) return;
    
    // Check if correct
    const part = PARTS.find(p => p.id === selectedPart);
    if (part && part.correctZone === zone) {
      setPlacedParts(prev => ({ ...prev, [zone]: part.id }));
      setSelectedPart(null);
    } else {
      alert("Incorrect placement! Remember the general structure.");
    }
  };

  useEffect(() => {
    const allPlaced = Object.values(placedParts).every(val => val !== null);
    if (allPlaced) setCompleted(true);
  }, [placedParts]);

  const reset = () => {
    setPlacedParts({ top: null, bottom: null, left: null, right: null });
    setCompleted(false);
    setSelectedPart(null);
  };

  // Helper to render the chemical structure of placed parts
  const renderPartVisual = (partId: string | null, position: string) => {
    if (!partId) {
       // Return placeholder text
       return (
         <span className="text-slate-400 font-medium">
            {position === 'top' ? 'Top' : position === 'bottom' ? 'Bottom' : position === 'left' ? 'Left' : 'Right'}
         </span>
       );
    }

    if (partId === 'amine') {
        return (
            <div className="flex flex-col items-center justify-center leading-none scale-110">
               {/* H connected to N (Up) */}
               <div className="flex flex-col items-center">
                 <span className="font-bold text-lg text-blue-600">H</span>
                 <div className="h-3 w-0.5 bg-blue-600"></div>
               </div>
               {/* H connected to N (Left) and N */}
               <div className="flex items-center">
                  <span className="font-bold text-lg text-blue-600">H</span>
                  <div className="w-3 h-0.5 bg-blue-600 mx-1"></div>
                  <span className="font-bold text-2xl text-blue-600">N</span>
               </div>
               <span className="text-[10px] text-blue-800 font-semibold mt-2">Amino</span>
            </div>
        );
    }

    if (partId === 'carboxyl') {
        return (
             <div className="flex flex-col items-center justify-center leading-none relative scale-110">
                {/* Double Bond O (Up) */}
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-red-600">O</span>
                    <div className="flex gap-[2px]">
                        <div className="h-3 w-0.5 bg-red-600"></div>
                        <div className="h-3 w-0.5 bg-red-600"></div>
                    </div>
                </div>
                {/* C single bonded to OH (Right) */}
                <div className="flex items-center relative left-1">
                    <span className="font-bold text-2xl text-red-600">C</span>
                    <div className="w-3 h-0.5 bg-red-600 mx-1"></div>
                    <span className="font-bold text-lg text-red-600">OH</span>
                </div>
                <span className="text-[10px] text-red-800 font-semibold mt-2">Carboxyl</span>
            </div>
        )
    }

    if (partId === 'hydrogen') {
        return (
            <div className="flex flex-col items-center">
                <span className="font-bold text-3xl text-slate-700">H</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Hydrogen</span>
            </div>
        )
    }

    if (partId === 'r-group') {
        return (
            <div className="flex flex-col items-center">
                 <span className="font-bold text-3xl text-green-600">R</span>
                 <span className="text-[10px] text-green-800 font-semibold mt-1">Side Chain</span>
            </div>
        )
    }
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Build an Amino Acid</h2>
        <p className="text-slate-600">
          Click a component below, then click the correct position around the central Carbon atom.
          Identify the <strong>Amino</strong> and <strong>Carboxyl</strong> groups that are crucial for bonding.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {PARTS.map(part => {
            const isPlaced = Object.values(placedParts).includes(part.id);
            return (
                <button
                    key={part.id}
                    onClick={() => !isPlaced && setSelectedPart(part.id)}
                    disabled={isPlaced}
                    className={`
                        px-4 py-2 rounded-lg font-semibold shadow-md transition-all border-2
                        ${isPlaced ? 'opacity-30 cursor-not-allowed bg-slate-100 border-slate-200' : 
                          selectedPart === part.id 
                            ? 'ring-4 ring-offset-2 ring-indigo-500 border-transparent ' + part.color + ' text-white' 
                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                        }
                    `}
                >
                    {isPlaced && <Check className="inline mr-2 w-4 h-4 text-green-600" />}
                    {part.label}
                </button>
            )
        })}
      </div>

      <div className="relative w-96 h-96 bg-white rounded-full shadow-2xl border-4 border-slate-100 flex items-center justify-center mt-4">
        {/* Central Carbon */}
        <div className="z-10 w-24 h-24 bg-slate-800 text-white rounded-full flex flex-col items-center justify-center text-xl font-bold shadow-lg ring-4 ring-slate-200">
          <span className="text-3xl">C</span>
          <span className="text-xs font-normal opacity-80">alpha</span>
        </div>

        {/* Connection Lines (Background) */}
        {/* Horizontal */}
        <div className="absolute w-full h-1.5 bg-slate-300 top-1/2 left-0 -translate-y-1/2 -z-0"></div>
        {/* Vertical */}
        <div className="absolute h-full w-1.5 bg-slate-300 top-0 left-1/2 -translate-x-1/2 -z-0"></div>

        {/* Click Zones */}
        
        {/* TOP (Hydrogen) */}
        <button 
            onClick={() => handleZoneClick('top')}
            className={`absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm
            ${placedParts.top 
                ? 'bg-white border-slate-300' 
                : 'border-dashed border-slate-300 hover:bg-slate-50 hover:border-indigo-300'}`}
        >
            {renderPartVisual(placedParts.top, 'top')}
        </button>

        {/* BOTTOM (R-Group) */}
        <button 
            onClick={() => handleZoneClick('bottom')}
            className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-28 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm
            ${placedParts.bottom 
                ? 'bg-white border-slate-300' 
                : 'border-dashed border-slate-300 hover:bg-slate-50 hover:border-indigo-300'}`}
        >
             {renderPartVisual(placedParts.bottom, 'bottom')}
        </button>

        {/* LEFT (Amine) */}
        <button 
             onClick={() => handleZoneClick('left')}
             className={`absolute left-2 top-1/2 -translate-y-1/2 w-28 h-28 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm
             ${placedParts.left 
                ? 'bg-blue-50 border-blue-200' 
                : 'border-dashed border-slate-300 hover:bg-slate-50 hover:border-indigo-300'}`}
        >
             {renderPartVisual(placedParts.left, 'left')}
        </button>

        {/* RIGHT (Carboxyl) */}
        <button 
             onClick={() => handleZoneClick('right')}
             className={`absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm
             ${placedParts.right 
                ? 'bg-red-50 border-red-200' 
                : 'border-dashed border-slate-300 hover:bg-slate-50 hover:border-indigo-300'}`}
        >
             {renderPartVisual(placedParts.right, 'right')}
        </button>
      </div>

      {completed && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center animate-bounce shadow-sm max-w-lg">
          <h3 className="text-xl font-bold text-green-800 mb-2">Excellent! Structure Assembled.</h3>
          <p className="text-green-700 text-sm mb-4">
             You have built an amino acid. Notice how the <strong className="text-blue-700">Amine H</strong> and <strong className="text-red-700">Carboxyl OH</strong> are positioned? 
             These are the parts that will react to form a peptide bond and release water!
          </p>
          <button onClick={reset} className="flex items-center justify-center mx-auto text-green-700 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow hover:bg-green-50 transition-all font-semibold">
              <RotateCcw className="w-4 h-4 mr-2"/> Build Another
          </button>
        </div>
      )}
    </div>
  );
};

export default AminoAcidBuilder;