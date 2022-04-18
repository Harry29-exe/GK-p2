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
        console.log("new forward:",newForward)
        const temp = newForward.multiply(up.dotProduct(newForward))
        const newUp = up.subtract(temp).normalise();
        console.log("newUp", newUp)
        const newRight = newUp.crossProduct(newForward);
        // console.log(newRight)

        const pointAtMatrix = new Matrix4x4([
            newRight.x, newRight.y, newRight.z, 0,
            newUp.x, newUp.y, newUp.z, 0,
            newForward.x, newForward.y, newForward.z, 0,
            pos.x, pos.y, pos.z, 1
        ])
        console.log("Point at", pointAtMatrix)

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
        for (let i = 0; i < 4; i++) {
            sum += this.rows[i*4+colNumber] * vec.d[i]
        }

        return sum;
    }

    // //works only for rotation/translation matrices
    // private quickInverse(): Matrix4x4 {
    //     const matrix = Matrix4x4.empty();
    //     matrix.rows[0*4+0] =   this.rows[0*4+0];  matrix.rows[0*4+1] = this.rows[1*4+0];  matrix.rows[0*4+2] = this.rows[2*4+0];  matrix.rows[0*4+3] = 0;
    //     matrix.rows[1*4+0] =   this.rows[0*4+1];  matrix.rows[1*4+1] = this.rows[1*4+1];  matrix.rows[1*4+2] = this.rows[2*4+1];  matrix.rows[1*4+3] = 0;
    //     matrix.rows[2*4+0] =   this.rows[0*4+2];  matrix.rows[2*4+1] = this.rows[1*4+2];  matrix.rows[2*4+2] = this.rows[2*4+2];  matrix.rows[2*4+3] = 0;
    //     matrix.rows[3*4+0] = -(this.rows[3*4+0] * matrix.rows[0*4+0] + this.rows[3*4+1] * matrix.rows[1*4+0] + this.rows[3*4+2] * matrix.rows[2*4+0]);
    //     matrix.rows[3*4+1] = -(this.rows[3*4+0] * matrix.rows[0*4+1] + this.rows[3*4+1] * matrix.rows[1*4+1] + this.rows[3*4+2] * matrix.rows[2*4+1]);
    //     matrix.rows[3*4+2] = -(this.rows[3*4+0] * matrix.rows[0*4+2] + this.rows[3*4+1] * matrix.rows[1*4+2] + this.rows[3*4+2] * matrix.rows[2*4+2]);
    //     matrix.rows[3*4+3] = 1;
    //     return matrix;
    // }

    // private quickInverse(): Matrix4x4 {
    //     const matrix = Matrix4x4.empty();
    //     matrix.rows[0+4*0] =   this.rows[0+4*0];  matrix.rows[0+4*1] = this.rows[1+4*0];  matrix.rows[0+4*2] = this.rows[2+4*0];  matrix.rows[0+4*3] = 0;
    //     matrix.rows[1+4*0] =   this.rows[0+4*1];  matrix.rows[1+4*1] = this.rows[1+4*1];  matrix.rows[1+4*2] = this.rows[2+4*1];  matrix.rows[1+4*3] = 0;
    //     matrix.rows[2+4*0] =   this.rows[0+4*2];  matrix.rows[2+4*1] = this.rows[1+4*2];  matrix.rows[2+4*2] = this.rows[2+4*2];  matrix.rows[2+4*3] = 0;
    //     matrix.rows[3+4*0] = -(this.rows[3+4*0] * matrix.rows[0+4*0] + this.rows[3+4*1] * matrix.rows[1+4*0] + this.rows[3+4*2] * matrix.rows[2+4*0]);
    //     matrix.rows[3+4*1] = -(this.rows[3+4*0] * matrix.rows[0+4*1] + this.rows[3+4*1] * matrix.rows[1+4*1] + this.rows[3+4*2] * matrix.rows[2+4*1]);
    //     matrix.rows[3+4*2] = -(this.rows[3+4*0] * matrix.rows[0+4*2] + this.rows[3+4*1] * matrix.rows[1+4*2] + this.rows[3+4*2] * matrix.rows[2+4*2]);
    //     matrix.rows[3+4*3] = 1;
    //     return matrix;
    // }
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

}

