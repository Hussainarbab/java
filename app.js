const STORAGE_KEY = 'brighttodo.todos'
const THEME_KEY = 'brighttodo.theme'

let todos = []
let filter = 'all'

const $ = sel => document.querySelector(sel)
const newTodoInput = $('#newTodo')
const addBtn = $('#addBtn')
const todoList = $('#todoList')
const countEl = $('#count')
const filters = Array.from(document.querySelectorAll('.filter'))
const clearCompletedBtn = $('#clearCompleted')
const themeToggle = $('#themeToggle')

function load() {
	try{
		const raw = localStorage.getItem(STORAGE_KEY)
		todos = raw ? JSON.parse(raw) : []
	}catch(e){ todos = [] }
	const theme = localStorage.getItem(THEME_KEY) || 'light'
	setTheme(theme)
}

function save(){
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function render(){
	todoList.innerHTML = ''
	const visible = todos.filter(t => {
		if(filter === 'all') return true
		if(filter === 'active') return !t.completed
		return t.completed
	})

	visible.forEach(todo => {
		const li = document.createElement('li')
		li.className = 'todo-item'
		li.dataset.id = todo.id

		const checkbox = document.createElement('button')
		checkbox.className = 'checkbox' + (todo.completed ? ' checked' : '')
		checkbox.innerHTML = todo.completed ? '✓' : ''
		checkbox.title = 'Toggle complete'

		const text = document.createElement('div')
		text.className = 'todo-text' + (todo.completed ? ' completed' : '')
		text.textContent = todo.text
		text.title = 'Double-click to edit'

		const actions = document.createElement('div')
		actions.className = 'actions'
		const del = document.createElement('button')
		del.className = 'icon-btn delete'
		del.textContent = '🗑️'
		del.title = 'Delete'

		actions.appendChild(del)

		li.appendChild(checkbox)
		li.appendChild(text)
		li.appendChild(actions)

		todoList.appendChild(li)
	})

	const remaining = todos.filter(t=>!t.completed).length
	countEl.textContent = `${remaining} item${remaining===1? '':'s'}`
}

function addTodo(text){
	const t = text.trim()
	if(!t) return
	todos.unshift({id: Date.now().toString(), text: t, completed: false})
	save(); render(); newTodoInput.value = ''
}

function toggleComplete(id){
	const it = todos.find(t=>t.id===id)
	if(!it) return
	it.completed = !it.completed
	save(); render()
}

function removeTodo(id){
	todos = todos.filter(t=>t.id!==id)
	save(); render()
}

function clearCompleted(){
	todos = todos.filter(t => !t.completed)
	save(); render()
}

function setFilter(f){
	filter = f
	filters.forEach(b=>b.classList.toggle('active', b.dataset.filter===f))
	render()
}

function setTheme(t){
	if(t === 'dark') document.body.classList.add('dark')
	else document.body.classList.remove('dark')
	themeToggle.textContent = t === 'dark' ? '☀️' : '🌙'
	localStorage.setItem(THEME_KEY, t)
}

function toggleTheme(){
	const isDark = document.body.classList.contains('dark')
	setTheme(isDark ? 'light' : 'dark')
}

// Events
document.addEventListener('DOMContentLoaded', ()=>{
	load(); render()
})

addBtn.addEventListener('click', ()=> addTodo(newTodoInput.value))
newTodoInput.addEventListener('keydown', e=>{ if(e.key==='Enter') addTodo(newTodoInput.value) })

todoList.addEventListener('click', e=>{
	const li = e.target.closest('.todo-item')
	if(!li) return
	const id = li.dataset.id
	if(e.target.classList.contains('checkbox')){
		toggleComplete(id)
	}else if(e.target.classList.contains('delete')){
		removeTodo(id)
	}
})

// double click to edit
todoList.addEventListener('dblclick', e=>{
	const li = e.target.closest('.todo-item')
	if(!li) return
	const id = li.dataset.id
	const todo = todos.find(t=>t.id===id)
	if(!todo) return

	const input = document.createElement('input')
	input.type = 'text'
	input.value = todo.text
	input.className = 'edit-input'
	li.querySelector('.todo-text').replaceWith(input)
	input.focus()

	function finish(){
		const val = input.value.trim()
		if(val) todo.text = val
		save(); render()
	}

	input.addEventListener('blur', finish)
	input.addEventListener('keydown', ev=>{
		if(ev.key==='Enter') finish()
		if(ev.key==='Escape') render()
	})
})

filters.forEach(b=>b.addEventListener('click', ()=> setFilter(b.dataset.filter)))
clearCompletedBtn.addEventListener('click', clearCompleted)
themeToggle.addEventListener('click', toggleTheme)

