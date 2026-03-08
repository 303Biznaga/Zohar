async function revelarDestino() {
    const pantalla = document.getElementById('contenedor-revelacion');
    const titulo = document.getElementById('titulo-revelacion');
    const texto = document.getElementById('texto-revelacion');
    
    pantalla.style.opacity = 0;
    
    try {
        const respuesta = await fetch('content.json');
        const mensajes = await respuesta.json();
        const index = new Date().getSeconds() % mensajes.length;
        const seleccion = mensajes[index];

        setTimeout(() => {
            titulo.innerText = seleccion.titulo;
            texto.innerText = seleccion.mensaje;
            pantalla.style.opacity = 1;
        }, 800);
    } catch (e) {
        console.log("Conectando con la fuente...");
    }
}