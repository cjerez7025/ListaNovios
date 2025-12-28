# 💍 Lista de Matrimonio - Cesar & Pauli

<div align="center">

![Estado](https://img.shields.io/badge/estado-activo-success.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)

**Sitio web personalizado de lista de regalos para matrimonio con sistema de reservas en tiempo real**

[Demo en Vivo](#) • [Reporte de Bugs](../../issues) • [Solicitar Feature](../../issues)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Deployment](#-deployment)
- [Uso](#-uso)
- [Roadmap](#-roadmap)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)
- [Agradecimientos](#-agradecimientos)

---

## 🎯 Acerca del Proyecto

Lista de matrimonio digital moderna con diseño rock/alternativo para Cesar & Pauli. El sitio permite a los invitados ver regalos disponibles, reservarlos en tiempo real, y realizar aportes monetarios directos mediante depósitos bancarios.

### ✨ Características Destacadas

- 🎨 **Diseño Dark Rock/Alternativo** - Estética única con paleta negra, plateada y dorada
- ⚡ **Reservas en Tiempo Real** - Sistema instantáneo sin recargas
- 💰 **Sistema de Depósitos** - Opción de aporte monetario ilimitada
- 📱 **100% Responsive** - Optimizado para móviles, tablets y desktop
- 🎬 **Animaciones GSAP** - Transiciones suaves y profesionales
- 🔒 **Backend Serverless** - Sin costos de servidor usando Google Apps Script
- 📊 **Dashboard Automático** - Gestión de reservas en Google Sheets
- 🆓 **Completamente Gratis** - $0 USD en hosting y backend

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | HTML5 | Estructura semántica |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | CSS3 | Estilos personalizados |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | ES6+ | Lógica del cliente |
| ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white) | 5.3.2 | Framework CSS responsive |
| ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white) | 3.12.2 | Librería de animaciones |
| ![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=flat&logo=fontawesome&logoColor=white) | 6.4.0 | Iconografía |

### Backend

| Tecnología | Uso |
|------------|-----|
| ![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=flat&logo=google&logoColor=white) | Backend serverless (JavaScript) |
| ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat&logo=googlesheets&logoColor=white) | Base de datos en tiempo real |

### Hosting & Deploy

| Servicio | Uso |
|----------|-----|
| ![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=githubpages&logoColor=white) | Hosting estático gratuito |
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) | Control de versiones |

### Desarrollo

```javascript
// Dependencias de desarrollo
"devDependencies": {
  "live-server": "^1.2.2"  // Servidor local para desarrollo
}
```

---

## 🎨 Características

### 🎁 Gestión de Regalos

- [x] Catálogo dinámico de 20+ regalos
- [x] Filtrado automático por estado (Disponible/Reservado)
- [x] Links directos a tiendas para facilitar compras
- [x] Precios en formato chileno ($XXX.XXX)
- [x] Imágenes optimizadas desde CDN

### 💳 Sistema de Reservas

- [x] Reserva con nombre del invitado
- [x] Mensajes personalizados para los novios
- [x] Validación en tiempo real de disponibilidad
- [x] Prevención de reservas duplicadas
- [x] Confirmación visual instantánea

### 💰 Depósitos Bancarios

- [x] Opción de aporte monetario flexible
- [x] **Uso ilimitado** - múltiples invitados pueden depositar
- [x] Formulario con monto personalizado
- [x] Datos bancarios visibles en modal
- [x] Registro independiente en hoja "Depositos"

### 🎨 Diseño & UX

- [x] Diseño rock/alternativo único
- [x] Paleta oscura (negro, plata, oro)
- [x] Animaciones suaves con GSAP
- [x] Responsive design (mobile-first)
- [x] Accesibilidad optimizada
- [x] Carga rápida (<2s)

### 📊 Panel de Administración

- [x] Google Sheets como dashboard
- [x] Vista de reservas en tiempo real
- [x] Registro detallado de depósitos
- [x] Exportación a CSV/Excel
- [x] Sin necesidad de conocimientos técnicos

---

## 📁 Estructura del Proyecto

```
lista-matrimonio/
│
├── index.html              # Página principal
├── styles.css              # Estilos personalizados
├── main.js                 # Lógica del frontend
├── README.md               # Este archivo
│
├── assets/
│   └── img/
│       └── pareja.jpg      # Foto de los novios
│
└── docs/
    └── DOCUMENTACION.md    # Documentación técnica completa
```

### 📄 Archivos Principales

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `index.html` | ~200 | Estructura HTML y componentes Bootstrap |
| `styles.css` | ~400 | Estilos personalizados y responsive |
| `main.js` | ~350 | Lógica de reservas y animaciones GSAP |

---

## 🚀 Instalación

### Prerrequisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Google (para backend)
- Git instalado (opcional)

### Opción 1: Clonar Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/TU_USUARIO/lista-matrimonio-cesar-pauli.git

# Navegar al directorio
cd lista-matrimonio-cesar-pauli

# Abrir con Live Server (VS Code) o servidor local
# Con Python:
python -m http.server 8000

# Con Node.js:
npx http-server -p 8000
```

### Opción 2: Download ZIP

1. Click en "Code" → "Download ZIP"
2. Extraer el archivo
3. Abrir `index.html` con Live Server

---

## ⚙️ Configuración

### 1️⃣ Configurar Google Sheet

1. **Crear Google Sheet:**
   - Ir a [Google Sheets](https://sheets.google.com)
   - Crear nueva hoja de cálculo
   - Copiar el ID del Sheet (URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_AQUI/edit`)

2. **Configurar Apps Script:**
   - En el Sheet: `Extensiones` → `Apps Script`
   - Pegar el código del backend (ver `/docs/backend.gs`)
   - Reemplazar `SHEET_ID` con tu ID real
   - Guardar (Ctrl+S)

3. **Ejecutar función de configuración:**
   ```javascript
   // En Apps Script, ejecutar:
   agregarCampoTipo()
   ```

### 2️⃣ Implementar Web App

1. En Apps Script: `Implementar` → `Nueva implementación`
2. Tipo: **Aplicación web**
3. Configuración:
   ```
   Ejecutar como: Yo
   Quién tiene acceso: Cualquier usuario
   ```
4. Click en `Implementar`
5. **Copiar la URL** generada

### 3️⃣ Actualizar Frontend

1. Abrir `main.js`
2. Reemplazar la URL:
   ```javascript
   const API_URL = 'TU_URL_DE_APPS_SCRIPT_AQUI';
   ```
3. Guardar

### 4️⃣ Personalizar Contenido

**Datos Bancarios** (en `main.js`, función `openReserveModal`):
```javascript
<strong>Titular:</strong> Cesar Lopez<br>
<strong>Banco:</strong> Banco Itaú<br>
<strong>N° de Cuenta:</strong> 00-000-0000000-0<br>
<strong>RUT:</strong> XX.XXX.XXX-X<br>
```

**Foto de Pareja:**
- Agregar foto en `assets/img/pareja.jpg`

**Regalos:**
- Editar directamente en Google Sheet
- Formato: ID | Nombre | Descripción | Precio | Imagen | Link | Tipo | Estado

---

## 🌐 Deployment

### GitHub Pages

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Lista de matrimonio Cesar & Pauli"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

2. **Activar GitHub Pages:**
   - Ir a: `Settings` → `Pages`
   - Source: `main` branch
   - Folder: `/ (root)`
   - Save

3. **Obtener URL:**
   ```
   https://TU_USUARIO.github.io/TU_REPO/
   ```

### Tiempo de Deploy

- Primer deploy: 2-5 minutos
- Updates: 30 segundos - 2 minutos

---

## 💻 Uso

### Para Invitados

1. **Ver regalos disponibles**
   - Navegar por el catálogo
   - Ver detalles y precios
   - Click en "Ver Producto" para ir a la tienda

2. **Reservar un regalo**
   - Click en "Reservar"
   - Completar nombre y mensaje
   - Confirmar reserva
   - ✅ Regalo bloqueado instantáneamente

3. **Hacer depósito**
   - Click en "💰 Depósito Bancario"
   - Ingresar monto
   - Ver datos bancarios
   - Completar formulario
   - Realizar transferencia

### Para los Novios

1. **Ver reservas:**
   - Abrir Google Sheet
   - Revisar hoja "Regalos"
   - Filtrar por estado "Reservado"

2. **Ver depósitos:**
   - Abrir hoja "Depositos"
   - Ver: Fecha, Nombre, Monto, Mensaje

3. **Editar regalos:**
   - Agregar/eliminar filas en Sheet
   - Cambios reflejan automáticamente en el sitio

4. **Resetear regalo:**
   - Cambiar Estado de "Reservado" a "Disponible"
   - Borrar datos de columnas H, I, J

---

## 🗺️ Roadmap

### Versión Actual: 1.0

- [x] Sistema de reservas básico
- [x] Opción de depósitos
- [x] Diseño responsive
- [x] Animaciones GSAP

### Versión 1.1 (Planeada)

- [ ] Sistema de notificaciones por email
- [ ] QR code para compartir
- [ ] Contador de días para el matrimonio
- [ ] Galería de fotos de la pareja
- [ ] Página de agradecimientos post-boda

### Versión 2.0 (Futuro)

- [ ] Sistema de confirmación de asistencia (RSVP)
- [ ] Chat en vivo con los novios
- [ ] Integración con redes sociales
- [ ] Timeline de eventos del día
- [ ] Mapa de ubicación del evento

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Reportar Bugs

Si encuentras un bug, por favor abre un [issue](../../issues) con:

- Descripción detallada
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Navegador y versión

---

## 📜 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

```
MIT License

Copyright (c) 2025 Carlos Jerez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📧 Contacto

**Carlos Jerez** - Desarrollador Web

[![Email](https://img.shields.io/badge/Email-jerezcarlos70%40gmail.com-red?style=flat&logo=gmail)](mailto:jerezcarlos70@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+56%209%204222%209660-25D366?style=flat&logo=whatsapp)](https://wa.me/56942229660)
[![GitHub](https://img.shields.io/badge/GitHub-TU__USUARIO-181717?style=flat&logo=github)](https://github.com/TU_USUARIO)

**Link del Proyecto:** [https://github.com/TU_USUARIO/lista-matrimonio-cesar-pauli](https://github.com/TU_USUARIO/lista-matrimonio-cesar-pauli)

---

## 🙏 Agradecimientos

Recursos y herramientas que hicieron posible este proyecto:

- [Bootstrap](https://getbootstrap.com) - Framework CSS
- [GSAP](https://greensock.com/gsap/) - Librería de animaciones
- [Font Awesome](https://fontawesome.com) - Iconos
- [Google Fonts](https://fonts.google.com) - Tipografías Cinzel y Montserrat
- [Unsplash](https://unsplash.com) - Imágenes de alta calidad
- [GitHub Pages](https://pages.github.com) - Hosting gratuito
- [Google Apps Script](https://developers.google.com/apps-script) - Backend serverless

---

## 📊 Estadísticas del Proyecto

```
Lenguajes:
JavaScript   45.2%
CSS          32.8%
HTML         22.0%

Total de archivos: 4
Total de líneas de código: ~950
Tiempo de desarrollo: 8 horas
Costo total: $0 USD
```

---

## 🎉 Demo

### Screenshots

**Vista Desktop:**

![Desktop View](docs/screenshots/desktop.png)

**Vista Móvil:**

![Mobile View](docs/screenshots/mobile.png)

**Modal de Reserva:**

![Reserve Modal](docs/screenshots/modal.png)

**Panel de Administración:**

![Admin Panel](docs/screenshots/admin.png)

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ y ☕ por [Carlos Jerez](https://github.com/cjerez7025)

</div>