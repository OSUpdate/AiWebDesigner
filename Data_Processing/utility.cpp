#include "super_header.h"

int isEqual(int idx, const char *str1, const char *str2) {
	return !(strncmp(&(str1[idx]), str2, strlen(str2)));
}

int isNumber(char c) {
	if (c < '0' || c > '9') return 0;
	else					return 1;
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