#include "super_header.h"

int dumy_func_for_css(char** target_file, int* target_size, int tag_start, int tag_end, int* point, char* css_head) {
	*point = tag_end + 1;
	return 1;
}

int link_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head) {
	// css_head �� ���� ����ϱ�
	int css_len = strlen(css_head);

	// Ư���� �� ���� �ٷ� ��ȯ�� ��� ������ ����Ʈ�� �� ����
	*point = tag_end + 1;

	// �±׿� �� ���� ����
	char *tag = &((*target_file)[tag_start]);
	int tag_len = tag_end - tag_start + 1;

	// link �±��� href="~~" �κ��� ~~ ã��
	int start_point, end_point;
	int in_href = find_href_position(tag, tag_len, &start_point, &end_point);

	// href �Ӽ��� ���� �� �Լ� ��ȯ, �� ��� ������ �ƴ�
	if (!in_href) {
		return 1;
	}

	// href �Ӽ��� ���� http:// �Ǵ� https:// �� ��� �״�� �α�(�Լ� ��ȯ)
	char *val = &(tag[start_point]);
	if (val[0] == 'h') {
		if (isEqual(0, val, "http://"))
			return 1;
		if (isEqual(0, val, "https://"))
			return 1;
	}

	// href �Ӽ��� �� �տ� css_head �ٿ��ֱ�
	int rs;
	int conv_s = start_point + tag_start;
	if (!string_convert(target_file, target_size, conv_s, conv_s - 1, css_head, css_len, &rs)) {
		printf("link_processing string_convert error\n");
		return 0;
	}

	// ����Ʈ ���� �� ��ȯ
	*point = tag_end + rs + 1;
	return 1;
}

int style_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head) {	
	// css_head �� ���� ����ϱ�
	int css_len = strlen(css_head);
	
	// Ư���� �� ���� �ٷ� ��ȯ�� ��� ������ ����Ʈ�� �� ����
	*point = tag_end + 1;

	// string_convert�� �Ű������� �����ϱ� ���� ����
	int rs;

	// </style> ���� import �� �ִ��� ã�Ƴ� ó���ϱ�
	int i;
	int ck_v;
	for (i = tag_end + 1; i < *target_size; i++) {
		// 1. </style> �϶� �ݺ��� ������
		if ((*target_file)[i] == '<') {
			i++;
			if ((*target_file)[i] == '/') {
				i++;
				if ((*target_file)[i] == 's') {
					if (isEqual(i, *target_file, "style"))
						break;
				}
			}
		}
		// 2. @ �϶� import ���� Ȯ���ϰ� ó���ϱ�
		else if ((*target_file)[i] == '@') {
			i++;
			if ((*target_file)[i] == 'i') {
				// import �� ��
				if (isEqual(i, *target_file, "import")) {
					// i�� u �Ǵ� "�� ����Ŵ
					i += 7;

					// u �϶�
					if ((*target_file)[i] == 'u') {
						// i�� '(' ������ ����Ŵ
						i += 4;
						// '(' �������� ���ϱ�
						char c = (*target_file)[i];

						// c�� ���� ���ڰ� �ƴϸ� i�� �ϳ� ������Ű��
						// �׷��� i�� ù ��° ���� ��ġ�� ����Ŵ
						if (!isChar(c))
							i++;
					}
					// " �϶�
					else {
						// i ������Ű�� ù ��° ���� ����Ŵ
						i++;
					}

					// import�� ���� http:// �Ǵ� https:// �� ���� ���ܽ�Ű��
					ck_v = 1;
					if ((*target_file)[i] == 'h') {
						if (isEqual(i, *target_file, "http://"))
							ck_v = 0;
						if (isEqual(i, *target_file, "https://"))
							ck_v = 0;
					}

					// �� ��찡 �ƴ϶�� " ������ġ�� css ��� �ֱ�
					if (ck_v) {
						if (!string_convert(target_file, target_size, i, i - 1, css_head, css_len, &rs)) {
							printf("style_processing string_convert error\n");
							return 0;
						}
					}

					// i �ٽ� ����: ';' ������ ����Ű��
					for (i + rs; i < *target_size; i++)
						if ((*target_file)[i] == ';') break;
					i++;
				}
			}
		}
	}

	// ���� �ݺ����� ������ �� i + 6 �� </style> ������ ����Ŵ
	*point = i + 6;

	// ������� ������ �����ٸ� 1 ��ȯ
	return 1;
}

int(*css_tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*, char *) {
	// �±� �̸��� ���� ��������
	int name_s, name_e;
	if (!tag_name(tag, tag_len, &name_s, &name_e))
		return NULL;

	// �̸� ���� ���
	int name_len = name_e - name_s + 1;

	// �±� �̸��� �������� ����
	char *tag_name = &(tag[name_s]);

	// �±� �̸� �� ó���� �Լ� ��ȯ�ϱ�
	if (name_len == 4) {
		if (isEqual(0, tag_name, "link"))
			return link_processing;
	}
	else if (name_len == 5) {
		if (isEqual(0, tag_name, "style"))
			return style_processing;
	}

	return dumy_func_for_css;
}

int css_tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head) {
	// �±��� ������ġ
	char *tag_p;
	// �±��� ����
	int tag_len;
	// �±��� ������ ����� �Լ�
	int(*tag_func) (char**, int*, int, int, int*, char*);

	// �±��� ������ġ�� �±��� ���� ����
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// �±� ���� �� ����� �Լ� ��������
	tag_func = css_tag_check(tag_p, tag_len);

	// �Լ��� NULL �̶�� �ƹ� ó�� ���� �Ѿ�� ��
	if (tag_func == NULL) {
		// �� �� point �� �±��� ������ �ٷ� �ڸ� ����Ŵ
		*point = tag_end + 1;
		return 1;
	}

	// �±� ���� �� �Լ� ȣ���ϱ�
	if (!tag_func(target_file, target_size, tag_start, tag_end, point, css_head))
		return 0;

	// �� �Լ��� �������� ������ 1 ��ȯ
	return 1;
}

int css_head_processing(char **target_file, int *target_size, FILE *copy_file, char *css_head) {
	// �ݺ�����, ����Ȯ�� ����
	int i, ck;
	
	// target_file���� �±��� ���۰� �� �ε���
	int tag_start, tag_end;

	// Ÿ������ ��� �� ���� �� ���� �ݺ�
	for (i = 0; i < *target_size;) {
		// �±� ã��, ������ ��� �о��ٸ� is_end�� 0�� �����
		if (!find_tag(*target_file, *target_size, i, &tag_start, &tag_end))
			return 0;

		// ������ �����ٸ� �ݺ��� ������
		if (tag_end == 0) break;

		// �±׿� ���� ó���ϱ�
		if (!css_tag_processing(target_file, target_size, tag_start, tag_end, &i, css_head)) {
			return 0;
		}
	}

	return 1;
}

int css_processing(char *target_dir, char* css_head) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	// 1. ���� ����(��� ����, ������ ����), file_convert.h �� �Լ� �״�� ���
	if (!file_open(&target_file, &target_size, &copy_file, target_dir, "origin_css.html"))
		return 0;

	// 2. css ���� �±� �� ���� ó��
	if (!css_head_processing(&target_file, &target_size, copy_file, css_head)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 3. copy_file�� target_file ����
	fwrite(target_file, sizeof(char), target_size, copy_file);

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
	
	// 100���� ���� ó������ �󸶳� ó���ߴ��� ���
	if (num % 100 == 0) {
		printf("[%d] Complete\n", num);
	}

	return 1;
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
	printf("Target dir: %s\n", dir);

	// css ��ũ �տ� ���� ���ڿ� ��������
	char css_head_one[200];
	if (!get_css_head(css_head_one)) {
		system("pause");
		return;
	}
	printf("css head: %s\n", css_head_one);

	// �۾��� ������ �����̸��� ������ �̸� ���ϱ�
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}
	printf("Target: %d ~ %d\n", start, end);

	// ��� ������ ���� �ݺ��ϸ� �۾�
	int error_list[2000];
	int error_idx = 0;
	char css_head[200];
	int i = start;
	for (; i < end + 1; i++) {
		// ���� �̸� �� �ٸ� css_head ����
		sprintf(css_head, "%s%d%s", css_head_one, i, "/");

		// �ش� html ���Ͽ� ���� ó��
		if (!css_converting(dir, i, css_head)) {
			error_list[error_idx++] = i;
		}
	}

	// ������ �߻��� ����Ʈ ���Ͽ� ����
	if (!error_recode_for_convert(error_list, error_idx))
		system("pause");

	// ���� ���� ���
	printf("Error: %d\n", error_idx);

	// ��� �۾� �Ϸ�
	printf("css_link_convert complete\n");
	system("pause");
}