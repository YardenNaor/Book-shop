'use strict'

const BOOKS_STORAGE_KEY = 'booksDB'
const NEXT_ID_STORAGE_KEY = 'nxtId'
const PAGE_SIZE = 2

var gBooks = []
var gFilterBy = { maxPrice: 100, minRate: 0, name: '' }
var gPageIdx = 0

_createBooks()

function getBooks() {
    console.log('filter at getbooks:', gFilterBy)
    const books = gBooks.filter(book =>
        book.name.includes(gFilterBy.name) &&
        book.price <= gFilterBy.maxPrice 
        && book.rate >= gFilterBy.minRate
    )
    console.log('books at filter:', books)
    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)

}

function _createBooks() {
    var books = loadFromStorage(BOOKS_STORAGE_KEY)

    // console.log('from storage:',books.length,books)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        _createBook('Racing the Light', 13)
        _createBook('The Maze', 25)
        _createBook('A World of Curiosities', 33)
        _saveBooksToStorage()
    } else {
        gBooks = books
    }
}


function _saveBooksToStorage() {
    saveToStorage(BOOKS_STORAGE_KEY, gBooks)
}


function setBookFilter(filterBy = {}) {
    gPageIdx = 0
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    console.log('gfilter:', gFilterBy)
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    return gFilterBy
}



function _createBook(name, price) {
    var nxtId = loadFromStorage(NEXT_ID_STORAGE_KEY)
    if (!nxtId) nxtId = 1
    const book = {
        id: nxtId++,
        name,
        price,
        rate: 0,
        dsc: makeLorem()
    }
    // console.log('dsc:',book.dsc)
    gBooks.unshift(book)
    _saveNxtIdToStorage(nxtId)
    // console.log('book:',book)
}

function _saveNxtIdToStorage(nxtId) {
    saveToStorage(NEXT_ID_STORAGE_KEY, nxtId)
}

console.log('gbooks:', gBooks)

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name, price) {
    const book = _createBook(name, price)
    // gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function updateBook(bookId, bookPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = bookPrice
    _saveBooksToStorage()
    return book
}

function updateRate(bookId, value) {
    const book = getBookById(bookId)
    if (value === 'up' && book.rate < 10) book.rate++
    else if (value === 'down' && book.rate) book.rate--
    _saveBooksToStorage()
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function getPageIndex() {
    return gPageIdx
}

function setPage(value) {
    if (value === 'backward' && gPageIdx) gPageIdx--
    else if (value === 'forward' && gPageIdx < (gBooks.length / PAGE_SIZE)-1) gPageIdx++

}