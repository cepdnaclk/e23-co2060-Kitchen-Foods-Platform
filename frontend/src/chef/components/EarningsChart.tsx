import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningsChartProps {
  data: { date: string; amount: number }[];
}

export const EarningsChart = ({ data }: EarningsChartProps) => {
  return (
    <div className="h-[280px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F27D26" stopOpacity={0.28} />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#F27D26" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1c1917" opacity={0.08} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#a8a29e', fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#a8a29e', fontWeight: 500 }}
            tickFormatter={(value) => `Rs.${value}`}
          />
          <Tooltip
            cursor={{ stroke: '#a8a29e', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              borderRadius: '12px',
              border: '1px solid rgba(242, 125, 38, 0.3)',
              boxShadow: '0 15px 35px -10px rgba(28,25,23,0.18)',
              color: '#1c1917',
              backdropFilter: 'blur(8px)',
            }}
            itemStyle={{ color: '#F27D26', fontWeight: 'bold' }}
            labelStyle={{ color: '#78716c', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Earnings']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#F27D26"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorAmount)"
            activeDot={{ r: 5, fill: '#F27D26', stroke: '#ffffff', strokeWidth: 2 }}
            dot={{ r: 2.5, fill: '#F27D26', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
