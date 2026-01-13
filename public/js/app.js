// App.js – Library Management (Client–Server Version)

// Current filter
let currentFilter = 'all';

// Base URL ของ Server API
const API_BASE = 'http://192.168.56.101:3000/api/books';

// ---------------------- Initialize App ----------------------
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadBooks();
});

// ---------------------- Event Listeners ----------------------
function setupEventListeners() {
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            filterBooks(filter);
        });
    });
    
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('book-form').addEventListener('submit', handleSubmit);
}

// ---------------------- Load Books ----------------------
async function loadBooks(status = null) {
    try {
        showLoading();
        
        let url = API_BASE;
        if (status && status !== 'all') url += `?status=${status}`;
        console.log("Fetching books from URL:", url);
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch books');
        const data = await res.json();
        
        displayBooks(data.books);
        updateStatistics(data.statistics);
        
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load books: ' + error.message);
        hideLoading();
    }
}

// ---------------------- Display Books ----------------------
function displayBooks(books) {
    const container = document.getElementById('book-list');
    
    if (books.length === 0) {
        container.innerHTML = '<div class="no-books">📚 No books found</div>';
        return;
    }
    
    container.innerHTML = books.map(book => createBookCard(book)).join('');
}

// ---------------------- Create Book Card ----------------------
function createBookCard(book) {
    return `
        <div class="book-card">
            <h3>${escapeHtml(book.title)}</h3>
            <p class="author">👤 ${escapeHtml(book.author)}</p>
            <p class="isbn">🔖 ISBN: ${escapeHtml(book.isbn)}</p>
            <span class="status-badge status-${book.status}">
                ${book.status === 'available' ? '✅' : '📖'} ${book.status.toUpperCase()}
            </span>
            <div class="actions">
                ${book.status === 'available' 
                    ? `<button class="btn btn-success" onclick="borrowBook(${book.id})">Borrow</button>`
                    : `<button class="btn btn-warning" onclick="returnBook(${book.id})">Return</button>`
                }
                <button class="btn btn-secondary" onclick="editBook(${book.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `;
}

// ---------------------- Update Statistics ----------------------
function updateStatistics(stats) {
    document.getElementById('stat-available').textContent = stats.available;
    document.getElementById('stat-borrowed').textContent = stats.borrowed;
    document.getElementById('stat-total').textContent = stats.total;
}

// ---------------------- Filter Books ----------------------
function filterBooks(status) {
    currentFilter = status;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === status) btn.classList.add('active');
    });
    
    loadBooks(status === 'all' ? null : status);
}

// ---------------------- Show/Hide Loading ----------------------
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('book-list').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('book-list').style.display = 'grid';
}

// ---------------------- Modal ----------------------
function showAddModal() {
    document.getElementById('modal-title').textContent = 'Add New Book';
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('book-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
}

// ---------------------- Form Submit ----------------------
async function handleSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('book-id').value;
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value
    };
    try {
        if (id) await updateBook(id, bookData);
        else await createBook(bookData);
        alert(id ? 'Book updated!' : 'Book added!');
        closeModal();
        loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ---------------------- CRUD API Calls ----------------------
async function createBook(bookData) {
    console.log("Creating book:", bookData);
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });
    if (!res.ok) throw new Error('Failed to create book');
    return await res.json();
}

async function updateBook(id, bookData) {
    console.log(`Updating book ID ${id}:`, bookData);
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });
    if (!res.ok) throw new Error('Failed to update book');
    return await res.json();
}

async function getBookById(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Failed to get book');
    return await res.json();
}

async function deleteBook(id) {
    console.log(`Updating book ID ${id}:`, bookData);
    try {
        // 1. ดึงข้อมูลหนังสือก่อน
        const book = await getBookById(id);

        // 2. ตรวจสอบสถานะ
        if (book.status === 'borrowed') {
            alert('❌ Cannot delete: This book is currently borrowed.');
            return; // ออกเลย ไม่ส่ง request ลบ
        }

        // 3. Confirm กับผู้ใช้
        if (!confirm('Are you sure you want to delete this book?')) return;

        // 4. ส่ง request ลบ
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete book');

        alert('Book deleted successfully!');
        loadBooks(currentFilter === 'all' ? null : currentFilter);

    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book: ' + error.message);
    }
}


// ---------------------- Borrow / Return ----------------------
async function borrowBook(id) {
    console.log("Borrowing book ID:", id);
    if (!confirm('Do you want to borrow this book?')) return;
    const res = await fetch(`${API_BASE}/${id}/borrow`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to borrow book');
    alert('Book borrowed successfully!');
    loadBooks(currentFilter === 'all' ? null : currentFilter);
}

async function returnBook(id) {
    console.log("Returning book ID:", id);
    if (!confirm('Do you want to return this book?')) return;
    const res = await fetch(`${API_BASE}/${id}/return`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to return book');
    alert('Book returned successfully!');
    loadBooks(currentFilter === 'all' ? null : currentFilter);
}

// ---------------------- Edit Book ----------------------
async function editBook(id) {
    console.log("Editing book ID:", id);
    try {
        const book = await getBookById(id);
        document.getElementById('modal-title').textContent = 'Edit Book';
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
        document.getElementById('book-modal').style.display = 'flex';
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ---------------------- Utility ----------------------
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
