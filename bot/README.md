# WhatsApp Bot - Agencia

## Configuración

1. Instala dependencias:
```bash
cd bot
npm install
```

2. Inicia el bot:
```bash
npm run dev
```

3. Escanea el código QR con WhatsApp en tu teléfono.

## Endpoints API

Cuando el bot está corriendo:

- `GET http://localhost:3001/health` — Estado del bot
- `GET http://localhost:3001/leads` — Leads capturados
- `POST http://localhost:3001/send` — Enviar mensaje desde la web

## Variables de entorno

Copia `.env.example` a `.env` y configura:
