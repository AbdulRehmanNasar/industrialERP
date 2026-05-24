import type { ReactNode } from 'react';

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
    Paid: 'success', Completed: 'success', Active: 'success', Posted: 'success',
    Unpaid: 'info', Pending: 'warning', Draft: 'default', Inactive: 'default',
    Overdue: 'error', Failed: 'error', Refunded: 'warning',
  };
  return <Badge variant={map[status] ?? 'default'}>{status}</Badge>;
}

export function KpiCard({ label, value, sub, trend, color = 'blue' }: {
  label: string; value: string; sub?: string; trend?: { value: string; up: boolean }; color?: string;
}) {
  const colors: Record<string, string> = {
    blue: 'border-l-blue-500', green: 'border-l-green-500',
    orange: 'border-l-orange-500', red: 'border-l-red-500',
    teal: 'border-l-teal-500',
  };
  return (
    <div className={`bg-white rounded border border-gray-200 border-l-4 ${colors[color] ?? colors.blue} p-3 shadow-sm`}>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900 leading-none mb-1">{value}</div>
      {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
      {trend && (
        <div className={`text-[10px] font-medium mt-1 ${trend.up ? 'text-green-600' : 'text-red-500'}`}>
          {trend.up ? '\u2191' : '\u2193'} {trend.value}
        </div>
      )}
    </div>
  );
}

export function Btn({ children, variant = 'primary', size = 'sm', onClick, type = 'button', className = '' }: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'xs' | 'sm' | 'md';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
  };
  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium border rounded transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">{label}</label>}
      <input
        {...props}
        className={`border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${props.className ?? ''}`}
      />
    </div>
  );
}

export function Select({ label, children, ...props }: { label?: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <label className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">{label}</label>}
      <select
        {...props}
        className={`border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${props.className ?? ''}`}
      >
        {children}
      </select>
    </div>
  );
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export function formatCurrencyShort(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}
