# CHEEMS Transport — Frontend

Aplicación web (**React**) del sistema **CHEEMS Transport**: información de **transporte público en bus** (rutas, tarifas, conductores, buses, PQRS y panel administrativo). Incluye **asistente de chat bilingüe** (español / inglés) que habla solo con la API propia; **no** incorpora claves de Google en el navegador.

**Repositorio:** [github.com/JorgeEsp636/frontendcheems](https://github.com/JorgeEsp636/frontendcheems)

---

## Stack técnico

| Área | Tecnología | Versión (referencia `package.json`) |
|------|------------|-------------------------------------|
| Runtime | Node.js | Recomendado **18 LTS** o superior |
| UI | **React** | **18.2.0** |
| Enrutado | **react-router-dom** | **^6.22.0** |
| Build | **react-scripts** (Create React App) | **5.0.1** |
| Estilos | **Tailwind CSS** | **^3.4.1** |
| Utilidades CSS | **tailwind-merge**, **tailwindcss-animate** | ^2.2.1 / ^1.0.7 |
| PostCSS / Autoprefixer | **postcss**, **autoprefixer** | ^8.4.35 / ^10.4.17 |
| Peticiones HTTP | **axios** | **^1.6.7** |
| Mapas | **Leaflet**, **react-leaflet** | ^1.9.4 / ^4.2.1 |
| Gráficos (dashboard admin) | **Recharts** | **^2.15.3** |
| Componentes UI (donde aplica) | **MUI** (**@mui/material**), **Emotion** | ^5.15.7 / ^11.11.x |

### Asistente de chat (Gemini vía backend)

| Aspecto | Detalle |
|---------|---------|
| Dónde está en la app | Pestaña **Asistente** en el dashboard (`TransportDashboard`). |
| Componente | `src/components/AssistantChat.js` |
| Idioma de la interfaz | Conmutador **ES / EN** (etiquetas, placeholder, botones). |
| Idioma de las respuestas del modelo | Se envía `language: "es"` o `"en"` en el cuerpo del `POST`; el servidor ajusta las instrucciones de sistema. |
| Autenticación | Mismo **JWT** que el resto de la app (`Authorization: Bearer …`) mediante instancia compartida en `src/services/transportService.js` (`axiosInstance` exportado). |
| URL de la API | Por defecto `http://localhost:8000/api` (mismo archivo de servicio). |

**Seguridad de la API key de Google**

- La clave **Gemini** vive **solo** en el backend (archivo `.env` del servidor Django: `GEMINI_API_KEY`).
- El frontend **nunca** debe definir `REACT_APP_GEMINI_*` con una clave real: Create React App **inyecta** esas variables en el bundle y cualquiera podría leerlas en el navegador.
- El flujo correcto es: **React** → `POST /api/chat/` al backend → **Django** llama a Google con la clave del servidor → devuelve `{ "reply": "…" }` al cliente.

---

## Requisitos

- **Node.js** 18+ y **npm**
- Backend CHEEMS en ejecución (por defecto `http://localhost:8000`) con CORS permitiendo `http://localhost:3000`

---

## Instalación y desarrollo

```bash
git clone https://github.com/JorgeEsp636/frontendcheems.git
cd frontendcheems
npm install
npm start
```

La app se sirve en **http://localhost:3000** (CRA).

### Build de producción

```bash
npm run build
```

Los artefactos quedan en `build/`. Configura el servidor web o CDN para SPA (fallback a `index.html` en rutas del cliente).

---

## Variables de entorno (frontend)

Para entornos distintos de `localhost:8000`, lo habitual es introducir en el futuro una variable de entorno **sin secretos**, por ejemplo una URL base de API, y leerla en el código de `transportService` (evitando commitear claves). Hoy la base URL está fijada en código para desarrollo local.

Archivos ignorados por Git relacionados: `.env.local`, `.env.development.local`, etc. (ver `.gitignore`).

---

## Estructura relevante

```
src/
├── App.js
├── index.js
├── index.css
├── components/
│   ├── TransportDashboard.js   # pestañas + pestaña Asistente
│   ├── AssistantChat.js        # chat bilingüe → POST /chat/
│   ├── TransportRoutes.js
│   ├── TariffManagement.js
│   ├── Login.js
│   └── ...
└── services/
    ├── transportService.js     # axios + export axiosInstance
    └── authService.js
```

---

## Pruebas

```bash
npm test
```

---

## Repositorio relacionado

- **Backend:** [api_cheemssistemas](https://github.com/JorgeEsp636/api_cheemssistemas) — incluye documentación de `GEMINI_API_KEY`, endpoint `/api/chat/` y stack Django/DRF.

---

## Contribución

1. Rama desde la convención del equipo (ej. `master` o la rama acordada).
2. Sin secretos en commits (ni claves Gemini ni tokens).
3. *Pull request* con descripción y pruebas manuales del flujo login + dashboard + asistente cuando toque ese módulo.
