import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, Grid, Skeleton } from 'antd';
import { UserOutlined, TeamOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import type { User } from '../../types';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    authService.refreshUser().then((refreshedUser) => {
      if (refreshedUser) {
        setUser(refreshedUser);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton active paragraph={{ rows: 2 }} />
        <Row gutter={[12, 12]} className="mt-4">
          {[1, 2, 3, 4].map((i) => (
            <Col xs={12} sm={12} lg={6} key={i}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const remainingReferrals = user.referral_limit - user.referral_count;

  return (
    <div>
      {/* Profile Card */}
      <Card className="mb-3 md:mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <UserOutlined className="text-xl md:text-2xl text-blue-500" />
          </div>
          <div className="text-center sm:text-left">
            <Title level={isMobile ? 5 : 4} className="!mb-0">{user.name}</Title>
            <Text type="secondary" className="text-sm">{user.phone}</Text>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} lg={6}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Referrallar</span>}
              value={user.referral_count}
              suffix={`/ ${user.referral_limit}`}
              prefix={<TeamOutlined className="text-blue-500" />}
              valueStyle={{ fontSize: isMobile ? 18 : 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Qolgan slotlar</span>}
              value={remainingReferrals}
              valueStyle={{ 
                color: remainingReferrals > 0 ? '#3f8600' : '#cf1322',
                fontSize: isMobile ? 18 : 24
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Jami daromad</span>}
              value={user.reward_balance}
              suffix={isMobile ? '' : 'UZS'}
              prefix={<DollarOutlined className="text-green-500" />}
              formatter={(value) => `${Number(value).toLocaleString()}`}
              valueStyle={{ fontSize: isMobile ? 16 : 24 }}
            />
            {isMobile && <Text type="secondary" className="text-xs">UZS</Text>}
          </Card>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            <Statistic
              title={<span className="text-xs md:text-sm">Ro'yxatdan</span>}
              value={new Date(user.created_at).toLocaleDateString('uz-UZ')}
              prefix={<CalendarOutlined className="text-purple-500" />}
              valueStyle={{ fontSize: isMobile ? 14 : 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* How it works */}
      <Card className="mt-3 md:mt-4">
        <Title level={5} className="!mb-2 md:!mb-3">Qanday ishlaydi?</Title>
        <ol className="list-decimal list-inside space-y-1 md:space-y-2 text-gray-600 text-sm md:text-base">
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
