#pragma once

/*
폴더 내 index.html을 제외한 모든 html 제거하는 함수
dir		: .html 파일들이 있는 대상 디렉토리
반환 값 : 성공 1, 오류 0
*/
int organizing(char *dir);
/*
폴더 정리하는 함수
*/
void organize_folder();