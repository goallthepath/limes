// Player character with status effects and perks

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.PLAYER_SPEED;
        this.size = CONFIG.PLAYER_SIZE;

        // Stats
        this.hp = CONFIG.PLAYER_HP;
        this.maxHp = CONFIG.PLAYER_HP;
        this.mana = 100;
        this.maxMana = 100;
        this.manaRegen = CONFIG.MANA_REGEN;

        // Combat
        this.iframeTimer = 0;
        this.gold = CONFIG.STARTING_GOLD;
        this.kills = 0;

        // Wands
        this.wands = [WAND_TEMPLATES.STARTER.clone()];
        this.currentWandIndex = 0;

        // Status effects
        this.statusEffects = new Map();
        this.burning = false;
        this.wet = false;
        this.electrified = false;
        this.poisoned = false;
        this.frozen = false;

        // Perks
        this.perks = [];
        this.explosionImmune = false;
        this.fireImmune = false;
        this.vampirism = false;
        this.goldMultiplier = 1;
        this.savingGrace = false;
        this.electricAura = false;
        this.projectileRepulsion = false;
        this.extraLives = 0;
        this.critChance = 0;

        // Input
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;

        // Particles
        this.particles = [];
    }

    get currentWand() {
        return this.wands[this.currentWandIndex];
    }

    update(dt, world) {
        // Update iframes
        if (this.iframeTimer > 0) {
            this.iframeTimer -= dt;
        }

        // Movement
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

        // Move
        const newX = this.x + this.vx * dt;
        const newY = this.y + this.vy * dt;

        // Simple collision
        const px = Math.floor(newX / CONFIG.PIXEL_SIZE);
        const py = Math.floor(newY / CONFIG.PIXEL_SIZE);

        if (world.isEmpty(px, py)) {
            this.x = newX;
            this.y = newY;
        }

        // Electric aura perk
        if (this.electricAura && (this.vx !== 0 || this.vy !== 0)) {
            if (Math.random() < 0.3) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 15;
                const ex = px + Math.floor(Math.cos(angle) * dist);
                const ey = py + Math.floor(Math.sin(angle) * dist);
                if (world.isEmpty(ex, ey)) {
                    world.setPixel(ex, ey, MaterialType.ELECTRICITY);
                }
            }
        }

        // Update wands
        this.currentWand.update(dt);

        // Mana regen
        if (this.mana < this.maxMana) {
            this.mana = Math.min(this.maxMana, this.mana + this.manaRegen * dt);
        }

        // Status effects
        this.updateStatusEffects(dt, world);

        // Update particles
        this.particles = this.particles.filter(p => {
            p.lifetime -= dt;
            p.y -= 30 * dt;
            p.alpha -= dt * 2;
            return p.lifetime > 0 && p.alpha > 0;
        });
    }

    updateStatusEffects(dt, world) {
        const px = Math.floor(this.x / CONFIG.PIXEL_SIZE);
        const py = Math.floor(this.y / CONFIG.PIXEL_SIZE);

        // Check environment
        const pixel = world.getPixel(px, py);
        if (pixel) {
            // Fire
            if (pixel.type === MaterialType.FIRE || pixel.type === MaterialType.LAVA) {
                if (!this.fireImmune) {
                    this.addStatusEffect('burning', 2.0);
                }
            }

            // Water
            if (pixel.type === MaterialType.WATER) {
                this.wet = true;
                this.removeStatusEffect('burning');
            }

            // Poison
            if (pixel.type === MaterialType.POISON) {
                this.addStatusEffect('poisoned', 3.0);
            }

            // Electricity
            if (pixel.type === MaterialType.ELECTRICITY) {
                if (this.wet) {
                    this.takeDamage(CONFIG.ELECTRICITY_DAMAGE);
                    this.addStatusEffect('electrified', 1.0);
                }
            }
        }

        // Update status durations
        for (const [status, data] of this.statusEffects) {
            data.duration -= dt;

            // Apply effects
            if (status === 'burning' && !this.fireImmune) {
                this.takeDamage(CONFIG.FIRE_DAMAGE * dt);
            } else if (status === 'poisoned') {
                this.takeDamage(5 * dt);
            }

            if (data.duration <= 0) {
                this.removeStatusEffect(status);
            }
        }

        // Wet dissipates
        if (this.wet) {
            this.wet = Math.random() > 0.01 * dt;
        }
    }

    addStatusEffect(name, duration) {
        this.statusEffects.set(name, { duration });
    }

    removeStatusEffect(name) {
        this.statusEffects.delete(name);
    }

    cast() {
        if (!this.currentWand.canCast()) return [];

        const projectiles = this.currentWand.cast(
            this.x,
            this.y,
            this.mouseX,
            this.mouseY
        );

        // Sync mana
        this.mana = this.currentWand.currentMana;
        this.maxMana = this.currentWand.maxMana;

        return projectiles;
    }

    switchWand(direction) {
        this.currentWandIndex = (this.currentWandIndex + direction + this.wands.length) % this.wands.length;
    }

    takeDamage(amount) {
        if (this.iframeTimer > 0) return;

        this.hp -= amount;
        this.iframeTimer = CONFIG.IFRAME_DURATION;

        // Saving grace perk
        if (this.hp <= 0 && this.savingGrace) {
            this.hp = 1;
            this.savingGrace = false;
            this.showFloatingText('SAVED!', 'rgb(255, 215, 0)');
        }

        // Extra life perk
        if (this.hp <= 0 && this.extraLives > 0) {
            this.hp = this.maxHp * 0.5;
            this.extraLives--;
            this.showFloatingText('+1 LIFE', 'rgb(0, 255, 0)');
        }
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.showFloatingText(`+${Math.floor(amount)} HP`, 'rgb(0, 255, 0)');
    }

    addGold(amount) {
        const finalAmount = Math.floor(amount * this.goldMultiplier);
        this.gold += finalAmount;
        this.showFloatingText(`+${finalAmount}G`, 'rgb(255, 215, 0)');
    }

    onKill() {
        this.kills++;
        if (this.vampirism) {
            this.heal(5);
        }
    }

    addPerk(perk) {
        perk.apply(this);
        this.perks.push(perk);
    }

    showFloatingText(text, color) {
        this.particles.push({
            text,
            x: this.x,
            y: this.y - this.size,
            color,
            lifetime: 1.0,
            alpha: 1.0,
        });
    }

    draw(ctx, cameraX, cameraY) {
        const sx = this.x - cameraX;
        const sy = this.y - cameraY;

        // Invincibility flicker
        if (this.iframeTimer > 0 && Math.floor(this.iframeTimer * 20) % 2 === 0) {
            return;
        }

        // Status glow
        if (this.statusEffects.has('burning')) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgb(255, 100, 0)';
        } else if (this.statusEffects.has('electrified')) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgb(100, 200, 255)';
        } else if (this.wet) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgb(50, 100, 200)';
        }

        // Body
        ctx.fillStyle = 'rgb(200, 50, 50)';
        ctx.beginPath();
        ctx.arc(sx, sy, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Face
        ctx.fillStyle = 'rgb(255, 215, 0)';
        ctx.beginPath();
        ctx.arc(sx, sy - 2, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Floating text
        for (const particle of this.particles) {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.font = '12px monospace';
            ctx.fillText(particle.text, particle.x - cameraX, particle.y - cameraY);
        }
        ctx.globalAlpha = 1;
    }

    isDead() {
        return this.hp <= 0;
    }
}
