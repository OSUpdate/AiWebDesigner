#pragma once

/*
�ܾ� �˻� �Լ�
idx		: str1���� �˻��� �ܾ��� ��ġ(�ε���)
str1	: �˻��� �ܾ �ִ� ���ڿ�
str2	: �� ��� �ܾ�
��ȯ �� : �� �ܾ ���ٸ� 1 ��ȯ, �ٸ��� 0 ��ȯ
*/
int isEqual(int idx, const char *str1, const char *str2);
/*
���� �ϳ��� �������� Ȯ���ϴ� �Լ�
c		: Ȯ���� ����
��ȯ �� : ���ڸ� 1, �ƴϸ� 0 ��ȯ
*/
int isNumber(char c);
/*
���� �ϳ��� ���� �������� Ȯ���ϴ� �Լ�
c		: Ȯ���� ����
��ȯ �� : ���� ���ڸ� 1, �ƴϸ� 0 ��ȯ
*/
int isChar(char c);

/*
Ű����(stdin)���� �Է¹޴� �Լ�
buf		: �Է¹��� ���ڿ��� ������ �迭�� �ּ�
size	: buf �迭�� ũ��(sizeof(buf))
��ȯ �� : �Է� ���� ����
*/
int input_keyboard(char buf[], int size);
/*
���ڸ� �Է¹޴� �Լ�
num		: �Է¹��� ���ڸ� ������ ������ �ּ�
��ȯ �� : ���� 0, ���� 1
*/
int getNumber(int *num);
/*
Y �Ǵ� N �� �Է¹޴� �Լ�
inp		: �Է¹��� ���ڸ� ������ ������ �ּ�
��ȯ �� : ���� 0, ���� 1
*/
int getYorN(char *inp);
/*
��� �������� ���� ����
num     : ������� ������ ����
��ȯ �� : ������� 1, �׸� 0
*/
int going_on_question(int num);

/*
���� �̸� �ٲٱ�
old_file : �̸� �ٲٱ� ��� ����
new_file : �ٲ� �̸�
��ȯ ��  : ���� 1, ���� 0
*/
int rename_file(const char* old_file, const char* new_file);
/*
���� �����ϱ�
name	: ������ ��� ����
��ȯ �� : ���� 1, ���� 0
*/
int delete_file(const char *name);
/*
Ÿ�� ���丮�� �̸� �о���� �Լ�
dir		: �о�� ����(��� ���丮 ���)�� ����� �޸� �ּ�, 200 ũ���� char �迭
��ȯ �� : ���� 0, ���� 1
*/
int getTargetDir(char dir[]);
/*
rename �Ҷ� ������ ������ �̸�
��ȯ �� : ���� rename �Ҷ� ������ ������ �̸�, ���� 0
*/
int get_first_file_name();

/*
data.txt ���Ͽ� ���������� rename�� ������ �̸� +1 ����
name	: ���������� rename�� ������ �̸� +1
��ȯ �� : ���� 1, ���� 0
*/
int write_last_file_name(int name);

/*
qsort �Լ��� ����ϱ� ���� ������ �Լ�, int�� �������� ����
*/
int static compare(const void* first, const void* second);

/*
������ ���丮 �� �������� �̸��� ���۰� ���� ã�� �Լ�
dir		: ������ ��ġ�� ���丮
start	: ó�� ������ �̸�
end		: ������ ������ �̸�
��ȯ �� : ���� 1, ���� 0
*/
int get_folder_list(char *dir, int *start, int *end);

/*
���ڿ� �� Ư�� ���ڿ��� �ٸ� ���ڿ��� ġȯ�ϴ� �Լ�
ġȯ�� ���ڿ��� ���°�� alt_s �� NULL, alt_len �� 0���� ����
target		: �۾��� ���ڿ�
target_size : �۾��� ���ڿ��� ����
start_p		: ġȯ�� ���ڿ��� ��������
end_p		: ġȯ�� ���ڿ��� �� ����
alt_s		: ġȯ�� ���ڿ�
alt_len		: ġȯ�� ���ڿ��� ����
rs			: ����� ������ �����ϴ� ������ �ּ�(�߰��� ���� - ������ ����)
��ȯ ��		: ���� 0, ���� 1
*/
int string_convert(char **target, int *target_size, int start_p, int end_p, const char *alt_s, int alt_len, int *rs);

/*
���ڿ����� �±׸� ã���ִ� �Լ�
target_file : Ž���� ���ڿ�
target_size : ���ڿ��� �� ����
start		: Ž���� ������ ��ġ
tag_start	: �±��� �������� ������ ������ �ּ�
tag_end		: �±��� ������ ������ ������ �ּ�
��ȯ ��		: ���� 0, ���� 1
*/
int find_tag(char* target_file, int target_size, int start, int* tag_start, int* tag_end);
/*
�±׿��� �±��� �̸��� ã�� �Լ�
tag		 : Ž���� �±�
tag_size : �±��� ����
name_s	 : �̸��� ó�� �κ��� ��ġ
name_e	 : �̸��� ������ �κ��� ��ġ
*/
int tag_name(char* tag, int tag_size, int* name_s, int* name_e);
