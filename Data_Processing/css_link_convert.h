#pragma once

/*
�±׿� ���� ó���� ���� �ƹ��͵� ���ϰ� �Ѿ �Լ��� �ʿ��ؼ� ���� �Լ�
��ȯ ��: ������ 1
*/
int dumy_func_for_css(char** target_file, int* target_size, int tag_start, int tag_end, int* point, char *css_head);
/*
link �±� �κ� ó���ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
css_head	: link �±��� css �ּ� �տ� ���� ���ڿ�
��ȯ ��		: ���� 0, ���� 1
*/
int link_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head);
/*
style �±� �κ� ó���ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
css_head	: import�� css �ּ� �տ� ���� ���ڿ�
��ȯ ��		: ���� 0, ���� 1
*/
int style_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head);
/*
css ���� �±� �� �����ؾ� �� ó�� �Լ��� ã�� ��ȯ�ϴ� �Լ�
tag		: Ž���� �±�
tag_len : �±��� ����
��ȯ �� : ��ȯ���� int�̰�, �Ű������� (char*, int*, int, int, int*, char*)�� �Լ��� ������
*/
int(*css_tag_check(char *tag, int tag_len)) (char**, int*, int, int, int*, char*);
/*
css ���� �±׿� ���� ó���� �����ϴ� �Լ�
target_file : �۾����� ���ڿ�(html ����)
target_size : ���ڿ��� ����
tag_start	: �±��� ���� ��ġ
tag_end		: �±��� �� ��ġ
point		: ���� ���ڿ�(html ����)�� ������ �۾��ߴ��� ����س��� ������ �ּ�
css_head	: �±��� css �ּ� �տ� ���� ���ڿ�
��ȯ ��		: ���� 0, ���� 1
*/
int css_tag_processing(char **target_file, int *target_size, int tag_start, int tag_end, int *point, char *css_head);
/*
head �±� �κ� ó���ϴ� �Լ�
target_file : ���� ������ ����
target_size : ���� ������ ������ ���� ������ �ּ�
copy_file	: �� ������ ����������
css_head	: ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��		: ���� 1, ���� 0
*/
int css_head_processing(char **target_file, int *target_size, FILE *copy_file, char *css_head);
/*
�� ���Ͽ� ���� ó��(css ��ũ ����)�� �ϴ� �Լ�
target_dir : ��� ������ ��ġ�� ���丮 ���
css_head   : ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��	   : ���� 0, ���� 1
*/
int css_processing(char *target_dir, char* css_head);
/*
�� ���Ͽ� ���� ó��(css ��ũ ����)�� �ϴ� �Լ�
dir		: ��� �������� ��ġ�� ���丮 ���
num     : ó���� ���� ��ȣ
css_head   : ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��	: ���� 0, ���� 1
*/
int css_converting(char* dir, int num, char* css_head);
/*
css_head.txt ������ �о� ���� css ��ũ �տ� �߰��� ���ڿ��� �������� �Լ�
head	: css ��ũ �տ� �߰��� ���ڿ��� ������ �ּ�
��ȯ �� : ���� 1, ���� 0
*/
int get_css_head(char* head);
/*
html�� css ��ũ�鿡 ���� ���� �����ϴ� �Լ�
*/
void css_link_convert();