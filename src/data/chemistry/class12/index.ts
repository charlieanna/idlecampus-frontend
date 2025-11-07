/**
 * IIT JEE Chemistry - Class 12 Complete Curriculum
 *
 * Advanced topics for JEE Main/Advanced preparation
 */

import type { ChemistryCourse } from '../types';
import { solidStateModule } from './modules/01-solid-state';
import { solutionsModule } from './modules/02-solutions';
import { electrochemistryModule } from './modules/03-electrochemistry';
import { kineticsModule } from './modules/04-kinetics';
import { surfaceChemistryModule } from './modules/05-surface-chemistry';
import { pBlockModule } from './modules/06-p-block-15-18';
import { dBlockModule } from './modules/07-d-block';
import { coordinationModule } from './modules/08-coordination-compounds';
import { haloalkanesModule } from './modules/09-haloalkanes';
import { alcoholsPhenolsModule } from './modules/10-alcohols-phenols';
import { aldehydesKetonesModule } from './modules/11-aldehydes-ketones';
import { carboxylicAcidsModule } from './modules/12-carboxylic-acids';
import { aminesModule } from './modules/13-amines';
import { biomoleculesModule } from './modules/14-biomolecules';
import { polymersModule } from './modules/15-polymers';

export const class12ChemistryCourse: ChemistryCourse = {
  id: 'iit-jee-chemistry-class-12',
  slug: 'iit-jee-chemistry-class-12',
  title: 'IIT JEE Chemistry - Class 12',
  description: 'Advanced Chemistry course for IIT JEE covering all Class 12 topics with focus on problem-solving and conceptual mastery.',
  class: 12,
  difficultyLevel: 'hard',
  estimatedHours: 200,

  syllabus: `Complete NCERT Class 12 Chemistry aligned with JEE Main and JEE Advanced pattern`,

  examPattern: `
**JEE Main Pattern:**
- 20 questions (Physical: 7, Inorganic: 6, Organic: 7)
- Emphasis on numerical problems and conceptual application
- Higher difficulty than Class 11

**JEE Advanced Pattern:**
- Complex multi-concept integration questions
- Integer-type and matrix-match questions
- Requires deep understanding and problem-solving skills
`,

  modules: [
    solidStateModule,
    solutionsModule,
    electrochemistryModule,
    kineticsModule,
    surfaceChemistryModule,
    pBlockModule,
    dBlockModule,
    coordinationModule,
    haloalkanesModule,
    alcoholsPhenolsModule,
    aldehydesKetonesModule,
    carboxylicAcidsModule,
    aminesModule,
    biomoleculesModule,
    polymersModule,
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
