#pragma once

/*
단어 검사 함수
idx		: str1에서 검사할 단어의 위치(인덱스)
str1	: 검사할 단어가 있는 문자열
str2	: 비교 대상 단어
반환 값 : 두 단어가 같다면 1 반환, 다르면 0 반환
*/
int isEqual(int idx, const char *str1, const char *str2);
/*
문자 하나가 숫자인지 확인하는 함수
c		: 확인할 문자
반환 값 : 숫자면 1, 아니면 0 반환
*/
int isNumber(char c);

/*
키보드(stdin)에서 입력받는 함수
buf		: 입력받은 문자열을 저장할 배열의 주소
size	: buf 배열의 크기(sizeof(buf))
반환 값 : 입력 받은 길이
*/
int input_keyboard(char buf[], int size);
/*
숫자를 입력받는 함수
num		: 입력받은 숫자를 저장할 변수의 주소
반환 값 : 오류 0, 정상 1
*/
int getNumber(int *num);
/*
Y 또는 N 을 입력받는 함수
inp		: 입력받은 문자를 저장할 변수의 주소
반환 값 : 오류 0, 정상 1
*/
int getYorN(char *inp);
/*
계속 진행할지 여부 묻기
num     : 현재까지 진행한 정도
반환 값 : 계속진행 1, 그만 0
*/
int going_on_question(int num);

/*
파일 이름 바꾸기
old_file : 이름 바꾸기 대상 파일
new_file : 바꿀 이름
반환 값  : 성공 1, 실패 0
*/
int rename_file(const char* old_file, const char* new_file);
/*
파일 삭제하기
name	: 삭제할 대상 파일
반환 값 : 성공 1, 실패 0
*/
int delete_file(const char *name);
/*
타겟 디렉토리의 이름 읽어오는 함수
dir		: 읽어온 정보(대상 디렉토리 경로)가 저장될 메모리 주소, 200 크기의 char 배열
반환 값 : 실패 0, 성공 1
*/
int getTargetDir(char dir[]);
/*
rename 할때 시작할 파일의 이름
반환 값 : 성공 rename 할때 시작할 파일의 이름, 오류 0
*/
int get_first_file_name();

/*
data.txt 파일에 마지막으로 rename한 파일의 이름 +1 쓰기
name	: 마지막으로 rename한 파일의 이름 +1
반환 값 : 성공 1, 오류 0
*/
int write_last_file_name(int name);