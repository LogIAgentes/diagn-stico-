# Formulário de Qualificação de Leads - Diagnóstico de IA

## Visão Geral

Este projeto implementa um formulário web responsivo para qualificação de leads baseado em um diagnóstico sobre o uso de Inteligência Artificial em empresas. O sistema classifica automaticamente os leads em três categorias (quente, morno, frio) com base nas respostas fornecidas e oferece uma recompensa em PDF.

## Funcionalidades Principais

### 🎯 Qualificação Inteligente de Leads
- **Sistema de pontuação automático**: Cada resposta possui uma pontuação específica
- **Classificação em tempo real**: Leads são categorizados como quente (≥4 pontos), morno (≥2 pontos) ou frio (<2 pontos)
- **Lógica condicional**: Coleta de contato apenas para leads quentes e mornos

### 📱 Interface Responsiva
- **Design moderno**: Interface clean com gradientes e microinterações
- **Navegação por etapas**: Formulário dividido em 3 blocos temáticos
- **Barra de progresso**: Feedback visual do progresso do usuário
- **Compatibilidade mobile**: Totalmente responsivo para todos os dispositivos

### 🎁 Sistema de Recompensas
- **PDF gratuito**: Biblioteca de Prompts de IA para Negócios
- **Download automático**: Link direto para download após conclusão
- **Valor agregado**: Conteúdo exclusivo como incentivo à participação

### 📊 Integração e Armazenamento
- **Google Sheets API**: Integração preparada para salvamento automático
- **Log local**: Backup das respostas em arquivo JSON
- **API REST**: Endpoints para submissão e consulta de dados

## Estrutura do Projeto

```
web_form/
├── backend/                    # Aplicação Flask
│   ├── src/
│   │   ├── static/            # Frontend (HTML, CSS, JS)
│   │   ├── routes/            # Rotas da API
│   │   │   ├── leads.py       # Endpoints para leads
│   │   │   └── user.py        # Endpoints de usuário
│   │   ├── models/            # Modelos de dados
│   │   ├── database/          # Banco SQLite
│   │   └── main.py           # Aplicação principal
│   ├── venv/                  # Ambiente virtual Python
│   └── requirements.txt       # Dependências
├── logs/                      # Logs de respostas
└── public/                    # Arquivos originais do frontend
```

## Lógica de Pontuação

### Bloco 1: Diagnóstico Atual
1. **Investimento em treinamentos (últimos 24 meses)**
   - Sim, mais de uma vez: +1 ponto
   - Sim, uma vez: +1 ponto
   - Não, mas planejando: +2 pontos
   - Não, sem planos: 0 pontos
   - Não sei: +1 ponto

2. **Implementação de IA (últimos 12 meses)**
   - Sim, com sucesso: +2 pontos
   - Sim, com dificuldades: +1 ponto
   - Não, mas tem interesse: +2 pontos
   - Não, sem interesse: 0 pontos
   - Não sei informar: +1 ponto

3. **Frequência de treinamentos**
   - Sempre: +2 pontos
   - Frequentemente: +1 ponto
   - Às vezes: +1 ponto
   - Raramente/Nunca: 0 pontos

4. **Aplicação prática dos treinamentos**
   - Diretamente aplicados: +2 pontos
   - Parcialmente aplicados: +1 ponto
   - Só teoria/Não realizamos: 0 pontos
   - Não sei informar: +1 ponto

### Bloco 2: Principais Dificuldades
5. **Principal desafio na implementação**
   - Falta conhecimento técnico: +1 ponto
   - Dificuldade encontrar profissionais: +1 ponto
   - Falta estratégia clara: +1 ponto
   - Alto custo/Dificuldade ROI: 0 pontos

6. **Dificuldade para encontrar profissionais (escala 1-5)**
   - 1-2 (Fácil): 0 pontos
   - 3 (Razoável): +1 ponto
   - 4 (Difícil): +1 ponto
   - 5 (Muito difícil): +2 pontos

### Bloco 3: Expectativas e Investimento
7. **Expectativas para próximos 12 meses** (múltipla escolha)
   - Eficiência operacional: +2 pontos
   - Novos produtos/serviços: +2 pontos
   - Vantagem competitiva: +2 pontos
   - Melhorar decisões: +1 ponto
   - Reduzir custos: +1 ponto
   - Sem expectativas: 0 pontos

8. **Disposição para investir**
   - Sim, com certeza: +2 pontos
   - Talvez, dependendo custo-benefício: +1 ponto
   - Não, no momento: 0 pontos

## Classificação de Leads

- **🔥 Lead Quente** (≥4 pontos): Alto potencial, coleta contato obrigatória
- **🌡️ Lead Morno** (≥2 pontos): Potencial moderado, coleta contato opcional
- **❄️ Lead Frio** (<2 pontos): Baixo potencial, sem coleta de contato

## Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com gradientes e animações
- **JavaScript ES6+**: Lógica de navegação e pontuação
- **Design Responsivo**: Mobile-first approach

### Backend
- **Flask**: Framework web Python
- **Flask-CORS**: Habilitação de CORS
- **SQLAlchemy**: ORM para banco de dados
- **Google Sheets API**: Integração com planilhas (preparado)

### Infraestrutura
- **SQLite**: Banco de dados local
- **JSON**: Logs de backup
- **Virtual Environment**: Isolamento de dependências

## Como Executar

### Pré-requisitos
- Python 3.11+
- pip (gerenciador de pacotes Python)

### Instalação e Execução

1. **Navegar para o diretório do backend**
   ```bash
   cd /home/ubuntu/web_form/backend
   ```

2. **Ativar o ambiente virtual**
   ```bash
   source venv/bin/activate
   ```

3. **Instalar dependências** (se necessário)
   ```bash
   pip install -r requirements.txt
   ```

4. **Executar a aplicação**
   ```bash
   python src/main.py
   ```

5. **Acessar no navegador**
   ```
   http://localhost:5000
   ```

## API Endpoints

### POST /api/leads/submit
Submete um novo lead com suas respostas.

**Payload:**
```json
{
  "leadType": "quente|morno|frio",
  "leadScore": 6,
  "userName": "Nome do usuário",
  "userEmail": "email@exemplo.com",
  "responses": {
    "q1": "nao_planejando",
    "q2": "nao_interesse",
    "q7": ["eficiencia_operacional", "novos_produtos"]
  }
}
```

### GET /api/leads/stats
Retorna estatísticas dos leads coletados.

**Resposta:**
```json
{
  "total": 15,
  "quente": 5,
  "morno": 7,
  "frio": 3
}
```

### GET /api/leads/export
Exporta todos os leads em formato JSON.

## Arquivos de Log

### /home/ubuntu/web_form/logs/validacao_respostas.json
Contém todas as respostas dos usuários em formato JSON para backup e análise.

### /home/ubuntu/todo.md
Lista de tarefas do projeto com status de conclusão.

## Configuração do Google Sheets

Para habilitar a integração com Google Sheets:

1. **Criar projeto no Google Cloud Console**
2. **Habilitar Google Sheets API**
3. **Criar credenciais de serviço**
4. **Configurar variáveis de ambiente**
5. **Atualizar ID da planilha no código**

## Segurança e Privacidade

- **Validação de dados**: Sanitização de inputs no frontend e backend
- **CORS configurado**: Permite requisições de origens específicas
- **Dados locais**: Backup automático para evitar perda de informações
- **Política de privacidade**: Informação clara sobre uso dos dados

## Melhorias Futuras

### Funcionalidades
- [ ] Dashboard administrativo para visualização de leads
- [ ] Exportação em múltiplos formatos (CSV, Excel)
- [ ] Sistema de notificações por email
- [ ] Integração com CRM (HubSpot, Salesforce)
- [ ] A/B testing para otimização de conversão

### Técnicas
- [ ] Implementação de cache Redis
- [ ] Containerização com Docker
- [ ] Deploy automatizado com CI/CD
- [ ] Monitoramento com logs estruturados
- [ ] Testes automatizados (unit, integration)

## Suporte e Manutenção

### Logs de Erro
Verificar logs do Flask para debugging:
```bash
tail -f /var/log/flask/app.log
```

### Backup de Dados
Os dados são automaticamente salvos em:
- Arquivo JSON local (backup)
- Google Sheets (quando configurado)
- Banco SQLite (para consultas rápidas)

### Monitoramento
- Verificar espaço em disco para logs
- Monitorar performance da API
- Acompanhar taxa de conversão de leads

## Contato e Suporte

Para dúvidas técnicas ou suporte, consulte a documentação do código ou entre em contato com a equipe de desenvolvimento.

---

**Versão:** 1.0.0  
**Data de Criação:** 08/07/2025  
**Última Atualização:** 08/07/2025

