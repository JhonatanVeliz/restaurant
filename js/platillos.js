import { $ } from "./modules/selector.js";

const btnMasPlatillos = $('.btn-mas-comidas', true);
const contenido = $('.contenido', true);
const nuevoContenido = $('#nuevo-contenido');
const btnComprarYRedirec = $('.btn-comprar');

function removerAddContenido(contenido, nuevoContenido) {
    contenido.forEach( page => {
        page.classList.toggle('delete-content');
    });
    nuevoContenido.classList.toggle('add-content');  
}

function redirijirPagina(href) {
    window.location.href = href;
}

btnMasPlatillos.forEach(( btn )=>{
    btn.addEventListener('click', ()=>{
        removerAddContenido(contenido, nuevoContenido)
    });
})

btnComprarYRedirec.addEventListener('click', ()=>{
    removerAddContenido(contenido, nuevoContenido);
    setTimeout(()=>redirijirPagina('./index.html#pedido'), 100)
});
