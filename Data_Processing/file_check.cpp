#include "super_header.h"

// ���� ���� ����
#define SUCCESS		1
// ���� ����
#define NO_INDEX	0
#define EMPTY		2
#define NOT_HTML	3

// tag_checking���� ���� �ε��� ����
#define HTML_S 0
#define HTML_E 1

#define HEAD_S 2
#define HEAD_E 3

#define BODY_S 4
#define BODY_E 5

int file_open_for_check(char **file_p, int *file_size, char *file_name) {
	struct _stat buf;
	int result;

	// Ÿ�� ������ ���� ��������
	result = _stat(file_name, &buf);
	if (result != 0) {
		printf("_stat() error\n");
		return 0;
	}

	// Ÿ�� ���� fopen���� ����
	FILE* fp = fopen(file_name, "rb");
	if (fp == NULL) {
		printf("fopne() error - rb\n");
		return 0;
	}

	// Ÿ�������� ��� �о� ������ �޸� ���� �Ҵ�
	*file_p = (char*)malloc(sizeof(char) * buf.st_size);
	if (*file_p == NULL) {
		printf("malloc() error\n");
		return 0;
	}

	// Ÿ������ ��� �б�
	size_t read_size;
	read_size = fread(*file_p, 1, buf.st_size, fp);
	if (read_size != buf.st_size) {
		printf("fread() error, size: %d, read: %d\n", buf.st_size, read_size);
		free(*file_p);
		fclose(fp);
		return 0;
	}
	*file_size = read_size;

	// Ÿ������ ���������� ��ȯ
	fclose(fp);
	return 1;
}

int tag_checking(char* tag, int tag_len, int *ck) {
	// �±� �̸��� ���۰� �� ã��
	int name_s, name_e;
	if (!tag_name(tag, tag_len, &name_s, &name_e))
		return 0;

	// �̸� ���� ���
	char* name_p = &(tag[name_s]);
	int name_len = name_e - name_s + 1;
	
	// html, head, body ���� Ȯ�� �� ó��
	int pls = 0;
	if (name_len == 4) {
		// �� �±׶�� ���� �±׺��� �ε����� �ϳ� �� ����
		if (tag[name_s - 1] == '/') pls = 1;

		// �� �±� �� ó��
		if (isEqual(0, name_p, "html"))		 ck[HTML_S + pls] = 0;
		else if (isEqual(0, name_p, "head")) ck[HEAD_S + pls] = 0;
		else if (isEqual(0, name_p, "body")) ck[BODY_S + pls] = 0;
	}

	// ���� �Ϸ� �� 1 ��ȯ
	return 1;
}

int html_check(char* file, int size) {
	// html, head, body ����(���۰� �� �ι���) Ȯ��
	int ck[6];
	for (int j = 0; j < 6; j++)
		ck[j] = 1;

	int i;
	int tag_s, tag_e;
	char* tag_p;
	int tag_len;

	// ���� ��ü�� ���� �˻�
	for (i = 0; i < size;) {
		// 1. �±� ã��(<~~~>), ���� �߻��� 0 ��ȯ(������ �̻� ����)
		if (!find_tag(file, size, i, &tag_s, &tag_e))
			return 0;

		// 2. ������ �����ٸ� �ݺ��� ������
		if (tag_e == 0) break;

		// 3. �±׿� ���� ó��
		tag_p = &(file[tag_s]);
		tag_len = tag_e - tag_s + 1;
		if (!tag_checking(tag_p, tag_len, ck))
			return 0;

		// 4. i �� ����
		i = tag_e + 1;
	}

	// ck�� ��� ���ϱ�
	int ck_sum = 0;
	for (i = 0; i < 6; i++)
		ck_sum += ck[i];

	// ck�� ��� ������ �� 0�� �ƴϸ� ����
	if (ck_sum != 0) {
		printf("ck is not 0\n");
		return 0;
	}
	// ck �� 0�̸� �����̴ϱ� 1 ��ȯ
	else return 1;
}

int checking(char* file_name) {
	// 1. ���� ����
	char* file;
	int size;
	if (!file_open_for_check(&file, &size, file_name))
		return NO_INDEX;

	// 2. index.html�� �� �������� Ȯ��
	if (size == 0) return EMPTY;

	// 3. <html> ~ </html> Ȯ��
	if (!html_check(file, size)) return NOT_HTML;

	// ���� Ȯ�� �Ϸ�
	free(file);
	return SUCCESS;
}

int error_recode_for_check(int* no_index, int* empty, int* not_html, int no_idx, int emp, int n_html) {
	FILE* fp;
	fp = fopen("error_list.txt", "w");
	if (fp == NULL) {
		printf("file_open fail\n");
		return 0;
	}

	if (no_idx) {
		fprintf(fp, "NO_Index\n");
		arr_recode(no_index, no_idx, fp);
	}
	if (emp) {
		fprintf(fp, "Empty\n");
		arr_recode(empty, emp, fp);
	}
	if (n_html) {
		fprintf(fp, "Not_HTML\n");
		arr_recode(not_html, n_html, fp);
	}

	fclose(fp);
	return 1;
}

void file_check() {
	system("cls");

	// ��� �����͵��� �����ϴ� ���丮��ġ�� ���Ϸκ��� �б�
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target Dir: %s\n", dir);

	// �۾��� ������ �����̸��� ������ �̸� ���ϱ�
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}
	printf("Data: %d ~ %d\n", start, end);

	// ��� ������ ���� �ݺ��ϸ� �۾�
	int no_index_list[1000];	// ���� ����Ʈ�� ���� �迭��
	int empty_list[1000];
	int not_html_list[1000];
	int no_idx_idx = 0;		// �� �� �迭�鿡 ���� �ε���
	int empty_idx = 0;
	int not_html_idx = 0;

	int i = start;
	int rep = 0;
	int ck;
	char html[300];
	for (; i <= end; i++) {

		// html ���� �̸�: �������\\index.html
		sprintf(html, "%s%s%d%s", dir, "\\", i, "\\index.html");

		// ���� �������� Ȯ��
		ck = checking(html);
		if (ck != SUCCESS) {
			if (ck == NO_INDEX) no_index_list[no_idx_idx++] = i;
			else if (ck == EMPTY) empty_list[empty_idx++] = i;
			else if (ck == NOT_HTML) not_html_list[not_html_idx++] = i;

			// �� �迭�� �ε����� �迭 ũ�⸦ �ʰ��� �� ó��
			if (no_idx_idx == 1000 || empty_idx == 1000 || not_html_idx == 1000) {
				printf("idx overflow\n");
				printf("%d | %d | %d \n", no_idx_idx, empty_idx, not_html_idx);
				system("pause");
				return;
			}
		}

		// 100������ �����Ȳ ���
		rep++;
		if (rep % 100 == 0) {
			printf("[%d] complete\n", rep);
		}
	}

	// ��������Ʈ�� ������ ���Ͽ� ����
	printf("\n=== Error ===\n");
	printf(" No_index: %d \n Empty: %d \n Not_HTML: %d\n\n", no_idx_idx, empty_idx, not_html_idx);
	if (!error_recode_for_check(no_index_list, empty_list, not_html_list, no_idx_idx, empty_idx, not_html_idx)) {
		system("pause");
		return;
	}

	// ��� �۾� �Ϸ�
	printf("file_check complete\n");
	system("pause");
}