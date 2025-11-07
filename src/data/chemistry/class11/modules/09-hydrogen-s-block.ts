/**
 * Module 9: Hydrogen and s-Block Elements
 */

import type { ChemistryModule } from '../../types';

export const hydrogenModule: ChemistryModule = {
  id: 'class11-hydrogen-s-block',
  slug: 'hydrogen-s-block',
  title: 'Hydrogen and s-Block Elements',
  description: 'Study hydrogen, alkali metals (Group 1), and alkaline earth metals (Group 2).',
  icon: 'beaker',
  sequenceOrder: 9,
  estimatedHours: 14,
  topic: 'inorganic',
  difficulty: 'medium',
  prerequisites: ['class11-periodic-classification'],
  learningOutcomes: [
    'Understand position of hydrogen in periodic table',
    'Describe properties of Group 1 elements (alkali metals)',
    'Describe properties of Group 2 elements (alkaline earth metals)',
    'Explain trends in s-block elements',
    'Understand important compounds (NaOH, Na2CO3, CaCO3)',
    'Apply periodic trends to predict reactivity',
  ],
  items: [
    {
      id: 'h-s-lesson-1',
      title: 'Hydrogen: Properties and Reactions',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'h-s-lesson-1',
        title: 'Hydrogen: Properties and Reactions',
        sequenceOrder: 1,
        estimatedMinutes: 40,
        content: `
# Hydrogen: Properties and Reactions

## Position in Periodic Table

Hydrogen occupies a **unique position**:

- **Group 1** (electronic configuration 1s¹, like alkali metals)
- **Group 17** (needs 1 electron to complete shell, like halogens)
- **Separate position** (most chemists prefer this)

> **Why unique?** H can lose 1e⁻ (forming H⁺) like alkali metals, OR gain 1e⁻ (forming H⁻) like halogens.

## Isotopes of Hydrogen

| Isotope | Symbol | Mass Number | Abundance |
|---------|--------|-------------|-----------|
| **Protium** | ¹H or H | 1 | 99.985% |
| **Deuterium** | ²H or D | 2 | 0.015% |
| **Tritium** | ³H or T | 3 | Trace (radioactive) |

- **Protium**: 1 proton, 0 neutrons
- **Deuterium**: 1 proton, 1 neutron (heavy hydrogen)
- **Tritium**: 1 proton, 2 neutrons (radioactive, β-emitter)

**Heavy water**: D₂O (used in nuclear reactors as moderator)

## Properties of Hydrogen

### Physical Properties
- Colorless, odorless, tasteless gas
- Lightest element (atomic mass 1.008)
- Least dense gas
- Diatomic molecule (H₂)
- Low boiling point (-252.8°C)
- Sparingly soluble in water

### Chemical Properties

**1. Combustion**
$$\\ce{2H2 + O2 -> 2H2O}$$ ΔH = -286 kJ/mol

Burns with pale blue flame, highly exothermic

**2. Reducing Nature**
$$\\ce{CuO + H2 -> Cu + H2O}$$
$$\\ce{Fe3O4 + 4H2 -> 3Fe + 4H2O}$$

Reduces metal oxides to metals

**3. With Halogens**
$$\\ce{H2 + Cl2 -> 2HCl}$$
Forms hydrogen halides

**4. With Nitrogen** (Haber Process)
$$\\ce{N2 + 3H2 \\rightleftharpoons 2NH3}$$
(High T, P, Fe catalyst)

## Preparation of Hydrogen

### Laboratory Method
$$\\ce{Zn + 2HCl -> ZnCl2 + H2 ^}$$
$$\\ce{Zn + H2SO4 -> ZnSO4 + H2 ^}$$

Reaction of zinc with dil. H₂SO₄ or HCl

### Commercial Methods

**1. Steam-Coal Process**
$$\\ce{C + H2O -> CO + H2}$$ (water gas)
$$\\ce{CO + H2O -> CO2 + H2}$$ (shift reaction)

**2. Electrolysis of Water**
$$\\ce{2H2O -> 2H2 + O2}$$
(Very pure H₂, but expensive)

**3. Steam-Hydrocarbon Reforming**
$$\\ce{CH4 + H2O -> CO + 3H2}$$
(Most common industrial method)

## Hydrides

**Ionic (Saline) Hydrides**
- Formed with s-block metals
- Example: NaH, CaH₂
- H⁻ ion present
- Strong reducing agents

**Covalent Hydrides**
- Formed with p-block elements
- Example: CH₄, NH₃, H₂O, HF
- Shared electrons

**Metallic (Interstitial) Hydrides**
- Formed with d-block metals
- Example: TiH₂, PdH
- H atoms in metal lattice spaces

## Uses of Hydrogen

1. **Ammonia synthesis** (Haber process) - fertilizers
2. **Methanol production** - fuel and solvent
3. **Hydrogenation** of vegetable oils (making margarine)
4. **Rocket fuel** (liquid H₂)
5. **Fuel cells** - clean energy
6. **Reducing agent** in metallurgy
7. **Weather balloons** (being replaced by helium for safety)

## Key Takeaways

1. H has unique position - dual nature
2. Three isotopes: ¹H (protium), ²H (deuterium), ³H (tritium)
3. Diatomic molecule (H₂), lightest gas
4. Good reducing agent
5. Prepared by Zn + dil. acid (lab)
6. Three types of hydrides: ionic, covalent, metallic
7. Major use: Ammonia synthesis
`,
        objectives: [
          'Explain unique position of hydrogen',
          'Identify isotopes of hydrogen',
          'Describe chemical properties of hydrogen',
          'Explain preparation methods',
          'Classify types of hydrides',
        ],
        keyTerms: [
          { term: 'Deuterium', definition: 'Heavy hydrogen isotope; ²H with 1 neutron' },
          { term: 'Hydride', definition: 'Binary compound of hydrogen with another element' },
          { term: 'Haber Process', definition: 'Industrial synthesis of ammonia from N₂ and H₂' },
        ],
      },
    },
    {
      id: 'h-s-lesson-2',
      title: 'Group 1: Alkali Metals',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'h-s-lesson-2',
        title: 'Group 1: Alkali Metals',
        sequenceOrder: 2,
        estimatedMinutes: 40,
        content: `
# Group 1: Alkali Metals

## Members

**Li, Na, K, Rb, Cs, Fr**
- Lithium, Sodium, Potassium, Rubidium, Cesium, Francium
- General electronic configuration: [Noble gas] ns¹
- One electron in outermost shell

## General Properties

### Physical Properties

1. **Soft metals** - can be cut with knife
2. **Low melting/boiling points** (decrease down group)
3. **Low density** (Li, Na, K float on water!)
4. **Silvery luster** (tarnish quickly in air)
5. **Good conductors** of heat and electricity
6. **Most reactive metals** (kept under kerosene/paraffin oil)

### Periodic Trends (Down the Group)

| Property | Trend | Reason |
|----------|-------|--------|
| **Atomic radius** | Increases | Extra shell added |
| **Ionic radius** | Increases | M⁺ ion size increases |
| **Ionization energy** | Decreases | Easier to remove outer electron |
| **Metallic character** | Increases | Easier electron loss |
| **Reactivity** | Increases | Lower IE, easier M → M⁺ |
| **Melting point** | Decreases | Weaker metallic bonding |
| **Density** | Generally increases | Mass increases faster than volume |

**Exception**: K < Na in density (due to unusual packing)

## Chemical Properties

### 1. With Oxygen

**Normal Oxides** (Li only):
$$\\ce{4Li + O2 -> 2Li2O}$$

**Peroxides** (Na mainly):
$$\\ce{2Na + O2 -> Na2O2}$$

**Superoxides** (K, Rb, Cs):
$$\\ce{K + O2 -> KO2}$$

**Trend**: Li → Li₂O; Na → Na₂O₂; K,Rb,Cs → MO₂

### 2. With Water

$$\\ce{2M + 2H2O -> 2MOH + H2 ^}$$

**Reactivity increases down group**: Li < Na < K < Rb < Cs

- **Li**: Reacts steadily
- **Na**: Reacts vigorously, melts into ball
- **K**: Violent reaction, H₂ catches fire (lilac flame)
- **Rb, Cs**: Explosive!

### 3. With Halogens

$$\\ce{2M + X2 -> 2MX}$$

Forms ionic halides (all white crystalline solids)

### 4. With Hydrogen

$$\\ce{2M + H2 -> 2MH}$$

Forms ionic hydrides containing H⁻ ion

## Important Compounds

### Sodium Hydroxide (NaOH) - Caustic Soda

**Preparation**: Electrolysis of brine (Chlor-alkali process)
$$\\ce{2NaCl + 2H2O -> 2NaOH + Cl2 + H2}$$

**Properties**:
- White crystalline solid
- Highly soluble in water (exothermic dissolution)
- Strong base
- Deliquescent (absorbs moisture from air)

**Uses**:
- Soap and detergent manufacture
- Paper industry
- Petroleum refining
- Textile processing

### Sodium Carbonate (Na₂CO₃) - Washing Soda

**Preparation**: Solvay Process (ammonia-soda process)

**Decahydrate**: Na₂CO₃·10H₂O (washing soda)
**Anhydrous**: Na₂CO₃ (soda ash)

**Uses**:
- Water softening (removes Ca²⁺, Mg²⁺)
- Glass manufacture
- Soap and detergent production
- Paper industry

### Sodium Hydrogen Carbonate (NaHCO₃) - Baking Soda

**Properties**:
- Sparingly soluble in water
- Mild base
- Decomposes on heating:
$$\\ce{2NaHCO3 -> Na2CO3 + H2O + CO2}$$

**Uses**:
- Baking powder (CO₂ evolution for rising)
- Antacid (neutralizes stomach acid)
- Fire extinguishers
- Effervescent salts

### Sodium Chloride (NaCl) - Common Salt

**Occurrence**: Seawater (~2.7%), rock salt deposits

**Uses**:
- Preservative
- Source of Na, Cl₂, NaOH (chlor-alkali)
- Manufacture of Na₂CO₃ (Solvay process)

## Biological Importance

**Na⁺ and K⁺ Ions**:
- Maintain fluid balance (osmotic pressure)
- Nerve impulse transmission
- Muscle contraction
- Na⁺/K⁺ pump in cell membranes

## Flame Colors

Alkali metals produce characteristic flame colors:
- **Li**: Crimson red
- **Na**: Golden yellow
- **K**: Lilac (violet)
- **Rb**: Red-violet
- **Cs**: Blue

**Basis**: Excitation of valence electron to higher energy level, then return with light emission.

## Key Takeaways

1. ns¹ configuration, 1 valence electron
2. Very reactive metals (stored under oil)
3. Reactivity increases down group
4. Form M⁺ ions (stable noble gas configuration)
5. With O₂: Li₂O, Na₂O₂, KO₂ trend
6. With H₂O: Increasingly violent reactions
7. NaOH, Na₂CO₃, NaHCO₃ are important industrial chemicals
8. Na⁺ and K⁺ essential for biological functions
`,
        objectives: [
          'Describe properties and trends in alkali metals',
          'Explain reactivity trend down the group',
          'Write reactions with O₂, H₂O, halogens',
          'Describe preparation and uses of NaOH, Na₂CO₃',
          'Explain biological importance of Na⁺ and K⁺',
        ],
        keyTerms: [
          { term: 'Alkali Metals', definition: 'Group 1 elements with ns¹ configuration' },
          { term: 'Superoxide', definition: 'Compound containing O₂⁻ ion (e.g., KO₂)' },
          { term: 'Deliquescent', definition: 'Absorbs moisture and dissolves in it' },
        ],
      },
    },
    {
      id: 'h-s-quiz-1',
      title: 'Hydrogen and s-Block Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'h-s-quiz-1',
        title: 'Hydrogen and s-Block Quiz',
        description: 'Test your understanding of hydrogen and s-block elements.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'hs-q1',
            type: 'mcq',
            question: 'Which isotope of hydrogen is radioactive?',
            difficulty: 'easy',
            topic: 'inorganic',
            options: ['Protium', 'Deuterium', 'Tritium', 'All of the above'],
            correctAnswer: 2,
            explanation: 'Tritium (³H or T) is the radioactive isotope of hydrogen. It has 1 proton and 2 neutrons, making it unstable. Tritium undergoes beta decay with a half-life of about 12.3 years. Protium (¹H) with no neutrons and Deuterium (²H) with 1 neutron are both stable isotopes. Protium makes up 99.985% of natural hydrogen.',
          },
          {
            id: 'hs-q2',
            type: 'mcq',
            question: 'The reactivity of alkali metals with water:',
            difficulty: 'easy',
            topic: 'inorganic',
            options: [
              'Increases down the group',
              'Decreases down the group',
              'Remains constant',
              'First increases then decreases'
            ],
            correctAnswer: 0,
            explanation: 'Reactivity of alkali metals with water INCREASES down the group: Li < Na < K < Rb < Cs. This is because ionization energy decreases down the group (larger atoms, outer electron farther from nucleus), making it easier to form M⁺ ions. Li reacts gently, Na vigorously (melts), K catches fire (lilac flame), and Rb/Cs react explosively with water.',
          },
          {
            id: 'hs-q3',
            type: 'mcq',
            question: 'When sodium reacts with excess oxygen, the main product formed is:',
            difficulty: 'medium',
            topic: 'inorganic',
            options: ['Na₂O (oxide)', 'Na₂O₂ (peroxide)', 'NaO₂ (superoxide)', 'NaOH'],
            correctAnswer: 1,
            explanation: 'Sodium forms sodium peroxide (Na₂O₂) when it reacts with excess oxygen. The trend in Group 1 is: Li forms normal oxide (Li₂O), Na forms peroxide (Na₂O₂), and K/Rb/Cs form superoxides (MO₂). This happens because larger cations can stabilize larger anions better. Peroxide contains O₂²⁻ ion with O-O bond. The reaction is: 2Na + O₂ → Na₂O₂.',
          },
          {
            id: 'hs-q4',
            type: 'mcq',
            question: 'Which compound is used in baking powder to release CO₂?',
            difficulty: 'medium',
            topic: 'inorganic',
            options: ['NaOH', 'Na₂CO₃', 'NaHCO₃', 'NaCl'],
            correctAnswer: 2,
            explanation: 'Sodium hydrogen carbonate (NaHCO₃), also called baking soda or sodium bicarbonate, is used in baking powder. When heated, it decomposes: 2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑. The released CO₂ causes dough to rise, making baked goods fluffy. It also acts as a mild antacid to neutralize stomach acid. Na₂CO₃ (washing soda) is used for water softening, not baking.',
          },
          {
            id: 'hs-q5',
            type: 'mcq',
            question: 'The flame color produced by potassium is:',
            difficulty: 'easy',
            topic: 'inorganic',
            options: ['Crimson red', 'Golden yellow', 'Lilac (violet)', 'Blue'],
            correctAnswer: 2,
            explanation: 'Potassium produces a LILAC (violet) flame color. Different alkali metals give characteristic flame colors: Li = crimson red, Na = golden yellow, K = lilac, Rb = red-violet, Cs = blue. This happens when the valence electron gets excited to a higher energy level by the flame\'s heat, then returns to ground state by emitting light of specific wavelength. Flame tests are used to identify alkali metals.',
          },
        ],
      },
    },
  ],
};
