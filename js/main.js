const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

//переменная для хранения массива с задачами
let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => {
    renderTask(task)
  })
}

checkEmpyList();

// добавление задачи
form.addEventListener('submit', addTask);
// удаление задачи
tasksList.addEventListener('click', deleteTask);
//отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);


//функция добавления задачи
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;

  //описание задачи в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //добавляю задачу в массив с задачами
  tasks.push(newTask);
  // сохраняю список задач в локалсторадж
  saveToLocalStorage()

  renderTask(newTask);

  taskInput.value = '';
  taskInput.focus();
  checkEmpyList();
}

//фунция удаления задачи
function deleteTask(e) {
  //проверяем еслм клик был НЕ по кнопке
  if (e.target.dataset.action !== 'delete') return;
  //проверяем клик по кнопке{
  const parenNode = e.target.closest('.list-group-item');

  //определяю ID задачи
  const id = Number(parenNode.id);
  console.log(id)

  //удаляю задачу через фильтрафцию массива
  tasks = tasks.filter((task) => task.id !== id );

  saveToLocalStorage()

  //удаляю задачу из разметки
  parenNode.remove();

  checkEmpyList();
}

//фунция отметки завершенной задачи
function doneTask(e) {
  //проверяем еслм клик был НЕ по кнопке
  if (e.target.dataset.action !== 'done') return;

  //проверяем что клик был по кнопке "задача  выполнена"
  const parentNode = e.target.closest('.list-group-item');
  //определяю ID задачи
  const id = Number(parentNode.id);
  const task = tasks.find((task) => {
    if (task.id === id) {
      return true
    }
  })
  task.done = !task.done;
  saveToLocalStorage()

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done')
}

function checkEmpyList() {
  if (tasks.length === 0) {
    const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`
    tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

//функци для сохранения массива в локалсторадж
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

//рендер задач на страницу
function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

  const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
          <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
              <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
          </div>
        </li>`
  
  tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
