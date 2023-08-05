export type Label = 'Green' | 'Blue' | 'Red' | 'Yellow'
export type Status = 'Done' | 'Todo' | 'Doing'
export type Task = {
    id: number
    subject: string
    deadline: Date
    status: Status
    labels: Label[]
    startTime?: Date
    finishTime?: Date
}

export type DoneTask = {
    
}

export let tasks: Task[] = []

export const addTask = (subject: string, deadline: Date) => {
    const task: Task = {
        id: tasks.length + 1,
        subject,
        deadline,
        labels: [],
        status: 'Todo',
    }
    tasks = [...tasks, task]
    return task
}

export const removeTask = (id: number) => {
    let found = tasks.some((task) => task.id == id)
    tasks = tasks.filter((task) => task.id != id)
    return found
}

export const addLabel = (id: number, label: Label) => {
    const task = tasks.find((task) => task.id == id)
    if (!task) return { error: 'task not found' }
    if (!task.labels.includes(label)) {
        task.labels = [...task.labels, label]
    }
    return task
}

export const removeLabel = (id: number, label: Label) => {
    const task = tasks.find((task) => task.id == id)
    if (!task) return { error: 'task not found' }
    task.labels = task.labels.filter((l) => l != label)
    return task
}

export const changeTaskStatus = (id: number, status: Status) => {
    let task = tasks.find((task) => task.id == id)
    if (!task) return { error: 'task not found' }
    if (task.status == status) return task
    if (status == 'Doing') task = { ...task, finishTime: undefined, startTime: new Date() }
    if (status == 'Done') task = { ...task, finishTime: new Date() }
    if (status == 'Todo') task = { ...task, finishTime: undefined, startTime: undefined }
    return task
}

export const search = (mode: 'status' | 'subject' | 'label', query: string) => {
    switch (mode) {
        case 'status':
            return tasks.filter((task) => task.status == query)
            break
        case 'label':
            return tasks.filter((task) => task.labels.includes(query as Label))
            break
        case 'subject':
            return tasks.filter((task) => task.subject.toLowerCase().includes(query.toLowerCase()))
            break
    }
}

const secondsToDHMS = (totalSeconds: number) => {
    const secondsPerMinute = 60
    const secondsPerHour = 3600
    const secondsPerDay = 86400

    const days = Math.floor(totalSeconds / secondsPerDay)
    totalSeconds %= secondsPerDay

    const hours = Math.floor(totalSeconds / secondsPerHour)
    totalSeconds %= secondsPerHour

    const minutes = Math.floor(totalSeconds / secondsPerMinute)
    const seconds = totalSeconds % secondsPerMinute

    return {
        days,
        hours,
        minutes,
        seconds,
    }
}

export const getTaskLength = (id: number) => {
    let task = tasks.find((task) => task.id == id)
    if (!task) return { error: 'task not found' }
    if (task.status !== 'Done') return { error: 'task is not done' }
    if (!task.finishTime || !task.startTime) return { error: 'task data corrupted' }
    return secondsToDHMS(task.finishTime.getTime() - task.startTime.getTime())
}
