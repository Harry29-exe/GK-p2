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

    // eye – Position of the viewer
    // target – Point the viewer is looking at
    // up – vec3 pointing up
    public static lookAt(pos: Vec3d, target: Vec3d, up: Vec3d): Matrix4x4 {
        const newForward = target.subtract(pos).normalise();
        const temp = newForward.multiply(up.dotProduct(newForward))
        const newUp = up.subtract(temp).normalise();
        const newRight = newUp.crossProduct(newForward);
        // console.log(newRight)

        const pointAtMatrix = new Matrix4x4([
            newRight.x, newRight.y, newRight.z, 0,
            newUp.x, newUp.y, newUp.z, 0,
            newForward.x, newForward.y, newForward.z, 0,
            pos.x, pos.y, pos.z, 1
        ])

        return pointAtMatrix.quickInverse();
    }

    public static identity(): Matrix4x4 {
        const matrix = Matrix4x4.empty()
        matrix.rows[0] = 1;
        matrix.rows[1*4+1] = 1;
        matrix.rows[2*4+2] = 1;
        matrix.rows[3*4+3] = 1;
        return matrix;
    }

    public static rotationX(angleRad: number): Matrix4x4 {
        const matrix = Matrix4x4.empty();
        matrix.rows[0] = 1;
        matrix.rows[1*4+1] = Math.cos(angleRad);
        matrix.rows[1*4+2] = Math.sin(angleRad);
        matrix.rows[2*4+1] = -Math.sin(angleRad);
        matrix.rows[2*4+2] = Math.cos(angleRad);
        matrix.rows[3*4+3] = 1;
        return matrix;
    }

    public static rotationY(angleRad: number): Matrix4x4 {
        const matrix = Matrix4x4.empty();
        matrix.rows[0*4+0] = Math.cos(angleRad);
        matrix.rows[0*4+2] = Math.sin(angleRad);
        matrix.rows[1*4+1] = 1;
        matrix.rows[2*4+0] = -Math.sin(angleRad);
        matrix.rows[2*4+2] = Math.cos(angleRad);
        matrix.rows[3*4+3] = 1;
        return matrix;
    }

    public static rotationZ(angleRad: number): Matrix4x4 {
        const matrix = Matrix4x4.empty();
        matrix.rows[0] = Math.cos(angleRad);
        matrix.rows[0*4+1] = Math.sin(angleRad);
        matrix.rows[1*4+0] = -Math.sin(angleRad);
        matrix.rows[1*4+1] = Math.cos(angleRad);
        matrix.rows[2*4+2] = 1;
        matrix.rows[3*4+3] = 1;
        return matrix;
    }

    public static empty(): Matrix4x4 {
        return new Matrix4x4([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
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
        for (let i = 0; i < 3; i++) {
            sum += this.rows[i * 4 + colNumber] * vec.d[i]
        }
        sum += this.rows[3 * 4 + colNumber]

        return sum;
    }

    //works only for rotation/translation matrices
    private quickInverse(): Matrix4x4 {
        const matrix = Matrix4x4.empty();
        matrix.rows[0*4+0] = this.rows[0*4+0];
        matrix.rows[0*4+1] = this.rows[1*4+0];
        matrix.rows[0*4+2] = this.rows[2*4+0];
        matrix.rows[0*4+3] = 0.0;
        matrix.rows[1*4+0] = this.rows[0*4+1];
        matrix.rows[1*4+1] = this.rows[1*4+1];
        matrix.rows[1*4+2] = this.rows[2*4+1];
        matrix.rows[1*4+3] = 0.0;
        matrix.rows[2*4+0] = this.rows[0*4+2];
        matrix.rows[2*4+1] = this.rows[1*4+2];
        matrix.rows[2*4+2] = this.rows[2*4+2];
        matrix.rows[2*4+3] = 0.0;
        matrix.rows[3*4+0] = -(this.rows[3*4+0] * matrix.rows[0*4+0] + this.rows[3*4+1] * matrix.rows[1*4+0] + this.rows[3*4+2] * matrix.rows[2*4+0]);
        matrix.rows[3*4+1] = -(this.rows[3*4+0] * matrix.rows[0*4+1] + this.rows[3*4+1] * matrix.rows[1*4+1] + this.rows[3*4+2] * matrix.rows[2*4+1]);
        matrix.rows[3*4+2] = -(this.rows[3*4+0] * matrix.rows[0*4+2] + this.rows[3*4+1] * matrix.rows[1*4+2] + this.rows[3*4+2] * matrix.rows[2*4+2]);
        matrix.rows[3*4+3] = 1.0;
        return matrix;
    }

    public multiply(matrix: Matrix4x4): Matrix4x4 {
        let newMatrix = Matrix4x4.empty()
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                for (let i = 0; i < 4; i++) {
                    newMatrix.rows[x*4+y] += this.rows[x*4+i] * matrix.rows[i*4+y]
                }
            }
        }

        return newMatrix
    }

    public getV(x: number, y: number): number {
        return this.rows[x*4+y]
    }

    public setV(x: number, y: number, value: number){
        this.rows[x*4+y] = value;
    }

}

