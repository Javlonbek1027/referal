import { Card, Typography } from 'antd';
import LoginForm from '../components/Auth/LoginForm';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/images/logo.svg" 
              alt="Logo" 
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
          <Title level={2} className="!mb-2">Referral Market System</Title>
          <Typography.Text type="secondary">
            Tizimga kirish uchun telefon raqam va parolni kiriting
          </Typography.Text>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
