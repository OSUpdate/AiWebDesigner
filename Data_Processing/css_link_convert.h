#pragma once

/*
태그에 대한 처리에 대해 아무것도 안하고 넘어갈 함수가 필요해서 만든 함수
반환 값: 무조건 1
*/
int dumy_func_for_css(char** target_file, int* target_size, int tag_start, int tag_end, int* point, char *css_head);
/*
link 태그 부분 처리하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
css_head	: link 태그의 css 주소 앞에 붙일 문자열
반환 값		: 오류 0, 성공 1
*/
int link_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head);
/*
style 태그 부분 처리하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
css_head	: import의 css 주소 앞에 붙일 문자열
반환 값		: 오류 0, 성공 1
*/
int style_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head);
/*
css 관련 태그 별 수행해야 할 처리 함수를 찾아 반환하는 함수
tag		: 탐색할 태그
tag_len : 태그의 길이
반환 값 : 반환형이 int이고, 매개변수가 (char*, int*, int, int, int*, char*)인 함수의 포인터
*/
int(*css_tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*, char*);
/*
css 관련 태그에 대한 처리를 수행하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
css_head	: 태그의 css 주소 앞에 붙일 문자열
반환 값		: 오류 0, 성공 1
*/
int css_tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head);
/*
head 태그 부분 처리하는 함수
target_file : 원본 파일의 내용
target_size : 원본 파일의 길이을 담은 변수의 주소
copy_file	: 쓸 파일의 파일포인터
css_head	: 기존 css 링크 앞에 추가해야 할 문자열
반환 값		: 성공 1, 오류 0
*/
int css_head_processing(char **target_file, int *target_size, FILE *copy_file, char *css_head);
/*
각 파일에 대한 처리(css 링크 수정)를 하는 함수
target_dir : 대상 파일이 위치한 디렉토리 경로
css_head   : 기존 css 링크 앞에 추가해야 할 문자열
반환 값	   : 오류 0, 정상 1
*/
int css_processing(char *target_dir, char* css_head);
/*
각 파일에 대한 처리(css 링크 수정)를 하는 함수
dir		: 대상 폴더들이 위치한 디렉토리 경로
num     : 처리할 폴더 번호
css_head   : 기존 css 링크 앞에 추가해야 할 문자열
반환 값	: 오류 0, 정상 1
*/
int css_converting(char* dir, int num, char* css_head);
/*
css_head.txt 파일을 읽어 기존 css 링크 앞에 추가할 문자열을 가져오는 함수
head	: css 링크 앞에 추가할 문자열을 저장할 주소
반환 값 : 성공 1, 오류 0
*/
int get_css_head(char* head);
/*
html의 css 링크들에 대해 값을 변경하는 함수
*/
void css_link_convert();