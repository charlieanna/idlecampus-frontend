import { getAllFamilies, getFamiliesForModule } from './problemFamilyMapping';

export interface FamilyNode {
  familyId: string;
  moduleId: number;
  level: number; // Derived from module (e.g. Module 0.5 -> Level 1, Module 1 -> Level 2)
  prerequisites: string[]; // List of familyIds
}

export class FamilyDependencyGraph {
  private nodes: Map<string, FamilyNode> = new Map();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;

    const allFamilies = getAllFamilies();

    // 1. Create nodes for all families
    allFamilies.forEach(f => {
      this.nodes.set(f.familyId, {
        familyId: f.familyId,
        moduleId: f.moduleId,
        level: this.mapModuleToLevel(f.moduleId),
        prerequisites: []
      });
    });

    // 2. Build dependencies based on module progression
    // Logic: Families in Module M depend on families in Module M (if ordered? no) 
    // and primarily depend on families in lower modules.
    // For Phase 1, we implement a "Module Gating" strategy:
    // A family in Module X depends on ALL families in the immediately preceding Module Y.
    // This ensures a strong foundation before moving up.

    const moduleIds = Array.from(new Set(allFamilies.map(f => f.moduleId))).sort((a, b) => a - b);

    for (let i = 1; i < moduleIds.length; i++) {
      const currentModuleId = moduleIds[i];
      const prevModuleId = moduleIds[i - 1];

      const currentModuleFamilies = getFamiliesForModule(currentModuleId);
      const prevModuleFamilies = getFamiliesForModule(prevModuleId);

      currentModuleFamilies.forEach(currentFamily => {
        const node = this.nodes.get(currentFamily.familyId);
        if (node) {
          // Depend on all families from the previous module
          node.prerequisites = prevModuleFamilies.map(f => f.familyId);
        }
      });
    }

    this.initialized = true;
  }

  private mapModuleToLevel(moduleId: number): number {
    // Rough mapping of modules to difficulty tiers (1-5)
    if (moduleId <= 1) return 1;      // Basics, Array Iteration
    if (moduleId <= 4) return 2;      // HashMap, Bit Manip, Two Pointer/Sliding Window
    if (moduleId <= 7) return 3;      // Python OOP, LinkedList, Trees, Bin Search
    if (moduleId <= 10) return 4;     // Graphs, Heaps
    return 5;                         // DP, Tries, Advanced
  }

  public getPrerequisites(familyId: string): string[] {
    return this.nodes.get(familyId)?.prerequisites || [];
  }

  public getLevel(familyId: string): number {
    return this.nodes.get(familyId)?.level || 1;
  }

  public getAllFamilyIds(): string[] {
    return Array.from(this.nodes.keys());
  }

  public getFamilyNode(familyId: string): FamilyNode | undefined {
    return this.nodes.get(familyId);
  }
}

// Singleton instance
export const familyDependencyGraph = new FamilyDependencyGraph();
