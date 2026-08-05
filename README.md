# zamasu

Bot Discord per tenere traccia dell'ordine di chi vuole intervenire in una chat vocale — una coda "alzata di mano" gestita tramite comandi slash.

La coda è indipendente per ogni server: se il bot viene aggiunto a più server, ognuno ha la propria lista separata.

## Comandi

| Comando | Descrizione |
|---|---|
| `/iscriviti` | Ti aggiunge in fondo alla coda per parlare |
| `/ritirati` | Ti rimuove dalla coda |
| `/lista` | Mostra chi è in turno, chi è il prossimo e il resto della coda |
| `/prossimo` | Fa avanzare il turno al successivo in coda |
| `/salta` | Sposta chi è in turno in fondo alla coda senza rimuoverlo |
| `/rimuovi` | Rimuove un utente specifico dalla coda |
| `/svuota` | Svuota completamente la coda |
| `/aiuto` | Mostra l'elenco dei comandi |

## Setup

1. Crea un'applicazione e un bot su [Discord Developer Portal](https://discord.com/developers/applications).
2. Copia `.env.example` in `.env` e compila `DISCORD_TOKEN` e `CLIENT_ID`. `GUILD_ID` è opzionale: se impostato, i comandi vengono registrati solo su quel server (propagazione istantanea, utile in sviluppo); se lasciato vuoto, i comandi vengono registrati globalmente (propagazione fino a un'ora, per produzione).
3. Installa le dipendenze:
   ```
   npm install
   ```
4. Registra i comandi slash su Discord:
   ```
   npm run deploy-commands
   ```
5. Avvia il bot:
   ```
   npm start
   ```

La coda viene salvata in `data/queues.json` e sopravvive ai riavvii del bot.

## Aggiungi il bot al tuo server

Chiunque può invitare il bot sul proprio server con un link OAuth2 con scope `bot` e `applications.commands` (nessun permesso speciale richiesto, perché le risposte ai comandi slash non passano dai permessi canale):

```
https://discord.com/oauth2/authorize?client_id=<CLIENT_ID>&scope=bot+applications.commands&permissions=0
```

Sostituisci `<CLIENT_ID>` con il Client ID della tua applicazione. Se i comandi sono registrati globalmente (`GUILD_ID` non impostato in `.env`), saranno disponibili automaticamente su ogni server che invita il bot.
