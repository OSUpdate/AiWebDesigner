#pragma once

/*
������ ��ȿ�� Ȯ���� ���� ������ ���� ������ �������� �Լ�
file_p	  : ������ ������ ����� �޸��� �ּ�
file_size : ������ ũ�Ⱑ ����� �޸��� �ּ�
file_name : ������ Ȯ���� �޸��� �ּ�
��ȯ ��	  : ���� 0, ���� 1
*/
int file_open_for_check(char** file_p, int* file_size, char* file_name);
/*
�� �±׿� ���� Ȯ�� �� ó���ϴ� �Լ�
tag		: �±��� ��������
tag_len : �±��� ����
ck		: �±׿� ���� ������ �迭
��ȯ �� : ���� 0, ���� 1;
*/
int tag_checking(char* tag, int tag_len, int* ck);
/*
html ���Ͽ� ���� ���� data���� Ȯ���ϴ� �Լ�
file	: �˻��� html ������ ����
size	: html ������ ũ��
��ȯ �� : �� ������ ���� �� define �� ���� ��ȯ
*/
int html_check(char* file, int size);
/*
������ ��ȿ���� Ȯ���ϴ� �Լ�
file_name : ��� Ȯ���� ������ �̸�
��ȯ ��	  : ���� 1, ���� - �����ڵ� ��
*/
int checking(char* file_name);
/*
���� �˻� �� ������ ����Ʈ�� �ؽ�Ʈ ���Ͽ� �������ִ� �Լ�
no_index : ������ ���� ������ �̸���
empty	 : index.html�� ���� ������ �̸���
not_html : ���� ����µ� ������ ������ �̸���
no_idx	 : no_file�� ũ��
emp		 : no_index�� ũ��
n_html	 : del_fail�� ũ��
��ȯ ��	 : ���� 1, ���� 0
*/
int error_recode_for_check(int* no_index, int* empty, int* not_html, int no_idx, int emp, int n_html);
/*
������ ��ȿ���� �˻��ϴ� �Լ�
*/
void file_check();