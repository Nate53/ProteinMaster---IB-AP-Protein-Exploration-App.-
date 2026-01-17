import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

const PeptideLinker: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Start, 1: OH Selected, 2: H Selected, 3: Reacted

  const handleSelectOH = () => {
    if (step === 0) setStep(1);
  };

  const handleSelectH = () => {
    if (step === 1) setStep(2);
  };

  const formBond = () => {
    if (step === 2) setStep(3);
  };

  const reset = () => setStep(0);

  // SVG Helper Components for Atoms and Bonds
  interface AtomProps {
    cx: number;
    cy: number;
    color: string;
    label: string;
    size?: number;
    onClick?: () => void;
    highlight?: boolean;
    dimmed?: boolean;
    symbolSize?: string;
    textColor?: string;
  }

  const Atom: React.FC<AtomProps> = ({ cx, cy, color, label, size = 20, onClick, highlight, dimmed, symbolSize = "14px", textColor="white" }) => (
    <g 
      onClick={onClick} 
      className={`${onClick ? 'cursor-pointer' : ''} transition-all duration-300`}
      style={{ opacity: dimmed ? 0.3 : 1 }}
    >
      <circle 
        cx={cx} 
        cy={cy} 
        r={size} 
        fill={color} 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="2"
        className={`${highlight ? 'animate-pulse' : ''} transition-all`}
        style={{ filter: highlight ? 'drop-shadow(0 0 12px rgba(255, 200, 0, 0.9))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
      />
      {/* 3D Shine effect */}
      <circle cx={cx - size/3} cy={cy - size/3} r={size/4} fill="white" fillOpacity="0.3" pointerEvents="none" />
      
      <text x={cx} y={cy} dy={size/3} textAnchor="middle" fill={textColor} fontSize={symbolSize} fontWeight="bold" pointerEvents="none" style={{textShadow: '0px 1px 2px rgba(0,0,0,0.5)'}}>{label}</text>
    </g>
  );

  const Bond = ({ x1, y1, x2, y2, double = false }: { x1: number, y1: number, x2: number, y2: number, double?: boolean }) => {
     if (double) {
         return (
             <g>
                 <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="6" strokeLinecap="round" transform={`translate(-3, -3)`} />
                 <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="6" strokeLinecap="round" transform={`translate(3, 3)`} />
             </g>
         )
     }
     return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="5" strokeLinecap="round" />;
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-8 animate-fade-in w-full max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Peptide Bond Synthesis</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Polypeptides are formed by linking amino acids together via peptide bonds.
          Click the correct atoms to perform a <strong>condensation reaction</strong> (dehydration synthesis).
        </p>
      </div>

      <div className="relative bg-slate-900 rounded-3xl shadow-2xl p-4 md:p-8 w-full overflow-hidden min-h-[450px] flex flex-col items-center justify-center border-4 border-slate-200">
        
        {/* Step Indicators */}
        <div className="absolute top-6 left-0 right-0 flex justify-center space-x-3 z-10">
            {[0, 1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= s ? (step === 3 ? 'bg-green-500' : 'bg-indigo-500') : 'bg-slate-700'}`} />
            ))}
        </div>

        {/* Message Overlay */}
        <div className="absolute top-12 text-white font-medium text-lg bg-slate-800/90 px-6 py-2 rounded-full backdrop-blur-md shadow-lg transition-all border border-slate-700 z-10 text-center mx-4">
            {step === 0 && <span>Step 1: Select the <span className="text-red-400 font-bold">Hydroxyl (-OH)</span> group from the Carboxyl end.</span>}
            {step === 1 && <span>Step 2: Select a <span className="text-blue-300 font-bold">Hydrogen (-H)</span> atom from the Amine end.</span>}
            {step === 2 && <span>Structure ready. <span className="text-green-400 font-bold">Form the bond!</span></span>}
            {step === 3 && <span className="flex items-center gap-2">Success! <span className="text-green-400 font-bold">Peptide Bond</span> formed & <span className="text-blue-300 font-bold">Water</span> released.</span>}
        </div>

        <svg viewBox="0 0 800 320" className="w-full h-full max-w-5xl select-none mt-10">
            {step < 3 ? (
            <g className="animate-fade-in">
                {/* --- AA1 (Left) --- */}
                {/* Bonds */}
                <Bond x1={200} y1={180} x2={140} y2={180} /> {/* C-N */}
                <Bond x1={200} y1={180} x2={200} y2={130} /> {/* C-H */}
                <Bond x1={200} y1={180} x2={200} y2={240} /> {/* C-R */}
                <Bond x1={200} y1={180} x2={260} y2={180} /> {/* C-C */}
                
                {/* Carboxyl Group Bonds */}
                <Bond x1={260} y1={180} x2={285} y2={130} double /> {/* C=O */}
                <Bond x1={260} y1={180} x2={300} y2={220} /> {/* C-OH */}

                {/* Amine Group Bonds */}
                <Bond x1={140} y1={180} x2={110} y2={140} /> {/* N-H */}
                <Bond x1={140} y1={180} x2={110} y2={220} /> {/* N-H */}

                {/* Atoms AA1 */}
                <Atom cx={200} cy={180} color="#475569" label="C" /> {/* Alpha Carbon */}
                <Atom cx={200} cy={130} color="#94a3b8" label="H" size={12} symbolSize="8px" textColor="#1e293b" /> {/* H alpha */}
                
                {/* R Group */}
                <rect x={180} y={240} width={40} height={40} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                <text x={200} y={268} textAnchor="middle" fill="#0f172a" fontWeight="bold" fontSize="18">R</text>

                {/* Amine Atoms */}
                <Atom cx={140} cy={180} color="#a855f7" label="N" /> {/* Nitrogen (Purple) */}
                <Atom cx={110} cy={140} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />
                <Atom cx={110} cy={220} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />

                {/* Carboxyl Atoms */}
                <Atom cx={260} cy={180} color="#475569" label="C" /> {/* Carboxyl Carbon */}
                <Atom cx={285} cy={130} color="#ef4444" label="O" /> {/* Double bond O */}

                {/* TARGET OH GROUP */}
                <g 
                    onClick={step === 0 ? handleSelectOH : undefined} 
                    className={`${step === 0 ? 'cursor-pointer hover:scale-110' : ''} transition-transform origin-center`}
                >
                     {/* Visual highlight halo */}
                     {step === 0 && <circle cx={308} cy={228} r={38} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow opacity-70" />}
                     {step === 1 && <circle cx={308} cy={228} r={40} fill="rgba(255,255,255,0.15)" className="animate-pulse" />}
                     
                     <Bond x1={300} y1={220} x2={315} y2={235} /> {/* O-H bond inside group */}
                     <Atom cx={300} cy={220} color="#ef4444" label="O" highlight={step === 0} dimmed={step >= 1} /> 
                     <Atom cx={315} cy={235} color="#bae6fd" label="H" textColor="#0f172a" size={14} symbolSize="10px" highlight={step === 0} dimmed={step >= 1} />
                </g>


                {/* --- PLUS SIGN --- */}
                 <text x={380} y={190} fontSize="50" fill="#64748b" fontWeight="bold" opacity="0.5">+</text>


                {/* --- AA2 (Right) --- */}
                 <g transform="translate(360, 0)">
                    {/* Bonds */}
                    <Bond x1={200} y1={180} x2={140} y2={180} /> {/* C-N */}
                    <Bond x1={200} y1={180} x2={200} y2={130} /> {/* C-H */}
                    <Bond x1={200} y1={180} x2={200} y2={240} /> {/* C-R */}
                    <Bond x1={200} y1={180} x2={260} y2={180} /> {/* C-C */}
                    
                    {/* Carboxyl Group Bonds */}
                    <Bond x1={260} y1={180} x2={285} y2={130} double /> {/* C=O */}
                    <Bond x1={260} y1={180} x2={300} y2={220} /> {/* C-OH */}

                    {/* Amine Group Bonds */}
                    <Bond x1={140} y1={180} x2={110} y2={140} /> {/* N-H TOP */}
                    <Bond x1={140} y1={180} x2={110} y2={220} /> {/* N-H BOTTOM */}

                    {/* Atoms AA2 */}
                    <Atom cx={200} cy={180} color="#475569" label="C" /> 
                    <Atom cx={200} cy={130} color="#94a3b8" label="H" size={12} symbolSize="8px" textColor="#1e293b" /> 
                    
                    <rect x={180} y={240} width={40} height={40} rx={6} fill="#ffedd5" stroke="#fed7aa" strokeWidth="2" />
                    <text x={200} y={268} textAnchor="middle" fill="#9a3412" fontWeight="bold" fontSize="18">R</text>

                    {/* Amine Atoms */}
                    <Atom cx={140} cy={180} color="#a855f7" label="N" /> 
                    
                    {/* TARGET H */}
                    <g onClick={step === 1 ? handleSelectH : undefined} className={`${step === 1 ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}>
                        {step === 1 && <circle cx={110} cy={140} r={28} fill="none" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow opacity-70" />}
                        {step === 2 && <circle cx={110} cy={140} r={25} fill="rgba(255,255,255,0.15)" className="animate-pulse" />}
                        <Atom cx={110} cy={140} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" highlight={step === 1} dimmed={step >= 2} />
                    </g>
                    
                    <Atom cx={110} cy={220} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />

                    {/* Carboxyl Atoms */}
                    <Atom cx={260} cy={180} color="#475569" label="C" /> 
                    <Atom cx={285} cy={130} color="#ef4444" label="O" /> 
                    <g>
                        <Bond x1={300} y1={220} x2={315} y2={235} />
                        <Atom cx={300} cy={220} color="#ef4444" label="O" /> 
                        <Atom cx={315} cy={235} color="#bae6fd" label="H" textColor="#0f172a" size={14} symbolSize="10px" />
                    </g>
                 </g>
            </g>
            ) : (
             /* --- RESULT STATE (Dipeptide + Water) --- */
            <g className="animate-fade-in-up">
                 {/* Dipeptide Backbone */}
                 <g transform="translate(60, 0)">
                    {/* AA1 Residue */}
                    <Bond x1={200} y1={180} x2={140} y2={180} />
                    <Bond x1={200} y1={180} x2={200} y2={240} />
                    <Bond x1={200} y1={180} x2={260} y2={180} />
                    <Bond x1={260} y1={180} x2={285} y2={130} double />
                    
                    {/* THE PEPTIDE BOND */}
                    <line x1={260} y1={180} x2={440} y2={180} stroke="#22c55e" strokeWidth="10" />
                    <text x={350} y={160} textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold">Peptide Bond</text>

                    {/* AA2 Residue shifted left to connect */}
                    <g transform="translate(300, 0)">
                        <Bond x1={140} y1={180} x2={200} y2={180} />
                        <Bond x1={200} y1={180} x2={200} y2={240} />
                        <Bond x1={200} y1={180} x2={260} y2={180} />
                        <Bond x1={260} y1={180} x2={285} y2={130} double />
                        <Bond x1={260} y1={180} x2={300} y2={220} />
                        
                        {/* Remaining H on N */}
                        <Bond x1={140} y1={180} x2={140} y2={230} /> 
                        <Atom cx={140} cy={230} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />

                        {/* AA2 Atoms */}
                        <Atom cx={200} cy={180} color="#475569" label="C" />
                        <rect x={180} y={240} width={40} height={40} rx={6} fill="#ffedd5" stroke="#fed7aa" strokeWidth="2" />
                        <text x={200} y={268} textAnchor="middle" fill="#9a3412" fontWeight="bold" fontSize="18">R</text>
                        <Atom cx={140} cy={180} color="#a855f7" label="N" />
                        <Atom cx={260} cy={180} color="#475569" label="C" />
                        <Atom cx={285} cy={130} color="#ef4444" label="O" />
                        <Atom cx={300} cy={220} color="#ef4444" label="O" />
                        <Atom cx={315} cy={235} color="#bae6fd" label="H" textColor="#0f172a" size={14} symbolSize="10px" />
                    </g>
                    
                    {/* AA1 Atoms */}
                    <Atom cx={140} cy={180} color="#a855f7" label="N" />
                    <Atom cx={110} cy={140} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />
                    <Atom cx={110} cy={220} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />
                    <Atom cx={200} cy={180} color="#475569" label="C" />
                    <rect x={180} y={240} width={40} height={40} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                    <text x={200} y={268} textAnchor="middle" fill="#0f172a" fontWeight="bold" fontSize="18">R</text>
                    <Atom cx={260} cy={180} color="#475569" label="C" />
                    <Atom cx={285} cy={130} color="#ef4444" label="O" />
                 </g>

                 {/* Water Molecule floating away (Downwards) */}
                 <g className="animate-float-away opacity-0" style={{ animation: 'floatAway 3s forwards ease-out' }}>
                     <circle cx={400} cy={80} r={40} fill="rgba(255,255,255,0.1)" filter="blur(10px)" />
                     <Atom cx={400} cy={80} color="#ef4444" label="O" />
                     <Atom cx={380} cy={100} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />
                     <Atom cx={420} cy={100} color="#bae6fd" label="H" textColor="#0f172a" size={15} symbolSize="10px" />
                     <text x={440} y={80} fill="#bae6fd" fontSize="20" fontWeight="bold">H₂O</text>
                 </g>
            </g>
            )}
        </svg>

        {/* CSS Animation Keyframes for Float Away - UPDATED to move DOWN */}
        <style>{`
          @keyframes floatAway {
            0% { transform: translate(0, 100px) scale(0.5); opacity: 0; }
            20% { opacity: 1; transform: translate(0, 150px) scale(1); }
            100% { transform: translate(0, 350px) rotate(20deg); opacity: 0; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-center h-20 w-full">
        {step === 2 && (
             <button 
                onClick={formBond}
                className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full font-bold shadow-2xl flex items-center transform transition-all hover:scale-105 text-xl ring-4 ring-green-500/30"
            >
                Form Peptide Bond <ArrowRight className="ml-3 w-6 h-6"/>
            </button>
        )}
        {step === 3 && (
            <button onClick={reset} className="flex items-center text-slate-500 hover:text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                <RotateCcw className="w-5 h-5 mr-2"/> Replay Reaction
            </button>
        )}
      </div>
    </div>
  );
};

export default PeptideLinker;