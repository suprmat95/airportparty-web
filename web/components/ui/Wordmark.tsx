type Props = {
  size?: number;
  className?: string;
};

export function Wordmark({ size = 22, className }: Props) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-nunito), system-ui, sans-serif',
        fontSize: size,
        fontWeight: 800,
        color: 'var(--ink)',
        letterSpacing: '-0.8px',
        lineHeight: 1,
      }}
    >
      airport<span style={{ color: 'var(--primary)' }}>party</span>
    </span>
  );
}
