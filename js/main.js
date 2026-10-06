document.addEventListener('DOMContentLoaded', () => {

    // Establecer año actual en el pie de página
    const anioSpan = document.getElementById('anioActual');
    if (anioSpan) {
        anioSpan.textContent = new Date().getFullYear();
    }
});
