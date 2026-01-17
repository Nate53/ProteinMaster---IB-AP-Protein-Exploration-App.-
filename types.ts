export enum ModuleType {
  HOME = 'HOME',
  AMINO_BUILDER = 'AMINO_BUILDER',
  PEPTIDE_LINKER = 'PEPTIDE_LINKER',
  FOLDING_SIM = 'FOLDING_SIM',
  FUNCTIONS = 'FUNCTIONS',
  QUIZ = 'QUIZ',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface ProteinFunction {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
}

export const PROTEIN_FUNCTIONS: ProteinFunction[] = [
  { id: '1', name: 'Rubisco', role: 'Catalysis', category: 'Enzyme', description: 'Catalyzes the fixation of CO2 from the atmosphere during photosynthesis.' },
  { id: '2', name: 'Insulin', role: 'Hormone', category: 'Signaling', description: 'A hormone produced by the pancreas that regulates blood glucose levels.' },
  { id: '3', name: 'Immunoglobulin', role: 'Immunity', category: 'Antibody', description: 'Antibodies that identify and neutralize foreign objects like bacteria and viruses.' },
  { id: '4', name: 'Rhodopsin', role: 'Receptor', category: 'Sensory', description: 'A pigment in the photoreceptor cells of the retina responsible for vision in low light.' },
  { id: '5', name: 'Collagen', role: 'Structure', category: 'Fibrous', description: 'Provides tensile strength to skin, tendons, and ligaments. Forms a triple helix.' },
  { id: '6', name: 'Spider Silk', role: 'Structure', category: 'Fibrous', description: 'A fibrous protein spun by spiders, possessing high tensile strength and extensibility.' },
  { id: '7', name: 'Hemoglobin', role: 'Transport', category: 'Globular', description: 'Carries oxygen in red blood cells. Consists of 4 polypeptides and heme groups.' },
  { id: '8', name: 'Actin/Myosin', role: 'Movement', category: 'Contractile', description: 'Proteins responsible for muscle contraction.' },
];
