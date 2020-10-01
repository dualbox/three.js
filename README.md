three.js (fork)
========

## Changes from the original three js repo
- **[r101]** Changed `depth_vert.glsl.js` and `depth_frag.glsl.js` to fix issues 
with depth on iOS. Achieved by passing down `varying vec2 vHighPrecisionZW;`
