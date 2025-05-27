let dataAtual = new Date();
let eventos = [];

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const headerPanel = document.getElementById("headerPanel");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-collapsed");
    headerPanel.classList.toggle("hidden"); // esconde/mostra o painel azul
});
function atualizarCalendario(data) {
    const diasContainer = document.getElementById('diasCalendario');
    diasContainer.innerHTML = '';

    const mes = data.toLocaleString('default', { month: 'long' });
    const ano = data.getFullYear();
    const primeiroDia = new Date(ano, data.getMonth(), 1);
    const ultimoDia = new Date(ano, data.getMonth() + 1, 0);

    document.querySelector('#calendario h3').textContent = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${ano}`;

    const diaSemanaInicio = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    for (let i = 0; i < diaSemanaInicio; i++) {
        const div = document.createElement('div');
        div.className = 'h-24 p-1 border rounded-lg text-gray-400';
        diasContainer.appendChild(div);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const div = document.createElement('div');
        div.className = 'h-24 p-1 border rounded-lg relative';
        div.textContent = dia;

        const hoje = new Date();
        if (
            dia === hoje.getDate() &&
            data.getMonth() === hoje.getMonth() &&
            data.getFullYear() === hoje.getFullYear()
        ) {
            div.classList.add('bg-blue-100', 'font-bold');
        }

        const dataFormatada = `${ano}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        const eventosDoDia = eventos.filter(e => e.data === dataFormatada);
        eventosDoDia.forEach((evento, index) => {
            const lembrete = document.createElement('div');
            lembrete.className = 'absolute bottom-1 left-1 right-1 text-white text-xs p-0.5 rounded truncate flex justify-between items-center';
            lembrete.style.backgroundColor = evento.cor || '#3b82f6';
            lembrete.innerHTML = `
                <span class="truncate">${evento.titulo}</span>
                <button class="ml-2 text-white text-sm" onclick="removerEvento('${evento.data}', ${index})">×</button>
            `;
            div.appendChild(lembrete);
        });

        diasContainer.appendChild(div);
    }
}

function removerEvento(data, index) {
    const eventosDoDia = eventos.filter(e => e.data === data);
    const globalIndex = eventos.indexOf(eventosDoDia[index]);
    if (globalIndex !== -1) {
        eventos.splice(globalIndex, 1);
        atualizarCalendario(dataAtual);
    }
}

// Botões
document.getElementById('prevMes').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    atualizarCalendario(dataAtual);
});

document.getElementById('proxMes').addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    atualizarCalendario(dataAtual);
});

// Modal
const modal = document.getElementById('modalEvento');
document.getElementById('abrirModal').addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('cancelarEvento').addEventListener('click', () => modal.classList.add('hidden'));

document.getElementById('salvarEvento').addEventListener('click', () => {
    const data = document.getElementById('inputData').value;
    const titulo = document.getElementById('inputTitulo').value.trim();
    const cor = document.getElementById('inputCor').value;

    if (data && titulo) {
        eventos.push({ data, titulo, cor });
        modal.classList.add('hidden');
        document.getElementById('inputTitulo').value = '';
        atualizarCalendario(dataAtual);
    }
});

atualizarCalendario(dataAtual);

// Sidebar Tabs
document.querySelectorAll('button[data-tab="missoes"]').forEach(botao => {
    botao.addEventListener('click', () => {
        const missoesMenu = document.querySelector('.sidebar-item[data-tab="missoes"]');
        if (missoesMenu) missoesMenu.click();
    });
});
document.querySelectorAll('button[data-tab="calendario"]').forEach(botao => {
    botao.addEventListener('click', () => {
        const calendarioMenu = document.querySelector('.sidebar-item[data-tab="calendario"]');
        if (calendarioMenu) calendarioMenu.click();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const tabContents = document.querySelectorAll('.tab-content');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            sidebarItems.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            item.classList.add('active');
            const tabId = item.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const ctxEstudos = document.getElementById('graficoEstudos')?.getContext('2d');
    if (ctxEstudos) {
        new Chart(ctxEstudos, {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Horas de Estudo',
                    data: [1.5, 2, 3, 2.5, 1, 4, 0],
                    backgroundColor: '#6366F1'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    const ctxInvest = document.getElementById('graficoInvestimentos')?.getContext('2d');
    if (ctxInvest) {
        new Chart(ctxInvest, {
            type: 'pie',
            data: {
                labels: ['Saldo Disponível', 'Transporte', 'Lazer', 'Alimentação', 'Comprar', 'Outros'],
                datasets: [{
                    data: [8000, 1000, 1500, 1500, 1500, 2250],
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']
                }]
            },
            options: { responsive: true }
        });
    }

    const ctxDespesas = document.getElementById('graficoDespesas')?.getContext('2d');
    if (ctxDespesas) {
        new Chart(ctxDespesas, {
            type: 'pie',
            data: {
                labels: ['Moradia', 'Alimentação', 'Transporte', 'Educação', 'Lazer', 'Outros'],
                datasets: [{
                    data: [1200, 900, 300, 500, 200, 150],
                    backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#6B7280']
                }]
            },
            options: { responsive: true }
        });
    }
});

document.querySelectorAll('.categoria-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        // Remove estilos ativos de todos os botões
        document.querySelectorAll('.categoria-btn').forEach(b => {
            b.classList.remove('bg-blue-100', 'text-blue-600');
            b.classList.add('bg-gray-100', 'text-gray-600');
        });

        // Estiliza o botão clicado como ativo
        botao.classList.remove('bg-gray-100', 'text-gray-600');
        botao.classList.add('bg-blue-100', 'text-blue-600');

        const categoriaSelecionada = botao.getAttribute('data-categoria');
        const cursos = document.querySelectorAll('.curso-card');

        cursos.forEach(curso => {
            if (categoriaSelecionada === 'todos' || curso.getAttribute('data-categoria') === categoriaSelecionada) {
                curso.style.display = 'block';
            } else {
                curso.style.display = 'none';
            }
        });
    });
});

// Seleciona os botões de categoria
const categoriaBtns = document.querySelectorAll('.categoria-btn');


// Container onde serão exibidos os cursos selecionados
const cursosSelecionadosContainer = document.getElementById('cursos-selecionados');

categoriaBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const categoria = btn.getAttribute('data-categoria');

    // Limpa a área de cursos selecionados
    cursosSelecionadosContainer.innerHTML = '';

    // Filtra cursos pela categoria ou pega todos
    let cursosFiltrados = [];
    if (categoria === 'todos') {
      cursosFiltrados = Array.from(cursosRecomendados);
    } else {
      cursosFiltrados = Array.from(cursosRecomendados).filter(curso => curso.dataset.categoria === categoria);
    }

    if (cursosFiltrados.length === 0) {
      cursosSelecionadosContainer.innerHTML = '<p class="text-gray-500">Nenhum curso encontrado para essa categoria.</p>';
      return;
    }

    // Adiciona os cursos filtrados clonados para não remover do original
    cursosFiltrados.forEach(curso => {
      const clone = curso.cloneNode(true);
      cursosSelecionadosContainer.appendChild(clone);
    });
  });
});

const cursos = [
  {
    id: 1,
    titulo: 'Finanças',
    descricaoCurta: 'Aprenda a organizar sua vida financeira com técnicas práticas.',
    descricaoLonga: 'Este curso oferece uma abordagem completa para organização financeira pessoal, planejamento de orçamento, investimentos e gestão de dívidas para garantir sua saúde financeira a longo prazo.',
    imagem: './img/financas.jpeg'
  },
  {
    id: 2,
    titulo: 'Preparatório Militar',
    descricaoCurta: 'Curso completo para quem deseja ingressar nas Forças Armadas.',
    descricaoLonga: 'Preparação detalhada para provas, testes físicos e conhecimentos gerais para ingressar nas Forças Armadas com excelência e confiança.',
    imagem: './img/preparatoriom.jpeg'
  },
  {
    id: 3,
    titulo: 'Pré-vestibular',
    descricaoCurta: 'Reforce os conteúdos para mandar bem no ENEM e vestibulares.',
    descricaoLonga: 'Conteúdos aprofundados de matemática, português, ciências humanas e biológicas focados em garantir a aprovação no ENEM e vestibulares tradicionais.',
    imagem: './img/pre.jpeg'
  },
  {
    id: 4,
    titulo: 'Marketing Digital',
    descricaoCurta: 'Domine estratégias para alavancar seu negócio online.',
    descricaoLonga: 'Aprenda SEO, redes sociais, campanhas pagas, e-mail marketing e outras técnicas para crescer seu negócio digital de forma estratégica.',
    imagem: './img/marketing-digital.jpeg'
  },
  {
    id: 5,
    titulo: 'Design',
    descricaoCurta: 'Fundamentos e práticas para se tornar um designer criativo.',
    descricaoLonga: 'Explore teoria das cores, tipografia, ferramentas digitais e práticas para criar designs modernos e funcionais para web, mobile e impressos.',
    imagem: './img/design.jpeg'
  },
  {
    id: 6,
    titulo: 'Idiomas',
    descricaoCurta: 'Aprenda um novo idioma para ampliar suas oportunidades.',
    descricaoLonga: 'Métodos eficazes para desenvolver habilidades em diferentes idiomas, com foco em conversação, gramática e cultura.',
    imagem: './img/idiomas.jpeg'
  },
  {
    id: 7,
    titulo: 'Programação',
    descricaoCurta: 'Curso introdutório para desenvolvimento de software.',
    descricaoLonga: 'Fundamentos de lógica de programação, algoritmos, linguagens populares e desenvolvimento de projetos práticos para iniciantes.',
    imagem: './img/programacao.jpeg'
  }
];

  const btnExplorar = document.getElementById('btn-explorar');
  const modalExplorar = document.getElementById('modal-explorar');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const listaCursos = document.getElementById('lista-cursos');
  const cursoDetalhes = document.getElementById('curso-detalhes');
  const cursoTitulo = document.getElementById('curso-titulo');
  const cursoDescricao = document.getElementById('curso-descricao');
  const btnSelecionar = document.getElementById('btn-selecionar');
  const btnSair = document.getElementById('btn-sair');
  const containerSelecionados = document.getElementById('cursos-selecionados');
  const cursoImagem = document.getElementById('curso-imagem');
  const cursoDescricaoLonga = document.getElementById('curso-descricao-longa');


  let cursoSelecionado = null;

  btnExplorar.addEventListener('click', () => {
    modalExplorar.classList.remove('hidden');
    cursoDetalhes.classList.add('hidden');
    carregarListaCursos();
  });

  btnFecharModal.addEventListener('click', () => {
    modalExplorar.classList.add('hidden');
    cursoSelecionado = null;
  });

  btnSair.addEventListener('click', () => {
    cursoDetalhes.classList.add('hidden');
    listaCursos.classList.remove('hidden');
    cursoSelecionado = null;
  });

  btnSelecionar.addEventListener('click', () => {
  if (!cursoSelecionado || !cursoSelecionado.id) return;
  adicionarCursoSelecionadoPorId(cursoSelecionado.id);
  modalExplorar.classList.add('hidden');
  cursoSelecionado = null;
});

  function carregarListaCursos() {
    listaCursos.innerHTML = '';
    cursos.forEach(curso => {
      const li = document.createElement('li');
      li.className = 'cursor-pointer p-3 border rounded hover:bg-gray-100';
      li.textContent = curso.titulo;
      li.addEventListener('click', () => mostrarDetalhesCurso(curso));
      listaCursos.appendChild(li);
    });
    listaCursos.classList.remove('hidden');
    cursoDetalhes.classList.add('hidden');
  }

  function mostrarDetalhesCurso(curso) {
  cursoSelecionado = curso;
  cursoTitulo.textContent = curso.titulo;
  cursoDescricao.textContent = curso.descricaoCurta;
  cursoDescricaoLonga.textContent = curso.descricaoLonga;
  cursoImagem.src = curso.imagem;
  cursoImagem.alt = `Imagem do curso ${curso.titulo}`;
  listaCursos.classList.add('hidden');
  cursoDetalhes.classList.remove('hidden');
}

function adicionarCursoSelecionadoPorId(idCurso) {
  const containerSelecionados = document.getElementById('cursos-selecionados');
  const cardOriginal = document.querySelector(`.curso-card[data-id="${idCurso}"]`);

  if (!cardOriginal) {
    console.warn(`Card com ID ${idCurso} não encontrado.`);
    return;
  }

  // Evita duplicação
  if (containerSelecionados.querySelector(`.curso-card[data-id="${idCurso}"]`)) {
    return;
  }

  const cardClonado = cardOriginal.cloneNode(true);

  // Remove o botão "Ver Detalhes" do card clonado
  const botaoDetalhes = cardClonado.querySelector('button');
  if (botaoDetalhes) botaoDetalhes.remove();

  // Cria o botão "Remover"
  const botaoRemover = document.createElement('button');
  botaoRemover.textContent = 'Remover';
  botaoRemover.className = 'w-full px-4 py-2 mt-2 bg-red-600 text-white rounded-lg hover:bg-red-700';
  
  // Adiciona evento para remover o card
  botaoRemover.addEventListener('click', () => {
    cardClonado.remove();
  });

  // Adiciona o botão "Remover" ao final do card clonado
  const containerP = cardClonado.querySelector('.p-4');
  if (containerP) {
    containerP.appendChild(botaoRemover);
  } else {
    cardClonado.appendChild(botaoRemover);
  }

  containerSelecionados.appendChild(cardClonado);
}

document.getElementById('filtro-missoes').addEventListener('change', function() {
    const filtro = this.value.toLowerCase();
    const missoes = document.querySelectorAll('#lista-missoes .missao');

    missoes.forEach(missao => {
        const categoria = missao.getAttribute('data-categoria').toLowerCase();

        if (filtro === 'todas' || filtro === categoria) {
            missao.style.display = 'block';
        } else {
            missao.style.display = 'none';
        }
    });
});

document.getElementById('filtro-metas').addEventListener('change', function() {
    const filtro = this.value.toLowerCase();
    const metas = document.querySelectorAll('#metas .border.border-gray-200');

    metas.forEach(meta => {
        const categoria = meta.getAttribute('data-categoria');

        if (filtro === 'todas' || filtro === categoria) {
            meta.style.display = 'block';
        } else {
            meta.style.display = 'none';
        }
    });
});

document.querySelector('[data-filter="Todas"]').classList.add('active');
const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.card');

    let activeCategory = 'Todas';

    function updateCards() {
        const searchText = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const category = card.querySelector('span[data-category]').getAttribute('data-category');
            const title = card.querySelector('h4').textContent.toLowerCase();

            const matchesCategory = activeCategory === 'Todas' || category === activeCategory;
            const matchesSearch = title.includes(searchText);

            if (matchesCategory && matchesSearch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Filtro por botão de categoria
    filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        activeCategory = button.getAttribute('data-filter');
        updateCards();

        // Atualiza visualmente o botão ativo
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

    // Filtro por texto da busca
    searchInput.addEventListener('input', updateCards);
document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('modalDetalhes');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalConteudo = document.getElementById('modalConteudo');
  const btnFecharModal = document.getElementById('btnFecharModal');

 const detalhesConcursos = {
  "ENEM": {
    inscricoes: "Inscrições abertas no site oficial do INEP. Acompanhe o cronograma para não perder o prazo.",
    linkInscricao: "https://enem.inep.gov.br/",
    linkEditais: "https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enem",
    linkProvas: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
    editalStatus: "Previsto para junho de 2025",
    periodoInscricao: "01/07/2025 a 15/08/2025",
    valorInscricao: "R$ 85,00 (isento para estudantes de baixa renda e outros critérios)",
    nomeConcurso: "Exame Nacional do Ensino Médio (ENEM)",
    descricao: "O ENEM é uma avaliação anual para acesso ao ensino superior, com provas de linguagens, matemática, ciências humanas e naturais.",
    locaisProva: "As provas ocorrem em todo o território nacional, consulte os locais após inscrição.",
    resultado: "Resultados divulgados em janeiro do ano seguinte à prova."
  },
  
  "Marinha Do Brasil": {
    inscricoes: "Inscrições abertas no site oficial da Marinha do Brasil. Verifique o edital específico para sua área de interesse.",
    editalStatus: "Edital disponível para diversos cargos e áreas militares.",
    periodoInscricao: "10/05/2025 a 30/06/2025",
    valorInscricao: "Gratuito",
    nomeConcurso: "Marinha Do Brasil - Concurso Público",
    descricao: "Concursos para diversas áreas militares, incluindo oficiais e praças, com oportunidades em diferentes especialidades.",
    areasMilitares: {
      "Oficial": {
        linkInscricao: "https://www.inscricao.marinha.mil.br/marinha/index_concursos.jsp?id_concurso=487&_gl=1*fmis90*_gcl_au*OTc4NTc2MTQ3LjE3NDc0MDQxNDI.",
        linkEditais: "https://www.inscricao.marinha.mil.br/marinha/Edital%20-%20CPAEN%202025%20002.pdf?id_file=8755",
        linkProvas: "https://www.marinha.mil.br/sspm/escola-naval/en_princ",
        detalhes: "Seleção para oficiais da Marinha, com provas objetivas, testes físicos e avaliação médica.",
        requisitos: "Ensino médio completo, idade entre 18 e 23 anos (varia conforme cargo)."
      },
      "Praças": {
        linkInscricao: "https://www.concursos.marinha.mil.br/",
        linkEditais: "https://www.marinha.mil.br/pracas/editais",
        linkProvas: "https://www.marinha.mil.br/pracas/provas-anteriores",
        detalhes: "Concurso para praças, com diversas especialidades técnicas e operacionais.",
        requisitos: "Ensino médio completo, boa condição física."
      },
      "Corpo de Saúde": {
        linkInscricao: "https://www.concursos.marinha.mil.br/",
        linkEditais: "https://www.marinha.mil.br/corpo-de-saude/editais",
        linkProvas: "https://www.marinha.mil.br/corpo-de-saude/provas-anteriores",
        detalhes: "Concurso para médicos, dentistas, enfermeiros e outros profissionais da saúde.",
        requisitos: "Formação superior específica conforme a área."
      }
    }
  },

  "Exército Brasileiro": {
    inscricoes: "Inscrições disponíveis no site oficial do Exército Brasileiro. Editais atualizados por área.",
    editalStatus: "Editais publicados periodicamente, acompanhe para não perder prazos.",
    periodoInscricao: "Variável conforme o concurso.",
    valorInscricao: "Gratuito ou conforme edital.",
    nomeConcurso: "Exército Brasileiro - Concurso Público",
    descricao: "O Exército oferece concursos para oficiais, praças e áreas técnicas, incluindo ensino superior e técnico.",
    areasMilitares: {
      "Academia Militar das Agulhas Negras (AMAN)": {
        linkInscricao: "https://www.aman.mar.mil.br/",
        linkEditais: "https://www.aman.mar.mil.br/editais",
        linkProvas: "https://www.aman.mar.mil.br/provas-anteriores",
        detalhes: "Seleção para oficiais combatentes, com provas teóricas, físicas e exames de saúde.",
        requisitos: "Ensino médio completo, idade entre 17 e 22 anos."
      },
      "Praças": {
        linkInscricao: "https://www.eb.mil.br/pracas",
        linkEditais: "https://www.eb.mil.br/pracas/editais",
        linkProvas: "https://www.eb.mil.br/pracas/provas-anteriores",
        detalhes: "Concurso para praças com diversas especialidades técnicas.",
        requisitos: "Ensino médio completo."
      }
    }
  },

  "Polícia Militar": {
    inscricoes: "Inscrições via site oficial da Polícia Militar do seu estado. Cada estado tem edital próprio.",
    editalStatus: "Editais variam conforme estado e ano.",
    periodoInscricao: "Conforme edital estadual.",
    valorInscricao: "Geralmente gratuito ou baixo custo.",
    nomeConcurso: "Polícia Militar - Concursos Estaduais",
    descricao: "Concursos para soldados, oficiais e especialistas nas Polícias Militares estaduais.",
    exemplosEstados: {
      "São Paulo": {
        linkInscricao: "https://www.policiamilitar.sp.gov.br/concursos",
        linkEditais: "https://www.policiamilitar.sp.gov.br/concursos/editais",
        linkProvas: "https://www.policiamilitar.sp.gov.br/concursos/provas-anteriores"
      },
      "Rio de Janeiro": {
        linkInscricao: "https://www.policiamilitar.rj.gov.br/concursos",
        linkEditais: "https://www.policiamilitar.rj.gov.br/concursos/editais",
        linkProvas: "https://www.policiamilitar.rj.gov.br/concursos/provas-anteriores"
      }
    }
  }
};



document.querySelectorAll('.card button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      const titulo = card.querySelector('h4').textContent;

      const detalhes = detalhesConcursos[titulo];
      if (detalhes) {
        modalTitulo.textContent = detalhes.nomeConcurso;

        let conteudoHTML = '';

        if (detalhes.descricao) {
          conteudoHTML += `<p>${detalhes.descricao}</p>`;
        }

        conteudoHTML += `
          <p><strong>Inscrições:</strong> ${detalhes.inscricoes}</p>
          <p><strong>Período:</strong> ${detalhes.periodoInscricao}</p>
          <p><strong>Valor da inscrição:</strong> ${detalhes.valorInscricao}</p>
          <p><strong>Status do edital:</strong> ${detalhes.editalStatus}</p>
        `;

        if (detalhes.locaisProva) {
          conteudoHTML += `<p><strong>Locais de prova:</strong> ${detalhes.locaisProva}</p>`;
        }

        if (detalhes.resultado) {
          conteudoHTML += `<p><strong>Resultado:</strong> ${detalhes.resultado}</p>`;
        }

        if (detalhes.linkInscricao) {
          conteudoHTML += `<p><a href="${detalhes.linkInscricao}" target="_blank" class="text-indigo-600 underline">Link para inscrição</a></p>`;
        }
        if (detalhes.linkEditais) {
          conteudoHTML += `<p><a href="${detalhes.linkEditais}" target="_blank" class="text-indigo-600 underline">Editais</a></p>`;
        }
        if (detalhes.linkProvas) {
          conteudoHTML += `<p><a href="${detalhes.linkProvas}" target="_blank" class="text-indigo-600 underline">Provas anteriores</a></p>`;
        }

        if (detalhes.areasMilitares) {
  conteudoHTML += `<section class="military-areas mb-6">
    <h3 class="text-xl font-semibold mb-3">Áreas Militares</h3>`;
  
  for (const [area, info] of Object.entries(detalhes.areasMilitares)) {
    conteudoHTML += `
      <div class="area-militar border border-gray-300 rounded p-4 mb-4">
        <h4 class="font-semibold text-lg mb-2">${area}</h4>
        ${info.detalhes ? `<p class="mb-2">${info.detalhes}</p>` : ''}
        <ul class="list-disc list-inside mb-3">
          ${info.requisitos ? `<li><strong>Requisitos:</strong> ${info.requisitos}</li>` : ''}
          ${info.periodoInscricao ? `<li><strong>Período de inscrição:</strong> ${info.periodoInscricao}</li>` : ''}
          ${info.valorInscricao ? `<li><strong>Valor da inscrição:</strong> ${info.valorInscricao}</li>` : ''}
          ${info.editalStatus ? `<li><strong>Status do edital:</strong> ${info.editalStatus}</li>` : ''}
        </ul>
        <div class="links space-x-4">
          ${info.linkInscricao ? `<a href="${info.linkInscricao}" target="_blank" class="text-indigo-600 underline">Inscrição</a>` : ''}
          ${info.linkEditais ? `<a href="${info.linkEditais}" target="_blank" class="text-indigo-600 underline">Editais</a>` : ''}
          ${info.linkProvas ? `<a href="${info.linkProvas}" target="_blank" class="text-indigo-600 underline">Provas anteriores</a>` : ''}
        </div>
      </div>
    `;
  }

  conteudoHTML += `</section>`;
}

        if (detalhes.exemplosEstados) {
          conteudoHTML += `<h5>Exemplos por Estado:</h5><ul>`;
          for (const [estado, info] of Object.entries(detalhes.exemplosEstados)) {
            conteudoHTML += `<li><strong>${estado}</strong>: `;
            if (info.linkInscricao) {
              conteudoHTML += `<a href="${info.linkInscricao}" target="_blank" class="text-indigo-600 underline">Inscrição</a> | `;
            }
            if (info.linkEditais) {
              conteudoHTML += `<a href="${info.linkEditais}" target="_blank" class="text-indigo-600 underline">Editais</a> | `;
            }
            if (info.linkProvas) {
              conteudoHTML += `<a href="${info.linkProvas}" target="_blank" class="text-indigo-600 underline">Provas anteriores</a>`;
            }
            conteudoHTML += `</li>`;
          }
          conteudoHTML += `</ul>`;
        }

        modalConteudo.innerHTML = conteudoHTML;
        modal.classList.remove('hidden');
      } else {
        modalTitulo.textContent = "Informações não disponíveis";
        modalConteudo.innerHTML = "<p>Detalhes deste concurso ainda não foram cadastrados.</p>";
        modal.classList.remove('hidden');
      }
    });
  });

  // Fechar modal
  btnFecharModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

}); // <-- fechamento correto do DOMContentLoaded

function toggleDropdown() {
  const dropdown = document.getElementById('dropdownMenu');
  dropdown.classList.toggle('hidden');
}

function logout() {
  // lógica de logout aqui
  alert('Logout realizado!');
}

// Fecha o menu ao clicar fora
document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('dropdownMenu');
  const profile = document.getElementById('profileDropdown');
  if (!profile.contains(e.target)) {
      dropdown.classList.add('hidden');
  }
});
const fotoPerfil = document.getElementById("fotoPerfil");
if (dados.photo && dados.photo.trim() !== "") {
  fotoPerfil.src = dados.photo;
} else {
  fotoPerfil.src = "https://via.placeholder.com/100"; // Imagem padrão
}
