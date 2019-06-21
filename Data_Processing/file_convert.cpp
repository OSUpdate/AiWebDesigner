#include "super_header.h"

int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir, const char* origin_name) {
	char target_file_name[200];
	sprintf(target_file_name, "%s%s", target_dir, "index.html");

	struct _stat buf;
	int result;

	// 타겟 파일의 정보 가져오기
	result = _stat(target_file_name, &buf);
	if (result != 0) {
		printf("_stat() error\n");
		return 0;
	}

	// 타겟 파일 fopen으로 열기
	FILE *fp = fopen(target_file_name, "rb");
	if (fp == NULL) {
		printf("fopne() error - rb\n");
		return 0;
	}

	// 타겟파일을 모두 읽어 저장할 메모리 공간 할당
	*target_file = (char*)malloc(sizeof(char)*buf.st_size);
	if (*target_file == NULL) {
		printf("malloc() error\n");
		return 0;
	}

	// 타겟파일 모두 읽기
	size_t read_size;
	read_size = fread(*target_file, 1, buf.st_size, fp);
	if (read_size != buf.st_size) {
		printf("fread() error, size: %d, read: %d\n", buf.st_size, read_size);
		free(*target_file);
		fclose(fp);
		return 0;
	}
	*target_size = read_size;

	// 타겟파일 파일포인터 반환
	fclose(fp);

	// 원본파일 이름 바꾸기
	char temp[200];
	sprintf(temp, "%s%s", target_dir, origin_name);
	if (!rename_file(target_file_name, temp)) {
		printf("rename_file error\n");
		free(*target_file);
		return 0;
	}

	// 복사해 저장할 파일 fopen으로 열기
	*copy_file = fopen(target_file_name, "wb");
	if (*copy_file == NULL) {
		free(*target_file);
		printf("fopen() error - wb\n");
		return 0;
	}

	return 1;
}

int dumy_func(char** target_file, int* target_size, int tag_start, int tag_end, int* point) {
	*point = tag_end + 1;
	return 1;
}

int (*tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*) {
	// 태그 이름의 길이 가져오기
	int name_s, name_e;
	if (!tag_name(tag, tag_len, &name_s, &name_e)) {
		printf("Tag has no name\n");
		return NULL;
	}

	// 태그 이름의 시작지점 설정
	char* tag_name_p = &(tag[name_s]);
	// 태그의 이름 길이 계산
	int name_len = name_e - name_s + 1;

	// 태그가 '/'로 시작하는 끝 태그가 아닐 경우만 수행
	if (tag[name_s - 1] != '/') {
		// 태그 이름 별 처리할 함수 반환하기
		if (name_len == 3) {
			if (isEqual(0, tag_name_p, "div"))
				return div_section_processing;
		}
		else if (name_len == 7) {
			if (isEqual(0, tag_name_p, "section"))
				return div_section_processing;
		}
		else if (name_len == 8) {
			if (isEqual(0, tag_name_p, "noscript"))
				return noscripts_processing;
		}
		else if (name_len == 1) {
			if (isEqual(0, tag_name_p, "a"))
				return a_processing;
		}
	}
	// '/'로 시작하는 태그일 땐, "noscript"인지만 확인
	else {
		if (name_len == 8) {
			if (isEqual(0, tag_name_p, "noscript"))
				return noscripts_processing;
		}
	}

	// 해당 태그에 대해 처리할 내용이 없다면 dumy_func 반환
	return dumy_func;
}

int check_load_class(char *tag, int len) {
	// 공백 뒤 첫 단어는 속성이고, 이 속성이 class 일때 값 확인
	// div 의 경우 i=4 일 때 부터 공백이기 때문에 i=4 로 시작
	int i, count;
	int attr_p;
	int val_s = 0;
	int val_e = 0;
	int find_class = 0;
	for (i = 4; i < len; i++) {
		// 공백 찾기
		if (tag[i] == ' ') {
			// 공백이면 i 증가, 이때 i는 속성이름의 위치를 가리킴
			i++;
			attr_p = i;
			
			// 두 번째 " 찾기
			count = 1;
			for (; i < len; i++) {
				// " 를 찾았다면
				if (tag[i] == '"') {
					// 두 번째일 땐 반복문 나가기
					if (count == 0) {
						break;
					}
					// 첫 번쨰일 땐 count 감소시키기
					else {
						count--;
						// 이때 val_s는 값의 시작 위치를 가리킴
						val_s = i + 1;
					}
				}
			}
			val_e = i - 1;

			// 속성이 class 인지 확인
			if (tag[attr_p] == 'c') {
				if (isEqual(attr_p, tag, "class")) {
					// 속성이 class 라면 반복문 탈출
					find_class = 1;
					break;
				}
			}
		}
	}

	// class 속성이 있을 경우
	if (find_class) {
		// 속성의 값 길이 구하기
		int val_len = val_e - val_s + 1;
		
		// 만약 속성의 값이 6글자보다 적으면 0 반환
		if (val_len < 6) return 0;

		// 1. 값이 loader 로 끝나는지 확인
		if (val_len >= 6) {
			if (isEqual(val_e - 5, tag, "loader"))
				return 1;
		}

		// 2. 값이 loading 으로 끝나는지 확인
		if (val_len >= 7) {
			if (isEqual(val_e - 6, tag, "loading"))
				return 1;
		}
	}

	// 여기까지 왔으면 load 관련 태그가 아닌것
	return 0;
}

int find_end_point(char *target_file, int target_size, int start, char *t_name, int t_len) {
	int i;
	int count = 0;
	for (i = start; i < target_size; i++) {
		// 먼저 < 찾기
		if (target_file[i] == '<') {
			i++;
			// 1. 같은 태그가 나왔다면 카운트 올려주기
			if (target_file[i] == t_name[0]) {
				if (t_len == 3) {
					if (isEqual(i, target_file, "div"))
						count++;
				}
				else {
					if (isEqual(i, target_file, "section"))
						count++;
				}
			}
			// 2. / 기호가 나왔다면
			else if (target_file[i] == '/') {
				i++;
				if (t_len == 3) {
					if (isEqual(i, target_file, "div")) {
						// 카운트가 있다면 감소시켜주기
						if (count) count--;
						else break;
					}
				}
				else {
					if (isEqual(i, target_file, "section")) {
						// 카운트가 있다면 감소시켜주기
						if (count) count--;
						else break;
					}
				}
			}
		}
	}

	// 위 반복문을 탈출했을 때 i + t_len 이 > 위치를 가리킴
	return i + t_len;
}

int div_section_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	// 태그의 시작위치와 태그의 길이 설정
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// class 속성이 있고, load 관련인지 확인, 아니라면 함수 반환하기
	if (!check_load_class(tag_p, tag_len)) {
		*point = tag_end + 1;
		return 1;
	}

	// 위에서 반환되지 않았다면 load 관련 태그인 것
	// 먼저 태그의 이름 찾기(div 인지 section 인지)
	int name_s, name_e;
	if (!tag_name(tag_p, tag_len, &name_s, &name_e))
		return 0;

	// 이름의 길이 구하기
	int name_len = name_e - name_s + 1;

	// 그 다음 </div> 또는 </section> 위치 찾기
	int end_point = find_end_point(*target_file, *target_size, tag_end + 1, &(tag_p[name_s]), name_len);

	// 만약 end_point 가 target_size - 1 을 넘어간다면 오류가 발생한것!
	if (end_point >= *target_size - 1) {
		printf("div_section_processing() error, end_point > target_size\n");
		return 0;
	}

	// <div, section> 부터 </div, section> 까지 지우기
	int rs;
	if (!string_convert(target_file, target_size, tag_start, end_point, NULL, 0, &rs)) {
		printf("div_section_processing, string_convert() error\n");
		return 0;
	}

	// 오류없이 끝났다면 포인트 처리 후 1 반환
	*point = tag_start;
	return 1;
}

int noscripts_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	// 태그의 시작위치와 태그의 길이 설정
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// 태그 이름 가져오기
	int name_s, name_e;
	if (!tag_name(tag_p, tag_len, &name_s, &name_e))
		return 0;

	// 태그 이름 길이 계산
	int name_len = name_e - name_s + 1;

	// noscript 에서 no 만 지우기 -> name_s 부터 name_s + 1 까지
	int rs;
	int pos = tag_start + name_s;
	if (!string_convert(target_file, target_size, pos, pos + 1, NULL, 0, &rs)) {
		printf("noscripts_processing, string_convert() error\n");
		return 0;
	}

	// 이 함수가 오류 없이 진행됬다면 포인트 처리 후 1 반환
	*point = tag_end + rs + 1;
	return 1;
}

int find_href_position(char *tag, int len, int *start, int *end) {
	// link 태그의 href="~~" 부분의 ~~ 찾기
	int i;
	for (i = 0; i < len; i++) {
		// 만약 h 글자를 찾았다면
		if (tag[i] == 'h') {
			// 그 href 속성이라면
			if (isEqual(i, tag, "href")) {
				i += 6;
				*start = i;
				for (; i < len; i++) {
					if (tag[i] == '"') break;
				}
				*end = i - 1;
				return 1;
			}
		}
	}

	// href 속성이 없다면 0 반환
	return 0;
}

int a_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	// 태그의 시작위치와 태그의 길이 설정
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// a 태그의 href="~~" 부분의 ~~ 찾기
	int in_href, start_point, end_point;
	in_href = find_href_position(tag_p, tag_len, &start_point, &end_point);

	// 만약 "" 이거나 "#" 이라면 in_href를 0으로 바꿔주기(1글자라면 #인걸로 간주)
	if (start_point >= end_point) in_href = 0;

	// href 속성이 없을 때 그냥 나가기, 이 경우는 오류가 아님
	if (!in_href) {
		*point = tag_end + 1;
		return 1;
	}

	// ~~ 부분을 #으로 바꿔주기
	int conv_s = start_point + tag_start;
	int conv_e = end_point + tag_start;
	int rs;
	if (!string_convert(target_file, target_size, conv_s, conv_e, "#", 1, &rs)) {
		printf("a_processing, string_convert() error\n");
		return 0;
	}

	// 오류가 없었다면 포인트 처리 후 1 반환
	// 포인트는 태그 마지막의 뒷 위치를 가리킴
	// rs는 양수일경우 늘어날 길이, 음수일경우 줄어들 길이, 여기선 줄어들 길이
	*point = tag_end + rs + 1;

	return 1;
}

int tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point) {
	
	// 태그의 종류별 수행될 함수
	int (*tag_func) (char**, int*, int, int, int*);
	
	// 태그의 시작위치와 태그의 길이 설정
	char* tag_p;
	int tag_len;
	tag_p = &((*target_file)[tag_start]);
	tag_len = tag_end - tag_start + 1;

	// 태그 종류 별 수행될 함수 가져오기
	tag_func = tag_check(tag_p, tag_len);

	// 함수가 NULL 이라면 오류난거
	if (tag_func == NULL)
		return 0;

	// 태그 종류 별 함수 호출하기
	if (!tag_func(target_file, target_size, tag_start, tag_end, point))
		return 0;

	// 이 함수가 오류없이 끝나면 1 반환
	return 1;
}

int file_processing(char **target_file, int *target_size) {
	// 반복제어, 오류확인 변수
	int i, ck;

	// target_file에서 태그의 시작과 끝 인덱스
	int tag_start, tag_end;
	

	// 타겟파일 모두 다 읽을 때 까지 반복
	for (i = 0; i < *target_size;) {
		// 태그 찾기, 파일을 모두 읽었다면 tag_end에 0이 저장됨
		if (!find_tag(*target_file, *target_size, i, &tag_start, &tag_end))
			return 0;

		// 파일이 끝났다면 반복문 나가기
		if (tag_end == 0) break;

		// 태그에 대해 처리하기
		if (!tag_processing(target_file, target_size, tag_start, tag_end, &i)) {
			return 0;
		}
	}
		
	return 1;
}

int processing(char *target_dir) {
	char *target_file;
	int target_size;

	FILE *copy_file;

	// 1. 파일 열기(대상 파일, 복사할 파일)
	if (!file_open(&target_file, &target_size, &copy_file, target_dir, "origin_convert.html"))
		return 0;

	// 2. 파일에 대한 처리 작업
	if (!file_processing(&target_file, &target_size)) {
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

int converting(char* dir, int num) {
	// 작업할 index.html이 있는 폴더이름 만들기
	char target[200];
	sprintf(target, "%s%s%d%s", dir, "\\", num, "\\");

	// 파일 내용 변경 처리 수행
	if (!processing(target)) {
		// 오류가 발생했다면
		printf("%d: Fail\n\n", num);
		// 오류 반환
		return 0;
	}
	
	// 100개 처리할 때 마다 화면에 출력
	if (num % 100 == 0) {
		printf("[%d] Complete\n", num);
	}

	// 정상 수행 되었다면 1 반환
	return 1;
}

int error_recode_for_convert(int *list, int idx) {
	FILE* fp;
	fp = fopen("error_list.txt", "w");
	if (fp == NULL) {
		printf("file_open fail\n");
		return 0;
	}

	if (idx) {
		arr_recode(list, idx, fp);
	}

	fclose(fp);
	return 1;
}

void file_convert() {
	system("cls");

	// 대상 데이터들이 존재하는 디렉토리위치를 파일로부터 읽기
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}
	printf("Target dir: %s\n", dir);

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
	int i = start;
	for (; i <= end; i++) {
		// 해당 html 파일에 대한 처리
		if (!converting(dir, i)) {
			error_list[error_idx++] = i;
		}
	}

	// 오류가 발생한 리스트 파일에 저장
	if (!error_recode_for_convert(error_list, error_idx))
		system("pause");
	
	// 오류 갯수 출력
	printf("Error: %d\n", error_idx);

	// 모든 작업 완료
	printf("file_convert complete\n");
	system("pause");
}
