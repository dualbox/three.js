import { Mesh, NormalMapTypes, ShaderMaterial, ShaderMaterialParameters, Texture, Vector2 } from "../../../src/Three";

export class MeshWorldNormalMaterial extends ShaderMaterial {

	constructor( parameters?: ShaderMaterialParameters );

	bumpMap?: Texture | null;
	bumpScale: number;
	normalMap?: Texture | null;
	normalMapType?: NormalMapTypes;
	normalScale: Vector2;
	displacementMap?: Texture | null;
	displacementScale: number;
	displacementBias: number;

	isMeshWorldNormalMaterial: boolean;


	updateMeshOnBeforeRender( mesh: Mesh ): void;

}
