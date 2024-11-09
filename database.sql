CREATE DATABASE IF NOT EXISTS urbanbrain_db; # Creazione del db
USE urbanbrain_db; # Entro nel db 

/* CREAZIONE TABELLE */

/* Utente(IDUtente, Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) */
CREATE TABLE UTENTE(
    IDUtente int NOT NULL AUTO_INCREMENT,
    Nome varchar(30) not null,
    Cognome varchar(30) not null,
    DataNascita DATE not null, 
    Email varchar(50) not null UNIQUE, 
    Telefono varchar(13) not null UNIQUE, /* Considero anche il prefisso. es: '+39' */
    Indirizzo varchar(80) not null, /* Comprende via e città. es: "Via rossi, 53, Roma"*/
    PRIMARY KEY(IDUtente)
)

/* Operatore(IDOperatore, DataInizio, DataFine, Email, Tipo, Ruolo) */
/* Cittadino(IDCittadino, Stato, DataRegistrazione) */
/* SuperAdmin(IDSuperAdmin, Ruolo, DataAssegnazioneRuolo, Stato, UltimoAccesso) */
/* Citt`a(IDCitta, Nome, Regione) */
/* RisorsaPubblica(IDRisorsaPubblica, Nome, Tipo, Stato) */
/* SpesaPubblica(idRisorsaPubblica, idCitta, idOperatore, Data, Costo) */
/* Dato(idSensore, Data, Valore) */
/* Sensore(IDSensore, idCitta, Posizione, Tipo, DataInstallazione, Stato) */
/* Evento(IDEvento, Nome, Luogo, NPosti, Descrizione, Data, Stato) */
/* Creazione(idCitta, idEvento, idOperatore, Data, Ruolo) */
/* Registrazione(idCitta, idEvento, idCittadino, DataRegistrazione, Segnalazione) */
/* Feedback(IDFeedback, Tipo) */
/* Segnalazione(IDSegnalazione, idCitta, idFeedback, idCittadino, Data, Descrizione) */
/* Log(IDLog, idUtente, Data, Descrizione) */