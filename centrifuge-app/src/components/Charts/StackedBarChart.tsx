import * as React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from 'styled-components'
import { PropsOf } from '../../../helpers'
import { formatDate } from '../../utils/date'
import { formatBalance, formatBalanceAbbreviated } from '../../utils/formatting'
import { TooltipContainer, TooltipEntry, TooltipTitle } from './CustomChartElements'

export type StackedBarChartProps = {
  data: {
    xAxis: number
    top: number
    bottom: number
    date: string
  }[]
  names: [string, string]
  colors: [string, string]
  currency: string
}

export function StackedBarChart({ data, names, colors, currency }: StackedBarChartProps) {
  const theme = useTheme()
  const maxBarSize = 16
  const axisStyle = { fontSize: '10px', fill: theme.colors.textSecondary }

  return (
    <>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data.map(({ bottom, ...rest }) => ({ bottom: bottom * -1, ...rest }))}
          margin={{ bottom: 5, left: -16 }}
          stackOffset="sign"
        >
          <CartesianGrid stroke={theme.colors.borderSecondary} vertical={false} />

          <XAxis
            dataKey="xAxis"
            style={axisStyle}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickMargin={10}
            angle={45}
            tickFormatter={(tick: number) => formatDate(tick, { year: undefined })}
          />

          <YAxis
            style={axisStyle}
            tickLine={false}
            axisLine={false}
            tickFormatter={(tick: number) => formatBalanceAbbreviated(Math.abs(tick), '', 0)}
          />

          <ReferenceLine y={0} stroke={theme.colors.textDisabled} />

          <Bar stackId="bar" dataKey="top" name={names[0]} fill={colors[0]} maxBarSize={maxBarSize} />

          <Bar stackId="bar" dataKey="bottom" name={names[1]} fill={colors[1]} maxBarSize={maxBarSize} />

          <Tooltip cursor={<TooltipCursor />} content={<TooltipContent currency={currency} />} />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

type CursorProps = Required<Pick<PropsOf<typeof Rectangle>, 'width' | 'x'>>

const TooltipCursor = (({ x, width, ...rest }: CursorProps) => {
  const theme = useTheme()
  return <Rectangle {...rest} x={x + width * 0.5 - 0.5} width={1} fill={theme.colors.textDisabled} />
}) as React.FC

function TooltipContent({ payload, currency }: TooltipProps<any, any> & { currency: string }) {
  if (payload && payload?.length > 0) {
    return (
      <TooltipContainer>
        <TooltipTitle>{formatDate(payload[0].payload.date)}</TooltipTitle>
        {payload.map(({ dataKey, name, color, value }, index) => (
          <TooltipEntry name={name} color={color} key={`${dataKey}${index}`}>
            {formatBalance(Math.abs(value), currency)}
          </TooltipEntry>
        ))}
      </TooltipContainer>
    )
  }
  return null
}
