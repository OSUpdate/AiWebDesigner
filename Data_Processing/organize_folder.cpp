#include "super_header.h"

// ���� �� ��ȯ�� ��
#define SUCCESS  1

// ���� �� ��ȯ�� ����
#define NO_FILE  2
#define DEL_FAIL 3
#define NO_INDEX 4

int organizing(char *dir) {
	_finddata_t fd;
	long handle;
	int result = 1;
	int ret_val = SUCCESS;
	int no_index = 1;

	// ������ ���� �� ��� .html ã��
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "*.html");
	handle = _findfirst(buf, &fd);

	// ���� �� ������ ���� ��
	if (handle == -1) {
		return NO_FILE;
	}

	// �ݺ��ϸ� ��� ���Ͽ� ���� ����
	char html_file[300] = { 0 };
	while (result != -1) {
		// ���� ������ ��ü ��� �����
		sprintf(html_file, "%s%s%s", dir, "\\", fd.name);

		// index.html�� �ƴ϶�� �����ϱ�
		if (!isEqual(0, fd.name, "index.html")) {
			if (!delete_file(html_file)) {
				printf("remove() error: %s\n", fd.name);
				// �����߻��ϸ� ��ȯ���� ������ �ٲٱ�
				ret_val = DEL_FAIL;
			}
		}
		// index.html �̶�� ���� �������ֱ�(index.html�� ���� ��� Ȯ��)
		else {
			no_index = 0;
		}

		// ���� ���� ����Ű��
		result = _findnext(handle, &fd);
	}

	// ���� index.html�� ���ٸ� ��ȯ �� 0���� �����
	if (no_index) {
		ret_val = NO_INDEX;
	}

	// ������
	_findclose(handle);
	return ret_val;
}

void arr_recode(int* arr, int idx, FILE* fp) {
	int i;
	for (i = 0; i < idx; i++)
		fprintf(fp, "%d\n", arr[i]);
}

int error_recode(int* no_file, int *no_index, int *del_fail, int nf_idx, int ni_idx, int df_idx) {
	FILE* fp;
	fp = fopen("error_list.txt", "w");
	if (fp == NULL) {
		printf("file_open fail\n");
		return 0;
	}

	if (nf_idx) {
		fprintf(fp, "NO_FILE\n");
		arr_recode(no_file, nf_idx, fp);
	}
	if (ni_idx) {
		fprintf(fp, "NO_INDEX\n");
		arr_recode(no_index, ni_idx, fp);
	}
	if (df_idx) {
		fprintf(fp, "DEL_FAIL\n");
		arr_recode(del_fail, df_idx, fp);
	}

	fclose(fp);
	return 1;
}

void organize_folder() {
	system("cls");

	// ��� �������� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// �۾��� ������ �����̸��� ������ �̸� ���ϱ�
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}

	// ��� ������ ���� ���� ���� ����
	char target[200];			// ������ ������ �̸��� ���� �迭
	int del_fail_list[1000];	// ���� ����Ʈ�� ���� �迭��
	int no_index_list[1000];
	int no_file_list[1000];
	int del_fail_idx = 0;		// �� �� �迭�鿡 ���� �ε���
	int no_index_idx = 0;
	int no_file_idx = 0;
	int code;
	for (int i = start; i < end + 1; i++) {
		// ������ ���� �̸� �����
		sprintf(target, "%s%s%d%s", dir, "\\", i, "\\");
		
		// ���� ����
		code = organizing(target);

		// ���� �߻��� error list�� �߰�
		if (code != SUCCESS) {
			if (code == NO_FILE) no_file_list[no_file_idx++] = i;
			else if (code == NO_INDEX) no_index_list[no_index_idx++] = i;
			else if (code == DEL_FAIL) del_fail_list[del_fail_idx++] = i;

			// �� �迭�� �ε����� �迭 ũ�⸦ �ʰ��� �� ó��
			if (no_file_idx == 1000 || no_index_idx == 1000 || del_fail_idx == 1000) {
				printf("idx overflow\n");
				printf("%d | %d | %d \n", no_file_idx, no_index_idx, del_fail_idx);
				system("pause");
				return;
			}
		}

		// 100���� �������� �󸶳� ��������� ǥ��
		if (i % 100 == 0) {
			printf("[%d / %d] complete\n", i, end);
		}			
	}

	// ��������Ʈ�� ������ ���Ͽ� ����
	if (!error_recode(no_file_list, no_index_list, del_fail_list, no_file_idx, no_index_idx, del_fail_idx)) {
		system("pause");
		return;
	}

	// �������� ������
	printf("organizing Complete\n");
	system("pause");
}