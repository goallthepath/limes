// Spell system - projectiles, modifiers, and triggers

class Spell {
    constructor(config) {
        this.name = config.name;
        this.type = config.type; // 'projectile', 'modifier', 'utility', 'trigger'
        this.manaCost = config.manaCost || 10;
        this.castTime = config.castTime || 0;

        // Projectile properties
        this.damage = config.damage || 0;
        this.speed = config.speed || 200;
        this.lifetime = config.lifetime || 2.0;
        this.size = config.size || 2;
        this.color = config.color || 'rgb(255, 255, 255)';
        this.material = config.material || null;
        this.piercing = config.piercing || false;
        this.bounces = config.bounces || 0;
        this.homing = config.homing || 0;
        this.explosive = config.explosive || false;
        this.explosionRadius = config.explosionRadius || 10;

        // Modifier properties
        this.damageMultiplier = config.damageMultiplier || 1;
        this.speedMultiplier = config.speedMultiplier || 1;
        this.sizeMultiplier = config.sizeMultiplier || 1;
        this.bounceAdd = config.bounceAdd || 0;
        this.homingAdd = config.homingAdd || 0;

        // Trigger properties
        this.triggerSpells = config.triggerSpells || [];
        this.triggerDelay = config.triggerDelay || 0;
    }
}

// Define all spells
const SPELLS = {
    // Projectiles
    MAGIC_ARROW: new Spell({
        name: 'Magic Arrow',
        type: 'projectile',
        damage: 15,
        speed: 300,
        lifetime: 1.5,
        color: 'rgb(150, 150, 255)',
        manaCost: 5,
    }),

    FIREBALL: new Spell({
        name: 'Fireball',
        type: 'projectile',
        damage: 25,
        speed: 200,
        lifetime: 2.0,
        color: 'rgb(255, 100, 0)',
        material: MaterialType.FIRE,
        manaCost: 15,
    }),

    LIGHTNING_BOLT: new Spell({
        name: 'Lightning Bolt',
        type: 'projectile',
        damage: 40,
        speed: 500,
        lifetime: 0.5,
        color: 'rgb(100, 200, 255)',
        material: MaterialType.ELECTRICITY,
        manaCost: 25,
        piercing: true,
    }),

    ACID_BALL: new Spell({
        name: 'Acid Ball',
        type: 'projectile',
        damage: 20,
        speed: 150,
        lifetime: 2.5,
        color: 'rgb(100, 255, 50)',
        material: MaterialType.ACID,
        manaCost: 20,
    }),

    WATER_BOLT: new Spell({
        name: 'Water Bolt',
        type: 'projectile',
        damage: 5,
        speed: 250,
        lifetime: 1.5,
        color: 'rgb(50, 100, 200)',
        material: MaterialType.WATER,
        manaCost: 10,
    }),

    ENERGY_ORB: new Spell({
        name: 'Energy Orb',
        type: 'projectile',
        damage: 30,
        speed: 150,
        lifetime: 3.0,
        size: 4,
        color: 'rgb(255, 50, 255)',
        manaCost: 30,
    }),

    // Modifiers
    DAMAGE_PLUS: new Spell({
        name: 'Damage+',
        type: 'modifier',
        damageMultiplier: 1.5,
        manaCost: 10,
        color: 'rgb(255, 100, 100)',
    }),

    SPEED_PLUS: new Spell({
        name: 'Speed+',
        type: 'modifier',
        speedMultiplier: 1.5,
        manaCost: 5,
        color: 'rgb(100, 255, 100)',
    }),

    HOMING: new Spell({
        name: 'Homing',
        type: 'modifier',
        homingAdd: 0.5,
        manaCost: 15,
        color: 'rgb(255, 255, 100)',
    }),

    BOUNCE: new Spell({
        name: 'Bounce',
        type: 'modifier',
        bounceAdd: 3,
        manaCost: 10,
        color: 'rgb(100, 255, 255)',
    }),

    EXPLOSION: new Spell({
        name: 'Explosive',
        type: 'modifier',
        explosive: true,
        explosionRadius: 15,
        manaCost: 20,
        color: 'rgb(255, 150, 0)',
    }),

    RAPID_FIRE: new Spell({
        name: 'Rapid Fire',
        type: 'modifier',
        castTime: -0.1,
        manaCost: 5,
        color: 'rgb(200, 200, 100)',
    }),

    // Utility
    TELEPORT: new Spell({
        name: 'Teleport',
        type: 'utility',
        manaCost: 30,
        color: 'rgb(200, 100, 255)',
    }),

    SHIELD: new Spell({
        name: 'Shield',
        type: 'utility',
        manaCost: 20,
        color: 'rgb(100, 200, 255)',
    }),
};

// Projectile entity
class Projectile {
    constructor(x, y, vx, vy, spell, modifiers = []) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.age = 0;
        this.bounceCount = 0;
        this.dead = false;

        // Apply base spell
        this.damage = spell.damage;
        this.lifetime = spell.lifetime;
        this.size = spell.size;
        this.color = spell.color;
        this.material = spell.material;
        this.piercing = spell.piercing;
        this.bounces = spell.bounces;
        this.homing = spell.homing;
        this.explosive = spell.explosive;
        this.explosionRadius = spell.explosionRadius;

        // Apply modifiers
        for (const mod of modifiers) {
            this.damage *= mod.damageMultiplier;
            this.vx *= mod.speedMultiplier;
            this.vy *= mod.speedMultiplier;
            this.size *= mod.sizeMultiplier;
            this.bounces += mod.bounceAdd;
            this.homing += mod.homingAdd;
            if (mod.explosive) {
                this.explosive = true;
                this.explosionRadius = mod.explosionRadius;
            }
        }
    }

    update(dt, world, enemies) {
        this.age += dt;

        if (this.age > this.lifetime) {
            this.dead = true;
            return;
        }

        // Homing behavior
        if (this.homing > 0 && enemies.length > 0) {
            const closest = enemies.reduce((prev, curr) => {
                const d1 = Math.hypot(prev.x - this.x, prev.y - this.y);
                const d2 = Math.hypot(curr.x - this.x, curr.y - this.y);
                return d2 < d1 ? curr : prev;
            });

            const dx = closest.x - this.x;
            const dy = closest.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 0) {
                const turnSpeed = this.homing * dt * 5;
                this.vx += (dx / dist) * turnSpeed * 100;
                this.vy += (dy / dist) * turnSpeed * 100;

                // Normalize speed
                const speed = Math.hypot(this.vx, this.vy);
                const targetSpeed = 200;
                this.vx = (this.vx / speed) * targetSpeed;
                this.vy = (this.vy / speed) * targetSpeed;
            }
        }

        // Move
        const steps = 3;
        const stepX = (this.vx * dt) / steps;
        const stepY = (this.vy * dt) / steps;

        for (let i = 0; i < steps; i++) {
            this.x += stepX;
            this.y += stepY;

            // Collision with world
            const px = Math.floor(this.x / CONFIG.PIXEL_SIZE);
            const py = Math.floor(this.y / CONFIG.PIXEL_SIZE);
            const pixel = world.getPixel(px, py);

            if (pixel && !pixel.isEmpty()) {
                if (this.explosive) {
                    world.createExplosion(px, py, this.explosionRadius);
                    this.dead = true;
                    return;
                }

                if (this.material) {
                    world.setPixel(px, py, this.material);
                }

                if (this.piercing) {
                    // Continue through
                } else if (this.bounces > 0 && this.bounceCount < this.bounces) {
                    // Bounce
                    this.vx *= -0.8;
                    this.vy *= -0.8;
                    this.bounceCount++;
                } else {
                    this.dead = true;
                    return;
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    hits(entity) {
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        const dist = Math.hypot(dx, dy);
        return dist < this.size + entity.size;
    }
}
