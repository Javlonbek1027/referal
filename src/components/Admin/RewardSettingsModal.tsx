import { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Alert, message, Spin } from 'antd';
import type { RewardSettings } from '../../types';
import { rewardService } from '../../services/rewardService';

interface RewardSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const RewardSettingsModal: React.FC<RewardSettingsModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState<RewardSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    setLoading(true);
    const data = await rewardService.getRewardSettings();
    setSettings(data);
    if (data) {
      form.setFieldsValue({ reward_per_referral: data.reward_per_referral });
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const success = await rewardService.updateRewardSettings(values.reward_per_referral);
      setSaving(false);
      if (success) {
        message.success('Sozlamalar yangilandi');
        onClose();
      } else {
        message.error('Yangilashda xatolik');
      }
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  return (
    <Modal
      title="Mukofot sozlamalari"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Saqlash"
      cancelText="Bekor qilish"
      confirmLoading={saving}
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="reward_per_referral"
            label="Har bir referral uchun mukofot (UZS)"
            rules={[{ required: true, message: 'Mukofot summasini kiriting!' }]}
          >
            <InputNumber
              min={0}
              className="w-full"
            />
          </Form.Item>

          {settings && (
            <Alert
              message="Joriy sozlamalar"
              description={
                <div className="text-sm">
                  <p>Joriy mukofot: {settings.reward_per_referral.toLocaleString()} UZS</p>
                  <p>Oxirgi yangilanish: {new Date(settings.updated_at).toLocaleString('uz-UZ')}</p>
                </div>
              }
              type="info"
              showIcon
            />
          )}
        </Form>
      )}
    </Modal>
  );
};

export default RewardSettingsModal;
