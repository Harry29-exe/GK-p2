export type vec3 = [number, number, number];
export const emptyVec3 = (): vec3 => [0,0,0]

export class Vec3 {
    public x: number;
    public y: number;
    public z: number

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export type vec4 = [number, number, number, number]
export const emptyVec4 = (): vec4 => [0,0,0,0]

export class Vec4 {
    public readonly data: vec4;

    constructor(vec: vec4) {
        this.data = vec.slice(0, 4) as vec4
    }

    public multiply(vec: vec4): number {
        const data = this.data
        return data[0] * vec[0] +
            data[1] * vec[1] +
            data[2] * vec[2] +
            data[3] * vec[3];
    }

    public get x(): number {
        return this.data[0]
    }

    public get y(): number {
        return this.data[1]
    }

    public get z(): number {
        return this.data[2]
    }

    public get q(): number {
        return this.data[3]
    }
}