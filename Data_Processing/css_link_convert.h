#pragma once

/*
link �±� �κ� ó���ϴ� �Լ�
link_tag  : ó���� <link> �±��� ���� ��ġ('<' ��ġ)
len		  : <link> �±��� ����
copy_file : �� ������ ����������
css_head  : ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��	  :���� 1, ���� 0
*/
int link_processing(char *link_tag, int len, FILE *copy_file, char *css_head);
/*
<link> ���� �˻縦 �ϰ� ó���� �ϴ� �Լ�
target_file : ��� ����
target_size : ��� ������ ũ��
copy_file	: ��������� ������ ������ ������ ����������
index		: ��� ���Ͽ��� ���� ó������ ��ġ
point		: ��� ���Ͽ��� ���� ���� ó���� ���� ���� ��ġ
css_head	: ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��		: ���� 1, ���� 0
*/
int find_link(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head);
/*
style �±� �κ� ó���ϴ� �Լ�
style_tag : ó���� <style> �±��� ���� ��ġ('<' ��ġ)
len		  : <style> �±��� ����
copy_file : �� ������ ����������
css_head  : ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��	  :���� 1, ���� 0
*/
int style_processing(char *style_tag, int len, FILE *copy_file, char *css_head);
/*
<style> ���� �˻縦 �ϰ� ó���� �ϴ� �Լ�
target_file : ��� ����
target_size : ��� ������ ũ��
copy_file	: ��������� ������ ������ ������ ����������
index		: ��� ���Ͽ��� ���� ó������ ��ġ
point		: ��� ���Ͽ��� ���� ���� ó���� ���� ���� ��ġ
css_head	: ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��		: ���� 1, ���� 0
*/
int find_style(char *target_file, int target_size, FILE *copy_file, int *index, int *point, char *css_head);
/*
head �±� �κ� ó���ϴ� �Լ�
target_file : ���� ������ ����
target_size : ���� ������ ����
copy_file	: �� ������ ����������
index		: ���� ���Ͽ��� ������ �ô��� ����ϴ� ������ �ּ�
css_head	: ���� css ��ũ �տ� �߰��ؾ� �� ���ڿ�
��ȯ ��		: ���� 1, ���� 0
*/
int css_head_processing(char *target_file, int target_size, FILE *copy_file, int *index, char *css_head);
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