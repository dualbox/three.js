import { Vector3 } from "./Vector3";
import { Box3 } from "./Box3";

export class Cylinder {

    constructor( v?: Vector3, axis?: Vector3, radius?: number, inf?: number, sup?: number );

    v: Vector3;
    axis: Vector3;
    radius: number;
    inf: number;
    sup: number;

    set( v?: Vector3, axis?: Vector3, radius?: number, inf?: number, sup?: number ): Cylinder;
    clone(): Cylinder;
    copy( cylinder: Cylinder );
    empty(): boolean;
    getBoundingBox(): Box3;
    equals( cylinder: Cylinder ): boolean;

}
