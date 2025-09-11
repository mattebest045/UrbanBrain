> ℹ️ **NOTA**: Eventuali errori di un parametro ricevuto verranno inviati come risposta nel campo `data` in questo modo:

```ts
// Eventuali Errori
[
  {
    type: string,
    value: string,
    msg: string,
    path: string,
    location: string,
  },
];
```

# User

## Registration

`POST`
http://localhost:3001/user/

```ts
Registration(tipo: string, nome: string, cognome: string, dataNascita: date, email: string, password: string, stato: int)
// Response
success: bool,
message: string,
data?: {
    token,
    user: {
        id: int,
        tipo: string,
        nome: string,
        cognome: strnig
    }
}
```

## Login

`POST`
http://localhost:3001/user/login

```ts
Login(email: string, password: string)
// Response
success: bool,
message: string,
data?: {
    token,
    user: {
        id: int,
        tipo: string,
        nome: string,
        cognome: strnig
    }
}
```

## Basic Info

`GET`
http://localhost:3001/user/basicinfo/

```ts
BasicInfo({
    header: {accessToken: validateToken}
})
// Response
success: bool,
message: string,
data?: {
    token,
    user: {
        id: int,
        tipo: string,
        nome: string,
        cognome: strnig,
        dataNascita: date,
        email: string,
        stato: int
    },

}
```

## Modify

`PUT`
http://localhost:3001/user/modify

```ts
BasicInfo({nome: string, cognome: string, dataNascita: date, email: string}, {
    header: {accessToken: validateToken}
})
// Response
success: bool,
message: string,
data?: { }
```

## Modify

`PUT`
http://localhost:3001/user/modify/password

```ts
BasicInfo({oldPassword: string, newPasseord: string}, {
    header: {accessToken: validateToken}
})
// Response
success: bool,
message: string,
data?: { }
```

## Modify State By Email

`PUT`
http://localhost:3001/user/modify/by-email/state

```ts
BasicInfo({stato: int, email: string}, {
    header: {accessToken: validateToken}
})
// Response
success: bool,
message?: string,
data?: {
    id: int,
    stato: int
}
```

## Modify State By Email

`PUT`
http://localhost:3001/user/modify/:id/state

```ts
BasicInfo({stato: int, id: int}, {
    header: {accessToken: validateToken}
})
// Response
success: bool,
message?: string,
data?: {
    id: int,
    stato: int
}
```

## Delete

`DELETE`
http://localhost:3001/user/

```ts
Delete({
    header: {accessToken: validateToken}
})
// Response
success: true,
message: string,
data?: {}
```

# Event

## Create Event

> ℹ️ **NOTA**: Un operatore/admin che crea un evento viene direttamente aggiunto anche in CreateEvents
> `POST`
> http://localhost:3001/event/

```ts
CreateEvent({nome: string, luogo: string, posti: int, descrizione:strign, data: date, segnalazione: text }, {
    header: {accessToken: validateToken}
})
// Response
success: true,
message: string,
data?: {}
```

## Get Events From City

`GET`
http://localhost:3001/event/city/:city

```ts
GetEvents(citta: stringa)
// Response
success: true,
message: string,
data?: [{
    "id": int,
    "nome": string,
    "luogo": string,
    "posti": int,
    "descrizione": text,
    "data": date,
    "stato": int,
    "createdAt": timestamp,
    "updatedAt": timestamp
    },...]
```

## Modify State Event

`PUT`
http://localhost:3001/event/modify/state

```ts
ModifyState(stato: int, id: int, {
    header: {accessToken: validateToken}
})
// Response
success: true,
message: string,
data?: {}
```

## Modify info Event

`PUT`
http://localhost:3001/event/modify/:id

```ts
modifyEvent({nome: string, luogo: string, posti: int, descrizione: text, data: date}, , {
    header: {accessToken: validateToken}
})
// Result
success: true,
message: string,
data?: {}
```

## Delete Event

`DELETE`
http://localhost:3001/event/:id

```ts
deleteEvent(, {
    header: {accessToken: validateToken}
})
// Result
success: true,
message: string,
data?: {}
```
