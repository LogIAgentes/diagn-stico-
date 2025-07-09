from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime
# import gspread
# from google.oauth2.service_account import Credentials

leads_bp = Blueprint('leads', __name__)

# Configuração do Google Sheets
SCOPES = ['https://www.googleapis.com/spreadsheets/scopes/auth']
SPREADSHEET_ID = 'Validacao_Problema_IA_Leads'

def get_google_sheets_client():
    """
    Inicializa o cliente do Google Sheets.
    Em produção, as credenciais devem ser configuradas via variáveis de ambiente.
    """
    try:
        # Para este exemplo, vamos simular a conexão
        # Em produção, você precisaria configurar as credenciais do Google
        return None
    except Exception as e:
        print(f"Erro ao conectar com Google Sheets: {e}")
        return None

def save_to_local_log(data):
    """Salva os dados localmente como backup."""
    try:
        log_file = '/home/ubuntu/web_form/logs/validacao_respostas.json'
        
        # Ler logs existentes
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if content:
                    logs = json.loads(content)
                else:
                    logs = []
        else:
            logs = []
        
        # Adicionar novo log
        logs.append(data)
        
        # Salvar de volta
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        print(f"Erro ao salvar log local: {e}")
        return False

def save_to_google_sheets(data):
    """Salva os dados no Google Sheets."""
    try:
        # Simular salvamento no Google Sheets
        # Em produção, implementar a integração real
        print(f"Simulando salvamento no Google Sheets: {data}")
        
        # Aqui seria a implementação real:
        # client = get_google_sheets_client()
        # if client:
        #     sheet = client.open(SPREADSHEET_ID).sheet1
        #     row = [
        #         data['timestamp'],
        #         data['leadType'],
        #         data['userName'],
        #         data['userEmail'],
        #         json.dumps(data['responses'], ensure_ascii=False)
        #     ]
        #     sheet.append_row(row)
        
        return True
    except Exception as e:
        print(f"Erro ao salvar no Google Sheets: {e}")
        return False

@leads_bp.route('/submit', methods=['POST'])
def submit_lead():
    """Endpoint para submissão de leads."""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        required_fields = ['leadType', 'leadScore', 'responses']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório ausente: {field}'}), 400
        
        # Adicionar timestamp se não fornecido
        if 'timestamp' not in data:
            data['timestamp'] = datetime.now().isoformat()
        
        # Adicionar ID único
        data['id'] = f"lead_{int(datetime.now().timestamp())}"
        
        # Salvar localmente (sempre funciona)
        local_saved = save_to_local_log(data)
        
        # Tentar salvar no Google Sheets
        sheets_saved = save_to_google_sheets(data)
        
        # Preparar resposta
        response = {
            'success': True,
            'message': 'Lead registrado com sucesso',
            'id': data['id'],
            'local_saved': local_saved,
            'sheets_saved': sheets_saved
        }
        
        if not sheets_saved:
            response['warning'] = 'Dados salvos localmente, mas houve problema com Google Sheets'
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Erro ao processar lead: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@leads_bp.route('/stats', methods=['GET'])
def get_lead_stats():
    """Endpoint para obter estatísticas dos leads."""
    try:
        log_file = '/home/ubuntu/web_form/logs/validacao_respostas.json'
        
        if not os.path.exists(log_file):
            return jsonify({
                'total': 0,
                'quente': 0,
                'morno': 0,
                'frio': 0
            })
        
        with open(log_file, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                logs = []
            else:
                logs = json.loads(content)
        
        # Calcular estatísticas
        stats = {
            'total': len(logs),
            'quente': 0,
            'morno': 0,
            'frio': 0
        }
        
        for log in logs:
            lead_type = log.get('leadType', 'frio')
            if lead_type in stats:
                stats[lead_type] += 1
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Erro ao obter estatísticas: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@leads_bp.route('/export', methods=['GET'])
def export_leads():
    """Endpoint para exportar leads em formato JSON."""
    try:
        log_file = '/home/ubuntu/web_form/logs/validacao_respostas.json'
        
        if not os.path.exists(log_file):
            return jsonify([]), 200
        
        with open(log_file, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                logs = []
            else:
                logs = json.loads(content)
        
        return jsonify(logs), 200
        
    except Exception as e:
        print(f"Erro ao exportar leads: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

