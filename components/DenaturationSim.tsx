import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, Play, CheckCircle, Info, Activity, Droplets, Flame, AlertTriangle, AlignJustify } from 'lucide-react';

const STAGES = [
  {
    id: 0,
    title: "Primary Structure",
    subtitle: "Amino Acid Sequence",
    description: "The primary structure is the specific sequence of amino acids determined by DNA. During translation, the ribosome reads mRNA to synthesize this polypeptide chain.",
    actionLabel: "Synthesize Polypeptide",
    color: "bg-blue-500",
  },
  {
    id: 1,
    title: "Secondary Structure",
    subtitle: "Backbone H-Bonding",
    description: "Hydrogen bonds form specifically between the Carbonyl Oxygen (C=O) and Amino Hydrogen (N-H) of the polypeptide backbone. R-groups are NOT involved. This creates repeating patterns: the coiled Alpha Helix or the flat Beta-Pleated Sheet.",
    actionLabel: "Form Hydrogen Bonds",
    color: "bg-indigo-500",
  },
  {
    id: 2,
    title: "Tertiary Structure",
    subtitle: "R-Group Interactions",
    description: "To minimize free energy in an aqueous environment, the protein folds into a compact 3D globular shape. Hydrophobic R-groups cluster in the core (entropy driven), while charged and polar groups form Ionic and Hydrogen bonds. Covalent Disulfide bridges lock the structure.",
    actionLabel: "Fold Side Chains",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Quaternary Structure",
    subtitle: "Complex Assembly & Function",
    description: "In Hemoglobin, four globular polypeptide subunits (2 Alpha, 2 Beta) assemble into a functional tetramer. Each subunit contains a Heme group with Iron (Fe²⁺) that binds Oxygen. This specific arrangement allows the protein to transport oxygen efficiently throughout the body.",
    actionLabel: "Assemble Hemoglobin",
    color: "bg-orange-500",
  },
];

const ProteinFoldingSim: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [completedStages, setCompletedStages] = useState<boolean[]>([false, false, false, false]);
  const [secondaryType, setSecondaryType] = useState<'helix' | 'sheet'>('helix');
  const [isDenatured, setIsDenatured] = useState(false);

  const aminoAcids = Array.from({ length: 30 }, (_, i) => i);

  const isChainVisible = completedStages[0] || (stage === 0 && animating);

  const handleAction = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      const newCompleted = [...completedStages];
      newCompleted[stage] = true;
      setCompletedStages(newCompleted);
    }, 3000);
  };

  const nextStage = () => {
    if (stage < 3) setStage(stage + 1);
  };

  const reset = () => {
    setStage(0);
    setCompletedStages([false, false, false, false]);
    setSecondaryType('helix');
    setIsDenatured(false);
  };

  const handleDenature = () => {
    setIsDenatured(true);
  };

  // --- Coordinate Calculations ---
  
  const getPosition = (index: number, currentStage: number) => {
    // Primary: Linear Line
    const x1 = 100 + index * 20;
    const y1 = 200;

    if (currentStage === 0 || !completedStages[0]) return { x: x1, y: y1 };

    // Secondary
    if (currentStage === 1 || (currentStage > 1 && !completedStages[1])) {
        if (secondaryType === 'helix') {
            const x = 100 + index * 18;
            const y = 250 + 50 * Math.sin(index * 0.5);
            return { x, y };
        } else {
            const spacing = 35;
            const startX = 140;
            if (index <= 14) {
                 const x = startX + index * spacing;
                 const y = 200 + (index % 2 === 0 ? -15 : 15);
                 return { x, y };
            } else {
                 const adjustedIndex = 29 - index; 
                 const x = startX + adjustedIndex * spacing;
                 const y = 300 + (adjustedIndex % 2 === 0 ? -15 : 15);
                 return { x, y };
            }
        }
    }

    // Tertiary: Folded Globule (Single Chain)
    const centerX = 400;
    const centerY = 250;
    const spread = 12; 
    const tx = centerX + (index - 15) * spread * Math.cos(index * 0.5);
    const ty = centerY + (index - 15) * spread * Math.sin(index * 0.5);

    return { x: tx, y: ty };
  };

  const getAAType = (i: number) => {
      if (i >= 13 && i <= 17) return 'hydrophobic';
      if (i === 5 || i === 20) return 'cysteine';
      if (i === 8) return 'acidic'; 
      if (i === 22) return 'basic'; 
      if (i === 2 || i === 27) return 'polar';
      return 'neutral';
  };

  const getAAColor = (type: string, stageId: number) => {
      if (stageId < 2 && stageId !== 0) return "#cbd5e1"; 
      if (stageId === 0) return `hsl(${Math.random() * 360}, 70%, 60%)`; 
      
      switch (type) {
          case 'hydrophobic': return "#ea580c"; 
          case 'cysteine': return "#facc15"; 
          case 'acidic': return "#ef4444"; 
          case 'basic': return "#3b82f6"; 
          case 'polar': return "#10b981"; 
          default: return "#cbd5e1";
      }
  };

  // --- Render Helpers ---

  const renderBackbone = () => {
    let d = "";
    aminoAcids.forEach((_, i) => {
      const pos = getPosition(i, stage);
      if (i === 0) d += `M ${pos.x} ${pos.y}`;
      else d += ` L ${pos.x} ${pos.y}`;
    });

    const isPrimarySynthesis = stage === 0 && animating;

    return (
      <path
        d={d}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-1000 ease-in-out"
        strokeDasharray={isPrimarySynthesis ? "1000" : "none"}
        strokeDashoffset={isPrimarySynthesis ? "1000" : "0"}
        style={isPrimarySynthesis ? { animation: 'drawPath 3s linear forwards' } : {}}
      />
    );
  };

  // Improved Render for Quaternary Structure Subunit (Thick Globular Lobe)
  const renderFoldedSubunit = (color: string, label: string, isDenaturedState: boolean) => {
      // Path definition for a "Lobular" globular protein shape (simulating the 'sausage' model)
      // This path loops around to create a dense knot
      const globularPath = "M -25 35 Q -55 25 -45 -15 T 0 -45 T 45 -15 T 25 35 T -25 35";
      const complexPath = "M -20 35 C -50 55, -70 -10, -40 -30 S 20 -60, 50 -30 S 70 40, 30 50 S -10 60, -20 35";
      const denaturedPath = "M -60 0 C -30 -60, 30 60, 60 0"; // Unraveled simple curve

      return (
          <g className="transition-all duration-1000">
              {/* Thick "Sausage" Backbone */}
              <path 
                d={isDenaturedState ? denaturedPath : complexPath}
                stroke={color} 
                strokeWidth={isDenaturedState ? "15" : "45"} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
                className="transition-all duration-1000"
                style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'}}
              />
              
              {/* Highlight for 3D tube effect */}
              <path 
                d={isDenaturedState ? denaturedPath : complexPath}
                stroke="white" 
                strokeWidth={isDenaturedState ? "4" : "12"} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
                opacity="0.25"
                className="transition-all duration-1000"
              />

              {/* Heme Group - Purple Disc with Blue Center */}
              <g 
                transform={isDenaturedState ? "translate(0, 60) rotate(45)" : "translate(0, 0)"} 
                style={{ opacity: isDenaturedState ? 0 : 1, transition: 'all 1s' }}
              >
                  {/* The Disc (Porphyrin ring) */}
                  <ellipse cx="0" cy="0" rx="16" ry="10" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
                  
                  {/* The Iron (Fe) Center */}
                  <circle cx="0" cy="0" r="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
                  
                  {/* Bound Oxygen (if functional) */}
                  {!isDenaturedState && (
                    <g className="animate-pulse">
                        <circle cx="6" cy="-4" r="3" fill="#bae6fd" opacity="0.9" />
                    </g>
                  )}
              </g>

              {/* Label */}
              <text 
                x="0" 
                y={isDenaturedState ? 50 : 5} 
                textAnchor="middle" 
                fill="white" 
                fontSize="12" 
                fontWeight="bold" 
                style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)', pointerEvents: 'none'}}
                opacity={isDenaturedState ? 0.5 : 0.8}
              >
                 {label}
              </text>
          </g>
      );
  };

  return (
    <div className="flex flex-col p-6 w-full max-w-6xl mx-auto animate-fade-in space-y-8">
      
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-slate-800">Protein Folding Simulator</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
           Watch as genetic information becomes a functional molecular structure.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-1/3 space-y-6">
            <div className="flex justify-between items-center mb-6 px-2">
                {STAGES.map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center z-10">
                        <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2
                            ${stage === idx ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-lg' : 
                              stage > idx ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-400 border-slate-200'}
                            `}
                        >
                            {stage > idx ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span className="text-[10px] mt-1 font-semibold text-slate-500 uppercase tracking-wide hidden md:block">{s.title.split(' ')[0]}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
                 <div className={`h-2 w-full ${STAGES[stage].color}`}></div>
                 <div className="p-6 md:p-8 space-y-4">
                     <div className="space-y-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${STAGES[stage].color.replace('bg-', 'text-')}`}>
                            Stage {stage + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-800">{STAGES[stage].title}</h3>
                        <h4 className="text-lg font-medium text-slate-500">{STAGES[stage].subtitle}</h4>
                     </div>
                     
                     <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {STAGES[stage].description}
                     </p>
                     
                     {stage === 1 && completedStages[1] && (
                         <div className="flex gap-2 p-1 bg-slate-100 rounded-lg animate-fade-in">
                            <button 
                                onClick={() => setSecondaryType('helix')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${secondaryType === 'helix' ? 'bg-white shadow text-indigo-600 border border-indigo-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Activity className="w-4 h-4" /> Alpha Helix
                            </button>
                            <button 
                                onClick={() => setSecondaryType('sheet')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${secondaryType === 'sheet' ? 'bg-white shadow text-indigo-600 border border-indigo-100' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <AlignJustify className="w-4 h-4" /> Beta Sheet
                            </button>
                         </div>
                     )}

                     <div className="pt-4">
                        {!completedStages[stage] ? (
                            <button 
                                onClick={handleAction}
                                disabled={animating}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                                ${animating ? 'bg-slate-400 cursor-wait' : STAGES[stage].color} hover:opacity-90`}
                            >
                                {animating ? "Synthesizing..." : `${STAGES[stage].actionLabel}`}
                            </button>
                        ) : (
                            <div className="space-y-3">
                                {isDenatured ? (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 animate-pulse">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                            <span className="font-bold">Protein Denatured!</span>
                                        </div>
                                        <p className="text-xs">Extreme heat has disrupted bonds and destroyed the conformation. The protein can no longer bind Oxygen.</p>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 shrink-0" />
                                        <span className="font-semibold text-sm">Structure Confirmed!</span>
                                    </div>
                                )}
                                
                                {stage < 3 ? (
                                    <button 
                                        onClick={nextStage}
                                        className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                                    >
                                        Next Stage <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={reset} className="flex-1 py-3 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-200 flex items-center justify-center gap-2">
                                            <RotateCcw className="w-4 h-4" /> Restart
                                        </button>
                                        {!isDenatured && (
                                            <button onClick={handleDenature} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 flex items-center justify-center gap-2 shadow-lg">
                                                <Flame className="w-4 h-4" /> Apply Heat
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                 </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start text-sm text-blue-800 border border-blue-100">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                    {stage === 0 && "The Ribosome adds amino acids one by one based on mRNA codons."}
                    {stage === 2 && "Tertiary folding is driven by R-group interactions to create a stable 3D shape."}
                    {stage === 3 && "Hemoglobin has 4 subunits: 2 Alpha (Yellow) and 2 Beta (Red)."}
                </p>
            </div>
        </div>

        <div className="lg:w-2/3 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center min-h-[500px] border-4 border-slate-200 shadow-2xl">
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isDenatured ? 'bg-red-900/15' : ''}`} style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.1 }}></div>
            
            <svg className="w-full h-full" viewBox="0 0 800 500">
                <style>{`
                    @keyframes slideRibosome {
                        0% { transform: translate(70px, 215px); }
                        100% { transform: translate(720px, 215px); }
                    }
                    @keyframes popIn {
                        0% { transform: scale(0); opacity: 0; }
                        60% { transform: scale(1.3); opacity: 1; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes drawPath {
                        from { stroke-dashoffset: 1000; }
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>

                <g className="transition-all duration-1000">
                    {/* mRNA context */}
                    {stage === 0 && (
                        <g>
                            <line x1="50" y1="235" x2="750" y2="235" stroke="#cbd5e1" strokeWidth="6" strokeDasharray="1 8" opacity="0.4" strokeLinecap="round" />
                        </g>
                    )}
                    
                    {/* Backbone Line for Stages 0, 1, 2 */}
                    {stage < 3 && renderBackbone()}

                    {/* Amino Acid Beads - Synced with Ribosome in Stage 0 */}
                    {stage < 3 && isChainVisible && aminoAcids.map((_, i) => {
                        const pos = getPosition(i, stage);
                        const aaType = getAAType(i);
                        let beadColor = getAAColor(aaType, stage);
                        if (stage === 0) beadColor = `hsl(${i * 12}, 75%, 65%)`;

                        // SYNC ANIMATION: Beads pop in as ribosome moves
                        const synthesisAnim = stage === 0 && animating ? {
                            animation: `popIn 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
                            animationDelay: `${i * 0.1}s`, // 30 amino acids over 3 seconds = 0.1s each
                            opacity: 0,
                            transformBox: 'fill-box',
                            transformOrigin: 'center'
                        } : {};

                        return (
                            <g key={i} className="transition-all duration-1000 ease-in-out" style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, ...synthesisAnim }}>
                                <circle r={11} fill={beadColor} stroke="rgba(0,0,0,0.4)" strokeWidth="1" className="drop-shadow-sm" />
                                {stage === 2 && completedStages[2] && (
                                    <text dy="3.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
                                        {aaType === 'acidic' ? '-' : aaType === 'basic' ? '+' : ''}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Ribosome Animation */}
                    {stage === 0 && animating && (
                         <g style={{ animation: 'slideRibosome 3s linear forwards' }}>
                             <path d="M -35,-8 C -35,-50 35,-50 35,-8 C 35,5 -35,5 -35,-8 Z" fill="#f87171" stroke="#b91c1c" strokeWidth="2" opacity="0.95" />
                             <ellipse cx="0" cy="22" rx="28" ry="12" fill="#fca5a5" stroke="#b91c1c" strokeWidth="2" opacity="0.95" />
                             <text x="0" y="-35" textAnchor="middle" fill="white" fontSize="9" fontWeight="black" className="uppercase tracking-tighter">Ribosome</text>
                         </g>
                    )}

                    {/* Stage 1: H-Bonds */}
                    {stage === 1 && completedStages[1] && (
                        <g className="animate-fade-in">
                            {secondaryType === 'helix' ? (
                                aminoAcids.map((_, i) => {
                                    if (i > aminoAcids.length - 5) return null;
                                    const p1 = getPosition(i, 1);
                                    const p2 = getPosition(i+4, 1);
                                    return <line key={`hb-h-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f472b6" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.65" />
                                })
                            ) : (
                                aminoAcids.map((_, i) => {
                                    if (i > 11) return null; 
                                    const p1 = getPosition(i, 1);
                                    const p2 = getPosition(29-i, 1);
                                    return <line key={`hb-s-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f472b6" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.65" />
                                })
                            )}
                        </g>
                    )}

                    {/* Stage 2: Tertiary Interactions */}
                    {stage === 2 && completedStages[2] && (
                        <g className="animate-fade-in">
                            <circle cx="400" cy="250" r="45" fill="rgba(234, 88, 12, 0.1)" stroke="#ea580c" strokeWidth="1" strokeDasharray="5 5" />
                            <line x1={getPosition(5, 2).x} y1={getPosition(5, 2).y} x2={getPosition(20, 2).x} y2={getPosition(20, 2).y} stroke="#eab308" strokeWidth="4" />
                            <line x1={getPosition(8, 2).x} y1={getPosition(8, 2).y} x2={getPosition(22, 2).x} y2={getPosition(22, 2).y} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
                        </g>
                    )}

                    {/* Stage 3: Quaternary Assembly (2 Yellow + 2 Red) - UPDATED */}
                    {stage === 3 && completedStages[3] && (
                        <g transform="translate(400, 250)">
                            {/* Alpha 1 (Yellow) */}
                            <g className="transition-all duration-1000 ease-out" transform={isDenatured ? "translate(-220, -200) rotate(-45) scale(1.3)" : "translate(-50, -50) scale(1.35)"}>
                                {renderFoldedSubunit("#eab308", "α1", isDenatured)}
                            </g>
                            {/* Beta 1 (Red) */}
                            <g className="transition-all duration-1000 ease-out" transform={isDenatured ? "translate(220, -200) rotate(45) scale(1.3)" : "translate(50, -50) scale(1.35) scale(-1, 1)"}>
                                {renderFoldedSubunit("#ef4444", "β1", isDenatured)}
                            </g>
                            {/* Alpha 2 (Yellow) */}
                            <g className="transition-all duration-1000 ease-out" transform={isDenatured ? "translate(220, 200) rotate(135) scale(1.3)" : "translate(50, 50) scale(1.35) scale(-1, -1)"}>
                                {renderFoldedSubunit("#eab308", "α2", isDenatured)}
                            </g>
                            {/* Beta 2 (Red) */}
                            <g className="transition-all duration-1000 ease-out" transform={isDenatured ? "translate(-220, 200) rotate(-135) scale(1.3)" : "translate(-50, 50) scale(1.35) scale(1, -1)"}>
                                {renderFoldedSubunit("#ef4444", "β2", isDenatured)}
                            </g>
                        </g>
                    )}
                </g>
            </svg>

            {/* Visual Legend */}
            <div className="absolute top-4 left-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[10px] text-slate-300 backdrop-blur-sm">
                <div className="font-bold mb-2 text-white border-b border-slate-600 pb-1 uppercase tracking-tighter">Key</div>
                {stage < 3 && (
                    <>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-orange-600"></span> Hydrophobic</div>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Disulfide Bridge</div>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-red-600"></span> Acidic (-)</div>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Basic (+)</div>
                    </>
                )}
                {stage === 3 && (
                     <div className="mt-0 space-y-1">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#eab308] border border-white/20"></span> Alpha Subunit</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444] border border-white/20"></span> Beta Subunit</div>
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-600 mt-1"><span className="w-3 h-2 rounded-full border border-purple-500 bg-purple-500"></span> Heme Group</div>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProteinFoldingSim;