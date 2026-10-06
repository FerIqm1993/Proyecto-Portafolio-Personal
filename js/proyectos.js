document.addEventListener('DOMContentLoaded', async () => {
    const wrapper = document.getElementById('seccionProyectosWrapper');
    if (!wrapper) return;

    try {
        // Cargar la plantilla HTML
        const response = await fetch('pages/proyectos.html');
        if (!response.ok) throw new Error('Error al cargar la plantilla');
        const html = await response.text();
        wrapper.innerHTML = html;

        // Inicializar filtros
        initFilters();

        // Cargar repositorios de GitHub
        await cargarRepositoriosGitHub();
        
    } catch (error) {
        console.error('Error cargando la sección de proyectos:', error);
        wrapper.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los proyectos dinámicamente. Verifica que estás usando un servidor local o corrige la ruta del fetch.</p>';
    }
});

function initFilters() {
    let filterButtons = document.querySelectorAll('.filter-btn');
    let projectItems = document.querySelectorAll('.project-item');

    // Remover listeners anteriores clonando los botones (para evitar duplicados si se llama múltiples veces)
    const filterContainer = document.getElementById('filter-buttons');
    if(filterContainer) {
        const newContainer = filterContainer.cloneNode(true);
        filterContainer.parentNode.replaceChild(newContainer, filterContainer);
        filterButtons = document.querySelectorAll('.filter-btn');
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Resetear estilos de los botones
            filterButtons.forEach(b => {
                b.classList.remove('active', 'btn-primary');
                b.classList.add('btn-outline-primary');
            });

            // Activar botón clickeado
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('active', 'btn-primary');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Animación de transición
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s ease-in-out';
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

async function cargarRepositoriosGitHub() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const response = await fetch('https://api.github.com/users/FerIqm1993/repos?sort=created&direction=desc');
        const repos = await response.json();

        // Filtrar repositorios que no sean el portafolio en sí
        const reposFiltrados = repos.filter(repo => repo.name !== 'Proyecto-Portafolio-Personal');

        reposFiltrados.forEach(repo => {
            const fecha = new Date(repo.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
            const descripcion = repo.description ? repo.description : 'Sin descripción proporcionada.';
            const lenguaje = repo.language ? repo.language : 'Varios';
            
            const cardHTML = `
            <div class="col-md-6 mb-4 project-item" data-category="github">
                <div class="card h-100 shadow-sm border-info">
                    <div class="card-body">
                        <h5 class="card-title text-info">${repo.name}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">GitHub (${fecha})</h6>
                        <p class="card-text">${descripcion}</p>
                        <span class="badge bg-info text-dark">${lenguaje}</span>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-light">Ver Repositorio</a>
                    </div>
                </div>
            </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Re-inicializar los filtros para que incluyan las nuevas tarjetas de GitHub
        initFilters();

    } catch (error) {
        console.error('Error al cargar los repositorios de GitHub:', error);
    }
}
