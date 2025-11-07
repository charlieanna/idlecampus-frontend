/**
 * Module 1: Some Basic Concepts of Chemistry
 *
 * Foundation module covering mole concept, stoichiometry, and quantitative analysis
 */

import type { ChemistryModule } from '../../types';

export const basicConceptsModule: ChemistryModule = {
  id: 'class11-basic-concepts',
  slug: 'basic-concepts-chemistry',
  title: 'Some Basic Concepts of Chemistry',
  description: 'Master fundamental concepts including mole concept, stoichiometry, empirical and molecular formulas, and percentage composition.',
  icon: 'flask-conical',
  sequenceOrder: 1,
  estimatedHours: 12,
  topic: 'physical',
  difficulty: 'easy',

  learningOutcomes: [
    'Understand the mole concept and Avogadro\'s number',
    'Calculate empirical and molecular formulas',
    'Perform stoichiometric calculations for chemical reactions',
    'Determine limiting reagents and percentage yield',
    'Apply concentration concepts (molarity, molality, normality)',
    'Solve problems involving percentage composition',
  ],

  items: [
    {
      id: 'bc-lesson-1',
      title: 'Introduction to Chemistry and Matter',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'bc-lesson-1',
        title: 'Introduction to Chemistry and Matter',
        sequenceOrder: 1,
        estimatedMinutes: 30,
        content: `
# Introduction to Chemistry and Matter

## What is Chemistry?

Chemistry is the **scientific study of matter, its properties, composition, structure, and the changes it undergoes** during chemical reactions. Understanding chemistry is essential because it explains the world around us—from the air we breathe to the medicines that cure diseases.

## Classification of Matter

Matter can be classified in different ways:

### 1. States of Matter
- **Solid**: Definite shape and volume (e.g., ice, iron)
- **Liquid**: Definite volume but takes the shape of container (e.g., water, oil)
- **Gas**: Neither definite shape nor volume (e.g., air, oxygen)
- **Plasma**: Ionized gas at very high temperatures (e.g., stars)

### 2. Chemical Classification

#### Pure Substances
Substances with fixed composition and properties.

**Elements**: Cannot be broken down into simpler substances
- Examples: Gold (Au), Oxygen (O₂), Carbon (C)

**Compounds**: Formed by chemical combination of two or more elements in fixed ratio
- Examples: Water (H₂O), Salt (NaCl), Glucose (C₆H₁₂O₆)

#### Mixtures
Physical combination of two or more substances in any proportion.

**Homogeneous Mixtures (Solutions)**
- Uniform composition throughout
- Examples: Sugar solution, air, alloys

**Heterogeneous Mixtures**
- Non-uniform composition
- Examples: Sand in water, oil and water

## Properties of Matter

### Physical Properties
Can be observed without changing composition: color, melting point, boiling point, density, solubility

### Chemical Properties
Describe how a substance reacts: flammability, acidity, reactivity

## Laws of Chemical Combination

### 1. Law of Conservation of Mass (Lavoisier, 1789)
> *Mass is neither created nor destroyed in a chemical reaction*

$$\\text{Total mass of reactants} = \\text{Total mass of products}$$

### 2. Law of Definite Proportions (Proust, 1799)
> *A chemical compound always contains the same elements in the same proportion by mass*

Example: Water (H₂O) always contains H:O in 1:8 mass ratio

### 3. Law of Multiple Proportions (Dalton, 1803)
> *When two elements combine to form two or more compounds, the masses of one element that combine with fixed mass of other are in simple whole number ratio*

Example: CO and CO₂
- In CO: 12g C combines with 16g O
- In CO₂: 12g C combines with 32g O
- Ratio: 16:32 = 1:2 ✓

### 4. Gay-Lussac's Law of Gaseous Volumes (1808)
> *When gases react, they do so in volumes which bear simple whole number ratio (at same T and P)*

Example:
$$2H_2(g) + O_2(g) \\rightarrow 2H_2O(g)$$
Volume ratio: 2:1:2

### 5. Avogadro's Law (1811)
> *Equal volumes of all gases under same conditions of temperature and pressure contain equal number of molecules*

## Key Takeaways

1. Chemistry is the study of matter and its transformations
2. Matter can be classified as elements, compounds, or mixtures
3. Laws of chemical combination form the foundation of quantitative chemistry
4. These laws led to Dalton's Atomic Theory

## Real-World Applications

- **Food Industry**: Composition analysis ensures nutritional value
- **Pharmaceuticals**: Precise stoichiometry in drug formulation
- **Environmental Science**: Tracking pollutants using mass balance
- **Manufacturing**: Quality control through chemical analysis
`,
        objectives: [
          'Define chemistry and understand its importance',
          'Classify matter into elements, compounds, and mixtures',
          'State and apply the laws of chemical combination',
          'Understand the historical development of chemical concepts',
        ],
        keyTerms: [
          { term: 'Matter', definition: 'Anything that has mass and occupies space' },
          { term: 'Element', definition: 'Pure substance that cannot be broken down into simpler substances by chemical means' },
          { term: 'Compound', definition: 'Pure substance formed by chemical combination of two or more elements in a fixed ratio' },
          { term: 'Mixture', definition: 'Physical combination of two or more substances in any proportion' },
          { term: 'Stoichiometry', definition: 'Quantitative relationships between reactants and products in a chemical reaction' },
        ],
        importantConcepts: [
          'Law of Conservation of Mass is fundamental to all chemical calculations',
          'Law of Definite Proportions distinguishes compounds from mixtures',
          'Avogadro\'s Law connects volume of gases to number of particles',
        ],
        misconceptions: [
          {
            misconception: 'Mixtures and compounds are the same thing',
            correction: 'Mixtures have variable composition and can be separated physically, while compounds have fixed composition and require chemical methods to separate',
          },
          {
            misconception: 'Mass is lost during combustion',
            correction: 'Mass is conserved; gases formed escape into air, making it seem like mass is lost',
          },
        ],
      },
    },
    {
      id: 'bc-lesson-2',
      title: 'The Mole Concept and Avogadro\'s Number',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'bc-lesson-2',
        title: 'The Mole Concept and Avogadro\'s Number',
        sequenceOrder: 2,
        estimatedMinutes: 45,
        content: `
# The Mole Concept and Avogadro's Number

## What is a Mole?

The **mole** (symbol: mol) is the SI unit for amount of substance. It's one of the most important concepts in chemistry.

> **Definition**: One mole is the amount of substance that contains as many particles (atoms, molecules, ions, etc.) as there are atoms in exactly 12 grams of carbon-12 (¹²C).

## Avogadro's Number (Nₐ)

The number of particles in one mole is called **Avogadro's number**:

$$N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1}$$

This means:
- 1 mole of any substance = $6.022 \\times 10^{23}$ particles

### Why do we need the mole concept?

Atoms and molecules are extremely small. Counting them individually is impossible. The mole provides a bridge between the microscopic world (atoms) and the macroscopic world (grams).

**Analogy**: Just like "dozen" means 12, "mole" means $6.022 \\times 10^{23}$.

## Molar Mass

**Molar mass** (M) is the mass of one mole of a substance, expressed in g/mol.

- Numerically equal to atomic mass (for elements) or molecular mass (for compounds)
- Example: Carbon has atomic mass = 12 u, so molar mass = 12 g/mol

### Calculating Molar Mass

**For elements**: Molar mass = Atomic mass in g/mol

**For compounds**: Sum of atomic masses of all atoms

Example: H₂O
$$M(H_2O) = 2 \\times M(H) + 1 \\times M(O)$$
$$= 2 \\times 1 + 16 = 18 \\text{ g/mol}$$

## Key Formulas

### 1. Number of Moles
$$n = \\frac{\\text{Given mass (g)}}{\\text{Molar mass (g/mol)}}$$

### 2. Number of Particles
$$N = n \\times N_A$$

where:
- $n$ = number of moles
- $N$ = number of particles
- $N_A$ = Avogadro's number

### 3. Mass from Moles
$$\\text{Mass (g)} = n \\times M$$

## Worked Examples

### Example 1: Basic Mole Calculation
**Q**: How many moles are present in 9g of water?

**Solution**:
- Molar mass of H₂O = 18 g/mol
- $n = \\frac{9}{18} = 0.5$ mol

### Example 2: Finding Number of Molecules
**Q**: How many molecules are present in 44g of CO₂?

**Solution**:
- Molar mass of CO₂ = 12 + 2(16) = 44 g/mol
- $n = \\frac{44}{44} = 1$ mol
- $N = 1 \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{23}$ molecules

### Example 3: Finding Number of Atoms
**Q**: How many oxygen atoms are in 44g of CO₂?

**Solution**:
- From Example 2: 1 mole of CO₂
- Each CO₂ molecule has 2 oxygen atoms
- Number of O atoms = $1 \\times 6.022 \\times 10^{23} \\times 2$
- $= 1.204 \\times 10^{24}$ atoms

## Molar Volume of Gases

At STP (Standard Temperature and Pressure: 273.15 K, 1 atm):
- **1 mole of any ideal gas occupies 22.4 L**

This is extremely useful for gas calculations!

$$n = \\frac{V}{22.4 \\text{ L/mol}}$$ (at STP)

### Example: Gas Volume
**Q**: What volume will 32g of O₂ occupy at STP?

**Solution**:
- Molar mass of O₂ = 32 g/mol
- $n = \\frac{32}{32} = 1$ mol
- Volume = $1 \\times 22.4 = 22.4$ L

## Percentage Composition

The percentage of each element in a compound:

$$\\% \\text{ of element} = \\frac{\\text{Mass of element in compound}}{\\text{Molar mass of compound}} \\times 100$$

### Example: Percentage Composition of H₂O
- Molar mass of H₂O = 18 g/mol
- Mass of H = 2 g, Mass of O = 16 g

$$\\% H = \\frac{2}{18} \\times 100 = 11.11\\%$$
$$\\% O = \\frac{16}{18} \\times 100 = 88.89\\%$$

## Common Mistakes to Avoid

1. **Confusing atomic mass with molar mass**: Atomic mass is in 'u', molar mass is in 'g/mol' (numerically same)
2. **Forgetting subscripts**: In H₂SO₄, there are 2 H atoms, not 1
3. **Wrong units**: Always check if mass is in grams when using molar mass
4. **Ignoring diatomic molecules**: O₂ has molar mass 32, not 16 g/mol

## Practice Problems

Try these on your own:

1. Calculate the number of moles in 49g of H₂SO₄
2. How many atoms are present in 0.1 mol of NH₃?
3. What is the mass of $3.01 \\times 10^{23}$ molecules of glucose (C₆H₁₂O₆)?
4. Calculate percentage composition of N in NH₃

## Key Takeaways

- The mole is a counting unit like dozen, but for $6.022 \\times 10^{23}$ particles
- Molar mass connects mass (grams) to amount (moles)
- Use $n = \\frac{m}{M}$ as your primary formula
- At STP, 1 mol of gas = 22.4 L
- Percentage composition helps analyze compound purity

## Real-World Applications

- **Medicine**: Dosage calculations based on moles
- **Industry**: Scaling up reactions from lab to factory
- **Environment**: Measuring pollutant concentrations
- **Food**: Nutritional content analysis
`,
        objectives: [
          'Define the mole and Avogadro\'s number',
          'Calculate molar mass of compounds',
          'Convert between mass, moles, and number of particles',
          'Apply mole concept to gases at STP',
          'Calculate percentage composition of compounds',
        ],
        keyTerms: [
          { term: 'Mole', definition: 'Amount of substance containing Avogadro\'s number of particles' },
          { term: 'Avogadro\'s Number', definition: '6.022 × 10²³, the number of particles in one mole' },
          { term: 'Molar Mass', definition: 'Mass of one mole of a substance in g/mol' },
          { term: 'STP', definition: 'Standard Temperature and Pressure (273.15 K, 1 atm)' },
        ],
        importantConcepts: [
          'Mole is the bridge between microscopic (atoms) and macroscopic (grams) worlds',
          'Avogadro\'s number is one of the fundamental constants in chemistry',
          'Molar volume (22.4 L at STP) applies to all ideal gases',
        ],
      },
    },
    // Quiz after mole concept
    {
      id: 'bc-quiz-1',
      title: 'Mole Concept Mastery Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'bc-quiz-1',
        title: 'Mole Concept Mastery Quiz',
        description: 'Test your understanding of mole concept, Avogadro\'s number, and molar mass calculations.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'bc-q1',
            type: 'mcq',
            question: 'What is Avogadro\'s number?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              '6.022 × 10²¹',
              '6.022 × 10²³',
              '3.011 × 10²³',
              '1.602 × 10⁻¹⁹',
            ],
            correctAnswer: 1,
            explanation: 'Avogadro\'s number is 6.022 × 10²³ mol⁻¹, representing the number of particles (atoms, molecules, ions) in one mole of any substance. This fundamental constant bridges the gap between microscopic particles and macroscopic quantities.',
          },
          {
            id: 'bc-q2',
            type: 'mcq',
            question: 'How many moles are present in 18g of water (H₂O)? (Molar mass of H₂O = 18 g/mol)',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              '0.5 mol',
              '1 mol',
              '2 mol',
              '18 mol',
            ],
            correctAnswer: 1,
            explanation: 'Using the formula n = mass/molar mass, we get n = 18g / 18 g/mol = 1 mol. This is a straightforward application of the mole concept.',
            hasLatex: true,
          },
          {
            id: 'bc-q3',
            type: 'mcq',
            question: 'How many molecules are present in 2 moles of CO₂?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              '6.022 × 10²³',
              '1.204 × 10²⁴',
              '3.011 × 10²³',
              '2.408 × 10²⁴',
            ],
            correctAnswer: 1,
            explanation: 'Number of molecules = moles × Avogadro\'s number = 2 × 6.022 × 10²³ = 1.204 × 10²⁴ molecules. Remember: multiply the number of moles by Nₐ to get the number of particles.',
            hasLatex: true,
          },
          {
            id: 'bc-q4',
            type: 'mcq',
            question: 'What is the molar mass of sulfuric acid (H₂SO₄)? (H=1, S=32, O=16 g/mol)',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              '49 g/mol',
              '98 g/mol',
              '100 g/mol',
              '82 g/mol',
            ],
            correctAnswer: 1,
            explanation: 'Molar mass of H₂SO₄ = 2(1) + 32 + 4(16) = 2 + 32 + 64 = 98 g/mol. Don\'t forget to multiply the atomic mass by the subscript for each element.',
            hasLatex: true,
          },
          {
            id: 'bc-q5',
            type: 'mcq',
            question: 'What volume will 16g of O₂ gas occupy at STP? (Molar mass of O₂ = 32 g/mol)',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              '11.2 L',
              '22.4 L',
              '5.6 L',
              '44.8 L',
            ],
            correctAnswer: 0,
            explanation: 'First find moles: n = 16/32 = 0.5 mol. At STP, 1 mole = 22.4 L, so 0.5 mol = 0.5 × 22.4 = 11.2 L. Remember the molar volume at STP!',
            hasLatex: true,
          },
          {
            id: 'bc-q6',
            type: 'mcq',
            question: 'According to the Law of Conservation of Mass, when 12g of carbon burns completely to form CO₂, and 32g of oxygen is consumed, what mass of CO₂ is formed?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              '20 g',
              '32 g',
              '44 g',
              '12 g',
            ],
            correctAnswer: 2,
            explanation: 'By Law of Conservation of Mass: Total mass of reactants = Total mass of products. Mass of CO₂ = 12g (C) + 32g (O₂) = 44g. Mass is always conserved in chemical reactions.',
            hasLatex: true,
          },
          {
            id: 'bc-q7',
            type: 'mcq',
            question: 'How many oxygen atoms are present in one molecule of glucose (C₆H₁₂O₆)?',
            difficulty: 'easy',
            topic: 'organic',
            options: [
              '1',
              '6',
              '12',
              '24',
            ],
            correctAnswer: 1,
            explanation: 'The subscript after O in C₆H₁₂O₆ is 6, meaning there are 6 oxygen atoms in one molecule of glucose. Always read chemical formulas carefully!',
            hasLatex: true,
          },
          {
            id: 'bc-q8',
            type: 'numerical',
            question: 'Calculate the percentage of oxygen in water (H₂O). (H=1, O=16 g/mol) Enter your answer rounded to 1 decimal place.',
            difficulty: 'medium',
            topic: 'physical',
            correctNumerical: 88.9,
            tolerance: 0.1,
            unit: '%',
            explanation: 'Molar mass of H₂O = 2(1) + 16 = 18 g/mol. Mass of O = 16g. Percentage of O = (16/18) × 100 = 88.89% ≈ 88.9%. This shows water is mostly oxygen by mass!',
            hasLatex: true,
          },
        ],
      },
    },
    // Continue with more lessons on stoichiometry...
    {
      id: 'bc-lesson-3',
      title: 'Stoichiometry and Chemical Equations',
      type: 'lesson',
      sequenceOrder: 4,
      data: {
        id: 'bc-lesson-3',
        title: 'Stoichiometry and Chemical Equations',
        sequenceOrder: 4,
        estimatedMinutes: 50,
        content: `
# Stoichiometry and Chemical Equations

## What is Stoichiometry?

**Stoichiometry** (from Greek: *stoicheion* = element, *metron* = measure) is the calculation of quantities of reactants and products in chemical reactions.

> It's the "math of chemistry" - quantitative relationships in reactions.

## Chemical Equations

A **chemical equation** is a symbolic representation of a chemical reaction.

### General Form
$$\\text{Reactants} \\rightarrow \\text{Products}$$

### Example
$$2H_2 + O_2 \\rightarrow 2H_2O$$

This tells us:
- 2 molecules of H₂ react with 1 molecule of O₂
- To produce 2 molecules of H₂O
- **Mole ratio**: 2:1:2

## Balancing Chemical Equations

Chemical equations must be balanced to satisfy the **Law of Conservation of Mass**.

### Steps to Balance:
1. Write the unbalanced equation with correct formulas
2. Count atoms of each element on both sides
3. Use coefficients (never change subscripts!) to balance
4. Check that all atoms balance

### Example: Combustion of Methane

**Unbalanced**:
$$CH_4 + O_2 \\rightarrow CO_2 + H_2O$$

**Step-by-step balancing**:

1. Balance C: Already balanced (1 on each side)
2. Balance H: 4 on left, 2 on right → Put 2 before H₂O
   $$CH_4 + O_2 \\rightarrow CO_2 + 2H_2O$$

3. Balance O: 2 on left, 4 on right → Put 2 before O₂
   $$CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O$$

**Balanced!** ✓

Count: C(1=1), H(4=4), O(4=4)

## Types of Chemical Reactions

### 1. Combination Reaction
Two or more substances combine to form one product.
$$2Mg + O_2 \\rightarrow 2MgO$$

### 2. Decomposition Reaction
One substance breaks down into two or more products.
$$2H_2O \\xrightarrow{\\text{electrolysis}} 2H_2 + O_2$$

### 3. Displacement Reaction
One element replaces another in a compound.
$$Zn + CuSO_4 \\rightarrow ZnSO_4 + Cu$$

### 4. Double Displacement Reaction
Exchange of ions between two compounds.
$$AgNO_3 + NaCl \\rightarrow AgCl + NaNO_3$$

## Stoichiometric Calculations

### Key Concept: Mole Ratio
The coefficients in a balanced equation give the **mole ratio**.

$$2H_2 + O_2 \\rightarrow 2H_2O$$

Mole ratio: H₂ : O₂ : H₂O = 2:1:2

### Steps for Stoichiometric Problems

1. **Write balanced equation**
2. **Convert given quantity to moles**
3. **Use mole ratio** from equation
4. **Convert back** to required units

### Example Problem 1: Mass-Mass Calculation

**Q**: How many grams of water are produced when 4g of H₂ reacts completely with O₂?

**Solution**:

Balanced equation: $2H_2 + O_2 \\rightarrow 2H_2O$

Step 1: Convert H₂ mass to moles
- Molar mass of H₂ = 2 g/mol
- Moles of H₂ = 4/2 = 2 mol

Step 2: Use mole ratio
- From equation: 2 mol H₂ produces 2 mol H₂O
- So, 2 mol H₂ → 2 mol H₂O

Step 3: Convert H₂O moles to mass
- Molar mass of H₂O = 18 g/mol
- Mass of H₂O = 2 × 18 = **36 g**

### Example Problem 2: Volume-Volume (Gases)

**Q**: What volume of O₂ (at STP) is needed to burn 44.8 L of CH₄ completely?

**Solution**:

Balanced equation: $CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O$

At STP, mole ratio = volume ratio for gases

From equation: 1 volume CH₄ needs 2 volumes O₂

Volume of O₂ = 44.8 × 2 = **89.6 L**

## Limiting Reagent

When reactants are not in stoichiometric ratio, one reactant gets completely consumed first - this is the **limiting reagent**. It limits the amount of product formed.

The other reactant in excess is called **excess reagent**.

### How to Find Limiting Reagent

1. Calculate moles of each reactant
2. Divide moles by stoichiometric coefficient
3. The reactant with **smallest ratio** is limiting reagent

### Example: Limiting Reagent

**Q**: 10 mol N₂ and 25 mol H₂ are reacted. Find the limiting reagent.

$$N_2 + 3H_2 \\rightarrow 2NH_3$$

**Solution**:

For N₂: $\\frac{10}{1} = 10$

For H₂: $\\frac{25}{3} = 8.33$

H₂ has smaller ratio → **H₂ is limiting reagent**

Amount of NH₃ formed will depend on H₂, not N₂.

## Percentage Yield

In practice, actual yield is often less than theoretical yield due to side reactions, incomplete reactions, or losses.

$$\\text{Percentage yield} = \\frac{\\text{Actual yield}}{\\text{Theoretical yield}} \\times 100\\%$$

### Example
If theoretical yield = 50g, actual yield = 40g

Percentage yield = (40/50) × 100 = **80%**

## Key Formulas Summary

| Concept | Formula |
|---------|---------|
| Moles from mass | $n = \\frac{m}{M}$ |
| Moles from volume (gas at STP) | $n = \\frac{V}{22.4}$ |
| Number of particles | $N = n \\times N_A$ |
| Percentage yield | $\\frac{\\text{Actual}}{\\text{Theoretical}} \\times 100$ |

## Common Mistakes

1. **Not balancing equations first** - Always balance before calculations
2. **Changing subscripts instead of coefficients** - Never alter chemical formulas
3. **Ignoring limiting reagent** - Check which reactant limits the reaction
4. **Unit errors** - Keep track of units throughout
5. **Forgetting molar mass** - Always convert mass to moles first

## Practice Problems

1. Balance: $Fe + O_2 \\rightarrow Fe_2O_3$
2. How many grams of CO₂ are formed when 24g of C burns completely?
3. If 5 mol A reacts with 10 mol B according to $A + 3B \\rightarrow AB_3$, find the limiting reagent.

## Real-World Applications

- **Industrial Production**: Optimizing reactant quantities to minimize waste
- **Environmental Science**: Calculating emissions from combustion
- **Pharmaceuticals**: Determining reactant amounts for drug synthesis
- **Food Industry**: Recipe scaling based on ingredient ratios

## Key Takeaways

- Balanced equations show mole ratios between reactants and products
- Stoichiometry connects quantities of all substances in a reaction
- Limiting reagent determines maximum product yield
- Always work in moles for stoichiometric calculations
`,
        objectives: [
          'Write and balance chemical equations',
          'Perform stoichiometric calculations using mole ratios',
          'Identify limiting reagent in reactions',
          'Calculate theoretical and percentage yield',
        ],
        keyTerms: [
          { term: 'Stoichiometry', definition: 'Quantitative relationships between reactants and products in chemical reactions' },
          { term: 'Limiting Reagent', definition: 'Reactant that is completely consumed and limits product formation' },
          { term: 'Theoretical Yield', definition: 'Maximum amount of product that can form from given reactants' },
          { term: 'Percentage Yield', definition: 'Ratio of actual yield to theoretical yield, expressed as percentage' },
        ],
      },
    },
  ],
};
