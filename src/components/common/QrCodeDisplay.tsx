import QRCode from 'react-qr-code';

interface QrCodeDisplayProps {
  address: string;
}

export function QrCodeDisplay({ address }: QrCodeDisplayProps) {
  if (!address) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-elevated border border-slate-100 flex items-center justify-center">
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <QRCode
          value={address}
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox={`0 0 256 256`}
          fgColor="#0f172a" // slate-900
          bgColor="#ffffff"
        />
      </div>
    </div>
  );
}
