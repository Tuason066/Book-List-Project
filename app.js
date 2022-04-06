// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    };
};
// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.books();
        books.forEach(book => UI.addBook(book));
    }

    static addBook(book) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn-sm btn-danger delete">X</a></td>
        `;

        document.querySelector('#book-list').appendChild(row);
    };

    static removeBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();            
        };
    };

    static showAlert(message, action) {
        const div = document.createElement('div');
        div.className = `alert alert-${action}`;
        div.textContent = message;

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(() => {div.remove();},3000);
    };

    static resetFields() {
        const fields = ['title', 'author', 'isbn'];
        fields.forEach(field => {
            document.getElementById(field).value = '';
        });
    };
};

// Store Class: Handles Storage
class Store {
    static books() {
        const books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];
        return books
    };

    static addBook(book) {
        const books = Store.books();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    };

    static removeBook(target) {
        if(target.classList.contains('delete')) {
            const isbn = target.parentElement.previousElementSibling.textContent;

            console.log(isbn);
            let books = Store.books();

            books = books.filter(function(book) {
                if(book.isbn !== isbn) {
                    return book;
                };
            });

            localStorage.setItem('books', JSON.stringify(books));
        };
    };
};

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks());

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(!title || !author || !isbn) {
        // show alert
        UI.showAlert('Please Enter Value On Fields', 'danger');
    } else {
        const book = new Book(title, author, isbn);
        UI.addBook(book);
        Store.addBook(book);
        UI.showAlert('Book Added To The List', 'success');
        UI.resetFields();
    };
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', function(e) {
    UI.removeBook(e.target);
    Store.removeBook(e.target);
});