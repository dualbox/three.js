export default /* glsl */`
#if defined( USE_AOMAP ) || defined( USE_SSAOMAP )

	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
	#ifdef USE_AOMAP
	
		float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
		
	#else
	
		float ambientOcclusion = ( texture2D( ssaoMap, gl_FragCoord.xy / renderSize ).r - 1.0 ) * aoMapIntensity + 1.0;
	
	#endif

	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_ENVMAP ) && defined( STANDARD )

		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );

	#endif

#endif
`;
