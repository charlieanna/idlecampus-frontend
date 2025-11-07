/**
 * Module 12: Hydrocarbons
 */

import type { ChemistryModule } from '../../types';

export const hydrocarbonsModule: ChemistryModule = {
  id: 'class11-hydrocarbons',
  slug: 'hydrocarbons',
  title: 'Hydrocarbons',
  description: 'Study alkanes, alkenes, alkynes, and aromatic hydrocarbons with their reactions.',
  icon: 'flame-kindling',
  sequenceOrder: 12,
  estimatedHours: 18,
  topic: 'organic',
  difficulty: 'hard',
  prerequisites: ['class11-organic-basics'],
  learningOutcomes: [
    'Classify and name hydrocarbons',
    'Understand alkane conformations and reactions',
    'Explain alkene reactions (addition, Markovnikov\'s rule)',
    'Understand alkyne acidity and reactions',
    'Describe aromaticity and Hückel\'s rule',
    'Explain electrophilic aromatic substitution',
    'Understand benzene structure and resonance',
  ],
  items: [
    {
      id: 'hc-lesson-1',
      title: 'Alkanes: Saturated Hydrocarbons',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'hc-lesson-1',
        title: 'Alkanes: Saturated Hydrocarbons',
        sequenceOrder: 1,
        estimatedMinutes: 50,
        content: `
# Alkanes: Saturated Hydrocarbons

## What are Alkanes?

**Alkanes**: Saturated hydrocarbons with only single C-C and C-H bonds

**General formula**: CₙH₂ₙ₊₂

**Saturation**: All carbon atoms are sp³ hybridized (tetrahedral, 109.5°)

**Examples**:
- CH₄ (methane)
- C₂H₆ (ethane)
- C₃H₈ (propane)
- C₄H₁₀ (butane)

## Physical Properties

### State
- **C₁-C₄**: Gases at room temperature
- **C₅-C₁₇**: Liquids
- **C₁₈+**: Solids (waxy)

### Trends with Chain Length

| Property | Trend | Reason |
|----------|-------|--------|
| **Boiling point** | Increases | Stronger van der Waals forces |
| **Melting point** | Increases | Larger molecular surface area |
| **Density** | Increases | Heavier molecules |
| **Viscosity** | Increases | Larger molecules, more entanglement |

**Branching effect**: Branched alkanes have lower boiling points (less surface contact)

**Example**: n-pentane (b.p. 36°C) vs. neopentane (b.p. 10°C)

### Solubility
- **Insoluble in water** (non-polar)
- **Soluble in non-polar solvents** (benzene, CCl₄)

## Nomenclature

Already covered in previous module, but quick review:

**Simple alkanes**:
- Meth- (1C), Eth- (2C), Prop- (3C), But- (4C), Pent- (5C), Hex- (6C)
- Suffix: -ane

**Branched alkanes**:
1. Find longest chain
2. Number to give lowest numbers to branches
3. Name branches with position numbers
4. Alphabetical order for multiple different branches

## Conformations of Alkanes

**Conformation**: Different spatial arrangements due to rotation around single bonds

**Important**: Conformations are NOT isomers (can interconvert by rotation)

### Ethane (C₂H₆)

Rotation around C-C single bond creates different conformations:

**1. Staggered Conformation**
- H atoms on adjacent carbons are as far apart as possible
- **Most stable** (lowest energy)
- Dihedral angle: 60°

**2. Eclipsed Conformation**
- H atoms on adjacent carbons are aligned
- **Least stable** (highest energy)
- Dihedral angle: 0°
- **Torsional strain** (electron repulsion)

**Energy difference**: ~12 kJ/mol

**Note**: At room temperature, rapid rotation occurs (millions of times per second)

### Butane (C₄H₁₀)

More complex conformations:

**1. Anti (staggered)**:
- CH₃ groups 180° apart
- **Most stable**

**2. Gauche (staggered)**:
- CH₃ groups 60° apart
- Less stable than anti (steric strain between CH₃ groups)
- **Steric strain**: ~3.8 kJ/mol

**3. Eclipsed**:
- CH₃ groups aligned
- **Least stable**

**Stability order**: Anti > Gauche > Eclipsed

## Preparation of Alkanes

### 1. From Alkenes (Hydrogenation)

$$\\ce{R-CH=CH-R + H2 ->[Ni, Pt, or Pd] R-CH2-CH2-R}$$

**Example**:
$$\\ce{CH2=CH2 + H2 ->[Ni] CH3-CH3}$$

**Catalysts**: Ni, Pt, or Pd (finely divided)

### 2. From Alkynes (Reduction)

$$\\ce{R-C≡C-R + 2H2 ->[Ni] R-CH2-CH2-R}$$

### 3. Wurtz Reaction

Alkyl halides + Sodium metal in dry ether:

$$\\ce{2R-X + 2Na ->[Dry ether] R-R + 2NaX}$$

**Example**:
$$\\ce{2CH3-Cl + 2Na -> CH3-CH3 + 2NaCl}$$

**Limitation**: Only gives symmetrical alkanes

### 4. Kolbe's Electrolysis

Electrolysis of sodium/potassium salts of carboxylic acids:

$$\\ce{2RCOO^- Na+ ->[Electrolysis] R-R + 2CO2 + 2Na+ + 2e^-}$$

**Example**:
$$\\ce{2CH3COO^-Na+ -> CH3-CH3 + 2CO2 + 2Na+}$$

At anode, decarboxylation occurs

## Chemical Reactions

### 1. Combustion

Complete combustion (excess O₂):
$$\\ce{CnH2n+2 + (3n+1)/2 O2 -> nCO2 + (n+1)H2O}$$ + Heat

**Example** (methane):
$$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$$ ΔH = -890 kJ/mol

**Uses**: Fuel (natural gas = mostly CH₄)

Incomplete combustion (limited O₂):
$$\\ce{CH4 + O2 -> C + CO + H2O}$$ (soot, carbon monoxide)

**Danger**: CO is toxic!

### 2. Halogenation (Free Radical Substitution)

Alkanes react with halogens (Cl₂, Br₂) in presence of UV light or heat:

$$\\ce{R-H + X2 ->[UV light] R-X + HX}$$

**Example** (chlorination of methane):
$$\\ce{CH4 + Cl2 ->[UV] CH3Cl + HCl}$$

**Mechanism**: Free radical chain reaction

**Step 1 - Initiation**: Homolytic fission of Cl-Cl bond
$$\\ce{Cl2 ->[UV] 2Cl•}$$

**Step 2 - Propagation** (chain):
$$\\ce{CH4 + Cl• -> CH3• + HCl}$$
$$\\ce{CH3• + Cl2 -> CH3Cl + Cl•}$$

**Step 3 - Termination**:
$$\\ce{CH3• + Cl• -> CH3Cl}$$
$$\\ce{CH3• + CH3• -> C2H6}$$
$$\\ce{Cl• + Cl• -> Cl2}$$

**Reactivity**: F₂ > Cl₂ > Br₂ >> I₂
- F₂: Too reactive (explosive)
- Cl₂: Moderate, commonly used
- Br₂: Slow, requires high temperature
- I₂: Virtually no reaction

**Selectivity**: I₂ > Br₂ > Cl₂ > F₂
- More reactive = less selective

**Multiple substitution**: Cl₂ can replace multiple H atoms:
$$\\ce{CH4 ->[Cl2] CH3Cl ->[Cl2] CH2Cl2 ->[Cl2] CHCl3 ->[Cl2] CCl4}$$

**Problem**: Mixture of products

### 3. Cracking (Pyrolysis)

Breaking large alkanes into smaller ones at high temperature:

$$\\ce{C10H22 ->[Heat] C5H12 + C5H10}$$

**Used in**: Petroleum refining to produce gasoline from heavy oil

### 4. Isomerization

Straight-chain → branched-chain (in presence of AlCl₃ catalyst)

$$\\ce{n-Butane ->[AlCl3] Isobutane}$$

**Purpose**: Branched alkanes have higher octane ratings (better fuel)

### 5. Oxidation

**Controlled oxidation** (limited O₂, catalyst):
Produces alcohols, aldehydes, carboxylic acids

$$\\ce{2CH4 + O2 ->[Cu, 200°C] 2CH3OH}$$

**Complete oxidation**: See combustion above

## Isomerism in Alkanes

Alkanes show **chain isomerism**

**Example - C₄H₁₀** (2 isomers):
1. n-Butane: CH₃-CH₂-CH₂-CH₃
2. Isobutane: CH₃-CH(CH₃)-CH₃

**Example - C₅H₁₂** (3 isomers):
1. n-Pentane: CH₃-CH₂-CH₂-CH₂-CH₃
2. Isopentane: CH₃-CH(CH₃)-CH₂-CH₃
3. Neopentane: C(CH₃)₄

**Number of isomers increases rapidly** with carbon atoms:
- C₆H₁₄: 5 isomers
- C₁₀H₂₂: 75 isomers
- C₂₀H₄₂: 366,319 isomers!

## Uses of Alkanes

1. **Fuel**: Natural gas (CH₄), LPG (C₃H₈, C₄H₁₀), gasoline, diesel
2. **Cooking**: LPG (propane, butane)
3. **Heating**: Natural gas
4. **Solvents**: Hexane, heptane (non-polar)
5. **Lubricants**: Heavy alkanes (oils, greases)
6. **Wax**: Long-chain alkanes (candles, polishes)
7. **Petrochemicals**: Starting materials for plastics, synthetic fibers

## Key Takeaways

1. **Alkanes**: CₙH₂ₙ₊₂, saturated, sp³ hybridized
2. **Physical properties**: B.p. increases with chain length, branching decreases b.p.
3. **Conformations**: Staggered (stable) vs. eclipsed (unstable)
4. **Preparation**: Hydrogenation of alkenes, Wurtz reaction, Kolbe's electrolysis
5. **Combustion**: Complete → CO₂ + H₂O; Incomplete → CO (toxic)
6. **Halogenation**: Free radical mechanism (initiation, propagation, termination)
7. **Reactivity of halogens**: F₂ > Cl₂ > Br₂ >> I₂
8. **Selectivity**: Opposite of reactivity
9. **Chain isomerism**: Number of isomers increases rapidly with carbon atoms
`,
        objectives: [
          'Describe properties and nomenclature of alkanes',
          'Explain conformations (staggered, eclipsed, anti, gauche)',
          'Describe preparation methods for alkanes',
          'Explain combustion and halogenation reactions',
          'Understand free radical mechanism of halogenation',
          'Identify chain isomers of alkanes',
        ],
        keyTerms: [
          { term: 'Alkanes', definition: 'Saturated hydrocarbons with general formula CₙH₂ₙ₊₂' },
          { term: 'Conformation', definition: 'Different spatial arrangements due to rotation around single bonds' },
          { term: 'Free Radical', definition: 'Species with an unpaired electron, highly reactive' },
          { term: 'Halogenation', definition: 'Replacement of H atom with halogen (Cl, Br) via free radical mechanism' },
        ],
      },
    },
    {
      id: 'hc-lesson-2',
      title: 'Alkenes and Alkynes: Unsaturated Hydrocarbons',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'hc-lesson-2',
        title: 'Alkenes and Alkynes: Unsaturated Hydrocarbons',
        sequenceOrder: 2,
        estimatedMinutes: 50,
        content: `
# Alkenes and Alkynes: Unsaturated Hydrocarbons

## Alkenes

### What are Alkenes?

**Alkenes**: Unsaturated hydrocarbons with at least one C=C double bond

**General formula**: CₙH₂ₙ (for one double bond)

**Hybridization**: sp² (trigonal planar, 120°)

**Examples**:
- C₂H₄ (ethene)
- C₃H₆ (propene)
- C₄H₈ (butenes)

### Structure of Double Bond

**C=C consists of**:
- **1 σ bond**: sp² - sp² overlap (stronger)
- **1 π bond**: p - p sideways overlap (weaker)

**Bond length**: C=C (134 pm) < C-C (154 pm)

**Bond energy**: C=C (614 kJ/mol) > C-C (348 kJ/mol)
But π bond is weaker than σ bond

**Rotation**: NOT possible around C=C (π bond prevents it)
→ Leads to **geometrical isomerism** (cis-trans)

### Stability of Alkenes

More substituted alkenes are more stable:

**Stability order**:
$$\\ce{R2C=CR2 > R2C=CHR > R2C=CH2 > RCH=CHR > RCH=CH2 > CH2=CH2}$$

Tetra > Tri > Di > Mono-substituted

**Reasons**:
1. **Hyperconjugation**: More α-H atoms → more stability
2. **+I effect**: Alkyl groups donate electrons → stabilize π bond

### Isomerism in Alkenes

**1. Chain isomerism**
**2. Position isomerism** (position of double bond)
**3. Geometrical isomerism** (cis-trans)

**Example - C₄H₈**:
- But-1-ene: CH₂=CH-CH₂-CH₃ (position isomer)
- But-2-ene: CH₃-CH=CH-CH₃ (has cis/trans isomers)
- 2-Methylpropene: (CH₃)₂C=CH₂ (chain isomer)

### Preparation of Alkenes

**1. Dehydration of Alcohols**

$$\\ce{R-CH2-CH2-OH ->[Conc. H2SO4, 443K] R-CH=CH2 + H2O}$$

**Example**:
$$\\ce{CH3-CH2-OH ->[H2SO4, heat] CH2=CH2 + H2O}$$

**Ease**: 3° > 2° > 1° alcohol (follows carbocation stability)

**2. Dehydrohalogenation of Alkyl Halides**

$$\\ce{R-CH2-CH2-X ->[Alc. KOH] R-CH=CH2 + HX}$$

**Example**:
$$\\ce{CH3-CH2-Br ->[Alc. KOH] CH2=CH2 + HBr}$$

**Mechanism**: E2 (elimination, bimolecular)

**Saytzeff's Rule**: When multiple alkenes possible, major product is the more substituted (more stable) alkene

**Example**:
$$\\ce{CH3-CH2-CH(Br)-CH3 ->[Alc. KOH] CH3-CH=CH-CH3 (major) + CH2=CH-CH2-CH3 (minor)}$$

More substituted alkene is favored

### Reactions of Alkenes

**General**: Addition reactions (π bond breaks, two new σ bonds form)

**1. Hydrogenation (Addition of H₂)**

$$\\ce{R-CH=CH2 + H2 ->[Ni, Pt, or Pd] R-CH2-CH3}$$

**Example**:
$$\\ce{CH2=CH2 + H2 ->[Ni] CH3-CH3}$$

**Reaction type**: Catalytic hydrogenation (syn addition - both H on same side)

**2. Halogenation (Addition of X₂)**

$$\\ce{R-CH=CH2 + X2 -> R-CHX-CH2X}$$

**Example**:
$$\\ce{CH2=CH2 + Br2 -> CH2Br-CH2Br}$$

**Test for unsaturation**: Br₂ decolorizes (reddish-brown → colorless)

**Mechanism**: Electrophilic addition via bromonium ion intermediate

**3. Addition of Hydrogen Halides (HX)**

$$\\ce{R-CH=CH2 + HX -> R-CHX-CH3}$$

**Example**:
$$\\ce{CH2=CH2 + HCl -> CH3-CH2Cl}$$

**Markovnikov's Rule**: In addition of HX to unsymmetrical alkene, H goes to carbon with more H atoms (or X goes to more substituted carbon)

**Example**:
$$\\ce{CH3-CH=CH2 + HBr -> CH3-CHBr-CH3}$$ (major, 2° carbocation)
Not CH₃-CH₂-CH₂Br (minor, 1° carbocation)

**Explanation**: More substituted carbocation intermediate is more stable

**Anti-Markovnikov Addition** (Peroxide effect):
In presence of peroxide (ROOR), HBr adds opposite to Markovnikov

$$\\ce{CH3-CH=CH2 + HBr ->[ROOR] CH3-CH2-CH2Br}$$

**Mechanism**: Free radical (Br• attacks less substituted carbon)

**Note**: Only works with HBr, not HCl or HI

**4. Hydration (Addition of H₂O)**

$$\\ce{R-CH=CH2 + H2O ->[H+] R-CH(OH)-CH3}$$

**Follows Markovnikov's rule**: OH goes to more substituted carbon

**Example**:
$$\\ce{CH3-CH=CH2 + H2O ->[H+] CH3-CH(OH)-CH3}$$ (propan-2-ol)

**5. Oxidation**

**a) Mild oxidation (KMnO₄, cold, dilute)**:
$$\\ce{R-CH=CH2 + [O] + H2O -> R-CH(OH)-CH2(OH)}$$ (glycol)

**Test for unsaturation**: Purple KMnO₄ decolorizes

**b) Ozonolysis**:
$$\\ce{R-CH=CH-R ->[O3][Zn, H2O] R-CHO + R-CHO}$$ (aldehydes or ketones)

Used to determine position of double bond

**6. Polymerization**

Many alkene molecules join to form polymer:

$$\\ce{nCH2=CH2 -> (-CH2-CH2-)_n}$$ (polyethylene)

**Examples**:
- Polyethylene (PE): From ethene
- Polypropylene (PP): From propene
- PVC: From vinyl chloride (CH₂=CHCl)
- Teflon: From tetrafluoroethylene (CF₂=CF₂)

## Alkynes

### What are Alkynes?

**Alkynes**: Unsaturated hydrocarbons with at least one C≡C triple bond

**General formula**: CₙH₂ₙ₋₂ (for one triple bond)

**Hybridization**: sp (linear, 180°)

**Examples**:
- C₂H₂ (ethyne, acetylene)
- C₃H₄ (propyne)
- C₄H₆ (butynes)

### Structure of Triple Bond

**C≡C consists of**:
- **1 σ bond**: sp - sp overlap
- **2 π bonds**: Two p - p sideways overlaps (perpendicular to each other)

**Bond length**: C≡C (120 pm) < C=C (134 pm) < C-C (154 pm)

**Bond energy**: C≡C (839 kJ/mol) > C=C (614 kJ/mol) > C-C (348 kJ/mol)

### Acidity of Alkynes

**Terminal alkynes** (R-C≡C-H) are **weakly acidic**

$$\\ce{R-C≡C-H + NaNH2 -> R-C≡C^- Na+ + NH3}$$

**Reason**: sp hybridized carbon has 50% s-character (vs. 25% in sp³)
- Electrons held closer to nucleus
- C-H bond more polar
- H⁺ can be removed

**Comparison**:
- **RC≡CH** (pKₐ ~ 25): Weakly acidic
- **RCH=CH₂** (pKₐ ~ 44): Not acidic
- **RCH₂-CH₃** (pKₐ ~ 50): Not acidic

Terminal alkynes can form **acetylide ions** (R-C≡C⁻), useful in synthesis

### Preparation of Alkynes

**1. From Calcium Carbide**

$$\\ce{CaC2 + 2H2O -> HC≡CH + Ca(OH)2}$$

**Industrial method** for acetylene

**2. From Alkyl Dihalides**

$$\\ce{R-CHBr-CHBr-R ->[Alc. KOH, heat] R-C≡C-R + 2HBr}$$

Double dehydrohalogenation

### Reactions of Alkynes

**1. Hydrogenation**

**Complete reduction** (excess H₂):
$$\\ce{R-C≡C-R + 2H2 ->[Ni] R-CH2-CH2-R}$$

**Partial reduction** (limited H₂, Lindlar's catalyst):
$$\\ce{R-C≡C-R + H2 ->[Lindlar] R-CH=CH-R}$$ (cis-alkene)

**2. Halogenation**

$$\\ce{R-C≡C-R + 2X2 -> R-CX2-CX2-R}$$

Two moles of halogen add

**3. Addition of HX**

$$\\ce{R-C≡C-H + HX -> R-CX=CH2}$$

**Follows Markovnikov's rule**

With excess HX:
$$\\ce{R-C≡C-H + 2HX -> R-CX2-CH3}$$

**4. Hydration**

$$\\ce{R-C≡C-H + H2O ->[H2SO4, HgSO4] R-CO-CH3}$$ (ketone)

**Keto-enol tautomerism**: Enol (unstable) → Keto (stable)

**Exception**: Ethyne gives ethanal (aldehyde)
$$\\ce{HC≡CH + H2O ->[H+, Hg^2+] CH3-CHO}$$

**5. Polymerization**

**Ethyne** (acetylene) polymerizes to:
- **Benzene**: 3HC≡CH → C₆H₆ (cyclic trimer)
- **Polyacetylene**: Conducting polymer

## Key Takeaways

### Alkenes
1. **CₙH₂ₙ**, sp² hybridized, planar at C=C
2. **Stability**: More substituted > less substituted (hyperconjugation)
3. **Preparation**: Dehydration of alcohols, dehydrohalogenation of alkyl halides
4. **Reactions**: Addition (H₂, X₂, HX, H₂O), polymerization
5. **Markovnikov's rule**: H to carbon with more H (X to more substituted C)
6. **Anti-Markovnikov**: With HBr + peroxide (free radical)

### Alkynes
1. **CₙH₂ₙ₋₂**, sp hybridized, linear
2. **Terminal alkynes**: Weakly acidic (form acetylide ions)
3. **Reactions**: Addition (partial and complete), hydration → ketones
4. **Lindlar's catalyst**: Partial reduction to cis-alkene
`,
        objectives: [
          'Describe structure and properties of alkenes',
          'Explain stability order of alkenes',
          'Apply Markovnikov\'s rule to addition reactions',
          'Describe preparation and reactions of alkenes',
          'Explain acidity of terminal alkynes',
          'Describe reactions of alkynes',
        ],
        keyTerms: [
          { term: 'Alkene', definition: 'Unsaturated hydrocarbon with C=C double bond (CₙH₂ₙ)' },
          { term: 'Alkyne', definition: 'Unsaturated hydrocarbon with C≡C triple bond (CₙH₂ₙ₋₂)' },
          { term: "Markovnikov's Rule", definition: 'In addition of HX to unsymmetrical alkene, H adds to carbon with more H atoms' },
          { term: 'Acetylide Ion', definition: 'Anion formed from terminal alkyne (R-C≡C⁻), useful in synthesis' },
        ],
      },
    },
    {
      id: 'hc-lesson-3',
      title: 'Aromatic Hydrocarbons: Benzene and Aromaticity',
      type: 'lesson',
      sequenceOrder: 3,
      data: {
        id: 'hc-lesson-3',
        title: 'Aromatic Hydrocarbons: Benzene and Aromaticity',
        sequenceOrder: 3,
        estimatedMinutes: 50,
        content: `
# Aromatic Hydrocarbons: Benzene and Aromaticity

## Benzene (C₆H₆)

### History and Structure

**Discovery**: Michael Faraday (1825)

**Molecular formula**: C₆H₆

**Early problem**: How can a molecule with 6 C and 6 H (suggesting unsaturation) be so stable?

**Kekulé structure** (1865): Proposed alternating single and double bonds in hexagon

```
    H       H
     \\     /
      C=C
     /     \\
H-C         C-H
    \\     /
     C=C
    /     \\
   H       H
```

But this suggests two different bond lengths, which is NOT observed!

### Modern Structure

**Reality**: All C-C bonds in benzene are identical
- **Bond length**: 139 pm (between C-C (154 pm) and C=C (134 pm))
- **Bond angle**: 120° (sp² hybridized)
- **Planar hexagonal structure**

**Resonance**: Benzene is a resonance hybrid of two Kekulé structures

```
      ⇌
   /=\\     /=\\
  |   |   |   |
   \\=/     \\=/
```

**Actual structure**: Delocalized π electrons above and below the plane

**Representation**: Circle inside hexagon (shows delocalization)

### Stability of Benzene

**Resonance energy**: ~150 kJ/mol

**Evidence**: Heat of hydrogenation

**Predicted** (for 3 double bonds): 3 × (-120) = -360 kJ/mol
**Observed**: -208 kJ/mol
**Difference**: 152 kJ/mol (extra stability)

**Result**: Benzene is much more stable than expected
- Does NOT undergo typical alkene addition reactions
- Prefers **substitution** (maintains aromaticity)

## Aromaticity

### Hückel's Rule

A planar, cyclic, fully conjugated system is **aromatic** if it has **(4n + 2) π electrons** where n = 0, 1, 2, 3...

**Aromatic number of π electrons**: 2, 6, 10, 14, 18...

**Criteria for aromaticity**:
1. **Cyclic** structure
2. **Planar** (for p-orbital overlap)
3. **Conjugated** (alternating single and double bonds, or lone pairs)
4. **(4n + 2) π electrons**

### Examples

**Aromatic** (4n + 2):
- **Benzene (C₆H₆)**: 6 π electrons (n=1) ✓
- **Cyclopentadienyl anion (C₅H₅⁻)**: 6 π electrons (n=1) ✓
- **Tropylium cation (C₇H₇⁺)**: 6 π electrons (n=1) ✓
- **Naphthalene (C₁₀H₈)**: 10 π electrons (n=2) ✓
- **Pyridine (C₅H₅N)**: 6 π electrons (n=1) ✓

**Anti-aromatic** (4n):
- **Cyclobutadiene (C₄H₄)**: 4 π electrons (n=1) - highly unstable
- **Cyclooctatetraene (C₈H₈)**: Would be 8 π e⁻, but NOT planar (avoids anti-aromaticity)

**Non-aromatic**:
- Cyclohexene: Not fully conjugated
- Cyclohexane: No π electrons

## Nomenclature of Aromatic Compounds

### Simple Benzene Derivatives

**Monosubstituted**:
- **Benzene prefix**: Methylbenzene, chlorobenzene
- **Common names**: Toluene (C₆H₅CH₃), aniline (C₆H₅NH₂), phenol (C₆H₅OH)

**Disubstituted** (positions):
- **Ortho (o-)**: 1,2- positions (adjacent)
- **Meta (m-)**: 1,3- positions (one carbon between)
- **Para (p-)**: 1,4- positions (opposite)

**Example**: C₆H₄(CH₃)₂
- 1,2-dimethylbenzene (o-xylene)
- 1,3-dimethylbenzene (m-xylene)
- 1,4-dimethylbenzene (p-xylene)

**Polysubstituted**: Number to give lowest numbers

## Electrophilic Aromatic Substitution

**General mechanism**: Aromatic ring (nucleophile) attacks electrophile

**Key**: Substitution (not addition) to maintain aromaticity

### 1. Halogenation

$$\\ce{C6H6 + X2 ->[FeCl3 or FeBr3] C6H5X + HX}$$

**Example**:
$$\\ce{C6H6 + Cl2 ->[FeCl3] C6H5Cl + HCl}$$ (chlorobenzene)

**Mechanism**:
1. Generation of electrophile: Cl₂ + FeCl₃ → Cl⁺ + FeCl₄⁻
2. Electrophilic attack on benzene ring
3. Loss of H⁺ to restore aromaticity

**Catalyst**: FeCl₃ (Lewis acid) generates electrophile (Cl⁺)

### 2. Nitration

$$\\ce{C6H6 + HNO3 ->[Conc. H2SO4] C6H5NO2 + H2O}$$

**Electrophile**: NO₂⁺ (nitronium ion)

**Generation**: HNO₃ + 2H₂SO₄ → NO₂⁺ + H₃O⁺ + 2HSO₄⁻

**Product**: Nitrobenzene (C₆H₅NO₂)

**Uses**: Synthesis of aniline, dyes, explosives

### 3. Sulfonation

$$\\ce{C6H6 + H2SO4 ->[Fuming H2SO4] C6H5SO3H + H2O}$$

**Electrophile**: SO₃ (sulfur trioxide)

**Product**: Benzenesulfonic acid

**Reversible reaction** (can be reversed by heating with dilute acid)

### 4. Friedel-Crafts Alkylation

$$\\ce{C6H6 + R-Cl ->[AlCl3] C6H5-R + HCl}$$

**Example**:
$$\\ce{C6H6 + CH3Cl ->[AlCl3] C6H5CH3 + HCl}$$ (toluene)

**Electrophile**: R⁺ (carbocation)

**Generation**: R-Cl + AlCl₃ → R⁺ + AlCl₄⁻

**Limitation**: Can undergo rearrangement (via carbocation), polyalkylation

### 5. Friedel-Crafts Acylation

$$\\ce{C6H6 + R-COCl ->[AlCl3] C6H5-CO-R + HCl}$$

**Example**:
$$\\ce{C6H6 + CH3COCl ->[AlCl3] C6H5COCH3 + HCl}$$ (acetophenone)

**Electrophile**: RCO⁺ (acylium ion)

**Advantage**: No rearrangement, no polyacylation (product deactivated)

## Directing Effects in Substituted Benzenes

### Activating Groups (increase reactivity)

**Ortho/Para directors**:
- -OH, -OR (alkoxy)
- -NH₂, -NHR, -NR₂ (amino)
- -R (alkyl)
- -NHCOCH₃

**Reason**: +R effect (donate electrons through resonance) or +I effect

**Example**: Phenol (C₆H₅OH) is more reactive than benzene
Second substitution goes to ortho or para position

### Deactivating Groups (decrease reactivity)

**Meta directors**:
- -NO₂ (nitro)
- -CN (cyano)
- -CHO (aldehyde)
- -COOH (carboxylic acid)
- -COR (ketone)
- -SO₃H (sulfonic acid)

**Reason**: -I and -R effects (withdraw electrons)

**Exception**: Halogens (-F, -Cl, -Br, -I)
- **Deactivating** (via -I effect)
- But **ortho/para directing** (via +R effect with lone pairs)

**Example**: Nitrobenzene (C₆H₅NO₂) is less reactive than benzene
Second substitution goes to meta position

## Reactions of Side Chains

### Oxidation of Alkyl Side Chain

Alkyl groups on benzene are oxidized to -COOH:

$$\\ce{C6H5-CH3 ->[KMnO4, heat] C6H5-COOH + H2O}$$ (benzoic acid)

Works for any length alkyl group (CH₃, C₂H₅, etc.)

**Requirement**: At least one benzylic H (α to ring)

### Halogenation of Side Chain

In presence of light or heat:

$$\\ce{C6H5-CH3 + Cl2 ->[UV light] C6H5-CH2Cl + HCl}$$ (benzyl chloride)

**Mechanism**: Free radical (like alkane halogenation)

**Benzylic position**: Most reactive (benzylic radical is resonance-stabilized)

## Uses of Aromatic Compounds

1. **Benzene**: Solvent, starting material for plastics, dyes, drugs
2. **Toluene**: Solvent, TNT (trinitrotoluene - explosive)
3. **Xylenes**: Solvents, polyester production (PET bottles)
4. **Styrene**: Polystyrene plastic, Styrofoam
5. **Aniline**: Dyes, pharmaceuticals
6. **Phenol**: Plastics (Bakelite), disinfectants, aspirin

## Key Takeaways

1. **Benzene**: C₆H₆, planar hexagon, delocalized π electrons
2. **Resonance energy**: ~150 kJ/mol extra stability
3. **Hückel's rule**: Aromatic if (4n+2) π electrons, cyclic, planar, conjugated
4. **Electrophilic aromatic substitution**: Cl₂ (halogenation), HNO₃ (nitration), H₂SO₄ (sulfonation), R-Cl (alkylation), RCOCl (acylation)
5. **Activating groups**: ortho/para directors (+R or +I)
6. **Deactivating groups**: meta directors (-I and -R)
7. **Halogens**: Deactivating but ortho/para directing
8. **Side chain oxidation**: Alkyl → COOH (with KMnO₄)
`,
        objectives: [
          'Describe structure and stability of benzene',
          'Apply Hückel\'s rule to determine aromaticity',
          'Explain electrophilic aromatic substitution reactions',
          'Predict directing effects of substituents',
          'Distinguish between activating and deactivating groups',
          'Describe reactions of side chains on aromatic rings',
        ],
        keyTerms: [
          { term: 'Aromaticity', definition: 'Special stability of cyclic, planar, conjugated systems with (4n+2) π electrons' },
          { term: "Hückel's Rule", definition: 'Aromatic compounds have (4n+2) π electrons where n = 0, 1, 2, 3...' },
          { term: 'Electrophilic Aromatic Substitution', definition: 'Reaction where electrophile replaces H on aromatic ring' },
          { term: 'Ortho/Para Director', definition: 'Substituent that directs incoming group to ortho (1,2) or para (1,4) positions' },
          { term: 'Meta Director', definition: 'Substituent that directs incoming group to meta (1,3) position' },
        ],
      },
    },
    {
      id: 'hc-quiz-1',
      title: 'Hydrocarbons Quiz',
      type: 'quiz',
      sequenceOrder: 4,
      data: {
        id: 'hc-quiz-1',
        title: 'Hydrocarbons Quiz',
        description: 'Test your understanding of alkanes, alkenes, alkynes, and aromatic hydrocarbons.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'hard',
        questions: [
          {
            id: 'hc-q1',
            type: 'mcq',
            question: 'Which conformation of butane is the most stable?',
            difficulty: 'medium',
            topic: 'organic',
            options: ['Eclipsed', 'Gauche', 'Anti', 'All are equally stable'],
            correctAnswer: 2,
            explanation: 'The ANTI conformation of butane is the MOST STABLE. In butane (CH₃-CH₂-CH₂-CH₃), rotation around the central C-C bond creates different conformations. The anti conformation has the two methyl (CH₃) groups 180° apart (opposite sides), minimizing steric repulsion between these bulky groups. The gauche conformation has the CH₃ groups 60° apart, creating steric strain (~3.8 kJ/mol higher energy). The eclipsed conformation has the CH₃ groups aligned (0° or 120°), creating both torsional strain and severe steric strain (highest energy). Energy order: Anti (most stable) < Gauche < Eclipsed (least stable). At room temperature, rapid rotation occurs, but the molecule spends most time in the anti conformation. This concept is crucial for understanding conformational analysis in larger molecules.',
          },
          {
            id: 'hc-q2',
            type: 'mcq',
            question: 'The mechanism of chlorination of methane involves:',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'Electrophilic substitution',
              'Nucleophilic substitution',
              'Free radical substitution',
              'Electrophilic addition'
            ],
            correctAnswer: 2,
            explanation: 'Chlorination of methane proceeds via a FREE RADICAL SUBSTITUTION mechanism. The reaction (CH₄ + Cl₂ → CH₃Cl + HCl) requires UV light or heat to initiate. The mechanism has three stages: (1) INITIATION: Cl₂ undergoes homolytic fission under UV light: Cl₂ → 2Cl• (chlorine radicals). (2) PROPAGATION: Chain reaction where radicals are consumed and regenerated: CH₄ + Cl• → CH₃• + HCl, then CH₃• + Cl₂ → CH₃Cl + Cl•. (3) TERMINATION: Radicals combine: Cl• + Cl• → Cl₂, CH₃• + Cl• → CH₃Cl, CH₃• + CH₃• → C₂H₆. The reaction is NOT electrophilic or nucleophilic because both Cl₂ and CH₄ are non-polar and not charged. Free radical mechanisms are characterized by homolytic bond cleavage (each atom gets one electron), formation of highly reactive species with unpaired electrons, and chain reactions.',
          },
          {
            id: 'hc-q3',
            type: 'mcq',
            question: 'According to Markovnikov\'s rule, the addition of HBr to propene (CH₃-CH=CH₂) gives:',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'CH₃-CH₂-CH₂Br (1-bromopropane)',
              'CH₃-CHBr-CH₃ (2-bromopropane)',
              'Equal mixture of both',
              'No reaction occurs'
            ],
            correctAnswer: 1,
            explanation: 'According to Markovnikov\'s rule, the MAJOR product is CH₃-CHBr-CH₃ (2-BROMOPROPANE). Markovnikov\'s rule states: "In the addition of HX to an unsymmetrical alkene, the hydrogen atom adds to the carbon with more hydrogen atoms already attached (or the halogen adds to the more substituted carbon)." In propene (CH₃-CH=CH₂), the double bond carbons are different: C1 has 2 H atoms, C2 has 1 H atom. Following the rule, H adds to C1 (which has more H), and Br adds to C2, giving CH₃-CHBr-CH₃. MECHANISM: The reaction proceeds through a carbocation intermediate. H⁺ adds first, forming the more stable carbocation. Adding H⁺ to C1 creates a 2° carbocation at C2 (more stable), while adding to C2 would create a 1° carbocation at C1 (less stable). The more stable carbocation is preferentially formed, leading to the Markovnikov product. Exception: With HBr + peroxide, anti-Markovnikov addition occurs via free radical mechanism.',
          },
          {
            id: 'hc-q4',
            type: 'mcq',
            question: 'Which alkene is the most stable?',
            difficulty: 'medium',
            topic: 'organic',
            options: [
              'CH₂=CH₂ (ethene)',
              'CH₃-CH=CH₂ (propene)',
              'CH₃-CH=CH-CH₃ (but-2-ene)',
              '(CH₃)₂C=C(CH₃)₂ (2,3-dimethylbut-2-ene)'
            ],
            correctAnswer: 3,
            explanation: '(CH₃)₂C=C(CH₃)₂ (2,3-dimethylbut-2-ene) is the MOST STABLE alkene. Alkene stability increases with the degree of substitution (number of alkyl groups attached to the double bond carbons). Stability order: Tetrasubstituted > Trisubstituted > Disubstituted > Monosubstituted > Unsubstituted. Analyzing the options: (a) CH₂=CH₂ = unsubstituted (0 alkyl groups), (b) CH₃-CH=CH₂ = monosubstituted (1 alkyl group), (c) CH₃-CH=CH-CH₃ = disubstituted (2 alkyl groups), (d) (CH₃)₂C=C(CH₃)₂ = tetrasubstituted (4 alkyl groups - MOST STABLE). Reasons for this trend: (1) HYPERCONJUGATION: More α-hydrogen atoms (on carbons adjacent to C=C) provide more stabilization through σ-π overlap. (2) +I EFFECT: Alkyl groups donate electrons, stabilizing the π bond. This stability difference is measurable: heat of hydrogenation decreases (becomes less exothermic) as substitution increases, indicating higher alkene stability.',
          },
          {
            id: 'hc-q5',
            type: 'mcq',
            question: 'Terminal alkynes (R-C≡C-H) are weakly acidic because:',
            difficulty: 'hard',
            topic: 'organic',
            options: [
              'The C-H bond is very strong',
              'The sp hybridized carbon has high s-character, making C-H more polar',
              'Alkynes have many π electrons',
              'The triple bond repels protons'
            ],
            correctAnswer: 1,
            explanation: 'Terminal alkynes are weakly acidic because THE SP HYBRIDIZED CARBON HAS HIGH S-CHARACTER (50%), MAKING THE C-H BOND MORE POLAR. In terminal alkynes (R-C≡C-H), the acidic hydrogen is attached to an sp hybridized carbon. The hybridization affects acidity: sp (50% s-character) > sp² (33% s-character) > sp³ (25% s-character). Higher s-character means: (1) Electrons are held closer to the nucleus, (2) The carbon is more electronegative, (3) The C-H bond is more polarized (δ⁺ H, δ⁻ C), (4) The conjugate base (acetylide ion, R-C≡C⁻) is more stable because the negative charge is in an orbital with high s-character (closer to nucleus, more stable). pKₐ values: R-C≡C-H (~25) < R-CH=CH₂ (~44) < R-CH₂-CH₃ (~50). Terminal alkynes can react with strong bases like NaNH₂ to form acetylide ions (R-C≡C⁻ Na⁺), which are useful nucleophiles in organic synthesis. Internal alkynes (R-C≡C-R) are NOT acidic because they lack the terminal H.',
          },
          {
            id: 'hc-q6',
            type: 'mcq',
            question: 'According to Hückel\'s rule, which of the following is aromatic?',
            difficulty: 'hard',
            topic: 'organic',
            options: [
              'Cyclobutadiene (C₄H₄, 4π electrons)',
              'Benzene (C₆H₆, 6π electrons)',
              'Cyclooctatetraene (C₈H₈, 8π electrons)',
              'Cyclohexene (not fully conjugated)'
            ],
            correctAnswer: 1,
            explanation: 'BENZENE (C₆H₆) with 6π ELECTRONS is aromatic according to Hückel\'s rule. Hückel\'s rule states that a planar, cyclic, fully conjugated system is aromatic if it has (4n+2) π electrons, where n = 0, 1, 2, 3... This gives aromatic numbers: 2, 6, 10, 14, 18... Analyzing options: (a) Cyclobutadiene has 4π electrons (4n where n=1) → ANTI-AROMATIC (destabilized, highly unstable). (b) Benzene has 6π electrons (4(1)+2) → AROMATIC (stabilized by ~150 kJ/mol, the correct answer). (c) Cyclooctatetraene has 8π electrons, but it\'s NOT planar (adopts tub shape to avoid anti-aromaticity), so it\'s NON-AROMATIC. (d) Cyclohexene is not fully conjugated (has -CH₂- groups) → NON-AROMATIC. The 4n+2 rule successfully predicts stability: aromatic compounds are unusually stable and resist addition reactions, preferring substitution to maintain aromaticity. Other aromatic species: cyclopentadienyl anion (C₅H₅⁻, 6π e⁻), tropylium cation (C₇H₇⁺, 6π e⁻), naphthalene (C₁₀H₈, 10π e⁻).',
          },
          {
            id: 'hc-q7',
            type: 'mcq',
            question: 'In electrophilic aromatic substitution of benzene, the -NO₂ group is:',
            difficulty: 'hard',
            topic: 'organic',
            options: [
              'Activating and ortho/para directing',
              'Activating and meta directing',
              'Deactivating and ortho/para directing',
              'Deactivating and meta directing'
            ],
            correctAnswer: 3,
            explanation: 'The -NO₂ (nitro) group is DEACTIVATING AND META DIRECTING in electrophilic aromatic substitution. Analysis: (1) DEACTIVATING: The -NO₂ group withdraws electron density from the benzene ring through both -I (inductive) and -R (resonance) effects. Nitrogen and oxygen are highly electronegative, pulling electrons through σ bonds (-I). Additionally, the π system of NO₂ withdraws π electron density from the ring through resonance (-R). This makes nitrobenzene LESS reactive than benzene toward electrophiles (electron-seeking species need electron-rich rings). (2) META DIRECTING: The -NO₂ group destabilizes the carbocation intermediate more at ortho and para positions than at meta position. When an electrophile attacks meta, the positive charge in the intermediate is NOT adjacent to the electron-withdrawing NO₂ group, making it relatively more stable. Other deactivating meta directors: -CN, -CHO, -COOH, -COR, -SO₃H (all have -I and -R effects). Exception: Halogens (-Cl, -Br) are deactivating but ortho/para directing due to competing -I (deactivating) and +R (ortho/para directing) effects.',
          },
          {
            id: 'hc-q8',
            type: 'mcq',
            question: 'The product of hydration of propyne (CH₃-C≡C-H) in presence of H₂SO₄ and HgSO₄ is:',
            difficulty: 'hard',
            topic: 'organic',
            options: [
              'CH₃-CH₂-CHO (propanal)',
              'CH₃-CO-CH₃ (propanone)',
              'CH₃-CH(OH)-CH₃ (propan-2-ol)',
              'CH₃-CH₂-CH₂OH (propan-1-ol)'
            ],
            correctAnswer: 1,
            explanation: 'The product of propyne hydration is CH₃-CO-CH₃ (PROPANONE/ACETONE). The hydration of alkynes follows Markovnikov\'s rule and proceeds through keto-enol tautomerism. MECHANISM: (1) H₂O adds across the triple bond with H⁺ catalyst and Hg²⁺. Following Markovnikov, OH adds to the more substituted carbon (C2). (2) Initially forms an ENOL (vinyl alcohol): CH₃-C(OH)=CH₂. (3) Enols are unstable and immediately undergo KETO-ENOL TAUTOMERISM, rearranging to the more stable KETO form (ketone): CH₃-C(OH)=CH₂ → CH₃-CO-CH₃ (propanone). The C=C moves to C=O, and the OH hydrogen shifts to the other carbon. For internal alkynes (R-C≡C-R), hydration always gives ketones. For terminal alkynes, hydration gives ketones EXCEPT for ethyne (acetylene): HC≡CH + H₂O → CH₃-CHO (ethanal/acetaldehyde). This is because in ethyne, both carbons are equivalent, and the enol (CH₂=CH-OH) tautomerizes to an aldehyde rather than a ketone. This reaction is industrially important for acetone production.',
          },
        ],
      },
    },
  ],
};
