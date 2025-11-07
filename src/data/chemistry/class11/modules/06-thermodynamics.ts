/**
 * Module 6: Chemical Thermodynamics
 */

import type { ChemistryModule } from '../../types';

export const thermodynamicsModule: ChemistryModule = {
  id: 'class11-thermodynamics',
  slug: 'thermodynamics',
  title: 'Chemical Thermodynamics',
  description: 'Study energy changes in chemical reactions including enthalpy, entropy, and Gibbs free energy.',
  icon: 'flame',
  sequenceOrder: 6,
  estimatedHours: 16,
  topic: 'physical',
  difficulty: 'hard',
  prerequisites: ['class11-basic-concepts'],
  learningOutcomes: [
    'Understand system, surroundings, and types of systems',
    'Apply First Law of Thermodynamics (ΔU = q + w)',
    'Calculate enthalpy changes (ΔH) for reactions',
    'Use Hess\'s Law for enthalpy calculations',
    'Understand entropy and Second Law',
    'Apply Gibbs free energy to predict spontaneity',
  ],
  items: [
    {
      id: 'thermo-lesson-1',
      title: 'Introduction to Thermodynamics and First Law',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'thermo-lesson-1',
        title: 'Introduction to Thermodynamics and First Law',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Introduction to Thermodynamics and First Law

## What is Thermodynamics?

**Thermodynamics** is the branch of chemistry that deals with energy changes accompanying physical and chemical transformations.

> **Why study thermodynamics?** It helps us predict:
> - Will a reaction occur spontaneously?
> - How much energy will be released or absorbed?
> - What is the maximum work obtainable from a reaction?

## System and Surroundings

### Definitions

**System**: The part of the universe we are studying (e.g., a beaker containing reactants).

**Surroundings**: Everything else in the universe outside the system.

**Boundary**: The real or imaginary surface separating system from surroundings.

### Types of Systems

1. **Open System**
   - Exchanges both matter and energy with surroundings
   - Example: Boiling water in an open container

2. **Closed System**
   - Exchanges energy but NOT matter
   - Example: Sealed container with ice melting inside

3. **Isolated System**
   - Exchanges NEITHER matter NOR energy
   - Example: Perfectly insulated thermos flask (ideal case)

## State Functions vs Path Functions

### State Functions

Properties that depend ONLY on the current state of the system, NOT on how it got there.

**Examples**: Temperature (T), Pressure (P), Volume (V), Internal Energy (U), Enthalpy (H), Entropy (S), Gibbs Free Energy (G)

**Analogy**: Your elevation on a mountain depends only on where you are, not which path you took to get there.

### Path Functions

Properties that depend on the path taken.

**Examples**: Heat (q), Work (w)

**Analogy**: The distance you walked to reach the mountaintop depends on which trail you took.

## Internal Energy (U)

**Internal energy** is the total energy contained within a system.

$$U = U_{kinetic} + U_{potential}$$

It includes:
- Translational, rotational, vibrational energy of molecules
- Potential energy due to intermolecular forces
- Energy in chemical bonds

**Important**: We cannot measure absolute internal energy, only changes (ΔU).

$$\\Delta U = U_{final} - U_{initial}$$

## First Law of Thermodynamics

> **Law of Energy Conservation**: Energy cannot be created or destroyed, only converted from one form to another.

### Mathematical Form

$$\\Delta U = q + w$$

where:
- ΔU = Change in internal energy
- q = Heat absorbed by the system
- w = Work done ON the system

### Sign Conventions

| Process | q | w |
|---------|---|---|
| Heat absorbed by system | + | |
| Heat released by system | - | |
| Work done ON system | | + |
| Work done BY system | | - |

**Mnemonic**: Think of the system as your bank account. Money coming IN is positive (+), money going OUT is negative (-).

## Work in Thermodynamics

### Pressure-Volume Work

When a gas expands or contracts against external pressure:

$$w = -P_{ext} \\Delta V$$

$$w = -P_{ext} (V_2 - V_1)$$

**Negative sign**: When gas expands (ΔV > 0), work is done BY the system, so w is negative.

### Types of Processes

1. **Isothermal Process** (constant T)
   - For ideal gas: ΔU = 0
   - Therefore: q = -w

2. **Adiabatic Process** (no heat exchange, q = 0)
   - ΔU = w
   - Temperature changes during expansion/compression

3. **Isochoric Process** (constant V, ΔV = 0)
   - w = 0
   - ΔU = q (all heat changes internal energy)

4. **Isobaric Process** (constant P)
   - w = -P ΔV
   - Common in open containers

## Heat Capacity

**Heat capacity** is the amount of heat required to raise temperature by 1 K.

### At Constant Volume (C_V)

$$q_V = nC_V \\Delta T$$

At constant volume, w = 0, so:

$$\\Delta U = q_V = nC_V \\Delta T$$

### At Constant Pressure (C_P)

$$q_P = nC_P \\Delta T$$

### Relationship Between C_P and C_V

For ideal gas:

$$C_P - C_V = R$$

$$C_P = C_V + R$$

where R = 8.314 J/(mol·K)

**Why is C_P > C_V?** At constant pressure, some heat goes into expansion work, so more heat is needed to raise temperature.

## Worked Examples

### Example 1: First Law Application

**Q**: A system absorbs 500 J of heat and does 200 J of work. Calculate ΔU.

**Solution**:
- q = +500 J (absorbed)
- w = -200 J (work done BY system)

$$\\Delta U = q + w = 500 + (-200) = 300 \\text{ J}$$

### Example 2: Work Calculation

**Q**: A gas expands from 2.0 L to 5.0 L against external pressure of 1.0 atm. Calculate work done.

**Solution**:
$$w = -P_{ext} \\Delta V = -(1.0)(5.0 - 2.0)$$
$$w = -3.0 \\text{ L·atm}$$

Convert to joules: 1 L·atm = 101.3 J

$$w = -3.0 \\times 101.3 = -304 \\text{ J}$$

**Interpretation**: System did 304 J of work on surroundings.

### Example 3: Isothermal Process

**Q**: An ideal gas undergoes isothermal expansion, absorbing 800 J of heat. Find ΔU and work done.

**Solution**:
For isothermal process with ideal gas: ΔU = 0

From First Law:
$$\\Delta U = q + w$$
$$0 = 800 + w$$
$$w = -800 \\text{ J}$$

All heat absorbed is converted to work done by the gas.

## Common Misconceptions

### ❌ Misconception 1: Heat and Temperature are the Same
**Reality**: Heat is energy transfer, temperature is a measure of average kinetic energy. A large lake at 20°C has more heat than a cup of water at 100°C.

### ❌ Misconception 2: Work is Always Negative
**Reality**: Work can be positive (compression) or negative (expansion), depending on direction.

### ❌ Misconception 3: Internal Energy Can Be Measured Absolutely
**Reality**: Only changes in internal energy (ΔU) can be measured, not absolute values.

## Key Takeaways

1. **First Law**: ΔU = q + w (energy conservation)
2. **State functions** depend only on current state (U, H, S, G)
3. **Path functions** depend on the process (q, w)
4. **Sign conventions**: Heat IN is +, work ON system is +
5. **Work by gas**: w = -P_ext ΔV
6. **Heat capacities**: C_P > C_V by R for ideal gases
7. **Isothermal**: ΔU = 0 for ideal gas
8. **Isochoric**: w = 0, so ΔU = q
`,
        objectives: [
          'Define system, surroundings, and types of systems',
          'Distinguish between state functions and path functions',
          'Apply the First Law of Thermodynamics',
          'Calculate work done in expansion/compression',
          'Use heat capacities C_P and C_V',
        ],
        keyTerms: [
          { term: 'System', definition: 'Part of universe under study' },
          { term: 'State Function', definition: 'Property dependent only on current state, not path' },
          { term: 'Internal Energy', definition: 'Total energy contained within a system' },
          { term: 'First Law', definition: 'ΔU = q + w; energy conservation principle' },
          { term: 'Isothermal', definition: 'Process at constant temperature' },
        ],
      },
    },
    {
      id: 'thermo-lesson-2',
      title: 'Enthalpy and Hess\'s Law',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'thermo-lesson-2',
        title: 'Enthalpy and Hess\'s Law',
        sequenceOrder: 2,
        estimatedMinutes: 50,
        content: `
# Enthalpy and Hess's Law

## What is Enthalpy?

**Enthalpy (H)** is a state function representing heat content of a system at constant pressure.

$$H = U + PV$$

### Change in Enthalpy

$$\\Delta H = \\Delta U + P\\Delta V$$

At constant pressure:

$$\\Delta H = q_P$$

**Enthalpy change equals heat absorbed/released at constant pressure.**

> **Why is enthalpy useful?** Most reactions occur at constant atmospheric pressure, making ΔH directly measurable as heat change.

## Exothermic vs Endothermic Reactions

### Exothermic Reactions (ΔH < 0)

- **Release heat** to surroundings
- Products have LOWER enthalpy than reactants
- Temperature of surroundings increases

**Examples**:
- Combustion: $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$ ΔH = -890 kJ/mol
- Neutralization: $\\ce{HCl + NaOH -> NaCl + H2O}$ ΔH = -57.3 kJ/mol
- Freezing of water

### Endothermic Reactions (ΔH > 0)

- **Absorb heat** from surroundings
- Products have HIGHER enthalpy than reactants
- Temperature of surroundings decreases

**Examples**:
- Photosynthesis: $\\ce{6CO2 + 6H2O -> C6H12O6 + 6O2}$ ΔH = +2803 kJ
- Melting of ice
- Evaporation of water
- Thermal decomposition: $\\ce{CaCO3 -> CaO + CO2}$ ΔH = +178 kJ/mol

## Standard Enthalpy Change (ΔH°)

**Standard conditions**:
- Temperature: 298 K (25°C)
- Pressure: 1 bar (≈ 1 atm)
- Concentration: 1 M for solutions
- Standard state: Most stable form at 1 bar

### Types of Standard Enthalpy Changes

#### 1. Standard Enthalpy of Formation (ΔH°_f)

Enthalpy change when **1 mole** of compound is formed from its **elements** in their standard states.

**Example**:
$$\\ce{C(graphite) + O2(g) -> CO2(g)}$$
$$\\Delta H°_f = -393.5 \\text{ kJ/mol}$$

**By definition**: ΔH°_f of any element in standard state = 0

#### 2. Standard Enthalpy of Combustion (ΔH°_c)

Enthalpy change when **1 mole** of substance undergoes **complete combustion** in oxygen.

**Example**:
$$\\ce{C2H5OH(l) + 3O2(g) -> 2CO2(g) + 3H2O(l)}$$
$$\\Delta H°_c = -1367 \\text{ kJ/mol}$$

#### 3. Standard Enthalpy of Neutralization (ΔH°_n)

Enthalpy change when **1 mole of H⁺** reacts with **1 mole of OH⁻** to form water.

For strong acids and bases:
$$\\ce{H+(aq) + OH-(aq) -> H2O(l)}$$
$$\\Delta H°_n \\approx -57.3 \\text{ kJ/mol}$$

(Remarkably constant for all strong acid-base reactions!)

#### 4. Standard Enthalpy of Atomization (ΔH°_a)

Enthalpy change to break **1 mole** of substance into isolated gaseous atoms.

**Example**:
$$\\ce{CH4(g) -> C(g) + 4H(g)}$$
$$\\Delta H°_a = +1660 \\text{ kJ/mol}$$

## Hess's Law

> **Hess's Law**: The total enthalpy change for a reaction is independent of the route by which the reaction occurs, provided initial and final conditions are the same.

**Consequence**: Enthalpy is a state function!

### Mathematical Statement

If a reaction can be expressed as sum of several steps:

$$\\Delta H°_{reaction} = \\Delta H°_1 + \\Delta H°_2 + \\Delta H°_3 + ...$$

### Using Hess's Law

**Rules for manipulating equations**:
1. **Reverse equation**: Change sign of ΔH
2. **Multiply equation**: Multiply ΔH by same factor
3. **Add equations**: Add corresponding ΔH values

## Calculating ΔH° from Formation Enthalpies

For any reaction:

$$\\Delta H°_{reaction} = \\sum \\Delta H°_f(products) - \\sum \\Delta H°_f(reactants)$$

**Remember**: Multiply each ΔH°_f by its stoichiometric coefficient.

## Worked Examples

### Example 1: Using Formation Enthalpies

**Q**: Calculate ΔH° for: $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$

**Given**:
- ΔH°_f [CH₄(g)] = -74.8 kJ/mol
- ΔH°_f [CO₂(g)] = -393.5 kJ/mol
- ΔH°_f [H₂O(l)] = -285.8 kJ/mol
- ΔH°_f [O₂(g)] = 0 (element)

**Solution**:
$$\\Delta H° = [\\Delta H°_f(CO_2) + 2\\Delta H°_f(H_2O)] - [\\Delta H°_f(CH_4) + 2\\Delta H°_f(O_2)]$$

$$\\Delta H° = [(-393.5) + 2(-285.8)] - [(-74.8) + 0]$$

$$\\Delta H° = -965.1 - (-74.8) = -890.3 \\text{ kJ/mol}$$

**Interpretation**: Highly exothermic (combustion reaction).

### Example 2: Hess's Law Application

**Q**: Calculate ΔH° for: $\\ce{C(s) + 1/2 O2(g) -> CO(g)}$

**Given reactions**:
1. $\\ce{C(s) + O2(g) -> CO2(g)}$ ΔH° = -393.5 kJ
2. $\\ce{CO(g) + 1/2 O2(g) -> CO2(g)}$ ΔH° = -283.0 kJ

**Solution**:

To get CO, we need to subtract reaction 2 from reaction 1:

$$\\ce{C(s) + O2(g) -> CO2(g)}$$ ΔH° = -393.5 kJ ... (1)

Reverse (2):
$$\\ce{CO2(g) -> CO(g) + 1/2 O2(g)}$$ ΔH° = +283.0 kJ ... (2')

Add (1) + (2'):
$$\\ce{C(s) + 1/2 O2(g) -> CO(g)}$$

$$\\Delta H° = -393.5 + 283.0 = -110.5 \\text{ kJ/mol}$$

### Example 3: Multi-Step Hess's Law

**Q**: Find ΔH° for: $\\ce{2C(s) + H2(g) -> C2H2(g)}$

**Given**:
1. $\\ce{C2H2(g) + 5/2 O2(g) -> 2CO2(g) + H2O(l)}$ ΔH° = -1300 kJ
2. $\\ce{C(s) + O2(g) -> CO2(g)}$ ΔH° = -394 kJ
3. $\\ce{H2(g) + 1/2 O2(g) -> H2O(l)}$ ΔH° = -286 kJ

**Solution**:

Reverse (1):
$$\\ce{2CO2(g) + H2O(l) -> C2H2(g) + 5/2 O2(g)}$$ ΔH° = +1300 kJ

Multiply (2) by 2:
$$\\ce{2C(s) + 2O2(g) -> 2CO2(g)}$$ ΔH° = -788 kJ

Keep (3) as is:
$$\\ce{H2(g) + 1/2 O2(g) -> H2O(l)}$$ ΔH° = -286 kJ

Add all three:
$$\\ce{2C(s) + H2(g) -> C2H2(g)}$$

$$\\Delta H° = 1300 + (-788) + (-286) = +226 \\text{ kJ/mol}$$

**Interpretation**: Formation of acetylene is endothermic.

## Bond Enthalpy

**Bond enthalpy** (or bond energy) is the enthalpy required to break 1 mole of bonds in gaseous molecules.

### Bond Breaking vs Bond Formation

- **Breaking bonds**: ALWAYS endothermic (ΔH > 0) - requires energy input
- **Forming bonds**: ALWAYS exothermic (ΔH < 0) - releases energy

### Calculating ΔH from Bond Enthalpies

$$\\Delta H° = \\sum \\text{(Bonds broken)} - \\sum \\text{(Bonds formed)}$$

or equivalently:

$$\\Delta H° = \\sum BE_{reactants} - \\sum BE_{products}$$

**Note**: This gives approximate values since bond enthalpies are averages.

### Example: Using Bond Enthalpies

**Q**: Estimate ΔH for: $\\ce{CH4(g) + Cl2(g) -> CH3Cl(g) + HCl(g)}$

**Bond enthalpies**:
- C–H: 413 kJ/mol
- Cl–Cl: 242 kJ/mol
- C–Cl: 338 kJ/mol
- H–Cl: 431 kJ/mol

**Solution**:

**Bonds broken** (reactants):
- 1 C–H: 413 kJ
- 1 Cl–Cl: 242 kJ
- Total: 655 kJ

**Bonds formed** (products):
- 1 C–Cl: 338 kJ
- 1 H–Cl: 431 kJ
- Total: 769 kJ

$$\\Delta H° = 655 - 769 = -114 \\text{ kJ/mol}$$

**Interpretation**: Exothermic (more energy released in bond formation than consumed in breaking).

## Common Misconceptions

### ❌ Misconception 1: Exothermic Means Hot
**Reality**: Exothermic means heat is RELEASED to surroundings. The system itself may cool down.

### ❌ Misconception 2: ΔH°_f of All Compounds is Negative
**Reality**: Many compounds have positive ΔH°_f (e.g., NO, C₂H₂, benzene). They're endothermic to form but still exist.

### ❌ Misconception 3: Bond Breaking Releases Energy
**Reality**: Bond BREAKING requires energy (endothermic). Bond FORMING releases energy (exothermic).

## Key Takeaways

1. **Enthalpy**: H = U + PV; ΔH = q_P at constant pressure
2. **Exothermic**: ΔH < 0 (heat released)
3. **Endothermic**: ΔH > 0 (heat absorbed)
4. **Hess's Law**: ΔH is path-independent (state function)
5. **Formation method**: ΔH° = Σ ΔH°_f(products) - Σ ΔH°_f(reactants)
6. **Bond enthalpy**: ΔH = Bonds broken - Bonds formed
7. **Breaking bonds**: Endothermic (+); Forming bonds: Exothermic (-)
`,
        objectives: [
          'Define enthalpy and distinguish from internal energy',
          'Identify exothermic and endothermic reactions',
          'Apply Hess\'s Law to calculate ΔH°',
          'Use standard enthalpies of formation',
          'Estimate ΔH using bond enthalpies',
        ],
        keyTerms: [
          { term: 'Enthalpy', definition: 'Heat content at constant pressure; H = U + PV' },
          { term: 'Hess\'s Law', definition: 'ΔH is independent of pathway (state function property)' },
          { term: 'ΔH°_f', definition: 'Standard enthalpy of formation from elements' },
          { term: 'Bond Enthalpy', definition: 'Energy required to break 1 mole of bonds in gas phase' },
          { term: 'Exothermic', definition: 'Reaction releasing heat; ΔH < 0' },
        ],
      },
    },
    {
      id: 'thermo-lesson-3',
      title: 'Entropy, Second Law, and Gibbs Free Energy',
      type: 'lesson',
      sequenceOrder: 3,
      data: {
        id: 'thermo-lesson-3',
        title: 'Entropy, Second Law, and Gibbs Free Energy',
        sequenceOrder: 3,
        estimatedMinutes: 50,
        content: `
# Entropy, Second Law, and Gibbs Free Energy

## What is Entropy?

**Entropy (S)** is a measure of **disorder** or **randomness** in a system.

> **More precisely**: Entropy is a measure of the number of possible microscopic arrangements (microstates) of a system.

$$S = k_B \\ln W$$

where:
- k_B = Boltzmann constant
- W = Number of microstates

**Key insight**: Nature favors disorder. Systems spontaneously move toward higher entropy.

### Entropy and States of Matter

$$S_{gas} >> S_{liquid} > S_{solid}$$

**Why?**
- **Solids**: Molecules in fixed positions → Low disorder → Low entropy
- **Liquids**: Molecules can move but close together → Medium disorder
- **Gases**: Molecules widely separated, random motion → High disorder → High entropy

## Second Law of Thermodynamics

> **Second Law**: In any spontaneous process, the total entropy of the universe ALWAYS increases.

$$\\Delta S_{universe} = \\Delta S_{system} + \\Delta S_{surroundings} > 0$$

**For spontaneous process**: ΔS_universe > 0

**For equilibrium**: ΔS_universe = 0

**For non-spontaneous process**: ΔS_universe < 0

### Important Consequences

1. **Heat flows spontaneously from hot to cold** (increases entropy)
2. **Gases expand to fill available space** (increases entropy)
3. **Solutes dissolve to increase randomness** (usually increases entropy)
4. **Perpetual motion machines are impossible**

## Calculating Entropy Changes

### Standard Entropy (S°)

Unlike enthalpy, **absolute entropy can be measured**.

**Third Law of Thermodynamics**: Entropy of a perfect crystal at 0 K is zero.

This gives us a reference point!

### Entropy Change for Reactions

$$\\Delta S° = \\sum S°(products) - \\sum S°(reactants)$$

**Remember**: Multiply each S° by stoichiometric coefficient.

### Factors Increasing Entropy

1. **Phase changes**: solid → liquid → gas
2. **Increase in number of moles** of gas
3. **Increase in temperature**
4. **Dissolution** (usually)
5. **Mixing** of substances

## Gibbs Free Energy (G)

**Problem**: We can't easily measure ΔS_universe. We need a property of the system alone to predict spontaneity.

**Solution**: Gibbs Free Energy!

### Definition

$$G = H - TS$$

At constant T and P:

$$\\Delta G = \\Delta H - T\\Delta S$$

This is the **Gibbs equation** - one of the most important in chemistry!

### Criterion for Spontaneity

**At constant T and P**:

| ΔG | Process |
|-----|---------|
| **ΔG < 0** | **Spontaneous** (thermodynamically favorable) |
| **ΔG = 0** | **Equilibrium** (no net change) |
| **ΔG > 0** | **Non-spontaneous** (reverse is spontaneous) |

> **Key Insight**: ΔG combines both energy (ΔH) and entropy (ΔS) factors into one criterion!

### Standard Free Energy Change

$$\\Delta G° = \\Delta H° - T\\Delta S°$$

Can also calculate from formation data:

$$\\Delta G° = \\sum \\Delta G°_f(products) - \\sum \\Delta G°_f(reactants)$$

## Analyzing Spontaneity: Four Cases

Let's analyze all combinations of ΔH and ΔS:

### Case 1: ΔH < 0, ΔS > 0
$$\\Delta G = \\Delta H - T\\Delta S = (-) - T(+) = (-)$$

**Result**: **Always spontaneous** at all temperatures
**Example**: Combustion of fuels (exothermic + gas products increase)

### Case 2: ΔH > 0, ΔS < 0
$$\\Delta G = (+) - T(-) = (+)$$

**Result**: **Never spontaneous** at any temperature
**Example**: Formation of ozone from O₂ at low temp (endothermic + fewer gas moles)

### Case 3: ΔH < 0, ΔS < 0
$$\\Delta G = (-) - T(-)$$

**Result**: **Spontaneous at LOW temperature** only
**Why?** At low T, the -TΔS term is small, so ΔH dominates.
**Example**: Condensation of water vapor (exothermic but entropy decreases)

### Case 4: ΔH > 0, ΔS > 0
$$\\Delta G = (+) - T(+)$$

**Result**: **Spontaneous at HIGH temperature** only
**Why?** At high T, the -TΔS term becomes large and negative, overwhelming positive ΔH.
**Example**: Melting/boiling (endothermic but entropy increases)

## Worked Examples

### Example 1: Calculating ΔS°

**Q**: Calculate ΔS° for: $\\ce{N2(g) + 3H2(g) -> 2NH3(g)}$

**Given**:
- S° [N₂(g)] = 191.6 J/(mol·K)
- S° [H₂(g)] = 130.7 J/(mol·K)
- S° [NH₃(g)] = 192.8 J/(mol·K)

**Solution**:
$$\\Delta S° = [2 \\times S°(NH_3)] - [S°(N_2) + 3 \\times S°(H_2)]$$

$$\\Delta S° = [2 \\times 192.8] - [191.6 + 3 \\times 130.7]$$

$$\\Delta S° = 385.6 - 583.7 = -198.1 \\text{ J/(mol·K)}$$

**Interpretation**: Entropy decreases (4 moles gas → 2 moles gas). Disorder decreases.

### Example 2: Predicting Spontaneity

**Q**: For the reaction above, ΔH° = -92.4 kJ/mol. Is it spontaneous at 298 K?

**Solution**:
$$\\Delta G° = \\Delta H° - T\\Delta S°$$

Convert ΔS° to kJ/(mol·K): ΔS° = -0.1981 kJ/(mol·K)

$$\\Delta G° = -92.4 - (298)(-0.1981)$$

$$\\Delta G° = -92.4 + 59.1 = -33.3 \\text{ kJ/mol}$$

**Answer**: ΔG° < 0, so **spontaneous** at 298 K.

### Example 3: Finding Temperature Where ΔG = 0

**Q**: At what temperature does the reaction change from spontaneous to non-spontaneous?

**Solution**:

At equilibrium, ΔG = 0:

$$0 = \\Delta H - T\\Delta S$$

$$T = \\frac{\\Delta H}{\\Delta S}$$

$$T = \\frac{-92.4 \\text{ kJ/mol}}{-0.1981 \\text{ kJ/(mol·K)}} = 466 \\text{ K}$$

**Interpretation**:
- Below 466 K (193°C): Spontaneous (ΔG < 0)
- Above 466 K: Non-spontaneous (ΔG > 0)
- At 466 K: Equilibrium (ΔG = 0)

### Example 4: Phase Transition

**Q**: Calculate boiling point of water using ΔH_vap = 40.7 kJ/mol and ΔS_vap = 109 J/(mol·K).

**Solution**:

At boiling point, liquid ⇌ gas are in equilibrium, so ΔG = 0:

$$T_{boiling} = \\frac{\\Delta H_{vap}}{\\Delta S_{vap}}$$

$$T_{boiling} = \\frac{40.7 \\text{ kJ/mol}}{0.109 \\text{ kJ/(mol·K)}} = 373 \\text{ K}$$

**Result**: 373 K = 100°C ✓ (correct!)

## Relationship Between ΔG° and K_eq

At equilibrium:

$$\\Delta G° = -RT \\ln K_{eq}$$

where:
- R = 8.314 J/(mol·K)
- T = Temperature (K)
- K_eq = Equilibrium constant

**Implications**:

| ΔG° | K_eq | Position of Equilibrium |
|------|------|------------------------|
| ΔG° < 0 (large negative) | K >> 1 | Far to right (products favored) |
| ΔG° ≈ 0 | K ≈ 1 | Middle (comparable amounts) |
| ΔG° > 0 (large positive) | K << 1 | Far to left (reactants favored) |

**Important distinction**:
- **ΔG°** tells you equilibrium position
- **ΔH and ΔS** tell you why (energy vs entropy driving forces)

## Common Misconceptions

### ❌ Misconception 1: Spontaneous Means Fast
**Reality**: Spontaneous means thermodynamically favorable, NOT fast. Diamond → graphite is spontaneous but extremely slow!

### ❌ Misconception 2: Exothermic Reactions Are Always Spontaneous
**Reality**: ΔG depends on BOTH ΔH and TΔS. Endothermic reactions can be spontaneous if ΔS is sufficiently positive.

### ❌ Misconception 3: Entropy Always Increases
**Reality**: Entropy of the SYSTEM can decrease (e.g., freezing water), but entropy of the UNIVERSE must increase.

### ❌ Misconception 4: ΔG = 0 Means No Reaction
**Reality**: ΔG = 0 means equilibrium - forward and reverse reactions occur at equal rates.

## Practical Applications

### 1. Coupled Reactions

Non-spontaneous reactions (ΔG > 0) can be driven by coupling with highly spontaneous ones.

**Example in biology**: ATP hydrolysis (ΔG° = -30.5 kJ/mol) drives many non-spontaneous biosynthetic reactions.

### 2. Temperature Control

By understanding ΔH and ΔS signs, we can choose optimal temperature:
- Want to favor endothermic reaction? **Increase temperature**
- Want to favor reaction with ΔS > 0? **Increase temperature**

### 3. Reaction Feasibility

Before attempting synthesis, calculate ΔG° to see if reaction is thermodynamically possible.

## Key Takeaways

1. **Entropy (S)**: Measure of disorder; S_gas >> S_liquid > S_solid
2. **Second Law**: ΔS_universe > 0 for spontaneous processes
3. **Gibbs Free Energy**: G = H - TS
4. **Spontaneity criterion**: ΔG < 0 (spontaneous), ΔG = 0 (equilibrium), ΔG > 0 (non-spontaneous)
5. **Gibbs equation**: ΔG = ΔH - TΔS
6. **Four cases**: Analyze ΔH and ΔS signs to predict T-dependence
7. **Temperature of equilibrium**: T = ΔH/ΔS (when ΔG = 0)
8. **Equilibrium constant**: ΔG° = -RT ln K_eq
9. **Spontaneous ≠ Fast**: Thermodynamics vs kinetics
`,
        objectives: [
          'Define entropy and explain Second Law of Thermodynamics',
          'Calculate ΔS° for chemical reactions',
          'Define Gibbs free energy and apply ΔG = ΔH - TΔS',
          'Predict spontaneity using ΔG',
          'Analyze effect of temperature on spontaneity',
          'Relate ΔG° to equilibrium constant K_eq',
        ],
        keyTerms: [
          { term: 'Entropy', definition: 'Measure of disorder or randomness in a system' },
          { term: 'Second Law', definition: 'ΔS_universe > 0 for spontaneous processes' },
          { term: 'Gibbs Free Energy', definition: 'G = H - TS; criterion for spontaneity' },
          { term: 'Spontaneous', definition: 'Process with ΔG < 0; thermodynamically favorable' },
          { term: 'Equilibrium', definition: 'State where ΔG = 0; no net change' },
        ],
      },
    },
    {
      id: 'thermo-quiz-1',
      title: 'Chemical Thermodynamics Quiz',
      type: 'quiz',
      sequenceOrder: 4,
      data: {
        id: 'thermo-quiz-1',
        title: 'Chemical Thermodynamics Quiz',
        description: 'Test your understanding of thermodynamics, enthalpy, entropy, and Gibbs free energy.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'hard',
        questions: [
          {
            id: 'thermo-q1',
            type: 'mcq',
            question: 'A system absorbs 300 J of heat and does 100 J of work on surroundings. What is ΔU?',
            difficulty: 'easy',
            topic: 'physical',
            options: ['+400 J', '+200 J', '-200 J', '+100 J'],
            correctAnswer: 1,
            explanation: 'Using First Law: ΔU = q + w. Heat absorbed q = +300 J. Work done BY system means w = -100 J (negative sign). Therefore ΔU = 300 + (-100) = +200 J. The internal energy of the system increases by 200 J.',
          },
          {
            id: 'thermo-q2',
            type: 'mcq',
            question: 'Which process has ΔH = 0 for an ideal gas?',
            difficulty: 'medium',
            topic: 'physical',
            options: ['Adiabatic expansion', 'Isothermal expansion', 'Isobaric expansion', 'Isochoric heating'],
            correctAnswer: 1,
            explanation: 'For an ideal gas in isothermal process (constant temperature), internal energy U depends only on temperature. Since T is constant, ΔU = 0. From First Law: ΔU = q + w = 0, so q = -w. At constant pressure, ΔH = ΔU + PΔV. For isothermal expansion of ideal gas, ΔU = 0, but PΔV ≠ 0. However, for ideal gas specifically, since ΔU = nC_VΔT and ΔT = 0, and ΔH = nC_PΔT, we get ΔH = 0 as well. The correct answer is isothermal expansion.',
          },
          {
            id: 'thermo-q3',
            type: 'numerical',
            question: 'Calculate ΔH° (in kJ) for: CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l). Given: ΔH°_f[CH₄] = -75 kJ/mol, ΔH°_f[CO₂] = -394 kJ/mol, ΔH°_f[H₂O(l)] = -286 kJ/mol.',
            difficulty: 'medium',
            topic: 'physical',
            correctNumerical: -891,
            tolerance: 2,
            unit: 'kJ',
            explanation: 'Using ΔH° = ΣΔH°_f(products) - ΣΔH°_f(reactants). Products: 1 mol CO₂ (-394 kJ) + 2 mol H₂O (-286 kJ each) = -394 + (-572) = -966 kJ. Reactants: 1 mol CH₄ (-75 kJ) + 2 mol O₂ (0 kJ, element) = -75 kJ. Therefore ΔH° = -966 - (-75) = -966 + 75 = -891 kJ. This is highly exothermic, as expected for combustion of methane.',
          },
          {
            id: 'thermo-q4',
            type: 'mcq',
            question: 'For which reaction does entropy (ΔS) decrease?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              '2H₂O(l) → 2H₂(g) + O₂(g)',
              'CaCO₃(s) → CaO(s) + CO₂(g)',
              'N₂(g) + 3H₂(g) → 2NH₃(g)',
              'NaCl(s) → Na⁺(aq) + Cl⁻(aq)'
            ],
            correctAnswer: 2,
            explanation: 'Entropy decreases when disorder decreases. Option 1: liquid → gases (ΔS > 0, increases). Option 2: solid → solid + gas (ΔS > 0, gas produced). Option 3: 4 moles gas → 2 moles gas (ΔS < 0, DECREASES - this is correct). Option 4: solid → aqueous ions (ΔS > 0, increases freedom). The Haber process (N₂ + 3H₂ → 2NH₃) decreases entropy because we go from 4 moles of gas to only 2 moles, reducing disorder.',
          },
          {
            id: 'thermo-q5',
            type: 'mcq',
            question: 'A reaction has ΔH = +50 kJ/mol and ΔS = +100 J/(mol·K). At what temperature does it become spontaneous?',
            difficulty: 'hard',
            topic: 'physical',
            options: ['Below 500 K', 'Above 500 K', 'At all temperatures', 'Never spontaneous'],
            correctAnswer: 1,
            explanation: 'For spontaneity: ΔG < 0. Using ΔG = ΔH - TΔS. Given ΔH = +50 kJ/mol (endothermic) and ΔS = +100 J/(mol·K) = +0.1 kJ/(mol·K) (entropy increases). This is Case 4: ΔH > 0, ΔS > 0, spontaneous at HIGH temperature. At equilibrium point: ΔG = 0, so T = ΔH/ΔS = 50/0.1 = 500 K. Above 500 K, the -TΔS term becomes large enough to make ΔG negative. Below 500 K, ΔG is positive (non-spontaneous). Therefore spontaneous ABOVE 500 K.',
            hasLatex: true,
          },
          {
            id: 'thermo-q6',
            type: 'mcq',
            question: 'Which statement about Hess\'s Law is INCORRECT?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Enthalpy change is independent of pathway',
              'Enthalpy is a state function',
              'If reaction is reversed, sign of ΔH changes',
              'Work done (w) is also independent of pathway'
            ],
            correctAnswer: 3,
            explanation: 'Hess\'s Law states that enthalpy change depends only on initial and final states, not the path taken (options 1 and 2 are CORRECT). When reversing a reaction, ΔH changes sign (option 3 is CORRECT). However, work (w) is a PATH FUNCTION, NOT a state function. The work done depends on how the process is carried out. For example, expansion against different external pressures gives different work values. Therefore option 4 is INCORRECT - work IS dependent on pathway. Only state functions (U, H, S, G, T, P, V) are path-independent.',
          },
          {
            id: 'thermo-q7',
            type: 'numerical',
            question: 'Calculate ΔG° (in kJ) at 298 K for a reaction with ΔH° = -120 kJ/mol and ΔS° = -200 J/(mol·K).',
            difficulty: 'hard',
            topic: 'physical',
            correctNumerical: -60.4,
            tolerance: 2,
            unit: 'kJ',
            explanation: 'Using Gibbs equation: ΔG° = ΔH° - TΔS°. Given: ΔH° = -120 kJ/mol, ΔS° = -200 J/(mol·K) = -0.200 kJ/(mol·K), T = 298 K. Calculate: ΔG° = -120 - (298)(-0.200) = -120 - (-59.6) = -120 + 59.6 = -60.4 kJ/mol. Since ΔG° < 0, this reaction is spontaneous at 298 K. This is Case 3 (ΔH < 0, ΔS < 0): spontaneous at low temperature, where exothermicity dominates.',
            hasLatex: true,
          },
          {
            id: 'thermo-q8',
            type: 'mcq',
            question: 'If ΔG° for a reaction is -20 kJ/mol, what can we conclude about K_eq at that temperature?',
            difficulty: 'hard',
            topic: 'physical',
            options: ['K_eq << 1 (reactants favored)', 'K_eq ≈ 1 (equal amounts)', 'K_eq >> 1 (products favored)', 'Cannot determine without temperature'],
            correctAnswer: 2,
            explanation: 'Using the relationship ΔG° = -RT ln K_eq. When ΔG° is NEGATIVE, ln K_eq must be POSITIVE (since there\'s a negative sign). If ln K_eq > 0, then K_eq > 1. More specifically, with ΔG° = -20 kJ/mol (significantly negative), K_eq will be significantly greater than 1. This means products are strongly favored at equilibrium. The more negative ΔG°, the larger K_eq becomes. For example, at 298 K: K_eq = exp(-ΔG°/RT) = exp(20000/(8.314×298)) ≈ 3000, which is >> 1.',
            hasLatex: true,
          },
        ],
      },
    },
  ],
};
