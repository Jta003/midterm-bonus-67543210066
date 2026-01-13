// src/presentation/controllers/bookController.js
const bookService = require('../../business/services/bookService');

class BookController {

    // ------------------ GET /api/books ------------------
    async getAllBooks(req, res, next) {
        try {
            const { status } = req.query;
            console.log('Server: GET all books, filter status =', status || 'all'); // ✅ log
            const result = await bookService.getAllBooks(status);
            console.log('Server: Sending', result.books.length, 'books'); // ✅ log จำนวนหนังสือ
            res.json(result);
        } catch (error) {
            console.error('Server Error (getAllBooks):', error);
            next(error);
        }
    }

    // ------------------ GET /api/books/:id ------------------
    async getBookById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            console.log('Server: GET book by ID =', id); // ✅ log ID
            const book = await bookService.getBookById(id);
            console.log('Server: Book found:', book); // ✅ log หนังสือที่เจอ
            res.json(book);
        } catch (error) {
            console.error('Server Error (getBookById):', error);
            next(error);
        }
    }

    // ------------------ POST /api/books ------------------
    async createBook(req, res, next) {
        try {
            const { title, author, isbn } = req.body;
            console.log('Server: Creating book:', { title, author, isbn }); // ✅ log ข้อมูลหนังสือ
            const newBook = await bookService.createBook({ title, author, isbn });
            console.log('Server: Book created:', newBook); // ✅ log หนังสือที่สร้าง
            res.status(201).json(newBook);
        } catch (error) {
            console.error('Server Error (createBook):', error);
            next(error);
        }
    }

    // ------------------ PUT /api/books/:id ------------------
    async updateBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { title, author, isbn } = req.body;
            console.log('Server: Updating book ID =', id, 'with data:', { title, author, isbn }); // ✅ log
            const updatedBook = await bookService.updateBook(id, { title, author, isbn });
            console.log('Server: Book updated:', updatedBook); // ✅ log ผลลัพธ์
            res.json(updatedBook);
        } catch (error) {
            console.error('Server Error (updateBook):', error);
            next(error);
        }
    }

    // ------------------ DELETE /api/books/:id ------------------
    async deleteBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            console.log('Server: Deleting book ID =', id); // ✅ log ก่อนลบ
            const deletedBook = await bookService.deleteBook(id);
            console.log('Server: Book deleted:', deletedBook); // ✅ log หลังลบ
            res.json({ message: 'Book deleted', book: deletedBook });
        } catch (error) {
            console.error('Server Error (deleteBook):', error);
            next(error);
        }
    }

    // ------------------ PATCH /api/books/:id/borrow ------------------
    async borrowBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            console.log('Server: Borrowing book ID =', id); // ✅ log
            const book = await bookService.borrowBook(id);
            console.log('Server: Book borrowed:', book); // ✅ log
            res.json(book);
        } catch (error) {
            console.error('Server Error (borrowBook):', error);
            next(error);
        }
    }

    // ------------------ PATCH /api/books/:id/return ------------------
    async returnBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            console.log('Server: Returning book ID =', id); // ✅ log
            const book = await bookService.returnBook(id);
            console.log('Server: Book returned:', book); // ✅ log
            res.json(book);
        } catch (error) {
            console.error('Server Error (returnBook):', error);
            next(error);
        }
    }
}

module.exports = new BookController();
