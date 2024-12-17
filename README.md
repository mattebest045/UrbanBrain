# **UrbanBrain**

Basi di Dati - Ingegneria delle Tecnologie Informatiche - Università degli studi di Parma	
Anno 2024

## **Smart City Management System**

Il progetto si propone di sviluppare un servizio web innovativo per la gestione di una o più **smart city**, unendo tecnologia e sostenibilità per trasformare il modo in cui le città moderne operano e interagiscono con i cittadini. Il sistema offrirà funzionalità avanzate per monitorare e controllare diversi aspetti urbani, tra cui la qualità dell'aria, l'illuminazione pubblica, il consumo energetico, la gestione dei rifiuti, e molto altro.

Grazie all'integrazione di sensori IoT, dati in tempo reale e una solida infrastruttura basata su database relazionali, il servizio sarà in grado di analizzare e ottimizzare le operazioni urbane, riducendo gli sprechi e migliorando l'efficienza complessiva. L'obiettivo principale è quello di garantire un ambiente più sicuro, sostenibile ed efficiente per tutti gli abitanti, aumentando al contempo la trasparenza e l'accessibilità dei servizi pubblici.

Un aspetto distintivo del progetto è l'introduzione di una componente **social**, che mira a favorire la partecipazione attiva dei cittadini. Attraverso una piattaforma interattiva, gli utenti potranno inviare commenti, suggerimenti o segnalazioni di problemi direttamente alle autorità competenti, facilitando una comunicazione bidirezionale. Questa funzionalità non solo consente ai cittadini di contribuire attivamente al miglioramento della città, ma offre anche agli amministratori pubblici uno strumento prezioso per rilevare e affrontare criticità in modo tempestivo.

In definitiva, questo progetto rappresenta un passo avanti verso la creazione di città più intelligenti, connesse e orientate al benessere collettivo, sfruttando appieno le potenzialità della trasformazione digitale.

## 🛠️ **Tecnologie e Strumenti Utilizzati**

### **Linguaggi**

-   **Frontend**: HTML, CSS (Bootstrap), JavaScript (AJAX, Highcharts), Tex
-   **Backend**: Python (Faker), PHP

### **Database**

-   **Gestore**: MySQL
-   **Modello**: Relazionale
-   **Struttura**: Basato su una serie di tabelle per il monitoraggio delle città presenti nel database

### **Librerie e Framework**

-   **Bootstrap** - Bootstrap è una libreria di strumenti liberi per la creazione di siti e applicazioni per il Web. Essa contiene modelli di progettazione basati su HTML e CSS, sia per la tipografia, che per le varie componenti dell'interfaccia, come moduli, pulsanti e navigazione, così come alcune estensioni opzionali di JavaScript.
-   **AJAX** - AJAX è un insieme di tecniche e metodologie di sviluppo software per la realizzazione di applicazioni web interattive, basandosi su uno scambio di dati in background fra web browser e server, consentendo così l'aggiornamento dinamico di una pagina web senza esplicito ricaricamento da parte dell'utente.
- **Highcharts** - Highcharts è una libreria di grafici JavaScript basata sul rendering SVG. Presentata come variante della libreria Chart.js, una libreria JavaScript open source che consente di disegnare diversi tipi di grafici utilizzando l'elemento canvas HTML. Highcharts, invece, è una libreria di grafici scritta in puro JavaScript, per aggiungere grafici interattivi a un sito Web o a un'applicazione Web.

### **Strumenti di Lavoro**

-   **IDE/Editor**: Visual Studio Code, StackEdit, Overleaf
-   **Code Hosting**: Git ([GitHub Repository](https://github.com/mattebest045/UrbanBrain)),
-   **Database Hosting**: Altervista (phpMyAdmin)
-   **Progettazione Database**: draw.io, dbdiagram.io

## 📊 **Struttura del Database**

### **Schema Concettuale**

![Schema E/R](https://mattebest045.github.io/UrbanBrain/desing_db/schema_scheletro.drawio.png)

----------
### **Schema Logico**

-   **Utente**(**`IDUtente`**, `Nome`, `Cognome`, `DataNascita`, *`Email`*, *`Telefono`*, `Indirizzo`)
-   **Operatore**(**`IDOperatore`**, **`DataInizio`**, **`DataFine`**, `Email`, `Tipo`, `Ruolo`, `Stato`, `Password`)
-   **Cittadino**(**`IDCittadino`**, `Stato`, `DataRegistrazione`, `Password`)
-   **SuperAdmin**(**`IDSuperAdmin`**, `Ruolo`, **`DataAssegnazioneRuolo`**, `Stato`, `UltimoAccesso`, `Password`)
-   **Città**(**`IDCitta`**, `Nome`, `Regione`)
-   **RisorsaPubblica**(**`IDRisorsaPubblica`**, `Nome`, `Tipo`)
-   **SpesaPubblica**(**`idRisorsaPubblica`**, **`idCitta`**, **`idOperatore`**, `Data`, `Costo`, `Stato`)
-   **Dato**(**`idSensore`**, `Data`, `Valore`)
-   **Sensore**(**`IDSensore`**, **`idCitta`**, `Posizione`, `Tipo`, `DataInstallazione`, `Stato`)
-   **Evento**(**`IDEvento`**, `Nome`, `Luogo`, `NPosti`, `Descrizione`, `Data`, `Stato`)
-   **Creazione**(**`idCitta`**, **`idEvento`**, **`idOperatore`**, `Data`, `Segnalazione`)
-   **Partecipazione**(`idCitta`, `idEvento`, `idCittadino`, `DataPartecipazione`, `Segnalazione`)
-   **Feedback**(**`IDFeedback`**, `Tipo`)
-   **Segnalazione**(**`IDSegnalazione`**, **`idCitta`**, **`idFeedback`**, **`idCittadino`**, `Data`, `Descrizione`, `Foto`)
-   **Log**(**`IDLog`**, **`idUtente`**, **`Data`**, `Descrizione`)

### **Glossario**
Il campo **evidenziato** indica una chiava primaria.
Il campo in *corsivo* indica un campo univoco.
Per convenzione indichiamo come primary key un campo che inizia con "ID", mentre come foreign key un campo che inizia con "id", ad esempio: `IDSensore` (primary key) e `idSensore` (foreign key).
Il campo `Sensore.Posizione` è un attributo composto utilizzato per rappresentare le coordinate geografiche del sensore in gradi decimali (DD), include le componenti:

 - Latitudine: valore numerico in gradi decimali che rappresenta la distanza del punto dall'equatore, con i valori compresi tra [-90 (Sud), +90 (Nord)];
 - Longitudine: valore numerico in gradi decimali che rappresenta la distanza del punto dal Meridiano di Greenwich, con i valori compresi tra [-180 (Ovest), +180 (Est)].

----------

### **Schema Fisico**

![Schema Fisico](https://mattebest045.github.io/UrbanBrain/desing_db/schema_concettuale.png)

----------

### **Schema E/R Completo** ([dbdiagram](https://dbdocs.io/mattebest045/UrbanBrain/v/1?view=relationships))

![Schema E/R Completo](https://mattebest045.github.io/UrbanBrain/desing_db/diagramma_db.png)

## 🚀 **Come Eseguire il Progetto**

 - Aprire direttamente la piattaforma caricata in rete [UrbanBrain](https://urbanbrain.altervista.org/) 

## 📂 **Struttura della Repository**

Di seguito vengono riportati i file principali del progetto, vengono omessi nello schema i file secondari o puramente grafici per una migliore leggibilità dello schema.

```
📦 UrbanBrain
├── 📁 css
│   ├── bootstrap.min.css
│   └── template.min.css
├── 📁 db_menagement
│   ├── 📁 populamento (cartella populamento singole tabelle)
│	│   ├── citta.sql
│	│   ├── cittadino.sql
│	│   └── ...
│   ├── database.sql (struttura tabelle database)
│   ├── populamento.py
│   └── populo_db.sql (populamento intero database)
├── 📁 images
│   ├── logo_chiaro.png
│   └── logo_scuro.png
│   └── ...
├── 📁 js
│   ├── highcharts.js (caricamento libreria direttamente da server)
│   ├── check_session.js
│   ├── bootstrap.bundle.min.js
│   ├── custom.js
│   └── dashboard.js
├── 📁 php
│   ├── chack_session.php
│   ├── connessione_db.php
│   ├── dashboard.php
│   ├── dati_charts.php
│   ├── logout.php
│   ├── query.php
│   └── login.php
├── area_utente.html
├── dashboard.html
├── index.html
├── signup.html
└── README.md

```

## 📌 **Autori**

-   **Alessandro Bertani** - Matricola **346193** - Full Stack Developer
-   **Matteo Bestetti** - Matricola **344438** - Full Stack Developer
