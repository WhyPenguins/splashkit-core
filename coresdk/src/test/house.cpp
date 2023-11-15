#include "graphics.h"
#include "window_manager.h"
#include "utils.h"

using namespace splashkit_lib;

extern "C" {
	int start_main()
	{
		open_window("Shapes by ...", 800, 600);

		clear_screen(COLOR_WHITE);
		fill_ellipse(COLOR_BRIGHT_GREEN, 0, 400, 800, 400);
		fill_rectangle(COLOR_GRAY, 300, 300, 200, 200);
		fill_triangle(COLOR_RED, 250, 300, 400, 150, 550, 300);
		refresh_screen();

		return 0;
	}

	int different_render()
	{
		clear_screen(COLOR_WHITE);
		fill_ellipse(COLOR_BRIGHT_GREEN, 0, 400, 800, 400);
		fill_rectangle(COLOR_RED, 300, 300, 200, 200);
		refresh_screen();

		return 0;
	}
}