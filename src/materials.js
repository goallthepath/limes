// Material definitions with physics properties
const MaterialType = {
    AIR: 0,
    STONE: 1,
    DIRT: 2,
    SAND: 3,
    WATER: 4,
    LAVA: 5,
    WOOD: 6,
    OIL: 7,
    FIRE: 8,
    STEAM: 9,
    SMOKE: 10,
    METAL: 11,
    GOLD: 12,
    ICE: 13,
    SNOW: 14,
    ACID: 15,
    POISON: 16,
    ELECTRICITY: 17,
    GUNPOWDER: 18,
    COAL: 19,
};

class Material {
    constructor(type, properties) {
        this.type = type;
        this.color = properties.color;
        this.state = properties.state || 'solid'; // solid, liquid, gas, powder
        this.density = properties.density || 1;
        this.flammable = properties.flammable || false;
        this.burnTime = properties.burnTime || 0;
        this.conductive = properties.conductive || false;
        this.explosive = properties.explosive || false;
        this.corrosive = properties.corrosive || false;
        this.spreads = properties.spreads || false;
        this.emitsLight = properties.emitsLight || false;
        this.lightColor = properties.lightColor || null;
    }
}

const MATERIALS = {};

// Air
MATERIALS[MaterialType.AIR] = new Material(MaterialType.AIR, {
    color: 'rgb(0, 0, 0)',
    state: 'gas',
    density: 0,
});

// Solids
MATERIALS[MaterialType.STONE] = new Material(MaterialType.STONE, {
    color: 'rgb(100, 100, 100)',
    state: 'solid',
    density: 10,
});

MATERIALS[MaterialType.DIRT] = new Material(MaterialType.DIRT, {
    color: 'rgb(120, 80, 40)',
    state: 'powder',
    density: 3,
});

MATERIALS[MaterialType.SAND] = new Material(MaterialType.SAND, {
    color: 'rgb(220, 200, 160)',
    state: 'powder',
    density: 2,
});

MATERIALS[MaterialType.WOOD] = new Material(MaterialType.WOOD, {
    color: 'rgb(139, 90, 40)',
    state: 'solid',
    density: 5,
    flammable: true,
    burnTime: 3.0,
});

MATERIALS[MaterialType.COAL] = new Material(MaterialType.COAL, {
    color: 'rgb(50, 50, 50)',
    state: 'solid',
    density: 6,
    flammable: true,
    burnTime: 8.0,
});

MATERIALS[MaterialType.METAL] = new Material(MaterialType.METAL, {
    color: 'rgb(180, 180, 200)',
    state: 'solid',
    density: 15,
    conductive: true,
});

MATERIALS[MaterialType.GOLD] = new Material(MaterialType.GOLD, {
    color: 'rgb(255, 215, 0)',
    state: 'solid',
    density: 20,
    conductive: true,
    emitsLight: true,
    lightColor: 'rgba(255, 215, 0, 0.3)',
});

MATERIALS[MaterialType.ICE] = new Material(MaterialType.ICE, {
    color: 'rgb(180, 220, 255)',
    state: 'solid',
    density: 4,
});

MATERIALS[MaterialType.SNOW] = new Material(MaterialType.SNOW, {
    color: 'rgb(240, 240, 255)',
    state: 'powder',
    density: 1,
});

MATERIALS[MaterialType.GUNPOWDER] = new Material(MaterialType.GUNPOWDER, {
    color: 'rgb(60, 60, 60)',
    state: 'powder',
    density: 2,
    explosive: true,
    flammable: true,
    burnTime: 0.1,
});

// Liquids
MATERIALS[MaterialType.WATER] = new Material(MaterialType.WATER, {
    color: 'rgb(50, 100, 200)',
    state: 'liquid',
    density: 1,
});

MATERIALS[MaterialType.OIL] = new Material(MaterialType.OIL, {
    color: 'rgb(80, 60, 40)',
    state: 'liquid',
    density: 0.9,
    flammable: true,
    burnTime: 1.5,
});

MATERIALS[MaterialType.LAVA] = new Material(MaterialType.LAVA, {
    color: 'rgb(255, 100, 0)',
    state: 'liquid',
    density: 3,
    emitsLight: true,
    lightColor: 'rgba(255, 100, 0, 0.5)',
});

MATERIALS[MaterialType.ACID] = new Material(MaterialType.ACID, {
    color: 'rgb(100, 255, 50)',
    state: 'liquid',
    density: 1.2,
    corrosive: true,
});

MATERIALS[MaterialType.POISON] = new Material(MaterialType.POISON, {
    color: 'rgb(100, 50, 150)',
    state: 'liquid',
    density: 1.1,
});

// Gases
MATERIALS[MaterialType.FIRE] = new Material(MaterialType.FIRE, {
    color: 'rgb(255, 150, 0)',
    state: 'gas',
    density: 0.1,
    spreads: true,
    emitsLight: true,
    lightColor: 'rgba(255, 150, 0, 0.4)',
});

MATERIALS[MaterialType.STEAM] = new Material(MaterialType.STEAM, {
    color: 'rgb(200, 200, 230)',
    state: 'gas',
    density: 0.2,
});

MATERIALS[MaterialType.SMOKE] = new Material(MaterialType.SMOKE, {
    color: 'rgb(80, 80, 80)',
    state: 'gas',
    density: 0.15,
});

MATERIALS[MaterialType.ELECTRICITY] = new Material(MaterialType.ELECTRICITY, {
    color: 'rgb(100, 200, 255)',
    state: 'gas',
    density: 0,
    spreads: true,
    emitsLight: true,
    lightColor: 'rgba(100, 200, 255, 0.6)',
});

// Pixel class - represents a single pixel in the world
class Pixel {
    constructor(type = MaterialType.AIR) {
        this.type = type;
        this.lifetime = 0;
        this.temperature = 0;
        this.updated = false;
        this.data = null; // Extra data for burning, electricity, etc.
    }

    get material() {
        return MATERIALS[this.type];
    }

    isEmpty() {
        return this.type === MaterialType.AIR;
    }

    isSolid() {
        const mat = this.material;
        return mat.state === 'solid';
    }

    isLiquid() {
        const mat = this.material;
        return mat.state === 'liquid';
    }

    isPowder() {
        const mat = this.material;
        return mat.state === 'powder';
    }

    isGas() {
        const mat = this.material;
        return mat.state === 'gas';
    }

    canMove() {
        return this.isLiquid() || this.isPowder() || this.isGas();
    }
}
