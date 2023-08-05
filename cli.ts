import * as readline from 'readline'
import { addTask, removeTask, addLabel, removeLabel, changeTaskStatus, search, Label, Status, getTaskLength } from './controller.js'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const showMenu = () => {
    console.log('\n===== Task Management CLI =====')
    console.log('1. Add Task')
    console.log('2. Remove Task')
    console.log('3. Add Label to Task')
    console.log('4. Remove Label from Task')
    console.log('5. Change Task Status')
    console.log('6. Search Tasks')
    console.log('7. Task Length')
    console.log('8. Exit')
}

const handleAddTask = () => {
    rl.question('Enter task subject: ', (subject) => {
        rl.question('Enter deadline date (yyyy-mm-dd): ', (deadlineDateStr) => {
            rl.question('Enter deadline time (hh:mm): ', (deadlineTimeStr) => {
                const deadlineDate = new Date(deadlineDateStr)
                const [hours, minutes] = deadlineTimeStr.split(':').map((str) => parseInt(str, 10))
                if (isNaN(deadlineDate.getTime()) || isNaN(hours) || isNaN(minutes)) {
                    console.log('Invalid date or time format. Task not added.')
                } else {
                    const deadline = new Date(deadlineDate)
                    deadline.setHours(hours)
                    deadline.setMinutes(minutes)

                    const task = addTask(subject, deadline)
                    console.log('Task added successfully:')
                    console.log(task)
                }
                showMenu()
            })
        })
    })
}

const handleRemoveTask = () => {
    rl.question('Enter task id to remove: ', (idStr) => {
        const id = parseInt(idStr, 10)
        if (isNaN(id)) {
            console.log('Invalid task id. Task not removed.')
        } else {
            const found = removeTask(id)
            if (found) {
                console.log('Task removed successfully.')
            } else {
                console.log('Task not found.')
            }
        }
        showMenu()
    })
}

const isValidStatus = (status: string): boolean => {
    return ['Done', 'Todo', 'Doing'].includes(status)
}

const isValidLabel = (label: string): boolean => {
    return ['Green', 'Blue', 'Red', 'Yellow'].includes(label)
}

const handleAddLabel = () => {
    rl.question('Enter task id: ', (idStr) => {
        rl.question('Enter label (Green/Blue/Red/Yellow): ', (label) => {
            const id = parseInt(idStr, 10)
            if (isNaN(id)) {
                console.log('Invalid task id. Label not added.')
                showMenu()
                return
            }

            if (!isValidLabel(label)) {
                console.log('Invalid label. Please enter a valid label (Green/Blue/Red/Yellow).')
                showMenu()
                return
            }

            const task = addLabel(id, label as Label)
            if ('error' in task) {
                console.log(task.error)
            } else {
                console.log('Label added successfully:')
                console.log(task)
            }
            showMenu()
        })
    })
}

const handleRemoveLabel = () => {
    rl.question('Enter task id: ', (idStr) => {
        rl.question('Enter label (Green/Blue/Red/Yellow): ', (label) => {
            const id = parseInt(idStr, 10)
            if (isNaN(id)) {
                console.log('Invalid task id. Label not removed.')
            } else {
                const task = removeLabel(id, label as Label)
                if ('error' in task) {
                    console.log(task.error)
                } else {
                    console.log('Label removed successfully:')
                    console.log(task)
                }
            }
            showMenu()
        })
    })
}

const handleChangeTaskStatus = () => {
    rl.question('Enter task id: ', (idStr) => {
        rl.question('Enter status (Done/Todo/Doing): ', (status) => {
            const id = parseInt(idStr, 10)
            if (isNaN(id)) {
                console.log('Invalid task id. Task status not changed.')
                showMenu()
                return
            }

            if (!isValidStatus(status)) {
                console.log('Invalid status. Please enter a valid status (Done/Todo/Doing).')
                showMenu()
                return
            }

            const task = changeTaskStatus(id, status as Status)
            if ('error' in task) {
                console.log(task.error)
            } else {
                console.log('Task status changed successfully:')
                console.log(task)
            }
            showMenu()
        })
    })
}

const handleSearchTasks = () => {
    rl.question('Enter search mode (status/subject/label): ', (mode) => {
        rl.question('Enter search query: ', (query) => {
            if (mode === 'label' && !isValidLabel(query)) {
                console.log('Invalid label. Please enter a valid label (Green/Blue/Red/Yellow).')
                showMenu()
                return
            }
            const result = search(mode as 'status' | 'subject' | 'label', query)
            console.log('Search result:')
            console.log(result)
            showMenu()
        })
    })
}

const handleTaskLength = () => {
    rl.question('Enter task id: ', (idStr) => {
        rl.question('Enter status (Done/Todo/Doing): ', (status) => {
            const id = parseInt(idStr, 10)
            if (isNaN(id)) {
                console.log('Invalid task id. Task status not changed.')
                showMenu()
                return
            }

            const length = getTaskLength(id)
            if ('error' in length) {
                console.log(length.error)
            } else {
                console.log('Task length retrieved successfully:')
                console.log(length)
            }
            showMenu()
        })
    })
}

const handleExit = () => {
    console.log('Exiting Task Management CLI. Goodbye!')
    rl.close()
}

const handleInput = (input: string) => {
    const option = parseInt(input, 10)
    switch (option) {
        case 1:
            handleAddTask()
            break
        case 2:
            handleRemoveTask()
            break
        case 3:
            handleAddLabel()
            break
        case 4:
            handleRemoveLabel()
            break
        case 5:
            handleChangeTaskStatus()
            break
        case 6:
            handleSearchTasks()
            break
        case 7:
            handleTaskLength()
            break
        case 8:
            handleExit()
            break
        default:
            console.log('Invalid option. Please choose again.')
            showMenu()
            break
    }
}

export const startCLI = () => {
    showMenu()
    rl.on('line', handleInput)
}
