#include "super_header.h"

void error_data_move() {
	system("cls");

	// 대상 데이터들이 존재하는 디렉토리위치를 파일로부터 읽기
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target Dir: %s\n", dir);

	// 오류 코드가 있는 파일 읽기
	FILE* fp;
	fp = fopen("error_list.txt", "r");
	if (fp == NULL) {
		printf("fopen fail\n");
		system("pause");
		return;
	}

	// 파일을 한 줄씩 읽기
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

	// 폴더 옮기기
	// 폴더이름 바꾸기
	const char* p_path = "C:\\Users\\cbnm9\\Desktop\\";
	const char* tar_p = "del\\";
	char old_name[300];
	char new_name[300];
	for (int i = 0; i < idx; i++) {
		sprintf(old_name, "%s%s%d", dir, "\\", arr[i]);
		sprintf(new_name, "%s%s%d", p_path, tar_p, arr[i]);

		if (rename(old_name, new_name) == -1) {
			printf("실패\n");
			printf("Old: %s\n", old_name);
			printf("New: %s\n", new_name);
		}
	}

	// 모든 작업 완료
	printf("error_data_move complete\n");
	system("pause");
}