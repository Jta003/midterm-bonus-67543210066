// src/business/services/bookService.js
const bookRepository = require('../../data/repositories/bookRepository');
const bookValidator = require('../validators/bookValidator');

class BookService {

    // GET all books + statistics
    async getAllBooks(status = null) {
        // 1. ถ้ามี status ให้ validate
        if (status) {
            bookValidator.validateStatus(status);
        }

        // 2. เรียก repository
        const books = await bookRepository.findAll(status);

        // 3. คำนวณสถิติ
        const available = books.filter(b => b.status === 'available').length;
        const borrowed = books.filter(b => b.status === 'borrowed').length;

        // 4. return
        return {
            books,
            statistics: {
                available,
                borrowed,
                total: books.length
            }
        };
    }

    // GET book by id
    async getBookById(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. เรียก repository
        const book = await bookRepository.findById(id);

        // 3. ถ้าไม่เจอ
        if (!book) {
            throw { name: 'NotFoundError', message: 'Book not found' };
        }

        // 4. return
        return book;
    }

    // CREATE book
    async createBook(bookData) {
        // 1. Validate book data
        bookValidator.validateBookData(bookData);

        // 2. Validate ISBN format
        bookValidator.validateISBN(bookData.isbn);

        // 3. เรียก repository.create
        try {
            const createdBook = await bookRepository.create(bookData);
            return createdBook;
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw { name: 'ConflictError', message: 'ISBN already exists' };
            }
            throw error;
        }
    }

    // UPDATE book
    async updateBook(id, bookData) {
        // 1. Validate ID & data
        bookValidator.validateId(id);
        bookValidator.validateBookData(bookData);
        bookValidator.validateISBN(bookData.isbn);

        // 2. ตรวจสอบว่ามีหนังสือหรือไม่
        const existingBook = await bookRepository.findById(id);
        if (!existingBook) {
            throw { name: 'NotFoundError', message: 'Book not found' };
        }

        // 3. update
        try {
            const updatedBook = await bookRepository.update(id, bookData);
            return updatedBook;
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw { name: 'ConflictError', message: 'ISBN already exists' };
            }
            throw error;
        }
    }

    // BORROW book
    async borrowBook(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. ดึงหนังสือ
        const book = await bookRepository.findById(id);
        if (!book) {
            throw { name: 'NotFoundError', message: 'Book not found' };
        }

        // 3. ตรวจสอบสถานะ
        if (book.status === 'borrowed') {
            throw { name: 'ValidationError', message: 'Book is already borrowed' };
        }

        // 4. update status
        await bookRepository.updateStatus(id, 'borrowed');

        // 5. return updated book
        return await bookRepository.findById(id);
    }

    // RETURN book
    async returnBook(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. ดึงหนังสือ
        const book = await bookRepository.findById(id);
        if (!book) {
            throw { name: 'NotFoundError', message: 'Book not found' };
        }

        // 3. ตรวจสอบสถานะ
        if (book.status !== 'borrowed') {
            throw { name: 'ValidationError', message: 'Book is not borrowed' };
        }

        // 4. update status
        await bookRepository.updateStatus(id, 'available');

        // 5. return updated book
        return await bookRepository.findById(id);
    }

    // DELETE book
    async deleteBook(id) {
        // 1. Validate ID
        bookValidator.validateId(id);

        // 2. ดึงหนังสือ
        const book = await bookRepository.findById(id);
        if (!book) {
            throw { name: 'NotFoundError', message: 'Book not found' };
        }

        // 3. ห้ามลบถ้าถูกยืม
        if (book.status === 'borrowed') {
            throw { name: 'ValidationError', message: 'Cannot delete borrowed book' };
        }

        // 4. ลบ
        await bookRepository.delete(id);
    }
}

module.exports = new BookService();
