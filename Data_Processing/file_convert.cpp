#include "super_header.h"

// 작업 할 html 처음과 마지막 폴더 이름
#define START 1
#define END   342

// 작업 하려는 모든 폴더에 index.html이 있는지 확인하려면 1로 설정
#define TEST 0

int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir) {
	char target_file_name[200];
	sprintf(target_file_name, "%s%s", target_dir, "index.html");

	struct _stat buf;
	int result;

	// 타겟 파일의 정보 가져오기
	result = _stat(target_file_name, &buf);
	if (result != 0) {
		printf("_stat() error\n");
		return 0;
	}

	// 타겟 파일 fopen으로 열기
	FILE *fp = fopen(target_file_name, "rb");
	if (fp == NULL) {
		printf("fopne() error - rb\n");
		return 0;
	}

	// 타겟파일을 모두 읽어 저장할 메모리 공간 할당
	*target_file = (char*)malloc(sizeof(char)*buf.st_size);
	if (*target_file == NULL) {
		printf("malloc() error\n");
		return 0;
	}

	// 타겟파일 모두 읽기
	size_t read_size;
	read_size = fread(*target_file, 1, buf.st_size, fp);
	if (read_size != buf.st_size) {
		printf("fread() error, size: %d, read: %d\n", buf.st_size, read_size);
		free(*target_file);
		fclose(fp);
		return 0;
	}
	*target_size = read_size;

	// 타겟파일 파일포인터 반환
	fclose(fp);

	// 원본파일 이름 바꾸기
	char temp[200];
	sprintf(temp, "%s%s", target_dir, "origin.html");
	if (!rename_file(target_file_name, temp)) {
		printf("rename_file error\n");
		free(*target_file);
		return 0;
	}

	// 복사해 저장할 파일 fopen으로 열기
	*copy_file = fopen(target_file_name, "wb");
	if (*copy_file == NULL) {
		free(*target_file);
		printf("fopen() error - wb\n");
		return 0;
	}
}

int find_end_of_head(char *target_file, int target_size, int *index) {
	int i = *index;

	// head 인가?
	if (isEqual(i, target_file, "head")) {
		// </head>가 맞다면 1 반환
		*index = i + 5;
		return 1;
	}

	return 0;
}

int find_href_position(char *link_tag, int len, int *start, int *end) {
	// link 태그의 href="~~" 부분의 ~~ 찾기
	int i;
	for (i = 0; i < len; i++) {
		// 만약 h 글자를 찾았다면
		if (link_tag[i] == 'h') {
			// 그 href 속성이라면
			if (isEqual(i, link_tag, "href")) {
				i += 6;
				*start = i;
				for (; i < len; i++) {
					if (link_tag[i] == '"') break;
				}
				*end = i - 1;
				return 1;
			}
		}
	}

	return 0;
}

int find_script(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int start_point;

	// 'script'인지 확인하기, 아니면 0 반환
	if (!isEqual(i, target_file, "script")) return 0;

	// '<'를 start_point로 지정
	start_point = i - 1;

	// script 태그 이전까지 파일에 쓰기
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// </script> 또는 /> 위치 찾기
	for (; i < target_size; i++) {
		// > 문자 찾았을 때
		if (target_file[i] == '>') {
			// '/>' 이라면 나가기
			if (target_file[i - 1] == '/') break;

			// '</script> 인지 확인하기
			// 1. i-7 위치 문자가 /인지 확인
			if (target_file[i - 7] == '/') {
				// 2. 'script' 인지 확인, 맞다면 break
				if (isEqual(i - 6, target_file, "script")) break;
			}
		}
	}

	// 만약 위 반복문이 다도는 동안 '>'가 없다면
	if (i >= target_size) {
		printf("</script> find error\n");
		return -1;
	}

	// i는 > 다음 위치 가리키게 하기
	i++;

	// script 태그 처리작업 완료 후 인덱스 값, point 최신화 후 1 반환
	*index = i;
	*point = i;
	return 1;
}

int head_processing(char *target_file, int target_size, FILE *copy_file, int *index) {
	// 반복제어, 오류확인 변수
	int i, ck;
	// 인덱스 증가하기 전 위치 저장하는 변수
	int point = 0;

	// 원본파일에 대한 처리 시작
	for (i = 0; i < target_size; i++) {

		// '<' 기호 찾기
		if (target_file[i] == '<') {
			// i 증가 -> i는 '<' 이후 문자를 가리킴
			i++;

			// '<' 다음 '/' 문자가 오면 </head 인지 확인하기
			if (target_file[i] == '/') {
				// i 증가 -> i는 '/' 이후 문자를 가리킴
				i++;

				// </head>인지 확인하고 맞다면 </head>까지 쓰고 반복문 나가기
				ck = find_end_of_head(target_file, target_size, &i);
				if (ck == 1) {
					fwrite(&(target_file[point]), 1, i - point, copy_file);
					break;
				}
			}
			else {
				// link 태그인지 확인
				//ck = find_link(target_file, target_size, copy_file, &i, &point);
				// link 태그가 아니라면 style 태그인지 확인
				//if (ck == 0) ck = find_style(target_file, target_size, copy_file, &i, &point);
				// link도 style도 아니라면 script 태그인지 확인
				ck = find_script(target_file, target_size, copy_file, &i, &point);

				// 오류 발생시 0 반환
				if (ck == -1) return 0;
			}
		}
	}

	// 이 함수에서 원본 파일을 다 돌았다면 오류
	if (i >= target_size) {
		printf("There is no <body> ?? \n");
		return 0;
	}

	// 인덱스 값 최신화 후 1 반환
	*index = i;
	return 1;
}

int a_processing(char *a_tag, int len, FILE *copy_file) {
	int start_point, end_point;
	int in_href = 0;
	int do_process = 0;

	// a 태그의 href="~~" 부분의 ~~ 찾기
	in_href = find_href_position(a_tag, len, &start_point, &end_point);

	// href 속성이 없을 때 해당 a 태그 부분 그대로 쓰고 나가기
	if (!in_href) {
		fwrite(a_tag, 1, len, copy_file);
		return 1;
	}

	// a 태그 쓰기
	fwrite(a_tag, 1, start_point, copy_file);
	fwrite("#", 1, 1, copy_file);
	fwrite(&(a_tag[end_point + 1]), 1, len - end_point - 1, copy_file);

	return 1;
}

int find_a(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int start_point, end_point;

	// 'a '인지 확인하기, 아니면 0 반환
	if (!isEqual(i, target_file, "a ")) return 0;

	// '<'를 start_point로 지정
	start_point = i - 1;

	// a 태그 이전까지 파일에 쓰기
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// '>' 기호 찾기
	for (; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}
	end_point = i;

	// i 증가 -> i는 link 태그의 마지막 '>' 다음 문자를 가리킴
	i++;

	// 만약 위 반복문이 다도는 동안 '>'가 없다면
	if (i >= target_size) {
		printf("'>' find error\n");
		return -1;
	}

	// a문에 대한 처리작업 진행
	if (!a_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file))
		return -1;

	// link 태그 처리작업 완료 후 인덱스 값, point 최신화 후 1 반환
	*index = i;
	*point = i;
	return 1;
}

int body_processing(char *target_file, int target_size, FILE *copy_file, int index) {
	int i, ck;
	int point = index;

	// 원본 파일의 나머지 부분에 대해 처리
	for (i = index; i < target_size; i++) {
		// '<' 발견시
		if (target_file[i] == '<') {
			// i 증가 -> i는 < 이후의 문자를 가리킴
			i++;

			// <a> 태그인지 확인하고 처리
			ck = find_a(target_file, target_size, copy_file, &i, &point);
			if (ck == -1) return 0;
		}
	}

	// 남은 부분 모두 쓰기
	if (point < target_size) {
		fwrite(&(target_file[point]), 1, target_size - point, copy_file);
	}

	return 1;
}

int processing(char *target_dir) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	int index;

	// 1. 파일 열기(대상 파일, 복사할 파일)
	if (!file_open(&target_file, &target_size, &copy_file, target_dir))
		return 0;

	// 2. <head> 태그 내 내용 처리
	if (!head_processing(target_file, target_size, copy_file, &index)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 3. 나머지 부분 처리
	if (!body_processing(target_file, target_size, copy_file, index)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 파일 하나에 대한 처리 완료
	free(target_file);
	fclose(copy_file);
	return 1;
}

int converting(char* dir, int num) {
	// 작업할 index.html이 있는 폴더이름 만들기
	char target[200];
	sprintf(target, "%s%s%d%s", dir, "\\", num, "\\");

	// 파일 처리 수행(script 제거, a링크의 href 값을 #으로 만들기)
	if (!processing(target)) {
		// 오류가 발생했다면
		printf("%d: Fail\n\n", num);
		// 오류 반환
		return 0;
	}
	else
		printf("%d: Complete\n", num);
}

void file_convert() {
	system("cls");

	// 대상 데이터들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	char html[300] = { 0 };
	int i = START;
	for (; i < END + 1; i++) {

		// html 파일 이름: 폴더경로\\indes.html
		sprintf(html, "%s%s%d%s", dir, "\\", i, "\\index.html");

		if (TEST) {
			// fopen 으로 index.html이 모두 있는지 확인
			FILE *fp;
			fp = fopen(html, "r");
			if (fp == NULL) {
				printf("fopen() fail: %s\n", html);
			}
			else
				fclose(fp);
		}
		else {
			// 해당 html 파일에 대한 처리
			if (!converting(dir, i)) {
				system("pause");
			}
		}
	}

	// 모든 작업 완료
	printf("html_to_image complete\n");
	system("pause");
}




/*
int link_processing(char *link_tag, int len, FILE *copy_file) {

	int start_point, end_point;
	int in_href = 0;
	int do_process = 0;

	// link 태그의 href="~~" 부분의 ~~ 찾기
	in_href = find_href_position(link_tag, len, &start_point, &end_point);

	// href 속성이 없을 때 해당 link 태그 부분 그대로 쓰고 나가기
	if (!in_href) {
		fwrite(link_tag, 1, len, copy_file);
		return 1;
	}

	// 링크태그 쓰기
	fwrite(link_tag, 1, start_point, copy_file);
	fwrite("앞에 붙여야할 거", 1, strlen("그거 길이"), copy_file);
	fwrite(&(link_tag[start_point]), 1, len - start_point, copy_file);

	return 1;
}

int find_link(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int ck, start_point, end_point;

	// 'link'인지 확인하기, 아니면 0 반환
	if (!isEqual(i, target_file, "link")) return 0;

	// '<'를 start_point로 지정
	start_point = i - 1;

	// link문 이전까지 쓰기
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// '>' 기호 찾기
	for (; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}
	end_point = i;

	// i 증가 -> i는 link 태그의 마지막 '>' 다음 문자를 가리킴
	i++;

	// 만약 위 반복문이 다도는 동안 '>'가 없다면
	if (i >= target_size) {
		printf("'>' find error\n");
		return -1;
	}

	// link문에 대한 처리작업 진행
	if (!link_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file))
		return -1;

	// link 태그 처리작업 완료 후 인덱스 값, point 최신화 후 1 반환
	*index = i;
	*point = i;
	return 1;
}

int style_processing(char *style_tag, int len, FILE *copy_file) {

	int i;
	int point = 0;
	for (i = 0; i < len; i++) {
		// @ 발견시
		if (style_tag[i] == '@') {
			i++;
			// import 인지 확인
			if (isEqual(i, style_tag, "import")) {
				i += 6;
				// 첫 번째 " 찾기
				for (; i < len; i++)
					if (style_tag[i] == '"') break;
				//  첫 번째 " 까지 쓰기
				fwrite(&(style_tag[point]), 1, i - point + 1, copy_file);
				point = i + 1;
				// 링크 앞에 붙여야 할 거 쓰기
				fwrite("앞에 붙여야할 거", 1, strlen("그거 길이"), copy_file);
			}
		}
	}

	// 나머지 style 태그 쓰기
	fwrite(&(style_tag[point]), 1, len - point, copy_file);
	return 1;
}

int find_style(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int start_point, end_point;

	// 'style'인지 확인하기, 아니면 0 반환
	if (!isEqual(i, target_file, "style")) return 0;

	// < 를 start_point로 지정
	start_point = i - 1;

	// style 태그 이전까지 쓰기
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	i += 5;

	// style 태그의 마지막 위치 찾고, 처리하기
	for (; i < target_size - 1; i++) {
		// 먼저 '</' 찾기
		if ((target_file[i] == '<') && (target_file[i + 1] == '/')) {
			i += 2;

			// </style 이라면
			if (isEqual(i, target_file, "style")) {
				// i가 > 이후를 가리키게 하기
				i += 6;
				end_point = i - 1;
				// <style> 태그에 대한 처리작업 진행
				if (!style_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file))
					return -1;

				// 반복문 나가기
				break;
			}
		}
	}

	// 만약 위 반복문이 다도는 동안 '>'가 없다면
	if (i >= target_size - 1) {
		printf("</style> find error\n");
		return -1;
	}

	// style 태그 처리작업 완료 후 인덱스 값, point 최신화 후 1 반환
	*index = i;
	*point = i;
	return 1;
}
*/