import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { YurtBuilder } from './YurtBuilder.js';
import { ConfigManager } from './ConfigManager.js';
import { UIController } from './UIController.js';

class YurtConfigurator {
    constructor() {
        console.log('YurtConfigurator constructor started');

        this.canvas = document.getElementById('canvas');
        this.loadingEl = document.getElementById('loading');

        console.log('Initializing scene...');
        this.initScene();

        console.log('Initializing lights...');
        this.initLights();

        console.log('Initializing controls...');
        this.initControls();

        console.log('Creating ConfigManager...');
        this.configManager = new ConfigManager();

        console.log('Creating YurtBuilder...');
        this.yurtBuilder = new YurtBuilder(this.scene, this.configManager);

        console.log('Creating UIController...');
        this.uiController = new UIController(this.configManager, this.yurtBuilder);

        console.log('Setting up event listeners...');
        this.setupEventListeners();

        console.log('Starting animation loop...');
        this.animate();

        // Initial build
        console.log('Building initial yurt...');
        this.yurtBuilder.build();

        console.log('Hiding loading screen...');
        this.hideLoading();

        console.log('YurtConfigurator initialization complete!');
    }

    initScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 20, 50);

        // Camera
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(8, 6, 8);
        this.camera.lookAt(0, 2, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        // Ground
        this.createGround();
    }

    createGround() {
        const groundGeometry = new THREE.CircleGeometry(15, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x7cb342,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(30, 30, 0x000000, 0x000000);
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    initLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(5, 10, 7);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -10;
        sunLight.shadow.camera.right = 10;
        sunLight.shadow.camera.top = 10;
        sunLight.shadow.camera.bottom = -10;
        this.scene.add(sunLight);

        // Hemisphere light for ambient outdoor feel
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x7cb342, 0.4);
        this.scene.add(hemiLight);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 25;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target.set(0, 2, 0);
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setView(e.target.dataset.view);
            });
        });

        // Export buttons
        document.getElementById('export-config').addEventListener('click', () => {
            this.exportConfiguration();
        });

        document.getElementById('download-bom').addEventListener('click', () => {
            this.downloadBOM();
        });

        document.getElementById('save-image').addEventListener('click', () => {
            this.saveImage();
        });
    }

    setView(viewType) {
        const config = this.configManager.config;
        const distance = config.diameter * 1.5;

        switch(viewType) {
            case 'top':
                this.camera.position.set(0, distance, 0);
                this.controls.target.set(0, 0, 0);
                break;
            case 'side':
                this.camera.position.set(distance, config.wallHeight, 0);
                this.controls.target.set(0, config.wallHeight, 0);
                break;
            case 'front':
                this.camera.position.set(0, config.wallHeight, distance);
                this.controls.target.set(0, config.wallHeight, 0);
                break;
            case 'perspective':
            default:
                this.camera.position.set(distance * 0.8, distance * 0.6, distance * 0.8);
                this.controls.target.set(0, config.wallHeight, 0);
                break;
        }
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    hideLoading() {
        setTimeout(() => {
            this.loadingEl.style.display = 'none';
        }, 500);
    }

    exportConfiguration() {
        const config = this.configManager.config;
        const data = JSON.stringify(config, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yurt-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadBOM() {
        const bom = this.yurtBuilder.calculateBOM();
        const lines = [
            'YURT BILL OF MATERIALS',
            '======================',
            '',
            `Configuration: ${this.configManager.config.diameter}m diameter`,
            `Date: ${new Date().toLocaleDateString()}`,
            '',
            'STRUCTURAL COMPONENTS:',
            '---------------------'
        ];

        for (const [item, quantity] of Object.entries(bom.materials)) {
            lines.push(`${item}: ${quantity}`);
        }

        lines.push('');
        lines.push('SUMMARY:');
        lines.push('--------');
        lines.push(`Floor Area: ${bom.floorArea.toFixed(2)} m²`);
        lines.push(`Wall Perimeter: ${bom.perimeter.toFixed(2)} m`);
        lines.push(`Canvas Required: ${bom.canvasArea.toFixed(2)} m²`);
        lines.push(`Total Volume: ${bom.volume.toFixed(2)} m³`);

        const text = lines.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yurt-bom-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    saveImage() {
        this.renderer.render(this.scene, this.camera);
        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `yurt-design-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Yurt Configurator...');
        new YurtConfigurator();
    } catch (error) {
        console.error('Failed to initialize configurator:', error);
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="color: #f00;">
                    <h3>Error Loading Configurator</h3>
                    <p>${error.message}</p>
                    <p style="font-size: 12px;">Check browser console for details</p>
                </div>
            `;
        }
    }
});
