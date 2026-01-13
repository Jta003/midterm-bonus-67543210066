// src/business/validators/bookValidator.js
class BookValidator {

    validateBookData(data) {
        const { title, author, isbn } = data;

        if (!title || !author || !isbn) {
            throw {
                name: 'ValidationError',
                message: 'Title, author, and ISBN are required'
            };
        }

        return true;
    }

    validateISBN(isbn) {
        // Pattern: (978|979) + 9 digits + (digit or X)
        const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;
        const cleanISBN = isbn.replace(/-/g, '');

        if (!isbnPattern.test(cleanISBN)) {
            throw {
                name: 'ValidationError',
                message: 'Invalid ISBN format'
            };
        }

        return true;
    }

    validateId(id) {
        const numId = parseInt(id);

        if (isNaN(numId) || numId <= 0) {
            throw {
                name: 'ValidationError',
                message: 'Invalid book ID'
            };
        }

        return numId;
    }

    validateStatus(status) {
        const allowedStatus = ['available', 'borrowed'];

        if (!allowedStatus.includes(status)) {
            throw {
                name: 'ValidationError',
                message: 'Invalid status value'
            };
        }

        return true;
    }
}

module.exports = new BookValidator();
