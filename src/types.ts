export interface PerformanceData {
  generated_at: string;
  trading_start_date: string | null;
  live_trading_start_date: string | null;
  summary: {
    total_return_pct: number;
    sharpe_ratio: number | null;
    max_drawdown_pct: number;
    win_rate_pct: number;
    total_trades: number;
    avg_hold_days: number;
    current_equity: number;
    starting_equity: number;
  };
  equity_curve: Array<{ date: string; portfolio: number }>;
  monthly_returns: Array<{ year: number; month: number; return_pct: number }>;
  drawdowns: Array<{ date: string; drawdown_pct: number }>;
  system_status: {
    last_trade: { ticker: string; side: string; qty: number; time: string | null } | null;
    active_strategies: number;
    portfolio_allocation: Array<{ ticker: string; pct: number }>;
  };
  risk_limits: {
    max_position_pct: number;
    max_deployment_pct: number;
    daily_loss_limit_pct: number;
    max_drawdown_pct: number;
    kill_switch_active: boolean;
  };
  metadata: {
    is_paper_trading: boolean;
    data_source: string;
    benchmark_available: boolean;
    insufficient_data: boolean;
  };
}

export interface BenchmarksData {
  benchmarks: Record<string, Array<{ date: string; value: number }>>;
}
