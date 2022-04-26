<script lang="ts">
    import {CameraEngine} from "./CameraEngine";
    import {onMount} from "svelte";
    import {defaultCube, defaultPlain, Mesh, texturedCube} from "./structs/Mesh";
    import {Tris} from "./structs/Tris";

    const width = 400;
    const height = 320;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let camera = new CameraEngine(width, height);
    let scene: Mesh = new Mesh([]);
    let cube1 = texturedCube()
        .translateZ(2)
        .translateX(-0.5)

    let cube2 = texturedCube()
        .rotateX(Math.PI/4)
        .translateZ(4)
        .translateX(-0.5)

    let plain = defaultPlain()
        .translateX(-3)
        .translateZ(3)
        .translateY(1.1)

    scene.addMesh(cube1);
    scene.addMesh(cube2);
    scene.addMesh(plain)

    onMount(() => {
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        camera.clear(ctx);
        camera.drawMesh(cube1, ctx)
    })

    const update = () => {
        camera.clear(ctx);
        camera.drawMesh(scene, ctx);
    }

    const moveActions: [string, () => void][] = [
        ["Forward", () => camera.cameraPos.moveForward()],
        ["Backward", () => camera.cameraPos.moveBackward()],
        ["Up", () => camera.cameraPos.moveUp()],
        ["Down", () => camera.cameraPos.moveDown()],
        ["Left", () => camera.cameraPos.moveLeft()],
        ["Right", () => camera.cameraPos.moveRight()],
    ]

    const rotateActions: [string, () => void][] = [
        ["Rotate X", () => camera.cameraPos.rotatePosX()],
        ["Rotate -X", () => camera.cameraPos.rotateNegX()],
        ["Rotate Y", () => camera.cameraPos.rotatePosY()],
        ["Rotate -Y", () => camera.cameraPos.rotateNegY()],
        ["Rotate Z", () => camera.cameraPos.rotatePosZ()],
        ["Rotate -Z", () => camera.cameraPos.rotateNegZ()],
    ]

    // const canvasSize = `height: ${height*2}px; width: ${width*2}px;`
    const canvasSize = ""
</script>


<canvas id="camera_canvas" bind:this={canvas}
        style={"border: 3px black solid;"+canvasSize}></canvas>
<br/>


{#each moveActions as action}
<button on:click={() => {action[1](); update()}}>
    {action[0]}
</button>
{/each}
<br/>
{#each rotateActions as action}
    <button on:click={() => {action[1](); update()}}>
        {action[0]}
    </button>
{/each}

<br/>
<button on:click={() => {
    camera.cameraInfo.posZoom();
    update()
}}
>
    Zoom +
</button>

<button on:click={() => {
    camera.cameraInfo.negZoom();
    update()
}}
>
    Zoom -
</button>


<br/>
<button on:click={() => {
    camera = new CameraEngine(width, height);
    update()
}}
>
    Reset
</button>


<style>
    button {
        width: 200px;
        height: 50px;
    }
</style>