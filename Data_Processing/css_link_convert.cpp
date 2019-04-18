#include "super_header.h"

// 작업 할 html 처음과 마지막 폴더 이름
#define START 1
#define END   342

int link_processing(char *link_tag, int len, FILE *copy_file, char *css_head) {

	int start_point, end_point;
	int in_href = 0;
	int do_process = 0;

	// link 태그의 href="~~" 부분의 ~~ 찾기
	in_href = find_href_position(link_tag, len, &start_point, &end_point);

	// href 속성이 없을 때 해당 link 태그 부분 그대로 쓰고 나가기
	if (!in_href) {
		fwrite(link_tag, 1, len, copy_file);
		return 1;
	}

	// 링크태그 쓰기
	fwrite(link_tag, 1, start_point, copy_file);
	fwrite(css_head, 1, strlen(css_head), copy_file);
	fwrite(&(link_tag[start_point]), 1, len - start_point, copy_file);

	return 1;
}

int find_link(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head) {
	int i = *index;
	int ck, start_point, end_point;

	// 'link'인지 확인하기, 아니면 0 반환
	if (!isEqual(i, target_file, "link")) return 0;

	// '<'를 start_point로 지정
	start_point = i - 1;

	// link문 이전까지 쓰기
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	// '>' 기호 찾기
	for (; i < target_size; i++) {
		if (target_file[i] == '>')
			break;
	}
	end_point = i;

	// i 증가 -> i는 link 태그의 마지막 '>' 다음 문자를 가리킴
	i++;

	// 만약 위 반복문이 다도는 동안 '>'가 없다면
	if (i >= target_size) {
		printf("'>' find error\n");
		return -1;
	}

	// link문에 대한 처리작업 진행
	if (!link_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file, css_head))
		return -1;

	// link 태그 처리작업 완료 후 인덱스 값, point 최신화 후 1 반환
	*index = i;
	*point = i;
	return 1;
}

int style_processing(char *style_tag, int len, FILE *copy_file, char *css_head) {

	int i;
	int point = 0;
	for (i = 0; i < len; i++) {
		// @ 발견시
		if (style_tag[i] == '@') {
			i++;
			// import 인지 확인
			if (isEqual(i, style_tag, "import")) {
				i += 6;
				// 첫 번째 " 찾기
				for (; i < len; i++)
					if (style_tag[i] == '"') break;
				//  첫 번째 " 까지 쓰기
				fwrite(&(style_tag[point]), 1, i - point + 1, copy_file);
				point = i + 1;
				// 링크 앞에 붙여야 할 거 쓰기
				fwrite(css_head, 1, strlen(css_head), copy_file);
			}
		}
	}

	// 나머지 style 태그 쓰기
	fwrite(&(style_tag[point]), 1, len - point, copy_file);
	return 1;
}

int find_style(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head) {
	int i = *index;
	int start_point, end_point;

	// 'style'인지 확인하기, 아니면 0 반환
	if (!isEqual(i, target_file, "style")) return 0;

	// < 를 start_point로 지정
	start_point = i - 1;

	// style 태그 이전까지 쓰기
	fwrite(&(target_file[*point]), 1, start_point - *point, copy_file);

	i += 5;

	// style 태그의 마지막 위치 찾고, 처리하기
	for (; i < target_size - 1; i++) {
		// 먼저 '</' 찾기
		if ((target_file[i] == '<') && (target_file[i + 1] == '/')) {
			i += 2;

			// </style 이라면
			if (isEqual(i, target_file, "style")) {
				// i가 > 이후를 가리키게 하기
				i += 6;
				end_point = i - 1;
				// <style> 태그에 대한 처리작업 진행
				if (!style_processing(&(target_file[start_point]), end_point - start_point + 1, copy_file, css_head))
					return -1;

				// 반복문 나가기
				break;
			}
		}
	}

	// 만약 위 반복문이 다도는 동안 '>'가 없다면
	if (i >= target_size - 1) {
		printf("</style> find error\n");
		return -1;
	}

	// style 태그 처리작업 완료 후 인덱스 값, point 최신화 후 1 반환
	*index = i;
	*point = i;
	return 1;
}

int css_head_processing(char *target_file, int target_size, FILE *copy_file, int *index, char *css_head) {
	// 반복제어, 오류확인 변수
	int i, ck;
	// 인덱스 증가하기 전 위치 저장하는 변수
	int point = 0;

	// 원본파일에 대한 처리 시작
	for (i = 0; i < target_size; i++) {

		// '<' 기호 찾기
		if (target_file[i] == '<') {
			// i 증가 -> i는 '<' 이후 문자를 가리킴
			i++;

			// '<' 다음 '/' 문자가 오면 </head 인지 확인하기
			if (target_file[i] == '/') {
				// i 증가 -> i는 '/' 이후 문자를 가리킴
				i++;

				// </head>인지 확인, file_convert.h 의 함수
				ck = find_end_of_head(target_file, target_size, &i);
				if (ck == 1) {
					fwrite(&(target_file[point]), 1, i - point, copy_file);
					break;
				}
			}
			else {
				// link 태그인지 확인
				ck = find_link(target_file, target_size, copy_file, &i, &point, css_head);
				// link 태그가 아니라면 style 태그인지 확인
				if (ck == 0) ck = find_style(target_file, target_size, copy_file, &i, &point, css_head);

				// 오류 발생시 0 반환
				if (ck == -1) return 0;
			}
		}
	}

	// 이 함수에서 원본 파일을 다 돌았다면 오류
	if (i >= target_size) {
		printf("There is no <body> ?? \n");
		return 0;
	}

	// 인덱스 값 최신화 후 1 반환
	*index = i;
	return 1;
}

int css_processing(char *target_dir, char* css_head) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	int index;

	// 1. 파일 열기(대상 파일, 복사할 파일), file_convert.h 의 함수 그대로 사용
	if (!file_open(&target_file, &target_size, &copy_file, target_dir))
		return 0;

	// 2. <head> 태그 내 내용 처리
	if (!css_head_processing(target_file, target_size, copy_file, &index, css_head)) {
		free(target_file);
		fclose(copy_file);
		return 0;
	}

	// 3. 나머지 부분 모두 쓰기
	fwrite(&(target_file[index]), 1, target_size - index, copy_file);

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
	else
		printf("%d: Complete\n", num);
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

	// css 링크 앞에 붙일 문자열 가져오기
	char css_head_one[200];
	if (!get_css_head(css_head_one)) {
		system("pause");
		return;
	}

	char html[300] = { 0 };
	char css_head[200];
	int i = START;
	for (; i < END + 1; i++) {

		// html 파일 이름: 폴더경로\\index.html
		sprintf(html, "%s%s%d%s", dir, "\\", i, "\\index.html");

		// 폴더 이름 별 다른 css_head 적용
		sprintf(css_head, "%s%d%s", css_head_one, i, "/");

		// 해당 html 파일에 대한 처리
		if (!css_converting(dir, i, css_head)) {
			system("pause");
		}
	}

	// 모든 작업 완료
	printf("css_link_convert complete\n");
	system("pause");
}