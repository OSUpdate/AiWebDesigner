#include "super_header.h"

// �۾� �� html ó���� ������ ���� �̸�
#define START 1
#define END   342

int link_processing(char *link_tag, int len, FILE *copy_file, char *css_head) {

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
	fwrite(css_head, 1, strlen(css_head), copy_file);
	fwrite(&(link_tag[start_point]), 1, len - start_point, copy_file);

	return 1;
}

int find_link(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head) {
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
	if (!link_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file, css_head))
		return -1;

	// link �±� ó���۾� �Ϸ� �� �ε��� ��, point �ֽ�ȭ �� 1 ��ȯ
	*index = i;
	*point = i;
	return 1;
}

int style_processing(char *style_tag, int len, FILE *copy_file, char *css_head) {

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
				fwrite(css_head, 1, strlen(css_head), copy_file);
			}
		}
	}

	// ������ style �±� ����
	fwrite(&(style_tag[point]), 1, len - point, copy_file);
	return 1;
}

int find_style(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head) {
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
				if (!style_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file, css_head))
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

int css_head_processing(char *target_file, int target_size, FILE *copy_file, int *index, char *css_head) {
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

				// </head>���� Ȯ��, file_convert.h �� �Լ�
				ck = find_end_of_head(target_file, target_size, &i);
				if (ck == 1) {
					fwrite(&(target_file[point]), 1, i - point, copy_file);
					break;
				}
			}
			else {
				// link �±����� Ȯ��
				ck = find_link(target_file, target_size, copy_file, &i, &point, css_head);
				// link �±װ� �ƴ϶�� style �±����� Ȯ��
				if (ck == 0) ck = find_style(target_file, target_size, copy_file, &i, &point, css_head);

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

int css_processing(char *target_dir, char* css_head) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	int index;

	// 1. ���� ����(��� ����, ������ ����), file_convert.h �� �Լ� �״�� ���
	if (!file_open(&target_file, &target_size, &copy_file, target_dir))
		return 0;

	// 2. <head> �±� �� ���� ó��
	if (!css_head_processing(target_file, target_size, copy_file, &index, css_head)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 3. ������ �κ� ��� ����
	fwrite(&(target_file[index]), 1, target_size - index, copy_file);

	// ���� �ϳ��� ���� ó�� �Ϸ�
	free(target_file);
	fclose(copy_file);
	return 1;
}

int css_converting(char* dir, int num, char* css_head) {
	// �۾��� index.html�� �ִ� �����̸� �����
	char target[200];
	sprintf(target, "%s%s%d%s", dir, "\\", num, "\\");

	// ���� ó�� ����(css ��ũ ����)
	if (!css_processing(target, css_head)) {
		// ������ �߻��ߴٸ�
		printf("%d: Fail\n\n", num);
		// ���� ��ȯ
		return 0;
	}
	else
		printf("%d: Complete\n", num);
}

int get_css_head(char* head) {
	if (head == NULL) {
		printf("parameter is NULL\n");
		return 0;
	}

	FILE *data;
	data = fopen("css_head.txt", "r");

	if (data == NULL) {
		printf("data.txt open fail\n");
		return 0;
	}

	if (fgets(head, 200, data) == NULL) {
		printf("fgets() error\n");
		return 0;
	}

	head[strlen(head)] = 0;

	fclose(data);
	return 1;
}

void css_link_convert() {
	system("cls");

	// ��� �����͵��� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// css ��ũ �տ� ���� ���ڿ� ��������
	char css_head_one[200];
	if (!get_css_head(css_head_one)) {
		system("pause");
		return;
	}

	char html[300] = { 0 };
	char css_head[200];
	int i = START;
	for (; i < END + 1; i++) {

		// html ���� �̸�: �������\\index.html
		sprintf(html, "%s%s%d%s", dir, "\\", i, "\\index.html");

		// ���� �̸� �� �ٸ� css_head ����
		sprintf(css_head, "%s%d%s", css_head_one, i, "/");

		// �ش� html ���Ͽ� ���� ó��
		if (!css_converting(dir, i, css_head)) {
			system("pause");
		}
	}

	// ��� �۾� �Ϸ�
	printf("css_link_convert complete\n");
	system("pause");
}