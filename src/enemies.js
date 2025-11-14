// Enemy types and AI

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = 0;
        this.vy = 0;
        this.size = type.size;
        this.hp = type.hp;
        this.maxHp = type.hp;
        this.speed = type.speed;
        this.damage = type.damage;
        this.color = type.color;
        this.aiTimer = Math.random();
        this.dead = false;
        this.hostile = true;
    }

    update(dt, player, world) {
        this.aiTimer += dt;

        // Simple AI: move toward player
        if (this.aiTimer > 0.5) {
            this.aiTimer = 0;

            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 0 && dist < 300) {
                this.vx = (dx / dist) * this.speed;
                this.vy = (dy / dist) * this.speed;
            } else {
                this.vx *= 0.9;
                this.vy *= 0.9;
            }
        }

        // Move
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Simple collision with world
        const px = Math.floor(this.x / CONFIG.PIXEL_SIZE);
        const py = Math.floor(this.y / CONFIG.PIXEL_SIZE);

        if (world.getPixel(px, py) && !world.isEmpty(px, py)) {
            this.x -= this.vx * dt;
            this.y -= this.vy * dt;
            this.vx = 0;
            this.vy = 0;
        }

        // Check collision with player
        const playerDist = Math.hypot(player.x - this.x, player.y - this.y);
        if (playerDist < this.size + CONFIG.PLAYER_SIZE) {
            player.takeDamage(this.damage * dt);
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.dead = true;
        }
    }

    draw(ctx) {
        // Health bar
        if (this.hp < this.maxHp) {
            const barWidth = this.size * 2;
            const barHeight = 3;
            ctx.fillStyle = '#f00';
            ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 8, barWidth, barHeight);
            ctx.fillStyle = '#0f0';
            const healthPercent = this.hp / this.maxHp;
            ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 8, barWidth * healthPercent, barHeight);
        }

        // Body
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.2, this.size * 0.2, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.3, this.y - this.size * 0.2, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Enemy types
const ENEMY_TYPES = {
    SLIME: {
        name: 'Slime',
        size: 8,
        hp: 30,
        speed: 50,
        damage: 10,
        color: 'rgb(100, 255, 100)',
        goldDrop: 5,
    },

    FIRE_SPIRIT: {
        name: 'Fire Spirit',
        size: 10,
        hp: 40,
        speed: 70,
        damage: 15,
        color: 'rgb(255, 100, 50)',
        goldDrop: 10,
    },

    GHOST: {
        name: 'Ghost',
        size: 12,
        hp: 50,
        speed: 60,
        damage: 20,
        color: 'rgb(200, 200, 255)',
        goldDrop: 15,
    },

    GOLEM: {
        name: 'Golem',
        size: 16,
        hp: 100,
        speed: 30,
        damage: 30,
        color: 'rgb(120, 100, 80)',
        goldDrop: 25,
    },

    WIZARD: {
        name: 'Wizard',
        size: 10,
        hp: 60,
        speed: 50,
        damage: 25,
        color: 'rgb(150, 50, 200)',
        goldDrop: 20,
    },
};

function spawnEnemy(x, y, biome) {
    const types = Object.values(ENEMY_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    return new Enemy(x, y, type);
}
