// Pixel physics simulation engine
class PhysicsWorld {
    constructor(width, height, biomeGenerator) {
        this.width = width;
        this.height = height;
        this.biomeGenerator = biomeGenerator;
        this.pixels = [];
        this.frameCount = 0;

        // Initialize pixel grid
        for (let y = 0; y < height; y++) {
            this.pixels[y] = [];
            for (let x = 0; x < width; x++) {
                this.pixels[y][x] = new Pixel(MaterialType.AIR);
            }
        }

        this.generateTerrain();
    }

    generateTerrain() {
        const noise = new PerlinNoise(Math.random() * 1000000);

        for (let x = 0; x < this.width; x++) {
            const biome = this.biomeGenerator.getBiome(x, 0);
            const baseHeight = this.height * 0.6;
            const terrainHeight = noise.octaveNoise(x / 80, 0, 4, 0.5, 2.0);
            const surfaceY = Math.floor(baseHeight + terrainHeight * 60);

            for (let y = surfaceY; y < this.height; y++) {
                const depth = y - surfaceY;
                let material;

                // Biome-specific generation
                if (biome.type === 'coal_mines') {
                    if (depth < 3) material = MaterialType.DIRT;
                    else if (Math.random() < 0.1) material = MaterialType.COAL;
                    else if (Math.random() < 0.05) material = MaterialType.WOOD;
                    else material = MaterialType.STONE;
                } else if (biome.type === 'lava_forge') {
                    if (depth < 2) material = MaterialType.STONE;
                    else if (Math.random() < 0.15) material = MaterialType.METAL;
                    else if (Math.random() < 0.05 && depth > 20) material = MaterialType.LAVA;
                    else material = MaterialType.STONE;
                } else if (biome.type === 'ice_caves') {
                    if (depth < 2) material = MaterialType.SNOW;
                    else if (Math.random() < 0.2) material = MaterialType.ICE;
                    else material = MaterialType.STONE;
                } else if (biome.type === 'acid_labs') {
                    if (Math.random() < 0.1) material = MaterialType.METAL;
                    else if (Math.random() < 0.05) material = MaterialType.ACID;
                    else material = MaterialType.STONE;
                } else {
                    // Default
                    if (depth < 3) material = MaterialType.DIRT;
                    else if (Math.random() < 0.05) material = MaterialType.GOLD;
                    else material = MaterialType.STONE;
                }

                this.pixels[y][x].type = material;
            }

            // Add some surface decoration
            if (surfaceY > 0 && surfaceY < this.height - 1) {
                if (Math.random() < 0.1) {
                    this.pixels[surfaceY - 1][x].type = biome.type === 'ice_caves' ? MaterialType.SNOW : MaterialType.WOOD;
                }
            }
        }
    }

    getPixel(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.pixels[y][x];
    }

    setPixel(x, y, type) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        this.pixels[y][x].type = type;
        this.pixels[y][x].lifetime = 0;
    }

    swap(x1, y1, x2, y2) {
        const temp = this.pixels[y1][x1];
        this.pixels[y1][x1] = this.pixels[y2][x2];
        this.pixels[y2][x2] = temp;
    }

    isEmpty(x, y) {
        const pixel = this.getPixel(x, y);
        return pixel && pixel.isEmpty();
    }

    update(dt) {
        this.frameCount++;

        // Reset updated flags
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.pixels[y][x].updated = false;
            }
        }

        // Update pixels (bottom to top for falling)
        for (let y = this.height - 1; y >= 0; y--) {
            // Alternate scan direction for better liquid flow
            const startX = this.frameCount % 2 === 0 ? 0 : this.width - 1;
            const endX = this.frameCount % 2 === 0 ? this.width : -1;
            const stepX = this.frameCount % 2 === 0 ? 1 : -1;

            for (let x = startX; x !== endX; x += stepX) {
                const pixel = this.pixels[y][x];
                if (pixel.updated || pixel.isEmpty()) continue;

                this.updatePixel(x, y, dt);
                pixel.updated = true;
            }
        }
    }

    updatePixel(x, y, dt) {
        const pixel = this.pixels[y][x];
        const mat = pixel.material;

        // Update lifetime
        pixel.lifetime += dt;

        // Fire behavior
        if (pixel.type === MaterialType.FIRE) {
            this.updateFire(x, y, dt);
            return;
        }

        // Electricity behavior
        if (pixel.type === MaterialType.ELECTRICITY) {
            this.updateElectricity(x, y, dt);
            return;
        }

        // Burning materials
        if (pixel.data && pixel.data.burning) {
            pixel.data.burnTime -= dt;
            if (pixel.data.burnTime <= 0) {
                this.setPixel(x, y, MaterialType.FIRE);
                return;
            }
            // Spawn fire occasionally
            if (Math.random() < 0.2 && y > 0 && this.isEmpty(x, y - 1)) {
                this.setPixel(x, y - 1, MaterialType.FIRE);
            }
        }

        // Powder physics (sand, dirt, snow, gunpowder)
        if (mat.state === 'powder') {
            this.updatePowder(x, y);
        }
        // Liquid physics (water, oil, lava, acid, poison)
        else if (mat.state === 'liquid') {
            this.updateLiquid(x, y);
        }
        // Gas physics (steam, smoke) - rises
        else if (mat.state === 'gas' && !mat.spreads) {
            this.updateGas(x, y);
        }
    }

    updatePowder(x, y) {
        if (y >= this.height - 1) return;

        // Try to fall straight down
        if (this.canDisplace(x, y, x, y + 1)) {
            this.swap(x, y, x, y + 1);
            return;
        }

        // Try diagonal
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (this.canDisplace(x, y, x + dir, y + 1)) {
            this.swap(x, y, x + dir, y + 1);
            return;
        }
        if (this.canDisplace(x, y, x - dir, y + 1)) {
            this.swap(x, y, x - dir, y + 1);
        }
    }

    updateLiquid(x, y) {
        if (y >= this.height - 1) return;

        // Try to fall
        if (this.canDisplace(x, y, x, y + 1)) {
            this.swap(x, y, x, y + 1);
            return;
        }

        // Try diagonal down
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (this.canDisplace(x, y, x + dir, y + 1)) {
            this.swap(x, y, x + dir, y + 1);
            return;
        }
        if (this.canDisplace(x, y, x - dir, y + 1)) {
            this.swap(x, y, x - dir, y + 1);
            return;
        }

        // Try sideways (liquid spreads horizontally)
        if (Math.random() < CONFIG.WATER_FLOW_SPEED) {
            if (this.canDisplace(x, y, x + dir, y)) {
                this.swap(x, y, x + dir, y);
                return;
            }
            if (this.canDisplace(x, y, x - dir, y)) {
                this.swap(x, y, x - dir, y);
            }
        }
    }

    updateGas(x, y) {
        if (y <= 0) {
            // Dissipate at top
            if (Math.random() < 0.1) {
                this.setPixel(x, y, MaterialType.AIR);
            }
            return;
        }

        // Try to rise
        if (this.canDisplace(x, y, x, y - 1)) {
            this.swap(x, y, x, y - 1);
            return;
        }

        // Try diagonal up
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (this.canDisplace(x, y, x + dir, y - 1)) {
            this.swap(x, y, x + dir, y - 1);
            return;
        }
        if (this.canDisplace(x, y, x - dir, y - 1)) {
            this.swap(x, y, x - dir, y - 1);
            return;
        }

        // Dissipate after some time
        if (pixel.lifetime > 3 && Math.random() < 0.05) {
            this.setPixel(x, y, MaterialType.AIR);
        }
    }

    updateFire(x, y, dt) {
        const pixel = this.pixels[y][x];

        // Fire has limited lifetime
        if (pixel.lifetime > CONFIG.FIRE_LIFETIME) {
            this.setPixel(x, y, Math.random() < 0.5 ? MaterialType.SMOKE : MaterialType.AIR);
            return;
        }

        // Fire spreads to neighbors
        const neighbors = [
            [x - 1, y], [x + 1, y],
            [x, y - 1], [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
            const neighbor = this.getPixel(nx, ny);
            if (!neighbor) continue;

            // Ignite flammable materials
            if (neighbor.material.flammable && Math.random() < CONFIG.FIRE_SPREAD_CHANCE) {
                if (!neighbor.data || !neighbor.data.burning) {
                    neighbor.data = {
                        burning: true,
                        burnTime: neighbor.material.burnTime
                    };
                }
            }

            // Water extinguishes fire
            if (neighbor.type === MaterialType.WATER) {
                this.setPixel(x, y, MaterialType.STEAM);
                this.setPixel(nx, ny, Math.random() < 0.5 ? MaterialType.STEAM : MaterialType.AIR);
                return;
            }

            // Explosions
            if (neighbor.material.explosive) {
                this.createExplosion(nx, ny, 8);
                return;
            }
        }

        // Fire rises
        if (y > 0 && Math.random() < 0.3) {
            if (this.isEmpty(x, y - 1)) {
                this.swap(x, y, x, y - 1);
            }
        }
    }

    updateElectricity(x, y, dt) {
        const pixel = this.pixels[y][x];

        // Electricity dissipates quickly
        if (pixel.lifetime > 0.2) {
            this.setPixel(x, y, MaterialType.AIR);
            return;
        }

        // Conduct through metal
        const neighbors = [
            [x - 1, y], [x + 1, y],
            [x, y - 1], [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
            const neighbor = this.getPixel(nx, ny);
            if (!neighbor || neighbor.type === MaterialType.ELECTRICITY) continue;

            if (neighbor.material.conductive && Math.random() < 0.5) {
                if (this.isEmpty(nx, ny - 1)) {
                    this.setPixel(nx, ny - 1, MaterialType.ELECTRICITY);
                } else if (this.isEmpty(nx, ny + 1)) {
                    this.setPixel(nx, ny + 1, MaterialType.ELECTRICITY);
                }
            }
        }
    }

    canDisplace(x1, y1, x2, y2) {
        const p1 = this.getPixel(x1, y1);
        const p2 = this.getPixel(x2, y2);

        if (!p1 || !p2) return false;
        if (p2.isSolid()) return false;

        // Can displace if heavier or if target is air
        return p2.isEmpty() || p1.material.density > p2.material.density;
    }

    createExplosion(cx, cy, radius) {
        for (let y = cy - radius; y <= cy + radius; y++) {
            for (let x = cx - radius; x <= cx + radius; x++) {
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= radius) {
                    const pixel = this.getPixel(x, y);
                    if (pixel && !pixel.isEmpty()) {
                        // Chance to destroy or convert to fire
                        if (Math.random() < 0.7) {
                            this.setPixel(x, y, dist < radius * 0.5 ? MaterialType.FIRE : MaterialType.SMOKE);
                        }
                    }
                }
            }
        }
    }

    spawnParticle(x, y, material, vx = 0, vy = 0) {
        const px = Math.floor(x);
        const py = Math.floor(y);

        if (this.isEmpty(px, py)) {
            this.setPixel(px, py, material);
        }
    }
}
