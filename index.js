// Seleciona o container onde os desabafos serão exibidos
const containerDesabafos = document.getElementById('containerDesabafos');

// Variável que mantém a categoria atualmente selecionada para filtro
let categoriaAtiva = 'Todas'; // Por padrão, exibe todas as categorias

// Função para adicionar um novo desabafo
function adicionarDesabafo() {
    // Obtém o texto do desabafo e a categoria selecionada
    const texto = document.getElementById('textoDesabafo').value.trim();
    const categoria = document.getElementById('categoriaDesabafo').value;

    // Valida se o texto foi inserido
    if (!texto) {
        alert('Por favor, insira um texto para o desabafo.');
        return;
    }

    // Salva o desabafo no Local Storage
    salvarDesabafo({
        texto,
        categoria,
        data: new Date().toLocaleDateString(), // Formata a data para o padrão local
    });

    // Recarrega os desabafos para atualizar a interface
    carregarDesabafos();

    // Limpa o campo de texto após o desabafo ser adicionado
    document.getElementById('textoDesabafo').value = '';
}

// Função para salvar o desabafo no Local Storage
function salvarDesabafo(desabafo) {
    // Obtém os desabafos existentes no Local Storage, ou cria um array vazio se não houver nenhum
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    desabafos.push(desabafo); // Adiciona o novo desabafo ao array
    localStorage.setItem('desabafos', JSON.stringify(desabafos)); // Atualiza o Local Storage
}

// Função para carregar os desabafos do Local Storage e exibi-los
function carregarDesabafos() {
    // Obtém o termo de pesquisa digitado pelo usuário
    const termoPesquisa = document.getElementById('barraPesquisa').value.trim().toLowerCase();
    // Recupera os desabafos armazenados no Local Storage
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];

    // Filtra os desabafos com base na categoria ativa e no termo de pesquisa
    const resultados = desabafos.filter(({ texto, categoria, data }) => {
        const correspondeCategoria = categoriaAtiva === 'Todas' || categoria === categoriaAtiva; // Verifica se a categoria corresponde
        const correspondePesquisa = 
            texto.toLowerCase().includes(termoPesquisa) || // Pesquisa no texto
            data.includes(termoPesquisa) || // Pesquisa na data
            categoria.toLowerCase().includes(termoPesquisa); // Pesquisa na categoria

        return correspondeCategoria && correspondePesquisa; // Retorna apenas desabafos que atendem ambas as condições
    });

    // Atualiza a interface com os resultados filtrados
    containerDesabafos.innerHTML = ''; // Limpa o container antes de adicionar os novos elementos
    if (resultados.length > 0) {
        // Se houver resultados, exibe cada desabafo
        resultados.forEach((desabafo, index) =>
            criarDesabafo(desabafo.texto, desabafo.categoria, desabafo.data, index)
        );
    } else {
        // Exibe uma mensagem caso nenhum desabafo seja encontrado
        containerDesabafos.innerHTML = '<p>Nenhum desabafo encontrado.</p>';
    }
}

// Função para criar o HTML de um desabafo
function criarDesabafo(texto, categoria, data, index) {
    // Cria um elemento de div para representar o desabafo
    const desabafo = document.createElement('div');
    desabafo.classList.add('desabafo'); // Adiciona uma classe para estilização

    // Define o conteúdo HTML do desabafo
    desabafo.innerHTML = `
        <h3>${data} - ${categoria}</h3> <!-- Exibe a data e a categoria -->
        <p>${texto}</p> <!-- Exibe o texto do desabafo -->
        <div class="controles-desabafo">
            <button onclick="editarDesabafo(${index})">Editar</button>
            <button onclick="excluirDesabafo(${index})">Excluir</button>
        </div>
    `;

    // Adiciona o desabafo ao container
    containerDesabafos.appendChild(desabafo);
}

// Função para editar um desabafo
function editarDesabafo(index) {
    // Recupera os desabafos do Local Storage
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    const desabafoAtual = desabafos[index]; // Obtém o desabafo a ser editado

    // Exibe um prompt para o usuário editar o texto do desabafo
    const novoTexto = prompt('Editar desabafo:', desabafoAtual.texto);
    if (novoTexto !== null && novoTexto.trim() !== '') {
        desabafos[index].texto = novoTexto.trim(); // Atualiza o texto
        localStorage.setItem('desabafos', JSON.stringify(desabafos)); // Salva as alterações no Local Storage
        carregarDesabafos(); // Recarrega os desabafos para atualizar a interface
    }
}

// Função para excluir um desabafo
function excluirDesabafo(index) {
    // Recupera os desabafos do Local Storage
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    desabafos.splice(index, 1); // Remove o desabafo pelo índice
    localStorage.setItem('desabafos', JSON.stringify(desabafos)); // Atualiza o Local Storage
    carregarDesabafos(); // Recarrega os desabafos para atualizar a interface
}

// Função para filtrar desabafos por categoria
function filtrarDesabafos(categoria) {
    categoriaAtiva = categoria; // Define a nova categoria ativa
    carregarDesabafos(); // Recarrega os desabafos com o filtro aplicado
}

// Função para pesquisar desabafos
function pesquisarDesabafos() {
    carregarDesabafos(); // Recarrega os desabafos com base na pesquisa e na categoria ativa
}

// Inicializa o carregamento dos desabafos ao iniciar a aplicação
carregarDesabafos();


