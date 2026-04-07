
# 🏰 Braga Marmoraria: Resumo de Contexto para Continuidade (IA)

Este documento serve como a "âncora de memória" para que qualquer modelo de IA (Antigravity, Claude, etc.) possa assumir o desenvolvimento do sistema Braga Marmoraria mantendo a visão estratégica e a integridade do código.

## 🎯 Objetivo do Projeto
Transformar uma marmoraria tradicional em uma operação de alto padrão baseada em **Contratos Inteligentes e Gestão por Protocolos**. O sistema não apenas gerencia tarefas, mas garante a segurança jurídica e técnica através de checklists obrigatórios de pré-execução e aceites digitais.

---

## 🏗️ Estrutura Técnica (Tech Stack)
- **Frontend**: Vite + React + TypeScript + Tailwind CSS (com Vanilla CSS para controle refinado).
- **Icons**: Lucide React.
- **Animations**: Framer Motion.
- **State/Data**: LocalStorage (emulando um backend) com `projectService.ts`.
- **Pipeline**: Kanban de 7 estágios lineares.

---

## 🚦 Pipeline de Produção (Statuses)
O projeto segue rigorosamente estes estágios definidos em `types.ts` e `constants.ts`:
1. `LEAD_FECHADO`: Contrato assinado, aguardando início técnico.
2. `AGUARDANDO_MEDICAO`: Fase de checklist de pré-execução (gesso, hidráulica, gabarito).
3. `MEDICAO_CONCLUIDA`: Visita laser feita, projeto executivo validado.
4. `PRODUCAO`: Corte, polimento e acabamentos no Atelier.
5. `INSTALACAO`: Montagem no local da obra.
6. `FINALIZADO`: Termo de aceite assinado, início da garantia.
7. `MANUTENCAO`: Suporte pós-obra.

---

## 📄 Estrutura do Modelo de Contrato (`ProjectContractData`)
Localizado em `types.ts`, o contrato gerencia:
- **Dados Jurídicos**: CPF, Endereço da Obra, Vendedor.
- **Módulo Financeiro**: `commercialConditions` (Valor, Forma, Regra de Cancelamento) e `billingData` (PIX/Banco automático).
- **Checklist de Pré-Execução**: Crucial para evitar retrabalho. Verifica gesso, hidráulica, elétrica e gabarito.
- **Responsabilidades**: Lista clara de deveres do Cliente vs Empresa.
- **Garantia**: Prazos e exclusões de cobertura.

---

## 🛠️ Arquivos Chave para Referência
1. `types.ts`: Definição de todas as interfaces (Project, ProjectContractData, ProjectStatus).
2. `constants.ts`: Definição dos `STAGES` e dados fixos.
3. `services/mockData.ts`: Base de dados inicial (extremamente importante para consistência visual).
4. `components/ProjectContractTab.tsx`: O cérebro do sistema. Gerencia os checklists e a transição de status.
5. `components/ProjectMasterView.tsx`: A visualização principal que integra Contrato, Galeria, Tarefas e IA.

---

## 🧠 Próximos Passos (Backlog)
- [ ] **Automação Total**: Fazer o botão de "Avançar Status" aparecer em outras abas quando o contrato estiver OK.
- [ ] **Módulo Financeiro**: Adicionar histórico de pagamentos (sinal pago, parcelas pendentes).
- [ ] **Área do Cliente**: Refletir os checklists de responsabilidade para o cliente acompanhar pelo celular.
- [ ] **IA de Escopo**: Refinar o componente `ProjectScopeIA.tsx` para que ele gere o contrato automaticamente a partir de fotos.

---
*Este documento deve ser colado no prompt inicial de qualquer nova sessão para garantir que a IA entenda a profundidade estratégica do projeto "Artesani" da Braga Marmoraria.*
