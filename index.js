const containerDesabafos = document.getElementById('containerDesabafos');

// Função para adicionar um novo desabafo
function adicionarDesabafo() {
    const texto = document.getElementById('textoDesabafo').value;
    const inputArquivo = document.getElementById('imagemDesabafo');
    const arquivo = inputArquivo.files[0];
    const data = new Date().toLocaleDateString();

    if (!texto && !arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function(e) {
        const urlImagem = arquivo ? e.target.result : null;
        criarDesabafo(texto, urlImagem, data);
        document.getElementById('textoDesabafo').value = '';
        inputArquivo.value = '';
    };

    if (arquivo) leitor.readAsDataURL(arquivo);
    else criarDesabafo(texto, null, data);
}

// Função para criar o HTML de um desabafo
function criarDesabafo(texto, urlImagem, data) {
    const desabafo = document.createElement('div');
    desabafo.classList.add('desabafo');

    desabafo.innerHTML = `
        <h3>${data}</h3>
        <p>${texto}</p>
        ${urlImagem ? `<img src="${urlImagem}" alt="Imagem do Dia">` : ''}
        <div class="controles-desabafo">
            <button onclick="editarDesabafo(this)">Editar</button>
            <button onclick="deletarDesabafo(this)">Excluir</button>
        </div>
    `;

    containerDesabafos.prepend(desabafo);
}

// Função para editar um desabafo
function editarDesabafo(botao) {
    const desabafo = botao.parentElement.parentElement;
    const texto = prompt('Editar desabafo:', desabafo.querySelector('p').textContent);

    if (texto !== null) {
        desabafo.querySelector('p').textContent = texto;
    }
}

// Função para excluir um desabafo
function deletarDesabafo(botao) {
    const desabafo = botao.parentElement.parentElement;
    containerDesabafos.removeChild(desabafo);
}
