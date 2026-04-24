import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

// Forçar ambiente de produção para a Hostinger
process.env.NODE_ENV = 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cookieParser());

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback'
  );

  // Data persistence helpers
  const DATA_DIR = path.join(__dirname, 'data');
  
  async function readDataFile(filename: string, defaultValue: any = []) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return defaultValue;
    }
  }

  async function writeDataFile(filename: string, data: any) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  // Auth Routes
  app.get('/api/auth/google/url', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
    res.json({ url });
  });

  app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // In a real app, store these in a database linked to the user
      // For this demo, we'll use a cookie (not secure for production tokens, but works for demo)
      res.cookie('google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Autenticação bem-sucedida! Esta janela fechará automaticamente.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.status(500).send('Erro na autenticação.');
    }
  });

  app.get('/api/auth/status', (req, res) => {
    const tokens = req.cookies.google_tokens;
    res.json({ isAuthenticated: !!tokens });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('google_tokens');
    res.json({ success: true });
  });

  // Projects API
  app.get('/api/projects', async (req, res) => {
    const projects = await readDataFile('projects.json');
    res.json(projects);
  });

  app.post('/api/projects', async (req, res) => {
    const projects = await readDataFile('projects.json');
    const newProject = req.body;
    projects.push(newProject);
    await writeDataFile('projects.json', projects);
    res.status(201).json(newProject);
  });

  app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProject = req.body;
    let projects = await readDataFile('projects.json');
    projects = projects.map((p: any) => p.id === id ? updatedProject : p);
    await writeDataFile('projects.json', projects);
    res.json(updatedProject);
  });

  app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    let projects = await readDataFile('projects.json');
    projects = projects.filter((p: any) => p.id !== id);
    await writeDataFile('projects.json', projects);
    res.json({ success: true });
  });

  // Occurrences API
  app.get('/api/occurrences', async (req, res) => {
    const occurrences = await readDataFile('occurrences.json');
    res.json(occurrences);
  });

  app.post('/api/occurrences', async (req, res) => {
    const occurrences = await readDataFile('occurrences.json');
    const newOccurrence = req.body;
    occurrences.push(newOccurrence);
    await writeDataFile('occurrences.json', occurrences);
    res.status(201).json(newOccurrence);
  });

  app.put('/api/occurrences/:id', async (req, res) => {
    const { id } = req.params;
    const updatedOccurrence = req.body;
    let occurrences = await readDataFile('occurrences.json');
    occurrences = occurrences.map((o: any) => o.id === id ? { ...o, ...updatedOccurrence } : o);
    await writeDataFile('occurrences.json', occurrences);
    res.json(updatedOccurrence);
  });

  app.delete('/api/occurrences/:id', async (req, res) => {
    const { id } = req.params;
    let occurrences = await readDataFile('occurrences.json');
    occurrences = occurrences.filter((o: any) => o.id !== id);
    await writeDataFile('occurrences.json', occurrences);
    res.json({ success: true });
  });

  // Users API
  app.get('/api/users', async (req, res) => {
    const users = await readDataFile('users.json', [
      {
        id: 'admin-1',
        name: 'Administrador Braga',
        email: 'admin@braga.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        avatar: 'https://ui-avatars.com/api/?name=Admin+Braga&background=D4AF37&color=fff',
        createdAt: new Date().toISOString(),
        permissions: {
          canViewFinancials: true,
          canViewTechnical: true,
          canViewCalendar: true,
          canViewOccurrences: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canManageUsers: true
        }
      }
    ]);
    res.json(users);
  });

  app.post('/api/users', async (req, res) => {
    const users = await readDataFile('users.json');
    const newUser = req.body;
    users.push(newUser);
    await writeDataFile('users.json', users);
    res.status(201).json(newUser);
  });

  app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let users = await readDataFile('users.json');
    users = users.map((u: any) => u.id === id ? { ...u, ...updatedUser } : u);
    await writeDataFile('users.json', users);
    res.json(updatedUser);
  });

  app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    let users = await readDataFile('users.json');
    users = users.filter((u: any) => u.id !== id);
    await writeDataFile('users.json', users);
    res.json({ success: true });
  });

  // Claude AI API
  app.post('/api/claude/generate', async (req, res) => {
    const { clientName, projectType, value, details } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      // Mock response if no API key
      return res.json({ 
        text: `# Proposta Comercial: ${projectType}\n\nPrezado(a) **${clientName}**,\n\nÉ um prazer apresentar esta proposta para o projeto de *${projectType}*. Na **Braga Marmoraria**, transformamos pedras naturais em obras de arte com precisão milimétrica e artesania pura.\n\n### Detalhes do Projeto\n${details}\n\n### Investimento\nO valor total estimado para este projeto é de **R$ ${value.toLocaleString('pt-BR')}**.\n\n### Próximos Passos\n1. Aprovação desta proposta.\n2. Medição técnica final.\n3. Início da produção.\n\nAtenciosamente,\n\n**Equipe Braga Marmoraria**`
      });
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `Você é um consultor comercial de uma marmoraria de luxo chamada "Braga Marmoraria". 
              Escreva uma proposta comercial elegante e profissional para o cliente ${clientName}.
              O projeto é: ${projectType}.
              O valor estimado é: R$ ${value.toLocaleString('pt-BR')}.
              Detalhes adicionais: ${details}.
              
              A proposta deve incluir:
              1. Uma saudação calorosa e profissional.
              2. Uma breve descrição do valor que a Braga Marmoraria agrega (artesania, precisão, luxo).
              3. Detalhamento do projeto.
              4. Condições de investimento.
              5. Próximos passos.
              
              Use um tom sofisticado, mas direto. Formate em Markdown.`
            }
          ]
        })
      });

      const data: any = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erro na API do Claude');
      }

      res.json({ text: data.content[0].text });
    } catch (error: any) {
      console.error('Claude API Error:', error);
      res.status(500).json({ message: error.message || 'Erro ao processar requisição com Claude' });
    }
  });

  // Chat AI API (ConversationSummarizer + ChatGPT assistant)
  app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      // Mock chat response
      const systemMsg = messages?.find((m: any) => m.role === 'system');
      const isJsonMode = systemMsg?.content?.includes('JSON');
      return res.json({ 
        role: 'assistant', 
        content: isJsonMode 
          ? JSON.stringify({ summary: "Resumo simulado (sem API Key)", entities: [] }) 
          : "Olá! Sou o assistente da Braga Marmoraria. Estou operando em modo de demonstração pois a chave de API não foi configurada, mas posso ajudar você com a navegação do sistema!" 
      });
    }

    // Detect if caller expects JSON (ConversationSummarizer) or free text (ChatGPT)
    const systemMsg = messages?.find((m: any) => m.role === 'system');
    const isJsonMode = systemMsg?.content?.includes('JSON');
    const claudeMessages = messages.filter((m: any) => m.role !== 'system');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemMsg?.content || 'Você é um assistente especializado em gestão de marmorarias de luxo da Braga Marmoraria. Seja direto e profissional.',
          messages: claudeMessages
        })
      });

      const data: any = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Erro na API do Claude');

      const text = data.content[0].text;

      // ConversationSummarizer expects { content: '...' }
      // ChatGPT expects { role: 'assistant', content: '...' }
      if (isJsonMode) {
        return res.json({ content: text });
      } else {
        return res.json({ role: 'assistant', content: text });
      }
    } catch (error: any) {
      console.error('Claude /api/chat error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Gemini-compatible AI endpoint (used by ImportCenter and ProjectScopeIA)
  app.post('/api/gemini/generate', async (req, res) => {
    const { prompt, responseType } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      // Mock response for Gemini-like calls (used in ImportCenter)
      if (responseType === 'json') {
        return res.json({ text: JSON.stringify({ projects: [{ client: "Demonstração", material: "Mármore", value: 5000 }] }) });
      }
      return res.json({ text: "Resposta de demonstração (sem API Key)." });
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: responseType === 'json' ? 'Responda APENAS com JSON válido, sem texto adicional.' : 'Você é um assistente especializado em marmoraria.',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data: any = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Erro na API');

      res.json({ text: data.content[0].text });
    } catch (error: any) {
      console.error('Claude /api/gemini/generate error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Google Calendar API
  app.get('/api/google/calendar/events', async (req, res) => {
    const tokensStr = req.cookies.google_tokens;
    if (!tokensStr) return res.status(401).json({ error: 'Não autenticado' });

    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      res.json(response.data.items);
    } catch (error) {
      console.error('Calendar error:', error);
      res.status(500).json({ error: 'Erro ao buscar calendário' });
    }
  });

  // Gmail API
  app.post('/api/google/gmail/send', async (req, res) => {
    const tokensStr = req.cookies.google_tokens;
    if (!tokensStr) return res.status(401).json({ error: 'Não autenticado' });

    const { to, subject, body } = req.body;
    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: me`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      body,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Gmail error:', error);
      res.status(500).json({ error: 'Erro ao enviar e-mail' });
    }
  });

  app.get('/api/google/gmail/messages', async (req, res) => {
    const tokensStr = req.cookies.google_tokens;
    if (!tokensStr) return res.status(401).json({ error: 'Não autenticado' });

    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
      });
      
      const messages = await Promise.all((response.data.messages || []).map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
        });
        return detail.data;
      }));

      res.json(messages);
    } catch (error) {
      console.error('Gmail list error:', error);
      res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
  });

  // Produção: servir arquivos estáticos
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
