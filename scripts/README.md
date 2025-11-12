# Build Scripts

## Image Optimization (`optimize-images.mjs`)

Automatically optimizes all images in the `public/` and `src/` directories during the build process.

### Features

- **SVG Optimization**: Minifies SVG files using SVGO with multi-pass optimization
- **JPEG Optimization**: Compresses JPEGs using MozJPEG (quality: 77, progressive)
- **PNG Optimization**: Compresses PNGs using pngquant (quality: 65-80%)
- **WebP Optimization**: Optimizes WebP files (quality: 77, method: 4)
- **Smart Skipping**: Skips `node_modules`, `dist`, `.git`, `.vite`, and other build artifacts
- **Verbose Output**: Shows before/after file sizes when running with `--verbose`
- **Dry Run Mode**: Preview optimizations without modifying files using `--dry-run`

### Usage

```bash
# Optimize all images (automatically runs before build)
npm run optimize-images

# Preview optimizations without modifying files
npm run optimize-images:check

# Optimize with verbose output showing each file
npm run optimize-images:verbose
```

### How It Works

1. **Pre-build Hook**: The script runs automatically before `npm run build` via the `prebuild` script
2. **Directory Scanning**: Recursively scans `public/` and `src/` for image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`)
3. **Optimization**: Applies appropriate optimization based on file type
4. **In-place Updates**: Overwrites original files with optimized versions (only if smaller)
5. **Summary**: Reports total files checked, optimized count, and bytes saved

### CI/CD Integration

In CI environments, running with `--dry-run` will exit with code 2 if unoptimized images are detected, encouraging developers to run the optimizer locally.

### Dependencies

The script uses lazy imports to keep startup fast:
- `imagemin` - Core image optimization library
- `imagemin-mozjpeg` - JPEG optimization
- `imagemin-pngquant` - PNG optimization
- `imagemin-webp` - WebP optimization (optional)
- `svgo` - SVG optimization

All dependencies are in `devDependencies` and only loaded when needed.

### Example Output

```
🖼️  Image Optimization Tool
==========================

Found 47 image(s): 23 SVG, 24 raster

==================================================
✅ Checked 47 image(s) in public, src
📊 Optimized 15 file(s)
💾 Savings: 234.5 KB (18.3% reduction)
📈 1.25 MB → 1.02 MB
```
