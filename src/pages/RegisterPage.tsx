import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, message, Typography, Grid } from 'antd';
import { PhoneOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface RegisterFormValues {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrerPhone, setReferrerPhone] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  useEffect(() => {
    const refId = searchParams.get('ref');
    if (refId) {
      userService.getUserById(refId).then((user) => {
        if (user) {
          setReferrerPhone(user.phone);
          setReferrerName(user.name);
        }
      });
    }
  }, [searchParams]);

  const onFinish = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError('Parollar mos kelmaydi');
      return;
    }

    setLoading(true);
    setError(null);

    const newUser = await userService.createUser({
      name: values.name,
      phone: values.phone,
      password: values.password,
      referrer_phone: referrerPhone || undefined,
    });

    setLoading(false);

    if (newUser) {
      message.success('Ro\'yxatdan o\'tdingiz! Endi tizimga kirishingiz mumkin.');
      navigate('/login');
    } else {
      setError('Ro\'yxatdan o\'tishda xatolik. Telefon raqam allaqachon mavjud bo\'lishi mumkin.');
    }
  };

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
            Ro'yxatdan o'tish
          </Title>
          <Text type="secondary" className="text-xs md:text-sm">
            Yangi hisob yarating
          </Text>
        </div>

        {referrerName && (
          <Alert
            message={`${referrerName} sizni taklif qildi!`}
            description={isMobile ? undefined : "Ro'yxatdan o'tganingizda siz va taklif qiluvchi bonus olasiz."}
            type="success"
            showIcon
            className="mb-3 md:mb-4"
          />
        )}

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-3 md:mb-4"
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size={isMobile ? 'middle' : 'large'}
        >
          <Form.Item
            name="name"
            label="Ism"
            rules={[{ required: true, message: 'Ismingizni kiriting!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Ismingiz"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon raqam"
            rules={[
              { required: true, message: 'Telefon raqamni kiriting!' },
              { pattern: /^\+998\d{9}$/, message: 'Format: +998XXXXXXXXX' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="+998901234567"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: 'Parolni kiriting!' },
              { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parol"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Parolni tasdiqlang"
            rules={[{ required: true, message: 'Parolni tasdiqlang!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parolni qayta kiriting"
            />
          </Form.Item>

          <Form.Item className="!mb-3">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Ro'yxatdan o'tish
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text className="text-xs md:text-sm">Hisobingiz bormi? </Text>
            <a onClick={() => navigate('/login')} className="text-xs md:text-sm">Kirish</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
