export default /* glsl */`
#if defined( USE_AOMAP ) || defined( USE_SSAOMAP )

	#ifdef USE_AOMAP

		uniform sampler2D aoMap;

	#else

		uniform sampler2D ssaoMap;

	#endif

	uniform float aoMapIntensity;

#endif
`;
