# Pixel Shaman - Elemental Chaos

A Noita-inspired pixel physics sandbox game with spell crafting, procedural generation, and emergent gameplay.

## Features

### 🔬 Pixel Physics Simulation
- **20+ Materials** with unique properties (solid, liquid, gas, powder)
- **Cellular Automata** physics engine
- **Elemental Interactions**:
  - Fire spreads and ignites flammable materials
  - Water extinguishes fire and creates steam
  - Electricity conducts through metals
  - Explosions with chain reactions
  - Acid corrodes materials
  - Liquid flow and gas dispersion

### 🔫 Spell System
- **Wand Crafting** with customizable stats
  - Cast Delay & Recharge Time
  - Mana capacity and regeneration
  - Spell spread and shuffle modes
- **Spell Types**:
  - **Projectiles**: Magic Arrow, Fireball, Lightning Bolt, Acid Ball, Water Bolt, Energy Orb
  - **Modifiers**: Damage+, Speed+, Homing, Bounce, Explosive, Rapid Fire
  - **Combinations**: Stack modifiers for devastating effects
- **6 Unique Wands**: Starter, Rapid, Explosive, Homing, Chainsaw, Elemental

### ⚔️ Combat System
- **Health & Mana** management
- **Status Effects**:
  - 🔥 Burning - damage over time
  - 💧 Wet - affects electricity
  - ⚡ Electrified - shocking damage
  - 🧪 Poisoned - gradual damage
- **5 Enemy Types** with unique behaviors
- **Invincibility frames** after taking damage

### 🌟 Perk System
- **12 Powerful Perks** unlock every 30 seconds:
  - Extra HP
  - Explosion Immunity
  - Vampirism (heal on kill)
  - Greed (2x gold)
  - Mana Boost
  - Fast Movement
  - Saving Grace (survive fatal hit)
  - Fire Immunity
  - Electricity Aura
  - Projectile Repulsion
  - Extra Life
  - Critical Hit Chance

### 🗺️ Procedural World
- **5 Unique Biomes**:
  - Coal Mines (0m) - Wood and coal deposits
  - Lava Forge (200m) - Metal and lava hazards
  - Ice Caves (400m) - Frozen terrain
  - Acid Laboratory (600m) - Toxic environment
  - The Deep Void (800m+) - Maximum danger
- **Infinite vertical exploration**
- **Dynamic enemy spawn rates** per biome

## Controls

### Movement
- **WASD** or **Arrow Keys** - Move character
- **Mouse** - Aim spells

### Combat
- **Left Click** - Cast spell (hold for continuous fire)
- **Q / E** - Switch between wands
- **R** - Pick up wand (near wand item)

### System
- **ESC** - Quit game

## How to Play

1. **Open** `index.html` in a modern web browser
2. **Move** with WASD to explore the procedural world
3. **Cast spells** by clicking at enemies
4. **Collect gold** from defeated enemies
5. **Choose perks** every 30 seconds to power up
6. **Survive** as long as possible and reach maximum depth!

## Gameplay Tips

### Spell Combinations
- **Homing + Explosive** = Tracking missiles
- **Rapid Fire + Damage+** = High DPS beam
- **Bounce + Lightning** = Ricocheting electricity
- **Water + Fire enemies** = Quick extinguish

### Status Effect Combos
- **Wet + Electricity** = Massive damage (dangerous!)
- **Fire + Wood/Oil** = Rapid spread
- **Water + Fire** = Neutralize burning

### Survival Strategy
- Watch your health - healing is limited
- Manage mana - don't waste shots
- Use environment - water puts out fire
- Choose perks wisely - synergize with your playstyle
- Keep moving - enemies swarm quickly

## Technical Details

### Architecture
- **Pure JavaScript** - No frameworks required
- **Canvas 2D Rendering** - Optimized pixel drawing
- **Cellular Automata** - Efficient physics simulation
- **Object-Oriented Design** - Clean, maintainable code

### Performance
- **60 FPS** target on modern hardware
- **Viewport Culling** - Only render visible pixels
- **Efficient collision** - Spatial optimization
- **Particle pooling** - Memory management

### File Structure
```
limes/
├── index.html          # Main HTML entry point
├── src/
│   ├── config.js       # Game configuration
│   ├── materials.js    # Material definitions & Pixel class
│   ├── noise.js        # Perlin noise generation
│   ├── physics.js      # Physics simulation engine
│   ├── spells.js       # Spell system & projectiles
│   ├── wands.js        # Wand mechanics
│   ├── enemies.js      # Enemy AI & types
│   ├── perks.js        # Perk system
│   ├── biomes.js       # Biome generation
│   ├── player.js       # Player character
│   └── game.js         # Main game loop
├── game.html           # Original demo (deprecated)
├── game.js             # Original demo (deprecated)
├── GAME_ANALYSIS.md    # Detailed design document
└── README.md           # This file
```

## Game Mechanics Deep Dive

### Material Properties
Each pixel has:
- **Type** - One of 20 materials
- **State** - solid, liquid, gas, or powder
- **Density** - Affects displacement and settling
- **Flammability** - Can it burn?
- **Conductivity** - Does it conduct electricity?
- **Corrosiveness** - Does it dissolve other materials?

### Physics Rules
- **Powders** (sand, dirt) - Fall and settle
- **Liquids** (water, oil, lava) - Flow horizontally and downward
- **Gases** (fire, steam, smoke) - Rise and dissipate
- **Solids** (stone, wood, metal) - Static unless destroyed

### Elemental Reactions
```
Fire + Wood → Wood burns → Fire
Fire + Water → Steam + extinguish
Electricity + Metal → Conducts freely
Explosion + Gunpowder → Chain explosion
Acid + Any → Dissolves over time
Lava + Water → Obsidian + Steam
```

## Development

### Adding New Materials
Edit `src/materials.js`:
```javascript
MATERIALS[MaterialType.NEW_MATERIAL] = new Material(MaterialType.NEW_MATERIAL, {
    color: 'rgb(255, 0, 255)',
    state: 'liquid',
    density: 1.5,
    flammable: true,
    // ... other properties
});
```

### Creating Custom Spells
Edit `src/spells.js`:
```javascript
CUSTOM_SPELL: new Spell({
    name: 'Custom Spell',
    type: 'projectile',
    damage: 50,
    speed: 300,
    color: 'rgb(255, 0, 255)',
    homing: 0.8,
    explosive: true,
    manaCost: 40,
})
```

### Adding Perks
Edit `src/perks.js`:
```javascript
NEW_PERK: new Perk({
    name: 'Super Perk',
    description: 'Does something amazing',
    apply: (player) => {
        player.someProperty = true;
    }
})
```

## Future Enhancements

### Potential Features
- [ ] Holy Mountain safe rooms
- [ ] Wand editor UI
- [ ] More spell types (triggers, timers)
- [ ] Boss encounters
- [ ] Save/Load system
- [ ] Sound effects and music
- [ ] Particle VFX improvements
- [ ] Touch controls for mobile
- [ ] Multiplayer support
- [ ] Mod support

## Credits

**Inspired by**: Noita by Nolla Games

**Created for**: Limes Project

**Technologies**: HTML5 Canvas, JavaScript ES6

## License

Created for educational and demonstration purposes.

---

**Enjoy the chaos!** 🔥💧⚡🧪
