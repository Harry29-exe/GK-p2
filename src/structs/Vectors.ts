export class Vec3d {
    public d: [number, number, number, number]

    constructor(d: [number, number, number, number]) {
        this.d = d;
    }

    public static empty(): Vec3d {
        return new Vec3d([0,0,0,1]);
    }

    public static from(x: number, y: number, z: number): Vec3d {
        return new Vec3d([x,y,z,1]);
    }

    public add(vec: Vec3d): Vec3d {
        const newVec = Vec3d.empty();
        for (let i = 0; i < 3; i++) {
            newVec.d[i] = this.d[i] + vec.d[i]
        }

        return newVec
    }

    public subtract(vec: Vec3d): Vec3d {
        const newVec = Vec3d.empty();
        for (let i = 0; i < 3; i++) {
            newVec.d[i] = this.d[i] - vec.d[i];
        }

        return newVec;
    }

    public multiply(num: number): Vec3d {
        const newVec = Vec3d.empty();
        for (let i = 0; i < 3; i++) {
            newVec.d[i] = this.d[i] * num;
        }

        return newVec;
    }

    public divide(vec: Vec3d, num: number): Vec3d {
        const newVec = Vec3d.empty();
        for (let i = 0; i < 3; i++) {
            newVec.d[i] = vec.d[i] / num
        }

        return newVec;
    }

    public dotProduct(v: Vec3d): number {
        return this.d[0] * v.d[0] + this.d[1] * v.d[1] + this.d[2] + v.d[2];
    }

    public length(): number {
        return Math.sqrt(this.dotProduct(this))
    }

    public normalise(): Vec3d {
        const len = this.length();
        return new Vec3d([this.d[0] / len, this.d[1] / len, this.d[2] / len, this.d[3]]);
    }

    public crossProduct(v: Vec3d): Vec3d {
        const nv = Vec3d.empty();
        nv[0] = this.d[1] * v.d[2] - this.d[2] * v.d[1];
        nv[1] = this.d[2] * v.d[0] - this.d[0] * v.d[2];
        nv[2] = this.d[0] * v.d[1] - this.d[1] * v.d[0];

        return nv;
    }

}
