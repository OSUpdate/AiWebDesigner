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