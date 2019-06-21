#pragma once

/*
������ ��� �����͸� �о����, ������ ���������͸� �������� �Լ�
target_file : ��� ������ ������ ������ �޸��� �ּ�
target_size : ��� ������ ũ�⸦ ������ �޸��� �ּ�
copy_file   : ������ ������ ���������͸� ������ �޸��� �ּ�
target_dir  : ��� ������ �ִ� ���
origin_name : ���������� �ٲ� �̸�
��ȯ ��		: ���� 0, ���� 1
*/
int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir, const char *origin_name);
/*
�±׿� ���� ó���� ���� �ƹ��͵� ���ϰ� �Ѿ �Լ��� �ʿ��ؼ� ���� �Լ�
��ȯ ��: ������ 1
*/
int dumy_func(char** target_file, int* target_size, int tag_start, int tag_end, int* point);
/*
�±� �� �����ؾ� �� ó�� �Լ��� ã�� ��ȯ�ϴ� �Լ�
tag		: Ž���� �±�
tag_len : �±��� ����
��ȯ �� : ��ȯ���� int�̰�, �Ű������� (char*, int*, int, int, int*)�� �Լ��� ������
*/
int(*tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*);
/*
�±׿��� class �Ӽ��� �ִ��� Ȯ���ϰ�, �� �Ӽ��� ���� load �������� Ȯ���ϴ� �Լ�
tag		: Ž���� �±�
len		: �±��� ����
��ȯ �� : loader �����̸� 1, �ƴϸ� 0 ��ȯ
*/
int check_load_class(char *tag, int len);
/*
div, section �±׿� ���� ó���� ��� �ش� �±��� ������ ������ ã���ִ� �Լ�
target_file : Ž���� ���ڿ�(html ����)
target_size : ���ڿ��� ����
start		: Ž���� ���� ��ġ
t_name		: �±��� �̸�
t_len		: �±� �̸��� ����
��ȯ ��		: �ش� �±��� ������ ������ ��ġ �ε���
*/
int find_end_point(char *target_file, int target_size, int start, char *t_name, int t_len);
/*
div, section �±׿� ���� ó���� �����ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
��ȯ ��		: ���� 0, ���� 1
*/
int div_section_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
noscript �±׿� ���� ó���� �����ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
��ȯ ��		: ���� 0, ���� 1
*/
int noscripts_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
�±��� href="~~" �Ӽ� �� ~~�� ��ġ ã��
tag		 : Ž���� �±�
len		 : �±��� ����
start	 : href �Ӽ��� ������ �����ϴ� ��ġ
end		 : href �Ӽ��� ������ ������ ��ġ
��ȯ ��  : href �Ӽ� ������ 1, ������ 0
*/
int find_href_position(char *tag, int len, int *start, int *end);
/*
a �±׿� ���� ó���� �����ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
��ȯ ��		: ���� 0, ���� 1
*/
int a_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
���� �±׿� ���� ó���� �����ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
��ȯ ��		: ���� 0, ���� 1
*/
int tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point);
/*
head �±� �κ� ó���ϴ� �Լ�
target_file : ���� ������ ����
target_size : ���� ������ ���̿� ���� ������
copy_file	: �� ������ ����������
��ȯ ��		: ���� 1, ���� 0
*/
int file_processing(char **target_file, int *target_size);
/*
�� ���Ͽ� ���� ó��(script ���� ��)�� �ϴ� �Լ�
target_dir : ��� ������ ��ġ�� ���丮 ���
��ȯ ��	   : ���� 0, ���� 1
*/
int processing(char *target_dir);
/*
�� ���Ͽ� ���� ó��(script ���� ��)�� �ϴ� �Լ�
dir		: ��� �������� ��ġ�� ���丮 ���
num     : ó���� ���� ��ȣ
��ȯ ��	: ���� 0, ���� 1
*/
int converting(char* dir, int num);
/*
error list�� ���Ͽ� �������ִ� �Լ�
list	: Error ����Ʈ
idx		: Error ����Ʈ�� �ε���(������ ����)
��ȯ �� : ���� 0, ���� 1
*/
int error_recode_for_convert(int* list, int idx);
/*
html �������� �����ϴ� �Լ�
*/
void file_convert();