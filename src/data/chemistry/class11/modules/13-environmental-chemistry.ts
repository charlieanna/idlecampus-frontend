/**
 * Module 13: Environmental Chemistry (Optional)
 */

import type { ChemistryModule } from '../../types';

export const environmentalChemistryModule: ChemistryModule = {
  id: 'class11-environmental',
  slug: 'environmental-chemistry',
  title: 'Environmental Chemistry',
  description: 'Explore environmental pollution, green chemistry, and sustainable practices.',
  icon: 'leaf',
  sequenceOrder: 13,
  estimatedHours: 8,
  topic: 'physical',
  difficulty: 'easy',
  prerequisites: [],
  learningOutcomes: [
    'Understand air pollution (smog, acid rain, greenhouse effect)',
    'Explain water pollution and treatment',
    'Describe soil pollution',
    'Understand ozone depletion and global warming',
    'Learn green chemistry principles',
  ],
  items: [
    {
      id: 'env-lesson-1',
      title: 'Environmental Pollution: Air, Water, and Soil',
      type: 'lesson',
      sequenceOrder: 1,
      data: {
        id: 'env-lesson-1',
        title: 'Environmental Pollution: Air, Water, and Soil',
        sequenceOrder: 1,
        estimatedMinutes: 45,
        content: `
# Environmental Pollution: Air, Water, and Soil

## What is Environmental Chemistry?

**Environmental Chemistry**: Study of chemical processes occurring in the environment and the effects of human activities

**Key concerns**:
- Pollution (air, water, soil)
- Climate change
- Resource depletion
- Ecosystem damage

## Air Pollution

### What is Air Pollution?

Presence of substances in atmosphere in concentrations harmful to humans, animals, plants, or materials

### Major Air Pollutants

**1. Particulate Matter (PM₂.₅, PM₁₀)**
- Solid or liquid particles suspended in air
- **Sources**: Vehicle exhaust, industrial emissions, dust, pollen
- **Effects**: Respiratory diseases, reduced visibility (haze)

**2. Sulfur Dioxide (SO₂)**
- **Sources**: Burning of coal and petroleum (contains sulfur)
$$\\ce{S + O2 -> SO2}$$
- **Effects**: Respiratory irritation, acid rain

**3. Nitrogen Oxides (NOₓ = NO + NO₂)**
- **Sources**: High-temperature combustion (vehicles, power plants)
$$\\ce{N2 + O2 ->[High temp] 2NO}$$
$$\\ce{2NO + O2 -> 2NO2}$$
- **Effects**: Respiratory problems, acid rain, photochemical smog

**4. Carbon Monoxide (CO)**
- **Sources**: Incomplete combustion of fuels
$$\\ce{2C + O2 -> 2CO}$$ (limited oxygen)
- **Effects**: Highly toxic (binds to hemoglobin stronger than O₂)

**5. Hydrocarbons (Unburnt fuel)**
- **Sources**: Vehicle exhaust, petroleum industry
- **Effects**: Carcinogenic (some), precursor to smog

**6. Ozone (O₃) at ground level**
- **Formation**: Photochemical reactions of NOₓ and hydrocarbons
- **Effects**: Respiratory irritant, damages plants

### Smog

**Smog**: Combination of smoke and fog

**Types**:

**1. Classical Smog (London Smog)**
- **Components**: Smoke + SO₂ + fog
- **Conditions**: Cool, humid weather
- **Chemical reactions**:
$$\\ce{SO2 + O2 -> 2SO3}$$
$$\\ce{SO3 + H2O -> H2SO4}$$ (sulfuric acid droplets)
- **Effects**: Respiratory diseases, reduced visibility

**2. Photochemical Smog (Los Angeles Smog)**
- **Components**: NOₓ + hydrocarbons + sunlight
- **Conditions**: Warm, sunny weather with stagnant air
- **Chemical reactions**:
$$\\ce{NO2 ->[Sunlight] NO + O}$$
$$\\ce{O + O2 -> O3}$$ (ozone formation)
- Hydrocarbons react to form peroxyacetyl nitrate (PAN)
- **Effects**: Eye irritation, respiratory problems, damage to plants

### Acid Rain

**Acid Rain**: Precipitation with pH < 5.6 (normal rain pH ≈ 5.6 due to dissolved CO₂)

**Formation**:

**From SO₂**:
$$\\ce{2SO2 + O2 -> 2SO3}$$
$$\\ce{SO3 + H2O -> H2SO4}$$ (sulfuric acid)

**From NOₓ**:
$$\\ce{4NO2 + O2 + 2H2O -> 4HNO3}$$ (nitric acid)

**Effects**:
- **Buildings**: Corrodes marble, limestone
$$\\ce{CaCO3 + H2SO4 -> CaSO4 + H2O + CO2}$$
(Taj Mahal damage!)
- **Aquatic life**: Acidifies lakes and rivers
- **Soil**: Leaches nutrients (Ca²⁺, Mg²⁺), releases toxic Al³⁺
- **Plants**: Damages leaves, stunts growth

**Prevention**:
- Use low-sulfur fuels
- Scrubbers in chimneys (remove SO₂)
- Catalytic converters in vehicles (reduce NOₓ)

## Water Pollution

### What is Water Pollution?

Addition of harmful substances making water unfit for use

### Major Water Pollutants

**1. Pathogens (Microorganisms)**
- **Sources**: Sewage, animal waste
- **Effects**: Waterborne diseases (cholera, typhoid, dysentery)

**2. Organic Matter**
- **Sources**: Sewage, food waste, agricultural runoff
- **Effects**: Consumes dissolved oxygen (kills aquatic life)

**3. Chemical Pollutants**

**a) Heavy Metals** (Pb, Hg, Cd, As)
- **Sources**: Industrial waste, mining
- **Effects**: Toxic, bioaccumulate in food chain
- **Example**: Minamata disease (mercury poisoning from fish)

**b) Pesticides and Herbicides**
- **Sources**: Agricultural runoff
- **Effects**: Toxic to aquatic life, bioaccumulate

**c) Fertilizers (N, P compounds)**
- **Sources**: Agricultural runoff
- **Effects**: Eutrophication

**4. Thermal Pollution**
- **Source**: Power plants, industries discharge hot water
- **Effects**: Reduces dissolved oxygen, harms aquatic life

### Biochemical Oxygen Demand (BOD)

**BOD**: Amount of oxygen required by bacteria to decompose organic matter in water

**Clean water**: BOD < 5 ppm
**Moderately polluted**: BOD = 5-15 ppm
**Highly polluted**: BOD > 15 ppm

**High BOD** → More organic waste → More oxygen consumed → Fish die (hypoxia)

### Eutrophication

**Eutrophication**: Excessive growth of algae due to nutrient enrichment (N, P from fertilizers/sewage)

**Process**:
1. Excess nutrients (nitrates, phosphates) enter water
2. Algal bloom (rapid algae growth)
3. Algae die and decompose
4. Decomposition consumes oxygen
5. Oxygen depletion → Fish death → "Dead zones"

**Example**: Red tides, lake eutrophication

### Water Treatment

**1. Primary Treatment** (Physical)
- Screening: Removes large solids
- Sedimentation: Particles settle out

**2. Secondary Treatment** (Biological)
- Activated sludge process
- Bacteria decompose organic matter
- Aeration provides oxygen

**3. Tertiary Treatment** (Chemical)
- Chlorination: Kills pathogens
$$\\ce{Cl2 + H2O -> HOCl + HCl}$$
(HOCl is disinfectant)
- Ozonation: Alternative disinfection
- Removal of nutrients (N, P)

## Soil Pollution

### What is Soil Pollution?

Contamination of soil by harmful chemicals

### Major Soil Pollutants

**1. Pesticides and Insecticides**
- **Examples**: DDT (dichlorodiphenyltrichloroethane), organophosphates
- **Effects**: Persist in soil, enter food chain, toxic to non-target organisms
- **DDT**: Banned in many countries (bioaccumulation, carcinogenic)

**2. Industrial Waste**
- **Heavy metals** (Pb, Hg, Cd, Cr)
- **Effects**: Toxic, contaminate crops

**3. Plastics**
- **Problem**: Non-biodegradable, persist for hundreds of years
- **Effects**: Soil infertility, harm to animals

**4. Agricultural Chemicals**
- **Fertilizers**: Excess N, P can leach into groundwater
- **Herbicides**: Kill non-target plants

### Effects of Soil Pollution

- Loss of soil fertility
- Contamination of food crops
- Groundwater pollution (leaching)
- Harm to soil microorganisms

### Prevention and Solutions

1. **Reduce pesticide use**: Integrated Pest Management (IPM), biological control
2. **Composting**: Convert organic waste to fertilizer
3. **Phytoremediation**: Use plants to absorb pollutants
4. **Proper disposal**: Hazardous waste treatment
5. **Reduce plastic use**: Biodegradable alternatives

## Key Takeaways

### Air Pollution
1. Major pollutants: PM, SO₂, NOₓ, CO, hydrocarbons, O₃
2. **Smog**: Classical (SO₂ + fog) vs. Photochemical (NOₓ + HC + sunlight)
3. **Acid rain**: pH < 5.6, formed from SO₂ and NOₓ, damages buildings/ecosystems

### Water Pollution
1. Sources: Pathogens, organic matter, chemicals, thermal
2. **BOD**: Measure of organic pollution (high BOD = more pollution)
3. **Eutrophication**: Algal blooms from excess nutrients → oxygen depletion
4. Treatment: Primary (physical), Secondary (biological), Tertiary (chemical)

### Soil Pollution
1. Sources: Pesticides, industrial waste, plastics, fertilizers
2. Effects: Infertility, food contamination, groundwater pollution
3. Solutions: IPM, composting, phytoremediation, reduce plastics
`,
        objectives: [
          'Identify major air pollutants and their sources',
          'Explain formation and effects of smog and acid rain',
          'Describe water pollution, BOD, and eutrophication',
          'Understand water treatment processes',
          'Explain soil pollution and prevention methods',
        ],
        keyTerms: [
          { term: 'Smog', definition: 'Combination of smoke and fog; classical (SO₂) or photochemical (NOₓ + HC)' },
          { term: 'Acid Rain', definition: 'Rain with pH < 5.6, formed from atmospheric SO₂ and NOₓ' },
          { term: 'BOD', definition: 'Biochemical Oxygen Demand; oxygen needed to decompose organic matter' },
          { term: 'Eutrophication', definition: 'Excessive algal growth due to nutrient enrichment, leads to oxygen depletion' },
        ],
      },
    },
    {
      id: 'env-lesson-2',
      title: 'Global Environmental Issues and Green Chemistry',
      type: 'lesson',
      sequenceOrder: 2,
      data: {
        id: 'env-lesson-2',
        title: 'Global Environmental Issues and Green Chemistry',
        sequenceOrder: 2,
        estimatedMinutes: 40,
        content: `
# Global Environmental Issues and Green Chemistry

## Greenhouse Effect and Global Warming

### What is the Greenhouse Effect?

**Greenhouse Effect**: Natural warming of Earth due to atmospheric gases trapping heat

**Mechanism**:
1. **Sunlight** enters atmosphere (shortwave radiation)
2. Earth absorbs energy and **re-emits** as infrared (longwave radiation)
3. **Greenhouse gases** absorb and trap this infrared radiation
4. Atmosphere warms → Earth warms

**Natural greenhouse effect** is essential for life! Without it, Earth would be -18°C (currently +15°C)

### Greenhouse Gases

**Major GHGs** (in order of contribution):

**1. Carbon Dioxide (CO₂)** - 60% of effect
- **Sources**: Fossil fuel combustion, deforestation
- **Atmospheric concentration**: 280 ppm (pre-industrial) → 420 ppm (2024)
- **Residence time**: 100-300 years

**2. Methane (CH₄)** - 20% of effect
- **Sources**: Rice paddies, cattle (ruminants), landfills, natural gas leaks
- **More potent** than CO₂ (25× stronger GHG over 100 years)
- **Residence time**: ~12 years

**3. Nitrous Oxide (N₂O)**
- **Sources**: Fertilizers, industrial processes, fossil fuels
- **Very potent** (298× stronger than CO₂)
- **Residence time**: ~114 years

**4. Chlorofluorocarbons (CFCs)**
- **Sources**: Refrigerants, aerosols (now banned)
- **Extremely potent** (thousands of times stronger than CO₂)
- **Double problem**: GHG + destroys ozone layer

**5. Water Vapor (H₂O)**
- **Natural** GHG (not directly controlled by humans)
- Acts as feedback mechanism (warmer air holds more water vapor → more warming)

### Global Warming

**Global Warming**: Increase in Earth's average temperature due to enhanced greenhouse effect

**Evidence**:
- Average temperature increased by ~1.1°C since pre-industrial times
- Arctic ice melting
- Glaciers retreating
- Sea level rising (thermal expansion + ice melt)

**Effects**:
1. **Climate change**: More extreme weather (hurricanes, droughts, floods)
2. **Sea level rise**: Threatens coastal cities, islands
3. **Ecosystem disruption**: Species extinction, coral bleaching
4. **Agricultural impact**: Changing crop zones, water scarcity
5. **Health issues**: Heat stress, disease spread

**Solutions**:
- Reduce fossil fuel use (switch to renewables: solar, wind)
- Energy efficiency
- Reforestation (trees absorb CO₂)
- Carbon capture and storage (CCS)
- International cooperation (Paris Agreement - limit warming to 1.5-2°C)

## Ozone Layer Depletion

### What is the Ozone Layer?

**Ozone layer**: Region in stratosphere (15-35 km altitude) with high O₃ concentration

**Function**: Absorbs 97-99% of harmful UV-B radiation from sun

$$\\ce{O2 ->[UV] 2O}$$
$$\\ce{O + O2 -> O3}$$ (ozone formation)

**UV absorption**:
$$\\ce{O3 ->[UV] O2 + O}$$
$$\\ce{O + O3 -> 2O2}$$

Natural balance: Formation = Destruction

### Ozone Hole

**Ozone hole**: Severe depletion of O₃ over Antarctica (discovered 1985)

**Cause**: Chlorofluorocarbons (CFCs) and other ozone-depleting substances (ODS)

**Examples of CFCs**:
- **CFCl₃** (CFC-11, Freon-11) - refrigerant
- **CF₂Cl₂** (CFC-12, Freon-12) - aerosol propellant

### Mechanism of Ozone Depletion by CFCs

**Step 1**: CFCs released, rise to stratosphere (very stable, long lifetime)

**Step 2**: UV breaks C-Cl bond
$$\\ce{CF2Cl2 ->[UV] CF2Cl• + Cl•}$$

**Step 3**: Cl• attacks ozone (catalytic cycle)
$$\\ce{Cl• + O3 -> ClO• + O2}$$
$$\\ce{ClO• + O -> Cl• + O2}$$

**Net reaction**: $$\\ce{O3 + O -> 2O2}$$

**Key**: Cl• is regenerated (catalytic) → One Cl• can destroy 100,000 O₃ molecules!

### Effects of Ozone Depletion

1. **UV-B radiation increases**
2. **Human health**: Skin cancer, cataracts, immune suppression
3. **Ecosystems**: Damages phytoplankton (base of marine food chain), crops
4. **Materials**: Degrades plastics, paints

### Montreal Protocol (1987)

**International agreement** to phase out CFCs and other ODS

**Success**:
- CFC production banned globally
- Ozone layer recovering slowly
- Expected to return to 1980 levels by 2050-2070

**Replacements**:
- **HFCs** (hydrofluorocarbons): Don't harm ozone, but are GHGs
- **Ammonia, CO₂**: Natural refrigerants

## Green Chemistry

### What is Green Chemistry?

**Green Chemistry**: Design of chemical products and processes that reduce or eliminate hazardous substances

**Goal**: Sustainable chemistry - economically viable, environmentally benign, socially beneficial

### 12 Principles of Green Chemistry

**1. Waste Prevention**
- Better to prevent waste than to treat/clean up after

**2. Atom Economy**
- Design syntheses to maximize incorporation of all materials into final product
- Minimize byproducts

**3. Less Hazardous Chemical Syntheses**
- Use and generate substances with little or no toxicity

**4. Designing Safer Chemicals**
- Design products effective yet minimally toxic

**5. Safer Solvents and Auxiliaries**
- Avoid solvents, separation agents when possible
- Use water as solvent (benign)

**6. Design for Energy Efficiency**
- Minimize energy requirements
- Conduct reactions at ambient temperature/pressure when possible

**7. Use of Renewable Feedstocks**
- Use renewable raw materials (biomass) instead of depleting resources (petroleum)

**8. Reduce Derivatives**
- Avoid unnecessary derivatization (protecting groups, etc.)
- Reduces waste and steps

**9. Catalysis**
- Catalytic reagents better than stoichiometric
- More selective, less waste

**10. Design for Degradation**
- Products should break down to harmless substances after use
- Don't persist in environment

**11. Real-time Analysis for Pollution Prevention**
- Monitor reactions in real-time to prevent formation of hazardous substances

**12. Inherently Safer Chemistry for Accident Prevention**
- Choose substances and processes to minimize risk of explosions, fires, releases

### Examples of Green Chemistry

**1. Supercritical CO₂ as Solvent**
- Replaces toxic organic solvents
- Used in decaffeination, dry cleaning

**2. Water as Solvent**
- Aqueous reactions instead of organic solvents

**3. Biocatalysis**
- Use enzymes as catalysts (highly selective, mild conditions)

**4. Biodegradable Plastics**
- PLA (polylactic acid) from corn starch
- Degrades to lactic acid

**5. Atom-Efficient Reactions**
- Click chemistry (high yield, minimal byproducts)

## Sustainable Practices

**Individual level**:
- Reduce, Reuse, Recycle (3Rs)
- Conserve energy (LED bulbs, turn off lights)
- Use public transport, carpool
- Reduce plastic use
- Conserve water

**Industrial level**:
- Cleaner production technologies
- Waste minimization
- Energy efficiency
- Use renewable energy
- Circular economy (reuse materials)

**Government level**:
- Environmental regulations
- Carbon pricing/taxes
- Incentives for green technology
- Protected areas
- International cooperation

## Key Takeaways

### Greenhouse Effect and Global Warming
1. **Greenhouse effect**: Natural (good) but enhanced by human GHG emissions
2. **Major GHGs**: CO₂ (60%), CH₄ (20%), N₂O, CFCs
3. **Global warming**: 1.1°C increase, causing climate change, sea level rise
4. **Solutions**: Reduce fossil fuels, renewables, reforestation, Paris Agreement

### Ozone Layer
1. **Ozone layer**: Stratospheric O₃, absorbs UV-B radiation
2. **Ozone depletion**: CFCs release Cl• → destroys O₃ (catalytic)
3. **Effects**: Skin cancer, cataracts, ecosystem damage
4. **Solution**: Montreal Protocol (1987) - CFC phase-out, successful!

### Green Chemistry
1. **12 principles**: Waste prevention, atom economy, safer chemicals, catalysis, degradability
2. **Examples**: Supercritical CO₂, water solvent, biocatalysis, biodegradable plastics
3. **Goal**: Sustainable chemistry - environmental, economic, social benefits

### Take Action!
- Reduce energy use, recycle, use public transport
- Support green technologies and policies
- Every individual action matters!
`,
        objectives: [
          'Explain greenhouse effect and global warming',
          'Identify greenhouse gases and their sources',
          'Understand ozone layer depletion mechanism',
          'Describe Montreal Protocol and its success',
          'Apply principles of green chemistry',
          'Promote sustainable practices',
        ],
        keyTerms: [
          { term: 'Greenhouse Effect', definition: 'Warming of Earth due to atmospheric gases trapping infrared radiation' },
          { term: 'Global Warming', definition: 'Increase in Earth\'s average temperature due to enhanced greenhouse effect' },
          { term: 'Ozone Layer', definition: 'Stratospheric region with high O₃ concentration, absorbs UV radiation' },
          { term: 'CFCs', definition: 'Chlorofluorocarbons; refrigerants that deplete ozone layer catalytically' },
          { term: 'Green Chemistry', definition: 'Design of products and processes that minimize hazardous substances' },
        ],
      },
    },
    {
      id: 'env-quiz-1',
      title: 'Environmental Chemistry Quiz',
      type: 'quiz',
      sequenceOrder: 3,
      data: {
        id: 'env-quiz-1',
        title: 'Environmental Chemistry Quiz',
        description: 'Test your understanding of environmental issues and green chemistry.',
        passingScore: 70,
        maxAttempts: 3,
        difficulty: 'easy',
        questions: [
          {
            id: 'env-q1',
            type: 'mcq',
            question: 'Which of the following is the primary cause of acid rain?',
            difficulty: 'easy',
            topic: 'physical',
            options: [
              'Carbon dioxide (CO₂) from respiration',
              'Sulfur dioxide (SO₂) and nitrogen oxides (NOₓ) from fossil fuel combustion',
              'Methane (CH₄) from livestock',
              'Ozone (O₃) in the atmosphere'
            ],
            correctAnswer: 1,
            explanation: 'SULFUR DIOXIDE (SO₂) AND NITROGEN OXIDES (NOₓ) from fossil fuel combustion are the primary causes of acid rain. When coal and petroleum (which contain sulfur) are burned, SO₂ is released. High-temperature combustion in vehicles and power plants produces NOₓ. These gases undergo reactions in the atmosphere: SO₂ + O₂ → SO₃, then SO₃ + H₂O → H₂SO₄ (sulfuric acid). Similarly, NOₓ reacts with water to form HNO₃ (nitric acid). Normal rain is slightly acidic (pH 5.6) due to dissolved CO₂, but acid rain has pH < 5.6. Effects include: (1) Corroding marble and limestone buildings (Taj Mahal damage), (2) Acidifying lakes and rivers (kills aquatic life), (3) Leaching soil nutrients and releasing toxic Al³⁺, (4) Damaging plant leaves. Prevention involves using low-sulfur fuels, scrubbers in chimneys, and catalytic converters in vehicles.',
          },
          {
            id: 'env-q2',
            type: 'mcq',
            question: 'Photochemical smog is formed from the reaction of:',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'SO₂ + fog in cool weather',
              'NOₓ + hydrocarbons + sunlight',
              'CO₂ + water vapor',
              'Methane + ozone'
            ],
            correctAnswer: 1,
            explanation: 'Photochemical smog is formed from NOₓ + HYDROCARBONS + SUNLIGHT. This type of smog (Los Angeles smog) forms in warm, sunny conditions with stagnant air. The mechanism: (1) NO₂ absorbs sunlight and breaks down: NO₂ → NO + O. (2) Atomic oxygen reacts with O₂ to form ozone: O + O₂ → O₃. (3) Hydrocarbons (unburnt fuel from vehicles) react with NOₓ and O₃ to form peroxyacetyl nitrate (PAN) and other irritants. The result is a brownish haze with high O₃ levels at ground level (bad ozone - respiratory irritant). Effects include eye irritation, respiratory problems, and damage to plants. This contrasts with classical smog (London smog) which forms from SO₂ + smoke + fog in cool, humid conditions. Photochemical smog is worse in cities with heavy traffic and sunny climate (Los Angeles, Mexico City, Beijing).',
          },
          {
            id: 'env-q3',
            type: 'mcq',
            question: 'High BOD (Biochemical Oxygen Demand) in water indicates:',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Clean water with low pollution',
              'High level of organic pollution',
              'Presence of heavy metals',
              'High temperature of water'
            ],
            correctAnswer: 1,
            explanation: 'High BOD indicates HIGH LEVEL OF ORGANIC POLLUTION in water. BOD (Biochemical Oxygen Demand) is the amount of oxygen required by bacteria to decompose organic matter in water. When organic waste (sewage, food waste, agricultural runoff) enters water, aerobic bacteria use dissolved oxygen to break it down. The more organic waste present, the more oxygen is consumed. Clean water: BOD < 5 ppm (parts per million of O₂). Moderately polluted: BOD = 5-15 ppm. Highly polluted: BOD > 15 ppm. HIGH BOD is bad because: (1) Organic waste consumes oxygen during decomposition, (2) Dissolved oxygen levels drop, (3) Fish and aquatic organisms die from hypoxia (oxygen starvation), (4) Water becomes anaerobic (smelly, toxic). BOD is a key indicator for assessing water quality and the effectiveness of wastewater treatment. It specifically measures organic pollution, not heavy metals (which require different tests) or thermal pollution.',
          },
          {
            id: 'env-q4',
            type: 'mcq',
            question: 'Eutrophication of water bodies is caused by:',
            difficulty: 'medium',
            topic: 'physical',
            options: [
              'Thermal pollution from power plants',
              'Excess nutrients (nitrogen and phosphorus) from fertilizers',
              'Oil spills from ships',
              'Heavy metal contamination'
            ],
            correctAnswer: 1,
            explanation: 'Eutrophication is caused by EXCESS NUTRIENTS (NITROGEN AND PHOSPHORUS) from fertilizers and sewage. Eutrophication is the process of nutrient enrichment leading to excessive algal growth. The mechanism: (1) Excess nitrates and phosphates enter water bodies through agricultural runoff or untreated sewage, (2) These nutrients fuel rapid algae growth (algal bloom), often visible as green scum on water surface, (3) Algae eventually die and sink, (4) Aerobic bacteria decompose the dead algae, consuming large amounts of dissolved oxygen, (5) Oxygen depletion creates "dead zones" where fish and other aquatic life cannot survive, (6) The water becomes foul-smelling and unusable. Effects include: Loss of biodiversity, fish kills, toxins from some algae (harmful algal blooms like red tides), foul odor, and loss of recreational/economic value. Prevention involves: Reducing fertilizer use, treating sewage before discharge, creating buffer zones near water bodies, and controlling phosphate in detergents. Eutrophication is a major global problem affecting lakes, rivers, and coastal areas.',
          },
          {
            id: 'env-q5',
            type: 'mcq',
            question: 'The primary greenhouse gas responsible for global warming is:',
            difficulty: 'easy',
            topic: 'physical',
            options: ['Methane (CH₄)', 'Carbon dioxide (CO₂)', 'Nitrous oxide (N₂O)', 'Ozone (O₃)'],
            correctAnswer: 1,
            explanation: 'CARBON DIOXIDE (CO₂) is the PRIMARY greenhouse gas responsible for global warming, contributing about 60% of the enhanced greenhouse effect. Sources include: (1) Fossil fuel combustion (coal, oil, natural gas) for electricity, transportation, and industry, (2) Deforestation (trees absorb CO₂; when cut, CO₂ is released and absorption capacity lost). Atmospheric CO₂ has increased from 280 ppm (pre-industrial) to 420 ppm (2024) - a 50% increase. CO₂ traps infrared radiation emitted by Earth, warming the atmosphere. Although methane (CH₄) is 25× more potent as a GHG, and N₂O is 298× more potent, CO₂ is emitted in much larger quantities and has a long residence time (100-300 years), making it the main driver of climate change. The greenhouse effect is natural and necessary (without it, Earth would be -18°C instead of +15°C), but human-enhanced GHG emissions are causing global temperatures to rise by 1.1°C, leading to climate disruption, sea level rise, extreme weather, and ecosystem damage.',
          },
          {
            id: 'env-q6',
            type: 'mcq',
            question: 'Chlorofluorocarbons (CFCs) cause ozone depletion because:',
            difficulty: 'hard',
            topic: 'physical',
            options: [
              'They directly absorb UV radiation',
              'They release chlorine atoms (Cl•) that catalytically destroy ozone',
              'They react with oxygen to form CO₂',
              'They are heavier than ozone molecules'
            ],
            correctAnswer: 1,
            explanation: 'CFCs cause ozone depletion because they RELEASE CHLORINE ATOMS (Cl•) that CATALYTICALLY DESTROY OZONE. The mechanism: (1) CFCs (like CFCl₃ and CF₂Cl₂) used in refrigerants and aerosols are very stable and rise to the stratosphere unchanged. (2) In the stratosphere, UV radiation breaks the C-Cl bond: CF₂Cl₂ + UV → CF₂Cl• + Cl•. (3) The free chlorine atom attacks ozone in a catalytic cycle: Cl• + O₃ → ClO• + O₂, then ClO• + O → Cl• + O₂. Net reaction: O₃ + O → 2O₂. (4) CRITICAL: The Cl• is regenerated, so one chlorine atom can destroy up to 100,000 ozone molecules before being removed! This is why CFCs are so damaging despite being released in relatively small quantities. Effects of ozone depletion include increased UV-B radiation reaching Earth, causing skin cancer, cataracts, immune suppression, damage to phytoplankton, and crop damage. The Montreal Protocol (1987) successfully banned CFCs globally, and the ozone layer is slowly recovering. This is considered one of the most successful international environmental agreements.',
          },
        ],
      },
    },
  ],
};
