// Estado global da aplicação
let currentSection = 1;
let leadScore = 0;
let leadType = '';
let formResponses = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    setupFormValidation();
});

// Navegação entre seções
function nextSection() {
    if (!validateCurrentSection()) {
        showValidationError();
        return;
    }
    
    saveCurrentSectionData();
    
    if (currentSection < 3) {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        currentSection++;
        document.getElementById(`section${currentSection}`).classList.add('active');
        updateProgressBar();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevSection() {
    if (currentSection > 1) {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        currentSection--;
        document.getElementById(`section${currentSection}`).classList.add('active');
        updateProgressBar();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Atualização da barra de progresso
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progressPercentage = (currentSection / 3) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `Etapa ${currentSection} de 3`;
}

// Validação da seção atual
function validateCurrentSection() {
    const currentSectionElement = document.getElementById(`section${currentSection}`);
    const radioGroups = currentSectionElement.querySelectorAll('input[type="radio"]');
    const radioNames = new Set();
    
    // Coletar nomes únicos dos grupos de radio
    radioGroups.forEach(radio => {
        radioNames.add(radio.name);
    });
    
    // Verificar se cada grupo tem uma seleção
    for (let name of radioNames) {
        const checkedRadio = currentSectionElement.querySelector(`input[name="${name}"]:checked`);
        if (!checkedRadio) {
            return false;
        }
    }
    
    return true;
}

// Salvar dados da seção atual
function saveCurrentSectionData() {
    const currentSectionElement = document.getElementById(`section${currentSection}`);
    const inputs = currentSectionElement.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
    
    inputs.forEach(input => {
        if (input.type === 'radio') {
            formResponses[input.name] = input.value;
        } else if (input.type === 'checkbox') {
            if (!formResponses[input.name]) {
                formResponses[input.name] = [];
            }
            formResponses[input.name].push(input.value);
        }
    });
}

// Mostrar erro de validação
function showValidationError() {
    // Criar ou atualizar mensagem de erro
    let errorMessage = document.getElementById('validationError');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'validationError';
        errorMessage.style.cssText = `
            background: #fed7d7;
            color: #c53030;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-weight: 600;
            border: 1px solid #feb2b2;
        `;
        errorMessage.textContent = 'Por favor, responda todas as perguntas antes de continuar.';
        
        const navigationButtons = document.querySelector(`#section${currentSection} .navigation-buttons`);
        navigationButtons.parentNode.insertBefore(errorMessage, navigationButtons);
    }
    
    // Remover mensagem após 5 segundos
    setTimeout(() => {
        if (errorMessage && errorMessage.parentNode) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
    }, 5000);
    
    // Scroll para a mensagem de erro
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Calcular resultados e mostrar seção de resultados
function calculateResults() {
    if (!validateCurrentSection()) {
        showValidationError();
        return;
    }
    
    saveCurrentSectionData();
    calculateLeadScore();
    classifyLead();
    showResults();
}

// Calcular pontuação do lead
function calculateLeadScore() {
    leadScore = 0;
    
    // Processar respostas de radio buttons
    Object.keys(formResponses).forEach(questionName => {
        if (questionName !== 'q7') { // q7 é checkbox, processado separadamente
            const response = formResponses[questionName];
            const input = document.querySelector(`input[name="${questionName}"][value="${response}"]`);
            if (input) {
                const score = parseInt(input.getAttribute('data-score')) || 0;
                leadScore += score;
            }
        }
    });
    
    // Processar checkboxes da pergunta 7
    if (formResponses.q7 && Array.isArray(formResponses.q7)) {
        formResponses.q7.forEach(value => {
            const input = document.querySelector(`input[name="q7"][value="${value}"]`);
            if (input) {
                const score = parseInt(input.getAttribute('data-score')) || 0;
                leadScore += score;
            }
        });
    }
    
    console.log('Lead Score calculado:', leadScore);
    console.log('Respostas:', formResponses);
}

// Classificar lead baseado na pontuação
function classifyLead() {
    if (leadScore >= 4) {
        leadType = 'quente';
    } else if (leadScore >= 2) {
        leadType = 'morno';
    } else {
        leadType = 'frio';
    }
    
    console.log('Tipo de lead:', leadType);
}

// Mostrar seção de resultados
function showResults() {
    // Esconder seção atual
    document.getElementById(`section${currentSection}`).classList.remove('active');
    
    // Mostrar seção de resultados
    const resultsSection = document.getElementById('results');
    resultsSection.classList.add('active');
    
    // Atualizar conteúdo dos resultados
    updateResultsContent();
    
    // Atualizar barra de progresso para 100%
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    progressFill.style.width = '100%';
    progressText.textContent = 'Diagnóstico Concluído';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Atualizar conteúdo da seção de resultados
function updateResultsContent() {
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsBadge = document.getElementById('resultsBadge');
    const leadTypeText = document.getElementById('leadTypeText');
    const resultsDescription = document.getElementById('resultsDescription');
    const contactForm = document.getElementById('contactForm');
    
    // Configurar badge
    resultsBadge.className = `results-badge ${leadType}`;
    
    // Configurar conteúdo baseado no tipo de lead
    switch (leadType) {
        case 'quente':
            leadTypeText.textContent = 'Pronto Para Usar Soluções Com IA 🔥';
            resultsDescription.innerHTML = `
                <p><strong>Excelente!</strong> Suas respostas indicam um alto potencial de interesse e investimento em soluções de IA. Você está no caminho certo para transformar seu negócio com inteligência artificial.</p>
                <p>Pontuação: ${leadScore} pontos</p>
            `;
            contactForm.style.display = 'block';
            break;
            
        case 'morno':
            leadTypeText.textContent = 'Potencial Para Usar Soluções Com IA 🌡️';
            resultsDescription.innerHTML = `
                <p><strong>Muito bom!</strong> Você demonstra interesse em IA e há oportunidades claras para implementação. Com o direcionamento certo, sua empresa pode se beneficiar significativamente da inteligência artificial.</p>
                <p>Pontuação: ${leadScore} pontos</p>
            `;
            contactForm.style.display = 'block';
            break;
            
        case 'frio':
            leadTypeText.textContent = 'Potencial Futuro ❄️';
            resultsDescription.innerHTML = `
                <p>Suas respostas indicam que sua empresa ainda está nos estágios iniciais de adoção de IA. Não há problema! Todos começam em algum lugar, e nossa biblioteca de prompts pode ser um ótimo primeiro passo.</p>
                <p>Pontuação: ${leadScore} pontos</p>
            `;
            contactForm.style.display = 'none';
            break;
    }
}

// Download da recompensa
function downloadReward() {
    // Criar link temporário para download
    const link = document.createElement('a');
    link.href = '/recompensa/biblioteca_prompts_ia.pdf';
    link.download = 'Biblioteca-de-Prompts-de-IA-para-Negocios.pdf';
    link.target = '_blank';
    
    // Simular clique
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Feedback visual
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = `
        <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        Download Iniciado!
    `;
    
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 3000);
}

// Submissão do formulário
async function submitForm() {
    showLoadingOverlay();
    
    try {
        // Coletar dados de contato se fornecidos
        const userName = document.getElementById('userName')?.value || '';
        const userEmail = document.getElementById('userEmail')?.value || '';
        
        // Preparar dados para envio
        const submissionData = {
            timestamp: new Date().toISOString(),
            leadType: leadType,
            leadScore: leadScore,
            userName: userName,
            userEmail: userEmail,
            responses: formResponses
        };
        
        console.log('Dados para submissão:', submissionData);
        
        // Simular envio para Google Sheets (será implementado na próxima fase)
        await simulateApiCall(submissionData);
        
        // Salvar localmente também
        await saveToLocalLog(submissionData);
        
        hideLoadingOverlay();
        showSuccessMessage();
        
    } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        hideLoadingOverlay();
        showErrorMessage('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
    }
}

// Simular chamada de API
async function simulateApiCall(data) {
    try {
        const response = await fetch('/api/leads/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Resposta da API:', result);
        
        if (result.warning) {
            console.warn(result.warning);
        }
        
        return result;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// Salvar no log local
async function saveToLocalLog(data) {
    try {
        // Em um ambiente real, isso seria feito no backend
        console.log('Salvando no log local:', data);
        
        // Simular salvamento
        const logEntry = {
            id: Date.now(),
            ...data
        };
        
        // Armazenar no localStorage como backup
        const existingLogs = JSON.parse(localStorage.getItem('leadLogs') || '[]');
        existingLogs.push(logEntry);
        localStorage.setItem('leadLogs', JSON.stringify(existingLogs));
        
    } catch (error) {
        console.error('Erro ao salvar no log local:', error);
    }
}

// Mostrar overlay de carregamento
function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Esconder overlay de carregamento
function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Mostrar mensagem de sucesso
function showSuccessMessage() {
    document.getElementById('successMessage').style.display = 'flex';
    
    // Esconder após 5 segundos
    setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
    alert(message); // Implementação simples, pode ser melhorada
}

// Configurar validação do formulário
function setupFormValidation() {
    // Adicionar listeners para inputs
    const form = document.getElementById('leadForm');
    
    // Validação em tempo real para campos de contato
    const emailInput = document.getElementById('userEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
}

// Validar email
function validateEmail(email) {
    if (!email) return true; // Campo opcional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    const emailInput = document.getElementById('userEmail');
    if (isValid) {
        emailInput.style.borderColor = '#48bb78';
    } else {
        emailInput.style.borderColor = '#f56565';
    }
    
    return isValid;
}

// Função para resetar o formulário (útil para testes)
function resetForm() {
    currentSection = 1;
    leadScore = 0;
    leadType = '';
    formResponses = {};
    
    // Esconder todas as seções
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar primeira seção
    document.getElementById('section1').classList.add('active');
    
    // Resetar formulário
    document.getElementById('leadForm').reset();
    
    // Resetar barra de progresso
    updateProgressBar();
}

// Exportar funções para uso global
window.nextSection = nextSection;
window.prevSection = prevSection;
window.calculateResults = calculateResults;
window.downloadReward = downloadReward;
window.submitForm = submitForm;
window.resetForm = resetForm;

