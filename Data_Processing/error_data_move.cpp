#include "super_header.h"

void error_data_move() {
	system("cls");

	// ��� �����͵��� �����ϴ� ���丮��ġ�� ���Ϸκ��� �б�
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target Dir: %s\n", dir);

	// ���� �ڵ尡 �ִ� ���� �б�
	FILE* fp;
	fp = fopen("error_list.txt", "r");
	if (fp == NULL) {
		printf("fopen fail\n");
		system("pause");
		return;
	}

	// ������ �� �پ� �б�
	char buf[10];
	int no;
	int arr[2000];
	int idx = 0;
	while (!feof(fp)) {
		fgets(buf, 10, fp);
		no = atoi(buf);
		if (no != 0) {
			arr[idx++] = no;
		}
	}
	idx--;
	fclose(fp);

	// ���� �ű��
	// �����̸� �ٲٱ�
	const char* p_path = "C:\\Users\\cbnm9\\Desktop\\";
	const char* tar_p = "del\\";
	char old_name[300];
	char new_name[300];
	for (int i = 0; i < idx; i++) {
		sprintf(old_name, "%s%s%d", dir, "\\", arr[i]);
		sprintf(new_name, "%s%s%d", p_path, tar_p, arr[i]);

		if (rename(old_name, new_name) == -1) {
			printf("����\n");
			printf("Old: %s\n", old_name);
			printf("New: %s\n", new_name);
		}
	}

	// ��� �۾� �Ϸ�
	printf("error_data_move complete\n");
	system("pause");
}