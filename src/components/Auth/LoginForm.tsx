import { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface LoginFormValues {
  phone: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      size="large"
    >
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
        rules={[{ required: true, message: 'Parolni kiriting!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Parol"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Kirish
        </Button>
      </Form.Item>

      <Alert
        message="Demo ma'lumotlar"
        description={
          <div className="text-sm">
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
