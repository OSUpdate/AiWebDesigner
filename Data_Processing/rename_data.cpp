#include "super_header.h"

int get_fname_list(char **fname, char* dir, int *idx) {
	_finddata_t fd;
	long handle;
	int result = 1;

	// 지정한 폴더 내 모든 폴더 찾기
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "\\*");
	handle = _findfirst(buf, &fd);

	// 폴더 내 파일이 없을 때
	if (handle == -1) {
		printf("%s: There were no files\n", dir);
		return 0;
	}

	// 반복하며 모든 파일에 대해 수행
	char old_name[300] = { 0 };
	char new_name[300] = { 0 };
	int ck = 1;
	int count = 2;
	while (1) {
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

		// 폴더 이름 리스트에 저장하기
		if (ck) {
			sprintf(fname[*idx], "%s%s%s", dir, "\\", fd.name);
			*idx = *idx + 1;
		}

		// 다음 파일 가리키기, 파일이 더 없다면 나가기
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
	
	// 대상 데이터들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// 대상 디렉토리들의 이름을 저장할 메모리 공간 할당받기
	int height = 3000, width = 260;
	char** fnames;
	if (!malloc_2d(&fnames, height, width)) {
		system("pause");
		return;
	}

	// 디렉토리의 대상 폴더의 이름 리스트 가져오기
	int index = 0;
	if (!get_fname_list(fnames, dir, &index)) {
		system("pause");
		return;
	}

	// rename 할때 시작할 숫자 지정
	int num = get_first_file_name();
	if (!num) {
		system("pause");
		return;
	}

	// 모든 폴더에 대해 반복하며 이름 바꾸기
	char new_name[300] = { 0 };
	int rep = 0;
	for (int i = 0; i < index; i++) {
		// 새로 지정할 이름 만들기
		sprintf(new_name, "%s%s%d", dir, "\\", num);

		// 이름 바꾸기
		if (!rename_file(fnames[i], new_name)) {
			printf("Rename failed: %s to %s\n", fnames[i], new_name);
		}
		num++;
		
		// 100번 반복마다 얼마나 처리했는지 표시
		rep++;
		if (rep % 100 == 0) {
			printf("[%d] Complete\n", rep);
		}
	}
	
	// 마지막으로 rename한 파일의 이름 +1을 data.txt에 기록
	if (!write_last_file_name(num)) {
		system("pause");
		return;
	}

	// 동적할당 받은 거 해제
	free(fnames[0]);
	free(fnames);

	// 성공적인 마무리
	printf("Rename Complete: %d\n", rep);
	system("pause");
}