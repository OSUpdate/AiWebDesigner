#include "super_header.h"

int delete_and_rename(char *dir) {
	// index.html 전체 경로 만들기
	char index_html[300] = { 0 };
	sprintf(index_html, "%s%s", dir, "index.html");

	// index.html 삭제
	if (!delete_file(index_html)) {
		printf("remove() error: %s\n", index_html);
		return 0;
	}

	// orgin.html 전체 경로 만들기
	char origin_html[300] = { 0 };
	sprintf(origin_html, "%s%s", dir, "origin_css.html");

	// origin.html을 index.html으로 이름 바꾸기
	if (!rename_file(origin_html, index_html)) {
		printf("Rename failed: %s to %s\n", origin_html, index_html);
		return 0;
	}

	return 1;
}

void roll_back() {
	system("cls");

	// 대상 폴더들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target dir: %s\n", dir);

	// 폴더 시작과 끝 찾기
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}
	printf("Target: %d ~ %d\n", start, end);

	// 모든 폴더에 대해 작업
	char target[200];
	for (int i = start; i <= end; i++) {
		// 작업할 폴더 이름 만들기
		sprintf(target, "%s%s%d%s", dir, "\\", i, "\\");
		
		// 폴더 내 origin.html 되돌리기
		if (!delete_and_rename(target)) {
			system("pause");
			return;
		}
		
		// 100개 작업할 때 마다 출력
		if (i % 100 == 0) {
			printf("[%d] Complete\n", i);
		}
	}

	// 성공적인 마무리
	printf("roll back Complete\n");
	system("pause");
}