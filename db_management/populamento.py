from faker import Faker
import random
from datetime import datetime, timedelta

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
salva_dati = []
# Funzione per popolare la tabella UTENTE
def utente(n):
    for i in range(n):
        num = random.randrange(len(locales))
        # Scegliamo una località casuale per ogni utente
        fake = Faker(locales[num])
        
        nome = fake.first_name()
        cognome = fake.last_name()
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
        indirizzo = fake.address().replace("\n", ", ")  # Format indirizzo unico

        # Apre il file in modalità append e aggiunge la query
        with open("db_management/utenti.sql", "a", encoding="utf-8") as file:
            query = f"INSERT INTO utente (Nome, Cognome, DataNascita, Email, Telefono, Indirizzo) VALUES ('{nome}', '{cognome}', '{data_nascita}', '{email}', '{telefono}', '{indirizzo}');"
            file.write(query + "\n")
        #print(f"riga numero {i} eseguita")

    print(f"Inseriti {n} record nella tabella UTENTE.")

def cittadino(n):
    # Generiamo un set di numeri unici da 0 a 200 per IDCittadino
    id_cittadino_disponibili = list(range(n + 1))  # Lista di ID da 0 a 200
    random.shuffle(id_cittadino_disponibili)  # Mescoliamo la lista per avere ordine casuale

    for _ in range(n):
        IDCittadino = get_unique_id(id_cittadino_disponibili)
        Stato = random.randrange(5) # Valore di stato da 0 a 4
        DataRegistrazione = generaDataRegistrazione()
        #print(f"{IDCittadino}, {Stato}, {DataRegistrazione}")
        # Apre il file in modalità append e aggiunge la query
        with open("db_management/cittadini.sql", "a", encoding="utf-8") as file:
            query = f"INSERT INTO utente (IDCittadino, Stato, DataRegistrazione) VALUES ('{IDCittadino}', '{Stato}', '{DataRegistrazione}');"
            file.write(query + "\n")

    print(f"Inseriti {n} record nella tabella CITTADINO.")

def operatore(n):
    # Generiamo un set di numeri unici da 180 - 200 per IDCittadino
    id_operatori_disponibili = list(range((n - 40), n))  # Lista di ID da 0 a 200
    random.shuffle(id_operatori_disponibili)  # Mescoliamo la lista per avere ordine casuale
    for i in range(40):
        IDOperatore = get_unique_id(id_operatori_disponibili)
        DataInizio = genera_data_inizio()
        DataFine = genera_data_fine(DataInizio)
        nome, cognome = salva_dati[IDOperatore]
        Tipo = random.choice(list(tipi_operatori.keys()))
        Ruolo = random.choice(tipi_operatori[Tipo])
        Email = f'{nome.replace(" ", '')}.{cognome.replace(" ", '')}@[Tipo.replace(" ", '')]'
        Stato = random.randrange(5) # Valore di stato da 0 a 4
        #print(f'{IDOperatore}, {DataInizio.strftime('%Y-%m-%d')}, {DataFine}, {Tipo}, {Ruolo}, {Stato}')

        with open("db_management/operatori.sql", "a", encoding="utf-8") as file:
            query = f"INSERT INTO operatore (IDOperatore, DataInizio, DataFine, Email, Tipo, Ruolo, Stato) VALUES ('{IDOperatore}', '{DataInizio}', '{DataFine}', '{Email}', '{Tipo}', '{Ruolo}', '{Stato}');"
            file.write(query + "\n")

    print(f"Inseriti {n} record nella tabella OPERATORE.")

def superadmin():
    print()

def main():
    print("Inizio generazione")
    # IDUtente[0 - 200] : IDCittadino
    # IDUtente[180 - 220]: IDOperatore
    # IDUtente[0 - 3, 220 - 225]: superAdmin 
    # Esegui la funzione per popolare la tabella con un numero specifico di record
    utente(200)    # Genera 200 utenti
    cittadino(200) # Genera 200 cittadini
    operatore(200) # Genera 40 operatori
main()