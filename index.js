const containerDesabafos = document.getElementById('containerDesabafos');
if (!containerDesabafos) {
    console.error('Elemento #containerDesabafos não encontrado.');
}

// Função para adicionar um novo desabafo
function adicionarDesabafo() {
    const texto = document.getElementById('textoDesabafo').value.trim();
    const inputArquivo = document.getElementById('imagemDesabafo');
    const arquivo = inputArquivo.files[0];
    const data = new Date().toLocaleDateString();

    if (!texto && !arquivo) {
        alert('Por favor, insira um texto ou selecione uma imagem para o desabafo.');
        return;
    }

    if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function (e) {
            const urlImagem = e.target.result;
            salvarDesabafo({ texto, urlImagem, data });
            carregarDesabafos();
        };
        leitor.readAsDataURL(arquivo);
    } else {
        salvarDesabafo({ texto, urlImagem: null, data });
        carregarDesabafos();
    }

    document.getElementById('textoDesabafo').value = '';
    inputArquivo.value = '';
}

// Salvar no Local Storage
function salvarDesabafo(desabafo) {
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    desabafos.push(desabafo);
    localStorage.setItem('desabafos', JSON.stringify(desabafos));
}

// Carregar desabafos
function carregarDesabafos() {
    containerDesabafos.innerHTML = '';
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    desabafos.forEach(({ texto, urlImagem, data }) => criarDesabafo(texto, urlImagem, data));
}

// Criar desabafo
function criarDesabafo(texto, urlImagem, data) {
    const desabafo = document.createElement('div');
    desabafo.classList.add('desabafo');

    const titulo = document.createElement('h3');
    titulo.textContent = data;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;

    if (urlImagem) {
        const img = document.createElement('img');
        img.src = urlImagem;
        img.alt = 'Imagem do Dia';
        desabafo.appendChild(img);
    }

    desabafo.appendChild(titulo);
    desabafo.appendChild(paragrafo);

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

// Editar desabafo
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

// Excluir desabafo
function excluirDesabafo(textoAtual) {
    const desabafos = JSON.parse(localStorage.getItem('desabafos')) || [];
    const novosDesabafos = desabafos.filter((d) => d.texto !== textoAtual);
    localStorage.setItem('desabafos', JSON.stringify(novosDesabafos));
    carregarDesabafos();
}

// Inicializar
carregarDesabafos();

// Canvas para as bolas de vôlei
const canvas = document.getElementById('volleyballCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class BolaDeVolei {
    constructor(x, y, velocidadeX, velocidadeY) {
        this.x = x;
        this.y = y;
        this.raio = 30;
        this.velocidadeX = velocidadeX;
        this.velocidadeY = velocidadeY;
        this.cor = '#FFEB3B';
    }
    desenhar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        ctx.fillStyle = this.cor;
        ctx.fill();
        ctx.closePath();
    }
    mover() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        if (this.x + this.raio > canvas.width || this.x - this.raio < 0) this.velocidadeX *= -1;
        if (this.y + this.raio > canvas.height || this.y - this.raio < 0) this.velocidadeY *= -1;
    }
}

const bolas = [];
for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const velocidadeX = (Math.random() - 0.5) * 4;
    const velocidadeY = (Math.random() - 0.5) * 4;
    bolas.push(new BolaDeVolei(x, y, velocidadeX, velocidadeY));
}

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bolas.forEach((bola) => {
        bola.mover();
        bola.desenhar();
    });
    requestAnimationFrame(animar);
}
animar();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
