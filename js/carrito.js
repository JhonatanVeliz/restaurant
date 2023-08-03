import { $ } from "./modules/selector.js";

const btnCarrito = $('#btnCarrito');
const carrito = $('#carrito');

function abrirCarrito() {
    carrito.classList.toggle('abrir-carrito');
}

btnCarrito.addEventListener('click', abrirCarrito);