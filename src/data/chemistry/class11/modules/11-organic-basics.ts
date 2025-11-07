/**
 * Module 11: Basic Principles of Organic Chemistry
 */

import type { ChemistryModule } from '../../types';

export const organicBasicsModule: ChemistryModule = {
  id: 'class11-organic-basics',
  slug: 'organic-basics',
  title: 'Basic Principles of Organic Chemistry',
  description: 'Foundation of organic chemistry: nomenclature, isomerism, reaction mechanisms, and functional groups.',
  icon: 'hexagon',
  sequenceOrder: 11,
  estimatedHours: 20,
  topic: 'organic',
  difficulty: 'medium',
  prerequisites: ['class11-chemical-bonding'],
  learningOutcomes: [
    'Understand carbon\'s unique properties (catenation, tetravalency)',
    'Apply IUPAC nomenclature rules',
    'Identify and classify isomers (structural, geometrical, optical)',
    'Understand reaction mechanisms (SN1, SN2, E1, E2)',
    'Identify electrophiles and nucleophiles',
    'Explain resonance and inductive effects',
    'Understand carbocation, carbanion, and free radical stability',
  ],
  items: [],
};
