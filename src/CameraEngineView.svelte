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


</script>

<div style="border: 3px black solid">
<canvas id="camera_canvas" bind:this={canvas}></canvas>
</div>

<button on:click={() => {
    camera.cameraPos.moveForward();
    update()}}
>
    Forward
</button>

<button on:click={() => {
    camera.cameraPos.moveBackward();
    update()
}}>Backward
</button>

<br/>
<button on:click={() => {
    camera.cameraPos.rotatePosX();
    update()
}}
>
    Rotate X
</button>

<button on:click={() => {
    camera.cameraPos.rotateNegX();
    update()
}}
>
    Rotate -X
</button>


<br/>
<button on:click={() => {
    camera.cameraPos.rotatePosY();
    update()
}}
>
    Rotate Y
</button>

<button on:click={() => {
    camera.cameraPos.rotateNegY();
    update()
}}
>
    Rotate -Y
</button>


<br/>
<button on:click={() => {
    camera.cameraPos.rotatePosZ();
    update()
}} disabled={true}
>
    Rotate Z
</button>

<button on:click={() => {
    camera.cameraPos.rotateNegZ();
    update()
}} disabled={true}
>
    Rotate -Z
</button>

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