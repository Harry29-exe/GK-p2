import {Matrix4x4} from "./structs/Matrix4x4";
import type {Mesh} from "./structs/Structs";
import {ProjMatrix} from "./structs/ProjMatrix";
import {Vec3d} from "./structs/Vectors";

const identity = Matrix4x4.identity();

export type Ctx = CanvasRenderingContext2D
export class CameraEngine {
    public readonly cameraInfo: CameraInfo
    public readonly cameraPos = new CameraPos();

    constructor(width: number, height: number) {
        this.cameraInfo = new CameraInfo(width, height);
    }

    public clear(ctx: Ctx) {
        ctx.clearRect(0,0,this.cameraInfo.width, this.cameraInfo.height);
    }

    public drawMesh(obj: Mesh, ctx: Ctx) {
        const projMatrix  = this.cameraInfo.createProjectionMatrix();
        const lookAt = this.cameraPos.createLookAtMatrix()
        let mesh: Mesh = obj;
        mesh = mesh.multiplyByMatrix(lookAt)
        mesh = mesh.multiplyByMatrix(identity)
        mesh = projMatrix.projectMesh(mesh);
        ctx.strokeStyle = 'black';


        for (let i = 0; i < mesh.triangles.length; i++) {
            const tris = mesh.triangles[i]
            let x = this.scaleXCoord(tris[2].d[0])
            let y = this.scaleYCoord(tris[2].d[1])

            ctx.beginPath()
            ctx.moveTo(x, y)

            for (let j = 0; j < 3; j++) {
                x = this.scaleXCoord(tris[j].d[0])
                y = this.scaleYCoord(tris[j].d[1])
                ctx.lineTo(x, y)
                ctx.stroke()
            }
        }
    }


    private scaleXCoord(xCoord: number): number {
        return (xCoord + 1) * (this.cameraInfo.width / 2)
    }

    private scaleYCoord(yCoord: number): number {
        return (yCoord + 1) * (this.cameraInfo.height / 2)
    }

}

class CameraInfo {
    public fov = Math.PI/2;
    private fovChange = Math.PI / 32;
    public zFar = 100000;
    public zNear = 0.1;
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public createProjectionMatrix(): ProjMatrix {
        return new ProjMatrix(this.fov, this.zFar, this.zNear, this.width, this.height);
    }

    public posZoom() {
        this.fov -= this.fovChange
    }

    public negZoom() {
        this.fov += this.fovChange
    }

}

class CameraPos {
    //camera position
    private vCamera = Vec3d.from(0,0,0)
    //normalized look direction
    private vLookDir = Vec3d.from(0,0,1)
    //up vector
    private vUp = Vec3d.from(0,1,0)
    private moveFactor = 0.1;
    private rotateFactor = Math.PI / 16;
    private rotX = 0;
    private rotY = 0;
    private rotZ = 0;

    public createLookAtMatrix(): Matrix4x4 {
        const vTarget = this.vCamera.add(this.vLookDir);
        return Matrix4x4.lookAt(this.vCamera, vTarget, this.vUp);
    }

    public moveForward() {
        const vForward = this.vLookDir.multiply(this.moveFactor)
        this.vCamera = this.vCamera.add(vForward);
    }

    public moveBackward() {
        const vForward = this.vLookDir.multiply(this.moveFactor)
        this.vCamera = this.vCamera.subtract(vForward);
    }

    public rotatePosX() {
        console.log(this.vLookDir)
        this.vLookDir = Matrix4x4
            .rotationX(this.rotateFactor)
            .multiplyVec3d(this.vLookDir);
        console.log(this.vLookDir)
    }

    public rotateNegX() {
        this.vLookDir = Matrix4x4
            .rotationX(-this.rotateFactor)
            .multiplyVec3d(this.vLookDir);
    }

    public rotatePosY() {
        this.vLookDir = Matrix4x4
            .rotationY(this.rotateFactor)
            .multiplyVec3d(this.vLookDir)
    }

    public rotateNegY() {
        this.vLookDir = Matrix4x4
            .rotationY(-this.rotateFactor)
            .multiplyVec3d(this.vLookDir)
    }

    public rotatePosZ() {
        this.vLookDir = Matrix4x4
            .rotationZ(this.rotateFactor)
            .multiplyVec3d(this.vLookDir)
    }

    public rotateNegZ() {
        this.vLookDir = Matrix4x4
            .rotationZ(-this.rotateFactor)
            .multiplyVec3d(this.vLookDir)
    }

}