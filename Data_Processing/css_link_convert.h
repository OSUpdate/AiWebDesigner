#pragma once

/*
link 태그 부분 처리하는 함수
link_tag  : 처리할 <link> 태그의 시작 위치('<' 위치)
len		  : <link> 태그의 길이
copy_file : 쓸 파일의 파일포인터
css_head  : 기존 css 링크 앞에 추가해야 할 문자열
반환 값	  :성공 1, 오류 0
*/
int link_processing(char *link_tag, int len, FILE *copy_file, char *css_head);
/*
<link> 인지 검사를 하고 처리를 하는 함수
target_file : 대상 파일
target_size : 대상 파일의 크기
copy_file	: 대상파일을 복사해 저장할 파일의 파일포인터
index		: 대상 파일에서 현재 처리중인 위치
point		: 대상 파일에서 아직 복사 처리가 되지 않은 위치
css_head	: 기존 css 링크 앞에 추가해야 할 문자열
반환 값		: 성공 1, 오류 0
*/
int find_link(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head);
/*
style 태그 부분 처리하는 함수
style_tag : 처리할 <style> 태그의 시작 위치('<' 위치)
len		  : <style> 태그의 길이
copy_file : 쓸 파일의 파일포인터
css_head  : 기존 css 링크 앞에 추가해야 할 문자열
반환 값	  :성공 1, 오류 0
*/
int style_processing(char *style_tag, int len, FILE *copy_file, char *css_head);
/*
<style> 인지 검사를 하고 처리를 하는 함수
target_file : 대상 파일
target_size : 대상 파일의 크기
copy_file	: 대상파일을 복사해 저장할 파일의 파일포인터
index		: 대상 파일에서 현재 처리중인 위치
point		: 대상 파일에서 아직 복사 처리가 되지 않은 위치
css_head	: 기존 css 링크 앞에 추가해야 할 문자열
반환 값		: 성공 1, 오류 0
*/
int find_style(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head);
/*
head 태그 부분 처리하는 함수
target_file : 원본 파일의 내용
target_size : 원본 파일의 길이
copy_file	: 쓸 파일의 파일포인터
index		: 원본 파일에서 어디까지 봤는지 기록하는 변수의 주소
css_head	: 기존 css 링크 앞에 추가해야 할 문자열
반환 값		: 성공 1, 오류 0
*/
int css_head_processing(char *target_file, int target_size, FILE *copy_file, int *index, char *css_head);
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