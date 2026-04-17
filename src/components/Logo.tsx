interface Props {
  height?: number;
  className?: string;
}

export default function Logo({ height = 44, className = '' }: Props) {
  return (
    <img
      src="/logo.png"
      alt="CrowdPnL"
      style={{ height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
}
