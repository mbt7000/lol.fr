'use client'

import { useState } from 'react'

function cookie(name: string) {
  return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1]
}

export function ProjectsConsole() {
  const [orgId, setOrgId] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  async function listProjects() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/projects`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setProjects(await res.json())
  }

  async function createProject() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/projects`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ name: projectName }),
    })
    listProjects()
  }

  async function listTasks() {
    const token = cookie('ao_token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/tasks?projectId=${projectId}`, {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    })
    setTasks(await res.json())
  }

  async function createTask() {
    const token = cookie('ao_token')
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/orgs/${orgId}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ projectId, title: taskTitle, priority: 'high' }),
    })
    listTasks()
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Projects</h3>
        <input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="orgId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="New project" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <div className="flex gap-2">
          <button onClick={createProject} className="rounded-lg bg-neon px-4 py-2">Create</button>
          <button onClick={listProjects} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
        <div className="mt-3 space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="rounded-lg border border-edge p-2 text-sm">{p.name}</div>
          ))}
        </div>
      </section>

      <section className="glass rounded-xl border border-edge p-4">
        <h3 className="mb-2 font-semibold">Tasks</h3>
        <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="projectId" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" className="mb-2 w-full rounded-lg border border-edge bg-black/20 px-3 py-2" />
        <div className="flex gap-2">
          <button onClick={createTask} className="rounded-lg bg-neon px-4 py-2">Create Task</button>
          <button onClick={listTasks} className="rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Refresh</button>
        </div>
        <div className="mt-3 space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="rounded-lg border border-edge p-2 text-sm">{t.title} · {t.status}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
