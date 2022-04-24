import {Matrix4x4} from "./structs/Matrix4x4";
import {Mesh} from "./structs/Mesh";
import {ProjMatrix} from "./structs/ProjMatrix";
import {Vec3d} from "./structs/Vectors";
import {Tris} from "./structs/Tris";

const identity = Matrix4x4.identity();

export type Ctx = CanvasRenderingContext2D
export class CameraEngine {
    public readonly cameraInfo: CameraInfo
    public readonly cameraPos = new CameraPos();

    public readonly lightPos: Vec3d = Vec3d.from(-0.5,-0.3,-0.8)

    constructor(width: number, height: number) {
        this.cameraInfo = new CameraInfo(width, height);
    }

    public clear(ctx: Ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,this.cameraInfo.width, this.cameraInfo.height);
    }

    public drawMesh(mesh: Mesh, ctx: Ctx) {
        let cameraPos = this.cameraPos.cameraPos
        let meshToRender = new Mesh([])
        for (let i = 0; i < mesh.triangles.length; i++) {
            let tris = mesh.triangles[i]
            let t = tris.p1.subtract(cameraPos)
            let dotProduct = t.dotProduct(tris.calcNormal())
            if (dotProduct < 0) {
                meshToRender.add(tris)
            }
        }
        meshToRender.triangles.sort((t1, t2) => {
            return t2.avgDistanceToCamera(cameraPos) - t1.avgDistanceToCamera(cameraPos)
        })
        const projector = this.projector()

        for (let i = 0; i < meshToRender.triangles.length; i++) {
            let tris = meshToRender.triangles[i]

            let color = 255;
            let trisNormal = tris.calcNormal()
            let lightFactor = trisNormal.normalise().dotProduct(this.lightPos.normalise())
            color *= Math.sin(lightFactor * Math.PI)
            console.log(lightFactor)

            tris = projector(tris)

            let x = this.scaleXCoord(tris.vertexes[2].d[0])
            let y = this.scaleYCoord(tris.vertexes[2].d[1])

            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.fillStyle = `rgba(${color}, ${color},${color}, 1)`

            for (let j = 0; j < 3; j++) {
                x = this.scaleXCoord(tris.vertexes[j].d[0])
                y = this.scaleYCoord(tris.vertexes[j].d[1])
                ctx.lineTo(x, y)
            }
            ctx.fill()

            ctx.strokeStyle = `pink`
            ctx.beginPath()
            ctx.moveTo(x, y)

            for (let j = 0; j < 3; j++) {
                x = this.scaleXCoord(tris.vertexes[j].d[0])
                y = this.scaleYCoord(tris.vertexes[j].d[1])
                ctx.lineTo(x, y)
            }
            ctx.stroke()
        }
    }

    private projector(): (tris: Tris) => Tris {
        const projMatrix  = this.cameraInfo.createProjectionMatrix();
        const lookAt = this.cameraPos.createLookAtMatrix()

        return (tris: Tris): Tris => {
            let projTris = Tris.empty()
            for (let i = 0; i < 3; i++) {
                let temp = identity.multiplyVec3d(tris.vertexes[i])
                temp = lookAt.multiplyVec3d(temp)
                projTris.vertexes[i] = projMatrix.projectVec(temp)
            }
            return projTris
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
        const vTarget = this.vCamera.add(this.vTarget());
        return Matrix4x4.lookAt(this.vCamera, vTarget, this.vUp)
            .multiply(Matrix4x4.rotationZ(this.rotZ));
    }

    public moveForward() {
        const vForward = this.vTarget().multiply(this.moveFactor)
        this.vCamera = this.vCamera.add(vForward);
    }

    public moveBackward() {
        const vForward = this.vTarget().multiply(this.moveFactor)
        this.vCamera = this.vCamera.subtract(vForward);
    }

    public moveLeft() {
        const vForward = Matrix4x4.rotationY(this.rotY + Math.PI/2)
            .multiplyVec3d(this.vLookDir)
            .multiply(this.moveFactor)

        this.vCamera = this.vCamera.add(vForward)
    }

    public moveRight() {
        const vForward = Matrix4x4.rotationY(this.rotY + Math.PI/2)
            .multiplyVec3d(this.vLookDir)
            .multiply(this.moveFactor)

        this.vCamera = this.vCamera.subtract(vForward)
    }

    public moveUp() {
        const vMove = this.vUp.multiply(this.moveFactor)

        this.vCamera = this.vCamera.subtract(vMove)
    }

    public moveDown() {
        const vMove = this.vUp.multiply(this.moveFactor)

        this.vCamera = this.vCamera.add(vMove)
    }

    public rotatePosX() {
        this.rotX += this.rotateFactor;
    }

    public rotateNegX() {
        this.rotX -= this.rotateFactor;
    }

    public rotatePosY() {
        this.rotY += this.rotateFactor;
    }

    public rotateNegY() {
        this.rotY -= this.rotateFactor;
    }

    public rotatePosZ() {
        this.rotZ += this.rotateFactor;
    }

    public rotateNegZ() {
        this.rotZ -= this.rotateFactor;
    }

    private vTarget(): Vec3d {
        let vTarget = this.vLookDir;


        vTarget = Matrix4x4.rotationX(this.rotX).
            multiply(Matrix4x4.rotationY(this.rotY))
            .multiplyVec3d(vTarget)

        return vTarget
    }

    public get cameraPos(): Vec3d {
        return this.vCamera.multiply(1)
    }

}