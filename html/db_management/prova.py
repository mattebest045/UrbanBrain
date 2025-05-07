from faker import Faker
import random
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

n = 200


# Scegliamo una chiave casuale dal dizionario
tipo_operatore = random.choice(list(tipi_operatori.keys()))

# Scegliamo un sotto-ruolo casuale dal tipo selezionato
ruolo_operatore = random.choice(tipi_operatori[tipo_operatore])

print(f'{tipo_operatore}, {ruolo_operatore}')