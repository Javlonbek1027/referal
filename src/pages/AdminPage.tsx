import { useState } from 'react';
import { Layout, Menu, Typography, Button, Drawer, Grid } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  TransactionOutlined, 
  LogoutOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import UserManagement from '../components/Admin/UserManagement';
import RewardSettingsModal from '../components/Admin/RewardSettingsModal';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const AdminPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('users');
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // Mobile: xs, sm | Desktop: md, lg, xl, xxl
  const isMobile = !screens.md;

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
    setMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    switch (selectedKey) {
      case 'users': return 'Foydalanuvchilar boshqaruvi';
      case 'transactions': return 'Tranzaksiyalar';
      default: return 'Admin Panel';
    }
  };

  // Sidebar content - reusable for both desktop and mobile
  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-6 flex flex-col items-center border-b">
        <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center mb-2 md:mb-3">
          <img 
            src="/images/logo.svg" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <Title level={5} className="!mb-0 text-center">Admin Panel</Title>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        className="border-0"
      />
    </>
  );

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider 
          theme="light" 
          className="shadow-md hidden md:block" 
          width={260}
          style={{ 
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <SidebarContent />
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title={null}
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        bodyStyle={{ padding: 0 }}
        className="md:hidden"
      >
        <SidebarContent />
      </Drawer>

      <Layout style={{ marginLeft: isMobile ? 0 : 260 }}>
        <Header 
          className="bg-white shadow-sm px-4 md:px-6 flex items-center justify-between"
          style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 10,
            height: 'auto',
            minHeight: 64,
            padding: '12px 16px'
          }}
        >
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                size="large"
              />
            )}
            <Title level={5} className="!mb-0 truncate" style={{ maxWidth: isMobile ? 200 : 'none' }}>
              {getPageTitle()}
            </Title>
          </div>
        </Header>
        <Content 
          className="p-3 md:p-6"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 md:p-6 shadow-lg">
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
