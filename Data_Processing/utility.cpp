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

int static compare(const void* first, const void* second) {
	if (*(int*)first > *(int*)second)
		return 1;
	else if (*(int*)first < *(int*)second)
		return -1;
	else
		return 0;
}

int get_folder_list(char *dir, int *start, int *end) {
	// html������ �����θ� ���� �迭
	char html[300] = { 0 };

	// ������ ���� �� ��� ���� ã��
	_finddata_t fd;
	long handle;
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "\\*");
	handle = _findfirst(buf, &fd);

	// ������ ������ ���� ��
	if (handle == -1) {
		printf("%s: There were no files\n", buf);
		return 0;
	}

	// ���� �̸����� ������ ����Ʈ�� �ε���
	int f_list[3000];
	int index = 0;

	// �ݺ��ϸ� ��� ���Ͽ� ���� ����, ���� �̸� ����Ʈ �����
	int ck = 1;
	int count = 2;
	int result = 1;
	while (result != -1) {
		// . �� .. �� �����ϱ�
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

		// fd.name: ������ �̸�, char�� �迭����
		// �����̸� ����Ʈ �����
		if (ck) {
			f_list[index] = atoi(fd.name);
			index++;
		}

		// ���� ���� ����Ű��
		result = _findnext(handle, &fd);
	}

	// index�� 0�̸� ������
	if (index == 0) {
		printf("there is no file\n");
		return 0;
	}

	// ���� �̸� ����Ʈ ����
	qsort(f_list, index, sizeof(int), compare);

	// ���� �̸��� ���������� Ȯ��
	for (int i = 1; i < index; i++) {
		if (f_list[i] - f_list[i - 1] != 1) {
			printf("File list is not continuous\n");
			return 0;
		}
	}

	// �����̸��� ���۰� ���� ����
	*start = f_list[0];
	*end = f_list[index - 1];
	return 1;
}

int string_convert(char **target, int *target_size, int start_p, int end_p, const char *alt_s, int alt_len, int *rs) {
	// �������� ���ŵ� ���ڿ��� ����
	int del_len = end_p - start_p + 1;

	// �������� ���ŵ� ���ڿ��� ���̰� ������� ����
	if (del_len < 0) {
		printf("start_p, end_p error\n");
		return 0;
	}

	// ���� �� ũ��(����ũ�� - ���ŵ� ���� + �߰��� ����)
	int re_size = *target_size - del_len + alt_len;

	// ���̰� ��������Ѵٸ� �� ��ŭ �޸� ���Ҵ�ޱ�
	if (alt_len > del_len)
		* target = (char*)realloc(*target, re_size);

	// realloc ���н� ó��
	if (*target == NULL) {
		printf("realloc() error\n");
		return 0;
	}

	// �ű� ���ڿ��� �ִ� ��쿡�� ����


	// ���ڿ��� �� �κ��� ��� �ű��
	// re_s: �� �κ��� �Ű��� ��ġ
	// remain: �ű� ���ڿ��� ����
	int re_s = start_p + alt_len;
	int remain = *target_size - 1 - end_p;

	// �ű� ���ڿ��� �ִ� ��� ����
	if (remain > 0)
		memmove(&((*target)[re_s]), &((*target)[end_p + 1]), remain);

	// ��ü�� ���ڿ� �ֱ�(�ִ� ���)
	if (alt_s != NULL) {
		memcpy(&((*target)[start_p]), alt_s, alt_len);
	}

	// ũ�Ⱑ �󸶳� �������� ����(�߰��� ���� - ������ ����)
	*rs = alt_len - del_len;

	// target_size ����
	*target_size = re_size;

	return 1;
}

int find_tag(char* target_file, int target_size, int start, int* tag_start, int* tag_end) {
	int i;

	// ���� ���ڷ� '!' �� �ȿ��� '<'��ġ ã��
	for (i = start; i < target_size; i++) {
		if (target_file[i] == '<') {
			// '<' ��ġ�� ������ ���̶�� tag_end�� 0���� �ϰ� �Լ� ����
			if (i == target_size - 1) {
				printf("'<' position is end of file\n");
				return 0;
			}

			// tag�� ���������̶�� tag_exist�� �������ְ� �ݺ��� ����
			if (target_file[i + 1] != '!') {
				break;
			}
		}
	}

	// '<'�� ��ã�� ä �� �ݺ����� �����ٸ� tag_end�� 0���� �ϰ� ��ȯ
	if (i >= target_size) {
		*tag_end = 0;
		return 1;
	}

	// tag_start�� '<'�� ��ġ
	*tag_start = i;

	// �±װ� ������ ��ġ�� '>'�� ��ġ ã��
	for (i = i + 1; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}

	// ������ ���� �� ���� '>'�� �� ã�� ���
	if (i == target_size) {
		printf("'>' not exist\n");
		return 0;
	}

	// tag_end�� '>'�� ��ġ
	*tag_end = i;

	// 1 ��ȯ(�±��� ���۰� �� ��� ã��)
	return 1;
}

int tag_name(char* tag, int tag_size, int* name_s, int* name_e) {
	// �±׿��� ���ʿ� �ִ� ���� ����
	int i;
	for (i = 1; i < tag_size; i++) {
		if (tag[i] != ' ')
			break;
	}

	// �±װ� '/'�� �����ϴ°��� Ȯ��
	if (tag[i] == '/')
		i++;

	// '/' ������ �ִ� ���� ����
	for (; i < tag_size; i++) {
		if (tag[i] != ' ')
			break;
	}

	// i�� �̸��� ���� ��ġ
	*name_s = i;

	// �±׿��� ù ��° ���� ã��
	for (i = i + 1; i < tag_size; i++) {
		if (tag[i] == ' ')
			break;
	}

	// ������ ���ٸ�(<a> ó�� �̸��� �ִ� ���)
	if (i == tag_size)
		* name_e = i - 2;
	// ������ �ִٸ�(<a herf=""> ó�� �Ӽ��� �ִ� ���)
	else
		*name_e = i - 1;

	// ���� �̸��� ���ٸ� ����: 0 ��ȯ
	if (*name_s > * name_e) {
		printf("Tag name not exist\n");
		return 0;
	}

	// ���������� ������ 1 ��ȯ
	return 1;
}