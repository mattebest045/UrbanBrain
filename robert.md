> ℹ️ **NOTA**: Eventuali errori catturati dal validation[Campo] verranno inviati come risposta nel campo `data` in questo modo:

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

# > User

## Registration

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

http://localhost:3001/user/basicinfo/

```ts
BasicInfo(validateToken)
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

http://localhost:3001/user/modify

```ts
BasicInfo(validateToken)
// Response
success: bool,
message: string,
data?: { }
```
