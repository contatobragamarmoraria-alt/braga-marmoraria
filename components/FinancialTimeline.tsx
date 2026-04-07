
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
} from 'recharts';
import { Project } from '../types';
import { STAGES } from '../constants';

interface Props {
  project: Project;
}

const FinancialTimeline: React.FC<Props> = ({ project }) => {
  // Define disbursement percentages for each stage
  const disbursementSchedule: { [key: string]: number } = {
    LEAD: 0.1,
    MEDICAO: 0.15,
    REUNIAO_2: 0.25,
    PAGINACAO: 0.4,
    APROVACAO_TECNICA: 0.5,
    CORTE: 0.6,
    POLIMENTO: 0.75,
    INSTALACAO: 0.9,
    FINALIZADO: 1.0,
    MANUTENCAO: 1.0,
  };

  const chartData = STAGES.map((stage, index) => {
    const progress = (index + 1) / STAGES.length * 100;
    const disbursement = (disbursementSchedule[stage.id] || 0) * project.value;
    
    return {
      name: stage.label,
      progress: Math.min(100, progress),
      disbursement: disbursement,
    };
  });

  const formatCurrency = (value: number) => `R$${(value / 1000).toFixed(0)}k`;
  const formatPercent = (value: number) => `${value.toFixed(0)}%`;

  return (
    <div className="bg-white dark:bg-onyx/40 p-8 rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-sm h-[500px] flex flex-col">
       <div className="mb-8">
        <h3 className="text-3xl font-serif font-bold text-stone-900 dark:text-white uppercase">Avanço Físico-Financeiro</h3>
        <p className="text-stone-500 text-sm italic font-serif mt-2">
          Acompanhe o progresso da obra em relação aos desembolsos financeiros programados.
        </p>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-white/10" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a8a29e' }} angle={-20} textAnchor="end" height={50} />
            <YAxis yAxisId="left" stroke="#D4AF37" tickFormatter={formatPercent} />
            <YAxis yAxisId="right" orientation="right" stroke="#8884d8" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e0e0e0',
                borderRadius: '1rem',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number, name: string) => {
                if (name === 'disbursement') return [formatCurrency(value), 'Desembolso'];
                if (name === 'progress') return [formatPercent(value), 'Avanço da Obra'];
                return [value, name];
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="progress"
              name="Avanço da Obra"
              fill="#D4AF37"
              stroke="#D4AF37"
              fillOpacity={0.2}
            />
            <Bar
              yAxisId="right"
              dataKey="disbursement"
              name="Desembolso"
              barSize={20}
              fill="#1c1917"
              className="dark:fill-white"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialTimeline;
