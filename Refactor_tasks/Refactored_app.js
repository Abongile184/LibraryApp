class Book {
    static myLibrary = []; // is a class-wide property shared by all instances.

    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleReadStatus() {
        this.read = !this.read;
    }

    //This method provides access to the static myLibrary property. 
    //It allows you to retrieve the list of books without needing to create an instance of Book.
    static getMyLibrary(){
        return Book.myLibrary;
    }

    //This allows you to call it directly on the class without needing an instance of Book
    static addBookToLibrary(title, author, pages, read){
        Book.myLibrary.push(new Book(title, author, pages, read));
    }
}

new Book();

class Library extends Book{
    constructor(title, author, pages, read) {
        super(title, author, pages, read);

        // Ensures that the DOM elements are available for manipulation before your code tries to access or modify them.
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }

    //method used to toggle read status by the toggle button on the book card
    toggleReadStatus() {
        this.read = !this.read;
    }

    initialize(){ //method for all event listeners
        this.domCreate();
        this.initEventListeners();
        this.displayBooks()
    }

    //This method retrieves and caches DOM elements in class properties.
    domCreate() {
        this.dialogElem = document.getElementById("dialog");
        this.showBtn = document.querySelector(".pushable");
        this.top_heading = document.querySelector(".top-heading");
        this.closeBtn = document.querySelector(".close");
        this.captureBooks = document.getElementById('submit-button');

        // Form elements
        this.titleInput = document.getElementById("title");
        this.authorInput = document.getElementById("author");
        this.numPagesInput = document.getElementById("numberOfPages");
        this.hasReadCheckbox = document.getElementById('Has-read-book');
        this.hasNotReadCheckbox = document.getElementById('Has-Notread-book');
        this.booksContainer = document.querySelector(".displaybooks");

    }
    
    initEventListeners() { //The ?. operator (also known as the optional chaining operator) is used to prevent errors if any of the elements 
        this.showBtn?.addEventListener("click", () => this.showDialog());
        this.closeBtn?.addEventListener("click", () => this.closeDialog());

        //this part also handles form validation checking if every field has been filled in 
        this.captureBooks?.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form from submitting
            const read = this.getStatus(); 
        
            const title = this.titleInput.value;
            const author = this.authorInput.value;
            const numPages = parseInt(this.numPagesInput.value); // Parse to integer
        
            // Check if any field is empty
            if (title === '' || author === '' || isNaN(numPages) || read === 'No selection') {
                alert('Please fill out all fields.');
                return;
            }

            this.addBookFromForm();
            this.displayBooks();
            this.closeDialog() 
        });

        // Bind the `onlyOne` method to checkboxes
        this.hasReadCheckbox?.addEventListener("click", (event) => this.onlyOne(event.target));
        this.hasNotReadCheckbox?.addEventListener("click", (event) => this.onlyOne(event.target));
        
        //each book created has two buttons so even listeners are added here so they can perform functions respectively
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-btn')) {
                const index = event.target.dataset.index;
                Book.myLibrary.splice(index, 1);
                this.displayBooks();
            }

            if (event.target.classList.contains('toggle-read-btn')) {
                const index = event.target.dataset.index;
                Book.myLibrary[index].toggleReadStatus();
                this.displayBooks();
            }
        });

    }

    showDialog() { // to control how the dialog form behaves
        if (this.dialogElem) {
            this.dialogElem.showModal();
            this.toggleVisibility(false);
        }
    }

    closeDialog() {
        if (this.dialogElem) {
            this.dialogElem.close();
            this.toggleVisibility(true);
        }
    }

    toggleVisibility(isVisible) {
        const displayStyle = isVisible ? "block" : "none";
        this.showBtn.style.display = displayStyle;
        this.top_heading.style.display = displayStyle;
    }

    //to make sure only one checkbox is selected at a time as a valid input  
    onlyOne(selectedCheckbox) {
        console.log(`Checkbox selected: ${selectedCheckbox.value}`); // for debugging purposes 
        if (selectedCheckbox.checked) {
            const checkboxes = [this.hasReadCheckbox, this.hasNotReadCheckbox];
            checkboxes.forEach(checkbox => {
                if (checkbox !== selectedCheckbox) checkbox.checked = false;
            });
        }
    }

    getStatus() {// to get the status of the selected checkbox from the UI or read / not read book
        if (this.hasReadCheckbox.checked) {
            return "Has been read";
        } else if (this.hasNotReadCheckbox.checked) {
            return "Has not been read";
        } else {
            return "No selection";
        }
    }

    //this method generates randomized color books
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // Method to create a book card
    createBookCard(book, index) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.style.color = "white";
        bookCard.style.backgroundColor = this.getRandomColor();
    
        const titleElement = document.createElement('h2');
        titleElement.textContent = book.title;
    
        const authorElement = document.createElement('p');
        authorElement.textContent = 'Author: ' + book.author;
    
        const pagesElement = document.createElement('p');
        pagesElement.textContent = 'Pages: ' + book.pages;
    
        const readStatusElement = document.createElement('p');
        readStatusElement.textContent = 'Status: ' + (book.read ? 'Read' : 'Not Read');
        readStatusElement.classList.add('read-status');
    
        // Button container to keep buttons together
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('buttons');
    
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.dataset.index = index;
    
        const toggleReadButton = document.createElement('button');
        toggleReadButton.textContent = 'Toggle Read';
        toggleReadButton.classList.add('toggle-read-btn');
        toggleReadButton.dataset.index = index;
    
        // Add buttons to container
        buttonContainer.appendChild(removeButton);
        buttonContainer.appendChild(toggleReadButton);
    
        // Append all elements to the book card
        bookCard.appendChild(titleElement);
        bookCard.appendChild(authorElement);
        bookCard.appendChild(pagesElement);
        bookCard.appendChild(readStatusElement);
        bookCard.appendChild(buttonContainer);
    
        return bookCard;
    }

    addBookFromForm() {
        const title = this.titleInput.value;
        const author = this.authorInput.value;
        const numPages = parseInt(this.numPagesInput.value);
        const read = this.getStatus();

        // Add the new book to the library
        Book.addBookToLibrary(title, author, numPages, read === 'Has been read');

        // Log the current state of the library
        console.log(Book.myLibrary.map(book => ({  //for debugging purposes 
            title: book.title,
            author: book.author,
            pages: book.pages,
            read: book.read
        })));

        // Refresh the display of books
        this.displayBooks();

        // Reset form inputs after submitting 
        this.titleInput.value = '';
        this.authorInput.value = '';
        this.numPagesInput.value = '';
        this.hasReadCheckbox.checked = false;
        this.hasNotReadCheckbox.checked = false;
    }

    displayBooks() {
        const libraryContainer = document.querySelector(".displaybooks");
    
        // Clear previous content
        libraryContainer.innerHTML = '';
    
        // Loop through the library array
        Library.myLibrary.forEach((book, index) => {
            const bookCard = this.createBookCard(book, index); // Use 'this.' to access the method
            libraryContainer.appendChild(bookCard);
        });
    }
    

}

new Library();

