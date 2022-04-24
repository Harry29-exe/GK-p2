import {Vec3d} from "./Vectors";
import type {Matrix4x4} from "./Matrix4x4";

export class Tris {
    public readonly vertexes: [Vec3d, Vec3d, Vec3d]

    constructor(vert: [Vec3d, Vec3d, Vec3d]) {
        this.vertexes = vert;
    }

    public static from(v1: Vec3d, v2: Vec3d, v3: Vec3d): Tris {
        return new Tris([v1,v2,v3])
    }

    public static empty(): Tris {
        return new Tris([Vec3d.empty(), Vec3d.empty(), Vec3d.empty()])
    }

    public multiplyByMatrix(matrix: Matrix4x4): Tris {
        let newTris = Tris.empty()
        for (let i = 0; i < 3; i++) {
            newTris.vertexes[i] = matrix.multiplyVec3d(this.vertexes[i])
        }

        return newTris
    }

    public avgDistanceToCamera(cameraPos: Vec3d): number {
        return (
            this.p1.subtract(cameraPos).length() +
            this.p2.subtract(cameraPos).length() +
            this.p3.subtract(cameraPos).length()
        ) / 3
    }

    // https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal#:~:text=A%20surface%20normal%20for%20a,of%20the%20face%20w.r.t.%20winding).
    public calcNormal(): Vec3d {
        let vecU = this.p2.subtract(this.p1)
        let vecV = this.p3.subtract(this.p1)

        return Vec3d.from(
            vecU.y * vecV.z - vecU.z * vecV.y,
            vecU.z * vecV.x - vecU.x * vecV.z,
            vecU.x * vecV.y - vecU.y * vecV.x
        )
    }

    public get p1(): Vec3d {
        return this.vertexes[0]
    }

    public get p2(): Vec3d {
        return this.vertexes[1]
    }

    public get p3(): Vec3d {
        return this.vertexes[2]
    }

}