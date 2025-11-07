/**
 * Module 8: Redox Reactions
 */

import type { ChemistryModule } from '../../types';

export const redoxReactionsModule: ChemistryModule = {
  id: 'class11-redox',
  slug: 'redox-reactions',
  title: 'Redox Reactions',
  description: 'Learn oxidation-reduction reactions, oxidation numbers, and balancing redox equations.',
  icon: 'zap',
  sequenceOrder: 8,
  estimatedHours: 12,
  topic: 'physical',
  difficulty: 'medium',
  prerequisites: ['class11-basic-concepts'],
  learningOutcomes: [
    'Understand oxidation and reduction',
    'Assign oxidation numbers correctly',
    'Identify oxidizing and reducing agents',
    'Balance redox reactions (ion-electron method)',
    'Understand disproportionation reactions',
    'Apply redox concepts to electrochemistry',
  ],
  items: [
    {
      id: 'redox-lesson-1',
      title: 'Introduction to Redox and Oxidation Numbers',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'redox-lesson-1',
        title: 'Introduction to Redox and Oxidation Numbers',
        sequenceOrder: 1,
        estimatedMinutes: 45,
        content: `
# Introduction to Redox and Oxidation Numbers

## What are Redox Reactions?

**Redox reactions** are chemical reactions involving transfer of electrons between species.

**REDOX** = **RED**uction + **OX**idation (occurring simultaneously)

> **Key principle**: One species is oxidized while another is reduced - they always occur together!

## Classical Definitions

### Oxidation
- **Loss of electrons** (OIL: Oxidation Is Loss)
- Gain of oxygen
- Loss of hydrogen
- Increase in oxidation number

**Example**: $\\ce{2Mg + O2 -> 2MgO}$
- Mg loses electrons: Mg → Mg²⁺ + 2e⁻ (oxidized)

### Reduction
- **Gain of electrons** (RIG: Reduction Is Gain)
- Loss of oxygen
- Gain of hydrogen
- Decrease in oxidation number

**Example**: In same reaction above
- O gains electrons: O₂ + 4e⁻ → 2O²⁻ (reduced)

**Mnemonic**: **OIL RIG** (Oxidation Is Loss, Reduction Is Gain of electrons)

Another mnemonic: **LEO the lion says GER**
- **L**ose **E**lectrons = **O**xidation
- **G**ain **E**lectrons = **R**eduction

## Oxidizing and Reducing Agents

### Oxidizing Agent (Oxidant)
- **Causes oxidation** of another substance
- **Gets reduced** itself
- **Accepts electrons**

### Reducing Agent (Reductant)
- **Causes reduction** of another substance
- **Gets oxidized** itself
- **Donates electrons**

**Example**: $\\ce{2Mg + O2 -> 2MgO}$
- **Mg** is the reducing agent (gets oxidized)
- **O₂** is the oxidizing agent (gets reduced)

> **Remember**: The agent that gets oxidized is the reducing agent (seems backwards but makes sense - it reduces the other species!)

## Oxidation Number (Oxidation State)

**Oxidation number** is a hypothetical charge on an atom if all bonds were 100% ionic.

### Rules for Assigning Oxidation Numbers

#### Rule 1: Elements in Free State
Oxidation number = **0**

**Examples**:
- He, Ne, Ar: 0
- H₂, O₂, N₂, Cl₂: 0
- S₈, P₄: 0

#### Rule 2: Monatomic Ions
Oxidation number = **charge on ion**

**Examples**:
- Na⁺: +1
- Ca²⁺: +2
- Cl⁻: -1
- O²⁻: -2

#### Rule 3: Hydrogen
Usually **+1** (except in metal hydrides where it's -1)

**Examples**:
- HCl: H is +1
- H₂O: H is +1
- NaH: H is -1 (metal hydride)
- CaH₂: H is -1

#### Rule 4: Oxygen
Usually **-2** (except in peroxides -1, and superoxides)

**Examples**:
- H₂O: O is -2
- CO₂: O is -2
- H₂O₂: O is -1 (peroxide)
- KO₂: O is -1/2 (superoxide)
- OF₂: O is +2 (only with F!)

#### Rule 5: Fluorine
Always **-1** (most electronegative element)

#### Rule 6: Group 1 (Alkali Metals)
Always **+1** in compounds

#### Rule 7: Group 2 (Alkaline Earth Metals)
Always **+2** in compounds

#### Rule 8: Sum of Oxidation Numbers
In neutral molecule: Sum = **0**
In polyatomic ion: Sum = **charge on ion**

## Calculating Oxidation Numbers

### Example 1: H₂SO₄

Let oxidation number of S be x:

$$2(+1) + x + 4(-2) = 0$$
$$2 + x - 8 = 0$$
$$x = +6$$

**S is in +6 oxidation state**

### Example 2: Cr₂O₇²⁻

Let oxidation number of Cr be x:

$$2x + 7(-2) = -2$$
$$2x - 14 = -2$$
$$2x = 12$$
$$x = +6$$

**Cr is in +6 oxidation state**

### Example 3: NH₃

Let oxidation number of N be x:

$$x + 3(+1) = 0$$
$$x + 3 = 0$$
$$x = -3$$

**N is in -3 oxidation state**

### Example 4: KMnO₄ (Important!)

Let oxidation number of Mn be x:

$$+1 + x + 4(-2) = 0$$
$$1 + x - 8 = 0$$
$$x = +7$$

**Mn is in +7 oxidation state** (maximum for Mn)

## Identifying Redox Reactions

A reaction is redox if **oxidation numbers change**.

### Example 1: Is this redox?
$$\\ce{Zn + CuSO4 -> ZnSO4 + Cu}$$

**Check oxidation numbers**:
- Zn: 0 → +2 (oxidized, loses 2e⁻)
- Cu: +2 → 0 (reduced, gains 2e⁻)

**YES, this is redox!**
- Zn is reducing agent
- Cu²⁺ is oxidizing agent

### Example 2: Is this redox?
$$\\ce{HCl + NaOH -> NaCl + H2O}$$

**Check oxidation numbers**:
- H: +1 → +1 (no change)
- Cl: -1 → -1 (no change)
- Na: +1 → +1 (no change)
- O: -2 → -2 (no change)

**NO, not redox** (just acid-base neutralization)

### Example 3: Disproportionation
$$\\ce{Cl2 + 2NaOH -> NaCl + NaClO + H2O}$$

**Check oxidation numbers**:
- Cl₂: 0 → -1 (in NaCl, reduced)
- Cl₂: 0 → +1 (in NaClO, oxidized)

**Disproportionation**: Same element simultaneously oxidized and reduced!

## Types of Redox Reactions

### 1. Combination
$$\\ce{C + O2 -> CO2}$$
C: 0 → +4 (oxidized); O: 0 → -2 (reduced)

### 2. Decomposition
$$\\ce{2KClO3 -> 2KCl + 3O2}$$
Cl: +5 → -1 (reduced); O: -2 → 0 (oxidized)

### 3. Displacement
$$\\ce{Zn + 2HCl -> ZnCl2 + H2}$$
Zn: 0 → +2 (oxidized); H: +1 → 0 (reduced)

### 4. Disproportionation
$$\\ce{2H2O2 -> 2H2O + O2}$$
O (in H₂O₂): -1 → -2 (reduced) and -1 → 0 (oxidized)

## Worked Examples

### Example 1: Assign all oxidation numbers

**Q**: $\\ce{K2Cr2O7}$

**Solution**:
- K: +1 (Group 1)
- O: -2 (usual)
- Cr: Let it be x

$$2(+1) + 2x + 7(-2) = 0$$
$$2 + 2x - 14 = 0$$
$$2x = 12$$
$$x = +6$$

**Answer**: K = +1, Cr = +6, O = -2

### Example 2: Identify oxidizing and reducing agents

**Q**: $\\ce{2FeCl3 + SnCl2 -> 2FeCl2 + SnCl4}$

**Solution**:

Oxidation numbers:
- Fe: +3 → +2 (reduced, gain of 1e⁻)
- Sn: +2 → +4 (oxidized, loss of 2e⁻)

**Answer**:
- **Oxidizing agent**: FeCl₃ (contains Fe³⁺ which gets reduced)
- **Reducing agent**: SnCl₂ (contains Sn²⁺ which gets oxidized)

### Example 3: Is this redox?

**Q**: $\\ce{AgNO3 + NaCl -> AgCl + NaNO3}$

**Solution**:

Oxidation numbers:
- Ag: +1 → +1 (no change)
- N: +5 → +5 (no change)
- O: -2 → -2 (no change)
- Na: +1 → +1 (no change)
- Cl: -1 → -1 (no change)

**Answer**: **NO**, not redox (just precipitation/double displacement)

## Common Oxidizing Agents

| Oxidizing Agent | Gets Reduced To |
|-----------------|-----------------|
| KMnO₄ (acidic) | Mn²⁺ (+2) |
| KMnO₄ (neutral/basic) | MnO₂ (+4) |
| K₂Cr₂O₇ (acidic) | Cr³⁺ (+3) |
| Cl₂ | Cl⁻ (-1) |
| H₂O₂ | H₂O (-2) |
| O₂ | O²⁻ (-2) |

## Common Reducing Agents

| Reducing Agent | Gets Oxidized To |
|----------------|------------------|
| Zn | Zn²⁺ (+2) |
| Fe²⁺ | Fe³⁺ (+3) |
| H₂S | S (0) or SO₂ (+4) |
| H₂O₂ | O₂ (0) |
| C | CO₂ (+4) |

**Note**: H₂O₂ can act as BOTH oxidizing and reducing agent!

## Common Misconceptions

### ❌ Misconception 1: Oxidation Always Involves Oxygen
**Reality**: Oxidation means loss of electrons, doesn't require oxygen! (Though historically named after oxygen reactions)

### ❌ Misconception 2: Oxidizing Agent Gets Oxidized
**Reality**: Oxidizing agent CAUSES oxidation but GETS REDUCED itself. Reducing agent gets oxidized.

### ❌ Misconception 3: Oxidation Number = Actual Charge
**Reality**: Oxidation number is hypothetical (assumes 100% ionic bonds). Real charges in covalent molecules are different.

### ❌ Misconception 4: Higher Oxidation Number = More Oxidized
**Reality**: TRUE! Going from +2 to +4 IS oxidation (loss of electrons), even though both are positive.

## Key Takeaways

1. **Redox**: Reduction + Oxidation (always together)
2. **OIL RIG**: Oxidation Is Loss, Reduction Is Gain (of electrons)
3. **Oxidizing agent**: Gets reduced, accepts electrons
4. **Reducing agent**: Gets oxidized, donates electrons
5. **Oxidation number rules**: Essential for identifying redox
6. **Sum of oxidation numbers**: = 0 (neutral), = charge (ion)
7. **Disproportionation**: Same element both oxidized and reduced
8. **Identify redox**: Look for oxidation number changes
`,
        objectives: [
          'Define oxidation and reduction',
          'Assign oxidation numbers using systematic rules',
          'Identify oxidizing and reducing agents',
          'Distinguish redox from non-redox reactions',
          'Recognize disproportionation reactions',
        ],
        keyTerms: [
          { term: 'Oxidation', definition: 'Loss of electrons; increase in oxidation number' },
          { term: 'Reduction', definition: 'Gain of electrons; decrease in oxidation number' },
          { term: 'Oxidation Number', definition: 'Hypothetical charge if all bonds were ionic' },
          { term: 'Oxidizing Agent', definition: 'Causes oxidation; gets reduced itself' },
          { term: 'Disproportionation', definition: 'Same element simultaneously oxidized and reduced' },
        ],
      },
    },
    {
      id: 'redox-lesson-2',
      title: 'Balancing Redox Equations',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'redox-lesson-2',
        title: 'Balancing Redox Equations',
        sequenceOrder: 2,
        estimatedMinutes: 50,
        content: `
# Balancing Redox Equations

## Why Balance Redox Equations?

Many redox reactions are complex and cannot be balanced by inspection. We need systematic methods that ensure:
1. **Mass balance**: Same number of each atom on both sides
2. **Charge balance**: Same total charge on both sides

## Method 1: Ion-Electron (Half-Reaction) Method

This method splits redox into two half-reactions:
- **Oxidation half-reaction**
- **Reduction half-reaction**

Then combines them ensuring electrons cancel.

### Steps for Acidic Medium

**Step 1**: Write skeletal equation (unbalanced)

**Step 2**: Identify oxidation and reduction half-reactions

**Step 3**: Balance each half-reaction separately:
   a) Balance atoms other than O and H
   b) Balance O by adding H₂O
   c) Balance H by adding H⁺
   d) Balance charge by adding electrons (e⁻)

**Step 4**: Multiply half-reactions to equalize electrons

**Step 5**: Add half-reactions and cancel common terms

**Step 6**: Verify: atoms and charge balanced

### Example 1: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (acidic)

**Step 1**: Skeletal equation
$$\\ce{MnO4- + Fe^{2+} -> Mn^{2+} + Fe^{3+}}$$

**Step 2**: Separate half-reactions

Oxidation: $\\ce{Fe^{2+} -> Fe^{3+}}$
Reduction: $\\ce{MnO4- -> Mn^{2+}}$

**Step 3**: Balance each half-reaction

**Oxidation half**:
$$\\ce{Fe^{2+} -> Fe^{3+}}$$
(Atoms balanced)

Balance charge: Left +2, Right +3
Add 1e⁻ to right:
$$\\ce{Fe^{2+} -> Fe^{3+} + e-}$$

**Reduction half**:
$$\\ce{MnO4- -> Mn^{2+}}$$

Balance O with H₂O:
$$\\ce{MnO4- -> Mn^{2+} + 4H2O}$$

Balance H with H⁺:
$$\\ce{MnO4- + 8H+ -> Mn^{2+} + 4H2O}$$

Balance charge: Left = -1 + 8 = +7, Right = +2
Add 5e⁻ to left:
$$\\ce{MnO4- + 8H+ + 5e- -> Mn^{2+} + 4H2O}$$

**Step 4**: Equalize electrons

Oxidation (×5): $\\ce{5Fe^{2+} -> 5Fe^{3+} + 5e-}$
Reduction (×1): $\\ce{MnO4- + 8H+ + 5e- -> Mn^{2+} + 4H2O}$

**Step 5**: Add and cancel electrons

$$\\ce{MnO4- + 5Fe^{2+} + 8H+ -> Mn^{2+} + 5Fe^{3+} + 4H2O}$$

**Step 6**: Verify
- Mn: 1 = 1 ✓
- O: 4 = 4 ✓
- Fe: 5 = 5 ✓
- H: 8 = 8 ✓
- Charge: (-1 + 10 + 8) = 17; (2 + 15) = 17 ✓

**BALANCED!**

### Steps for Basic Medium

If reaction occurs in basic solution:

**Extra Step**: After balancing in acidic medium, convert H⁺ to H₂O by adding equal OH⁻ to both sides:

For each H⁺, add OH⁻ to both sides:
$$\\ce{H+ + OH- -> H2O}$$

### Example 2: MnO₄⁻ + I⁻ → MnO₂ + I₂ (basic)

**Step 1-5**: Balance in acidic first

**Reduction half**:
$$\\ce{MnO4- + 4H+ + 3e- -> MnO2 + 2H2O}$$

**Oxidation half** (×3):
$$\\ce{6I- -> 3I2 + 6e-}$$

**Multiply reduction by 2**:
$$\\ce{2MnO4- + 8H+ + 6e- -> 2MnO2 + 4H2O}$$

**Add**:
$$\\ce{2MnO4- + 6I- + 8H+ -> 2MnO2 + 3I2 + 4H2O}$$

**Step 6**: Convert to basic by adding 8OH⁻ to both sides:

$$\\ce{2MnO4- + 6I- + 8H+ + 8OH- -> 2MnO2 + 3I2 + 4H2O + 8OH-}$$

Combine H⁺ + OH⁻ → H₂O:
$$\\ce{2MnO4- + 6I- + 8H2O -> 2MnO2 + 3I2 + 4H2O + 8OH-}$$

Cancel 4H₂O from both sides:
$$\\ce{2MnO4- + 6I- + 4H2O -> 2MnO2 + 3I2 + 8OH-}$$

**FINAL BALANCED EQUATION (basic)**

## Method 2: Oxidation Number Method

This method uses change in oxidation numbers.

### Steps

**Step 1**: Assign oxidation numbers to all atoms

**Step 2**: Identify atoms that change oxidation number

**Step 3**: Calculate total increase and decrease in oxidation number

**Step 4**: Multiply to make total increase = total decrease

**Step 5**: Balance remaining atoms (usually O and H)

**Step 6**: Verify

### Example 3: Cu + HNO₃ → Cu(NO₃)₂ + NO + H₂O

**Step 1**: Assign oxidation numbers
- Cu: 0 → +2
- N: +5 → +2 (in NO)

**Step 2**: Changes
- Cu: 0 → +2 (increase of 2, oxidation)
- N: +5 → +2 (decrease of 3, reduction)

**Step 3**: Total change
To balance, need LCM of 2 and 3 = 6
- 3 Cu atoms oxidized: 3 × 2 = 6e⁻ lost
- 2 N atoms reduced: 2 × 3 = 6e⁻ gained

**Step 4**: Write equation with these coefficients
$$\\ce{3Cu + ?HNO3 -> 3Cu(NO3)2 + 2NO + ?H2O}$$

**Step 5**: Balance remaining atoms

N atoms: 6 (in Cu(NO₃)₂) + 2 (in NO) = 8 total on right
Need 8 HNO₃:
$$\\ce{3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + ?H2O}$$

H atoms: 8 on left, so 4H₂O on right:
$$\\ce{3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + 4H2O}$$

**Step 6**: Verify
- Cu: 3 = 3 ✓
- N: 8 = 6 + 2 = 8 ✓
- O: 24 = 18 + 2 + 4 = 24 ✓
- H: 8 = 8 ✓

**BALANCED!**

## Worked Examples

### Example 4: Cr₂O₇²⁻ + C₂O₄²⁻ → Cr³⁺ + CO₂ (acidic)

**Reduction half**:
$$\\ce{Cr2O7^{2-} -> 2Cr^{3+}}$$

Balance O: Add 7H₂O
$$\\ce{Cr2O7^{2-} -> 2Cr^{3+} + 7H2O}$$

Balance H: Add 14H⁺
$$\\ce{Cr2O7^{2-} + 14H+ -> 2Cr^{3+} + 7H2O}$$

Balance charge: Left = -2 + 14 = +12; Right = +6
Add 6e⁻:
$$\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$$

**Oxidation half**:
$$\\ce{C2O4^{2-} -> 2CO2}$$

Balance charge: Left = -2; Right = 0
Add 2e⁻:
$$\\ce{C2O4^{2-} -> 2CO2 + 2e-}$$

**Equalize electrons**: Multiply oxidation by 3
$$\\ce{3C2O4^{2-} -> 6CO2 + 6e-}$$

**Add**:
$$\\ce{Cr2O7^{2-} + 3C2O4^{2-} + 14H+ -> 2Cr^{3+} + 6CO2 + 7H2O}$$

**BALANCED!**

### Example 5: MnO₄⁻ + H₂O₂ → Mn²⁺ + O₂ (acidic)

**Reduction half**:
$$\\ce{MnO4- + 8H+ + 5e- -> Mn^{2+} + 4H2O}$$

**Oxidation half**:
$$\\ce{H2O2 -> O2}$$

Balance H:
$$\\ce{H2O2 -> O2 + 2H+}$$

Balance charge: Left = 0; Right = +2
$$\\ce{H2O2 -> O2 + 2H+ + 2e-}$$

**Equalize**: Reduction ×2, Oxidation ×5
$$\\ce{2MnO4- + 16H+ + 10e- -> 2Mn^{2+} + 8H2O}$$
$$\\ce{5H2O2 -> 5O2 + 10H+ + 10e-}$$

**Add and simplify**:
$$\\ce{2MnO4- + 5H2O2 + 6H+ -> 2Mn^{2+} + 5O2 + 8H2O}$$

(16H⁺ - 10H⁺ = 6H⁺)

**BALANCED!**

## Tips and Tricks

### Tip 1: H₂O₂ Behavior
- In acidic: H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O (oxidizing agent)
- In acidic: H₂O₂ → O₂ + 2H⁺ + 2e⁻ (reducing agent)

### Tip 2: Common Half-Reactions to Memorize

**Reduction** (acidic):
- MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O
- Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O
- NO₃⁻ + 4H⁺ + 3e⁻ → NO + 2H₂O
- Cl₂ + 2e⁻ → 2Cl⁻

**Oxidation**:
- Fe²⁺ → Fe³⁺ + e⁻
- Sn²⁺ → Sn⁴⁺ + 2e⁻
- C₂O₄²⁻ → 2CO₂ + 2e⁻

### Tip 3: Check Your Work
Always verify:
1. Each type of atom balanced
2. Total charge balanced
3. Electrons canceled (shouldn't appear in final equation)

## Common Misconceptions

### ❌ Misconception 1: Can Balance Redox Like Normal Equations
**Reality**: Redox requires special methods because electrons must balance. Simple balancing often fails.

### ❌ Misconception 2: Always Need H⁺ in Final Equation
**Reality**: In basic medium, final equation has OH⁻, not H⁺. H⁺ is just intermediate.

### ❌ Misconception 3: Electrons Appear in Final Equation
**Reality**: Electrons must cancel! If they appear in final equation, you made an error.

### ❌ Misconception 4: Can Add Arbitrary OH⁻ or H⁺
**Reality**: Must follow systematic rules. Can only add H⁺/OH⁻ and H₂O where method specifies.

## Key Takeaways

1. **Ion-electron method**: Separate oxidation and reduction half-reactions
2. **Acidic medium**: Balance with H₂O and H⁺
3. **Basic medium**: Balance in acidic first, then add OH⁻ to convert
4. **Oxidation number method**: Use change in oxidation numbers
5. **Equalize electrons**: Multiply half-reactions by appropriate factors
6. **Always verify**: Mass and charge must balance
7. **Common half-reactions**: Memorize frequently used ones
`,
        objectives: [
          'Balance redox equations using ion-electron method',
          'Balance redox equations in acidic medium',
          'Balance redox equations in basic medium',
          'Apply oxidation number method for balancing',
          'Verify balanced redox equations',
        ],
        keyTerms: [
          { term: 'Half-Reaction', definition: 'Oxidation or reduction part of redox, shown separately' },
          { term: 'Ion-Electron Method', definition: 'Balancing by separating and balancing half-reactions' },
          { term: 'Oxidation Number Method', definition: 'Balancing using change in oxidation numbers' },
          { term: 'Acidic Medium', definition: 'Use H₂O and H⁺ to balance' },
          { term: 'Basic Medium', definition: 'Convert H⁺ to H₂O by adding OH⁻' },
        ],
      },
    },
    {
      id: 'redox-quiz-1',
      title: 'Redox Reactions Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'redox-quiz-1',
        title: 'Redox Reactions Quiz',
        description: 'Test your understanding of redox reactions, oxidation numbers, and balancing.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'redox-q1',
            type: 'mcq',
            question: 'What is the oxidation number of Cr in K₂Cr₂O₇?',
            difficulty: 'easy',
            topic: 'physical',
            options: ['+3', '+6', '+7', '+12'],
            correctAnswer: 1,
            explanation: 'Using the rule that sum of oxidation numbers equals 0 for neutral molecules: 2(+1) + 2x + 7(-2) = 0, where x is oxidation number of Cr. Solving: 2 + 2x - 14 = 0, so 2x = 12, therefore x = +6. Each Cr atom has oxidation state +6. K₂Cr₂O₇ (potassium dichromate) is a strong oxidizing agent, with Cr in its +6 state.',
          },
          {
            id: 'redox-q2',
            type: 'mcq',
            question: 'In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, which species is the oxidizing agent?',
            difficulty: 'easy',
            topic: 'physical',
            options: ['Zn', 'Cu²⁺', 'Zn²⁺', 'Cu'],
            correctAnswer: 1,
            explanation: 'The oxidizing agent causes oxidation of another species and gets reduced itself. Cu²⁺ (oxidation state +2) gains 2 electrons to become Cu (oxidation state 0), meaning it is REDUCED. Since Cu²⁺ gets reduced, it is the oxidizing agent. Zn gets oxidized (0 → +2), making it the reducing agent. Remember: oxidizing agent gets reduced, reducing agent gets oxidized.',
          },
          {
            id: 'redox-q3',
            type: 'mcq',
            question: 'Which of the following is NOT a redox reaction?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Zn + H₂SO₄ → ZnSO₄ + H₂',
              'AgNO₃ + NaCl → AgCl + NaNO₃',
              '2KClO₃ → 2KCl + 3O₂',
              'Fe + CuSO₄ → FeSO₄ + Cu'
            ],
            correctAnswer: 1,
            explanation: 'Check oxidation numbers for each: Option 1: Zn (0→+2), H (+1→0) - REDOX. Option 2: Ag (+1→+1), Cl (-1→-1), Na (+1→+1), N (+5→+5), O (-2→-2) - NO CHANGE, just precipitation, NOT redox. Option 3: Cl (+5→-1), O (-2→0) - REDOX. Option 4: Fe (0→+2), Cu (+2→0) - REDOX. Only option 2 has no oxidation number changes.',
          },
          {
            id: 'redox-q4',
            type: 'mcq',
            question: 'In which compound does oxygen have an oxidation number of -1?',
            difficulty: 'medium',
            topic: 'physical',
            options: ['H₂O', 'H₂O₂', 'MgO', 'CO₂'],
            correctAnswer: 1,
            explanation: 'Usually oxygen has oxidation number -2, but in peroxides it is -1. H₂O₂ (hydrogen peroxide) is a peroxide where O-O bond exists. Using sum = 0: 2(+1) + 2x = 0, so x = -1 for each O. In H₂O, MgO, CO₂, oxygen has the normal -2 state. Special cases: superoxides (KO₂) have O at -1/2, and OF₂ has O at +2 (only with highly electronegative F).',
          },
          {
            id: 'redox-q5',
            type: 'mcq',
            question: 'What type of reaction is: Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O?',
            difficulty: 'hard',
            topic: 'physical',
            options: ['Oxidation only', 'Reduction only', 'Disproportionation', 'Combination'],
            correctAnswer: 2,
            explanation: 'Check oxidation numbers of Cl: In Cl₂, Cl is 0. In Cl⁻, Cl is -1 (REDUCTION). In ClO⁻, Cl is +1 (OXIDATION). The same element (Cl₂) is simultaneously oxidized (0→+1) and reduced (0→-1). This is called DISPROPORTIONATION - a special type of redox where one element undergoes both oxidation and reduction. Common examples: Cl₂ in base, H₂O₂ decomposition.',
          },
          {
            id: 'redox-q6',
            type: 'mcq',
            question: 'How many electrons are transferred in the balanced equation: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (for 1 mole MnO₄⁻)?',
            difficulty: 'hard',
            topic: 'physical',
            options: ['1', '2', '5', '8'],
            correctAnswer: 2,
            explanation: 'Mn in MnO₄⁻ has oxidation state +7 (verify: x + 4(-2) = -1, so x = +7). Mn²⁺ has +2. Change: +7 → +2 is a decrease of 5, meaning 5 electrons gained per MnO₄⁻. Fe²⁺ → Fe³⁺ is +2 → +3, so 1 electron lost per Fe²⁺. To balance, need 5 Fe²⁺ for each MnO₄⁻. Therefore, 5 electrons are transferred per mole of MnO₄⁻.',
            hasLatex: true,
          },
        ],
      },
    },
  ],
};
