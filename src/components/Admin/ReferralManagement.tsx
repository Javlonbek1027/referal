import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Grid, List, Card, Typography, Tabs, Badge, Flex } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ReferralWithUser } from '../../types';
import { referralService } from '../../services/referralService';
import { authService } from '../../services/authService';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const ReferralManagement: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [pendingCount, setPendingCount] = useState(0);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const fetchReferrals = async (status?: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);
    const data = await referralService.getAllReferrals(status as 'pending' | 'approved' | 'rejected' | undefined);
    setReferrals(data);
    setLoading(false);
  };

  const fetchPendingCount = async () => {
    const count = await referralService.getPendingReferralsCount();
    setPendingCount(count);
  };

  useEffect(() => {
    fetchReferrals(activeTab as 'pending' | 'approved' | 'rejected');
    fetchPendingCount();
  }, [activeTab]);

  const handleApprove = async (referralId: string) => {
    const admin = authService.getCurrentUser();
    if (!admin) return;

    const success = await referralService.approveReferral(referralId, admin.id);
    if (success) {
      message.success('Referral tasdiqlandi va mukofot qo\'shildi!');
      fetchReferrals(activeTab as 'pending' | 'approved' | 'rejected');
      fetchPendingCount();
    } else {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleReject = async (referralId: string) => {
    const admin = authService.getCurrentUser();
    if (!admin) return;

    const success = await referralService.rejectReferral(referralId, admin.id);
    if (success) {
      message.success('Referral rad etildi');
      fetchReferrals(activeTab as 'pending' | 'approved' | 'rejected');
      fetchPendingCount();
    } else {
      message.error('Xatolik yuz berdi');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Kutilmoqda</Tag>;
      case 'approved':
        return <Tag icon={<CheckOutlined />} color="success">Tasdiqlangan</Tag>;
      case 'rejected':
        return <Tag icon={<CloseOutlined />} color="error">Rad etilgan</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: ColumnsType<ReferralWithUser> = [
    {
      title: 'Referrer',
      key: 'referrer',
      render: (_, record) => (
        <div>
          <Text strong className="text-sm">{record.referrer_name}</Text>
          <Text type="secondary" className="block text-xs">{record.referrer_phone}</Text>
        </div>
      ),
    },
    {
      title: 'Yangi foydalanuvchi',
      key: 'referral',
      render: (_, record) => (
        <div>
          <Text strong className="text-sm">{record.referral_name}</Text>
          <Text type="secondary" className="block text-xs">{record.referral_phone}</Text>
        </div>
      ),
    },
    {
      title: 'Mukofot',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount: number) => <Tag color="green">{amount.toLocaleString()} UZS</Tag>,
      responsive: ['sm'],
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'),
      responsive: ['md'],
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      responsive: ['sm'],
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space size="small">
            <Popconfirm
              title="Tasdiqlashni xohlaysizmi?"
              description="Referrer hisobiga mukofot qo'shiladi"
              onConfirm={() => handleApprove(record.id)}
              okText="Ha, tasdiqlash"
              cancelText="Bekor"
            >
              <Button type="primary" icon={<CheckOutlined />} size="small">
                {!isMobile && 'Tasdiqlash'}
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Rad etishni xohlaysizmi?"
              onConfirm={() => handleReject(record.id)}
              okText="Ha"
              cancelText="Yo'q"
            >
              <Button danger icon={<CloseOutlined />} size="small">
                {!isMobile && 'Rad etish'}
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Text type="secondary" className="text-xs">
            {record.approved_at && new Date(record.approved_at).toLocaleDateString('uz-UZ')}
          </Text>
        )
      ),
    },
  ];

  const renderMobileItem = (item: ReferralWithUser) => (
    <List.Item>
      <Card size="small" className="w-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-blue-500 text-xs" />
            </div>
            <div>
              <Text strong className="text-xs">{item.referrer_name}</Text>
              <Text type="secondary" className="block text-xs">{item.referrer_phone}</Text>
            </div>
          </div>
          {getStatusTag(item.status)}
        </div>
        
        <div className="bg-gray-50 rounded p-2 mb-2">
          <Text type="secondary" className="text-xs">Yangi foydalanuvchi:</Text>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-green-500 text-xs" />
            </div>
            <div>
              <Text strong className="text-xs">{item.referral_name}</Text>
              <Text type="secondary" className="block text-xs">{item.referral_phone}</Text>
            </div>
          </div>
        </div>

        <Flex justify="space-between" align="center">
          <div>
            <Tag color="green" className="text-xs">{item.reward_amount.toLocaleString()} UZS</Tag>
            <Text type="secondary" className="text-xs ml-2">
              {new Date(item.created_at).toLocaleDateString('uz-UZ')}
            </Text>
          </div>
          
          {item.status === 'pending' && (
            <Space size="small">
              <Popconfirm
                title="Tasdiqlash"
                description="Mukofot qo'shiladi"
                onConfirm={() => handleApprove(item.id)}
                okText="Ha"
                cancelText="Yo'q"
              >
                <Button type="primary" icon={<CheckOutlined />} size="small" />
              </Popconfirm>
              <Popconfirm
                title="Rad etish"
                onConfirm={() => handleReject(item.id)}
                okText="Ha"
                cancelText="Yo'q"
              >
                <Button danger icon={<CloseOutlined />} size="small" />
              </Popconfirm>
            </Space>
          )}
        </Flex>
      </Card>
    </List.Item>
  );

  const tabItems = [
    {
      key: 'pending',
      label: (
        <Badge count={pendingCount} size="small" offset={[10, 0]}>
          <span>Kutilmoqda</span>
        </Badge>
      ),
    },
    {
      key: 'approved',
      label: 'Tasdiqlangan',
    },
    {
      key: 'rejected',
      label: 'Rad etilgan',
    },
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-3"
      />

      {isMobile ? (
        <List
          dataSource={referrals}
          loading={loading}
          renderItem={renderMobileItem}
          pagination={{ pageSize: 5, size: 'small', simple: true }}
          locale={{ emptyText: 'Referrallar topilmadi' }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={referrals}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="middle"
          scroll={{ x: 800 }}
          locale={{ emptyText: 'Referrallar topilmadi' }}
        />
      )}
    </div>
  );
};

export default ReferralManagement;
