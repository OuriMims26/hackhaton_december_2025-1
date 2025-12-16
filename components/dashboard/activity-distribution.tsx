"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Loader2 } from "lucide-react"

export function ActivityDistribution() {
    const [data, setData] = useState<{ name: string; value: number; color: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const { data: changes, error } = await supabase
                .from('detected_changes')
                .select('source, severity')

            if (error) {
                console.error('Error fetching distribution:', error)
            } else {
                let websiteCount = 0
                let linkedinCount = 0
                let warningCount = 0

                changes?.forEach(change => {
                    if (change.severity >= 7) {
                        warningCount++
                    }
                    if (change.source === 'linkedin') {
                        linkedinCount++
                    } else {
                        websiteCount++
                    }
                })

                setData([
                    { name: 'Website', value: websiteCount, color: '#10B981' }, // Emerald-500
                    { name: 'LinkedIn', value: linkedinCount, color: '#8B8CFF' }, // Purple
                    { name: 'Warnings', value: warningCount, color: '#F59E0B' }, // Amber-500
                ])
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    const total = data.reduce((acc, curr) => acc + curr.value, 0)

    return (
        <Card className="col-span-1 h-full bg-[#1A1A1A] border-white/20">
            <CardHeader>
                <CardTitle className="text-white text-lg">Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#F1C086] animate-spin" />
                    </div>
                ) : total === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {data.length > 0 && (
                    <div className="mt-6 space-y-3">
                        {/* Numerical Legend */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {data.map((item) => (
                                <div key={item.name} className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-xs text-muted-foreground">{item.name}</span>
                                    <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
