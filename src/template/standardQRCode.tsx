import { generateQRCodeBase64 } from '../utils/generateQRCodeBase64';

export type StandardQRCodeProps = {
  content: string;
  subtitle?: string;
  logoUrl?: string;
  title?: string;
  mainColor?: string;
};

export const StandardQRCode = async (props: StandardQRCodeProps) => {
  const { content, subtitle, logoUrl, title, mainColor = '#1677FF' } = props;
  const qrCode = await generateQRCodeBase64(content);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        fontSize: '48px',
        fontFamily: 'Inter, sans-serif, Wei-ruan-ya-hei',
        fontWeight: 700,
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: mainColor,
          padding: '15%',
          gap: '10%',
          flexDirection: 'column',
          borderRadius: '10px 10px 0 0',
        }}
      >
        {title && (
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
            borderRadius: '20px',
            backgroundColor: 'white',
            position: 'relative',
          }}
        >
          <img src={qrCode} alt="QR Code" style={{}} />
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                position: 'absolute',
                width: '20%',
                height: '20%',
                objectFit: 'contain',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
      </div>
      {subtitle && (
        <div
          style={{
            marginTop: '10%',
            fontSize: '28px',
            fontWeight: 700,
          }}
        >
          {subtitle}
        </div>
      )}
      <div
        style={{
          display: 'block',
          paddingBottom: '10%',
        }}
      ></div>
    </div>
  );
};
