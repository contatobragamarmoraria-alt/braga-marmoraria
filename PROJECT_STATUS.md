# PRD & Projeto Executivo: Sistema de Gestão de Produção - Braga Marmoraria

---

## 1. Visão Geral do Projeto
O **Sistema de Gestão de Produção da Braga Marmoraria** é uma plataforma de elite desenvolvida para transformar a operação de uma marmoraria de luxo em uma experiência digital fluida, precisa e altamente profissional. O foco central não é apenas a gestão interna, mas a entrega de valor e transparência para o cliente final, elevando a percepção de marca através de uma interface sofisticada e funcionalidades inteligentes.

---

## 2. Documento de Requisitos de Produto (PRD)

### 2.1. Objetivos Estratégicos
*   **Eficiência Operacional:** Centralizar todas as etapas, desde o lead comercial até a instalação final.
*   **Transparência com o Cliente:** Oferecer um portal exclusivo onde o cliente acompanha o progresso de sua obra em tempo real.
*   **Inteligência de Dados:** Fornecer dashboards que permitam decisões baseadas em faturamento real, carga de equipe e previsões de entrega.
*   **Artesania Digital:** Refletir o cuidado e a precisão do trabalho com pedras naturais na interface e na usabilidade do sistema.

### 2.2. Detalhamento das Funcionalidades

#### A. Dashboard Estratégico (Cérebro do Sistema)
*   **KPIs em Tempo Real:** Visualização instantânea de faturamento mensal, número de projetos ativos, obras concluídas no período e novos leads captados.
*   **Previsão Semestral:** Gráfico de barras que projeta o faturamento futuro com base nas datas estimadas de entrega dos projetos em carteira.
*   **Distribuição por Área:** Gráfico de pizza que identifica quais ambientes (cozinhas, banheiros, lobbies) são mais demandados, permitindo ajustes no estoque ou marketing.
*   **Alertas de Cronograma:** Um sistema de semáforo (Atraso, Crítico, Atenção, OK) que prioriza tarefas que precisam de ação imediata.
*   **Carga da Equipe:** Monitoramento de quantos projetos cada profissional está gerindo, evitando sobrecarga e garantindo a qualidade da artesania.

#### B. Gestão de Produção (Kanban de Luxo)
*   **Fluxo Visual:** Projetos organizados em colunas que representam as fases reais: Medição, Corte, Acabamento, Polimento, Instalação e Concluído.
*   **Drag & Drop:** Movimentação intuitiva de projetos entre fases, com atualização automática de progresso.
*   **Checklist de Tarefas:** Cada projeto possui uma lista de sub-tarefas específicas que devem ser marcadas para que o progresso percentual avance.

#### C. Fluxo Comercial e Vendas
*   **Gestão de Propostas:** Acompanhamento de orçamentos desde o primeiro contato (Lead) até o fechamento do contrato.
*   **Funil de Vendas:** Visualização clara de quantos orçamentos estão em negociação e qual o valor potencial de conversão.

#### D. Gestão de Clientes e Parceiros
*   **CRM Integrado:** Cadastro completo de clientes com histórico de todas as obras realizadas.
*   **Soft Delete (Lixeira):** Proteção contra exclusões acidentais, permitindo recuperar projetos deletados em até 30 dias.

#### E. Histórico de Ocorrências (Log de Qualidade)
*   **Eventos Positivos/Negativos:** Registro de feedbacks, problemas técnicos ou elogios durante a execução, criando um histórico de aprendizado para a empresa.

#### F. Sincronia IA (Inteligência Artificial)
*   **Resumo de Conversas:** Ferramenta que processa logs de chat ou notas de reunião para extrair pontos-chave e decisões importantes.
*   **Criação Inteligente de Projetos:** Modal que utiliza IA para preencher dados de novos projetos com base em descrições textuais rápidas.

#### G. Integração Google (Ecosistema)
*   **Google Calendar:** Sincronização de datas de medição e instalação diretamente na agenda do Google.
*   **Gmail Integrado:** Envio de alertas de tarefas e notificações de atraso diretamente via e-mail corporativo.

---

## 3. Projeto Executivo (Arquitetura e Implementação)

### 3.1. Arquitetura Tecnológica
*   **Frontend:** Desenvolvido em **React 19** com **TypeScript**, garantindo segurança de tipos e performance.
*   **Estilização:** Utiliza **Tailwind CSS** com uma paleta de cores personalizada (Ouro, Ônix, Marfim) para refletir o mercado de luxo.
*   **Animações:** Implementadas com **Framer Motion** para transições suaves e uma sensação de software "premium".
*   **Gráficos:** Renderizados com **Recharts** para visualização de dados precisa e responsiva.
*   **Ícones:** Biblioteca **Lucide React** para uma iconografia moderna e consistente.

### 3.2. Estratégia de Persistência de Dados
*   **Fase Atual (Executivo Local):** O sistema utiliza o `localStorage` do navegador através de serviços desacoplados (`userService`, `projectService`). Isso permite que o sistema seja testado e demonstrado sem a necessidade de um servidor de banco de dados ativo.
*   **Escalabilidade:** A arquitetura foi desenhada para que a troca do `localStorage` por uma API REST ou Firebase seja feita apenas alterando a camada de serviço, sem tocar nos componentes de UI.

### 3.3. Segurança e Acessos
*   **Níveis de Permissão (RBAC):**
    *   **ADMIN:** Acesso total ao sistema, financeiro e gestão de usuários.
    *   **MANAGER:** Gestão de projetos e equipe, sem acesso a dados financeiros sensíveis.
    *   **TEAM_MEMBER:** Visualização de tarefas técnicas e cronograma.
    *   **CLIENT:** Acesso restrito apenas ao seu próprio projeto (Portal do Proprietário).

---

## 4. Status de Implementação e Roadmap

### 4.1. O que está PRONTO (✅)
*   **Core Engine:** Toda a lógica de roteamento, contextos de autenticação e layout base.
*   **Dashboard:** Todos os gráficos e KPIs estão funcionais com dados simulados/locais.
*   **Kanban:** Sistema de movimentação e gestão de fases totalmente operacional.
*   **Perfil e Configurações:** Edição de dados, avatares e preferências de tema (Dark/Light).
*   **Gestão de Dados:** CRUD completo de projetos, clientes e tarefas.

### 4.2. O que está em DESENVOLVIMENTO (⚠️)
*   **Integração Google:** O código está pronto, mas depende da inserção das chaves `CLIENT_ID` e `CLIENT_SECRET` no ambiente de produção para funcionar.
*   **IA Real:** A interface de IA está pronta, mas os endpoints de backend (`/api/claude/generate`) requerem uma chave de API válida para processar as propostas.

### 4.3. Próximos Passos (Roadmap)
1.  **Migração para Banco de Dados:** Implementar o backend em Node.js com PostgreSQL para permitir múltiplos usuários simultâneos.
2.  **App Mobile:** Adaptar a interface para uma experiência nativa via PWA (Progressive Web App).
3.  **Módulo Financeiro Avançado:** Integração com emissão de notas fiscais e controle de fluxo de caixa detalhado.
4.  **Real-time Collaboration:** WebSockets para que as mudanças no Kanban apareçam instantaneamente para todos os usuários logados.
