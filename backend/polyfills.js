// Polyfill for Vercel/Serverless environment where DOM APIs are missing
// Required by pdfjs-dist (used via pdf-parse)

if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
        constructor() {
            this.a = 1; this.b = 0;
            this.c = 0; this.d = 1;
            this.e = 0; this.f = 0;
        }
        toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    };
}

if (typeof global.Path2D === 'undefined') {
    global.Path2D = class Path2D { };
}

if (typeof global.ImageData === 'undefined') {
    global.ImageData = class ImageData {
        constructor() {
            this.width = 0;
            this.height = 0;
            this.data = new Uint8ClampedArray(0);
        }
    };
}
