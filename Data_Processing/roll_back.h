#pragma once

/*
dir로 지정된 디렉토리 내의 index.html, origin.html에 대해
index.html은 삭제하고, origin.html을 index.html로 바꾸는 함수

dir		: 작업할 폴더의 경로
반환 값 : 성공 1, 오류 0
*/
int delete_and_rename(char *dir);

/*
index.html을 제어하고
origin.html을 index.html으로 되돌리는 함수
*/
void roll_back();