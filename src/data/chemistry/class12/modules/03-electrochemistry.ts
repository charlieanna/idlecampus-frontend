import type { ChemistryModule } from '../../types';

export const electrochemistryModule: ChemistryModule = {
  id: 'class12-electrochemistry',
  slug: 'electrochemistry',
  title: 'Electrochemistry',
  description: 'Understand galvanic cells, Nernst equation, and batteries.',
  icon: 'battery-charging',
  sequenceOrder: 3,
  estimatedHours: 18,
  topic: 'physical',
  difficulty: 'hard',
  learningOutcomes: ['Explain galvanic cells', 'Apply Nernst equation', 'Understand batteries'],
  items: [
    {
      id: 'electrochemistry-lesson-1',
      type: 'lesson',
      title: 'Electrochemical Cells and Electrode Potential',
      description: 'Learn about redox reactions, galvanic cells, electrode potentials, and cell notation.',
      estimatedTime: 45,
      objectives: [
        'Understand redox reactions and oxidation states',
        'Differentiate between galvanic and electrolytic cells',
        'Master electrochemical cell notation',
        'Calculate standard electrode potentials and cell potentials',
        'Relate cell potential to spontaneity and Gibbs free energy'
      ],
      keyTerms: [
        'Redox reaction',
        'Oxidation',
        'Reduction',
        'Galvanic cell',
        'Electrolytic cell',
        'Anode',
        'Cathode',
        'Salt bridge',
        'Half-cell reaction',
        'Standard electrode potential (E°)',
        'Standard hydrogen electrode (SHE)',
        'Cell potential',
        'Electromotive force (EMF)'
      ],
      content: `
# Electrochemical Cells and Electrode Potential

## Introduction to Electrochemistry

**Electrochemistry** is the branch of chemistry that studies the interconversion between **chemical energy** and **electrical energy**.

**Two main types of processes**:
1. **Spontaneous redox reactions** → Generate electrical energy (Galvanic/Voltaic cells) → **Batteries**
2. **Non-spontaneous reactions** → Driven by electrical energy (Electrolytic cells) → **Electroplating, charging batteries**

---

## Redox Reactions: A Quick Review

### What is a Redox Reaction?

**Redox reaction** = **Red**uction + **Ox**idation occurring simultaneously

- **Oxidation**: Loss of electrons, increase in oxidation state
- **Reduction**: Gain of electrons, decrease in oxidation state

**Example**:
$\\text{Zn}(s) + \\text{Cu}^{2+}(aq) \\rightarrow \\text{Zn}^{2+}(aq) + \\text{Cu}(s)$

- Zn loses 2 e⁻ (oxidized): $\\text{Zn} \\rightarrow \\text{Zn}^{2+} + 2e^-$
- Cu²⁺ gains 2 e⁻ (reduced): $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}$

**Memory aid**: **OIL RIG**
- **O**xidation **I**s **L**oss (of electrons)
- **R**eduction **I**s **G**ain (of electrons)

### Oxidizing and Reducing Agents

- **Oxidizing agent**: Species that gets reduced (accepts electrons)
  - In the example above: Cu²⁺ is the oxidizing agent
- **Reducing agent**: Species that gets oxidized (donates electrons)
  - In the example above: Zn is the reducing agent

---

## Electrochemical Cells

An **electrochemical cell** is a device that converts chemical energy into electrical energy (or vice versa) through redox reactions.

### 1. Galvanic (Voltaic) Cells

**Galvanic cell**: Converts chemical energy → electrical energy
- Spontaneous redox reaction
- Produces electric current
- Examples: Batteries (dry cell, car battery)

**Components**:
1. **Anode**: Electrode where **oxidation** occurs (negative terminal)
2. **Cathode**: Electrode where **reduction** occurs (positive terminal)
3. **Salt bridge**: Maintains electrical neutrality by allowing ion flow
4. **External circuit**: Path for electron flow from anode to cathode

**Memory aid**: **"An Ox"** and **"Red Cat"**
- **An**ode = **Ox**idation
- **Red**uction at **Cat**hode

### Daniell Cell Example

A classic galvanic cell using Zn and Cu electrodes:

**Anode (oxidation)**:
$\\text{Zn}(s) \\rightarrow \\text{Zn}^{2+}(aq) + 2e^-$

**Cathode (reduction)**:
$\\text{Cu}^{2+}(aq) + 2e^- \\rightarrow \\text{Cu}(s)$

**Overall cell reaction**:
$\\text{Zn}(s) + \\text{Cu}^{2+}(aq) \\rightarrow \\text{Zn}^{2+}(aq) + \\text{Cu}(s)$

**How it works**:
1. Zn atoms at the anode lose electrons and become Zn²⁺ ions (enter solution)
2. Electrons travel through external wire to cathode
3. Cu²⁺ ions at cathode gain electrons and deposit as Cu metal
4. Salt bridge (KCl or KNO₃) allows SO₄²⁻ ions to flow toward Zn half-cell and K⁺ toward Cu half-cell to maintain charge balance

### 2. Electrolytic Cells

**Electrolytic cell**: Converts electrical energy → chemical energy
- Non-spontaneous redox reaction
- Requires external power source
- Examples: Electroplating, electrolysis of water, charging batteries

**Key difference from galvanic**:
- Still: oxidation at anode, reduction at cathode
- But: anode is **positive** terminal, cathode is **negative** terminal (connected to battery)

---

## Electrode Potential

### Standard Hydrogen Electrode (SHE)

**Problem**: We cannot measure the absolute potential of a single electrode.

**Solution**: Define a reference electrode with potential = 0.00 V

**Standard Hydrogen Electrode (SHE)**:
- H₂ gas at 1 atm bubbled over Pt electrode in 1 M H⁺ solution at 25°C
- Half-reaction: $2\\text{H}^+(aq) + 2e^- \\rightleftharpoons \\text{H}_2(g)$
- **Defined**: $E^\\circ_{\\text{H}^+/\\text{H}_2} = 0.00 \\text{ V}$

### Standard Electrode Potential (E°)

**Standard electrode potential** ($E^\\circ$): Potential of a half-cell measured against SHE under standard conditions:
- 25°C (298 K)
- 1 M concentration for solutions
- 1 atm pressure for gases

**Sign convention**:
- All half-reactions written as **reduction**
- Example: $\\text{Zn}^{2+}(aq) + 2e^- \\rightarrow \\text{Zn}(s)$, $E^\\circ = -0.76 \\text{ V}$

**Interpretation**:
- **Positive $E^\\circ$**: Strong tendency to be reduced (good oxidizing agent)
  - Example: $\\text{F}_2 + 2e^- \\rightarrow 2\\text{F}^-$, $E^\\circ = +2.87 \\text{ V}$ (strongest oxidizer)
- **Negative $E^\\circ$**: Weak tendency to be reduced → strong tendency to be oxidized (good reducing agent)
  - Example: $\\text{Li}^+ + e^- \\rightarrow \\text{Li}$, $E^\\circ = -3.05 \\text{ V}$ (strongest reducer)

### Electrochemical Series

Arranging half-reactions by their $E^\\circ$ values gives the **electrochemical series**:

| Half-reaction | $E^\\circ$ (V) |
|--------------|--------------|
| $\\text{F}_2 + 2e^- \\rightarrow 2\\text{F}^-$ | +2.87 |
| $\\text{Cl}_2 + 2e^- \\rightarrow 2\\text{Cl}^-$ | +1.36 |
| $\\text{Ag}^+ + e^- \\rightarrow \\text{Ag}$ | +0.80 |
| $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}$ | +0.34 |
| $2\\text{H}^+ + 2e^- \\rightarrow \\text{H}_2$ | 0.00 |
| $\\text{Zn}^{2+} + 2e^- \\rightarrow \\text{Zn}$ | -0.76 |
| $\\text{Li}^+ + e^- \\rightarrow \\text{Li}$ | -3.05 |

**Top** = Strong oxidizing agents (easily reduced)
**Bottom** = Strong reducing agents (easily oxidized)

---

## Cell Potential Calculations

### Standard Cell Potential ($E^\\circ_{\\text{cell}}$)

**Formula**:
$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$

Or equivalently:
$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{reduction}} - E^\\circ_{\\text{oxidation}}$

**Shortcut**: Since all standard potentials are reduction potentials:
$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} + (-E^\\circ_{\\text{anode}})$

**Example**: Daniell cell
- Cathode (reduction): $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}$, $E^\\circ = +0.34 \\text{ V}$
- Anode (oxidation): $\\text{Zn} \\rightarrow \\text{Zn}^{2+} + 2e^-$, $E^\\circ_{\\text{Zn}^{2+}/\\text{Zn}} = -0.76 \\text{ V}$

$E^\\circ_{\\text{cell}} = 0.34 - (-0.76) = 0.34 + 0.76 = +1.10 \\text{ V}$

### Spontaneity and Free Energy

**Relationship between cell potential and Gibbs free energy**:

$\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}}$

Where:
- $\\Delta G^\\circ$ = standard Gibbs free energy change (J/mol)
- $n$ = number of moles of electrons transferred
- $F$ = Faraday constant = 96,485 C/mol (or ~96,500 C/mol)
- $E^\\circ_{\\text{cell}}$ = standard cell potential (V)

**Spontaneity criteria**:

| $E^\\circ_{\\text{cell}}$ | $\\Delta G^\\circ$ | Spontaneity |
|-------------------------|------------------|------------|
| Positive (+) | Negative (-) | Spontaneous |
| Zero (0) | Zero (0) | Equilibrium |
| Negative (-) | Positive (+) | Non-spontaneous |

**For galvanic cells**: $E^\\circ_{\\text{cell}} > 0$ → Spontaneous
**For electrolytic cells**: $E^\\circ_{\\text{cell}} < 0$ → Non-spontaneous (needs external energy)

**Example**: Daniell cell
- $E^\\circ_{\\text{cell}} = +1.10 \\text{ V}$
- $n = 2$ electrons
- $\\Delta G^\\circ = -2 \\times 96,485 \\times 1.10 = -212,267 \\text{ J/mol} = -212.3 \\text{ kJ/mol}$
- Negative $\\Delta G^\\circ$ → **Spontaneous reaction**

---

## Cell Notation (Line Notation)

A shorthand way to represent electrochemical cells:

**Format**:
$\\text{Anode} | \\text{Anode solution} || \\text{Cathode solution} | \\text{Cathode}$

**Rules**:
- Single vertical line (|) = phase boundary
- Double vertical line (||) = salt bridge
- Anode (oxidation) written on **left**
- Cathode (reduction) written on **right**
- Concentrations in parentheses

**Example**: Daniell cell
$\\text{Zn}(s) | \\text{Zn}^{2+}(1 \\text{ M}) || \\text{Cu}^{2+}(1 \\text{ M}) | \\text{Cu}(s)$

**With inert electrodes**: If no solid metal is involved in half-reaction, use Pt or graphite:
$\\text{Pt}(s) | \\text{H}_2(1 \\text{ atm}) | \\text{H}^+(1 \\text{ M}) || \\text{Ag}^+(1 \\text{ M}) | \\text{Ag}(s)$

---

## Real-World Applications

### 1. **Corrosion Protection**

- Sacrificial anodes (Mg, Zn) protect ship hulls and pipelines
- Metal with more negative $E^\\circ$ gets oxidized preferentially, protecting the structure

### 2. **Batteries**

- All batteries are galvanic cells
- Primary cells (non-rechargeable): Dry cell, alkaline battery
- Secondary cells (rechargeable): Lead-acid battery, lithium-ion battery

### 3. **Electroplating**

- Electrolytic cell used to deposit metal coating (e.g., gold plating jewelry)

### 4. **Fuel Cells**

- Convert chemical energy of fuels (H₂, methanol) directly to electricity
- Used in space shuttles, vehicles, and portable power

---

## Practice Problems

**Problem 1**: Calculate $E^\\circ_{\\text{cell}}$ for the reaction:
$\\text{Fe}^{2+}(aq) + \\text{Ag}^+(aq) \\rightarrow \\text{Fe}^{3+}(aq) + \\text{Ag}(s)$

Given: $E^\\circ_{\\text{Fe}^{3+}/\\text{Fe}^{2+}} = +0.77 \\text{ V}$, $E^\\circ_{\\text{Ag}^+/\\text{Ag}} = +0.80 \\text{ V}$

**Solution**:
- Identify cathode (reduction): $\\text{Ag}^+ + e^- \\rightarrow \\text{Ag}$, $E^\\circ = +0.80 \\text{ V}$
- Identify anode (oxidation): $\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + e^-$, $E^\\circ = +0.77 \\text{ V}$
- $E^\\circ_{\\text{cell}} = 0.80 - 0.77 = +0.03 \\text{ V}$
- Since $E^\\circ_{\\text{cell}} > 0$, reaction is spontaneous

**Problem 2**: For a cell with $E^\\circ_{\\text{cell}} = 0.46 \\text{ V}$ and $n = 2$, calculate $\\Delta G^\\circ$.

**Solution**:
$\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}} = -2 \\times 96,485 \\times 0.46 = -88,766 \\text{ J/mol} = -88.8 \\text{ kJ/mol}$

---

## Key Takeaways

1. **Redox reactions** involve simultaneous oxidation and reduction
2. **Galvanic cells** convert chemical → electrical energy (spontaneous, $E^\\circ_{\\text{cell}} > 0$)
3. **Electrolytic cells** convert electrical → chemical energy (non-spontaneous, $E^\\circ_{\\text{cell}} < 0$)
4. **Oxidation at anode**, **reduction at cathode** (both cell types)
5. **Standard electrode potentials** measured vs. SHE (0.00 V)
6. **$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$**
7. **$\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}}$** relates spontaneity to cell potential
8. **Cell notation**: Anode | Anode solution || Cathode solution | Cathode

Understanding these fundamentals prepares you for the Nernst equation and practical applications of electrochemistry!
`
    },
    {
      id: 'electrochemistry-lesson-2',
      type: 'lesson',
      title: 'Nernst Equation and Batteries',
      description: 'Apply the Nernst equation to non-standard conditions and explore various battery technologies.',
      estimatedTime: 50,
      objectives: [
        'Derive and apply the Nernst equation',
        'Calculate cell potential at non-standard conditions',
        'Relate cell potential to equilibrium constant',
        'Understand different types of batteries and their chemistry',
        'Analyze battery performance and applications'
      ],
      keyTerms: [
        'Nernst equation',
        'Non-standard conditions',
        'Reaction quotient (Q)',
        'Equilibrium constant (K)',
        'Concentration cell',
        'Primary cell',
        'Secondary cell',
        'Dry cell (Leclanche cell)',
        'Alkaline battery',
        'Lead-acid battery',
        'Lithium-ion battery',
        'Fuel cell',
        'Specific energy',
        'Specific power'
      ],
      content: `
# Nernst Equation and Batteries

## The Nernst Equation

### Why Do We Need It?

Standard electrode potentials ($E^\\circ$) apply only under **standard conditions**:
- 25°C (298 K)
- 1 M concentration
- 1 atm pressure

**Real-world problem**: Batteries and cells rarely operate at standard conditions!
- Concentrations change as reactions proceed
- Temperature varies
- Need to predict cell potential under ANY conditions

**Solution**: The **Nernst equation** relates cell potential to concentration.

### Derivation from Thermodynamics

From Gibbs free energy:
$\\Delta G = \\Delta G^\\circ + RT \\ln Q$

And we know:
$\\Delta G = -nFE_{\\text{cell}}$
$\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}}$

Substituting:
$-nFE_{\\text{cell}} = -nFE^\\circ_{\\text{cell}} + RT \\ln Q$

Dividing by $-nF$:
$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q$

### Nernst Equation (Natural Log Form)

$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q$

Where:
- $E_{\\text{cell}}$ = cell potential at non-standard conditions (V)
- $E^\\circ_{\\text{cell}}$ = standard cell potential (V)
- $R$ = gas constant = 8.314 J/(mol·K)
- $T$ = temperature (K)
- $n$ = number of electrons transferred
- $F$ = Faraday constant = 96,485 C/mol
- $Q$ = reaction quotient

### Nernst Equation (Base-10 Log Form)

At **25°C (298 K)**, converting to log₁₀:

$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log Q$

**Derivation of 0.0591**:
$\\frac{RT \\ln 10}{F} = \\frac{8.314 \\times 298 \\times 2.303}{96,485} = 0.0591 \\text{ V}$

### Reaction Quotient (Q)

For a general reaction:
$aA + bB \\rightarrow cC + dD$

$Q = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$

**Important notes**:
- Only include **aqueous ions** and **gases** in Q
- Pure solids and liquids have activity = 1 (omitted from Q)
- For gases, use partial pressure in atm

---

## Applications of the Nernst Equation

### Example 1: Daniell Cell at Non-Standard Conditions

**Cell reaction**:
$\\text{Zn}(s) + \\text{Cu}^{2+}(aq) \\rightarrow \\text{Zn}^{2+}(aq) + \\text{Cu}(s)$

Given:
- $E^\\circ_{\\text{cell}} = 1.10 \\text{ V}$
- $[\\text{Zn}^{2+}] = 0.1 \\text{ M}$, $[\\text{Cu}^{2+}] = 1.0 \\text{ M}$
- $T = 298 \\text{ K}$

**Solution**:
$Q = \\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = \\frac{0.1}{1.0} = 0.1$

$E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2} \\log(0.1)$
$E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2} \\times (-1)$
$E_{\\text{cell}} = 1.10 + 0.02955 = 1.13 \\text{ V}$

**Interpretation**: Lower product concentration → higher cell potential (drives reaction forward)

### Example 2: Effect of Dilution

For the same Daniell cell, if we dilute Cu²⁺ to 0.01 M and keep Zn²⁺ at 0.1 M:

$Q = \\frac{0.1}{0.01} = 10$

$E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2} \\log(10)$
$E_{\\text{cell}} = 1.10 - 0.02955 = 1.07 \\text{ V}$

**Interpretation**: Higher product/reactant ratio → lower cell potential

### Example 3: Predicting Direction of Reaction

If $E_{\\text{cell}} > 0$ → Reaction proceeds forward (spontaneous)
If $E_{\\text{cell}} < 0$ → Reaction proceeds backward
If $E_{\\text{cell}} = 0$ → System at equilibrium

---

## Relationship Between $E^\\circ_{\\text{cell}}$ and Equilibrium Constant

At **equilibrium**:
- $E_{\\text{cell}} = 0$ (no net electron flow)
- $Q = K$ (reaction quotient equals equilibrium constant)

Substituting into Nernst equation:
$0 = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log K$

Rearranging:
$E^\\circ_{\\text{cell}} = \\frac{0.0591}{n} \\log K$

Or:
$\\log K = \\frac{nE^\\circ_{\\text{cell}}}{0.0591}$

**Key relationships** (at 25°C):

| $E^\\circ_{\\text{cell}}$ | $K$ | Favorability |
|-------------------------|-----|-------------|
| Large positive | Very large ($K \\gg 1$) | Products strongly favored |
| Small positive | $K > 1$ | Products favored |
| Zero | $K = 1$ | Equal amounts |
| Negative | $K < 1$ | Reactants favored |

### Example: Calculate K for Daniell Cell

$E^\\circ_{\\text{cell}} = 1.10 \\text{ V}$, $n = 2$

$\\log K = \\frac{2 \\times 1.10}{0.0591} = 37.2$

$K = 10^{37.2} \\approx 1.6 \\times 10^{37}$

**Interpretation**: Reaction goes essentially to completion!

---

## Concentration Cells

A **concentration cell** is a galvanic cell where both electrodes are the same material, but immersed in solutions of **different concentrations**.

**Example**: Cu concentration cell
$\\text{Cu}(s) | \\text{Cu}^{2+}(0.01 \\text{ M}) || \\text{Cu}^{2+}(1.0 \\text{ M}) | \\text{Cu}(s)$

**Half-reactions**:
- Anode (lower concentration): $\\text{Cu}(s) \\rightarrow \\text{Cu}^{2+}(0.01 \\text{ M}) + 2e^-$
- Cathode (higher concentration): $\\text{Cu}^{2+}(1.0 \\text{ M}) + 2e^- \\rightarrow \\text{Cu}(s)$

**Net reaction**: $\\text{Cu}^{2+}(1.0 \\text{ M}) \\rightarrow \\text{Cu}^{2+}(0.01 \\text{ M})$
(Dilution process)

**Cell potential**:
$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log \\frac{[\\text{Cu}^{2+}]_{\\text{anode}}}{[\\text{Cu}^{2+}]_{\\text{cathode}}}$

Since $E^\\circ_{\\text{cell}} = 0$ (same electrodes):
$E_{\\text{cell}} = - \\frac{0.0591}{2} \\log \\frac{0.01}{1.0} = - \\frac{0.0591}{2} \\times (-2) = 0.0591 \\text{ V}$

**Note**: Cell potential depends ONLY on concentration ratio, not on the specific metal.

---

## Batteries: Practical Galvanic Cells

A **battery** is a galvanic cell (or series of cells) designed for practical use.

### Classification

**1. Primary cells** (Non-rechargeable):
- Chemical reactions irreversible
- Discarded when discharged
- Examples: Dry cell, alkaline battery

**2. Secondary cells** (Rechargeable):
- Reactions reversible by applying external voltage
- Can be recharged hundreds of times
- Examples: Lead-acid, lithium-ion, nickel-cadmium

**3. Fuel cells**:
- Continuous supply of reactants
- Reactants not contained within cell
- Example: Hydrogen-oxygen fuel cell

---

## Primary Cells

### 1. Dry Cell (Leclanche Cell)

**Common use**: Flashlights, toys, remote controls

**Components**:
- **Anode**: Zinc container
- **Cathode**: Graphite rod surrounded by MnO₂ and carbon powder
- **Electrolyte**: Paste of NH₄Cl and ZnCl₂

**Reactions**:
- Anode: $\\text{Zn}(s) \\rightarrow \\text{Zn}^{2+}(aq) + 2e^-$
- Cathode: $\\text{MnO}_2(s) + \\text{NH}_4^+(aq) + e^- \\rightarrow \\text{MnO(OH)}(s) + \\text{NH}_3(aq)$

**Voltage**: ~1.5 V per cell

**Disadvantages**:
- Not truly rechargeable
- Voltage drops as discharged
- Can leak NH₄Cl

### 2. Alkaline Battery

**Improvement over dry cell**: Uses KOH (alkaline) instead of acidic NH₄Cl

**Components**:
- **Anode**: Powdered zinc
- **Cathode**: MnO₂
- **Electrolyte**: KOH paste

**Reactions**:
- Anode: $\\text{Zn}(s) + 2\\text{OH}^-(aq) \\rightarrow \\text{ZnO}(s) + \\text{H}_2\\text{O}(l) + 2e^-$
- Cathode: $2\\text{MnO}_2(s) + \\text{H}_2\\text{O}(l) + 2e^- \\rightarrow \\text{Mn}_2\\text{O}_3(s) + 2\\text{OH}^-(aq)$

**Voltage**: 1.5 V per cell

**Advantages**:
- Longer shelf life
- Better performance at low temperatures
- Less prone to leakage
- Higher energy density

---

## Secondary Cells (Rechargeable)

### 1. Lead-Acid Battery

**Common use**: Car batteries, UPS systems

**Components**:
- **Anode**: Lead (Pb) grid
- **Cathode**: Lead dioxide (PbO₂) grid
- **Electrolyte**: 38% H₂SO₄ solution

**Discharge reactions**:
- Anode: $\\text{Pb}(s) + \\text{SO}_4^{2-}(aq) \\rightarrow \\text{PbSO}_4(s) + 2e^-$
- Cathode: $\\text{PbO}_2(s) + 4\\text{H}^+(aq) + \\text{SO}_4^{2-}(aq) + 2e^- \\rightarrow \\text{PbSO}_4(s) + 2\\text{H}_2\\text{O}(l)$

**Overall discharge**:
$\\text{Pb}(s) + \\text{PbO}_2(s) + 2\\text{H}_2\\text{SO}_4(aq) \\rightarrow 2\\text{PbSO}_4(s) + 2\\text{H}_2\\text{O}(l)$

**Charging**: Reverse the reactions by applying external voltage

**Voltage**: ~2 V per cell (car battery has 6 cells = 12 V)

**Advantages**:
- High power output (starting cars)
- Inexpensive
- Reliable

**Disadvantages**:
- Heavy
- Contains toxic lead
- Acid can spill

**Monitoring**: As battery discharges, H₂SO₄ is consumed → density of electrolyte decreases (can be measured)

### 2. Lithium-Ion Battery

**Common use**: Laptops, smartphones, electric vehicles

**Components**:
- **Anode**: Graphite (carbon)
- **Cathode**: Lithium metal oxide (LiCoO₂, LiFePO₄)
- **Electrolyte**: Lithium salt in organic solvent

**Discharge reactions**:
- Anode: $\\text{Li}_x\\text{C}_6 \\rightarrow x\\text{Li}^+ + xe^- + \\text{C}_6$
- Cathode: $\\text{Li}_{1-x}\\text{CoO}_2 + x\\text{Li}^+ + xe^- \\rightarrow \\text{LiCoO}_2$

**Voltage**: 3.6-3.7 V per cell

**Advantages**:
- High energy density (stores more energy per weight)
- Light weight
- No memory effect
- Low self-discharge

**Disadvantages**:
- Expensive
- Can overheat/catch fire if damaged
- Degrades over time

**Applications**: Portable electronics, electric vehicles (Tesla uses ~7,000 cells!)

### 3. Nickel-Cadmium (NiCd) Battery

**Discharge**:
- Anode: $\\text{Cd}(s) + 2\\text{OH}^-(aq) \\rightarrow \\text{Cd(OH)}_2(s) + 2e^-$
- Cathode: $2\\text{NiO(OH)}(s) + 2\\text{H}_2\\text{O}(l) + 2e^- \\rightarrow 2\\text{Ni(OH)}_2(s) + 2\\text{OH}^-(aq)$

**Voltage**: 1.2 V per cell

**Disadvantages**:
- "Memory effect" (loses capacity if repeatedly recharged before full discharge)
- Toxic cadmium
- Largely replaced by NiMH and Li-ion batteries

---

## Fuel Cells

A **fuel cell** converts chemical energy of a fuel directly into electricity without combustion.

### Hydrogen-Oxygen Fuel Cell

**Most common type**: Used in space shuttles, buses, experimental cars

**Reactions**:
- Anode: $2\\text{H}_2(g) + 4\\text{OH}^-(aq) \\rightarrow 4\\text{H}_2\\text{O}(l) + 4e^-$
- Cathode: $\\text{O}_2(g) + 2\\text{H}_2\\text{O}(l) + 4e^- \\rightarrow 4\\text{OH}^-(aq)$

**Overall**: $2\\text{H}_2(g) + \\text{O}_2(g) \\rightarrow 2\\text{H}_2\\text{O}(l)$

**Voltage**: ~1.2 V per cell

**Advantages**:
- **Environmentally friendly**: Only byproduct is water
- High efficiency (~60%, vs. ~25% for internal combustion)
- Quiet operation
- No moving parts

**Disadvantages**:
- Expensive (requires platinum catalyst)
- H₂ storage and transport challenges
- Infrastructure not widely available

**Applications**:
- Space exploration (NASA used in Apollo missions)
- Prototype vehicles (Toyota Mirai, Honda Clarity)
- Backup power systems

---

## Battery Performance Metrics

### 1. Specific Energy (Energy Density)

$\\text{Specific Energy} = \\frac{\\text{Energy stored}}{\\text{Mass}}$ (Wh/kg)

**Higher is better** for portable devices

**Comparison**:
- Lead-acid: 30-50 Wh/kg
- NiMH: 60-120 Wh/kg
- Lithium-ion: 100-265 Wh/kg

### 2. Specific Power (Power Density)

$\\text{Specific Power} = \\frac{\\text{Power output}}{\\text{Mass}}$ (W/kg)

**Higher is better** for applications needing quick bursts (starting car engine)

**Comparison**:
- Lead-acid: High specific power (good for cars)
- Lithium-ion: Moderate specific power

### 3. Cycle Life

Number of charge-discharge cycles before capacity drops to 80% of original

**Comparison**:
- Lead-acid: 200-300 cycles
- NiCd: 1,000 cycles
- Lithium-ion: 300-500 cycles (modern versions: 1,000+)

---

## Real-World Applications

### 1. **Electric Vehicles (EVs)**

- Use lithium-ion battery packs (Tesla Model S: 85 kWh battery)
- Range anxiety addressed by improving energy density
- Charging infrastructure expanding (Superchargers)

### 2. **Grid Energy Storage**

- Store renewable energy (solar/wind) for use when not generating
- Large-scale lithium-ion or flow batteries

### 3. **Medical Devices**

- Pacemakers use lithium-iodine batteries (last 10+ years)
- Portable defibrillators use high-power lithium batteries

### 4. **Space Exploration**

- Mars rovers use plutonium-powered radioisotope batteries
- ISS uses regenerative fuel cells (solar + electrolysis)

---

## Practice Problems

**Problem 1**: Calculate the cell potential for the reaction at 25°C:
$\\text{Zn}(s) + \\text{Ag}^+(0.25 \\text{ M}) \\rightarrow \\text{Zn}^{2+}(0.75 \\text{ M}) + \\text{Ag}(s)$

Given: $E^\\circ_{\\text{cell}} = 1.56 \\text{ V}$, $n = 2$

**Solution**:
$Q = \\frac{[\\text{Zn}^{2+}]}{[\\text{Ag}^+]^2} = \\frac{0.75}{(0.25)^2} = \\frac{0.75}{0.0625} = 12$

$E_{\\text{cell}} = 1.56 - \\frac{0.0591}{2} \\log(12) = 1.56 - 0.02955 \\times 1.08 = 1.56 - 0.032 = 1.53 \\text{ V}$

**Problem 2**: Calculate the equilibrium constant for a reaction with $E^\\circ_{\\text{cell}} = 0.35 \\text{ V}$ and $n = 3$.

**Solution**:
$\\log K = \\frac{3 \\times 0.35}{0.0591} = 17.8$

$K = 10^{17.8} \\approx 6.3 \\times 10^{17}$ (products heavily favored)

**Problem 3**: A concentration cell has [Cu²⁺] = 0.001 M at anode and 2.0 M at cathode. Calculate $E_{\\text{cell}}$.

**Solution**:
$E_{\\text{cell}} = 0 - \\frac{0.0591}{2} \\log \\frac{0.001}{2.0} = - \\frac{0.0591}{2} \\times (-3.30) = 0.097 \\text{ V}$

---

## Key Takeaways

1. **Nernst equation**: $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log Q$ (at 25°C)
2. **Cell potential decreases** as products accumulate and reactants deplete
3. At **equilibrium**: $E_{\\text{cell}} = 0$ and $Q = K$
4. **$E^\\circ_{\\text{cell}}$ and K relationship**: $\\log K = \\frac{nE^\\circ_{\\text{cell}}}{0.0591}$
5. **Concentration cells** generate voltage solely from concentration differences
6. **Primary cells** (dry, alkaline) are non-rechargeable
7. **Secondary cells** (lead-acid, Li-ion) are rechargeable
8. **Fuel cells** offer clean energy but face cost/infrastructure challenges
9. **Lithium-ion** batteries dominate portable electronics due to high energy density
10. Battery selection depends on **specific energy**, **specific power**, and **cycle life**

Next, we'll explore electrolysis, conductance, and corrosion!
`
    },
    {
      id: 'electrochemistry-lesson-3',
      type: 'lesson',
      title: 'Electrolysis, Conductance, and Corrosion',
      description: 'Master electrolysis, Faraday\'s laws, conductance measurements, and corrosion prevention.',
      estimatedTime: 55,
      objectives: [
        'Understand electrolysis and its industrial applications',
        'Apply Faraday\'s laws to calculate quantities in electrolysis',
        'Define and calculate conductance and molar conductivity',
        'Apply Kohlrausch\'s law of independent migration',
        'Explain corrosion mechanisms and prevention methods'
      ],
      keyTerms: [
        'Electrolysis',
        'Faraday\'s first law',
        'Faraday\'s second law',
        'Electrochemical equivalent',
        'Conductance',
        'Specific conductivity',
        'Molar conductivity',
        'Kohlrausch\'s law',
        'Limiting molar conductivity',
        'Degree of dissociation',
        'Corrosion',
        'Rusting',
        'Galvanization',
        'Cathodic protection'
      ],
      content: `
# Electrolysis, Conductance, and Corrosion

## Electrolysis

### What is Electrolysis?

**Electrolysis**: Using electrical energy to drive a **non-spontaneous** chemical reaction.

**Key differences from galvanic cells**:
- Galvanic cell: Spontaneous reaction → produces electricity ($E_{\\text{cell}} > 0$)
- Electrolytic cell: Non-spontaneous reaction → requires electricity ($E_{\\text{cell}} < 0$)

**Still true**: Oxidation at anode, reduction at cathode

**BUT**: In electrolytic cells:
- Anode is **positive** (connected to + terminal of battery)
- Cathode is **negative** (connected to - terminal of battery)

### Electrolysis of Molten NaCl

**Simplest example**: Molten (liquid) sodium chloride

**At cathode (reduction)**:
$\\text{Na}^+ + e^- \\rightarrow \\text{Na}(l)$

**At anode (oxidation)**:
$2\\text{Cl}^- \\rightarrow \\text{Cl}_2(g) + 2e^-$

**Overall**:
$2\\text{NaCl}(l) \\xrightarrow{\\text{electricity}} 2\\text{Na}(l) + \\text{Cl}_2(g)$

**Industrial importance**: Downs process for commercial sodium production

### Electrolysis of Aqueous Solutions

**More complex**: Water can also be oxidized or reduced!

**Competing reactions at cathode**:
1. $\\text{Na}^+ + e^- \\rightarrow \\text{Na}$ ($E^\\circ = -2.71 \\text{ V}$)
2. $2\\text{H}_2\\text{O} + 2e^- \\rightarrow \\text{H}_2 + 2\\text{OH}^-$ ($E^\\circ = -0.83 \\text{ V}$)

**Which occurs?** The one with **less negative** (more positive) $E^\\circ$ → **Water reduction** (easier)

**Competing reactions at anode**:
1. $2\\text{Cl}^- \\rightarrow \\text{Cl}_2 + 2e^-$ ($E^\\circ = -1.36 \\text{ V}$)
2. $2\\text{H}_2\\text{O} \\rightarrow \\text{O}_2 + 4\\text{H}^+ + 4e^-$ ($E^\\circ = -1.23 \\text{ V}$)

**Which occurs?** Water oxidation is easier, but Cl₂ forms due to **overpotential** (kinetic factors)

**Result in practice** (concentrated NaCl solution):
- Cathode: H₂ gas evolves
- Anode: Cl₂ gas evolves (chlor-alkali industry)

### Electrolysis of Water

**Pure water**: Poor conductor (few ions)
**Add**: H₂SO₄ or NaOH as electrolyte (provides ions)

**At cathode (reduction)**:
$2\\text{H}_2\\text{O}(l) + 2e^- \\rightarrow \\text{H}_2(g) + 2\\text{OH}^-(aq)$

**At anode (oxidation)**:
$2\\text{H}_2\\text{O}(l) \\rightarrow \\text{O}_2(g) + 4\\text{H}^+(aq) + 4e^-$

**Overall**:
$2\\text{H}_2\\text{O}(l) \\xrightarrow{\\text{electricity}} 2\\text{H}_2(g) + \\text{O}_2(g)$

**Volume ratio**: H₂:O₂ = 2:1 (can be collected separately)

---

## Faraday's Laws of Electrolysis

### Faraday's First Law

**Statement**: The mass of substance deposited/liberated at an electrode is **directly proportional** to the quantity of electricity (charge) passed.

**Formula**:
$m \\propto Q$

Where:
- $m$ = mass deposited (g)
- $Q$ = charge passed (coulombs, C)

Since $Q = I \\times t$:
$m = Z \\times I \\times t$

Where:
- $Z$ = electrochemical equivalent (g/C)
- $I$ = current (amperes, A)
- $t$ = time (seconds, s)

### Electrochemical Equivalent (Z)

$Z = \\frac{\\text{Molar mass}}{n \\times F}$

Where:
- $n$ = number of electrons in half-reaction
- $F$ = Faraday constant = 96,485 C/mol

**More commonly used form**:
$m = \\frac{M \\times I \\times t}{n \\times F}$

**Example**: How much Cu is deposited by 2 A current for 1 hour?

Half-reaction: $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}$
- $M = 63.5$ g/mol
- $n = 2$
- $I = 2$ A
- $t = 1 \\text{ hour} = 3600$ s

$m = \\frac{63.5 \\times 2 \\times 3600}{2 \\times 96,485} = \\frac{457,200}{192,970} = 2.37 \\text{ g}$

### Faraday's Second Law

**Statement**: When the same quantity of electricity passes through different electrolytes, the masses of substances deposited are **proportional to their equivalent weights**.

$\\frac{m_1}{m_2} = \\frac{E_1}{E_2} = \\frac{M_1/n_1}{M_2/n_2}$

**Example**: Same current deposits 2 g of Cu. How much Ag is deposited?

- Cu: $M = 63.5$, $n = 2$ → Equivalent weight = 31.75
- Ag: $M = 108$, $n = 1$ → Equivalent weight = 108

$\\frac{m_{\\text{Ag}}}{2} = \\frac{108}{31.75}$

$m_{\\text{Ag}} = 2 \\times \\frac{108}{31.75} = 6.8 \\text{ g}$

---

## Industrial Applications of Electrolysis

### 1. **Electroplating**

Coating one metal with another for protection or decoration

**Example**: Chrome plating on car bumpers

**Setup**:
- Object to be plated = cathode
- Metal to be deposited = anode (or inert anode + metal salt solution)
- Electrolyte = metal salt solution

**Silver plating**:
- Cathode reaction: $\\text{Ag}^+ + e^- \\rightarrow \\text{Ag}$ (deposits on object)

### 2. **Extraction of Metals**

**Aluminum (Hall-Héroult process)**:
- Electrolysis of molten Al₂O₃ (bauxite) in cryolite
- Cathode: $\\text{Al}^{3+} + 3e^- \\rightarrow \\text{Al}$
- Requires huge amounts of electricity (energy-intensive!)

**Sodium (Downs process)**:
- Electrolysis of molten NaCl

### 3. **Refining of Metals**

**Copper refining**:
- Impure Cu = anode
- Pure Cu = cathode
- Electrolyte = CuSO₄ solution

Cu from impure anode dissolves, deposits as pure Cu at cathode. Impurities fall as "anode mud."

### 4. **Electrochemical Synthesis**

**Chlor-alkali industry**:
- Electrolysis of brine (NaCl solution)
- Products: Cl₂ (anode), H₂ (cathode), NaOH (solution)
- Major industrial process (produces bleach, PVC precursors, paper, etc.)

---

## Conductance in Electrolytic Solutions

### Resistance and Conductance

**Resistance** ($R$): Opposition to current flow (Ω, ohms)

**Conductance** ($G$): Ease of current flow (S, siemens = Ω⁻¹)

$G = \\frac{1}{R}$

For a conductor:
$R = \\rho \\frac{l}{A}$

Where:
- $\\rho$ = resistivity (Ω·m)
- $l$ = length (m)
- $A$ = cross-sectional area (m²)

Therefore:
$G = \\kappa \\frac{A}{l}$

Where $\\kappa$ (kappa) = **specific conductivity** = $1/\\rho$ (S/m or S cm⁻¹)

### Specific Conductivity (κ)

**Specific conductivity** (κ): Conductance of a 1 m cube of solution

$\\kappa = G \\times \\frac{l}{A} = \\frac{1}{R} \\times \\frac{l}{A}$

**Cell constant** ($G^* = l/A$): Determined by calibration

$\\kappa = G^* \\times G = \\frac{G^*}{R}$

**Units**: S m⁻¹ or S cm⁻¹

**Note**: κ depends on:
- **Concentration** (more ions → higher κ)
- **Nature of electrolyte**
- **Temperature** (higher T → higher κ)

### Molar Conductivity (Λₘ)

**Problem**: Specific conductivity κ increases with concentration, making comparisons difficult.

**Solution**: Define **molar conductivity** (Λₘ)

$\\Lambda_m = \\frac{\\kappa}{c}$

Where:
- $\\Lambda_m$ = molar conductivity (S m² mol⁻¹ or S cm² mol⁻¹)
- $c$ = concentration (mol m⁻³ or mol L⁻¹)

**If concentration in mol/L**:
$\\Lambda_m (\\text{S cm}^2 \\text{ mol}^{-1}) = \\frac{\\kappa (\\text{S cm}^{-1}) \\times 1000}{c (\\text{mol/L})}$

**Physical meaning**: Conductance of all ions from 1 mole of electrolyte

### Variation of Λₘ with Concentration

**Strong electrolytes** (HCl, NaCl, KNO₃):
- Completely dissociated at all concentrations
- Λₘ **increases slightly** as concentration **decreases**
- Reason: At high concentration, interionic attractions slow ions down

**Weak electrolytes** (CH₃COOH, NH₄OH):
- Partially dissociated
- Λₘ **increases sharply** as concentration **decreases**
- Reason: Degree of dissociation increases with dilution

### Limiting Molar Conductivity (Λₘ°)

**Λₘ°**: Molar conductivity at **infinite dilution** (concentration → 0)

**For strong electrolytes**:
- Can extrapolate Λₘ vs. √c plot to c = 0 to get Λₘ°

**For weak electrolytes**:
- Cannot extrapolate (sharp rise)
- Use **Kohlrausch's law** instead

---

## Kohlrausch's Law of Independent Migration

### Statement

At **infinite dilution**, each ion migrates independently, and the limiting molar conductivity is the **sum of individual ionic conductivities**.

$\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ$

Where:
- $\\lambda_+^\\circ$ = limiting molar conductivity of cation
- $\\lambda_-^\\circ$ = limiting molar conductivity of anion
- $\\nu_+, \\nu_-$ = number of cations/anions per formula unit

### Example 1: Calculate Λₘ° for NaCl

$\\Lambda_m^\\circ(\\text{NaCl}) = \\lambda_{\\text{Na}^+}^\\circ + \\lambda_{\\text{Cl}^-}^\\circ$

If $\\lambda_{\\text{Na}^+}^\\circ = 50.1$ S cm² mol⁻¹ and $\\lambda_{\\text{Cl}^-}^\\circ = 76.3$ S cm² mol⁻¹:

$\\Lambda_m^\\circ(\\text{NaCl}) = 50.1 + 76.3 = 126.4 \\text{ S cm}^2 \\text{ mol}^{-1}$

### Example 2: Calculate Λₘ° for CH₃COOH (weak electrolyte)

Cannot measure directly! Use Kohlrausch's law:

$\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\lambda_{\\text{CH}_3\\text{COO}^-}^\\circ + \\lambda_{\\text{H}^+}^\\circ$

**Strategy**: Measure strong electrolytes and add/subtract:

$\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) + \\Lambda_m^\\circ(\\text{HCl}) - \\Lambda_m^\\circ(\\text{NaCl})$

**Why this works**:
- $\\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) = \\lambda_{\\text{CH}_3\\text{COO}^-}^\\circ + \\lambda_{\\text{Na}^+}^\\circ$
- $\\Lambda_m^\\circ(\\text{HCl}) = \\lambda_{\\text{H}^+}^\\circ + \\lambda_{\\text{Cl}^-}^\\circ$
- $\\Lambda_m^\\circ(\\text{NaCl}) = \\lambda_{\\text{Na}^+}^\\circ + \\lambda_{\\text{Cl}^-}^\\circ$

Sum = $\\lambda_{\\text{CH}_3\\text{COO}^-}^\\circ + \\lambda_{\\text{H}^+}^\\circ$ ✓

### Application: Degree of Dissociation

For weak electrolyte at concentration $c$:

$\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}$

Where:
- $\\alpha$ = degree of dissociation (fraction dissociated, 0 to 1)
- $\\Lambda_m$ = molar conductivity at concentration $c$
- $\\Lambda_m^\\circ$ = limiting molar conductivity

**Example**: Acetic acid at 0.1 M has Λₘ = 5.2 S cm² mol⁻¹. If Λₘ° = 390.7 S cm² mol⁻¹:

$\\alpha = \\frac{5.2}{390.7} = 0.0133$ (only 1.33% dissociated!)

---

## Corrosion

### What is Corrosion?

**Corrosion**: Deterioration of metals due to electrochemical reactions with the environment.

**Most common**: Rusting of iron

### Mechanism of Rusting

Rust formation involves a **galvanic cell** on the metal surface!

**At anode** (metal surface):
$\\text{Fe}(s) \\rightarrow \\text{Fe}^{2+}(aq) + 2e^-$ (oxidation)

**At cathode** (near water droplet):
$\\text{O}_2(g) + 4\\text{H}^+(aq) + 4e^- \\rightarrow 2\\text{H}_2\\text{O}(l)$ (acidic)

Or in neutral/alkaline:
$\\text{O}_2(g) + 2\\text{H}_2\\text{O}(l) + 4e^- \\rightarrow 4\\text{OH}^-(aq)$

**Further reaction**:
$\\text{Fe}^{2+} + 2\\text{OH}^- \\rightarrow \\text{Fe(OH)}_2$ (ferrous hydroxide)

$4\\text{Fe(OH)}_2 + \\text{O}_2 + 2\\text{H}_2\\text{O} \\rightarrow 4\\text{Fe(OH)}_3$ (ferric hydroxide)

$\\text{Fe(OH)}_3 \\rightarrow \\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$ (**rust**, reddish-brown)

**Requirements for rusting**:
1. Presence of **water** (moisture)
2. Presence of **oxygen**
3. Electrolyte (salt accelerates: seawater rusts iron faster!)

### Factors Affecting Corrosion Rate

1. **Presence of electrolytes**: Salt water >> pure water
2. **Nature of metal**: Active metals (Zn, Fe) corrode faster than noble metals (Au, Pt)
3. **Presence of impurities**: Creates local galvanic cells
4. **pH**: Acidic conditions accelerate corrosion
5. **Temperature**: Higher temperature → faster corrosion
6. **Moisture**: Dry air → minimal corrosion

---

## Corrosion Prevention

### 1. **Barrier Protection**

**Paint/coating**: Physical barrier to moisture and oxygen
- Used on cars, bridges, buildings

**Oil/grease**: Temporary protection for machinery

**Plastic coating**: Durable protection

### 2. **Galvanization**

**Galvanization**: Coating iron with **zinc**

**How it works**:
- Zinc is more active than iron ($E^\\circ_{\\text{Zn}^{2+}/\\text{Zn}} = -0.76 \\text{ V}$ vs. $E^\\circ_{\\text{Fe}^{2+}/\\text{Fe}} = -0.44 \\text{ V}$)
- Even if coating scratches, Zn oxidizes **preferentially** (sacrificial protection)
- Zn acts as **sacrificial anode**

**Uses**: Galvanized iron sheets, pipes, buckets

### 3. **Cathodic Protection**

**Method 1: Sacrificial anode**
- Attach more active metal (Mg, Zn) to structure
- Active metal corrodes instead of Fe

**Uses**:
- Ship hulls (Mg blocks bolted on)
- Underground pipelines (Mg anodes buried alongside)

**Method 2: Impressed current**
- Apply external voltage to make structure the cathode
- Inert anode (graphite) used

### 4. **Alloying**

Mix iron with other metals to make it more resistant:
- **Stainless steel**: Fe + Cr + Ni (very corrosion-resistant)
- Used in cutlery, surgical instruments, chemical plants

### 5. **Electroplating**

Deposit thin layer of non-reactive metal:
- **Tin plating**: Tin cans (but if tin layer breaks, iron corrodes **faster** because Fe is anode)
- **Chromium plating**: Car parts, taps

### 6. **Anti-rust Solutions**

**Phosphate coating**: Forms protective Fe₃(PO₄)₂ layer
**Organic coatings**: Polymer-based coatings

---

## Real-World Applications

### 1. **Water Purification**

- Electrochlorination: Electrolysis of seawater produces Cl₂ for disinfection (ships, remote areas)

### 2. **Electrolytic Refining**

- Ultra-pure copper (99.99%) for electrical wires

### 3. **Anodizing Aluminum**

- Electrolytic process creates protective Al₂O₃ layer
- Used for aircraft parts, smartphone casings

### 4. **Sacrificial Anodes in Hot Water Heaters**

- Mg anode rod protects steel tank from corrosion
- Must be replaced periodically

### 5. **Electrowinning**

- Extract metals from ores using electrolysis
- Used for Cu, Zn, Au extraction

---

## Practice Problems

**Problem 1**: A current of 5 A is passed through AgNO₃ solution for 30 minutes. Calculate mass of Ag deposited.

Given: $M_{\\text{Ag}} = 108$ g/mol, $n = 1$

**Solution**:
$m = \\frac{M \\times I \\times t}{n \\times F} = \\frac{108 \\times 5 \\times (30 \\times 60)}{1 \\times 96,485}$

$m = \\frac{108 \\times 5 \\times 1800}{96,485} = \\frac{972,000}{96,485} = 10.1 \\text{ g}$

**Problem 2**: A solution has specific conductivity κ = 0.146 S cm⁻¹ at concentration 0.05 M. Calculate Λₘ.

**Solution**:
$\\Lambda_m = \\frac{\\kappa \\times 1000}{c} = \\frac{0.146 \\times 1000}{0.05} = 2920 \\text{ S cm}^2 \\text{ mol}^{-1}$

**Problem 3**: Given:
- $\\Lambda_m^\\circ(\\text{NaCl}) = 126.5$ S cm² mol⁻¹
- $\\Lambda_m^\\circ(\\text{HCl}) = 426.2$ S cm² mol⁻¹
- $\\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) = 91.0$ S cm² mol⁻¹

Calculate $\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH})$.

**Solution**:
$\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) + \\Lambda_m^\\circ(\\text{HCl}) - \\Lambda_m^\\circ(\\text{NaCl})$

$= 91.0 + 426.2 - 126.5 = 390.7 \\text{ S cm}^2 \\text{ mol}^{-1}$

---

## Key Takeaways

1. **Electrolysis**: Uses electrical energy to drive non-spontaneous reactions
2. **Faraday's first law**: $m = \\frac{M \\times I \\times t}{n \\times F}$
3. **Faraday's second law**: Masses deposited ∝ equivalent weights
4. **Applications**: Electroplating, metal extraction, refining, chlor-alkali industry
5. **Conductance**: $G = 1/R$, measured in siemens (S)
6. **Specific conductivity** (κ): Conductance of 1 m cube
7. **Molar conductivity**: $\\Lambda_m = \\kappa/c$, increases as c decreases
8. **Kohlrausch's law**: $\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ$
9. **Degree of dissociation**: $\\alpha = \\Lambda_m/\\Lambda_m^\\circ$
10. **Corrosion**: Electrochemical deterioration requiring moisture and oxygen
11. **Rusting**: Fe → Fe²⁺ + 2e⁻ (anode); O₂ + H₂O + 4e⁻ → 4OH⁻ (cathode)
12. **Prevention**: Barrier protection, galvanization, cathodic protection, alloying, electroplating

This completes our comprehensive study of electrochemistry!
`
    },
    {
      id: 'electrochemistry-quiz',
      type: 'quiz',
      title: 'Electrochemistry Comprehensive Quiz',
      description: 'Test your understanding of electrochemical cells, Nernst equation, batteries, electrolysis, conductance, and corrosion.',
      estimatedTime: 25,
      questions: [
        {
          id: 'echem-q1',
          question: 'Calculate the standard cell potential ($E^\\circ_{\\text{cell}}$) for the reaction: $\\text{2Al}(s) + 3\\text{Cu}^{2+}(aq) \\rightarrow 2\\text{Al}^{3+}(aq) + 3\\text{Cu}(s)$. Given: $E^\\circ_{\\text{Al}^{3+}/\\text{Al}} = -1.66$ V and $E^\\circ_{\\text{Cu}^{2+}/\\text{Cu}} = +0.34$ V. Is the reaction spontaneous?',
          options: [
            '$E^\\circ_{\\text{cell}} = +2.00$ V, spontaneous',
            '$E^\\circ_{\\text{cell}} = -1.32$ V, non-spontaneous',
            '$E^\\circ_{\\text{cell}} = +1.32$ V, non-spontaneous',
            '$E^\\circ_{\\text{cell}} = -2.00$ V, spontaneous'
          ],
          correctAnswer: 0,
          difficulty: 'easy',
          explanation: 'The correct answer is $E^\\circ_{\\text{cell}} = +2.00$ V, spontaneous. To solve this problem, we need to identify the half-reactions occurring at the anode and cathode. From the overall reaction, aluminum is being oxidized (losing electrons to form Al³⁺), making it the anode, while copper ions are being reduced (gaining electrons to form Cu metal), making it the cathode. Using the formula for standard cell potential: $E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$. The cathode is where reduction occurs: Cu²⁺ + 2e⁻ → Cu with $E^\\circ = +0.34$ V. The anode is where oxidation occurs: Al → Al³⁺ + 3e⁻ with $E^\\circ_{\\text{Al}^{3+}/\\text{Al}} = -1.66$ V. Therefore: $E^\\circ_{\\text{cell}} = 0.34 - (-1.66) = 0.34 + 1.66 = +2.00$ V. Since $E^\\circ_{\\text{cell}}$ is positive (+2.00 V), the reaction is spontaneous under standard conditions. This makes sense because aluminum is a much more active metal than copper (more negative standard reduction potential), so it readily donates electrons to Cu²⁺ ions. This large positive cell potential indicates a highly favorable reaction, which is why aluminum can displace copper from its salt solutions. The reaction would also have a large negative Gibbs free energy ($\\Delta G^\\circ = -nFE^\\circ_{\\text{cell}}$), further confirming spontaneity. This type of reaction is the basis for many galvanic cells and explains why certain metal displacement reactions occur naturally.'
        },
        {
          id: 'echem-q2',
          question: 'In a galvanic cell, which of the following statements is TRUE?',
          options: [
            'Oxidation occurs at the cathode, which is the positive terminal',
            'Reduction occurs at the anode, which is the negative terminal',
            'Oxidation occurs at the anode, which is the negative terminal',
            'Electrons flow from cathode to anode through the external circuit'
          ],
          correctAnswer: 2,
          difficulty: 'easy',
          explanation: 'The correct answer is "Oxidation occurs at the anode, which is the negative terminal." This is a fundamental concept in electrochemistry. In a galvanic (voltaic) cell, chemical energy is spontaneously converted to electrical energy. The anode is the electrode where oxidation occurs—this is where a species loses electrons. These electrons then flow through the external circuit to the cathode. Since electrons are leaving the anode, it becomes the negative terminal of the cell. The cathode, conversely, is where reduction occurs (a species gains electrons), and it is the positive terminal. A helpful mnemonic is "An Ox" (Anode = Oxidation) and "Red Cat" (Reduction = Cathode). These relationships are universal for all electrochemical cells, though the polarity differs between galvanic and electrolytic cells. Let\'s examine why the other options are incorrect: Option A incorrectly states oxidation occurs at the cathode—reduction occurs there. Option B incorrectly identifies reduction at the anode—oxidation happens at the anode. Option D has the electron flow backwards—electrons always flow from anode (negative) to cathode (positive) in the external circuit, driven by the potential difference. Understanding these fundamental relationships is crucial for analyzing any electrochemical system, from batteries to corrosion processes. The salt bridge in a galvanic cell maintains electrical neutrality by allowing ion migration while preventing the solutions from mixing directly.'
        },
        {
          id: 'echem-q3',
          question: 'Calculate the cell potential at 25°C for a Daniell cell where $[\\text{Zn}^{2+}] = 0.01$ M and $[\\text{Cu}^{2+}] = 2.0$ M. Given: $E^\\circ_{\\text{cell}} = 1.10$ V.',
          options: [
            '$E_{\\text{cell}} = 1.17$ V',
            '$E_{\\text{cell}} = 1.03$ V',
            '$E_{\\text{cell}} = 1.10$ V',
            '$E_{\\text{cell}} = 1.24$ V'
          ],
          correctAnswer: 0,
          difficulty: 'medium',
          explanation: 'The correct answer is $E_{\\text{cell}} = 1.17$ V. This problem requires application of the Nernst equation, which allows us to calculate cell potential under non-standard conditions. The Nernst equation at 25°C is: $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log Q$, where Q is the reaction quotient. For the Daniell cell, the reaction is: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). The number of electrons transferred (n) is 2. The reaction quotient is: $Q = \\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = \\frac{0.01}{2.0} = 0.005$. Now we can calculate: $E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2} \\log(0.005)$. First, calculate log(0.005) = -2.301. Then: $E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2} \\times (-2.301) = 1.10 - (-0.0680) = 1.10 + 0.0680 = 1.168$ V ≈ 1.17 V. Notice that the cell potential is higher than the standard value (1.10 V). This makes chemical sense: we have a very low concentration of product (Zn²⁺ = 0.01 M) and a high concentration of reactant (Cu²⁺ = 2.0 M), which favors the forward reaction according to Le Chatelier\'s principle. The Nernst equation quantifies this effect—when Q < 1 (products low, reactants high), the cell potential increases above the standard value. As the cell operates and approaches equilibrium, [Zn²⁺] will increase, [Cu²⁺] will decrease, Q will increase, and the cell potential will gradually decrease toward zero. This concept is critical for understanding battery behavior as they discharge.'
        },
        {
          id: 'echem-q4',
          question: 'A lead-acid car battery has 6 cells connected in series. Each cell produces approximately 2.0 V. During discharge, which reaction occurs at the positive electrode (cathode)?',
          options: [
            '$\\text{Pb}(s) + \\text{SO}_4^{2-}(aq) \\rightarrow \\text{PbSO}_4(s) + 2e^-$',
            '$\\text{PbO}_2(s) + 4\\text{H}^+(aq) + \\text{SO}_4^{2-}(aq) + 2e^- \\rightarrow \\text{PbSO}_4(s) + 2\\text{H}_2\\text{O}(l)$',
            '$\\text{PbSO}_4(s) + 2e^- \\rightarrow \\text{Pb}(s) + \\text{SO}_4^{2-}(aq)$',
            '$2\\text{H}_2\\text{O}(l) \\rightarrow \\text{O}_2(g) + 4\\text{H}^+(aq) + 4e^-$'
          ],
          correctAnswer: 1,
          difficulty: 'medium',
          explanation: 'The correct answer is: $\\text{PbO}_2(s) + 4\\text{H}^+(aq) + \\text{SO}_4^{2-}(aq) + 2e^- \\rightarrow \\text{PbSO}_4(s) + 2\\text{H}_2\\text{O}(l)$. The lead-acid battery is one of the most important rechargeable battery technologies, commonly used in automobiles. Understanding its chemistry is crucial. During discharge, the battery acts as a galvanic cell. At the cathode (positive electrode), reduction occurs. The lead dioxide (PbO₂) at the positive plate is reduced to lead sulfate (PbSO₄), consuming H⁺ ions and sulfate ions from the sulfuric acid electrolyte while producing water. This is a reduction because the oxidation state of lead decreases from +4 in PbO₂ to +2 in PbSO₄. Meanwhile, at the anode (negative electrode, not asked about but important to understand), Pb metal is oxidized to PbSO₄ according to option A. Both electrodes end up coated with PbSO₄, and the electrolyte (H₂SO₄) is consumed, decreasing its concentration. This is why the density of the electrolyte can be used to monitor battery charge—as the battery discharges, sulfuric acid is consumed and water is produced, lowering the solution density. The overall discharge reaction is: Pb(s) + PbO₂(s) + 2H₂SO₄(aq) → 2PbSO₄(s) + 2H₂O(l). When charging, this reaction is reversed by applying an external voltage, regenerating Pb, PbO₂, and H₂SO₄. The 6 cells in series produce 6 × 2.0 = 12 V, which is the standard voltage for car batteries. Options C and D represent different electrochemical processes not occurring during normal lead-acid battery discharge.'
        },
        {
          id: 'echem-q5',
          question: 'How much copper will be deposited when a current of 3 A flows through CuSO₄ solution for 2 hours? (Atomic mass of Cu = 63.5 g/mol, F = 96,485 C/mol)',
          options: [
            '4.74 g',
            '7.11 g',
            '9.48 g',
            '14.22 g'
          ],
          correctAnswer: 1,
          difficulty: 'medium',
          explanation: 'The correct answer is 7.11 g. This problem applies Faraday\'s first law of electrolysis, which states that the mass of substance deposited at an electrode is directly proportional to the quantity of electricity passed through the electrolyte. The formula is: $m = \\frac{M \\times I \\times t}{n \\times F}$, where M is the molar mass, I is current in amperes, t is time in seconds, n is the number of electrons in the half-reaction, and F is Faraday\'s constant. First, identify the half-reaction at the cathode where Cu is deposited: Cu²⁺ + 2e⁻ → Cu. This tells us n = 2. Given values: M = 63.5 g/mol, I = 3 A, t = 2 hours = 2 × 3600 = 7200 seconds, n = 2, F = 96,485 C/mol. Substituting into the formula: $m = \\frac{63.5 \\times 3 \\times 7200}{2 \\times 96,485} = \\frac{1,371,600}{192,970} = 7.11$ g. This calculation is fundamental to electroplating applications, where precise control over the thickness of deposited metal is required. The relationship shows that doubling the current or doubling the time will double the mass deposited. Similarly, metals requiring more electrons for deposition (higher n values) will deposit less mass for the same quantity of charge. For example, if we were depositing aluminum (Al³⁺ + 3e⁻ → Al), with n = 3, we would get less mass deposited for the same current and time compared to copper. This principle is used extensively in metal refining, electroplating jewelry and automotive parts, and in quantitative electrochemical analysis. Understanding Faraday\'s laws allows precise calculation of material quantities in industrial electrochemical processes, from large-scale aluminum smelting to delicate gold plating of electronic components.'
        },
        {
          id: 'echem-q6',
          question: 'A solution has a specific conductivity (κ) of 0.024 S cm⁻¹ and a concentration of 0.02 M. What is its molar conductivity (Λₘ)?',
          options: [
            '480 S cm² mol⁻¹',
            '1200 S cm² mol⁻¹',
            '120 S cm² mol⁻¹',
            '24 S cm² mol⁻¹'
          ],
          correctAnswer: 1,
          difficulty: 'easy',
          explanation: 'The correct answer is 1200 S cm² mol⁻¹. Molar conductivity (Λₘ) is a measure of the conducting power of all the ions produced by dissolving one mole of an electrolyte in solution. Unlike specific conductivity, which increases with concentration, molar conductivity allows for fair comparison between electrolytes at different concentrations. The relationship between molar conductivity and specific conductivity is: $\\Lambda_m = \\frac{\\kappa \\times 1000}{c}$, where κ is in S cm⁻¹ and c is concentration in mol/L (M). The factor of 1000 converts the units properly. Given: κ = 0.024 S cm⁻¹ and c = 0.02 M. Calculating: $\\Lambda_m = \\frac{0.024 \\times 1000}{0.02} = \\frac{24}{0.02} = 1200$ S cm² mol⁻¹. This value represents the conductance when all ions from one mole of the electrolyte are present in solution. Molar conductivity varies with concentration—it increases as concentration decreases (dilution) for all electrolytes. For strong electrolytes (completely dissociated), this increase is gradual because the degree of dissociation is already 100%; the increase is due to reduced interionic attractions at lower concentrations. For weak electrolytes (partially dissociated), molar conductivity increases sharply with dilution because the degree of dissociation increases significantly. At infinite dilution, molar conductivity reaches its maximum value, called limiting molar conductivity (Λₘ°), which can be calculated using Kohlrausch\'s law of independent migration of ions. Understanding molar conductivity is essential for determining the degree of dissociation of weak electrolytes, calculating dissociation constants, and studying ion mobilities in solution. It has practical applications in water quality testing, industrial process monitoring, and pharmaceutical formulation development.'
        },
        {
          id: 'echem-q7',
          question: 'Calculate the limiting molar conductivity ($\\Lambda_m^\\circ$) of acetic acid (CH₃COOH) using Kohlrausch\'s law, given: $\\Lambda_m^\\circ(\\text{HCl}) = 426$ S cm² mol⁻¹, $\\Lambda_m^\\circ(\\text{NaCl}) = 126$ S cm² mol⁻¹, $\\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) = 91$ S cm² mol⁻¹.',
          options: [
            '643 S cm² mol⁻¹',
            '209 S cm² mol⁻¹',
            '391 S cm² mol⁻¹',
            '517 S cm² mol⁻¹'
          ],
          correctAnswer: 2,
          difficulty: 'hard',
          explanation: 'The correct answer is 391 S cm² mol⁻¹. Kohlrausch\'s law of independent migration states that at infinite dilution, each ion contributes independently to the total molar conductivity. This is particularly useful for weak electrolytes like acetic acid, whose limiting molar conductivity cannot be measured directly because they don\'t fully dissociate even at high dilution. The strategy is to use strong electrolytes (which we can measure) to calculate the individual ionic conductivities. For acetic acid dissociation: CH₃COOH → CH₃COO⁻ + H⁺, we need the conductivities of acetate ion and hydrogen ion. Kohlrausch\'s formula: $\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\lambda_{\\text{CH}_3\\text{COO}^-}^\\circ + \\lambda_{\\text{H}^+}^\\circ$. We can obtain this by adding and subtracting known values: $\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = \\Lambda_m^\\circ(\\text{CH}_3\\text{COONa}) + \\Lambda_m^\\circ(\\text{HCl}) - \\Lambda_m^\\circ(\\text{NaCl})$. Here\'s why this works: CH₃COONa gives (λ_CH₃COO⁻ + λ_Na⁺), HCl gives (λ_H⁺ + λ_Cl⁻), and NaCl gives (λ_Na⁺ + λ_Cl⁻). When we add the first two and subtract the third: (λ_CH₃COO⁻ + λ_Na⁺) + (λ_H⁺ + λ_Cl⁻) - (λ_Na⁺ + λ_Cl⁻) = λ_CH₃COO⁻ + λ_H⁺, which is exactly what we need. Calculating: $\\Lambda_m^\\circ(\\text{CH}_3\\text{COOH}) = 91 + 426 - 126 = 391$ S cm² mol⁻¹. This value represents the molar conductivity of acetic acid if it were 100% dissociated. In reality, acetic acid is a weak acid with very low dissociation. We can use this Λₘ° value along with measured Λₘ at any concentration to find the degree of dissociation: α = Λₘ/Λₘ°. For example, if a 0.1 M acetic acid solution has Λₘ = 5.2 S cm² mol⁻¹, then α = 5.2/391 = 0.0133 or 1.33% dissociated. This demonstrates the power of Kohlrausch\'s law in electrochemistry and analytical chemistry.'
        },
        {
          id: 'echem-q8',
          question: 'Which of the following is the BEST method to prevent corrosion of an underground iron pipeline?',
          options: [
            'Painting the exterior surface with oil-based paint',
            'Connecting blocks of magnesium at intervals along the pipeline',
            'Coating the pipeline with a thin layer of copper',
            'Keeping the pipeline dry by installing drainage systems'
          ],
          correctAnswer: 1,
          difficulty: 'hard',
          explanation: 'The correct answer is "Connecting blocks of magnesium at intervals along the pipeline." This method is called cathodic protection using sacrificial anodes, and it is the most effective long-term solution for underground metal structures. Here\'s why it works and why it\'s superior to other options: Corrosion is an electrochemical process where iron acts as the anode (Fe → Fe²⁺ + 2e⁻) in the presence of moisture and oxygen. By connecting magnesium blocks to the pipeline, we create a galvanic cell where magnesium becomes the anode instead. Magnesium has a more negative standard reduction potential (E° = -2.37 V) compared to iron (E° = -0.44 V), meaning Mg is more easily oxidized. The magnesium sacrificially corrodes while protecting the iron pipeline, which now acts as the cathode where reduction occurs (O₂ + 2H₂O + 4e⁻ → 4OH⁻). The Mg blocks must be periodically replaced, but the pipeline remains intact. Let\'s examine why other options are inferior: Option A (painting) may work initially but is impractical for buried pipelines—any scratch or degradation of paint exposes iron, and repairs are difficult underground. Paint also degrades over time in soil. Option C (copper coating) would actually accelerate corrosion if the coating is scratched because copper is less active than iron (more positive E°), making iron the anode in any galvanic cell formed. Option D (drainage) is helpful but insufficient alone—even small amounts of moisture in soil can cause corrosion, and complete drainage of underground environments is nearly impossible. Cathodic protection is widely used for pipelines, ship hulls, offshore platforms, and storage tanks. An alternative method is impressed current cathodic protection, where an external power source makes the structure cathodic, but sacrificial anodes are simpler and don\'t require electrical power, making them ideal for remote pipelines. This electrochemical approach to corrosion prevention saves billions of dollars annually in infrastructure maintenance worldwide.'
        }
      ]
    }
  ],
};
