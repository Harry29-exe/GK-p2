import type {vec3} from "./Vectors";
import {emptyVec3} from "./Vectors";

export type tris = [vec3, vec3, vec3];
export const emptyTris = (): tris => [emptyVec3(), emptyVec3(), emptyVec3()]


export type mesh = tris[];

export class Mesh {
    public readonly mesh: mesh;

    constructor(mesh: mesh) {
        this.mesh = mesh;
    }

    public translateX(x: number): Mesh {
        const newMesh = [] as mesh
        for (const tris of this.mesh) {
            const newTris = emptyTris()
            for (let i = 0; i < 3; i++) {
                const vec = tris[i]
                newTris[i] = [vec[0] + x, vec[1], vec[2]]
            }
            newMesh.push(newTris)
        }
        
        return new Mesh(newMesh);
    }

    public translateY(y: number): Mesh {
        const newMesh = [] as mesh
        for (const tris of this.mesh) {
            const newTris = emptyTris()
            for (let i = 0; i < 3; i++) {
                const vec = tris[i]
                newTris[i] = [vec[0], vec[1] + y, vec[2]]
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

    public translateZ(z: number): Mesh {
        const newMesh = [] as mesh
        for (const tris of this.mesh) {
            const newTris = emptyTris()
            for (let i = 0; i < 3; i++) {
                const vec = tris[i]
                newTris[i] = [vec[0], vec[1], vec[2] + z]
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

}

export const defaultCube = (): Mesh => {
    return new Mesh([
        [[0,0,0],[0,1,0],[1,1,0]],
        [[0,0,0],[1,1,0],[1,0,0]],

        [[1,0,0],[1,1,0],[1,1,1]],
        [[1,0,0],[1,1,1],[1,0,1]],

        [[1,0,1],[1,1,1],[0,1,1]],
        [[1,0,1],[0,1,1],[0,0,1]],

        [[0,0,1],[0,1,1],[0,1,0]],
        [[0,0,1],[0,1,0],[0,0,0]],

        [[0,1,0],[0,1,1],[1,1,1]],
        [[0,1,0],[1,1,1],[1,1,0]],

        [[1,0,1],[0,0,1],[0,0,0]],
        [[1,0,1],[0,0,0],[1,0,0]],

    ])
}

