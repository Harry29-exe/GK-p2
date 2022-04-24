import {Vec3d} from "./Vectors";
import {Matrix4x4} from "./Matrix4x4";
import {Tris} from "./Tris";


export class Mesh {
    public readonly triangles: Tris[];

    constructor(mesh: Tris[]) {
        this.triangles = mesh;
    }

    public add(tris: Tris) {
        this.triangles.push(tris)
    }

    public addMesh(mesh: Mesh) {
        for (let i = 0; i < mesh.triangles.length; i++) {
            this.triangles.push(mesh.triangles[i])
        }
    }

    public multiplyByMatrix(matrix: Matrix4x4): Mesh {
        const newMesh = [];
        for (let i = 0; i < this.triangles.length; i++) {
            const tris = this.triangles[i];
            const newTris = Tris.empty();
            for (let j = 0; j < 3; j++) {
                newTris.vertexes[j] = matrix.multiplyVec3d(tris.vertexes[j])
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

    public translateX(x: number): Mesh {
        const newMesh = [] as Tris[]
        for (const tris of this.triangles) {
            const newTris = Tris.empty()
            for (let i = 0; i < 3; i++) {
                const vec = tris.vertexes[i]
                newTris.vertexes[i] = Vec3d.from(vec.d[0] + x, vec.d[1], vec.d[2])
            }
            newMesh.push(newTris)
        }
        
        return new Mesh(newMesh);
    }

    public translateY(y: number): Mesh {
        const newMesh = [] as Tris[]
        for (const tris of this.triangles) {
            const newTris = Tris.empty()
            for (let i = 0; i < 3; i++) {
                const vec = tris.vertexes[i]
                newTris.vertexes[i] = Vec3d.from(vec.d[0], vec.d[1] + y, vec.d[2])
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

    public translateZ(z: number): Mesh {
        const newMesh = [] as Tris[]
        for (const tris of this.triangles) {
            const newTris = Tris.empty()
            for (let i = 0; i < 3; i++) {
                const vec = tris.vertexes[i]
                newTris.vertexes[i] = Vec3d.from(vec.x, vec.y, vec.z + z)
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh);
    }

    public rotateX(rad: number): Mesh {
        const newMesh = [] as Tris[]
        const matrix = Matrix4x4.rotationX(rad)
        for (let tris of this.triangles) {
            let newTris = Tris.empty();
            for (let i = 0; i < 3; i++) {
                newTris.vertexes[i] = matrix.multiplyVec3d(tris.vertexes[i])
            }
            newMesh.push(newTris)
        }

        return new Mesh(newMesh)
    }

}

export const defaultCube = (): Mesh => {
    return new Mesh([
        Tris.from(Vec3d.from(0,0,0),Vec3d.from(0,1,0),Vec3d.from(1,1,0)),
        Tris.from(Vec3d.from(0,0,0),Vec3d.from(1,1,0),Vec3d.from(1,0,0)),
        Tris.from(Vec3d.from(1,0,0),Vec3d.from(1,1,0),Vec3d.from(1,1,1)),
        Tris.from(Vec3d.from(1,0,0),Vec3d.from(1,1,1),Vec3d.from(1,0,1)),
        Tris.from(Vec3d.from(1,0,1),Vec3d.from(1,1,1),Vec3d.from(0,1,1)),
        Tris.from(Vec3d.from(1,0,1),Vec3d.from(0,1,1),Vec3d.from(0,0,1)),
        Tris.from(Vec3d.from(0,0,1),Vec3d.from(0,1,1),Vec3d.from(0,1,0)),
        Tris.from(Vec3d.from(0,0,1),Vec3d.from(0,1,0),Vec3d.from(0,0,0)),
        Tris.from(Vec3d.from(0,1,0),Vec3d.from(0,1,1),Vec3d.from(1,1,1)),
        Tris.from(Vec3d.from(0,1,0),Vec3d.from(1,1,1),Vec3d.from(1,1,0)),
        Tris.from(Vec3d.from(1,0,1),Vec3d.from(0,0,1),Vec3d.from(0,0,0)),
        Tris.from(Vec3d.from(1,0,1),Vec3d.from(0,0,0),Vec3d.from(1,0,0)),
    ])
}

export const defaultPlain = (): Mesh => {
    return new Mesh([
        Tris.from(Vec3d.from(6,0,6),Vec3d.from(0,0,6),Vec3d.from(0,0,0)),
        Tris.from(Vec3d.from(6,0,6),Vec3d.from(0,0,0),Vec3d.from(6,0,0)),
    ])
}