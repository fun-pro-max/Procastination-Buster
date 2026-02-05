document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const pickBtn = document.getElementById('pickBtn');
    const selectedTaskContainer = document.getElementById('selectedTaskContainer');
    const taskCountEl = document.getElementById('taskCount');
    const completedCountEl = document.getElementById('completedCount');
    
    let tasks = [];
    let completedTasks = 0;
    let isSelecting = false;

    function updateStats() {
        taskCountEl.textContent = tasks.length;
        completedCountEl.textContent = completedTasks;
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;
        
        tasks.push({ id: Date.now(), text: text, selected: false });
        taskInput.value = '';
        render();
    }

    function render() {
        if (tasks.length === 0) {
            taskList.innerHTML = '';
            taskList.appendChild(emptyState);
        } else {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const div = document.createElement('div');
                div.className = `task-item ${task.selected ? 'selected' : ''}`;
                div.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="task-btn select" onclick="manualSelect(${task.id})"><i class="fas fa-check"></i></button>
                        <button class="task-btn delete" onclick="removeTask(${task.id})"><i class="fas fa-times"></i></button>
                    </div>
                `;
                taskList.appendChild(div);
            });
        }
        updateStats();
    }

    window.removeTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        render();
    };

    window.manualSelect = (id) => {
        tasks.forEach(t => t.selected = (t.id === id));
        render();
        const task = tasks.find(t => t.id === id);
        showFinalSelection(task);
    };

    function showFinalSelection(task) {
        selectedTaskContainer.innerHTML = `
            <div class="selected-task">
                <h3>Priority Goal:</h3>
                <p>${task.text}</p>
                <button class="btn btn-outline" onclick="resetSelection()">Pick Another</button>
            </div>
        `;
    }

    window.resetSelection = () => {
        tasks.forEach(t => t.selected = false);
        selectedTaskContainer.innerHTML = '';
        render();
    };

    pickBtn.onclick = () => {
        if (tasks.length === 0 || isSelecting) return;
        
        isSelecting = true;
        pickBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        let counter = 0;
        let interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * tasks.length);
            tasks.forEach((t, i) => t.selected = (i === randomIndex));
            render();
            counter++;

            if (counter > 10) {
                clearInterval(interval);
                isSelecting = false;
                pickBtn.innerHTML = '<i class="fas fa-random"></i> Pick For Me!';
                completedTasks++;
                showFinalSelection(tasks.find(t => t.selected));
                updateStats();
            }
        }, 100);
    };

    addTaskBtn.onclick = addTask;
    taskInput.onkeypress = (e) => { if(e.key === 'Enter') addTask(); };
});