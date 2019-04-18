#include "super_header.h"

void showMenu() {
	printf(" ======================== Menu ========================\n\n");

	printf(" 1. rename_data \n");
	printf("    -> Rename data folders to numeric name \n");

	printf(" 2. file_convert \n");
	printf("    -> Delete <script> and value of href of <a> \n");

	printf(" 3. organize_folder \n");
	printf("    -> Delete .html files except index.html \n");

	printf(" 4. css_link_convert \n");
	printf("    -> css address convert for web server \n");

	printf("\n");

	printf(" 0. exit \n\n");

	printf(" ======================================================\n");
}

int function_call(int num) {
	switch (num) {
	case 1:
		rename_data();
		break;
	case 2:
		file_convert();
		break;
	case 3:
		organize_folder();
		break;
	case 4:
		css_link_convert();
		break;
	case 0:
		exit(0);
	default:
		return 0;
	}

	return 1;
}