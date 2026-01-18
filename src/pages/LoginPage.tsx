import { Card, Typography, Grid } from 'antd';
import LoginForm from '../components/Auth/LoginForm';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const LoginPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'transparent'
      }}
    >
      <Card 
        className="w-full shadow-2xl"
        style={{ maxWidth: isMobile ? '100%' : 420 }}
        bodyStyle={{ padding: isMobile ? 16 : 24 }}
      >
        <div className="text-center mb-4 md:mb-6">
          <div 
            className="mx-auto mb-3 md:mb-4 flex items-center justify-center"
            style={{ 
              width: isMobile ? 100 : 140, 
              height: isMobile ? 100 : 140 
            }}
          >
            <img 
              src="/images/logo1.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <Title level={isMobile ? 4 : 3} className="!mb-1 md:!mb-2">
            Referral Market System
          </Title>
          <Typography.Text type="secondary" className="text-xs md:text-sm">
            Tizimga kirish uchun telefon raqam va parolni kiriting
          </Typography.Text>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
