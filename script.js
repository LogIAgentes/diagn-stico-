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
    const currentSectionElement = document.getElementById(`section${currentSection}`);
    let allQuestionsAnswered = true;

    if (currentSectionElement) {
        const questionGroups = currentSectionElement.querySelectorAll('.question-group');
        questionGroups.forEach(group => {
            const inputs = group.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            const name = inputs[0]?.name;
            if (name) {
                const answered = document.querySelector(`input[name="${name}"]:checked`);
                if (!answered) allQuestionsAnswered = false;
            }
        });
    }

    if (!allQuestionsAnswered) {
        alert('Por favor, responda a todas as perguntas para continuar.');
        return;
    }

    if (currentSection < totalSections) {
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        currentSection++;
        const next = document.getElementById(`section${currentSection}`);
        if (next) next.classList.add('active');
        updateProgress();
    } else if (currentSection === totalSections) {
        calculateResults();
    }
}

function prevSection() {
    if (currentSection > 1 && currentSection <= totalSections + 1) {
        const current = document.getElementById(`section${currentSection}`);
        if (current) current.classList.remove('active');
        currentSection = currentSection === totalSections + 1 ? totalSections : currentSection - 1;
        const prev = document.getElementById(`section${currentSection}`);
        if (prev) prev.classList.add('active');
        updateProgress();
    }
}

async function calculateResults() {
    let score = 0;

    // Collect answers and calculate score
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1) score += parseInt(q1.getAttribute('data-score'));

    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2) score += parseInt(q2.getAttribute('data-score'));

    const q3 = document.querySelector('input[name="q3"]:checked');
    if (q3) score += parseInt(q3.getAttribute('data-score'));

    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4) score += parseInt(q4.getAttribute('data-score'));

    const q5 = document.querySelector('input[name="q5"]:checked');
    if (q5) score += parseInt(q5.getAttribute('data-score'));

    const q6 = document.querySelector('input[name="q6"]:checked');
    if (q6) score += parseInt(q6.getAttribute('data-score'));

    const q7 = document.querySelectorAll('input[name="q7"]:checked');
    q7.forEach(checkbox => {
        score += parseInt(checkbox.getAttribute('data-score'));
    });

    const q8 = document.querySelector('input[name="q8"]:checked');
    if (q8) score += parseInt(q8.getAttribute('data-score'));

    // Determine lead type
    let leadType = 'frio';
    let leadDescription = 'Suas respostas indicam um perfil com baixo engajamento, pouca disposição para investir ou implementar mudanças, e/ou sem expectativas claras para o futuro. Continue explorando para descobrir como a IA pode ajudar seu negócio!';
    if (score >= 13.3) {
        leadType = 'quente';
        leadDescription = 'Parabéns! Suas respostas mostram um perfil altamente engajado, com histórico de investimento, interesse em inovação, expectativas claras e disposição para investir. Sua empresa está pronta para transformar seu negócio com IA!';
    } else if (score >= 7.7) {
        leadType = 'morno';
        leadDescription = 'Suas respostas indicam um perfil com algum interesse e abertura a mudanças, mas ainda com limitações ou incertezas em relação ao investimento e à implementação. Com as soluções certas, sua empresa pode aproveitar melhor a IA!';
    }

    // Store lead type and score
    const leadTypeInput = document.getElementById('leadType');
    const leadScoreInput = document.getElementById('leadScore');
    if (leadTypeInput && leadScoreInput) {
        leadTypeInput.value = leadType;
        leadScoreInput.value = score.toFixed(1);
    }

    // Submit survey answers to Google Sheet
    const formData = new FormData();
    formData.append('entry.2041325370', leadType);
    formData.append('entry.1468627395', score.toFixed(1));
    if (q1) formData.append('entry.209227467', q1.value);
    if (q2) formData.append('entry.197925262', q2.value);
    if (q3) formData.append('entry.529711471', q3.value);
    if (q4) formData.append('entry.1922429230', q4.value);
    if (q5) formData.append('entry.1101591931', q5.value);
    if (q6) formData.append('entry.813772358', q6.value);
    q7.forEach(checkbox => formData.append('entry.1419611589', checkbox.value));
    if (q8) formData.append('entry.783937939', q8.value);

    const googleFormsSubmitUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeyIolUOSjvEo_GfgPqbS-X_9J_pwjLrQykVfUZtS-Nc6T7Zg/formResponse';
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        await fetch(googleFormsSubmitUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        console.log('Survey answers submitted to Google Forms');
    } catch (error) {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active');
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Erro ao enviar respostas do diagnóstico. Tente novamente.';
        }
        console.error('Error submitting survey:', error);
        return;
    }

    // Update results UI
    const resultsText = document.getElementById('resultsText');
    if (resultsText) {
        resultsText.textContent = leadDescription;
        resultsText.style.display = 'block';
    }

    // Show contact form only for warm/hot leads
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.style.display = (leadType === 'quente' || leadType === 'morno') ? 'block' : 'none';
    }

    // Show results section
    document.getElementById('loadingOverlay').style.display = 'none';
    const current = document.getElementById(`section${currentSection}`);
    if (current) current.classList.remove('active');
    const resultsSection = document.getElementById('results');
    if (resultsSection) resultsSection.classList.add('active');
    currentSection = totalSections + 1;
    updateProgress();

    // Trigger PDF download for all leads
    downloadReward();
}

function downloadReward() {
    console.log('Downloading PDF');
    window.open('https://drive.google.com/uc?export=download&id=18UX4I0amlZkebsLvEya_j665Q42bhN6A', '_blank');
}

async function submitContactForm() {
    const leadType = document.getElementById('leadType').value;
    const userName = document.getElementById('userName').value || '';
    const userEmail = document.getElementById('userEmail').value || '';
    const errorMessage = document.getElementById('errorMessage');

    if (leadType === 'quente' || leadType === 'morno') {
        if (!userName || !userEmail) {
            document.getElementById('results').classList.remove('active');
            document.getElementById('successMessage').style.display = 'none';
            if (errorMessage) {
                errorMessage.style.display = 'block';
                errorMessage.querySelector('#errorText').textContent = 'Por favor, preencha seu nome e e-mail para receber soluções personalizadas.';
            }
            return;
        }
    } else {
        // For cold leads, no contact form submission is needed
        document.getElementById('results').classList.remove('active');
        document.getElementById('successMessage').style.display = 'block';
        return;
    }

    document.getElementById('loadingOverlay').style.display = 'flex';
    const formData = new FormData();
    formData.append('entry.2041325370', leadType);
    formData.append('entry.1468627395', document.getElementById('leadScore').value);
    formData.append('entry.930013255', userName);
    formData.append('entry.957828304', userEmail);

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
        console.log('Contact info submitted to Google Forms');
    } catch (error) {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('results').classList.remove('active');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.querySelector('#errorText').textContent = 'Erro ao enviar seus dados de contato. Tente novamente.';
        }
        console.error('Error submitting contact info:', error);
    }
}

function retrySubmit() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) errorMessage.style.display = 'none';
    const resultsSection = document.getElementById('results');
    if (resultsSection) resultsSection.classList.add('active');
    console.log('Retrying submission');
}

// Initialize progress
updateProgress();
