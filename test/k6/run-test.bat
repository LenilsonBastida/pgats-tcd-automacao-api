@echo off
REM Script para executar teste de performance com K6 e gerar relatório HTML

echo ==================================================
echo 🚀 Iniciando Teste de Performance com K6
echo ==================================================
echo.

REM Variáveis
set "TEST_FILE=test\k6\cadastroTasks.test.js"
set "REPORT_DIR=test\k6"
set "JSON_OUTPUT=%REPORT_DIR%\test-results.json"
set "REPORT_SCRIPT=%REPORT_DIR%\generate-report.js"

REM Verificar se o arquivo de teste existe
if not exist "%TEST_FILE%" (
    echo ❌ Erro: Arquivo de teste não encontrado: %TEST_FILE%
    exit /b 1
)

echo 📋 Configuração:
echo   - Teste: %TEST_FILE%
echo   - Saída: %JSON_OUTPUT%
echo.

echo ⏳ Executando teste de performance...
echo.

REM Executar o teste com K6
k6 run "%TEST_FILE%" ^
    --summary-trend-stats="avg,p(95),p(99),min,max" ^
    -o json="%JSON_OUTPUT%"

if %ERRORLEVEL% neq 0 (
    echo.
    echo ==================================================
    echo ❌ Teste falhou
    echo ==================================================
    exit /b %ERRORLEVEL%
)

echo.
echo ==================================================
echo ⏳ Gerando relatório HTML...
echo ==================================================
echo.

REM Gerar relatório HTML
node "%REPORT_SCRIPT%"

echo.
echo ==================================================
echo ✅ Processo Concluído com Sucesso!
echo ==================================================
echo.
echo 📊 Abra o arquivo HTML em seu navegador:
echo    %REPORT_DIR%\test-report.html
echo.

pause
