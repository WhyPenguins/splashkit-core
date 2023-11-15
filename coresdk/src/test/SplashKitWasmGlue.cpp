
#include <emscripten.h>
#include <stdlib.h>

EM_JS_DEPS(webidl_binder, "$intArrayFromString,$UTF8ToString");

extern "C" {

// Define custom allocator functions that we can force export using
// EMSCRIPTEN_KEEPALIVE.  This avoids all webidl users having to add
// malloc/free to -sEXPORTED_FUNCTIONS.
EMSCRIPTEN_KEEPALIVE void webidl_free(void* p) { free(p); }
EMSCRIPTEN_KEEPALIVE void* webidl_malloc(size_t len) { return malloc(len); }


// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// color

color* EMSCRIPTEN_KEEPALIVE emscripten_bind_color_color_0() {
  return new color();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_color_get_r_0(color* self) {
  return self->r;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_color_set_r_1(color* self, float arg0) {
  self->r = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_color_get_g_0(color* self) {
  return self->g;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_color_set_g_1(color* self, float arg0) {
  self->g = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_color_get_b_0(color* self) {
  return self->b;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_color_set_b_1(color* self, float arg0) {
  self->b = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_color_get_a_0(color* self) {
  return self->a;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_color_set_a_1(color* self, float arg0) {
  self->a = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_color___destroy___0(color* self) {
  delete self;
}

// SKwindow

SKwindow* EMSCRIPTEN_KEEPALIVE emscripten_bind_SKwindow_SKwindow_0() {
  return new SKwindow();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SKwindow___destroy___0(SKwindow* self) {
  delete self;
}

// SplashKitJavascript

SplashKitJavascript* EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_SplashKitJavascript_0() {
  return new SplashKitJavascript();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_clear_screen_1(SplashKitJavascript* self, color* col) {
  self->clear_screen(*col);
}

SKwindow* EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_open_window_3(SplashKitJavascript* self, char* name, int width, int height) {
  static SKwindow temp;
  return (temp = self->open_window(name, width, height), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_refresh_screen_0(SplashKitJavascript* self) {
  self->refresh_screen();
}

color* EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_color_4(SplashKitJavascript* self, float r, float g, float b, float a) {
  static color temp;
  return (temp = self->color(r, g, b, a), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_fill_ellipse_5(SplashKitJavascript* self, color* c, int x1, int y1, int x2, int y2) {
  self->fill_ellipse(*c, x1, y1, x2, y2);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_fill_rectangle_5(SplashKitJavascript* self, color* c, int x1, int y1, int x2, int y2) {
  self->fill_rectangle(*c, x1, y1, x2, y2);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript_fill_triangle_7(SplashKitJavascript* self, color* c, int x1, int y1, int x2, int y2, int x3, int y3) {
  self->fill_triangle(*c, x1, y1, x2, y2, x3, y3);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_SplashKitJavascript___destroy___0(SplashKitJavascript* self) {
  delete self;
}

}

