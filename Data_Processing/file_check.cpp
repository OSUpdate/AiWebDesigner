#include "super_header.h"

// 정상 동작 정의
#define SUCCESS		1
// 오류 정의
#define NO_INDEX	0
#define EMPTY		2
#define NOT_HTML	3

// tag_checking에서 사용될 인덱스 정의
#define HTML_S 0
#define HTML_E 1

#define HEAD_S 2
#define HEAD_E 3

#define BODY_S 4
#define BODY_E 5

int file_open_for_check(char **file_p, int *file_size, char *file_name) {
	struct _stat buf;
	int result;

	// 타겟 파일의 정보 가져오기
	result = _stat(file_name, &buf);
	if (result != 0) {
		printf("_stat() error\n");
		return 0;
	}

	// 타겟 파일 fopen으로 열기
	FILE* fp = fopen(file_name, "rb");
	if (fp == NULL) {
		printf("fopne() error - rb\n");
		return 0;
	}

	// 타겟파일을 모두 읽어 저장할 메모리 공간 할당
	*file_p = (char*)malloc(sizeof(char) * buf.st_size);
	if (*file_p == NULL) {
		printf("malloc() error\n");
		return 0;
	}

	// 타겟파일 모두 읽기
	size_t read_size;
	read_size = fread(*file_p, 1, buf.st_size, fp);
	if (read_size != buf.st_size) {
		printf("fread() error, size: %d, read: %d\n", buf.st_size, read_size);
		free(*file_p);
		fclose(fp);
		return 0;
	}
	*file_size = read_size;

	// 타겟파일 파일포인터 반환
	fclose(fp);
	return 1;
}

int tag_checking(char* tag, int tag_len, int *ck) {
	// 태그 이름의 시작과 끝 찾기
	int name_s, name_e;
	if (!tag_name(tag, tag_len, &name_s, &name_e))
		return 0;

	// 이름 길이 계산
	char* name_p = &(tag[name_s]);
	int name_len = name_e - name_s + 1;
	
	// html, head, body 인지 확인 및 처리
	int pls = 0;
	if (name_len == 4) {
		// 끝 태그라면 시작 태그보다 인덱스가 하나 더 많음
		if (tag[name_s - 1] == '/') pls = 1;

		// 각 태그 별 처리
		if (isEqual(0, name_p, "html"))		 ck[HTML_S + pls] = 0;
		else if (isEqual(0, name_p, "head")) ck[HEAD_S + pls] = 0;
		else if (isEqual(0, name_p, "body")) ck[BODY_S + pls] = 0;
	}

	// 정상 완료 시 1 반환
	return 1;
}

int html_check(char* file, int size) {
	// html, head, body 유무(시작과 끝 두번씩) 확인
	int ck[6];
	for (int j = 0; j < 6; j++)
		ck[j] = 1;

	int i;
	int tag_s, tag_e;
	char* tag_p;
	int tag_len;

	// 파일 전체에 대해 검사
	for (i = 0; i < size;) {
		// 1. 태그 찾기(<~~~>), 오류 발생시 0 반환(문서에 이상 있음)
		if (!find_tag(file, size, i, &tag_s, &tag_e))
			return 0;

		// 2. 파일이 끝났다면 반복문 나가기
		if (tag_e == 0) break;

		// 3. 태그에 대한 처리
		tag_p = &(file[tag_s]);
		tag_len = tag_e - tag_s + 1;
		if (!tag_checking(tag_p, tag_len, ck))
			return 0;

		// 4. i 값 갱신
		i = tag_e + 1;
	}

	// ck를 모두 더하기
	int ck_sum = 0;
	for (i = 0; i < 6; i++)
		ck_sum += ck[i];

	// ck를 모두 더했을 때 0이 아니면 오류
	if (ck_sum != 0) {
		printf("ck is not 0\n");
		return 0;
	}
	// ck 가 0이면 정상이니까 1 반환
	else return 1;
}

int checking(char* file_name) {
	// 1. 파일 열기
	char* file;
	int size;
	if (!file_open_for_check(&file, &size, file_name))
		return NO_INDEX;

	// 2. index.html이 빈 파일인지 확인
	if (size == 0) return EMPTY;

	// 3. <html> ~ </html> 확인
	if (!html_check(file, size)) return NOT_HTML;

	// 파일 확인 완료
	free(file);
	return SUCCESS;
}

int error_recode_for_check(int* no_index, int* empty, int* not_html, int no_idx, int emp, int n_html) {
	FILE* fp;
	fp = fopen("error_list.txt", "w");
	if (fp == NULL) {
		printf("file_open fail\n");
		return 0;
	}

	if (no_idx) {
		fprintf(fp, "NO_Index\n");
		arr_recode(no_index, no_idx, fp);
	}
	if (emp) {
		fprintf(fp, "Empty\n");
		arr_recode(empty, emp, fp);
	}
	if (n_html) {
		fprintf(fp, "Not_HTML\n");
		arr_recode(not_html, n_html, fp);
	}

	fclose(fp);
	return 1;
}

void file_check() {
	system("cls");

	// 대상 데이터들이 존재하는 디렉토리위치를 파일로부터 읽기
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target Dir: %s\n", dir);

	// 작업할 폴더의 시작이름과 마지막 이름 구하기
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}
	printf("Data: %d ~ %d\n", start, end);

	// 모든 폴더에 대해 반복하며 작업
	int no_index_list[1000];	// 오류 리스트를 담을 배열들
	int empty_list[1000];
	int not_html_list[1000];
	int no_idx_idx = 0;		// 위 각 배열들에 대한 인덱스
	int empty_idx = 0;
	int not_html_idx = 0;

	int i = start;
	int rep = 0;
	int ck;
	char html[300];
	for (; i <= end; i++) {

		// html 파일 이름: 폴더경로\\index.html
		sprintf(html, "%s%s%d%s", dir, "\\", i, "\\index.html");

		// 정상 파일인지 확인
		ck = checking(html);
		if (ck != SUCCESS) {
			if (ck == NO_INDEX) no_index_list[no_idx_idx++] = i;
			else if (ck == EMPTY) empty_list[empty_idx++] = i;
			else if (ck == NOT_HTML) not_html_list[not_html_idx++] = i;

			// 위 배열의 인덱스가 배열 크기를 초과할 때 처리
			if (no_idx_idx == 1000 || empty_idx == 1000 || not_html_idx == 1000) {
				printf("idx overflow\n");
				printf("%d | %d | %d \n", no_idx_idx, empty_idx, not_html_idx);
				system("pause");
				return;
			}
		}

		// 100번마다 진행상황 출력
		rep++;
		if (rep % 100 == 0) {
			printf("[%d] complete\n", rep);
		}
	}

	// 오류리스트의 내용을 파일에 저장
	printf("\n=== Error ===\n");
	printf(" No_index: %d \n Empty: %d \n Not_HTML: %d\n\n", no_idx_idx, empty_idx, not_html_idx);
	if (!error_recode_for_check(no_index_list, empty_list, not_html_list, no_idx_idx, empty_idx, not_html_idx)) {
		system("pause");
		return;
	}

	// 모든 작업 완료
	printf("file_check complete\n");
	system("pause");
}