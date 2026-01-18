import { useState, useEffect } from 'react';
import { Drawer, Descriptions, Table, InputNumber, Button, Space, message, Divider, Grid, List, Typography, Tag } from 'antd';
import { PlusOutlined, MinusOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, Referral } from '../../types';
import { referralService } from '../../services/referralService';
import { rewardService } from '../../services/rewardService';

const { useBreakpoint } = Grid;
const { Text } = Typography;

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
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
    { title: 'Ism', dataIndex: 'referral_name', key: 'referral_name' },
    { title: 'Telefon', dataIndex: 'referral_phone', key: 'referral_phone', responsive: ['md'] },
    { title: 'Sana', dataIndex: 'created_at', key: 'created_at', render: (date: string) => new Date(date).toLocaleDateString('uz-UZ'), responsive: ['sm'] },
    { title: 'Mukofot', dataIndex: 'reward_amount', key: 'reward_amount', render: (amount: number) => <Tag color="green">{amount.toLocaleString()} UZS</Tag> },
  ];

  const renderMobileReferral = (item: ReferralWithUser) => (
    <List.Item>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-500 text-xs" />
          </div>
          <div>
            <Text strong className="text-xs">{item.referral_name || 'Noma\'lum'}</Text>
            <Text type="secondary" className="block text-xs">{new Date(item.created_at).toLocaleDateString('uz-UZ')}</Text>
          </div>
        </div>
        <Tag color="green" className="text-xs">{item.reward_amount.toLocaleString()} UZS</Tag>
      </div>
    </List.Item>
  );

  if (!user) return null;

  return (
    <Drawer
      title={<span className="text-sm md:text-base">{user.name}</span>}
      open={open}
      onClose={onClose}
      width={isMobile ? '100%' : 500}
      bodyStyle={{ padding: isMobile ? 12 : 24 }}
    >
      <Descriptions column={1} bordered size="small" labelStyle={{ fontSize: isMobile ? 12 : 14 }} contentStyle={{ fontSize: isMobile ? 12 : 14 }}>
        <Descriptions.Item label="Telefon">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Referrallar">{user.referral_count} / {user.referral_limit}</Descriptions.Item>
        <Descriptions.Item label="Balans">{user.reward_balance.toLocaleString()} UZS</Descriptions.Item>
        <Descriptions.Item label="Ro'yxatdan">{new Date(user.created_at).toLocaleDateString('uz-UZ')}</Descriptions.Item>
      </Descriptions>

      <Divider className="!my-3 md:!my-4"><span className="text-xs md:text-sm">Referrallar</span></Divider>

      {isMobile ? (
        <List dataSource={referrals} loading={loading} renderItem={renderMobileReferral} size="small" />
      ) : (
        <Table columns={columns} dataSource={referrals} rowKey="id" loading={loading} pagination={false} size="small" />
      )}

      <Divider className="!my-3 md:!my-4"><span className="text-xs md:text-sm">Balans boshqaruvi</span></Divider>

      <div className="text-xs md:text-sm mb-2">Joriy balans: <strong>{user.reward_balance.toLocaleString()} UZS</strong></div>
      
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-2'}`}>
        <InputNumber
          value={balanceAmount}
          onChange={(value) => setBalanceAmount(value || 0)}
          min={0}
          placeholder="Summa"
          className={isMobile ? 'w-full' : 'w-32'}
          size={isMobile ? 'middle' : 'large'}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
        <Space className={isMobile ? 'w-full' : ''}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBalance} loading={balanceLoading} size={isMobile ? 'middle' : 'large'} className={isMobile ? 'flex-1' : ''}>
            {isMobile ? '' : 'Qo\'shish'}
          </Button>
          <Button danger icon={<MinusOutlined />} onClick={handleDeductBalance} loading={balanceLoading} size={isMobile ? 'middle' : 'large'} className={isMobile ? 'flex-1' : ''}>
            {isMobile ? '' : 'Ayirish'}
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};

export default UserDetailsDrawer;
