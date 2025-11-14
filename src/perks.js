// Perk system for player upgrades

class Perk {
    constructor(config) {
        this.name = config.name;
        this.description = config.description;
        this.apply = config.apply; // Function to apply effect
    }
}

const PERKS = {
    EXTRA_HP: new Perk({
        name: 'Extra HP',
        description: 'Increases max health by 50',
        apply: (player) => {
            player.maxHp += 50;
            player.hp += 50;
        }
    }),

    EXPLOSION_IMMUNITY: new Perk({
        name: 'Explosion Immunity',
        description: 'Take no damage from explosions',
        apply: (player) => {
            player.explosionImmune = true;
        }
    }),

    VAMPIRISM: new Perk({
        name: 'Vampirism',
        description: 'Heal 5 HP when killing enemies',
        apply: (player) => {
            player.vampirism = true;
        }
    }),

    GREED: new Perk({
        name: 'Greed',
        description: 'Double gold from enemies',
        apply: (player) => {
            player.goldMultiplier *= 2;
        }
    }),

    MANA_BOOST: new Perk({
        name: 'Mana Boost',
        description: 'Increase mana regeneration by 50%',
        apply: (player) => {
            player.manaRegen *= 1.5;
        }
    }),

    FAST_MOVEMENT: new Perk({
        name: 'Fast Movement',
        description: 'Increase movement speed by 30%',
        apply: (player) => {
            player.speed *= 1.3;
        }
    }),

    SAVING_GRACE: new Perk({
        name: 'Saving Grace',
        description: 'Survive one fatal hit (once)',
        apply: (player) => {
            player.savingGrace = true;
        }
    }),

    FIRE_IMMUNITY: new Perk({
        name: 'Fire Immunity',
        description: 'Take no damage from fire',
        apply: (player) => {
            player.fireImmune = true;
        }
    }),

    ELECTRICITY: new Perk({
        name: 'Electricity',
        description: 'Emit electricity when moving',
        apply: (player) => {
            player.electricAura = true;
        }
    }),

    PROJECTILE_REPULSION: new Perk({
        name: 'Projectile Repulsion',
        description: 'Enemy projectiles are slower near you',
        apply: (player) => {
            player.projectileRepulsion = true;
        }
    }),

    EXTRA_LIFE: new Perk({
        name: 'Extra Life',
        description: 'Resurrect once with 50% HP',
        apply: (player) => {
            player.extraLives += 1;
        }
    }),

    CRITICAL_CHANCE: new Perk({
        name: 'Critical Hit',
        description: '20% chance for double damage',
        apply: (player) => {
            player.critChance = 0.2;
        }
    }),
};

function getRandomPerks(count = 3) {
    const allPerks = Object.values(PERKS);
    const selected = [];
    const available = [...allPerks];

    for (let i = 0; i < count && available.length > 0; i++) {
        const index = Math.floor(Math.random() * available.length);
        selected.push(available.splice(index, 1)[0]);
    }

    return selected;
}
