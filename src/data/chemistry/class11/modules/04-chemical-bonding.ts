/**
 * Module 4: Chemical Bonding and Molecular Structure
 */

import type { ChemistryModule } from '../../types';

export const chemicalBondingModule: ChemistryModule = {
  id: 'class11-chemical-bonding',
  slug: 'chemical-bonding',
  title: 'Chemical Bonding and Molecular Structure',
  description: 'Master ionic, covalent bonding, VSEPR theory, hybridization, and molecular orbital theory.',
  icon: 'link',
  sequenceOrder: 4,
  estimatedHours: 18,
  topic: 'physical',
  difficulty: 'medium',
  prerequisites: ['class11-atomic-structure', 'class11-periodic-classification'],
  learningOutcomes: [
    'Explain ionic, covalent, and coordinate bonding',
    'Apply VSEPR theory to predict molecular shapes',
    'Understand hybridization (sp, sp², sp³, sp³d, sp³d²)',
    'Describe molecular orbital theory and bond order',
    'Explain resonance and formal charges',
    'Understand intermolecular forces',
  ],
  items: [],
};
