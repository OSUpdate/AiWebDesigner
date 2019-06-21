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
문자 하나가 영어 문자인지 확인하는 함수
c		: 확인할 문자
반환 값 : 영어 문자면 1, 아니면 0 반환
*/
int isChar(char c);

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

/*
qsort 함수를 사용하기 위해 정의한 함수, int형 오름차순 정렬
*/
int static compare(const void* first, const void* second);

/*
지정한 디렉토리 내 폴더들의 이름의 시작과 끝을 찾는 함수
dir		: 폴더가 위치한 디렉토리
start	: 처음 폴더의 이름
end		: 마지막 폴더의 이름
반환 값 : 성공 1, 오류 0
*/
int get_folder_list(char *dir, int *start, int *end);

/*
문자열 내 특정 문자열을 다른 문자열로 치환하는 함수
치환할 문자열이 없는경우 alt_s 는 NULL, alt_len 은 0으로 설정
target		: 작업할 문자열
target_size : 작업할 문자열의 길이
start_p		: 치환될 문자열의 시작지점
end_p		: 치환될 문자열의 끝 지점
alt_s		: 치환할 문자열
alt_len		: 치환할 문자열의 길이
rs			: 변경된 정도를 저장하는 변수의 주소(추가될 길이 - 삭제될 길이)
반환 값		: 오류 0, 정상 1
*/
int string_convert(char **target, int *target_size, int start_p, int end_p, const char *alt_s, int alt_len, int *rs);

/*
문자열에서 태그를 찾아주는 함수
target_file : 탐색할 문자열
target_size : 문자열의 총 길이
start		: 탐색을 시작할 위치
tag_start	: 태그의 시작점을 저장할 변수의 주소
tag_end		: 태그의 끝점을 저장할 변수의 주소
반환 값		: 오류 0, 성공 1
*/
int find_tag(char* target_file, int target_size, int start, int* tag_start, int* tag_end);
/*
태그에서 태그의 이름을 찾는 함수
tag		 : 탐색할 태그
tag_size : 태그의 길이
name_s	 : 이름의 처음 부분의 위치
name_e	 : 이름의 마지막 부분의 위치
*/
int tag_name(char* tag, int tag_size, int* name_s, int* name_e);
