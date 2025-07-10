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

// ** FUNÇÃO nextSection() CORRIGIDA **
function nextSection() {
    // **VALIDAÇÃO: Verificar se as respostas da seção atual foram selecionadas antes de avançar**
    const currentSectionElement = document.getElementById(`section${currentSection}`);
    let allQuestionsAnswered = true;

    if (currentSectionElement) {
        // Encontrar todas as perguntas nesta seção
        const questionsInCurrentSection = currentSectionElement.querySelectorAll('.question-block'); // Assumindo que cada pergunta está dentro de um div/bloco com essa classe
        
        questionsInCurrentSection.forEach(questionBlock => {
            const questionName = questionBlock.querySelector('input[type="radio"], input[type="checkbox"]').name;
            if (questionName) {
                // Verificar se alguma opção foi selecionada para esta pergunta
                const answered = document.querySelector(`input[name="${questionName}"]:checked`);
                if (!answered) {
                    allQuestionsAnswered = false;
                    // Opcional: Adicionar feedback visual aqui, como mudar a borda da pergunta não respondida
                    console.log(`Pergunta ${questionName} não respondida na seção ${currentSection}`);
                }
            }
        });
    }

    if (!allQuestionsAnswered) {
        alert('Por favor, responda a todas as perguntas para continuar.');
        return; // Impede o avanço se nem todas as perguntas foram respondidas
    }
    // Fim da validação

    if (currentSection < totalSections) { // Altera a condição para ir até a penúltima seção
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        currentSection++;
        const next = document.getElementById(`section${currentSection}`);
        if (next) next.classList.add('active');
        updateProgress();
    } else if (currentSection === totalSections) { // Na última seção de perguntas, chama calculateResults
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        
        // Chamada para calculateResults (que agora exibe a seção de resultados)
        calculateResults(); 
        
        // A section de resultados já é ativada dentro de calculateResults
        // Não é necessário currentSection++ aqui, pois calculateResults já define a seção final
    }
}


function prevSection() {
    if (currentSection > 1 && currentSection <= totalSections + 1) { // Garante que não volte da tela de sucesso
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        
        // Se estiver na tela de resultados, volte para a última seção de perguntas (totalSections)
        if (currentSection === totalSections + 1) {
             currentSection = totalSections;
        } else {
             currentSection--;
        }
        
        const prev = document.getElementById(`section${currentSection}`);
        if (prev) prev.classList.add('active');
        updateProgress();
    }
}

// ** FUNÇÃO calculateResults() REAJUSTADA **
// Agora ela apenas calcula, determina o lead, preenche os campos ocultos,
// atualiza o texto de resultados e mostra/oculta o formulário de contato.
// O envio REAL para o Google Forms fica apenas no `submitForm()`.
function calculateResults() {
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

    // Atualizar seção de resultados
    const resultsText = document.getElementById('resultsText');
    if (resultsText) {
        resultsText.textContent = leadDescription;
        resultsText.style.display = 'block';
        console.log('Mensagem de resultado:', leadDescription);
    } else {
        console.error('Elemento resultsText não encontrado');
    }

    // Mostrar formulário de contato apenas para leads quentes e mornos
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.style.display = (leadType === 'quente' || leadType === 'morno') ? 'block' : 'none';
        console.log('Formulário de contato:', contactForm.style.display);
    } else {
        console.error('Elemento contactForm não encontrado');
    }

    // Mostrar seção de resultados
    const current = document.getElementById(`section${currentSection}`);
    if (current) current.classList.remove('active');
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.add('active');
        console.log('Seção de resultados exibida');
    } else {
        console.error('Seção results não encontrada');
    }
    currentSection = totalSections + 1; // Define a seção atual para a tela de resultados
    updateProgress();
}

function downloadReward() {
    console.log('Tentando baixar PDF');
    window.open('https://drive.google.com/uc?export=download&id=18UX4I0amlZkebsLvEya_j665Q42bhN6A', '_blank');
}

// ** FUNÇÃO submitForm() (FINAL DO FORMULÁRIO) - RESPONSÁVEL POR ENVIAR TUDO **
async function submitForm() {
    const leadType = document.getElementById('leadType').value;
    const userName = document.getElementById('userName').value || '';
    const userEmail = document.getElementById('userEmail').value || '';
    const errorMessage = document.getElementById('errorMessage');

    // Validar nome e email apenas para leads quentes e mornos
    if ((leadType === 'quente' || leadType === 'morno') && (!userName || !userEmail)) {
        if (errorMessage) {
            document.getElementById('results').classList.remove('active'); // Oculta a seção de resultados temporariamente
            document.getElementById('successMessage').style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Por favor, preencha seu nome e e-mail para receber soluções personalizadas.';
            console.log('Erro: Nome ou e-mail não preenchidos para lead quente/morno');
        }
        return; // Interrompe a função se a validação falhar
    }

    document.getElementById('loadingOverlay').style.display = 'flex';

    const formData = new FormData();
    // Adicionando os campos calculados e de contato
    formData.append('entry.2041325370', leadType); // Tipo de Lead
    formData.append('entry.1468627395', document.getElementById('leadScore').value); // Pontuação do Lead
    formData.append('entry.930013255', userName); // Nome
    formData.append('entry.957828304', userEmail); // Email

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
        resultsSection.classList.add('active'); // Garante que a tela de resultados volte a ser ativa
    }
    console.log('Tentando novamente');
}

// Inicializar progresso
updateProgress();
