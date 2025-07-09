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

    // Validar nome e email para leads quentes e mornos
    if ((leadType === 'quente' || leadType === 'morno') && (!userName || !userEmail)) {
        if (errorMessage) {
            document.getElementById('results').classList.remove('active');
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Por favor, preencha seu nome e email para continuar.';
            console.log('Erro: Nome ou email não preenchidos');
        }
        return;
    }

    // Mock de envio local
    const isLocal = window.location.protocol === 'file:';
    if (isLocal) {
        console.log('Ambiente local detectado. Simulando envio do formulário.');
        document.getElementById('loadingOverlay').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
            document.getElementById('results').classList.remove('active');
            document.getElementById('successMessage').style.display = 'block';
            console.log('Simulação de envio bem-sucedida');
        }, 1000);
        return;
    }

    // Envio real para Netlify
    document.getElementById('loadingOverlay').style.display = 'flex';
    const form = document.getElementById('leadForm');
    const formData = new FormData(form);

    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('loadingOverlay').style.display = 'none';
            document.getElementById('results').classList.remove('active');
            document.getElementById('successMessage').style.display = 'block';
            console.log('Formulário enviado com sucesso');
        } else {
            throw new Error('Erro ao enviar o formulário');
        }
    })
    .catch(error => {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Não foi possível enviar suas respostas. Tente novamente mais tarde.';
            console.log('Erro no envio:', error);
        }
    });
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
