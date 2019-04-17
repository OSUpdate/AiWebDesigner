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

	//�Է� �ޱ�
	len = input_keyboard(buf, sizeof(buf));

	//�ʹ� �� �Է¿� ���� ����ó�� -> ��� ��, ���� õ�� ������ �Է� ����
	if (len >= 9)
		return 0;

	//������ '\n'���� �����
	buf[len - 1] = 0;

	//���๮�� ������� ���̰� 0�̸� ����
	len = len - 1;
	if (len == 0) return 0;

	//���� ������ ���� -��ȣ�� ������
	if (buf[0] == '-') {
		//�� �κ��� 0����
		buf[0] = '0';
		//���̳ʽ� ���� ����
		minus = 1;
	}

	//���ڰ� ����� ���Գ� Ȯ��
	for (int i = 0; i < len; i++) {
		if (!isNumber(buf[i])) return 0;
	}

	//�Է¹��� ���� �ֱ�
	*num = atoi(buf);
	if (minus) *num *= -1;

	//���ڰ� ����� �������� 1��ȯ
	return 1;
}

int getYorN(char *inp) {
	char buf[100];
	int len;

	//�Է� �ޱ�
	len = input_keyboard(buf, sizeof(buf));

	//���� �����ϳ� + ���๮�ں��� ���� �Է��̸� ����
	if (len > 2) return 0;

	//������ '\n'���� �����
	buf[len - 1] = 0;

	//���๮�� ������� ���̰� 0�̸� ����
	len = len - 1;
	if (len == 0) return 0;

	//y �Ǵ� Y ��� 1 ��ȯ
	char c = buf[0];
	if (c == 'y' || c == 'Y') {
		*inp = 'y';
		return 1;
	}

	//n �Ǵ� N �̶�� 1 ��ȯ
	if (c == 'n' || c == 'N') {
		*inp = 'n';
		return 1;
	}

	//y, Y, n, N �� �ƴ϶�� 0 ��ȯ
	return 0;
}

int going_on_question(int num) {
	int cfm;
	char yn;

	while (1) {
		printf("\n");
		printf("Complete: %d\n", num);
		//Continue[y/n] �Է� �ޱ�
		printf("Continue? [y/n]: ");
		cfm = getYorN(&yn);
		if (!cfm) {
			//cfm�� 0�̶�� �߸��� �Է�
			system("cls");
			printf("\n*** Wrong input ***\n\n");
		}
		else {
			printf("\n");
			//n �Ǵ� y �� ���� ó��
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