//fetch lee archivo json
//crea objetos con constructor Book
//agrega cada libro al html con createGallery
//ready crea eventos para los botones
fetch("./recommendations.json")
    .then(
        results => results.json()
    )
    .then(
        data => {
            data.toRead.forEach(dbbook => {
                createGallery(dbbook)
            })
            if ('recomm' in sessionStorage) {
                let cart_items_list = document.querySelector('.cart-items');

                while (cart_items_list.hasChildNodes()) {
                    cart_items_list.removeChild(cart_items_list.firstChild)
                }
                JSON.parse(sessionStorage.getItem('recomm')).forEach(row => {
                    createNewRowCart(row.cover, row.title, row.autor, row.price)
                })
            }
            events()
        })
class Book {
    constructor(title, autor, cover, year, summary, price) {
        this.title = title;
        this.autor = autor;
        this.cover = cover;
        this.year = year;
        this.summary = summary;
        this.price = price;
    }
}

function createGallery({ title, autor, cover, year, summary, price }) {

    let shop_items = document.querySelector('.container');
    let book_item = document.createElement('div');
    book_item.className = 'row-container';

    let shop_item_row = `<div class='shop-item-image'>
                            <img class="item-image" src=${cover}>
                        </div>

                        <div class="shop-item-details">

                                <h1 class="shop-item-title">
                                    <span class="item-title">${title}</span>
                                    <span class="item-sep">-</span>
                                    <span class="item-autor">${autor}</span>
                                    <span class="item-year">(${year})</span>
                                </h1>
                            
                                <span class="shop-item-summary">${summary}</span>

                                <span class="shop-item-price">
                                    <span class="item-price">
                                        $${price}
                                    </span>
                                    <button class="btn btn-primary shop-item-button" type="button">Agregar al carrito</button>
                                </span> 
                        </div>`

    book_item.innerHTML = shop_item_row
    shop_items.append(book_item)
}

//eventos
function events() {
    //boton Agregar al Carrito
    let add_cart_botton = document.querySelectorAll('.shop-item-button');
    add_cart_botton.forEach(button => {
        button.addEventListener('click', addCartClick);
    })

    //boton Comprar
    let purschase_button = document.querySelector('.btn-purchase');
    purschase_button.addEventListener('click', purchaseCartItems)
}

//con click Agregar al Carrito recupera info del elemento
function addCartClick(e) {
    let add_click = e.target;
    let book_purchase = add_click.parentElement.parentElement.parentElement;

    let cover = book_purchase.querySelector('.item-image').src;
    let title = book_purchase.querySelector('.item-title').innerHTML;
    let autor = book_purchase.querySelector('.item-autor').innerHTML;
    let year = book_purchase.querySelector('.item-year').innerHTML;
    let price = book_purchase.querySelector('.item-price').innerHTML;

    let cart_book = new Book(title, autor, cover, year, '', price);
    let recomm_list = []

    if ('recomm' in sessionStorage) {
        if (JSON.parse(sessionStorage.getItem('recomm')).some((row) => row.title == cart_book.title)) {
            swal('Este libro ya se encuentra en tu carrito')
        } else {
            let cart_items_list = document.querySelector('.cart-items');

            while (cart_items_list.hasChildNodes()) {
                cart_items_list.removeChild(cart_items_list.firstChild)
            }
            JSON.parse(sessionStorage.getItem('recomm')).forEach(row => {
                recomm_list.push(row)
            })
            recomm_list.push(cart_book)
            sessionStorage.setItem('recomm', JSON.stringify(recomm_list))
            console.log(recomm_list)
            JSON.parse(sessionStorage.getItem('recomm')).forEach(row => {
                createNewRowCart(row.cover, row.title, row.autor, row.price)
            })
        }
    } else {
        let recomm_list = []
        recomm_list.push(cart_book)
        sessionStorage.setItem('recomm', JSON.stringify(recomm_list))
        console.log('first book', JSON.parse(sessionStorage.getItem('recomm')))
        JSON.parse(sessionStorage.getItem('recomm')).forEach(row => {
            createNewRowCart(row.cover, row.title, row.autor, row.price)
        })
    }
    recomm_list = []

}

function createNewRowCart(cover, title, autor, price) {
    let new_cart_row = document.createElement('div');
    new_cart_row.className = 'cart-row-item';
    new_cart_row.innerHTML = `<div class="cart-item cart-column">
                                <img class="cart-item-image" src="${cover}" width="150" height="auto">
                                <span class="cart-item-title">${title} - ${autor}</span>
                            </div>
                            <span class="cart-price cart-column">${price}</span>
                            <div class="cart-quantity cart-column">
                                <input class="cart-quantity-input" type="number" value="1">
                                <button class="btn btn-danger" type="button">Quitar del carrito</button>
                            </div>`

    let cart_items_list = document.querySelector('.cart-items');

    cart_items_list.append(new_cart_row);

    //por cada boton en el carrito
    //remove button event
    let remove_buttons = cart_items_list.querySelectorAll(
        '.btn-danger')
    remove_buttons.forEach(row => row.addEventListener('click', removeCartClick));

    //qunatity input event
    let quantity_input = cart_items_list.querySelectorAll(
        '.cart-quantity-input')
    quantity_input.forEach(row => row.addEventListener('change', quantityChange));

    updateCartTotal();
}

function removeCartClick(e) {
    let row_cart_remove = e.target
    row_cart_remove.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChange(e) {
    quantity_input = e.target
    if (isNaN(quantity_input.value) || quantity_input.value <= 0) {
        quantity_input.value = 1
    }
    updateCartTotal()
}
//hace cuenta del precio
//reduce a 2 decimales
function updateCartTotal() {
    let total = 0
    let cart_row = document.querySelectorAll('.cart-row-item')
    cart_row.forEach(row => {
        let item_price = row.querySelector('.cart-price').innerHTML.replace('$', '')
        let item_quantity = row.querySelector('.cart-quantity-input').value
        total += (item_price * item_quantity)
    })
    total = Math.round(total * 100) / 100

    let cartTotal = document.querySelector('.cart-total-price')
    cartTotal.innerHTML = `$ ${total}`
}

//evento click en Comprar elimina todos los elementos del carrito
function purchaseCartItems(e) {
    let button = e.target
    let items = button.parentElement.querySelector('.cart-items')

    while (items.hasChildNodes()) {
        items.removeChild(items.firstChild)
    }
    sessionStorage.removeItem('recomm')
    swal('Su compra esta en camino!')
    updateCartTotal()
}