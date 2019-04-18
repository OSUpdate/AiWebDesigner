#include "super_header.h"

void rename_data() {
	system("cls");

	_finddata_t fd;
	long handle;
	int result = 1;

	// ��� �����͵��� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// rename �Ҷ� ������ ���� ����
	int num = get_first_file_name();
	if (!num) {
		system("pause");
		return;
	}

	// ������ ���� �� ��� ���� ã��
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "\\*");
	handle = _findfirst(buf, &fd);

	// ���� �� ������ ���� ��
	if (handle == -1)
	{
		printf("%s: There were no files\n", buf);
		system("pause");
		return;
	}

	// �ݺ��ϸ� ��� ���Ͽ� ���� ����
	char old_name[300] = { 0 };
	char new_name[300] = { 0 };
	int ck = 1;
	int count = 2;
	while (result != -1)
	{
		// . �� .. �� �����ϱ�
		if (count) {
			if (isEqual(0, fd.name, ".") || isEqual(0, fd.name, "..")) {
				ck = 0;
				count--;
			}
			else
				ck = 1;
		}
		else
			ck = 1;

		// ���� ������ �̸���, ���� ������ �̸� �����
		sprintf(old_name, "%s%s%s", dir, "\\", fd.name);
		sprintf(new_name, "%s%s%d", dir, "\\", num);
		
		// �̸� �ٲٱ�
		if (ck) {
			if (!rename_file(old_name, new_name)) {
				printf("Rename failed: %s to %s\n", old_name, new_name);
			}
			num++;
		}
		
		// ���� ���� ����Ű��
		result = _findnext(handle, &fd);
	}

	// ���������� rename�� ������ �̸� +1�� data.txt�� ���
	if (!write_last_file_name(num)) {
		system("pause");
		return;
	}

	// �������� ������
	printf("Rename Complete\n");
	system("pause");
	_findclose(handle);
}