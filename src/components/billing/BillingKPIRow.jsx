import { Card, CardBody } from '../ui/card';

function Metric({ label, value, hint }) {
  return (
    <Card>
      <CardBody>
        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
        <div className="mt-2 text-2xl font-semibold text-[rgb(var(--text))]">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{hint}</div>
      </CardBody>
    </Card>
  );
}

export function BillingKPIRow({ summary = {} }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Invoice Count" value={summary.invoiceCount || 0} hint="Live invoice records" />
      <Metric label="Total" value={`Rs. ${(summary.total || 0).toFixed(2)}L`} hint="Portfolio value" />
      <Metric label="Received" value={`Rs. ${(summary.received || 0).toFixed(2)}L`} hint="Collected so far" />
      <Metric label="Balance" value={`Rs. ${(summary.balance || 0).toFixed(2)}L`} hint="Outstanding" />
    </div>
  );
}
