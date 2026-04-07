import type { PerformanceData } from '../types';

interface Props {
  data: PerformanceData;
}

function timeAgo(isoString: string | null): string {
  if (!isoString) return 'Unknown';
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60000);
  return mins > 0 ? `${mins}m ago` : 'Just now';
}

export function SystemStatus({ data }: Props) {
  const { system_status } = data;
  const lastTrade = system_status.last_trade;
  const allocation = system_status.portfolio_allocation;

  return (
    <div className="section">
      <div className="section-label">System Status</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: allocation.length > 0 ? '1fr 1fr' : '1fr',
        gap: 'var(--space-lg)',
      }}>
        <div>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
          }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
              Last Trade
            </div>
            {lastTrade ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)', fontWeight: 500 }}>
                  {lastTrade.ticker}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13,
                  color: lastTrade.side === 'buy' ? 'var(--accent)' : 'var(--negative)',
                  textTransform: 'uppercase',
                }}>
                  {lastTrade.side}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  {timeAgo(lastTrade.time)}
                </span>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>No trades yet</div>
            )}
            <div style={{ marginTop: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 13 }}>
              Active Strategies: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {system_status.active_strategies}
              </span>
            </div>
          </div>
        </div>
        {allocation.length > 0 && (
          <div>
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
                Portfolio Allocation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {allocation.map(a => (
                  <div key={a.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>
                      {a.ticker}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <div style={{
                        height: 4, borderRadius: 2,
                        width: `${Math.max(a.pct * 3, 8)}px`,
                        background: 'var(--accent)',
                      }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', minWidth: 40, textAlign: 'right' }}>
                        {a.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
