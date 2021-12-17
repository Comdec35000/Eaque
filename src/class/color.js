
module.exports = class Color {

    constructor(arg) {

        if((typeof arg === 'string') && (arg.length === 6)) {
            this.r = this.hexToRgb(arg).r;
            this.g = this.hexToRgb(arg).g;
            this.b = this.hexToRgb(arg).b;
        } else if(arg instanceof Array && arg.length === 3) {
            this.r = arg[0];
            this.g = arg[1];
            this.b = arg[2]; 
        } else if(arg.r && arg.g && arg.b) {
            this.r = arg.r;
            this.g = arg.g;
            this.b = arg.b;
        } else {
            throw new Error('Invalid arugment : ' + arg)
        }

    }

    toArray() {
        return [this.r, this.g, this.b];
    }

    toHex() {
        return this.rgbToHex(this.r, this.g, this.b);
    }

    toRGB() {
        return Object.assign({}, ...this);
    }

    // Conversions from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

}