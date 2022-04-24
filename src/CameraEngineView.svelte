<script lang="ts">
    import {CameraEngine} from "./CameraEngine";
    import {onMount} from "svelte";
    import {defaultCube, Mesh} from "./structs/Mesh";

    const width = 300;
    const height = 200;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let camera = new CameraEngine(width, height);
    let scene: Mesh = new Mesh([]);
    let cube1 = defaultCube()
    cube1 = cube1.translateZ(2).translateX(-0.5).translateY(0)
    let cube2 = defaultCube()
    cube2 = cube2.translateZ(4).translateX(-0.5).translateY(0)

    scene.addMesh(cube1);
    scene.addMesh(cube2);

    onMount(() => {
        canvas.width = 300;
        canvas.height = 200;
        ctx = canvas.getContext("2d");
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