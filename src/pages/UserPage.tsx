import { useState } from 'react';
import { Layout, Menu, Typography, Button, Drawer, Grid } from 'antd';
import { 
  DashboardOutlined, 
  LinkOutlined, 
  TeamOutlined, 
  LogoutOutlined,
  MenuOutlined,
  ShoppingOutlined,
  ShopOutlined,
  FileTextOutlined,
  BookOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import UserDashboard from '../components/User/Dashboard';
import ReferralLink from '../components/User/ReferralLink';
import ReferralList from '../components/User/ReferralList';
import ComingSoon from '../components/User/ComingSoon';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const UserPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const screens = useBreakpoint();

  // Mobile: xs, sm | Desktop: md, lg, xl, xxl
  const isMobile = !screens.md;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'referral-link', icon: <LinkOutlined />, label: 'Referral Link' },
    { key: 'referrals', icon: <TeamOutlined />, label: 'Referrallarim' },
    { key: 'products', icon: <ShoppingOutlined />, label: 'Mahsulotlar' },
    { key: 'stores', icon: <ShopOutlined />, label: "Do'konlarimiz" },
    { key: 'info', icon: <FileTextOutlined />, label: "Ma'lumotlar" },
    { key: 'guides', icon: <BookOutlined />, label: "Qo'llanmalar" },
    { key: 'contact', icon: <PhoneOutlined />, label: "Aloqa uchun" },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Chiqish', danger: true },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogout();
    } else {
      setSelectedKey(key);
    }
    setMobileMenuOpen(false);
  };

  // Sidebar content - reusable for both desktop and mobile
  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-6 flex flex-col items-center border-b">
        <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center mb-2 md:mb-3">
          <img 
            src="/images/logo1.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <Title level={5} className="!mb-0 text-center">My Dashboard</Title>
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
    <Layout className="min-h-screen" style={{ background: 'transparent' }}>
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

      <Layout style={{ marginLeft: isMobile ? 0 : 260, background: 'transparent' }}>
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
            <div className="truncate" style={{ maxWidth: isMobile ? 200 : 'none' }}>
              <Title level={5} className="!mb-0">
                Xush kelibsiz{!isMobile && `, ${user?.name}`}! 👋
              </Title>
              {isMobile && user?.name && (
                <Text type="secondary" className="text-xs">{user.name}</Text>
              )}
            </div>
          </div>
        </Header>
        <Content 
          className="p-3 md:p-6"
          style={{
            background: 'transparent',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 md:p-6 shadow-lg">
            {selectedKey === 'dashboard' && <UserDashboard />}
            {selectedKey === 'referral-link' && <ReferralLink />}
            {selectedKey === 'referrals' && <ReferralList />}
            {selectedKey === 'products' && <ComingSoon title="Mahsulotlar" description="Tez orada" />}
            {selectedKey === 'stores' && <ComingSoon title="Do'konlarimiz" description="Tez orada" />}
            {selectedKey === 'info' && <ComingSoon title="Ma'lumotlar" description="Tez orada" />}
            {selectedKey === 'guides' && <ComingSoon title="Qo'llanmalar" description="Tez orada" />}
            {selectedKey === 'contact' && <ComingSoon title="Aloqa uchun" description="Tez orada" />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPage;
