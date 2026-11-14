// Simple to-do list — tasks are saved in the browser (localStorage).
const STORAGE_KEY = 'farhan-todo-tasks';
const form = document.getElementById('add-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const countEl = document.getElementById('count');
const clearBtn = document.getElementById('clear-completed');

let tasks = loadTasks();
let filter = 'all';
let nextId = tasks.reduce(function (max, t) { return Math.max(max, typeof t.id === 'number' ? t.id : 0); }, 0) + 1;

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';
  const visible = tasks.filter(function (t) {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });
  emptyMsg.style.display = visible.length === 0 ? 'block' : 'none';
  visible.forEach(function (task) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('completed');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'task-check';
    check.checked = task.done;
    check.setAttribute('aria-label', 'Mark task complete');
    check.addEventListener('change', function () {
      task.done = check.checked;
      saveTasks();
      render();
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'Delete';
    del.addEventListener('click', function () {
      tasks = tasks.filter(function (t) { return t.id !== task.id; });
      saveTasks();
      render();
    });

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
  const active = tasks.filter(function (t) { return !t.done; }).length;
  countEl.textContent = active + (active === 1 ? ' task left' : ' tasks left');
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') return;
  tasks.push({ id: nextId++, text: text, done: false });
  input.value = '';
  input.focus();
  saveTasks();
  render();
});

document.querySelectorAll('.filter').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    filter = btn.getAttribute('data-filter');
    render();
  });
});

clearBtn.addEventListener('click', function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  render();
});

render();
