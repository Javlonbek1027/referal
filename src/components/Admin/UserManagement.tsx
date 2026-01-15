import { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../../types';
import { userService } from '../../services/userService';
import UserFormModal from './UserFormModal';
import UserDetailsDrawer from './UserDetailsDrawer';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await userService.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const success = await userService.deleteUser(id);
    if (success) {
      message.success('Foydalanuvchi o\'chirildi');
      fetchUsers();
    } else {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText)
  );

  const columns: ColumnsType<User> = [
    {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Referrallar',
      key: 'referrals',
      render: (_, record) => (
        <span>
          {record.referral_count} / {record.referral_limit}
        </span>
      ),
    },
    {
      title: 'Balans',
      dataIndex: 'reward_balance',
      key: 'reward_balance',
      render: (balance: number) => `${balance.toLocaleString()} UZS`,
      sorter: (a, b) => a.reward_balance - b.reward_balance,
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Yangi foydalanuvchi
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <UserFormModal
        open={modalOpen}
        user={editingUser}
        users={users}
        onClose={handleModalClose}
      />

      <UserDetailsDrawer
        open={drawerOpen}
        user={selectedUser}
        onClose={() => setDrawerOpen(false)}
        onRefresh={fetchUsers}
      />
    </div>
  );
};

export default UserManagement;
