import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button, Input, Select, Form, FormControl, FormField, FormItem, FormLabel } from '../shared/components/ui'

export default function Objectives() {
  const [form, setForm] = useState({ title: '', deadline: '', checkinType: 'daily' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { count } = await supabase.from('objetivos').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'active')
if (count >= 3) {
  alert('Max 3 active objectives')
  return
}
    const { error } = await supabase.from('objetivos').insert({
      user_id: user.id,
      title: form.title,
      deadline: form.deadline,
      checkin_type: form.checkinType,
    })
    if (!error) setForm({ title: '', deadline: '', checkinType: 'daily' })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Create Objective</h1>
      <Form>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <FormField>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Gym 4x/week"
              />
            </FormControl>
          </FormField>
          <FormField>
            <FormLabel>Deadline</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </FormControl>
          </FormField>
          <FormField>
            <FormLabel>Check-in Type</FormLabel>
            <FormControl>
              <Select
                value={form.checkinType}
                onChange={(e) => setForm({ ...form, checkinType: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Select>
            </FormControl>
          </FormField>
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  )
}