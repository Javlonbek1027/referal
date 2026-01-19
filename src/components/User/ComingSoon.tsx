import { Card, Typography, Empty } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <Card className="text-center">
      <Empty
        image={<ClockCircleOutlined style={{ fontSize: 80, color: '#1890ff' }} />}
        imageStyle={{ height: 100 }}
        description={
          <div className="mt-4">
            <Title level={3}>{title}</Title>
            <Text type="secondary" className="text-base">
              {description || 'Tez orada'}
            </Text>
          </div>
        }
      />
    </Card>
  );
};

export default ComingSoon;
