/**
 * Module 10: p-Block Elements Introduction (Groups 13-14)
 */

import type { ChemistryModule } from '../../types';

export const pBlockIntroModule: ChemistryModule = {
  id: 'class11-p-block-intro',
  slug: 'p-block-intro',
  title: 'p-Block Elements Introduction',
  description: 'Introduction to Group 13 (Boron family) and Group 14 (Carbon family) elements.',
  icon: 'package',
  sequenceOrder: 10,
  estimatedHours: 12,
  topic: 'inorganic',
  difficulty: 'medium',
  prerequisites: ['class11-periodic-classification'],
  learningOutcomes: [
    'Understand properties of Group 13 elements',
    'Understand properties of Group 14 elements',
    'Explain trends in p-block elements',
    'Understand allotropes of carbon',
    'Describe important compounds',
  ],
  items: [
    {
      id: 'p-block-lesson-1',
      title: 'Group 13 Elements: Boron Family',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'p-block-lesson-1',
        title: 'Group 13 Elements: Boron Family',
        sequenceOrder: 1,
        estimatedMinutes: 45,
        content: `
# Group 13 Elements: Boron Family

## Members and Electronic Configuration

**B, Al, Ga, In, Tl**
- Boron, Aluminium, Gallium, Indium, Thallium
- General electronic configuration: [Noble gas] ns² np¹
- Three electrons in outermost shell (2 in s, 1 in p)

**Example**: Al (Z = 13): 1s² 2s² 2p⁶ 3s² 3p¹ = [Ne] 3s² 3p¹

## General Properties

### Physical Properties

1. **Metallic character**: Increases down the group
   - **Boron**: Non-metal (hard, black solid)
   - **Al, Ga, In, Tl**: Metals (silvery, good conductors)

2. **Melting/Boiling points**: Generally decrease (irregular trend)
   - Ga has unusually low m.p. (29.8°C) - melts in hand!

3. **Density**: Increases down the group

4. **Appearance**:
   - B: Black/brown amorphous or crystalline
   - Al: Silvery-white, light metal
   - Ga: Silvery metal, liquid near room temp
   - In, Tl: Soft, silvery metals

### Periodic Trends (Down the Group)

| Property | Trend | Reason |
|----------|-------|--------|
| **Atomic radius** | Increases | Extra shell added |
| **Ionic radius (M³⁺)** | Increases | Larger ions down group |
| **Ionization energy** | Decreases (overall) | Outer electrons farther from nucleus |
| **Electronegativity** | Decreases | Weaker attraction for electrons |
| **Metallic character** | Increases | Easier to lose electrons |

**Anomaly**: First ionization energy increases from Al → Ga due to poor shielding by d-electrons.

### Oxidation States

**Primary**: +3 (all elements)
- Loss of all three valence electrons: ns² np¹ → M³⁺

**Secondary**: +1 (heavier elements, especially Tl)
- **Inert pair effect**: ns² electrons reluctant to participate
- Stability of +1 increases down group: Tl⁺ is more stable than Tl³⁺

**Examples**:
- Al: Always +3 (Al³⁺)
- Ga: Mainly +3, some +1
- Tl: Both +1 (TlCl) and +3 (TlCl₃), but +1 more stable

> **Inert Pair Effect**: The reluctance of s-electrons to participate in bonding, especially in heavier elements. Due to poor shielding by d and f electrons, ns² pair is tightly held.

## Chemical Properties

### 1. With Oxygen

All form oxides M₂O₃:
$$\\ce{4M + 3O2 -> 2M2O3}$$

**Nature**:
- **B₂O₃**: Acidic oxide
- **Al₂O₃**: Amphoteric (acts as both acid and base)
- **Ga₂O₃, In₂O₃, Tl₂O₃**: Basic oxides

**Amphoteric nature of Al₂O₃**:
- With acid: $$\\ce{Al2O3 + 6HCl -> 2AlCl3 + 3H2O}$$
- With base: $$\\ce{Al2O3 + 2NaOH -> 2NaAlO2 + H2O}$$
  (Forms sodium aluminate)

### 2. With Halogens

Form trihalides MX₃:
$$\\ce{2M + 3X2 -> 2MX3}$$

**Examples**: BCl₃, AlCl₃, GaCl₃

**Structure**:
- **BX₃**: Electron deficient, acts as Lewis acid
- **AlX₃**: Dimeric (Al₂Cl₆) in vapor phase

### 3. With Acids

Metals (Al, Ga, In, Tl) react with acids:
$$\\ce{2Al + 6HCl -> 2AlCl3 + 3H2 ^}$$
$$\\ce{2Al + 3H2SO4 -> Al2(SO4)3 + 3H2 ^}$$

**Note**: Al doesn't react with conc. HNO₃ (forms protective oxide layer - passivation)

### 4. With Bases

Al reacts with strong bases (amphoteric):
$$\\ce{2Al + 2NaOH + 2H2O -> 2NaAlO2 + 3H2 ^}$$

Produces hydrogen gas + sodium aluminate

## Boron: Special Characteristics

Boron is **unique** in Group 13:

1. **Non-metal** (others are metals)
2. **Extremely hard** (crystalline boron nearly as hard as diamond)
3. **High melting point** (2300°C)
4. **Forms only covalent compounds** (small size, high ionization energy)
5. **Electron deficient** compounds (e.g., B₂H₆)
6. **Does not form B³⁺** ion (very high IE)

### Boron Compounds

**Boron Hydrides (Boranes)**:
- Example: Diborane (B₂H₆)
- Electron deficient (12 valence electrons for 8 bonds)
- Contains **3-center-2-electron** bonds (banana bonds)

**Structure of B₂H₆**:

```
    H   H   H
     \\ | /
      B---B
     / | \\
    H   H   H
```

Two bridging H atoms between B atoms

**Boron Trifluoride (BF₃)**:
- Planar triangular
- Strong Lewis acid (accepts electron pair)
- Used as catalyst

## Aluminium: Important Element

### Properties
- **Silvery-white** light metal
- **Excellent conductor** of electricity (used in power lines)
- **Low density** (2.7 g/cm³)
- **Corrosion resistant** (forms protective Al₂O₃ layer)
- **Malleable and ductile**

### Extraction
**Hall-Héroult Process**: Electrolysis of molten Al₂O₃

1. Purify bauxite ore (Al₂O₃·2H₂O)
2. Mix with cryolite (Na₃AlF₆) - lowers melting point
3. Electrolyze at ~950°C
4. Cathode: $$\\ce{Al^3+ + 3e^- -> Al}$$
5. Anode: $$\\ce{2O^2- -> O2 + 4e^-}$$

### Important Compounds

**Aluminium Oxide (Al₂O₃) - Alumina**
- White solid, very high m.p. (2072°C)
- **Amphoteric** nature
- Uses: Refractory material, abrasive, ceramics
- **Corundum**: Crystalline form
- **Ruby/Sapphire**: Gem forms with Cr/Ti impurities

**Aluminium Chloride (AlCl₃)**
- Anhydrous: Dimeric (Al₂Cl₆) in vapor
- Strong Lewis acid
- Used as catalyst in Friedel-Crafts reaction

**Aluminium Sulphate - Al₂(SO₄)₃**
- **Alum**: K₂SO₄·Al₂(SO₄)₃·24H₂O (potash alum)
- Used in water purification (coagulation)
- Used in dyeing (mordant)

**Aluminium Hydroxide - Al(OH)₃**
- Amphoteric:
  - With acid: $$\\ce{Al(OH)3 + 3HCl -> AlCl3 + 3H2O}$$
  - With base: $$\\ce{Al(OH)3 + NaOH -> NaAlO2 + 2H2O}$$

### Uses of Aluminium

1. **Electrical cables** (good conductor, light)
2. **Aircraft construction** (low density, strong)
3. **Food packaging** (aluminium foil)
4. **Utensils** (non-toxic, corrosion resistant)
5. **Alloying** (duralumin = Al + Cu + Mg + Mn)
6. **Thermite welding** (Al + Fe₂O₃ → Fe + Al₂O₃ + heat)
7. **Reducing agent** in metallurgy

## Anomalous Properties of Boron

Boron differs from other Group 13 elements:

| Property | Boron | Other Elements |
|----------|-------|----------------|
| Nature | Non-metal | Metals |
| Hardness | Very hard | Soft metals |
| Compounds | Only covalent | Mostly ionic |
| Hydrides | Electron deficient | Don't form hydrides |
| B³⁺ ion | Doesn't form | Form M³⁺ ions |

**Reasons**:
1. **Small atomic size**
2. **High ionization energy**
3. **High electronegativity** (for a metal)
4. **Absence of d-orbitals**

## Key Takeaways

1. Group 13: ns² np¹ configuration (3 valence electrons)
2. Oxidation states: +3 (all), +1 (heavier elements - inert pair effect)
3. Metallic character increases down group (B is non-metal)
4. **Boron is anomalous**: Non-metal, forms only covalent compounds
5. **Al₂O₃ is amphoteric**: Reacts with both acids and bases
6. **Inert pair effect**: Heavier elements prefer +1 over +3
7. **Aluminium**: Light, strong, corrosion-resistant, excellent conductor
8. **Diborane (B₂H₆)**: Electron deficient with 3c-2e bonds
`,
        objectives: [
          'Describe general properties and trends in Group 13',
          'Explain inert pair effect in heavier elements',
          'Identify anomalous behavior of boron',
          'Describe amphoteric nature of aluminium oxide',
          'Explain structure of diborane (B₂H₆)',
          'List uses of aluminium and its compounds',
        ],
        keyTerms: [
          { term: 'Inert Pair Effect', definition: 'Reluctance of ns² electrons to participate in bonding in heavier p-block elements' },
          { term: 'Amphoteric', definition: 'Substance that can react with both acids and bases' },
          { term: 'Diborane', definition: 'Electron-deficient boron hydride (B₂H₆) with 3-center-2-electron bonds' },
          { term: 'Passivation', definition: 'Formation of protective oxide layer preventing further reaction' },
        ],
      },
    },
    {
      id: 'p-block-lesson-2',
      title: 'Group 14 Elements: Carbon Family',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'p-block-lesson-2',
        title: 'Group 14 Elements: Carbon Family',
        sequenceOrder: 2,
        estimatedMinutes: 45,
        content: `
# Group 14 Elements: Carbon Family

## Members and Electronic Configuration

**C, Si, Ge, Sn, Pb**
- Carbon, Silicon, Germanium, Tin, Lead
- General electronic configuration: [Noble gas] ns² np²
- Four electrons in outermost shell (2 in s, 2 in p)

**Example**: C (Z = 6): 1s² 2s² 2p² = [He] 2s² 2p²

## General Properties

### Physical Properties

1. **Metallic character**: Increases down the group
   - **C, Si**: Non-metals
   - **Ge**: Metalloid (semiconductor)
   - **Sn, Pb**: Metals

2. **Appearance**:
   - C: Black (graphite) or transparent (diamond)
   - Si: Dark gray, shiny metalloid
   - Ge: Grayish-white metalloid
   - Sn: Silvery-white metal
   - Pb: Bluish-white, soft, heavy metal

3. **Melting points**: High for C and Si, lower for Ge, Sn, Pb
   - C: 3823°C (sublimes), Si: 1414°C
   - Network covalent structure in C and Si

4. **Density**: Increases down the group

### Periodic Trends (Down the Group)

| Property | Trend | Reason |
|----------|-------|--------|
| **Atomic radius** | Increases | Extra shell added |
| **Ionic radius** | Increases | Larger ions |
| **Ionization energy** | Decreases (overall) | Outer electrons farther from nucleus |
| **Electronegativity** | Decreases | Weaker attraction |
| **Metallic character** | Increases | Easier electron loss |
| **Catenation** | Decreases | Weaker M-M bonds down group |

**Anomaly**: IE increases from Sn → Pb (d and f electrons poor shielding)

### Oxidation States

**Primary**: +4 and +2

**+4 state**: Using all four valence electrons
- Common for C, Si
- C almost always +4 (or -4)
- Examples: CO₂, SiO₂, CCl₄, SiCl₄

**+2 state**: Using only np² electrons (inert pair effect)
- Stability of +2 increases down group
- Pb²⁺ more stable than Pb⁴⁺
- Examples: SnCl₂, PbCl₂, PbO

**Trend**: +4 → +2 stability increases down group due to **inert pair effect**

### Catenation

**Catenation**: Ability to form chains by bonding with same element

**Order**: C >> Si > Ge ≈ Sn >> Pb

**Reason**: C-C bond is very strong (348 kJ/mol)
- C forms long chains, rings, branches
- Si can form limited chains (Si-Si bond weaker: 226 kJ/mol)
- Ge, Sn, Pb have very weak M-M bonds

**Result**: Carbon forms millions of organic compounds!

## Chemical Properties

### 1. With Oxygen

Form two types of oxides: MO and MO₂

**Monoxides (MO)**:
$$\\ce{2C + O2 -> 2CO}$$ (carbon monoxide)

**Dioxides (MO₂)**:
$$\\ce{C + O2 -> CO2}$$ (carbon dioxide)
$$\\ce{Si + O2 -> SiO2}$$ (silicon dioxide)

**Nature**:
- **CO₂**: Acidic oxide
- **SiO₂**: Acidic oxide (weakly)
- **GeO₂**: Amphoteric
- **SnO, SnO₂**: Amphoteric
- **PbO, PbO₂**: Amphoteric

### 2. With Halogens

Form tetrahalides MX₄ and dihalides MX₂:

$$\\ce{M + 2X2 -> MX4}$$
$$\\ce{M + X2 -> MX2}$$

**Examples**: CCl₄, SiCl₄, GeCl₄, SnCl₄, SnCl₂, PbCl₂

- **MX₄**: Stability decreases down group
- **MX₂**: Stability increases down group (inert pair)

### 3. With Hydrogen

Form hydrides MH₄:

$$\\ce{M + 2H2 -> MH4}$$

**Examples**:
- **CH₄** (methane): Very stable
- **SiH₄** (silane): Less stable, spontaneously flammable
- **GeH₄** (germane): Unstable
- **SnH₄, PbH₄**: Very unstable, rarely formed

**Stability order**: CH₄ >> SiH₄ > GeH₄ > SnH₄ (M-H bond strength decreases)

## Allotropes of Carbon

Carbon exists in several allotropic forms:

### 1. Diamond

**Structure**:
- 3D network of C atoms
- Each C bonded to 4 others (sp³ hybridization)
- Tetrahedral arrangement
- C-C bond length: 154 pm

**Properties**:
- **Hardest natural substance**
- Transparent, refractive (brilliant)
- Excellent thermal conductor
- Poor electrical conductor (no free electrons)
- Very high melting point

**Uses**: Cutting tools, jewelry, abrasives

### 2. Graphite

**Structure**:
- Layered 2D structure
- Each C bonded to 3 others in plane (sp² hybridization)
- Hexagonal rings in each layer
- Weak van der Waals forces between layers
- Delocalized π electrons (4th electron)

**Properties**:
- **Soft and slippery** (layers slide over each other)
- Black, opaque
- **Good electrical conductor** (delocalized electrons)
- Good thermal conductor
- High melting point

**Uses**: Pencil leads, lubricants, electrodes, moderator in nuclear reactors

### 3. Fullerenes

**Discovery**: 1985 (Nobel Prize 1996)

**C₆₀ - Buckminsterfullerene**:
- Spherical molecule
- 60 carbon atoms
- 20 hexagons + 12 pentagons
- Looks like football (soccer ball)

**Structure**: Each C bonded to 3 others, mix of single and double bonds

**Other fullerenes**: C₇₀, C₇₆, C₈₄, etc.

**Uses**: Drug delivery, superconductors (when doped), nanotechnology

### 4. Carbon Nanotubes

- Rolled graphene sheets
- Cylindrical structure
- Single-walled or multi-walled
- **Extremely strong** (stronger than steel)
- Excellent electrical conductors

**Uses**: Composite materials, electronics, hydrogen storage

### 5. Graphene

- Single layer of graphite
- 2D sheet of carbon atoms in hexagonal lattice
- **One atom thick**
- **Strongest material known**
- Excellent conductor

**Uses**: Future electronics, sensors, batteries

## Silicon: The Semiconductor

### Properties
- Second most abundant element in Earth's crust (~28%)
- Occurs as SiO₂ (quartz, sand) and silicates
- **Semiconductor** (between conductor and insulator)
- Dark gray, shiny, hard

### Silicon Dioxide (SiO₂) - Silica

**Occurrence**: Quartz, sand, flint, agate

**Structure**:
- Giant 3D network
- Each Si bonded to 4 oxygen atoms tetrahedrally
- Each O bonded to 2 Si atoms

**Properties**:
- Very hard
- High melting point (1713°C)
- Chemically inert
- Insoluble in water

**Uses**:
- Glass manufacture
- Ceramics
- Construction (sand)
- Electronics (silicon chips)

### Silicones

**Polymer** with Si-O-Si backbone:

$$\\ce{(R2SiO)_n}$$

Where R = CH₃, C₂H₅, etc.

**Preparation**: Hydrolysis of dialkyldichlorosilanes

$$\\ce{R2SiCl2 + H2O -> (R2SiO)_n + HCl}$$

**Properties**:
- Chemically inert
- Water repellent
- Heat resistant
- Biocompatible

**Uses**: Lubricants, water repellents, sealants, cosmetics, medical implants

### Silicates

**Complex minerals** containing SiO₄⁴⁻ units

**Examples**:
- Feldspar, mica, clay, asbestos, talc
- Form rocks and soil

**Basic unit**: SiO₄⁴⁻ tetrahedron (Si at center, 4 O at corners)

## Important Compounds

### Carbon Monoxide (CO)

**Preparation**:
$$\\ce{C + O2 -> 2CO}$$ (limited oxygen)

**Properties**:
- Colorless, odorless gas
- **Highly toxic** (binds to hemoglobin stronger than O₂)
- Neutral oxide (neither acidic nor basic)
- Good reducing agent

**Uses**: Reducing agent in metallurgy, synthesis of methanol

### Carbon Dioxide (CO₂)

**Preparation**:
$$\\ce{CaCO3 -> CaO + CO2}$$ (heating)
$$\\ce{C + O2 -> CO2}$$ (complete combustion)

**Properties**:
- Colorless, odorless gas
- Denser than air
- **Acidic oxide** (forms H₂CO₃ in water)
- Does not support combustion

**Uses**:
- Fire extinguishers
- Refrigerant (dry ice = solid CO₂)
- Carbonated beverages
- Photosynthesis

**Environmental**: Greenhouse gas, contributes to global warming

### Lead Compounds

**Lead(II) Oxide (PbO) - Litharge**:
- Yellow or red solid
- Amphoteric
- Used in glass, ceramics, lead-acid batteries

**Lead(IV) Oxide (PbO₂)**:
- Brown solid
- Strong oxidizing agent
- Used in lead-acid batteries (cathode)

**Lead(II) Chloride (PbCl₂)**:
- White solid, sparingly soluble
- Used in paints (now restricted due to toxicity)

**Tetraethyl lead - Pb(C₂H₅)₄**:
- Previously used as anti-knock agent in petrol
- Now banned in most countries (toxic, pollutant)

## Anomalous Properties of Carbon

Carbon differs from other Group 14 elements:

| Property | Carbon | Other Elements |
|----------|--------|----------------|
| Catenation | Extensive | Limited |
| Multiple bonding | Forms C=C, C≡C easily | Weak or absent |
| Compounds | Millions (organic chemistry) | Limited |
| Coordination | Max 4 | Can exceed 4 (e.g., SiF₆²⁻) |
| d-orbitals | Absent | Present |

**Reasons**:
1. **Small size** → strong C-C and C=C bonds
2. **Absence of d-orbitals** → max coordination 4
3. **High electronegativity** → forms stable bonds with H, O, N
4. **Ability to form pπ-pπ bonds** → C=C, C≡C strong

## Key Takeaways

1. Group 14: ns² np² configuration (4 valence electrons)
2. Oxidation states: +4 and +2 (inert pair effect in heavier elements)
3. Metallic character increases down group (C, Si non-metals; Sn, Pb metals)
4. **Catenation**: C >> Si > Ge > Sn > Pb
5. **Carbon allotropes**: Diamond (3D, hard), Graphite (2D, conductor), Fullerenes (C₆₀), Graphene
6. **Silicon**: Semiconductor, abundant (SiO₂ = sand/quartz)
7. **CO**: Toxic, reducing agent; **CO₂**: Acidic oxide, greenhouse gas
8. **Carbon is unique**: Strong catenation, forms millions of compounds (organic chemistry)
`,
        objectives: [
          'Describe general properties and trends in Group 14',
          'Explain inert pair effect in Pb',
          'Explain catenation and its trend down the group',
          'Describe allotropes of carbon (diamond, graphite, fullerenes)',
          'Differentiate properties of CO and CO₂',
          'Explain structure and uses of silicon dioxide and silicones',
        ],
        keyTerms: [
          { term: 'Catenation', definition: 'Ability of an element to form chains by bonding with itself' },
          { term: 'Allotropy', definition: 'Existence of an element in two or more different physical forms' },
          { term: 'Fullerene', definition: 'Spherical carbon molecule (e.g., C₆₀ with 60 carbon atoms)' },
          { term: 'Graphene', definition: 'Single atomic layer of graphite, strongest known material' },
          { term: 'Silicone', definition: 'Polymer with Si-O-Si backbone and organic side groups' },
        ],
      },
    },
    {
      id: 'p-block-quiz-1',
      title: 'p-Block Elements Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'p-block-quiz-1',
        title: 'p-Block Elements Quiz',
        description: 'Test your understanding of Group 13 and Group 14 elements.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'pb-q1',
            type: 'mcq',
            question: 'Which property of Group 13 elements is responsible for the stability of +1 oxidation state in thallium?',
            difficulty: 'medium',
            topic: 'inorganic',
            options: [
              'Diagonal relationship',
              'Inert pair effect',
              'Lanthanide contraction',
              'Shielding effect'
            ],
            correctAnswer: 1,
            explanation: 'The INERT PAIR EFFECT is responsible for the stability of +1 oxidation state in heavier p-block elements like thallium. In Tl, the 6s² electrons are reluctant to participate in bonding because of poor shielding by intervening 4f and 5d electrons, making them tightly held by the nucleus. As a result, Tl⁺ (6s² retained) is more stable than Tl³⁺ (6s² lost). This effect increases down Group 13: in boron and aluminum, +3 is strongly preferred, but in thallium, +1 is actually more stable than +3. The inert pair effect also explains why Pb²⁺ is more stable than Pb⁴⁺ in Group 14.',
          },
          {
            id: 'pb-q2',
            type: 'mcq',
            question: 'Aluminium oxide (Al₂O₃) is amphoteric. Which of the following correctly describes its behavior?',
            difficulty: 'medium',
            topic: 'inorganic',
            options: [
              'Reacts only with acids',
              'Reacts only with bases',
              'Reacts with both acids and bases',
              'Does not react with either acids or bases'
            ],
            correctAnswer: 2,
            explanation: 'Aluminium oxide (Al₂O₃) is AMPHOTERIC, meaning it can react with BOTH ACIDS AND BASES. With acids, it acts as a base: Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O. With bases, it acts as an acid: Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O (forming sodium aluminate). This amphoteric nature is characteristic of oxides and hydroxides of elements near the metal-nonmetal boundary in the periodic table. B₂O₃ is acidic (boron is a non-metal), while Ga₂O₃, In₂O₃, and Tl₂O₃ are increasingly basic (more metallic character). Amphoteric behavior is also shown by ZnO, PbO, SnO, and BeO.',
          },
          {
            id: 'pb-q3',
            type: 'mcq',
            question: 'The ability of carbon to form long chains (catenation) is much greater than silicon because:',
            difficulty: 'medium',
            topic: 'inorganic',
            options: [
              'Carbon is more electronegative than silicon',
              'C-C bond is much stronger than Si-Si bond',
              'Carbon has smaller atomic size',
              'Silicon can form pπ-pπ bonds'
            ],
            correctAnswer: 1,
            explanation: 'The C-C BOND IS MUCH STRONGER than the Si-Si bond, which is why carbon shows extensive catenation compared to silicon. The C-C bond strength is 348 kJ/mol, while Si-Si is only 226 kJ/mol. This large difference arises because: (1) Carbon is much smaller, allowing better orbital overlap and shorter, stronger bonds, and (2) Silicon\'s larger size leads to weaker overlap and longer, weaker bonds. The stronger C-C bond allows carbon to form stable long chains, branched chains, and rings, leading to millions of organic compounds. Silicon can form short chains like Si₂H₆, Si₃H₈, but these are much less stable. The catenation order in Group 14 is: C >> Si > Ge ≈ Sn >> Pb. This exceptional catenation ability of carbon is the foundation of organic chemistry and life itself.',
          },
          {
            id: 'pb-q4',
            type: 'mcq',
            question: 'Which allotrope of carbon is the best electrical conductor?',
            difficulty: 'easy',
            topic: 'inorganic',
            options: [
              'Diamond',
              'Graphite',
              'Fullerene (C₆₀)',
              'All are equally good conductors'
            ],
            correctAnswer: 1,
            explanation: 'GRAPHITE is the best electrical conductor among carbon allotropes. In graphite, each carbon atom is sp² hybridized and bonded to three other carbons in a planar hexagonal arrangement. The fourth electron from each carbon occupies a p-orbital perpendicular to the plane, and these electrons are delocalized across the entire layer, forming a "sea" of mobile π electrons. These delocalized electrons can move freely through the structure, allowing graphite to conduct electricity along the planes. In contrast, diamond is a POOR conductor because all four valence electrons of each carbon are involved in strong covalent σ bonds (sp³ hybridization), with no free electrons available for conduction. Fullerenes like C₆₀ have limited conductivity unless doped. Graphite is used as electrodes in batteries and electrolysis because of this conducting property.',
          },
          {
            id: 'pb-q5',
            type: 'mcq',
            question: 'Carbon monoxide (CO) is highly toxic because:',
            difficulty: 'medium',
            topic: 'inorganic',
            options: [
              'It is acidic and corrodes tissues',
              'It binds to hemoglobin more strongly than oxygen',
              'It causes immediate combustion in lungs',
              'It is radioactive'
            ],
            correctAnswer: 1,
            explanation: 'Carbon monoxide (CO) is highly toxic because it BINDS TO HEMOGLOBIN MORE STRONGLY THAN OXYGEN. Hemoglobin in red blood cells normally carries O₂ from lungs to tissues. However, CO binds to the iron in hemoglobin about 200-300 times more strongly than O₂ does, forming carboxyhemoglobin (HbCO). This prevents hemoglobin from binding and transporting O₂, leading to tissue hypoxia (oxygen starvation) even when breathing. The victim may not notice because CO is colorless, odorless, and tasteless. Symptoms include headache, dizziness, weakness, and in severe cases, unconsciousness and death. CO poisoning is treated with high concentrations of O₂ or hyperbaric oxygen therapy to displace CO from hemoglobin. CO is produced by incomplete combustion of carbon-containing fuels.',
          },
          {
            id: 'pb-q6',
            type: 'mcq',
            question: 'Diborane (B₂H₆) is described as electron-deficient because:',
            difficulty: 'hard',
            topic: 'inorganic',
            options: [
              'It has unpaired electrons',
              'It has less than 8 electrons around each boron',
              'It has fewer valence electrons than required for normal 2-center-2-electron bonds',
              'Boron has only 3 valence electrons'
            ],
            correctAnswer: 2,
            explanation: 'Diborane (B₂H₆) is electron-deficient because it has FEWER VALENCE ELECTRONS THAN REQUIRED FOR NORMAL 2-CENTER-2-ELECTRON BONDS. The molecule has 12 valence electrons (2×3 from B + 6×1 from H), but if we draw it with normal covalent bonds, we would need 14 electrons (8 bonds × 2 electrons). The structure cannot be explained by conventional bonding theory. Instead, B₂H₆ has a unique structure with TWO BRIDGING HYDROGEN ATOMS that form 3-center-2-electron (3c-2e) bonds, also called "banana bonds." Each bridging H is bonded to both B atoms simultaneously using only 2 electrons total. The structure has 4 normal B-H bonds (terminal hydrogens) and 2 special B-H-B bridges. This electron deficiency makes diborane highly reactive and a strong Lewis acid, readily accepting electron pairs from donors. Similar electron deficiency is seen in other boron hydrides and Al₂Cl₆.',
          },
          {
            id: 'pb-q7',
            type: 'mcq',
            question: 'Which of the following oxides is formed when sodium reacts with excess oxygen?',
            difficulty: 'medium',
            topic: 'inorganic',
            options: [
              'Na₂O (normal oxide)',
              'Na₂O₂ (peroxide)',
              'NaO₂ (superoxide)',
              'NaOH'
            ],
            correctAnswer: 1,
            explanation: 'When sodium reacts with excess oxygen, it forms SODIUM PEROXIDE (Na₂O₂). The reaction is: 2Na + O₂ → Na₂O₂. There is a clear trend in Group 1 (alkali metals) regarding oxide formation: Lithium forms the normal oxide (4Li + O₂ → 2Li₂O) containing O²⁻ ions. Sodium mainly forms the peroxide (2Na + O₂ → Na₂O₂) containing O₂²⁻ ions (peroxide ion with O-O single bond). Potassium, Rubidium, and Cesium form superoxides (K + O₂ → KO₂) containing O₂⁻ ions (superoxide ion with O-O bond order 1.5). This trend occurs because larger cations can stabilize larger anions better. The peroxide ion (O₂²⁻) is larger than oxide (O²⁻) but smaller than superoxide (O₂⁻). Sodium peroxide is used as an oxidizing agent and reacts vigorously with water: Na₂O₂ + 2H₂O → 2NaOH + H₂O₂.',
          },
        ],
      },
    },
  ],
};
