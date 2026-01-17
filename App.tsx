import React, { useState } from 'react';
import { ModuleType } from './types';
import AminoAcidBuilder from './components/AminoAcidBuilder';
import PeptideLinker from './components/PeptideLinker';
import DenaturationSim from './components/DenaturationSim';
import FunctionMatcher from './components/FunctionMatcher';
import Quiz from './components/Quiz';
import { Dna, Activity, Grid, BookOpen, GraduationCap, ArrowRight, MessageCircle } from 'lucide-react';
import { getTutorExplanation } from './services/geminiService';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.HOME);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.AMINO_BUILDER:
        return <AminoAcidBuilder />;
      case ModuleType.PEPTIDE_LINKER:
        return <PeptideLinker />;
      case ModuleType.FOLDING_SIM:
        return <DenaturationSim />;
      case ModuleType.FUNCTIONS:
        return <FunctionMatcher />;
      case ModuleType.QUIZ:
        return <Quiz topic="Proteins" />;
      default:
        return <Home onStart={() => setActiveModule(ModuleType.AMINO_BUILDER)} />;
    }
  };

  const handleAskTutor = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!tutorQuery.trim()) return;
      
      setIsTyping(true);
      const response = await getTutorExplanation(tutorQuery);
      setTutorResponse(response);
      setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveModule(ModuleType.HOME)}>
              <Dna className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-xl tracking-tight text-slate-900">ProteinMaster</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <NavButton active={activeModule === ModuleType.AMINO_BUILDER} onClick={() => setActiveModule(ModuleType.AMINO_BUILDER)} label="Structure" />
              <NavButton active={activeModule === ModuleType.PEPTIDE_LINKER} onClick={() => setActiveModule(ModuleType.PEPTIDE_LINKER)} label="Synthesis" />
              <NavButton active={activeModule === ModuleType.FOLDING_SIM} onClick={() => setActiveModule(ModuleType.FOLDING_SIM)} label="Folding" />
              <NavButton active={activeModule === ModuleType.FUNCTIONS} onClick={() => setActiveModule(ModuleType.FUNCTIONS)} label="Functions" />
              <NavButton active={activeModule === ModuleType.QUIZ} onClick={() => setActiveModule(ModuleType.QUIZ)} label="Quiz" icon={<GraduationCap className="w-4 h-4 ml-1"/>} />
            </div>
             {/* Mobile Menu Button (Simplified) */}
             <div className="md:hidden flex items-center">
                <span className="text-xs text-slate-400">Desktop View Recommended</span>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center w-full">
        {renderModule()}
      </main>

      {/* AI Tutor Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
          {tutorOpen ? (
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 md:w-96 overflow-hidden flex flex-col animate-fade-in-up">
                  <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <BrainIcon />
                        <h3 className="font-bold">AI Biology Tutor</h3>
                      </div>
                      <button onClick={() => setTutorOpen(false)} className="hover:bg-indigo-700 p-1 rounded"><XIcon /></button>
                  </div>
                  <div className="p-4 bg-slate-50 min-h-[150px] max-h-[300px] overflow-y-auto">
                        {!tutorResponse && !isTyping && <p className="text-slate-500 text-sm">Ask me anything about amino acids, translation, or protein structures!</p>}
                        {isTyping && <div className="flex items-center text-slate-500 text-sm"><span className="animate-pulse mr-1">Thinking</span>...</div>}
                        {tutorResponse && <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-800 shadow-sm">{tutorResponse}</div>}
                  </div>
                  <form onSubmit={handleAskTutor} className="p-3 border-t flex gap-2 bg-white">
                      <input 
                        type="text" 
                        value={tutorQuery}
                        onChange={(e) => setTutorQuery(e.target.value)}
                        placeholder="What is a codon?" 
                        className="flex-grow text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                      />
                      <button type="submit" className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">
                          <ArrowRight className="w-4 h-4" />
                      </button>
                  </form>
              </div>
          ) : (
              <button 
                onClick={() => setTutorOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-110 flex items-center gap-2 font-bold"
              >
                  <MessageCircle className="w-6 h-6" />
                  <span className="hidden md:inline">Ask AI Tutor</span>
              </button>
          )}
      </div>

    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    {label}
    {icon}
  </button>
);

const Home: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
    <div className="space-y-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
        Master the Logic of <span className="text-indigo-600">Life</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        A comprehensive, interactive guide to proteins for IB and AP Biology students. 
        Explore structure, synthesis, and function through simulation.
      </p>
      <button 
        onClick={onStart}
        className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        Start Learning
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
      <FeatureCard 
        icon={<Grid className="w-8 h-8 text-blue-500"/>}
        title="Interactive Models"
        desc="Build amino acids and link polypeptides yourself."
      />
      <FeatureCard 
        icon={<Activity className="w-8 h-8 text-green-500"/>}
        title="Dynamic Simulations"
        desc="Visualize denaturation and protein folding in real-time."
      />
      <FeatureCard 
        icon={<BookOpen className="w-8 h-8 text-purple-500"/>}
        title="AI-Powered Practice"
        desc="Unlimited quiz questions generated by Gemini AI."
      />
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

// Small helpers for icons
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
)
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
)

export default App;
