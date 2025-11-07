/**
 * Module 3: Periodic Classification of Elements
 */

import type { ChemistryModule } from '../../types';

export const periodicClassificationModule: ChemistryModule = {
  id: 'class11-periodic-classification',
  slug: 'periodic-classification',
  title: 'Periodic Classification of Elements',
  description: 'Understand periodic table organization, periodic trends, and periodic properties of elements.',
  icon: 'grid-3x3',
  sequenceOrder: 3,
  estimatedHours: 14,
  topic: 'inorganic',
  difficulty: 'medium',
  prerequisites: ['class11-atomic-structure'],
  learningOutcomes: [
    'Understand the development and organization of the periodic table',
    'Explain periodic law and periodic trends',
    'Predict properties based on position in periodic table',
    'Understand ionization energy, electron affinity, electronegativity trends',
    'Apply periodic trends to solve problems',
  ],
  items: [
    {
      id: 'pc-lesson-1',
      title: 'Development and Organization of Periodic Table',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'pc-lesson-1',
        title: 'Development and Organization of Periodic Table',
        sequenceOrder: 1,
        estimatedMinutes: 40,
        content: `
# Development and Organization of Periodic Table

## Historical Development

### Early Attempts at Classification

**Döbereiner's Triads (1829)**
- Grouped elements in sets of three with similar properties
- Middle element's atomic mass ≈ average of other two
- Example: Li (7), Na (23), K (39) → 23 ≈ (7+39)/2 = 23 ✓
- **Limitation**: Only a few triads could be identified

**Newlands' Law of Octaves (1865)**
- Arranged elements by increasing atomic mass
- Every 8th element had similar properties (like musical octaves)
- Example: Li, Be, B, C, N, O, F | Na (similar to Li)
- **Limitation**: Worked only up to calcium, broke down for heavier elements

### Mendeleev's Periodic Table (1869)

**Mendeleev's Periodic Law**:
> *Properties of elements are periodic function of their atomic masses*

**Key Features**:
1. Arranged 63 known elements by increasing atomic mass
2. Elements with similar properties in same vertical columns (groups)
3. **Bold predictions**: Left gaps for undiscovered elements
4. **Corrected atomic masses**: Adjusted some masses based on properties

**Example Predictions**:
- Predicted "Eka-aluminum" (later discovered as **Gallium**)
- Predicted "Eka-silicon" (later discovered as **Germanium**)

Mendeleev's predictions were remarkably accurate!

**Limitations**:
1. **Position of isotopes**: Isotopes would need different positions (same Z, different A)
2. **Anomalous pairs**: Co (58.9) placed before Ni (58.7) despite higher mass
3. **Position of hydrogen**: Doesn't fit well in any group
4. **No place for noble gases**: Discovered later

### Modern Periodic Law (Moseley, 1913)

After Moseley's work on X-ray spectra:

**Modern Periodic Law**:
> *Properties of elements are periodic function of their atomic numbers (Z)*

This resolved Mendeleev's anomalies!

## Modern Periodic Table Structure

### Organization

**Periods (Horizontal rows)**: 7 periods
- Period number = Number of electron shells
- Period 1: 2 elements (H, He)
- Period 2 & 3: 8 elements each (short periods)
- Period 4 & 5: 18 elements each (long periods)
- Period 6 & 7: 32 elements each (very long periods)

**Groups (Vertical columns)**: 18 groups
- Group number (1-18) indicates valence electrons for main group elements
- Elements in same group have similar properties

### Classification of Elements

**s-Block Elements** (Groups 1-2)
- Valence electrons in s-orbital
- Group 1: Alkali metals (ns¹)
- Group 2: Alkaline earth metals (ns²)
- Highly reactive metals

**p-Block Elements** (Groups 13-18)
- Valence electrons in p-orbital
- General configuration: ns² np¹⁻⁶
- Includes metals, metalloids, and non-metals
- Group 18: Noble gases (complete octet, very stable)

**d-Block Elements** (Groups 3-12)
- Transition metals
- Valence electrons in (n-1)d and ns orbitals
- General configuration: (n-1)d¹⁻¹⁰ ns¹⁻²
- Show variable oxidation states, colored compounds

**f-Block Elements**
- Inner transition metals
- Lanthanides (4f series): Ce to Lu
- Actinides (5f series): Th to Lr
- Placed separately below main table

### Metals, Non-metals, and Metalloids

**Metals** (Left and center of periodic table)
- Lustrous, malleable, ductile
- Good conductors of heat and electricity
- Form cations by losing electrons
- Examples: Na, Fe, Cu, Al

**Non-metals** (Right side of periodic table)
- Poor conductors (insulators)
- Form anions by gaining electrons
- Examples: O, N, Cl, S

**Metalloids** (Staircase line)
- Properties intermediate between metals and non-metals
- Semiconductors
- Examples: Si, Ge, As, Te

## Electronic Configuration and Periodicity

The periodic table reflects electronic configuration!

**Examples**:
- Group 1: [Noble gas] ns¹
- Group 17: [Noble gas] ns² np⁵
- Group 18: [Noble gas] ns² np⁶ (complete octet)

**Exceptions to Aufbau**:
- Cr: [Ar] 3d⁵ 4s¹ (half-filled d-orbital stability)
- Cu: [Ar] 3d¹⁰ 4s¹ (fully-filled d-orbital stability)

## Key Takeaways

1. Modern periodic table organized by atomic number (Z)
2. Periodic law: Properties repeat periodically with Z
3. 18 groups (vertical) and 7 periods (horizontal)
4. Four blocks: s, p, d, f based on valence electron location
5. Electronic configuration explains periodic trends
6. Position predicts properties

## Real-World Applications

- **Material Science**: Predicting properties of new materials
- **Drug Design**: Understanding chemical reactivity patterns
- **Semiconductor Industry**: Using metalloids (Si, Ge)
- **Environmental Chemistry**: Predicting behavior of pollutants
`,
        objectives: [
          'Trace the historical development of the periodic table',
          'Understand Mendeleev\'s contributions and predictions',
          'Explain the modern periodic law',
          'Describe the organization of the modern periodic table',
          'Classify elements into blocks based on electronic configuration',
        ],
        keyTerms: [
          { term: 'Periodic Law', definition: 'Properties of elements are periodic function of their atomic numbers' },
          { term: 'Period', definition: 'Horizontal row in periodic table; period number = number of shells' },
          { term: 'Group', definition: 'Vertical column in periodic table; elements with similar properties' },
          { term: 'Valence Electrons', definition: 'Electrons in outermost shell that participate in bonding' },
        ],
        misconceptions: [
          {
            misconception: 'Mendeleev arranged elements by atomic number',
            correction: 'Mendeleev used atomic mass; Moseley later reorganized by atomic number',
          },
          {
            misconception: 'All elements in a period have similar properties',
            correction: 'Elements in a GROUP (vertical column) have similar properties, not period',
          },
        ],
      },
    },
    {
      id: 'pc-lesson-2',
      title: 'Periodic Trends: Atomic and Ionic Radii',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'pc-lesson-2',
        title: 'Periodic Trends: Atomic and Ionic Radii',
        sequenceOrder: 2,
        estimatedMinutes: 45,
        content: `
# Periodic Trends: Atomic and Ionic Radii

## Atomic Radius

**Definition**: Half the distance between nuclei of two bonded atoms of same element.

$$r_{atomic} = \\frac{d}{2}$$

### Trend Across a Period (Left → Right)

**Atomic radius DECREASES** →

**Reason**:
1. Nuclear charge (Z) increases
2. Electrons added to same shell
3. **Effective nuclear charge (Z_eff) increases**
4. Stronger attraction → electrons pulled closer

**Example**: Period 2
- Li (152 pm) > Be (111 pm) > B (88 pm) > C (77 pm) > N (74 pm) > O (73 pm) > F (71 pm)

### Trend Down a Group (Top → Bottom)

**Atomic radius INCREASES** ↓

**Reason**:
1. New electron shell added
2. Increased distance from nucleus
3. **Shielding effect** of inner electrons
4. Weaker effective nuclear charge

**Example**: Group 1
- Li (152 pm) < Na (186 pm) < K (227 pm) < Rb (248 pm) < Cs (265 pm)

### Effective Nuclear Charge (Z_eff)

Not all nuclear charge is felt by outer electrons due to **shielding** by inner electrons.

$$Z_{eff} = Z - S$$

where:
- Z = Atomic number (actual nuclear charge)
- S = Shielding constant (screening by inner electrons)

**Example**: Na (Z = 11, configuration: 2,8,1)
- For outermost electron: $Z_{eff} \\approx 11 - 10 = 1$
- Inner 10 electrons shield the nuclear charge

## Ionic Radius

### Cation vs Parent Atom

**Cation < Parent Atom**

When metal loses electron(s):
1. Electron removed → less electron-electron repulsion
2. Nuclear charge remains same
3. Electrons pulled closer
4. Often entire outer shell removed

**Example**: 
- Na (186 pm) → Na⁺ (102 pm) [Lost entire 3rd shell!]
- Mg (160 pm) → Mg²⁺ (72 pm)

### Anion vs Parent Atom

**Anion > Parent Atom**

When non-metal gains electron(s):
1. Extra electron(s) added
2. Increased electron-electron repulsion
3. Nuclear charge remains same
4. Electron cloud expands

**Example**:
- F (71 pm) → F⁻ (133 pm)
- O (73 pm) → O²⁻ (140 pm)

### Isoelectronic Species

**Isoelectronic**: Same number of electrons, different nuclear charge

For isoelectronic species, **higher Z = smaller radius**

**Example**: All have 10 electrons
- N³⁻ (171 pm) > O²⁻ (140 pm) > F⁻ (133 pm) > Na⁺ (102 pm) > Mg²⁺ (72 pm) > Al³⁺ (54 pm)

As Z increases (7→13), radius decreases because more protons pull electrons tighter!

## Worked Examples

### Example 1: Comparing Atomic Radii
**Q**: Arrange in order of increasing atomic radius: P, S, Cl

**Solution**:
- All in Period 3
- Across period: radius decreases
- Order: **Cl < S < P**

### Example 2: Group Comparison
**Q**: Which is larger: Li or K?

**Solution**:
- Both in Group 1
- K is below Li (more shells)
- **K > Li**

### Example 3: Cation vs Anion
**Q**: Which is larger: Na⁺ or Cl⁻?

**Solution**:
- Both isoelectronic (10 electrons)
- Na⁺: Z = 11, Cl⁻: Z = 17
- Higher Z pulls electrons tighter
- **Cl⁻ > Na⁺**

Actually, wait - let me reconsider. Both have 10 electrons.
- Na⁺ has Z=11 (11 protons attracting 10 electrons)
- Cl⁻ has Z=17 (17 protons attracting 18 electrons)

Wait, Cl⁻ has 18 electrons (17 + 1 gained). They're NOT isoelectronic!

Let me correct:
- Na⁺: 11 protons, 10 electrons
- Cl⁻: 17 protons, 18 electrons
- Different electron configurations
- Cl⁻ has more shells and electrons
- **Cl⁻ > Na⁺** (181 pm vs 102 pm)

### Example 4: Isoelectronic Series
**Q**: Arrange in increasing order of size: O²⁻, F⁻, Na⁺, Mg²⁺ (all have 10 electrons)

**Solution**:
- All isoelectronic (10 e⁻)
- Z values: O(8), F(9), Na(11), Mg(12)
- Higher Z → smaller radius
- **Mg²⁺ < Na⁺ < F⁻ < O²⁻**

## Summary Table

| Trend | Across Period (→) | Down Group (↓) |
|-------|-------------------|----------------|
| Atomic Radius | Decreases | Increases |
| Reason | ↑ Z_eff | ↑ Shells, ↑ Shielding |

| Comparison | Trend | Reason |
|------------|-------|--------|
| Cation vs Atom | Cation < Atom | Lost electrons, less repulsion |
| Anion vs Atom | Anion > Atom | Gained electrons, more repulsion |
| Isoelectronic | Higher Z → Smaller | More protons attract same electrons |

## Key Takeaways

1. Atomic radius decreases across period, increases down group
2. Cations smaller than parent atoms
3. Anions larger than parent atoms
4. Isoelectronic species: size ∝ 1/Z
5. Effective nuclear charge explains trends

## Practice Problems

1. Arrange in order of increasing radius: Al, Cl, Na, P
2. Which is larger: K or K⁺? Explain why.
3. Arrange these isoelectronic species by size: S²⁻, Cl⁻, Ar, K⁺, Ca²⁺
4. Explain why atomic radius decreases across Period 3
`,
        objectives: [
          'Define atomic radius and ionic radius',
          'Explain periodic trends in atomic radius',
          'Predict relative sizes of atoms and ions',
          'Understand effective nuclear charge concept',
          'Compare sizes of isoelectronic species',
        ],
        keyTerms: [
          { term: 'Atomic Radius', definition: 'Half the distance between nuclei of two identical bonded atoms' },
          { term: 'Ionic Radius', definition: 'Radius of an ion (cation or anion)' },
          { term: 'Effective Nuclear Charge', definition: 'Net positive charge experienced by an electron' },
          { term: 'Shielding Effect', definition: 'Reduction in effective nuclear charge due to inner electrons' },
          { term: 'Isoelectronic', definition: 'Species with same number of electrons' },
        ],
      },
    },
    {
      id: 'pc-quiz-1',
      title: 'Periodic Trends Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'pc-quiz-1',
        title: 'Periodic Trends Quiz',
        description: 'Test your understanding of atomic radius, ionic radius, and periodic trends.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'pc-q1',
            type: 'mcq',
            question: 'Which of the following has the largest atomic radius?',
            difficulty: 'easy',
            topic: 'inorganic',
            options: ['Li', 'Na', 'K', 'Rb'],
            correctAnswer: 3,
            explanation: 'Atomic radius increases down a group due to addition of electron shells. Rb is lowest in Group 1, so it has the largest radius. Order: Li < Na < K < Rb.',
          },
          {
            id: 'pc-q2',
            type: 'mcq',
            question: 'Across Period 3 from left to right, atomic radius:',
            difficulty: 'easy',
            topic: 'inorganic',
            options: [
              'Increases due to more electrons',
              'Decreases due to increased nuclear charge',
              'Remains constant',
              'First increases then decreases',
            ],
            correctAnswer: 1,
            explanation: 'Across a period, atomic radius DECREASES because nuclear charge increases while electrons are added to the same shell. The increased effective nuclear charge pulls electrons closer to the nucleus.',
          },
          {
            id: 'pc-q3',
            type: 'mcq',
            question: 'Which ion is larger?',
            difficulty: 'medium',
            topic: 'inorganic',
            options: ['Na⁺', 'Mg²⁺', 'Al³⁺', 'All are same size'],
            correctAnswer: 0,
            explanation: 'All three are isoelectronic (10 electrons). For isoelectronic species, higher nuclear charge means smaller radius. Z values: Na(11), Mg(12), Al(13). Therefore: Na⁺ > Mg²⁺ > Al³⁺.',
            hasLatex: true,
          },
          {
            id: 'pc-q4',
            type: 'mcq',
            question: 'Why is a cation smaller than its parent atom?',
            difficulty: 'medium',
            topic: 'inorganic',
            options: [
              'It has gained electrons',
              'It has lost electrons, reducing electron-electron repulsion',
              'Nuclear charge decreases',
              'It has more shells',
            ],
            correctAnswer: 1,
            explanation: 'A cation forms by losing electron(s). With fewer electrons, there is less electron-electron repulsion, and the remaining electrons are pulled closer to the nucleus. Often, an entire outer shell is removed (e.g., Na → Na⁺ loses the 3rd shell).',
          },
          {
            id: 'pc-q5',
            type: 'mcq',
            question: 'Arrange in order of INCREASING size: F⁻, Na⁺, O²⁻ (all isoelectronic with 10 electrons)',
            difficulty: 'hard',
            topic: 'inorganic',
            options: [
              'F⁻ < Na⁺ < O²⁻',
              'Na⁺ < F⁻ < O²⁻',
              'O²⁻ < F⁻ < Na⁺',
              'Na⁺ < O²⁻ < F⁻',
            ],
            correctAnswer: 1,
            explanation: 'All have 10 electrons (isoelectronic). Z values: O(8), F(9), Na(11). Higher nuclear charge pulls electrons tighter, making the ion smaller. Therefore: Na⁺ (smallest, Z=11) < F⁻ (Z=9) < O²⁻ (largest, Z=8).',
            hasLatex: true,
          },
        ],
      },
    },
  ],
};
