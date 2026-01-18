import { useState, useEffect } from 'react';
import { Card, Table, Statistic, Row, Col, Empty, Grid, List, Typography, Tag } from 'antd';
import { TeamOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, Referral } from '../../types';
import { authService } from '../../services/authService';
import { referralService } from '../../services/referralService';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface ReferralWithUser extends Referral {
  referral_name?: string;
  referral_phone?: string;
}

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

  const totalEarned = referrals.reduce((sum, r) => sum + r.reward_amount, 0);

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
      title: 'Mukofot',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount: number) => (
        <Tag color="green">{amount.toLocaleString()} UZS</Tag>
      ),
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mobile List Item Renderer
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
          <Tag color="green" className="text-xs">
            {item.reward_amount.toLocaleString()} UZS
          </Tag>
        </div>
        <Text type="secondary" className="text-xs">
          {new Date(item.created_at).toLocaleDateString('uz-UZ')}
        </Text>
      </div>
    </List.Item>
  );

  return (
    <div>
      {/* Statistics */}
      <Row gutter={[12, 12]} className="mb-3 md:mb-4">
        <Col xs={12} sm={12}>
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
        <Col xs={12} sm={12}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Jami daromad</span>}
              value={totalEarned}
              suffix={isMobile ? '' : 'UZS'}
              prefix={<DollarOutlined className="text-green-500" />}
              formatter={(value) => `${Number(value).toLocaleString()}`}
              valueStyle={{ fontSize: isMobile ? 16 : 24 }}
            />
            {isMobile && <Text type="secondary" className="text-xs">UZS</Text>}
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
          // Mobile: Use List component
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
          // Desktop: Use Table component
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
