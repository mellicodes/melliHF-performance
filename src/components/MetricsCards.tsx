import { useEffect, useRef, useState } from 'react';
import type { PerformanceData } from '../types';

interface Props {
  data: PerformanceData;
}

function AnimatedNumber({ value, suffix = '', prefix = '', decimals = 1 }: {
  value: number | null;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState<string>('--');
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (value === null || value === undefined) {
      setDisplay('N/A');
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || animated.current) {
      setDisplay(`${prefix}${value.toFixed(decimals)}${suffix}`);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 300;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = value * eased;
            setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    // Fallback: if already visible on mount, animate after short delay
    const fallback = setTimeout(() => {
      if (!animated.current) {
        animated.current = true;
        setDisplay(`${prefix}${value.toFixed(decimals)}${suffix}`);
        observer.disconnect();
      }
    }, 500);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [value, suffix, prefix, decimals]);

  return <span ref={ref}>{display}</span>;
}

export function MetricsCards({ data }: Props) {
  const { summary, metadata } = data;
  const insufficient = metadata.insufficient_data && summary.total_return_pct === null;

  const metrics = [
    {
      label: 'Total Return',
      value: summary.total_return_pct,
      prefix: summary.total_return_pct >= 0 ? '+' : '',
      suffix: '%',
      color: summary.total_return_pct >= 0 ? 'var(--accent)' : 'var(--negative)',
      arrow: summary.total_return_pct >= 0 ? '\u2191' : '\u2193',
    },
    {
      label: 'Sharpe Ratio',
      value: summary.sharpe_ratio,
      prefix: '',
      suffix: '',
      decimals: 2,
      color: 'var(--text-primary)',
      arrow: '',
    },
    {
      label: 'Max Drawdown',
      value: summary.max_drawdown_pct,
      prefix: '',
      suffix: '%',
      color: 'var(--negative)',
      arrow: '\u2193',
    },
    {
      label: 'Win Rate',
      value: summary.win_rate_pct,
      prefix: '',
      suffix: '%',
      color: 'var(--text-primary)',
      arrow: '',
    },
  ];

  return (
    <div className="section" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-lg)' }}>
      <div className="metrics-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-md)',
      }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
          }}>
            <div className="metric-value" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 48,
              fontWeight: 600,
              lineHeight: 1,
              color: insufficient ? 'var(--text-muted)' : m.color,
              marginBottom: 'var(--space-sm)',
            }}>
              {insufficient ? (
                <span title="Insufficient data">&mdash;</span>
              ) : (
                <>
                  <AnimatedNumber
                    value={m.value}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    decimals={m.decimals ?? 1}
                  />
                  {m.arrow && m.value !== null && (
                    <span style={{ fontSize: 24, marginLeft: 4, verticalAlign: 'middle' }}>
                      {m.arrow}
                    </span>
                  )}
                </>
              )}
            </div>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 767px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .metrics-grid .metric-value {
            font-size: 32px !important;
          }
        }
        @media (max-width: 374px) {
          .metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
