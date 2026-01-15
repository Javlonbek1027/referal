import { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import type { User } from '../../types';
import { userService } from '../../services/userService';

interface UserFormModalProps {
  open: boolean;
  user: User | null;
  users: User[];
  onClose: () => void;
}

interface FormValues {
  name: string;
  phone: string;
  password?: string;
  referrer_phone?: string;
  referral_limit: number;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ open, user, users, onClose }) => {
  const [form] = Form.useForm<FormValues>();
  const isEditing = !!user;

  useEffect(() => {
    if (open) {
      if (user) {
        form.setFieldsValue({
          name: user.name,
          phone: user.phone,
          referrer_phone: user.referrer_phone,
          referral_limit: user.referral_limit,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ referral_limit: 5 });
      }
    }
  }, [open, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditing) {
        const success = await userService.updateUser(user.id, {
          name: values.name,
          referrer_phone: values.referrer_phone,
          referral_limit: values.referral_limit,
        });
        if (success) {
          message.success('Foydalanuvchi yangilandi');
          onClose();
        } else {
          message.error('Yangilashda xatolik');
        }
      } else {
        const newUser = await userService.createUser({
          name: values.name,
          phone: values.phone,
          password: values.password || 'user123',
          referrer_phone: values.referrer_phone,
          referral_limit: values.referral_limit,
        });
        if (newUser) {
          message.success('Foydalanuvchi yaratildi');
          onClose();
        } else {
          message.error('Yaratishda xatolik');
        }
      }
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const availableReferrers = users.filter((u) => u.id !== user?.id);

  return (
    <Modal
      title={isEditing ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEditing ? 'Saqlash' : 'Yaratish'}
      cancelText="Bekor qilish"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Ism"
          rules={[{ required: true, message: 'Ismni kiriting!' }]}
        >
          <Input placeholder="Foydalanuvchi ismi" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon raqam"
          rules={[
            { required: true, message: 'Telefon raqamni kiriting!' },
            { pattern: /^\+998\d{9}$/, message: 'Format: +998XXXXXXXXX' },
          ]}
        >
          <Input placeholder="+998901234567" disabled={isEditing} />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: 'Parolni kiriting!' }]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>
        )}

        <Form.Item
          name="referrer_phone"
          label="Referrer (ixtiyoriy)"
        >
          <Select
            placeholder="Referrer tanlang"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {availableReferrers.map((u) => (
              <Select.Option key={u.id} value={u.phone}>
                {u.name} ({u.phone})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="referral_limit"
          label="Referral limiti"
          rules={[{ required: true, message: 'Limitni kiriting!' }]}
        >
          <InputNumber min={1} max={10} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
