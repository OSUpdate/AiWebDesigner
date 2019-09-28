#include "super_header.h"

int delete_and_rename(char *dir) {
	// index.html ��ü ��� �����
	char index_html[300] = { 0 };
	sprintf(index_html, "%s%s", dir, "index.html");

	// index.html ����
	if (!delete_file(index_html)) {
		printf("remove() error: %s\n", index_html);
		return 0;
	}

	// orgin.html ��ü ��� �����
	char origin_html[300] = { 0 };
	sprintf(origin_html, "%s%s", dir, "origin_css.html");

	// origin.html�� index.html���� �̸� �ٲٱ�
	if (!rename_file(origin_html, index_html)) {
		printf("Rename failed: %s to %s\n", origin_html, index_html);
		return 0;
	}

	return 1;
}

void roll_back() {
	system("cls");

	// ��� �������� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target dir: %s\n", dir);

	// ���� ���۰� �� ã��
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}
	printf("Target: %d ~ %d\n", start, end);

	// ��� ������ ���� �۾�
	char target[200];
	for (int i = start; i <= end; i++) {
		// �۾��� ���� �̸� �����
		sprintf(target, "%s%s%d%s", dir, "\\", i, "\\");
		
		// ���� �� origin.html �ǵ�����
		if (!delete_and_rename(target)) {
			system("pause");
			return;
		}
		
		// 100�� �۾��� �� ���� ���
		if (i % 100 == 0) {
			printf("[%d] Complete\n", i);
		}
	}

	// �������� ������
	printf("roll back Complete\n");
	system("pause");
}