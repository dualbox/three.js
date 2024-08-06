import type { Texture, Matrix4 } from 'three';

declare module "three" {
    interface Material {
        ssaoMap: Texture | null;
        ssaoMapMatrix: Matrix4 | null;
    }
}

export * from './Cone';
export * from './UniformsLibSsaoMap';