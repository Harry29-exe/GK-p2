import {Matrix4x4} from "./structs/Matrix4x4";
import {Mesh} from "./structs/Mesh";
import {ProjMatrix} from "./structs/ProjMatrix";
import {Vec3d} from "./structs/Vectors";
import type {Tris} from "./structs/Tris";
import {Texture} from "./structs/Texture";

const identity = Matrix4x4.identity();
const texture = new Texture(new Uint8ClampedArray(
    [
        255,   0,   0,
        255,   0,   0,
        255,   0,   0,
        255,   0,   0,

          0, 255,   0,
          0, 255,   0,
          0, 255,   0,
          0, 255,   0,


          0,   0, 255,
          0,   0, 255,
          0,   0, 255,
          0,   0, 255,

        255, 255, 255,
        255, 255, 255,
        255, 255, 255,
        255, 255, 255,


    ]), 4, 4
)

export type Ctx = CanvasRenderingContext2D
export class CameraEngine {
    public readonly cameraInfo: CameraInfo
    public readonly cameraPos = new CameraPos();

    private lightPos: Vec3d = Vec3d.from(-0.5,0.3,-0.8)
    private projector: (tris: Tris) => Tris;
    private ctx: CanvasRenderingContext2D

    constructor(width: number, height: number) {
        this.cameraInfo = new CameraInfo(width, height);
    }

    public clear(ctx: Ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0,this.cameraInfo.width, this.cameraInfo.height);
    }

    public drawMesh(mesh: Mesh, ctx: Ctx) {
        this.ctx = ctx
        let cameraPos = this.cameraPos.cameraPos
        let meshToRender = new Mesh([])

        // eliminate opposite oriented tris
        for (let i = 0; i < mesh.triangles.length; i++) {
            let tris = mesh.triangles[i]
            let t = tris.p1.subtract(cameraPos)
            let dotProduct = t.dotProduct(tris.calcNormal())
            if (dotProduct < 0) {
                meshToRender.add(tris)
            }
        }

        // sort remaining tris
        meshToRender.triangles.sort((t1, t2) => {
            return t2.avgDistanceToCamera(cameraPos) - t1.avgDistanceToCamera(cameraPos)
        })

        // initialize projection function
        this.initProjector()

        // draw remaining tris
        for (let i = 0; i < meshToRender.triangles.length; i++) {
            this.draw(meshToRender.triangles[i])
        }
    }

    private draw(tris: Tris) {
        let trisNormal = tris.calcNormal()
        let lightStrength = trisNormal.normalise().dotProduct(this.lightPos.normalise())
        lightStrength = Math.max(Math.min(lightStrength,1), 0.15)

        tris = this.projector(tris)

        let x = this.scaleXToCanvas(tris.vertexes[2].d[0])
        let y = this.scaleYToCanvas(tris.vertexes[2].d[1])

        let ctx = this.ctx
        ctx.beginPath()
        ctx.moveTo(x, y)
        // ctx.fillStyle = `rgba(${color}, ${color},${color}, 1)`
        // ctx.fillStyle = 'white'

        let pointChecker = tris.point2dChecker();
        for (let x = 0; x < this.cameraInfo.width; x++) {
            for (let y = 0; y < this.cameraInfo.height; y++) {
                let x3d = this.xTo3dSpace(x)
                let y3d = this.yTo3dSpace(y)
                if (pointChecker(x3d, y3d)) {
                    // debugger
                    let texCoord = tris.getTextureCoords(x3d, y3d)
                    let color = texture.getPx(texCoord.x, texCoord.y)
                    let data = this.ctx.createImageData(1,1)
                    data.data[0] = color.r * lightStrength
                    data.data[1] = color.g * lightStrength
                    data.data[2] = color.b * lightStrength
                    data.data[3] = 255
                    ctx.putImageData(data, x, y)
                }
            }
        }

        ctx.strokeStyle = 'white'
        for (let j = 0; j < 3; j++) {
            x = this.scaleXToCanvas(tris.vertexes[j].d[0])
            y = this.scaleYToCanvas(tris.vertexes[j].d[1])
            ctx.lineTo(x, y)
        }
        ctx.stroke()
    }

    private initProjector(){
        const projMatrix  = this.cameraInfo.createProjectionMatrix();
        const lookAt = this.cameraPos.createLookAtMatrix()

        this.projector = (tris: Tris): Tris => {
            let projTris = tris.copy()
            for (let i = 0; i < 3; i++) {
                let temp = identity.multiplyVec3d(tris.vertexes[i])
                temp = lookAt.multiplyVec3d(temp)
                projTris.vertexes[i] = projMatrix.projectVec(temp)
            }
            return projTris
        }
    }


    private scaleXToCanvas(xCoord: number): number {
        return (xCoord + 1) * (this.cameraInfo.width / 2)
    }

    private scaleYToCanvas(yCoord: number): number {
        return (yCoord + 1) * (this.cameraInfo.height / 2)
    }

    private xTo3dSpace(xCoord: number): number {
        return (2*xCoord)/this.cameraInfo.width - 1
    }

    private yTo3dSpace(yCoord: number): number {
        return (2*yCoord)/this.cameraInfo.height - 1
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


        vTarget = Matrix4x4.rotationX(this.rotX)
            .multiply(Matrix4x4.rotationY(this.rotY))
            .multiplyVec3d(vTarget)

        return vTarget
    }

    public get cameraPos(): Vec3d {
        return this.vCamera.multiply(1)
    }

}