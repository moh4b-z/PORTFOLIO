// Este script é necessário apenas se você deseja alternar as cores dinamicamente

// A paleta de cores
const cores = ['#99cee6', '#375899'];

// Obtém o elemento h1
const titulo = document.getElementById('titulo');

// Função para alternar entre as cores da paleta
function alternarCores() {
    titulo.style.color = cores[Math.floor(Math.random() * cores.length)];
}

// Chama a função para alternar cores em intervalos regulares
setInterval(alternarCores, 3000); // Altera a cor a cada 5 segundos
