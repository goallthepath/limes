# 3D Yurt Configurator

A comprehensive web-based 3D configurator for designing traditional yurt structures. Built with Three.js and vanilla JavaScript.

## Features

### 🏗️ Structural Configuration
- **Dimensions**: Adjust diameter (3-10m), wall height (1.2-2.5m), and roof height (1.5-4m)
- **Khana Sections**: Configure wall lattice sections (4-12 sections)
- **Rafters**: Set number of roof rafters (16-48 rafters)
- **Roof Ring (Tono)**: Customize the traditional central roof ring (0.5-1.5m)

### 🎨 Customization Options
- **Door Styles**: Traditional Wooden, Modern Frame, or Canvas Flap
- **Materials**: Choose from Traditional Canvas, Vinyl, Insulated Fabric, or Waterproof Synthetic
- **Colors**: 8 color options for canvas (Natural Beige, White, Brown, Green, Red, Blue, Gold, Gray)
- **Wood Types**: Pine (light), Oak (medium), or Walnut (dark)
- **Optional Features**: Tension bands, skylight windows

### 📊 Real-Time Calculations
- Floor area (m²)
- Total volume (m³)
- Wall perimeter
- Canvas material required
- Wood piece count
- Bill of Materials (BOM)

### 🔧 Interactive Features
- **3D Viewport**: Fully interactive 3D view with orbit controls
- **Multiple Views**: Perspective, Top, Side, and Front views
- **Export Options**:
  - Export configuration as JSON
  - Download Bill of Materials as text file
  - Save 3D view as PNG image

## Usage

### Opening the Configurator

1. Open `yurt-configurator.html` in a modern web browser
2. The configurator will load with default settings

### Configuring Your Yurt

1. **Adjust Dimensions**: Use the sliders in the "Dimensions" section to set the size
2. **Configure Structure**: Set the number of khana sections, rafters, and roof ring size
3. **Choose Features**: Select door style, tension band, and skylight options
4. **Pick Materials**: Choose canvas material, color, and wood type
5. **View Statistics**: Monitor real-time calculations in the summary panel

### Camera Controls
- **Rotate**: Left-click and drag
- **Zoom**: Mouse wheel or pinch
- **Pan**: Right-click and drag
- **Quick Views**: Use view buttons (3D View, Top View, Side View, Front View)

### Exporting Your Design

1. **Export Configuration**: Download your settings as a JSON file
2. **Download BOM**: Get a detailed bill of materials for construction
3. **Save Image**: Capture the current 3D view as a PNG

## Technical Architecture

### File Structure
```
yurt-configurator.html          # Main HTML page with UI
yurt/
  ├── configurator.js            # Main application controller
  ├── ConfigManager.js           # Configuration state management
  ├── UIController.js            # UI controls and event handling
  └── YurtBuilder.js             # 3D geometry generation
```

### Key Components

#### ConfigManager
- Manages yurt configuration state
- Validates constraints and relationships
- Calculates statistics and material counts
- Handles import/export of configurations

#### YurtBuilder
- Generates 3D geometry for all yurt components
- Creates materials and textures
- Builds structural elements (khana, rafters, tono, door)
- Renders canvas covering and optional features

#### UIController
- Connects UI controls to configuration
- Updates displays in real-time
- Handles user interactions
- Maintains synchronization between UI and 3D view

## Yurt Construction Details

### Structural Elements

1. **Khana (Wall Lattice)**
   - Expandable wooden lattice forming the circular wall
   - Diamond pattern provides strength and flexibility
   - Number of sections determines wall circumference

2. **Rafters**
   - Wooden poles connecting wall top to roof ring
   - Typically 3-8 rafters per meter of diameter
   - Must be evenly spaced around the circle

3. **Tono (Roof Ring)**
   - Central wooden ring at the apex
   - Provides structural support and skylight opening
   - Size is proportional to yurt diameter (15-25%)

4. **Tension Band**
   - Rope or band around wall exterior
   - Holds khana sections in place
   - Typically placed at 60-70% of wall height

5. **Canvas Covering**
   - Outer protective layer
   - Traditionally felt, modern options include vinyl and synthetics
   - Calculated based on wall area + roof area

### Design Constraints

The configurator automatically enforces these structural rules:
- Roof ring size: max 25% of diameter
- Rafters: minimum 3× diameter, divisible by 4
- Roof height must exceed wall height
- Khana sections: even numbers recommended for symmetry

## Development

### Technologies Used
- **Three.js**: 3D rendering and WebGL
- **OrbitControls**: Camera manipulation
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients and transitions

### Browser Requirements
- Modern browser with WebGL support
- ES6 module support
- Recommended: Chrome, Firefox, Safari, or Edge (latest versions)

### Adding New Features

To add new customization options:

1. Add configuration property to `ConfigManager.config`
2. Add validation/constraints in `ConfigManager.validateConfig()`
3. Add UI control in `yurt-configurator.html`
4. Wire control in `UIController.setupControls()`
5. Implement rendering logic in `YurtBuilder.build()`

## Future Enhancements

Potential additions:
- AR view for on-site visualization
- Interior furnishing options
- Insulation calculator
- Cost estimation
- 3D model export (GLTF/OBJ)
- Weather/climate recommendations
- Floor plan generator
- Assembly instructions

## References

### Yurt Construction Resources
- Traditional yurt geometry and proportions
- Mongolian ger design principles
- Modern yurt building techniques

## License

This is a demonstration project for yurt configurator technology.

## Credits

Built with:
- Three.js for 3D rendering
- Modern web standards (ES6+, CSS3)
- Traditional yurt construction knowledge
