"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A simple area chart"

type ChartAreaDefaultProps<TData extends Record<string, unknown>> = {
  data: TData[]
  /** Field to use for the X axis (e.g. "header", "client", "date") */
  xKey: keyof TData
  /** Field to plot as the area value (e.g. "limit", "amount") */
  yKey: keyof TData
  color?: string
  title?: string
  /** Label for the plotted value, shown in tooltip */
  yLabel?: string
  desc? : string
  plus? : boolean
}

export default function ChartAreaDefault<TData extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color = "green",
  title = "Area Chart",
  yLabel = "Limit",
  desc,
  plus = "true"
}: ChartAreaDefaultProps<TData>) {
  const chartConfig: ChartConfig = {
    desktop: {
      label: yLabel,
      color,
    },
  }

  const numericData = data.map((item) => ({
    x: String(item[xKey]),
    y: Number(item[yKey]),
  }))

  return (
    <Card className="w-2xs">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Showing {yLabel.toLowerCase()} for {data.length} items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={numericData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 6)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="y"
              type="natural"
              fill={color}
              fillOpacity={0.4}
              stroke={color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {desc} { plus ? ( <TrendingUp className="h-4 w-4" />) : ( <TrendingDown className="h-4 w-4" />)}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Dynamic live Statistics
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}