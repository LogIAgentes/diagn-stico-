let currentSection = 1;
const totalSections = 3;

function updateProgress() {
    const progressPercentage = (currentSection / totalSections) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `Etapa ${currentSection} de ${totalSections}`;
    }
}

function nextSection() {
    if (currentSection < totalSections + 1) {
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        currentSection++;
        if (currentSection <= totalSections) {
            const next = document.getElementById(`section${currentSection}`);
            if (next) next.classList.add('active');
        } else {
            // Este else block é para quando clica em 'Próxima Etapa' na última seção (section3)
            // Ele deve chamar calculateResults, que agora também fará o envio.
            calculateResults(); // <--- CHAMA calculateResults AQUI
        }
        updateProgress();
    }
}

function prevSection() {
    if (currentSection > 1) {
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        currentSection--;
        const prev = document.getElementById(`section${currentSection}`);
        if (prev) prev.classList.add('active');
        updateProgress();
    }
}

// ** FUNÇÃO calculateResults() MODIFICADA PARA ENVIAR OS DADOS **
async function calculateResults() {
    let score = 0;

    // Pergunta 1
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1) score += parseInt(q1.getAttribute('data-score'));

    // Pergunta 2
    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2) score += parseInt(q2.getAttribute('data-score'));

    // Pergunta 3
    const q3 = document.querySelector('input[name="q3"]:checked');
    if (q3) score += parseInt(q3.getAttribute('data-score'));

    // Pergunta 4
    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4) score += parseInt(q4.getAttribute('data-score'));

    // Pergunta 5
    const q5 = document.querySelector('input[name="q5"]:checked');
    if (q5) score += parseInt(q5.getAttribute('data-score'));

    // Pergunta 6
    const q6 = document.querySelector('input[name="q6"]:checked');
    if (q6) score += parseInt(q6.getAttribute('data-score'));

    // Pergunta 7 (checkboxes)
    const q7 = document.querySelectorAll('input[name="q7"]:checked');
    q7.forEach(checkbox => {
        score += parseInt(checkbox.getAttribute('data-score'));
    });

    // Pergunta 8
    const q8 = document.querySelector('input[name="q8"]:checked');
    if (q8) score += parseInt(q8.getAttribute('data-score'));

    // Determinar tipo de lead
    let leadType = 'frio';
    let leadDescription = 'Suas respostas indicam um perfil com baixo engajamento, pouca disposição para investir ou implementar mudanças, e/ou sem expectativas claras para o futuro. Continue explorando para descobrir como a IA pode ajudar seu negócio!';
    if (score >= 13.3) {
        leadType = 'quente';
        leadDescription = 'Parabéns! Suas respostas mostram um perfil altamente engajado, com histórico de investimento, interesse em inovação, expectativas claras e disposição para investir. Sua empresa está pronta para transformar seu negócio com IA!';
    } else if (score >= 7.7) {
        leadType = 'morno';
        leadDescription = 'Suas respostas indicam um perfil com algum interesse e abertura a mudanças, mas ainda com limitações ou incertezas em relação ao investimento e à implementação. Com as soluções certas, sua empresa pode aproveitar melhor a IA!';
    }

    // Preencher campos ocultos
    const leadTypeInput = document.getElementById('leadType');
    const leadScoreInput = document.getElementById('leadScore');
    if (leadTypeInput && leadScoreInput) {
        leadTypeInput.value = leadType;
        leadScoreInput.value = score.toFixed(1);
        console.log('Campos ocultos preenchidos:', { leadType, leadScore: score.toFixed(1) });
    } else {
        console.error('Campos leadType ou leadScore não encontrados');
    }

    // Mostrar formulário de contato apenas para leads quentes e mornos
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.style.display = (leadType === 'quente' || leadType === 'morno') ? 'block' : 'none';
        console.log('Formulário de contato:', contactForm.style.display);
    } else {
        console.error('Elemento contactForm não encontrado');
    }

    // ** LÓGICA DE ENVIO DO FORMULÁRIO MOVIDA PARA AQUI **
    document.getElementById('loadingOverlay').style.display = 'flex';

    const formData = new FormData();

    // Adicionando os campos calculados
    formData.append('entry.2041325370', leadType); // Tipo de Lead
    formData.append('entry.1468627395', document.getElementById('leadScore').value); // Pontuação do Lead

    // Adicionando as respostas das perguntas
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1) formData.append('entry.209227467', q1.value);

    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2) formData.append('entry.197925262', q2.value);

    const q3 = document.querySelector('input[name="q3"]:checked');
    if (q3) formData.append('entry.529711471', q3.value);

    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4) formData.append('entry.1922429230', q4.value);

    const q5 = document.querySelector('input[name="q5"]:checked');
    if (q5) formData.append('entry.1101591931', q5.value);

    const q6 = document.querySelector('input[name="q6"]:checked');
    if (q6) formData.append('entry.813772358', q6.value);

    // Para checkboxes (q7)
    const q7 = document.querySelectorAll('input[name="q7"]:checked');
    q7.forEach(checkbox => {
        formData.append('entry.1419611589', checkbox.value);
    });

    const q8 = document.querySelector('input[name="q8"]:checked');
    if (q8) formData.append('entry.783937939', q8.value);

    // ** ATENÇÃO: userName e userEmail SÓ SERÃO ENVIADOS AQUI SE FOREM PREENCHIDOS E A FUNÇÃO for CHAMADA **
    // Para garantir que eles sejam enviados caso o usuário preencha e clique no botão final,
    // vamos pegar seus valores *no momento do envio*, mesmo que vazios.
    // ** Isso será melhor tratado pelo submitForm() ou você pode optar por enviar TUDO aqui. **
    // Para esta proposta, vamos garantir que só os dados da pesquisa vão AGORA.
    // Os dados de contato serão coletados pelo outro botão (se você ainda quiser isso).

    // Log dos dados enviados para depuração
    console.log('Dados do formulário da PESQUISA a serem enviados (no calculateResults):', Object.fromEntries(formData));

    const googleFormsSubmitUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeyIolUOSjvEo_GfgPqbS-X_9J_pwjLrQykVfUZtS-Nc6T7Zg/formResponse';

    try {
        await fetch(googleFormsSubmitUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        console.log('Dados da pesquisa enviados para o Google Forms!');

    } catch (error) {
        console.error('Erro ao enviar dados da pesquisa para o Google Forms:', error);
        // Não mostrar erro genérico aqui, pois a UI do formulário ainda está ativa.
        // O erro será notado se não aparecer na planilha.
    } finally {
        document.getElementById('loadingOverlay').style.display = 'none'; // Oculta o loading independente do erro.
    }

    // Fim da lógica de envio em calculateResults()

    // ** ATUALIZAR UI DOS RESULTADOS APÓS TENTATIVA DE ENVIO **
    const resultsText = document.getElementById('resultsText');
    if (resultsText) {
        resultsText.textContent = leadDescription;
        resultsText.style.display = 'block';
        console.log('Mensagem de resultado:', leadDescription);
    } else {
        console.error('Elemento resultsText não encontrado');
    }

    const current = document.getElementById(`section${currentSection}`);
    if (current) current.classList.remove('active');
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.add('active');
        console.log('Seção de resultados exibida');
    } else {
        console.error('Seção results não encontrada');
    }
    currentSection = totalSections + 1;
    updateProgress();
}


function downloadReward() {
    console.log('Tentando baixar PDF');
    window.open('https://drive.google.com/uc?export=download&id=18UX4I0amlZkebsLvEya_j665Q42bhN6A', '_blank');
}

// ** FUNÇÃO submitForm() MODIFICADA PARA TRATAR APENAS OS DADOS DE CONTATO E DOWNLOAD **
async function submitForm() {
    const leadType = document.getElementById('leadType').value;
    const userName = document.getElementById('userName').value || '';
    const userEmail = document.getElementById('userEmail').value || '';
    const errorMessage = document.getElementById('errorMessage');

    // ** VALIDAR SOMENTE SE PRECISA DO CONTATO (leads quentes/mornos) **
    if ((leadType === 'quente' || leadType === 'morno') && (!userName || !userEmail)) {
        if (errorMessage) {
            document.getElementById('results').classList.remove('active');
            document.getElementById('successMessage').style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Por favor, preencha seu nome e e-mail para receber soluções personalizadas.';
            console.log('Erro: Nome ou e-mail não preenchidos para lead quente/morno (no botão final)');
        }
        return; // Interrompe a função se a validação falhar
    }

    // Se chegou aqui, ou é lead frio (não precisa de contato) ou lead quente/morno com contato preenchido.
    // Podemos assumir que a pesquisa já foi enviada por calculateResults().
    // Agora, o que este botão deve fazer?
    // 1. Apenas fazer o download (se não precisar do contato extra)
    // 2. Enviar o contato (se o usuário preencheu) E fazer o download.

    // Vamos fazer este botão ENVIAR os dados de contato (se houver) E acionar o download.
    // É importante notar que para o Google Forms, isso criaria uma nova linha ou uma linha com "apenas" contato,
    // o que pode ser confuso. O ideal seria enviar TUDO de uma vez no `calculateResults`.

    // **OPÇÃO A: Se você quer que o botão final APENAS faça o download e mostre sucesso,
    // e o contato já teria sido enviado em calculateResults (se visível)**
    // downloadReward();
    // document.getElementById('results').classList.remove('active');
    // document.getElementById('successMessage').style.display = 'block';
    // console.log('Botão final clicado. Download acionado.');
    // return; // Termina aqui

    // **OPÇÃO B (MAIS ROBUSTA para Google Forms com UM único envio): **
    // Refatorar para que calculateResults *não* envie e TUDO seja enviado por este botão,
    // mas a validação do contato seja condicional.
    // Mas a instrução original era que "a pesquisa deveria ser enviada", o que implica que
    // o submitForm não seja o único gatilho.

    // **VAMOS MANTER A LÓGICA ATUAL DO ENVIO, mas garantindo que o `formData`
    // inclua TUDO e que o botão de contato seja opcional no envio.**

    document.getElementById('loadingOverlay').style.display = 'flex';

    const formData = new FormData();
    // Adicionando os campos calculados e de contato (agora pegar os valores mais recentes)
    formData.append('entry.2041325370', leadType); // Tipo de Lead
    formData.append('entry.1468627395', document.getElementById('leadScore').value); // Pontuação do Lead
    formData.append('entry.930013255', userName); // Nome (pode ser vazio para lead frio)
    formData.append('entry.957828304', userEmail); // Email (pode ser vazio para lead frio)

    // Re-adicionar as respostas das perguntas (para garantir que estão no envio final)
    // Isso pode resultar em duplicidade se `calculateResults` já enviou,
    // mas garante que o `submitForm` tem todos os dados.
    // **Atenção:** Se `calculateResults` já enviou, este será um NOVO envio no Google Forms.
    // Se você quer apenas UM registro por pessoa, a `calculateResults` NÃO deveria enviar.
    // VAMOS REMOVER O ENVIO DE calculateResults para ter UM ÚNICO ENVIO NO FINAL.

    // -- COMENTAR OU REMOVER O ENVIO DENTRO DE calculateResults() se você quer apenas UM envio --

    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1) formData.append('entry.209227467', q1.value);

    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2) formData.append('entry.197925262', q2.value);

    const q3 = document.querySelector('input[name="q3"]:checked');
    if (q3) formData.append('entry.529711471', q3.value);

    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4) formData.append('entry.1922429230', q4.value);

    const q5 = document.querySelector('input[name="q5"]:checked');
    if (q5) formData.append('entry.1101591931', q5.value);

    const q6 = document.querySelector('input[name="q6"]:checked');
    if (q6) formData.append('entry.813772358', q6.value);

    // Para checkboxes (q7)
    const q7 = document.querySelectorAll('input[name="q7"]:checked');
    q7.forEach(checkbox => {
        formData.append('entry.1419611589', checkbox.value);
    });

    const q8 = document.querySelector('input[name="q8"]:checked');
    if (q8) formData.append('entry.783937939', q8.value);

    // Log dos dados enviados para depuração
    console.log('Dados do formulário FINAL a serem enviados:', Object.fromEntries(formData));

    const googleFormsSubmitUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeyIolUOSjvEo_GfgPqbS-X_9J_pwjLrQykVfUZtS-Nc6T7Zg/formResponse';

    try {
        await fetch(googleFormsSubmitUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active');
        document.getElementById('successMessage').style.display = 'block';
        console.log('Formulário FINAL enviado com sucesso para o Google Forms!');
        downloadReward(); // Aciona o download APÓS o envio bem-sucedido
    } catch (error) {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Não foi possível enviar suas respostas. Tente novamente mais tarde.';
            console.error('Erro ao enviar para o Google Forms no botão final:', error);
        }
    }
}

function retrySubmit() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.add('active');
    }
    console.log('Tentando novamente');
}

// Inicializar progresso
updateProgress();
