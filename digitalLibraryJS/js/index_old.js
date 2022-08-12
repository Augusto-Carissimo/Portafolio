//fetch lee archivo json
//crea objectos con constructor Book y lo pushea a lista book_list
//ejecuta funcion ready donde estan definidos sort el orden de los libros y
//se agregan elementos dinamicos (libros) al html

fetch("./bookLib.json")
    .then(results => results.json())
    .then(data => data.booklib.forEach(dbbook => {
        json_book_list.push(dbbook)
    }))
    .then(sStorage => {
        sessionStorage.setItem('bookLib', JSON.stringify(json_book_list))})
    .then(_book_list => {ready(2)})

let json_book_list = [];

//constructor Book
class Book {
    constructor(title, autor, cover, year, summary) {
        this.title = title;
        this.autor = autor;
        this.cover = cover;
        this.year = year;
        this.summary = summary
    }
}

function ready(value_sort){
    //transform string json back to object
    let session_book_list = JSON.parse(sessionStorage.getItem('bookLib'));

    //sort array por autor (1) o por titulo (2)
    if (value_sort == 1) {
        session_book_list.sort((a,b) => a.autor.localeCompare(b.autor));
    } else if (value_sort == 2){
        session_book_list.sort((a,b) => a.title.localeCompare(b.title));
    }
    //borra html para cargar con nuevo orden
    let row = document.querySelector('.row');
    row.innerHTML = '';
    //cada array del lista/sessionStorage se agrega al html
    session_book_list.forEach(book => {
        addBookToGallery(book.title, book.autor, book.cover);
    })
}

function addBookToGallery(dbtitle, dbautor, dbcover) {
    let row = document.querySelector('.row');
    let add_book_div = document.createElement('div');
    //se crea la vista para una de las columnas de la galeria
    add_book_div.className = ('col-sm-3');

    add_book_div.innerHTML =`<a href="./perfil.html?id=${dbtitle}" class="book-div">
                            <img class ="cover_book" src=${dbcover}><br>
                            <span class ="title_book">${dbtitle}</span><br>
                            <span class = "autor_book">${dbautor}</span>
                        </a>`
    row.appendChild(add_book_div);
}

//Events
//form event
let form = document.querySelector('#form')
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewBook();
})

function addNewBook() {

    let new_title = document.getElementById('new_title').value;
    let new_autor = document.getElementById('new_autor').value;
    let new_cover = './img/mock.jpg';
    let new_year = document.getElementById('new_year').value;
    let new_summary = document.getElementById('new_summary').value;

    let new_book = new Book(new_title, new_autor, new_cover, new_year, new_summary);
    let new_list = JSON.parse(sessionStorage.getItem('bookLib'));
    let check_duplicate = []
    new_list.forEach(row => {
        check_duplicate.push(`${row.title}-${row.autor}`)
    })
    if (check_duplicate.some((row) => row == `${new_book.title}-${new_book.autor}`)) {
        swal('Este libro ya existe en tu libreria')
    }else {
        new_list.push(new_book)
        sessionStorage.setItem('bookLib', JSON.stringify(new_list))
    }
    //AGREGAR new_book A JSON/DB
    ready(2);
}

//sort by event
let sort_by = document.querySelector('.sort_by');
sort_by.addEventListener('change', sortBy)

function sortBy() {
    if (this.value == 1) {
        ready(1);
    }else if (this.value == 2){
        ready(2);
      }
}

