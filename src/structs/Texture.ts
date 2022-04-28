export class Texture {
    private data: Uint8ClampedArray;
    private width: number;
    private height: number;

    constructor(data: Uint8ClampedArray, width: number, height: number) {
        this.data = data;
        this.width = width;
        this.height = height;
    }

    public getPx(normX: number, normY: number): Color {
        let xFloor = Math.floor(normX*this.width)
        let yFloor = Math.floor(normY*this.height)
        if (xFloor == 0 || xFloor === this.width - 1 || yFloor === 0 || yFloor === this.height - 1) {
            let dataStart = (xFloor + this.width * yFloor) * 3
            return new Color([this.data[dataStart], this.data[dataStart+1], this.data[dataStart+2]])
        }

        let dataStart = (xFloor + this.width * yFloor) * 3
        let color = Color.rgb(0,0,0)
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                let offset = (x+y*this.width) * 3
                color.r += this.data[dataStart+offset]
                color.g += this.data[dataStart+offset+1]
                color.b += this.data[dataStart+offset+2]
            }
        }

        color.r /= 9
        color.g /= 9
        color.b /= 9

        return color
    }

}

export class Color {
    private data: [number, number, number]

    constructor(data: [number, number, number]) {
        this.data = data;
    }

    public static rgb(red: number, green: number, blue: number): Color {
        return new Color([red, green, blue]);
    }

    public get r(): number {
        return this.data[0]
    }

    public set r(val: number) {
        this.data[0] = val
    }

    public get g(): number {
        return this.data[1]
    }

    public set g(val: number) {
        this.data[1] = val
    }

    public get b(): number {
        return this.data[2]
    }

    public set b(val: number) {
        this.data[2] = val
    }


}

export const generateLg = (): Texture => {
    let width = 512
    let height = 512
    let data = new Uint8ClampedArray(width*height*3)

    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    for (let y = 0; y < height; y++) {
        if (y % 16 === 0) {
            r = Math.floor(Math.random() * 255)
            g = Math.floor(Math.random() * 255)
            b = Math.floor(Math.random() * 255)
        }

        for (let x = 0; x < width; x++) {
            let dataStart = (y * width + x)*3;
            data[dataStart] = r
            data[dataStart+1] = g
            data[dataStart+2] = b
        }
    }

    return new Texture(data, width, height)
}