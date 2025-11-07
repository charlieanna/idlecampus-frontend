import type { ChemistryModule } from '../../types';

export const solutionsModule: ChemistryModule = {
  id: 'class12-solutions',
  slug: 'solutions',
  title: 'Solutions',
  description: 'Master colligative properties and solution calculations.',
  icon: 'droplet',
  sequenceOrder: 2,
  estimatedHours: 16,
  topic: 'physical',
  difficulty: 'hard',
  learningOutcomes: ['Express concentration', 'Apply Raoult law', 'Calculate colligative properties'],
  items: [
    {
      id: 'solutions-lesson-1',
      title: 'Introduction to Solutions and Concentration Units',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'solutions-lesson-1',
        title: 'Introduction to Solutions and Concentration Units',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Introduction to Solutions and Concentration Units

## What is a Solution?

**Solution**: A homogeneous mixture of two or more substances

**Components**:
- **Solute**: The substance present in smaller amount (gets dissolved)
- **Solvent**: The substance present in larger amount (does the dissolving)

**Example**: In saltwater, NaCl is the solute and H₂O is the solvent

**Key characteristic**: Solutions are homogeneous at the molecular level—uniform composition throughout

## Types of Solutions

Solutions can exist in all three states of matter:

| Solute State | Solvent State | Example |
|--------------|---------------|---------|
| Gas | Gas | Air (O₂ in N₂) |
| Gas | Liquid | Carbonated water (CO₂ in H₂O) |
| Gas | Solid | H₂ in palladium |
| Liquid | Liquid | Ethanol in water |
| Liquid | Solid | Mercury in amalgam |
| Solid | Liquid | Salt in water (most common!) |
| Solid | Solid | Alloys (brass: Zn in Cu) |

**Most important**: Solid in liquid solutions (like NaCl in water)

## Solubility

**Solubility**: Maximum amount of solute that can dissolve in a given amount of solvent at a specific temperature

**Units**: Usually g per 100 g of solvent, or mol/L

**Types of solutions based on solubility**:

### 1. Unsaturated Solution
- Contains less solute than the maximum possible
- Can dissolve more solute
- **Example**: 10 g NaCl in 100 g water (max is 36 g at 25°C)

### 2. Saturated Solution
- Contains maximum solute at given temperature
- In equilibrium: Rate of dissolution = Rate of crystallization
- **Example**: 36 g NaCl in 100 g water at 25°C

### 3. Supersaturated Solution
- Contains MORE solute than the maximum (metastable state)
- Unstable—excess solute crystallizes if disturbed
- **Preparation**: Dissolve solute at high temperature, then cool slowly without disturbance

## Factors Affecting Solubility

### 1. Nature of Solute and Solvent

**"Like dissolves like"**: Polar solvents dissolve polar/ionic solutes; non-polar solvents dissolve non-polar solutes

**Polar solute in polar solvent** (soluble):
- NaCl in H₂O ✓ (both polar)
- Sugar (C₁₂H₂₂O₁₁) in H₂O ✓

**Non-polar solute in non-polar solvent** (soluble):
- I₂ in CCl₄ ✓
- Naphthalene in benzene ✓

**Polar and non-polar don't mix** (immiscible):
- Oil in water ✗
- I₂ in water ✗ (I₂ is non-polar)

### 2. Effect of Temperature

**For solids in liquids**: Usually, solubility increases with temperature
$$\\text{Heat} + \\text{Solid} + \\text{Solvent} \\rightleftharpoons \\text{Solution}$$

**Endothermic dissolution** (most common): Solubility ↑ with T ↑
- Examples: NaCl, KNO₃, sugar

**Exothermic dissolution** (rare): Solubility ↓ with T ↑
- Example: Ce₂(SO₄)₃

**For gases in liquids**: Solubility DECREASES with increasing temperature
- Reason: Gas molecules have higher kinetic energy at higher T → escape from solution
- **Example**: Carbonated drinks go flat when warm (CO₂ escapes)

### 3. Effect of Pressure (for gases only)

**Henry's Law**: At constant temperature, the solubility of a gas in a liquid is directly proportional to the partial pressure of the gas above the liquid

$$P = K_H \\times x$$

Where:
- $P$ = partial pressure of gas above solution
- $K_H$ = Henry's law constant (depends on gas and solvent)
- $x$ = mole fraction of gas in solution

**Higher pressure** → **Higher solubility** (for gases)

**Applications**:
- **Carbonated drinks**: CO₂ dissolved under high pressure; fizzes when opened (pressure released)
- **Scuba diving**: N₂ dissolves in blood at high pressure underwater; can cause "the bends" if diver ascends too quickly
- **Oxygen cylinders**: O₂ stored at high pressure for medical use

**Important**: Pressure has negligible effect on solubility of solids/liquids

## Concentration Units

Multiple ways to express how much solute is in a solution:

### 1. Mass Percentage (% w/w)

$$\\text{Mass \\%} = \\frac{\\text{Mass of solute}}{\\text{Mass of solution}} \\times 100$$

**Example**: 10 g NaCl in 90 g water
- Mass of solution = 10 + 90 = 100 g
- Mass % = (10/100) × 100 = 10%

**Use**: Commercial products (e.g., 5% glucose solution)

### 2. Volume Percentage (% v/v)

$$\\text{Volume \\%} = \\frac{\\text{Volume of solute}}{\\text{Volume of solution}} \\times 100$$

**Example**: 40 mL ethanol + 60 mL water → 100 mL solution (approximately)
- Volume % = (40/100) × 100 = 40%

**Use**: Alcoholic beverages (e.g., wine is 12% v/v ethanol)

### 3. Mass by Volume Percentage (% w/v)

$$\\text{Mass/Volume \\%} = \\frac{\\text{Mass of solute (g)}}{\\text{Volume of solution (mL)}} \\times 100$$

**Example**: 5 g NaCl dissolved in water to make 100 mL solution
- (w/v)% = (5/100) × 100 = 5%

**Use**: Intravenous fluids (e.g., 0.9% NaCl saline)

### 4. Parts Per Million (ppm)

$$\\text{ppm} = \\frac{\\text{Mass of solute}}{\\text{Mass of solution}} \\times 10^6$$

**Used for**: Very dilute solutions (pollutants, trace elements)

**Example**: 1 mg pollutant in 1 kg water = 1 ppm

**Conversion**: 1 ppm = 0.0001% = 1 mg/L (for aqueous solutions)

### 5. Mole Fraction ($x$)

$$x_A = \\frac{n_A}{n_A + n_B} = \\frac{\\text{Moles of A}}{\\text{Total moles}}$$

**Properties**:
- Unitless (pure number)
- $x_A + x_B = 1$ (for binary solution)
- Temperature independent

**Example**: 1 mol NaCl + 9 mol H₂O
$$x_{\\text{NaCl}} = \\frac{1}{1+9} = 0.1$$
$$x_{\\text{H₂O}} = \\frac{9}{10} = 0.9$$

### 6. Molarity (M)

$$M = \\frac{\\text{Moles of solute}}{\\text{Volume of solution (L)}}$$

**Units**: mol/L or M

**Most common** unit in chemistry labs!

**Example**: 0.5 mol NaCl in 1 L solution → 0.5 M

**Temperature dependent** (volume changes with temperature)

### 7. Molality (m)

$$m = \\frac{\\text{Moles of solute}}{\\text{Mass of solvent (kg)}}$$

**Units**: mol/kg or m

**Temperature independent** (mass doesn't change with temperature)

**Used for**: Colligative properties

**Example**: 1 mol NaCl in 2 kg water → 0.5 m

### 8. Normality (N)

$$N = \\frac{\\text{Gram equivalents of solute}}{\\text{Volume of solution (L)}}$$

**Relationship**: $N = M \\times n$ (where $n$ = number of H⁺ or OH⁻ or charge)

**Less commonly used** now (molarity preferred)

## Worked Example 1: Converting Concentrations

**Problem**: A solution contains 10 g NaCl (M = 58.5) in 200 mL solution. The density of solution is 1.05 g/mL. Calculate:
(a) Molarity
(b) Molality
(c) Mole fraction

**Solution**:

**Given**:
- Mass of NaCl = 10 g
- Molar mass of NaCl = 58.5 g/mol
- Volume of solution = 200 mL = 0.2 L
- Density = 1.05 g/mL

**Step 1**: Calculate moles of NaCl
$$n_{\\text{NaCl}} = \\frac{10}{58.5} = 0.171 \\text{ mol}$$

**Step 2a**: Molarity
$$M = \\frac{0.171}{0.2} = 0.855 \\text{ M}$$

**Step 2b**: Molality (need mass of solvent)
- Mass of solution = Volume × Density = 200 × 1.05 = 210 g
- Mass of solvent (water) = 210 - 10 = 200 g = 0.2 kg
$$m = \\frac{0.171}{0.2} = 0.855 \\text{ m}$$

**Step 2c**: Mole fraction
- Moles of water = 200/18 = 11.11 mol
$$x_{\\text{NaCl}} = \\frac{0.171}{0.171 + 11.11} = 0.0151$$

## Worked Example 2: Dilution

**Problem**: What volume of 12 M HCl is needed to prepare 500 mL of 2 M HCl?

**Solution**:

**Dilution formula**: $M_1V_1 = M_2V_2$

Where:
- $M_1$ = initial molarity = 12 M
- $V_1$ = initial volume = ?
- $M_2$ = final molarity = 2 M
- $V_2$ = final volume = 500 mL

$$12 \\times V_1 = 2 \\times 500$$
$$V_1 = \\frac{1000}{12} = 83.3 \\text{ mL}$$

**Answer**: Take 83.3 mL of 12 M HCl and dilute to 500 mL with water

## Real-World Applications

**Intravenous saline**: 0.9% (w/v) NaCl—isotonic with blood

**Water quality**: WHO limit for arsenic is 10 ppb (parts per billion)

**Blood alcohol content**: 0.08% (v/v) is legal limit for driving in many countries

**Household bleach**: 5-6% (w/v) NaOCl solution

## Key Takeaways

1. **Solution**: Homogeneous mixture; solute (lesser amount) + solvent (greater amount)
2. **Solubility**: Maximum solute that can dissolve; depends on temperature and pressure (for gases)
3. **Henry's Law**: $P = K_H \\times x$ (gas solubility ∝ pressure)
4. **Concentration units**:
   - **Molarity (M)**: mol/L (temperature dependent, most common)
   - **Molality (m)**: mol/kg solvent (temperature independent, used for colligative properties)
   - **Mole fraction (x)**: unitless, temperature independent
5. **Dilution**: $M_1V_1 = M_2V_2$
6. **"Like dissolves like"**: Polar dissolves polar; non-polar dissolves non-polar
`,
        objectives: [
          'Define solution, solute, solvent, and solubility',
          'Explain factors affecting solubility (nature, temperature, pressure)',
          'Apply Henry\'s Law to gas solubility problems',
          'Calculate concentration using various units (molarity, molality, mole fraction, mass %)',
          'Interconvert between different concentration units',
          'Solve dilution problems using M₁V₁ = M₂V₂',
        ],
        keyTerms: [
          { term: 'Solution', definition: 'Homogeneous mixture of solute (lesser) and solvent (greater)' },
          { term: 'Solubility', definition: 'Maximum amount of solute that can dissolve at given temperature' },
          { term: 'Henry\'s Law', definition: 'P = K_H × x; gas solubility proportional to partial pressure' },
          { term: 'Molarity (M)', definition: 'Moles of solute per liter of solution (mol/L); temperature dependent' },
          { term: 'Molality (m)', definition: 'Moles of solute per kg of solvent; temperature independent' },
          { term: 'Mole Fraction (x)', definition: 'Ratio of moles of component to total moles; unitless, x_A + x_B = 1' },
        ],
      },
    },
    {
      id: 'solutions-lesson-2',
      title: 'Raoult\'s Law, Vapor Pressure, and Ideal Solutions',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'solutions-lesson-2',
        title: 'Raoult\'s Law, Vapor Pressure, and Ideal Solutions',
        sequenceOrder: 2,
        estimatedMinutes: 45,
        content: `
# Raoult's Law, Vapor Pressure, and Ideal Solutions

## Vapor Pressure Basics

**Vapor pressure**: The pressure exerted by vapor when it is in equilibrium with its liquid (or solid) phase at a given temperature

**Process**: At equilibrium, rate of evaporation = rate of condensation

**Key points**:
- Vapor pressure increases with temperature (more molecules have enough energy to escape)
- Different liquids have different vapor pressures
- **Volatile liquids** have high vapor pressure (e.g., acetone, ether)
- **Non-volatile liquids** have low vapor pressure (e.g., water, glycerin)

**Examples at 25°C**:
- Diethyl ether: 520 mm Hg (very volatile)
- Acetone: 184 mm Hg
- Ethanol: 59 mm Hg
- Water: 23.8 mm Hg
- Mercury: 0.0012 mm Hg (non-volatile)

## Raoult's Law

**Raoult's Law**: For an ideal solution, the partial vapor pressure of each component is proportional to its mole fraction in the solution

### For Component A:
$$P_A = P_A^0 \\times x_A$$

Where:
- $P_A$ = partial vapor pressure of A above solution
- $P_A^0$ = vapor pressure of pure A at same temperature
- $x_A$ = mole fraction of A in solution (liquid phase)

### For Binary Solution (A + B):

**Partial pressures**:
$$P_A = P_A^0 \\times x_A$$
$$P_B = P_B^0 \\times x_B$$

**Total vapor pressure** (Dalton's law):
$$P_{\\text{total}} = P_A + P_B = P_A^0 x_A + P_B^0 x_B$$

Since $x_A + x_B = 1$, we can write $x_B = 1 - x_A$:

$$P_{\\text{total}} = P_A^0 x_A + P_B^0 (1 - x_A)$$
$$P_{\\text{total}} = P_B^0 + (P_A^0 - P_B^0) x_A$$

This is a linear relationship between total pressure and mole fraction!

## Ideal Solutions

**Ideal solution**: A solution that obeys Raoult's Law at all concentrations and temperatures

**Conditions for ideal behavior**:

1. **Similar molecular sizes**: Components have similar size
2. **Similar intermolecular forces**: A-A, B-B, and A-B interactions are similar
3. **No volume change on mixing**: $\\Delta V_{\\text{mix}} = 0$
4. **No enthalpy change on mixing**: $\\Delta H_{\\text{mix}} = 0$

**Examples of nearly ideal solutions**:
- Benzene + Toluene
- n-Hexane + n-Heptane
- Ethyl bromide + Ethyl iodide
- Chlorobenzene + Bromobenzene

**Why ideal?** Similar structures, similar polarity, similar intermolecular forces

## Non-Ideal Solutions

**Non-ideal solutions**: Solutions that deviate from Raoult's Law

**Two types of deviations**:

### 1. Positive Deviation from Raoult's Law

**Characteristic**: $P_{\\text{total}} > P_{\\text{ideal}}$ (actual pressure higher than expected)

**Reason**: A-B interactions WEAKER than A-A and B-B interactions
- Molecules escape more easily than from pure components
- $\\Delta H_{\\text{mix}} > 0$ (endothermic mixing, heat absorbed)
- $\\Delta V_{\\text{mix}} > 0$ (volume increases on mixing)

**Examples**:
- **Ethanol + Water** (most famous example!)
- Ethanol + Cyclohexane
- Acetone + Carbon disulfide (CS₂)
- Water + Methanol

**Why ethanol + water shows positive deviation?**
- In pure water: Strong H-bonding between H₂O molecules
- In pure ethanol: H-bonding between C₂H₅OH molecules
- In mixture: H-bonding between ethanol and water is WEAKER
- Result: Molecules escape more easily → higher vapor pressure

### 2. Negative Deviation from Raoult's Law

**Characteristic**: $P_{\\text{total}} < P_{\\text{ideal}}$ (actual pressure lower than expected)

**Reason**: A-B interactions STRONGER than A-A and B-B interactions
- Molecules held more tightly in solution
- Harder to escape than from pure components
- $\\Delta H_{\\text{mix}} < 0$ (exothermic mixing, heat released)
- $\\Delta V_{\\text{mix}} < 0$ (volume decreases on mixing)

**Examples**:
- **Chloroform (CHCl₃) + Acetone (CH₃COCH₃)** (classic example!)
- HNO₃ + Water
- Acetic acid + Pyridine
- HCl + Water

**Why chloroform + acetone shows negative deviation?**
- CHCl₃ and acetone form NEW hydrogen bonds with each other
- CHCl₃ (δ+ H) bonds with acetone (δ- O=C)
- These NEW A-B interactions are STRONGER than original A-A and B-B
- Result: Molecules held more tightly → lower vapor pressure

## Worked Example 1: Raoult's Law Calculation

**Problem**: At 25°C, the vapor pressure of pure benzene is 100 mm Hg and that of toluene is 30 mm Hg. Calculate the vapor pressure of a solution containing 0.6 mole fraction of benzene.

**Solution**:

**Given**:
- $P_{\\text{benzene}}^0 = 100$ mm Hg
- $P_{\\text{toluene}}^0 = 30$ mm Hg
- $x_{\\text{benzene}} = 0.6$
- $x_{\\text{toluene}} = 1 - 0.6 = 0.4$

**Step 1**: Calculate partial pressures using Raoult's Law

$$P_{\\text{benzene}} = P_{\\text{benzene}}^0 \\times x_{\\text{benzene}} = 100 \\times 0.6 = 60 \\text{ mm Hg}$$

$$P_{\\text{toluene}} = P_{\\text{toluene}}^0 \\times x_{\\text{toluene}} = 30 \\times 0.4 = 12 \\text{ mm Hg}$$

**Step 2**: Calculate total vapor pressure

$$P_{\\text{total}} = P_{\\text{benzene}} + P_{\\text{toluene}} = 60 + 12 = 72 \\text{ mm Hg}$$

**Answer**: 72 mm Hg

## Worked Example 2: Composition of Vapor

**Problem**: Using the data from Example 1, find the composition of the vapor phase (mole fraction of benzene in vapor).

**Solution**:

The mole fraction in vapor is given by the ratio of partial pressures:

$$y_{\\text{benzene}} = \\frac{P_{\\text{benzene}}}{P_{\\text{total}}} = \\frac{60}{72} = 0.833$$

$$y_{\\text{toluene}} = \\frac{P_{\\text{toluene}}}{P_{\\text{total}}} = \\frac{12}{72} = 0.167$$

**Important observation**:
- Liquid phase: 60% benzene, 40% toluene
- Vapor phase: 83.3% benzene, 16.7% toluene

**The MORE VOLATILE component (benzene) is enriched in the vapor phase!**

This is the principle behind **fractional distillation** for separating liquids.

## Composition of Vapor vs Liquid

For any component in an ideal solution:

**Mole fraction in vapor**:
$$y_A = \\frac{P_A}{P_{\\text{total}}} = \\frac{P_A^0 x_A}{P_A^0 x_A + P_B^0 x_B}$$

**Key insight**: If $P_A^0 > P_B^0$ (A more volatile), then $y_A > x_A$
- Vapor is richer in the more volatile component
- This enables separation by distillation

## Azeotropes (Non-Ideal Solutions)

**Azeotrope**: A mixture that boils at constant temperature with vapor having the same composition as liquid

**Cannot be separated by simple distillation!**

### Types:

**1. Minimum Boiling Azeotrope** (Positive deviation)
- Forms at maximum vapor pressure
- Boils at temperature LOWER than either component
- **Example**: 95.6% ethanol + 4.4% water (boils at 78.2°C)
  - Pure ethanol boils at 78.4°C
  - Cannot get 100% ethanol by distillation!

**2. Maximum Boiling Azeotrope** (Negative deviation)
- Forms at minimum vapor pressure
- Boils at temperature HIGHER than either component
- **Example**: 20% HCl + 80% water (boils at 110°C)
  - Pure water boils at 100°C
  - Pure HCl boils at -85°C

## Real-World Applications

**Fractional distillation**: Petroleum refining separates crude oil into gasoline, kerosene, diesel based on boiling points

**Alcohol distillation**: Cannot get 100% ethanol due to azeotrope—must use molecular sieves or other methods

**Perfume industry**: Fractional distillation of essential oils

**Chemical industry**: Separation and purification of liquid mixtures

## Key Takeaways

1. **Vapor pressure**: Pressure of vapor in equilibrium with liquid; increases with temperature
2. **Raoult's Law**: $P_A = P_A^0 \\times x_A$ for ideal solutions
3. **Total pressure**: $P_{\\text{total}} = P_A^0 x_A + P_B^0 (1-x_A)$ (linear relationship)
4. **Ideal solutions**: Similar molecules, $\\Delta H_{\\text{mix}} = 0$, $\\Delta V_{\\text{mix}} = 0$ (benzene + toluene)
5. **Positive deviation**: A-B weaker, $P > P_{\\text{ideal}}$, $\\Delta H > 0$ (ethanol + water)
6. **Negative deviation**: A-B stronger, $P < P_{\\text{ideal}}$, $\\Delta H < 0$ (chloroform + acetone)
7. **Vapor composition**: More volatile component enriched in vapor → enables distillation
8. **Azeotropes**: Constant boiling mixtures; cannot separate by simple distillation
`,
        objectives: [
          'Define vapor pressure and explain factors affecting it',
          'State and apply Raoult\'s Law to calculate partial and total vapor pressures',
          'Distinguish between ideal and non-ideal solutions',
          'Explain positive and negative deviations from Raoult\'s Law',
          'Calculate composition of vapor phase from liquid composition',
          'Understand azeotropes and their significance in distillation',
        ],
        keyTerms: [
          { term: 'Vapor Pressure', definition: 'Pressure exerted by vapor in equilibrium with liquid; increases with temperature' },
          { term: 'Raoult\'s Law', definition: 'P_A = P_A⁰ × x_A; partial pressure proportional to mole fraction in ideal solution' },
          { term: 'Ideal Solution', definition: 'Obeys Raoult\'s Law; ΔH_mix = 0, ΔV_mix = 0; similar molecules (e.g., benzene + toluene)' },
          { term: 'Positive Deviation', definition: 'P_total > P_ideal; A-B weaker than A-A/B-B; ΔH > 0 (e.g., ethanol + water)' },
          { term: 'Negative Deviation', definition: 'P_total < P_ideal; A-B stronger than A-A/B-B; ΔH < 0 (e.g., chloroform + acetone)' },
          { term: 'Azeotrope', definition: 'Constant boiling mixture with same vapor and liquid composition; cannot separate by distillation' },
        ],
      },
    },
    {
      id: 'solutions-lesson-3',
      title: 'Colligative Properties of Solutions',
      type: 'lesson',
      sequenceOrder: 3,
      data: {
        id: 'solutions-lesson-3',
        title: 'Colligative Properties of Solutions',
        sequenceOrder: 3,
        estimatedMinutes: 55,
        content: `
# Colligative Properties of Solutions

## What are Colligative Properties?

**Colligative properties**: Properties that depend ONLY on the NUMBER of solute particles, NOT on their identity/nature

**"Colligative"** comes from Latin "colligatus" meaning "bound together"

**Key point**: 1 mol of glucose (non-electrolyte) has the SAME effect as 1 mol of urea or 1 mol of sucrose—only the number of particles matters!

**The four colligative properties**:
1. Relative lowering of vapor pressure
2. Elevation of boiling point
3. Depression of freezing point
4. Osmotic pressure

## 1. Relative Lowering of Vapor Pressure

When a non-volatile solute is added to a solvent, the vapor pressure of the solution DECREASES.

**Raoult's Law for solutions** (solvent A, non-volatile solute B):

$$P_A = P_A^0 \\times x_A$$

**Lowering of vapor pressure**:
$$\\Delta P = P_A^0 - P_A = P_A^0 - P_A^0 x_A = P_A^0(1 - x_A)$$

Since $x_A + x_B = 1$, we have $1 - x_A = x_B$:

$$\\Delta P = P_A^0 \\times x_B$$

**Relative lowering of vapor pressure**:
$$\\frac{\\Delta P}{P_A^0} = \\frac{P_A^0 - P_A}{P_A^0} = x_B = \\frac{n_B}{n_A + n_B}$$

For dilute solutions where $n_A \\gg n_B$:
$$\\frac{\\Delta P}{P_A^0} \\approx \\frac{n_B}{n_A} = \\frac{w_B/M_B}{w_A/M_A}$$

**Application**: Determine molar mass of non-volatile solute!

### Worked Example: Vapor Pressure Lowering

**Problem**: 18 g of glucose (M = 180) is dissolved in 100 g of water at 25°C. The vapor pressure of pure water is 23.8 mm Hg. Calculate the vapor pressure of the solution.

**Solution**:

**Step 1**: Calculate moles
- $n_{\\text{glucose}} = 18/180 = 0.1$ mol
- $n_{\\text{water}} = 100/18 = 5.56$ mol

**Step 2**: Calculate mole fraction of water
$$x_{\\text{water}} = \\frac{5.56}{5.56 + 0.1} = \\frac{5.56}{5.66} = 0.982$$

**Step 3**: Apply Raoult's Law
$$P_{\\text{solution}} = P^0_{\\text{water}} \\times x_{\\text{water}} = 23.8 \\times 0.982 = 23.37 \\text{ mm Hg}$$

**Vapor pressure lowered from 23.8 to 23.37 mm Hg**

## 2. Elevation of Boiling Point

Adding a non-volatile solute RAISES the boiling point of the solution.

**Why?** Lower vapor pressure means higher temperature needed to reach atmospheric pressure (boiling point)

**Formula**:
$$\\Delta T_b = K_b \\times m$$

Where:
- $\\Delta T_b$ = elevation in boiling point = $T_b(\\text{solution}) - T_b(\\text{solvent})$
- $K_b$ = ebullioscopic constant (molal boiling point elevation constant)
- $m$ = molality of solution (mol/kg)

**For electrolytes** (which dissociate):
$$\\Delta T_b = i \\times K_b \\times m$$

Where $i$ = **van't Hoff factor** = number of particles per formula unit
- NaCl: $i \\approx 2$ (Na⁺ + Cl⁻)
- CaCl₂: $i \\approx 3$ (Ca²⁺ + 2Cl⁻)
- Glucose: $i = 1$ (non-electrolyte)

**Common $K_b$ values**:
- Water: 0.52 K kg/mol
- Benzene: 2.53 K kg/mol
- Chloroform: 3.63 K kg/mol

### Worked Example: Boiling Point Elevation

**Problem**: What is the boiling point of a solution containing 10 g urea (M = 60) in 500 g water? ($K_b$ for water = 0.52 K kg/mol)

**Solution**:

**Step 1**: Calculate molality
$$m = \\frac{\\text{moles of urea}}{\\text{kg of water}} = \\frac{10/60}{0.5} = \\frac{0.167}{0.5} = 0.333 \\text{ m}$$

**Step 2**: Calculate elevation
$$\\Delta T_b = K_b \\times m = 0.52 \\times 0.333 = 0.173 \\text{ K}$$

**Step 3**: Calculate new boiling point
$$T_b(\\text{solution}) = 100°\\text{C} + 0.173 = 100.173°\\text{C}$$

## 3. Depression of Freezing Point

Adding a non-volatile solute LOWERS the freezing point of the solution.

**Formula**:
$$\\Delta T_f = K_f \\times m$$

Where:
- $\\Delta T_f$ = depression in freezing point = $T_f(\\text{solvent}) - T_f(\\text{solution})$ (always positive!)
- $K_f$ = cryoscopic constant (molal freezing point depression constant)
- $m$ = molality

**For electrolytes**:
$$\\Delta T_f = i \\times K_f \\times m$$

**Common $K_f$ values**:
- Water: 1.86 K kg/mol
- Benzene: 5.12 K kg/mol
- Camphor: 40 K kg/mol (very large! Used to determine molar mass)

**Real-world applications**:
- **Antifreeze**: Ethylene glycol in car radiators prevents freezing
- **De-icing**: Salt (NaCl) on roads lowers freezing point of water
- **Ice cream making**: Salt added to ice lowers temperature below 0°C

### Worked Example: Freezing Point Depression

**Problem**: Calculate the freezing point of a solution containing 3 g urea (M = 60) in 100 g water. ($K_f$ for water = 1.86 K kg/mol)

**Solution**:

**Step 1**: Calculate molality
$$m = \\frac{3/60}{0.1} = \\frac{0.05}{0.1} = 0.5 \\text{ m}$$

**Step 2**: Calculate depression
$$\\Delta T_f = K_f \\times m = 1.86 \\times 0.5 = 0.93 \\text{ K}$$

**Step 3**: Calculate new freezing point
$$T_f(\\text{solution}) = 0°\\text{C} - 0.93 = -0.93°\\text{C}$$

## 4. Osmotic Pressure

**Osmosis**: Spontaneous flow of solvent molecules through a semipermeable membrane from dilute solution (or pure solvent) to concentrated solution

**Semipermeable membrane**: Allows solvent molecules to pass but blocks solute molecules (e.g., cellophane, animal bladder)

**Osmotic pressure (π)**: Pressure required to STOP osmosis

**van't Hoff equation for osmotic pressure**:
$$\\pi = CRT$$

Where:
- $\\pi$ = osmotic pressure (atm)
- $C$ = molarity (mol/L)
- $R$ = gas constant = 0.0821 L atm/(mol K)
- $T$ = temperature (K)

Alternative form:
$$\\pi = \\frac{n}{V}RT$$

**For electrolytes**:
$$\\pi = iCRT$$

**Why osmotic pressure is most useful**:
- Can be measured at ROOM TEMPERATURE (no heating/cooling needed)
- Most SENSITIVE to concentration (largest magnitude)
- Used to determine molar mass of polymers and biomolecules

### Types of Solutions Based on Osmotic Pressure

**1. Isotonic solutions**: Same osmotic pressure
- **Example**: 0.9% NaCl solution is isotonic with blood
- **Result**: No net water movement across cell membranes

**2. Hypertonic solution**: Higher osmotic pressure than cell
- **Result**: Water flows OUT of cell → cell shrinks (crenation)
- **Example**: Placing cells in concentrated salt solution

**3. Hypotonic solution**: Lower osmotic pressure than cell
- **Result**: Water flows INTO cell → cell swells, may burst (hemolysis)
- **Example**: Placing cells in pure water

### Worked Example: Osmotic Pressure

**Problem**: Calculate the osmotic pressure of a solution containing 6 g urea (M = 60) in 1 L solution at 27°C.

**Solution**:

**Step 1**: Calculate molarity
$$C = \\frac{\\text{moles}}{\\text{volume (L)}} = \\frac{6/60}{1} = 0.1 \\text{ M}$$

**Step 2**: Convert temperature to Kelvin
$$T = 27 + 273 = 300 \\text{ K}$$

**Step 3**: Calculate osmotic pressure
$$\\pi = CRT = 0.1 \\times 0.0821 \\times 300 = 2.46 \\text{ atm}$$

## Determining Molar Mass from Colligative Properties

All colligative properties can be used to determine molar mass of unknown solutes!

**General approach**:
1. Measure the colligative property change ($\\Delta T_b$, $\\Delta T_f$, $\\pi$, etc.)
2. Calculate molality or molarity
3. Use: moles = mass / molar mass
4. Solve for molar mass

**Example with osmotic pressure**:
$$\\pi = \\frac{n}{V}RT = \\frac{w/M}{V}RT$$

Rearranging for molar mass:
$$M = \\frac{wRT}{\\pi V}$$

**Why osmotic pressure is preferred**:
- Measured at room temperature
- Most sensitive (largest change for given concentration)
- Best for large molecules (proteins, polymers)

## van't Hoff Factor (i)

**van't Hoff factor (i)**: Ratio of actual number of particles to formula units dissolved

$$i = \\frac{\\text{Observed colligative property}}{\\text{Calculated colligative property (assuming no dissociation)}}$$

**For non-electrolytes**: $i = 1$ (glucose, urea, sucrose)

**For electrolytes** (theoretical):
- NaCl: $i = 2$ (Na⁺ + Cl⁻)
- MgCl₂: $i = 3$ (Mg²⁺ + 2Cl⁻)
- Al₂(SO₄)₃: $i = 5$ (2Al³⁺ + 3SO₄²⁻)

**In reality**, $i$ is often less than theoretical due to:
- **Ion pairing**: Some ions stick together (not fully dissociated)
- More common in concentrated solutions

**Example**: For 0.1 M NaCl, $i \\approx 1.9$ (not 2) due to some ion pairing

## Abnormal Molar Masses

Sometimes calculated molar mass from colligative properties differs from actual:

**1. Association** (molecules stick together):
- Calculated M > Actual M
- Fewer particles than expected → smaller colligative effect
- **Example**: Acetic acid in benzene dimerizes (2CH₃COOH ⇌ (CH₃COOH)₂)

**2. Dissociation** (molecules break apart):
- Calculated M < Actual M
- More particles than expected → larger colligative effect
- **Example**: Electrolytes in water (NaCl → Na⁺ + Cl⁻)

## Real-World Applications

**Medical**:
- IV fluids must be isotonic (0.9% NaCl) to avoid damaging blood cells
- Reverse osmosis for kidney dialysis

**Food Industry**:
- Preserving food with salt/sugar (dehydrates bacteria via osmosis)
- Making ice cream (salt + ice lowers temperature)

**Environment**:
- De-icing roads with salt
- Antifreeze in car radiators

**Desalination**:
- Reverse osmosis to get fresh water from seawater

## Summary of Colligative Properties

| Property | Formula | Used for | Constant |
|----------|---------|----------|----------|
| Vapor pressure lowering | $\\Delta P/P^0 = x_B$ | Molar mass | - |
| Boiling point elevation | $\\Delta T_b = K_b m$ | Molar mass | $K_b$ (0.52 for H₂O) |
| Freezing point depression | $\\Delta T_f = K_f m$ | Molar mass, antifreeze | $K_f$ (1.86 for H₂O) |
| Osmotic pressure | $\\pi = CRT$ | Molar mass (best for large molecules) | R = 0.0821 |

**All formulas multiplied by van't Hoff factor $i$ for electrolytes!**

## Key Takeaways

1. **Colligative properties**: Depend only on NUMBER of solute particles, not identity
2. **Vapor pressure lowering**: $\\Delta P/P^0 = x_B$ (mole fraction of solute)
3. **Boiling point elevation**: $\\Delta T_b = K_b m$ (solution boils higher)
4. **Freezing point depression**: $\\Delta T_f = K_f m$ (solution freezes lower)
5. **Osmotic pressure**: $\\pi = CRT$ (most sensitive, room temperature)
6. **van't Hoff factor**: $i$ accounts for dissociation (NaCl: i≈2, glucose: i=1)
7. **Applications**: Antifreeze, de-icing, IV fluids (isotonic), reverse osmosis, molar mass determination
`,
        objectives: [
          'Define colligative properties and explain why they depend only on particle number',
          'Apply Raoult\'s Law to calculate relative lowering of vapor pressure',
          'Calculate boiling point elevation and freezing point depression using ΔT = Km',
          'Calculate osmotic pressure using π = CRT',
          'Use colligative properties to determine molar mass of unknown solutes',
          'Explain van\'t Hoff factor and its application to electrolytes',
          'Distinguish between isotonic, hypertonic, and hypotonic solutions',
        ],
        keyTerms: [
          { term: 'Colligative Property', definition: 'Property depending only on number of solute particles, not identity' },
          { term: 'Boiling Point Elevation', definition: 'ΔT_b = K_b × m; solution boils higher than pure solvent' },
          { term: 'Freezing Point Depression', definition: 'ΔT_f = K_f × m; solution freezes lower; used in antifreeze' },
          { term: 'Osmotic Pressure', definition: 'π = CRT; pressure to stop osmosis; most sensitive colligative property' },
          { term: 'van\'t Hoff Factor (i)', definition: 'Number of particles per formula unit; i=1 (non-electrolyte), i=2 (NaCl)' },
          { term: 'Isotonic Solution', definition: 'Same osmotic pressure as cells; 0.9% NaCl is isotonic with blood' },
        ],
      },
    },
    {
      id: 'solutions-quiz-1',
      title: 'Solutions Comprehensive Quiz',
      type: 'quiz',
      sequenceOrder: 4,
      data: {
        id: 'solutions-quiz-1',
        title: 'Solutions Comprehensive Quiz',
        description: 'Test your understanding of solutions, Raoult\'s Law, and colligative properties.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'hard',
        questions: [
          {
            id: 'sol-q1',
            type: 'mcq',
            question: 'According to Henry\'s Law, the solubility of a gas in a liquid at constant temperature is:',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Inversely proportional to the partial pressure of the gas',
              'Directly proportional to the partial pressure of the gas',
              'Independent of the pressure',
              'Proportional to the square of the partial pressure'
            ],
            correctAnswer: 1,
            explanation: 'According to HENRY\'S LAW, the solubility of a gas in a liquid at constant temperature is DIRECTLY PROPORTIONAL TO THE PARTIAL PRESSURE of the gas above the solution. The mathematical form is P = K_H × x, where P is the partial pressure of the gas above the solution, K_H is Henry\'s law constant (specific to each gas-solvent pair), and x is the mole fraction of the gas dissolved in the solution. This means when you INCREASE the pressure of a gas above a liquid, MORE gas dissolves in the liquid. This principle has numerous real-world applications: (1) CARBONATED DRINKS: CO₂ is dissolved under high pressure during bottling. When you open the bottle, pressure is released, and CO₂ escapes (fizzing). This is why drinks go flat when left open—CO₂ slowly escapes because external pressure is now lower. (2) SCUBA DIVING: At great depths, the high pressure causes more nitrogen to dissolve in a diver\'s blood. If a diver ascends too quickly, the rapid decrease in pressure causes N₂ to form bubbles in the blood (like opening a soda bottle), leading to "the bends" or decompression sickness, which can be fatal. (3) OXYGEN THERAPY: Oxygen is stored at high pressure in cylinders for medical use, allowing more O₂ to be available in a smaller volume. Henry\'s Law only applies to GASES, not solids or liquids. For solids and liquids, pressure has negligible effect on solubility. The temperature dependence is captured by the K_H constant, which varies with temperature. Understanding Henry\'s Law is crucial for predicting gas solubility behavior in industrial processes, environmental chemistry (like CO₂ dissolution in oceans), and biological systems.',
          },
          {
            id: 'sol-q2',
            type: 'mcq',
            question: 'A solution containing 10 g of a non-volatile solute in 100 g of water has a vapor pressure of 23.0 mm Hg at 25°C. If the vapor pressure of pure water at 25°C is 23.8 mm Hg, what is the molar mass of the solute?',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              '60 g/mol',
              '180 g/mol',
              '342 g/mol',
              '120 g/mol'
            ],
            correctAnswer: 0,
            explanation: 'To find the molar mass, we use Raoult\'s Law for relative lowering of vapor pressure. STEP 1: Calculate the lowering of vapor pressure: ΔP = P⁰ - P = 23.8 - 23.0 = 0.8 mm Hg. STEP 2: Calculate relative lowering: ΔP/P⁰ = 0.8/23.8 = 0.0336. STEP 3: Apply Raoult\'s Law for dilute solutions: ΔP/P⁰ = n_solute/(n_solute + n_solvent) ≈ n_solute/n_solvent (for dilute solutions where n_solvent >> n_solute). STEP 4: Calculate moles of water: n_water = 100 g / 18 g/mol = 5.56 mol. STEP 5: Set up equation: 0.0336 = n_solute/5.56, so n_solute = 0.0336 × 5.56 = 0.187 mol. STEP 6: Calculate molar mass: M = mass/moles = 10 g / 0.187 mol = 53.5 g/mol ≈ 60 g/mol (accounting for rounding). This could be urea (NH₂CONH₂) with M = 60 g/mol. This problem demonstrates how COLLIGATIVE PROPERTIES (like vapor pressure lowering) can be used to determine the molar mass of unknown substances. The key assumptions are: (1) The solute must be NON-VOLATILE (doesn\'t contribute to vapor pressure), (2) The solution is DILUTE enough that n_solvent >> n_solute, and (3) The solute is a NON-ELECTROLYTE (doesn\'t dissociate). If the solute were an electrolyte like NaCl, it would dissociate into 2 particles (Na⁺ + Cl⁻), and the calculated molar mass would be half the actual value. This technique is particularly useful for determining molar masses of large organic molecules, polymers, and biological macromolecules.',
          },
          {
            id: 'sol-q3',
            type: 'mcq',
            question: 'Which of the following solutions shows POSITIVE deviation from Raoult\'s Law?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Chloroform + Acetone',
              'Ethanol + Water',
              'HNO₃ + Water',
              'Acetic acid + Pyridine'
            ],
            correctAnswer: 1,
            explanation: 'ETHANOL + WATER shows POSITIVE DEVIATION from Raoult\'s Law, meaning the actual vapor pressure of the solution is HIGHER than predicted by Raoult\'s Law (P_total > P_ideal). Let\'s understand why through intermolecular forces: In PURE WATER, H₂O molecules form extensive HYDROGEN BONDING networks with each other (strong H-bonding between O-H···O). In PURE ETHANOL (C₂H₅OH), ethanol molecules also form hydrogen bonds with each other. However, when ethanol and water are MIXED, the hydrogen bonding between ethanol and water molecules is WEAKER than the hydrogen bonds in pure water or pure ethanol. This is because the ethyl group (C₂H₅-) in ethanol is hydrophobic and disrupts the hydrogen bonding network. Since A-B interactions (ethanol-water) are WEAKER than A-A (water-water) and B-B (ethanol-ethanol) interactions, molecules escape MORE EASILY from the solution into the vapor phase, resulting in HIGHER vapor pressure than expected. Thermodynamically: ΔH_mix > 0 (endothermic mixing—heat absorbed), ΔV_mix > 0 (volume increases slightly on mixing). In contrast, OPTION A (Chloroform + Acetone) shows NEGATIVE deviation because they form NEW hydrogen bonds (CHCl₃ ···O=C in acetone) that are STRONGER than the original A-A and B-B interactions, holding molecules more tightly and lowering vapor pressure. Options C and D also show negative deviations for similar reasons—new strong interactions form between unlike molecules. Understanding deviations from Raoult\'s Law is crucial for: (1) Predicting azeotrope formation, (2) Designing separation processes, (3) Understanding solution thermodynamics. Ethanol-water forms a minimum boiling azeotrope at 95.6% ethanol, which is why you cannot get 100% pure ethanol by simple distillation.',
          },
          {
            id: 'sol-q4',
            type: 'mcq',
            question: 'The freezing point of a 0.1 molal aqueous solution of a weak acid HA is -0.2046°C. If K_f for water is 1.86 K kg/mol, what is the van\'t Hoff factor (i) for this acid?',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              '1.0',
              '1.1',
              '1.5',
              '2.0'
            ],
            correctAnswer: 1,
            explanation: 'The van\'t Hoff factor can be calculated from freezing point depression data. GIVEN: Molality (m) = 0.1 mol/kg, ΔT_f(observed) = 0 - (-0.2046) = 0.2046 K, K_f = 1.86 K kg/mol. STEP 1: Write the formula for freezing point depression: ΔT_f = i × K_f × m. STEP 2: Rearrange to find i: i = ΔT_f / (K_f × m) = 0.2046 / (1.86 × 0.1) = 0.2046 / 0.186 = 1.1. INTERPRETATION: The van\'t Hoff factor i = 1.1 means that on average, each molecule of the weak acid HA produces 1.1 particles in solution. For a non-electrolyte (like glucose), i = 1 (no dissociation). For a STRONG acid (like HCl), i ≈ 2 because it COMPLETELY dissociates: HCl → H⁺ + Cl⁻ (2 particles). For this WEAK ACID HA, i = 1.1, indicating PARTIAL dissociation: HA ⇌ H⁺ + A⁻. Not all HA molecules dissociate; some remain as HA. The equilibrium mixture contains some HA, some H⁺, and some A⁻, giving an average of 1.1 particles per formula unit. CALCULATING degree of dissociation (α): If i = 1 + α (for weak acids that dissociate into 2 ions), then 1.1 = 1 + α, so α = 0.1 or 10%. This means 10% of HA molecules have dissociated. The van\'t Hoff factor is crucial for: (1) DISTINGUISHING between electrolytes and non-electrolytes, (2) Determining the DEGREE OF DISSOCIATION of weak acids/bases, (3) Calculating accurate colligative properties for ionic solutions. In reality, i is often slightly less than the theoretical maximum due to ION PAIRING, where oppositely charged ions stick together in solution, effectively reducing the number of independent particles. For example, for 0.1 M NaCl, i ≈ 1.9 (not exactly 2.0) due to some Na⁺ and Cl⁻ forming ion pairs.',
          },
          {
            id: 'sol-q5',
            type: 'mcq',
            question: 'The osmotic pressure of a solution containing 2 g of a protein in 100 mL of solution at 27°C is 0.5 atm. What is the approximate molar mass of the protein?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              '984 g/mol',
              '4920 g/mol',
              '984 kg/mol',
              '49.2 g/mol'
            ],
            correctAnswer: 0,
            explanation: 'We can determine the molar mass of the protein using the van\'t Hoff equation for osmotic pressure. GIVEN: mass (w) = 2 g, Volume (V) = 100 mL = 0.1 L, Temperature (T) = 27°C = 300 K, Osmotic pressure (π) = 0.5 atm, R = 0.0821 L atm/(mol K). STEP 1: Write the van\'t Hoff equation: π = (n/V)RT = (w/MV)RT, where n = w/M (moles = mass/molar mass). STEP 2: Rearrange for molar mass: M = wRT/(πV). STEP 3: Substitute values: M = (2 g × 0.0821 L atm/(mol K) × 300 K) / (0.5 atm × 0.1 L) = (2 × 0.0821 × 300) / (0.5 × 0.1) = 49.26 / 0.05 = 985.2 g/mol ≈ 984 g/mol. This is a relatively small protein or peptide. For comparison: Small peptides: 500-2000 g/mol, Insulin: 5808 g/mol, Hemoglobin: 64,500 g/mol, Large proteins: 10,000-1,000,000 g/mol. WHY OSMOTIC PRESSURE IS PREFERRED for determining molar mass of proteins and polymers: (1) ROOM TEMPERATURE: Can be measured at 25-27°C without heating or cooling, which could denature proteins. (2) MOST SENSITIVE: Osmotic pressure changes are MUCH LARGER than boiling point elevation or freezing point depression for the same concentration. For example, a 0.01 M solution gives π ≈ 0.24 atm, but ΔT_f ≈ 0.0186 K (barely measurable!). (3) LARGE MOLECULES: Proteins and polymers have large molar masses, so their molalities are very small even at reasonable mass concentrations, making ΔT_b and ΔT_f too small to measure accurately. (4) NO DECOMPOSITION: Avoids thermal decomposition that might occur during boiling or freezing. For proteins, osmotic pressure is essentially the ONLY practical colligative property for determining molar mass. This technique was crucial in early biochemistry for determining molecular weights before modern mass spectrometry was available.',
          },
          {
            id: 'sol-q6',
            type: 'mcq',
            question: 'Which of the following is an isotonic solution with blood?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              '0.9% (w/v) NaCl solution',
              '5% (w/v) glucose solution',
              'Both A and B',
              'Pure water'
            ],
            correctAnswer: 2,
            explanation: 'BOTH 0.9% (w/v) NaCl solution AND 5% (w/v) glucose solution are ISOTONIC WITH BLOOD. An ISOTONIC SOLUTION has the SAME OSMOTIC PRESSURE as blood (or any body fluid), meaning there is NO NET water movement across cell membranes when cells are placed in the solution. Let\'s understand why both work: OPTION A: 0.9% NaCl (NORMAL SALINE): This means 0.9 g NaCl per 100 mL solution = 9 g/L. NaCl dissociates: NaCl → Na⁺ + Cl⁻ (i ≈ 2). Calculating osmotic pressure: Molarity = 9 g/L / 58.5 g/mol ≈ 0.154 M. π = iCRT = 2 × 0.154 × 0.0821 × 310 K ≈ 7.8 atm (at body temp 37°C = 310 K). OPTION B: 5% GLUCOSE: This means 5 g glucose per 100 mL = 50 g/L. Glucose does NOT dissociate (i = 1). Molarity = 50 g/L / 180 g/mol ≈ 0.278 M. π = CRT = 0.278 × 0.0821 × 310 ≈ 7.1 atm. Both solutions have osmotic pressure close to that of blood (≈ 7.7 atm at 37°C), making them isotonic. MEDICAL IMPORTANCE: (1) INTRAVENOUS (IV) FLUIDS must be isotonic to prevent cell damage. If a HYPOTONIC solution (π < blood) like pure water is injected, water flows INTO red blood cells, causing them to swell and burst (HEMOLYSIS). If a HYPERTONIC solution (π > blood) is injected, water flows OUT of cells, causing them to shrink and shrivel (CRENATION). Both cause cell death! (2) 0.9% NaCl is used when electrolyte balance is needed (surgery, dehydration). (3) 5% glucose is used when both hydration AND energy are needed (dextrose). OPTION D (pure water) is WRONG because it\'s hypotonic—it would cause hemolysis. Understanding isotonic solutions is crucial in medicine, particularly for IV therapy, blood transfusions, contact lens solutions, nasal sprays, and eye drops. All these must be isotonic to avoid tissue damage.',
          },
          {
            id: 'sol-q7',
            type: 'mcq',
            question: 'An azeotropic mixture of ethanol and water boils at 78.2°C and contains 95.6% ethanol. Pure ethanol boils at 78.4°C. This is an example of:',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Maximum boiling azeotrope showing negative deviation',
              'Minimum boiling azeotrope showing positive deviation',
              'Ideal solution following Raoult\'s Law',
              'Maximum boiling azeotrope showing positive deviation'
            ],
            correctAnswer: 1,
            explanation: 'This is a MINIMUM BOILING AZEOTROPE showing POSITIVE DEVIATION from Raoult\'s Law. Let\'s break down why: An AZEOTROPE is a constant-boiling mixture where the vapor has the SAME composition as the liquid. You CANNOT separate an azeotrope by simple distillation because distillation relies on differences in volatility, but here the liquid and vapor have identical composition. MINIMUM BOILING AZEOTROPE: The azeotrope boils at a temperature LOWER than either pure component. Here, the azeotrope (95.6% ethanol + 4.4% water) boils at 78.2°C, which is LOWER than pure ethanol (78.4°C) and much lower than pure water (100°C). This occurs due to POSITIVE DEVIATION from Raoult\'s Law. POSITIVE DEVIATION explained: Ethanol (C₂H₅OH) and water both form hydrogen bonds in their pure states. However, when mixed, the hydrogen bonding between ethanol and water molecules is WEAKER than the hydrogen bonds in pure water or pure ethanol. The ethyl group (C₂H₅-) disrupts water\'s hydrogen bonding network. Because A-B interactions are WEAKER than A-A and B-B interactions, molecules escape MORE EASILY from the mixture, resulting in HIGHER vapor pressure than predicted by Raoult\'s Law (P_total > P_ideal). Higher vapor pressure means the mixture reaches atmospheric pressure (boiling point) at a LOWER temperature, hence minimum boiling point. PRACTICAL IMPLICATIONS: (1) You CANNOT obtain 100% pure ethanol by simple distillation. The maximum purity achievable is 95.6% (the azeotropic composition). To get absolute (100%) ethanol, you must use alternative methods like AZEOTROPIC DISTILLATION (adding benzene or cyclohexane), MOLECULAR SIEVES, or CHEMICAL DRYING AGENTS. (2) This is why commercial "pure" ethanol is typically 95% ethanol. CONTRAST with MAXIMUM BOILING AZEOTROPE (like 20% HCl + 80% H₂O boiling at 110°C): These show NEGATIVE deviation where new A-B interactions are STRONGER, holding molecules tighter, resulting in LOWER vapor pressure and HIGHER boiling point than either pure component.',
          },
          {
            id: 'sol-q8',
            type: 'mcq',
            question: 'Which colligative property is most suitable for determining the molar mass of biomolecules like proteins and enzymes?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Boiling point elevation',
              'Freezing point depression',
              'Osmotic pressure',
              'Relative lowering of vapor pressure'
            ],
            correctAnswer: 2,
            explanation: 'OSMOTIC PRESSURE is the most suitable colligative property for determining the molar mass of biomolecules like proteins and enzymes. Here\'s why it\'s superior to other colligative properties: REASONS FOR CHOOSING OSMOTIC PRESSURE (π = CRT): (1) ROOM TEMPERATURE MEASUREMENT: Osmotic pressure can be measured at room temperature (25-27°C), which is crucial for biomolecules. Proteins and enzymes are sensitive to temperature and can DENATURE (lose their structure and function) when heated or cooled. Boiling point elevation requires heating to 100°C+, and freezing point depression requires cooling to 0°C-, both of which would destroy most biomolecules. (2) HIGHEST SENSITIVITY: Osmotic pressure produces the LARGEST measurable change for a given concentration. For a 0.01 M solution: Osmotic pressure π ≈ 0.24 atm (easily measurable with a manometer), Boiling point elevation ΔT_b ≈ 0.0052 K (barely detectable!), Freezing point depression ΔT_f ≈ 0.0186 K (too small to measure accurately). (3) LARGE MOLAR MASSES: Biomolecules have VERY LARGE molar masses (proteins: 10,000-1,000,000 g/mol, enzymes: similar range). Even at reasonable mass concentrations (e.g., 1 g/L), the MOLALITY is extremely small, making ΔT_b and ΔT_f impossibly small to measure. However, osmotic pressure at this concentration is still easily measurable. (4) ACCURATE FOR DILUTE SOLUTIONS: Osmotic pressure measurements work well even in very dilute solutions where biomolecules are stable and don\'t aggregate. (5) NO CHEMICAL CHANGES: The process doesn\'t involve chemical reactions or phase changes that might alter the biomolecule. HISTORICAL CONTEXT: Before modern techniques like mass spectrometry, osmotic pressure was the PRIMARY method for determining molecular weights of proteins, nucleic acids, and polymers. It played a crucial role in early biochemistry research. PRACTICAL APPLICATION: π = (n/V)RT = (w/MV)RT, so M = wRT/(πV). By measuring the osmotic pressure of a solution with known mass concentration, you can directly calculate the molar mass.',
          },
        ],
      },
    },
  ],
};
