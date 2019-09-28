#pragma once

/*
dir로 지정한 디렉토리의 모든 항목의 이름을 배열에 저장해주는 함수
fname	: 모든 항목의 이름을 저장할 2차원 배열
dir		: 항목들을 가지고 있는 디렉토리의 경로
idx		: 항목의 갯수를 저장할 변수의 주소
반환 값 : 오류 0, 성공 1
*/
int get_fname_list(char** fname, char* dir, int* idx);
/*
char형 2차원 배열을 동적할당 받아주는 함수
fnames_p : 동적할당 받을 메모리의 주소
height	 : 높이(행의 갯수)
width	 : 너비(열의 갯수)
반환 값	 : 오류 0, 성공 1
*/
int malloc_2d(char*** fnames_p, int height, int width);
/*
파일들의 이름을 정리해주는 함수
*/
void rename_data();