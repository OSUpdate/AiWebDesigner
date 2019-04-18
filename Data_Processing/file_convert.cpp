#include "super_header.h"

// �۾� �� html ó���� ������ ���� �̸�
#define START 1
#define END   342

// �۾� �Ϸ��� ��� ������ index.html�� �ִ��� Ȯ���Ϸ��� 1�� ����
#define TEST 0

int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir) {
	char target_file_name[200];
	sprintf(target_file_name, "%s%s", target_dir, "index.html");

	struct _stat buf;
	int result;

	// Ÿ�� ������ ���� ��������
	result = _stat(target_file_name, &buf);
	if (result != 0) {
		printf("_stat() error\n");
		return 0;
	}

	// Ÿ�� ���� fopen���� ����
	FILE *fp = fopen(target_file_name, "rb");
	if (fp == NULL) {
		printf("fopne() error - rb\n");
		return 0;
	}

	// Ÿ�������� ��� �о� ������ �޸� ���� �Ҵ�
	*target_file = (char*)malloc(sizeof(char)*buf.st_size);
	if (*target_file == NULL) {
		printf("malloc() error\n");
		return 0;
	}

	// Ÿ������ ��� �б�
	size_t read_size;
	read_size = fread(*target_file, 1, buf.st_size, fp);
	if (read_size != buf.st_size) {
		printf("fread() error, size: %d, read: %d\n", buf.st_size, read_size);
		free(*target_file);
		fclose(fp);
		return 0;
	}
	*target_size = read_size;

	// Ÿ������ ���������� ��ȯ
	fclose(fp);

	// �������� �̸� �ٲٱ�
	char temp[200];
	sprintf(temp, "%s%s", target_dir, "origin.html");
	if (!rename_file(target_file_name, temp)) {
		printf("rename_file error\n");
		free(*target_file);
		return 0;
	}

	// ������ ������ ���� fopen���� ����
	*copy_file = fopen(target_file_name, "wb");
	if (*copy_file == NULL) {
		free(*target_file);
		printf("fopen() error - wb\n");
		return 0;
	}
}

int find_end_of_head(char *target_file, int target_size, int *index) {
	int i = *index;

	// head �ΰ�?
	if (isEqual(i, target_file, "head")) {
		// </head>�� �´ٸ� 1 ��ȯ
		*index = i + 5;
		return 1;
	}

	return 0;
}

int find_href_position(char *link_tag, int len, int *start, int *end) {
	// link �±��� href="~~" �κ��� ~~ ã��
	int i;
	for (i = 0; i < len; i++) {
		// ���� h ���ڸ� ã�Ҵٸ�
		if (link_tag[i] == 'h') {
			// �� href �Ӽ��̶��
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

	// 'script'���� Ȯ���ϱ�, �ƴϸ� 0 ��ȯ
	if (!isEqual(i, target_file, "script")) return 0;

	// '<'�� start_point�� ����
	start_point = i - 1;

	// script �±� �������� ���Ͽ� ����
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// </script> �Ǵ� /> ��ġ ã��
	for (; i < target_size; i++) {
		// > ���� ã���� ��
		if (target_file[i] == '>') {
			// '/>' �̶�� ������
			if (target_file[i - 1] == '/') break;

			// '</script> ���� Ȯ���ϱ�
			// 1. i-7 ��ġ ���ڰ� /���� Ȯ��
			if (target_file[i - 7] == '/') {
				// 2. 'script' ���� Ȯ��, �´ٸ� break
				if (isEqual(i - 6, target_file, "script")) break;
			}
		}
	}

	// ���� �� �ݺ����� �ٵ��� ���� '>'�� ���ٸ�
	if (i >= target_size) {
		printf("</script> find error\n");
		return -1;
	}

	// i�� > ���� ��ġ ����Ű�� �ϱ�
	i++;

	// script �±� ó���۾� �Ϸ� �� �ε��� ��, point �ֽ�ȭ �� 1 ��ȯ
	*index = i;
	*point = i;
	return 1;
}

int head_processing(char *target_file, int target_size, FILE *copy_file, int *index) {
	// �ݺ�����, ����Ȯ�� ����
	int i, ck;
	// �ε��� �����ϱ� �� ��ġ �����ϴ� ����
	int point = 0;

	// �������Ͽ� ���� ó�� ����
	for (i = 0; i < target_size; i++) {

		// '<' ��ȣ ã��
		if (target_file[i] == '<') {
			// i ���� -> i�� '<' ���� ���ڸ� ����Ŵ
			i++;

			// '<' ���� '/' ���ڰ� ���� </head ���� Ȯ���ϱ�
			if (target_file[i] == '/') {
				// i ���� -> i�� '/' ���� ���ڸ� ����Ŵ
				i++;

				// </head>���� Ȯ���ϰ� �´ٸ� </head>���� ���� �ݺ��� ������
				ck = find_end_of_head(target_file, target_size, &i);
				if (ck == 1) {
					fwrite(&(target_file[point]), 1, i - point, copy_file);
					break;
				}
			}
			else {
				// link �±����� Ȯ��
				//ck = find_link(target_file, target_size, copy_file, &i, &point);
				// link �±װ� �ƴ϶�� style �±����� Ȯ��
				//if (ck == 0) ck = find_style(target_file, target_size, copy_file, &i, &point);
				// link�� style�� �ƴ϶�� script �±����� Ȯ��
				ck = find_script(target_file, target_size, copy_file, &i, &point);

				// ���� �߻��� 0 ��ȯ
				if (ck == -1) return 0;
			}
		}
	}

	// �� �Լ����� ���� ������ �� ���Ҵٸ� ����
	if (i >= target_size) {
		printf("There is no <body> ?? \n");
		return 0;
	}

	// �ε��� �� �ֽ�ȭ �� 1 ��ȯ
	*index = i;
	return 1;
}

int a_processing(char *a_tag, int len, FILE *copy_file) {
	int start_point, end_point;
	int in_href = 0;
	int do_process = 0;

	// a �±��� href="~~" �κ��� ~~ ã��
	in_href = find_href_position(a_tag, len, &start_point, &end_point);

	// href �Ӽ��� ���� �� �ش� a �±� �κ� �״�� ���� ������
	if (!in_href) {
		fwrite(a_tag, 1, len, copy_file);
		return 1;
	}

	// a �±� ����
	fwrite(a_tag, 1, start_point, copy_file);
	fwrite("#", 1, 1, copy_file);
	fwrite(&(a_tag[end_point + 1]), 1, len - end_point - 1, copy_file);

	return 1;
}

int find_a(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int start_point, end_point;

	// 'a '���� Ȯ���ϱ�, �ƴϸ� 0 ��ȯ
	if (!isEqual(i, target_file, "a ")) return 0;

	// '<'�� start_point�� ����
	start_point = i - 1;

	// a �±� �������� ���Ͽ� ����
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// '>' ��ȣ ã��
	for (; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}
	end_point = i;

	// i ���� -> i�� link �±��� ������ '>' ���� ���ڸ� ����Ŵ
	i++;

	// ���� �� �ݺ����� �ٵ��� ���� '>'�� ���ٸ�
	if (i >= target_size) {
		printf("'>' find error\n");
		return -1;
	}

	// a���� ���� ó���۾� ����
	if (!a_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file))
		return -1;

	// link �±� ó���۾� �Ϸ� �� �ε��� ��, point �ֽ�ȭ �� 1 ��ȯ
	*index = i;
	*point = i;
	return 1;
}

int body_processing(char *target_file, int target_size, FILE *copy_file, int index) {
	int i, ck;
	int point = index;

	// ���� ������ ������ �κп� ���� ó��
	for (i = index; i < target_size; i++) {
		// '<' �߽߰�
		if (target_file[i] == '<') {
			// i ���� -> i�� < ������ ���ڸ� ����Ŵ
			i++;

			// <a> �±����� Ȯ���ϰ� ó��
			ck = find_a(target_file, target_size, copy_file, &i, &point);
			if (ck == -1) return 0;
		}
	}

	// ���� �κ� ��� ����
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

	// 1. ���� ����(��� ����, ������ ����)
	if (!file_open(&target_file, &target_size, &copy_file, target_dir))
		return 0;

	// 2. <head> �±� �� ���� ó��
	if (!head_processing(target_file, target_size, copy_file, &index)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 3. ������ �κ� ó��
	if (!body_processing(target_file, target_size, copy_file, index)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// ���� �ϳ��� ���� ó�� �Ϸ�
	free(target_file);
	fclose(copy_file);
	return 1;
}

int converting(char* dir, int num) {
	// �۾��� index.html�� �ִ� �����̸� �����
	char target[200];
	sprintf(target, "%s%s%d%s", dir, "\\", num, "\\");

	// ���� ó�� ����(script ����, a��ũ�� href ���� #���� �����)
	if (!processing(target)) {
		// ������ �߻��ߴٸ�
		printf("%d: Fail\n\n", num);
		// ���� ��ȯ
		return 0;
	}
	else
		printf("%d: Complete\n", num);
}

void file_convert() {
	system("cls");

	// ��� �����͵��� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	char html[300] = { 0 };
	int i = START;
	for (; i < END + 1; i++) {

		// html ���� �̸�: �������\\indes.html
		sprintf(html, "%s%s%d%s", dir, "\\", i, "\\index.html");

		if (TEST) {
			// fopen ���� index.html�� ��� �ִ��� Ȯ��
			FILE *fp;
			fp = fopen(html, "r");
			if (fp == NULL) {
				printf("fopen() fail: %s\n", html);
			}
			else
				fclose(fp);
		}
		else {
			// �ش� html ���Ͽ� ���� ó��
			if (!converting(dir, i)) {
				system("pause");
			}
		}
	}

	// ��� �۾� �Ϸ�
	printf("html_to_image complete\n");
	system("pause");
}




/*
int link_processing(char *link_tag, int len, FILE *copy_file) {

	int start_point, end_point;
	int in_href = 0;
	int do_process = 0;

	// link �±��� href="~~" �κ��� ~~ ã��
	in_href = find_href_position(link_tag, len, &start_point, &end_point);

	// href �Ӽ��� ���� �� �ش� link �±� �κ� �״�� ���� ������
	if (!in_href) {
		fwrite(link_tag, 1, len, copy_file);
		return 1;
	}

	// ��ũ�±� ����
	fwrite(link_tag, 1, start_point, copy_file);
	fwrite("�տ� �ٿ����� ��", 1, strlen("�װ� ����"), copy_file);
	fwrite(&(link_tag[start_point]), 1, len - start_point, copy_file);

	return 1;
}

int find_link(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int ck, start_point, end_point;

	// 'link'���� Ȯ���ϱ�, �ƴϸ� 0 ��ȯ
	if (!isEqual(i, target_file, "link")) return 0;

	// '<'�� start_point�� ����
	start_point = i - 1;

	// link�� �������� ����
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// '>' ��ȣ ã��
	for (; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}
	end_point = i;

	// i ���� -> i�� link �±��� ������ '>' ���� ���ڸ� ����Ŵ
	i++;

	// ���� �� �ݺ����� �ٵ��� ���� '>'�� ���ٸ�
	if (i >= target_size) {
		printf("'>' find error\n");
		return -1;
	}

	// link���� ���� ó���۾� ����
	if (!link_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file))
		return -1;

	// link �±� ó���۾� �Ϸ� �� �ε��� ��, point �ֽ�ȭ �� 1 ��ȯ
	*index = i;
	*point = i;
	return 1;
}

int style_processing(char *style_tag, int len, FILE *copy_file) {

	int i;
	int point = 0;
	for (i = 0; i < len; i++) {
		// @ �߽߰�
		if (style_tag[i] == '@') {
			i++;
			// import ���� Ȯ��
			if (isEqual(i, style_tag, "import")) {
				i += 6;
				// ù ��° " ã��
				for (; i < len; i++)
					if (style_tag[i] == '"') break;
				//  ù ��° " ���� ����
				fwrite(&(style_tag[point]), 1, i - point + 1, copy_file);
				point = i + 1;
				// ��ũ �տ� �ٿ��� �� �� ����
				fwrite("�տ� �ٿ����� ��", 1, strlen("�װ� ����"), copy_file);
			}
		}
	}

	// ������ style �±� ����
	fwrite(&(style_tag[point]), 1, len - point, copy_file);
	return 1;
}

int find_style(char *target_file, int target_size, FILE *copy_file, int *index, int *point) {
	int i = *index;
	int start_point, end_point;

	// 'style'���� Ȯ���ϱ�, �ƴϸ� 0 ��ȯ
	if (!isEqual(i, target_file, "style")) return 0;

	// < �� start_point�� ����
	start_point = i - 1;

	// style �±� �������� ����
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	i += 5;

	// style �±��� ������ ��ġ ã��, ó���ϱ�
	for (; i < target_size - 1; i++) {
		// ���� '</' ã��
		if ((target_file[i] == '<') && (target_file[i + 1] == '/')) {
			i += 2;

			// </style �̶��
			if (isEqual(i, target_file, "style")) {
				// i�� > ���ĸ� ����Ű�� �ϱ�
				i += 6;
				end_point = i - 1;
				// <style> �±׿� ���� ó���۾� ����
				if (!style_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file))
					return -1;

				// �ݺ��� ������
				break;
			}
		}
	}

	// ���� �� �ݺ����� �ٵ��� ���� '>'�� ���ٸ�
	if (i >= target_size - 1) {
		printf("</style> find error\n");
		return -1;
	}

	// style �±� ó���۾� �Ϸ� �� �ε��� ��, point �ֽ�ȭ �� 1 ��ȯ
	*index = i;
	*point = i;
	return 1;
}
*/