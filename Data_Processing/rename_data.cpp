#include "super_header.h"

void rename_data() {
	system("cls");

	_finddata_t fd;
	long handle;
	int result = 1;

	// 대상 데이터들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// rename 할때 시작할 숫자 지정
	int num = get_first_file_name();
	if (!num) {
		system("pause");
		return;
	}

	// 지정한 폴더 내 모든 폴더 찾기
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "\\*");
	handle = _findfirst(buf, &fd);

	// 폴더 내 파일이 없을 때
	if (handle == -1)
	{
		printf("%s: There were no files\n", buf);
		system("pause");
		return;
	}

	// 반복하며 모든 파일에 대해 수행
	char old_name[300] = { 0 };
	char new_name[300] = { 0 };
	int ck = 1;
	int count = 2;
	while (result != -1)
	{
		// . 과 .. 은 무시하기
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

		// 현재 폴더의 이름과, 새로 지정할 이름 만들기
		sprintf(old_name, "%s%s%s", dir, "\\", fd.name);
		sprintf(new_name, "%s%s%d", dir, "\\", num);
		
		// 이름 바꾸기
		if (ck) {
			if (!rename_file(old_name, new_name)) {
				printf("Rename failed: %s to %s\n", old_name, new_name);
			}
			num++;
		}
		
		// 다음 파일 가리키기
		result = _findnext(handle, &fd);
	}

	// 마지막으로 rename한 파일의 이름 +1을 data.txt에 기록
	if (!write_last_file_name(num)) {
		system("pause");
		return;
	}

	// 성공적인 마무리
	printf("Rename Complete\n");
	system("pause");
	_findclose(handle);
}