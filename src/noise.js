// Perlin Noise implementation for procedural generation
class PerlinNoise {
    constructor(seed = 0) {
        this.seed = seed;
    }

    hash(x, y) {
        const h = this.seed + x * 73856093 ^ y * 19349663;
        const h2 = (h ^ (h >> 13)) * 1274126177;
        return ((h2 ^ (h2 >> 16)) & 2147483647) / 2147483647;
    }

    smoothstep(t) {
        return t * t * (3 - 2 * t);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    noise(x, y) {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const xf = x - xi;
        const yf = y - yi;

        const u = this.smoothstep(xf);
        const v = this.smoothstep(yf);

        const n00 = this.hash(xi, yi);
        const n10 = this.hash(xi + 1, yi);
        const n01 = this.hash(xi, yi + 1);
        const n11 = this.hash(xi + 1, yi + 1);

        const nx0 = this.lerp(u, n00, n10);
        const nx1 = this.lerp(u, n01, n11);
        return this.lerp(v, nx0, nx1) * 2 - 1;
    }

    octaveNoise(x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
        let total = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return total / maxValue;
    }
}
