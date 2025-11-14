// Main game class - ties everything together

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Resize canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // World size
        this.worldWidth = Math.floor(this.canvas.width / CONFIG.PIXEL_SIZE);
        this.worldHeight = Math.floor(this.canvas.height / CONFIG.PIXEL_SIZE);

        // Initialize systems
        this.biomeGenerator = new BiomeGenerator();
        this.world = new PhysicsWorld(this.worldWidth, this.worldHeight, this.biomeGenerator);
        this.player = new Player(this.canvas.width / 2, this.canvas.height * 0.3);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];

        // Game state
        this.running = true;
        this.paused = false;
        this.gameOver = false;
        this.depth = 0;
        this.enemySpawnTimer = 0;
        this.perkTimer = 0;
        this.showingPerks = false;

        // Performance
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.lastFpsUpdate = Date.now();

        // Camera
        this.cameraX = 0;
        this.cameraY = 0;

        this.setupInput();
        this.gameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.player.keys[e.key.toLowerCase()] = true;

            if (e.key === 'Escape') {
                this.running = false;
            }

            if (e.key === 'q' || e.key === 'Q') {
                this.player.switchWand(-1);
            }

            if (e.key === 'e' || e.key === 'E') {
                this.player.switchWand(1);
            }
        });

        window.addEventListener('keyup', (e) => {
            this.player.keys[e.key.toLowerCase()] = false;
        });

        // Mouse
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.player.mouseX = e.clientX - rect.left + this.cameraX;
            this.player.mouseY = e.clientY - rect.top + this.cameraY;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.player.mouseDown = true;
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.player.mouseDown = false;
        });

        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    gameLoop() {
        if (!this.running) return;

        const currentTime = Date.now();
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap at 100ms
        this.lastTime = currentTime;

        this.update(dt);
        this.draw();

        // FPS counter
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate > 500) {
            this.fps = Math.round(this.frameCount * 2);
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    update(dt) {
        if (this.paused || this.gameOver || this.showingPerks) return;

        // Update player
        this.player.update(dt, this.world);

        // Shooting
        if (this.player.mouseDown) {
            const newProjectiles = this.player.cast();
            this.projectiles.push(...newProjectiles);
        }

        // Update camera
        this.cameraX = this.player.x - this.canvas.width / 2;
        this.cameraY = this.player.y - this.canvas.height / 2;
        this.cameraX = Math.max(0, Math.min(this.cameraX, this.worldWidth * CONFIG.PIXEL_SIZE - this.canvas.width));
        this.cameraY = Math.max(0, Math.min(this.cameraY, this.worldHeight * CONFIG.PIXEL_SIZE - this.canvas.height));

        // Update depth
        this.depth = Math.max(0, this.player.y - this.canvas.height * 0.3);

        // Update physics world
        this.world.update(dt);

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.update(dt, this.world, this.enemies);

            // Check hits on enemies
            for (const enemy of this.enemies) {
                if (!p.dead && p.hits(enemy)) {
                    let damage = p.damage;

                    // Critical hit
                    if (Math.random() < this.player.critChance) {
                        damage *= 2;
                        this.spawnFloatingText(enemy.x, enemy.y - 20, 'CRIT!', 'rgb(255, 200, 0)');
                    }

                    enemy.takeDamage(damage);

                    if (!p.piercing) {
                        p.dead = true;
                    }

                    if (p.explosive) {
                        const px = Math.floor(p.x / CONFIG.PIXEL_SIZE);
                        const py = Math.floor(p.y / CONFIG.PIXEL_SIZE);
                        this.world.createExplosion(px, py, p.explosionRadius);
                    }
                }
            }

            return !p.dead;
        });

        // Update enemies
        this.enemies = this.enemies.filter(e => {
            e.update(dt, this.player, this.world);

            if (e.dead) {
                this.player.addGold(e.type.goldDrop || 10);
                this.player.onKill();
                this.spawnDeathParticles(e.x, e.y, e.color);
                return false;
            }

            return true;
        });

        // Spawn enemies
        this.enemySpawnTimer += dt;
        const biome = this.biomeGenerator.getCurrentBiome(this.depth);
        const spawnRate = 3.0 / biome.enemySpawnRate;

        if (this.enemySpawnTimer > spawnRate && this.enemies.length < 20) {
            this.enemySpawnTimer = 0;
            const spawnX = this.player.x + (Math.random() - 0.5) * 400;
            const spawnY = this.player.y + (Math.random() - 0.5) * 300;
            const enemy = spawnEnemy(spawnX, spawnY, biome);
            this.enemies.push(enemy);
        }

        // Update particles
        this.particles = this.particles.filter(p => {
            p.lifetime -= dt;
            p.vy += 100 * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            return p.lifetime > 0;
        });

        // Check perk eligibility
        this.perkTimer += dt;
        if (this.perkTimer > 30) { // Every 30 seconds
            this.perkTimer = 0;
            this.showPerkSelection();
        }

        // Check game over
        if (this.player.isDead()) {
            this.triggerGameOver();
        }

        // Update UI
        this.updateUI();
    }

    draw() {
        // Clear
        const biome = this.biomeGenerator.getCurrentBiome(this.depth);
        this.ctx.fillStyle = biome.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw world pixels
        const startX = Math.floor(this.cameraX / CONFIG.PIXEL_SIZE);
        const startY = Math.floor(this.cameraY / CONFIG.PIXEL_SIZE);
        const endX = Math.ceil((this.cameraX + this.canvas.width) / CONFIG.PIXEL_SIZE);
        const endY = Math.ceil((this.cameraY + this.canvas.height) / CONFIG.PIXEL_SIZE);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const pixel = this.world.getPixel(x, y);
                if (!pixel || pixel.isEmpty()) continue;

                const mat = pixel.material;
                const sx = x * CONFIG.PIXEL_SIZE - this.cameraX;
                const sy = y * CONFIG.PIXEL_SIZE - this.cameraY;

                // Draw pixel
                this.ctx.fillStyle = mat.color;

                // Light emission
                if (mat.emitsLight) {
                    this.ctx.shadowBlur = 8;
                    this.ctx.shadowColor = mat.lightColor || mat.color;
                }

                this.ctx.fillRect(sx, sy, CONFIG.PIXEL_SIZE, CONFIG.PIXEL_SIZE);
                this.ctx.shadowBlur = 0;
            }
        }

        // Draw particles
        for (const p of this.particles) {
            this.ctx.fillStyle = p.color;
            const alpha = Math.min(1, p.lifetime);
            this.ctx.globalAlpha = alpha;
            this.ctx.fillRect(
                p.x - this.cameraX,
                p.y - this.cameraY,
                CONFIG.PIXEL_SIZE,
                CONFIG.PIXEL_SIZE
            );
        }
        this.ctx.globalAlpha = 1;

        // Draw projectiles
        for (const p of this.projectiles) {
            p.draw(this.ctx, this.cameraX, this.cameraY);
        }

        // Draw enemies
        for (const e of this.enemies) {
            e.draw(this.ctx, this.cameraX, this.cameraY);
        }

        // Draw player
        this.player.draw(this.ctx, this.cameraX, this.cameraY);

        // Draw crosshair
        const mouseScreenX = this.player.mouseX - this.cameraX;
        const mouseScreenY = this.player.mouseY - this.cameraY;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(mouseScreenX - 10, mouseScreenY);
        this.ctx.lineTo(mouseScreenX + 10, mouseScreenY);
        this.ctx.moveTo(mouseScreenX, mouseScreenY - 10);
        this.ctx.lineTo(mouseScreenX, mouseScreenY + 10);
        this.ctx.stroke();
    }

    spawnDeathParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = 50 + Math.random() * 50;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50,
                color,
                lifetime: 0.5 + Math.random() * 0.5,
            });
        }
    }

    spawnFloatingText(x, y, text, color) {
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: -50,
            color,
            lifetime: 1.0,
            text,
        });
    }

    showPerkSelection() {
        this.showingPerks = true;
        const perks = getRandomPerks(3);
        const panel = document.getElementById('perks-panel');
        const options = document.getElementById('perk-options');

        options.innerHTML = '';
        for (const perk of perks) {
            const div = document.createElement('div');
            div.className = 'perk-option';
            div.innerHTML = `
                <div class="perk-name">${perk.name}</div>
                <div class="perk-desc">${perk.description}</div>
            `;
            div.onclick = () => {
                this.player.addPerk(perk);
                panel.style.display = 'none';
                this.showingPerks = false;
            };
            options.appendChild(div);
        }

        panel.style.display = 'block';
    }

    updateUI() {
        document.getElementById('fps').textContent = this.fps;
        document.getElementById('depth').textContent = Math.floor(this.depth / CONFIG.PIXEL_SIZE);
        document.getElementById('gold').textContent = this.player.gold;
        document.getElementById('kills').textContent = this.player.kills;

        // Health bar
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        document.getElementById('hp-bar').style.width = hpPercent + '%';
        document.getElementById('hp-text').textContent =
            `${Math.ceil(this.player.hp)}/${this.player.maxHp}`;

        // Mana bar
        const manaPercent = (this.player.mana / this.player.maxMana) * 100;
        document.getElementById('mana-bar').style.width = manaPercent + '%';
        document.getElementById('mana-text').textContent =
            `${Math.ceil(this.player.mana)}/${this.player.maxMana}`;

        // Wand info
        const wand = this.player.currentWand;
        document.getElementById('wand-name').textContent = wand.name;
        document.getElementById('cast-delay').textContent = wand.castDelay.toFixed(2);
        document.getElementById('recharge').textContent = wand.rechargeTime.toFixed(2);
        document.getElementById('spread').textContent = Math.floor(wand.spread);

        // Spell list
        const spellList = document.getElementById('spell-list');
        spellList.innerHTML = '';
        for (const spell of wand.spells) {
            const span = document.createElement('span');
            span.className = spell.type === 'modifier' ? 'spell-slot spell-modifier' : 'spell-slot';
            span.textContent = spell.name;
            spellList.appendChild(span);
        }

        // Status effects
        const statusPanel = document.getElementById('status-effects');
        const statusList = document.getElementById('status-list');

        if (this.player.statusEffects.size > 0 || this.player.wet) {
            statusPanel.style.display = 'block';
            statusList.innerHTML = '';

            if (this.player.statusEffects.has('burning')) {
                statusList.innerHTML += '<span class="status-icon">🔥 Burning</span>';
            }
            if (this.player.wet) {
                statusList.innerHTML += '<span class="status-icon" style="border-color: #55f; background: rgba(50,100,200,0.3);">💧 Wet</span>';
            }
            if (this.player.statusEffects.has('electrified')) {
                statusList.innerHTML += '<span class="status-icon" style="border-color: #5ff; background: rgba(100,200,255,0.3);">⚡ Shocked</span>';
            }
            if (this.player.statusEffects.has('poisoned')) {
                statusList.innerHTML += '<span class="status-icon" style="border-color: #5f5; background: rgba(100,255,100,0.3);">🧪 Poisoned</span>';
            }
        } else {
            statusPanel.style.display = 'none';
        }
    }

    triggerGameOver() {
        this.gameOver = true;
        document.getElementById('final-depth').textContent = Math.floor(this.depth / CONFIG.PIXEL_SIZE);
        document.getElementById('final-kills').textContent = this.player.kills;
        document.getElementById('final-gold').textContent = this.player.gold;
        document.getElementById('game-over').style.display = 'block';
    }
}
