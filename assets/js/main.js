//* URL base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//* Dibujar productos en la web
const productsList = document.querySelector("#products-container");
//* Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
//* Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//* Vaciar carrito
const emptyCarButton = document.querySelector("#empty-car");
//* Car counter
const carCounter = document.querySelector("#car-counter");
//* Array Carrito
//? Necesitamos tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];
//* Ventana Modal
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal-element");
let modalDetails = [];

navToggle.addEventListener("click", () => {
    navCar.classList.toggle("nav__car--visible")
})

eventListenersLoader()

function eventListenersLoader() {
    //* Cuando se presione el botón "Add to car"
    productsList.addEventListener("click", addProduct);
    //* Cuando se presione el botón "Delete"
    car.addEventListener("click", deleteProduct);
    //* Cuando se de click al botón Empty Car
    emptyCarButton.addEventListener("click", emptyCar)

    //* Listeners Modal.
    //* Cuando se de click al botón de ver detalles
    productsList.addEventListener("click", modalProduct)
    //* Cuando se de click al botón de cerrar modal.
    modalContainer.addEventListener("click", closeModal)

    //* Se ejecuta cuando carga la pagina
    document.addEventListener("DOMContentLoaded", () => {
        //* Si el localStorage tiene info, entonces, igualamos 
        //*  carProducts con la info del LocalStorage, pero, si el LocalStorage esta
        //* vacio es igual a un array vacio

        carProducts = JSON.parse(localStorage.getItem("car")) || [],
        carElementsHTML()

    })
}

//* Hacer petición a la API de productos
//* 1. Crear una función con la petición:

function getProducts() {
    axios.get(baseUrl)
        .then((response) => {
            const products = response.data
            printProducts(products)
        })
        .catch((error) => {
            console.log(error)
        })
}
getProducts()

//* 2. Renderizar los productos capturados de la API en mi HTML.

function printProducts(products) {
    let html = '';
    for(let product of products) {
        html += `
            <div class="products__element">
                <img src="${product.image}" alt="product_img" class="products__img">
                <p class="products__name">${product.name}</p>
                <div class="products__div">
                    <p class="products__usd">USD: </p>
                    <p class="products__price">${product.price.toFixed(2)}</p>
                </div>
                <div class="products__div products__div--flex">
                    <button data-id="${product.id}" class="products__button add_car">
                        <ion-icon name="add-outline" class="add_car"></ion-icon>
                    </button>
                    <button data-id="${product.id}" data-description="${product.description}" class="products__button products__button--search products__details">
                        <ion-icon name="search-outline"></ion-icon>
                    </button>
                </div>    
            </div>
        `
    }
    productsList.innerHTML = html
}

//* Agregar los productos al carrito
//* 1. Capturar la información del producto al que se dé click.
function addProduct(event){
    //* Método contains => valída si existe un elemento dentro de la clase.
    if(event.target.classList.contains("add_car")){
        const product = event.target.parentElement.parentElement
        //* parentElement => nos ayuda a acceder al padre inmediatamente superior del elemento.
        carProductsElements(product)
    }
}

//* 2. Debemos transformar la información HTML a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). Si existe, le debo sumar una unidad para que no se repita.
function carProductsElements(product){

    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        quantity: 1
        // textContent nos permite pedir el texto que contiene un elemento.
    }
    
    //* Agregar el objeto de infoProduct al array de carProducts, pero hay que validar si el elemento existe o no.
    //? El primer if valída si por lo menos un elemento que se encuentre en carProducts es igual al que quiero enviarle en infoProduct.
    if( carProducts.some( product => product.id === infoProduct.id ) ){ //True or False
   
        const productIncrement = carProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++
                return product
            } else {
                return product
            }
        })
        carProducts = [ ...productIncrement ]
    } else {
        carProducts = [ ...carProducts, infoProduct ]
    }
    
    carElementsHTML();
}

function carElementsHTML() {

    let carHTML = '';
    for (let product of carProducts){
        carHTML += `
        <div class="car__product">
            <div class="car__product__image">
              <img src="${product.image}">
            </div>
            <div class="car__product__description">
              <p>${product.name}</p>
              <p>Precio: ${product.price}</p>
              <p>Cantidad: ${product.quantity}</p>
            </div>
            <div class="car__product__button">
                <button class="delete__product" data-id="${product.id}">
                    Delete
                </button>
            </div>
        </div>
        <hr>
        `
    }
    carList.innerHTML = carHTML;

    let value = carProducts.length
    carCounter.innerHTML = `<p>${value}</p>`

    productsStorage()
}   

//*LocalStorage
function productsStorage(){
        localStorage.setItem("car", JSON.stringify(carProducts))
}

//* Eliminar productos del carrito
function deleteProduct(event) {
    if( event.target.classList.contains('delete__product') ){
        const productId = event.target.getAttribute('data-id')
        carProducts = carProducts.filter(product => product.id != productId)
        carElementsHTML()
    }
}

//* Vaciar el carrito
function emptyCar() {
    carProducts = [];
    carElementsHTML();
}

//* Ventana Modal
//* 1. Crear función que escuche el botón del producto.
function modalProduct(event) {
    if(event.target.classList.contains("products__details")){
        modalContainer.classList.add("show__modal")
        const product = event.target.parentElement.parentElement
        modalDetailsElement(product)
    }
}

//* 2. Crear función que escuche el botón de cierre.
function closeModal(event) {
    if(event.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("show__modal")
    }
}

//* 3. Crear función que convierta la info HTML en objeto.
function modalDetailsElement(product) {

    const infoDatails = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        description: product.querySelector('.products__details').getAttribute('data-description')
    }
    modalDetails = [ ...modalDetails, infoDatails ]
    modalHTML()
}

//* 4. Dibujar producto dentro del modal.
function modalHTML() {

    let detailsHTML = ""
    for( let element of modalDetails ) {
        detailsHTML = `
            <h2>${element.description}</h2>
            <img src="${element.image}">
        `
    }
    modalElement.innerHTML = detailsHTML
}

//* Local Storage
//* Es una base de datos del navegador que nos permite almacenar
//* informacion para hacerla recurrente dentro de nuestra pagina.

//? Guardando un valor en el local Storage => setItem("Key", "Value")
//localStorage.setItem("name", "Alejandro")

//? Obtener info desde LocalStorage => getItem
//localStorage.getItem("name")
//console.log(localStorage.getItem("mame")) 

//const user = {name: "Alejandro", lastName: "Betancur"}

//? convertir el objeto user en un JSON.
//localStorage.setItem("user", JSON.stringify(user))

//? Obtener la info y convertilo de JSON a JavaScript
//const userLocal = localStorage.getItem("user")
//JSON.parse(userLocal)
//console.log(JSON.parse(userLocal))

