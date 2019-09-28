#include "super_header.h"

int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir, const char* origin_name) {
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
	sprintf(temp, "%s%s", target_dir, origin_name);
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

	return 1;
}

int dumy_func(char** target_file, int* target_size, int tag_start, int tag_end, int* point) {
	*point = tag_end + 1;
	return 1;
}

int (*tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*) {
	// �±� �̸��� ���� ��������
	int name_s, name_e;
	if (!tag_name(tag, tag_len, &name_s, &name_e)) {
		printf("Tag has no name\n");
		return NULL;
	}

	// �±� �̸��� �������� ����
	char* tag_name_p = &(tag[name_s]);
	// �±��� �̸� ���� ���
	int name_len = name_e - name_s + 1;

	// �±װ� '/'�� �����ϴ� �� �±װ� �ƴ� ��츸 ����
	if (tag[name_s - 1] != '/') {
		// �±� �̸� �� ó���� �Լ� ��ȯ�ϱ�
		if (name_len == 3) {
			if (isEqual(0, tag_name_p, "div"))
				return div_section_processing;
		}
		else if (name_len == 7) {
			if (isEqual(0, tag_name_p, "section"))
				return div_section_processing;
		}
		else if (name_len == 8) {
			if (isEqual(0, tag_name_p, "noscript"))
				return noscripts_processing;
		}
		else if (name_len == 1) {
			if (isEqual(0, tag_name_p, "a"))
				return a_processing;
		}
	}
	// '/'�� �����ϴ� �±��� ��, "noscript"������ Ȯ��
	else {
		if (name_len == 8) {
			if (isEqual(0, tag_name_p, "noscript"))
				return noscripts_processing;
		}
	}

	// �ش� �±׿� ���� ó���� ������ ���ٸ� dumy_func ��ȯ
	return dumy_func;
}

int check_load_class(char *tag, int len) {
	// ���� �� ù �ܾ�� �Ӽ��̰�, �� �Ӽ��� class �϶� �� Ȯ��
	// div �� ��� i=4 �� �� ���� �����̱� ������ i=4 �� ����
	int i, count;
	int attr_p;
	int val_s = 0;
	int val_e = 0;
	int find_class = 0;
	for (i = 4; i < len; i++) {
		// ���� ã��
		if (tag[i] == ' ') {
			// �����̸� i ����, �̶� i�� �Ӽ��̸��� ��ġ�� ����Ŵ
			i++;
			attr_p = i;
			
			// �� ��° " ã��
			count = 1;
			for (; i < len; i++) {
				// " �� ã�Ҵٸ�
				if (tag[i] == '"') {
					// �� ��°�� �� �ݺ��� ������
					if (count == 0) {
						break;
					}
					// ù ������ �� count ���ҽ�Ű��
					else {
						count--;
						// �̶� val_s�� ���� ���� ��ġ�� ����Ŵ
						val_s = i + 1;
					}
				}
			}
			val_e = i - 1;

			// �Ӽ��� class ���� Ȯ��
			if (tag[attr_p] == 'c') {
				if (isEqual(attr_p, tag, "class")) {
					// �Ӽ��� class ��� �ݺ��� Ż��
					find_class = 1;
					break;
				}
			}
		}
	}

	// class �Ӽ��� ���� ���
	if (find_class) {
		// �Ӽ��� �� ���� ���ϱ�
		int val_len = val_e - val_s + 1;
		
		// ���� �Ӽ��� ���� 6���ں��� ������ 0 ��ȯ
		if (val_len < 6) return 0;

		// 1. ���� loader �� �������� Ȯ��
		if (val_len >= 6) {
			if (isEqual(val_e - 5, tag, "loader"))
				return 1;
		}

		// 2. ���� loading ���� �������� Ȯ��
		if (val_len >= 7) {
			if (isEqual(val_e - 6, tag, "loading"))
				return 1;
		}
	}

	// ������� ������ load ���� �±װ� �ƴѰ�
	return 0;
}

int find_end_point(char *target_file, int target_size, int start, char *t_name, int t_len) {
	int i;
	int count = 0;
	for (i = start; i < target_size; i++) {
		// ���� < ã��
		if (target_file[i] == '<') {
			i++;
			// 1. ���� �±װ� ���Դٸ� ī��Ʈ �÷��ֱ�
			if (target_file[i] == t_name[0]) {
				if (t_len == 3) {
					if (isEqual(i, target_file, "div"))
						count++;
				}
				else {
					if (isEqual(i, target_file, "section"))
						count++;
				}
			}
			// 2. / ��ȣ�� ���Դٸ�
			else if (target_file[i] == '/') {
				i++;
				if (t_len == 3) {
					if (isEqual(i, target_file, "div")) {
						// ī��Ʈ�� �ִٸ� ���ҽ����ֱ�
						if (count) count--;
						else break;
					}
				}
				else {
					if (isEqual(i, target_file, "section")) {
						// ī��Ʈ�� �ִٸ� ���ҽ����ֱ�
						if (count) count--;
						else break;
					}
				}
			}
		}
	}

	// �� �ݺ����� Ż������ �� i + t_len �� > ��ġ�� ����Ŵ
	return i + t_len;
}

int div_section_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	// �±��� ������ġ�� �±��� ���� ����
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// class �Ӽ��� �ְ�, load �������� Ȯ��, �ƴ϶�� �Լ� ��ȯ�ϱ�
	if (!check_load_class(tag_p, tag_len)) {
		*point = tag_end + 1;
		return 1;
	}

	// ������ ��ȯ���� �ʾҴٸ� load ���� �±��� ��
	// ���� �±��� �̸� ã��(div ���� section ����)
	int name_s, name_e;
	if (!tag_name(tag_p, tag_len, &name_s, &name_e))
		return 0;

	// �̸��� ���� ���ϱ�
	int name_len = name_e - name_s + 1;

	// �� ���� </div> �Ǵ� </section> ��ġ ã��
	int end_point = find_end_point(*target_file, *target_size, tag_end + 1, &(tag_p[name_s]), name_len);

	// ���� end_point �� target_size - 1 �� �Ѿ�ٸ� ������ �߻��Ѱ�!
	if (end_point >= *target_size - 1) {
		printf("div_section_processing() error, end_point > target_size\n");
		return 0;
	}

	// <div, section> ���� </div, section> ���� �����
	int rs;
	if (!string_convert(target_file, target_size, tag_start, end_point, NULL, 0, &rs)) {
		printf("div_section_processing, string_convert() error\n");
		return 0;
	}

	// �������� �����ٸ� ����Ʈ ó�� �� 1 ��ȯ
	*point = tag_start;
	return 1;
}

int noscripts_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	// �±��� ������ġ�� �±��� ���� ����
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// �±� �̸� ��������
	int name_s, name_e;
	if (!tag_name(tag_p, tag_len, &name_s, &name_e))
		return 0;

	// �±� �̸� ���� ���
	int name_len = name_e - name_s + 1;

	// noscript ���� no �� ����� -> name_s ���� name_s + 1 ����
	int rs;
	int pos = tag_start + name_s;
	if (!string_convert(target_file, target_size, pos, pos + 1, NULL, 0, &rs)) {
		printf("noscripts_processing, string_convert() error\n");
		return 0;
	}

	// �� �Լ��� ���� ���� ������ٸ� ����Ʈ ó�� �� 1 ��ȯ
	*point = tag_end + rs + 1;
	return 1;
}

int find_href_position(char *tag, int len, int *start, int *end) {
	// link �±��� href="~~" �κ��� ~~ ã��
	int i;
	for (i = 0; i < len; i++) {
		// ���� h ���ڸ� ã�Ҵٸ�
		if (tag[i] == 'h') {
			// �� href �Ӽ��̶��
			if (isEqual(i, tag, "href")) {
				i += 6;
				*start = i;
				for (; i < len; i++) {
					if (tag[i] == '"') break;
				}
				*end = i - 1;
				return 1;
			}
		}
	}

	// href �Ӽ��� ���ٸ� 0 ��ȯ
	return 0;
}

int a_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	// �±��� ������ġ�� �±��� ���� ����
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// a �±��� href="~~" �κ��� ~~ ã��
	int in_href, start_point, end_point;
	in_href = find_href_position(tag_p, tag_len, &start_point, &end_point);

	// ���� "" �̰ų� "#" �̶�� in_href�� 0���� �ٲ��ֱ�(1���ڶ�� #�ΰɷ� ����)
	if (start_point >= end_point) in_href = 0;

	// href �Ӽ��� ���� �� �׳� ������, �� ���� ������ �ƴ�
	if (!in_href) {
		*point = tag_end + 1;
		return 1;
	}

	// ~~ �κ��� #���� �ٲ��ֱ�
	int conv_s = start_point + tag_start;
	int conv_e = end_point + tag_start;
	int rs;
	if (!string_convert(target_file, target_size, conv_s, conv_e, "#", 1, &rs)) {
		printf("a_processing, string_convert() error\n");
		return 0;
	}

	// ������ �����ٸ� ����Ʈ ó�� �� 1 ��ȯ
	// ����Ʈ�� �±� �������� �� ��ġ�� ����Ŵ
	// rs�� ����ϰ�� �þ ����, �����ϰ�� �پ�� ����, ���⼱ �پ�� ����
	*point = tag_end + rs + 1;

	return 1;
}

int tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	
	// �±��� ������ ����� �Լ�
	int (*tag_func) (char**, int*, int, int, int*);
	
	// �±��� ������ġ�� �±��� ���� ����
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// �±� ���� �� ����� �Լ� ��������
	tag_func = tag_check(tag_p, tag_len);

	// �Լ��� NULL �̶�� ��������
	if (tag_func == NULL)
		return 0;

	// �±� ���� �� �Լ� ȣ���ϱ�
	if (!tag_func(target_file, target_size, tag_start, tag_end, point))
		return 0;

	// �� �Լ��� �������� ������ 1 ��ȯ
	return 1;
}

int file_processing(char **target_file, int *target_size) {
	// �ݺ�����, ����Ȯ�� ����
	int i, ck;

	// target_file���� �±��� ���۰� �� �ε���
	int tag_start, tag_end;
	

	// Ÿ������ ��� �� ���� �� ���� �ݺ�
	for (i = 0; i < *target_size;) {
		// �±� ã��, ������ ��� �о��ٸ� tag_end�� 0�� �����
		if (!find_tag(*target_file, *target_size, i, &tag_start, &tag_end))
			return 0;

		// ������ �����ٸ� �ݺ��� ������
		if (tag_end == 0) break;

		// �±׿� ���� ó���ϱ�
		if (!tag_processing(target_file, target_size, tag_start, tag_end, &i)) {
			return 0;
		}
	}
		
	return 1;
}

int processing(char *target_dir) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	// 1. ���� ����(��� ����, ������ ����)
	if (!file_open(&target_file, &target_size, &copy_file, target_dir, "origin_convert.html"))
		return 0;

	// 2. ���Ͽ� ���� ó�� �۾�
	if (!file_processing(&target_file, &target_size)) {
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

int converting(char* dir, int num) {
	// �۾��� index.html�� �ִ� �����̸� �����
	char target[200];
	sprintf(target, "%s%s%d%s", dir, "\\", num, "\\");

	// ���� ���� ���� ó�� ����
	if (!processing(target)) {
		// ������ �߻��ߴٸ�
		printf("%d: Fail\n\n", num);
		// ���� ��ȯ
		return 0;
	}
	
	// 100�� ó���� �� ���� ȭ�鿡 ���
	if (num % 100 == 0) {
		printf("[%d] Complete\n", num);
	}

	// ���� ���� �Ǿ��ٸ� 1 ��ȯ
	return 1;
}

int error_recode_for_convert(int *list, int idx) {
	FILE* fp;
	fp = fopen("error_list.txt", "w");
	if (fp == NULL) {
		printf("file_open fail\n");
		return 0;
	}

	if (idx) {
		arr_recode(list, idx, fp);
	}

	fclose(fp);
	return 1;
}

void file_convert() {
	system("cls");

	// ��� �����͵��� �����ϴ� ���丮��ġ�� ���Ϸκ��� �б�
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target dir: %s\n", dir);

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
	int i = start;
	for (; i <= end; i++) {
		// �ش� html ���Ͽ� ���� ó��
		if (!converting(dir, i)) {
			error_list[error_idx++] = i;
		}
	}

	// ������ �߻��� ����Ʈ ���Ͽ� ����
	if (!error_recode_for_convert(error_list, error_idx))
		system("pause");
	
	// ���� ���� ���
	printf("Error: %d\n", error_idx);

	// ��� �۾� �Ϸ�
	printf("file_convert complete\n");
	system("pause");
}
