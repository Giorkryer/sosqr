import type { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeRendererProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

export const QrCodeRenderer: FC<QrCodeRendererProps> = ({
  value,
  size = 160,
  level = 'M',
  className = '',
}) => {
  return (
    <div
      className={`p-3 bg-white rounded-2xl shadow-sm border border-stone-200 inline-flex items-center justify-center ${className}`}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={false}
        fgColor="#1C1917"
        bgColor="#FFFFFF"
      />
    </div>
  );
};
