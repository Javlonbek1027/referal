import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, message, Typography, Statistic } from 'antd';
import { CopyOutlined, WhatsAppOutlined, SendOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import type { User } from '../../types';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

const ReferralLink: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

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
      <Card className="mb-4">
        <Title level={4}>Sizning referral linkingiz</Title>
        <Text type="secondary" className="block mb-4">
          Ushbu linkni do'stlaringizga yuboring. Ular ro'yxatdan o'tganda siz mukofot olasiz.
        </Text>

        <Input.Group compact className="mb-4">
          <Input
            value={referralLink}
            readOnly
            style={{ width: 'calc(100% - 100px)' }}
          />
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
          >
            {copied ? 'Nusxalandi!' : 'Nusxalash'}
          </Button>
        </Input.Group>

        <div className="mb-4">
          <Text strong className="block mb-2">Ulashish:</Text>
          <Space wrap>
            <Button
              icon={<WhatsAppOutlined />}
              onClick={shareViaWhatsApp}
              style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white' }}
            >
              WhatsApp
            </Button>
            <Button
              icon={<SendOutlined />}
              onClick={shareViaTelegram}
              style={{ backgroundColor: '#0088cc', borderColor: '#0088cc', color: 'white' }}
            >
              Telegram
            </Button>
            <Button
              icon={<MessageOutlined />}
              onClick={shareViaSMS}
            >
              SMS
            </Button>
            <Button
              icon={<MailOutlined />}
              onClick={shareViaEmail}
            >
              Email
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Statistic
          title="Referral holati"
          value={user.referral_count}
          suffix={`/ ${user.referral_limit}`}
        />
        <Text type={remainingReferrals > 0 ? 'success' : 'danger'} className="block mt-2">
          {remainingReferrals > 0
            ? `Yana ${remainingReferrals} ta odam taklif qilishingiz mumkin`
            : 'Referral limitingiz tugadi'}
        </Text>
      </Card>
    </div>
  );
};

export default ReferralLink;
