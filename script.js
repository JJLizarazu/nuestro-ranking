// Espera a que todo el contenido de la página se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DATOS DE RANKINGS (Sin cambios) ---
    const rankingsData = {
        comida_boliviana: {
            title: "Comida Boliviana",
            items: ["Pique Macho", "Salteña", "Silpancho", "Sopa de Maní", "Fricasé", "Chicharrón", "Majadito", "Plato Paceño", "Lapping", "Picante de Lengua", "Charquekan Orureño", "Picante de Pollo", "Saice Tarijeño", "Chorizos Chuquisaqueños", "Ají de Fideo", "Puchero", "Ispi Frito", "TrancaPecho", "Salteña", "Sajta de Pollo"]
        },
        postres: {
            title: "Postres",
            items: ["Helado de Canela", "Cuñapé", "Raspadillo", "Tawa Tawas", "Arroz con Leche", "Sonso de Yuca", "Empanadas de Lacayote", "Gelatina de Pata", "Alfajores", "Flan"]
        },
        agachaditos: {
            title: "Agachaditos",
            items: ["Anticuchos", "Sándwich de Chola", "Tripitas", "Relleno", "Tucumanas", "Pastel de Queso", "Choripán", "Sopa de Fideo (de carrito)", "Riñoncitos al Jugo", "Papas Rellenas", "Hamburguesa de Carrito"]
        },
        paises_pareja: {
            title: "Países para Visitar Juntos",
            items: ["Japón", "Italia", "Uruguay", "Tailandia", "Francia", "España", "Grecia", "Argentina", "Islandia", "Colombia", "México", "Brasil", "Suiza", "Canadá", "Corea del Sur", "Marruecos", "Jamaica"]
        },
        cita_ideal: {
            title: "Cita Ideal",
            items: ["Noche de pelis y series en casa", "Picnic en un parque", "Cocinar juntos una receta nueva", "Viaje espontáneo de fin de semana", "Ir a un concierto", "Tarde de juegos de mesa", "Hacer trekking en una montaña", "Cena romántica en restaurante elegante", "Día de spa con masajes", "Clase de algo nuevo (baile, cerámica)", "Paseo / Caminar"]
        },
        peliculas_disney: {
            title: "Películas de Disney",
            items: ["El Rey León", "Aladdín", "La Bella y la Bestia", "Up", "Enredados", "Coco", "WALL-E", "Toy Story", "Moana", "El Jorobado de Notre Dame", "Hércules", "Mulan", "Zootopia", "Intensamente", "Buscando a Nemo"]
        },
        sabores_helado: {
            title: "Sabores de Helado Favoritos",
            items: [
                "Chocolate",
                "Frutilla",
                "Dulce de Leche",
                "Menta Granizada",
                "Limón",
                "Maracuyá",
                "Pistacho",
                "Vainilla",
                "Ron con Pasas",
                "Helado de Canela",
                "Oreo",
                "Chocolate Blanco",
                "Frutos del Bosque",
                "Chicle"
            ]
        },
    };

    // --- FUNCIÓN PRINCIPAL DE EJECUCIÓN ---
    // Esta función determina en qué página estamos y llama al código correspondiente.
    function main() {
        const path = window.location.pathname;

        if (path.includes('ranking.html')) {
            initRankingPage();
        } else {
            // Asumimos que si no es ranking.html, es index.html
            initIndexPage();
        }
    }

    // --- FUNCIONES DE LA PÁGINA PRINCIPAL (index.html) ---
    function initIndexPage() {
        try {
            const grid = document.getElementById('category-grid');
            // Si no encuentra el grid, sale para no dar error.
            if (!grid) return;

            grid.innerHTML = ''; // Limpiamos por si acaso
            for (const key in rankingsData) {
                const category = rankingsData[key];
                const button = document.createElement('a');
                button.href = `ranking.html?category=${key}`;
                button.className = 'category-btn';
                button.textContent = category.title;
                grid.appendChild(button);
            }

            const compareBtn = document.getElementById('compare-btn');
            compareBtn.addEventListener('click', compareRankings);
        } catch (error) {
            console.error("Error inicializando la página principal:", error);
        }
    }

    // --- FUNCIONES DE LA PÁGINA DE RANKING (ranking.html) ---
    function initRankingPage() {
        try {
            const params = new URLSearchParams(window.location.search);
            const categoryKey = params.get('category');
            
            // Si no hay categoría en la URL, no hacemos nada.
            if (!categoryKey) {
                document.getElementById('ranking-title').textContent = "Error: Categoría no especificada.";
                return;
            }
            
            const categoryData = rankingsData[categoryKey];

            if (!categoryData) {
                document.getElementById('ranking-title').textContent = "Error: Categoría no encontrada.";
                return;
            }

            // Cambiar título de la página y encabezado
            document.title = `Rankeando: ${categoryData.title}`;
            document.getElementById('ranking-title').textContent = `Ranking: ${categoryData.title}`;
            
            const itemsList = document.getElementById('items-list');
            itemsList.innerHTML = ''; // Limpiamos la lista antes de llenarla
            
            // Llenar la lista de "Elementos a clasificar"
            categoryData.items.forEach(itemText => {
                const itemEl = document.createElement('div');
                itemEl.className = 'rank-item';
                itemEl.textContent = itemText;
                itemsList.appendChild(itemEl);
            });

            // Activar la librería SortableJS
            const rankedList = document.getElementById('ranked-list');
            new Sortable(itemsList, { group: 'ranking', animation: 150 });
            new Sortable(rankedList, { group: 'ranking', animation: 150 });

            // Configurar el botón de compartir
            const shareButton = document.getElementById('share-button');
            shareButton.addEventListener('click', () => {
                generateShareMessage(categoryData.title);
            });
        } catch (error) {
            console.error("Error inicializando la página de ranking:", error);
        }
    }

    // --- FUNCIONES AUXILIARES (Compartir y Comparar) ---

    function generateShareMessage(title) {
        const rankedItems = document.querySelectorAll('#ranked-list .rank-item');
        if (rankedItems.length === 0) {
            alert("¡Primero tienes que arrastrar algunos elementos a tu ranking!");
            return;
        }
        
        let message = `Ranking: ${title}\n\n`;
        rankedItems.forEach((item, index) => {
            message += `${index + 1}. ${item.textContent}\n`;
        });
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://api.whatsapp.com/send?text=${encodedMessage}`;
        window.open(whatsappLink, '_blank');
    }

    function compareRankings() {
        const text1 = document.getElementById('ranking-text-1').value;
        const text2 = document.getElementById('ranking-text-2').value;

        if (!text1 || !text2) {
            alert("Por favor, pega ambos rankings para comparar.");
            return;
        }

        const list1 = parseRankingText(text1);
        const list2 = parseRankingText(text2);
        
        const maxLength = Math.max(list1.length, list2.length);
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tu Ranking</th>
                        <th>Su Ranking</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < maxLength; i++) {
            const item1 = list1[i] || '---';
            const item2 = list2[i] || '---';
            let rowClass = '';

            if (item1 === item2 && item1 !== '---') {
                rowClass = 'match';
            } else if ((item2 !== '---' && list1.includes(item2)) || (item1 !== '---' && list2.includes(item1))) {
                rowClass = 'near-match';
            }

            tableHTML += `<tr class="${rowClass}">
                            <td>${i + 1}</td>
                            <td>${item1}</td>
                            <td>${item2}</td>
                          </tr>`;
        }

        tableHTML += `</tbody></table>`;
        document.getElementById('comparison-result').innerHTML = tableHTML;
    }

    function parseRankingText(text) {
        return text.split('\n')
                   .map(line => line.trim())
                   .filter(line => line.match(/^\d+\.\s*/))
                   .map(line => line.replace(/^\d+\.\s*/, ''));
    }

    // --- ¡AQUÍ EMPIEZA TODO! ---
    main();
});