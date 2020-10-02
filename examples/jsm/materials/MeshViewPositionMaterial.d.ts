import { ShaderMaterial, ShaderMaterialParameters, Texture } from "../../../src/Three";


export interface MeshViewPositionMaterialParameters extends ShaderMaterialParameters {

	/** If true, we consider floatTexture extension is activated and available.
	 * The resulting coordinates will be stored in RGB components.
	 * If false (default), the coordinate to store must be defined by parameters.coordinate and will be packed in RGBA.
	 */
	useFloatTexture?: boolean,

	/**
	 * x, y or z to choose which coordinate will be packed in RGBA using THREE.JS packDepthToRGBA.
	 * Values will be mapped from -1:1 to 0:0.5 since depth packing does only provide methods to store in [0,1[
	 * To recover the view coordinate, you need to do x = 4*unpackRGBAToDepth(rgba) - 1;
	 */
	coordinate?: string

}


export class MeshViewPositionMaterial extends ShaderMaterial {

	constructor( parameter?: MeshViewPositionMaterialParameters | null );

	displacementMap?: Texture | null;
	displacementScale: number;
	displacementBias: number;

}
