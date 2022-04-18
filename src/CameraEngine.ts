import {Matrix4x4} from "./structs/Matrix4x4";
import type {mesh, tris} from "./structs/Structs";
import {ProjMatrix} from "./structs/ProjMatrix";

export type Ctx = CanvasRenderingContext2D
export class CameraEngine {
    private cameraInfo: CameraInfo

    constructor(width: number, height: number) {
        this.cameraInfo = new CameraInfo(width, height);
    }

    public clear(ctx: Ctx) {
        ctx.clearRect(0,0,this.cameraInfo.width, this.cameraInfo.height);
    }

    public drawMesh(obj: mesh, ctx: Ctx) {
        console.log(this.cameraInfo.createProjectionMatrix())
        // const mesh = this.projectMesh(obj, this.cameraInfo.createProjectionMatrix())
        const mesh = this.cameraInfo.createProjectionMatrix().projectMesh(obj);
        ctx.strokeStyle = 'black';

        for (let i = 0; i < mesh.length; i++) {
            const tris = mesh[i]
            let x = this.scaleXCoord(tris[2].d[0])
            let y = this.scaleYCoord(tris[2].d[1])

            ctx.beginPath()
            ctx.moveTo(x, y)

            for (let j = 0; j < 3; j++) {
                x = this.scaleXCoord(tris[j].d[0])
                y = this.scaleYCoord(tris[j].d[1])
                console.log("to: x:", tris[j].d[0],"-", x, " y:",tris[j].d[1],"-", y);
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
    public fov = Math.PI / 2;
    public zFar = 1000;
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
}

class CameraPos {

}