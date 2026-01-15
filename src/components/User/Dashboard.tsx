import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { UserOutlined, TeamOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import type { User } from '../../types';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Refresh user data
    authService.refreshUser().then((refreshedUser) => {
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const remainingReferrals = user.referral_limit - user.referral_count;

  return (
    <div>
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-2xl text-blue-500" />
          </div>
          <div>
            <Title level={4} className="!mb-0">{user.name}</Title>
            <Text type="secondary">{user.phone}</Text>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Referrallar"
              value={user.referral_count}
              suffix={`/ ${user.referral_limit}`}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Qolgan slotlar"
              value={remainingReferrals}
              valueStyle={{ color: remainingReferrals > 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Jami daromad"
              value={user.reward_balance}
              suffix="UZS"
              prefix={<DollarOutlined />}
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ro'yxatdan o'tgan"
              value={new Date(user.created_at).toLocaleDateString('uz-UZ')}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Title level={5}>Qanday ishlaydi?</Title>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Referral linkingizni do'stlaringizga yuboring</li>
          <li>Do'stlaringiz ro'yxatdan o'tganda siz mukofot olasiz</li>
          <li>Har bir referral uchun belgilangan summa hisobingizga tushadi</li>
          <li>Balansni admin orqali yechib olishingiz mumkin</li>
        </ol>
      </Card>
    </div>
  );
};

export default UserDashboard;
