// Dados iniciais dos eventos
let eventos = [
    {
        id: 1,
        titulo: "Palestra sobre Inteligência Artificial",
        categoria: "palestra",
        data: "2026-04-25",
        local: "Auditório Principal",
        vagas: 3,
        descricao: "Exploraremos os fundamentos da IA e suas aplicações práticas no contexto acadêmico."
    },
    {
        id: 2,
        titulo: "Minicurso de React Native",
        categoria: "minicurso",
        data: "2026-04-28",
        local: "Sala de Laboratório 3",
        vagas: 15,
        descricao: "Aprenda a desenvolver aplicativos móveis multiplataforma com React Native."
    },
    {
        id: 3,
        titulo: "Oficina de Design Thinking",
        categoria: "oficina",
        data: "2026-04-20", // Data passada
        local: "Sala Multiuso",
        vagas: 25,
        descricao: "Workshop prático sobre metodologias ágeis de Design Thinking."
    },
    {
        id: 4,
        titulo: "Seminário de Cibersegurança",
        categoria: "seminario",
        data: "2026-05-02",
        local: "Auditório B",
        vagas: 8,
        descricao: "Discussão sobre as principais ameaças cibernéticas e estratégias de proteção."
    },
    {
        id: 5,
        titulo: "Workshop de Git e GitHub",
        categoria: "oficina",
        data: "2026-04-30",
        local: "Laboratório de Desenvolvimento",
        vagas: 20,
        descricao: "Controle de versão na prática: do básico ao avançado com Git e GitHub."
    },
    {
        id: 6,
        titulo: "Palestra Magna de Abertura",
        categoria: "palestra",
        data: "2026-04-22", // Data passada
        local: "Teatro Universitário",
        vagas: 0,
        descricao: "Cerimônia de abertura do semestre com palestrante convidado especial."
    }
];

let contadorId = 7; // Próximo ID disponível

// Elementos do DOM
const formEvento = document.getElementById('formEvento');
const listaEventos = document.getElementById('listaEventos');
const buscaInput = document.getElementById('busca');
const categoriaSelect = document.getElementById('categoria');
const mensagemDiv = document.getElementById('mensagem');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderizarEventos();
    configurarEventos();
});

function configurarEventos() {
    // Event listeners para filtros
    buscaInput.addEventListener('input', filtrarEventos);
    categoriaSelect.addEventListener('change', filtrarEventos);
    
    // Event listener para formulário
    formEvento.addEventListener('submit', cadastrarEvento);
}

function renderizarEventos(eventosFiltrados = eventos) {
    listaEventos.innerHTML = '';
    
    if (eventosFiltrados.length === 0) {
        listaEventos.innerHTML = `
            <div class="evento-card" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3>Nenhum evento encontrado</h3>
                <p>Tente ajustar os filtros ou cadastrar um novo evento.</p>
            </div>
        `;
        return;
    }

    eventosFiltrados.forEach(evento => {
        const card = criarCardEvento(evento);
        listaEventos.appendChild(card);
    });
}

function criarCardEvento(evento) {
    const hoje = new Date().toISOString().split('T')[0];
    const poucasVagas = evento.vagas <= 5;
    const encerrado = evento.data < hoje || evento.vagas <= 0;

    const card = document.createElement('article');
    card.className = `evento-card ${poucasVagas ? 'evento-poucas-vagas' : ''} ${encerrado ? 'evento-encerrado' : ''}`;
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Evento: ${evento.titulo}`);

    card.innerHTML = `
        <h3>${evento.titulo}</h3>
        <div class="evento-meta">
            <div class="evento-categoria">
                <img src="img/icon-${evento.categoria}.png" 
                     alt="${formatarCategoria(evento.categoria)}" 
                     width="42" height="42"
                     loading="lazy"
                     onerror="this.style.display='none'; this.nextElementSibling.style.marginLeft='0';">
                <span class="categoria-label">${evento.categoria.toUpperCase()}</span>
            </div>
            <div>
                <span class="data-evento">${formatarData(evento.data)}</span>
                <span class="vagas-disponiveis ${poucasVagas ? 'poucas' : ''}">
                    ${evento.vagas} ${evento.vagas === 1 ? 'vaga' : 'vagas'}
                </span>
            </div>
        </div>
        <p>${evento.descricao}</p>
        <div class="evento-local">📍 ${evento.local}</div>
    `;

    return card;
}

function filtrarEventos() {
    const termoBusca = buscaInput.value.toLowerCase().trim();
    const categoriaSelecionada = categoriaSelect.value;

    const eventosFiltrados = eventos.filter(evento => {
        const correspondeBusca = evento.titulo.toLowerCase().includes(termoBusca);
        const correspondeCategoria = !categoriaSelecionada || evento.categoria === categoriaSelecionada;
        
        return correspondeBusca && correspondeCategoria;
    });

    renderizarEventos(eventosFiltrados);
}

async function cadastrarEvento(e) {
    e.preventDefault();
    
    // Validações nativas HTML5
    if (!formEvento.checkValidity()) {
        formEvento.reportValidity();
        return;
    }

    // Validações JavaScript adicionais
    const erros = validarFormulario();
    
    if (erros.length > 0) {
        mostrarMensagem(erros.join('<br>'), 'erro');
        return;
    }

    // Criar novo evento
    const novoEvento = {
        id: contadorId++,
        titulo: document.getElementById('titulo').value.trim(),
        categoria: document.getElementById('categoria-evento').value,
        data: document.getElementById('data').value,
            local: document.getElementById('local').value.trim(),
        vagas: parseInt(document.getElementById('vagas').value),
        descricao: document.getElementById('descricao').value.trim()
    };

    // Adicionar à lista
    eventos.unshift(novoEvento);
    
    // Atualizar interface
    renderizarEventos();
    limparFormulario();
    mostrarMensagem('Evento cadastrado com sucesso!', 'sucesso');
    
    // Scroll suave para a lista
    document.getElementById('eventos').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function validarFormulario() {
    const erros = [];
    
    const titulo = document.getElementById('titulo');
    const local = document.getElementById('local');
    const descricao = document.getElementById('descricao');
    const vagas = parseInt(document.getElementById('vagas').value);

    // Limpar classes anteriores
    [titulo, local, descricao, document.getElementById('vagas')].forEach(input => {
        input.classList.remove('erro-input');
    });

    if (titulo.value.trim().length < 3) {
        erros.push('O título deve ter pelo menos 3 caracteres e não pode ser apenas espaços.');
        titulo.classList.add('erro-input');
    }

    if (local.value.trim().length < 3) {
        erros.push('O local deve ser preenchido corretamente e não pode conter apenas espaços.');
        local.classList.add('erro-input');
    }

    if (descricao.value.trim().length < 10) {
        erros.push('A descrição deve ter pelo menos 10 caracteres e não pode ser apenas espaços.');
        descricao.classList.add('erro-input');
    }

    if (Number.isNaN(vagas) || vagas <= 0) {
        erros.push('O número de vagas deve ser maior que zero.');
        document.getElementById('vagas').classList.add('erro-input');
    }
    
    return erros;
}

function limparFormulario() {
    formEvento.reset();
    document.querySelectorAll('.erro-input').forEach(el => {
        el.classList.remove('erro-input');
    });
    document.querySelectorAll('.erro').forEach(el => {
        el.textContent = '';
    });
}

function mostrarMensagem(texto, tipo) {
    mensagemDiv.textContent = texto;
    mensagemDiv.className = `mensagem ${tipo}`;
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        mensagemDiv.textContent = '';
        mensagemDiv.className = 'mensagem';
    }, 5000);
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatarCategoria(categoria) {
    const labels = {
        palestra: 'Palestra',
        minicurso: 'Minicurso',
        oficina: 'Oficina',
        seminario: 'Seminário',
        outro: 'Outro'
    };

    return labels[categoria] || categoria;
}
