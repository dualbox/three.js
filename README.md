three.js (fork)
========

## Changes from the original three js repo
- **[r101]** Changed `depth_vert.glsl.js` and `depth_frag.glsl.js` to fix issues 
with depth on iOS. Achieved by passing down `varying vec2 vHighPrecisionZW;`
- Implemented a `Cone` math object, declared in `math/Cone.js` and `math/Cone.d.ts`,
and added to `Three.js` and `Three.d.ts`
- Added function `intersectCone` to `Ray`
