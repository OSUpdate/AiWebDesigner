#pragma once

/*
파일의 유효성 확인을 위해 파일을 열어 내용을 가져오는 함수
file_p	  : 파일의 내용이 저장될 메모리의 주소
file_size : 파일의 크기가 저장될 메모리의 주소
file_name : 내용을 확인할 메모리의 주소
반환 값	  : 오류 0, 성공 1
*/
int file_open_for_check(char** file_p, int* file_size, char* file_name);
/*
각 태그에 대해 확인 및 처리하는 함수
tag		: 태그의 시작지점
tag_len : 태그의 길이
ck		: 태그에 따라 수정될 배열
반환 값 : 오류 0, 성공 1;
*/
int tag_checking(char* tag, int tag_len, int* ck);
/*
html 파일에 대해 정상 data인지 확인하는 함수
file	: 검사할 html 파일의 내용
size	: html 파일의 크기
반환 값 : 각 오류나 성공 별 define 된 숫자 반환
*/
int html_check(char* file, int size);
/*
파일이 유효한지 확인하는 함수
file_name : 열어서 확인할 파일의 이름
반환 값	  : 성공 1, 오류 - 오류코드 값
*/
int checking(char* file_name);
/*
파일 검사 후 오류난 리스트를 텍스트 파일에 저장해주는 함수
no_index : 파일이 없는 폴더의 이름들
empty	 : index.html이 없는 폴더의 이름들
not_html : 파일 지우는데 실패한 폴더의 이름들
no_idx	 : no_file의 크기
emp		 : no_index의 크기
n_html	 : del_fail의 크기
반환 값	 : 성공 1, 오류 0
*/
int error_recode_for_check(int* no_index, int* empty, int* not_html, int no_idx, int emp, int n_html);
/*
파일이 유효한지 검사하는 함수
*/
void file_check();