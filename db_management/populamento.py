from faker import Faker
from datetime import datetime, timedelta
import random
import string
import hashlib
import os
import glob

def elimina_sql_files():
    # Trova tutti i file con estensione .sql nella directory corrente
    sql_files = glob.glob("db_management/populamento/*.sql")
    
    for file in sql_files:
        try:
            os.remove(file)
            print(f"File '{file}' eliminato con successo.")
        except Exception as e:
            print(f"Errore durante l'eliminazione di '{file}': {e}")

def genera_password(password=None):
    # Se non viene fornita una password, generane una casuale di 12 caratteri
    if password is None:
        characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(characters) for _ in range(12))

    # Crittografa la password con SHA-256
    sha_signature = hashlib.sha256(password.encode()).hexdigest()
    return sha_signature

# Gnera una data per la registrazione tra il 2 settembre fino ad oggi
def generaDataRegistrazione():
    # Definiamo le date di inizio e di fine per il range
    start_date = datetime(2009, 9, 2) # Ipotizziamo sia questa la prima data in cui i cittadini abbiano potuto registrarsi nel db
    end_date = datetime.now()

    # Calcoliamo la differenza in giorni tra le due date
    delta = end_date - start_date

    # Generiamo un numero casuale di giorni da aggiungere alla data di inizio
    random_days = random.randint(0, delta.days)

    # Restituiamo la data casuale aggiungendo i giorni casuali alla data di inizio
    data_registrazione = start_date + timedelta(days=random_days)
    return data_registrazione.strftime('%Y-%m-%d')  # Formato per SQL

# Funzione per generare una data di inizio casuale tra il 2 settembre 2009 e oggi
def genera_data_inizio():
    start_date = datetime(2009, 9, 2)
    end_date = datetime.now()
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    data_inizio = start_date + timedelta(days=random_days)
    return data_inizio

# Funzione per generare una data di fine casuale o NULL
def genera_data_fine(data_inizio):
    # 20% di probabilità che il lavoro sia a tempo indeterminato (DataFine = NULL)
    if random.random() < 0.2:
        return "NULL"
    else:
        end_date_limit = datetime(2026, 12, 31)
        start_date = data_inizio + timedelta(days=1)  # DataFine almeno un giorno dopo DataInizio
        delta = (end_date_limit - start_date).days
        random_days = random.randint(0, delta)
        data_fine = start_date + timedelta(days=random_days)
        return data_fine.strftime('%Y-%m-%d')

# Funzione per ottenere un IDCittadino univoco
def get_unique_id(lista_id):
    if lista_id:
        return lista_id.pop()  # Rimuove e restituisce l'ultimo ID disponibile
    else:
        raise ValueError("Non ci sono più IDCittadino disponibili")


# Definiamo le località che ci interessano
locales = [
    'el_GR', # Grecia
    'nl_NL', # Paesi Bassi
    'nl_BE', # Belgio
    'fr_FR', # Francia
    'es_ES', # Spagna
    'hu_HU', # Ungheria
    'it_IT', # Italia
    'ro_RO', # Romania
    'it_CH', # Svizzera (parte italiana)
    'de_AT', # Austria
    'en_GB', # Regno Unito
    'da_DK', # Danimarca
    'sv_SE', # Svezia
    'no_NO', # Norvegia
    'pl_PL', # Polonia
    'de_DE'  # Germania
]
prefissi_europei = [
    "+30",  # Grecia
    "+31",  # Paesi Bassi
    "+32",  # Belgio
    "+33",  # Francia
    "+34",  # Spagna
    "+36",  # Ungheria
    "+39",  # Italia
    "+40",  # Romania
    "+41",  # Svizzera
    "+43",  # Austria
    "+44",  # Regno Unito
    "+45",  # Danimarca
    "+46",  # Svezia
    "+47",  # Norvegia
    "+48",  # Polonia
    "+49",  # Germania
]
email_providers = {
    'el_GR': ['gmail.com', 'yahoo.gr', 'hotmail.gr'],
    'nl_NL': ['gmail.com', 'hotmail.nl', 'ziggo.nl'],
    'nl_BE': ['gmail.com', 'hotmail.be', 'proximus.be'],
    'fr_FR': ['gmail.com', 'orange.fr', 'hotmail.fr'],
    'es_ES': ['gmail.com', 'hotmail.es', 'yahoo.es'],
    'hu_HU': ['gmail.com', 'freemail.hu', 'citromail.hu'],
    'it_IT': ['gmail.com', 'libero.it', 'yahoo.it'],
    'ro_RO': ['gmail.com', 'yahoo.ro', 'hotmail.ro'],
    'it_CH': ['gmail.com', 'bluewin.ch', 'hotmail.ch'],
    'de_AT': ['gmail.com', 'gmx.at', 'hotmail.at'],
    'en_GB': ['gmail.com', 'hotmail.co.uk', 'yahoo.co.uk'],
    'da_DK': ['gmail.com', 'hotmail.dk', 'yahoo.dk'],
    'sv_SE': ['gmail.com', 'hotmail.se', 'telia.com'],
    'no_NO': ['gmail.com', 'hotmail.no', 'yahoo.no'],
    'pl_PL': ['gmail.com', 'wp.pl', 'o2.pl'],
    'de_DE': ['gmail.com', 'gmx.de', 'web.de']
}
tipi_operatori = {
    "Creatori di eventi": [
        "Organizzatore di eventi",
        "Responsabile logistico",
        "Coordinatore artistico",
        "Assistente eventi"
    ],
    "Operatori pubblici": [
        "Operatore trasporti pubblici",
        "Addetto alla raccolta rifiuti",
        "Supervisore aree verdi",
        "Addetto alla manutenzione stradale"
    ],
    "Funzionari comunali": [
        "Responsabile ufficio anagrafe",
        "Responsabile ufficio tributi",
        "Assistente amministrativo",
        "Supervisore ufficio tecnico"
    ],
    "Tecnici manutentori": [
        "Manutentore elettrico",
        "Manutentore idraulico",
        "Tecnico delle infrastrutture",
        "Supervisore squadre di manutenzione"
    ],
    "Agenti di sicurezza": [
        "Guardia giurata",
        "Operatore di videosorveglianza",
        "Responsabile pattugliamento",
        "Addetto al controllo accessi"
    ],
    "Analisti di dati urbani": [
        "Analista dei dati di traffico",
        "Analista ambientale",
        "Esperto in Big Data",
        "Data Scientist"
    ],
    "Addetti alle comunicazioni": [
        "Responsabile delle comunicazioni pubbliche",
        "Gestore social media",
        "Addetto stampa",
        "Comunicatore istituzionale"
    ],
    "Pianificatori urbani": [
        "Progettista di infrastrutture",
        "Esperto in urbanistica",
        "Consulente per la mobilità sostenibile",
        "Responsabile dello sviluppo urbano"
    ],
    "Gestori ambientali": [
        "Monitoraggio qualità dell'aria",
        "Gestore risorse idriche",
        "Tecnico delle energie rinnovabili",
        "Consulente ecologico"
    ],
    "Operatori di assistenza sociale": [
        "Addetto assistenza anziani",
        "Supporto alle famiglie",
        "Assistente servizi sociali",
        "Mediatore culturale"
    ]
}
ruoli_superadmin = [
    "System Administrator", # Gestisce e mantiene i server e i sistemi operativi, assicurandosi che l'infrastruttura tecnica sia sicura e aggiornata
    "Data Security Officer", # Supervisiona la sicurezza dei dati e assicura che tutte le informazioni siano protette da accessi non autorizzati
    "Network Architect", # Progetta e implementa le reti interne e i sistemi di comunicazione, garantendo che l'infrastruttura di rete sia efficiente e sicura
    "Compliance Manager", # Verifica che tutte le operazioni siano conformi alle normative e agli standard di sicurezza e privacy
    "Data Protection Officer (DPO)", # Responsabile della protezione dei dati personali e della conformità al GDPR o ad altre leggi sulla protezione dei dati
    "Audit Supervisor", # Esegue verifiche interne periodiche per garantire la sicurezza e l'integrità dei sistemi e dei dati
    "Incident Response Coordinator", # Gestisce le emergenze di sicurezza, come violazioni dei dati, e coordina le risposte per mitigare i danni
    "Infrastructure Manager", # Supervisiona l'infrastruttura IT e coordina gli aggiornamenti, le riparazioni e l'espansione dei sistemi
    "Service Manager", # Gestisce i servizi offerti dall’infrastruttura IT e assicura il rispetto dei livelli di servizio (SLA) per gli utenti finali
    "Risk Manager", # Identifica i rischi per la sicurezza e la continuità operativa e sviluppa piani di mitigazione
    "Policy Developer", # Scrive e aggiorna le policy interne su sicurezza, privacy e operazioni IT
    "Access Control Manager", # Gestisce i permessi di accesso e le autorizzazioni per i diversi utenti e operatori del sistema
    "Backup and Recovery Specialist", # Assicura che i dati siano regolarmente salvati e che i sistemi di recupero siano pronti in caso di necessità
    "Operations Supervisor", # Supervisiona l’efficienza delle operazioni giornaliere dei sistemi e coordina i team di supporto
    "Cybersecurity Analyst" # Analizza costantemente la sicurezza dei sistemi per rilevare e prevenire potenziali minacce.")
]
citta_e_regioni = [ # Esiste anche la città con nome "Online", utilizzata per gli eventi online
    ("Roma", "Lazio"),
    ("Milano", "Lombardia"),
    ("Napoli", "Campania"),
    ("Torino", "Piemonte"),
    ("Palermo", "Sicilia"),
    ("Genova", "Liguria"),
    ("Bologna", "Emilia-Romagna"),
    ("Firenze", "Toscana"),
    ("Bari", "Puglia"),
    ("Catania", "Sicilia"),
    ("Venezia", "Veneto"),
    ("Verona", "Veneto"),
    ("Messina", "Sicilia"),
    ("Padova", "Veneto"),
    ("Trieste", "Friuli-Venezia Giulia"),
    ("Taranto", "Puglia"),
    ("Brescia", "Lombardia"),
    ("Parma", "Emilia-Romagna"),
    ("Prato", "Toscana"),
    ("Modena", "Emilia-Romagna"),
    ("Reggio Calabria", "Calabria"),
    ("Reggio Emilia", "Emilia-Romagna"),
    ("Perugia", "Umbria"),
    ("Livorno", "Toscana"),
    ("Ravenna", "Emilia-Romagna"),
    ("Cagliari", "Sardegna"),
    ("Foggia", "Puglia"),
    ("Rimini", "Emilia-Romagna"),
    ("Salerno", "Campania"),
    ("Ferrara", "Emilia-Romagna"),
    ("Sassari", "Sardegna"),
    ("Latina", "Lazio"),
    ("Giugliano in Campania", "Campania"),
    ("Monza", "Lombardia"),
    ("Siracusa", "Sicilia"),
    ("Pescara", "Abruzzo"),
    ("Bergamo", "Lombardia"),
    ("Forlì", "Emilia-Romagna"),
    ("Trento", "Trentino-Alto Adige"),
    ("Vicenza", "Veneto"),
    ("Terni", "Umbria"),
    ("Bolzano", "Trentino-Alto Adige"),
    ("Novara", "Piemonte"),
    ("Piacenza", "Emilia-Romagna"),
    ("Ancona", "Marche"),
    ("Andria", "Puglia"),
    ("Arezzo", "Toscana"),
    ("Udine", "Friuli-Venezia Giulia"),
    ("Cesena", "Emilia-Romagna"),
    ("Lecce", "Puglia")
]
risorse_pubbliche = {
    "Biblioteche": ["Biblioteca Centrale", "Biblioteca per Ragazzi", "Biblioteca di Quartiere"],
    "Parchi": ["Parco Comunale", "Orto Botanico", "Giardino Pubblico"],
    "Ospedali": ["Ospedale Generale", "Clinica Comunale", "Centro di Pronto Soccorso"],
    "Scuole": ["Scuola Primaria", "Scuola Media", "Liceo Classico", "Istituto Tecnico"],
    "Centri Sportivi": ["Centro Sportivo Comunale", "Palestra Comunale", "Piscina Comunale"],
    "Musei": ["Museo Civico", "Museo di Arte Moderna", "Museo Archeologico"],
    "Teatri": ["Teatro Comunale", "Teatro dell'Opera", "Auditorium Cittadino"],
    "Uffici Postali": ["Ufficio Postale Centrale", "Ufficio Postale di Quartiere"],
    "Stazioni di Servizio Pubblico": ["Caserma dei Carabinieri", "Stazione dei Vigili del Fuoco", "Polizia Municipale"],
    "Centri per il Lavoro e i Servizi Sociali": ["Centro per l'Impiego", "Centro per gli Anziani", "Ufficio Servizi Sociali"],
    "Anagrafe e Servizi Comunali": ["Anagrafe Comunale", "Ufficio Protocollo", "Ufficio Relazioni con il Pubblico"],
    "Centri Culturali": ["Centro Culturale", "Centro Giovani", "Centro Artistico"],
    "Cimiteri": ["Cimitero Comunale", "Cimitero Monumentale"],
    "Centri Ricreativi": ["Sala Giochi Comunale", "Centro Ricreativo per Bambini"]
}
coordinate_citta = {
    "Roma": {"lat": (41.800000, 41.950000), "lon": (12.450000, 12.650000)},
    "Milano": {"lat": (45.450000, 45.550000), "lon": (9.100000, 9.250000)},
    "Napoli": {"lat": (40.800000, 40.900000), "lon": (14.200000, 14.300000)},
    "Torino": {"lat": (45.000000, 45.100000), "lon": (7.600000, 7.700000)},
    "Palermo": {"lat": (38.100000, 38.200000), "lon": (13.300000, 13.400000)},
    "Genova": {"lat": (44.400000, 44.450000), "lon": (8.900000, 9.000000)},
    "Bologna": {"lat": (44.490000, 44.520000), "lon": (11.300000, 11.370000)},
    "Firenze": {"lat": (43.760000, 43.800000), "lon": (11.230000, 11.290000)},
    "Bari": {"lat": (41.110000, 41.150000), "lon": (16.830000, 16.900000)},
    "Catania": {"lat": (37.480000, 37.520000), "lon": (15.060000, 15.110000)},
    "Venezia": {"lat": (45.420000, 45.450000), "lon": (12.300000, 12.370000)},
    "Verona": {"lat": (45.420000, 45.450000), "lon": (10.950000, 11.000000)},
    "Messina": {"lat": (38.180000, 38.220000), "lon": (15.520000, 15.580000)},
    "Padova": {"lat": (45.400000, 45.440000), "lon": (11.850000, 11.900000)},
    "Trieste": {"lat": (45.630000, 45.670000), "lon": (13.750000, 13.800000)},
    "Taranto": {"lat": (40.460000, 40.480000), "lon": (17.200000, 17.250000)},
    "Brescia": {"lat": (45.530000, 45.570000), "lon": (10.200000, 10.250000)},
    "Parma": {"lat": (44.800000, 44.830000), "lon": (10.300000, 10.350000)},
    "Prato": {"lat": (43.860000, 43.890000), "lon": (11.080000, 11.120000)},
    "Modena": {"lat": (44.640000, 44.670000), "lon": (10.910000, 10.950000)},
    "Reggio Calabria": {"lat": (38.100000, 38.150000), "lon": (15.630000, 15.700000)},
    "Reggio Emilia": {"lat": (44.690000, 44.720000), "lon": (10.620000, 10.660000)},
    "Perugia": {"lat": (43.090000, 43.130000), "lon": (12.380000, 12.450000)},
    "Livorno": {"lat": (43.520000, 43.550000), "lon": (10.290000, 10.320000)},
    "Ravenna": {"lat": (44.410000, 44.440000), "lon": (12.190000, 12.230000)},
    "Cagliari": {"lat": (39.210000, 39.240000), "lon": (9.110000, 9.150000)},
    "Foggia": {"lat": (41.450000, 41.490000), "lon": (15.530000, 15.570000)},
    "Rimini": {"lat": (44.050000, 44.070000), "lon": (12.550000, 12.590000)},
    "Salerno": {"lat": (40.680000, 40.700000), "lon": (14.750000, 14.780000)},
    "Ferrara": {"lat": (44.830000, 44.860000), "lon": (11.610000, 11.650000)},
    "Sassari": {"lat": (40.720000, 40.750000), "lon": (8.550000, 8.580000)},
    "Latina": {"lat": (41.460000, 41.490000), "lon": (12.860000, 12.890000)},
    "Monza": {"lat": (45.580000, 45.610000), "lon": (9.270000, 9.300000)},
    "Siracusa": {"lat": (37.070000, 37.100000), "lon": (15.270000, 15.300000)},
    "Pescara": {"lat": (42.450000, 42.480000), "lon": (14.180000, 14.220000)},
    "Bergamo": {"lat": (45.690000, 45.720000), "lon": (9.660000, 9.700000)},
    "Forlì": {"lat": (44.220000, 44.250000), "lon": (12.040000, 12.070000)},
    "Trento": {"lat": (46.050000, 46.080000), "lon": (11.110000, 11.150000)},
    "Vicenza": {"lat": (45.540000, 45.570000), "lon": (11.520000, 11.560000)},
    "Terni": {"lat": (42.560000, 42.590000), "lon": (12.630000, 12.670000)},
    "Bolzano": {"lat": (46.490000, 46.520000), "lon": (11.330000, 11.370000)},
    "Novara": {"lat": (45.450000, 45.480000), "lon": (8.600000, 8.640000)},
    "Piacenza": {"lat": (45.050000, 45.080000), "lon": (9.660000, 9.700000)},
    "Ancona": {"lat": (43.600000, 43.630000), "lon": (13.490000, 13.520000)},
    "Andria": {"lat": (41.230000, 41.260000), "lon": (16.290000, 16.330000)},
    "Arezzo": {"lat": (43.460000, 43.490000), "lon": (11.850000, 11.890000)},
    "Udine": {"lat": (46.050000, 46.080000), "lon": (13.210000, 13.250000)},
    "Cesena": {"lat": (44.140000, 44.170000), "lon": (12.240000, 12.270000)},
    "Lecce": {"lat": (40.350000, 40.380000), "lon": (18.150000, 18.190000)},
}
tipi_sensori = [
    "Temperatura",
    "Umidità",
    "Luminosità",
    "Pressione atmosferica",
    "Qualità dell`aria",
    "Rumore",
    "Livello di CO2",
    "Velocità del vento",
    "Direzione del vento",
    "Pioggia",
    "Livello dell`acqua",
    "Radiazione UV",
    "Consumo energetico",
    "Livello di PM2.5",
    "Livello di PM10",
    "Rilevamento incendi",
    "Rilevamento gas",
    "Vibrazioni",
    "Illuminazione pubblica"
]
configurazione_sensori = {
    "Temperatura": {"min": -20.0, "max": 50.0},  # Celsius [°C]
    "Umidità": {"min": 0.0, "max": 100.0},  # Percentuale [%]
    "Luminosità": {"min": 0.0, "max": 100000.0},  # Lux [lx]
    "Pressione atmosferica": {"min": 950.0, "max": 1050.0},  # [hPa]
    "Qualità dell`aria": {"min": 0.0, "max": 500.0},  # [AQI] - indice di qualità dell'aria
    "Rumore": {"min": 30.0, "max": 130.0},  # Decibel [dB]
    "Livello di CO2": {"min": 300.0, "max": 5000.0},  # [ppm]
    "Velocità del vento": {"min": 0.0, "max": 40.0},  # [m/s]
    "Direzione del vento": {"min": 0.0, "max": 360.0},  # Gradi [°]
    "Pioggia": {"min": 0.0, "max": 500.0},  # [mm/h]
    "Livello dell`acqua": {"min": 0.0, "max": 10.0},  # metri [m]
    "Radiazione UV": {"min": 0.0, "max": 11.0},  # Indice UV [UV]
    "Consumo energetico": {"min": 0.0, "max": 10000.0},  # [kWh]
    "Livello di PM2.5": {"min": 0.0, "max": 500.0},  # microgrammi per metro cubo [µg/m³]
    "Livello di PM10": {"min": 0.0, "max": 500.0},  # [µg/m³]
    "Rilevamento incendi": {"min": 0.0, "max": 1.0},  # Presenza di incendio (0 o 1) [MJ]
    "Rilevamento gas": {"min": 0.0, "max": 1000.0},  # Concentrazione gas in [ppm]
    "Vibrazioni": {"min": 0.0, "max": 10.0},  # [m/s^2]
}
tipi_feedback = [
    "Positivo",
    "Negativo",
    "Neutro",
    "Suggerimento",
    "Lode",
    "Critica costruttiva",
    "Raccomandazione",
    "Problema tecnico",
    "Esperienza utente",
    "Qualità del servizio",
    "Tempistiche",
    "Comunicazione",
    "Soddisfazione generale",
    "Contenuto interessante",
    "Difficoltà nella fruizione",
    "Supporto clienti",
    "Facilità d`uso",
    "Qualità del prodotto",
    "Consigli",
    "Frustrazione"
]
descrizione_log = [
    "Ha effettuato il sign up",
    "Ha effettuato il login",
    "Ha modificato il logout",
    "Ha aggiornato le impostazioni dell'account",
    "Ha reimpostato la password",
    "Ha cambiato l`email di contatto",
    "Ha inviato una segnalazione",
    "Ha partecipato a un evento",
    "Ha creato un nuovo evento",
    "Ha modificato un evento",
    "Ha cancellato un evento",
    "Ha pubblicato un feedback",
    "Ha aggiornato il profilo",
    "Ha caricato un documento",
    "Ha visualizzato i dati del sensore",
    "Ha aggiornato le preferenze di notifica",
    "Ha effettuato il log out",
    "Ha visualizzato una risorsa pubblica",
    "Ha consultato il bilancio delle spese pubbliche",
    "Ha aggiornato le informazioni di pagamento",
    "Ha eliminato un account collegato",
    "Ha generato un report",
    "Ha effettuato un cambio di ruolo"
]

# Ordine dei file SQL da unire
file_order = [
    "utente.sql", "superadmin.sql", "cittadino.sql", "operatore.sql", 
    "citta.sql", "risorsapubblica.sql", "spesapubblica.sql", "sensore.sql", 
    "dato.sql", "evento.sql", "creazione.sql", "partecipazione.sql", 
    "feedback.sql", "segnalazione.sql", "log.sql"
]

salva_dati = []
salva_operatore_eventi = []
salva_eventi = []
# Funzione per popolare la tabella UTENTE
def utente(n): # IDUtente, Nome, Cognome, DataNascita, Email, Telefono, Indirizzo
    # Inserisco l'utente Beste e Berta prima di tutti
    # Apre il file in modalità write e aggiunge la query
    with open("db_management/populamento/utente.sql", "w", encoding="utf-8") as file:
        query =(
                f"ALTER TABLE utente AUTO_INCREMENT = 0;\n"
                f"INSERT INTO utente (Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) "
                f"VALUES ('Matteo', 'Bestetti', '2003-08-12', 'matteo.bestetti@studenti.unipr.it', '+39xxxxxxxxxx', 'indirizzo');\n"
                f"INSERT INTO utente (Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) "
                f"VALUES ('Alessandro', 'Bertani', '2002-08-28', 'alessandro.bertani@studenti.unipr.it', '+39zxxxxxxxxx', 'indirizzo');"
        )
        file.write(query + "\n")
    for i in range(n):
        num = random.randrange(len(locales))
        # Scegliamo una località casuale per ogni utente
        fake = Faker(locales[num])

        nome = fake.first_name().replace("'", "`")
        cognome = fake.last_name().replace("'", "`")
        salva_dati.append([nome, cognome]) # Salvo nome e cognome per la tabella operatore
        data_nascita = fake.date_of_birth(minimum_age=16, maximum_age=90)  # Range di età
        # Genero email
        name = nome.replace(" ", '') + cognome.replace(" ", '')
        if random.random() < 0.1:
            car = random.choice(['.', '_', '-'])
            dove = random.randint(1, len(name) - 1)
            name = name[:dove] + car + name[:dove]

        scelta = random.random()
        if scelta < 0.25:
            name += f'{data_nascita.year}'[2:]
        elif scelta < 0.5:
            name += f'{data_nascita.month}'
        elif scelta < 0.75:
            name += f'{data_nascita.day}'

        provider = random.choice(email_providers[locales[num]])
        email = f"{name}@{provider}"
        telefono = prefissi_europei[num] + fake.unique.numerify('##########') # Prefisso(3) + 10 numeri
        indirizzo = fake.address().replace("\n", ", ").replace("'", "`")  # Format indirizzo unico

        # Apre il file in modalità append e aggiunge la query
        with open("db_management/populamento/utente.sql", "a", encoding="utf-8") as file:
            query =(
                 f"INSERT INTO utente (Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) "
                 f"VALUES ('{nome}', '{cognome}', '{data_nascita}', '{email}', '{telefono}', '{indirizzo}');"
            )
            file.write(query + "\n")
        #print(f"riga numero {i} eseguita")

    print(f"Inseriti {n} record nella tabella UTENTE.")

def cittadino(n): # IDCittadino, Stato, DataRegistrazione, Password
    # Generiamo un set di numeri unici da 2 a 202 per IDCittadino
    id_cittadino_disponibili = list(range(2, (n + 2)))  # Lista di ID da 3 a 202
    random.shuffle(id_cittadino_disponibili)  # Mescoliamo la lista per avere ordine casuale

    for _ in range(2, (n + 2)):
        IDCittadino = get_unique_id(id_cittadino_disponibili)
        Stato = random.randrange(4) # Valore di stato da 0 a 3
        DataRegistrazione = generaDataRegistrazione()
        Password = genera_password()
        #print(f"{IDCittadino}, {Stato}, {DataRegistrazione}, {Password}")
        # Apre il file in modalità append e aggiunge la query
        with open("db_management/populamento/cittadino.sql", "a", encoding="utf-8") as file:
            query = (
                f"INSERT INTO cittadino (IDCittadino, Stato, DataRegistrazione, Password) "
                f"VALUES ('{IDCittadino}', '{Stato}', '{DataRegistrazione}', '{Password}');"
            )
            file.write(query + "\n")

    print(f"Inseriti {n} record nella tabella CITTADINO.")

def operatore(n): # IDOperatore, DataInizio, DataFine, Email, Tipo, Ruolo, Stato, Password
    global salva_dati
    # Generiamo un set di numeri unici da 182 - 222 per IDCittadino
    id_operatori_disponibili = list(range((n - 40), n))
    random.shuffle(id_operatori_disponibili)  # Mescoliamo la lista per avere ordine casuale
    for _ in range(40):
        IDOperatore = get_unique_id(id_operatori_disponibili)
        DataInizio = genera_data_inizio()
        DataFine = genera_data_fine(DataInizio)
        nome, cognome = salva_dati[(IDOperatore - 182)]
        Tipo = random.choice(list(tipi_operatori.keys())).replace("'", "`")
        Ruolo = random.choice(tipi_operatori[Tipo]).replace("'", "`")
        Email = f'{nome.replace(" ", '').replace("'", "`")}.{cognome.replace(" ", '').replace("'", "`")}@{Tipo.replace(" ", '')}.{random.choice(['it', 'com', 'eu', 'net', 'edu', 'org'])}'
        Stato = random.randrange(4) # Valore di stato da 0 a 3
        Password = genera_password()
        #print(f'{IDOperatore}, {DataInizio.strftime('%Y-%m-%d')}, {DataFine}, {Tipo}, {Ruolo}, {Stato}, {Password}')

        global salva_operatore_eventi
        # Se l'operatore rientra nel tipo "Creatori di eventi" lo inserisco in questa tupla
        if Tipo == "Creatori di eventi":
            salva_operatore_eventi.append(IDOperatore)
        with open("db_management/populamento/operatore.sql", "a", encoding="utf-8") as file:
            query = (
                f"INSERT INTO operatore (IDOperatore, DataInizio, DataFine, Email, Tipo, Ruolo, Stato, Password) "
                f"VALUES ('{IDOperatore}', '{DataInizio}', '{DataFine}', '{Email}', '{Tipo}', '{Ruolo}', '{Stato}', '{Password}');"
            )
            file.write(query + "\n")

    print(f"Inseriti {n} record nella tabella OPERATORE.")

def superadmin(): # IDSuperAdmin, Ruolo, DataAssegnazioneRuolo, Stato, UltimoAccesso, Password
    Password_1, Password_2 = [genera_password("123"), genera_password('1213')]
    # print(f'{IDSuperAdmin[i]}, {Ruolo[i]}, {DataAssegnazioneRuolo[i]}, {Stato[i]}, {UltimoAccesso[i]}, {Password[i]}')
    with open("db_management/populamento/superadmin.sql", "w", encoding="utf-8") as file:
        query = (
            f"INSERT INTO superadmin (IDSuperAdmin, Ruolo, DataAssegnazioneRuolo, Stato, UltimoAccesso, Password) "
            f"VALUES ('1', 'System Administrator', '2024-11-02', '0', '2024-11-13 11:25:30', '{Password_1}');\n"
            f"INSERT INTO superadmin (IDSuperAdmin, Ruolo, DataAssegnazioneRuolo, Stato, UltimoAccesso, Password) "
            f"VALUES ('2', 'Cybersecurity Analyst', '2024-11-13', '0', '2024-11-13 11:25:31', '{Password_2}');"
        )
        file.write(query + "\n")

    print(f"Inseriti i record nella tabella SUPERADMIN.")

def citta(): # IDCitta, Nome, Regione
    with open("db_management/populamento/citta.sql", "a", encoding="utf-8") as file:
        query = (
            f"INSERT INTO citta (IDCitta, Nome, Regione) VALUES (-1, 'Online', 'N/A');"
        )
        file.write(query + "\n")
        for i in range(len(citta_e_regioni)):
            Nome, Regione = citta_e_regioni[i]
            query = (
                f"INSERT INTO citta (Nome, Regione) "
                f"VALUES ('{Nome}', '{Regione}');"
            )
            file.write(query + "\n")

    print(f"Inseriti i record nella tabella CITTA.")

def risorsapubblica(): # IDRisorsaPubblica, Nome, Tipo
    with open("db_management/populamento/risorsaPubblica.sql", "w", encoding="utf-8") as file:
        for tipo, nomi in risorse_pubbliche.items():
            for nome in nomi:
                query = f"INSERT INTO risorsapubblica (Nome, Tipo) VALUES ('{nome.replace("'", "`")}', '{tipo.replace("'", "`")}');"
                file.write(query + "\n")
    
    print(f"Inseriti i record nella tabella RISORSAPUBBLICA.")

def spesapubblica(n): # idRisorsaPubblica, idCitta, idOperatore, Data, Costo, Stato
    global salva_dati
    salva_dati = [] # ripulisco una lista per riutilizzarla 
    with open("db_management/populamento/spesapubblica.sql", "w", encoding="utf-8") as file:
        for _ in range(n):
            # Genera valori finché non ottieni una combinazione unica
            while True:
                idRisorsaPubblica = random.randrange(1, 41)  # tra le 40 risorse pubbliche
                idCitta = random.randrange(1, 51)            # tra le 50 città
                idOperatore = random.randrange(182, 222)        # tra i 40 operatori
                combinazione = (idRisorsaPubblica, idCitta, idOperatore)
                
                if combinazione not in salva_dati:  # Verifica unicità
                    salva_dati.append(combinazione)  # Aggiungi la combinazione al set
                    break  # Esce dal loop once

            Data = generaDataRegistrazione()  # Ricicla questa funzione
            Costo = round(random.uniform(0.00, 99999999.99), 2)
            Stato = random.randrange(4)  # Valore di stato da 0 a 3

            query = (
                f"INSERT INTO spesapubblica (IDRisorsaPubblica, IDCitta, IDOperatore, Data, Costo, Stato) "
                f"VALUES ('{idRisorsaPubblica}', '{idCitta}', '{idOperatore}', '{Data}', '{Costo}', '{Stato}');"
            )
            file.write(query + "\n")

    print(f"Inseriti {n} record nella tabella SPESAPUBBLICA.")

def sensore():  # IDSensore, idCitta, Posizione, Tipo, DataInstallazione, Stato
    global salva_dati
    salva_dati = []
    faker = Faker('it_IT')
    
    with open("db_management/populamento/sensore.sql", "w", encoding="utf-8") as file:
        IDSensore = 1  # Incrementa manualmente questo per avere IDs unici
        for idCitta in range(1, len(citta_e_regioni) + 1):   
            numero_sensori = random.randrange(1, 53)  # Aggiungi un numero casuale di sensori per città
            for _ in range(numero_sensori):  # Loop sul numero di sensori per città
                intervallo = coordinate_citta.get(idCitta)
                if intervallo:
                    latitudine = round(random.uniform(*intervallo["lat"]), 6)
                    longitudine = round(random.uniform(*intervallo["lon"]), 6)
                else:
                    latitudine = round(faker.latitude(), 6)
                    longitudine = round(faker.longitude(), 6)
                    
                Tipo = tipi_sensori[random.randrange(len(tipi_sensori))]
                DataInstallazione = faker.date_between(start_date='-10y', end_date='today')
                Stato = random.randrange(4)  # Valore di stato da 0 a 3

                # Aggiunge il record a salva_dati con IDSensore e Tipo
                salva_dati.append([IDSensore, Tipo])  
                # print(f'Iterazione {idCitta},{i}: {salva_dati}')
                query = (
                    f"INSERT INTO sensore (IDSensore, idCitta, Latitudine, Longitudine, Tipo, DataInstallazione, Stato) "
                    f"VALUES ('{IDSensore}', '{idCitta}', '{latitudine}', '{longitudine}', '{Tipo}', '{DataInstallazione}', '{Stato}');"
                )
                file.write(query + "\n")
                IDSensore += 1  # Incrementa l'ID per il prossimo sensore
    
    print(f"Inseriti {len(salva_dati)} record nella tabella SENSORE.")

def dato(): # idSensore, Data, Valore
    global salva_dati
    fake = Faker()
    #idSensore, Tipo = random.randrange(1, len(salva_dati)) # numero di tuple che ho io di sensori
    with open("db_management/populamento/dato.sql", "w", encoding="utf-8") as file:
        for i in range(len(salva_dati)): # Range basato sui dati dei sensori
            idSensore, Tipo = salva_dati[i]  
            # print(f'{idSensore} -> {Tipo}')
            for _ in range(random.randrange(64)):
                # Genera la data in formato timestamp
                Data = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')

                # Genera un valore realistico basato sul tipo di sensore
                range_valori = configurazione_sensori.get(Tipo)
                # Se non esiste un tipo di sensore configurato metto None
                Valore = (round(random.uniform(range_valori["min"], range_valori["max"]), 2)) if (range_valori) else (None)

                # print(f'{idSensore}, {Tipo}, {range_valori}, {Data}, {Valore}')
                query = (
                    f"INSERT INTO dato (idSensore, Data, Valore) "
                    f"VALUES ('{idSensore}', '{Data}', '{Valore}');"
                )
                file.write(query + "\n")
    print(f"Inseriti i record nella tabella DATO.")

def evento(n): # IDEvento, Nome, Luogo, NPosti, Descrizione, Data, Stato
    global salva_eventi
    faker = Faker('it_IT')
    
    with open("db_management/populamento/evento.sql", "w", encoding="utf-8") as file:
        for IDEvento in range(1, (n + 1)):  # Genera eventi fittizi
            Nome = faker.catch_phrase()  # Usa nomi fittizi di eventi
            Descrizione = faker.text(max_nb_chars=200)  # Descrizione breve
            
            # Imposta casualmente se l'evento è online o in una città fisica
            if random.random() < 0.3:  # 30% di probabilità di evento online
                Luogo = faker.url()  # Link per eventi online
                NPosti = -1  # Illimitato
            else:
                citta, regione = random.choice(citta_e_regioni)
                Luogo = f"{citta}, {faker.street_address()}"
                NPosti = random.choice([-1] + list(range(50, 301, 50)))  # -1 (illimitato) o fino a 300 posti in multipli di 50
            
            Data = faker.date_this_year()  # Data casuale dell'anno corrente
            Stato = random.choice([0, 1, 2, 3])  # Stato casuale tra 0 e 3
            
            salva_eventi.append([IDEvento, Luogo])

            query = (
                f"INSERT INTO evento (Nome, Luogo, NPosti, Descrizione, `Data`, Stato) "
                f"VALUES ('{Nome}', '{Luogo}', '{NPosti}', '{Descrizione}', '{Data}', '{Stato}');"
            )
            file.write(query + "\n")
    
    print("Eventi inseriti correttamente nella tabella EVENTO.")

def creazione(): # idCitta, idEvento, idOperatore, Data, Segnalazione
    # print(len(salva_eventi))
    # print(len(salva_operatore_eventi))
    with open("db_management/populamento/creazione.sql", "w", encoding="utf-8") as file:
        for i in range(len(salva_eventi)):
            idOperatore = random.choice(salva_operatore_eventi)
            Data = generaDataRegistrazione()
            Segnalazione = Faker('it_IT').text(max_nb_chars=30) if random.random() < 0.3 else ""
            idEvento, Luogo = salva_eventi[i]
            #print(idEvento, Luogo)
            if "http" in Luogo:
                idCitta = -1
            else:
                for j in range(len(citta_e_regioni)):
                    if Luogo.split(',')[0] in citta_e_regioni[j][0]:
                        idCitta = (j + 1)
                        break
            query = (
                f"INSERT INTO creazione (idCitta, idEvento, idOperatore, `Data`, Segnalazione) "
                f"VALUES ('{idCitta}', '{idEvento}', '{idOperatore}', '{Data}', '{Segnalazione}');"
            )
            file.write(query + "\n")
            #print(f'{idCitta}, {idEvento}, {idOperatore}, {Data}, {Segnalazione}')
    print("Eventi inseriti correttamente nella tabella CREAZIONE.")

def partecipazione(): # idCitta, idEvento, idCittadino, DataPartecipazione, Segnalazione
    with open("db_management/populamento/partecipazione.sql", "w", encoding="utf-8") as file:
        for i in range(len(salva_eventi)):
            idCittadino = random.randrange(2, 201) # idCittadino parte da 2 perchè idUtente[0,1] sono di best e berta
            DataPartecipazione = generaDataRegistrazione()
            Segnalazione = Faker('it_IT').text(max_nb_chars=30) if random.random() < 0.3 else ""
            idEvento, Luogo = salva_eventi[i]
            #print(idEvento, Luogo)
            if "http" in Luogo:
                idCitta = -1
            else:
                for j in range(len(citta_e_regioni)):
                    if Luogo.split(',')[0] in citta_e_regioni[j][0]:
                        idCitta = (j + 1)
                        break
            query = (
                f"INSERT INTO partecipazione (idCitta, idEvento, idCittadino, DataPartecipazione, Segnalazione) "
                f"VALUES ('{idCitta}', '{idEvento}', '{idCittadino}', '{DataPartecipazione}', '{Segnalazione}');"
            )
            file.write(query + "\n")
            #print(f'{idCitta}, {idEvento}, {idCittadino}, {Data}, {Segnalazione}')
    print("Eventi inseriti correttamente nella tabella PARTECIPAZIONE.")

def feedback(): # IDFeedback, Tipo
    with open("db_management/populamento/feedback.sql", "w", encoding="utf-8") as file:
        for tipo in tipi_feedback:
            query = (
                f"INSERT INTO feedback (Tipo) "
                f"VALUES ('{tipo}');"
            )
            file.write(query + "\n")
    
    print(f"Inseriti i record nella tabella FEEDBACK.")

def segnalazione(): # IDSegnalazione, idCitta, idFeedback, idCittadino, Data, Descrizione, Foto
    with open("db_management/populamento/segnalazione.sql", "w", encoding="utf-8") as file:
        for _ in range(random.randrange(15, 374)):
            idCitta = random.randrange(1, len(citta_e_regioni))
            idCittadino = random.randrange(2, 201)
            idFeedback = random.randrange(1, len(tipi_feedback))
            Data = generaDataRegistrazione()
            Descrizione = Faker('it_IT').text(max_nb_chars=256)
            Foto = Faker('it_IT').file_name(extension="jpg") if random.random() < 0.8 else ""
            query = (
                f"INSERT INTO segnalazione (idCitta, idFeedback, idCittadino, `Data`, Descrizione, Foto) "
                f"VALUES ('{idCitta}', '{idFeedback}', '{idCittadino}', '{Data}', '{Descrizione}', '{Foto}');"
            )
            file.write(query + "\n")
    
    print(f"Inseriti i record nella tabella SEGNALAZIONE.")

def log(n): # IDLog, idUtente, Data, Descrizione
    with open("db_management/populamento/log.sql", "w", encoding="utf-8") as file:
        for _ in range(n):
            idUtente = random.randrange(1, 222)
            Data = generaDataRegistrazione()
            Descrizione = random.choice(descrizione_log).replace("'", "`")
            query = (
                    f"INSERT INTO log (, idUtente, `Data`, Descrizione) "
                    f"VALUES ('{idUtente}', '{Data}', '{Descrizione}');"
                )
            file.write(query + "\n")
    print(f"Inseriti i record nella tabella LOG.")

def crea_file_sql_unico(file_order):
    try:
        # Stampa la directory corrente
        current_directory = os.getcwd()
        print(f"Directory corrente: {current_directory}")

        # Apre il file finale in modalità scrittura con utf-8
        with open("db_management/populo_db.sql", "w", encoding="utf-8") as f_out:
            for file_name in file_order:
                # Costruisce il percorso completo per ogni file
                file_path = f'db_management/populamento/{file_name}'
                # Controlla che il file esista nella directory specificata
                if os.path.exists(file_path):
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f_in:
                        # Scrive una separazione e nome file di origine (facoltativo)
                        f_out.write(f"-- Contenuto di {file_name}\n")
                        # Copia le righe nel file output
                        f_out.write(f_in.read())
                        f_out.write("\n\n")  # Aggiunge una nuova riga per separazione
                else:
                    print(f"File {file_name} non trovato.")

        print("File unificato creato con successo in 'db_management/populamento/file_unificato.sql'.")

    except Exception as e:
        print("Si è verificato un errore:", e)

    except Exception as e:
        print("Si è verificato un errore:", e)

def main():
    
    elimina_sql_files()
    
    print("Inizio generazione")
    # IDUtente[0, 1]: superAdmin  (Account mio e di best)
    # IDUtente[2 - 202] : IDCittadino
    # IDUtente[182 - 222]: IDOperatore
    # Esegui la funzione per popolare la tabella con un numero specifico di record
    utente(220)    # Genera 220 utenti + i primi di default di Best e Berta
    superadmin()   # Genera 2 superadmin (io e best)
    cittadino(200) # Genera 200 cittadini
    operatore(222) # Genera 40 operatori
    citta()        # Genera 50 citta
    risorsapubblica() # Genera tutti i tipi di risorse pubbliche
    spesapubblica(100)
    sensore() 
    dato() 
    evento(100) # Genera 100 eventi
    creazione()
    partecipazione()
    feedback()
    segnalazione()
    log(300)

    # Esegue la funzione per creare il file SQL unificato
    crea_file_sql_unico(file_order)
main()