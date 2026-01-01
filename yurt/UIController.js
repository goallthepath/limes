export class UIController {
    constructor(configManager, yurtBuilder) {
        this.configManager = configManager;
        this.yurtBuilder = yurtBuilder;

        this.setupControls();
        this.updateAllDisplays();
        this.updateStats();

        // Listen for config changes
        this.configManager.onChange((key) => {
            this.updateStats();
            this.yurtBuilder.build();
        });
    }

    setupControls() {
        // Range inputs
        this.setupRangeInput('diameter', (value) => {
            this.configManager.updateConfig('diameter', parseFloat(value));
        }, (value) => `${value} m`);

        this.setupRangeInput('wall-height', (value) => {
            this.configManager.updateConfig('wallHeight', parseFloat(value));
        }, (value) => `${value} m`);

        this.setupRangeInput('roof-height', (value) => {
            this.configManager.updateConfig('roofHeight', parseFloat(value));
        }, (value) => `${value} m`);

        this.setupRangeInput('khana-sections', (value) => {
            this.configManager.updateConfig('khanaSections', parseInt(value));
        }, (value) => value);

        this.setupRangeInput('rafters', (value) => {
            this.configManager.updateConfig('rafters', parseInt(value));
        }, (value) => value);

        this.setupRangeInput('tono-size', (value) => {
            this.configManager.updateConfig('tonoSize', parseFloat(value));
        }, (value) => `${value} m`);

        // Select inputs
        this.setupSelectInput('door-style', (value) => {
            this.configManager.updateConfig('doorStyle', value);
        });

        this.setupSelectInput('tension-band', (value) => {
            this.configManager.updateConfig('tensionBand', value);
        });

        this.setupSelectInput('skylight', (value) => {
            this.configManager.updateConfig('skylight', value);
        });

        this.setupSelectInput('canvas-material', (value) => {
            this.configManager.updateConfig('canvasMaterial', value);
        });

        this.setupSelectInput('wood-type', (value) => {
            this.configManager.updateConfig('woodType', value);
        });

        // Color picker
        this.setupColorPicker();
    }

    setupRangeInput(id, callback, displayFormatter) {
        const input = document.getElementById(id);
        const display = document.getElementById(`${id}-value`);

        const update = () => {
            const value = input.value;
            display.textContent = displayFormatter(value);
            callback(value);
        };

        input.addEventListener('input', update);
        update(); // Initial update
    }

    setupSelectInput(id, callback) {
        const select = document.getElementById(id);
        select.addEventListener('change', () => {
            callback(select.value);
        });
    }

    setupColorPicker() {
        const colorOptions = document.querySelectorAll('.color-option');

        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                const color = option.dataset.color;
                this.configManager.updateConfig('canvasColor', color);
            });
        });
    }

    updateAllDisplays() {
        const config = this.configManager.config;

        // Update range displays
        this.updateDisplay('diameter', config.diameter, (v) => `${v} m`);
        this.updateDisplay('wall-height', config.wallHeight, (v) => `${v} m`);
        this.updateDisplay('roof-height', config.roofHeight, (v) => `${v} m`);
        this.updateDisplay('khana-sections', config.khanaSections, (v) => v);
        this.updateDisplay('rafters', config.rafters, (v) => v);
        this.updateDisplay('tono-size', config.tonoSize, (v) => `${v} m`);

        // Update range inputs
        document.getElementById('diameter').value = config.diameter;
        document.getElementById('wall-height').value = config.wallHeight;
        document.getElementById('roof-height').value = config.roofHeight;
        document.getElementById('khana-sections').value = config.khanaSections;
        document.getElementById('rafters').value = config.rafters;
        document.getElementById('tono-size').value = config.tonoSize;

        // Update selects
        document.getElementById('door-style').value = config.doorStyle;
        document.getElementById('tension-band').value = config.tensionBand ? 'yes' : 'no';
        document.getElementById('skylight').value = config.skylight;
        document.getElementById('canvas-material').value = config.canvasMaterial;
        document.getElementById('wood-type').value = config.woodType;
    }

    updateDisplay(id, value, formatter) {
        const display = document.getElementById(`${id}-value`);
        if (display) {
            display.textContent = formatter(value);
        }
    }

    updateStats() {
        const stats = this.configManager.getStats();
        const materials = this.configManager.getMaterialCounts();

        document.getElementById('stat-area').textContent = `${stats.floorArea.toFixed(1)} m²`;
        document.getElementById('stat-volume').textContent = `${stats.volume.toFixed(1)} m³`;
        document.getElementById('stat-perimeter').textContent = `${stats.perimeter.toFixed(1)} m`;
        document.getElementById('stat-canvas').textContent = `${stats.canvasArea.toFixed(1)} m²`;
        document.getElementById('stat-wood').textContent = `${materials.totalWoodPieces} pieces`;
    }
}
