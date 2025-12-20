#!/bin/bash

# Script para executar teste de performance com K6 e gerar relatório HTML

echo "=================================================="
echo "🚀 Iniciando Teste de Performance com K6"
echo "=================================================="
echo ""

# Variáveis
TEST_FILE="test/k6/cadastroTasks.test.js"
REPORT_DIR="test/k6"
JSON_OUTPUT="${REPORT_DIR}/test-results.json"

# Verificar se o arquivo de teste existe
if [ ! -f "$TEST_FILE" ]; then
    echo "❌ Erro: Arquivo de teste não encontrado: $TEST_FILE"
    exit 1
fi

echo "📋 Configuração:"
echo "  - Teste: $TEST_FILE"
echo "  - Saída: $JSON_OUTPUT"
echo ""

echo "⏳ Executando teste de performance..."
echo ""

# Executar o teste com K6
k6 run "$TEST_FILE" \
    --summary-trend-stats="avg,p(95),p(99),min,max" \
    -o json="$JSON_OUTPUT"

if [ $? -ne 0 ]; then
    echo ""
    echo "=================================================="
    echo "❌ Teste falhou"
    echo "=================================================="
    exit 1
fi

echo ""
echo "=================================================="
echo "⏳ Gerando relatório HTML..."
echo "=================================================="
echo ""

# Gerar relatório HTML
node "${REPORT_DIR}/generate-report.js"

echo ""
echo "=================================================="
echo "✅ Processo Concluído com Sucesso!"
echo "=================================================="
echo ""
echo "📊 Abra o arquivo HTML em seu navegador:"
echo "   open ${REPORT_DIR}/test-report.html"
echo ""
