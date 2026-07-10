import { NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/demoData'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function csvValue(value: unknown) {
  const stringValue = String(value ?? '')
  return `"${stringValue.replace(/"/g, '""')}"`
}

export async function GET() {
  if (isDemoMode()) {
    return new NextResponse('created_at,order_id,table,total,payment_method,guest_source\n', {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="pink-flamingo-sales.csv"',
      },
    })
  }

  const supabase = getSupabaseServerClient()
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('orders')
    .select('id,created_at,table_number,subtotal,tip_amount,tax_amount,total,payment_method,payment_status,guest_source')
    .gte('created_at', start.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Could not export sales' }, { status: 500 })
  }

  const rows = [
    [
      'created_at',
      'order_id',
      'table',
      'subtotal',
      'tip',
      'tax',
      'total',
      'payment_method',
      'payment_status',
      'guest_source',
    ],
    ...(data || []).map((order: any) => [
      order.created_at,
      order.id,
      order.table_number,
      order.subtotal,
      order.tip_amount,
      order.tax_amount,
      order.total,
      order.payment_method,
      order.payment_status,
      order.guest_source,
    ]),
  ]

  const csv = rows.map((row) => row.map(csvValue).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="pink-flamingo-sales-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
