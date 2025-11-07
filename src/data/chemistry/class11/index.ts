/**
 * IIT JEE Chemistry - Class 11 Complete Curriculum
 *
 * Based on NCERT syllabus and JEE Main/Advanced pattern
 * Follows pedagogical best practices for deep conceptual learning
 */

import type { ChemistryCourse } from '../types';
import { basicConceptsModule } from './modules/01-basic-concepts';
import { atomicStructureModule } from './modules/02-atomic-structure';
import { periodicClassificationModule } from './modules/03-periodic-classification';
import { chemicalBondingModule } from './modules/04-chemical-bonding';
import { statesOfMatterModule } from './modules/05-states-of-matter';
import { thermodynamicsModule } from './modules/06-thermodynamics';
import { equilibriumModule } from './modules/07-equilibrium';
import { redoxReactionsModule } from './modules/08-redox-reactions';
import { hydrogenModule } from './modules/09-hydrogen-s-block';
import { pBlockIntroModule } from './modules/10-p-block-intro';
import { organicBasicsModule } from './modules/11-organic-basics';
import { hydrocarbonsModule } from './modules/12-hydrocarbons';
import { environmentalChemistryModule } from './modules/13-environmental-chemistry';

export const class11ChemistryCourse: ChemistryCourse = {
  id: 'iit-jee-chemistry-class-11',
  slug: 'iit-jee-chemistry-class-11',
  title: 'IIT JEE Chemistry - Class 11',
  description: 'Comprehensive Chemistry course for IIT JEE preparation covering all Class 11 topics with deep conceptual understanding, interactive visualizations, and extensive practice.',
  class: 11,
  difficultyLevel: 'medium',
  estimatedHours: 180,

  syllabus: `Complete NCERT Class 11 Chemistry aligned with JEE Main and JEE Advanced pattern`,

  examPattern: `
**JEE Main Pattern:**
- 20 questions (Physical: 7, Inorganic: 6, Organic: 7)
- Multiple Choice Questions (MCQs) and Numerical Value Questions
- Negative marking: -1 for incorrect MCQs

**JEE Advanced Pattern:**
- 18 questions per paper (2 papers)
- Single correct, multiple correct, matching, numerical
- Partial marking for multiple correct questions
`,

  modules: [
    basicConceptsModule,
    atomicStructureModule,
    periodicClassificationModule,
    chemicalBondingModule,
    statesOfMatterModule,
    thermodynamicsModule,
    equilibriumModule,
    redoxReactionsModule,
    hydrogenModule,
    pBlockIntroModule,
    organicBasicsModule,
    hydrocarbonsModule,
    environmentalChemistryModule,
  ],

  features: {
    hasInteractiveDiagrams: true,
    hasMoleculeVisualizer: true,
    hasPeriodicTable: true,
    hasLatexSupport: true,
    hasSpacedRepetition: true,
    hasAdaptiveLearning: true,
  },
};
