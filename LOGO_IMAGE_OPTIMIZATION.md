# Logo Image Optimization

## Overview
This document describes the image optimization implementation for the Grema Store logo components to improve Core Web Vitals, particularly LCP (Largest Contentful Paint).

## Problem
The original implementation was serving PNG images (23.6 KB) which could be optimized with modern image formats for better performance and reduced bandwidth usage.

## Solution
Implemented a multi-format image delivery system using the `<picture>` element with format prioritization:

1. **AVIF** (highest compression, modern browsers)
2. **WebP** (good compression, broad support)
3. **PNG** (fallback for maximum compatibility)

## File Structure
```
public/
├── Logo en negro.png      # Original black logo (23.6 KB)
├── Logo en negro.webp     # WebP version
├── Logo en negro.avif     # AVIF version (18.0 KB - 23.7% savings)
├── Logo en blamco.png     # Original white logo (31.5 KB)
├── Logo en blamco.webp    # WebP version
└── Logo en blamco.avif    # AVIF version (12.9 KB - 59.2% savings)
```

## Component Implementation

### Regular Logo Component
```tsx
<picture>
  <source srcSet="/Logo en negro.avif 320w" type="image/avif" />
  <source srcSet="/Logo en negro.webp 320w" type="image/webp" />
  <img src="/Logo en negro.png" srcSet="/Logo en negro.png 320w" />
</picture>
```

### LCP Optimized Logo Component
```tsx
<LCPLogo variant="black" className="w-32 h-12" />
```
- Uses `priority={true}` internally
- Sets `loading="eager"` for immediate loading
- Perfect for above-the-fold content

## Performance Benefits

### Black Logo Optimization
- **Original PNG**: 23.6 KB
- **AVIF**: 18.0 KB (23.7% reduction)
- **WebP**: Similar compression to AVIF with broader support

### White Logo Optimization
- **Original PNG**: 31.5 KB
- **AVIF**: 12.9 KB (59.2% reduction)
- **WebP**: Significant compression improvement

## Browser Support
- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: Chrome 32+, Firefox 65+, Safari 14+
- **PNG**: Universal fallback

## Scripts Available

### Generate All Formats
```bash
npm run convert-logos
```

### Individual Scripts
```bash
node scripts/convert-logos-to-avif.js
node scripts/convert-logo.js
node scripts/convert-white-logo.js
```

## Best Practices Implemented

1. **Format Prioritization**: AVIF → WebP → PNG
2. **Responsive Images**: Proper `srcSet` and `sizes` attributes
3. **Loading Optimization**: `eager` for LCP, `lazy` for others
4. **Layout Stability**: Explicit `width` and `height` attributes
5. **Accessibility**: Proper `alt` attributes

## Core Web Vitals Impact

- **LCP**: Faster loading of hero logos
- **CLS**: Prevented layout shifts with explicit dimensions
- **FCP**: Improved first contentful paint

## Monitoring
Use browser DevTools Network tab to verify:
- Modern browsers load AVIF/WebP versions
- Fallback browsers load PNG
- Correct format selection based on support

## Future Improvements
- Consider implementing lazy loading for below-the-fold logos
- Add blur-up placeholder for perceived performance
- Implement automatic format detection and generation in build process
