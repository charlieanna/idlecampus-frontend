/**
 * Module 11: Basic Principles of Organic Chemistry
 */

import type { ChemistryModule } from '../../types';

export const organicBasicsModule: ChemistryModule = {
  id: 'class11-organic-basics',
  slug: 'organic-basics',
  title: 'Basic Principles of Organic Chemistry',
  description: 'Foundation of organic chemistry: nomenclature, isomerism, reaction mechanisms, and functional groups.',
  icon: 'hexagon',
  sequenceOrder: 11,
  estimatedHours: 20,
  topic: 'organic',
  difficulty: 'medium',
  prerequisites: ['class11-chemical-bonding'],
  learningOutcomes: [
    'Understand carbon\'s unique properties (catenation, tetravalency)',
    'Apply IUPAC nomenclature rules',
    'Identify and classify isomers (structural, geometrical, optical)',
    'Understand reaction mechanisms (SN1, SN2, E1, E2)',
    'Identify electrophiles and nucleophiles',
    'Explain resonance and inductive effects',
    'Understand carbocation, carbanion, and free radical stability',
  ],
  items: [
    {
      id: 'organic-lesson-1',
      title: 'Introduction to Organic Chemistry and Nomenclature',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'organic-lesson-1',
        title: 'Introduction to Organic Chemistry and Nomenclature',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Introduction to Organic Chemistry and Nomenclature

## What is Organic Chemistry?

**Organic Chemistry**: The chemistry of carbon compounds

Originally thought organic compounds could only be produced by living organisms ("vital force" theory). In 1828, **Friedrich Wöhler** synthesized urea from inorganic ammonium cyanate:

$$\\ce{NH4OCN -> (NH2)2CO}$$

This disproved the vital force theory!

## Why is Carbon Special?

### 1. Tetravalency

Carbon has **4 valence electrons** (electronic configuration: 2s² 2p²)
- Forms **4 covalent bonds** to complete octet
- Can bond with C, H, O, N, S, halogens, etc.

### 2. Catenation

**Catenation**: Ability to form long chains with itself

**C-C bond is very strong** (348 kJ/mol)
- Forms chains: straight, branched, cyclic
- Single, double, triple bonds possible
- **Result**: Millions of organic compounds!

### 3. Small Size

- Strong overlap with other atoms
- Forms stable multiple bonds: C=C, C≡C, C=O, C≡N

### 4. Isomerism

Same molecular formula, different structures → different properties

**Example**: C₂H₆O can be:
- CH₃-O-CH₃ (dimethyl ether, gas)
- CH₃-CH₂-OH (ethanol, liquid)

## Hybridization in Organic Compounds

### sp³ Hybridization (Tetrahedral)

**Example**: Methane (CH₄)

- One s + three p orbitals → four sp³ orbitals
- Tetrahedral geometry
- Bond angle: **109.5°**
- All **single bonds** (σ bonds)

**Other examples**: Ethane (C₂H₆), all saturated hydrocarbons

### sp² Hybridization (Trigonal Planar)

**Example**: Ethene (C₂H₄)

- One s + two p orbitals → three sp² orbitals
- Trigonal planar geometry
- Bond angle: **120°**
- One **double bond** (1σ + 1π)
- Unhybridized p orbital forms π bond

**Other examples**: All alkenes, benzene, carbonyl compounds

### sp Hybridization (Linear)

**Example**: Ethyne (C₂H₂)

- One s + one p orbital → two sp orbitals
- Linear geometry
- Bond angle: **180°**
- One **triple bond** (1σ + 2π)
- Two unhybridized p orbitals form two π bonds

**Other examples**: All alkynes, nitriles (C≡N)

## Classification of Organic Compounds

### By Carbon Chain Structure

**1. Aliphatic (Open Chain)**
- **Straight chain**: CH₃-CH₂-CH₂-CH₃ (butane)
- **Branched chain**: CH₃-CH(CH₃)-CH₃ (isobutane)

**2. Cyclic (Ring)**
- **Alicyclic**: Non-aromatic rings (cyclohexane)
- **Aromatic**: Benzene rings (benzene, toluene)

### By Functional Groups

**Functional Group**: Atom or group that determines chemical behavior

| Functional Group | Name | Example |
|------------------|------|---------|
| -OH | Alcohol | CH₃OH (methanol) |
| -CHO | Aldehyde | CH₃CHO (ethanal) |
| >C=O | Ketone | CH₃COCH₃ (propanone) |
| -COOH | Carboxylic acid | CH₃COOH (ethanoic acid) |
| -NH₂ | Amine | CH₃NH₂ (methanamine) |
| -X (F,Cl,Br,I) | Haloalkane | CH₃Cl (chloromethane) |
| -O- | Ether | CH₃OCH₃ (dimethyl ether) |

### Homologous Series

**Homologous Series**: Family of compounds with same functional group, differing by CH₂

**Example - Alkanes**:
- CH₄ (methane)
- C₂H₆ (ethane)
- C₃H₈ (propane)
- C₄H₁₀ (butane)

General formula: **CₙH₂ₙ₊₂**

**Properties**:
- Similar chemical behavior
- Gradual change in physical properties
- Each differs by -CH₂- unit (14 mass units)

## IUPAC Nomenclature

**IUPAC**: International Union of Pure and Applied Chemistry

Systematic naming system for organic compounds

### Basic Rules

**Step 1**: Identify the **longest carbon chain** (parent chain)

**Step 2**: Number the chain from the end giving **lowest numbers** to:
1. Functional group (highest priority)
2. Double/triple bonds
3. Substituents (branches)

**Step 3**: Name substituents (branches) with position numbers

**Step 4**: Assemble the name:
**[Substituents] [Parent chain] [Suffix for functional group]**

### Parent Chain Names

| Carbons | Name | Carbons | Name |
|---------|------|---------|------|
| 1 | Meth- | 6 | Hex- |
| 2 | Eth- | 7 | Hept- |
| 3 | Prop- | 8 | Oct- |
| 4 | But- | 9 | Non- |
| 5 | Pent- | 10 | Dec- |

### Suffixes

| Compound Type | Suffix | Example |
|---------------|--------|---------|
| Alkane | -ane | Ethane |
| Alkene | -ene | Ethene |
| Alkyne | -yne | Ethyne |
| Alcohol | -ol | Ethanol |
| Aldehyde | -al | Ethanal |
| Ketone | -one | Propanone |
| Carboxylic acid | -oic acid | Ethanoic acid |

### Common Substituents (Alkyl Groups)

| Group | Name | Group | Name |
|-------|------|-------|------|
| -CH₃ | Methyl | -CH₂CH₃ | Ethyl |
| -CH(CH₃)₂ | Isopropyl | -C(CH₃)₃ | tert-Butyl |

### Examples

**Example 1**: CH₃-CH₂-CH₂-CH₃

Longest chain: 4 carbons → **Butane**

**Example 2**: CH₃-CH(CH₃)-CH₃

```
    CH₃
    |
CH₃-CH-CH₃
```

Longest chain: 3 carbons (propane)
Substituent: Methyl at position 2
Name: **2-Methylpropane**

**Example 3**: CH₃-CH=CH-CH₃

```
CH₃-CH=CH-CH₃
 1   2  3  4
```

Double bond between C2-C3
Name: **But-2-ene** (or 2-butene)

**Example 4**: CH₃-CH₂-OH

Longest chain: 2 carbons (ethane)
Functional group: -OH (alcohol)
Name: **Ethanol**

**Example 5**:
```
    CH₃
    |
CH₃-CH-CH₂-CH₂-CH₃
    2  3   4   5
```

Numbering from right: gives substituent at position 2 (not 4)
Name: **2-Methylpentane**

### Multiple Substituents

Use prefixes: di-, tri-, tetra-, etc.

**Example**:
```
CH₃ CH₃
 |   |
CH₃-C---CH-CH₃
    |
    CH₃
```

Three methyl groups at positions 2, 2, 3
Name: **2,2,3-Trimethylbutane**

**Alphabetical order** for different substituents:

**Example**: Ethyl at C2, Methyl at C3
Name: **2-Ethyl-3-methylpentane**
(E comes before M alphabetically)

### Priority of Functional Groups (High to Low)

1. Carboxylic acid (-COOH)
2. Ester (-COOR)
3. Amide (-CONH₂)
4. Nitrile (-CN)
5. Aldehyde (-CHO)
6. Ketone (>C=O)
7. Alcohol (-OH)
8. Amine (-NH₂)
9. Alkene (C=C)
10. Alkyne (C≡C)

The highest priority functional group gets the suffix; others are named as prefixes.

## Key Takeaways

1. **Organic chemistry** = chemistry of carbon compounds
2. Carbon is unique: **tetravalency**, **catenation**, strong bonds, isomerism
3. **Hybridization**: sp³ (tetrahedral, 109.5°), sp² (planar, 120°), sp (linear, 180°)
4. Compounds classified by structure (aliphatic/cyclic) and functional groups
5. **Homologous series**: Family differing by CH₂, similar properties
6. **IUPAC nomenclature**: Systematic naming based on longest chain, substituents, functional groups
7. Functional group priority determines main suffix
`,
        objectives: [
          'Explain why carbon forms millions of compounds',
          'Describe hybridization in organic molecules (sp³, sp², sp)',
          'Classify organic compounds by structure and functional groups',
          'Apply IUPAC nomenclature rules to name simple organic compounds',
          'Identify homologous series and functional groups',
        ],
        keyTerms: [
          { term: 'Catenation', definition: 'Ability of carbon to form long chains with itself' },
          { term: 'Functional Group', definition: 'Atom or group of atoms that determines chemical properties of a compound' },
          { term: 'Homologous Series', definition: 'Family of compounds with same functional group, differing by CH₂' },
          { term: 'IUPAC', definition: 'International Union of Pure and Applied Chemistry - systematic naming system' },
        ],
      },
    },
    {
      id: 'organic-lesson-2',
      title: 'Isomerism in Organic Compounds',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'organic-lesson-2',
        title: 'Isomerism in Organic Compounds',
        sequenceOrder: 2,
        estimatedMinutes: 45,
        content: `
# Isomerism in Organic Compounds

## What is Isomerism?

**Isomerism**: Compounds with the **same molecular formula** but **different structural arrangements**

**Result**: Different physical and chemical properties

**Example**: C₄H₁₀ has two isomers:
1. **n-Butane**: CH₃-CH₂-CH₂-CH₃ (b.p. -0.5°C)
2. **Isobutane**: CH₃-CH(CH₃)-CH₃ (b.p. -11.7°C)

## Types of Isomerism

### A. Structural Isomerism (Constitutional Isomerism)

**Structural Isomers**: Different connectivity of atoms

#### 1. Chain Isomerism

Different carbon skeleton (straight vs. branched)

**Example - C₅H₁₂** (three isomers):

**a) n-Pentane** (straight chain):
```
CH₃-CH₂-CH₂-CH₂-CH₃
```

**b) Isopentane** (2-methylbutane):
```
    CH₃
    |
CH₃-CH-CH₂-CH₃
```

**c) Neopentane** (2,2-dimethylpropane):
```
    CH₃
    |
CH₃-C-CH₃
    |
    CH₃
```

All have C₅H₁₂ but different structures!

#### 2. Position Isomerism

Same carbon skeleton, functional group at different positions

**Example - C₃H₈O** (two alcohols):

**a) Propan-1-ol**:
```
CH₃-CH₂-CH₂-OH
```

**b) Propan-2-ol**:
```
CH₃-CH(OH)-CH₃
```

**Example - C₄H₈** (alkenes):

**a) But-1-ene**: CH₂=CH-CH₂-CH₃
**b) But-2-ene**: CH₃-CH=CH-CH₃

#### 3. Functional Group Isomerism

Same molecular formula, different functional groups

**Example - C₂H₆O**:

**a) Ethanol** (alcohol):
```
CH₃-CH₂-OH
b.p. 78°C, liquid
```

**b) Dimethyl ether** (ether):
```
CH₃-O-CH₃
b.p. -25°C, gas
```

**Example - C₃H₆O**:

**a) Propanal** (aldehyde):
```
CH₃-CH₂-CHO
```

**b) Propanone** (ketone):
```
CH₃-CO-CH₃
```

**c) Allyl alcohol** (unsaturated alcohol):
```
CH₂=CH-CH₂-OH
```

#### 4. Metamerism

Different alkyl groups around a functional group (ethers, amines)

**Example - C₄H₁₀O** (ethers):

**a) Methoxyethane**: CH₃-O-CH₂-CH₃
**b) Ethoxyethane**: CH₃-CH₂-O-CH₂-CH₃

Different alkyl groups (methyl+ethyl vs. ethyl+ethyl)

### B. Stereoisomerism

**Stereoisomers**: Same connectivity, different **spatial arrangement**

#### 1. Geometrical Isomerism (Cis-Trans Isomerism)

Occurs in compounds with **restricted rotation**:
- Alkenes (C=C double bond)
- Cyclic compounds

**Condition**: Two different groups on each carbon of C=C

**Example - But-2-ene (C₄H₈)**:

**a) Cis-but-2-ene**:
```
    CH₃    CH₃
     \\   /
      C=C
     /   \\
    H     H
```
(Same groups on same side)
b.p. 3.7°C

**b) Trans-but-2-ene**:
```
    CH₃    H
     \\   /
      C=C
     /   \\
    H     CH₃
```
(Same groups on opposite sides)
b.p. 0.9°C

**Note**: Rotation around C=C is restricted (π bond prevents rotation)

**E-Z Nomenclature** (for complex cases):
- **Z** (Zusammen = together): Higher priority groups on same side
- **E** (Entgegen = opposite): Higher priority groups on opposite sides

Priority determined by **Cahn-Ingold-Prelog (CIP) rules** (atomic number)

**Example**:
```
    Cl     Br
     \\   /
      C=C
     /   \\
    H     CH₃
```

This is **(E)-isomer** because Cl (priority) and Br (priority) are on opposite sides

#### 2. Optical Isomerism (Enantiomerism)

Occurs in molecules with **chiral centers**

**Chiral Center (Stereocenter)**: Carbon atom bonded to **four different groups**

**Chirality**: Non-superimposable mirror images (like left and right hands)

**Example - Lactic acid**:
```
        COOH               COOH
        |                  |
    H---C---OH     HO---C---H
        |                  |
        CH₃                CH₃

    D-Lactic acid     L-Lactic acid
    (Mirror images)
```

**Enantiomers**: Non-superimposable mirror image isomers

**Properties**:
- Same physical properties (m.p., b.p., density)
- Same chemical properties
- **Different**: Rotate plane-polarized light in opposite directions
  - **Dextrorotatory (+)**: Rotates light clockwise
  - **Levorotatory (-)**: Rotates light counterclockwise

**Racemic Mixture**: 50:50 mixture of enantiomers (no net rotation)

**Optical Activity**: Ability to rotate plane-polarized light

**Test for Chirality**: If molecule and its mirror image are non-superimposable, it's chiral

**Example - 2-Chlorobutane**:
```
        CH₃
        |
    Cl--C--H
        |
        CH₂CH₃
```

C2 has four different groups: Cl, H, CH₃, C₂H₅ → **Chiral center**

**Achiral molecules**: Have plane of symmetry (superimposable on mirror image)

**Example - 2-Chloropropane**:
```
        CH₃
        |
    Cl--C--H
        |
        CH₃
```

C2 has two identical CH₃ groups → **Not chiral**

#### Diastereomers

Stereoisomers that are **NOT mirror images**

**Example**: Molecule with 2 chiral centers can have multiple stereoisomers

Cis-trans isomers are also diastereomers

## Summary Table

| Type | Connectivity | Spatial Arrangement | Example |
|------|--------------|---------------------|---------|
| **Chain isomerism** | Different | - | n-butane vs. isobutane |
| **Position isomerism** | Different | - | Propan-1-ol vs. propan-2-ol |
| **Functional group isomerism** | Different | - | Ethanol vs. dimethyl ether |
| **Geometrical (cis-trans)** | Same | Different | Cis-but-2-ene vs. trans-but-2-ene |
| **Optical (enantiomers)** | Same | Different (mirror images) | D-lactic acid vs. L-lactic acid |

## Importance of Isomerism

1. **Drugs**: Enantiomers can have different biological activities
   - Example: Thalidomide - one enantiomer is safe, other causes birth defects

2. **Properties**: Isomers have different physical and chemical properties
   - Different boiling points, melting points, reactivity

3. **Natural products**: Biological molecules are often specific enantiomers
   - L-amino acids in proteins, D-glucose in nature

## Key Takeaways

1. **Isomerism**: Same molecular formula, different structures
2. **Structural isomers**: Different connectivity (chain, position, functional group)
3. **Stereoisomers**: Same connectivity, different spatial arrangement
4. **Cis-trans isomerism**: Restricted rotation around C=C or in rings
5. **Optical isomerism**: Chiral centers (4 different groups on carbon)
6. **Enantiomers**: Non-superimposable mirror images, rotate polarized light
7. **Chirality**: Key concept in biology and pharmaceuticals
`,
        objectives: [
          'Define isomerism and explain its significance',
          'Distinguish between structural and stereoisomerism',
          'Identify chain, position, and functional group isomers',
          'Recognize geometrical (cis-trans) isomerism in alkenes',
          'Identify chiral centers and optical isomers',
          'Explain optical activity and enantiomers',
        ],
        keyTerms: [
          { term: 'Isomerism', definition: 'Phenomenon where compounds have same molecular formula but different structures' },
          { term: 'Chiral Center', definition: 'Carbon atom bonded to four different groups' },
          { term: 'Enantiomers', definition: 'Non-superimposable mirror image stereoisomers' },
          { term: 'Optical Activity', definition: 'Ability to rotate plane of plane-polarized light' },
        ],
      },
    },
    {
      id: 'organic-lesson-3',
      title: 'Electronic Effects and Reaction Mechanisms',
      type: 'lesson',
      sequenceOrder: 3,
      data: {
        id: 'organic-lesson-3',
        title: 'Electronic Effects and Reaction Mechanisms',
        sequenceOrder: 3,
        estimatedMinutes: 50,
        content: `
# Electronic Effects and Reaction Mechanisms

## Electronic Effects in Organic Molecules

### 1. Inductive Effect (I Effect)

**Inductive Effect**: Permanent polarization of σ bonds due to electronegativity differences

**Mechanism**: Electrons shift towards more electronegative atom

**Example**: In CH₃-CH₂-Cl

```
δ⁺  δ⁺  δ⁻
CH₃-CH₂-Cl
```

Cl is most electronegative → pulls electrons
Effect weakens with distance (dies after 3-4 bonds)

**Types**:

**-I Effect** (Electron-withdrawing):
Groups more electronegative than H
- **Examples**: -F, -Cl, -Br, -I, -OH, -NO₂, -CN, -COOH
- Make adjacent carbon δ⁺ (electron deficient)

**+I Effect** (Electron-releasing):
Groups less electronegative than H (alkyl groups)
- **Examples**: -CH₃, -C₂H₅, -C(CH₃)₃
- Make adjacent carbon δ⁻ (electron rich)

**Order of +I effect**:
$$\\ce{-C(CH3)3 > -CH(CH3)2 > -CH2CH3 > -CH3 > H}$$

tert-butyl > isopropyl > ethyl > methyl > hydrogen

**Application**: Affects acidity/basicity

**Acidity of alcohols**:
$$\\ce{CCl3CH2OH > CHCl2CH2OH > CH2ClCH2OH > CH3CH2OH}$$

More -I groups → more acidic (stabilize negative charge on O⁻)

### 2. Resonance Effect (Mesomeric Effect, R Effect)

**Resonance**: Delocalization of π electrons or lone pairs

**Resonance structures**: Different Lewis structures for same molecule (electrons in different positions, atoms in same positions)

**Example - Benzene**:
Two equivalent structures (Kekulé structures)

**Real structure**: Hybrid of resonance forms, **electrons delocalized**

**Example - Carboxylate ion** (CH₃COO⁻):
```
        O⁻                O
        ||                ||
CH₃-C          ↔      CH₃-C
        \\                \\
        O                 O⁻
```

Negative charge delocalized over both oxygens
Bond length between C-O single and C=O double

**Types**:

**+R Effect** (Electron-donating through resonance):
- Lone pair delocalizes into π system
- **Examples**: -OH, -OR, -NH₂, -X (halogens)

**Example - Aniline** (C₆H₅NH₂):
Lone pair on N delocalizes into benzene ring → activates ring

**-R Effect** (Electron-withdrawing through resonance):
- π electrons withdraw into group
- **Examples**: -NO₂, -CN, -CHO, -COOH, -COR

**Example - Nitrobenzene** (C₆H₅NO₂):
π electrons pulled into NO₂ group → deactivates ring

**Resonance vs. Inductive Effect**:
- **Resonance is stronger** than inductive effect
- Resonance operates through π system; inductive through σ bonds

### 3. Hyperconjugation

**Hyperconjugation**: Delocalization of σ electrons (C-H or C-C) into adjacent π system or empty p orbital

**Also called**: No-bond resonance

**Example - Propene** (CH₃-CH=CH₂):
```
        H
        |
H - C - CH = CH₂
        |
        H
```

C-H σ bonds of CH₃ can overlap with π orbital of C=C

**Number of α-hydrogens** determines extent of hyperconjugation

**Effect**: Stabilizes carbocations, alkenes, free radicals

**Application**: Explains stability order of carbocations (see below)

## Reactive Intermediates

### 1. Carbocations (Carbonium Ions)

**Carbocation**: Positively charged carbon with only 6 electrons

$$\\ce{R3C+}$$

**Structure**: sp² hybridized, planar, empty p orbital

**Stability Order**:
$$\\ce{3° > 2° > 1° > CH3+}$$

Tertiary > Secondary > Primary > Methyl

**Reasons**:
1. **+I effect**: More alkyl groups donate electrons → stabilize positive charge
2. **Hyperconjugation**: More α-H atoms → more stabilization

**Example**:
- **(CH₃)₃C⁺** (tertiary): Most stable (3 alkyl groups, 9 α-H)
- **(CH₃)₂CH⁺** (secondary): Less stable (2 alkyl groups, 6 α-H)
- **CH₃CH₂⁺** (primary): Even less stable (1 alkyl group, 3 α-H)
- **CH₃⁺** (methyl): Least stable (0 alkyl groups, 0 α-H)

**Resonance stabilization**: If positive charge can delocalize, carbocation is very stable

**Example - Allyl cation** (CH₂=CH-CH₂⁺):
Positive charge delocalizes over C1 and C3

### 2. Carbanions

**Carbanion**: Negatively charged carbon with lone pair

$$\\ce{R3C-}$$

**Structure**: sp³ hybridized, tetrahedral (or pyramidal), lone pair in sp³ orbital

**Stability Order**:
$$\\ce{CH3- > 1° > 2° > 3°}$$

Methyl > Primary > Secondary > Tertiary

**Opposite of carbocations!**

**Reasons**:
1. **-I effect**: Electron-withdrawing groups stabilize negative charge
2. Alkyl groups (+I) destabilize negative charge

**Example**:
- **CCl₃⁻**: Very stable (3 Cl with -I effect)
- **CHCl₂⁻**: Stable (2 Cl)
- **CH₃⁻**: Relatively unstable

### 3. Free Radicals

**Free Radical**: Species with unpaired electron

$$\\ce{R3C•}$$

**Structure**: sp² hybridized, planar, unpaired electron in p orbital

**Stability Order**:
$$\\ce{3° > 2° > 1° > CH3•}$$

Tertiary > Secondary > Primary > Methyl

**Same as carbocations**

**Reasons**:
1. **Hyperconjugation**: More α-H → more stabilization
2. **+I effect**: Alkyl groups donate electron density

**Resonance**: Allylic and benzylic radicals very stable (delocalization)

## Electrophiles and Nucleophiles

### Electrophiles (Electron Lovers)

**Electrophile**: Electron-deficient species, seeks electrons

**Characteristics**:
- Positive charge or partial positive charge
- Incomplete octet
- Can accept electron pair

**Examples**:
- **Carbocations**: CH₃⁺, (CH₃)₃C⁺
- **Neutral molecules**: BF₃, AlCl₃ (electron deficient)
- **Polarized molecules**: H-Cl (δ⁺ on H), C=O (δ⁺ on C)
- **Halogens**: Br₂, Cl₂ (polarizable)

### Nucleophiles (Nucleus Lovers)

**Nucleophile**: Electron-rich species, seeks positive charge

**Characteristics**:
- Negative charge or lone pair
- Can donate electron pair

**Examples**:
- **Anions**: OH⁻, CN⁻, Cl⁻, RO⁻
- **Neutral molecules with lone pairs**: H₂O, NH₃, ROH
- **π bonds**: Alkenes (C=C), aromatic rings

**Nucleophilicity vs. Basicity**:
- Related but not identical
- **Nucleophilicity**: Kinetic property (rate of attack on carbon)
- **Basicity**: Thermodynamic property (affinity for proton)

## Types of Reactions

### 1. Substitution Reactions

One atom/group replaced by another

**Example**:
$$\\ce{CH3Cl + OH- -> CH3OH + Cl-}$$

### 2. Addition Reactions

Two groups add across multiple bond

**Example**:
$$\\ce{CH2=CH2 + HBr -> CH3-CH2Br}$$

### 3. Elimination Reactions

Loss of atoms to form multiple bond

**Example**:
$$\\ce{CH3-CH2Br + OH- -> CH2=CH2 + H2O + Br-}$$

### 4. Rearrangement Reactions

Atoms rearrange within molecule

## Reaction Mechanisms Overview

### SN1 (Substitution Nucleophilic Unimolecular)

**Mechanism**:
1. **Step 1** (slow): R-X → R⁺ + X⁻ (carbocation formation)
2. **Step 2** (fast): R⁺ + Nu⁻ → R-Nu (nucleophile attacks)

**Characteristics**:
- **Two steps**
- Rate = k[R-X] (depends only on substrate)
- **Carbocation intermediate**
- Favored by **3° substrates** (stable carbocation)
- Favored by polar protic solvents (stabilize carbocation)
- **Racemization** if chiral center (planar carbocation)

### SN2 (Substitution Nucleophilic Bimolecular)

**Mechanism**:
- **One step**: Nu⁻ attacks C as X⁻ leaves (concerted)
- **Transition state**: Nu---C---X (pentacoordinate)

**Characteristics**:
- **One step**
- Rate = k[R-X][Nu⁻] (depends on both)
- No intermediate
- Favored by **1° substrates** (less steric hindrance)
- Favored by polar aprotic solvents
- **Inversion of configuration** (Walden inversion) if chiral

### E1 (Elimination Unimolecular)

**Mechanism**:
1. **Step 1** (slow): R-X → R⁺ + X⁻ (carbocation formation)
2. **Step 2** (fast): Base removes H⁺ from β-carbon, forms C=C

**Characteristics**:
- Competes with SN1
- Rate = k[R-X]
- **Carbocation intermediate**
- Favored by heat, strong bases

### E2 (Elimination Bimolecular)

**Mechanism**:
- **One step**: Base removes H⁺ as X⁻ leaves, forms C=C

**Characteristics**:
- Competes with SN2
- Rate = k[R-X][Base]
- No intermediate
- Requires **anti-periplanar geometry** (H and X on opposite sides)

## Key Takeaways

1. **Inductive effect (-I, +I)**: Permanent polarization due to electronegativity
2. **Resonance effect (-R, +R)**: Delocalization of π electrons
3. **Hyperconjugation**: σ electrons delocalize into π or empty p orbital
4. **Carbocation stability**: 3° > 2° > 1° > CH₃⁺ (+I and hyperconjugation)
5. **Carbanion stability**: CH₃⁻ > 1° > 2° > 3° (opposite, -I stabilizes)
6. **Free radical stability**: 3° > 2° > 1° > CH₃• (same as carbocation)
7. **Electrophiles**: Electron deficient, accept electrons
8. **Nucleophiles**: Electron rich, donate electrons
9. **SN1**: Two steps, 3° substrates, racemization
10. **SN2**: One step, 1° substrates, inversion
`,
        objectives: [
          'Explain inductive effect and its applications',
          'Describe resonance and hyperconjugation',
          'Predict stability of carbocations, carbanions, and free radicals',
          'Distinguish between electrophiles and nucleophiles',
          'Understand basic reaction mechanisms (SN1, SN2, E1, E2)',
          'Apply electronic effects to predict reactivity',
        ],
        keyTerms: [
          { term: 'Inductive Effect', definition: 'Permanent polarization of σ bonds due to electronegativity differences' },
          { term: 'Resonance', definition: 'Delocalization of π electrons or lone pairs across multiple atoms' },
          { term: 'Carbocation', definition: 'Positively charged carbon species with only 6 electrons (R₃C⁺)' },
          { term: 'Electrophile', definition: 'Electron-deficient species that accepts electron pairs' },
          { term: 'Nucleophile', definition: 'Electron-rich species that donates electron pairs' },
        ],
      },
    },
    {
      id: 'organic-quiz-1',
      title: 'Organic Chemistry Basics Quiz',
      type: 'quiz',
      sequenceOrder: 4,
      data: {
        id: 'organic-quiz-1',
        title: 'Organic Chemistry Basics Quiz',
        description: 'Test your understanding of organic chemistry fundamentals.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'org-q1',
            type: 'mcq',
            question: 'What is the IUPAC name of the following compound? CH₃-CH(CH₃)-CH₂-CH₂-CH₃',
            difficulty: 'medium',
            topic: 'organic',
            options: ['2-Methylpentane', '4-Methylpentane', '2-Methylbutane', 'Isopentane'],
            correctAnswer: 0,
            explanation: 'The IUPAC name is 2-METHYLPENTANE. To name this compound: (1) Identify the longest carbon chain: 5 carbons = pentane. (2) Number from the end that gives the substituent the lowest number. Numbering from left: CH₃ is at position 2. Numbering from right: CH₃ would be at position 4. We choose the left numbering (lower number). (3) The substituent is a methyl group (-CH₃) at position 2. (4) Final name: 2-methylpentane. Note: "Isopentane" is a common name, not IUPAC. The IUPAC system provides systematic, unambiguous names that work for all organic compounds, no matter how complex.',
          },
          {
            id: 'org-q2',
            type: 'mcq',
            question: 'Which pair of compounds represents functional group isomers?',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'Propan-1-ol and propan-2-ol',
              'Ethanol and dimethyl ether',
              'But-1-ene and but-2-ene',
              'n-Butane and isobutane'
            ],
            correctAnswer: 1,
            explanation: 'ETHANOL (CH₃CH₂OH) and DIMETHYL ETHER (CH₃OCH₃) are functional group isomers. Both have the molecular formula C₂H₆O, but they have different functional groups: ethanol has a hydroxyl group (-OH, alcohol) while dimethyl ether has an ether linkage (-O-). This leads to vastly different properties: ethanol is a liquid at room temperature (b.p. 78°C) with hydrogen bonding, while dimethyl ether is a gas (b.p. -25°C) with no hydrogen bonding. Option (a) shows position isomers (same functional group, different position), option (c) shows position isomers of alkenes, and option (d) shows chain isomers (different carbon skeleton). Functional group isomerism is a type of structural isomerism where compounds have the same molecular formula but different functional groups.',
          },
          {
            id: 'org-q3',
            type: 'mcq',
            question: 'For a molecule to show optical isomerism, it must have:',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'A carbon-carbon double bond',
              'A chiral center (carbon with 4 different groups)',
              'A plane of symmetry',
              'A triple bond'
            ],
            correctAnswer: 1,
            explanation: 'For optical isomerism, a molecule must have a CHIRAL CENTER - a carbon atom bonded to FOUR DIFFERENT GROUPS. This creates two non-superimposable mirror image forms (enantiomers), like left and right hands. These enantiomers rotate plane-polarized light in opposite directions: one clockwise (dextrorotatory, +), the other counterclockwise (levorotatory, -). A molecule with a plane of symmetry is achiral and cannot show optical isomerism. Double and triple bonds are not requirements for chirality. Example: 2-chlorobutane (CH₃-CHCl-CH₂-CH₃) has a chiral center at C-2, which is bonded to four different groups: H, Cl, CH₃, and C₂H₅. This creates D and L enantiomers. Optical isomerism is crucial in biochemistry and pharmaceuticals, as different enantiomers can have different biological activities.',
          },
          {
            id: 'org-q4',
            type: 'mcq',
            question: 'The stability order of carbocations is: 3° > 2° > 1° > CH₃⁺. This is primarily due to:',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'Resonance effect only',
              'Inductive effect and hyperconjugation',
              'Steric hindrance',
              'Electronegativity differences'
            ],
            correctAnswer: 1,
            explanation: 'Carbocation stability follows the order 3° > 2° > 1° > CH₃⁺ due to INDUCTIVE EFFECT AND HYPERCONJUGATION. (1) INDUCTIVE EFFECT (+I): Alkyl groups are electron-donating compared to hydrogen. More alkyl groups attached to the positively charged carbon push electron density toward it, stabilizing the positive charge. Tertiary carbocations have 3 alkyl groups, secondary have 2, primary have 1, and methyl has 0. (2) HYPERCONJUGATION: This involves the overlap of C-H or C-C σ bonds with the empty p orbital of the carbocation. More α-hydrogen atoms (hydrogens on carbons adjacent to the positive charge) provide more hyperconjugation and greater stability. Tertiary: 9 α-H, Secondary: 6 α-H, Primary: 3 α-H, Methyl: 0 α-H. Both effects work together to make tertiary carbocations most stable. This explains why SN1 reactions favor tertiary substrates.',
          },
          {
            id: 'org-q5',
            type: 'mcq',
            question: 'Which of the following is the strongest nucleophile?',
            difficulty: 'medium',
            topic: 'organic',
            options: ['H₂O', 'OH⁻', 'NH₃', 'CH₄'],
            correctAnswer: 1,
            explanation: 'OH⁻ (HYDROXIDE ION) is the strongest nucleophile among the given options. A nucleophile is an electron-rich species that donates an electron pair to form a new bond. Nucleophilicity depends on: (1) CHARGE: Negatively charged species are better nucleophiles than neutral ones. OH⁻ has a full negative charge, making it highly nucleophilic. (2) AVAILABILITY OF LONE PAIR: OH⁻ has three lone pairs readily available for donation. H₂O also has lone pairs but is neutral, so it\'s a weaker nucleophile. NH₃ has one lone pair and is neutral, making it moderate. CH₄ has no lone pairs and cannot act as a nucleophile. (3) ELECTRONEGATIVITY: Less electronegative atoms hold electrons less tightly, making them better nucleophiles. The order is: OH⁻ > NH₃ > H₂O >> CH₄. Hydroxide ion is commonly used in substitution reactions (SN2) and elimination reactions.',
          },
          {
            id: 'org-q6',
            type: 'mcq',
            question: 'In an SN2 reaction, the nucleophile attacks the substrate:',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'After the leaving group departs',
              'At the same time as the leaving group departs',
              'Before the leaving group departs',
              'Through a carbocation intermediate'
            ],
            correctAnswer: 1,
            explanation: 'In an SN2 (Substitution Nucleophilic Bimolecular) reaction, the nucleophile attacks AT THE SAME TIME AS THE LEAVING GROUP DEPARTS. This is a CONCERTED, ONE-STEP mechanism with no intermediate. The mechanism: Nu⁻ approaches the substrate from the backside (180° from the leaving group), forming a pentacoordinate transition state [Nu---C---X]‡ where the new bond is forming while the old bond is breaking. This continues until the leaving group fully departs and the nucleophile is fully bonded. Key features: (1) ONE STEP - no carbocation intermediate, (2) Rate depends on both [substrate] and [nucleophile]: Rate = k[R-X][Nu⁻], (3) INVERSION OF CONFIGURATION (Walden inversion) if the carbon is chiral - like flipping an umbrella, (4) Favored by PRIMARY substrates (less steric hindrance), (5) Favored by strong nucleophiles and polar aprotic solvents. Contrast with SN1: two steps, carbocation intermediate, racemization.',
          },
          {
            id: 'org-q7',
            type: 'mcq',
            question: 'Geometrical (cis-trans) isomerism in alkenes requires:',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'A chiral center',
              'Free rotation around C=C bond',
              'Restricted rotation and two different groups on each C of C=C',
              'An aromatic ring'
            ],
            correctAnswer: 2,
            explanation: 'Geometrical isomerism in alkenes requires RESTRICTED ROTATION AROUND THE C=C DOUBLE BOND AND TWO DIFFERENT GROUPS ON EACH CARBON OF THE DOUBLE BOND. The C=C double bond consists of a σ bond and a π bond. The π bond (formed by sideways overlap of p orbitals) prevents rotation because rotation would break the π bond (requires ~260 kJ/mol). This locks the groups in fixed positions, allowing cis and trans isomers. Requirements: (1) Each carbon of C=C must have 2 different groups. If either carbon has two identical groups (like CH₂=CH-CH₃), cis-trans isomerism is NOT possible. (2) Example: But-2-ene (CH₃-CH=CH-CH₃) can exist as cis (both CH₃ on same side) and trans (CH₃ on opposite sides). These isomers have different properties: cis-but-2-ene (b.p. 3.7°C) vs. trans-but-2-ene (b.p. 0.9°C). This is NOT the same as optical isomerism, which requires a chiral center.',
          },
          {
            id: 'org-q8',
            type: 'mcq',
            question: 'The -NO₂ group shows which type of electronic effect?',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              '+I and +R (electron donating)',
              '-I and -R (electron withdrawing)',
              '+I and -R',
              '-I and +R'
            ],
            correctAnswer: 1,
            explanation: 'The nitro group (-NO₂) shows BOTH -I AND -R EFFECTS (electron withdrawing). (1) -I EFFECT: Nitrogen and oxygen are highly electronegative, pulling electron density through σ bonds. This makes adjacent atoms electron-deficient. (2) -R EFFECT (Resonance): The NO₂ group has a π system that withdraws electron density through resonance. In nitrobenzene (C₆H₅NO₂), the π electrons from the benzene ring are pulled into the NO₂ group through resonance structures. Result: The -NO₂ group DEACTIVATES aromatic rings toward electrophilic substitution and is a META-DIRECTOR. It also increases the acidity of compounds. Compare: Benzoic acid (C₆H₅COOH) is more acidic than p-nitrobenzoic acid (O₂N-C₆H₄-COOH) because the -NO₂ group further stabilizes the carboxylate anion (COO⁻) through its electron-withdrawing effects. Other -I, -R groups: -CN, -CHO, -COCH₃, -COOH. Groups with +R effect: -OH, -NH₂, -OR (donate electrons through resonance).',
          },
        ],
      },
    },
  ],
};
