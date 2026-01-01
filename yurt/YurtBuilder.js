import * as THREE from 'three';

export class YurtBuilder {
    constructor(scene, configManager) {
        this.scene = scene;
        this.configManager = configManager;
        this.yurtGroup = new THREE.Group();
        this.scene.add(this.yurtGroup);

        this.materials = this.createMaterials();
    }

    createMaterials() {
        return {
            wood: {
                pine: new THREE.MeshStandardMaterial({
                    color: 0xdeb887,
                    roughness: 0.8,
                    metalness: 0.1
                }),
                oak: new THREE.MeshStandardMaterial({
                    color: 0x8b6914,
                    roughness: 0.7,
                    metalness: 0.1
                }),
                walnut: new THREE.MeshStandardMaterial({
                    color: 0x5c4033,
                    roughness: 0.7,
                    metalness: 0.1
                })
            },
            canvas: new THREE.MeshStandardMaterial({
                color: 0xf5f5dc,
                roughness: 0.9,
                metalness: 0.0,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95
            }),
            door: new THREE.MeshStandardMaterial({
                color: 0x654321,
                roughness: 0.6,
                metalness: 0.1
            }),
            band: new THREE.MeshStandardMaterial({
                color: 0x8b4513,
                roughness: 0.5,
                metalness: 0.2
            })
        };
    }

    updateMaterials() {
        const config = this.configManager.config;

        // Update canvas color
        this.materials.canvas.color.set(config.canvasColor);

        // Update wood type
        // (wood materials are accessed by type)
    }

    build() {
        // Clear existing yurt
        this.yurtGroup.clear();

        // Update materials based on config
        this.updateMaterials();

        const config = this.configManager.config;
        const radius = config.diameter / 2;

        // Build components
        this.buildPlatform(radius);
        this.buildKhanaWalls(radius, config.wallHeight, config.khanaSections);
        this.buildDoor(radius, config.wallHeight, config.doorStyle);
        this.buildRoofRing(config.tonoSize, config.wallHeight + config.roofHeight - config.wallHeight);
        this.buildRafters(radius, config.tonoSize / 2, config.wallHeight, config.roofHeight, config.rafters);

        if (config.tensionBand) {
            this.buildTensionBand(radius, config.wallHeight);
        }

        this.buildCanvas(radius, config.wallHeight, config.roofHeight, config.tonoSize / 2);
        this.buildSkylight(config.tonoSize / 2, config.roofHeight, config.skylight);
    }

    buildPlatform(radius) {
        const platformGeometry = new THREE.CylinderGeometry(radius, radius, 0.1, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0826d,
            roughness: 0.9,
            metalness: 0.1
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = 0.05;
        platform.castShadow = true;
        platform.receiveShadow = true;
        this.yurtGroup.add(platform);
    }

    buildKhanaWalls(radius, height, sections) {
        const woodMaterial = this.materials.wood[this.configManager.config.woodType];
        const segmentAngle = (Math.PI * 2) / sections;

        for (let i = 0; i < sections; i++) {
            const angle = i * segmentAngle;
            const nextAngle = (i + 1) * segmentAngle;

            // Skip the section where the door will be
            if (i === 0) continue;

            // Create lattice section
            this.createLatticeSection(
                radius,
                height,
                angle,
                nextAngle,
                woodMaterial
            );
        }
    }

    createLatticeSection(radius, height, startAngle, endAngle, material) {
        const latticeGroup = new THREE.Group();

        const x1 = Math.cos(startAngle) * radius;
        const z1 = Math.sin(startAngle) * radius;
        const x2 = Math.cos(endAngle) * radius;
        const z2 = Math.sin(endAngle) * radius;

        // Create diamond pattern lattice
        const crossPieces = 6;
        const pieceRadius = 0.015;

        for (let i = 0; i <= crossPieces; i++) {
            const t = i / crossPieces;

            // Ascending diagonal
            const startX = x1 + (x2 - x1) * (t * 0.8);
            const startZ = z1 + (z2 - z1) * (t * 0.8);
            const startY = height * 0.1;

            const endX = x1 + (x2 - x1) * (t * 0.8 + 0.2);
            const endZ = z1 + (z2 - z1) * (t * 0.8 + 0.2);
            const endY = height * 0.9;

            this.createPole(
                new THREE.Vector3(startX, startY, startZ),
                new THREE.Vector3(endX, endY, endZ),
                pieceRadius,
                material,
                latticeGroup
            );

            // Descending diagonal
            if (i < crossPieces) {
                const startX2 = x1 + (x2 - x1) * (t * 0.8);
                const startZ2 = z1 + (z2 - z1) * (t * 0.8);
                const startY2 = height * 0.9;

                const endX2 = x1 + (x2 - x1) * (t * 0.8 + 0.2);
                const endZ2 = z1 + (z2 - z1) * (t * 0.8 + 0.2);
                const endY2 = height * 0.1;

                this.createPole(
                    new THREE.Vector3(startX2, startY2, startZ2),
                    new THREE.Vector3(endX2, endY2, endZ2),
                    pieceRadius,
                    material,
                    latticeGroup
                );
            }
        }

        this.yurtGroup.add(latticeGroup);
    }

    createPole(start, end, radius, material, parent) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);

        const pole = new THREE.Mesh(geometry, material);
        pole.position.copy(start).add(direction.multiplyScalar(0.5));

        // Orient pole
        pole.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        pole.castShadow = true;
        pole.receiveShadow = true;
        parent.add(pole);

        return pole;
    }

    buildDoor(radius, height, style) {
        const doorWidth = 0.9;
        const doorHeight = height * 0.9;

        const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.05);
        const door = new THREE.Mesh(doorGeometry, this.materials.door);

        door.position.set(0, doorHeight / 2, radius);
        door.castShadow = true;
        door.receiveShadow = true;

        this.yurtGroup.add(door);

        // Door frame
        const frameMaterial = this.materials.wood[this.configManager.config.woodType];
        const frameRadius = 0.03;

        // Left post
        this.createPole(
            new THREE.Vector3(-doorWidth / 2, 0.1, radius),
            new THREE.Vector3(-doorWidth / 2, doorHeight, radius),
            frameRadius,
            frameMaterial,
            this.yurtGroup
        );

        // Right post
        this.createPole(
            new THREE.Vector3(doorWidth / 2, 0.1, radius),
            new THREE.Vector3(doorWidth / 2, doorHeight, radius),
            frameRadius,
            frameMaterial,
            this.yurtGroup
        );

        // Top beam
        this.createPole(
            new THREE.Vector3(-doorWidth / 2, doorHeight, radius),
            new THREE.Vector3(doorWidth / 2, doorHeight, radius),
            frameRadius,
            frameMaterial,
            this.yurtGroup
        );
    }

    buildRoofRing(diameter, height) {
        const tonoRadius = diameter / 2;
        const woodMaterial = this.materials.wood[this.configManager.config.woodType];

        // Outer ring
        const ringGeometry = new THREE.TorusGeometry(tonoRadius, 0.04, 12, 32);
        const ring = new THREE.Mesh(ringGeometry, woodMaterial);
        ring.position.y = height;
        ring.rotation.x = Math.PI / 2;
        ring.castShadow = true;
        this.yurtGroup.add(ring);

        // Cross supports
        const numSupports = 8;
        for (let i = 0; i < numSupports; i++) {
            const angle = (i / numSupports) * Math.PI * 2;
            const x1 = Math.cos(angle) * tonoRadius;
            const z1 = Math.sin(angle) * tonoRadius;
            const x2 = Math.cos(angle + Math.PI) * tonoRadius;
            const z2 = Math.sin(angle + Math.PI) * tonoRadius;

            this.createPole(
                new THREE.Vector3(x1, height, z1),
                new THREE.Vector3(x2, height, z2),
                0.02,
                woodMaterial,
                this.yurtGroup
            );
        }
    }

    buildRafters(wallRadius, tonoRadius, wallHeight, roofHeight, count) {
        const woodMaterial = this.materials.wood[this.configManager.config.woodType];
        const angleStep = (Math.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;

            const wallX = Math.cos(angle) * wallRadius;
            const wallZ = Math.sin(angle) * wallRadius;

            const tonoX = Math.cos(angle) * tonoRadius;
            const tonoZ = Math.sin(angle) * tonoRadius;

            this.createPole(
                new THREE.Vector3(wallX, wallHeight, wallZ),
                new THREE.Vector3(tonoX, roofHeight, tonoZ),
                0.025,
                woodMaterial,
                this.yurtGroup
            );
        }
    }

    buildTensionBand(radius, height) {
        const bandGeometry = new THREE.TorusGeometry(radius, 0.025, 8, 64);
        const band = new THREE.Mesh(bandGeometry, this.materials.band);
        band.position.y = height * 0.7;
        band.rotation.x = Math.PI / 2;
        band.castShadow = true;
        this.yurtGroup.add(band);
    }

    buildCanvas(radius, wallHeight, roofHeight, tonoRadius) {
        // Wall canvas
        const wallGeometry = new THREE.CylinderGeometry(
            radius,
            radius,
            wallHeight,
            64,
            1,
            true
        );
        const wallCanvas = new THREE.Mesh(wallGeometry, this.materials.canvas);
        wallCanvas.position.y = wallHeight / 2;
        wallCanvas.receiveShadow = true;
        this.yurtGroup.add(wallCanvas);

        // Roof canvas (cone)
        const roofGeometry = new THREE.ConeGeometry(
            radius,
            roofHeight - wallHeight,
            64,
            1,
            true
        );
        const roofCanvas = new THREE.Mesh(roofGeometry, this.materials.canvas);
        roofCanvas.position.y = wallHeight + (roofHeight - wallHeight) / 2;
        roofCanvas.receiveShadow = true;
        this.yurtGroup.add(roofCanvas);
    }

    buildSkylight(tonoRadius, height, type) {
        if (type === 'none') return;

        const skylightGeometry = new THREE.CircleGeometry(tonoRadius, 32);
        let skylightMaterial;

        if (type === 'clear') {
            skylightMaterial = new THREE.MeshStandardMaterial({
                color: 0x87ceeb,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
        } else {
            skylightMaterial = new THREE.MeshStandardMaterial({
                color: 0xf5f5dc,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9
            });
        }

        const skylight = new THREE.Mesh(skylightGeometry, skylightMaterial);
        skylight.position.y = height;
        skylight.rotation.x = -Math.PI / 2;
        this.yurtGroup.add(skylight);
    }

    calculateBOM() {
        const config = this.configManager.config;
        const stats = this.configManager.getStats();
        const materials = this.configManager.getMaterialCounts();

        return {
            materials: {
                'Khana Lattice Pieces': materials.khanaLattice,
                'Roof Rafters': materials.rafters,
                'Roof Ring (Tono)': 1,
                'Tono Support Beams': materials.tonoSupports,
                'Door Frame': materials.doorFrame,
                'Tension Bands': materials.tensionBands,
                'Canvas/Fabric': `${stats.canvasArea.toFixed(1)} m²`,
                'Platform Boards': Math.ceil(stats.floorArea / 0.5)
            },
            floorArea: stats.floorArea,
            perimeter: stats.perimeter,
            canvasArea: stats.canvasArea,
            volume: stats.volume
        };
    }
}
