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
        let x = Math.floor(normX*this.width)
        let y = Math.floor(normY*this.height)

        let dataStart = (x + this.width * y) * 3
        return Color.rgb(this.data[dataStart], this.data[dataStart+1], this.data[dataStart+2])
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

    public get g(): number {
        return this.data[1]
    }

    public get b(): number {
        return this.data[2]
    }


}