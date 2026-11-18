const productos = [
    { id: 1, nombre: "Teclado mecánico", precio: 180000, categoria: "Periféricos", stock: 5 },
    { id: 2, nombre: "Mouse inalámbrico", precio: 60000, categoria: "Periféricos", stock: 8 },
    { id: 3, nombre: "Pad mouse XL", precio: 35000, categoria: "Periféricos", stock: 3 },
    { id: 4, nombre: "Monitor 24 pulgadas", precio: 650000, categoria: "Monitores", stock: 4 },
    { id: 5, nombre: "Monitor 27 pulgadas", precio: 950000, categoria: "Monitores", stock: 2 },
    { id: 6, nombre: "Diadema gamer", precio: 150000, categoria: "Audio", stock: 6 },
    { id: 7, nombre: "Parlantes 2.1", precio: 220000, categoria: "Audio", stock: 3 },
    { id: 8, nombre: "Micrófono USB", precio: 190000, categoria: "Audio", stock: 1 },
];

let carrito = [];


let categoriaActual = "Todas";

const contenedorFiltros = document.getElementById("filtros");
const textoContador = document.getElementById("contador");
const contenedorProductos = document.getElementById("productos");

const mensajeCarritoVacio = document.getElementById("carrito-vacio");
const listaCarrito = document.getElementById("lista-carrito");

const textoArticulos = document.getElementById("articulos");
const textoSubtotal = document.getElementById("subtotal");
const textoDescuento = document.getElementById("descuento");
const textoTotal = document.getElementById("total");

const botonVaciar = document.getElementById("btn-vaciar");



const formatearPrecio = (valor) => "$ " + valor.toLocaleString("es-CO");

const buscarProducto = (id) => productos.find((producto) => producto.id === id);

const buscarEnCarrito = (id) => carrito.find((item) => item.id === id);

function obtenerDisponibles(id) {
    const producto = buscarProducto(id);
    const item = buscarEnCarrito(id);

    if (item) {
        return producto.stock - item.cantidad;
    }
    return producto.stock;
}

function obtenerCategorias() {
    const categorias = [];

    for (const producto of productos) {
        if (!categorias.includes(producto.categoria)) {
            categorias.push(producto.categoria);
        }
    }
    return categorias;
}


function crearBotonFiltro(categoria) {
    const boton = document.createElement("button");
    boton.textContent = categoria;
    boton.classList.add("btn-filtro");

    if (categoria === categoriaActual) {
        boton.classList.add("activo");
    }

    boton.addEventListener("click", () => {
        categoriaActual = categoria;
        mostrarFiltros();
        mostrarProductos();
    });

    contenedorFiltros.appendChild(boton);
}

function mostrarFiltros() {
    contenedorFiltros.innerHTML = "";

    crearBotonFiltro("Todas");

    const categorias = obtenerCategorias();
    for (const categoria of categorias) {
        crearBotonFiltro(categoria);
    }
}


function crearTarjeta(producto) {
    const disponibles = obtenerDisponibles(producto.id);

    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const categoria = document.createElement("p");
    categoria.classList.add("tarjeta-categoria");
    categoria.textContent = producto.categoria;

    const precio = document.createElement("p");
    precio.classList.add("tarjeta-precio");
    precio.textContent = formatearPrecio(producto.precio);

    const stock = document.createElement("p");
    stock.classList.add("tarjeta-stock");
    stock.textContent = `Disponibles: ${disponibles}`;

    const boton = document.createElement("button");
    boton.classList.add("btn-agregar");
    boton.textContent = "Agregar";

    boton.addEventListener("click", () => {
        agregarAlCarrito(producto.id);
    });

    tarjeta.appendChild(nombre);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(stock);


    if (disponibles === 0) {
        tarjeta.classList.add("agotado");
        boton.disabled = true;

        const etiqueta = document.createElement("span");
        etiqueta.classList.add("etiqueta-agotado");
        etiqueta.textContent = "Agotado";
        tarjeta.appendChild(etiqueta);
    }

    tarjeta.appendChild(boton);
    contenedorProductos.appendChild(tarjeta);
}

function mostrarProductos() {
    contenedorProductos.innerHTML = "";

    let productosFiltrados = productos;
    if (categoriaActual !== "Todas") {
        productosFiltrados = productos.filter((producto) => producto.categoria === categoriaActual);
    }

    for (const producto of productosFiltrados) {
        crearTarjeta(producto);
    }

    textoContador.textContent = `Mostrando ${productosFiltrados.length} productos`;
}


function agregarAlCarrito(id) {
    if (obtenerDisponibles(id) === 0) {
        return;
    }

    const item = buscarEnCarrito(id);

    if (item) {
        item.cantidad++;
    } else {
        const producto = buscarProducto(id);
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
        });
    }

    actualizarTienda();
}

function disminuirCantidad(id) {
    const item = buscarEnCarrito(id);
    item.cantidad--;

    if (item.cantidad === 0) {
        eliminarDelCarrito(id);
        return;
    }

    actualizarTienda();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id);
    actualizarTienda();
}

function vaciarCarrito() {
    carrito = [];
    actualizarTienda();
}


function crearItemCarrito(item) {
    const fila = document.createElement("li");
    fila.classList.add("item-carrito");

    const nombre = document.createElement("p");
    nombre.classList.add("item-nombre");
    nombre.textContent = item.nombre;

    const precio = document.createElement("p");
    precio.classList.add("item-precio");
    precio.textContent = formatearPrecio(item.precio);

    const controles = document.createElement("div");
    controles.classList.add("item-controles");

    const botonMenos = document.createElement("button");
    botonMenos.textContent = "−";
    botonMenos.addEventListener("click", () => {
        disminuirCantidad(item.id);
    });

    const cantidad = document.createElement("span");
    cantidad.textContent = item.cantidad;

    const botonMas = document.createElement("button");
    botonMas.textContent = "+";
    if (obtenerDisponibles(item.id) === 0) {
        botonMas.disabled = true;
    }
    botonMas.addEventListener("click", () => {
        agregarAlCarrito(item.id);
    });

    controles.appendChild(botonMenos);
    controles.appendChild(cantidad);
    controles.appendChild(botonMas);

    const subtotal = document.createElement("p");
    subtotal.classList.add("item-subtotal");
    subtotal.textContent = formatearPrecio(item.precio * item.cantidad);

    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("btn-eliminar");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
        eliminarDelCarrito(item.id);
    });

    fila.appendChild(nombre);
    fila.appendChild(precio);
    fila.appendChild(controles);
    fila.appendChild(subtotal);
    fila.appendChild(botonEliminar);

    listaCarrito.appendChild(fila);
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        mensajeCarritoVacio.style.display = "block";
        botonVaciar.disabled = true;
        return;
    }

    mensajeCarritoVacio.style.display = "none";
    botonVaciar.disabled = false;

    for (const item of carrito) {
        crearItemCarrito(item);
    }
}


function mostrarResumen() {
    const articulos = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);

    const subtotal = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);

    let descuento = 0;
    if (subtotal >= 300000) {
        descuento = subtotal * 0.1;
    }

    const total = subtotal - descuento;

    textoArticulos.textContent = articulos;
    textoSubtotal.textContent = formatearPrecio(subtotal);
    textoDescuento.textContent = "-" + formatearPrecio(descuento);
    textoTotal.textContent = formatearPrecio(total);
}


function actualizarTienda() {
    mostrarProductos();
    mostrarCarrito();
    mostrarResumen();
}

botonVaciar.addEventListener("click", vaciarCarrito);

mostrarFiltros();
actualizarTienda();
