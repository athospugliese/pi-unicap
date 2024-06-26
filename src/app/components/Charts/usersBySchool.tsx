import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken'; // Importe jwt para decodificar o token
import { ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import colors from 'tailwindcss/colors';

const COLORS = [
  colors.sky['500'],
  colors.amber['500'],
  colors.violet['500'],
  colors.emerald['500'],
  colors.rose['500'],
]

export default function UsersBySchoolChart() {
  const [usersCountBySchool, setUsersCountBySchool] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsersCountBySchool = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_PROD_BASE_URL}/admin/getusersbyschool`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
            'Content-Type': 'application/json'
          }
        });
        setUsersCountBySchool(response.data.usersCountBySchool);

        // Decode o token JWT novamente para verificar seu conteúdo
        const token = localStorage.getItem('userToken');
        if (token) {
          const decodedToken = jwt.decode(token);
          console.log('Token decodificado:', decodedToken);
        }
      } catch (error) {
        console.error('Erro ao buscar os usuários por escola:', error);
      }
    };

    fetchUsersCountBySchool();
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Usuários por Escola</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart style={{ fontSize: 12 }}>
            <Pie
              data={usersCountBySchool}
              dataKey="usersCount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={86}
              innerRadius={64}
              strokeWidth={8}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = 12 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    className="fill-muted-foreground text-xs"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {usersCountBySchool[index].name} ({value})
                  </text>
                );
              }}
            >
              {usersCountBySchool.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  className="stroke-background hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
