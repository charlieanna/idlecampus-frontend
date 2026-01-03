
import { DSAProblem, DSATestCase } from '../types/dsa-course';

// Types for the Engine
export interface EngineState {
  weaknessScore: number;
  engagementScore: number;
  fatigueScore: number;
  topicHistory: string[];
}

export interface NavigationResult {
  action: 'upgrade' | 'stay' | 'downgrade' | 'tutor' | 'error';
  nextId?: string;
  message: string;
  courseModuleLink?: string;
}

export type GraderResult = 'STRONG_PASS' | 'SOFT_PASS' | 'HARD_FAIL' | 'SYNTAX_FAIL';

// --- Scorer Logic ---
export class Scorer {
  private static WEIGHT_WEAKNESS = 1.5;
  private static WEIGHT_ENGAGEMENT = 1.0;
  private static WEIGHT_FATIGUE = 2.0;

  static calculateRelevanceScore(weakness: number, engagement: number, fatigue: number): number {
    return (weakness * this.WEIGHT_WEAKNESS) +
      (engagement * this.WEIGHT_ENGAGEMENT) -
      (fatigue * this.WEIGHT_FATIGUE);
  }
}

// --- Navigator Logic ---
export class Navigator {
  private static courseModuleMap: Record<string, string> = {
    "Arrays_Hashing": "/module/arrays-hashing",
    "Two_Pointers_Sliding_Window": "/module/sliding-window-mastery",
    "Stack_Linked_List": "/module/linked-list-mastery",
    "Trees_Graphs": "/module/trees-traversals",
    "DP_Recursion": "/module/dynamic-programming",
    "Heaps_Intervals": "/module/heaps-priority-queues",
    "Design_Tries": "/module/tries-string-patterns",
    "Concurrency_Threading": "/module/concurrency-threading",
    "System_Design_Patterns": "/module/system-design-patterns",
    "OOD_Patterns": "/module/ood-patterns",
    "Async_Patterns": "/module/async-patterns"
  };

  static getNextStep(questionData: any, graderResult: GraderResult): NavigationResult {
    const familyTree = questionData.family_tree || {};
    const moduleName = questionData.module || "Unknown";

    if (graderResult === 'STRONG_PASS') {
      return {
        action: 'upgrade',
        nextId: familyTree.challenge_id,
        message: "Excellent. Optimal solution detected. Unlocking Challenge mutation."
      };
    } else if (graderResult === 'SOFT_PASS') {
      return {
        action: 'stay',
        nextId: questionData.id,
        message: "Passed, but suboptimal. Marking as 'Optimization Weakness'."
      };
    } else if (graderResult === 'HARD_FAIL') {
      return {
        action: 'downgrade',
        nextId: familyTree.remedial_id,
        message: "Logic error detected. Routing to Remedial Repair question."
      };
    } else if (graderResult === 'SYNTAX_FAIL') {
      const courseLink = this.courseModuleMap[moduleName];
      return {
        action: 'tutor',
        nextId: familyTree.tutorial_id,
        courseModuleLink: courseLink,
        message: "Syntax struggle detected. Routing to Tutor Mode (L0 Lesson)."
      };
    }

    return { action: 'error', message: "Unknown grader result" };
  }
}

// --- Grader Logic ---
export class Grader {
  // Simulates running code. In a real app, this would use a Pyodide worker or backend.
  static async gradeSubmission(code: string, testCases: any[]): Promise<GraderResult> {

    // 1. Mock Syntax Check
    if (code.includes("syntax_error")) {
      return 'SYNTAX_FAIL';
    }

    // 2. Mock Test Execution
    // For now, if the code is simply "pass" or empty, we fail it to simulate logic error.
    if (!code || code.trim() === "pass") {
      return 'HARD_FAIL';
    }

    // Simulate "Suboptimal" check mock
    // if code contains "O(N^2)" comment (mocking slow code), return SOFT_PASS
    if (code.includes("# slow")) {
      return 'SOFT_PASS';
    }

    // Otherwise, assume STRONG_PASS for this skeleton
    return 'STRONG_PASS';
  }
}

// --- Main Engine Service ---
export class AdaptiveEngine {
  private state: EngineState;

  constructor() {
    this.state = {
      weaknessScore: 0.5,
      engagementScore: 0.5,
      fatigueScore: 0.0,
      topicHistory: []
    };
  }

  // Helper to load content.
  // In a real app, you might lazily import these or fetch them.
  // For this prototype, we will fetch the JSONs.
  async loadModuleConfig(moduleId: string) {
    try {
      // Manual mapping for dynamic imports (Vite/Webpack friendly)
      switch (moduleId) {
        case '01_arrays_hashing':
          return {
            challenges: await import('../content/modules/01_arrays_hashing/challenges.json'),
            remedials: await import('../content/modules/01_arrays_hashing/remedials.json'),
            tutorials: await import('../content/modules/01_arrays_hashing/tutorials.json'),
            manifest: await import('../content/modules/01_arrays_hashing/manifest.json')
          };
        case '02_pointers_window':
          return {
            challenges: await import('../content/modules/02_pointers_window/challenges.json'),
            remedials: await import('../content/modules/02_pointers_window/remedials.json'),
            tutorials: await import('../content/modules/02_pointers_window/tutorials.json'),
            manifest: await import('../content/modules/02_pointers_window/manifest.json')
          };
        case '03_stack_linkedlist':
          return {
            challenges: await import('../content/modules/03_stack_linkedlist/challenges.json'),
            remedials: await import('../content/modules/03_stack_linkedlist/remedials.json'),
            tutorials: await import('../content/modules/03_stack_linkedlist/tutorials.json'),
            manifest: await import('../content/modules/03_stack_linkedlist/manifest.json')
          };
        case '04_trees_graphs':
          return {
            challenges: await import('../content/modules/04_trees_graphs/challenges.json'),
            remedials: await import('../content/modules/04_trees_graphs/remedials.json'),
            tutorials: await import('../content/modules/04_trees_graphs/tutorials.json'),
            manifest: await import('../content/modules/04_trees_graphs/manifest.json')
          };
        case '05_dp_recursion':
          return {
            challenges: await import('../content/modules/05_dp_recursion/challenges.json'),
            remedials: await import('../content/modules/05_dp_recursion/remedials.json'),
            tutorials: await import('../content/modules/05_dp_recursion/tutorials.json'),
            manifest: await import('../content/modules/05_dp_recursion/manifest.json')
          };
        case '06_heaps_intervals':
          return {
            challenges: await import('../content/modules/06_heaps_intervals/challenges.json'),
            remedials: await import('../content/modules/06_heaps_intervals/remedials.json'),
            tutorials: await import('../content/modules/06_heaps_intervals/tutorials.json'),
            manifest: await import('../content/modules/06_heaps_intervals/manifest.json')
          };
        case '07_design_tries':
          return {
            challenges: await import('../content/modules/07_design_tries/challenges.json'),
            remedials: await import('../content/modules/07_design_tries/remedials.json'),
            tutorials: await import('../content/modules/07_design_tries/tutorials.json'),
            manifest: await import('../content/modules/07_design_tries/manifest.json')
          };
        case '08_concurrency_threading':
        case 'concurrency-threading':
          return {
            challenges: await import('../content/modules/08_concurrency_threading/challenges.json'),
            remedials: await import('../content/modules/08_concurrency_threading/remedials.json'),
            tutorials: await import('../content/modules/08_concurrency_threading/tutorials.json'),
            manifest: await import('../content/modules/08_concurrency_threading/manifest.json')
          };
        case '09_system_design':
        case 'system-design-patterns':
          return {
            challenges: await import('../content/modules/09_system_design/challenges.json'),
            remedials: await import('../content/modules/09_system_design/remedials.json'),
            tutorials: await import('../content/modules/09_system_design/tutorials.json'),
            manifest: await import('../content/modules/09_system_design/manifest.json')
          };
        case '10_ood_patterns':
        case 'ood-patterns':
          return {
            challenges: await import('../content/modules/10_ood_patterns/challenges.json'),
            remedials: await import('../content/modules/10_ood_patterns/remedials.json'),
            tutorials: await import('../content/modules/10_ood_patterns/tutorials.json'),
            manifest: await import('../content/modules/10_ood_patterns/manifest.json')
          };
        case '11_async_patterns':
        case 'async-patterns':
          return {
            challenges: await import('../content/modules/11_async_patterns/challenges.json'),
            remedials: await import('../content/modules/11_async_patterns/remedials.json'),
            tutorials: await import('../content/modules/11_async_patterns/tutorials.json'),
            manifest: await import('../content/modules/11_async_patterns/manifest.json')
          };
        default:
          console.error(`Module ${moduleId} not found`);
          return null;
      }
    } catch (e) {
      console.error("Failed to load module config", e);
      return null;
    }
  }

  processSubmission(code: string, question: any): Promise<any> {
    return Grader.gradeSubmission(code, question.test_cases || [])
      .then(result => {
        const plan = Navigator.getNextStep(question, result);
        return { result, plan };
      });
  }
}
