// Seleciona o container onde os desabafos serão exibidos
const containerDesabafos = document.getElementById('containerDesabafos');

// Variável que mantém a categoria atualmente selecionada para filtro
let categoriaAtiva = 'Todas'; // Por padrão, exibe todas as categorias

// Função para adicionar um novo desabafo
function adicionarDesabafo() {
    // Obtém o texto do desabafo, a categoria selecionada e a imagem (se houver)
    const texto = document.getElementById('textoDesabafo').value.trim();
    const categoria = document.getElementById('categoriaDesabafo').value;
    const inputImagem = document.getElementById('imagemDesabafo');
    const arquivoImagem = inputImagem.files[0];

    // Valida se pelo menos texto ou imagem foram fornecidos
    if (!texto && !arquivoImagem) {
        alert('Por favor, insira um texto ou selecione uma imagem para o desabafo.');
        return;
    }

    // Caso uma imagem seja fornecida, utiliza o FileReader para converter em Base64
    if (arquivoImagem) {
        const leitor = new FileReader();
        leitor.onload = function (evento) {
            // Salva o desabafo no Local Storage com a imagem em Base64
            salvarDesabafo({
                texto,
                categoria,
                data: new Date().toLocaleDateString(),
                imagem: evento.target.result, // URL Base64 da imagem
            });
            carregarDesabafos(); // Recarrega os desabafos na interface
        };
        leitor.readAsDataURL(arquivoImagem); // Lê o arquivo de imagem como Base64
    } else {
        // Caso não haja imagem, salva apenas o texto, categoria e data
        salvarDesabafo({
            texto,
            categoria,
            data: new Date().toLocaleDateString(),
            imagem: null, // Sem imagem
        });
        carregarDesabafos();
    }

    // Limpa os campos após adicionar
    document.getElementById('textoDesabafo').value = '';
    inputImagem.value = '';
}

// Função para salvar o desabafo no Local Storage
function salvarDesabafo(desabafo) {
    // Recupera os desabafos existentes ou cria um array vazio
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
        const correspondeCategoria = categoriaAtiva === 'Todas' || categoria === categoriaAtiva;
        const correspondePesquisa =
            texto.toLowerCase().includes(termoPesquisa) ||
            data.includes(termoPesquisa) ||
            categoria.toLowerCase().includes(termoPesquisa);

        return correspondeCategoria && correspondePesquisa;
    });

    // Atualiza a interface com os resultados filtrados
    containerDesabafos.innerHTML = ''; // Limpa o container antes de adicionar os novos elementos
    if (resultados.length > 0) {
        // Se houver resultados, exibe cada desabafo
        resultados.forEach((desabafo, index) =>
            criarDesabafo(desabafo.texto, desabafo.categoria, desabafo.data, index, desabafo.imagem)
        );
    } else {
        // Exibe uma mensagem caso nenhum desabafo seja encontrado
        containerDesabafos.innerHTML = '<p>Nenhum desabafo encontrado.</p>';
    }
}

// Função para criar o HTML de um desabafo
function criarDesabafo(texto, categoria, data, index, imagem = null) {
    // Cria um elemento de div para representar o desabafo
    const desabafo = document.createElement('div');
    desabafo.classList.add('desabafo'); // Adiciona uma classe para estilização

    // Define o conteúdo HTML do desabafo
    desabafo.innerHTML = `
        <h3>${data} - ${categoria}</h3> <!-- Exibe a data e a categoria -->
        <p>${texto}</p> <!-- Exibe o texto do desabafo -->
        ${imagem ? `<img src="${imagem}" alt="Imagem do Desabafo">` : ''} <!-- Exibe a imagem se houver -->
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




