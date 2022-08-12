//fetch lee archivo json
//crea objectos con constructor Book y lo pushea a lista book_list
//ejecuta funcion ready donde estan definidos sort el orden de los libros y
//se agregan elementos dinamicos (libros) al html
fetch("./bookLib.json")
    .then(results => results.json())
    .then(data => {

        data.booklib.forEach(dbbook => {
            json_list.push(dbbook)
        })
        ready(2)
    }
    )
    .catch(_ready => {
        swal('No hay libros en tu biblioteca!')
        ready(2)
    })

let json_list = [];

function ready(value_sort) {

    //si ya existen libros en el session Storage concate esa lista al json
    if ('bookLib' in sessionStorage) {

        let session_list = JSON.parse(sessionStorage.getItem('bookLib'));
        let total_list = json_list.concat(session_list);

        //sort array por autor (1) o por titulo (2)
        if (value_sort == 1) {
            total_list.sort((a, b) => a.autor.localeCompare(b.autor));
        } else if (value_sort == 2) {
            total_list.sort((a, b) => a.title.localeCompare(b.title));
        }

        //borra html para cargar con nuevo orden
        let row = document.querySelector('.row');
        row.innerHTML = '';
        total_list.forEach(row => {
            addBookToGallery(row.title, row.autor, row.cover)
        })

        //si session Storage esta vacio solo usa el json para cargar la galeria 
    } else {
        //sort array por autor (1) o por titulo (2)
        if (value_sort == 1) {
            json_list.sort((a, b) => a.autor.localeCompare(b.autor));
        } else if (value_sort == 2) {
            json_list.sort((a, b) => a.title.localeCompare(b.title));
        }

        //borra html para cargar con nuevo orden
        let row = document.querySelector('.row');
        row.innerHTML = '';
        json_list.forEach(row => {
            addBookToGallery(row.title, row.autor, row.cover)
        })
    }
}
ready(2)


function addBookToGallery(dbtitle, dbautor, dbcover) {
    let row = document.querySelector('.row');
    let add_book_div = document.createElement('div');
    //se crea la vista para una de las columnas de la galeria
    add_book_div.className = ('col-sm-3');

    add_book_div.innerHTML = `<a href="./libro.html?id=${dbtitle}" class="book-div">
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

    let new_title = (document.getElementById('new_title').value).trim();
    let new_autor = (document.getElementById('new_autor').value).trim();
    let new_cover = './img/mock.jpg';
    let new_year = (document.getElementById('new_year').value).trim();
    let new_summary = (document.getElementById('new_summary').value).trim();

    let new_book = new Book(new_title, new_autor, new_cover, new_year, new_summary);

    //agrega titulo+autor de los libros del json a lista check_duplicate
    let check_duplicate = []
    json_list.forEach(row => {
        check_duplicate.push(`${row.title}-${row.autor}`)
    })
    console.log('dupl', check_duplicate)

    //si hay libros en session Storage los agrega a la lista check_duplicate
    if ('bookLib' in sessionStorage) {
        let new_session_list = JSON.parse(sessionStorage.getItem('bookLib'))

        new_session_list.forEach(row => {
            check_duplicate.push(`${row.title}-${row.autor}`)
        })

        //si el titulo+autor del nuevo libro agregagado ya existe en check_duplicate crea alert y no lo agrega
        if (check_duplicate.some((row) => row == `${new_book.title}-${new_book.autor}`)) {
            swal('Este libro ya existe en tu biblioteca')
            //si es nuevo lo agrega a new_session_list y sobreescribe esta lista en 'bookLib' sessionStorage    
        } else {
            new_session_list.push(new_book)
            sessionStorage.setItem('bookLib', JSON.stringify(new_session_list))
            //con esta nueva session Storage vuelve a correr ready() y forma la galeria con el nuevo libro
            ready(2)
        }
    //si no hay session Storage solo chequea contra el json
    } else {
        console.log(`${new_book.title}-${new_book.autor}`)
        if (check_duplicate.some((row) => row == `${new_book.title}-${new_book.autor}`)) {
            swal('Este libro ya existe en tu biblioteca')
            //si el libro no existe lo carga a session Storage
        } else {
            let new_list = []
            new_list.push(new_book)

            sessionStorage.setItem('bookLib', JSON.stringify(new_list));
            ready(2)
        }
    }
}

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

    //sort by event
    let sort_by = document.querySelector('.sort_by');
    sort_by.addEventListener('change', sortBy)

    function sortBy() {
        if (this.value == 1) {
            ready(1);
        } else if (this.value == 2) {
            ready(2);
        }
    }