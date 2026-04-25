// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();
process.env.NODE_ENV = "production";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  app.use(express.json());
  app.use(cookieParser());
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NODE_ENV === "production" ? "https://marmorariabraga.com.br/auth/callback" : process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback"
  );
  const DATA_DIR = path.join(__dirname, "data");
  async function readDataFile(filename, defaultValue = []) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return defaultValue;
    }
  }
  async function writeDataFile(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  }
  const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ];
  app.get("/api/auth/google/url", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent"
    });
    res.json({ url });
  });
  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      res.cookie("google_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1e3
        // 30 days
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
            <p>Autentica\xE7\xE3o bem-sucedida! Esta janela fechar\xE1 automaticamente.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error getting tokens:", error);
      res.status(500).send("Erro na autentica\xE7\xE3o.");
    }
  });
  app.get("/api/auth/status", (req, res) => {
    const googleTokens = req.cookies.google_tokens;
    const authUser = req.cookies.auth_user;
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        return res.json({ isAuthenticated: true, user });
      } catch (e) {
      }
    }
    res.json({ isAuthenticated: !!googleTokens });
  });
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const users = await readDataFile("users.json");
    const user = users.find((u) => u.email === email && (u.password === password || u.pin === password));
    if (user) {
      res.cookie("auth_user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1e3
        // 30 days
      });
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: "E-mail ou senha incorretos." });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("google_tokens");
    res.clearCookie("auth_user");
    res.json({ success: true });
  });
  app.get("/api/projects", async (req, res) => {
    const projects = await readDataFile("projects.json");
    res.json(projects);
  });
  app.post("/api/projects", async (req, res) => {
    const projects = await readDataFile("projects.json");
    const newProject = req.body;
    projects.push(newProject);
    await writeDataFile("projects.json", projects);
    res.status(201).json(newProject);
  });
  app.put("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    const updatedProject = req.body;
    let projects = await readDataFile("projects.json");
    projects = projects.map((p) => p.id === id ? updatedProject : p);
    await writeDataFile("projects.json", projects);
    res.json(updatedProject);
  });
  app.delete("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    let projects = await readDataFile("projects.json");
    projects = projects.filter((p) => p.id !== id);
    await writeDataFile("projects.json", projects);
    res.json({ success: true });
  });
  app.get("/api/occurrences", async (req, res) => {
    const occurrences = await readDataFile("occurrences.json");
    res.json(occurrences);
  });
  app.post("/api/occurrences", async (req, res) => {
    const occurrences = await readDataFile("occurrences.json");
    const newOccurrence = req.body;
    occurrences.push(newOccurrence);
    await writeDataFile("occurrences.json", occurrences);
    res.status(201).json(newOccurrence);
  });
  app.put("/api/occurrences/:id", async (req, res) => {
    const { id } = req.params;
    const updatedOccurrence = req.body;
    let occurrences = await readDataFile("occurrences.json");
    occurrences = occurrences.map((o) => o.id === id ? { ...o, ...updatedOccurrence } : o);
    await writeDataFile("occurrences.json", occurrences);
    res.json(updatedOccurrence);
  });
  app.delete("/api/occurrences/:id", async (req, res) => {
    const { id } = req.params;
    let occurrences = await readDataFile("occurrences.json");
    occurrences = occurrences.filter((o) => o.id !== id);
    await writeDataFile("occurrences.json", occurrences);
    res.json({ success: true });
  });
  app.get("/api/users", async (req, res) => {
    const users = await readDataFile("users.json", [
      {
        id: "admin-1",
        name: "Administrador Braga",
        email: "admin@braga.com",
        role: "ADMIN",
        status: "ACTIVE",
        avatar: "https://ui-avatars.com/api/?name=Admin+Braga&background=D4AF37&color=fff",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
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
  app.post("/api/users", async (req, res) => {
    const users = await readDataFile("users.json");
    const newUser = req.body;
    users.push(newUser);
    await writeDataFile("users.json", users);
    res.status(201).json(newUser);
  });
  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let users = await readDataFile("users.json");
    users = users.map((u) => u.id === id ? { ...u, ...updatedUser } : u);
    await writeDataFile("users.json", users);
    res.json(updatedUser);
  });
  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    let users = await readDataFile("users.json");
    users = users.filter((u) => u.id !== id);
    await writeDataFile("users.json", users);
    res.json({ success: true });
  });
  app.post("/api/claude/generate", async (req, res) => {
    const { clientName, projectType, value, details } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.json({
        text: `# Proposta Comercial: ${projectType}

Prezado(a) **${clientName}**,

\xC9 um prazer apresentar esta proposta para o projeto de *${projectType}*. Na **Braga Marmoraria**, transformamos pedras naturais em obras de arte com precis\xE3o milim\xE9trica e artesania pura.

### Detalhes do Projeto
${details}

### Investimento
O valor total estimado para este projeto \xE9 de **R$ ${value.toLocaleString("pt-BR")}**.

### Pr\xF3ximos Passos
1. Aprova\xE7\xE3o desta proposta.
2. Medi\xE7\xE3o t\xE9cnica final.
3. In\xEDcio da produ\xE7\xE3o.

Atenciosamente,

**Equipe Braga Marmoraria**`
      });
    }
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2e3,
          messages: [
            {
              role: "user",
              content: `Voc\xEA \xE9 um consultor comercial de uma marmoraria de luxo chamada "Braga Marmoraria". 
              Escreva uma proposta comercial elegante e profissional para o cliente ${clientName}.
              O projeto \xE9: ${projectType}.
              O valor estimado \xE9: R$ ${value.toLocaleString("pt-BR")}.
              Detalhes adicionais: ${details}.
              
              A proposta deve incluir:
              1. Uma sauda\xE7\xE3o calorosa e profissional.
              2. Uma breve descri\xE7\xE3o do valor que a Braga Marmoraria agrega (artesania, precis\xE3o, luxo).
              3. Detalhamento do projeto.
              4. Condi\xE7\xF5es de investimento.
              5. Pr\xF3ximos passos.
              
              Use um tom sofisticado, mas direto. Formate em Markdown.`
            }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Erro na API do Claude");
      }
      res.json({ text: data.content[0].text });
    } catch (error) {
      console.error("Claude API Error:", error);
      res.status(500).json({ message: error.message || "Erro ao processar requisi\xE7\xE3o com Claude" });
    }
  });
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      const systemMsg2 = messages?.find((m) => m.role === "system");
      const isJsonMode2 = systemMsg2?.content?.includes("JSON");
      return res.json({
        role: "assistant",
        content: isJsonMode2 ? JSON.stringify({ summary: "Resumo simulado (sem API Key)", entities: [] }) : "Ol\xE1! Sou o assistente da Braga Marmoraria. Estou operando em modo de demonstra\xE7\xE3o pois a chave de API n\xE3o foi configurada, mas posso ajudar voc\xEA com a navega\xE7\xE3o do sistema!"
      });
    }
    const systemMsg = messages?.find((m) => m.role === "system");
    const isJsonMode = systemMsg?.content?.includes("JSON");
    const claudeMessages = messages.filter((m) => m.role !== "system");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: systemMsg?.content || "Voc\xEA \xE9 um assistente especializado em gest\xE3o de marmorarias de luxo da Braga Marmoraria. Seja direto e profissional.",
          messages: claudeMessages
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Erro na API do Claude");
      const text = data.content[0].text;
      if (isJsonMode) {
        return res.json({ content: text });
      } else {
        return res.json({ role: "assistant", content: text });
      }
    } catch (error) {
      console.error("Claude /api/chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/gemini/generate", async (req, res) => {
    const { prompt, responseType } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      if (responseType === "json") {
        return res.json({ text: JSON.stringify({ projects: [{ client: "Demonstra\xE7\xE3o", material: "M\xE1rmore", value: 5e3 }] }) });
      }
      return res.json({ text: "Resposta de demonstra\xE7\xE3o (sem API Key)." });
    }
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: responseType === "json" ? "Responda APENAS com JSON v\xE1lido, sem texto adicional." : "Voc\xEA \xE9 um assistente especializado em marmoraria.",
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Erro na API");
      res.json({ text: data.content[0].text });
    } catch (error) {
      console.error("Claude /api/gemini/generate error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/google/calendar/events", async (req, res) => {
    const tokensStr = req.cookies.google_tokens;
    if (!tokensStr) return res.status(401).json({ error: "N\xE3o autenticado" });
    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: (/* @__PURE__ */ new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime"
      });
      res.json(response.data.items);
    } catch (error) {
      console.error("Calendar error:", error);
      res.status(500).json({ error: "Erro ao buscar calend\xE1rio" });
    }
  });
  app.post("/api/google/gmail/send", async (req, res) => {
    const tokensStr = req.cookies.google_tokens;
    if (!tokensStr) return res.status(401).json({ error: "N\xE3o autenticado" });
    const { to, subject, body } = req.body;
    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `From: me`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      "",
      body
    ];
    const message = messageParts.join("\n");
    const encodedMessage = Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    try {
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Gmail error:", error);
      res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
  });
  app.get("/api/google/gmail/messages", async (req, res) => {
    const tokensStr = req.cookies.google_tokens;
    if (!tokensStr) return res.status(401).json({ error: "N\xE3o autenticado" });
    const tokens = JSON.parse(tokensStr);
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    try {
      const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 10
      });
      const messages = await Promise.all((response.data.messages || []).map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id
        });
        return detail.data;
      }));
      res.json(messages);
    } catch (error) {
      console.error("Gmail list error:", error);
      res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
  });
  console.log("[DEBUG] Configurando rotas est\xE1ticas...");
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  console.log(`[DEBUG] Tentando iniciar o servidor na porta ${PORT}...`);
  try {
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SUCESSO] Server running on http://0.0.0.0:${PORT}`);
    });
    server.on("error", (err) => {
      console.error("[ERRO CR\xCDTICO] Falha no app.listen:", err);
    });
  } catch (e) {
    console.error("[EXCE\xC7\xC3O CR\xCDTICA] Erro ao tentar ligar a porta:", e);
  }
}
console.log("[DEBUG] Chamando startServer()...");
startServer().catch((err) => {
  console.error("[ERRO FATAL] startServer() falhou:", err);
});
