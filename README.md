# ChemSystem — Plataforma Educativa de Química

LMS interactivo de química con 5 cursos, 50 módulos, 350+ lecciones, simulaciones, laboratorios virtuales, evaluaciones y tutor IA contextual.

## Arquitectura

```
ChemSystem-Web/
├── frontend/                    # React + Vite (src/)
│   ├── src/pages/               # Módulos de la aplicación
│   │   ├── courses/             # Curso completo (CourseDetail modular)
│   │   ├── analytics/           # Rendimiento académico
│   │   ├── achievements/        # Logros y reconocimientos
│   │   ├── community/           # Foro + Colaboración Tripartita
│   │   ├── simulators/          # Simuladores interactivos
│   │   └── quizzes/             # Evaluaciones y quizzes
│   ├── src/components/          # Componentes reutilizables
│   │   ├── dashboard/           # Sidebar, Header
│   │   └── ai/                  # Tutor IA (AITutor.jsx)
│   └── src/pages/courses/CourseDetail/  # 28 archivos modulares
│       ├── components/          # 19 componentes (Sidebar, ContentBlocks, etc.)
│       ├── hooks/               # 3 hooks personalizados
│       └── utils/               # Utilidades de progreso y navegación
│
├── back-end/                    # Node.js + Express + Sequelize
│   ├── src/
│   │   ├── controllers/         # Controladores REST
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── aiService.js     # OpenRouter + sistema de prompts
│   │   │   ├── studentContextService.js  # Contexto académico para IA
│   │   │   └── certificateService.js     # Generación de certificados
│   │   ├── models/              # Modelos Sequelize (PostgreSQL)
│   │   ├── routes/              # Rutas API
│   │   ├── middlewares/         # Auth, rate limiting, validación
│   │   └── utils/               # Seeders y generadores
│   └── server.js                # Punto de entrada
```

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js 20, Express 4, Sequelize 6 |
| **Base de Datos** | PostgreSQL (NeonDB) |
| **IA** | OpenRouter (Llama 3.2) — Tutor contextual con sistema de prompts |
| **Despliegue** | AWS S3 (frontend) + Elastic Beanstalk (backend) |

## Funcionalidades

### LMS Completo
- **5 cursos** con progresión pedagógica: Fundamentos → General → Orgánica → Analítica → Industrial
- **50 módulos**, **350+ lecciones** con contenido enriquecido (tablas, SVGs, laboratorios, casos de estudio)
- Navegación tipo Cisco Networking Academy con barra de progreso y lectura
- Evaluaciones por módulo y exámenes finales
- Certificados descargables al completar cursos

### Tutor IA Contextual
- Sistema de prompts que convierte al chatbot en un profesor de química (Dr. García)
- Contexto automático del estudiante: curso, módulo, lección, progreso, errores recientes
- Generación de ejercicios personalizados según el módulo actual
- Adaptación de dificultad basada en el rendimiento

### Colaboración Tripartita
- Sistema de mensajería entre **estudiante ↔ docente ↔ padre/madre**
- Notificaciones en tiempo real a los tres roles
- Foro comunitario público para estudiantes

### Gamificación
- 18 logros con rarezas (común, raro, épico, legendario)
- Barra de progreso y racha de estudio
- Puntos de prestigio y niveles

## Inicio Rápido

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/TamaraQuispe/ChemSystem-Web.git
cd ChemSystem-Web
npm install
cd back-end && npm install && cd ..

# 2. Configurar variables de entorno
cp back-end/.env.example back-end/.env
# Editar back-end/.env con tu DATABASE_URL y OPENROUTER_API_KEY

# 3. Inicializar base de datos
cd back-end && node src/utils/seedDb.js    # Datos de ejemplo
node src/utils/seedCourses.js               # Cursos y contenido

# 4. Iniciar servidores
node server.js &                             # Backend (:3000)
cd .. && npm run dev                         # Frontend (:5173)
```

## API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |

### Cursos y Lecciones
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/courses` | Listar cursos |
| GET | `/api/courses/:slug/tree` | Árbol del curso (módulos + lecciones) |
| GET | `/api/courses/lessons/:id` | Contenido de lección |
| GET | `/api/courses/modules/:id/assessments` | Evaluaciones del módulo |

### IA y Tutor
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/ai/chat` | Chat con tutor IA (contexto automático) |
| GET | `/api/ai/context` | Contexto académico del estudiante |
| POST | `/api/ai/exercises` | Generar ejercicios personalizados |

### Mensajería Tripartita
| Método | Ruta | Rol |
|---|---|---|
| GET | `/api/student/conversations` | Estudiante |
| POST | `/api/student/conversations/:id/messages` | Estudiante |
| GET | `/api/parent/conversations` | Padre |
| POST | `/api/parent/conversations` | Padre (iniciar) |
| GET | `/api/teacher/conversations` | Docente |
| POST | `/api/teacher/conversations` | Docente (iniciar) |

### Progreso y Analytics
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/analytics/me` | Rendimiento del estudiante |
| GET | `/api/analytics/rankings` | Ranking general |
| GET | `/api/student/dashboard` | Dashboard del estudiante |
| GET | `/api/student/achievements` | Logros obtenidos |

### Certificados
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/certificates/mine` | Mis certificados |
| POST | `/api/certificates/courses/:id/generate` | Generar certificado |

## Despliegue en AWS

### Frontend (S3)
```bash
npm run build
aws s3 sync dist/ s3://<BUCKET>/ --delete
```

### Backend (Elastic Beanstalk)
```bash
cd back-end
eb init <app-name> --platform "Node.js 20" --region us-east-1
eb create <env-name> --single --instance-type t3.micro
```

## Variables de Entorno

```bash
# back-end/.env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
OPENROUTER_API_KEY=sk-or-v1-...
AI_MODEL=meta-llama/llama-3.2-3b-instruct

# frontend (VITE_API_URL se pasa al build)
VITE_API_URL=http://localhost:3000/api
```

## Contribuir

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "Descripción del cambio"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

## Licencia

MIT

---

*ChemSystem — Plataforma educativa de química con IA y LMS completo.*
