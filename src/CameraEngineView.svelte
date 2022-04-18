<script lang="ts">
    import {CameraEngine} from "./CameraEngine";
    import {onMount} from "svelte";
    import {defaultCube} from "./structs/Structs";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    const camera = new CameraEngine(300, 200);
    let cube = defaultCube()
    cube = cube.translateZ(1).translateX(-0.5).translateY(-0.2)

    onMount(() => {
        canvas.width = 300;
        canvas.height = 200;
        ctx = canvas.getContext("2d");
        camera.drawMesh(cube, ctx)
    })


</script>


<canvas id="camera_canvas" bind:this={canvas}>

</canvas>


