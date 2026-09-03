import { Card, CardContent } from '@/components/ui/card'

interface ProductSummaryProps {
  total: number
  available: number
  outOfStock: number
}

// STATELESS 1: solo presenta los datos que recibe mediante props.
export function ProductSummary({ total, available, outOfStock }: ProductSummaryProps) {
  return (
    <div className="mb-4 grid grid-cols-3 gap-3">
      <SummaryItem label="Productos" value={total} />
      <SummaryItem label="Disponibles" value={available} />
      <SummaryItem label="Agotados" value={outOfStock} />
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
