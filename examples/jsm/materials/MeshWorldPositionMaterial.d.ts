import { ShaderMaterial, ShaderMaterialParameters, Texture } from "../../../src/Three";

export class MeshWorldPositionMaterial extends ShaderMaterial {

	constructor( parameter?: ShaderMaterialParameters );

	displacementMap?: Texture | null;
	displacementScale: number;
	displacementBias: number;

}
