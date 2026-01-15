import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { UserOutlined, SettingOutlined, TransactionOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import UserManagement from '../components/Admin/UserManagement';
import RewardSettingsModal from '../components/Admin/RewardSettingsModal';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('users');
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { key: 'users', icon: <UserOutlined />, label: 'Foydalanuvchilar' },
    { key: 'rewards', icon: <SettingOutlined />, label: 'Mukofot sozlamalari' },
    { key: 'transactions', icon: <TransactionOutlined />, label: 'Tranzaksiyalar' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Chiqish', danger: true },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'rewards') {
      setRewardModalOpen(true);
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
          <Title level={4} className="!mb-0 text-center">Admin Panel</Title>
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
            {selectedKey === 'users' && 'Foydalanuvchilar boshqaruvi'}
            {selectedKey === 'transactions' && 'Tranzaksiyalar'}
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
            {selectedKey === 'users' && <UserManagement />}
            {selectedKey === 'transactions' && <div>Tranzaksiyalar ro'yxati (Coming Soon)</div>}
          </div>
        </Content>
      </Layout>
      <RewardSettingsModal open={rewardModalOpen} onClose={() => setRewardModalOpen(false)} />
    </Layout>
  );
};

export default AdminPage;
