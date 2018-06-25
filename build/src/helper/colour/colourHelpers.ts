namespace com.sideplay.helper.colour {
    /**
     * @name interpolateRGB
     * @description Takes a start RGB, an end RGB and a step - returns the middle point.
     * @param start
     * @param end
     * @param step
     */
    export function interpolateRGB(start: string, end: string, percentage: number) {
        let startCol = hexToRgb(start);
        let endCol = hexToRgb(end);
        let midR = startCol.r + (endCol.r - startCol.r) * percentage;
        let midG = startCol.g + (endCol.g - startCol.g) * percentage;
        let midB = startCol.b + (endCol.b - startCol.b) * percentage;
        return rgbToHex(midR, midG, midB);
    }

    /**
     * @name hexToRgb
     * @description converts a hex string to an RGB
     * @export
     * @param {any} hex
     * @returns {{r: number, g: number, b: number }}
     */
    export function hexToRgb(hex: string): { r: number; g: number; b: number } {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              }
            : null;
    }

    /**
     * @name rgbToHex
     * @description Takes an RGB, returns a HEX string.
     * @export
     * @param {any} r
     * @param {any} g
     * @param {any} b
     * @returns
     */
    export function rgbToHex(r: number, g: number, b: number): string {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * @name rgbHexToNumber
     * @description Takes a hex string and spits out a number.
     * @export
     * @param {string} stringIn
     */
    export function rgbHexToNumber(stringIn: string): number {
        return parseInt(stringIn.replace(/^#/, ""), 16);
    }
}
