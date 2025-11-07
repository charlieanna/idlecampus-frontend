/**
 * Module 4: Chemical Bonding and Molecular Structure
 */

import type { ChemistryModule } from '../../types';

export const chemicalBondingModule: ChemistryModule = {
  id: 'class11-chemical-bonding',
  slug: 'chemical-bonding',
  title: 'Chemical Bonding and Molecular Structure',
  description: 'Master ionic, covalent bonding, VSEPR theory, hybridization, and molecular orbital theory.',
  icon: 'link',
  sequenceOrder: 4,
  estimatedHours: 18,
  topic: 'physical',
  difficulty: 'medium',
  prerequisites: ['class11-atomic-structure', 'class11-periodic-classification'],
  learningOutcomes: [
    'Explain ionic, covalent, and coordinate bonding',
    'Apply VSEPR theory to predict molecular shapes',
    'Understand hybridization (sp, sp², sp³, sp³d, sp³d²)',
    'Describe molecular orbital theory and bond order',
    'Explain resonance and formal charges',
    'Understand intermolecular forces',
  ],
  items: [
    {
      id: 'cb-lesson-1',
      title: 'Chemical Bonding: Ionic and Covalent Bonds',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'cb-lesson-1',
        title: 'Chemical Bonding: Ionic and Covalent Bonds',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Chemical Bonding: Ionic and Covalent Bonds

## Why Do Atoms Bond?

Atoms bond to achieve **stable electronic configuration** (noble gas configuration with 8 valence electrons - **octet rule**).

> **Octet Rule**: Atoms tend to gain, lose, or share electrons to achieve 8 electrons in their valence shell.

**Exceptions**: H (duplet - 2 electrons), Be, B (incomplete octet), P, S (expanded octet)

## Ionic Bonding

### Formation

**Ionic bond** forms by **complete transfer of electron(s)** from metal to non-metal.

**Example: NaCl Formation**

$$Na (2,8,1) \\rightarrow Na^+ (2,8) + e^-$$ (oxidation)
$$Cl (2,8,7) + e^- \\rightarrow Cl^- (2,8,8)$$ (reduction)
$$Na + Cl \\rightarrow Na^+Cl^-$$

Both achieve noble gas configuration!

### Characteristics of Ionic Compounds

1. **High melting and boiling points** (strong electrostatic forces)
2. **Conduct electricity in molten/aqueous state** (mobile ions)
3. **Soluble in polar solvents** (water) - "like dissolves like"
4. **Hard but brittle** (ionic crystal structure)
5. **Form crystal lattices** (regular 3D arrangement)

### Lattice Energy

**Lattice energy**: Energy released when gaseous ions combine to form ionic solid.

$$M^+(g) + X^-(g) \\rightarrow MX(s) + \\text{Lattice Energy}$$

**Born-Landé equation** (simplified):

$$U \\propto \\frac{Z^+ \\cdot Z^-}{r_0}$$

where:
- $Z^+$, $Z^-$ = charges on ions
- $r_0$ = interionic distance

**Higher charge, smaller size → Higher lattice energy → Higher melting point**

**Example**: 
- NaCl vs MgO
- MgO has higher lattice energy (2+ and 2- charges vs 1+ and 1-)
- MgO melting point: 2852°C vs NaCl: 801°C

## Covalent Bonding

### Formation

**Covalent bond** forms by **sharing of electron pair(s)** between two atoms (usually non-metals).

### Types of Covalent Bonds

**1. Single Bond** (one shared pair)
- Example: H₂, Cl₂, CH₄
- $H-H$, $Cl-Cl$, $C-H$

**2. Double Bond** (two shared pairs)
- Example: O₂, CO₂
- $O=O$, $C=O$

**3. Triple Bond** (three shared pairs)
- Example: N₂, CO
- $N≡N$, $C≡O$

### Lewis Dot Structures

**Steps to draw Lewis structures**:

1. Count total valence electrons
2. Place least electronegative atom in center (except H)
3. Connect atoms with single bonds
4. Complete octets of outer atoms
5. Place remaining electrons on central atom
6. Form multiple bonds if needed to satisfy octet

**Example: CO₂**

1. Total electrons: C(4) + 2×O(6) = 16
2. O-C-O (uses 4 electrons)
3. Complete O octets: 12 electrons used, 0 remaining
4. Central C has only 4 electrons - needs double bonds!
5. Final: $O=C=O$ ✓

### Formal Charge

Helps determine most stable Lewis structure.

$$\\text{Formal charge} = V - N - \\frac{B}{2}$$

where:
- V = valence electrons in free atom
- N = non-bonding electrons
- B = bonding electrons

**Best structure has**:
- Formal charges closest to zero
- Negative formal charge on more electronegative atom

### Coordinate (Dative) Bond

Both electrons come from **one atom** (donor), other atom accepts.

**Notation**: A→B (arrow from donor to acceptor)

**Example**: NH₃ + H⁺ → NH₄⁺

$$H_3N: + H^+ \\rightarrow [H_3N-H]^+$$

N donates lone pair to H⁺

**Other examples**:
- H₃N→BF₃ (Lewis acid-base adduct)
- CO (C→O coordinate bond contributes to triple bond)

## Electronegativity and Bond Polarity

**Electronegativity**: Ability of atom to attract bonding electrons.

**Pauling Scale**: F (4.0) is most electronegative

### Bond Polarity

**ΔEN** (electronegativity difference) determines bond type:

| ΔEN | Bond Type | Example |
|-----|-----------|---------|
| 0 - 0.4 | Non-polar covalent | H-H, C-H |
| 0.4 - 1.7 | Polar covalent | H-Cl, C-O |
| > 1.7 | Ionic | Na-Cl, Mg-O |

**Polar bond**: Unequal sharing → partial charges (δ⁺ and δ⁻)

$$H^{\\delta+}-Cl^{\\delta-}$$

**Dipole moment** (μ): Measure of polarity

$$\\mu = q \\times d$$

where q = charge, d = distance

Units: Debye (D), 1 D = 3.34 × 10⁻³⁰ C·m

## Characteristics of Covalent Compounds

1. **Low melting and boiling points** (weak intermolecular forces)
2. **Poor electrical conductors** (no free ions/electrons)
3. **Soluble in non-polar solvents** (benzene, CCl₄)
4. **Exist as gases, liquids, or soft solids**
5. **Directional bonds** (specific geometry)

## Fajan's Rules

Predict ionic vs covalent character in bonds:

**Covalent character increases when**:
1. **Small cation** (high charge density)
2. **Large anion** (easily polarizable)
3. **High charge on ions**

**Example**: 
- LiCl is more covalent than NaCl (Li⁺ smaller)
- AlCl₃ is more covalent than NaCl (Al³⁺ higher charge)

**Polarization**: Cation distorts electron cloud of anion

## Worked Examples

### Example 1: Predicting Bond Type
**Q**: Predict bond type in: (a) CaO (b) CCl₄ (c) HF

**Solution**:
- (a) CaO: ΔEN = 3.5 - 1.0 = 2.5 → **Ionic**
- (b) CCl₄: ΔEN = 3.0 - 2.5 = 0.5 → **Polar covalent**
- (c) HF: ΔEN = 4.0 - 2.1 = 1.9 → **Ionic/Highly polar**

### Example 2: Lewis Structure of CO
**Q**: Draw Lewis structure of CO and assign formal charges.

**Solution**:

Total electrons: C(4) + O(6) = 10

Try: $:C=O:$ → FC(C) = 4-2-3 = -1, FC(O) = 6-4-2 = 0
Better: $:C≡O:$ → FC(C) = 4-2-3 = -1, FC(O) = 6-2-3 = +1

Even better with coordinate bond: $C→O$ contributing to triple bond
Final: $:C≡O:$ with formal charges minimized

## Key Takeaways

1. Ionic bonds: electron transfer, high MP, conduct when molten
2. Covalent bonds: electron sharing, low MP, don't conduct
3. Electronegativity difference determines bond type
4. Lewis structures show bonding and lone pairs
5. Formal charge helps find most stable structure
6. Coordinate bonds: both electrons from one atom

## Practice Problems

1. Draw Lewis structures for: H₂O, NH₃, CH₄, CO₂
2. Calculate formal charges for HCN
3. Explain why MgO has higher melting point than NaCl
4. Arrange in increasing covalent character: NaCl, MgCl₂, AlCl₃
`,
        objectives: [
          'Explain ionic bond formation and properties',
          'Describe covalent bonding and types',
          'Draw Lewis dot structures',
          'Calculate formal charges',
          'Understand coordinate bonding',
          'Relate electronegativity to bond polarity',
        ],
        keyTerms: [
          { term: 'Ionic Bond', definition: 'Bond formed by complete electron transfer from metal to non-metal' },
          { term: 'Covalent Bond', definition: 'Bond formed by sharing of electron pair(s) between atoms' },
          { term: 'Lattice Energy', definition: 'Energy released when gaseous ions form ionic solid' },
          { term: 'Electronegativity', definition: 'Ability of atom to attract bonding electrons' },
          { term: 'Formal Charge', definition: 'Charge assigned to atom in molecule assuming equal sharing' },
          { term: 'Coordinate Bond', definition: 'Covalent bond where both electrons come from one atom' },
        ],
        misconceptions: [
          {
            misconception: 'Ionic compounds conduct electricity in solid state',
            correction: 'Ionic compounds conduct only when molten or dissolved (ions must be mobile)',
          },
          {
            misconception: 'Covalent bonds are always non-polar',
            correction: 'Covalent bonds can be polar or non-polar depending on electronegativity difference',
          },
        ],
      },
    },
    {
      id: 'cb-lesson-2',
      title: 'VSEPR Theory and Molecular Geometry',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'cb-lesson-2',
        title: 'VSEPR Theory and Molecular Geometry',
        sequenceOrder: 2,
        estimatedMinutes: 45,
        content: `
# VSEPR Theory and Molecular Geometry

## Valence Shell Electron Pair Repulsion (VSEPR) Theory

**Key Principle**: Electron pairs around central atom repel each other and arrange to **minimize repulsion** (maximum separation).

### VSEPR Postulates

1. **Electron pairs repel** (both bonding and lone pairs)
2. **Repulsion order**: LP-LP > LP-BP > BP-BP
   - LP = Lone Pair, BP = Bonding Pair
3. **Multiple bonds treated as single unit** for geometry
4. Geometry depends on **total electron pairs** around central atom

## Molecular Geometries

### Determining Geometry

**Formula**: ABₙEₘ
- A = Central atom
- B = Bonded atoms (n = number)
- E = Lone pairs (m = number)

**Steric number** = n + m (total electron pairs)

### Common Geometries

| Steric Number | Electron Geometry | Example (no LP) | Bond Angle |
|---------------|-------------------|-----------------|------------|
| 2 | Linear | CO₂ (AB₂) | 180° |
| 3 | Trigonal planar | BF₃ (AB₃) | 120° |
| 4 | Tetrahedral | CH₄ (AB₄) | 109.5° |
| 5 | Trigonal bipyramidal | PCl₅ (AB₅) | 90°, 120° |
| 6 | Octahedral | SF₆ (AB₆) | 90° |

### Effect of Lone Pairs

Lone pairs occupy more space → compress bond angles

**Water (H₂O)**: AB₂E₂
- Steric number: 4 (tetrahedral electron geometry)
- 2 lone pairs repel
- **Molecular shape**: Bent
- **Bond angle**: 104.5° (< 109.5°)

**Ammonia (NH₃)**: AB₃E
- Steric number: 4 (tetrahedral electron geometry)
- 1 lone pair
- **Molecular shape**: Trigonal pyramidal
- **Bond angle**: 107° (< 109.5°)

### Molecular Shapes with Different Steric Numbers

**Steric Number 3:**
- AB₃: Trigonal planar (BF₃) - 120°
- AB₂E: Bent (SO₂) - <120°

**Steric Number 4:**
- AB₄: Tetrahedral (CH₄) - 109.5°
- AB₃E: Trigonal pyramidal (NH₃) - 107°
- AB₂E₂: Bent (H₂O) - 104.5°

**Steric Number 5:**
- AB₅: Trigonal bipyramidal (PCl₅) - 90°, 120°
- AB₄E: See-saw (SF₄)
- AB₃E₂: T-shaped (ClF₃)
- AB₂E₃: Linear (XeF₂)

**Steric Number 6:**
- AB₆: Octahedral (SF₆) - 90°
- AB₅E: Square pyramidal (BrF₅)
- AB₄E₂: Square planar (XeF₄)

## Worked Examples

### Example 1: NH₃ Geometry
**Q**: Predict geometry and bond angle of NH₃

**Solution**:
1. Central atom: N
2. Valence electrons: N(5) + 3H(3) = 8
3. Lewis structure: 3 N-H bonds + 1 lone pair on N
4. Steric number: 3 + 1 = 4
5. Electron geometry: Tetrahedral
6. **Molecular shape**: Trigonal pyramidal (AB₃E)
7. **Bond angle**: ~107° (compressed by lone pair)

### Example 2: CO₂ vs SO₂
**Q**: Why is CO₂ linear but SO₂ bent?

**Solution**:

**CO₂**: O=C=O
- No lone pairs on C
- Steric number: 2 (2 double bonds counted as 2 units)
- **Shape**: Linear, 180°

**SO₂**: O=S=O with 1 lone pair on S
- 1 lone pair on S
- Steric number: 3 (2 bonds + 1 LP)
- **Shape**: Bent, ~119°

### Example 3: XeF₄ Geometry
**Q**: Predict shape of XeF₄

**Solution**:
1. Xe has 8 valence electrons
2. 4 bonds to F use 4 electrons
3. Remaining 4 electrons = 2 lone pairs
4. Steric number: 4 + 2 = 6
5. Electron geometry: Octahedral
6. **Molecular shape**: Square planar (AB₄E₂)
7. **Bond angles**: 90°

## Molecular Polarity

**Polar molecule**: Has net dipole moment (μ ≠ 0)

### Conditions for Polarity

1. **Polar bonds** (ΔEN ≠ 0)
2. **Asymmetric geometry** (dipoles don't cancel)

**Examples**:

**CO₂** (non-polar despite polar C=O bonds)
- Linear geometry
- Dipoles cancel: ←O=C=O→
- μ = 0

**H₂O** (polar)
- Bent geometry
- Dipoles don't cancel
- μ = 1.85 D (points toward O)

**CCl₄** (non-polar)
- Tetrahedral, symmetric
- Four C-Cl dipoles cancel
- μ = 0

**CHCl₃** (polar)
- Tetrahedral but asymmetric
- Dipoles don't fully cancel
- μ ≠ 0

## Summary Table

| Molecule | Formula | Shape | Polar? |
|----------|---------|-------|--------|
| CO₂ | AB₂ | Linear | No |
| H₂O | AB₂E₂ | Bent | Yes |
| NH₃ | AB₃E | Trigonal pyramidal | Yes |
| CH₄ | AB₄ | Tetrahedral | No |
| SF₆ | AB₆ | Octahedral | No |
| PCl₅ | AB₅ | Trigonal bipyramidal | No |

## Key Takeaways

1. VSEPR predicts molecular geometry based on electron pair repulsion
2. Lone pairs repel more than bonding pairs (compress bond angles)
3. Steric number determines electron geometry
4. Molecular shape differs from electron geometry when lone pairs present
5. Molecular polarity depends on both bond polarity and geometry
6. Symmetric molecules are non-polar even with polar bonds

## Practice Problems

1. Predict shapes: BeCl₂, BCl₃, SiCl₄, PF₅
2. Explain why NH₃ has smaller bond angle than CH₄
3. Is SO₃ polar or non-polar? Explain.
4. Draw and predict geometry of ClF₃
`,
        objectives: [
          'State and apply VSEPR theory',
          'Predict molecular geometries using steric number',
          'Explain effect of lone pairs on bond angles',
          'Determine molecular polarity',
          'Draw 3D structures of molecules',
        ],
        keyTerms: [
          { term: 'VSEPR Theory', definition: 'Theory that electron pairs repel to minimize repulsion, determining molecular shape' },
          { term: 'Steric Number', definition: 'Total number of atoms bonded to central atom plus lone pairs' },
          { term: 'Electron Geometry', definition: 'Arrangement of all electron pairs (bonding + lone) around central atom' },
          { term: 'Molecular Geometry', definition: 'Arrangement of only atoms (ignoring lone pairs)' },
          { term: 'Dipole Moment', definition: 'Measure of molecular polarity; product of charge and distance' },
        ],
      },
    },
    {
      id: 'cb-quiz-1',
      title: 'Chemical Bonding and VSEPR Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'cb-quiz-1',
        title: 'Chemical Bonding and VSEPR Quiz',
        description: 'Test your understanding of ionic/covalent bonding, Lewis structures, and VSEPR theory.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'cb-q1',
            type: 'mcq',
            question: 'Which type of bond forms between Na and Cl in NaCl?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Covalent bond',
              'Ionic bond',
              'Metallic bond',
              'Hydrogen bond',
            ],
            correctAnswer: 1,
            explanation: 'Ionic bond forms between Na (metal) and Cl (non-metal) by complete electron transfer. Na loses one electron to form Na⁺, and Cl gains one electron to form Cl⁻. The electrostatic attraction between these ions forms the ionic bond.',
          },
          {
            id: 'cb-q2',
            type: 'mcq',
            question: 'What is the molecular geometry of NH₃?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Tetrahedral',
              'Trigonal planar',
              'Trigonal pyramidal',
              'Bent',
            ],
            correctAnswer: 2,
            explanation: 'NH₃ has steric number 4 (3 bonds + 1 lone pair). The electron geometry is tetrahedral, but the molecular shape considering only atoms is trigonal pyramidal (AB₃E). The lone pair on nitrogen compresses the H-N-H bond angle to ~107°.',
            hasLatex: true,
          },
          {
            id: 'cb-q3',
            type: 'mcq',
            question: 'Which molecule is non-polar despite having polar bonds?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'H₂O',
              'NH₃',
              'CO₂',
              'HCl',
            ],
            correctAnswer: 2,
            explanation: 'CO₂ is linear (O=C=O) with two polar C=O bonds. However, the dipole moments are equal and opposite, so they cancel out, making the molecule non-polar (μ = 0). H₂O and NH₃ are polar due to their bent and pyramidal geometries respectively.',
            hasLatex: true,
          },
          {
            id: 'cb-q4',
            type: 'mcq',
            question: 'Which statement about ionic compounds is FALSE?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'They have high melting points',
              'They conduct electricity in solid state',
              'They are soluble in polar solvents',
              'They form crystal lattices',
            ],
            correctAnswer: 1,
            explanation: 'Ionic compounds do NOT conduct electricity in solid state because ions are fixed in lattice positions. They conduct only when molten or dissolved in water, when ions become mobile. All other statements are true.',
          },
          {
            id: 'cb-q5',
            type: 'mcq',
            question: 'What is the shape of XeF₄?',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'Tetrahedral',
              'Square planar',
              'Octahedral',
              'See-saw',
            ],
            correctAnswer: 1,
            explanation: 'XeF₄ has 4 bonding pairs and 2 lone pairs (steric number = 6). The electron geometry is octahedral. The two lone pairs occupy opposite positions (trans) to minimize repulsion, resulting in square planar molecular geometry (AB₄E₂).',
            hasLatex: true,
          },
          {
            id: 'cb-q6',
            type: 'mcq',
            question: 'Why is the H-O-H bond angle in water (104.5°) less than the tetrahedral angle (109.5°)?',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'H atoms are too small',
              'O is very electronegative',
              'Two lone pairs on O repel bonding pairs',
              'H-O bonds are polar',
            ],
            correctAnswer: 2,
            explanation: 'Water has tetrahedral electron geometry with 2 bonding pairs and 2 lone pairs. Lone pairs repel more strongly than bonding pairs (LP-LP > LP-BP > BP-BP). The two lone pairs compress the H-O-H bond angle from the ideal 109.5° to 104.5°.',
          },
          {
            id: 'cb-q7',
            type: 'mcq',
            question: 'Which has the highest lattice energy?',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'NaCl',
              'MgO',
              'CaO',
              'KCl',
            ],
            correctAnswer: 1,
            explanation: 'Lattice energy is proportional to (charge product)/(interionic distance). MgO has Mg²⁺ and O²⁻ ions (charge product = 4), while NaCl has 1+/1- (product = 1). Also, Mg²⁺ and O²⁻ are smaller than Ca²⁺ and O²⁻. Higher charges and smaller sizes make MgO have the highest lattice energy and melting point.',
          },
        ],
      },
    },
  ],
};
