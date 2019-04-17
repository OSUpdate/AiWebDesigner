#pragma once

/*
메뉴를 보여주는 함수
*/
void showMenu();
/*
num에 따라 적절한 함수를 호출하는 함수
num		: 메뉴에서 선택한 항목 번호
반환 값 : 메뉴에 없는 항목 0 반환, 정상 1 반환
*/
int function_call(int num);