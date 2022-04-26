import {Vec2d, Vec3d} from "./Vectors";
import type {Matrix4x4} from "./Matrix4x4";

export class Tris {
    public readonly vertexes: [Vec3d, Vec3d, Vec3d]
    public readonly texCoords: [Vec2d, Vec2d, Vec2d]

    constructor(vert: [Vec3d, Vec3d, Vec3d], texCoords?: [Vec2d, Vec2d, Vec2d]) {
        this.vertexes = vert;
        if (texCoords) {
            this.texCoords = texCoords
        } else {
            this.texCoords = [Vec2d.empty(), Vec2d.empty(), Vec2d.empty()]
        }
    }

    public static from(v1: Vec3d, v2: Vec3d, v3: Vec3d): Tris {
        return new Tris([v1,v2,v3])
    }

    public static textured(v1: Vec3d, v2: Vec3d, v3: Vec3d, t1: Vec2d, t2: Vec2d, t3: Vec2d): Tris {
        return new Tris([v1, v2, v3], [t1,t2,t3])
    }

    public static empty(): Tris {
        return new Tris([Vec3d.empty(), Vec3d.empty(), Vec3d.empty()])
    }

    public multiplyByMatrix(matrix: Matrix4x4): Tris {
        let newTris = this.copy();
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

    private equationPlane: Vec3d
    public equation_plane(): Vec3d {
        if (this.equationPlane) {
            return this.equationPlane
        }
        let a1 = this.p2.x - this.p1.x;
        let b1 = this.p2.y - this.p1.y;
        let c1 = this.p2.z - this.p1.z;
        let a2 = this.p3.x - this.p1.x;
        let b2 = this.p3.y - this.p1.y;
        let c2 = this.p3.z - this.p1.z;
        let a = b1 * c2 - b2 * c1;
        let b = a2 * c1 - a1 * c2;
        let c = a1 * b2 - b1 * a2;
        let d = (-a * this.p1.x - b * this.p1.y - c * this.p1.z);
        // document.write("equation of plane is " + a + " x + "
        //     + b + " y + " + c + " z + " + d + " = 0.");
        this.equationPlane = Vec3d.from(a,b,c,d)
        return this.equationPlane
    }


    public getTextureCoords2(x: number, y: number): Vec2d {
        // debugger
        let plane = this.equation_plane()
        let pointInTris: Vec3d = Vec3d.from(x,y,-(plane.x*x + plane.y*y + plane.w)/plane.z)
        let p1Distance = this.p1.subtract(pointInTris).length()
        let p2Distance = this.p2.subtract(pointInTris).length()
        let p3Distance = this.p3.subtract(pointInTris).length()

        let sum = p1Distance + p2Distance + p3Distance
        let p1Weight = sum / p1Distance
        if (!isFinite(p1Weight)) {
            return Vec2d.from(this.p1tex.x, this.p1tex.y)
        }
        let p2Weight = sum / p2Distance
        if (!isFinite(p2Weight)) {
            return Vec2d.from(this.p2tex.x, this.p2tex.y)
        }
        let p3Weight = sum / p3Distance
        if (!isFinite(p3Weight)) {
            return Vec2d.from(this.p3tex.x, this.p3tex.y)
        }
        let weightSum = p1Weight + p2Weight + p3Weight;

        let coords = Vec2d.from(
            (this.p1tex.x*p1Weight + this.p2tex.x*p2Weight + this.p3tex.x*p3Weight)/weightSum,
            (this.p1tex.y*p1Weight + this.p2tex.y*p3Weight + this.p3tex.y*p3Weight)/weightSum,
        )

        return coords
    }

    //https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/barycentric-coordinates
    public getTextureCoords(x: number, y: number): Vec2d {
        let p = Vec2d.from(x,y);
        let p1 = this.p1.toVec2d();
        let p2 = this.p2.toVec2d();
        let p3 = this.p3.toVec2d();

        let p1p2p3 = calcArea(p1,p2,p3)
        let p1p2P = calcArea(p1, p2, p) / p1p2p3
        let p2p3P = calcArea(p2, p3, p) / p1p2p3
        let p3p1P = calcArea(p3, p1, p) / p1p2p3

        return Vec2d.from(
            this.p1tex.x * p2p3P + this.p2tex.x * p3p1P + this.p3tex.x * p1p2P,
            this.p1tex.y * p2p3P + this.p2tex.y * p3p1P + this.p3tex.y * p1p2P,
        )
    }

    public point2dChecker(): (x: number, y: number) => boolean {
        const sign = (x1, y1, x2, y2, x3, y3) => {
            return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
        }

        let points = this.vertexes
        let d1,d2,d3
        let hasNeg, hasPos
        return function (x,y): boolean {
            d1 = sign(x,y, points[0].x, points[0].y, points[1].x, points[1].y)
            d2 = sign(x,y, points[1].x, points[1].y, points[2].x, points[2].y)
            d3 = sign(x,y, points[2].x, points[2].y, points[0].x, points[0].y)

            hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
            hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
            return !(hasNeg && hasPos);
        }

    }
    // public point2dChecker(): (x: number, y: number) => boolean {
    //     let lowestPoint = 0;
    //     if (this.p1.y < this.p2.y) {
    //         if (this.p1.y < this.p3.y) {
    //             lowestPoint = 1;
    //         } else {
    //             lowestPoint = 2
    //         }
    //     } else {
    //         if (this.p2.y < this.p3.y) {
    //             lowestPoint = 2
    //         } else {
    //             lowestPoint = 3
    //         }
    //     }
    //     let a: number
    //     let b: number
    //
    //     let p1p2Line: (x: number, y: number) => boolean;
    //     a = (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x)
    //     b = this.p1.y - a * this.p1.x
    //     if (lowestPoint == 2)
    //         p1p2Line = (x, y) => a*x + b <= y
    //     else
    //         p1p2Line = (x, y) => a*x + b >= y
    //
    //
    //     let p2p3Line: (x: number, y: number) => boolean;
    //     a = (this.p2.y - this.p3.y) / (this.p2.x - this.p3.x)
    //     b = this.p2.y - a * this.p2.x
    //     if (lowestPoint == 3)
    //         p2p3Line = (x, y) =>  a*x + b <= y
    //     else
    //         p2p3Line = (x, y) =>  a*x + b >= y
    //
    //
    //     let p3p1Line: (x: number, y: number) => boolean;
    //     a = (this.p3.y - this.p1.y) / (this.p3.x - this.p1.x)
    //     b = this.p3.y - a * this.p3.x
    //     if (lowestPoint == 1)
    //         p3p1Line = (x, y) => a*x + b <= y
    //     else
    //         p3p1Line = (x, y) =>  a*x + b >= y
    //
    //     return (x,y ) => p1p2Line(x,y) && p2p3Line(x,y) && p3p1Line(x,y)
    // }

    public copy(): Tris {
        return new Tris(this.vertexes.slice(0, 3) as [Vec3d,Vec3d,Vec3d]
            , this.texCoords.slice(0,3) as [Vec2d,Vec2d,Vec2d])
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

    public get p1tex(): Vec2d {
        return this.texCoords[0]
    }

    public get p2tex(): Vec2d {
        return this.texCoords[1]
    }

    public get p3tex(): Vec2d {
        return this.texCoords[2]
    }

}

export function calcArea(v1: Vec2d, v2: Vec2d, v3: Vec2d): number {
    return Math.abs(
        (v1.x*v2.y + v2.x*v3.y + v3.x*v1.y - v1.y*v2.x - v2.y*v3.x - v3.y*v1.x) /
        2
    )
}
