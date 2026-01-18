import { useState, useEffect } from 'react';
import { Drawer, Descriptions, Table, InputNumber, Button, Space, message, Divider, Grid, List, Typography, Tag, Card } from 'antd';
import { PlusOutlined, MinusOutlined, UserOutlined, StarFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { User, Referral } from '../../types';
import { referralService } from '../../services/referralService';
import { rewardService } from '../../services/rewardService';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

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

// Har 5 ta referral uchun 1 ta yulduzcha
const getStarCount = (referralCount: number): number => {
  return Math.floor(referralCount / 5);
};

// Yulduzchalarni render qilish
const renderStars = (count: number) => {
  if (count === 0) return null;
  
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push(
      <StarFilled 
        key={i} 
        style={{ color: '#fadb14', fontSize: 20, marginRight: 2 }} 
      />
    );
  }
  return stars;
};

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

  const starCount = getStarCount(user.referral_count);
  const nextStarAt = (starCount + 1) * 5;
  const progressToNextStar = user.referral_count % 5;

  return (
    <Drawer
      title={<span className="text-sm md:text-base">{user.name}</span>}
      open={open}
      onClose={onClose}
      width={isMobile ? '100%' : 500}
      styles={{ body: { padding: isMobile ? 12 : 24 } }}
    >
      {/* Star Rating Card */}
      <Card 
        className="mb-4" 
        style={{ 
          background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
          border: '1px solid #ffe58f'
        }}
        styles={{ body: { padding: isMobile ? 12 : 16 } }}
      >
        <div className="text-center">
          <div className="mb-2">
            {starCount > 0 ? (
              <div className="flex justify-center items-center gap-1">
                {renderStars(starCount)}
              </div>
            ) : (
              <Text type="secondary">Hali yulduzcha yo'q</Text>
            )}
          </div>
          <Title level={5} className="!mb-1" style={{ color: '#d48806' }}>
            {starCount} ta yulduzcha
          </Title>
          <Text type="secondary" className="text-xs">
            {user.referral_count} ta referral qilgan
          </Text>
          {starCount < 20 && (
            <div className="mt-2">
              <Text className="text-xs text-orange-600">
                Keyingi yulduzcha uchun yana {nextStarAt - user.referral_count} ta referral kerak
              </Text>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${(progressToNextStar / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

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
