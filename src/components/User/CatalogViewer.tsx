import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Spin, Typography, Space, Card, message } from 'antd';
import { 
  LeftOutlined, 
  RightOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const { Title, Text } = Typography;

// PDF.js worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CatalogViewer: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const pdfUrl = '/catalog/al-qalb catalog 3.pdf';

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError('');
    message.success(`Katalog yuklandi! ${numPages} sahifa`);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setLoading(false);
    setError('PDF faylni yuklashda xatolik yuz berdi');
    message.error('PDF faylni yuklashda xatolik yuz berdi');
    console.error('PDF load error:', error);
  }, []);

  const goToPrevPage = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber]);

  const goToNextPage = useCallback(() => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber, numPages]);

  const zoomIn = () => {
    if (scale < 2.5) {
      setScale(scale + 0.2);
    }
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.2);
    }
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const toggleFullscreen = () => {
    const elem = document.getElementById('pdf-container');
    if (elem) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
          message.error(`Fullscreen rejimi ishlamadi: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'al-qalb-catalog.pdf';
    link.click();
    message.success('Yuklab olish boshlandi');
  };

  const reload = () => {
    setLoading(true);
    setPageNumber(1);
    setScale(1.0);
    setError('');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (loading || error) return;
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          goToPrevPage();
          break;
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          goToNextPage();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
        case '_':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [loading, error, goToPrevPage, goToNextPage]);

  // Touch gestures for mobile
  useEffect(() => {
    const container = document.getElementById('pdf-container');
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next page
          goToNextPage();
        } else {
          // Swipe right - previous page
          goToPrevPage();
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToPrevPage, goToNextPage]);

  return (
    <div className="w-full h-full">
      <Card 
        className="shadow-lg"
        title={
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Title level={4} className="!mb-0">
              📚 Al-Qalb Katalog
            </Title>
            <Space wrap>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={downloadPDF}
                type="primary"
                ghost
              >
                Yuklab olish
              </Button>
            </Space>
          </div>
        }
      >
        {/* Controls */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Navigation */}
            <Space.Compact>
              <Button 
                icon={<LeftOutlined />} 
                onClick={goToPrevPage}
                disabled={pageNumber <= 1 || loading}
              >
                Oldingi
              </Button>
              <Button disabled className="!cursor-default">
                <Text strong>
                  {pageNumber} / {numPages || '...'}
                </Text>
              </Button>
              <Button 
                icon={<RightOutlined />} 
                onClick={goToNextPage}
                disabled={pageNumber >= numPages || loading}
                iconPosition="end"
              >
                Keyingi
              </Button>
            </Space.Compact>

            {/* Zoom Controls */}
            <Space.Compact>
              <Button 
                icon={<ZoomOutOutlined />} 
                onClick={zoomOut}
                disabled={scale <= 0.5 || loading}
                title="Kichraytirish"
              />
              <Button 
                onClick={resetZoom}
                disabled={loading}
                title="Asl o'lcham"
              >
                {Math.round(scale * 100)}%
              </Button>
              <Button 
                icon={<ZoomInOutlined />} 
                onClick={zoomIn}
                disabled={scale >= 2.5 || loading}
                title="Kattalashtirish"
              />
            </Space.Compact>

            {/* Additional Controls */}
            <Space.Compact>
              <Button 
                icon={<FullscreenOutlined />} 
                onClick={toggleFullscreen}
                title="To'liq ekran"
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={reload}
                title="Qayta yuklash"
              />
            </Space.Compact>
          </div>
        </div>

        {/* PDF Viewer */}
        <div 
          id="pdf-container"
          className="relative bg-gray-100 rounded-lg overflow-auto"
          style={{ 
            minHeight: '70vh',
            maxHeight: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <Spin size="large" tip="PDF yuklanmoqda..." />
            </div>
          )}

          {error && (
            <div className="text-center p-8">
              <Text type="danger" className="text-lg">{error}</Text>
              <br />
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={reload}
                className="mt-4"
              >
                Qayta urinish
              </Button>
            </div>
          )}

          {!error && (
            <div className="pdf-document-wrapper p-4">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<Spin size="large" tip="PDF yuklanmoqda..." />}
                className="flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={<Spin tip="Sahifa yuklanmoqda..." />}
                  className="shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                />
              </Document>
            </div>
          )}
        </div>

        {/* Page Info */}
        {!loading && !error && (
          <div className="mt-4">
            <div className="text-center mb-2">
              <Text type="secondary">
                Sahifa {pageNumber} / {numPages} • Masshtab: {Math.round(scale * 100)}%
              </Text>
            </div>
            <div className="text-center text-xs">
              <Text type="secondary" className="opacity-70">
                💡 Klaviatura: ← → (sahifa), + - (zoom), F (fullscreen), 0 (reset) | 
                📱 Mobil: Swipe chap/o'ng
              </Text>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CatalogViewer;
