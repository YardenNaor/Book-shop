'use strict'


function onInit() {
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    console.log('book to render:',books)

    const tableHeadStrHTML = `<tr><th>Title</th> <th>Price</th> <th colspan="4" >Actions</th></tr>`
    var strHtmls = books.map(book =>
        `<tr class="book-preview">
     <td>${book.name}</td>
     <td>${book.price}</td>
     <td><button onclick="onReadBook(${book.id})">Read</button></td>
     <td><button onclick="onUpdateBook(${book.id})">Update</button></td>
     <td><button onclick="onRemoveBook(${book.id})">Delete</button></td>
     <td class="rate-container">Rate<div class="buttons-container"><button class="rate-button" onclick="onUpdateRate(${book.id},'up')">+</button> <span class="rate">${book.rate}</span> 
     <button class="rate-button" onclick="onUpdateRate(${book.id},'down')">-</button></div></td>
    </tr>`
    )

    document.querySelector('.keys-container').innerHTML = tableHeadStrHTML
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
    renderPageIndex()
}

// Delete - when the button Delete is clicked call onRemoveBook
// that will use the service's function removeBook(bookId))

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Removed`)

}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}


// Support adding a new book:
// a. When clicked, call the function onAddBook() that will
// read (prompt) the details from the user: name and
// price, then will call a function addBook(name, price)
// that pushes a new book into the gBooks array.
// b. Call the renderBooks() to redraw the table


function onAddBook() {
    const name = prompt('Enter the name of the book ')
    const price = +prompt('Enter the price')
    if (name && price) {
        const book = addBook(name, price)
        renderBooks()
        flashMsg(`Bokk Added (id: ${book.id})`)
    }
}

// 7. Support updating a book:
// a. When clicked, call the function:
// onUpdateBook (bookId) that will prompt for the book
// new price and call the service's function
// updateBook(bookId, bookPrice).
// Then Call the renderBooks() to redraw the table

function onUpdateBook(bookId) {
    const price = +prompt('Enter the price')
    updateBook(bookId, price)
    renderBooks()
}

// 8. Use a modal to show all the details of a selected book
// a. When read is clicked, show the modal with details of the
// selected book.


function onReadBook(bookId) {
    var book = getBookById(bookId)
    console.log('book:', book)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price
    console.log('book.desc:', book.desc)
    elModal.querySelector('p').innerText = book.dsc
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

// c. In the Book-Details modal, allow the user to change the
// rate of the book by clicking the + / - buttons:

function onUpdateRate(bookId, value) {
    updateRate(bookId, value)
    renderBooks()

}

// Filtering
// 9. Support filtering the books by maxPrice, minRate and also by using a search box

function onSetFilterBy(filterBy) {
    // ev.preventDefault()
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?name=${filterBy.name}&maxprice=${filterBy.maxPrice}&minrate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function onSetFilterByName(ev) {
    // console.log('ev:',ev)
    ev.preventDefault()
    const elSearchBox = document.querySelector('input[name="search-box"]').value
    var filterBy ={name: elSearchBox}
    // console.log('hi:')
    // console.log('filter:', filterBy)
    // console.log('txt:', elSearchBox)
    filterBy = setBookFilter(filterBy)
    renderBooks()
}

function renderPageIndex(){
   const pageIndex= getPageIndex()
//    console.log('page:',pageIndex)
   const elCurrPage=document.querySelector('.current-page')
   console.log('page div:',elCurrPage)
   elCurrPage.innerText=pageIndex+1
}


function onSetPage(value){
setPage(value)
renderPageIndex()
renderBooks()
}