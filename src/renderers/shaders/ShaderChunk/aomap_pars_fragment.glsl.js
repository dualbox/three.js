export default /* glsl */`
#if defined( USE_AOMAP ) || defined( USE_SSAOMAP )

	#ifdef USE_AOMAP

		uniform sampler2D aoMap;

	#else

		uniform sampler2D ssaoMap;

		#ifdef USE_SSAOMAPMATRIX

			varying vec2 vAoCoords;

		#endif

	#endif

	uniform float aoMapIntensity;

#endif
`;
