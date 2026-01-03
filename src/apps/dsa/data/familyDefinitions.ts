import { ConceptFamily, ProblemVariation } from '../types/concept-families';
import { problemFamilyMappings, ProblemFamilyMapping } from './problemFamilyMapping';

/**
 * Transforms the flat problem-to-family mapping into a structured 
 * list of ConceptFamily objects, each containing its list of ProblemVariations.
 */
export function getAllConceptFamilies(): ConceptFamily[] {
  const familiesMap = new Map<string, ConceptFamily>();

  problemFamilyMappings.forEach((mapping: ProblemFamilyMapping) => {
    if (!familiesMap.has(mapping.familyId)) {
      familiesMap.set(mapping.familyId, {
        familyId: mapping.familyId,
        familyName: mapping.familyName,
        category: 'arrays-hashing', // Default, would need a real mapping or lookup
        concepts: [], // Placeholder
        variations: [],
        level: 1, // Placeholder
        moduleId: mapping.moduleId,
      });
    }

    const family = familiesMap.get(mapping.familyId)!;

    // Create a variation from the problem
    const variation: ProblemVariation = {
      variationId: mapping.problemId, // Using problemId as variationId for 1-to-1 mapping
      problemId: mapping.problemId,
      variationName: mapping.problemId // Use a readable name if available, else ID
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      difficulty: 'medium', // Placeholder default
      order: family.variations.length + 1
    };

    family.variations.push(variation);
  });

  return Array.from(familiesMap.values());
}
