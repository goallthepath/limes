// Biome system for varied environments

class Biome {
    constructor(config) {
        this.type = config.type;
        this.name = config.name;
        this.depth = config.depth;
        this.backgroundColor = config.backgroundColor;
        this.enemySpawnRate = config.enemySpawnRate || 1.0;
    }
}

const BIOME_TYPES = {
    COAL_MINES: new Biome({
        type: 'coal_mines',
        name: 'Coal Mines',
        depth: 0,
        backgroundColor: 'rgb(20, 15, 10)',
        enemySpawnRate: 0.8,
    }),

    LAVA_FORGE: new Biome({
        type: 'lava_forge',
        name: 'Lava Forge',
        depth: 200,
        backgroundColor: 'rgb(30, 10, 5)',
        enemySpawnRate: 1.2,
    }),

    ICE_CAVES: new Biome({
        type: 'ice_caves',
        name: 'Ice Caves',
        depth: 400,
        backgroundColor: 'rgb(10, 15, 25)',
        enemySpawnRate: 1.0,
    }),

    ACID_LABS: new Biome({
        type: 'acid_labs',
        name: 'Acid Laboratory',
        depth: 600,
        backgroundColor: 'rgb(15, 25, 10)',
        enemySpawnRate: 1.5,
    }),

    DEEP_VOID: new Biome({
        type: 'deep_void',
        name: 'The Deep Void',
        depth: 800,
        backgroundColor: 'rgb(5, 5, 15)',
        enemySpawnRate: 2.0,
    }),
};

class BiomeGenerator {
    constructor() {
        this.biomes = Object.values(BIOME_TYPES);
    }

    getBiome(x, y) {
        // Determine biome based on depth
        const depth = y * CONFIG.PIXEL_SIZE;

        for (let i = this.biomes.length - 1; i >= 0; i--) {
            if (depth >= this.biomes[i].depth) {
                return this.biomes[i];
            }
        }

        return this.biomes[0];
    }

    getCurrentBiome(depth) {
        for (let i = this.biomes.length - 1; i >= 0; i--) {
            if (depth >= this.biomes[i].depth) {
                return this.biomes[i];
            }
        }
        return this.biomes[0];
    }
}
