# Specifica Tecnica: Sicurezza Ordinazioni tramite QR Code (Host & Guest con PIN)

Questo documento descrive l'architettura di sicurezza per impedire ordini e prenotazioni abusive da parte di utenti esterni o da tavoli adiacenti, implementando il pattern **"Tavolo Proprietario" (Host/Guest con PIN)** in un ambiente **Next.js (App Router) + Supabase**.

---

## 1. Architettura dei Dati (Supabase)

Per gestire lo stato dei tavoli e le sessioni attive, è necessaria una tabella in Supabase chiamata `tavoli_attivi` (o `table_sessions`):

```sql
create table public.tavoli_attivi (
  id uuid default gen_random_uuid() primary key,
  numero_tavolo integer not null check (numero_tavolo > 0),
  stato text not null default 'attivo' check (stato in ('attivo', 'completato')),
  host_token uuid not null default gen_random_uuid(),
  pin text not null check (length(pin) = 4),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Indice per velocizzare le query sul tavolo attivo
create index idx_tavoli_attivi_numero on public.tavoli_attivi(numero_tavolo) where (stato = 'attivo');
```

### Dettaglio dei campi:
*   `host_token`: Token UUID segreto generato dal server. Viene salvato nei cookie del browser di chi ha scansionato per primo (il proprietario/Host).
*   `pin`: Codice temporaneo di 4 cifre (es: `4829`) mostrato a schermo all'Host, necessario per autorizzare amici/ospiti.
*   `expires_at`: Timestamp impostato a `now() + interval '3 hours'` per la scadenza automatica e pulizia del tavolo.

---

## 2. Flusso Logico delle API (Next.js Route Handlers)

Le interazioni con il database avvengono interamente lato server tramite API di Next.js per garantire l'impossibilità di bypassare i controlli lato client.

### API 1: Verifica Stato Tavolo
*   **Rotta**: `GET /api/tavolo/stato?numero=[X]`
*   **Comportamento**:
    1. Cerca nel database una riga in `tavoli_attivi` dove `numero_tavolo = X` e `stato = 'attivo'` ed `expires_at > now()`.
    2. **Se la sessione NON esiste**:
        *   Ritorna `{ status: "libero" }`.
    3. **Se la sessione ESISTE**:
        *   Legge il cookie sicuro `host_token` o `guest_token` inviato dal browser del client.
        *   **Se il token corrisponde** a quello registrato per la sessione:
            *   Ritorna `{ status: "autorizzato", ruolo: "host" | "guest", pin: pin }`.
        *   **Se il token NON corrisponde o è assente**:
            *   Ritorna `{ status: "bloccato" }` (mostrando la schermata di inserimento PIN).

---

### API 2: Attivazione Tavolo (Primo Scansione)
*   **Rotta**: `POST /api/tavolo/attiva`
*   **Payload**: `{ "numero_tavolo": X }`
*   **Comportamento**:
    1. Verifica che non ci sia già una sessione attiva per il tavolo.
    2. Genera un PIN di 4 cifre casuale (es. `4829`).
    3. Genera un `host_token` UUID casuale.
    4. Inserisce la riga in `tavoli_attivi` con scadenza a +3 ore.
    5. Imposta un cookie sicuro nel browser del client:
        *   `Set-Cookie: host_token=[UUID]; HttpOnly; Secure; SameSite=Strict; Path=/`
    6. Ritorna `{ "success": true, "pin": "4829" }`.

---

### API 3: Convalida PIN (Per amici/ospiti)
*   **Rotta**: `POST /api/tavolo/valida-pin`
*   **Payload**: `{ "numero_tavolo": X, "pin_inserito": "YYYY" }`
*   **Comportamento**:
    1. Cerca la sessione attiva del tavolo.
    2. Confronta `pin_inserito` con il PIN reale nel database.
    3. **Se il PIN è corretto**:
        *   Genera un `guest_token` UUID casuale (oppure usa un array di guest_tokens sulla stessa riga, o una tabella di associazione).
        *   Imposta il cookie sicuro sul browser dell'ospite:
            *   `Set-Cookie: guest_token=[UUID]; HttpOnly; Secure; SameSite=Strict; Path=/`
        *   Ritorna `{ "success": true }`.
    4. **Se il PIN è errato**:
        *   Ritorna `{ "success": false, "error": "PIN non valido" }`.

---

### API 4: Chiusura Sessione (Staff o Cassa)
*   **Rotta**: `POST /api/tavolo/libera`
*   **Payload**: `{ "numero_tavolo": X }`
*   **Comportamento** (riservato allo staff autenticato):
    1. Imposta `stato = 'completato'` per la sessione attiva del tavolo.
    2. Ritorna `{ "success": true }`. Da questo momento il tavolo è nuovamente disponibile per una nuova scansione.

---

## 3. Esperienza Utente (UX) e Protezione dagli Intrusi

### Scenario di Esempio (Tommaso al Tavolo 1, Antonio al Tavolo 2):
1. **Tommaso** arriva al Tavolo 1, scansiona il QR ed entra nella pagina `/tavolo/1`.
2. Il sistema riconosce il tavolo come *Libero*, crea la sessione e assegna a Tommaso il ruolo di **Host**.
3. Il browser di Tommaso mostra il menu e un banner in alto:
   > 👑 **Tavolo 1 Attivo** | PIN amici: **4829**
4. Tommaso va in bagno. **Antonio** (Tavolo 2) si alza, va al Tavolo 1 e scansiona lo stesso QR.
5. Il telefono di Antonio rileva una sessione già attiva, ma non ha il cookie di Tommaso.
6. La pagina mostra una **Schermata di Blocco** che richiede il PIN di 4 cifre.
7. Antonio non conosce il PIN (che è visibile solo sullo schermo del telefono di Tommaso), quindi non può ordinare a nome del Tavolo 1.
8. Un amico legittimo di Tommaso, invece, può inserire il PIN fornito a voce da Tommaso per sbloccare il menu sul proprio smartphone e ordinare in sicurezza.

---

## 4. Best Practices di Sicurezza implementate

1.  **Cookie HttpOnly**: L'`host_token` e il `guest_token` sono memorizzati in cookie con flag `HttpOnly`. Questo significa che non possono essere letti da script JavaScript esterni, proteggendo il sistema da attacchi XSS.
2.  **Rate Limiting sul PIN**: Per evitare che Antonio provi ad indovinare il PIN con attacchi a forza bruta (brute-force) mentre Tommaso è via, l'API `/api/tavolo/valida-pin` deve implementare un blocco temporaneo dell'indirizzo IP dopo 3 tentativi errati consecutivi.
3.  **Scadenza temporale assoluta (`expires_at`)**: Garantisce che se un cliente dimentica di chiudere la sessione a fine pasto, il tavolo si sblocchi automaticamente dopo poche ore.
