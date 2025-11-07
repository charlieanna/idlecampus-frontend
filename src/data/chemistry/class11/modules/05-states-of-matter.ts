/**
 * Module 5: States of Matter
 */

import type { ChemistryModule } from '../../types';

export const statesOfMatterModule: ChemistryModule = {
  id: 'class11-states-of-matter',
  slug: 'states-of-matter',
  title: 'States of Matter',
  description: 'Explore gas laws, kinetic theory, liquids, and solid state properties.',
  icon: 'layers',
  sequenceOrder: 5,
  estimatedHours: 15,
  topic: 'physical',
  difficulty: 'medium',
  prerequisites: ['class11-basic-concepts'],
  learningOutcomes: [
    'Apply gas laws (Boyle, Charles, Gay-Lussac, Avogadro)',
    'Use ideal gas equation PV = nRT',
    'Explain kinetic molecular theory of gases',
    'Understand real gases and van der Waals equation',
    'Describe liquids: vapor pressure, viscosity, surface tension',
    'Explain solid state structures and packing',
  ],
  items: [],
};
