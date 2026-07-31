import ChartAreaInteractive from "@/components/chart-area-interactive"
import SectionCards from "@/components/charts"

import data from "./data.json"
import payments from "../dashboard/payments/payments.json"
import reports from "../dashboard/reports/reports.json"

import { orders } from "./orders/orders"

export default function Page() {

  const statusCounts = reports.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] ?? 0) + 1
  return acc
}, {} as Record<string, number>)

const chartData = Object.entries(statusCounts).map(([status, count]) => ({
  header: status,
  limit: count,
}))

    return (
        <div className="p-5">
              <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-4 gap-4 m-6 py-4 md:gap-6 md:py-6">
              <SectionCards color={"green"}
  data={data}
  xKey="header"
  yKey="limit"
  title="Products Invontry"
  desc="Inventory Value Trending Up"
  plus = {true}
/>
              <SectionCards
  data={payments}
  xKey="client"
  yKey="amount"
  yLabel="Amount"
  title="Payments by Client"
  color="red"
  desc="Transaction Amounts Decreasing"
  plus = {false}
/>
            <SectionCards data={chartData} xKey="header" yKey="limit" title="Reports Generated" desc="Compliance Reports Trending Down" />
              <SectionCards
  data={orders}
  xKey="client"
  yKey="amount"
  yLabel="Amount"
  title="Order Amount by Client"
  color="purple"
  plus = {true}
  desc="Order Volume on the Rise Rise"
  />
              </div>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
  desktopColor="#3b82f6"
  mobileColor="#f97316"
/>
              </div>

            </div>
          </div>
        </div>   
                
    )
    
}