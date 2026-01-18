import { useState } from 'react';
import { Form, Input, Button, Alert, message, Grid, Typography } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface LoginFormValues {
  phone: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    const result = await authService.login(values.phone, values.password);

    setLoading(false);

    if (result.success && result.user) {
      message.success('Muvaffaqiyatli kirildi!');
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      setError(result.error || 'Kirish xatosi');
    }
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      layout="vertical"
      size={isMobile ? 'middle' : 'large'}
    >
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

      <Form.Item
        name="phone"
        label={<span className="text-sm">Telefon raqam</span>}
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
        label={<span className="text-sm">Parol</span>}
        rules={[{ required: true, message: 'Parolni kiriting!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Parol"
        />
      </Form.Item>

      <Form.Item className="!mb-3">
        <Button type="primary" htmlType="submit" loading={loading} block>
          Kirish
        </Button>
      </Form.Item>

      <div className="text-center mb-3">
        <Text className="text-xs md:text-sm">Hisobingiz yo'qmi? </Text>
        <a onClick={() => navigate('/register')} className="text-xs md:text-sm">Ro'yxatdan o'tish</a>
      </div>

      <Alert
        message={<span className="text-xs md:text-sm font-medium">Demo ma'lumotlar</span>}
        description={
          <div className="text-xs md:text-sm">
            <p><strong>Admin:</strong> +998901234567 / admin123</p>
            <p><strong>User:</strong> +998901234568 / user123</p>
          </div>
        }
        type="info"
        showIcon
      />
    </Form>
  );
};

export default LoginForm;
