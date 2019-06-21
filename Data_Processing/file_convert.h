#pragma once

/*
파일을 열어서 데이터를 읽어오고, 복사할 파일포인터를 가져오는 함수
target_file : 대상 파일의 내용을 저장할 메모리의 주소
target_size : 대상 파일의 크기를 저장할 메모리의 주소
copy_file   : 복사할 파일의 파일포인터를 저장할 메모리의 주소
target_dir  : 대상 파일이 있는 경로
origin_name : 원본파일이 바뀔 이름
반환 값		: 오류 0, 정상 1
*/
int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir, const char *origin_name);
/*
태그에 대한 처리에 대해 아무것도 안하고 넘어갈 함수가 필요해서 만든 함수
반환 값: 무조건 1
*/
int dumy_func(char** target_file, int* target_size, int tag_start, int tag_end, int* point);
/*
태그 별 수행해야 할 처리 함수를 찾아 반환하는 함수
tag		: 탐색할 태그
tag_len : 태그의 길이
반환 값 : 반환형이 int이고, 매개변수가 (char*, int*, int, int, int*)인 함수의 포인터
*/
int(*tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*);
/*
태그에서 class 속성이 있는지 확인하고, 그 속성의 값이 load 관련인지 확인하는 함수
tag		: 탐색할 태그
len		: 태그의 길이
반환 값 : loader 관련이면 1, 아니면 0 반환
*/
int check_load_class(char *tag, int len);
/*
div, section 태그에 대한 처리인 경우 해당 태그의 마지막 지점을 찾아주는 함수
target_file : 탐색할 문자열(html 파일)
target_size : 문자열의 길이
start		: 탐색할 시작 위치
t_name		: 태그의 이름
t_len		: 태그 이름의 길이
반환 값		: 해당 태그의 마지막 지점의 위치 인덱스
*/
int find_end_point(char *target_file, int target_size, int start, char *t_name, int t_len);
/*
div, section 태그에 대한 처리를 수행하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
반환 값		: 오류 0, 성공 1
*/
int div_section_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
noscript 태그에 대한 처리를 수행하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
반환 값		: 오류 0, 성공 1
*/
int noscripts_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
태그의 href="~~" 속성 중 ~~의 위치 찾기
tag		 : 탐색할 태그
len		 : 태그의 길이
start	 : href 속성의 내용이 시작하는 위치
end		 : href 속성의 내용이 끝나는 위치
반환 값  : href 속성 있으면 1, 없으면 0
*/
int find_href_position(char *tag, int len, int *start, int *end);
/*
a 태그에 대한 처리를 수행하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
반환 값		: 오류 0, 성공 1
*/
int a_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
각종 태그에 대한 처리를 수행하는 함수
target_file : 작업중인 문자열(html 파일)
target_size : 문자열의 길이
tag_start	: 태그의 시작 위치
tag_end		: 태그의 끝 위치
point		: 현재 문자열(html 파일)의 어디까지 작업했는지 기록해놓는 변수의 주소
반환 값		: 오류 0, 성공 1
*/
int tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
head 태그 부분 처리하는 함수
target_file : 원본 파일의 내용
target_size : 원본 파일의 길이에 대한 포인터
copy_file	: 쓸 파일의 파일포인터
반환 값		: 성공 1, 오류 0
*/
int file_processing(char **target_file, int *target_size);
/*
각 파일에 대한 처리(script 제거 등)를 하는 함수
target_dir : 대상 파일이 위치한 디렉토리 경로
반환 값	   : 오류 0, 정상 1
*/
int processing(char *target_dir);
/*
각 파일에 대한 처리(script 제거 등)를 하는 함수
dir		: 대상 폴더들이 위치한 디렉토리 경로
num     : 처리할 폴더 번호
반환 값	: 오류 0, 정상 1
*/
int converting(char* dir, int num);
/*
error list를 파일에 저장해주는 함수
list	: Error 리스트
idx		: Error 리스트의 인덱스(오류의 갯수)
반환 값 : 오류 0, 성공 1
*/
int error_recode_for_convert(int* list, int idx);
/*
html 문서들을 수정하는 함수
*/
void file_convert();