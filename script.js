let currentSection = 1;
const totalSections = 3;

function updateProgress() {
    const progressPercentage = (currentSection / totalSections) * 100;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    document.getElementById('progressText').textContent = `Etapa ${currentSection} de ${totalSections}`;
}

function nextSection() {
    if (currentSection < totalSections + 1) {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        currentSection++;
        if (currentSection <= totalSections) {
            document.getElementById(`section${currentSection}`).classList.add('active');
        } else {
            document.getElementById('results').classList.add('active');
        }
        updateProgress();
    }
}

function prevSection() {
    if (currentSection > 1) {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        currentSection--;
        document.getElementById(`section${currentSection}`).classList.add('active');
        updateProgress();
    }
}

function calculateResults() {
    let score = 0;

    // Pergunta 1
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1) {
        score += parseInt(q1.getAttribute('data-score'));
    }

    // Pergunta 2
    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2) {
        score += parseInt(q2.getAttribute('data-score'));
    }

    // Pergunta 3
    const q3 = document.querySelector('input[name="q3"]:checked');
    if (q3) {
        score += parseInt(q3.getAttribute('data-score'));
    }

    // Pergunta 4
    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4) {
        score += parseInt(q4.getAttribute('data-score'));
    }

    // Pergunta 5
    const q5 = document.querySelector('input[name="q5"]:checked');
    if (q5) {
        score += parseInt(q5.getAttribute('data-score'));
    }

    // Pergunta 6
    const q6 = document.querySelector('input[name="q6"]:checked');
    if (q6) {
        score += parseInt(q6.getAttribute('data-score'));
    }

    // Pergunta 7 (checkboxes)
    const q7 = document.querySelectorAll('input[name="q7"]:checked');
    q7.forEach(checkbox => {
        score += parseInt(checkbox.getAttribute('data-score'));
    });

    // Pergunta 8
    const q8 = document.querySelector('input[name="q8"]:checked');
    if (q8) {
        score += parseInt(q8.getAttribute('data-score'));
    }

    // Determinar tipo de lead
    let leadType = 'frio';
    let leadText = 'Baixo potencial de interesse em IA';
    let leadDescription = 'Suas respostas indicam que sua empresa ainda não está focada em adotar soluções de IA. Continue explorando para descobrir como a IA pode ajudar!';
    if (score >= 4) {
        leadType = 'quente';
        leadText = 'Pronto para usar soluções com IA';
        leadDescription = 'Com base nas suas respostas, identificamos um alto potencial de interesse em soluções de IA. Sua empresa está pronta para explorar oportunidades avançadas!';
    } else if (score >= 2) {
        leadType = 'morno';
        leadText = 'Interesse moderado em IA';
        leadDescription = 'Suas respostas mostram um potencial moderado para adotar IA. Com as soluções certas, sua empresa pode dar o próximo passo!';
    }

    // Preencher campos ocultos
    document.getElementById('leadType').value = leadType;
    document.getElementById('leadScore').value = score;

    // Atualizar seção de resultados
    document.getElementById('leadTypeText').textContent = leadText;
    document.getElementById('resultsText').textContent = leadDescription;

    // Mostrar formulário de contato para leads quentes e mornos
    if (leadType === 'quente' || leadType === 'morno') {
        document.getElementById('contactForm').style.display = 'block';
    } else {
        document.getElementById('contactForm').style.display = 'none';
    }

    // Mostrar seção de resultados
    document.getElementById(`section${currentSection}`).classList.remove('active');
    document.getElementById('results').classList.add('active');
    currentSection = totalSections + 1;
    updateProgress();
}

function downloadReward() {
    // Substitua pelo link real do PDF (hospedado no Google Drive, por exemplo)
    window.open('https://drive.google.com/file/d/18UX4I0amlZkebsLvEya_j665Q42bhN6A/view?usp=drive_link', '_blank');
}

function submitForm() {
    const leadType = document.getElementById('leadType').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;

    // Validar nome e email para leads quentes e mornos
    if ((leadType === 'quente' || leadType === 'morno') && (!userName || !userEmail)) {
        alert('Por favor, preencha seu nome e email para continuar.');
        return;
    }

    document.getElementById('loadingOverlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('leadForm').submit();
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    }, 1000);
}

// Inicializar progresso
updateProgress();
