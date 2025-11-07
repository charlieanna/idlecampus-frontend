/**
 * Module 7: Chemical Equilibrium and Ionic Equilibrium
 */

import type { ChemistryModule } from '../../types';

export const equilibriumModule: ChemistryModule = {
  id: 'class11-equilibrium',
  slug: 'equilibrium',
  title: 'Chemical Equilibrium and Ionic Equilibrium',
  description: 'Master equilibrium concepts, Le Chatelier\'s principle, pH, buffers, and solubility.',
  icon: 'scale',
  sequenceOrder: 7,
  estimatedHours: 18,
  topic: 'physical',
  difficulty: 'hard',
  prerequisites: ['class11-thermodynamics'],
  learningOutcomes: [
    'Understand dynamic equilibrium and equilibrium constant',
    'Apply Le Chatelier\'s principle',
    'Calculate pH and pOH of solutions',
    'Understand buffer solutions and their applications',
    'Apply Henderson-Hasselbalch equation',
    'Calculate solubility product (Ksp)',
    'Understand common ion effect',
  ],
  items: [
    {
      id: 'eq-lesson-1',
      title: 'Dynamic Equilibrium and Le Chatelier\'s Principle',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'eq-lesson-1',
        title: 'Dynamic Equilibrium and Le Chatelier\'s Principle',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Dynamic Equilibrium and Le Chatelier's Principle

## What is Chemical Equilibrium?

**Chemical equilibrium** is a state where the **forward and reverse reactions occur at equal rates**, resulting in no net change in concentrations of reactants and products.

> **Key Insight**: Equilibrium is DYNAMIC, not static. Reactions continue happening in both directions, but with no observable change.

**Analogy**: Imagine two people transferring water between buckets at equal rates - water levels stay constant, but transfer continues!

### Characteristics of Equilibrium

1. **Dynamic process**: Both forward and reverse reactions occur continuously
2. **Equal rates**: Rate_forward = Rate_reverse
3. **Constant concentrations**: [Reactants] and [Products] remain unchanged
4. **Closed system**: No exchange of matter with surroundings
5. **Macroscopic properties** constant (color, pressure, temperature, etc.)
6. **Can be approached from either direction**

## Equilibrium Constant (K)

For a general reaction:
$$aA + bB \\rightleftharpoons cC + dD$$

The **equilibrium constant** expression is:

$$K = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

where [  ] represents molar concentration at equilibrium.

### Important Points About K

1. **K is temperature-dependent** (changes with T)
2. **K is independent of** initial concentrations, pressure, catalyst
3. **Large K (>> 1)**: Products heavily favored (equilibrium lies to right)
4. **Small K (<< 1)**: Reactants heavily favored (equilibrium lies to left)
5. **K ≈ 1**: Significant amounts of both reactants and products

### Types of Equilibrium Constants

#### 1. K_c (Concentration-based)
Used for reactions in solution.
$$K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

#### 2. K_p (Pressure-based)
Used for gas-phase reactions.
$$K_p = \\frac{P_C^c \\cdot P_D^d}{P_A^a \\cdot P_B^b}$$

#### 3. Relationship Between K_p and K_c

$$K_p = K_c(RT)^{\\Delta n}$$

where:
- R = 0.0821 L·atm/(mol·K)
- T = Temperature (K)
- Δn = (moles of gaseous products) - (moles of gaseous reactants)

**Special case**: If Δn = 0, then K_p = K_c

## Reaction Quotient (Q)

**Reaction quotient Q** has the same form as K but uses **non-equilibrium** concentrations.

$$Q = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

### Predicting Direction of Reaction

| Comparison | Meaning | Direction |
|------------|---------|-----------|
| **Q < K** | Too few products | Reaction shifts RIGHT (→) |
| **Q = K** | At equilibrium | No net change |
| **Q > K** | Too many products | Reaction shifts LEFT (←) |

**Mnemonic**: Q < K means "need more products" → reaction goes forward.

## Le Chatelier's Principle

> **Le Chatelier's Principle**: If a system at equilibrium is subjected to a stress (change in concentration, pressure, or temperature), the system shifts to counteract the stress.

### 1. Effect of Concentration Change

**Adding reactant or removing product**: Equilibrium shifts RIGHT (→)
**Removing reactant or adding product**: Equilibrium shifts LEFT (←)

**Example**: For $\\ce{N2 + 3H2 \\rightleftharpoons 2NH3}$

- Add N₂ → Shifts right, more NH₃ forms
- Remove NH₃ → Shifts right, more NH₃ forms
- Add NH₃ → Shifts left, more N₂ and H₂ form

### 2. Effect of Pressure Change (for gases)

Applies only when **Δn ≠ 0** (different number of gas moles).

**Increase pressure**: Shifts toward side with **fewer moles** of gas
**Decrease pressure**: Shifts toward side with **more moles** of gas

**Example**: $\\ce{N2(g) + 3H2(g) \\rightleftharpoons 2NH3(g)}$

- Left: 4 moles gas
- Right: 2 moles gas
- Increase pressure → Shifts RIGHT (toward fewer moles)

**Special case**: If Δn = 0, pressure change has **no effect**.

### 3. Effect of Temperature Change

**Exothermic reactions** (ΔH < 0): Heat is a product
- Increase T → Shifts LEFT (consumes heat)
- Decrease T → Shifts RIGHT (produces heat)

**Endothermic reactions** (ΔH > 0): Heat is a reactant
- Increase T → Shifts RIGHT (consumes heat)
- Decrease T → Shifts LEFT (produces heat)

**Important**: Temperature change **alters K value**! (Other factors don't change K)

### 4. Effect of Catalyst

**Catalyst**: NO effect on equilibrium position!

- Speeds up BOTH forward and reverse reactions equally
- Equilibrium reached faster, but same position
- K value unchanged

## Relationship Between ΔG° and K

From thermodynamics:

$$\\Delta G° = -RT \\ln K$$

Rearranging:

$$K = e^{-\\Delta G°/RT}$$

**Implications**:

| ΔG° | K | Equilibrium Position |
|-----|---|---------------------|
| ΔG° < 0 | K > 1 | Products favored |
| ΔG° = 0 | K = 1 | Equal amounts |
| ΔG° > 0 | K < 1 | Reactants favored |

Also:

$$\\Delta G° = \\Delta H° - T\\Delta S°$$

Combining with equilibrium constant provides deep insights!

## Worked Examples

### Example 1: Calculating K_c

**Q**: At equilibrium at 500 K: [N₂] = 0.20 M, [H₂] = 0.30 M, [NH₃] = 0.15 M.
Calculate K_c for: $\\ce{N2 + 3H2 \\rightleftharpoons 2NH3}$

**Solution**:
$$K_c = \\frac{[NH_3]^2}{[N_2][H_2]^3}$$

$$K_c = \\frac{(0.15)^2}{(0.20)(0.30)^3}$$

$$K_c = \\frac{0.0225}{(0.20)(0.027)} = \\frac{0.0225}{0.0054} = 4.17$$

### Example 2: Converting K_c to K_p

**Q**: For above reaction, calculate K_p at 500 K given K_c = 4.17.

**Solution**:
First, find Δn:
$$\\Delta n = 2 - (1 + 3) = 2 - 4 = -2$$

$$K_p = K_c(RT)^{\\Delta n}$$

$$K_p = 4.17 \\times (0.0821 \\times 500)^{-2}$$

$$K_p = 4.17 \\times (41.05)^{-2}$$

$$K_p = 4.17 \\times \\frac{1}{1685.1} = 2.47 \\times 10^{-3}$$

### Example 3: Using Reaction Quotient

**Q**: For $\\ce{H2 + I2 \\rightleftharpoons 2HI}$, K_c = 50 at 450°C.
If [H₂] = 0.1 M, [I₂] = 0.2 M, [HI] = 0.5 M, which direction will reaction proceed?

**Solution**:
Calculate Q:
$$Q = \\frac{[HI]^2}{[H_2][I_2]} = \\frac{(0.5)^2}{(0.1)(0.2)} = \\frac{0.25}{0.02} = 12.5$$

Compare: Q (12.5) < K (50)

**Answer**: Q < K, so reaction shifts RIGHT → More HI will form.

### Example 4: Le Chatelier's Principle

**Q**: For exothermic reaction: $\\ce{N2O4(g) \\rightleftharpoons 2NO2(g)}$ ΔH > 0

What happens if:
(a) Pressure increases?
(b) Temperature increases?
(c) NO₂ is removed?

**Solution**:

(a) **Pressure increase**:
- Left: 1 mole gas, Right: 2 moles gas
- Shifts LEFT (toward fewer moles) → More N₂O₄

(b) **Temperature increase**:
- Endothermic (ΔH > 0), heat is reactant
- Shifts RIGHT (consumes heat) → More NO₂

(c) **Remove NO₂**:
- Shifts RIGHT (to replace removed product) → More NO₂ forms

### Example 5: ICE Table

**Q**: Initially 1.0 mol H₂ and 1.0 mol I₂ in 1.0 L. At equilibrium, [HI] = 1.56 M.
Find K_c for: $\\ce{H2 + I2 \\rightleftharpoons 2HI}$

**Solution**:
Use **ICE table** (Initial, Change, Equilibrium):

|  | H₂ | I₂ | HI |
|--|----|----|-----|
| **I**nitial | 1.0 | 1.0 | 0 |
| **C**hange | -x | -x | +2x |
| **E**quilibrium | 1.0-x | 1.0-x | 2x |

Given: 2x = 1.56, so x = 0.78

At equilibrium:
- [H₂] = 1.0 - 0.78 = 0.22 M
- [I₂] = 1.0 - 0.78 = 0.22 M
- [HI] = 1.56 M

$$K_c = \\frac{[HI]^2}{[H_2][I_2]} = \\frac{(1.56)^2}{(0.22)(0.22)} = \\frac{2.43}{0.048} = 50.6$$

## Common Misconceptions

### ❌ Misconception 1: Equilibrium Means Equal Concentrations
**Reality**: Equilibrium means equal RATES, not equal concentrations. K can be >> 1 or << 1.

### ❌ Misconception 2: Catalyst Shifts Equilibrium
**Reality**: Catalyst only speeds up reaching equilibrium, doesn't change position or K.

### ❌ Misconception 3: Adding Solid/Liquid Changes Equilibrium
**Reality**: Pure solids and liquids have constant "concentration" (activity = 1), so adding more doesn't shift equilibrium.

### ❌ Misconception 4: Pressure Affects All Equilibria
**Reality**: Pressure only affects reactions with Δn ≠ 0 (change in gas moles).

## Key Takeaways

1. **Equilibrium**: Dynamic state where forward and reverse rates are equal
2. **K expression**: Products over reactants, raised to stoichiometric powers
3. **K > 1**: Products favored; **K < 1**: Reactants favored
4. **Q vs K**: Compare to predict direction (Q < K → right, Q > K → left)
5. **K_p = K_c(RT)^Δn**: Relationship for gas reactions
6. **Le Chatelier**: System shifts to oppose applied stress
7. **Concentration**: Add reactant → shifts right
8. **Pressure**: Increase → shifts toward fewer moles
9. **Temperature**: Increase favors endothermic direction; **changes K!**
10. **Catalyst**: No effect on position, only speed
`,
        objectives: [
          'Define dynamic equilibrium and equilibrium constant',
          'Write K_c and K_p expressions for reactions',
          'Convert between K_c and K_p',
          'Use reaction quotient Q to predict direction',
          'Apply Le Chatelier\'s principle to predict shifts',
          'Solve equilibrium problems using ICE tables',
        ],
        keyTerms: [
          { term: 'Dynamic Equilibrium', definition: 'State where forward and reverse rates are equal' },
          { term: 'Equilibrium Constant (K)', definition: 'Ratio of products to reactants at equilibrium' },
          { term: 'Reaction Quotient (Q)', definition: 'Same as K but for non-equilibrium conditions' },
          { term: 'Le Chatelier\'s Principle', definition: 'System shifts to oppose applied stress' },
          { term: 'ICE Table', definition: 'Initial-Change-Equilibrium method for solving problems' },
        ],
      },
    },
    {
      id: 'eq-lesson-2',
      title: 'Ionic Equilibrium: Acids, Bases, and pH',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'eq-lesson-2',
        title: 'Ionic Equilibrium: Acids, Bases, and pH',
        sequenceOrder: 2,
        estimatedMinutes: 50,
        content: `
# Ionic Equilibrium: Acids, Bases, and pH

## Arrhenius Theory

**Acids**: Produce H⁺ ions in water
$$\\ce{HCl -> H+ + Cl-}$$

**Bases**: Produce OH⁻ ions in water
$$\\ce{NaOH -> Na+ + OH-}$$

**Limitations**: Only works in water, doesn't explain NH₃ as base.

## Brønsted-Lowry Theory

**Acid**: Proton (H⁺) **donor**
**Base**: Proton (H⁺) **acceptor**

**Example**:
$$\\ce{HCl + H2O -> H3O+ + Cl-}$$
- HCl = acid (donates H⁺)
- H₂O = base (accepts H⁺)

$$\\ce{NH3 + H2O \\rightleftharpoons NH4+ + OH-}$$
- NH₃ = base (accepts H⁺)
- H₂O = acid (donates H⁺)

### Conjugate Acid-Base Pairs

When acid donates H⁺, it forms its **conjugate base**.
When base accepts H⁺, it forms its **conjugate acid**.

$$\\ce{HA + B \\rightleftharpoons A- + BH+}$$

**Pairs**: HA/A⁻ and BH⁺/B

**Example**: $\\ce{HCl + H2O -> H3O+ + Cl-}$
- HCl/Cl⁻ (acid/conjugate base)
- H₃O⁺/H₂O (conjugate acid/base)

**Important**: Stronger acid → Weaker conjugate base

## Lewis Theory

**Acid**: Electron pair **acceptor** (electrophile)
**Base**: Electron pair **donor** (nucleophile)

**Broadest definition** - includes reactions without H⁺!

**Example**: $\\ce{BF3 + NH3 -> F3B-NH3}$
- BF₃ = Lewis acid (accepts electron pair)
- NH₃ = Lewis base (donates electron pair)

## Ionization of Water

Water undergoes **autoionization**:

$$\\ce{H2O + H2O \\rightleftharpoons H3O+ + OH-}$$

Simplified: $\\ce{H2O \\rightleftharpoons H+ + OH-}$

**Ion product of water** (K_w):

$$K_w = [H^+][OH^-] = 1.0 \\times 10^{-14}$$ (at 25°C)

**Implications**:

| Solution | [H⁺] | [OH⁻] |
|----------|------|-------|
| **Neutral** | 10⁻⁷ M | 10⁻⁷ M |
| **Acidic** | > 10⁻⁷ M | < 10⁻⁷ M |
| **Basic** | < 10⁻⁷ M | > 10⁻⁷ M |

**Key relationship**: $[H^+][OH^-] = 10^{-14}$ **ALWAYS**

If [H⁺] increases, [OH⁻] must decrease proportionally!

## pH and pOH

**pH** is a measure of acidity:

$$pH = -\\log[H^+]$$

$$[H^+] = 10^{-pH}$$

**pOH** is a measure of basicity:

$$pOH = -\\log[OH^-]$$

$$[OH^-] = 10^{-pOH}$$

### Important Relationships

$$pH + pOH = 14$$ (at 25°C)

$$pK_w = pH + pOH = 14$$

### pH Scale

| pH Range | Classification | [H⁺] |
|----------|---------------|------|
| **0-3** | Strongly acidic | 1 to 10⁻³ M |
| **3-7** | Weakly acidic | 10⁻³ to 10⁻⁷ M |
| **7** | Neutral | 10⁻⁷ M |
| **7-11** | Weakly basic | 10⁻⁷ to 10⁻¹¹ M |
| **11-14** | Strongly basic | 10⁻¹¹ to 1 M |

**Each pH unit = 10× change in [H⁺]!**

pH 3 → pH 5 means [H⁺] decreases by 100×

## Strong vs Weak Acids/Bases

### Strong Acids (Completely Ionize)

Common strong acids:
- HCl, HBr, HI (hydrohalic acids except HF)
- HNO₃ (nitric acid)
- H₂SO₄ (sulfuric acid, first ionization)
- HClO₄ (perchloric acid)

For strong monoprotic acid: **[H⁺] = initial [acid]**

### Weak Acids (Partially Ionize)

$$\\ce{HA \\rightleftharpoons H+ + A-}$$

**Acid dissociation constant** (K_a):

$$K_a = \\frac{[H^+][A^-]}{[HA]}$$

**Larger K_a** = Stronger acid (more ionization)

**Common weak acids**: CH₃COOH (acetic), HF, H₃PO₄, carbonic acid

### Strong Bases (Completely Ionize)

Common strong bases:
- Group 1 hydroxides: LiOH, NaOH, KOH
- Group 2 hydroxides: Ca(OH)₂, Ba(OH)₂, Sr(OH)₂

For strong base: **[OH⁻] = initial [base]** × (number of OH⁻)

### Weak Bases (Partially Ionize)

$$\\ce{B + H2O \\rightleftharpoons BH+ + OH-}$$

**Base dissociation constant** (K_b):

$$K_b = \\frac{[BH^+][OH^-]}{[B]}$$

**Common weak bases**: NH₃, amines, pyridine

### Relationship Between K_a and K_b

For conjugate acid-base pair:

$$K_a \\times K_b = K_w = 1.0 \\times 10^{-14}$$

**Taking negative log**:

$$pK_a + pK_b = 14$$

## Calculating pH

### Case 1: Strong Acid

**Q**: Calculate pH of 0.01 M HCl.

**Solution**:
HCl completely ionizes: [H⁺] = 0.01 M = 10⁻² M

$$pH = -\\log(10^{-2}) = 2$$

### Case 2: Strong Base

**Q**: Calculate pH of 0.02 M NaOH.

**Solution**:
[OH⁻] = 0.02 M

$$pOH = -\\log(0.02) = 1.70$$

$$pH = 14 - 1.70 = 12.30$$

### Case 3: Weak Acid

**Q**: Calculate pH of 0.1 M CH₃COOH (K_a = 1.8 × 10⁻⁵).

**Solution**:
Use ICE table for: $\\ce{CH3COOH \\rightleftharpoons H+ + CH3COO-}$

|  | CH₃COOH | H⁺ | CH₃COO⁻ |
|--|---------|-----|---------|
| I | 0.1 | 0 | 0 |
| C | -x | +x | +x |
| E | 0.1-x | x | x |

$$K_a = \\frac{x^2}{0.1 - x} = 1.8 \\times 10^{-5}$$

**Assumption**: x << 0.1, so 0.1 - x ≈ 0.1

$$\\frac{x^2}{0.1} = 1.8 \\times 10^{-5}$$

$$x^2 = 1.8 \\times 10^{-6}$$

$$x = 1.34 \\times 10^{-3}$$ M = [H⁺]

$$pH = -\\log(1.34 \\times 10^{-3}) = 2.87$$

**Check assumption**: x/0.1 = 1.3% < 5% ✓ (assumption valid)

### Case 4: Weak Base

**Q**: Calculate pH of 0.1 M NH₃ (K_b = 1.8 × 10⁻⁵).

**Solution**:
$$\\ce{NH3 + H2O \\rightleftharpoons NH4+ + OH-}$$

$$K_b = \\frac{x^2}{0.1} = 1.8 \\times 10^{-5}$$

$$x = 1.34 \\times 10^{-3}$$ M = [OH⁻]

$$pOH = 2.87$$

$$pH = 14 - 2.87 = 11.13$$

## Polyprotic Acids

**Polyprotic acids** have multiple ionizable protons.

**Example**: H₂SO₄ (diprotic), H₃PO₄ (triprotic)

Each ionization has its own K_a:

For H₃PO₄:
- K_a1 = 7.5 × 10⁻³ (first ionization, strongest)
- K_a2 = 6.2 × 10⁻⁸ (second ionization)
- K_a3 = 4.8 × 10⁻¹³ (third ionization, weakest)

**Pattern**: K_a1 > K_a2 > K_a3

**Why?** Harder to remove H⁺ from increasingly negative species.

**For pH calculation**: Usually only first ionization matters (K_a1 >> K_a2).

## Common Misconceptions

### ❌ Misconception 1: pH = -log(initial acid concentration)
**Reality**: Only true for strong acids! For weak acids, must account for partial ionization.

### ❌ Misconception 2: Weak Acids Have High pH
**Reality**: Weak means partial ionization, NOT low acidity. Concentrated weak acid can have low pH.

### ❌ Misconception 3: Neutral Solution Has [H⁺] = [OH⁻]
**Reality**: True, AND both equal 10⁻⁷ M at 25°C. But neutrality is temperature-dependent!

### ❌ Misconception 4: Strong Conjugate Base = Strong Base
**Reality**: Conjugate base of weak acid is relatively strong (compared to conjugate of strong acid), but not necessarily a strong base like OH⁻.

## Key Takeaways

1. **Brønsted-Lowry**: Acids donate H⁺, bases accept H⁺
2. **K_w = [H⁺][OH⁻] = 10⁻¹⁴** at 25°C
3. **pH = -log[H⁺]**; **pOH = -log[OH⁻]**
4. **pH + pOH = 14**
5. **Strong acids/bases**: Complete ionization
6. **Weak acids/bases**: Partial ionization, use K_a or K_b
7. **K_a × K_b = K_w** for conjugate pairs
8. **Stronger acid → Weaker conjugate base**
9. **Polyprotic acids**: Multiple K_a values, K_a1 >> K_a2 >> K_a3
10. **pH calculations**: Use ICE tables for weak acids/bases
`,
        objectives: [
          'Compare Arrhenius, Brønsted-Lowry, and Lewis theories',
          'Identify conjugate acid-base pairs',
          'Calculate pH and pOH from [H⁺] and [OH⁻]',
          'Distinguish strong and weak acids/bases',
          'Calculate pH of strong and weak acid/base solutions',
          'Use K_a and K_b in equilibrium calculations',
        ],
        keyTerms: [
          { term: 'Brønsted-Lowry Acid', definition: 'Proton (H⁺) donor' },
          { term: 'pH', definition: '-log[H⁺]; measure of acidity' },
          { term: 'K_w', definition: 'Ion product of water = 10⁻¹⁴ at 25°C' },
          { term: 'K_a', definition: 'Acid dissociation constant; larger = stronger acid' },
          { term: 'Conjugate Pairs', definition: 'Acid and base differing by one H⁺' },
        ],
      },
    },
    {
      id: 'eq-lesson-3',
      title: 'Buffer Solutions and Solubility Equilibrium',
      type: 'lesson',
      sequenceOrder: 3,
      data: {
        id: 'eq-lesson-3',
        title: 'Buffer Solutions and Solubility Equilibrium',
        sequenceOrder: 3,
        estimatedMinutes: 50,
        content: `
# Buffer Solutions and Solubility Equilibrium

## What is a Buffer?

**Buffer solution** resists changes in pH when small amounts of acid or base are added.

### Components of Buffers

**Acidic buffer**: Weak acid + its conjugate base (salt)
- Example: CH₃COOH + CH₃COONa

**Basic buffer**: Weak base + its conjugate acid (salt)
- Example: NH₃ + NH₄Cl

**Key requirement**: Both components must be present in **significant** amounts.

## How Buffers Work

Consider acetic acid buffer: CH₃COOH/CH₃COO⁻

### Adding Strong Acid (H⁺):
$$\\ce{CH3COO- + H+ -> CH3COOH}$$

Conjugate base **neutralizes** added H⁺ → pH change minimized

### Adding Strong Base (OH⁻):
$$\\ce{CH3COOH + OH- -> CH3COO- + H2O}$$

Weak acid **neutralizes** added OH⁻ → pH change minimized

> **Analogy**: Buffer is like a shock absorber - it cushions the impact of added acid/base!

## Henderson-Hasselbalch Equation

For acidic buffer ($\\ce{HA \\rightleftharpoons H+ + A-}$):

$$pH = pK_a + \\log\\frac{[A^-]}{[HA]}$$

Or more generally:

$$pH = pK_a + \\log\\frac{[\\text{conjugate base}]}{[\\text{weak acid}]}$$

For basic buffer:

$$pOH = pK_b + \\log\\frac{[BH^+]}{[B]}$$

### Derivation (Optional)

Starting from: $K_a = \\frac{[H^+][A^-]}{[HA]}$

Rearrange: $[H^+] = K_a \\frac{[HA]}{[A^-]}$

Take -log: $-\\log[H^+] = -\\log K_a - \\log\\frac{[HA]}{[A^-]}$

$$pH = pK_a + \\log\\frac{[A^-]}{[HA]}$$

## Buffer Capacity

**Buffer capacity**: Amount of acid or base a buffer can neutralize before significant pH change.

### Factors Affecting Capacity

1. **Total concentration**: Higher concentration → Greater capacity
2. **Ratio of components**: Best when [A⁻]/[HA] ≈ 1 (equal amounts)

### Effective pH Range

Buffer works best when:

$$pH = pK_a \\pm 1$$

**Outside this range**, buffer capacity is poor.

**Choosing a buffer**: Select weak acid with pK_a close to desired pH!

## Worked Examples: Buffers

### Example 1: Henderson-Hasselbalch

**Q**: Calculate pH of buffer containing 0.1 M CH₃COOH and 0.15 M CH₃COO⁻.
(pK_a = 4.76)

**Solution**:
$$pH = pK_a + \\log\\frac{[CH_3COO^-]}{[CH_3COOH]}$$

$$pH = 4.76 + \\log\\frac{0.15}{0.1}$$

$$pH = 4.76 + \\log(1.5) = 4.76 + 0.18 = 4.94$$

### Example 2: Buffer After Adding Acid

**Q**: To 1.0 L of above buffer, 0.01 mol HCl is added. Calculate new pH.

**Solution**:

**Step 1**: HCl reacts with CH₃COO⁻:
$$\\ce{CH3COO- + H+ -> CH3COOH}$$

**Step 2**: New concentrations:
- [CH₃COO⁻] = 0.15 - 0.01 = 0.14 M
- [CH₃COOH] = 0.1 + 0.01 = 0.11 M

**Step 3**: Calculate new pH:
$$pH = 4.76 + \\log\\frac{0.14}{0.11} = 4.76 + 0.10 = 4.86$$

**Change**: 4.94 → 4.86 = **0.08 pH units only!**

**Comparison**: Without buffer, adding 0.01 M HCl gives pH ≈ 2 (huge change!)

### Example 3: Preparing a Buffer

**Q**: How to prepare pH 9.0 buffer? (K_b for NH₃ = 1.8 × 10⁻⁵, pK_b = 4.74)

**Solution**:

**Step 1**: Calculate pK_a of NH₄⁺ (conjugate acid):
$$pK_a = 14 - pK_b = 14 - 4.74 = 9.26$$

**Step 2**: pK_a (9.26) is close to desired pH (9.0) ✓

**Step 3**: Use Henderson-Hasselbalch:
$$9.0 = 9.26 + \\log\\frac{[NH_3]}{[NH_4^+]}$$

$$\\log\\frac{[NH_3]}{[NH_4^+]} = -0.26$$

$$\\frac{[NH_3]}{[NH_4^+]} = 10^{-0.26} = 0.55$$

**Answer**: Mix NH₃ and NH₄Cl in ratio 0.55:1 (or 11:20 molar ratio)

## Solubility Equilibrium

For sparingly soluble salt AB:

$$\\ce{AB(s) \\rightleftharpoons A+(aq) + B-(aq)}$$

**Solubility product** (K_sp):

$$K_{sp} = [A^+][B^-]$$

**Note**: Solid AB is **not included** (activity = 1).

### General Form

For $\\ce{A_xB_y(s) \\rightleftharpoons xA^{y+} + yB^{x-}}$:

$$K_{sp} = [A^{y+}]^x[B^{x-}]^y$$

**Examples**:
- AgCl: K_sp = [Ag⁺][Cl⁻]
- PbCl₂: K_sp = [Pb²⁺][Cl⁻]²
- Ag₂CrO₄: K_sp = [Ag⁺]²[CrO₄²⁻]

## Relationship Between K_sp and Solubility

**Solubility (S)**: Maximum amount that dissolves (mol/L or g/L)

For AB: $\\ce{AB \\rightleftharpoons A+ + B-}$

If solubility = S, then [A⁺] = S and [B⁻] = S

$$K_{sp} = S \\times S = S^2$$

$$S = \\sqrt{K_{sp}}$$

### For Different Stoichiometry

**AB₂**: $\\ce{AB2 \\rightleftharpoons A^{2+} + 2B-}$

If solubility = S: [A²⁺] = S, [B⁻] = 2S

$$K_{sp} = S(2S)^2 = 4S^3$$

$$S = \\sqrt[3]{\\frac{K_{sp}}{4}}$$

## Common Ion Effect

**Common ion effect**: Solubility of salt decreases when a common ion is present.

**Example**: AgCl is less soluble in NaCl solution than in pure water.

$$\\ce{AgCl(s) \\rightleftharpoons Ag+ + Cl-}$$

Adding Cl⁻ (from NaCl) shifts equilibrium LEFT (Le Chatelier!) → Less AgCl dissolves.

### Calculation

**Q**: Solubility of AgCl in pure water vs 0.1 M NaCl? (K_sp = 1.8 × 10⁻¹⁰)

**In pure water**:
$$K_{sp} = S^2$$
$$S = \\sqrt{1.8 \\times 10^{-10}} = 1.34 \\times 10^{-5}$$ M

**In 0.1 M NaCl**:
[Cl⁻] = 0.1 M (from NaCl) + S (from AgCl) ≈ 0.1 M

$$K_{sp} = [Ag^+][Cl^-] = S(0.1)$$

$$S = \\frac{1.8 \\times 10^{-10}}{0.1} = 1.8 \\times 10^{-9}$$ M

**Solubility decreased by ~7500×!**

## Predicting Precipitation

Use **ion product (Q_sp)** vs K_sp:

$$Q_{sp} = [A^+][B^-]$$ (using **current** concentrations)

| Comparison | Result |
|------------|--------|
| **Q_sp < K_sp** | **Unsaturated** - No precipitate, more can dissolve |
| **Q_sp = K_sp** | **Saturated** - At equilibrium |
| **Q_sp > K_sp** | **Supersaturated** - Precipitate forms |

### Example: Will Precipitation Occur?

**Q**: Mix 100 mL of 0.001 M AgNO₃ with 100 mL of 0.001 M NaCl.
Will AgCl precipitate? (K_sp = 1.8 × 10⁻¹⁰)

**Solution**:

**After mixing** (total volume = 200 mL):
- [Ag⁺] = (0.001)(100/200) = 5 × 10⁻⁴ M
- [Cl⁻] = (0.001)(100/200) = 5 × 10⁻⁴ M

$$Q_{sp} = [Ag^+][Cl^-] = (5 \\times 10^{-4})(5 \\times 10^{-4})$$

$$Q_{sp} = 2.5 \\times 10^{-7}$$

Compare: Q_sp (2.5 × 10⁻⁷) **>** K_sp (1.8 × 10⁻¹⁰)

**Answer**: YES, AgCl will precipitate!

## Selective Precipitation

By controlling ion concentration, we can precipitate one salt while keeping another dissolved.

**Example**: Separating Cl⁻ and CrO₄²⁻ using Ag⁺

- K_sp(AgCl) = 1.8 × 10⁻¹⁰
- K_sp(Ag₂CrO₄) = 1.2 × 10⁻¹²

AgCl precipitates first (lower K_sp requires less Ag⁺).

## Common Misconceptions

### ❌ Misconception 1: Buffers Work at Any pH
**Reality**: Buffers only work effectively within pK_a ± 1 range.

### ❌ Misconception 2: Larger K_sp = More Soluble
**Reality**: Only comparable for same stoichiometry! Can't directly compare K_sp of AB vs AB₂.

### ❌ Misconception 3: Buffers Prevent All pH Change
**Reality**: Buffers minimize pH change, but can't prevent it entirely. Capacity is finite!

### ❌ Misconception 4: K_sp Changes with Common Ion
**Reality**: K_sp is constant (at given T). Common ion shifts equilibrium but doesn't change K_sp.

## Key Takeaways

1. **Buffer**: Weak acid/base + conjugate pair; resists pH change
2. **Henderson-Hasselbalch**: pH = pK_a + log([A⁻]/[HA])
3. **Best buffer**: [A⁻] ≈ [HA], pH ≈ pK_a
4. **Effective range**: pK_a ± 1
5. **K_sp**: Solubility product for sparingly soluble salts
6. **Precipitation**: Occurs when Q_sp > K_sp
7. **Common ion effect**: Decreases solubility
8. **Selective precipitation**: Exploit different K_sp values
`,
        objectives: [
          'Explain how buffer solutions resist pH changes',
          'Apply Henderson-Hasselbalch equation',
          'Calculate buffer pH and changes upon acid/base addition',
          'Choose appropriate buffer for desired pH',
          'Calculate K_sp from solubility and vice versa',
          'Predict precipitation using Q_sp vs K_sp',
          'Explain common ion effect on solubility',
        ],
        keyTerms: [
          { term: 'Buffer', definition: 'Solution that resists pH change; weak acid/base + conjugate' },
          { term: 'Henderson-Hasselbalch', definition: 'pH = pK_a + log([A⁻]/[HA])' },
          { term: 'K_sp', definition: 'Solubility product; equilibrium constant for dissolution' },
          { term: 'Common Ion Effect', definition: 'Decreased solubility due to common ion presence' },
          { term: 'Selective Precipitation', definition: 'Separating ions by controlled precipitation' },
        ],
      },
    },
    {
      id: 'eq-quiz-1',
      title: 'Chemical Equilibrium Quiz',
      type: 'quiz',
      sequenceOrder: 4,
      data: {
        id: 'eq-quiz-1',
        title: 'Chemical Equilibrium Quiz',
        description: 'Test your understanding of equilibrium, Le Chatelier, acids/bases, buffers, and solubility.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'hard',
        questions: [
          {
            id: 'eq-q1',
            type: 'mcq',
            question: 'For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing pressure will:',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Shift equilibrium to the left',
              'Shift equilibrium to the right',
              'Not affect equilibrium position',
              'Increase K value'
            ],
            correctAnswer: 1,
            explanation: 'According to Le Chatelier\'s principle, increasing pressure shifts equilibrium toward the side with fewer gas moles. Left side has 4 total moles (1 N₂ + 3 H₂), right side has 2 moles NH₃. Therefore, equilibrium shifts RIGHT toward NH₃ (fewer moles). Note: Pressure change does NOT change K value, only the equilibrium position.',
          },
          {
            id: 'eq-q2',
            type: 'mcq',
            question: 'A reaction has K = 0.001. What does this indicate?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Products are highly favored',
              'Reactants are highly favored',
              'Equal amounts of reactants and products',
              'Reaction is at equilibrium'
            ],
            correctAnswer: 1,
            explanation: 'K = [products]/[reactants]. When K << 1 (much less than 1), the numerator is much smaller than denominator, meaning very few products form. K = 0.001 indicates reactants are highly favored - equilibrium lies far to the left. If K >> 1, products would be favored. K ≈ 1 means comparable amounts of both.',
          },
          {
            id: 'eq-q3',
            type: 'numerical',
            question: 'Calculate pH of 0.001 M HCl solution.',
            difficulty: 'easy',
            topic: 'physical',
            correctNumerical: 3,
            tolerance: 0.05,
            unit: '',
            explanation: 'HCl is a strong acid, so it completely ionizes: [H⁺] = 0.001 M = 10⁻³ M. Using pH = -log[H⁺]: pH = -log(10⁻³) = 3. Remember: Each pH unit represents a 10-fold change in [H⁺]. Strong acids completely dissociate, so pH calculation is straightforward.',
          },
          {
            id: 'eq-q4',
            type: 'mcq',
            question: 'Which of the following is a conjugate acid-base pair?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'HCl and NaOH',
              'NH₃ and NH₄⁺',
              'H₂O and H₂',
              'HNO₃ and HNO₂'
            ],
            correctAnswer: 1,
            explanation: 'A conjugate acid-base pair differs by exactly one H⁺. NH₃ (base) accepts H⁺ to become NH₄⁺ (conjugate acid), so they are a conjugate pair. Option 1: HCl/NaOH are both strong, unrelated. Option 3: H₂O/H₂ differ by O, not just H⁺. Option 4: HNO₃/HNO₂ differ by O atom, not a conjugate pair. Conjugate pairs: HA/A⁻ or B/BH⁺.',
          },
          {
            id: 'eq-q5',
            type: 'numerical',
            question: 'If [H⁺] = 2.5 × 10⁻⁵ M, calculate pH. (Use log(2.5) ≈ 0.4)',
            difficulty: 'medium',
            topic: 'physical',
            correctNumerical: 4.6,
            tolerance: 0.1,
            unit: '',
            explanation: 'pH = -log[H⁺] = -log(2.5 × 10⁻⁵). Using logarithm properties: -log(2.5 × 10⁻⁵) = -log(2.5) - log(10⁻⁵) = -0.4 - (-5) = -0.4 + 5 = 4.6. This solution is weakly acidic (pH < 7 but close to neutral). Remember: log(a × 10ⁿ) = log(a) + n.',
            hasLatex: true,
          },
          {
            id: 'eq-q6',
            type: 'mcq',
            question: 'What is the pH of a buffer made from equal molar amounts of CH₃COOH (pK_a = 4.76) and CH₃COO⁻?',
            difficulty: 'medium',
            topic: 'physical',
            options: ['3.76', '4.76', '5.76', '7.00'],
            correctAnswer: 1,
            explanation: 'Using Henderson-Hasselbalch equation: pH = pK_a + log([A⁻]/[HA]). When [CH₃COO⁻] = [CH₃COOH] (equal amounts), the ratio is 1, and log(1) = 0. Therefore: pH = pK_a + 0 = 4.76. This is a key principle: buffer has pH = pK_a when acid and conjugate base are in equal concentrations. This is also the pH where buffer capacity is maximum.',
            hasLatex: true,
          },
          {
            id: 'eq-q7',
            type: 'mcq',
            question: 'Adding a catalyst to a reaction at equilibrium will:',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'Shift equilibrium toward products',
              'Shift equilibrium toward reactants',
              'Change the value of K',
              'Have no effect on equilibrium position or K'
            ],
            correctAnswer: 3,
            explanation: 'Catalysts speed up BOTH forward and reverse reactions equally by lowering activation energy for both directions. They help reach equilibrium faster but do NOT change: (1) equilibrium position, (2) K value, or (3) final concentrations. Only temperature changes K. Catalysts are like adding a shortcut - you reach the same destination faster, but the destination doesn\'t change.',
          },
          {
            id: 'eq-q8',
            type: 'numerical',
            question: 'K_sp for AgBr is 5.0 × 10⁻¹³. Calculate solubility in mol/L. Express answer in scientific notation as coefficient only (e.g., for 7.1 × 10⁻⁷, enter 7.1).',
            difficulty: 'hard',
            topic: 'physical',
            correctNumerical: 7.1,
            tolerance: 0.5,
            unit: '× 10⁻⁷ M',
            explanation: 'For AgBr ⇌ Ag⁺ + Br⁻, if solubility = S, then [Ag⁺] = S and [Br⁻] = S. K_sp = [Ag⁺][Br⁻] = S². Therefore: S² = 5.0 × 10⁻¹³, so S = √(5.0 × 10⁻¹³) = √(50 × 10⁻¹⁴) = √50 × 10⁻⁷ ≈ 7.1 × 10⁻⁷ M. AgBr is very sparingly soluble (K_sp is very small), which is why it\'s used in photographic film.',
            hasLatex: true,
          },
          {
            id: 'eq-q9',
            type: 'mcq',
            question: 'For an endothermic reaction at equilibrium, increasing temperature will:',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'Shift left and decrease K',
              'Shift left and increase K',
              'Shift right and decrease K',
              'Shift right and increase K'
            ],
            correctAnswer: 3,
            explanation: 'For endothermic reaction (ΔH > 0), heat is a "reactant": Heat + Reactants ⇌ Products. Increasing temperature adds heat, shifting equilibrium RIGHT (Le Chatelier - system consumes added heat). Temperature is the ONLY factor that changes K. Since equilibrium shifts right (more products), K = [products]/[reactants] INCREASES. Summary: Endothermic + increase T → shifts right + increases K. Exothermic would be opposite.',
          },
        ],
      },
    },
  ],
};
