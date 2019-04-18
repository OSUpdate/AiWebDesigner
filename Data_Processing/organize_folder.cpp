#include "super_header.h"

// �۾� �� html ó���� ������ ���� �̸�
#define START 1
#define END   342

int organizing(char *dir) {
	_finddata_t fd;
	long handle;
	int result = 1;
	int ret_val = 1;

	// ������ ���� �� ��� .html ã��
	char buf[300] = { 0 };
	sprintf(buf, "%s%s", dir, "*.html");
	handle = _findfirst(buf, &fd);

	// ���� �� ������ ���� ��
	if (handle == -1)
	{
		printf("%s: There were no files\n", buf);
		return 0;
	}

	// �ݺ��ϸ� ��� ���Ͽ� ���� ����
	char html_file[300] = { 0 };
	while (result != -1)
	{
		// ���� ������ ��ü ��� �����
		sprintf(html_file, "%s%s%s", dir, "\\", fd.name);

		// index.html�� �ƴ϶�� �����ϱ�
		if (!isEqual(0, fd.name, "index.html")) {
			if (!delete_file(html_file)) {
				printf("remove() error: %s\n", fd.name);
				// �����߻��ϸ� ��ȯ���� 0���� �ٲٱ�
				ret_val = 0;
			}
		}

		// ���� ���� ����Ű��
		result = _findnext(handle, &fd);
	}

	// ������
	_findclose(handle);
	return ret_val;
}

void organize_folder() {
	system("cls");

	// ��� �������� �����ϴ� ���丮 ����
	char dir[200];
	if (!getTargetDir(dir)) {
		system("pause");
		return;
	}

	// ��� ������ ���� ���� ���� ����
	char target[200];
	for (int i = START; i < END + 1; i++) {
		// ������ ���� �̸� �����
		sprintf(target, "%s%s%d%s", dir, "\\", i, "\\");
		// ���� ����
		if (!organizing(target)) {
			system("pause");
		}
		else
			printf("%d: complete\n", i);
	}

	// �������� ������
	printf("organizing Complete\n");
	system("pause");
}