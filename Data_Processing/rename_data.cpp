#include "super_header.h"

int get_fname_list(char **fname, char* dir, int *idx) {
	_finddata_t fd;
	long handle;
	int result = 1;

	// ������ ���� �� ��� ���� ã��
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "\\*");
	handle = _findfirst(buf, &fd);

	// ���� �� ������ ���� ��
	if (handle == -1) {
		printf("%s: There were no files\n", dir);
		return 0;
	}

	// �ݺ��ϸ� ��� ���Ͽ� ���� ����
	char old_name[300] = { 0 };
	char new_name[300] = { 0 };
	int ck = 1;
	int count = 2;
	while (1) {
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

		// ���� �̸� ����Ʈ�� �����ϱ�
		if (ck) {
			sprintf(fname[*idx], "%s%s%s", dir, "\\", fd.name);
			*idx = *idx + 1;
		}

		// ���� ���� ����Ű��, ������ �� ���ٸ� ������
		result = _findnext(handle, &fd);
		if (result == -1) break;
	}

	_findclose(handle);
	return 1;
}

int malloc_2d(char ***fnames_p, int height, int width) {
	char **fnames = (char**)malloc(sizeof(char*) * height);
	if (fnames == NULL) {
		printf("fnames malloc error\n");
		return 0;
	}
	fnames[0] = (char*)malloc(sizeof(char) * width * height);
	if (fnames[0] == NULL) {
		printf("fnames[0] malloc error\n");
		return 0;
	}
	for (int i = 1; i < height; i++)
		fnames[i] = fnames[i - 1] + width;

	*fnames_p = fnames;

	return 1;
}

void rename_data() {
	system("cls");
	
	// ��� �����͵��� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// ��� ���丮���� �̸��� ������ �޸� ���� �Ҵ�ޱ�
	int height = 3000, width = 260;
	char** fnames;
	if (!malloc_2d(&fnames, height, width)) {
		system("pause");
		return;
	}

	// ���丮�� ��� ������ �̸� ����Ʈ ��������
	int index = 0;
	if (!get_fname_list(fnames, dir, &index)) {
		system("pause");
		return;
	}

	// rename �Ҷ� ������ ���� ����
	int num = get_first_file_name();
	if (!num) {
		system("pause");
		return;
	}

	// ��� ������ ���� �ݺ��ϸ� �̸� �ٲٱ�
	char new_name[300] = { 0 };
	int rep = 0;
	for (int i = 0; i < index; i++) {
		// ���� ������ �̸� �����
		sprintf(new_name, "%s%s%d", dir, "\\", num);

		// �̸� �ٲٱ�
		if (!rename_file(fnames[i], new_name)) {
			printf("Rename failed: %s to %s\n", fnames[i], new_name);
		}
		num++;
		
		// 100�� �ݺ����� �󸶳� ó���ߴ��� ǥ��
		rep++;
		if (rep % 100 == 0) {
			printf("[%d] Complete\n", rep);
		}
	}
	
	// ���������� rename�� ������ �̸� +1�� data.txt�� ���
	if (!write_last_file_name(num)) {
		system("pause");
		return;
	}

	// �����Ҵ� ���� �� ����
	free(fnames[0]);
	free(fnames);

	// �������� ������
	printf("Rename Complete: %d\n", rep);
	system("pause");
}