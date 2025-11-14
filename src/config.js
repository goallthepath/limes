// Game configuration constants
const CONFIG = {
    // Rendering
    PIXEL_SIZE: 2,
    RENDER_SCALE: 1,

    // Physics
    GRAVITY: 200,
    MAX_PARTICLE_VELOCITY: 500,
    PHYSICS_SUBSTEPS: 2,

    // Player
    PLAYER_HP: 100,
    PLAYER_SPEED: 150,
    PLAYER_SIZE: 8,
    MANA_REGEN: 20, // per second

    // Combat
    IFRAME_DURATION: 0.5, // invincibility frames after hit

    // World
    CHUNK_SIZE: 64,
    BIOME_HEIGHT: 200,

    // Fire
    FIRE_SPREAD_CHANCE: 0.3,
    FIRE_LIFETIME: 2.0,
    FIRE_DAMAGE: 10, // per second

    // Water
    WATER_FLOW_SPEED: 0.7,

    // Electricity
    ELECTRICITY_DAMAGE: 30,
    ELECTRICITY_CHAIN_RANGE: 40,

    // Game
    STARTING_GOLD: 0,
    PERK_INTERVAL: 3, // every N biomes
};
