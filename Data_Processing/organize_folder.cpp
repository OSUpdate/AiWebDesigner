#include "super_header.h"

// 작업 할 html 처음과 마지막 폴더 이름
#define START 1
#define END   342

int organizing(char *dir) {
	_finddata_t fd;
	long handle;
	int result = 1;
	int ret_val = 1;

	// 지정한 폴더 내 모든 .html 찾기
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "*.html");
	handle = _findfirst(buf, &fd);

	// 폴더 내 파일이 없을 때
	if (handle == -1)
	{
		printf("%s: There were no files\n", buf);
		return 0;
	}

	// 반복하며 모든 파일에 대해 수행
	char html_file[300] = { 0 };
	while (result != -1)
	{
		// 현재 파일의 전체 경로 만들기
		sprintf(html_file, "%s%s%s", dir, "\\", fd.name);

		// index.html이 아니라면 삭제하기
		if (!isEqual(0, fd.name, "index.html")) {
			if (!delete_file(html_file)) {
				printf("remove() error: %s\n", fd.name);
				// 오류발생하면 반환값을 0으로 바꾸기
				ret_val = 0;
			}
		}

		// 다음 파일 가리키기
		result = _findnext(handle, &fd);
	}

	// 마무리
	_findclose(handle);
	return ret_val;
}

void organize_folder() {
	system("cls");

	// 대상 폴더들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// 모든 폴더에 대해 폴더 내부 정리
	char target[200];
	for (int i = START; i < END + 1; i++) {
		// 정리할 폴더 이름 만들기
		sprintf(target, "%s%s%d%s", dir, "\\", i, "\\");
		// 폴더 정리
		if (!organizing(target)) {
			system("pause");
		}
		else
			printf("%d: complete\n", i);
	}

	// 성공적인 마무리
	printf("organizing Complete\n");
	system("pause");
}