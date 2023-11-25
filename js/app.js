(function () {
    const form = document.querySelector('#formulario');
    const resultado = document.querySelector('#resultado');
    const paginacionDiv = document.querySelector('#paginacion');
    const resultadosPorPagina = 40;
    let totalPaginas;
    let paginaActual = 1;
    let ultimaPagina = false;

    form.addEventListener('submit', validateForm);

    function validateForm(event) {
        event.preventDefault();
        const termino = document.querySelector('#termino').value;

        if (termino === '') {
            showAlert('El campo término es requerido');
            return;
        }
        paginaActual = 1;
        requestApi();
    }

    async function requestApi() {
        const termino = document.querySelector('#termino').value;
        const apiKey = '32427065-6b1b423390d62e815267aac2d'
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${termino}&per_page=${resultadosPorPagina}&page=${paginaActual}`;

        // fetch(url)
        //     .then(response => response.json())
        //     .then(result => {
        //         totalPaginas = calcularPaginas(result.totalHits);
        //         //mostrar los resultados de la busqueda
        //         showResults(result.hits);
        //     })
        
            try {
                const respuesta = await fetch(url);
                const resultado = await respuesta.json();
                totalPaginas = calcularPaginas(resultado.totalHits);
                //mostrar los resultadoados de la busqueda
                showResults(resultado.hits);
            } catch (error) {
                console.log(error);
            }

    }

    function showResults(imagenes) {
        clearHtml(resultado);

        imagenes.forEach(imagen => {
            const { id, downloads, likes, comments, largeImageURL, previewURL } = imagen;

            const contenedorImagen = document.createElement('DIV');
            contenedorImagen.classList.add('sm:w-1/2', 'md:w-1/3', 'lg:w-1/4', 'xl:w-1/5', 'p-2');
            contenedorImagen.innerHTML =
            `
                <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                    <img src="${previewURL}" alt="previewImage" class="w-full">
                </a>
                <div class="p-4 bg-white">
                    <p class="text-sm"><strong>${likes}</strong> Likes</p>
                    <p class="text-sm"><strong>${downloads}</strong> Downloads</p>
                </div>
            `;
            resultado.appendChild(contenedorImagen);
        })

         //mostrar la paginacion
         clearHtml(paginacionDiv);
         paginate(totalPaginas);
    }

    function calcularPaginas(total) {
        return Math.ceil(total / resultadosPorPagina);
    }

    function paginate(total) {
        for(let i = 1; i <= total; i++) {
            if(i >= total) {
                ultimaPagina = true;
            }
            showPaginate(i);
        }
    }

    function showPaginate(pagina) {

        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = pagina;
        boton.classList.add('bg-yellow-400', 'mb-4', 'mx-2', 'py-1', 'px-4', 'rounded-lg', 'font-bold', 'hover:bg-yellow-600');
        boton.textContent = pagina;
        boton.onclick = () => {
            paginaActual = pagina;
            requestApi();
        }
        paginacionDiv.appendChild(boton);
    }

    
    function showAlert(message) {
        if (!document.querySelector('.alert')) {
            const alert = document.createElement('P');
            alert.textContent = message;
            alert.classList.add('alert', 'p-3', 'mt-4', 'bg-red-200', 'border', 'border-red-700', 'text-red-600', 'font-bold', 'rounded-lg', 'text-center');
            form.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 2500);
        }
    }

    function clearHtml(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

})();