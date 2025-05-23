import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../shared/components/ui/card'
import Login from '../components/Login'

export default function Dashboard() {
  const [objectives, setObjectives] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('objetivos')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
        setObjectives(data || [])
      }
    }
    fetchData()
  }, [])

  if (!user) return <Login />

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Your Accountability Dashboard</h1>
      {objectives.length === 0 ? (
        <p className="mt-4 text-gray-500">No active objectives. Create one to get started!</p>
      ) : (
        <div className="grid gap-4 mt-4">
          {objectives.map((obj) => (
            <Card key={obj.id}>
              <CardHeader>
                <CardTitle>{obj.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Deadline: {new Date(obj.deadline).toLocaleDateString()}</p>
                <p>Streak: {obj.current_streak} days</p>
                <p>Status: {obj.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}