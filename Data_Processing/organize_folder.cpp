#include "super_header.h"

// 성공 시 반환할 값
#define SUCCESS  1

// 오류 시 반환할 값들
#define NO_FILE  2
#define DEL_FAIL 3
#define NO_INDEX 4

int organizing(char *dir) {
	_finddata_t fd;
	long handle;
	int result = 1;
	int ret_val = SUCCESS;
	int no_index = 1;

	// 지정한 폴더 내 모든 .html 찾기
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "*.html");
	handle = _findfirst(buf, &fd);

	// 폴더 내 파일이 없을 때
	if (handle == -1) {
		return NO_FILE;
	}

	// 반복하며 모든 파일에 대해 수행
	char html_file[300] = { 0 };
	while (result != -1) {
		// 현재 파일의 전체 경로 만들기
		sprintf(html_file, "%s%s%s", dir, "\\", fd.name);

		// index.html이 아니라면 삭제하기
		if (!isEqual(0, fd.name, "index.html")) {
			if (!delete_file(html_file)) {
				printf("remove() error: %s\n", fd.name);
				// 오류발생하면 반환값을 오류로 바꾸기
				ret_val = DEL_FAIL;
			}
		}
		// index.html 이라면 변수 설정해주기(index.html이 없는 경우 확인)
		else {
			no_index = 0;
		}

		// 다음 파일 가리키기
		result = _findnext(handle, &fd);
	}

	// 만약 index.html이 없다면 반환 값 0으로 만들기
	if (no_index) {
		ret_val = NO_INDEX;
	}

	// 마무리
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

	// 대상 폴더들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// 작업할 폴더의 시작이름과 마지막 이름 구하기
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}

	// 모든 폴더에 대해 폴더 내부 정리
	char target[200];			// 정리할 폴더의 이름을 위한 배열
	int del_fail_list[1000];	// 오류 리스트를 담을 배열들
	int no_index_list[1000];
	int no_file_list[1000];
	int del_fail_idx = 0;		// 위 각 배열들에 대한 인덱스
	int no_index_idx = 0;
	int no_file_idx = 0;
	int code;
	for (int i = start; i < end + 1; i++) {
		// 정리할 폴더 이름 만들기
		sprintf(target, "%s%s%d%s", dir, "\\", i, "\\");
		
		// 폴더 정리
		code = organizing(target);

		// 오류 발생시 error list에 추가
		if (code != SUCCESS) {
			if (code == NO_FILE) no_file_list[no_file_idx++] = i;
			else if (code == NO_INDEX) no_index_list[no_index_idx++] = i;
			else if (code == DEL_FAIL) del_fail_list[del_fail_idx++] = i;

			// 위 배열의 인덱스가 배열 크기를 초과할 때 처리
			if (no_file_idx == 1000 || no_index_idx == 1000 || del_fail_idx == 1000) {
				printf("idx overflow\n");
				printf("%d | %d | %d \n", no_file_idx, no_index_idx, del_fail_idx);
				system("pause");
				return;
			}
		}

		// 100개의 폴더마다 얼마나 진행됬는지 표시
		if (i % 100 == 0) {
			printf("[%d / %d] complete\n", i, end);
		}			
	}

	// 오류리스트의 내용을 파일에 저장
	if (!error_recode(no_file_list, no_index_list, del_fail_list, no_file_idx, no_index_idx, del_fail_idx)) {
		system("pause");
		return;
	}

	// 성공적인 마무리
	printf("organizing Complete\n");
	system("pause");
}