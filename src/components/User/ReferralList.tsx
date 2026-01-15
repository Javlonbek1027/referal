import { useState, useEffect } from 'react';
import { Card, Table, Statistic, Row, Col, Empty } from 'antd';
import { TeamOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, Referral } from '../../types';
import { authService } from '../../services/authService';
import { referralService } from '../../services/referralService';

interface ReferralWithUser extends Referral {
  referral_name?: string;
  referral_phone?: string;
}

const ReferralList: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<ReferralWithUser[]>([]);
  const [loading, setLoading] = useState(false);

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
    },
    {
      title: 'Ro\'yxatdan o\'tgan',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'),
    },
    {
      title: 'Mukofot',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount: number) => `${amount.toLocaleString()} UZS`,
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Jami referrallar"
              value={referrals.length}
              suffix={`/ ${user.referral_limit}`}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Jami daromad"
              value={totalEarned}
              suffix="UZS"
              prefix={<DollarOutlined />}
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Referrallar ro'yxati">
        {referrals.length === 0 && !loading ? (
          <Empty
            description="Hali referrallar yo'q"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={referrals}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ReferralList;
