/**
 * Created by lenovo on 2016/4/27.
 */

exports.orderClasses = function () {
    return [
        {value: 0, name: 'ͼ��', child: [
            {value: 00, name: '��ѧ����', child: []},
            {value: 01, name: '��־���', child: []},
            {value: 02, name: '����', child: []},
            {value: 03, name: '�̲�', child: [
                {value: 001, name: '������', child: []},
                {value: 002, name: '����ý�弼��', child: []},
                {value: 003, name: '��������ѧ', child: []},
                {value: 004, name: '�������', child: []},
                {value: 005, name: '���ѧ', child: []},
                {value: 006, name: 'Ӧ������ѧ', child: []}
            ]},
        ]},
        {value: 1, name: '��װ', child: [
            {value: 10, name: 'Ůװ', child: []},
            {value: 11, name: '��װ', child: []},
            {value: 12, name: 'Ьѥ', child: []}
        ]},
        {value: 2, name: '��ʳ', child: [
            {value: 20, name: '�ܱ�', child: []},
            {value: 21, name: '���С��', child: []},
            {value: 22, name: '������', child: []},
            {value: 23, name: '�պ�����', child: []},
            {value: 24, name: '����', child: []},
            {value: 25, name: '�ط���', child: []},
            {value: 26, name: '����', child: []}
        ]},
        {value: 3, name: '����ѧϰ��Ʒ', child: []},
        {value: 4, name: '��Ʒ����', child: []},
        {value: 5, name: '�˶�����', child: []},
        {value: 6, name: '����', child: []}
    ]
};