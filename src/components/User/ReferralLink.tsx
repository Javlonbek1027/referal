import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, message, Typography, Statistic, Grid, Flex } from 'antd';
import { CopyOutlined, WhatsAppOutlined, SendOutlined, MailOutlined, MessageOutlined, CheckOutlined } from '@ant-design/icons';
import type { User } from '../../types';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ReferralLink: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const baseUrl = window.location.origin;
  const referralLink = `${baseUrl}/register?ref=${user.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      message.success('Link nusxalandi!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error('Nusxalashda xatolik');
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Salom! Ushbu link orqali ro'yxatdan o'ting va bonus oling: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = encodeURIComponent(`Salom! Ushbu link orqali ro'yxatdan o'ting va bonus oling: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(`Ro'yxatdan o'ting: ${referralLink}`);
    window.open(`sms:?body=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Referral Market - Ro\'yxatdan o\'ting');
    const body = encodeURIComponent(`Salom!\n\nUshbu link orqali ro'yxatdan o'ting va bonus oling:\n${referralLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const remainingReferrals = user.referral_limit - user.referral_count;

  return (
    <div>
      <Card className="mb-3 md:mb-4">
        <Title level={5} className="!mb-1 md:!mb-2">Sizning referral linkingiz</Title>
        <Text type="secondary" className="block mb-3 md:mb-4 text-xs md:text-sm">
          Ushbu linkni do'stlaringizga yuboring. Ular ro'yxatdan o'tganda siz mukofot olasiz.
        </Text>

        {/* Link Input with Copy Button */}
        <div className="mb-3 md:mb-4">
          {isMobile ? (
            <div className="space-y-2">
              <Input
                value={referralLink}
                readOnly
                className="text-xs"
              />
              <Button
                type="primary"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
                block
              >
                {copied ? 'Nusxalandi!' : 'Linkni nusxalash'}
              </Button>
            </div>
          ) : (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={referralLink}
                readOnly
                style={{ width: 'calc(100% - 120px)' }}
              />
              <Button
                type="primary"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
                style={{ width: 120 }}
              >
                {copied ? 'Nusxalandi!' : 'Nusxalash'}
              </Button>
            </Space.Compact>
          )}
        </div>

        {/* Share Buttons */}
        <div>
          <Text strong className="block mb-2 text-sm">Ulashish:</Text>
          <Flex wrap="wrap" gap={8}>
            <Button
              icon={<WhatsAppOutlined />}
              onClick={shareViaWhatsApp}
              style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white' }}
              size={isMobile ? 'middle' : 'large'}
            >
              {!isMobile && 'WhatsApp'}
            </Button>
            <Button
              icon={<SendOutlined />}
              onClick={shareViaTelegram}
              style={{ backgroundColor: '#0088cc', borderColor: '#0088cc', color: 'white' }}
              size={isMobile ? 'middle' : 'large'}
            >
              {!isMobile && 'Telegram'}
            </Button>
            <Button
              icon={<MessageOutlined />}
              onClick={shareViaSMS}
              size={isMobile ? 'middle' : 'large'}
            >
              {!isMobile && 'SMS'}
            </Button>
            <Button
              icon={<MailOutlined />}
              onClick={shareViaEmail}
              size={isMobile ? 'middle' : 'large'}
            >
              {!isMobile && 'Email'}
            </Button>
          </Flex>
        </div>
      </Card>

      {/* Referral Status Card */}
      <Card>
        <Statistic
          title={<span className="text-xs md:text-sm">Referral holati</span>}
          value={user.referral_count}
          suffix={`/ ${user.referral_limit}`}
          valueStyle={{ fontSize: isMobile ? 20 : 28 }}
        />
        <Text 
          type={remainingReferrals > 0 ? 'success' : 'danger'} 
          className="block mt-2 text-xs md:text-sm"
        >
          {remainingReferrals > 0
            ? `Yana ${remainingReferrals} ta odam taklif qilishingiz mumkin`
            : 'Referral limitingiz tugadi'}
        </Text>
      </Card>
    </div>
  );
};

export default ReferralLink;
