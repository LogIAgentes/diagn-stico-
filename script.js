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
            const results = document.getElementById('results');
            if (results) results.classList.add('active');
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
    currentSection = totalSections + 1;
    updateProgress();
}

function downloadReward() {
    console.log('Tentando baixar PDF');
    // Mude esta linha:
    window.open('https://drive.google.com/uc?export=download&id=18UX4I0amlZkebsLvEya_j665Q42bhN6A', '_blank');
}

function submitForm() {
    const leadType = document.getElementById('leadType').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const errorMessage = document.getElementById('errorMessage');

    // Validar nome e email apenas para leads quentes e mornos
    if ((leadType === 'quente' || leadType === 'morno') && (!userName || !userEmail)) {
        if (errorMessage) {
            document.getElementById('results').classList.remove('active'); // Garante que a seção de resultados não está ativa
            document.getElementById('successMessage').style.display = 'none'; // Esconde a mensagem de sucesso
            errorMessage.style.display = 'block'; // Mostra a mensagem de erro
            errorMessage.querySelector('#errorText').textContent = 'Por favor, preencha seu nome e e-mail para continuar.';
            console.log('Erro: Nome ou e-mail não preenchidos');
        }
        return;
    }

    document.getElementById('loadingOverlay').style.display = 'flex'; // Mostra o spinner de carregamento

    // Coletar todos os dados do formulário
    const formData = new FormData();
    formData.append('entry.SEU_ID_CAMPO_LEAD_TYPE', leadType); // Substitua com o ID real do seu campo leadType
    formData.append('entry.SEU_ID_CAMPO_LEAD_SCORE', document.getElementById('leadScore').value); // Substitua com o ID real do seu campo leadScore
    formData.append('entry.SEU_ID_CAMPO_USER_NAME', userName); // Substitua com o ID real do seu campo userName
    formData.append('entry.SEU_ID_CAMPO_USER_EMAIL', userEmail); // Substitua com o ID real do seu campo userEmail

    // Adicionar as respostas das perguntas (q1 a q8)
    // VOCÊ PRECISARÁ ENCONTRAR OS IDS PARA CADA PERGUNTA (entry.SEU_ID_CAMPO_Qx)
    // Exemplo:
    // const q1 = document.querySelector('input[name="q1"]:checked');
    // if (q1) formData.append('entry.SEU_ID_CAMPO_Q1', q1.value);

    // *** IMPORTANTE: Você precisa encontrar os IDs dos campos do Google Forms ***
    // O Google Forms usa IDs como "entry.123456789" para cada campo.
    // Para encontrar esses IDs:
    // 1. Abra seu Google Form (em modo de preenchimento, como se fosse um usuário).
    // 2. Clique com o botão direito no campo que deseja (ex: nome, email, pergunta 1) e selecione "Inspecionar" (ou "Inspecionar Elemento").
    // 3. Procure por um atributo `name` no input que se parece com `name="entry.123456789"`.
    //    O número (ex: 123456789) é o ID que você precisa.
    // Você fará isso para leadType, leadScore, userName, userEmail e todas as suas 8 perguntas (q1 a q8).

    // Exemplo de como ficaria com IDs hipotéticos (SUBSTITUA PELOS SEUS REAIS):
    // formData.append('entry.123456789', leadType); // leadType
    // formData.append('entry.987654321', document.getElementById('leadScore').value); // leadScore
    // formData.append('entry.111222333', userName); // userName
    // formData.append('entry.444555666', userEmail); // userEmail

    // const q1 = document.querySelector('input[name="q1"]:checked');
    // if (q1) formData.append('entry.ID_DO_CAMPO_Q1', q1.value); // Use q1.value para pegar o valor do radio
    // ... repita para q2, q3, etc.
    // Para checkboxes (como q7), você precisará fazer um loop:
    // const q7 = document.querySelectorAll('input[name="q7"]:checked');
    // q7.forEach(checkbox => {
    //     formData.append('entry.ID_DO_CAMPO_Q7', checkbox.value); // O Google Forms pode aceitar múltiplos valores para o mesmo ID para checkboxes
    // });


    fetch('https://docs.google.com/forms/d/e/1FAIpQLSeyIolUOSjvEo_GfgPqbS-X_9J_pwjLrQykVfUZtS-Nc6T7Zg/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Modo no-cors é necessário para enviar para o Google Forms de forma simples
    })
    .then(() => {
        // O Google Forms sempre retorna um sucesso (status 200) mesmo com no-cors,
        // então não podemos verificar response.ok diretamente.
        // Assumimos sucesso se não houver erro de rede.
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active'); // Oculta a seção de resultados se ela estiver ativa
        document.getElementById('successMessage').style.display = 'block'; // Mostra a mensagem de sucesso
        console.log('Formulário enviado com sucesso para o Google Forms!');
    })
    .catch(error => {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active'); // Oculta a seção de resultados
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Não foi possível enviar suas respostas. Tente novamente mais tarde.';
            console.error('Erro ao enviar para o Google Forms:', error);
        }
    });
}

// A função retrySubmit() pode ser mantida como está, mas pode não ser necessária se o envio for bem-sucedido.
// function retrySubmit() {
//     const errorMessage = document.getElementById('errorMessage');
//     if (errorMessage) {
//         errorMessage.style.display = 'none';
//     }
//     const resultsSection = document.getElementById('results');
//     if (resultsSection) {
//         resultsSection.classList.add('active');
//     }
//     console.log('Tentando novamente');
// }

// Inicializar progresso
updateProgress();
