namespace com.sideplay.helper.arrays {
    export function compare(a: any[], b: any[]): boolean {
        var i = a.length;
        if (i != b.length) return false;
        while (i--) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
}
