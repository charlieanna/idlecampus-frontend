import { ConceptFamily, ProblemVariation, FamilyMasteryRecord } from '../types/concept-families';
import { getAllConceptFamilies } from '../data/familyDefinitions';

export class VariationSelector {
  /**
   * Selects the next appropriate variation for a user given their history.
   * 
   * Strategy:
   * 1. If in 'learning' mode, pick the first easy variation or the guided problem.
   * 2. If in 'mastery-challenge' mode, MUST pick a variation NOT in `usedVariations`.
   * 3. If all variations used, pick the one with worst performance (review).
   */
  public selectNextVariation(
    familyId: string,
    record: FamilyMasteryRecord
  ): ProblemVariation | null {

    const family = this.getFamilyDefinition(familyId);
    if (!family) {
      console.error(`Family ${familyId} not found`);
      return null;
    }

    const { variations } = family;

    // Sort variations by difficulty/order usually, but here we just need to find an unused one.
    // Ideally, we follow the 'order' field.
    const sortedVariations = [...variations].sort((a, b) => a.order - b.order);

    // 1. Find the first variation that hasn't been used yet
    const nextFresh = sortedVariations.find(v => !record.usedVariations.includes(v.variationId));

    if (nextFresh) {
      return nextFresh;
    }

    // 2. If all used (Edge case: user exhausted all 3-5 variations without mastery),
    // we might need to reset or pick the one with worst past performance.
    // For now, we'll return the last one or loop back to start.
    // Better strategy: Pick the 'easiest' one to rebuild confidence? 
    // Or random? Let's pick the first one to review.
    return sortedVariations[0];
  }

  /**
   * Helper to get full family definition including variations array.
   */
  private getFamilyDefinition(familyId: string): ConceptFamily | undefined {
    return getAllConceptFamilies().find(f => f.familyId === familyId) as ConceptFamily | undefined;
  }
}

export const variationSelector = new VariationSelector();
