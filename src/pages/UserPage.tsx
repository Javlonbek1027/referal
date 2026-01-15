import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { DashboardOutlined, LinkOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import UserDashboard from '../components/User/Dashboard';
import ReferralLink from '../components/User/ReferralLink';
import ReferralList from '../components/User/ReferralList';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const UserPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'referral-link', icon: <LinkOutlined />, label: 'Referral Link' },
    { key: 'referrals', icon: <TeamOutlined />, label: 'Referrallarim' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Chiqish', danger: true },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      setSelectedKey(key);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider theme="light" className="shadow-md" width={280}>
        <div className="p-6 flex flex-col items-center border-b">
          <div className="w-40 h-40 flex items-center justify-center mb-3">
            <img 
              src="/images/logo.svg" 
              alt="Logo" 
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
          <Title level={4} className="!mb-0 text-center">My Dashboard</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          className="border-0"
        />
      </Sider>
      <Layout>
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <Title level={4} className="!mb-0">
            Xush kelibsiz, {user?.name}! 👋
          </Title>
        </Header>
        <Content 
          className="p-6"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            {selectedKey === 'dashboard' && <UserDashboard />}
            {selectedKey === 'referral-link' && <ReferralLink />}
            {selectedKey === 'referrals' && <ReferralList />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPage;
