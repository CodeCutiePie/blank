// ================================
// 📌 SERVICE WORKER UNTUK PWA
// ================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker Registered', reg))
        .catch(err => console.error('Service Worker Failed', err));
}

// ================================
// 📌 KELAS UNTUK MENGELOLA TO-DO LIST
// ================================
class TodoApp {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.todos = this.loadTodos();
        this.todoListElement = document.getElementById('todo-list');
        this.inputElement = document.getElementById('todo-input');
        this.fetchButton = document.getElementById('fetch-todo');
        
        this.init();
    }

    // 📌 Memuat data dari Local Storage
    loadTodos() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // 📌 Menyimpan data ke Local Storage
    saveTodos() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    // 📌 Menampilkan semua tugas
    renderTodos() {
        this.todoListElement.innerHTML = '';
        this.todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.textContent = todo;
            li.addEventListener('click', () => this.removeTodo(index));
            this.todoListElement.appendChild(li);
        });
    }

    // 📌 Menambahkan tugas baru
    addTodo() {
        const task = this.inputElement.value.trim();
        if (task) {
            this.todos.push(task);
            this.inputElement.value = '';
            this.saveTodos();
            this.renderTodos();
        }
    }

    // 📌 Menghapus tugas berdasarkan index
    removeTodo(index) {
        this.todos.splice(index, 1);
        this.saveTodos();
        this.renderTodos();
    }

    // 📌 Mengambil tugas dari API dan menambahkannya ke daftar
    async fetchRandomTodo() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
            const data = await response.json();
            this.todos.push(data.title);
            this.saveTodos();
            this.renderTodos();
        } catch (error) {
            console.error('Gagal mengambil tugas:', error);
        }
    }

    // 📌 Menginisialisasi event listener
    init() {
        document.getElementById('add-todo').addEventListener('click', () => this.addTodo());
        this.fetchButton.addEventListener('click', () => this.fetchRandomTodo());
        this.renderTodos();
    }
}

// ================================
// 📌 MEMULAI APLIKASI
// ================================
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp('todo-list-data');
});
