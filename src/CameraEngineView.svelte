<script lang="ts">
    import {CameraEngine} from "./CameraEngine";
    import {onMount} from "svelte";
    import {defaultCube} from "./structs/Structs";

    const width = 300;
    const height = 200;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let camera = new CameraEngine(width, height);
    let cube = defaultCube()
    cube = cube.translateZ(2).translateX(-0.5).translateY(0)

    onMount(() => {
        canvas.width = 300;
        canvas.height = 200;
        ctx = canvas.getContext("2d");
        camera.drawMesh(cube, ctx)
    })

    const update = () => {
        camera.clear(ctx);
        camera.drawMesh(cube, ctx);
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
</script>


<canvas id="camera_canvas" bind:this={canvas}
        style="border: 3px black solid"></canvas>
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
        width: 100px;
        height: 30px;
    }
</style>