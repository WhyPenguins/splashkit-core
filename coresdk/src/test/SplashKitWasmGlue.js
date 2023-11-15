
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_webidl_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_webidl_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_webidl_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_webidl_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy(array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// color
/** @suppress {undefinedVars, duplicate} @this{Object} */function color() {
  this.ptr = _emscripten_bind_color_color_0();
  getCache(color)[this.ptr] = this;
};;
color.prototype = Object.create(WrapperObject.prototype);
color.prototype.constructor = color;
color.prototype.__class__ = color;
color.__cache__ = {};
Module['color'] = color;

  color.prototype['get_r'] = color.prototype.get_r = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_color_get_r_0(self);
};
    color.prototype['set_r'] = color.prototype.set_r = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_color_set_r_1(self, arg0);
};
    /** @suppress {checkTypes} */
    Object.defineProperty(color.prototype, 'r', { get: color.prototype.get_r, set: color.prototype.set_r });
  color.prototype['get_g'] = color.prototype.get_g = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_color_get_g_0(self);
};
    color.prototype['set_g'] = color.prototype.set_g = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_color_set_g_1(self, arg0);
};
    /** @suppress {checkTypes} */
    Object.defineProperty(color.prototype, 'g', { get: color.prototype.get_g, set: color.prototype.set_g });
  color.prototype['get_b'] = color.prototype.get_b = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_color_get_b_0(self);
};
    color.prototype['set_b'] = color.prototype.set_b = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_color_set_b_1(self, arg0);
};
    /** @suppress {checkTypes} */
    Object.defineProperty(color.prototype, 'b', { get: color.prototype.get_b, set: color.prototype.set_b });
  color.prototype['get_a'] = color.prototype.get_a = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_color_get_a_0(self);
};
    color.prototype['set_a'] = color.prototype.set_a = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_color_set_a_1(self, arg0);
};
    /** @suppress {checkTypes} */
    Object.defineProperty(color.prototype, 'a', { get: color.prototype.get_a, set: color.prototype.set_a });
  color.prototype['__destroy__'] = color.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_color___destroy___0(self);
};
// SKwindow
/** @suppress {undefinedVars, duplicate} @this{Object} */function SKwindow() {
  this.ptr = _emscripten_bind_SKwindow_SKwindow_0();
  getCache(SKwindow)[this.ptr] = this;
};;
SKwindow.prototype = Object.create(WrapperObject.prototype);
SKwindow.prototype.constructor = SKwindow;
SKwindow.prototype.__class__ = SKwindow;
SKwindow.__cache__ = {};
Module['SKwindow'] = SKwindow;

  SKwindow.prototype['__destroy__'] = SKwindow.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_SKwindow___destroy___0(self);
};
// SplashKitJavascript
/** @suppress {undefinedVars, duplicate} @this{Object} */function SplashKitJavascript() {
  this.ptr = _emscripten_bind_SplashKitJavascript_SplashKitJavascript_0();
  getCache(SplashKitJavascript)[this.ptr] = this;
};;
SplashKitJavascript.prototype = Object.create(WrapperObject.prototype);
SplashKitJavascript.prototype.constructor = SplashKitJavascript;
SplashKitJavascript.prototype.__class__ = SplashKitJavascript;
SplashKitJavascript.__cache__ = {};
Module['SplashKitJavascript'] = SplashKitJavascript;

SplashKitJavascript.prototype['clear_screen'] = SplashKitJavascript.prototype.clear_screen = /** @suppress {undefinedVars, duplicate} @this{Object} */function(col) {
  var self = this.ptr;
  if (col && typeof col === 'object') col = col.ptr;
  _emscripten_bind_SplashKitJavascript_clear_screen_1(self, col);
};;

SplashKitJavascript.prototype['open_window'] = SplashKitJavascript.prototype.open_window = /** @suppress {undefinedVars, duplicate} @this{Object} */function(name, width, height) {
  var self = this.ptr;
  ensureCache.prepare();
  if (name && typeof name === 'object') name = name.ptr;
  else name = ensureString(name);
  if (width && typeof width === 'object') width = width.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  return wrapPointer(_emscripten_bind_SplashKitJavascript_open_window_3(self, name, width, height), SKwindow);
};;

SplashKitJavascript.prototype['refresh_screen'] = SplashKitJavascript.prototype.refresh_screen = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_SplashKitJavascript_refresh_screen_0(self);
};;

SplashKitJavascript.prototype['color'] = SplashKitJavascript.prototype.color = /** @suppress {undefinedVars, duplicate} @this{Object} */function(r, g, b, a) {
  var self = this.ptr;
  if (r && typeof r === 'object') r = r.ptr;
  if (g && typeof g === 'object') g = g.ptr;
  if (b && typeof b === 'object') b = b.ptr;
  if (a && typeof a === 'object') a = a.ptr;
  return wrapPointer(_emscripten_bind_SplashKitJavascript_color_4(self, r, g, b, a), color);
};;

SplashKitJavascript.prototype['fill_ellipse'] = SplashKitJavascript.prototype.fill_ellipse = /** @suppress {undefinedVars, duplicate} @this{Object} */function(c, x1, y1, x2, y2) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  if (x1 && typeof x1 === 'object') x1 = x1.ptr;
  if (y1 && typeof y1 === 'object') y1 = y1.ptr;
  if (x2 && typeof x2 === 'object') x2 = x2.ptr;
  if (y2 && typeof y2 === 'object') y2 = y2.ptr;
  _emscripten_bind_SplashKitJavascript_fill_ellipse_5(self, c, x1, y1, x2, y2);
};;

SplashKitJavascript.prototype['fill_rectangle'] = SplashKitJavascript.prototype.fill_rectangle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(c, x1, y1, x2, y2) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  if (x1 && typeof x1 === 'object') x1 = x1.ptr;
  if (y1 && typeof y1 === 'object') y1 = y1.ptr;
  if (x2 && typeof x2 === 'object') x2 = x2.ptr;
  if (y2 && typeof y2 === 'object') y2 = y2.ptr;
  _emscripten_bind_SplashKitJavascript_fill_rectangle_5(self, c, x1, y1, x2, y2);
};;

SplashKitJavascript.prototype['fill_triangle'] = SplashKitJavascript.prototype.fill_triangle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(c, x1, y1, x2, y2, x3, y3) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  if (x1 && typeof x1 === 'object') x1 = x1.ptr;
  if (y1 && typeof y1 === 'object') y1 = y1.ptr;
  if (x2 && typeof x2 === 'object') x2 = x2.ptr;
  if (y2 && typeof y2 === 'object') y2 = y2.ptr;
  if (x3 && typeof x3 === 'object') x3 = x3.ptr;
  if (y3 && typeof y3 === 'object') y3 = y3.ptr;
  _emscripten_bind_SplashKitJavascript_fill_triangle_7(self, c, x1, y1, x2, y2, x3, y3);
};;

  SplashKitJavascript.prototype['__destroy__'] = SplashKitJavascript.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_SplashKitJavascript___destroy___0(self);
};