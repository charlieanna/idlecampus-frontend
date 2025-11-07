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
  items: [
    {
      id: 'sm-lesson-1',
      title: 'Gas Laws and Ideal Gas Equation',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'sm-lesson-1',
        title: 'Gas Laws and Ideal Gas Equation',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Gas Laws and Ideal Gas Equation

## Properties of Gases

Gases have unique properties:
- **No fixed shape or volume** (take container shape)
- **Compressible** (large spaces between molecules)
- **Low density** compared to liquids/solids
- **Diffuse rapidly** (move freely)
- **Exert pressure** on container walls

## Gas Laws

### 1. Boyle's Law (1662)

At constant temperature, pressure is inversely proportional to volume.

$$P \\propto \\frac{1}{V}$$

$$PV = k \\text{ (constant)}$$

$$P_1V_1 = P_2V_2$$

**Graph**: Hyperbola (P vs V), Straight line (P vs 1/V)

**Example**: When you squeeze a balloon, volume decreases and pressure increases.

### 2. Charles's Law (1787)

At constant pressure, volume is directly proportional to absolute temperature.

$$V \\propto T$$

$$\\frac{V}{T} = k$$

$$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$

**Important**: Temperature MUST be in Kelvin (K = °C + 273.15)

**Graph**: Straight line (V vs T), extrapolates to -273.15°C (absolute zero)

### 3. Gay-Lussac's Law

At constant volume, pressure is directly proportional to absolute temperature.

$$P \\propto T$$

$$\\frac{P}{T} = k$$

$$\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$$

### 4. Avogadro's Law (1811)

At constant T and P, volume is proportional to number of moles.

$$V \\propto n$$

$$\\frac{V}{n} = k$$

**Equal volumes of gases at same T and P contain equal number of molecules.**

## Ideal Gas Equation

Combining all gas laws:

$$PV = nRT$$

where:
- P = Pressure (atm, Pa, bar)
- V = Volume (L, m³)
- n = Number of moles
- R = Universal gas constant = 0.0821 L·atm/(mol·K) = 8.314 J/(mol·K)
- T = Temperature (K)

**Alternative form**:

$$PV = \\frac{m}{M}RT$$

where m = mass, M = molar mass

**Density form**:

$$PM = dRT$$

where d = density = m/V

## Standard Temperature and Pressure (STP)

**STP conditions**:
- T = 273.15 K (0°C)
- P = 1 atm (101.325 kPa)

At STP: **1 mole of ideal gas = 22.4 L**

## Dalton's Law of Partial Pressures

In a mixture of non-reacting gases, total pressure equals sum of partial pressures.

$$P_{total} = P_1 + P_2 + P_3 + ...$$

**Partial pressure**: $P_i = X_i P_{total}$

where $X_i$ = mole fraction = $\\frac{n_i}{n_{total}}$

## Graham's Law of Diffusion/Effusion

Rate of diffusion/effusion is inversely proportional to square root of molar mass.

$$\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\sqrt{\\frac{d_2}{d_1}}$$

**Lighter gases diffuse faster!**

## Worked Examples

### Example 1: Boyle's Law
**Q**: A gas occupies 5.0 L at 2.0 atm. What volume at 1.0 atm (constant T)?

**Solution**:
$P_1V_1 = P_2V_2$
$(2.0)(5.0) = (1.0)V_2$
$V_2 = 10.0$ L

### Example 2: Ideal Gas Equation
**Q**: Calculate moles in 11.2 L of gas at STP.

**Solution**:
$PV = nRT$
$n = \\frac{PV}{RT} = \\frac{(1)(11.2)}{(0.0821)(273)}$
$n = 0.5$ mol

**Or simply**: At STP, 22.4 L = 1 mol, so 11.2 L = 0.5 mol

### Example 3: Density Calculation
**Q**: Calculate density of CO₂ at STP (M = 44 g/mol).

**Solution**:
$PM = dRT$
$d = \\frac{PM}{RT} = \\frac{(1)(44)}{(0.0821)(273)}$
$d = 1.96$ g/L

## Key Takeaways

1. Boyle: P ∝ 1/V (constant T)
2. Charles: V ∝ T (constant P)
3. Avogadro: V ∝ n (constant T, P)
4. PV = nRT combines all gas laws
5. At STP: 1 mol = 22.4 L
6. Lighter gases diffuse faster (Graham's law)
`,
        objectives: [
          'State and apply Boyle\'s, Charles\'s, and Avogadro\'s laws',
          'Use the ideal gas equation PV = nRT',
          'Calculate gas properties using gas laws',
          'Apply Dalton\'s law of partial pressures',
          'Use Graham\'s law for diffusion/effusion',
        ],
        keyTerms: [
          { term: 'Ideal Gas', definition: 'Hypothetical gas that perfectly obeys all gas laws' },
          { term: 'STP', definition: 'Standard Temperature and Pressure: 273.15 K and 1 atm' },
          { term: 'Partial Pressure', definition: 'Pressure exerted by one gas in a mixture' },
          { term: 'Mole Fraction', definition: 'Ratio of moles of component to total moles' },
        ],
      },
    },
    {
      id: 'sm-quiz-1',
      title: 'Gas Laws Quiz',
      type: 'quiz',
      sequenceOrder: 2,
      data: {
        id: 'sm-quiz-1',
        title: 'Gas Laws Quiz',
        description: 'Test your understanding of gas laws and ideal gas equation.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'sm-q1',
            type: 'mcq',
            question: 'According to Boyle\'s law, if volume of gas is halved at constant temperature, pressure will:',
            difficulty: 'easy',
            topic: 'physical',
            options: ['Double', 'Halve', 'Remain same', 'Quadruple'],
            correctAnswer: 0,
            explanation: 'Boyle\'s law: P₁V₁ = P₂V₂. If V₂ = V₁/2, then P₂ = 2P₁. Pressure inversely proportional to volume at constant temperature.',
          },
          {
            id: 'sm-q2',
            type: 'numerical',
            question: 'How many moles of gas are in 44.8 L at STP?',
            difficulty: 'easy',
            topic: 'physical',
            correctNumerical: 2,
            tolerance: 0.01,
            unit: 'mol',
            explanation: 'At STP, 1 mole = 22.4 L. Therefore, n = 44.8/22.4 = 2 mol.',
          },
          {
            id: 'sm-q3',
            type: 'mcq',
            question: 'Which gas will diffuse fastest?',
            difficulty: 'medium',
            topic: 'physical',
            options: ['O₂ (M=32)', 'N₂ (M=28)', 'He (M=4)', 'Cl₂ (M=71)'],
            correctAnswer: 2,
            explanation: 'Graham\'s law: Rate ∝ 1/√M. Helium has lowest molar mass (M=4), so it diffuses fastest. Lighter gases move faster.',
            hasLatex: true,
          },
        ],
      },
    },
  ],
};
