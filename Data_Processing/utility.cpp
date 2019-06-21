#include "super_header.h"

int isEqual(int idx, const char *str1, const char *str2) {
	return !(strncmp(&(str1[idx]), str2, strlen(str2)));
}

int isNumber(char c) {
	if (c < '0' || c > '9') return 0;
	else					return 1;
}

int isChar(char c) {
	if (c <'A' || c > 'Z') {
		if (c < 'a' || c > 'z') return 0;
		else					return 1;
	}
	else
		return 1;
}

int input_keyboard(char buf[], int size) {
	fgets(buf, size, stdin);
	return strlen(buf);
}

int getNumber(int *num) {
	char buf[100];
	int len;
	int minus = 0;

	//입력 받기
	len = input_keyboard(buf, sizeof(buf));

	//너무 긴 입력에 대한 예외처리 -> 양수 억, 음수 천만 까지만 입력 가능
	if (len >= 9)
		return 0;

	//마지막 '\n'문자 지우기
	buf[len - 1] = 0;

	//개행문자 지우고나서 길이가 0이면 오류
	len = len - 1;
	if (len == 0) return 0;

	//만약 음수를 위한 -기호가 있으면
	if (buf[0] == '-') {
		//그 부분을 0으로
		buf[0] = '0';
		//마이너스 상태 설정
		minus = 1;
	}

	//문자가 제대로 들어왔나 확인
	for (int i = 0; i < len; i++) {
		if (!isNumber(buf[i])) return 0;
	}

	//입력받은 숫자 넣기
	*num = atoi(buf);
	if (minus) *num *= -1;

	//숫자가 제대로 들어왔으면 1반환
	return 1;
}

int getYorN(char *inp) {
	char buf[100];
	int len;

	//입력 받기
	len = input_keyboard(buf, sizeof(buf));

	//만약 문자하나 + 개행문자보다 많은 입력이면 오류
	if (len > 2) return 0;

	//마지막 '\n'문자 지우기
	buf[len - 1] = 0;

	//개행문자 지우고나서 길이가 0이면 오류
	len = len - 1;
	if (len == 0) return 0;

	//y 또는 Y 라면 1 반환
	char c = buf[0];
	if (c == 'y' || c == 'Y') {
		*inp = 'y';
		return 1;
	}

	//n 또는 N 이라면 1 반환
	if (c == 'n' || c == 'N') {
		*inp = 'n';
		return 1;
	}

	//y, Y, n, N 이 아니라면 0 반환
	return 0;
}

int going_on_question(int num) {
	int cfm;
	char yn;

	while (1) {
		printf("\n");
		printf("Complete: %d\n", num);
		//Continue[y/n] 입력 받기
		printf("Continue? [y/n]: ");
		cfm = getYorN(&yn);
		if (!cfm) {
			//cfm이 0이라면 잘못된 입력
			system("cls");
			printf("\n*** Wrong input ***\n\n");
		}
		else {
			printf("\n");
			//n 또는 y 에 따른 처리
			if (yn == 'n') return 0;
			else		   return 1;
		}
	}
}

int rename_file(const char* old_file, const char* new_file) {
	if (rename(old_file, new_file) == -1)
		return 0;
	return 1;
}

int delete_file(const char *name) {
	if (remove(name) == -1)
		return 0;
	return 1;
}

int getTargetDir(char dir[]) {

	if (dir == NULL) {
		printf("parameter is NULL\n");
		return 0;
	}

	FILE *data;
	data = fopen("data.txt", "r");

	if (data == NULL) {
		printf("data.txt open fail\n");
		return 0;
	}

	if (fgets(dir, 200, data) == NULL) {
		printf("fgets() error\n");
		return 0;
	}

	dir[strlen(dir) - 1] = 0;

	fclose(data);
	return 1;
}

int get_first_file_name() {
	FILE *data;
	data = fopen("data.txt", "r");

	if (data == NULL) {
		printf("data.txt open fail\n");
		return 0;
	}

	char buf[200];
	if (fgets(buf, 200, data) == NULL) {
		printf("first-fgets() error\n");
		return 0;
	}
	if (fgets(buf, 200, data) == NULL) {
		printf("second-fgets() error\n");
		return 0;
	}

	int result = atoi(buf);
	if (!result) {
		printf("result is 0\n");
		return 0;
	}

	fclose(data);
	return result;
}

int write_last_file_name(int name) {
	char dir[200];
	if (!getTargetDir(dir)) return 0;

	FILE *data;
	data = fopen("data.txt", "w");
	if (data == NULL) {
		printf("data.txt open fail\n");
		return 0;
	}

	fprintf(data, "%s\n%d", dir, name);

	fclose(data);
	return 1;
}

int static compare(const void* first, const void* second) {
	if (*(int*)first > *(int*)second)
		return 1;
	else if (*(int*)first < *(int*)second)
		return -1;
	else
		return 0;
}

int get_folder_list(char *dir, int *start, int *end) {
	// html파일의 절대경로를 담을 배열
	char html[300] = { 0 };

	// 지정한 폴더 내 모든 폴더 찾기
	_finddata_t fd;
	long handle;
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "\\*");
	handle = _findfirst(buf, &fd);

	// 폴더내 폴더가 없을 때
	if (handle == -1) {
		printf("%s: There were no files\n", buf);
		return 0;
	}

	// 폴더 이름들을 저장할 리스트와 인덱스
	int f_list[3000];
	int index = 0;

	// 반복하며 모든 파일에 대해 수행, 폴더 이름 리스트 만들기
	int ck = 1;
	int count = 2;
	int result = 1;
	while (result != -1) {
		// . 과 .. 은 무시하기
		if (count) {
			if (isEqual(0, fd.name, ".") || isEqual(0, fd.name, "..")) {
				ck = 0;
				count--;
			}
			else
				ck = 1;
		}
		else
			ck = 1;

		// fd.name: 폴더의 이름, char형 배열형태
		// 폴더이름 리스트 만들기
		if (ck) {
			f_list[index] = atoi(fd.name);
			index++;
		}

		// 다음 파일 가리키기
		result = _findnext(handle, &fd);
	}

	// index가 0이면 나가기
	if (index == 0) {
		printf("there is no file\n");
		return 0;
	}

	// 폴더 이름 리스트 정렬
	qsort(f_list, index, sizeof(int), compare);

	// 폴더 이름이 연속적인지 확인
	for (int i = 1; i < index; i++) {
		if (f_list[i] - f_list[i - 1] != 1) {
			printf("File list is not continuous\n");
			return 0;
		}
	}

	// 폴더이름의 시작과 끝을 저장
	*start = f_list[0];
	*end = f_list[index - 1];
	return 1;
}

int string_convert(char **target, int *target_size, int start_p, int end_p, const char *alt_s, int alt_len, int *rs) {
	// 원본에서 제거될 문자열의 길이
	int del_len = end_p - start_p + 1;

	// 원본에서 제거될 문자열의 길이가 음수라면 오류
	if (del_len < 0) {
		printf("start_p, end_p error\n");
		return 0;
	}

	// 변경 될 크기(원래크기 - 제거될 길이 + 추가될 길이)
	int re_size = *target_size - del_len + alt_len;

	// 길이가 길어져야한다면 그 만큼 메모리 재할당받기
	if (alt_len > del_len)
		* target = (char*)realloc(*target, re_size);

	// realloc 실패시 처리
	if (*target == NULL) {
		printf("realloc() error\n");
		return 0;
	}

	// 옮길 문자열이 있는 경우에만 수행


	// 문자열의 뒷 부분을 모두 옮기기
	// re_s: 뒷 부분이 옮겨질 위치
	// remain: 옮길 문자열의 길이
	int re_s = start_p + alt_len;
	int remain = *target_size - 1 - end_p;

	// 옮길 문자열이 있는 경우 수행
	if (remain > 0)
		memmove(&((*target)[re_s]), &((*target)[end_p + 1]), remain);

	// 대체할 문자열 넣기(있는 경우)
	if (alt_s != NULL) {
		memcpy(&((*target)[start_p]), alt_s, alt_len);
	}

	// 크기가 얼마나 변경됬는지 저장(추가될 길이 - 삭제될 길이)
	*rs = alt_len - del_len;

	// target_size 변경
	*target_size = re_size;

	return 1;
}

int find_tag(char* target_file, int target_size, int start, int* tag_start, int* tag_end) {
	int i;

	// 다음 문자로 '!' 가 안오는 '<'위치 찾기
	for (i = start; i < target_size; i++) {
		if (target_file[i] == '<') {
			// '<' 위치가 파일의 끝이라면 tag_end를 0으로 하고 함수 나감
			if (i == target_size - 1) {
				printf("'<' position is end of file\n");
				return 0;
			}

			// tag의 시작지점이라면 tag_exist를 설정해주고 반복문 나감
			if (target_file[i + 1] != '!') {
				break;
			}
		}
	}

	// '<'를 못찾은 채 위 반복문이 끝났다면 tag_end를 0으로 하고 반환
	if (i >= target_size) {
		*tag_end = 0;
		return 1;
	}

	// tag_start는 '<'의 위치
	*tag_start = i;

	// 태그가 끝나는 위치인 '>'의 위치 찾기
	for (i = i + 1; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}

	// 파일이 끝날 때 까지 '>'를 못 찾은 경우
	if (i == target_size) {
		printf("'>' not exist\n");
		return 0;
	}

	// tag_end는 '>'의 위치
	*tag_end = i;

	// 1 반환(태그의 시작과 끝 모두 찾음)
	return 1;
}

int tag_name(char* tag, int tag_size, int* name_s, int* name_e) {
	// 태그에서 앞쪽에 있는 공백 무시
	int i;
	for (i = 1; i < tag_size; i++) {
		if (tag[i] != ' ')
			break;
	}

	// 태그가 '/'로 시작하는건지 확인
	if (tag[i] == '/')
		i++;

	// '/' 다음에 있는 공백 무시
	for (; i < tag_size; i++) {
		if (tag[i] != ' ')
			break;
	}

	// i가 이름의 시작 위치
	*name_s = i;

	// 태그에서 첫 번째 공백 찾기
	for (i = i + 1; i < tag_size; i++) {
		if (tag[i] == ' ')
			break;
	}

	// 공백이 없다면(<a> 처럼 이름만 있는 경우)
	if (i == tag_size)
		* name_e = i - 2;
	// 공백이 있다면(<a herf=""> 처럼 속성도 있는 경우)
	else
		*name_e = i - 1;

	// 만약 이름이 없다면 오류: 0 반환
	if (*name_s > * name_e) {
		printf("Tag name not exist\n");
		return 0;
	}

	// 정상적으로 끝나면 1 반환
	return 1;
}