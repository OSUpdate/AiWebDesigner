#include "super_header.h"

int main() {
	int num, ck_input, ck_function;

	//�޴� �׸� ���� ���ѹݺ�
	while (1) {
		//�޴� �����ֱ�
		showMenu();
		//�׸� ���ùޱ�
		printf(" choice > ");
		ck_input = getNumber(&num);

		//getNumber ����� ���� ó��
		if (ck_input) {
			//�Է� �׸� ���� �Լ� ȣ��
			ck_function = function_call(num);
			//��ȯ���� 0�̶�� �׸� �� ���ڰ� �Էµ� ��
			if (!ck_function) {
				system("cls");
				printf(" *** Wrong input *** \n\n");
			}
			else
				system("cls");
		}
		else {
			system("cls");
			printf(" *** Wrong input *** \n\n");
		}
	}

	return 0;
}