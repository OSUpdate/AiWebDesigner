#include "super_header.h"

int main() {
	int num, ck_input, ck_function;

	//메뉴 항목 선택 무한반복
	while (1) {
		//메뉴 보여주기
		showMenu();
		//항목 선택받기
		printf(" choice > ");
		ck_input = getNumber(&num);

		//getNumber 결과에 따른 처리
		if (ck_input) {
			//입력 항목에 따른 함수 호출
			ck_function = function_call(num);
			//반환값이 0이라면 항목 외 숫자가 입력된 것
			if (!ck_function) {
				system("cls");
				printf(" *** Wrong input *** \n\n");
			}
			else
				system("cls");
		}
		else {
			system("cls");
			printf(" *** Wrong input *** \n\n");
		}
	}

	return 0;
}