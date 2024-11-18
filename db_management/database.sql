/* CREAZIONE DEL DB */
CREATE DATABASE IF NOT EXISTS UrbanBrain
DEFAULT CHARACTER SET utf8mb4 /* Setto il carattere definito per il db */
DEFAULT COLLATE utf8mb4_general_ci; /* Specifico la regola di confronto del db */

USE UrbanBrain; -- Entro nel db 

/* CREAZIONE TABELLE */

/* Utente(IDUtente, Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) */
CREATE TABLE UTENTE(
    IDUtente int AUTO_INCREMENT, /* AUTO_INCREMENT include in automatico not null, evito di inserirlo*/
    Nome varchar(30) not null,
    Cognome varchar(30) not null,
    DataNascita date not null, 
    Email varchar(50) not null UNIQUE, 
    Telefono varchar(13) not null UNIQUE, /* Considero anche il prefisso. es: '+39' */
    Indirizzo varchar(80) not null, /* Comprende via e città. es: "Via rossi, 53, Roma"*/
    PRIMARY KEY(IDUtente)
);

/* Operatore(IDOperatore, DataInizio, DataFine, Email, Tipo, Ruolo, Password) */
CREATE TABLE OPERATORE(
    IDOperatore int not null,
    DataInizio date not null,
    DataFine date not null DEFAULT '9999-12-31', /* Il default indica un tempo indeterminato per il lavoro diun operatore */
    Email varchar(50) not null, /* Non è unique per comprendere anche operatori con mail aziendali non personali */
    Tipo varchar(30),
    Ruolo varchar(30),
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)), /* Controllo ulteriore per inserire solo i valori corretti */
    Password varchar(64) not null, /* SHA-256 produce un hash di 64 caratteri */
    PRIMARY KEY(IDOperatore, DataInizio, DataFine)
);
/* Valori possibili del campo Stato:
    - 0: Attivo
    - 1: In fase di approvazione Da un SuperAdmin
    - 2: Sospeso
    - 3: Eliminato
*/

/* Cittadino(IDCittadino, Stato, DataRegistrazione, Password) */
CREATE TABLE CITTADINO(
    IDCittadino int not null,
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)), 
    DataRegistrazione date not null,
    Password varchar(64) not null, /* SHA-256 produce un hash di 64 caratteri */
    PRIMARY KEY(IDCittadino)
);

/* SuperAdmin(IDSuperAdmin, Ruolo, DataAssegnazioneRuolo, Stato, UltimoAccesso, Password) */
CREATE TABLE SUPERADMIN(
    IDSuperAdmin int not null, 
    Ruolo varchar(20) not null,
    DataAssegnazioneRuolo DATE not null, 
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)),
    UltimoAccesso datetime not null, /* format: 'YYYY-MM-DD hh:mm:ss' */
    Password varchar(64) not null, /* SHA-256 produce un hash di 64 caratteri */
    PRIMARY KEY(IDSuperAdmin, DataAssegnazioneRuolo)
);

/* Citta(IDCitta, Nome, Regione) */
CREATE TABLE CITTA(
    IDCitta int AUTO_INCREMENT, 
    Nome varchar(40) not null,
    Regione varchar(18) not null, 
    PRIMARY KEY(IDCitta)
);

/* RisorsaPubblica(IDRisorsaPubblica, Nome, Tipo) */
CREATE TABLE RISORSAPUBBLICA(
    IDRisorsaPubblica int AUTO_INCREMENT, 
    Nome varchar(40) not null, 
    Tipo varchar(30),
    PRIMARY KEY(IDRisorsaPubblica)
);

/* SpesaPubblica(idRisorsaPubblica, idCitta, idOperatore, Data, Costo, Stato) */
-- Ricorda: ALT + 96: `
CREATE TABLE SPESAPUBBLICA(
    idRisorsaPubblica int not null, 
    idCitta int not null,
    idOperatore int not null, 
    `Data` date not null, 
    Costo decimal(10, 2) not null, /* 10 cifre di cui 2 decimali */
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)),
    PRIMARY KEY(idRisorsaPubblica, idCitta, idOperatore)
);

/* Sensore(IDSensore, idCitta, Posizione, Tipo, DataInstallazione, Stato) */
CREATE TABLE SENSORE(
    IDSensore int AUTO_INCREMENT,
    idCitta int not null, 
    Latitudine DECIMAL(9, 6) NOT NULL,  -- Precisione per gradi decimali
    Longitudine DECIMAL(9, 6) NOT NULL,
    Tipo varchar(30) not null,
    DataInstallazione DATE not null, 
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)),
    PRIMARY KEY(IDSensore, idCitta)
);

/* Dato(idSensore, Data, Valore) */
CREATE TABLE DATO(
    idSensore int not null,
    `Data` datetime not null, 
    Valore double, 
    PRIMARY KEY(idSensore, `Data`)
);

/* Evento(IDEvento, Nome, Luogo, NPosti, Descrizione, Data, Stato) */
CREATE TABLE EVENTO(
    IDEvento int AUTO_INCREMENT,
    Nome varchar(50) not null,
    Luogo varchar(100) not null,
    NPosti INT DEFAULT -1 CHECK (NPosti > 0 OR NPosti = -1), /* -1 indica i posti illimitati */
    Descrizione text,
    `Data` date not null,
    Stato int not null CHECK (Stato IN (0, 1, 2, 3)),
    PRIMARY KEY(IDEvento)
);

/* Creazione(idCitta, idEvento, idOperatore, Data, Segnalazione) */
CREATE TABLE CREAZIONE(
    idCitta int, /* NULL solo se l'evento è online */
    idEvento int not null,
    idOperatore int not null, 
    `Data` date not null,
    Segnalazione text DEFAULT NULL, 
    PRIMARY KEY(idCitta, idEvento, idOperatore)
);

/* Partecipazione(idCitta, idEvento, idCittadino, DataPartecipazione, Segnalazione) */
CREATE TABLE PARTECIPAZIONE(
    idCitta int, /* NULL solo se l'evento è online */
    idEvento int not null,
    idCittadino int not null, 
    DataPartecipazione date not null,
    Segnalazione text DEFAULT NULL,
    PRIMARY KEY(idCitta, idEvento, idCittadino)
);

/* Feedback(IDFeedback, Tipo) */
CREATE TABLE FEEDBACK(
    IDFeedback int AUTO_INCREMENT,
    Tipo varchar(20) not null,
    PRIMARY KEY(IDFeedback) 
);

/* Segnalazione(IDSegnalazione, idCitta, idFeedback, idCittadino, Data, Descrizione, Foto) */
CREATE TABLE SEGNALAZIONE(
    IDSegnalazione int AUTO_INCREMENT,
    idCitta int, /* NULL solo se è un feedback di un evento online */
    idFeedback int not null,
    idCittadino int not null,
    `Data` date not null,
    Descrizione text,
    Foto varchar(255),
    PRIMARY KEY(IDSegnalazione, idCitta, idFeedback, idCittadino)
);

/* Log(IDLog, idUtente, Data, Descrizione) */
CREATE TABLE LOG(
    IDLog int AUTO_INCREMENT,
    idUtente int not null,
    `Data` date not null,
    Descrizione text,
    PRIMARY KEY(IDLog, idUtente)
);

/* RELAZIONI (FK -> PK) */
/* Operatore.IDOperatore -> Utente.IDUtente */
ALTER TABLE OPERATORE
ADD FOREIGN KEY(IDOperatore) REFERENCES UTENTE(IDUtente);

/* Cittadino.IDCittadino -> Utente.IDUtente */
ALTER TABLE CITTADINO
ADD FOREIGN KEY(IDCittadino) REFERENCES UTENTE(IDUtente);

/* SuperAdmin.idSuperAdmin -> Utente.IDUtente */
ALTER TABLE SUPERADMIN
ADD FOREIGN KEY(idSuperAdmin) REFERENCES UTENTE(IDUtente);

/* SpesaPubblica.idCitta -> Citta.IDCitta */
ALTER TABLE SPESAPUBBLICA
ADD FOREIGN KEY(idCitta) REFERENCES CITTA(IDCitta);

/* SpesaPubblica.idRisorsaPubblica -> RisorsaPubblica.IDRisorsaPubblica */
ALTER TABLE SPESAPUBBLICA
ADD FOREIGN KEY(idRisorsaPubblica) REFERENCES RISORSAPUBBLICA(IDRisorsaPubblica);

/* SpesaPubblica.idOperatore -> Operatore.IDOperatore */
ALTER TABLE SPESAPUBBLICA
ADD FOREIGN KEY(idOperatore) REFERENCES OPERATORE(IDOperatore);

/* Sensore.idCitta -> Citta.IDCitta */
ALTER TABLE SENSORE
ADD FOREIGN KEY(idCitta) REFERENCES CITTA(IDCitta);

/* Dato.idSensore -> Sensore.IDSensore */
ALTER TABLE DATO
ADD FOREIGN KEY(idSensore) REFERENCES SENSORE(IDSensore);

/* Creazione.idCitta -> Citta.IDCitta */
ALTER TABLE CREAZIONE
ADD FOREIGN KEY(idCitta) REFERENCES CITTA(IDCitta);

/* Creazione.idEvento -> Evento.IDEvento */
ALTER TABLE CREAZIONE
ADD FOREIGN KEY(idEvento) REFERENCES EVENTO(IDEvento);

/* Creazione.idOperatore -> Operatore.IDOperatore */
ALTER TABLE CREAZIONE
ADD FOREIGN KEY(idOperatore) REFERENCES OPERATORE(IDOperatore);

/* Partecipazione.idCitta -> Citta.IDCitta */
ALTER TABLE PARTECIPAZIONE
ADD FOREIGN KEY(idCitta) REFERENCES CITTA(IDCitta);

/* Partecipazione.idEvento -> Evento.IDEvento */
ALTER TABLE PARTECIPAZIONE
ADD FOREIGN KEY(idEvento) REFERENCES EVENTO(IDEvento);

/* Partecipazione.idCittadino -> Cittadino.IDCittadino */
ALTER TABLE PARTECIPAZIONE
ADD FOREIGN KEY(idCittadino) REFERENCES CITTADINO(IDCittadino);

/* Segnalazione.idCitta -> Citta.IDCitta */
ALTER TABLE SEGNALAZIONE
ADD FOREIGN KEY(idCitta) REFERENCES CITTA(IDCitta);

/* Segnalazione.idCittadino -> Cittadino.IDCittadino */
ALTER TABLE SEGNALAZIONE
ADD FOREIGN KEY(idCittadino) REFERENCES CITTADINO(IDCittadino);

/* Segnalazione.idFeedback -> Feedback.IDFeedback */
ALTER TABLE SEGNALAZIONE
ADD FOREIGN KEY(idFeedback) REFERENCES FEEDBACK(IDFeedback);

/* Log.idUtente -> Utente.IDUtente*/
ALTER TABLE LOG
ADD FOREIGN KEY(idUtente) REFERENCES UTENTE(IDUtente);