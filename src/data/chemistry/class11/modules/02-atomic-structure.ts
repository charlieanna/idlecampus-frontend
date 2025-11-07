/**
 * Module 2: Atomic Structure
 *
 * Covers Bohr model, quantum numbers, electron configuration, and atomic orbitals
 */

import type { ChemistryModule } from '../../types';

export const atomicStructureModule: ChemistryModule = {
  id: 'class11-atomic-structure',
  slug: 'atomic-structure',
  title: 'Atomic Structure',
  description: 'Explore atomic models, quantum mechanics, electron configuration, and the wave-mechanical model of the atom.',
  icon: 'atom',
  sequenceOrder: 2,
  estimatedHours: 16,
  topic: 'physical',
  difficulty: 'medium',

  prerequisites: ['class11-basic-concepts'],

  learningOutcomes: [
    'Understand the evolution of atomic models (Thomson, Rutherford, Bohr)',
    'Apply Bohr\'s theory to calculate energy levels and spectral lines',
    'Describe quantum mechanical model and quantum numbers',
    'Write electron configurations using Aufbau principle, Pauli exclusion, and Hund\'s rule',
    'Explain atomic orbitals (s, p, d, f) and their shapes',
    'Understand photoelectric effect and wave-particle duality',
  ],

  items: [
    {
      id: 'as-lesson-1',
      title: 'Discovery of Subatomic Particles',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'as-lesson-1',
        title: 'Discovery of Subatomic Particles',
        sequenceOrder: 1,
        estimatedMinutes: 40,
        content: `
# Discovery of Subatomic Particles

## Early Atomic Theory

**John Dalton (1808)**: Proposed atomic theory
- All matter is made of indivisible atoms
- Atoms of same element are identical
- Atoms combine in simple whole number ratios

However, Dalton's theory couldn't explain electricity or radioactivity!

## Discovery of the Electron (J.J. Thomson, 1897)

### Cathode Ray Tube Experiment

Thomson discovered **electrons** using cathode ray tubes.

**Observations**:
1. Cathode rays travel in straight lines
2. Deflected by electric and magnetic fields (showing they have charge)
3. Properties independent of cathode material or gas in tube

**Conclusions**:
- Cathode rays are negatively charged particles
- Named them **electrons** (e⁻)
- Charge-to-mass ratio: $e/m = 1.758 \\times 10^{11}$ C/kg

### Thomson's "Plum Pudding" Model (1904)

- Atom is a sphere of positive charge
- Electrons embedded like plums in pudding
- **Problem**: Couldn't explain scattering experiments!

## Discovery of the Nucleus (Rutherford, 1911)

### Gold Foil Experiment

Rutherford bombarded thin gold foil with α-particles.

**Observations**:
1. Most α-particles passed straight through
2. Some deflected at small angles
3. Very few (~1 in 8000) bounced back!

**Conclusions**:
- Most of atom is empty space
- Positive charge concentrated in tiny **nucleus**
- Electrons orbit around nucleus
- Nucleus is extremely dense

### Rutherford's Nuclear Model

- Atom has a tiny, dense, positively charged **nucleus**
- Electrons revolve in circular orbits
- Size: Nucleus ~10⁻¹⁵ m, Atom ~10⁻¹⁰ m

**Limitations**:
- Couldn't explain atomic stability (why don't electrons fall into nucleus?)
- Couldn't explain atomic spectra

## Discovery of Proton

- Positive particles in nucleus
- Charge: +1.602 × 10⁻¹⁹ C (equal and opposite to electron)
- Mass: 1.673 × 10⁻²⁷ kg (~1836 times electron mass)
- Symbol: p⁺

## Discovery of Neutron (James Chadwick, 1932)

- Neutral particles in nucleus
- Mass: 1.675 × 10⁻²⁷ kg (slightly more than proton)
- Symbol: n
- Explains isotopes!

## Summary of Subatomic Particles

| Particle | Symbol | Charge | Mass (kg) | Mass (u) | Location |
|----------|--------|--------|-----------|----------|----------|
| Proton | p⁺ | +1 | 1.673×10⁻²⁷ | 1.007 | Nucleus |
| Neutron | n | 0 | 1.675×10⁻²⁷ | 1.009 | Nucleus |
| Electron | e⁻ | -1 | 9.109×10⁻³¹ | 0.0005 | Orbits |

## Atomic Number and Mass Number

**Atomic Number (Z)**: Number of protons in nucleus
- Defines the element
- For neutral atom: Z = number of electrons

**Mass Number (A)**: Total nucleons (protons + neutrons)
$$A = Z + N$$

where N = number of neutrons

### Notation
$$^A_Z X$$

Example: $^{12}_6 C$ means Carbon with 6 protons, 6 neutrons

## Isotopes

**Isotopes**: Atoms of same element with different mass numbers (same Z, different N)

Examples:
- $^{12}_6 C$, $^{13}_6 C$, $^{14}_6 C$ (carbon isotopes)
- $^{35}_{17} Cl$, $^{37}_{17} Cl$ (chlorine isotopes)

**Properties**:
- Same chemical properties (same electron configuration)
- Different physical properties (different mass)
- Applications: Carbon dating, medical imaging

## Isobars and Isotones

**Isobars**: Different elements with same mass number (same A, different Z)
- Example: $^{40}_{18} Ar$ and $^{40}_{20} Ca$

**Isotones**: Atoms with same number of neutrons (same N, different A and Z)
- Example: $^{14}_6 C$ and $^{15}_7 N$ (both have 8 neutrons)

## Key Takeaways

1. Atoms contain protons, neutrons, and electrons
2. Nucleus is tiny but contains most of the mass
3. Atomic number defines the element
4. Isotopes have same chemical but different physical properties
5. Rutherford's model couldn't explain atomic stability - leading to Bohr's model
`,
        objectives: [
          'Describe the discovery of electrons, protons, and neutrons',
          'Explain Rutherford\'s gold foil experiment and nuclear model',
          'Define atomic number, mass number, and isotopes',
          'Differentiate between isotopes, isobars, and isotones',
        ],
        keyTerms: [
          { term: 'Electron', definition: 'Negatively charged subatomic particle orbiting the nucleus' },
          { term: 'Proton', definition: 'Positively charged particle in the nucleus' },
          { term: 'Neutron', definition: 'Neutral particle in the nucleus' },
          { term: 'Atomic Number (Z)', definition: 'Number of protons in an atom\'s nucleus' },
          { term: 'Mass Number (A)', definition: 'Total number of protons and neutrons' },
          { term: 'Isotopes', definition: 'Atoms of same element with different mass numbers' },
        ],
      },
    },
    {
      id: 'as-lesson-2',
      title: 'Bohr\'s Model and Atomic Spectra',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'as-lesson-2',
        title: 'Bohr\'s Model and Atomic Spectra',
        sequenceOrder: 2,
        estimatedMinutes: 50,
        content: `
# Bohr's Model and Atomic Spectra

## Limitations of Rutherford's Model

Rutherford's model had critical flaws:
1. **Stability problem**: According to classical physics, orbiting electrons should continuously emit radiation, lose energy, and spiral into the nucleus
2. **Spectral lines**: Couldn't explain discrete spectral lines of hydrogen

## Atomic Spectra

When elements are heated or subjected to electric discharge, they emit light of specific wavelengths.

### Types of Spectra

**Emission Spectrum**: Dark background with bright colored lines
- Produced when electrons fall from higher to lower energy levels

**Absorption Spectrum**: Continuous spectrum with dark lines
- Produced when electrons absorb specific wavelengths and jump to higher levels

**Key observation**: Each element has a unique spectral fingerprint!

### Hydrogen Spectrum

Simplest spectrum - consists of distinct series of lines:

1. **Lyman Series** (UV region): $n_2 \\rightarrow n_1 = 1$
2. **Balmer Series** (Visible): $n_2 \\rightarrow n_1 = 2$
3. **Paschen Series** (IR): $n_2 \\rightarrow n_1 = 3$
4. **Brackett Series** (IR): $n_2 \\rightarrow n_1 = 4$
5. **Pfund Series** (IR): $n_2 \\rightarrow n_1 = 5$

### Rydberg Formula

Rydberg derived an empirical formula for hydrogen spectral lines:

$$\\frac{1}{\\lambda} = R_H \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)$$

where:
- $\\lambda$ = wavelength
- $R_H$ = Rydberg constant = $1.097 \\times 10^7$ m⁻¹
- $n_1$ = lower energy level
- $n_2$ = higher energy level ($n_2 > n_1$)

## Bohr's Model (1913)

Niels Bohr proposed a revolutionary model combining classical and quantum concepts.

### Bohr's Postulates

**1. Stationary Orbits**
- Electrons revolve in certain fixed orbits called **stationary states**
- No energy is radiated in these orbits

**2. Quantized Angular Momentum**
$$mvr = \\frac{nh}{2\\pi}$$

where:
- $m$ = mass of electron
- $v$ = velocity
- $r$ = radius of orbit
- $n$ = principal quantum number (1, 2, 3...)
- $h$ = Planck's constant

**3. Energy Transitions**
Energy is emitted or absorbed only when electron jumps between orbits:

$$\\Delta E = E_2 - E_1 = h\\nu$$

where $\\nu$ is frequency of radiation

### Key Results from Bohr's Theory

**1. Radius of nth orbit**
$$r_n = 0.529 \\times n^2 \\text{ Å}$$

For hydrogen ground state (n=1): $r_1 = 0.529$ Å

**2. Energy of electron in nth orbit**
$$E_n = -\\frac{13.6}{n^2} \\text{ eV}$$

**Important points**:
- Energy is negative (electron is bound)
- As n increases, energy becomes less negative (increases)
- At n = ∞, E = 0 (electron is free)

**3. Energy of emitted photon**
$$\\Delta E = 13.6 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right) \\text{ eV}$$

## Worked Examples

### Example 1: Energy Calculation
**Q**: Calculate the energy of electron in 3rd orbit of hydrogen.

**Solution**:
$$E_3 = -\\frac{13.6}{3^2} = -\\frac{13.6}{9} = -1.51 \\text{ eV}$$

### Example 2: Spectral Line
**Q**: Calculate wavelength of photon emitted when electron falls from n=3 to n=2.

**Solution**:
$$\\Delta E = 13.6 \\left( \\frac{1}{2^2} - \\frac{1}{3^2} \\right) = 13.6 \\left( \\frac{1}{4} - \\frac{1}{9} \\right)$$
$$= 13.6 \\times \\frac{5}{36} = 1.89 \\text{ eV}$$

Convert to Joules: $1.89 \\times 1.6 \\times 10^{-19} = 3.02 \\times 10^{-19}$ J

Using $E = h\\nu = \\frac{hc}{\\lambda}$:
$$\\lambda = \\frac{hc}{E} = \\frac{6.626 \\times 10^{-34} \\times 3 \\times 10^8}{3.02 \\times 10^{-19}}$$
$$= 656 \\text{ nm}$$ (Red line in Balmer series!)

## Successes of Bohr's Model

1. ✓ Explained stability of atom
2. ✓ Explained hydrogen spectrum accurately
3. ✓ Calculated Rydberg constant from first principles
4. ✓ Explained ionization energy of hydrogen

## Limitations of Bohr's Model

1. ✗ Works only for hydrogen-like species (one electron)
2. ✗ Couldn't explain multi-electron atoms
3. ✗ Couldn't explain fine structure of spectral lines
4. ✗ Couldn't explain Zeeman effect (splitting in magnetic field)
5. ✗ Violated Heisenberg's Uncertainty Principle
6. ✗ Couldn't explain chemical bonding

These limitations led to the **Quantum Mechanical Model**!

## Key Formulas Summary

| Quantity | Formula |
|----------|---------|
| Radius of orbit | $r_n = 0.529n^2$ Å |
| Energy of orbit | $E_n = -13.6/n^2$ eV |
| Energy of photon | $\\Delta E = h\\nu = hc/\\lambda$ |
| Rydberg formula | $1/\\lambda = R_H(1/n_1^2 - 1/n_2^2)$ |

## Practice Problems

1. Calculate energy required to remove electron from ground state of H (ionization energy)
2. Which transition produces the longest wavelength photon in Balmer series?
3. Calculate radius of 5th Bohr orbit

## Key Takeaways

- Bohr model introduced quantum concept to atomic structure
- Energy levels are quantized (discrete)
- Spectral lines arise from electronic transitions
- Model works perfectly for hydrogen but fails for complex atoms
- Led to development of modern quantum mechanics
`,
        objectives: [
          'Explain atomic emission and absorption spectra',
          'State and apply Bohr\'s postulates',
          'Calculate energy levels and orbital radii using Bohr\'s formulas',
          'Relate spectral lines to electronic transitions',
          'Understand limitations of Bohr\'s model',
        ],
        keyTerms: [
          { term: 'Stationary Orbit', definition: 'Fixed orbit where electron doesn\'t radiate energy' },
          { term: 'Quantum Number (n)', definition: 'Integer specifying the energy level of an electron' },
          { term: 'Ground State', definition: 'Lowest energy state (n=1) of an atom' },
          { term: 'Excited State', definition: 'Higher energy state (n>1) of an electron' },
          { term: 'Ionization Energy', definition: 'Energy required to completely remove an electron from an atom' },
        ],
      },
    },
    {
      id: 'as-quiz-1',
      title: 'Atomic Structure Fundamentals Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'as-quiz-1',
        title: 'Atomic Structure Fundamentals Quiz',
        description: 'Test your understanding of atomic models, Bohr theory, and spectral lines.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'medium',
        questions: [
          {
            id: 'as-q1',
            type: 'mcq',
            question: 'In Rutherford\'s gold foil experiment, what did the deflection of α-particles indicate?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Electrons are embedded in positive charge',
              'Atom is mostly empty space with dense positive nucleus',
              'Neutrons exist in the nucleus',
              'Electrons revolve in fixed orbits',
            ],
            correctAnswer: 1,
            explanation: 'The fact that most α-particles passed through while few bounced back indicated that the atom is mostly empty space, but has a tiny, dense, positively charged nucleus that caused the deflection.',
          },
          {
            id: 'as-q2',
            type: 'mcq',
            question: 'What is the energy of an electron in the ground state of hydrogen atom?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              '-3.4 eV',
              '-6.8 eV',
              '-13.6 eV',
              '-27.2 eV',
            ],
            correctAnswer: 2,
            explanation: 'Using Eₙ = -13.6/n² eV, for ground state n=1, so E₁ = -13.6/1² = -13.6 eV. This is the ionization energy of hydrogen.',
            hasLatex: true,
          },
          {
            id: 'as-q3',
            type: 'mcq',
            question: 'Which spectral series of hydrogen lies in the visible region?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Lyman series',
              'Balmer series',
              'Paschen series',
              'Brackett series',
            ],
            correctAnswer: 1,
            explanation: 'The Balmer series (transitions ending at n=2) lies in the visible region (400-700 nm). Lyman is UV, while Paschen, Brackett, and Pfund are in IR.',
          },
          {
            id: 'as-q4',
            type: 'mcq',
            question: 'Isotopes of an element have:',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Same mass number, different atomic numbers',
              'Same atomic number, different mass numbers',
              'Different atomic and mass numbers',
              'Same atomic and mass numbers',
            ],
            correctAnswer: 1,
            explanation: 'Isotopes are atoms of the same element (same Z) with different numbers of neutrons (different A). Example: ¹²C, ¹³C, ¹⁴C all have Z=6 but different mass numbers.',
          },
          {
            id: 'as-q5',
            type: 'numerical',
            question: 'Calculate the wavelength (in nm) of radiation emitted when electron in hydrogen atom transitions from n=4 to n=2. (Use: Energy difference = 2.55 eV, hc = 1240 eV·nm)',
            difficulty: 'medium',
            topic: 'physical',
            correctNumerical: 486,
            tolerance: 2,
            unit: 'nm',
            explanation: 'Using λ = hc/ΔE = 1240/2.55 = 486 nm. This is the blue-green line in the Balmer series!',
            hasLatex: true,
          },
        ],
      },
    },
  ],
};
