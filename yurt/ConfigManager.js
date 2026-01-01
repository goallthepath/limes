export class ConfigManager {
    constructor() {
        this.config = {
            // Dimensions
            diameter: 5.0,
            wallHeight: 1.8,
            roofHeight: 2.5,

            // Structure
            khanaSections: 6,
            rafters: 24,
            tonoSize: 0.8,

            // Features
            doorStyle: 'traditional',
            tensionBand: true,
            skylight: 'clear',

            // Materials
            canvasMaterial: 'traditional',
            canvasColor: '#f5f5dc',
            woodType: 'pine'
        };

        this.listeners = [];
    }

    updateConfig(key, value) {
        // Handle special conversions
        if (key === 'tensionBand') {
            value = value === 'yes';
        }

        // Validate constraints
        this.validateConfig(key, value);

        // Update config
        const oldValue = this.config[key];
        this.config[key] = value;

        // Auto-adjust related parameters
        this.applyConstraints(key, value);

        // Notify listeners
        this.notifyListeners(key, value, oldValue);
    }

    validateConfig(key, value) {
        // Ensure rafters are divisible by 4 and reasonable for diameter
        if (key === 'rafters') {
            const minRafters = Math.max(16, Math.floor(this.config.diameter) * 3);
            const maxRafters = Math.floor(this.config.diameter) * 8;
            if (value < minRafters || value > maxRafters) {
                console.warn(`Rafters should be between ${minRafters} and ${maxRafters} for this diameter`);
            }
        }

        // Ensure tono size is appropriate for diameter
        if (key === 'tonoSize') {
            const maxTonoSize = this.config.diameter * 0.25;
            if (value > maxTonoSize) {
                console.warn(`Tono size should not exceed ${maxTonoSize.toFixed(1)}m for this diameter`);
            }
        }

        // Ensure wall height is reasonable
        if (key === 'wallHeight') {
            if (value > this.config.roofHeight * 0.9) {
                console.warn('Wall height should be less than roof height');
            }
        }

        // Ensure roof height is reasonable
        if (key === 'roofHeight') {
            if (value < this.config.wallHeight * 1.1) {
                console.warn('Roof height should be greater than wall height');
            }
        }
    }

    applyConstraints(key, value) {
        // When diameter changes, adjust tono size proportionally
        if (key === 'diameter') {
            const tonoRatio = this.config.tonoSize / this.config.diameter;
            if (tonoRatio > 0.25) {
                this.config.tonoSize = value * 0.20;
            }

            // Adjust rafters to maintain density
            const rafterDensity = this.config.rafters / this.config.diameter;
            const newRafters = Math.round(value * rafterDensity / 4) * 4;
            this.config.rafters = Math.max(16, Math.min(48, newRafters));
        }

        // When khana sections change, ensure it's even for door placement
        if (key === 'khanaSections' && value % 2 !== 0 && value < 12) {
            console.warn('Even number of khana sections recommended for symmetrical door placement');
        }

        // Ensure roof height is always above wall height
        if (key === 'wallHeight' && value >= this.config.roofHeight) {
            this.config.roofHeight = value + 0.5;
        }
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(key, value, oldValue) {
        this.listeners.forEach(callback => {
            callback(key, value, oldValue);
        });
    }

    getStats() {
        const radius = this.config.diameter / 2;
        const floorArea = Math.PI * radius * radius;
        const perimeter = 2 * Math.PI * radius;

        // Calculate canvas area (walls + roof)
        const wallArea = perimeter * this.config.wallHeight;
        const roofSlantHeight = Math.sqrt(
            Math.pow(radius - this.config.tonoSize / 2, 2) +
            Math.pow(this.config.roofHeight - this.config.wallHeight, 2)
        );
        const roofArea = Math.PI * (radius + this.config.tonoSize / 2) * roofSlantHeight;
        const canvasArea = wallArea + roofArea;

        // Calculate volume (cylinder + cone)
        const wallVolume = floorArea * this.config.wallHeight;
        const roofVolume = (1/3) * Math.PI * radius * radius * (this.config.roofHeight - this.config.wallHeight);
        const volume = wallVolume + roofVolume;

        return {
            floorArea,
            perimeter,
            canvasArea,
            volume,
            wallArea,
            roofArea
        };
    }

    getMaterialCounts() {
        const stats = this.getStats();

        // Khana lattice pieces (estimate based on sections)
        const khanaPiecesPerSection = 8; // Cross pieces
        const khanaCount = this.config.khanaSections * khanaPiecesPerSection;

        // Rafters
        const rafterCount = this.config.rafters;

        // Roof ring supports
        const tonoSupports = Math.ceil(this.config.tonoSize * 6);

        // Total wood pieces
        const totalWoodPieces = khanaCount + rafterCount + tonoSupports + 12; // +12 for door frame and misc

        return {
            khanaLattice: khanaCount,
            rafters: rafterCount,
            tonoSupports: tonoSupports,
            doorFrame: 1,
            totalWoodPieces,
            canvasArea: stats.canvasArea,
            tensionBands: this.config.tensionBand ? 2 : 0
        };
    }

    export() {
        return {
            config: { ...this.config },
            stats: this.getStats(),
            materials: this.getMaterialCounts(),
            timestamp: new Date().toISOString()
        };
    }

    import(data) {
        if (data.config) {
            Object.keys(data.config).forEach(key => {
                if (key in this.config) {
                    this.updateConfig(key, data.config[key]);
                }
            });
        }
    }
}
