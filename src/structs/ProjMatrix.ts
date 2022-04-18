import {emptyTris} from "./Structs";
import {Matrix4x4} from "./Matrix4x4";
import type {mesh, tris} from "./Structs"
import type {Vec3d} from "./Vectors";

export class ProjMatrix extends Matrix4x4 {

    constructor(fov: number, zFar: number, zNear: number, width: number, height: number) {
        const scaleFactor = 1/Math.tan(fov/2);
        super([
            (height/width) * scaleFactor, 0, 0 ,0,
            0, scaleFactor, 0, 0,
            0, 0, zFar / (zFar - zNear), 1,
            0, 0, (-zFar - zNear) / (zFar - zNear), 0
        ])
    }

    public projectMesh(mesh: mesh): mesh {
        const newMesh = [] as mesh;
        for (let i = 0; i < mesh.length; i++) {
            newMesh.push(this.projectTris(mesh[i]))
        }

        return newMesh
    }

    public projectTris(tris: tris): tris {
        const newTris = emptyTris();
        for (let i = 0; i < 3; i++) {
            newTris[i] = this.projectVec(tris[i]);
        }

        return newTris
    }

    public projectVec(vec: Vec3d): Vec3d {
        const newVec = this.multiplyVec3d(vec)

        if (newVec.d[3]) {
            for (let i = 0; i < 3; i++) {
                newVec.d[i] = newVec.d[i] / newVec.d[3];
            }
        }

        return newVec
    }

}