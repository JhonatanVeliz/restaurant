const $ = (nodo, isAll, documento = document.body) => isAll ? documento.querySelectorAll(nodo) : documento.querySelector(nodo);

// LOGÍCA RELACIONADA A LOS ESTILOS Y LA CARGA DE LOS MISMOS
const btnCerrarMasPlatillos = $('#regresar');
const contenido = $('.contenido');
const nuevoContenido = $('#nuevo-contenido');
const btnComprarYRedirec = $('.btn-comprar');

const redirigirPagina = href => window.location.href = href;

const removerAddContenido = (contenido, nuevoContenido, abrirCerrar) => {
    if(abrirCerrar){return contenido.classList.add('delete-content'), nuevoContenido.classList.add('add-content')};

    contenido.classList.remove('delete-content'), nuevoContenido.classList.remove('add-content');
}

btnCerrarMasPlatillos.addEventListener('click', ()=> removerAddContenido(contenido, nuevoContenido, false));

btnComprarYRedirec.addEventListener('click', () => {
    removerAddContenido(contenido, nuevoContenido, false);
    setTimeout( () => redirigirPagina('./index.html#pedido'), 100)
});

// ------------------------   LOGICA RELACIONADA A LOS PLATILLOS   -------------------------------
const platillosRenderContenedor = $('#platillos-render');
const btnAbrirMasPlatillos = $('#abrirMasComidas');

// SIMULACIÓN DE API ( PROVEEDOR DE LA INFORMACIÓN, IMG Y NOMBRE DE LAS COMIDAS )
const API_URL = 'https://jhonatanveliz.github.io/restaurant/';

const llamadaAPI = async (url, directorio) => {
    const resp = await fetch(`${url}${directorio}`);
    const json = await resp.json();

    if (resp.status !== 200) {throw Error('Problemas Con la carga de los Platillos por favor recargue la página...')};

    recibeJSON(json);
}

// FUNCIÓN QUE CREARÁ LOS PLATILLOS SEGÚN LA RESPUESTA DE LA API
const recibeJSON = (json) => {
    const { platillos, bebidas } = json;

    recorrerProductos(platillos)
    recorrerProductos(bebidas)
}

const recorrerProductos = arrayProductos => arrayProductos.forEach( producto => infoProducto(producto, platillosRenderContenedor));

const infoProducto = (producto, lugarDeRender) => {

    const {name, src, price} = producto;

    const objetoProducto = new Producto();

    objetoProducto.setNombre = name;
    objetoProducto.setPrecio = price;
    objetoProducto.setImg = src;
    objetoProducto.setId = Producto.creartId();
    objetoProducto.setCantidad = 0;
    objetoProducto.setDescuento = false;

    objetoProducto.crearHtmlProducto(lugarDeRender);
}

class Producto {
    static contador = 0;

    constructor( nombre,  precio, img, id, descuento){
        this._nombre = nombre;
        this._precio = precio;
        this._img = img;
        this._id = id;
        this._descuento = descuento;
    }

    set setNombre (nombre){this._nombre = nombre};
    get getNombre (){return this._nombre};

    set setPrecio (precio){this._precio = precio};
    get getPrecio (){return this._precio};

    set setImg (imgSrc){this._img = imgSrc};
    get getImg (){return this._img};

    set setId (id){this._id = id};
    get getId (){return this._id};

    set setDescuento (descuento){this._descuento = descuento};
    get getDescuento (){return this._descuento};

    crearHtmlProducto (lugarDeRender){
        const renderHtml = `
        <div class="card" data-id="${this.getId}" data-aos="fade-right">
            <img class="card__img" src="${this.getImg}" alt="comida" loading="lazy">
            <p class="card__info"><span class="card__cantidad" data-cantidad-producto="${this.getId}">${Producto.contador}</span> <span class="card__title">${this.getNombre}</span> <span class="card__precio">$${this.getPrecio}.00</span></p>
            <button class="btn card__btn hvr-bounce-to-right" onclick="Producto.agregarUnoMas(${this.getId})">Agregar</button>
        </div>
        `;
        lugarDeRender.insertAdjacentHTML('afterbegin', renderHtml);
    }

    static agregarUnoMas(id){

        const producto = document.querySelector(`[data-id="${id}"]`);
        const nombre = producto.querySelector('.card__title').innerText;
        const img = producto.querySelector('.card__img').src;
        const precio = producto.querySelector('.card__precio').innerText;
        const cantidad = producto.querySelector('.card__cantidad');
        const nuevaCantidad = Number(cantidad.innerText) + 1;
        cantidad.innerText = nuevaCantidad;

        const carritoItem = new CarritoItem();
        carritoItem._id = id;
        carritoItem._nombre = nombre;
        carritoItem._img = img;
        carritoItem._precio = precio;
        carritoItem._cantidad = nuevaCantidad;
        carritoItem.crearItemCarritos();
    }

    static quitarUnoMas(id, precio){
        // -1-1-1212-12-12-121-212-12-1-21-21-21-21-21-21-21-2-12-12-12-12-12
        const cardProductoCantidad = document.querySelector(`[data-cantidad-producto="${id}"]`);
        cardProductoCantidad.innerText = Number(cardProductoCantidad.innerText) - 1;
        const productoItems = document.querySelectorAll(`[data-item="${id}"]`);
        productoItems.forEach( productoItem =>{
            const producto = productoItem;
            const productoCantidad = producto.querySelector(`[data-cantidad="${id}"]`);

            if(productoCantidad.innerText <= 1){return producto.remove()};
            productoCantidad.innerText = Number(productoCantidad.innerText) - 1;
        })

        sumaTotal.forEach( total =>{
            total.innerText = `$ ${Number(total.innerText.slice(1)) - Number(precio)}`;
        })
        CarritoItem.aumentarRestarNumeroDeProductosIcono();
    }

    static creartId(){return `${new Date().getTime() + Math.random()}`};
}

class CarritoItem {

    constructor(id, nombre, img, precio, cantidad){
        this._id = id;
        this._nombre = nombre;
        this._img = img;
        this._precio = precio;
        this._cantidad = cantidad;
    }

    set setId (id){this._id = id};
    get getId (){return this._id};

    set setNombre (nombre){this._nombre = nombre};
    get getNombre (){return this._nombre};

    set setImg (img){this._img = img};
    get getImg (){return this._img};

    set setPrecio (precio){this._precio = precio};
    get getPrecio (){return this._precio};

    set setCantidad (cantidad){this._cantidad = cantidad};
    get getCantidad (){return this._cantidad};

    crearItemCarritos () {
    
        const precio = this.getPrecio.slice(1);
        sumaTotal.forEach( total => total.innerText = `$ ${Number(total.innerText.slice(1)) + Number(precio)}`);
    
        const itemCard = document.querySelector(`[data-item="${this.getId}"]`);
    
        if(itemCard){
            const itemsCardCantidad = document.querySelectorAll(`[data-cantidad="${this.getId}"]`);
            return itemsCardCantidad.forEach( itemCantidad => itemCantidad.innerText = this.getCantidad);
        }

        const item = `
            <li class="compra" data-item="${this.getId}">
            
                <img class="compra__img" src="${this.getImg}" alt="comida">
        
                <div class="compra__info">
        
                    <div class="compra__info__texts">
                        <span class="compra__info__texts__name">${this.getNombre}</span>
                        <span class="compra__info__texts__cantidad" data-cantidad="${this.getId}">${this.getCantidad}</span>
                    </div>
        
                    <div class="compra__info__botones">
                        <button
                            class="btn compra__info__botones__boton compra__info__botones__boton--mas" onclick="Producto.agregarUnoMas(${this.getId})">+1</button>
                        <button
                            class="btn compra__info__botones__boton compra__info__botones__boton--menos" onclick="Producto.quitarUnoMas(${this.getId}, ${precio})">-1</button>
                        <button
                            class="btn compra__info__botones__boton compra__info__botones__boton--eliminar" onclick="CarritoItem.eliminarTodoElProducto(${this.getId}, ${precio})">Eliminar</button>
                    </div>
        
                </div>
        
            </li>
            `
        contenedoresCompras.forEach( contenedor =>  contenedor.insertAdjacentHTML('afterbegin', item));
    
        CarritoItem.aumentarRestarNumeroDeProductosIcono();
    }

    static eliminarTodoElProducto (id, precio){
        const productosMismoItem = document.querySelectorAll(`[data-item="${id}"]`);
        const cantidadDeProducto = document.querySelector(`[data-cantidad="${id}"]`);
        const cantidadARestarTotal = Number(cantidadDeProducto.innerText) * precio;

        productosMismoItem.forEach( producto => producto.remove());
        sumaTotal.forEach( itemSuma => {
            itemSuma.innerText =  `$ ${Number(itemSuma.innerText.slice(1)) - cantidadARestarTotal}`;
        });

        const productoCard = document.querySelector(`[data-cantidad-producto="${id}"]`);
        productoCard.innerText = '0';

        CarritoItem.aumentarRestarNumeroDeProductosIcono();
    }

    static aumentarRestarNumeroDeProductosIcono(){
        const carrito = $('#carrito');
        const cantidadDeProcdutos = carrito.querySelectorAll('.compra');

        numeroDeProductosIconoCart.innerText = cantidadDeProcdutos.length;
        return (numeroDeProductosIconoCart.innerText != '0') 
        ? numeroDeProductosIconoCart.classList.add('platillos__carrito__boton__cantidad--active')
        : numeroDeProductosIconoCart.classList.remove('platillos__carrito__boton__cantidad--active');
    }
}

// DOM ELEMENTS
let sumaTotal = $('.total-precio', true);
const contenedoresCompras = $('.contenedor-compras', true);

const numeroDeProductosIconoCart = $('#numero-de-productos');

let cantidadLlamadaApi = 0;

btnAbrirMasPlatillos.addEventListener('click', ()=> {
    if(cantidadLlamadaApi <= 0){llamadaAPI(API_URL, 'productos.json'), cantidadLlamadaApi++};
    removerAddContenido(contenido, nuevoContenido, true);
})

// Platillos precargados de muestra 
const gridPlatillosPrecargados = $('#platillos-precargados');

// Crear 4 platillos de muestra
( () => {
    const arrayDeNombreDePlatillos = ['Smashed Avo', 'Huevos Ranchero', 'Sumo de Frutas', 'Breakkie Roll'];
    const arrayDePrecioDePlatillos = ['25', '25', '10', '25'];
    const arrayDeImgDePlatillos = ['./assets/platillo-1.png', './assets/platillo-7.png', './assets/bebida-2.jpg', './assets/platillo-4.png'];
   
    for (let numeroPlatillo = 0; numeroPlatillo < 4; numeroPlatillo++) {
        
        const platillo = {
            name : `${arrayDeNombreDePlatillos[numeroPlatillo]}`,
            src  : `${arrayDeImgDePlatillos[numeroPlatillo]}`,
            price  : `${arrayDePrecioDePlatillos[numeroPlatillo]}`
        }

        infoProducto(platillo, gridPlatillosPrecargados);
    }
})();