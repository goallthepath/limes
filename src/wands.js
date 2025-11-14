// Wand system with stats and spell combinations

class Wand {
    constructor(config) {
        this.name = config.name || 'Wand';
        this.castDelay = config.castDelay || 0.3;
        this.rechargeTime = config.rechargeTime || 1.0;
        this.maxMana = config.maxMana || 100;
        this.manaRecharge = config.manaRecharge || 20;
        this.spread = config.spread || 5; // degrees
        this.spellsPerCast = config.spellsPerCast || 1;
        this.shuffle = config.shuffle || false;

        this.spells = config.spells || [];
        this.alwaysCast = config.alwaysCast || [];

        this.currentMana = this.maxMana;
        this.castTimer = 0;
        this.rechargeTimer = 0;
        this.spellIndex = 0;
    }

    update(dt) {
        // Recharge mana
        if (this.currentMana < this.maxMana) {
            this.currentMana = Math.min(this.maxMana, this.currentMana + this.manaRecharge * dt);
        }

        // Update timers
        if (this.castTimer > 0) {
            this.castTimer -= dt;
        }
        if (this.rechargeTimer > 0) {
            this.rechargeTimer -= dt;
        }
    }

    canCast() {
        return this.castTimer <= 0 && this.rechargeTimer <= 0 && this.spells.length > 0;
    }

    cast(x, y, targetX, targetY) {
        if (!this.canCast()) return [];

        const projectiles = [];
        let totalManaCost = 0;

        // Get spells to cast this round
        const spellsToCast = [];
        for (let i = 0; i < this.spellsPerCast; i++) {
            if (this.shuffle) {
                const spell = this.spells[Math.floor(Math.random() * this.spells.length)];
                spellsToCast.push(spell);
            } else {
                spellsToCast.push(this.spells[this.spellIndex]);
                this.spellIndex = (this.spellIndex + 1) % this.spells.length;
            }
        }

        // Separate projectiles and modifiers
        const projectileSpells = [];
        const modifierSpells = [];

        for (const spell of [...this.alwaysCast, ...spellsToCast]) {
            if (spell.type === 'projectile') {
                projectileSpells.push(spell);
            } else if (spell.type === 'modifier') {
                modifierSpells.push(spell);
            }
            totalManaCost += spell.manaCost;
        }

        // Check mana
        if (this.currentMana < totalManaCost) {
            return [];
        }

        // Consume mana
        this.currentMana -= totalManaCost;

        // Create projectiles
        const dx = targetX - x;
        const dy = targetY - y;
        const angle = Math.atan2(dy, dx);

        for (const spell of projectileSpells) {
            const spreadRad = (Math.random() - 0.5) * this.spread * Math.PI / 180;
            const finalAngle = angle + spreadRad;

            const speed = spell.speed;
            const vx = Math.cos(finalAngle) * speed;
            const vy = Math.sin(finalAngle) * speed;

            const projectile = new Projectile(x, y, vx, vy, spell, modifierSpells);
            projectiles.push(projectile);
        }

        // If no projectiles, just drain mana and continue
        if (projectiles.length === 0) {
            projectiles.push(
                new Projectile(x, y,
                    Math.cos(angle) * 200,
                    Math.sin(angle) * 200,
                    SPELLS.MAGIC_ARROW,
                    modifierSpells
                )
            );
        }

        // Set cooldowns
        this.castTimer = this.castDelay;

        // Check if we've cast all spells in the wand
        if (!this.shuffle && this.spellIndex === 0) {
            this.rechargeTimer = this.rechargeTime;
        }

        return projectiles;
    }

    clone() {
        return new Wand({
            name: this.name,
            castDelay: this.castDelay,
            rechargeTime: this.rechargeTime,
            maxMana: this.maxMana,
            manaRecharge: this.manaRecharge,
            spread: this.spread,
            spellsPerCast: this.spellsPerCast,
            shuffle: this.shuffle,
            spells: [...this.spells],
            alwaysCast: [...this.alwaysCast],
        });
    }
}

// Predefined wands
const WAND_TEMPLATES = {
    STARTER: new Wand({
        name: 'Starter Wand',
        castDelay: 0.3,
        rechargeTime: 1.0,
        maxMana: 100,
        manaRecharge: 20,
        spread: 5,
        spells: [SPELLS.MAGIC_ARROW],
    }),

    RAPID: new Wand({
        name: 'Rapid Wand',
        castDelay: 0.1,
        rechargeTime: 0.5,
        maxMana: 80,
        manaRecharge: 30,
        spread: 10,
        spells: [SPELLS.MAGIC_ARROW, SPELLS.MAGIC_ARROW, SPELLS.MAGIC_ARROW],
    }),

    EXPLOSIVE: new Wand({
        name: 'Explosion Wand',
        castDelay: 0.5,
        rechargeTime: 2.0,
        maxMana: 150,
        manaRecharge: 15,
        spread: 3,
        spells: [SPELLS.FIREBALL, SPELLS.EXPLOSION],
    }),

    HOMING: new Wand({
        name: 'Homing Wand',
        castDelay: 0.4,
        rechargeTime: 1.5,
        maxMana: 120,
        manaRecharge: 18,
        spread: 15,
        spells: [SPELLS.ENERGY_ORB, SPELLS.HOMING, SPELLS.DAMAGE_PLUS],
    }),

    CHAINSAW: new Wand({
        name: 'Chainsaw Wand',
        castDelay: 0.05,
        rechargeTime: 0.1,
        maxMana: 200,
        manaRecharge: 50,
        spread: 2,
        spells: [SPELLS.MAGIC_ARROW, SPELLS.RAPID_FIRE],
        alwaysCast: [SPELLS.SPEED_PLUS],
    }),

    ELEMENTAL: new Wand({
        name: 'Elemental Wand',
        castDelay: 0.35,
        rechargeTime: 1.2,
        maxMana: 130,
        manaRecharge: 22,
        spread: 8,
        shuffle: true,
        spells: [SPELLS.FIREBALL, SPELLS.WATER_BOLT, SPELLS.LIGHTNING_BOLT, SPELLS.ACID_BALL],
    }),
};

function generateRandomWand() {
    const templates = Object.values(WAND_TEMPLATES);
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.clone();
}
