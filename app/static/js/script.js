const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "todas";
let allTasks = [];

async function loadTasks() {
    // Busca as tarefas do usuário logado ao abrir a página
    const res = await fetch("/api/tasks");
    allTasks = await res.json();
    renderTasks();
}

function renderTasks() {
    // Desenha a lista de tarefas na tela, aplicando o filtro ativo
    taskList.innerHTML = "";

    const filtered = allTasks.filter((t) => {
        if (currentFilter === "todas") return true;
        return t.status === currentFilter;
    });

    emptyState.hidden = filtered.length > 0;

    filtered.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item" + (task.status === "concluida" ? " completed" : "");
        li.dataset.priority = task.priority;
        li.dataset.id = task.id;

        const dueText = task.due_date ? formatDate(task.due_date) : "Sem prazo";
        const hasDescription = task.description && task.description.trim().length > 0;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.status === "concluida" ? "checked" : ""}>
            <div class="task-body">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span>📅 ${dueText}</span>
                    <span>⚡ ${capitalize(task.priority)}</span>
                    ${hasDescription ? '<span class="task-toggle-desc">▾ ver detalhes</span>' : ""}
                </div>
                ${hasDescription ? `<div class="task-description" hidden>${escapeHtml(task.description)}</div>` : ""}
            </div>
            <button class="task-delete" title="Excluir">✕</button>
        `;

        li.querySelector(".task-checkbox").addEventListener("change", (e) => toggleStatus(task.id, e.target.checked));
        li.querySelector(".task-delete").addEventListener("click", () => deleteTask(task.id));

        if (hasDescription) {
            const toggle = li.querySelector(".task-toggle-desc");
            const descBox = li.querySelector(".task-description");
            toggle.addEventListener("click", () => {
                const isHidden = descBox.hidden;
                descBox.hidden = !isHidden;
                toggle.textContent = isHidden ? "▴ ocultar detalhes" : "▾ ver detalhes";
            });
        }

        taskList.appendChild(li);
    });
}

taskForm.addEventListener("submit", async (e) => {
    // Envia os dados do formulário e adiciona a nova tarefa à lista
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const due_date = document.getElementById("due_date").value || null;
    const priority = document.getElementById("priority").value;
    const description = document.getElementById("description").value.trim();

    if (!title) return;

    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, due_date, priority, description }),
    });

    if (res.ok) {
        const newTask = await res.json();
        allTasks.unshift(newTask);
        renderTasks();
        taskForm.reset();
        document.getElementById("description").value = "";
    }
});

async function toggleStatus(id, isChecked) {
    // Alterna o status da tarefa entre pendente e concluída
    const status = isChecked ? "concluida" : "pendente";

    const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    if (res.ok) {
        const updated = await res.json();
        allTasks = allTasks.map((t) => (t.id === id ? updated : t));
        renderTasks();
    }
}

async function deleteTask(id) {
    // Remove a tarefa da lista e do banco
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
        allTasks = allTasks.filter((t) => t.id !== id);
        renderTasks();
    }
}

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

loadTasks();