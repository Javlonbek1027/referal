import { useState, useEffect } from 'react';
import { Card, Table, Statistic, Row, Col, Empty, Grid, List, Typography, Tag } from 'antd';
import { TeamOutlined, UserOutlined, ClockCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, ReferralWithUser } from '../../types';
import { authService } from '../../services/authService';
import { referralService } from '../../services/referralService';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const ReferralList: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<ReferralWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      fetchReferrals(currentUser.id);
    }
  }, []);

  const fetchReferrals = async (userId: string) => {
    setLoading(true);
    const data = await referralService.getReferralsByUserId(userId);
    setReferrals(data);
    setLoading(false);
  };

  // Faqat tasdiqlangan referrallar uchun daromad
  const totalEarned = referrals
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.reward_amount, 0);

  // Kutilayotgan mukofot
  const pendingReward = referrals
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.reward_amount, 0);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="warning" className="text-xs">Kutilmoqda</Tag>;
      case 'approved':
        return <Tag icon={<CheckOutlined />} color="success" className="text-xs">Tasdiqlangan</Tag>;
      case 'rejected':
        return <Tag icon={<CloseOutlined />} color="error" className="text-xs">Rad etilgan</Tag>;
      default:
        return <Tag className="text-xs">{status}</Tag>;
    }
  };

  const columns: ColumnsType<ReferralWithUser> = [
    {
      title: 'Ism',
      dataIndex: 'referral_name',
      key: 'referral_name',
      render: (name: string) => name || 'Noma\'lum',
    },
    {
      title: 'Telefon',
      dataIndex: 'referral_phone',
      key: 'referral_phone',
      render: (phone: string) => phone || '-',
      responsive: ['md'],
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'),
      responsive: ['sm'],
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Mukofot',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount: number, record) => (
        <Text type={record.status === 'approved' ? 'success' : 'secondary'}>
          {amount.toLocaleString()} UZS
        </Text>
      ),
    },
  ];

  const renderMobileItem = (item: ReferralWithUser) => (
    <List.Item>
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserOutlined className="text-blue-500 text-sm" />
            </div>
            <div>
              <Text strong className="text-sm">{item.referral_name || 'Noma\'lum'}</Text>
              <Text type="secondary" className="block text-xs">{item.referral_phone || '-'}</Text>
            </div>
          </div>
          {getStatusTag(item.status)}
        </div>
        <div className="flex justify-between items-center mt-2">
          <Text type="secondary" className="text-xs">
            {new Date(item.created_at).toLocaleDateString('uz-UZ')}
          </Text>
          <Text type={item.status === 'approved' ? 'success' : 'secondary'} className="text-xs font-medium">
            {item.reward_amount.toLocaleString()} UZS
          </Text>
        </div>
      </div>
    </List.Item>
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Statistics */}
      <Row gutter={[12, 12]} className="mb-3 md:mb-4">
        <Col xs={12} sm={8}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Jami referrallar</span>}
              value={referrals.length}
              suffix={`/ ${user.referral_limit}`}
              prefix={<TeamOutlined className="text-blue-500" />}
              valueStyle={{ fontSize: isMobile ? 18 : 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Olingan daromad</span>}
              value={totalEarned}
              suffix={isMobile ? '' : 'UZS'}
              prefix={<CheckOutlined className="text-green-500" />}
              formatter={(value) => `${Number(value).toLocaleString()}`}
              valueStyle={{ fontSize: isMobile ? 16 : 24, color: '#52c41a' }}
            />
            {isMobile && <Text type="secondary" className="text-xs">UZS</Text>}
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Kutilayotgan mukofot</span>}
              value={pendingReward}
              suffix={isMobile ? '' : 'UZS'}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              formatter={(value) => `${Number(value).toLocaleString()}`}
              valueStyle={{ fontSize: isMobile ? 16 : 24, color: '#faad14' }}
            />
            {isMobile && <Text type="secondary" className="text-xs">UZS</Text>}
            {pendingReward > 0 && (
              <Text type="secondary" className="block text-xs mt-1">
                Admin tasdiqlashini kutmoqda
              </Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Referrals List/Table */}
      <Card 
        title={<span className="text-sm md:text-base">Referrallar ro'yxati</span>}
        bodyStyle={{ padding: isMobile ? 8 : 24 }}
      >
        {referrals.length === 0 && !loading ? (
          <Empty
            description="Hali referrallar yo'q"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : isMobile ? (
          <List
            dataSource={referrals}
            loading={loading}
            renderItem={renderMobileItem}
            pagination={{
              pageSize: 5,
              size: 'small',
              simple: true,
            }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={referrals}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
};

export default ReferralList;
