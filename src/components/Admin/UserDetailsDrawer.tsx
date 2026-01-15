import { useState, useEffect } from 'react';
import { Drawer, Descriptions, Table, InputNumber, Button, Space, message, Divider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, Referral } from '../../types';
import { referralService } from '../../services/referralService';
import { rewardService } from '../../services/rewardService';

interface UserDetailsDrawerProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onRefresh: () => void;
}

interface ReferralWithUser extends Referral {
  referral_name?: string;
  referral_phone?: string;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ open, user, onClose, onRefresh }) => {
  const [referrals, setReferrals] = useState<ReferralWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchReferrals();
    }
  }, [open, user]);

  const fetchReferrals = async () => {
    if (!user) return;
    setLoading(true);
    const data = await referralService.getReferralsByUserId(user.id);
    setReferrals(data);
    setLoading(false);
  };

  const handleAddBalance = async () => {
    if (!user || balanceAmount <= 0) return;
    setBalanceLoading(true);
    const success = await rewardService.addBalance(user.id, balanceAmount, 'Admin tomonidan qo\'shildi');
    setBalanceLoading(false);
    if (success) {
      message.success('Balans qo\'shildi');
      setBalanceAmount(0);
      onRefresh();
    } else {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleDeductBalance = async () => {
    if (!user || balanceAmount <= 0) return;
    if (balanceAmount > user.reward_balance) {
      message.error('Yetarli balans yo\'q');
      return;
    }
    setBalanceLoading(true);
    const success = await rewardService.deductBalance(user.id, balanceAmount, 'Admin tomonidan ayirildi');
    setBalanceLoading(false);
    if (success) {
      message.success('Balans ayirildi');
      setBalanceAmount(0);
      onRefresh();
    } else {
      message.error('Xatolik yuz berdi');
    }
  };

  const columns: ColumnsType<ReferralWithUser> = [
    {
      title: 'Ism',
      dataIndex: 'referral_name',
      key: 'referral_name',
    },
    {
      title: 'Telefon',
      dataIndex: 'referral_phone',
      key: 'referral_phone',
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'),
    },
    {
      title: 'Mukofot',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (amount: number) => `${amount.toLocaleString()} UZS`,
    },
  ];

  if (!user) return null;

  return (
    <Drawer
      title={`Foydalanuvchi: ${user.name}`}
      open={open}
      onClose={onClose}
      width={600}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Telefon">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Referrallar">
          {user.referral_count} / {user.referral_limit}
        </Descriptions.Item>
        <Descriptions.Item label="Balans">
          {user.reward_balance.toLocaleString()} UZS
        </Descriptions.Item>
        <Descriptions.Item label="Ro'yxatdan o'tgan">
          {new Date(user.created_at).toLocaleDateString('uz-UZ')}
        </Descriptions.Item>
      </Descriptions>

      <Divider>Referrallar ro'yxati</Divider>

      <Table
        columns={columns}
        dataSource={referrals}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
      />

      <Divider>Balans boshqaruvi</Divider>

      <div className="flex items-center gap-2">
        <span>Joriy balans: {user.reward_balance.toLocaleString()} UZS</span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <InputNumber
          value={balanceAmount}
          onChange={(value) => setBalanceAmount(value || 0)}
          min={0}
          placeholder="Summa"
          className="w-40"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBalance}
            loading={balanceLoading}
          >
            Qo'shish
          </Button>
          <Button
            danger
            icon={<MinusOutlined />}
            onClick={handleDeductBalance}
            loading={balanceLoading}
          >
            Ayirish
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};

export default UserDetailsDrawer;
