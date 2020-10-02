import { MeshDepthMaterial, MeshDepthMaterialParameters } from "../../../src/Three";

/**
 * Material packing depth as rgba values.
 * It is basically just MeshDepthMaterial with depthPacking at THREE.RGBADepthPacking
 */
export class MeshRGBADepthMaterial extends MeshDepthMaterial {

	constructor( parameters?: MeshDepthMaterialParameters | null );

}
