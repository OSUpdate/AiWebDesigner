#pragma once

/*
dir�� ������ ���丮 ���� index.html, origin.html�� ����
index.html�� �����ϰ�, origin.html�� index.html�� �ٲٴ� �Լ�

dir		: �۾��� ������ ���
��ȯ �� : ���� 1, ���� 0
*/
int delete_and_rename(char *dir);

/*
index.html�� �����ϰ�
origin.html�� index.html���� �ǵ����� �Լ�
*/
void roll_back();