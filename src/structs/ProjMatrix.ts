import {Mesh} from "./Mesh";
import {Matrix4x4} from "./Matrix4x4";
import type {Vec3d} from "./Vectors";
import type {Tris} from "./Tris";

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

    public projectMesh(mesh: Mesh): Mesh {
        const newMesh = [] as Tris[];
        for (let i = 0; i < mesh.triangles.length; i++) {
            newMesh.push(this.projectTris(mesh.triangles[i]))
        }

        return new Mesh(newMesh)
    }

    // public projectTris(tris: tris): tris {
    //     const newTris = emptyTris();
    //     for (let i = 0; i < 3; i++) {
    //         newTris[i] = this.projectVec(tris[i]);
    //     }
    //
    //     return newTris
    // }
    public projectTris(tris: Tris): Tris {
        const newTris = tris.copy();;
        for (let i = 0; i < 3; i++) {
            newTris.vertexes[i] = this.projectVec(tris.vertexes[i]);
        }

        return newTris
    }

    public projectVec(vec: Vec3d): Vec3d {
        const newVec = this.multiplyVec3d(vec)

        if (newVec.d[3] != 0) {
            newVec.x /= newVec.w;
            newVec.y /= newVec.w;
            newVec.z /= newVec.w;
        }

        return newVec
    }

}