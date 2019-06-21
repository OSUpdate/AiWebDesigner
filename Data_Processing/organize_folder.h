#pragma once

/*
폴더 내 index.html을 제외한 모든 html 제거하는 함수
dir		: .html 파일들이 있는 대상 디렉토리
반환 값 : 성공 1, 오류 0
*/
int organizing(char *dir);
/*
배열의 내용을 파일에 한줄씩 쓰는 함수
arr : 값들을 가진 배열
idx : 배열의 크기
fp  : 쓸 파일의 포인터
*/
void arr_recode(int* arr, int idx, FILE* fp);
/*
각 오류난 폴더의 이름들을 파일에 쓰는 함수
no_file	 : 파일이 없는 폴더의 이름들
no_index : index.html이 없는 폴더의 이름들
del_fail : 파일 지우는데 실패한 폴더의 이름들
nf_idx	 : no_file의 크기
ni_idx	 : no_index의 크기
df_idx	 : del_fail의 크기
반환 값	 : 성공 1, 오류 0
*/
int error_recode(int* no_file, int* no_index, int* del_fail, int nf_idx, int ni_idx, int df_idx);
/*
폴더 정리하는 함수
*/
void organize_folder();