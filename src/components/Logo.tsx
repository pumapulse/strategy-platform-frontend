interface Props {
  height?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({ height = 36, className = '', showText = true }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo2.png"
        alt="CrowdPnL icon"
        style={{ height: `${height}px`, width: 'auto' }}
      />
      {showText && (
        <span
          style={{
            fontFamily: "'Sora', 'Inter', sans-serif",
            fontSize: `${Math.round(height * 0.52)}px`,
            fontWeight: 800,
            letterSpacing: '0.5px',
            lineHeight: 1,
            color: 'white',
          }}
        >
          Crowd<span style={{
            color: '#9966ff',
            background: 'linear-gradient(90deg, #9966ff 0%, #cc99ff 50%, #9966ff 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmerPnL 2s linear infinite',
          }}>PnL</span>
          <style>{`@keyframes shimmerPnL { 0%{background-position:0% center} 100%{background-position:200% center} }`}</style>
        </span>
      )}
    </div>
  );
}
