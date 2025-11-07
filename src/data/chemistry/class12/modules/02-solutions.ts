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
  ],
};
