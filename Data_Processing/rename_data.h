#pragma once

/*
dir�� ������ ���丮�� ��� �׸��� �̸��� �迭�� �������ִ� �Լ�
fname	: ��� �׸��� �̸��� ������ 2���� �迭
dir		: �׸���� ������ �ִ� ���丮�� ���
idx		: �׸��� ������ ������ ������ �ּ�
��ȯ �� : ���� 0, ���� 1
*/
int get_fname_list(char** fname, char* dir, int* idx);
/*
char�� 2���� �迭�� �����Ҵ� �޾��ִ� �Լ�
fnames_p : �����Ҵ� ���� �޸��� �ּ�
height	 : ����(���� ����)
width	 : �ʺ�(���� ����)
��ȯ ��	 : ���� 0, ���� 1
*/
int malloc_2d(char*** fnames_p, int height, int width);
/*
���ϵ��� �̸��� �������ִ� �Լ�
*/
void rename_data();