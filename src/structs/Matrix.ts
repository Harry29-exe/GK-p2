import type {vec3, vec4, Vec4} from "./Vectors";
import {emptyTris} from "./Structs";
import type {mesh, tris} from "./Structs"

export type matrix4 = [vec4, vec4, vec4, vec4];

export class Matrix4 {
    private readonly rows: matrix4

    constructor(rows: matrix4) {
        this.rows = rows;
    }

    // multiplies vec4 * this.matrix = result
    public multiplyVec4(vec: vec4): vec4 {
        const data: vec4 = [0,0,0,0];

        for (let i = 0; i < 4; i++) {
            data[i] = this.mulVec4ByCol(i, vec)
        }

        return data;
    }

    // multiplies vector[vec3, 1] * this.matrix = result
    public multiplyVec3(vec: vec3): vec3 {
        const data: vec4 = [0,0,0,0];

        for (let i = 0; i < 4; i++) {
            data[i] = this.mulVec4ByCol(i, [...vec, 1])
        }

        return data.slice(0,3) as vec3;
    }

    private mulVec4ByCol(colNumber: number, vec: vec4): number {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            sum += this.rows[i][colNumber] * vec[i]
        }

        return sum;
    }

}

export class ProjMatrix extends Matrix4 {
    private readonly screenW: number;

    constructor(rows: matrix4, screenW: number) {
        super(rows);
        this.screenW = screenW
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

    public projectVec(vec: vec3): vec3 {
        const newVec = this.multiplyVec4([...vec,1])

        if (newVec[3]) {
            for (let i = 0; i < 3; i++) {
                newVec[i] = newVec[i] / newVec[3];
            }
        }

        return newVec.slice(0,3) as vec3
    }

}