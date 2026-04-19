document.addEventListener('DOMContentLoaded', function() { // Cambio aquí
    const formulario = document.getElementById('formProduct');
    const contenedor = document.getElementById('containerProducts');
    const botonEnviar = document.getElementById('sendButton');
    const mensajefront = document.getElementById('messageForm');

    let productos = [];
    let edicionProducto = null;

    function verMensaje(texto, tipo = 'success') {
        if(!mensajefront) return;
        mensajefront.textContent = texto;
        mensajefront.className = `message ${tipo}`;
        setTimeout(() => {
            mensajefront.textContent = '';
            mensajefront.className = 'message';
        }, 3000);
    }

    // Cambié el nombre para que coincida con lo que usas abajo
    function calcularPrecio(valor, cupon) {
        if (cupon === 'OFF50%') { // Quitamos el (
            return valor * 0.5;
        }
        return valor;
    }

    function limpiezaForm() {
        formulario.reset();
        edicionProducto = null;
    }

    function verProductos() {
        contenedor.innerHTML = '';

        productos.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'card';

            const valorFinal = calcularPrecio(producto.valor, producto.cupon);

            tarjeta.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}" style="width:100px;">
                <h3>${producto.titulo}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">Precio: $${valorFinal.toFixed(2)}</p>
                <div class="acciones">
                    <button class="edit">Editar producto</button>
                    <button class="eliminate">Eliminar producto</button>
                </div>
            `;

            // Corregido: Selección por la clase correcta 'edit'
            tarjeta.querySelector('.edit').addEventListener('click', function() {
                document.getElementById('imageProduct').value = producto.imagen;
                document.getElementById('nameProduct').value = producto.titulo;
                document.getElementById('productDescription').value = producto.descripcion;
                document.getElementById('productPrice').value = producto.valor;
                document.getElementById('discountcoupon').value = producto.cupon;
                edicionProducto = producto.id;
                botonEnviar.textContent = 'Actualizar';
            });

            // Corregido: Selección por la clase correcta 'eliminate'
            tarjeta.querySelector('.eliminate').addEventListener('click', function() {
                productos = productos.filter(item => item.id !== producto.id);
                verMensaje('Producto eliminado correctamente.', 'info');
                verProductos();
            });

            contenedor.appendChild(tarjeta);
        });
    }

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const imagen = document.getElementById('imageProduct').value;
        const titulo = document.getElementById('nameProduct').value;
        const descripcion = document.getElementById('productDescription').value;
        const valor = parseFloat(document.getElementById('productPrice').value);
        // Asegúrate que el ID en el HTML sea 'discountcoupon'
        const cupon = document.getElementById('discountcoupon').value.toUpperCase();

        if (!imagen || !titulo || !descripcion || isNaN(valor)) {
            verMensaje('Ingrese los campos obligatorios.', 'error');
            return;
        }

        if (edicionProducto !== null) {
            productos = productos.map(producto => {
                if (producto.id === edicionProducto) {
                    return { id: producto.id, imagen, titulo, descripcion, valor, cupon };
                }
                return producto;
            });
            botonEnviar.textContent = 'Guardar';
            verMensaje('Actualización correcta.', 'success');
        } else {
            productos.push({ id: Date.now(), imagen, titulo, descripcion, valor, cupon });
            verMensaje('Producto ingresado.', 'success');
        }

        limpiezaForm();
        verProductos();
    });

    verProductos();
});