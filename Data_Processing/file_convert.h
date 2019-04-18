#pragma once

/*
target_file : ��� ������ ������ ������ �޸��� �ּ�
target_size : ��� ������ ũ�⸦ ������ �޸��� �ּ�
copy_file   : ������ ������ ���������͸� ������ �޸��� �ּ�
target_dir  : ��� ������ �ִ� ���
��ȯ ��		: ���� 0, ���� 1
*/
int file_open(char **target_file, int *target_size, FILE **copy_file, char *target_dir);
/*
</head>���� Ȯ���ϴ� �Լ�
target_file : ���� ó������ ������ ����
target_size : ���� ó������ ������ ����
index		: ���� ���Ͽ��� ó������ ��ġ�� �����ϴ� ������ �ּҰ�
��ȯ ��		: </head>��� 1, �ƴϸ� 0
*/
int find_end_of_head(char *target_file, int target_size, int *index);
/*
link �±��� href="~~" �Ӽ� �� ~~�� ��ġ ã��
link_tag : link �±��� ���� �ּ�
len		 : link �±� �κ��� ����
start	 : href �Ӽ��� ������ �����ϴ� ��ġ
end		 : href �Ӽ��� ������ ������ ��ġ
��ȯ ��  : href �Ӽ� ������ 1, ������ 0
*/
int find_href_position(char *link_tag, int len, int *start, int *end);
/*
<script> ���� �˻縦 �ϰ� ó���� �ϴ� �Լ�
target_file : ��� ����
target_size : ��� ������ ũ��
copy_file	: ��������� ������ ������ ������ ����������
index		: ��� ���Ͽ��� ���� ó������ ��ġ
point		: ��� ���Ͽ��� ���� ���� ó���� ���� ���� ��ġ
��ȯ ��		: ���� 1, ���� 0
*/
int find_script(char *target_file, int target_size, FILE *copy_file, int *index, int *point);
/*
head �±� �κ� ó���ϴ� �Լ�
target_file : ���� ������ ����
target_size : ���� ������ ����
copy_file	: �� ������ ����������
index		: ���� ���Ͽ��� ������ �ô��� ����ϴ� ������ �ּ�
��ȯ ��		: ���� 1, ���� 0
*/
int head_processing(char *target_file, int target_size, FILE *copy_file, int *index);
/*
a �±� �κ� ó���ϴ� �Լ�
a_tag	  : ó���� <a> �±��� ���� ��ġ('<' ��ġ)
len		  : <a> �±��� ����
copy_file : �� ������ ����������
��ȯ ��	  :���� 1, ���� 0
*/
int a_processing(char *a_tag, int len, FILE *copy_file);
/*
<a> ���� �˻縦 �ϰ� ó���� �ϴ� �Լ�
target_file : ��� ����
target_size : ��� ������ ũ��
copy_file	: ��������� ������ ������ ������ ����������
index		: ��� ���Ͽ��� ���� ó������ ��ġ
point		: ��� ���Ͽ��� ���� ���� ó���� ���� ���� ��ġ
��ȯ ��		: ���� 1, ���� 0
*/
int find_a(char *target_file, int target_size, FILE *copy_file, int *index, int *point);
/*
body �κ�(������ �κ�) ó���ϴ� �Լ�
target_file : ���� ������ ����
target_size : ���� ������ ����
copy_file	: �� ������ ����������
index		: head �±� ���� �κ��� ���� ��ġ
��ȯ ��		: ���� 1, ���� 0
*/
int body_processing(char *target_file, int target_size, FILE *copy_file, int index);
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
html �������� �����ϴ� �Լ�
*/
void file_convert();