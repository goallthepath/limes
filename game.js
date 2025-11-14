// Pixel Shaman - Web Version
// Procedurally generated infinite pixel world

// Alle 118 Elemente des Periodensystems mit mystischen Farben und Zuständen
const PERIODIC_ELEMENTS = [
    // Periode 1
    { symbol: 'H', name: 'Hydrogen', color: 'rgb(255, 200, 100)', group: 'nonmetal', state: 'gas' },
    { symbol: 'He', name: 'Helium', color: 'rgb(200, 255, 200)', group: 'noble_gas', state: 'gas' },
    // Periode 2
    { symbol: 'Li', name: 'Lithium', color: 'rgb(255, 100, 100)', group: 'alkali', state: 'solid' },
    { symbol: 'Be', name: 'Beryllium', color: 'rgb(255, 150, 150)', group: 'alkaline', state: 'solid' },
    { symbol: 'B', name: 'Boron', color: 'rgb(200, 200, 100)', group: 'semimetal', state: 'solid' },
    { symbol: 'C', name: 'Carbon', color: 'rgb(100, 100, 100)', group: 'nonmetal', state: 'solid' },
    { symbol: 'N', name: 'Nitrogen', color: 'rgb(150, 255, 150)', group: 'nonmetal', state: 'gas' },
    { symbol: 'O', name: 'Oxygen', color: 'rgb(100, 200, 255)', group: 'nonmetal', state: 'gas' },
    { symbol: 'F', name: 'Fluorine', color: 'rgb(255, 255, 100)', group: 'halogen', state: 'gas' },
    { symbol: 'Ne', name: 'Neon', color: 'rgb(255, 100, 255)', group: 'noble_gas', state: 'gas' },
    // Periode 3
    { symbol: 'Na', name: 'Sodium', color: 'rgb(255, 150, 100)', group: 'alkali', state: 'solid' },
    { symbol: 'Mg', name: 'Magnesium', color: 'rgb(200, 255, 150)', group: 'alkaline', state: 'solid' },
    { symbol: 'Al', name: 'Aluminum', color: 'rgb(200, 200, 200)', group: 'metal', state: 'solid' },
    { symbol: 'Si', name: 'Silicon', color: 'rgb(150, 150, 200)', group: 'semimetal', state: 'solid' },
    { symbol: 'P', name: 'Phosphorus', color: 'rgb(255, 200, 100)', group: 'nonmetal', state: 'solid' },
    { symbol: 'S', name: 'Sulfur', color: 'rgb(255, 255, 100)', group: 'nonmetal', state: 'solid' },
    { symbol: 'Cl', name: 'Chlorine', color: 'rgb(100, 255, 100)', group: 'halogen', state: 'gas' },
    { symbol: 'Ar', name: 'Argon', color: 'rgb(200, 100, 255)', group: 'noble_gas', state: 'gas' },
    // Periode 4
    { symbol: 'K', name: 'Potassium', color: 'rgb(255, 150, 100)', group: 'alkali', state: 'solid' },
    { symbol: 'Ca', name: 'Calcium', color: 'rgb(220, 220, 100)', group: 'alkaline', state: 'solid' },
    { symbol: 'Sc', name: 'Scandium', color: 'rgb(200, 150, 200)', group: 'transition', state: 'solid' },
    { symbol: 'Ti', name: 'Titanium', color: 'rgb(180, 150, 180)', group: 'transition', state: 'solid' },
    { symbol: 'V', name: 'Vanadium', color: 'rgb(170, 140, 170)', group: 'transition', state: 'solid' },
    { symbol: 'Cr', name: 'Chromium', color: 'rgb(160, 130, 160)', group: 'transition', state: 'solid' },
    { symbol: 'Mn', name: 'Manganese', color: 'rgb(150, 120, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Fe', name: 'Iron', color: 'rgb(200, 100, 100)', group: 'transition', state: 'solid' },
    { symbol: 'Co', name: 'Cobalt', color: 'rgb(200, 100, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Ni', name: 'Nickel', color: 'rgb(200, 150, 100)', group: 'transition', state: 'solid' },
    { symbol: 'Cu', name: 'Copper', color: 'rgb(255, 150, 50)', group: 'transition', state: 'solid' },
    { symbol: 'Zn', name: 'Zinc', color: 'rgb(200, 200, 220)', group: 'transition', state: 'solid' },
    { symbol: 'Ga', name: 'Gallium', color: 'rgb(200, 180, 200)', group: 'metal', state: 'solid' },
    { symbol: 'Ge', name: 'Germanium', color: 'rgb(180, 160, 180)', group: 'semimetal', state: 'solid' },
    { symbol: 'As', name: 'Arsenic', color: 'rgb(160, 140, 160)', group: 'semimetal', state: 'solid' },
    { symbol: 'Se', name: 'Selenium', color: 'rgb(255, 180, 100)', group: 'nonmetal', state: 'solid' },
    { symbol: 'Br', name: 'Bromine', color: 'rgb(255, 100, 100)', group: 'halogen', state: 'liquid' },
    { symbol: 'Kr', name: 'Krypton', color: 'rgb(180, 100, 255)', group: 'noble_gas', state: 'gas' },
    // Periode 5
    { symbol: 'Rb', name: 'Rubidium', color: 'rgb(255, 120, 100)', group: 'alkali', state: 'solid' },
    { symbol: 'Sr', name: 'Strontium', color: 'rgb(220, 200, 100)', group: 'alkaline', state: 'solid' },
    { symbol: 'Y', name: 'Yttrium', color: 'rgb(200, 150, 200)', group: 'transition', state: 'solid' },
    { symbol: 'Zr', name: 'Zirconium', color: 'rgb(180, 150, 180)', group: 'transition', state: 'solid' },
    { symbol: 'Nb', name: 'Niobium', color: 'rgb(170, 140, 170)', group: 'transition', state: 'solid' },
    { symbol: 'Mo', name: 'Molybdenum', color: 'rgb(160, 130, 160)', group: 'transition', state: 'solid' },
    { symbol: 'Tc', name: 'Technetium', color: 'rgb(150, 120, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Ru', name: 'Ruthenium', color: 'rgb(200, 150, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Rh', name: 'Rhodium', color: 'rgb(200, 150, 200)', group: 'transition', state: 'solid' },
    { symbol: 'Pd', name: 'Palladium', color: 'rgb(220, 220, 220)', group: 'transition', state: 'solid' },
    { symbol: 'Ag', name: 'Silver', color: 'rgb(220, 220, 220)', group: 'transition', state: 'solid' },
    { symbol: 'Cd', name: 'Cadmium', color: 'rgb(200, 200, 200)', group: 'transition', state: 'solid' },
    { symbol: 'In', name: 'Indium', color: 'rgb(200, 180, 200)', group: 'metal', state: 'solid' },
    { symbol: 'Sn', name: 'Tin', color: 'rgb(180, 160, 180)', group: 'metal', state: 'solid' },
    { symbol: 'Sb', name: 'Antimony', color: 'rgb(160, 140, 160)', group: 'semimetal', state: 'solid' },
    { symbol: 'Te', name: 'Tellurium', color: 'rgb(255, 180, 100)', group: 'semimetal', state: 'solid' },
    { symbol: 'I', name: 'Iodine', color: 'rgb(100, 50, 200)', group: 'halogen', state: 'solid' },
    { symbol: 'Xe', name: 'Xenon', color: 'rgb(160, 80, 255)', group: 'noble_gas', state: 'gas' },
    // Periode 6
    { symbol: 'Cs', name: 'Cesium', color: 'rgb(255, 120, 100)', group: 'alkali', state: 'solid' },
    { symbol: 'Ba', name: 'Barium', color: 'rgb(220, 200, 100)', group: 'alkaline', state: 'solid' },
    { symbol: 'La', name: 'Lanthanum', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Ce', name: 'Cerium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Pr', name: 'Praseodymium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Nd', name: 'Neodymium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Pm', name: 'Promethium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Sm', name: 'Samarium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Eu', name: 'Europium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Gd', name: 'Gadolinium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Tb', name: 'Terbium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Dy', name: 'Dysprosium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Ho', name: 'Holmium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Er', name: 'Erbium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Tm', name: 'Thulium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Yb', name: 'Ytterbium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Lu', name: 'Lutetium', color: 'rgb(200, 150, 100)', group: 'lanthanide', state: 'solid' },
    { symbol: 'Hf', name: 'Hafnium', color: 'rgb(180, 150, 180)', group: 'transition', state: 'solid' },
    { symbol: 'Ta', name: 'Tantalum', color: 'rgb(170, 140, 170)', group: 'transition', state: 'solid' },
    { symbol: 'W', name: 'Tungsten', color: 'rgb(160, 130, 160)', group: 'transition', state: 'solid' },
    { symbol: 'Re', name: 'Rhenium', color: 'rgb(150, 120, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Os', name: 'Osmium', color: 'rgb(200, 150, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Ir', name: 'Iridium', color: 'rgb(200, 150, 200)', group: 'transition', state: 'solid' },
    { symbol: 'Pt', name: 'Platinum', color: 'rgb(220, 220, 220)', group: 'transition', state: 'solid' },
    { symbol: 'Au', name: 'Gold', color: 'rgb(255, 200, 0)', group: 'transition', state: 'solid' },
    { symbol: 'Hg', name: 'Mercury', color: 'rgb(150, 150, 200)', group: 'transition', state: 'liquid' },
    { symbol: 'Tl', name: 'Thallium', color: 'rgb(200, 180, 200)', group: 'metal', state: 'solid' },
    { symbol: 'Pb', name: 'Lead', color: 'rgb(100, 100, 150)', group: 'metal', state: 'solid' },
    { symbol: 'Bi', name: 'Bismuth', color: 'rgb(200, 150, 255)', group: 'metal', state: 'solid' },
    { symbol: 'Po', name: 'Polonium', color: 'rgb(200, 150, 100)', group: 'semimetal', state: 'solid' },
    { symbol: 'At', name: 'Astatine', color: 'rgb(200, 100, 100)', group: 'halogen', state: 'solid' },
    { symbol: 'Rn', name: 'Radon', color: 'rgb(140, 60, 255)', group: 'noble_gas', state: 'gas' },
    // Periode 7
    { symbol: 'Fr', name: 'Francium', color: 'rgb(255, 100, 100)', group: 'alkali', state: 'solid' },
    { symbol: 'Ra', name: 'Radium', color: 'rgb(220, 180, 100)', group: 'alkaline', state: 'solid' },
    { symbol: 'Ac', name: 'Actinium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Th', name: 'Thorium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Pa', name: 'Protactinium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'U', name: 'Uranium', color: 'rgb(150, 200, 50)', group: 'actinide', state: 'solid' },
    { symbol: 'Np', name: 'Neptunium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Pu', name: 'Plutonium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Am', name: 'Americium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Cm', name: 'Curium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Bk', name: 'Berkelium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Cf', name: 'Californium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Es', name: 'Einsteinium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Fm', name: 'Fermium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Md', name: 'Mendelevium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'No', name: 'Nobelium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Lr', name: 'Lawrencium', color: 'rgb(200, 150, 100)', group: 'actinide', state: 'solid' },
    { symbol: 'Rf', name: 'Rutherfordium', color: 'rgb(180, 150, 180)', group: 'transition', state: 'solid' },
    { symbol: 'Db', name: 'Dubnium', color: 'rgb(170, 140, 170)', group: 'transition', state: 'solid' },
    { symbol: 'Sg', name: 'Seaborgium', color: 'rgb(160, 130, 160)', group: 'transition', state: 'solid' },
    { symbol: 'Bh', name: 'Bohrium', color: 'rgb(150, 120, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Hs', name: 'Hassium', color: 'rgb(200, 150, 150)', group: 'transition', state: 'solid' },
    { symbol: 'Mt', name: 'Meitnerium', color: 'rgb(200, 150, 200)', group: 'transition', state: 'solid' },
    { symbol: 'Ds', name: 'Darmstadtium', color: 'rgb(220, 220, 220)', group: 'transition', state: 'solid' },
    { symbol: 'Rg', name: 'Roentgenium', color: 'rgb(220, 220, 220)', group: 'transition', state: 'solid' },
    { symbol: 'Cn', name: 'Copernicium', color: 'rgb(200, 200, 200)', group: 'transition', state: 'solid' },
    { symbol: 'Nh', name: 'Nihonium', color: 'rgb(200, 180, 200)', group: 'metal', state: 'solid' },
    { symbol: 'Fl', name: 'Flerovium', color: 'rgb(180, 160, 180)', group: 'metal', state: 'solid' },
    { symbol: 'Mc', name: 'Moscovium', color: 'rgb(160, 140, 160)', group: 'metal', state: 'solid' },
    { symbol: 'Lv', name: 'Livermorium', color: 'rgb(200, 150, 100)', group: 'metal', state: 'solid' },
    { symbol: 'Ts', name: 'Tennessine', color: 'rgb(200, 100, 100)', group: 'halogen', state: 'solid' },
    { symbol: 'Og', name: 'Oganesson', color: 'rgb(120, 40, 255)', group: 'noble_gas', state: 'gas' },
];

class PerlinNoise {
    constructor(seed = 0) {
        this.seed = seed;
        this.permutation = this.generatePermutation(seed);
    }

    generatePermutation(seed) {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        // Fisher-Yates shuffle with seed
        for (let i = 255; i > 0; i--) {
            seed = (seed * 9301 + 49297) % 233280;
            const j = Math.floor((seed / 233280) * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        return p.concat(p); // Duplicate for wrapping
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
}

class TerrainGenerator {
    constructor(seed = 0) {
        this.seed = seed;
        this.noise = new PerlinNoise(seed);
        this.cache = new Map();
        this.elementCache = new Map();
    }

    getTile(x, y) {
        const key = `${Math.floor(x)},${Math.floor(y)}`;
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        // Multi-octave noise
        let height = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxAmplitude = 0;

        for (let i = 0; i < 4; i++) {
            height += amplitude * this.noise.noise(
                x / 100 * frequency,
                y / 100 * frequency
            );
            maxAmplitude += amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }
        height /= maxAmplitude;

        // Select element based on noise
        const elementIndex = Math.floor(Math.abs(height * 100) % PERIODIC_ELEMENTS.length);
        const element = PERIODIC_ELEMENTS[elementIndex];

        this.cache.set(key, element);
        return element;
    }
}

class Particle {
    constructor(x, y, vx, vy, color, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.lifetime = lifetime;
        this.age = 0;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += 100 * dt; // Gravity
        this.age += dt;
    }

    isAlive() {
        return this.age < this.lifetime;
    }

    draw(ctx, cameraX, cameraY) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.fillRect(this.x - cameraX - 1, this.y - cameraY - 1, 2, 2);
    }
}

class Shaman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = 100;
        this.direction = 0;
        this.staffRotation = 0;
        this.particles = [];
        this.keys = {};
    }

    update(dt) {
        this.vx = 0;
        this.vy = 0;

        if (this.keys['w'] || this.keys['arrowup']) this.vy = -this.speed;
        if (this.keys['s'] || this.keys['arrowdown']) this.vy = this.speed;
        if (this.keys['a'] || this.keys['arrowleft']) this.vx = -this.speed;
        if (this.keys['d'] || this.keys['arrowright']) this.vx = this.speed;

        // Normalize diagonal
        if (this.vx !== 0 && this.vy !== 0) {
            this.vx *= 0.707;
            this.vy *= 0.707;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.staffRotation += dt * 180;

        // Update particles
        this.particles = this.particles.filter(p => p.isAlive());
        this.particles.forEach(p => p.update(dt));
    }

    addMagicParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = 100 + Math.random() * 100;
        const colors = ['rgb(200, 100, 200)', 'rgb(255, 215, 0)', 'rgb(144, 238, 144)'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const p = new Particle(
            this.x + 16,
            this.y + 16,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            color,
            0.5
        );
        this.particles.push(p);
    }

    draw(ctx, cameraX, cameraY) {
        const sx = this.x - cameraX;
        const sy = this.y - cameraY;

        // Simplified shaman for tiny pixels
        // Body (red)
        ctx.fillStyle = 'rgb(200, 50, 50)';
        ctx.fillRect(sx, sy, 2, 2);

        // Head (gold)
        ctx.fillStyle = 'rgb(255, 215, 0)';
        ctx.beginPath();
        ctx.arc(sx + 1, sy - 1, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Draw particles
        this.particles.forEach(p => p.draw(ctx, cameraX, cameraY));
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.running = true;

        // Set canvas to fullscreen size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.terrain = new TerrainGenerator(Math.floor(Math.random() * 1000000));
        this.shaman = new Shaman(window.innerWidth / 2, window.innerHeight / 2);

        this.tileSize = 3.2;

        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.particleTimer = 0;

        this.setupEventListeners();
        this.gameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.shaman.keys[e.key.toLowerCase()] = true;
            if (e.key === 'Escape') {
                this.running = false;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.shaman.keys[e.key.toLowerCase()] = false;
        });
    }

    gameLoop() {
        const currentTime = Date.now();
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.frameCount++;
        if (this.frameCount % 10 === 0) {
            this.fps = Math.round(1 / dt);
        }

        this.update(dt);
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }

    update(dt) {
        this.shaman.update(dt);

        // Spawn magic particles
        this.particleTimer += dt;
        if (this.particleTimer > 0.05) {
            this.shaman.addMagicParticle();
            this.particleTimer = 0;
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cameraX = this.shaman.x - this.canvas.width / 2;
        const cameraY = this.shaman.y - this.canvas.height / 2;

        // Draw tiles
        const startTileX = Math.floor(cameraX / this.tileSize);
        const startTileY = Math.floor(cameraY / this.tileSize);
        const endTileX = startTileX + Math.ceil(this.canvas.width / this.tileSize) + 2;
        const endTileY = startTileY + Math.ceil(this.canvas.height / this.tileSize) + 2;

        for (let tileX = startTileX; tileX < endTileX; tileX++) {
            for (let tileY = startTileY; tileY < endTileY; tileY++) {
                const worldX = tileX * this.tileSize;
                const worldY = tileY * this.tileSize;
                const element = this.terrain.getTile(worldX, worldY);
                const color = element.color;

                const screenX = worldX - cameraX;
                const screenY = worldY - cameraY;

                // Draw tile with element color
                this.ctx.fillStyle = color;
                this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);

                // Draw glowing border based on group and state
                let borderColor = this.getGroupGlow(element.group);
                if (element.state === 'gas') {
                    borderColor = this.adjustBrightness(borderColor, 1.3);
                } else if (element.state === 'liquid') {
                    borderColor = this.adjustBrightness(borderColor, 0.8);
                }
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = 0.3;
                this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }

        // Draw shaman
        this.shaman.draw(this.ctx, cameraX, cameraY);

        // Draw UI
        const posX = Math.round(this.shaman.x);
        const posY = Math.round(this.shaman.y);

        // Determine element
        const element = this.terrain.getTile(this.shaman.x, this.shaman.y);
        const elementName = element.name;
        const state = element.state.charAt(0).toUpperCase() + element.state.slice(1);

        const stats = `FPS: ${this.fps} | Pos: (${posX}, ${posY}) | ${element.symbol} ${state}`;
        document.getElementById('stats').textContent = stats;
    }

    getGroupGlow(group) {
        const glows = {
            'alkali': 'rgb(255, 100, 100)',
            'alkaline': 'rgb(255, 200, 100)',
            'transition': 'rgb(255, 150, 255)',
            'metal': 'rgb(200, 200, 100)',
            'semimetal': 'rgb(150, 200, 255)',
            'nonmetal': 'rgb(100, 255, 100)',
            'halogen': 'rgb(255, 100, 255)',
            'noble_gas': 'rgb(100, 200, 255)',
            'actinide': 'rgb(200, 100, 255)',
            'lanthanide': 'rgb(255, 180, 100)'
        };
        return glows[group] || 'rgb(150, 150, 150)';
    }

    adjustBrightness(rgbColor, factor) {
        const matches = rgbColor.match(/\d+/g);
        if (!matches) return rgbColor;
        const r = Math.min(255, Math.floor(matches[0] * factor));
        const g = Math.min(255, Math.floor(matches[1] * factor));
        const b = Math.min(255, Math.floor(matches[2] * factor));
        return `rgb(${r}, ${g}, ${b})`;
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game('gameCanvas');
});
