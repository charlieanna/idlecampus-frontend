import type { ChemistryModule } from '../../types';

export const solidStateModule: ChemistryModule = {
  id: 'class12-solid-state',
  slug: 'solid-state',
  title: 'Solid State',
  description: 'Study crystal lattices, unit cells, packing efficiency, and solid properties.',
  icon: 'box',
  sequenceOrder: 1,
  estimatedHours: 14,
  topic: 'physical',
  difficulty: 'medium',
  learningOutcomes: [
    'Classify solids based on bonding',
    'Understand crystal lattices and unit cells',
    'Calculate packing efficiency',
  ],
  items: [
    {
      id: 'solid-lesson-1',
      title: 'Introduction to Solid State and Classification of Solids',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'solid-lesson-1',
        title: 'Introduction to Solid State and Classification of Solids',
        sequenceOrder: 1,
        estimatedMinutes: 45,
        content: `
# Introduction to Solid State and Classification of Solids

## What is the Solid State?

**Solid State**: Matter with definite shape and volume, where constituent particles are closely packed

**Characteristics of Solids**:
- **Definite shape and volume**: Unlike liquids and gases
- **Incompressibility**: Particles are already closely packed
- **Rigidity**: Resistance to flow
- **Short-range order or long-range order**: Depending on type

## Classification of Solids

Solids can be classified based on their internal structure:

### 1. Crystalline Solids

**Crystalline solids**: Particles arranged in a definite, repeating three-dimensional pattern (long-range order)

**Properties**:
- **Sharp melting point**: All bonds break at a specific temperature
- **Anisotropic**: Properties (electrical conductivity, refractive index) vary with direction
- **Definite geometric shape**: Regular faces, edges, angles
- **Cleavage**: Break along specific planes

**Examples**: NaCl, diamond, quartz, ice, metals

### 2. Amorphous Solids

**Amorphous solids**: Particles arranged randomly (short-range order only), no long-range pattern

**Properties**:
- **No sharp melting point**: Soften over a range of temperatures (behave like supercooled liquids)
- **Isotropic**: Properties same in all directions
- **Irregular shape**: No definite geometric form
- **Irregular cleavage**: Break irregularly

**Examples**: Glass, rubber, plastics, amorphous silica (SiO₂)

**Why glass is a supercooled liquid?**
When molten glass cools rapidly, SiO₂ molecules don't have time to arrange into a crystalline structure. They freeze in a disordered state, behaving as a very viscous liquid. This is why very old glass windows are thicker at the bottom—glass flows extremely slowly over centuries!

## Classification of Crystalline Solids Based on Bonding

Crystalline solids can be classified based on the type of particles and bonding:

### 1. Molecular Solids

**Constituent particles**: Molecules
**Bonding**: Van der Waals forces, dipole-dipole, hydrogen bonding

**Types**:

**a) Non-polar molecular solids**
- **Bonding**: Weak London dispersion forces
- **Examples**: Ar, CO₂ (dry ice), I₂, naphthalene
- **Properties**: Soft, low melting point, poor conductors

**b) Polar molecular solids**
- **Bonding**: Dipole-dipole interactions
- **Examples**: HCl, SO₂
- **Properties**: Slightly higher melting point than non-polar

**c) Hydrogen-bonded molecular solids**
- **Bonding**: Strong hydrogen bonds
- **Examples**: Ice (H₂O), sugar (C₁₂H₂₂O₁₁)
- **Properties**: Higher melting point than other molecular solids, but still relatively low

**General properties of molecular solids**:
- Soft, easily compressible
- Low melting and boiling points
- Poor electrical conductors (no free electrons or ions)
- Poor thermal conductors

### 2. Ionic Solids

**Constituent particles**: Cations and anions
**Bonding**: Strong electrostatic forces (ionic bonds)

**Examples**: NaCl, MgO, CaF₂, ZnS

**Structure**: Ions arranged to maximize attraction and minimize repulsion
- Example: In NaCl, each Na⁺ is surrounded by 6 Cl⁻ and vice versa

**Properties**:
- **Hard but brittle**: Strong ionic bonds make them hard, but brittle because slight displacement causes like-charged ions to repel
- **High melting and boiling points**: Strong ionic bonds require high energy to break
- **Poor conductors in solid state**: Ions fixed in lattice, cannot move
- **Good conductors in molten state or aqueous solution**: Ions become mobile
- **Soluble in polar solvents** (like water): Ion-dipole interactions

### 3. Metallic Solids

**Constituent particles**: Metal atoms (release valence electrons)
**Bonding**: Metallic bonding—sea of delocalized electrons

**Structure**: Metal cations in a "sea" of mobile electrons

**Examples**: Fe, Cu, Ag, Au, Al, Na

**Properties**:
- **Malleable and ductile**: Layers can slide over each other without breaking metallic bonds
- **High thermal and electrical conductivity**: Free electrons carry charge and heat
- **Metallic luster**: Free electrons absorb and re-emit light
- **Variable hardness and melting points**:
  - Soft: Na (98°C), K
  - Hard: W (3422°C), Fe
- **Insoluble in all solvents** (except by chemical reaction)

**Why are metals good conductors?**
The "sea of electrons" model explains this. Valence electrons are delocalized and free to move throughout the entire metal structure. When voltage is applied, electrons flow easily, conducting electricity. When heated, electrons transfer kinetic energy rapidly, conducting heat.

### 4. Covalent (Network) Solids

**Constituent particles**: Atoms
**Bonding**: Strong covalent bonds in a continuous network

**Examples**:
- **Diamond (C)**: Each C forms 4 covalent bonds (sp³ hybridization)
- **Graphite (C)**: Layers of C with sp² hybridization, weak forces between layers
- **Silicon carbide (SiC)**: Extremely hard, used as abrasive
- **Silica (SiO₂)**: Quartz, sand

**Properties**:
- **Extremely hard**: Network of strong covalent bonds (exception: graphite—layered structure)
- **Very high melting points**: Breaking covalent bonds requires tremendous energy
  - Diamond: 3550°C
  - SiC: 2730°C
- **Poor electrical conductors**: No free electrons (exception: graphite has delocalized π electrons)
- **Insoluble in all solvents**: Strong covalent network cannot be disrupted

**Diamond vs. Graphite**:

| Property | Diamond | Graphite |
|----------|---------|----------|
| Structure | 3D network, sp³ | Layered, sp² |
| Hardness | Hardest natural substance | Soft, slippery |
| Conductivity | Insulator (no free e⁻) | Conductor (delocalized π e⁻) |
| Use | Cutting tools, jewelry | Lubricant, electrodes, pencils |

## Summary Table: Classification Based on Bonding

| Type | Particles | Bonding | Melting Point | Conductivity | Hardness | Examples |
|------|-----------|---------|---------------|--------------|----------|----------|
| **Molecular** | Molecules | Weak intermolecular | Low | Poor | Soft | I₂, CO₂, ice |
| **Ionic** | Ions | Ionic bonds | High | Good (molten/aq) | Hard, brittle | NaCl, MgO |
| **Metallic** | Metal atoms | Metallic bonds | Variable | Good | Variable | Fe, Cu, Au |
| **Covalent Network** | Atoms | Covalent bonds | Very high | Poor (except graphite) | Very hard | Diamond, SiO₂ |

## Real-World Applications

**Diamond cutting tools**: Diamond's extreme hardness (network covalent) makes it ideal for cutting glass, drilling, and industrial abrasives.

**Salt preservation**: NaCl's high solubility in water (ionic solid) and its effect on osmotic pressure make it excellent for food preservation.

**Electrical wiring**: Copper's high electrical conductivity (metallic solid with mobile electrons) makes it the material of choice for electrical wires.

**Superconductors**: Certain materials (like YBa₂Cu₃O₇) become superconductors at low temperatures, with zero electrical resistance—critical for MRI machines and quantum computers.

## Key Takeaways

1. **Crystalline vs. Amorphous**: Crystalline has long-range order and sharp melting point; amorphous has short-range order and softens gradually
2. **Four types based on bonding**:
   - **Molecular**: Weak forces, low mp, soft, poor conductors
   - **Ionic**: Strong ionic bonds, high mp, hard/brittle, conduct when molten
   - **Metallic**: Metallic bonding, variable mp, malleable, good conductors
   - **Covalent network**: Strong covalent bonds, very high mp, very hard, poor conductors
3. **Structure determines properties**: Understanding bonding explains physical behavior
`,
        objectives: [
          'Distinguish between crystalline and amorphous solids',
          'Classify crystalline solids based on bonding (molecular, ionic, metallic, covalent)',
          'Relate bonding type to physical properties (melting point, conductivity, hardness)',
          'Explain why diamond is hard while graphite is soft despite both being carbon',
          'Understand real-world applications of different solid types',
        ],
        keyTerms: [
          { term: 'Crystalline Solid', definition: 'Solid with particles in definite, repeating 3D pattern; sharp melting point, anisotropic' },
          { term: 'Amorphous Solid', definition: 'Solid with random particle arrangement; no sharp melting point, isotropic (e.g., glass)' },
          { term: 'Molecular Solid', definition: 'Held by weak van der Waals forces; low mp, soft (e.g., I₂, ice)' },
          { term: 'Ionic Solid', definition: 'Cations and anions in lattice; high mp, hard/brittle, conduct when molten (e.g., NaCl)' },
          { term: 'Metallic Solid', definition: 'Metal cations in sea of electrons; malleable, good conductor (e.g., Cu, Fe)' },
          { term: 'Covalent Network Solid', definition: 'Continuous network of covalent bonds; very high mp, very hard (e.g., diamond, SiO₂)' },
        ],
      },
    },
    {
      id: 'solid-lesson-2',
      title: 'Crystal Lattices, Unit Cells, and Crystal Systems',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'solid-lesson-2',
        title: 'Crystal Lattices, Unit Cells, and Crystal Systems',
        sequenceOrder: 2,
        estimatedMinutes: 50,
        content: `
# Crystal Lattices, Unit Cells, and Crystal Systems

## Crystal Lattice

**Crystal lattice**: A regular, repeating 3D arrangement of points in space representing the positions of constituent particles (atoms, ions, or molecules) in a crystalline solid

**Lattice point**: Each point in the crystal lattice where a particle is located

**Key idea**: The entire crystal structure is generated by repeating a basic unit in all three dimensions

## Unit Cell

**Unit cell**: The smallest repeating unit of a crystal lattice that, when repeated in three dimensions, generates the entire crystal

**Think of it like**: Building blocks or tiles—stack them in 3D and you get the whole crystal!

### Parameters of a Unit Cell

A unit cell is characterized by:

**1. Edge lengths**: $a$, $b$, $c$ (dimensions along three axes)

**2. Angles**:
- $\\alpha$ = angle between edges $b$ and $c$
- $\\beta$ = angle between edges $a$ and $c$
- $\\gamma$ = angle between edges $a$ and $b$

These six parameters ($a$, $b$, $c$, $\\alpha$, $\\beta$, $\\gamma$) completely define the unit cell geometry.

## Types of Unit Cells

Based on the position of lattice points, unit cells are classified as:

### 1. Primitive (Simple) Unit Cell (P)

**Lattice points**: Only at the 8 corners of the unit cell

**Atoms per unit cell**:
- Each corner atom is shared by 8 unit cells
- Contribution per corner = $\\frac{1}{8}$
- Total atoms = $8 \\times \\frac{1}{8} = 1$ atom per unit cell

**Examples**: Simple cubic (SC), simple tetragonal

### 2. Body-Centered Unit Cell (I)

**Lattice points**: 8 corners + 1 at the body center

**Atoms per unit cell**:
- Corner atoms: $8 \\times \\frac{1}{8} = 1$
- Body center atom: $1 \\times 1 = 1$ (not shared)
- **Total = 2 atoms per unit cell**

**Examples**: Body-centered cubic (BCC) - Fe, Cr, Na

### 3. Face-Centered Unit Cell (F)

**Lattice points**: 8 corners + 6 face centers (one on each face)

**Atoms per unit cell**:
- Corner atoms: $8 \\times \\frac{1}{8} = 1$
- Face-centered atoms: $6 \\times \\frac{1}{2} = 3$ (each face atom shared by 2 unit cells)
- **Total = 4 atoms per unit cell**

**Examples**: Face-centered cubic (FCC) - Cu, Ag, Au, Al

### 4. End-Centered (Base-Centered) Unit Cell (C)

**Lattice points**: 8 corners + 2 opposite face centers

**Atoms per unit cell**:
- Corner atoms: $8 \\times \\frac{1}{8} = 1$
- Two face-centered atoms: $2 \\times \\frac{1}{2} = 1$
- **Total = 2 atoms per unit cell**

## The Seven Crystal Systems

Crystals are classified into **7 crystal systems** based on the edge lengths and angles of the unit cell:

| Crystal System | Axial Lengths | Axial Angles | Examples |
|---------------|---------------|--------------|----------|
| **1. Cubic** | $a = b = c$ | $\\alpha = \\beta = \\gamma = 90°$ | NaCl, diamond, Cu |
| **2. Tetragonal** | $a = b \\neq c$ | $\\alpha = \\beta = \\gamma = 90°$ | TiO₂, SnO₂ |
| **3. Orthorhombic** | $a \\neq b \\neq c$ | $\\alpha = \\beta = \\gamma = 90°$ | Sulfur, BaSO₄ |
| **4. Monoclinic** | $a \\neq b \\neq c$ | $\\alpha = \\gamma = 90° \\neq \\beta$ | Gypsum, Na₂SO₄·10H₂O |
| **5. Triclinic** | $a \\neq b \\neq c$ | $\\alpha \\neq \\beta \\neq \\gamma \\neq 90°$ | K₂Cr₂O₇, CuSO₄·5H₂O |
| **6. Rhombohedral (Trigonal)** | $a = b = c$ | $\\alpha = \\beta = \\gamma \\neq 90°$ | Calcite (CaCO₃), quartz |
| **7. Hexagonal** | $a = b \\neq c$ | $\\alpha = \\beta = 90°$, $\\gamma = 120°$ | Graphite, ZnO, Mg |

**Most important for JEE**: Cubic system!

## The 14 Bravais Lattices

When you combine the 7 crystal systems with the 4 types of unit cells (P, I, F, C), you get **14 unique ways** to arrange points in 3D space—these are the **Bravais lattices**.

**Examples**:
- **Cubic system**: Simple cubic (SC), Body-centered cubic (BCC), Face-centered cubic (FCC)
- **Tetragonal system**: Simple tetragonal, Body-centered tetragonal
- And so on...

## Cubic Crystal System (Most Important!)

The cubic system is the simplest and most commonly tested. All cubic unit cells have:
- $a = b = c$
- $\\alpha = \\beta = \\gamma = 90°$

### 1. Simple Cubic (SC)

**Structure**: Atoms only at corners

**Atoms per unit cell**: $Z = 1$

**Coordination number**: 6 (each atom touches 6 neighbors)

**Relation between $a$ and $r$**:
- Edge length $a = 2r$ (atoms touch along edge)

**Packing efficiency**: 52.4% (we'll derive this in next lesson)

**Examples**: Polonium (Po) - only metal with SC structure

**Rare structure**: Most metals prefer more efficient packing

### 2. Body-Centered Cubic (BCC)

**Structure**: Atoms at corners + 1 at body center

**Atoms per unit cell**: $Z = 2$

**Coordination number**: 8 (body center atom touches all 8 corner atoms)

**Relation between $a$ and $r$**:
- Body diagonal = $\\sqrt{3}a$ (from geometry)
- Body diagonal = $4r$ (atoms touch along body diagonal)
- Therefore: $\\sqrt{3}a = 4r$
$$a = \\frac{4r}{\\sqrt{3}} = \\frac{4r\\sqrt{3}}{3}$$

**Packing efficiency**: 68% (better than SC)

**Examples**: Fe, Cr, W, Na, K, Li

### 3. Face-Centered Cubic (FCC)

**Structure**: Atoms at corners + 1 at center of each face

**Atoms per unit cell**: $Z = 4$

**Coordination number**: 12 (highest for cubic systems)

**Relation between $a$ and $r$**:
- Face diagonal = $\\sqrt{2}a$
- Face diagonal = $4r$ (atoms touch along face diagonal)
- Therefore: $\\sqrt{2}a = 4r$
$$a = \\frac{4r}{\\sqrt{2}} = 2\\sqrt{2}r$$

**Packing efficiency**: 74% (most efficient cubic packing)

**Examples**: Cu, Ag, Au, Al, Ni, Pt

**Also called**: Cubic close-packed (ccp) structure

## Coordination Number

**Coordination number (CN)**: Number of nearest neighbor atoms touching a given atom

| Structure | Coordination Number | Examples |
|-----------|---------------------|----------|
| Simple Cubic (SC) | 6 | Po |
| Body-Centered Cubic (BCC) | 8 | Fe, Na, W |
| Face-Centered Cubic (FCC) | 12 | Cu, Ag, Au |
| Hexagonal Close-Packed (HCP) | 12 | Mg, Zn, Co |

**Higher CN** → More neighbors → More bonds → Generally more stable

## Calculating Number of Atoms in Unit Cell

**Formula**: Count contribution from each position

$$Z = N_{\\text{corner}} \\times \\frac{1}{8} + N_{\\text{face}} \\times \\frac{1}{2} + N_{\\text{edge}} \\times \\frac{1}{4} + N_{\\text{body}}$$

**Why these fractions?**
- **Corner atom**: Shared by 8 unit cells → contributes $\\frac{1}{8}$
- **Face atom**: Shared by 2 unit cells → contributes $\\frac{1}{2}$
- **Edge atom**: Shared by 4 unit cells → contributes $\\frac{1}{4}$
- **Body atom**: Not shared → contributes $1$

## Worked Example 1: Copper Crystal

**Problem**: Copper crystallizes in FCC structure. If edge length $a = 3.61$ Å and atomic mass = 63.5 g/mol, calculate the density of copper.

**Solution**:

**Step 1**: Find number of atoms per unit cell
- FCC: $Z = 4$

**Step 2**: Calculate mass of unit cell
- Mass of one atom = $\\frac{\\text{Molar mass}}{N_A} = \\frac{63.5}{6.022 \\times 10^{23}}$ g
- Mass of unit cell = $Z \\times$ mass of one atom
$$m = 4 \\times \\frac{63.5}{6.022 \\times 10^{23}} = 4.22 \\times 10^{-22}$$ g

**Step 3**: Calculate volume of unit cell
$$V = a^3 = (3.61 \\times 10^{-8})^3 = 4.70 \\times 10^{-23} \\text{ cm}^3$$

**Step 4**: Calculate density
$$\\rho = \\frac{m}{V} = \\frac{4.22 \\times 10^{-22}}{4.70 \\times 10^{-23}} = 8.98 \\text{ g/cm}^3$$

**Experimental density of Cu** ≈ 8.96 g/cm³ ✓

## Worked Example 2: Finding Edge Length

**Problem**: Silver crystallizes in FCC with density 10.5 g/cm³. Atomic mass of Ag = 108. Find edge length.

**Solution**:

**Density formula**:
$$\\rho = \\frac{Z \\times M}{a^3 \\times N_A}$$

Rearranging for $a$:
$$a^3 = \\frac{Z \\times M}{\\rho \\times N_A}$$

$$a^3 = \\frac{4 \\times 108}{10.5 \\times 6.022 \\times 10^{23}}$$

$$a^3 = 6.84 \\times 10^{-23} \\text{ cm}^3$$

$$a = 4.09 \\times 10^{-8} \\text{ cm} = 4.09 \\text{ Å}$$

## Key Formulas

**Density of unit cell**:
$$\\rho = \\frac{Z \\times M}{a^3 \\times N_A}$$

Where:
- $Z$ = number of atoms per unit cell
- $M$ = molar mass (g/mol)
- $a$ = edge length (cm)
- $N_A$ = Avogadro's number

**Edge length in terms of atomic radius**:
- **SC**: $a = 2r$
- **BCC**: $a = \\frac{4r}{\\sqrt{3}}$
- **FCC**: $a = 2\\sqrt{2}r$

## Key Takeaways

1. **Unit cell**: Smallest repeating unit; defined by 6 parameters ($a, b, c, \\alpha, \\beta, \\gamma$)
2. **7 crystal systems**: Cubic (most important), tetragonal, orthorhombic, monoclinic, triclinic, rhombohedral, hexagonal
3. **Cubic structures**:
   - **SC**: $Z=1$, CN=6, $a=2r$, 52.4% packing
   - **BCC**: $Z=2$, CN=8, $a=\\frac{4r}{\\sqrt{3}}$, 68% packing
   - **FCC**: $Z=4$, CN=12, $a=2\\sqrt{2}r$, 74% packing
4. **Higher packing efficiency** → More dense, more stable
5. **Density calculations**: Use $\\rho = \\frac{Z \\times M}{a^3 \\times N_A}$
`,
        objectives: [
          'Define crystal lattice and unit cell',
          'Identify types of unit cells (P, I, F, C) and calculate atoms per unit cell',
          'Classify the 7 crystal systems based on parameters',
          'Understand cubic structures (SC, BCC, FCC) and their properties',
          'Calculate coordination number for different structures',
          'Apply density formula to solve problems involving unit cells',
        ],
        keyTerms: [
          { term: 'Crystal Lattice', definition: 'Regular 3D arrangement of points representing particle positions in a crystal' },
          { term: 'Unit Cell', definition: 'Smallest repeating unit that generates the entire crystal when repeated in 3D' },
          { term: 'Coordination Number', definition: 'Number of nearest neighbor atoms touching a given atom (SC=6, BCC=8, FCC=12)' },
          { term: 'Simple Cubic (SC)', definition: 'Atoms at corners only; Z=1, CN=6, a=2r, 52.4% packing' },
          { term: 'Body-Centered Cubic (BCC)', definition: 'Atoms at corners + body center; Z=2, CN=8, a=4r/√3, 68% packing (e.g., Fe)' },
          { term: 'Face-Centered Cubic (FCC)', definition: 'Atoms at corners + face centers; Z=4, CN=12, a=2√2r, 74% packing (e.g., Cu, Au)' },
        ],
      },
    },
    {
      id: 'solid-lesson-3',
      title: 'Packing Efficiency, Close Packing, and Crystal Defects',
      type: 'lesson',
      sequenceOrder: 3,
      data: {
        id: 'solid-lesson-3',
        title: 'Packing Efficiency, Close Packing, and Crystal Defects',
        sequenceOrder: 3,
        estimatedMinutes: 50,
        content: `
# Packing Efficiency, Close Packing, and Crystal Defects

## Packing Efficiency

**Packing efficiency (PE)**: Percentage of total space in a crystal occupied by atoms

$$\\text{Packing Efficiency} = \\frac{\\text{Volume occupied by atoms}}{\\text{Total volume of unit cell}} \\times 100\\%$$

**Higher PE** → More atoms packed in same space → Generally higher density

## Packing Efficiency Calculations

### 1. Simple Cubic (SC)

**Given**:
- $Z = 1$ atom per unit cell
- $a = 2r$ (atoms touch along edge)

**Volume of atoms**:
$$V_{\\text{atoms}} = Z \\times \\frac{4}{3}\\pi r^3 = 1 \\times \\frac{4}{3}\\pi r^3$$

**Volume of unit cell**:
$$V_{\\text{cell}} = a^3 = (2r)^3 = 8r^3$$

**Packing efficiency**:
$$\\text{PE} = \\frac{\\frac{4}{3}\\pi r^3}{8r^3} \\times 100\\% = \\frac{\\pi}{6} \\times 100\\% = 52.4\\%$$

**Only 52.4% filled!** Nearly half the space is empty—that's why SC is rare.

### 2. Body-Centered Cubic (BCC)

**Given**:
- $Z = 2$ atoms per unit cell
- $a = \\frac{4r}{\\sqrt{3}}$ (atoms touch along body diagonal)

**Volume of atoms**:
$$V_{\\text{atoms}} = 2 \\times \\frac{4}{3}\\pi r^3 = \\frac{8}{3}\\pi r^3$$

**Volume of unit cell**:
$$V_{\\text{cell}} = a^3 = \\left(\\frac{4r}{\\sqrt{3}}\\right)^3 = \\frac{64r^3}{3\\sqrt{3}}$$

**Packing efficiency**:
$$\\text{PE} = \\frac{\\frac{8}{3}\\pi r^3}{\\frac{64r^3}{3\\sqrt{3}}} \\times 100\\% = \\frac{8\\pi \\sqrt{3}}{64} \\times 100\\% = \\frac{\\sqrt{3}\\pi}{8} \\times 100\\% = 68\\%$$

**Better than SC!** This is why many metals adopt BCC structure.

### 3. Face-Centered Cubic (FCC)

**Given**:
- $Z = 4$ atoms per unit cell
- $a = 2\\sqrt{2}r$ (atoms touch along face diagonal)

**Volume of atoms**:
$$V_{\\text{atoms}} = 4 \\times \\frac{4}{3}\\pi r^3 = \\frac{16}{3}\\pi r^3$$

**Volume of unit cell**:
$$V_{\\text{cell}} = a^3 = (2\\sqrt{2}r)^3 = 16\\sqrt{2}r^3$$

**Packing efficiency**:
$$\\text{PE} = \\frac{\\frac{16}{3}\\pi r^3}{16\\sqrt{2}r^3} \\times 100\\% = \\frac{\\pi}{3\\sqrt{2}} \\times 100\\% = \\frac{\\pi\\sqrt{2}}{6} \\times 100\\% = 74\\%$$

**Most efficient cubic packing!** Noble metals (Au, Ag, Cu) use FCC.

### Summary: Packing Efficiencies

| Structure | Packing Efficiency | Comment |
|-----------|-------------------|---------|
| Simple Cubic (SC) | 52.4% | Inefficient, rare (only Po) |
| Body-Centered Cubic (BCC) | 68% | Common in metals (Fe, Cr, Na) |
| Face-Centered Cubic (FCC) | 74% | Most efficient cubic (Cu, Ag, Au) |
| Hexagonal Close-Packed (HCP) | 74% | Also highly efficient (Mg, Zn) |

**Note**: Both FCC and HCP have 74% PE—these are the **close-packed structures**.

## Close Packing of Spheres

To achieve maximum packing efficiency (74%), spheres must be arranged in close-packed layers.

### Layer Formation

**First layer (A)**: Spheres arranged in 2D close-packed array

Each sphere touches 6 others (hexagonal arrangement)

**Second layer (B)**: Spheres fit into **depressions (voids)** of first layer

Not all depressions can be filled—only half are occupied

**Third layer**: Two possibilities!

### 1. Hexagonal Close-Packed (HCP): ABAB...

**Third layer over A**: Third layer exactly over first layer

**Stacking sequence**: ABABAB...

**Coordination number**: 12

**Packing efficiency**: 74%

**Examples**: Mg, Zn, Ti, Co, Cd

**Unit cell**: Hexagonal

### 2. Cubic Close-Packed (CCP) = FCC: ABCABC...

**Third layer over new position (C)**: Third layer over a new set of depressions

**Fourth layer over A**: Pattern repeats

**Stacking sequence**: ABCABCABC...

**Coordination number**: 12

**Packing efficiency**: 74%

**Examples**: Cu, Ag, Au, Al, Ni

**Unit cell**: Face-centered cubic (FCC)

**Key insight**: HCP and FCC are both close-packed (74% PE) but differ in stacking sequence.

## Voids in Close Packing

Even in close-packed structures, there are empty spaces called **voids** or **interstitial sites**.

### 1. Tetrahedral Void

**Shape**: Surrounded by 4 spheres arranged tetrahedrally

**Number per sphere**: **2 tetrahedral voids** per sphere

- If $N$ spheres, then $2N$ tetrahedral voids

**Size**: Radius ratio $\\frac{r_{\\text{void}}}{r_{\\text{sphere}}} = 0.225$

Small void—can accommodate small ions like Be²⁺, Li⁺

**Example**: ZnS (zinc blende) - S²⁻ in FCC, Zn²⁺ in half of tetrahedral voids

### 2. Octahedral Void

**Shape**: Surrounded by 6 spheres arranged octahedrally

**Number per sphere**: **1 octahedral void** per sphere

- If $N$ spheres, then $N$ octahedral voids

**Size**: Radius ratio $\\frac{r_{\\text{void}}}{r_{\\text{sphere}}} = 0.414$

Larger than tetrahedral void—can accommodate larger ions like Mg²⁺, Fe²⁺

**Example**: NaCl - Cl⁻ in FCC, Na⁺ in all octahedral voids

### Comparison: Tetrahedral vs Octahedral Voids

| Property | Tetrahedral Void | Octahedral Void |
|----------|-----------------|-----------------|
| **Surrounded by** | 4 spheres | 6 spheres |
| **Number** | 2N | N |
| **Radius ratio** | 0.225 | 0.414 |
| **Size** | Smaller | Larger |
| **Example** | Zn²⁺ in ZnS | Na⁺ in NaCl |

## Common Ionic Crystal Structures

### 1. Rock Salt (NaCl) Structure

- **Anions (Cl⁻)**: FCC arrangement
- **Cations (Na⁺)**: All octahedral voids
- **Coordination**: 6:6 (each Na⁺ surrounded by 6 Cl⁻ and vice versa)
- **Examples**: NaCl, KCl, MgO, CaO

### 2. Zinc Blende (ZnS) Structure

- **Anions (S²⁻)**: FCC arrangement
- **Cations (Zn²⁺)**: Half of tetrahedral voids (alternate voids)
- **Coordination**: 4:4 (tetrahedral)
- **Examples**: ZnS, CuCl, CuBr

### 3. Fluorite (CaF₂) Structure

- **Cations (Ca²⁺)**: FCC arrangement
- **Anions (F⁻)**: All tetrahedral voids
- **Coordination**: 8:4 (each Ca²⁺ surrounded by 8 F⁻; each F⁻ by 4 Ca²⁺)
- **Examples**: CaF₂, SrF₂, BaCl₂

### 4. Antifluorite (Na₂O) Structure

- **Anions (O²⁻)**: FCC arrangement
- **Cations (Na⁺)**: All tetrahedral voids
- **Coordination**: 4:8 (reverse of fluorite)
- **Examples**: Na₂O, K₂O, K₂S

## Crystal Defects

Real crystals are **not perfect**—they contain defects that affect properties.

**Types of defects**:
1. **Point defects** (0D): Defects at single lattice points
2. **Line defects** (1D): Dislocations
3. **Surface defects** (2D): Grain boundaries

We'll focus on **point defects** (most important for JEE).

## Point Defects

### 1. Stoichiometric Defects

Defects that **maintain stoichiometry** (ratio of ions unchanged)

#### a) Schottky Defect

**Definition**: Equal number of cations and anions missing from lattice

**Characteristics**:
- Maintains electrical neutrality
- Creates vacancies
- **Density decreases** (missing ions)
- Common in ionic solids with **similar-sized ions** (high coordination number)

**Conditions favoring Schottky**:
- High coordination number (6:6, 8:8)
- Similar cation and anion sizes ($\\frac{r_+}{r_-} \\approx 0.7-1.0$)

**Examples**: NaCl, KCl, KBr, CsCl

**Effect**: Lowers density, no change in dielectric properties

#### b) Frenkel Defect

**Definition**: Cation displaced from lattice site to interstitial site

**Characteristics**:
- Smaller ion (usually cation) moves to void
- No ions missing—just displaced
- **Density unchanged**
- Common when **cation much smaller** than anion (low coordination number)

**Conditions favoring Frenkel**:
- Large size difference between cation and anion
- Low coordination number (4:4)
- Small cations can fit into voids

**Examples**: AgCl, AgBr, AgI, ZnS

**Effect**: Creates ionic conductivity, density unchanged

**Schottky vs Frenkel**:

| Property | Schottky Defect | Frenkel Defect |
|----------|----------------|----------------|
| **What happens** | Ions missing | Ions displaced to voids |
| **Density** | Decreases | Unchanged |
| **Coordination** | High (6:6, 8:8) | Low (4:4) |
| **Ion sizes** | Similar | Large difference |
| **Examples** | NaCl, KCl | AgCl, ZnS |

### 2. Non-Stoichiometric Defects

Defects that **disturb stoichiometry** (ratio changes)

#### a) Metal Excess Defect

**Type 1: Anion vacancies**

- **Mechanism**: Anion missing, electron trapped in vacancy (**F-center** or color center)
- **Example**: NaCl heated in Na vapor
  - Cl⁻ vacancies created
  - Electrons occupy vacancies → yellow color
- **Effect**: Crystal becomes colored, increased conductivity

**Type 2: Extra cations in voids**

- **Mechanism**: Extra metal cations occupy interstitial sites, electrons elsewhere
- **Example**: ZnO heated → loses O₂, excess Zn²⁺ in voids
  - White ZnO becomes yellow when heated
- **Effect**: Increased electrical conductivity

#### b) Metal Deficiency Defect

- **Mechanism**: Cation missing, nearby cation has higher charge to maintain neutrality
- **Example**: FeO (actually Fe₀.₉₅O)
  - Some Fe²⁺ missing
  - Compensated by Fe³⁺ (2 Fe³⁺ replace 3 Fe²⁺)
- **Effect**: p-type semiconductor behavior

**Common in**: Transition metal oxides (FeO, FeS, NiO)

### 3. Impurity Defects

- **Definition**: Foreign atoms occupy lattice sites
- **Example**: Doping Si with P (n-type) or B (p-type)
- **Effect**: Dramatically changes electrical properties (semiconductors!)

## Real-World Applications of Defects

**F-centers (color centers)**: Ruby is Al₂O₃ with Cr³⁺ impurities → red color

**Semiconductors**: Doping Si with trace impurities creates electronics revolution

**Photography**: AgBr crystals with Frenkel defects are light-sensitive (used in film)

**Luminescence**: Defects in phosphors create glow-in-the-dark materials and LED lights

## Key Takeaways

1. **Packing efficiency**: SC (52.4%), BCC (68%), FCC/HCP (74%)
2. **Close packing**: HCP (ABAB) and FCC (ABCABC) both have 74% PE
3. **Voids**: Tetrahedral (2N, smaller, r ratio 0.225) and Octahedral (N, larger, r ratio 0.414)
4. **Stoichiometric defects**:
   - **Schottky**: Missing ions, density ↓, similar ion sizes (NaCl)
   - **Frenkel**: Displaced ions, density unchanged, size difference (AgCl)
5. **Non-stoichiometric defects**:
   - **Metal excess**: F-centers, colored crystals, conductivity ↑
   - **Metal deficiency**: Missing cations, higher oxidation states (FeO)
6. **Defects matter**: They control color, conductivity, and material properties!
`,
        objectives: [
          'Calculate packing efficiency for SC, BCC, and FCC structures',
          'Understand close packing arrangements (HCP and FCC/CCP)',
          'Identify and compare tetrahedral and octahedral voids',
          'Distinguish between Schottky and Frenkel defects',
          'Explain non-stoichiometric defects (metal excess and deficiency)',
          'Relate crystal defects to material properties (color, conductivity)',
        ],
        keyTerms: [
          { term: 'Packing Efficiency', definition: 'Percentage of space occupied by atoms; SC=52.4%, BCC=68%, FCC=74%' },
          { term: 'Close Packing', definition: 'Maximum packing (74%); HCP (ABAB) or FCC/CCP (ABCABC) arrangement' },
          { term: 'Tetrahedral Void', definition: 'Surrounded by 4 spheres; 2N voids, radius ratio 0.225' },
          { term: 'Octahedral Void', definition: 'Surrounded by 6 spheres; N voids, radius ratio 0.414' },
          { term: 'Schottky Defect', definition: 'Equal cations and anions missing; density↓; similar ion sizes (NaCl)' },
          { term: 'Frenkel Defect', definition: 'Cation displaced to void; density unchanged; size difference (AgCl)' },
          { term: 'F-center', definition: 'Electron trapped in anion vacancy; causes color (metal excess defect)' },
        ],
      },
    },
    {
      id: 'solid-quiz-1',
      title: 'Solid State Comprehensive Quiz',
      type: 'quiz',
      sequenceOrder: 4,
      data: {
        id: 'solid-quiz-1',
        title: 'Solid State Comprehensive Quiz',
        description: 'Test your understanding of solid state chemistry including classification, unit cells, packing, and defects.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'solid-q1',
            type: 'mcq',
            question: 'Which of the following statements about crystalline and amorphous solids is CORRECT?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Crystalline solids are isotropic while amorphous solids are anisotropic',
              'Crystalline solids have sharp melting points while amorphous solids soften over a range',
              'Glass is a crystalline solid because it is transparent',
              'Amorphous solids have long-range order in their structure'
            ],
            correctAnswer: 1,
            explanation: 'CRYSTALLINE SOLIDS HAVE SHARP MELTING POINTS WHILE AMORPHOUS SOLIDS SOFTEN OVER A RANGE. This is the fundamental difference between these two types of solids. Crystalline solids have particles arranged in a definite, repeating three-dimensional pattern (long-range order), which means all bonds throughout the crystal are similar and break at the same specific temperature, giving a sharp melting point. Examples include NaCl (melts at exactly 801°C), diamond, and ice. In contrast, amorphous solids have particles arranged randomly with only short-range order, behaving like supercooled liquids. Since bonds have varying strengths in different regions, they break gradually over a temperature range rather than all at once. For example, glass softens gradually when heated rather than melting sharply. Option A is WRONG because it is reversed—crystalline solids are ANISOTROPIC (properties vary with direction due to ordered structure) while amorphous solids are ISOTROPIC (properties same in all directions due to random structure). Option C is WRONG because glass is actually an amorphous solid despite being transparent; transparency has nothing to do with crystalline vs. amorphous nature. Option D is WRONG because amorphous solids have only SHORT-range order, not long-range order. Understanding this distinction is crucial for predicting material behavior and properties.',
          },
          {
            id: 'solid-q2',
            type: 'mcq',
            question: 'Diamond is extremely hard while graphite is soft and slippery. This is because:',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Diamond has ionic bonding while graphite has covalent bonding',
              'Diamond has a 3D network of strong covalent bonds (sp³) while graphite has layers held by weak van der Waals forces (sp²)',
              'Diamond has metallic bonding while graphite has molecular bonding',
              'Diamond has higher molecular mass than graphite'
            ],
            correctAnswer: 1,
            explanation: 'Diamond is hard while graphite is soft because DIAMOND HAS A 3D NETWORK OF STRONG COVALENT BONDS (sp³) WHILE GRAPHITE HAS LAYERS HELD BY WEAK VAN DER WAALS FORCES (sp²). Both diamond and graphite are allotropes of carbon (same element, different structures), but their properties differ dramatically due to bonding and structure. In DIAMOND, each carbon atom is sp³ hybridized and forms 4 strong covalent bonds with neighboring carbon atoms in a tetrahedral arrangement, creating a rigid 3D network extending throughout the crystal. Breaking this structure requires breaking many strong C-C covalent bonds (bond energy ~348 kJ/mol), making diamond the hardest natural substance. Diamond is used in cutting tools, drill bits, and industrial abrasives. In GRAPHITE, each carbon is sp² hybridized, forming 3 sigma bonds in a planar hexagonal arrangement within layers. The fourth electron is in a delocalized π system. WITHIN each layer, bonding is strong (covalent), but BETWEEN layers, only weak van der Waals forces exist. These weak interlayer forces allow layers to slide easily over each other, making graphite soft, slippery, and an excellent lubricant. This layered structure also explains why graphite conducts electricity (delocalized π electrons) while diamond does not (all electrons localized in σ bonds). Options A and C are completely wrong—both are covalent network solids. Option D is irrelevant—both have the same atomic mass (both are carbon). This example beautifully illustrates how structure determines properties.',
          },
          {
            id: 'solid-q3',
            type: 'mcq',
            question: 'The number of atoms per unit cell in Body-Centered Cubic (BCC) structure is:',
            difficulty: 'easy',
            topic: 'physical',
            options: ['1', '2', '4', '6'],
            correctAnswer: 1,
            explanation: 'The number of atoms per unit cell in BCC (Body-Centered Cubic) structure is 2. To calculate this, we must count the contribution of atoms at different positions. In BCC structure, atoms are located at: (1) 8 corners of the cube, and (2) 1 atom at the body center. Each CORNER ATOM is shared by 8 adjacent unit cells (imagine 8 cubes meeting at a corner), so each corner atom contributes only 1/8 to any single unit cell. Total contribution from corners = 8 corners × 1/8 = 1 atom. The BODY CENTER ATOM is located entirely within the unit cell and not shared with any neighboring cell, so it contributes fully = 1 atom. Therefore, total atoms per unit cell in BCC = 1 (from corners) + 1 (from body center) = 2 atoms. This Z value (number of atoms per unit cell) is crucial for calculating density using the formula: ρ = (Z × M)/(a³ × Nₐ), where M is molar mass, a is edge length, and Nₐ is Avogadro\'s number. For comparison: Simple Cubic (SC) has Z = 1 (only corner atoms: 8 × 1/8 = 1), and Face-Centered Cubic (FCC) has Z = 4 (corners contribute 1 + six faces contribute 6 × 1/2 = 3, total = 4). Examples of BCC metals include Fe (iron), Cr (chromium), W (tungsten), Na (sodium), and K (potassium). The BCC structure has a coordination number of 8 and packing efficiency of 68%, making it more efficient than SC (52.4%) but less than FCC (74%).',
          },
          {
            id: 'solid-q4',
            type: 'mcq',
            question: 'Copper crystallizes in FCC structure with edge length a = 3.6 Å. If the atomic radius is r, which relationship is correct?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'a = 2r',
              'a√3 = 4r',
              'a√2 = 4r',
              'a = 4r'
            ],
            correctAnswer: 2,
            explanation: 'For FCC (Face-Centered Cubic) structure, the correct relationship is a√2 = 4r, which can be rearranged to a = 4r/√2 = 2√2r. To understand this, we need to identify WHERE atoms touch in FCC structure. In FCC, atoms are located at: (1) all 8 corners, and (2) centers of all 6 faces. Atoms in FCC do NOT touch along the cube edge, and they do NOT touch along the body diagonal. Instead, ATOMS TOUCH ALONG THE FACE DIAGONAL. Consider one face of the cube: it has atoms at all 4 corners (each contributing 1/4 to this face) and 1 atom at the face center (fully within this face). The face diagonal connects opposite corners, passing through the face-centered atom. Therefore, the face diagonal contains: 1 corner atom radius + 1 full face-centered atom diameter + 1 corner atom radius = r + 2r + r = 4r. From geometry, the face diagonal of a square with edge length a is a√2 (using Pythagorean theorem: diagonal² = a² + a² = 2a², so diagonal = a√2). Therefore: a√2 = 4r, giving a = 2√2r ≈ 2.828r. Option A (a = 2r) is WRONG—that\'s for Simple Cubic where atoms touch along edges. Option B (a√3 = 4r) is WRONG—that\'s for BCC where atoms touch along body diagonal (body diagonal = a√3). Option D is incorrect. This relationship is essential for calculating atomic radius from X-ray crystallography data or for calculating density. For copper with a = 3.6 Å: r = a/(2√2) = 3.6/(2×1.414) = 1.27 Å. Understanding where atoms touch in different structures is critical for JEE problems.',
          },
          {
            id: 'solid-q5',
            type: 'mcq',
            question: 'The packing efficiency of Face-Centered Cubic (FCC) structure is:',
            difficulty: 'medium',
            topic: 'physical',
            options: ['52.4%', '68%', '74%', '90%'],
            correctAnswer: 2,
            explanation: 'The packing efficiency of FCC (Face-Centered Cubic) structure is 74%, making it the most efficient cubic packing arrangement. Packing efficiency is defined as the percentage of space actually occupied by atoms in a unit cell. Let\'s derive this for FCC: (1) NUMBER OF ATOMS per FCC unit cell: Z = 4 (8 corners × 1/8 + 6 faces × 1/2 = 1 + 3 = 4). (2) VOLUME OCCUPIED BY ATOMS: Each atom is a sphere with volume (4/3)πr³. Total volume of atoms = Z × (4/3)πr³ = 4 × (4/3)πr³ = (16/3)πr³. (3) VOLUME OF UNIT CELL: Edge length a = 2√2r (as atoms touch along face diagonal). Volume of cube = a³ = (2√2r)³ = 8 × 2√2 × r³ = 16√2r³. (4) PACKING EFFICIENCY = (Volume of atoms / Volume of unit cell) × 100% = [(16/3)πr³ / 16√2r³] × 100% = [π / (3√2)] × 100% = [π√2 / 6] × 100% = 74.05% ≈ 74%. This means 74% of FCC crystal is filled with atoms, and only 26% is empty space (voids). FCC is also called Cubic Close-Packed (CCP) structure, and along with Hexagonal Close-Packed (HCP), represents the maximum possible packing efficiency in three dimensions. For comparison: SC has only 52.4% efficiency (very inefficient, only Polonium adopts this), BCC has 68% efficiency (common in Fe, Cr, Na), and FCC/HCP have 74% (maximum, found in Cu, Ag, Au, Al, Mg, Zn). Noble metals prefer FCC because higher packing efficiency generally correlates with greater stability, higher density, and stronger metallic bonding. This concept is crucial for understanding why certain crystal structures are favored and for calculating densities of crystalline materials.',
          },
          {
            id: 'solid-q6',
            type: 'mcq',
            question: 'In a close-packed structure, if there are N atoms, the number of octahedral voids and tetrahedral voids are respectively:',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'N and N',
              '2N and N',
              'N and 2N',
              'N/2 and N'
            ],
            correctAnswer: 2,
            explanation: 'In a close-packed structure with N atoms, there are N OCTAHEDRAL VOIDS and 2N TETRAHEDRAL VOIDS. This is a fundamental relationship in solid state chemistry that applies to both FCC (Cubic Close-Packed, CCP) and HCP (Hexagonal Close-Packed) structures. Let\'s understand why: OCTAHEDRAL VOIDS are formed when 6 spheres surround a central empty space octahedrally (3 spheres from one layer forming a triangle, 3 from adjacent layer forming inverted triangle). In close-packed structures, the number of octahedral voids equals the number of atoms: if N atoms, then N octahedral voids. For example, in FCC with 4 atoms per unit cell, there are 4 octahedral voids (1 at body center + 12 at edge centers, each edge center shared by 4 cells: 1 + 12×1/4 = 4). TETRAHEDRAL VOIDS are smaller, formed when 4 spheres surround a central space tetrahedrally (3 spheres from one layer forming triangle, 1 sphere from adjacent layer fitting into the depression). The number of tetrahedral voids is DOUBLE the number of atoms: if N atoms, then 2N tetrahedral voids. In FCC with 4 atoms, there are 8 tetrahedral voids. The size difference is important: octahedral voids are larger (radius ratio r_void/r_sphere = 0.414) and can accommodate larger cations like Na⁺, Mg²⁺, while tetrahedral voids are smaller (radius ratio = 0.225) and accommodate smaller cations like Li⁺, Be²⁺. This determines ionic crystal structures: NaCl has Cl⁻ in FCC with Na⁺ in ALL octahedral voids (N voids, coordination 6:6). ZnS has S²⁻ in FCC with Zn²⁺ in HALF the tetrahedral voids (2N voids but only N occupied, coordination 4:4). Understanding void numbers and sizes is essential for predicting and explaining ionic compound structures and stoichiometry.',
          },
          {
            id: 'solid-q7',
            type: 'mcq',
            question: 'Which defect decreases the density of a crystal?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Frenkel defect',
              'Schottky defect',
              'Metal excess defect with extra cations in interstitial sites',
              'Impurity defect'
            ],
            correctAnswer: 1,
            explanation: 'SCHOTTKY DEFECT decreases the density of a crystal because it involves missing ions from the crystal lattice. In Schottky defect, equal numbers of cations and anions are missing from their normal lattice positions, creating vacancies. This maintains electrical neutrality (charge balance) but reduces the mass of the unit cell while the volume remains the same. Since density = mass/volume, when mass decreases with constant volume, density DECREASES. Schottky defects are common in ionic crystals with high coordination numbers (6:6 or 8:8) where cations and anions have similar sizes, such as NaCl, KCl, KBr, and CsCl. The missing ions typically move to the crystal surface. In contrast, FRENKEL DEFECT (option A) does NOT change density because no ions are actually missing—a cation is merely displaced from its normal lattice position to an interstitial site (void). The mass and volume both remain unchanged, so density is unchanged. Frenkel defects occur when there is a large size difference between ions (small cation can fit into voids), common in AgCl, AgBr, AgI, and ZnS with low coordination numbers (4:4). METAL EXCESS DEFECT with extra cations in interstitial sites (option C) actually INCREASES density slightly because extra metal ions are added to interstitial positions without removing anything, increasing mass while volume stays constant. This occurs in ZnO when heated (loses O₂, excess Zn²⁺ moves to voids). IMPURITY DEFECTS (option D) can either increase or decrease density depending on whether the impurity atom is heavier or lighter than the host atom. Understanding how defects affect density is important for materials science and explains why real crystals often have densities slightly different from calculated values assuming perfect crystals.',
          },
          {
            id: 'solid-q8',
            type: 'mcq',
            question: 'When NaCl is heated in sodium vapor, it turns yellow. This is due to:',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'Schottky defect',
              'Frenkel defect',
              'Metal excess defect with F-centers',
              'Metal deficiency defect'
            ],
            correctAnswer: 2,
            explanation: 'When NaCl is heated in sodium vapor, it turns yellow due to METAL EXCESS DEFECT WITH F-CENTERS. This is a classic example of a non-stoichiometric defect that changes crystal color. Here\'s the mechanism: When NaCl crystals are heated in an atmosphere of sodium vapor, sodium atoms deposit on the crystal surface and diffuse into the crystal. These Na atoms lose their valence electrons, becoming Na⁺ ions which occupy normal cation sites. The released electrons need to go somewhere to maintain charge balance—they get trapped in ANION VACANCIES (missing Cl⁻ sites). An electron trapped in an anion vacancy is called an F-CENTER (from German "Farbzentrum" meaning "color center"). These F-centers are anionic sites occupied by unpaired electrons. The trapped electrons can absorb visible light (specifically, yellow-green light is absorbed), and the complementary color is observed—hence NaCl appears YELLOW. The electronic transition responsible is: electron in the vacancy gets excited to higher energy levels when it absorbs specific wavelengths of light. This is a METAL EXCESS defect because there is now excess metal (extra Na) compared to the stoichiometric ratio. Other examples: ZnO is white but turns yellow when heated (loses O₂, creates metal excess), and this increases electrical conductivity because the extra electrons are mobile. Option A (Schottky) is WRONG—it involves missing ions but doesn\'t create color centers. Option B (Frenkel) is WRONG—it\'s just ion displacement, doesn\'t involve electrons in vacancies. Option D (metal deficiency) is WRONG—that involves missing metal cations with compensating higher oxidation states, seen in FeO. F-centers are responsible for colors in many minerals and gemstones, making this concept important in materials science, gemology, and solid-state physics.',
          },
        ],
      },
    },
  ],
};
