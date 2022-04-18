import {Vec3d} from "./Vectors";

export type matrix4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
];

export class Matrix4x4 {
    private readonly rows: matrix4

    constructor(rows: matrix4) {
        this.rows = rows;
    }

    // multiplies vec4 * this.matrix = result
    public multiplyVec3d(vec: Vec3d): Vec3d {
        const nv: Vec3d = Vec3d.empty();

        for (let i = 0; i < 4; i++) {
            nv.d[i] = this.mulVec4ByCol(i, vec)
        }

        return nv;
    }

    private mulVec4ByCol(colNumber: number, vec: Vec3d): number {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            sum += this.rows[i + 4*colNumber] * vec.d[i]
        }

        return sum;
    }

}

