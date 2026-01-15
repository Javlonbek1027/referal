import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, message, Typography } from 'antd';
import { PhoneOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';

const { Title, Text } = Typography;

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

  useEffect(() => {
    const refId = searchParams.get('ref');
    if (refId) {
      // Fetch referrer info
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
          <Title level={2} className="!mb-2">Ro'yxatdan o'tish</Title>
          <Text type="secondary">
            Yangi hisob yarating
          </Text>
        </div>

        {referrerName && (
          <Alert
            message={`${referrerName} sizni taklif qildi!`}
            description="Ro'yxatdan o'tganingizda siz va taklif qiluvchi bonus olasiz."
            type="success"
            showIcon
            className="mb-4"
          />
        )}

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Ro'yxatdan o'tish
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text>Hisobingiz bormi? </Text>
            <a onClick={() => navigate('/login')}>Kirish</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
