import { CatContentModule } from './types';
import { timeAndWorkModule } from './quant/arithmetic/timeAndWork';
import { rcBusinessModule } from './varc/rc_business';
import { dilrArrangementsModule } from './dilr/arrangements';

import { functionsModule } from './quant/algebra/functions';

export const ALL_CAT_MODULES: CatContentModule[] = [
  timeAndWorkModule,
  rcBusinessModule,
  dilrArrangementsModule,
  gamesTournamentsModule,
  functionsModule
];

export const getModule = (topicId: string) => ALL_CAT_MODULES.find(m => m.topic.id === topicId);
export const getAllTopics = () => ALL_CAT_MODULES.map(m => m.topic);

export const getProblem = (problemId: string) => {
  for (const module of ALL_CAT_MODULES) {
    const p = module.problems.find(p => p.id === problemId);
    if (p) return p;
    // Check inside sets
    if (module.problemSets) {
      for (const set of module.problemSets) {
        const sub = set.subQuestions.find(sq => sq.id === problemId);
        if (sub) return sub;
      }
    }
  }
  return null;
};

export const getProblemSet = (setId: string) => {
  for (const module of ALL_CAT_MODULES) {
    if (module.problemSets) {
      const s = module.problemSets.find(s => s.id === setId);
      if (s) return s;
    }
  }
  return null;
};
