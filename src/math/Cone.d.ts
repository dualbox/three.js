import { Vector3 } from "./Vector3";
import { Box3 } from "./Box3";

export class Cone {

    constructor( v?: Vector3, axis?: Vector3, theta?: number, inf?: number, sup?: number );

    v: Vector3;
    axis: Vector3;
    theta: number;
    inf: number;
    sup: number;

    cosTheta: number;

    set( v?: Vector3, axis?: Vector3, theta?: number, inf?: number, sup?: number ): Cone;
    clone(): Cone;
    copy( cone: Cone );
    empty(): boolean;
    getBoundingBox(): Box3;
    equals( cone: Cone ): boolean;

}
