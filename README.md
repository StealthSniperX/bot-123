# Discord Bot + Webpanel (Railway + GitHub)

Ein Discord-Bot (Discord.js v14, TypeScript) + Web-Dashboard (Express) mit **Owner-Lock** via Discord OAuth2.
Keine Tokens/Secrets im Repo: alles läuft über **Environment-Variablen**.

## Enthaltene Module (MVP)

- Community: `/ping`, `/info`, `/help` (inkl. Suche)
- Fun: `/coinflip`, `/rps`
- Moderation: Auto-Löschen von **banned words** + optional Discord-Invites (`/mod bannedword ...`)
- Logging: Message Delete/Edit in Log-Channel
- Leveling: XP/Level + `/level me`, `/level top`
- Welcome: Welcome Message (Channel über Panel)
- Auto-Role: Rolle bei Join (Role ID über Panel)
- Anti-Raid: **Join-Rate Alarm** (Log-Channel + DM an Owner)
- Verification: `/verify send` -> Button -> gibt Verified-Rolle (über Panel)
- JoinToCreate: `/jtc sethub` -> Hub-VC -> temporären VC erstellen + Cleanup wenn leer
- Reaction Roles (Dropdown): `/rrmenu create|add|send`
- Tickets (Panels): `/ticketpanel config|create|send|list` (erstellt Ticket-Channel in Kategorie)
- ServerStats: `/serverstats setup` oder Panel; aktualisiert Channel-Name jede Minute
- Poll-System: `/poll create` (👍/👎)
- Giveaway: `/giveaway start|end` (einfach; **ohne Persistenz** bei Restart)
- Embed Builder: `/embed send`

## Nicht (voll) umgesetzt

- Musik/Voice-Monitoring (weggelassen)
- Ticket: mehrere Buttons in *einem* Embed (aktuell: ein Button pro Panel; du kannst aber unendlich Panels erstellen)
- Webpanel: aktuell Fokus auf Kern-Settings (IDs + Module). Erweiterbar.

## 1) Discord App + Bot anlegen

1. Discord Developer Portal -> New Application
2. **Bot** erstellen -> Token kopieren (nur in Railway als Variable eintragen)
3. **OAuth2**:
   - Redirect URL: `https://DEIN-RAILWAY-URL/oauth/callback`
   - Scopes: `bot`, `applications.commands`, `identify`
4. Bot-Intents aktivieren:
   - Server Members Intent
   - Message Content Intent

## 2) GitHub Repo

1. Inhalt dieses Ordners in ein neues GitHub Repo pushen.
2. **Wichtig:** `.env` nicht committen (ist in `.gitignore`).

## 3) Railway (Deploy Schritt-für-Schritt)

### A) Project erstellen

1. Railway -> New Project -> Deploy from GitHub Repo
2. Wähle dein Repo aus.

### B) Postgres hinzufügen (für Settings + Leveling)

1. Railway -> Add -> **PostgreSQL**
2. Railway setzt danach automatisch `DATABASE_URL` (oder du mapst sie in die Service-Variablen).

### C) Environment Variablen setzen (Service -> Variables)

Pflicht:

- `DISCORD_TOKEN` = Bot Token
- `DISCORD_APP_ID` = Application ID
- `OWNER_DISCORD_ID` = **deine** Discord User ID
- `GUILD_ID` = (empfohlen) Server ID, auf dem der Bot laufen soll
- `DATABASE_URL` = aus Railway Postgres
- `SESSION_SECRET` = langes Random Secret (mind. 10 Zeichen)
- `PUBLIC_BASE_URL` = `https://DEIN-RAILWAY-URL`
- `OAUTH_CLIENT_ID` = Application ID
- `OAUTH_CLIENT_SECRET` = OAuth2 Client Secret
- `OAUTH_REDIRECT_URI` = `https://DEIN-RAILWAY-URL/oauth/callback`

Optional:

- `PRISMA_AUTO_PUSH` = `true` (setzt DB Schema automatisch beim Start; empfohlen fürs erste Setup)

### D) Slash Commands deployen

Nach dem ersten Deploy (und wenn `DISCORD_TOKEN` + `DISCORD_APP_ID` gesetzt sind):

- In Railway (Service) -> Shell -> ausführen:
  - `npm run deploy:commands`

Wenn `GUILD_ID` gesetzt ist, sind die Commands **sofort** da. Ohne `GUILD_ID` als Global-Commands (kann bis zu 1h dauern).

### E) Webpanel öffnen

Öffne `https://DEIN-RAILWAY-URL/` -> Login -> `/guild` Settings.
Nur die Discord User ID in `OWNER_DISCORD_ID` bekommt Zugriff.

## 4) Bot konfigurieren (Minimal)

1. Discord -> User Settings -> Advanced -> **Developer Mode** aktivieren
2. IDs kopieren (Channels/Rollen)
3. Im Panel `/guild`:
   - `welcomeChannelId` setzen + Module `welcome` an
   - `logChannelId` setzen + Module `logging` an
   - `autoRoleId` setzen + Module `autoRole` an
   - `verifiedRoleId` setzen + Module `verification` an
   - `ticketCategoryId` setzen + Module `tickets` an
4. Tickets:
   - `/ticketpanel create ...`
   - `/ticketpanel send ...`

## Lokales Entwickeln (optional)

1. `cp .env.example .env` und Variablen setzen
2. `npm i`
3. `npx prisma db push` (braucht `DATABASE_URL`)
4. `npm run dev`

