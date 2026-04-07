import type { PerformanceData } from '../types';

interface Props {
  data: PerformanceData;
}

export function DataFreshness({ data }: Props) {
  const generatedAt = new Date(data.generated_at);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - generatedAt.getTime()) / 86400000);

  // Count only weekdays (trading days)
  let tradingDays = 0;
  const d = new Date(generatedAt);
  while (d < now) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) tradingDays++;
  }

  const isStale = tradingDays > 3;
  const dateStr = generatedAt.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  if (!isStale) return null;

  return (
    <div style={{
      background: '#2a1f00',
      borderBottom: '1px solid #5a4600',
      padding: '10px var(--space-lg)',
      textAlign: 'center',
      fontSize: 13,
      color: '#fbbf24',
    }}>
      Data as of {dateStr} ({tradingDays} trading days ago)
    </div>
  );
}
