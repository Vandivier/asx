'use strict';

System.register([], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      // A set of useful misc utils which will eventually move to individual modules.
      const util = {

        // ### Types ###

        // Fixing the javascript [typeof operator](https://goo.gl/Efdzk5)
        typeOf: obj => ({}).toString.call(obj).match(/\s(\w+)/)[1].toLowerCase(),
        // Is obj Array or Object (but not typed array)?
        isAorO: obj => ['array', 'object'].indexOf(util.typeOf(obj)) >= 0,
        // Is obj TypedArray? If obj.buffer not present, works .. type is 'undefined'
        isTypedArray: obj => util.typeOf(obj.buffer) === 'arraybuffer',
        // Is a number an integer (rather than a float w/ non-zero fractional part)
        isInteger: Number.isInteger || (num => Math.floor(num) === num),
        // Check [big/little endian](https://en.wikipedia.org/wiki/Endianness)
        isLittleEndian() {
          const d32 = new Uint32Array([0x01020304]);
          return new Uint8ClampedArray(d32.buffer)[0] === 4;
        },

        // Throw an error with string.
        // Use instead of `throw message` for better debugging
        error: message => {
          throw new Error(message);
        },

        // Return identity fcn, returning its argument unchanged. Used in callbacks
        identity: o => o,
        // Return function returning an object's property.  Property in fcn closure.
        propFcn: prop => o => o[prop],

        // Convert Array or TypedArray to given Type (Array or TypedArray).
        // If array is already of correct type, return it unmodified
        convertArray(array, Type) {
          const Type0 = array.constructor;
          if (Type0 === Type) return array; // return array if already same Type
          if (Type !== Array) return new Type(array); // TypedArray: universal ctor
          return Array.prototype.slice.call(array); // Convert TypedArray to Array
        },

        // ### Debug ###

        // Use chrome/ffox/ie console.time()/timeEnd() performance functions
        timeit(f, runs = 1e5, name = 'test') {
          console.time(name); // eslint-disable-line
          for (let i = 0; i < runs; i++) f(i);
          console.timeEnd(name); // eslint-disable-line
        },

        // Print Prototype Stack
        pps(obj, title = '') {
          if (title) console.log(title); // eslint-disable-line
          let count = 1;
          let str = '';
          while (obj) {
            if (typeof obj === 'function') {
              str = obj.constructor.toString();
            } else {
              let okeys = Object.keys(obj);
              str = okeys.length > 0 ? // eslint-disable-line
              `[${ okeys.join(', ') }]` : `[${ obj.constructor.name }]`;
            }
            console.log(`[${ count++ }]: ${ str }`); // eslint-disable-line
            obj = Object.getPrototypeOf(obj);
          }
        },

        arraysToString(arrays) {
          let str = '';
          this.repeat(arrays.length, i => {
            str += `[${ arrays[i] }]`;
          });
          return str;
        },

        // ### HTML, CSS, DOM ###
        parseQueryString() {
          const results = {};
          const query = document.location.search.substring(1);
          query.split('&').forEach(s => {
            const param = s.split('=');
            results[param[0]] = param.length === 1 ? true : param[1];
          });
          return results;
        },

        setScript(path) {
          const scriptTag = document.createElement('script');
          scriptTag.src = path;
          document.querySelector('head').appendChild(scriptTag);
        },

        // ### Math ###

        // Return random int/float in [0,max) or [min,max) or [-r/2,r/2)
        randomInt: max => Math.floor(Math.random() * max),
        randomInt2: (min, max) => min + Math.floor(Math.random() * (max - min)),
        randomFloat: max => Math.random() * max,
        randomFloat2: (min, max) => min + Math.random() * (max - min),
        randomCentered: r => util.randomFloat2(-r / 2, r / 2),

        // Return float Gaussian normal with given mean, std deviation.
        randomNormal(mean = 0.0, sigma = 1.0) {
          // Box-Muller
          const [u1, u2] = [1.0 - Math.random(), Math.random()]; // ui in 0,1
          const norm = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          return norm * sigma + mean;
        },

        // Return whether num is [Power of Two](http://goo.gl/tCfg5). Very clever!
        isPowerOf2: num => (num & num - 1) === 0, // twgl library

        // Degrees & Radians
        radians: degrees => degrees * Math.PI / 180,
        degrees: radians => radians * 180 / Math.PI,

        // Hypotenuse/distance from origin of point x,y
        distance: (x, y) => Math.sqrt(x * x + y * y),

        // Trims decimal digits of float to reduce size.
        fixed(n, digits = 4) {
          const p = Math.pow(10, digits);
          return Math.round(n * p) / p;
        },

        // Clamp a number to be between min/max.
        // Much faster than Math.max(Math.min(v, max), min)
        clamp(v, min, max) {
          if (v < min) return min;
          if (v > max) return max;
          return v;
        },

        // Return true is val in [min, max] enclusive
        between: (val, min, max) => min <= val && val <= max,

        // Return a linear interpolation between lo and hi.
        // Scale is in [0-1], a percentage, and the result is in [lo,hi]
        // If lo>hi, scaling is from hi end of range.
        // [Why the name `lerp`?](http://goo.gl/QrzMc)
        lerp: (lo, hi, scale) => lo <= hi ? lo + (hi - lo) * scale : lo - (lo - hi) * scale,
        // Calculate the lerp scale given lo/hi pair and a number between them.
        lerpScale: (number, lo, hi) => (number - lo) / (hi - lo),

        // ### Arrays, Objects and Iteration ###

        // Shim for Object.setPrototypeOf for legacy use.
        // Support for __proto__ currently greater, oddly enough.
        setPrototypeOf(obj, prototype) {
          if (Object.setPrototypeOf) Object.setPrototypeOf(obj, prototype);else obj.__proto__ = prototype; // eslint-disable-line
          return obj;
        },

        // Execute fcn for all own member of an obj or array (typed OK).
        // - Unlike forEach, does not skip undefines.
        // - Like map, forEach, etc, fcn = fcn(item, key/index, obj).
        forAll(arrayOrObj, fcn) {
          if (arrayOrObj.slice) // typed & std arrays
            for (let i = 0, len = arrayOrObj.length; i < len; i++) fcn(arrayOrObj[i], i, arrayOrObj);else Object.keys(arrayOrObj).forEach(k => fcn(arrayOrObj[k], k, arrayOrObj));
          return arrayOrObj;
        },

        // Repeat function f(i) n times, n in 0, i-1
        repeat(n, f) {
          for (let i = 0; i < n; i++) f(i);
        },
        // Repeat function n/step times, incrementing i by step each step.
        step(n, step, f) {
          for (let i = 0; i < n; i += step) f(i);
        },

        // Return a new copy of array, with correct type.
        copyArray(array) {
          if (array.constructor === Array) return array.slice(0);
          return new array.constructor(array);
        },

        // Return a new array that is the concatination two arrays.
        // The resulting type is that of the first array.
        concatArrays(array1, array2) {
          const Type = array1.constructor;
          if (Type === Array) return array1.concat(this.convertArray(array2, Array));
          const array = new Type(array1.length + array2.length);
          // Note typedArray.set() allows any Array or TypedArray array.
          array.set(array1);array.set(array2, array1.length);
          return array;
        },

        // Return array's type (Array or TypedArray variant)
        arrayType(array) {
          return array.constructor;
        },

        // Return a new JavaScript Array of floats to a given precision.
        // Fails for Float32Array due to float64->32 artifiacts, thus Array conversion
        fixedArray(array, digits = 4) {
          // const a = (array.constructor === Array) ?
          //   array : Array.prototype.slice.call(array) // see https://goo.gl/UcIrGZ
          // return a.map(n => util.fixed(n, digits))
          return array.map(n => util.fixed(n, digits));
        },

        // Shallow clome of obj or array
        clone(obj) {
          if (obj.slice) return obj.slice(0); // ok for TypedArrays
          const result = {};
          Object.keys(obj).forEach(k => {
            result[k] = obj[k];
          });
          return result;
        },

        // [Deep clone](http://goo.gl/MIaTxU) an obj or array. Clever!
        deepClone: obj => JSON.parse(JSON.stringify(obj)),

        // Compare Objects or Arrays via JSON string. TypedArrays !== Arrays
        objectsEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),

        // Merge from's key/val pairs into to
        // REMIND: use Object.assign
        copyTo(toObj, fromObj) {
          Object.keys(fromObj).forEach(k => {
            toObj[k] = fromObj[k];
          });
        },

        // Returns new array (of this type) of unique elements in this *sorted* array.
        // Sort or clone & sort if needed.
        uniq(array) {
          const f = (ai, i, a) => ai !== a[i - 1]; // a[-1] ok, is undefined, no error
          return array.filter(f);
        },

        // Create random array of floats between min/max.
        // Array Type allows conversion to integers (Int32Array etc)
        randomArray(length, min = 0, max = 1, Type = Array) {
          const a = new Type(length);
          for (let i = 0; i < length; i++) {
            a[i] = this.randomFloat2(min, max);
          }
          return a;
        },

        // Create an array of properties from an array of objects
        propArray: (array, propName) => array.map(a => a[propName]),

        // Create a histogram, given an array, a bin size, and a
        // min bin defaulting to min of of the array.
        // Return an object with:
        // - min/maxBin: the first/last bin with data
        // - min/maxVal: the min/max values in the array
        // - bins: the number of bins
        // - hist: the array of bins
        histogram(array, bin = 1, min = Math.floor(this.aMin(array))) {
          const hist = [];
          let [minBin, maxBin] = [Number.MAX_VALUE, Number.MIN_VALUE];
          let [minVal, maxVal] = [Number.MAX_VALUE, Number.MIN_VALUE];
          for (const a of array) {
            const i = Math.floor(a / bin) - min;
            hist[i] = hist[i] === undefined ? 1 : hist[i] + 1;
            minBin = Math.min(minBin, i);
            maxBin = Math.max(maxBin, i);
            minVal = Math.min(minVal, a);
            maxVal = Math.max(maxVal, a);
          }
          for (const i in hist) if (hist[i] === undefined) {
            hist[i] = 0;
          }
          const bins = maxBin - minBin + 1;
          return { bins, minBin, maxBin, minVal, maxVal, hist };
        },

        // Return scalar max/min/sum/avg of numeric array.
        // Works with es6 TypedArrays
        aMax: array => array.reduce((a, b) => Math.max(a, b)),
        aMin: array => array.reduce((a, b) => Math.min(a, b)),
        aSum: array => array.reduce((a, b) => a + b),
        aAvg: array => util.aSum(array) / array.length,

        // You'd think this wasn't necessary, and I always forget. Damn.
        // Note this, like sort, sorts in place. Clone array if needed.
        sortNums(array, ascending = true) {
          return array.sort((a, b) => ascending ? a - b : b - a);
        },
        // sort an array of objects w/ fcn(obj) as compareFunction.
        // If fcn is a string, convert to propFcn.
        // See [Fisher-Yates-Knuth shuffle](https://goo.gl/fWNFf) for better approach
        sortObjs(array, fcn, ascending = true) {
          if (typeof fcn === 'string') fcn = this.propFcn(fcn);
          const comp = (a, b) => {
            if (fcn(a) > fcn(b)) return 1;
            if (fcn(a) < fcn(b)) return -1;
            return 0;
          };
          return array.sort((a, b) => ascending ? comp(a, b) : -comp(a, b));
        },
        // Randomize array in-place. Use clone() first if new array needed
        // The array is returned for chaining; same as input array.
        shuffle(array) {
          array.sort((a, b) => Math.random() < 0.5);return array;
        },

        // Return array composed of f(a1i, a2i) called pairwise on both arrays
        aPairwise: (a1, a2, f) => a1.map((val, i) => f(val, a2[i])),
        aPairSum: (a1, a2) => util.aPairwise(a1, a2, (a, b) => a + b),
        aPairDif: (a1, a2) => util.aPairwise(a1, a2, (a, b) => a - b),
        aPairMul: (a1, a2) => util.aPairwise(a1, a2, (a, b) => a * b),
        aPairEq: (a1, a2) => util.aPairDif(a1, a2).every(a => a === 0),

        // Return a "ramp" (array of uniformly ascending/descending floats)
        // in [start,stop] with numItems (positive integer > 1).
        // OK for start>stop. Will always include start/stop w/in float accuracy.
        aRamp(start, stop, numItems) {
          // Note: start + step*i, where step is (stop-start)/(numItems-1),
          // has float accuracy problems, must recalc step each iteration.
          if (numItems <= 1) this.error('aRamp: numItems must be > 1');
          const a = [];
          for (let i = 0; i < numItems; i++) a.push(start + (stop - start) * (i / (numItems - 1)));
          return a;
        },
        // Integer version of aRamp, start & stop integers, rounding each element.
        // Default numItems yields unit step between start & stop.
        aIntRamp(start, stop, numItems = Math.abs(stop - start) + 1) {
          return this.aRamp(start, stop, numItems).map(a => Math.round(a));
        },

        // Return an array normalized (lerp) between lo/hi values
        normalize(array, lo = 0, hi = 1) {
          const [min, max] = [this.aMin(array), this.aMax(array)];
          const scale = 1 / (max - min);
          return array.map(n => this.lerp(lo, hi, scale * (n - min)));
        },
        // Return Uint8ClampedArray normalized in 0-255
        normalize8(array) {
          return new Uint8ClampedArray(this.normalize(array, -0.5, 255.5));
        },
        // Return Array normalized to integers in lo-hi
        normalizeInt(array, lo, hi) {
          return this.normalize(array, lo, hi).map(n => Math.round(n));
        },

        // ### Async ###

        // Return Promise for getting an image.
        // - use: imagePromise('./path/to/img').then(img => imageFcn(img))
        imagePromise(url) {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Could not load image ${ url }`);
            img.src = url;
          });
        },
        // Return Promise for ajax/xhr data.
        // - type: 'arraybuffer', 'blob', 'document', 'json', 'text'.
        // - method: 'GET', 'POST'
        // - use: xhrPromise('./path/to/data').then(data => dataFcn(data))
        xhrPromise(url, type = 'text', method = 'GET') {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url); // POST mainly for security and large files
            xhr.responseType = type;
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = () => reject(xhr.responseText);
            xhr.send();
          });
        },

        // An [async/await](https://davidwalsh.name/async-generators)
        // implementation using generators returning promises.
        //
        // runGenerator runs a generator which yields promises,
        // returning the promise results when they complete.
        // Amazingly enough, the returned promise result replaces the
        // promise initially yielded by the generator function.
        runGenerator(g) {
          const it = g();(function iterate(val) {
            // asynchronously iterate over generator
            const ret = it.next(val);
            if (!ret.done) {
              ret.value.then(iterate); // wait on the promise
            }
          })();
        },
        // Used like this, main() is entirely sync:
        // ```
        // function* main() {
        //   var path = 'http://s3.amazonaws.com/backspaces/'
        //   var val1 = yield util.xhrPromise(path + 'lorem1.txt')
        //   console.log( 'val1', val1 )
        //   var val2 = yield util.xhrPromise(path + 'lorem2.txt')
        //   console.log( 'val2', val2 )
        // }
        // util.runGenerator( main )
        // ```

        // ### Canvas/Image ###

        // Get an image in this page by its ID
        getCanvasByID: id => document.getElementById(id),
        // Create a blank canvas of a given width/height
        createCanvas(width, height) {
          const can = document.createElement('canvas');
          can.width = width;can.height = height;
          return can;
        },
        // As above, but returing the context object.
        // Note ctx.canvas is the canvas for the ctx, and can be use as an image.
        createCtx(width, height, ctxType = '2d') {
          const can = this.createCanvas(width, height);
          return can.getContext(ctxType === '2d' ? '2d' : 'webgl');
        },
        // Return the ImageData object for this context object
        ctxToImageData(ctx) {
          return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        },
        // Return an image/png base64 [dataUrl](https://goo.gl/fyBPnL)
        // string for this ctx object.
        ctxToDataUrl: ctx => ctx.canvas.toDataURL('image/png'),

        // Convert a dataUrl back into am image.
        dataUrlToImage(dataUrl) {
          // async in some browsers?? http://goo.gl/kIk2U
          const img = new Image();
          img.src = dataUrl;
          return img;
        },
        // Return a ctx object for this base64 data url
        dataUrlToCtx(dataUrl) {
          // async in some browsers?? http://goo.gl/kIk2U
          const img = this.dataUrlToImage(dataUrl);
          const ctx = this.createCtx(img.width, img.height);
          ctx.drawImage(img, 0, 0);
          return ctx;
        },

        // Get element (i.e. canvas) relative x,y position from event/mouse position.
        getEventXY(element, evt) {
          // http://goo.gl/356S91
          const rect = element.getBoundingClientRect();
          return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
        },

        // Convert an image to a context. img may be a canvas.
        // - x, y are origin in image, default to 0, 0.
        // - width, height are size of context, default to image's width, height
        // - thus default is entire image
        //
        // Note: to convert a ctx to an "image" (drawImage) use ctx.canvas
        imageToCtx(img, x = 0, y = 0, width = img.width, height = img.height) {
          if (x + width > img.width || y + height > img.height) this.error('imageToCtx: parameters outside of image');
          const ctx = this.createCtx(width, height);
          ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
          return ctx;
        }

      };

      _export('default', util);
    }
  };
});