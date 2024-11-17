const containerDesabafos = document.getElementById('containerDesabafos');
if (!containerDesabafos) {
    console.error('Elemento #containerDesabafos não encontrado.');
}

// Função para adicionar um novo desabafo
function adicionarDesabafo() {
    const texto = document.getElementById('textoDesabafo').value.trim();
    const categoria = document.getElementById('categoriaDesabafo').value;
    const inputArquivo = document.getElementById('imagemDesabafo');
    const arquivo = inputArquivo.files[0];
    const data = new Date().toLocaleDateString();

    // Valida se há texto ou imagem antes de prosseguir
    if (!texto && !arquivo) {
        alert('Por favor, insira um texto ou selecione uma imagem para o desabafo.');
        return;
    }

    if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function (e) {
            const urlImagem = e.target.result; // URL da imagem carregada
            salvarDesabafo({ texto, categoria, urlImagem, data });
            carregarDesabafos();
        };
        leitor.readAsDataURL(arquivo);
    } else {
        salvarDesabafo({ texto, categoria, urlImagem: null, data });
        carregarDesabafos();
    }

    // Limpa os campos após adicionar o desabafo
    document.getElementById('textoDesabafo').value = '';
    inputArquivo.value = '';
}

// Salva o desabafo no Local Storage
function salvarDesabafo(desabafo) {
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    desabafos.push(desabafo);
    localStorage.setItem('desabafos', JSON.stringify(desabafos));
}

// Carrega os desabafos do Local Storage
function carregarDesabafos(categoria = 'Todas') {
    containerDesabafos.innerHTML = ''; // Limpa o container de desabafos
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    const desabafosFiltrados = categoria === 'Todas' ? desabafos : desabafos.filter(d => d.categoria === categoria);
    desabafosFiltrados.forEach(({ texto, categoria, urlImagem, data }) => criarDesabafo(texto, categoria, urlImagem, data));
}

// Cria o HTML de um desabafo
function criarDesabafo(texto, categoria, urlImagem, data) {
    const desabafo = document.createElement('div');
    desabafo.classList.add('desabafo');

    const titulo = document.createElement('h3');
    titulo.textContent = `${data} - ${categoria}`;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;

    desabafo.appendChild(titulo);
    desabafo.appendChild(paragrafo);

    if (urlImagem) {
        const img = document.createElement('img');
        img.src = urlImagem;
        img.alt = 'Imagem do Dia';
        desabafo.appendChild(img);
    }

    const controles = document.createElement('div');
    controles.classList.add('controles-desabafo');

    const editar = document.createElement('button');
    editar.textContent = 'Editar';
    editar.onclick = () => editarDesabafo(desabafo, texto);

    const excluir = document.createElement('button');
    excluir.textContent = 'Excluir';
    excluir.onclick = () => excluirDesabafo(texto);

    controles.appendChild(editar);
    controles.appendChild(excluir);
    desabafo.appendChild(controles);

    containerDesabafos.prepend(desabafo);
}

// Edita um desabafo
function editarDesabafo(desabafo, textoAtual) {
    const novoTexto = prompt('Editar desabafo:', textoAtual);
    if (novoTexto !== null) {
        const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
        const index = desabafos.findIndex((d) => d.texto === textoAtual);
        if (index > -1) {
            desabafos[index].texto = novoTexto;
            localStorage.setItem('desabafos', JSON.stringify(desabafos));
            carregarDesabafos();
        }
    }
}

// Exclui um desabafo
function excluirDesabafo(textoAtual) {
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    const novosDesabafos = desabafos.filter((d) => d.texto !== textoAtual);
    localStorage.setItem('desabafos', JSON.stringify(novosDesabafos));
    carregarDesabafos();
}

// Filtra os desabafos por categoria
function filtrarDesabafos(categoria) {
    carregarDesabafos(categoria);
}

// Inicializa o carregamento dos desabafos
carregarDesabafos();
