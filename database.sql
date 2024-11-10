CREATE DATABASE IF NOT EXISTS urbanbrain_db; # Creazione del db
DEFAULT CHARACTER SET utf8mb4; -- Setto il carattere definito per il db
DEFAULT COLLATE utf8mb4_general_ci; -- Specifico la regola di confronto del db

USE urbanbrain_db; -- Entro nel db 

/* CREAZIONE TABELLE */

/* Utente(IDUtente, Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) */
CREATE TABLE UTENTE(
    IDUtente int NOT NULL AUTO_INCREMENT,
    Nome varchar(30) not null,
    Cognome varchar(30) not null,
    DataNascita date not null, 
    Email varchar(50) not null UNIQUE, 
    Telefono varchar(13) not null UNIQUE, /* Considero anche il prefisso. es: '+39' */
    Indirizzo varchar(80) not null, /* Comprende via e città. es: "Via rossi, 53, Roma"*/
    PRIMARY KEY(IDUtente)
)

/* Operatore(IDOperatore, DataInizio, DataFine, Email, Tipo, Ruolo) */
CREATE TABLE OPERATORE(
    IDOperatore int not null,
    DataInizio date not null,
    DataFine date not null DEFAULT '9999-12-31', /*  */
    Email varchar(50) not null UNIQUE,
    Tipo varchar(20),
    Ruolo varchar(20),
    PRIMARY KEY(IDOperatore, DataInizio, DataFine)
)
/* 3 modi per gestire il campo DataFine: 
    1. Default con data futura -> DataFine DATE NOT NULL DEFAULT '9999-12-31'
    2. Uso di un dominio -> DataFine DATE DEFAULT NULL,  -- NULL rappresenta "indeterminato" (C'è da aggiungere un controllo ulteriore durante l'inserimento dei dati)
    3. Colonna aggiuntiva per il tipo di contratto -> DataFine DATE,
                                                      ContrattoIndeterminato BOOLEAN DEFAULT FALSE,
*/
/* Cittadino(IDCittadino, Stato, DataRegistrazione) */
CREATE TABLE CITTADINO(
    IDCittadino int not null,
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)), /* Controllo ulteriore per inserire solo i valori corretti */
    DataRegistrazione date not null,
    PRIMARY KEY(IDCittadino)
)
/* Valori possibili del campo Stato:
    - 0: Attivo
    - 1: In fase di approvazione Da un SuperAdmin
    - 2: Sospeso
    - 3: Disattivato
*/

/* SuperAdmin(IDSuperAdmin, Ruolo, DataAssegnazioneRuolo, Stato, UltimoAccesso) */
CREATE TABLE SUPERADMIN(
    IDSuperAdmin int not null, 
    Ruolo varchar(20) not null,
    DataAssegnazioneRuolo DATE not null, 
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)),
    UltimoAccesso datetime not null, /* format: 'YYYY-MM-DD hh:mm:ss' */
    PRIMARY KEY(IDSuperAdmin, DataAssegnazioneRuolo)
)

/* Citta(IDCitta, Nome, Regione) */
CREATE TABLE CITTA(
    IDCitta int not null AUTO_INCREMENT, 
    Nome varchar(40) not null,
    Regione varchar(2) not null, 
    PRIMARY KEY(IDCitta)
)

/* RisorsaPubblica(IDRisorsaPubblica, Nome, Tipo, Stato) */
CREATE TABLE RISORSAPUBBLICA(
    IDRisorsaPubblica int not null AUTO_INCREMENT, 
    Nome varchar(40) not null, 
    Tipo varchar(30),
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)),
    PRIMARY KEY(IDRisorsaPubblica)
)

/* SpesaPubblica(idRisorsaPubblica, idCitta, idOperatore, Data, Costo) */
-- Ricorda: ALT + 96: `
CREATE TABLE SPESAPUBBLICA(
    idRisorsaPubblica int not null, 
    idCitta int not null,
    idOperatore int not null, 
    `Data` date not null, 
    Costo decimal(10, 2) not null, /* 10 cifre di cui 2 decimali */
    PRIMARY KEY(idRisorsaPubblica, idCitta, idOperatore)
)

/* Dato(idSensore, Data, Valore) */
CREATE TABLE DATO(
    idSensore int not null,
    `Data` datetime not null, /* Se vuoi approfondire possiamo anche includere le frazioni di secondi ahahahaaha */
    Valore double not null, 
    PRIMARY KEY(idSensore)
)

/* Sensore(IDSensore, idCitta, Posizione, Tipo, DataInstallazione, Stato) */
/* Evento(IDEvento, Nome, Luogo, NPosti, Descrizione, Data, Stato) */
/* Creazione(idCitta, idEvento, idOperatore, Data, Ruolo) */
/* Registrazione(idCitta, idEvento, idCittadino, DataRegistrazione, Segnalazione) */
/* Feedback(IDFeedback, Tipo) */
/* Segnalazione(IDSegnalazione, idCitta, idFeedback, idCittadino, Data, Descrizione) */
/* Log(IDLog, idUtente, Data, Descrizione) */