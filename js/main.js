document.addEventListener('DOMContentLoaded', () => {
    console.log("Portafolio cargado correctamente.");

    // Establecer año actual en el pie de página
    const anioSpan = document.getElementById('anioActual');
    if (anioSpan) {
        anioSpan.textContent = new Date().getFullYear();
    }
});
