#include "super_header.h"

int dumy_func_for_css(char** target_file, int* target_size, int tag_start, int tag_end, int* point, char* css_head) {
	*point = tag_end + 1;
	return 1;
}

int link_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head) {
	// css_head 의 길이 계산하기
	int css_len = strlen(css_head);

	// 특별한 일 없이 바로 반환될 경우 지정될 포인트의 값 설정
	*point = tag_end + 1;

	// 태그와 그 길이 설정
	char *tag = &((*target_file)[tag_start]);
	int tag_len = tag_end - tag_start + 1;

	// link 태그의 href="~~" 부분의 ~~ 찾기
	int start_point, end_point;
	int in_href = find_href_position(tag, tag_len, &start_point, &end_point);

	// href 속성이 없을 때 함수 반환, 이 경우 오류는 아님
	if (!in_href) {
		return 1;
	}

	// href 속성의 값이 http:// 또는 https:// 인 경우 그대로 두기(함수 반환)
	char *val = &(tag[start_point]);
	if (val[0] == 'h') {
		if (isEqual(0, val, "http://"))
			return 1;
		if (isEqual(0, val, "https://"))
			return 1;
	}

	// href 속성의 값 앞에 css_head 붙여주기
	int rs;
	int conv_s = start_point + tag_start;
	if (!string_convert(target_file, target_size, conv_s, conv_s - 1, css_head, css_len, &rs)) {
		printf("link_processing string_convert error\n");
		return 0;
	}

	// 포인트 설정 후 반환
	*point = tag_end + rs + 1;
	return 1;
}

int style_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head) {	
	// css_head 의 길이 계산하기
	int css_len = strlen(css_head);
	
	// 특별한 일 없이 바로 반환될 경우 지정될 포인트의 값 설정
	*point = tag_end + 1;

	// string_convert의 매개변수로 전달하기 위한 변수
	int rs;

	// </style> 까지 import 가 있는지 찾아내 처리하기
	int i;
	int ck_v;
	for (i = tag_end + 1; i < *target_size; i++) {
		// 1. </style> 일때 반복문 나가기
		if ((*target_file)[i] == '<') {
			i++;
			if ((*target_file)[i] == '/') {
				i++;
				if ((*target_file)[i] == 's') {
					if (isEqual(i, *target_file, "style"))
						break;
				}
			}
		}
		// 2. @ 일때 import 인지 확인하고 처리하기
		else if ((*target_file)[i] == '@') {
			i++;
			if ((*target_file)[i] == 'i') {
				// import 일 때
				if (isEqual(i, *target_file, "import")) {
					// i는 u 또는 "를 가리킴
					i += 7;

					// u 일때
					if ((*target_file)[i] == 'u') {
						// i는 '(' 다음을 가리킴
						i += 4;
						// '(' 다음문자 구하기
						char c = (*target_file)[i];

						// c가 영어 문자가 아니면 i를 하나 증가시키기
						// 그러면 i는 첫 번째 문자 위치를 가리킴
						if (!isChar(c))
							i++;
					}
					// " 일때
					else {
						// i 증가시키면 첫 번째 문자 가리킴
						i++;
					}

					// import의 값이 http:// 또는 https:// 인 경우는 제외시키기
					ck_v = 1;
					if ((*target_file)[i] == 'h') {
						if (isEqual(i, *target_file, "http://"))
							ck_v = 0;
						if (isEqual(i, *target_file, "https://"))
							ck_v = 0;
					}

					// 위 경우가 아니라면 " 다음위치에 css 헤드 넣기
					if (ck_v) {
						if (!string_convert(target_file, target_size, i, i - 1, css_head, css_len, &rs)) {
							printf("style_processing string_convert error\n");
							return 0;
						}
					}

					// i 다시 설정: ';' 다음을 가리키기
					for (i + rs; i < *target_size; i++)
						if ((*target_file)[i] == ';') break;
					i++;
				}
			}
		}
	}

	// 위의 반복문이 끝났을 때 i + 6 은 </style> 다음을 가리킴
	*point = i + 6;

	// 여기까지 오류가 없었다면 1 반환
	return 1;
}

int(*css_tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*, char *) {
	// 태그 이름의 길이 가져오기
	int name_s, name_e;
	if (!tag_name(tag, tag_len, &name_s, &name_e))
		return NULL;

	// 이름 길이 계산
	int name_len = name_e - name_s + 1;

	// 태그 이름의 시작지점 설정
	char *tag_name = &(tag[name_s]);

	// 태그 이름 별 처리할 함수 반환하기
	if (name_len == 4) {
		if (isEqual(0, tag_name, "link"))
			return link_processing;
	}
	else if (name_len == 5) {
		if (isEqual(0, tag_name, "style"))
			return style_processing;
	}

	return dumy_func_for_css;
}

int css_tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head) {
	// 태그의 시작위치
	char *tag_p;
	// 태그의 길이
	int tag_len;
	// 태그의 종류별 수행될 함수
	int(*tag_func) (char**, int*, int, int, int*, char*);

	// 태그의 시작위치와 태그의 길이 설정
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// 태그 종류 별 수행될 함수 가져오기
	tag_func = css_tag_check(tag_p, tag_len);

	// 함수가 NULL 이라면 아무 처리 없이 넘어가는 것
	if (tag_func == NULL) {
		// 이 때 point 는 태그의 마지막 바로 뒤를 가리킴
		*point = tag_end + 1;
		return 1;
	}

	// 태그 종류 별 함수 호출하기
	if (!tag_func(target_file, target_size, tag_start, tag_end, point, css_head))
		return 0;

	// 이 함수가 오류없이 끝나면 1 반환
	return 1;
}

int css_head_processing(char **target_file, int *target_size, FILE *copy_file, char *css_head) {
	// 반복제어, 오류확인 변수
	int i, ck;
	
	// target_file에서 태그의 시작과 끝 인덱스
	int tag_start, tag_end;

	// 타겟파일 모두 다 읽을 때 까지 반복
	for (i = 0; i < *target_size;) {
		// 태그 찾기, 파일을 모두 읽었다면 is_end에 0이 저장됨
		if (!find_tag(*target_file, *target_size, i, &tag_start, &tag_end))
			return 0;

		// 파일이 끝났다면 반복문 나가기
		if (tag_end == 0) break;

		// 태그에 대해 처리하기
		if (!css_tag_processing(target_file, target_size, tag_start, tag_end, &i, css_head)) {
			return 0;
		}
	}

	return 1;
}

int css_processing(char *target_dir, char* css_head) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	// 1. 파일 열기(대상 파일, 복사할 파일), file_convert.h 의 함수 그대로 사용
	if (!file_open(&target_file, &target_size, &copy_file, target_dir, "origin_css.html"))
		return 0;

	// 2. css 관련 태그 내 내용 처리
	if (!css_head_processing(&target_file, &target_size, copy_file, css_head)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 3. copy_file에 target_file 쓰기
	fwrite(target_file, sizeof(char), target_size, copy_file);

	// 파일 하나에 대한 처리 완료
	free(target_file);
	fclose(copy_file);
	return 1;
}

int css_converting(char* dir, int num, char* css_head) {
	// 작업할 index.html이 있는 폴더이름 만들기
	char target[200];
	sprintf(target, "%s%s%d%s", dir, "\\", num, "\\");

	// 파일 처리 수행(css 링크 수정)
	if (!css_processing(target, css_head)) {
		// 오류가 발생했다면
		printf("%d: Fail\n\n", num);
		// 오류 반환
		return 0;
	}
	
	// 100개의 파일 처리마다 얼마나 처리했는지 출력
	if (num % 100 == 0) {
		printf("[%d] Complete\n", num);
	}

	return 1;
}

int get_css_head(char* head) {
	if (head == NULL) {
		printf("parameter is NULL\n");
		return 0;
	}

	FILE *data;
	data = fopen("css_head.txt", "r");

	if (data == NULL) {
		printf("data.txt open fail\n");
		return 0;
	}

	if (fgets(head, 200, data) == NULL) {
		printf("fgets() error\n");
		return 0;
	}

	head[strlen(head)] = 0;

	fclose(data);
	return 1;
}

void css_link_convert() {
	system("cls");

	// 대상 데이터들이 존재하는 디렉토리 지정
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target dir: %s\n", dir);

	// css 링크 앞에 붙일 문자열 가져오기
	char css_head_one[200];
	if (!get_css_head(css_head_one)) {
		system("pause");
		return;
	}
	printf("css head: %s\n", css_head_one);

	// 작업할 폴더의 시작이름과 마지막 이름 구하기
	int start, end;
	if (!get_folder_list(dir, &start, &end)) {
		system("pause");
		return;
	}
	printf("Target: %d ~ %d\n", start, end);

	// 모든 폴더에 대해 반복하며 작업
	int error_list[2000];
	int error_idx = 0;
	char css_head[200];
	int i = start;
	for (; i < end + 1; i++) {
		// 폴더 이름 별 다른 css_head 적용
		sprintf(css_head, "%s%d%s", css_head_one, i, "/");

		// 해당 html 파일에 대한 처리
		if (!css_converting(dir, i, css_head)) {
			error_list[error_idx++] = i;
		}
	}

	// 오류가 발생한 리스트 파일에 저장
	if (!error_recode_for_convert(error_list, error_idx))
		system("pause");

	// 오류 갯수 출력
	printf("Error: %d\n", error_idx);

	// 모든 작업 완료
	printf("css_link_convert complete\n");
	system("pause");
}