import {Vec3d} from "./Vectors";
import type {Matrix4x4} from "./Matrix4x4";

export type tris = [Vec3d, Vec3d, Vec3d];
export const emptyTris = (): tris => [Vec3d.empty(), Vec3d.empty(), Vec3d.empty()]


export type mesh = tris[];

export class Mesh {
    public readonly triangles: mesh;

    constructor(mesh: mesh) {
        this.triangles = mesh;
    }

    public multiplyByMatrix(matrix: Matrix4x4): Mesh {
        const newMesh = [];
        for (let i = 0; i < this.triangles.length; i++) {
            const tris = this.triangles[i];
            const newTris = emptyTris();
            for (let j = 0; j < 3; j++) {
                newTris[j] = matrix.multiplyVec3d(tris[j])
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

    public translateX(x: number): Mesh {
        const newMesh = [] as mesh
        for (const tris of this.triangles) {
            const newTris = emptyTris()
            for (let i = 0; i < 3; i++) {
                const vec = tris[i]
                newTris[i] = Vec3d.from(vec.d[0] + x, vec.d[1], vec.d[2])
            }
            newMesh.push(newTris)
        }
        
        return new Mesh(newMesh);
    }

    public translateY(y: number): Mesh {
        const newMesh = [] as mesh
        for (const tris of this.triangles) {
            const newTris = emptyTris()
            for (let i = 0; i < 3; i++) {
                const vec = tris[i]
                newTris[i] = Vec3d.from(vec.d[0], vec.d[1] + y, vec.d[2])
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

    public translateZ(z: number): Mesh {
        const newMesh = [] as mesh
        for (const tris of this.triangles) {
            const newTris = emptyTris()
            for (let i = 0; i < 3; i++) {
                const vec = tris[i]
                newTris[i] = Vec3d.from(vec.x, vec.y, vec.z + z)
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

}

export const defaultCube = (): Mesh => {
    return new Mesh([
        [Vec3d.from(0,0,0),Vec3d.from(0,1,0),Vec3d.from(1,1,0)],
        [Vec3d.from(0,0,0),Vec3d.from(1,1,0),Vec3d.from(1,0,0)],
        [Vec3d.from(1,0,0),Vec3d.from(1,1,0),Vec3d.from(1,1,1)],
        [Vec3d.from(1,0,0),Vec3d.from(1,1,1),Vec3d.from(1,0,1)],
        [Vec3d.from(1,0,1),Vec3d.from(1,1,1),Vec3d.from(0,1,1)],
        [Vec3d.from(1,0,1),Vec3d.from(0,1,1),Vec3d.from(0,0,1)],
        [Vec3d.from(0,0,1),Vec3d.from(0,1,1),Vec3d.from(0,1,0)],
        [Vec3d.from(0,0,1),Vec3d.from(0,1,0),Vec3d.from(0,0,0)],
        [Vec3d.from(0,1,0),Vec3d.from(0,1,1),Vec3d.from(1,1,1)],
        [Vec3d.from(0,1,0),Vec3d.from(1,1,1),Vec3d.from(1,1,0)],
        [Vec3d.from(1,0,1),Vec3d.from(0,0,1),Vec3d.from(0,0,0)],
        [Vec3d.from(1,0,1),Vec3d.from(0,0,0),Vec3d.from(1,0,0)],

    ])
}

