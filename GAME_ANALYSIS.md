# Pixel Shaman - Game Analysis

## Executive Summary

**Pixel Shaman** is a web-based procedurally generated pixel physics game inspired by Noita. The current implementation provides a foundation with infinite world generation using all 118 periodic table elements, but lacks the complex physics simulation and spell system that define the Noita-like experience.

---

## Table of Contents

1. [Game Concept Overview](#game-concept-overview)
2. [Current Implementation Analysis](#current-implementation-analysis)
3. [Feature Comparison: Planned vs Implemented](#feature-comparison-planned-vs-implemented)
4. [Technical Architecture](#technical-architecture)
5. [Physics System Design (Planned)](#physics-system-design-planned)
6. [Spell System Design (Planned)](#spell-system-design-planned)
7. [Development Roadmap](#development-roadmap)
8. [Performance Considerations](#performance-considerations)

---

## Game Concept Overview

### Core Philosophy
Pixel Shaman is designed as a **falling sand simulation** meets **action-roguelike**, where:
- Every pixel has physical properties (flammable, conductive, explosive, liquid)
- Emergent gameplay arises from complex elemental interactions
- Procedural generation ensures unique experiences
- Spell crafting and wand customization drive player progression

### Inspiration: Noita-like Elements
The game draws heavily from Noita's design pillars:
1. **Pixel-perfect physics simulation**
2. **Spell combination system**
3. **Status effect complexity**
4. **Procedural world generation**
5. **High-stakes permadeath gameplay**

---

## Current Implementation Analysis

### ✅ What's Implemented

#### 1. **Procedural World Generation**
```javascript
class TerrainGenerator {
    constructor(seed = 0)
    getTile(x, y) // Returns element based on Perlin noise
}
```

**Features:**
- **118 Periodic Elements**: Complete periodic table with unique colors
- **Perlin Noise Generation**: 4-octave noise for organic terrain
- **Infinite World**: Tile-based generation on-demand
- **Caching System**: Map cache for performance (`Map<string, Element>`)
- **Element Groups**: 10 element categories (alkali, noble_gas, transition, etc.)

**Element Properties:**
```javascript
{
    symbol: 'Au',
    name: 'Gold',
    color: 'rgb(255, 200, 0)',
    group: 'transition',
    state: 'solid'  // gas, liquid, or solid
}
```

#### 2. **Shaman Character System**
```javascript
class Shaman {
    x, y              // Position
    vx, vy            // Velocity
    speed: 100        // Movement speed
    particles[]       // Particle trail
}
```

**Features:**
- **WASD/Arrow Movement**: 8-directional with diagonal normalization
- **Particle Trail**: Magical particles with gravity and lifetime
- **Camera Follow**: Centered on player

#### 3. **Particle System**
```javascript
class Particle {
    lifetime: 0.5
    update(dt) {
        this.vy += 100 * dt  // Gravity
    }
}
```

**Features:**
- Physics-based particles (velocity, gravity)
- Alpha fade-out over lifetime
- Multiple color variations (purple, gold, green)

#### 4. **Rendering Engine**
- **Tile-Based Rendering**: 3.2px tiles with glowing borders
- **State-Based Effects**: Gas (brighter), Liquid (darker), Solid (normal)
- **Group-Based Glows**: Different glow colors per element group
- **FPS Counter**: Performance monitoring
- **Full-Screen Canvas**: Responsive to window resize

#### 5. **Performance Optimizations**
- **Viewport Culling**: Only renders visible tiles
- **Tile Caching**: Prevents redundant noise calculations
- **Pixelated Rendering**: `image-rendering: crisp-edges`

---

### ❌ What's Missing (Compared to Concept)

#### 1. **Pixel Physics Simulation**
**Planned Features:**
- Flammable materials (wood, oil)
- Fire propagation
- Water simulation (flow, evaporation)
- Electricity conduction through metals
- Explosions
- Gas dispersion
- Poison dilution
- Chemical reactions

**Current State:**
- Elements are purely cosmetic
- No pixel interactions
- No state changes

#### 2. **Spell System**
**Planned Features:**
- Wand stats (cast delay, recharge, mana)
- Spell types (projectiles, modifiers, utility)
- Spell combinations (Homing + Explosion + Bounce)
- Trigger/Timer systems
- Multicast mechanics
- Always Cast modifiers

**Current State:**
- No wands
- No spells
- No casting mechanics

#### 3. **Combat System**
**Planned Features:**
- Health points (starting 100 HP)
- Enemies
- Damage calculation
- Projectile collision

**Current State:**
- No health
- No enemies
- No combat

#### 4. **Status Effects**
**Planned Features:**
- Burning 🔥
- Wet 💧
- Electrified ⚡
- Poisoned 🧪
- Frozen 🧊
- Bleeding 🩸
- Status combinations (wet + electricity = shock)

**Current State:**
- No status effects

#### 5. **Perks System**
**Planned Features:**
- Edit Wands Everywhere
- Explosion Immunity
- Vampirism
- Greed (2x gold)
- Saving Grace
- Trick Blood Money

**Current State:**
- No perks

#### 6. **Level Structure**
**Planned Features:**
- Kohlenmine (Coal Mine)
- Schmiede (Forge)
- Schneegebirge (Snow Mountains)
- Heiliges Gebirge (Holy Mountain) safe rooms
- Lab
- Götterland (God Realm)

**Current State:**
- Homogeneous infinite terrain
- No biomes
- No rooms or structures

---

## Feature Comparison: Planned vs Implemented

| Feature | Planned | Implemented | Completeness |
|---------|---------|-------------|--------------|
| **Pixel Physics** | Full simulation | None | 0% |
| **Fire Propagation** | Realistic spread | None | 0% |
| **Water Physics** | Flow + extinguish | None | 0% |
| **Electricity** | Metal conduction | None | 0% |
| **Explosions** | Chain reactions | None | 0% |
| **Terrain Generation** | Infinite procedural | ✅ Complete | 100% |
| **Character Movement** | 8-directional | ✅ Complete | 100% |
| **Particle System** | Advanced VFX | Basic trail | 30% |
| **Wand System** | Complex stats | None | 0% |
| **Spell Crafting** | Combinations | None | 0% |
| **Health/Damage** | HP + status effects | None | 0% |
| **Perks** | ~15 perks | None | 0% |
| **Biomes** | 7+ unique zones | None | 0% |
| **Enemies** | Varied AI | None | 0% |
| **Safe Rooms** | Shops + healing | None | 0% |

**Overall Completion: ~15%**

---

## Technical Architecture

### Class Hierarchy

```
Game (Main Loop)
├── TerrainGenerator
│   └── PerlinNoise
├── Shaman
│   └── Particle[]
└── Canvas/Rendering
```

### Data Flow

```
User Input → Shaman.keys{}
         ↓
Shaman.update(dt) → Position changes
         ↓
Game.update(dt) → World state
         ↓
Game.draw() → Canvas rendering
         ↓
requestAnimationFrame → Loop
```

### Key Algorithms

#### 1. **Perlin Noise Generation**
```javascript
// Multi-octave noise for organic terrain
for (let i = 0; i < 4; i++) {
    height += amplitude * noise(x/100 * frequency, y/100 * frequency)
    amplitude *= 0.5
    frequency *= 2
}
```

**Parameters:**
- **Octaves**: 4
- **Base Scale**: 1/100 (large features)
- **Persistence**: 0.5 (amplitude decay)
- **Lacunarity**: 2.0 (frequency increase)

#### 2. **Viewport Culling**
```javascript
startTileX = floor(cameraX / tileSize)
endTileX = startTileX + ceil(width / tileSize) + 2
```

Only renders tiles visible in viewport +2 tile buffer.

#### 3. **Hash-Based Tile Selection**
```javascript
elementIndex = floor(abs(height * 100) % 118)
```

Maps noise value (-1 to 1) to element index (0-117).

---

## Physics System Design (Planned)

### Pixel Properties

Each pixel should have:
```javascript
{
    element: Element,
    state: 'solid' | 'liquid' | 'gas',
    temperature: number,
    velocity: {x, y},
    lifetime: number,
    properties: {
        flammable: boolean,
        conductive: boolean,
        explosive: boolean,
        density: number,
        viscosity: number
    }
}
```

### Element Interactions

#### Fire + Materials
```
Wood + Fire → Fire (spreads)
Oil + Fire → Fire (fast spread)
Water + Fire → Steam + extinguish
Metal + Fire → Heat (no combustion)
```

#### Electricity
```
Metal → Conducts
Water (with impurities) → Conducts
Wet Player + Electricity → Electrified status
```

#### Chemical Reactions
```
Poison + Water → Diluted Poison
Alkali + Water → Heat + Gas
Uranium + Impact → Explosion
```

### Cellular Automata Rules

**Fire Spread (example):**
```javascript
if (pixel.burning && neighbor.flammable) {
    if (random() < neighbor.ignitionChance) {
        neighbor.burning = true
        neighbor.lifetime = neighbor.burnDuration
    }
}
```

**Liquid Flow:**
```javascript
if (pixel.state === 'liquid') {
    if (below.empty) {
        swap(pixel, below)
    } else if (belowLeft.empty || belowRight.empty) {
        swap(pixel, random([belowLeft, belowRight]))
    }
}
```

### Optimization Strategy

**Challenge**: Simulating thousands of pixels per frame

**Solutions:**
1. **Dirty Rectangle**: Only update changed regions
2. **Sleep State**: Inactive pixels marked as "sleeping"
3. **Chunk-Based Updates**: Divide world into 32x32 chunks
4. **Worker Threads**: Offload physics to Web Workers
5. **GPU Acceleration**: Use WebGL shaders for parallel updates

---

## Spell System Design (Planned)

### Wand Structure

```javascript
class Wand {
    stats: {
        castDelay: number,        // Time between casts
        rechargeTime: number,     // Time before next burst
        mana: number,             // Max mana
        manaRecharge: number,     // Mana/sec
        spread: number,           // Projectile spread (degrees)
        spellsPerCast: number,    // Multi-shot
        shuffle: boolean          // Random vs sequential
    },
    spells: Spell[],
    alwaysCast: Spell[]
}
```

### Spell Types

#### 1. Projectiles
```javascript
{
    type: 'projectile',
    damage: 10,
    speed: 300,
    lifetime: 2.0,
    visual: 'fireball'
}
```

Examples:
- Magic Arrow
- Fireball
- Lightning Bolt
- Energy Orb

#### 2. Modifiers
```javascript
{
    type: 'modifier',
    effect: 'homing',
    strength: 0.5
}
```

Examples:
- Homing
- Explosion on impact
- Bounce
- Pierce
- Faster/Slower
- Larger/Smaller

#### 3. Triggers
```javascript
{
    type: 'trigger',
    condition: 'on_impact',
    spells: [explosion, blackHole]
}
```

Examples:
- Trigger on impact
- Timer trigger
- Death trigger
- Collision trigger

#### 4. Utility
- Teleport
- Shield
- Heal
- Levitation
- Slow Time

### Spell Combination Examples

#### Simple Combo
```
Fireball + Homing + Damage Up
→ Tracking fireball with increased damage
```

#### Advanced Combo
```
Trigger → Timer(1s) → [
    Black Hole + Damage Up,
    Explosion + Chain Reaction
]
→ Fires projectile that after 1s creates black hole + explosion
```

#### Chainsaw Trick
```
Chainsaw (reduces cast delay to near-zero) +
Rapid Fire +
Damage Modifier +
Unlimited Spells
→ Machine gun wand
```

### Mana Calculation

```javascript
function canCast(wand, spell) {
    const cost = spell.manaCost
    const drainMultiplier = wand.manaDrain
    const totalCost = cost * drainMultiplier

    return wand.currentMana >= totalCost
}
```

### Spell Execution Order

```
1. Check mana
2. Apply Always Cast spells
3. Execute spell chain (shuffle or sequential)
4. Apply modifiers to projectiles
5. Trigger physics interactions
6. Start cooldown timer
```

---

## Development Roadmap

### Phase 1: Core Physics (High Priority)
**Goal**: Make elements interactive

- [ ] Implement pixel grid system (replace tile-based)
- [ ] Add gravity simulation for loose particles
- [ ] Implement liquid flow (water, oil)
- [ ] Add fire propagation
- [ ] Create burning mechanic
- [ ] Implement water extinguishing fire
- [ ] Add electricity conduction

**Estimated Time**: 4-6 weeks

### Phase 2: Combat Foundation
**Goal**: Add basic combat

- [ ] Health system (100 HP)
- [ ] Projectile spawning
- [ ] Collision detection
- [ ] Damage calculation
- [ ] Simple enemy AI
- [ ] Death/respawn mechanics

**Estimated Time**: 2-3 weeks

### Phase 3: Wand System
**Goal**: Implement spell casting

- [ ] Wand data structure
- [ ] Basic projectile spells (3-5)
- [ ] Cast delay/recharge mechanics
- [ ] Mana system
- [ ] Wand inventory UI
- [ ] Spell modifier system (3-5)

**Estimated Time**: 3-4 weeks

### Phase 4: Status Effects
**Goal**: Add complexity to combat

- [ ] Burning status
- [ ] Wet status
- [ ] Electrified status
- [ ] Poisoned status
- [ ] Status interaction system
- [ ] Visual indicators

**Estimated Time**: 2 weeks

### Phase 5: Advanced Spells
**Goal**: Enable spell combinations

- [ ] Trigger spells
- [ ] Timer spells
- [ ] Multicast system
- [ ] Always Cast mechanics
- [ ] 10+ total spell types
- [ ] Spell combination logic

**Estimated Time**: 3-4 weeks

### Phase 6: World Structure
**Goal**: Create distinct biomes

- [ ] Biome system architecture
- [ ] Coal Mine biome
- [ ] Forge biome (lava, metal)
- [ ] Snow Mountains (ice physics)
- [ ] Holy Mountain safe rooms
- [ ] Shop system
- [ ] Biome transitions

**Estimated Time**: 4-5 weeks

### Phase 7: Perks & Progression
**Goal**: Meta-progression

- [ ] Perk selection UI
- [ ] 15+ perks implementation
- [ ] Perk interaction system
- [ ] Gold/currency system
- [ ] Perk balancing

**Estimated Time**: 2-3 weeks

### Phase 8: Polish & Balance
**Goal**: Playable game

- [ ] Enemy variety (10+ types)
- [ ] Boss encounters
- [ ] Sound effects
- [ ] Music
- [ ] Particle VFX improvements
- [ ] Performance optimization
- [ ] Balance tuning
- [ ] Save/load system

**Estimated Time**: 4-6 weeks

**Total Estimated Development Time**: 24-35 weeks (~6-9 months)

---

## Performance Considerations

### Current Performance
- **FPS**: ~60 FPS on modern hardware
- **Tile Rendering**: Efficient viewport culling
- **Memory**: Low (only visible tiles cached)

### Future Challenges

#### 1. **Pixel Physics at Scale**
**Problem**: Simulating 1920x1080 = 2,073,600 pixels at 60 FPS

**Solutions**:
```javascript
// Chunk-based updates (only active chunks)
const chunkSize = 32
const activeChunks = new Set()

function updatePhysics() {
    for (chunk of activeChunks) {
        updateChunk(chunk)
    }
}
```

#### 2. **Collision Detection**
**Problem**: Every projectile checking every pixel

**Solution**: Spatial hash grid
```javascript
class SpatialGrid {
    cellSize = 16
    cells = new Map()

    getNearby(x, y, radius) {
        // Only check cells in radius
        const cellX = floor(x / cellSize)
        const cellY = floor(y / cellSize)
        return cells.get(`${cellX},${cellY}`)
    }
}
```

#### 3. **Particle Count**
**Current**: ~20 particles
**With fire/explosions**: Could be 1000+

**Solution**: Object pooling
```javascript
class ParticlePool {
    pool = []
    maxSize = 1000

    get() {
        return pool.pop() || new Particle()
    }

    release(particle) {
        if (pool.length < maxSize) {
            pool.push(particle.reset())
        }
    }
}
```

#### 4. **WebGL Acceleration**
For pixel physics, consider WebGL shaders:
```glsl
// Fragment shader for cellular automata
void main() {
    vec2 pixel = gl_FragCoord.xy;
    vec4 current = texture2D(worldState, pixel);
    vec4 below = texture2D(worldState, pixel + vec2(0, 1));

    // Apply physics rules
    if (current.r > 0.5 && below.r < 0.5) {
        // Swap liquid pixel with air below
        gl_FragColor = below;
    } else {
        gl_FragColor = current;
    }
}
```

---

## Code Quality Assessment

### Strengths
1. **Clean OOP Structure**: Well-organized classes
2. **Perlin Noise Implementation**: Solid procedural generation
3. **Viewport Culling**: Good performance optimization
4. **Responsive Design**: Full-screen canvas with resize handling
5. **Cache System**: Prevents redundant calculations

### Areas for Improvement

#### 1. **Type Safety**
**Current**: Pure JavaScript
**Recommendation**: Migrate to TypeScript

```typescript
interface Element {
    symbol: string
    name: string
    color: string
    group: ElementGroup
    state: PhysicsState
}

type ElementGroup = 'alkali' | 'noble_gas' | 'transition' | ...
type PhysicsState = 'solid' | 'liquid' | 'gas'
```

#### 2. **Magic Numbers**
**Current**: Hardcoded values
```javascript
this.tileSize = 3.2
this.speed = 100
this.vy += 100 * dt  // Gravity
```

**Recommendation**: Constants file
```javascript
const GAME_CONFIG = {
    TILE_SIZE: 3.2,
    PLAYER_SPEED: 100,
    GRAVITY: 100,
    PARTICLE_LIFETIME: 0.5,
    NOISE_OCTAVES: 4
}
```

#### 3. **Event System**
**Current**: Direct key polling
**Recommendation**: Input manager

```javascript
class InputManager {
    bindings = {
        'moveUp': ['w', 'ArrowUp'],
        'moveDown': ['s', 'ArrowDown'],
        'cast': ['Space', 'Mouse1']
    }

    isActionPressed(action) {
        return bindings[action].some(key => pressedKeys[key])
    }
}
```

#### 4. **State Management**
**Future needs**: Game states (menu, playing, paused, dead)

```javascript
class GameStateManager {
    states = {
        menu: new MenuState(),
        playing: new PlayingState(),
        paused: new PausedState()
    }
    current = 'menu'

    update(dt) {
        states[current].update(dt)
    }
}
```

---

## Element Interaction Matrix (Planned)

| Element A | Element B | Result |
|-----------|-----------|--------|
| Fire | Wood | Wood → Fire (burns) |
| Fire | Water | Fire → Steam (extinguish) |
| Fire | Oil | Oil → Fire (fast spread) |
| Electricity | Metal | Conducts freely |
| Electricity | Water | Conducts (player damage if wet) |
| Explosion | Any | Pushes pixels outward |
| Acid | Metal | Corrodes over time |
| Lava | Water | Obsidian + Steam |
| Ice | Fire | Melts → Water |
| Uranium | Impact | Nuclear explosion |

---

## Conclusion

### Current State
Pixel Shaman has a **solid foundation** with:
- Beautiful procedural terrain using the periodic table
- Smooth character movement
- Basic particle effects
- Optimized rendering

### Gap to Vision
The game is **~15% complete** toward the Noita-inspired vision. Major systems needed:
1. **Pixel physics simulation** (most critical)
2. **Spell crafting system** (core gameplay)
3. **Combat mechanics** (enemies, damage)
4. **Biome variety** (world structure)

### Next Critical Step
**Implement pixel-level physics**. Without this, the game cannot deliver on its core promise of emergent, chaotic elemental interactions.

### Recommendation
Focus development in this order:
1. Convert from tile-based to pixel-based rendering
2. Implement basic physics (gravity, liquids, fire)
3. Add simple combat (health, projectiles, one enemy type)
4. Build minimal wand system (3 spells + 2 modifiers)
5. Iterate based on gameplay feel

---

## Appendix: Element Statistics

### Element Distribution by State
- **Solids**: 90 elements (76.3%)
- **Gases**: 25 elements (21.2%)
- **Liquids**: 3 elements (2.5%) - Bromine, Mercury, Gallium

### Element Distribution by Group
- **Transition Metals**: 38 elements (32.2%)
- **Lanthanides**: 15 elements (12.7%)
- **Actinides**: 15 elements (12.7%)
- **Alkali Metals**: 6 elements (5.1%)
- **Noble Gases**: 7 elements (5.9%)
- **Halogens**: 6 elements (5.1%)
- **Other**: 31 elements (26.3%)

### Visual Palette
The game uses **118 unique RGB colors**, creating a vibrant, mystical aesthetic:
- Golds (Au, He, Na): Precious/noble
- Purples (Noble gases): Ethereal
- Greens (U, N, Cl): Radioactive/toxic
- Reds (Fe, Li, Fr): Reactive/energetic

---

**Document Version**: 1.0
**Last Updated**: 2025-11-14
**Game Version**: Pre-Alpha 0.1
