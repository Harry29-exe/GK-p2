export class Vec3d {
    public d: [number, number, number, number]

    constructor(d: [number, number, number, number]) {
        this.d = d;
    }

    public static empty(): Vec3d {
        return new Vec3d([0,0,0,1]);
    }

    public static from(x: number, y: number, z: number, w?: number): Vec3d {
        return new Vec3d([x,y,z,w?w:1]);
    }

    public add(v: Vec3d): Vec3d {
        return Vec3d.from(this.x + v.x, this.y +v.y, this.z + v.z, this.w);
    }

    public subtract(v: Vec3d): Vec3d {
        return Vec3d.from(this.x - v.x, this.y - v.y, this.z - v.z, this.w);
    }

    public multiply(num: number): Vec3d {
        return Vec3d.from(this.x * num, this.y * num, this.z*num,this.w);
    }

    public divide(num: number): Vec3d {
        return Vec3d.from(this.x / num, this.y / num, this.z/num, this.w);
    }

    public dotProduct(v: Vec3d): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public length(): number {
        return Math.sqrt(this.dotProduct(this))
    }

    public normalise(): Vec3d {
        const len = this.length();
        if (len != 0) {
            return Vec3d.from(this.x / len, this.y / len, this.z / len, this.w);
        }
        return Vec3d.from(0,0,0,this.w);
    }

    public crossProduct(v: Vec3d): Vec3d {
        const nv = Vec3d.empty();
        nv.x = this.y * v.z - this.z * v.y;
        nv.y = this.z * v.x - this.x * v.z;
        nv.z = this.x * v.y - this.y * v.x;

        return nv;
    }

    public copy(): Vec3d {
        return new Vec3d([this.x, this.y, this.z, this.w])
    }

    public toVec2d(): Vec2d {
        return Vec2d.from(this.x, this.y)
    }

    public get x(): number {
        return this.d[0]
    }

    public set x(x: number) {
        this.d[0] = x;
    }

    public get y(): number {
        return this.d[1]
    }

    public set y(y: number) {
        this.d[1] = y;
    }

    public get z(): number {
        return this.d[2]
    }

    public set z(z: number) {
        this.d[2] = z;
    }

    public get w(): number {
        return this.d[3]
    }

    public set w(w: number) {
        this.d[3] = w;
    }

}

export class Vec2d {
    public d: [number, number, number]

    constructor(d: [number, number, number]) {
        this.d = d;
    }

    public static from(x: number, y: number): Vec2d {
        return new Vec2d([x, y, 1])
    }

    public static empty(): Vec2d {
        return new Vec2d([0, 0, 1])
    }

    public subtract(v: Vec2d): Vec2d {
        return Vec2d.from(this.x - v.x, this.y - v.y)
    }

    public add(v: Vec2d): Vec2d {
        return Vec2d.from(this.x + v.x, this.y - v.y)
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    public copy(): Vec2d {
        return new Vec2d([this.x, this.y, this.w])
    }

    public get x(): number {
        return this.d[0]
    }

    public set x(x: number) {
        this.d[0] = x;
    }

    public get y(): number {
        return this.d[1]
    }

    public set y(y: number) {
        this.d[1] = y;
    }

    public get w(): number {
        return this.d[2]
    }

    public set w(w: number) {
        this.d[2] = w;
    }

}
