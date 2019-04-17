#pragma once

/*
target_file : 대상 파일의 내용을 저장할 메모리의 주소
target_size : 대상 파일의 크기를 저장할 메모리의 주소
copy_file   : 복사할 파일의 파일포인터를 저장할 메모리의 주소
target_dir  : 대상 파일이 있는 경로
반환 값		: 오류 0, 정상 1
*/
int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir);
/*
</head>인지 확인하는 함수
target_file : 현재 처리중인 파일의 내용
target_size : 현재 처리중인 파일의 길이
index		: 현재 파일에서 처리중인 위치를 저장하는 변수의 주소값
반환 값		: </head>라면 1, 아니면 0
*/
int find_end_of_head(char *target_file, int target_size, int *index);
/*
link 태그의 href="~~" 속성 중 ~~의 위치 찾기
link_tag : link 태그의 시작 주소
len		 : link 태그 부분의 길이
start	 : href 속성의 내용이 시작하는 위치
end		 : href 속성의 내용이 끝나는 위치
반환 값  : href 속성 있으면 1, 없으면 0
*/
int find_href_position(char *link_tag, int len, int *start, int *end);
/*
<script> 인지 검사를 하고 처리를 하는 함수
target_file : 대상 파일
target_size : 대상 파일의 크기
copy_file	: 대상파일을 복사해 저장할 파일의 파일포인터
index		: 대상 파일에서 현재 처리중인 위치
point		: 대상 파일에서 아직 복사 처리가 되지 않은 위치
반환 값		: 성공 1, 오류 0
*/
int find_script(char *target_file, int target_size, FILE *copy_file, int *index, int *point);
/*
head 태그 부분 처리하는 함수
target_file : 원본 파일의 내용
target_size : 원본 파일의 길이
copy_file	: 쓸 파일의 파일포인터
index		: 원본 파일에서 어디까지 봤는지 기록하는 변수의 주소
반환 값		: 성공 1, 오류 0
*/
int head_processing(char *target_file, int target_size, FILE *copy_file, int *index);
/*
a 태그 부분 처리하는 함수
a_tag	  : 처리할 <a> 태그의 시작 위치('<' 위치)
len		  : <a> 태그의 길이
copy_file : 쓸 파일의 파일포인터
반환 값	  :성공 1, 오류 0
*/
int a_processing(char *a_tag, int len, FILE *copy_file);
/*
<a> 인지 검사를 하고 처리를 하는 함수
target_file : 대상 파일
target_size : 대상 파일의 크기
copy_file	: 대상파일을 복사해 저장할 파일의 파일포인터
index		: 대상 파일에서 현재 처리중인 위치
point		: 대상 파일에서 아직 복사 처리가 되지 않은 위치
반환 값		: 성공 1, 오류 0
*/
int find_a(char *target_file, int target_size, FILE *copy_file, int *index, int *point);
/*
body 부분(나머지 부분) 처리하는 함수
target_file : 원본 파일의 내용
target_size : 원본 파일의 길이
copy_file	: 쓸 파일의 파일포인터
index		: head 태그 이후 부분의 시작 위치
반환 값		: 성공 1, 오류 0
*/
int body_processing(char *target_file, int target_size, FILE *copy_file, int index);
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
html 문서들을 수정하는 함수
*/
void file_convert();