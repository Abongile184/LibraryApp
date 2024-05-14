//js code for the dialog model to invoke the form:
const dialogElem = document.getElementById("dialog");
const showBtn = document.querySelector(".pushable");
const top_heading = document.querySelector(".top-heading");
const closeBtn = document.querySelector(".close");
const captureBooks = document.getElementById('submit-button');

// Define all elements from the form so they are accessible on all functions when called 
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const numPagesInput = document.getElementById("numberOfPages");
const hasReadCheckbox = document.getElementById('Has-read-book');
const hasNotReadCheckbox = document.getElementById('Has-Notread-book');

//button for the dialog model form
showBtn.addEventListener("click", () => {
    dialogElem.showModal();
    showBtn.style.display = "none"; // Hide the button when dialog is opened
	top_heading.style.display = "none";
});

closeBtn.addEventListener("click", () => {
    dialogElem.close();
    showBtn.style.display = "block"; // Show the button when dialog is closed
	top_heading.style.display = "block";
});

//to prevent a user from selecting more than one checkbox :
function onlyOne(checkbox) {
    let checkboxes = document.getElementsByName('status')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}


//js code to do all values from a form then add them into an array then use 4 loop to create data 
const myLibrary = [];

function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
}


// Function to determine the status on a selected checkbox
function getStatus() {
    if (hasReadCheckbox.checked) {
        return "Has been read";
    } else if (hasNotReadCheckbox.checked) {
        return "Has not been read";
    } else {
        return "No selection";
    }
}

//JS code to generate random colors for each card:
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Function to create a book card
function createBookCard(book, index) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.style.color = "white";
    bookCard.style.backgroundColor = getRandomColor();

    const titleElement = document.createElement('h2');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = 'Author: ' + book.author;

    const pagesElement = document.createElement('p');
    pagesElement.textContent = 'Pages: ' + book.pages;

    const readStatusElement = document.createElement('p');
    readStatusElement.textContent = 'Status: ' + (book.read ? 'Read' : 'Not Read');
    readStatusElement.classList.add('read-status'); // Add a class for easier targeting

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
    removeButton.dataset.index = index;

    const toggleReadButton = document.createElement('button');
    toggleReadButton.textContent = 'Toggle Read';
    toggleReadButton.classList.add('toggle-read-btn');

    toggleReadButton.dataset.index = index; // Store the index of the book

    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(pagesElement);
    bookCard.appendChild(readStatusElement);
    bookCard.appendChild(removeButton);
    bookCard.appendChild(toggleReadButton);

    return bookCard;
}
// a function that loops through the array and displays each book on the page. 
// Function to display books
function displayBooks() {
    const libraryContainer = document.querySelector(".displaybooks");

    // Clear previous content
    libraryContainer.innerHTML = '';

    // Loop through the library array
    myLibrary.forEach((book, index) => {
        const bookCard = createBookCard(book, index);
        libraryContainer.appendChild(bookCard);
    });
}

// Event listener for remove button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const index = event.target.dataset.index;
        myLibrary.splice(index, 1);
        displayBooks();
    }
});

// Event listener for toggle read button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-read-btn')) {
        const index = event.target.dataset.index;
        myLibrary[index].toggleReadStatus();
        const readStatusElement = event.target.closest('.book-card').querySelector('.read-status');
        readStatusElement.textContent = 'Status: ' + (myLibrary[index].read ? 'Read' : 'Not Read');
    }
});

// Function to toggle read status in Book prototype
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
};

//this is the main button on the dialog form that sends the data from the form to the array then perform other functions also:
captureBooks.addEventListener('click', function(event) {
    event.preventDefault(); //prevent the submit button from submitting form to server
    getStatus();

    const title = titleInput.value;
    const author = authorInput.value;
    const numPages = parseInt(numPagesInput.value); // Parse to integer
    const read = getStatus();

     // Check if any field is empty
     if (title === '' || author === '' || isNaN(numPages) || read === 'No selection') {
        alert('Please fill out all fields.');
        return; // Stop execution if any field is empty
    }

    // Push new book to library
    addBookToLibrary(title, author, numPages, read);
    console.log(myLibrary.map(book => ({
        title: book.title,
        author: book.author,
        pages: book.pages,
        read: book.read
    })));

    // Reset form inputs
    titleInput.value = '';
    authorInput.value = '';
    numPagesInput.value = '';
    hasReadCheckbox.checked = false;
    hasNotReadCheckbox.checked = false;

    //dialogElem.close();

    displayBooks();
});