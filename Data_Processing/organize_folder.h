#pragma once

/*
���� �� index.html�� ������ ��� html �����ϴ� �Լ�
dir		: .html ���ϵ��� �ִ� ��� ���丮
��ȯ �� : ���� 1, ���� 0
*/
int organizing(char *dir);
/*
�迭�� ������ ���Ͽ� ���پ� ���� �Լ�
arr : ������ ���� �迭
idx : �迭�� ũ��
fp  : �� ������ ������
*/
void arr_recode(int* arr, int idx, FILE* fp);
/*
�� ������ ������ �̸����� ���Ͽ� ���� �Լ�
no_file	 : ������ ���� ������ �̸���
no_index : index.html�� ���� ������ �̸���
del_fail : ���� ����µ� ������ ������ �̸���
nf_idx	 : no_file�� ũ��
ni_idx	 : no_index�� ũ��
df_idx	 : del_fail�� ũ��
��ȯ ��	 : ���� 1, ���� 0
*/
int error_recode(int* no_file, int* no_index, int* del_fail, int nf_idx, int ni_idx, int df_idx);
/*
���� �����ϴ� �Լ�
*/
void organize_folder();