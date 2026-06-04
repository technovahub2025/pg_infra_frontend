import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';
import { BillingProgressBar } from './BillingProgressBar';

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}L`;
}

export function BillingTable({ rows = [], onEdit, onDelete, onCreate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <div className="ml-auto flex gap-2">
          {onCreate ? (
            <Button size="sm" onClick={onCreate}>
              Add Invoice
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Invoice No</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 align-top transition hover:bg-white/5">
                <td className="px-4 py-4">
                  <div className="font-semibold text-[rgb(var(--text))]">{row.project?.projectName || row.projectName}</div>
                  <div className="text-xs text-slate-400">{row.project?.clientName || row.clientName}</div>
                </td>
                <td className="px-4 py-4 text-slate-400">{row.invoiceNo || '-'}</td>
                <td className="px-4 py-4">
                  <Badge tone="blue">{row.billingStatus}</Badge>
                </td>
                <td className="px-4 py-4 text-slate-300">{formatMoney(row.amountTotal)}</td>
                <td className="px-4 py-4 text-emerald-300">{formatMoney(row.amountReceived)}</td>
                <td className="px-4 py-4 text-amber-300">{formatMoney(row.balance)}</td>
                <td className="px-4 py-4">
                  <BillingProgressBar received={row.amountReceived} total={row.amountTotal} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit?.(row)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete?.(row)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
