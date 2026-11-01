// ==========================================
// EDUDOCENT — COMPONENTE NOTEBOOK VIEW (13 TEMAS SUELTOS EN ARRAY + DIAPOSITIVAS)
// ==========================================

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Download, Eye, X, Loader2, Sparkles, BookOpen, Lightbulb, ClipboardList, GraduationCap, Globe, FileText, PlayCircle, Layers, Presentation, Paperclip } from 'lucide-react';
import pptxgen from "pptxgenjs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType
} from "docx";
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  subjectIcons,
  subjectOptions,
  subjectNameToValue,
  getFilteredResources
} from './resourcesData.js';

// Diccionario de traducciones para NotebookView
const notebookTranslations = {
  es: {
    tabTopics: "TEMAS",
    tabSlides: "DIAPOSITIVAS",
    tabGuides: "GUÍAS",
    tabWorkshops: "TALLERES",
    tabExams: "EXÁMENES",
    tabQuizzes: "QUIZZES",
    tabVideos: "VIDEOS",
    tabGames: "JUEGOS",
    tabConceptMaps: "ESQUEMAS Y MAPAS",
    tabInclusion: "TIPS INCLUSIÓN",
    generateGuide: "Generar Guía Didáctica Avanzada",
    grade: "Grado",
    period: "Periodo",
    noResources: "No hay recursos generados para",
    startGenerating: "Comienza generando un plan de clases general para este periodo.",
    generatePlan13: "Generar Plan de 13 Clases",
    aiAdaptationTools: "🛠️ HERRAMIENTAS DE ADAPTACIÓN CON IA:",
    clickToGenerate: "Haz clic para generar el material correspondiente a tu selección.",
    genSlides: "Generar Diapositivas Canva / PPT",
    genGuide: "Generar Guía del Tema",
    genWorkshops: "Generar 2 Talleres Prácticos",
    genExam: "Generar Examen Evaluativo",
    genQuiz: "Generar Quiz Rápido",
    genVideo: "Generar Video Guía",
    genGame: "Generar Juego Listo",
    genConceptMap: "Generar Esquema / Mapa",
    genDUA: "Generar Adaptación DUA",
    generatingResource: "Generando recurso con IA...",
    generatingDUA: "Generando adaptación inclusiva DUA...",
    thisMayTakeAWhile: "Esto puede tomar unos segundos",
    generatedContent: "✅ Contenido Generado",
    searchVideo: "▶ Buscar Video en YouTube",
    searchVideoShort: "▶ Buscar Video",
    saveWord: "📄 Descargar en Word (.doc)",
    saveWordShort: "📄 Guardar en Word",
    genOther: "← Generar Otro",
    regenerate: "← Regenerar",
    close: "Cerrar",
    classesAndSlides: "✅ 13 Clases Independientes + Diapositivas Generadas",
    mainContent: "Contenido Principal / Quiz / Tabla",
    presentationIdeas: "Estructura de Presentación",
    teacherGuide: "Guía para el Docente / Respuestas",
    interactiveGame: "Dinámica / Juego Interactivo",
    subjects: {
      "Español y Lit.": "Español y Lit.",
      "Inglés": "Inglés",
      "C. Sociales": "C. Sociales",
      "C. Naturales": "C. Naturales",
      "Matemáticas": "Matemáticas",
      "Tecnología": "Tecnología",
      "Historia": "Historia",
      "Estadística": "Estadística",
      "Biblia": "Biblia",
      "Ética": "Ética",
      "Lectura Crítica": "Lectura Crítica",
      "Plan Lector": "Plan Lector",
      "Educación Física": "Educación Física",
      "Física": "Física",
      "Química": "Química",
      "Artes": "Artes",
      "Filosofía": "Filosofía",
      "Música": "Música",
      "Emprendimiento": "Emprendimiento"
    },
    attachDocument: "Adjuntar Documento",
    subjectLabel: "{t.subjectLabel}",
    sectionsHeader: "{t.sectionsHeader}",
    week: "Semana",
    of: "de",
    activeModule: "{t.activeModule}",
    mainTopicsHeader: "{t.mainTopicsHeader}",
    curricularPlanSubtitle: "{t.curricularPlanSubtitle}",
    playNow: "¡Jugar Ahora!",
    playGame: "▶ Jugar en",
    slidesDesign: "Plataformas de Diseño",
    duaAdaptation: "🎯 Adaptación Inclusiva DUA Generada",
    selectCondition: "Seleccione una condición:",
    generalStrategy: "Estrategias Generales",
    activityAdaptation: "Adaptación de Actividad",
    evaluation: "Evaluación",
    aiGenerator: "Generador IA de",
    notebookSectioned: "Notebook Seccionado EDUDOCENT",
    extraInstructions: "Instrucciones adicionales para la IA...",
    generateNow: "✨ Generar Ahora",
    errorRequired: "Agrega instrucciones si quieres detalles específicos, o deja vacío para formato estándar.",
    cancel: "Cancelar"
  },
  en: {
    tabTopics: "TOPICS",
    tabSlides: "SLIDES",
    tabGuides: "GUIDES",
    tabWorkshops: "WORKSHOPS",
    tabExams: "EXAMS",
    tabQuizzes: "QUIZZES",
    tabVideos: "VIDEOS",
    tabGames: "GAMES",
    tabConceptMaps: "SCHEMAS & MAPS",
    tabInclusion: "INCLUSION TIPS",
    generateGuide: "Generate Advanced Lesson Guide",
    grade: "Grade",
    period: "Term",
    noResources: "No resources generated for",
    startGenerating: "Start by generating a general 13-class syllabus for this term.",
    generatePlan13: "Generate 13-Class Syllabus",
    aiAdaptationTools: "🛠️ AI ADAPTATION TOOLS:",
    clickToGenerate: "Click to generate the corresponding material for your selection.",
    genSlides: "Generate Canva / PPT Slides",
    genGuide: "Generate Lesson Guide",
    genWorkshops: "Generate 2 Practical Workshops",
    genExam: "Generate Unit Exam",
    genQuiz: "Generate Quick Quiz",
    genVideo: "Generate Video Script",
    genGame: "Generate Interactive Game",
    genConceptMap: "Generate Schema / Map",
    genDUA: "Generate UDL Adaptation",
    generatingResource: "Generating resource with AI...",
    generatingDUA: "Generating UDL inclusive adaptation...",
    thisMayTakeAWhile: "This may take a few seconds",
    generatedContent: "✅ Generated Content",
    searchVideo: "▶ Search Video on YouTube",
    searchVideoShort: "▶ Search Video",
    saveWord: "📄 Download as Word (.doc)",
    saveWordShort: "📄 Save to Word",
    genOther: "← Generate Another",
    regenerate: "← Regenerate",
    close: "Close",
    classesAndSlides: "✅ 13 Independent Classes + Slides Generated",
    mainContent: "Main Content / Quiz / Table",
    presentationIdeas: "Presentation Structure",
    teacherGuide: "Teacher's Guide / Answer Key",
    interactiveGame: "Dynamics / Interactive Game",
    subjects: {
      "Español y Lit.": "Spanish & Lit.",
      "Inglés": "Inglés", // EXCEPCIÓN DE NEGOCIO OBLIGATORIA
      "C. Sociales": "Social Studies",
      "C. Naturales": "Natural Sciences",
      "Matemáticas": "Mathematics",
      "Tecnología": "Technology",
      "Historia": "History",
      "Estadística": "Statistics",
      "Biblia": "Bible",
      "Ética": "Ethics",
      "Lectura Crítica": "Critical Reading",
      "Plan Lector": "Reading Plan",
      "Educación Física": "Physical Education",
      "Física": "Physics",
      "Química": "Chemistry",
      "Artes": "Arts",
      "Filosofía": "Philosophy",
      "Música": "Music",
      "Emprendimiento": "Entrepreneurship"
    },
    attachDocument: "Attach Document",
    subjectLabel: "Subject:",
    sectionsHeader: "📌 SECTIONS / TOPICS OF THE TERM (13 WEEKS):",
    week: "Week",
    of: "of",
    activeModule: "Active Thematic Module",
    mainTopicsHeader: "📌 Main Thematic Axes:",
    curricularPlanSubtitle: "Curriculum Plan & Teaching Resources",
    playNow: "Play Now!",
    playGame: "▶ Play on",
    slidesDesign: "Design Platforms",
    duaAdaptation: "🎯 Generated UDL Inclusive Adaptation",
    selectCondition: "Select a condition:",
    generalStrategy: "General Strategies",
    activityAdaptation: "Activity Adaptation",
    evaluation: "Evaluation",
    aiGenerator: "AI Generator for",
    notebookSectioned: "EDUDOCENT Sectioned Notebook",
    extraInstructions: "Extra instructions for the AI...",
    generateNow: "✨ Generate Now",
    errorRequired: "Add instructions for specific details, or leave blank for standard format.",
    cancel: "Cancel"
  }
};

// Tipos de contenido con sus emojis y etiquetas
const getContentTypes = (t) => [
  { key: 'temas', label: t.tabTopics, icon: '📚' },
  { key: 'diapositivas', label: t.tabSlides, icon: '📊' },
  { key: 'guias', label: t.tabGuides, icon: '📑' },
  { key: 'talleres', label: t.tabWorkshops, icon: '📝' },
  { key: 'examenes', label: t.tabExams, icon: '✏️' },
  { key: 'quizzes', label: t.tabQuizzes, icon: '⚡' },
  { key: 'videos', label: t.tabVideos, icon: '🎬' },
  { key: 'juegos', label: t.tabGames, icon: '🎮' },
  { key: 'mapas', label: t.tabConceptMaps, icon: '🗺️' },
  { key: 'tips_docente', label: t.tabInclusion, icon: '💡', special: true }
];

const grades = [6, 7, 8, 9, 10, 11];
const periods = [1, 2, 3, 4];

// Plataformas de juegos interactivos educativos recomendados
const plataformasJuegos = [
  { name: 'Wordwall', desc: 'Cuestionarios, ruletas y sopas de letras', icon: '🎯', url: 'https://wordwall.net/es', color: 'from-blue-500 to-indigo-600' },
  { name: 'Educaplay', desc: 'Crucigramas, adivinanzas y mapas', icon: '🧩', url: 'https://es.educaplay.com', color: 'from-emerald-500 to-teal-600' },
  { name: 'PhET Interactivas', desc: 'Simulaciones de Ciencias y Matemáticas', icon: '🔬', url: 'https://phet.colorado.edu/es', color: 'from-orange-500 to-amber-600' },
  { name: 'Kahoot!', desc: 'Desafíos grupales y trivias en tiempo real', icon: '⚡', url: 'https://kahoot.it', color: 'from-purple-500 to-pink-600' },
  { name: 'Quizizz', desc: 'Evaluaciones lúdicas adaptativas', icon: '🎮', url: 'https://quizizz.com', color: 'from-violet-500 to-purple-600' },
  { name: 'Baamboozle', desc: 'Juegos de preguntas para equipos en clase', icon: '🐼', url: 'https://www.baamboozle.com', color: 'from-rose-500 to-red-600' }
];

// Plataformas de creación de diapositivas
const plataformasDiapositivas = [
  { name: 'Canva', desc: 'Diseño visual con IA y miles de plantillas', icon: '🎨', url: 'https://www.canva.com/', color: 'from-blue-500 to-cyan-500' },
  { name: 'PowerPoint', desc: 'Crea diapositivas desde tu cuenta Microsoft', icon: '📊', url: 'https://office.live.com/start/PowerPoint.aspx', color: 'from-orange-500 to-red-600' },
  { name: 'Google Slides', desc: 'Presentaciones colaborativas en Drive', icon: '🟡', url: 'https://docs.google.com/presentation/', color: 'from-amber-400 to-yellow-500' }
];

// Obtener URL de búsqueda directa en cada plataforma de juego según tema y materia
export const getPlataformaSearchUrl = (platformName = '', topic = '', subject = '') => {
  const cleanTopic = (topic || '').replace(/^tema\s*\d*\s*:?\s*/gi, '').trim();
  const query = encodeURIComponent(`${cleanTopic} ${subject || ''}`.trim() || 'educacion');
  const name = String(platformName || '').toLowerCase();
  if (name.includes('wordwall')) return `https://wordwall.net/es-cl/community?localeId=1033&query=${query}`;
  if (name.includes('educaplay')) return `https://es.educaplay.com/recursos-educativos/?q=${query}`;
  if (name.includes('phet')) return `https://phet.colorado.edu/es/simulations/filter?sort=alpha&view=grid&q=${query}`;
  if (name.includes('kahoot')) return `https://create.kahoot.it/discover?filter=1&query=${query}`;
  if (name.includes('quizizz')) return `https://quizizz.com/admin/search/${query}`;
  if (name.includes('baamboozle')) return `https://www.baamboozle.com/games?search=${query}`;
  return `https://wordwall.net/es-cl/community?localeId=1033&query=${query}`;
};

// Determina la app más recomendable según la materia
export const getRecommendedGameApp = (subject = '') => {
  const s = String(subject || '').toLowerCase();
  if (s.includes('mate') || s.includes('físic') || s.includes('químic') || s.includes('cienc') || s.includes('biolog') || s.includes('trigono') || s.includes('álgebr')) {
    return { name: 'PhET Interactivas', icon: '🔬', desc: 'Simulaciones visuales interactivas para ciencias y matemáticas' };
  }
  if (s.includes('social') || s.includes('histori') || s.includes('geograf') || s.includes('filosof') || s.includes('étic')) {
    return { name: 'Educaplay', icon: '🧩', desc: 'Crucigramas, mapas conceptuales y dinámicas interactivas' };
  }
  if (s.includes('inglés') || s.includes('idiom') || s.includes('lengu') || s.includes('español') || s.includes('literat')) {
    return { name: 'Wordwall', icon: '🎯', desc: 'Ruletas, cuestionarios y sopas de letras gamificadas' };
  }
  return { name: 'Kahoot!', icon: '⚡', desc: 'Trivias grupales y desafíos en tiempo real' };
};

// Opciones de necesidades educativas para el modal de adaptación
const necesidadesEducativas = [
  { value: 'discapacidad_intelectual_leve', label: 'Discapacidad Intelectual Leve' },
  { value: 'tdah', label: 'TDAH (Déficit de Atención e Hiperactividad)' },
  { value: 'dificultades_visuales', label: 'Dificultades Visuales' },
  { value: 'dua_general', label: 'DUA General (Diseño Universal para el Aprendizaje)' }
];

// Mapa de sugerencias dinámicas (placeholders) por materia para los modales del Notebook
const subjectPlaceholders = {
  'Español y Lit.': (g, p) => `Ej: Genera el plan de 13 clases para el Periodo ${p} de ${g}° sobre Literatura Precolombina y el uso del verbo.`,
  'Inglés': (g, p) => `Ej: Crea un plan de 13 clases para el Periodo ${p} de ${g}° sobre el Presente Simple, rutinas diarias y vocabulario de la ciudad.`,
  'C. Sociales': (g, p) => `Ej: Haz un plan de 13 clases para el Periodo ${p} de ${g}° sobre las antiguas civilizaciones (Egipto y Mesopotamia).`,
  'C. Naturales': (g, p) => `Ej: Arma un plan de 13 semanas para el Periodo ${p} de ${g}° sobre los ecosistemas y la cadena trófica.`,
  'Matemáticas': (g, p) => `Ej: Genera el plan de 13 clases para el Periodo ${p} de ${g}° sobre funciones lineales y álgebra.`,
  'Tecnología': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre introducción a la programación y algoritmos básicos.`,
  'Historia': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre la Revolución Industrial y sus consecuencias.`,
  'Estadística': (g, p) => `Ej: Haz un plan de 13 clases para el Periodo ${p} de ${g}° sobre medidas de tendencia central y probabilidad.`,
  'Biblia': (g, p) => `Ej: Crea un plan de 13 clases para el Periodo ${p} de ${g}° analizando los personajes del Antiguo Testamento.`,
  'Ética': (g, p) => `Ej: Plan de 13 semanas para el Periodo ${p} de ${g}° sobre ética profesional, proyecto de vida y empatía.`,
  'Lectura Crítica': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre cómo identificar falacias en textos argumentativos.`,
  'Plan Lector': (g, p) => `Ej: Arma un cronograma de lectura de 13 semanas para el Periodo ${p} de ${g}° para analizar una novela juvenil en clase.`,
  'Educación Física': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre acondicionamiento físico básico y reglas del baloncesto.`,
  'Física': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre cinemática y Movimiento Rectilíneo Uniforme.`,
  'Química': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre la materia, estados y modelos atómicos.`,
  'Artes': (g, p) => `Ej: Plan de 13 clases para el Periodo ${p} de ${g}° sobre la teoría del color y técnicas básicas de acuarela.`,
  'Filosofía': (g, p) => `Ej: Crea un plan de 13 clases para el Periodo ${p} de ${g}° sobre los filósofos presocráticos y Sócrates.`,
  'Música': (g, p) => `Ej: Plan de 13 semanas para el Periodo ${p} de ${g}° sobre lectura de pentagrama, ritmo y figuras musicales.`,
  'Emprendimiento': (g, p) => `Ej: Haz un plan de 13 clases para el Periodo ${p} de ${g}° sobre ideación de negocios y el modelo Canvas.`
};

const getSubjectPlaceholder = (materiaLabel, grado = 6, periodo = 1) => {
  if (!materiaLabel) return `Ej: Genera el plan de 13 clases para el Periodo ${periodo} de ${grado}°...`;
  const cleanLabel = materiaLabel.replace(/^🧩\s*/, '').trim();
  const builder = subjectPlaceholders[cleanLabel] || subjectPlaceholders[materiaLabel];
  if (typeof builder === 'function') {
    return builder(grado, periodo);
  }
  return `Ej: Genera el plan de 13 clases para el Periodo ${periodo} de ${grado}°...`;
};

// ==========================================
// SYSTEM PROMPT AVANZADO UNIFICADO SECCIONADO
// ==========================================
const SYSTEM_PROMPT_AVANZADO = `Eres un colega empático y asistente pedagógico experto. Si el docente menciona estrés, carga laboral o conflictos, TIENES ESTRICTAMENTE PROHIBIDO generar rutas didácticas o contenido. Tu único rol es validar sus emociones y brindar apoyo moral en texto conversacional.
Cuando el docente solicite recursos académicos, tu objetivo es apoyar a los docentes de bachillerato (6° a 11°) y actuar como experto en planificación educativa, DUA y pedagogía. Háblales de tú, como un colega cercano. Valida su esfuerzo, usa un lenguaje conversacional y natural, y evita por completo sonar como un robot, un diccionario o un sistema automatizado.
IMPORTANTE: Tu respuesta SIEMPRE debe ser un único objeto JSON válido. DENTRO de este objeto JSON, añade SIEMPRE una propiedad adicional llamada 'mensaje_empatico' que contenga tu mensaje conversacional, cálido y de aliento para el profesor.

REGLA INQUEBRANTABLE DE COMILLAS Y JSON (OBLIGATORIA):
Tienes ESTRICTAMENTE PROHIBIDO utilizar comillas dobles internas (") dentro de tus textos o párrafos explicativos, ya que rompen la estructura del JSON. Usa únicamente comillas simples (') si necesitas citar algo.

REGLA DE FORMATO LIBRE O INSTRUCCIONES ESPECÍFICAS (OBLIGATORIA):
Evalúa la instrucción adicional del docente. Si pide un formato libre, una carta, o un resumen específico que no sea un plan de periodo, IGNORA la regla de las 13 semanas. En esos casos, responde OBLIGATORIAMENTE con este JSON exacto: { "tipo_respuesta": "libre", "contenido_markdown": "Tu respuesta detallada y organizada aquí, usando formato Markdown." }

REGLA DE 13 SEMANAS Y LÍMITE DE LONGITUD (OBLIGATORIA):
Cuando se solicite un plan de periodo, la IA DEBE estructurar obligatoriamente una tabla HTML con 13 filas individuales, desglosando los temas progresivamente sin resumir ni agrupar. DEBES generar OBLIGATORIAMENTE 13 temas sueltos y secuenciales, con un párrafo detallado que el profesor debe explicar en voz alta a los alumnos en el array "clases_semanales". Limita la Guía de Explicación de cada semana a un máximo de 50 palabras precisas. Tienes ESTRICTAMENTE PROHIBIDO agrupar semanas, hacer resúmenes agrupados o reducir la cantidad a menos de 13 clases.

ALERTA DE AUDIENCIA (OBLIGATORIO):
El contenido es para estudiantes de 6° a 11° de bachillerato colombiano. El usuario final es un DOCENTE que debe explicar temas complejos en el aula.
En la columna "detalle_explicacion" (Guía de Explicación para Voz Alta), tienes ESTRICTAMENTE PROHIBIDO dar resúmenes vagos, genéricos o superficiales.
DEBES proporcionar un párrafo preciso y concreto (máximo 50 palabras) con:
- Los DATOS EXACTOS: fechas históricas, fórmulas matemáticas, definiciones precisas, autores, leyes científicas y ejemplos concretos.
- Utiliza lenguaje pedagógico accesible adaptado al grado solicitado.
- Incluye al menos 1 PREGUNTA DE VERIFICACIÓN RÁPIDA que el docente pueda hacer oralmente al finalizar.
- NO uses frases vacías como 'se explica el tema'. En su lugar, ESCRIBE los conceptos reales con comillas simples.

REGLA DE OBEDIENCIA DE FORMATO Y PROFUNDIDAD:
Tienes ESTRICTAMENTE PROHIBIDO responder con resúmenes genéricos o listas de temas básicos. Debes adaptar la estructura de tu respuesta EXACTAMENTE a lo que el docente pida en sus instrucciones:
- Si pide un Mapa Conceptual o Cuadro Sinóptico: No generes párrafos. Utiliza jerarquías visuales estrictas con viñetas anidadas (Markdown), usando negritas para los conceptos principales y viñetas secundarias para las ramificaciones y definiciones exactas.
- Si pide una Guía de Explicación: Tienes prohibido dar solo los objetivos. Debes redactar el contenido teórico a profundidad, incluyendo datos curiosos, fechas, fórmulas o definiciones detalladas que el profesor leerá literalmente a sus alumnos.
- Si pide un Taller o Quiz: Estructura directamente las preguntas (abiertas o de selección múltiple) enfocadas en el tema específico, sin incluir resúmenes teóricos innecesarios.

ALERTA DE ESTRUCTURA Y FORMATO:
- Si piden PLAN DE PERIODO: Está PROHIBIDO agrupar temas. Un periodo tiene 13 semanas. DEBES generar OBLIGATORIAMENTE 13 temas sueltos y secuenciales, con un párrafo detallado (máximo 50 palabras) en el array "clases_semanales".
- Si piden PRESENTACIÓN CANVA / PPT: Genera en "ideas_presentacion" un esquema estructurado diapositiva por diapositiva (Slide 1: Título, Slide 2: Pregunta generadora, Slide 3: Concepto clave, etc.) listo para copiar a Canva o PowerPoint.
- Si piden TALLERES: Genera en "contenido_principal" 2 talleres prácticos completos e independientes con instrucciones claras y ejercicios.
- En la llave "recursos_online", DEBES generar un arreglo de mínimo 5 a 7 objetos con juegos interactivos o simuladores adecuados al tema. Explora plataformas diversas como Wordwall, Kahoot, Educaplay, Quizizz, Blooket, Cerebriti o PhET. La estructura JSON exacta requerida es:
"recursos_online": [ { "plataforma": "Nombre de la Plataforma", "url_busqueda": "URL_EXACTA_CON_EL_TEMA" } ]
- Si piden EXAMEN O QUIZ: Genera formato imprimible limpio con encabezado institucional y clave de respuestas para el docente.

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo_periodo": "Título General o del Tema",
  "clases_semanales": [
    { "semana": 1, "tema_suelto": "Nombre específico del Tema de la semana 1", "detalle_explicacion": "Párrafo preciso con datos exactos, fórmulas, fechas y pregunta oral de verificación al final (máximo 50 palabras, solo comillas simples)." }
  ],
  "contenido_principal": "Desarrollo detallado del recurso solicitado (Guía, 2 Talleres, Examen evaluativo, Quiz imprimible, Guion de Video o Dinámica de Juego)",
  "ideas_presentacion": "Esquema completo slide por slide para diapositivas en Canva o PowerPoint",
  "recursos_online": [
    { "plataforma": "Wordwall", "url_busqueda": "https://wordwall.net/es-cl/community?localeId=1033&query=tema+especifico" },
    { "plataforma": "Kahoot", "url_busqueda": "https://create.kahoot.it/discover?filter=1&query=tema+especifico" },
    { "plataforma": "Educaplay", "url_busqueda": "https://es.educaplay.com/recursos-educativos/?q=tema+especifico" },
    { "plataforma": "Quizizz", "url_busqueda": "https://quizizz.com/admin/search/tema+especifico" },
    { "plataforma": "PhET", "url_busqueda": "https://phet.colorado.edu/es/simulations/filter?sort=alpha&view=grid&q=tema+especifico" }
  ]
}`;

// ==========================================
// FUNCIÓN: Formatear Markdown a HTML rico para Web y Word
// ==========================================
const formatMarkdownToHTML = (text) => {
  if (!text) return '';
  if (typeof text !== 'string') return text;
  
  if (text.trim().startsWith('<') && (text.includes('</') || text.includes('/>'))) {
    return text;
  }

  let raw = String(text);

  // 1. Normalizar saltos de línea
  raw = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Asegurar que encabezados ### tengan salto previo si venían pegados a texto
  raw = raw.replace(/([^#\n])\s*(#{1,6}\s+)/g, '$1\n\n$2');

  // 3. Convertir tablas Markdown a HTML
  const lines = raw.split('\n');
  const resultLines = [];
  let inTable = false;
  let tableLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        const valid = tableLines.filter(l => !l.includes('---') && !l.includes(':---'));
        if (valid.length > 0) {
          let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:12px; border:1px solid #cbd5e1;">';
          valid.forEach((tl, idx) => {
            const cells = tl.split('|').slice(1, -1).map(c => c.trim());
            if (idx === 0) {
              tableHTML += '<thead style="background-color:#4f46e5; color:white;"><tr>' +
                cells.map(c => `<th style="border:1px solid #4338ca; padding:8px; text-align:left; font-weight:bold;">${c}</th>`).join('') +
                '</tr></thead><tbody>';
            } else {
              tableHTML += '<tr>' +
                cells.map(c => `<td style="border:1px solid #cbd5e1; padding:8px;">${c}</td>`).join('') +
                '</tr>';
            }
          });
          tableHTML += '</tbody></table>';
          resultLines.push(tableHTML);
        }
        tableLines = [];
        inTable = false;
      }
      resultLines.push(line);
    }
  }
  if (inTable) {
    const valid = tableLines.filter(l => !l.includes('---') && !l.includes(':---'));
    if (valid.length > 0) {
      let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:12px; border:1px solid #cbd5e1;">';
      valid.forEach((tl, idx) => {
        const cells = tl.split('|').slice(1, -1).map(c => c.trim());
        if (idx === 0) {
          tableHTML += '<thead style="background-color:#4f46e5; color:white;"><tr>' +
            cells.map(c => `<th style="border:1px solid #4338ca; padding:8px; text-align:left; font-weight:bold;">${c}</th>`).join('') +
            '</tr></thead><tbody>';
        } else {
          tableHTML += '<tr>' +
            cells.map(c => `<td style="border:1px solid #cbd5e1; padding:8px;">${c}</td>`).join('') +
            '</tr>';
        }
      });
      tableHTML += '</tbody></table>';
      resultLines.push(tableHTML);
    }
  }

  raw = resultLines.join('\n');

  let html = raw
    .replace(/^##### (.*$)/gim, '<h5 style="font-size: 13px; font-weight: 700; color: #0284c7; margin: 12px 0 4px 0;">$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 14px 0 6px 0;">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 15px; font-weight: 800; color: #4338ca; margin: 18px 0 10px 0; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px;">$1</h3>')
    .replace(/\[DIAPOSITIVA\s*(\d*|[^\]]*)\]/gi, '<div class="mt-6 mb-3 pt-3 border-t-2 border-amber-300 dark:border-amber-700/60 flex items-center gap-2"><span class="bg-amber-600 text-white text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">🖥️ Diapositiva $1</span></div>')
    .replace(/\[TITULO\]\s*(.*)/gi, '<div class="text-sm font-black text-amber-950 dark:text-amber-200 mt-2 mb-1"><span class="bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-[10px] font-black px-2 py-0.5 rounded mr-1.5 uppercase">TÍTULO</span><strong>$1</strong></div>')
    .replace(/\[CONTENIDO\]\s*(.*)/gi, '<div class="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1 mb-2 leading-relaxed"><span class="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded mr-1.5 uppercase">CONTENIDO</span>$1</div>')
    .replace(/\[(OBJETIVO|ACTIVIDAD|DINÁMICA|RECURSO)\]\s*(.*)/gi, '<div class="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1 mb-2 leading-relaxed"><span class="bg-indigo-100 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded mr-1.5 uppercase">$1</span>$2</div>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 800;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #6366f1; background-color: #f8fafc; padding: 10px 14px; margin: 12px 0; border-radius: 0 10px 10px 0; font-style: italic; color: #334155;">$1</blockquote>')
    .replace(/^[*-] (.*$)/gim, '<li style="margin: 4px 0 4px 18px; list-style-type: disc; color: inherit;">$1</li>')
    .replace(/\[ \]/g, '<span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 4px; vertical-align: middle; margin-right: 6px;"></span>')
    .replace(/\(   \)/g, '<span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 50%; vertical-align: middle; margin-right: 6px;"></span>')
    .replace(/\n\n+/g, '<div style="height: 12px;"></div>')
    .replace(/\n/g, '<br/>');

  return html;
};

// ==========================================
// FUNCIÓN: Genera un System Prompt personalizado según el recurso e instrucciones
// ==========================================
const getSystemPromptForResource = (necesidad, instruccionesExtra = '') => {
  const baseInstructions = `Eres un asistente experto en planificación educativa, DUA y pedagogía. Tu objetivo es ahorrarle tiempo al docente proporcionando material listo para usar.
REGLA ESTRICTA DE CLASIFICACIÓN DE INTENCIÓN (OBLIGATORIA): Antes de responder, analiza la intención. Si el docente menciona un problema personal, conflictos con jefes o estrés, TIENES PROHIBIDO generar rutas didácticas o contenido. Tu rol es brindar apoyo emocional como un colega.
REGLA INQUEBRANTABLE DE COMILLAS Y JSON (OBLIGATORIA): Tienes ESTRICTAMENTE PROHIBIDO utilizar comillas dobles internas (") dentro de tus textos o párrafos explicativos, ya que rompen la estructura del JSON. Usa únicamente comillas simples (') si necesitas citar algo.

🚨 REGLA SUPREMA DE PRIORIDAD DEL DOCENTE (OBLIGATORIA Y TOTAL):
Las instrucciones personalizadas que el docente escriba TIENEN PRIORIDAD ABSOLUTA sobre cualquier configuración por defecto.
- Si el docente solicita un número específico de preguntas (por ejemplo: "5 preguntas de selección múltiple y 1 pregunta abierta"), DEBES GENERAR EXACTAMENTE esa cantidad y tipos de preguntas.
- Si pide selección múltiple, incluye cada pregunta numerada con opciones claras (A, B, C, D).
- Si pide preguntas abiertas, incluye la consigna reflexiva y suficiente espacio para que el estudiante responda.
- NUNCA omitas ni resumas las preguntas solicitadas; entrégalas completas, detalladas y listas para el aula.

REGLA DE FORMATO LIBRE (OBLIGATORIA): Si el docente pide expresamente un texto libre, carta o resumen libre, responde con este JSON: { "tipo_respuesta": "libre", "contenido_markdown": "Tu respuesta aquí en Markdown." }
REGLA DE 13 CLASES Y LÍMITE: Solo si se solicita específicamente un plan general de periodo/temario de 13 semanas, genera el array "clases_semanales" con 13 semanas individuales.

REGLA DE OBEDIENCIA DE FORMATO Y PROFUNDIDAD:
- Si pide un Taller o Quiz: Estructura directamente las preguntas (abiertas o de selección múltiple) enfocadas en el tema específico y según las instrucciones del docente.
- Si pide un Mapa Conceptual o Cuadro Sinóptico: Utiliza tablas HTML o jerarquías visuales estrictas.
- Si pide una Guía de Explicación: Redacta el contenido teórico a profundidad con ejemplos y diálogos para el aula.

Responde ÚNICAMENTE con un objeto JSON válido. No incluyas explicaciones de introducción o cierre fuera del JSON.`;

  const necesidadClean = ((necesidad || '') + ' ' + (instruccionesExtra || '')).toLowerCase();

  if (necesidadClean.includes('presentación') || necesidadClean.includes('diapositivas') || necesidadClean.includes('canva') || necesidadClean.includes('ppt')) {
    return `${baseInstructions}
Tu única tarea es diseñar una estructura de diapositivas slide por slide (para PowerPoint o Canva) sobre el tema solicitado.
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Estructura de Diapositivas Canva / PowerPoint",
  "ideas_presentacion": "Genera el contenido de las diapositivas usando ESTRICTAMENTE este formato para CADA diapositiva, sin usar HTML:\n[DIAPOSITIVA 1]\n[TITULO] Escribe aquí el título corto\n[CONTENIDO] Escribe aquí el texto explicativo de la diapositiva (viñetas o párrafos cortos).\n\n[DIAPOSITIVA 2]\n[TITULO] ...\n[CONTENIDO] ...\n\n(Debes generar de 5 a 8 diapositivas siguiendo estrictamente este formato con las etiquetas en corchetes).",
  "guia_docente": "Breve indicación de cómo dirigir esta presentación de forma interactiva."
}`;
  }

  if (necesidadClean.includes('quiz') || necesidadClean.includes('quizzes') || necesidadClean.includes('cuestionario')) {
    return `${baseInstructions}
Tu única tarea es diseñar un Quiz / Cuestionario Evaluativo formal listo para entregar al estudiante y guardarse en Word.
Usa etiquetas HTML limpias (<h1>, <h2>, <p>, <b>, <br>, <ol>, <ul>, <li>).
Encabezado obligatorio en la parte superior:
<b>Nombre del Estudiante:</b> ___________________________ <b>Fecha:</b> ____________ <b>Nota:</b> _____<br><br>

INSTRUCCIONES DE PREGUNTAS (OBLIGATORIO):
- SI EL DOCENTE INDICÓ INSTRUCCIONES ESPECÍFICAS (ej: "5 preguntas de selección múltiple y 1 pregunta abierta", o cualquier otra indicación), DEBES CUMPLIRLAS AL 100% GENERANDO TODAS Y CADA UNA DE LAS PREGUNTAS COMPLETAS.
- Para preguntas de selección múltiple: incluye el enunciado numerado y las opciones (A, B, C, D) en renglones separados.
- Para preguntas abiertas: incluye el enunciado claro y un espacio con líneas punteadas o espacio en blanco para que el alumno redacte.
- Si el docente no especificó cantidad, genera por defecto 5 preguntas de selección múltiple con opciones (A, B, C, D).

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Quiz Evaluativo de Clase",
  "contenido_principal": "El código HTML completo y estructurado del quiz, con encabezado formal de estudiante y TODAS las preguntas solicitadas completamente desarrolladas y listas para imprimir.",
  "guia_docente": "Clave detallada de respuestas correctas comentadas para el docente (ej: 1. A, 2. B...) y rúbrica para preguntas abiertas."
}`;
  }

  if (necesidadClean.includes('taller') || necesidadClean.includes('talleres')) {
    return `${baseInstructions}
Tu única tarea es diseñar los talleres prácticos solicitados.
Si el usuario pidió una cantidad o formato específico en sus instrucciones (ej: 1 taller, 3 talleres, o tipos específicos de actividades), GENERA EXACTAMENTE LO SOLICITADO.
Por defecto diseña DOS (2) talleres prácticos completos.
Usa etiquetas HTML (<h1>, <h2>, <p>, <b>, <br>, <ul>, <ol>, <li>, <hr>) para darle formato formal de hoja de trabajo para estudiantes.
Cada taller DEBE tener en la parte superior el siguiente encabezado exacto:
<b>Nombre:</b> ___________________________ <b>Fecha:</b> _________________<br><br>

Taller 1: Ejercicios de fijación conceptual (nivel básico/intermedio).
Taller 2: Ejercicios aplicados o contextualizados (nivel aplicado).

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Talleres Prácticos Evaluativos",
  "contenido_principal": "El código HTML completo de los talleres. Incluye el encabezado de Nombre/Fecha en cada taller. Deja espacios generosos (usando múltiples <br>) entre preguntas para que el estudiante pueda escribir su respuesta.",
  "guia_docente": "Criterios rápidos de evaluación y clave de respuestas correctas para el profesor."
}`;
  }

  if (necesidadClean.includes('examen') || necesidadClean.includes('evaluación')) {
    return `${baseInstructions}
Tu única tarea es diseñar un Examen de Unidad estructurado formalmente y listo para imprimir en Word.
Usa etiquetas HTML (<h1>, <h2>, <p>, <b>, <br>, <ol>, <ul>, <li>) para darle formato de hoja de examen real.
El examen DEBE tener en la parte superior el siguiente encabezado exacto:
<b>Centro Educativo:</b> ___________________________<br>
<b>Nombre del Estudiante:</b> ___________________________<br>
<b>Fecha:</b> _________________ <b>Grado:</b> _________<br><br>

Si el docente dio instrucciones sobre cantidad o tipo de preguntas, SÍGUELAS EXACTAMENTE.
Por defecto:
1. 5 preguntas de selección múltiple tipo pruebas Saber (A, B, C, D).
2. 2 preguntas abiertas de desarrollo reflexivo con suficiente espacio para responder a mano.

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Examen de Unidad Imprimible",
  "contenido_principal": "El código HTML completo del examen, incluyendo el encabezado y todas las preguntas estructuradas, diseñado de forma limpia para ser impreso.",
  "guia_docente": "Clave de respuestas correctas (A, B, C, D) y criterios de evaluación para las preguntas abiertas."
}`;
  }

  if (necesidadClean.includes('guía') || necesidadClean.includes('explicación') || necesidadClean.includes('tema')) {
    return `${baseInstructions}
Tu única tarea es redactar una Guía de Aprendizaje / Explicación del tema solicitado.
Debe explicar detalladamente qué es el concepto, cómo se usa, analogías pedagógicas y un apartado de cómo explicárselo a los alumnos en voz alta, incluyendo a estudiantes con necesidades educativas especiales (DUA).
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Guía Conceptual de Explicación",
  "contenido_principal": "Explicación profunda del concepto para el profesor con ejemplos, analogías explicativas y un apartado titulado '¿Cómo explicárselo a tus alumnos?' con diálogos sugeridos.",
  "guia_docente": "Estrategias de Diseño Universal para el Aprendizaje (DUA) específicas para enseñar este concepto en el aula."
}`;
  }

  if (necesidadClean.includes('video')) {
    return `${baseInstructions}
Tu única tarea es redactar el Guion de un Video Explicativo corto sobre el tema solicitado.
Debe estructurarse con gancho inicial, desarrollo conceptual y llamada a la acción.
En la llave "busqueda_youtube", construye el enlace exacto de YouTube buscando el concepto específico.
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Guion Didáctico para Video",
  "busqueda_youtube": "https://www.youtube.com/results?search_query=tema+especifico+explicacion",
  "contenido_principal": "Guion detallado de 2 columnas indicando lo que se muestra visualmente en pantalla y el audio/locución correspondiente que debe decir el docente.",
  "guia_docente": "Consejos rápidos de grabación, tono de voz y plataformas educativas sugeridas."
}`;
  }

  if (necesidadClean.includes('juego')) {
    return `${baseInstructions}
Tu única tarea es diseñar la dinámica y preguntas para un Juego Educativo Interactivo listo para el aula sobre el tema solicitado.
Debe detallar las preguntas, respuestas y dinámica de juego.
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Juego Interactivo para Clase",
  "contenido_principal": "Dinámica detallada de cómo jugar en el aula más 5 preguntas de trivia con sus opciones y respuestas para interactuar con los estudiantes.",
  "recursos_online": [
    { "plataforma": "Wordwall", "url_busqueda": "https://wordwall.net/es-cl/community?localeId=1033&query=tema+especifico" },
    { "plataforma": "Kahoot", "url_busqueda": "https://create.kahoot.it/discover?filter=1&query=tema+especifico" },
    { "plataforma": "Educaplay", "url_busqueda": "https://es.educaplay.com/recursos-educativos/?q=tema+especifico" },
    { "plataforma": "Quizizz", "url_busqueda": "https://quizizz.com/admin/search/tema+especifico" },
    { "plataforma": "PhET", "url_busqueda": "https://phet.colorado.edu/es/simulations/filter?sort=alpha&view=grid&q=tema+especifico" }
  ],
  "guia_docente": "Instrucciones paso a paso de cómo organizar a los alumnos y otorgar puntos."
}`;
  }

  if (necesidadClean.includes('mapa') || necesidadClean.includes('gráfico') || necesidadClean.includes('esquema') || necesidadClean.includes('organizador')) {
    return `${baseInstructions}
Tu única tarea es generar el Organizador Gráfico solicitado (Mapa Conceptual, Mapa Mental, Cuadro Sinóptico, Línea de Tiempo, Diagrama de Venn, etc.).
REGLAS ESTRICTAS DE FORMATO (Para que se vea excelente en Word):
- Mapa Conceptual o Mental: Usa tablas donde las celdas y bordes simulen nodos y conectores, o listas anidadas (<ul>) estilizadas.
- Cuadro Sinóptico: Usa una tabla HTML con la primera columna agrupada (rowspan) para simular la jerarquía/llaves.
- Línea de Tiempo: Usa una tabla HTML de 2 columnas (Fecha/Época y Evento).
- Cuadro Comparativo / Venn: Usa una tabla HTML comparando los aspectos.
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Organizador Gráfico del Tema",
  "contenido_principal": "El código HTML completo con la representación visual estructurada.",
  "guia_docente": "Sugerencias de cómo utilizar este recurso visual en la clase."
} `;
  }

  if (necesidadClean.includes('dua') || necesidadClean.includes('inclusi') || necesidadClean.includes('adaptaci') || necesidadClean.includes('tip')) {
    return `${baseInstructions}
Tu única tarea es generar la Adaptación Curricular DUA y Tips de Inclusión para el aula sobre el tema solicitado.
Usa etiquetas HTML (<p>, <b>, <br>, <ul>, <li>, <h3>, <table>) para que sea un informe pedagógico profesional listo para guardar en Word.
Estructura la respuesta en 4 apartados prácticos:
1. Múltiples formas de representación (visual, auditiva, kinestésica).
2. Múltiples formas de acción y expresión (opciones de respuesta y evaluación).
3. Múltiples formas de implicación (fomento de la motivación y curiosidad).
4. Ajustes razonables y apoyos específicos (TDAH, TEA y dificultades de lectoescritura).
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Adaptación Curricular DUA y Tips de Inclusión",
  "contenido_principal": "El código HTML estructurado y detallado con todas las adaptaciones y recomendaciones para el aula, listo para imprimir y aplicar.",
  "guia_docente": "Recomendaciones clave de acompañamiento emocional y clima de aula positivo."
}`;
  }

  return SYSTEM_PROMPT_AVANZADO;
};

// ==========================================
// FUNCIÓN ASÍNCRONA: Descargar PowerPoint (.pptx) usando PptxGenJS
// ==========================================
export const descargarPPTX = async (titulo, resultado, showToast) => {
  try {
    const docTitle = (typeof resultado === 'object' && (resultado?.titulo_periodo || resultado?.titulo_plan || resultado?.titulo)) || titulo || "Presentacion_EDUDOCENT";
    
    // Obtener el constructor de forma segura para Vite y bundles ES
    const PptxConstructor = typeof pptxgen === 'function' ? pptxgen : (pptxgen?.default || pptxgen);
    if (!PptxConstructor) {
      throw new Error("Librería PptxGenJS no disponible");
    }
    const pres = new PptxConstructor();
    pres.author = 'EDUDOCENT AI';
    pres.company = 'EDUDOCENT';
    pres.title = docTitle;
    pres.layout = 'LAYOUT_16x9';

    // Slide 1: Portada Principal
    const titleSlide = pres.addSlide();
    titleSlide.background = { color: "0F172A" };
    titleSlide.addText("EDUDOCENT AI", { x: 0.5, y: 1.0, w: '90%', h: 0.5, fontSize: 14, bold: true, color: "6366F1", align: "center" });
    titleSlide.addText(docTitle, { x: 0.5, y: 1.7, w: '90%', h: 1.5, fontSize: 28, bold: true, color: "FFFFFF", align: "center" });
    titleSlide.addText("Recurso pedagógico estructurado para el aula", { x: 0.5, y: 3.4, w: '90%', h: 0.5, fontSize: 16, color: "94A3B8", align: "center" });

    // === ESTRATEGIA 1: Si viene en el formato de 13 clases semanales en JSON ===
    if (resultado && Array.isArray(resultado.clases_semanales) && resultado.clases_semanales.length > 0) {
      resultado.clases_semanales.forEach((clase, idx) => {
        const slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };

        slide.addText(`Clase / Semana ${clase.semana || idx + 1}`, {
          x: 0.5, y: 0.4, w: 2.5, h: 0.45,
          fontSize: 12, bold: true, color: "FFFFFF",
          fill: { color: "4F46E5" }, align: "center"
        });

        slide.addText(clase.tema_unico_y_diferente || clase.tema_suelto || `Tema ${idx + 1}`, {
          x: 0.5, y: 1.0, w: '90%', h: 0.7,
          fontSize: 22, bold: true, color: "0F172A"
        });

        slide.addShape(pres.ShapeType.line, {
          x: 0.5, y: 1.7, w: '90%', h: 0,
          line: { color: "E2E8F0", width: 2 }
        });

        const detalle = (clase.detalle_explicacion || '').replace(/<[^>]*>?/gm, '').trim();
        slide.addText(detalle, {
          x: 0.5, y: 1.9, w: '90%', h: 3.2,
          fontSize: 14, color: "334155", valign: 'top',
          lineSpacing: 20
        });

        slide.addText('EDUDOCENT AI — Chispa Pedagógica', {
          x: 0.5, y: 5.2, w: '50%', h: 0.3,
          fontSize: 10, color: "94A3B8"
        });
      });
    }
    // === ESTRATEGIA 2: Si viene con tags de diapositivas o texto estructurado ===
    else {
      const rawText = (typeof resultado === 'string'
        ? resultado
        : (resultado?.ideas_presentacion || resultado?.estructura_presentacion || resultado?.presentation || resultado?.contenido_principal || resultado?.plan_13_clases || resultado?._texto_libre || ''));

      let slideBlocks = [];
      if (/\[DIAPOSITIVA\s*\d*\]/i.test(rawText)) {
        slideBlocks = rawText.split(/\[DIAPOSITIVA\s*\d*\]/i).filter(b => b.trim().length > 0);
      } else if (/(?:###|\*\*)\s*(?:Diapositiva|Slide|Lámina)\s*\d+/i.test(rawText)) {
        slideBlocks = rawText.split(/(?=(?:###|\*\*)\s*(?:Diapositiva|Slide|Lámina)\s*\d+)/i).filter(b => b.trim().length > 0);
      } else if (/###\s+/i.test(rawText)) {
        slideBlocks = rawText.split(/(?=###\s+)/i).filter(b => b.trim().length > 0);
      } else if (rawText.includes('<h2') || rawText.includes('<h3')) {
        slideBlocks = rawText.split(/(?=<h[23])/i).filter(b => b.trim().length > 0);
      } else {
        slideBlocks = rawText.split(/\n\n+/).filter(b => b.trim().length > 20);
      }

      if (slideBlocks.length > 0) {
        slideBlocks.forEach((block, idx) => {
          const slide = pres.addSlide();
          slide.background = { color: "FFFFFF" };

          const cleanBlock = block.replace(/<[^>]*>?/gm, '').trim();
          let slideTitle = `Diapositiva ${idx + 1}`;
          let slideContent = cleanBlock;

          if (/\[TITULO\]/i.test(cleanBlock)) {
            const titleMatch = cleanBlock.match(/\[TITULO\]([\s\S]*?)\[CONTENIDO\]/i);
            const contentMatch = cleanBlock.match(/\[CONTENIDO\]([\s\S]*)/i);
            if (titleMatch) slideTitle = titleMatch[1].trim();
            if (contentMatch) slideContent = contentMatch[1].trim();
          } else {
            const lines = cleanBlock.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length > 0 && (lines[0].startsWith('#') || lines[0].startsWith('**') || lines[0].length < 80)) {
              slideTitle = lines[0].replace(/^[#*•\-\s]+/, '').replace(/[*#]+$/, '').trim();
              slideContent = lines.slice(1).join('\n');
            }
          }

          slide.addText(slideTitle || `Diapositiva ${idx + 1}`, {
            x: 0.5, y: 0.5, w: '90%', h: 0.8,
            fontSize: 22, bold: true, color: "0D9488"
          });

          slide.addShape(pres.ShapeType.line, {
            x: 0.5, y: 1.4, w: '90%', h: 0,
            line: { color: "E2E8F0", width: 2 }
          });

          slide.addText(slideContent.trim() || cleanBlock, {
            x: 0.5, y: 1.7, w: '90%', h: 3.4,
            fontSize: 14, color: "334155", valign: 'top',
            lineSpacing: 20
          });

          slide.addText('EDUDOCENT AI — Chispa Pedagógica', {
            x: 0.5, y: 5.2, w: '50%', h: 0.3,
            fontSize: 10, color: "94A3B8"
          });
        });
      }
    }

    const safeFileName = `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}.pptx`;
    
    // Generar como ArrayBuffer -> Blob nativo para máxima compatibilidad con navegadores
    const data = await pres.write({ outputType: 'arraybuffer' });
    const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) showToast('Éxito', 'Presentación PowerPoint (.pptx) descargada correctamente', 'success');
  } catch (error) {
    console.error("Error generando PowerPoint:", error);
    if (showToast) showToast('Error', 'No se pudo generar el PowerPoint: ' + (error?.message || ''), 'error');
  }
};

// ==========================================
// ==========================================
// HELPERS PARA EXPORTACIÓN NATIVA A WORD (.DOCX)
// ==========================================

// 1. Tabla Institucional de Contexto en la Cabecera
const createWordContextBox = (context) => {
  const { materia, grado, periodo, tema, tipo } = context;
  const fechaStr = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Fila 1: Encabezado Institucional
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            shading: { fill: "4F46E5" },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "EDUDOCENT — SISTEMA DE PLANIFICACIÓN PEDAGÓGICA", bold: true, color: "FFFFFF", size: 22 })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Copiloto Docente e Inteligencia Artificial Educativa", italics: true, color: "E0E7FF", size: 18 })
                ]
              })
            ]
          })
        ]
      }),
      // Fila 2: Materia y Grado
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "📚 ASIGNATURA: ", bold: true, color: "1E293B", size: 20 }),
                  new TextRun({ text: String(materia || "Curricular").replace(/^🧩\s*/, ''), bold: true, color: "4F46E5", size: 20 })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "🎓 GRADO / NIVEL: ", bold: true, color: "1E293B", size: 20 }),
                  new TextRun({ text: grado ? `${grado}° Bachillerato` : "Bachillerato (6°-11°)", bold: true, color: "0284C7", size: 20 })
                ]
              })
            ]
          })
        ]
      }),
      // Fila 3: Periodo y Recurso
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "📅 PERIODO ACADÉMICO: ", bold: true, color: "1E293B", size: 20 }),
                  new TextRun({ text: periodo ? `Periodo ${periodo}` : "Periodo 1", bold: true, color: "D97706", size: 20 })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "🧩 TIPO DE RECURSO: ", bold: true, color: "1E293B", size: 20 }),
                  new TextRun({ text: tipo || "Organizador Gráfico", bold: true, color: "7C3AED", size: 20 })
                ]
              })
            ]
          })
        ]
      }),
      // Fila 4: Tema Específico
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            shading: { fill: "EEF2FF" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "📌 TEMA ESPECÍFICO DE LA CLASE: ", bold: true, color: "312E81", size: 20 }),
                  new TextRun({ text: tema || "Desarrollo Temático", bold: true, color: "4338CA", size: 20 })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Fecha de emisión: ${fechaStr}`, italics: true, color: "64748B", size: 16 })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};

// 2. Parser de Tablas HTML nativo para DOCX (Cuadro Comparativo / Tablas)
const parseHTMLTableToDocx = (tableElement) => {
  const rows = [];
  const trs = tableElement.querySelectorAll('tr');
  if (trs.length === 0) return null;

  trs.forEach((tr, trIdx) => {
    const cells = [];
    const ths = tr.querySelectorAll('th');
    const tds = tr.querySelectorAll('td');
    const isHeaderRow = ths.length > 0 || trIdx === 0;
    const cellElements = ths.length > 0 ? ths : tds;
    const colCount = Math.max(cellElements.length, 1);
    const colWidthPct = Math.floor(100 / colCount);

    cellElements.forEach((cell, cellIdx) => {
      const cellText = cell.textContent.trim();
      const isFirstCol = cellIdx === 0;
      
      cells.push(
        new TableCell({
          width: { size: colWidthPct, type: WidthType.PERCENTAGE },
          shading: {
            fill: isHeaderRow
              ? "4F46E5"
              : (trIdx % 2 === 0 ? "F8FAFC" : "FFFFFF")
          },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  bold: isHeaderRow || isFirstCol,
                  color: isHeaderRow ? "FFFFFF" : (isFirstCol ? "312E81" : "1E293B"),
                  size: isHeaderRow ? 20 : 18
                })
              ]
            })
          ]
        })
      );
    });

    if (cells.length > 0) {
      rows.push(
        new TableRow({
          tableHeader: isHeaderRow,
          children: cells
        })
      );
    }
  });

  if (rows.length === 0) return null;
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
};

// 3. Parser de Tablas Markdown nativo para DOCX
const parseMarkdownTableToDocx = (markdownTableText) => {
  const lines = markdownTableText.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const rows = [];
  const isDivider = (line) => /^\|?(\s*:?-+:?\s*\|?)+$/.test(line);

  let rowIndex = 0;
  lines.forEach((line) => {
    if (isDivider(line)) return;
    const rawCells = line.split('|').map(c => c.trim());
    if (line.startsWith('|')) rawCells.shift();
    if (line.endsWith('|')) rawCells.pop();

    if (rawCells.length === 0) return;
    const isHeader = rowIndex === 0;
    const colWidthPct = Math.floor(100 / rawCells.length);

    const docxCells = rawCells.map((cellText, colIdx) => {
      const isFirstCol = colIdx === 0;
      return new TableCell({
        width: { size: colWidthPct, type: WidthType.PERCENTAGE },
        shading: {
          fill: isHeader
            ? "4F46E5"
            : (rowIndex % 2 === 0 ? "F8FAFC" : "FFFFFF")
        },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: cellText.replace(/\*\*(.*?)\*\*/g, '$1'),
                bold: isHeader || isFirstCol || /\*\*(.*?)\*\*/.test(cellText),
                color: isHeader ? "FFFFFF" : (isFirstCol ? "312E81" : "1E293B"),
                size: isHeader ? 20 : 18
              })
            ]
          })
        ]
      });
    });

    rows.push(new TableRow({ tableHeader: isHeader, children: docxCells }));
    rowIndex++;
  });

  if (rows.length === 0) return null;
  return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
};

// 4. Parser recursivo de listas DOM para Mapas Mentales y Conceptuales
const parseDOMListToDocx = (listEl, currentLevel, elements) => {
  const items = listEl.children;
  const levelColors = ["1E40AF", "0284C7", "334155", "64748B"];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.tagName.toLowerCase() === 'li') {
      const clone = item.cloneNode(true);
      const nestedLists = clone.querySelectorAll('ul, ol');
      nestedLists.forEach(n => n.remove());
      const itemText = clone.textContent.trim();

      if (itemText) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: itemText,
                bold: currentLevel === 0,
                color: levelColors[Math.min(currentLevel, levelColors.length - 1)] || "1E293B",
                size: currentLevel === 0 ? 22 : (currentLevel === 1 ? 20 : 18)
              })
            ],
            bullet: { level: Math.min(3, currentLevel) },
            spacing: { before: currentLevel === 0 ? 100 : 30, after: 30 }
          })
        );
      }

      const childLists = item.querySelectorAll(':scope > ul, :scope > ol');
      childLists.forEach(childList => {
        parseDOMListToDocx(childList, currentLevel + 1, elements);
      });
    }
  }
};

// 5. Parser integral de Contenido Jerárquico (HTML Completo + Tablas + Listas + Markdown)
const parseContentToDocxElements = (rawContent, isMindOrConcept = false) => {
  const elements = [];
  if (!rawContent) return elements;

  const contentStr = String(rawContent);

  // Si contiene HTML estructurado (tablas, encabezados, párrafos, listas, saltos)
  if (typeof DOMParser !== 'undefined' && /<[a-z][\s\S]*>/i.test(contentStr)) {
    try {
      const parser = new DOMParser();
      // Asegurar que <br> genere saltos de bloque limpios
      const normalizedHTML = contentStr
        .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p><br/></p><p>')
        .replace(/<br\s*\/?>/gi, '<br/>');
      const doc = parser.parseFromString(`<div>${normalizedHTML}</div>`, 'text/html');
      const root = doc.body.firstElementChild || doc.body;

      const processNode = (node) => {
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent?.trim();
          if (txt) {
            elements.push(new Paragraph({
              children: [new TextRun({ text: txt, size: 20 })],
              spacing: { after: 90 }
            }));
          }
          return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const tag = node.tagName.toLowerCase();

        // 1. Tablas HTML
        if (tag === 'table') {
          const docxTable = parseHTMLTableToDocx(node);
          if (docxTable) {
            elements.push(docxTable);
            elements.push(new Paragraph({ text: "", spacing: { after: 120 } }));
          }
          return;
        }

        // 2. Listas ordenadas o no ordenadas
        if (tag === 'ul' || tag === 'ol') {
          parseDOMListToDocx(node, 0, elements);
          elements.push(new Paragraph({ text: "", spacing: { after: 80 } }));
          return;
        }

        // 3. Encabezados
        if (tag.startsWith('h') && tag.length === 2) {
          const lvl = parseInt(tag[1]) || 2;
          const text = node.textContent?.trim();
          if (text) {
            elements.push(new Paragraph({
              text,
              heading: lvl === 1 ? HeadingLevel.HEADING_1 : (lvl === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3),
              spacing: { before: 240, after: 120 }
            }));
          }
          return;
        }

        // 4. Párrafos y bloques de texto con formato en línea (<b>, <strong>, <i>, <em>)
        if (tag === 'p' || tag === 'div' || tag === 'blockquote') {
          // Si contiene elementos de bloque hijos (ej. tablas o listas dentro de divs)
          const blockChildren = node.querySelectorAll(':scope > table, :scope > ul, :scope > ol, :scope > h1, :scope > h2, :scope > h3');
          if (blockChildren.length > 0) {
            Array.from(node.children).forEach(child => processNode(child));
            return;
          }

          const runs = [];
          const extractRuns = (el) => {
            el.childNodes.forEach(child => {
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                if (text) runs.push(new TextRun({ text, size: 20 }));
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                const cTag = child.tagName.toLowerCase();
                if (cTag === 'br') {
                  runs.push(new TextRun({ text: '\n' }));
                } else {
                  const isBold = cTag === 'b' || cTag === 'strong';
                  const isItalic = cTag === 'i' || cTag === 'em';
                  const isUnderline = cTag === 'u';
                  const text = child.textContent;
                  if (text) {
                    runs.push(new TextRun({
                      text,
                      bold: isBold,
                      italics: isItalic,
                      underline: isUnderline ? {} : undefined,
                      size: 20
                    }));
                  }
                }
              }
            });
          };

          extractRuns(node);

          if (runs.length > 0) {
            elements.push(new Paragraph({
              children: runs,
              spacing: { after: 100 }
            }));
          }
          return;
        }

        // Si es otro contenedor (section, article, etc.), recorrer hijos
        Array.from(node.childNodes).forEach(child => processNode(child));
      };

      Array.from(root.childNodes).forEach(child => processNode(child));

      if (elements.length > 0) {
        return elements;
      }
    } catch (e) {
      console.warn("Fallo en DOMParser de Word, usando fallback regex:", e);
    }
  }

  // Parser para Markdown y Texto Jerárquico
  const lines = contentStr.split('\n');
  let inMarkdownTable = false;
  let markdownTableLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detección de Tabla Markdown
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inMarkdownTable = true;
      markdownTableLines.push(line);
      continue;
    } else if (inMarkdownTable) {
      inMarkdownTable = false;
      const docxTable = parseMarkdownTableToDocx(markdownTableLines.join('\n'));
      if (docxTable) {
        elements.push(docxTable);
        elements.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      }
      markdownTableLines = [];
    }

    if (!trimmed) {
      elements.push(new Paragraph({ text: "", spacing: { after: 60 } }));
      continue;
    }

    // Encabezados Markdown
    if (trimmed.startsWith('# ')) {
      elements.push(new Paragraph({
        text: trimmed.replace(/^#\s+/, ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 280, after: 140 }
      }));
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(new Paragraph({
        text: trimmed.replace(/^##\s+/, ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 }
      }));
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(new Paragraph({
        text: trimmed.replace(/^###\s+/, ''),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      }));
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(new Paragraph({
        text: trimmed.replace(/^####\s+/, ''),
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 160, after: 80 }
      }));
      continue;
    }

    // Listas Multinivel para Mapas Conceptuales y Mentales
    const bulletMatch = line.match(/^(\s*)([-*•]|\d+\.|\w\.)\s+(.+)$/);
    if (bulletMatch || (isMindOrConcept && (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')))) {
      const leadingSpaces = bulletMatch ? bulletMatch[1].length : (line.match(/^\s*/)[0].length);
      const textContent = bulletMatch ? bulletMatch[3].trim() : trimmed.replace(/^[-*•]\s+/, '');
      const level = Math.min(3, Math.floor(leadingSpaces / 2));
      const levelColors = ["1E40AF", "0284C7", "334155", "64748B"];
      const isBold = level === 0 || textContent.includes('**') || textContent.startsWith('Concepto') || textContent.startsWith('Tema') || textContent.startsWith('Nodo');

      elements.push(new Paragraph({
        children: [
          new TextRun({
            text: textContent.replace(/\*\*(.*?)\*\*/g, '$1'),
            bold: isBold,
            color: levelColors[level] || "1E293B",
            size: level === 0 ? 22 : (level === 1 ? 20 : 18)
          })
        ],
        bullet: { level },
        spacing: { before: level === 0 ? 80 : 30, after: 30 }
      }));
      continue;
    }

    // Párrafo estándar
    elements.push(new Paragraph({
      children: [
        new TextRun({
          text: trimmed.replace(/<[^>]*>?/gm, '').replace(/\*\*(.*?)\*\*/g, '$1'),
          bold: /\*\*(.*?)\*\*/.test(trimmed)
        })
      ],
      spacing: { after: 90 }
    }));
  }

  if (inMarkdownTable && markdownTableLines.length > 0) {
    const docxTable = parseMarkdownTableToDocx(markdownTableLines.join('\n'));
    if (docxTable) {
      elements.push(docxTable);
      elements.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  }

  return elements;
};


// ==========================================
// FUNCIÓN ASÍNCRONA: Exportar a documento Word (.docx) usando docx
// ==========================================
export const exportToWord = async (titulo, resultado, showToast, extraContext = {}) => {
  const docTitle = (typeof resultado === 'object' && (resultado?.titulo_periodo || resultado?.titulo_plan || resultado?.titulo)) || titulo || "Recurso_EDUDOCENT";

  const contextMateria = extraContext?.materia || resultado?._materia || resultado?.materia || "";
  const contextGrado = extraContext?.grado || resultado?._grado || resultado?.grado || "";
  const contextPeriodo = extraContext?.periodo || resultado?._periodo || resultado?.periodo || "";
  const contextTema = extraContext?.tema || resultado?._tema || resultado?.tema || docTitle;
  const contextTipo = extraContext?.tipo || resultado?._tipo || resultado?.tipo || resultado?.customTipo || "Organizador Gráfico / Plan de Clase";

  const isMindOrConcept = (
    contextTipo.toLowerCase().includes('mapa') ||
    contextTipo.toLowerCase().includes('mental') ||
    contextTipo.toLowerCase().includes('conceptual') ||
    (docTitle && (docTitle.toLowerCase().includes('mapa') || docTitle.toLowerCase().includes('mental') || docTitle.toLowerCase().includes('conceptual')))
  );

  try {
    const docChildren = [];

    // 1. Cabecera Institucional y Contexto de la Clase
    docChildren.push(
      createWordContextBox({
        materia: contextMateria,
        grado: contextGrado,
        periodo: contextPeriodo,
        tema: contextTema,
        tipo: contextTipo
      })
    );
    docChildren.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    // Si viene texto libre o string o formato libre
    if (typeof resultado === 'string' || (resultado && (resultado._texto_libre || resultado.tipo_respuesta === 'libre' || resultado.contenido_markdown))) {
      const raw = typeof resultado === 'string' ? resultado : (resultado.contenido_markdown || resultado._texto_libre || "");
      const parsedElements = parseContentToDocxElements(raw, isMindOrConcept);
      parsedElements.forEach(el => docChildren.push(el));
    } else if (resultado && typeof resultado === 'object') {
      // 1. Clases Semanales (13 Temas Sueltos) en Tabla Nativa
      if (Array.isArray(resultado.clases_semanales) && resultado.clases_semanales.length > 0) {
        docChildren.push(
          new Paragraph({
            text: "Plan de 13 Clases Semanales (13 Temas Sueltos)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );

        const tableRows = [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                width: { size: 15, type: WidthType.PERCENTAGE },
                shading: { fill: "4F46E5" },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: "Semana", bold: true, color: "FFFFFF" })] })]
              }),
              new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                shading: { fill: "4F46E5" },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: "Tema Específico", bold: true, color: "FFFFFF" })] })]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                shading: { fill: "4F46E5" },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                children: [new Paragraph({ children: [new TextRun({ text: "Guía de Explicación (Voz Alta)", bold: true, color: "FFFFFF" })] })]
              })
            ]
          })
        ];

        resultado.clases_semanales.forEach((clase, idx) => {
          tableRows.push(
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  shading: { fill: idx % 2 === 0 ? "F8FAFC" : "FFFFFF" },
                  margins: { top: 100, bottom: 100, left: 140, right: 140 },
                  children: [new Paragraph({ children: [new TextRun({ text: `Semana ${clase.semana || idx + 1}`, bold: true, color: "4F46E5" })] })]
                }),
                new TableCell({
                  width: { size: 35, type: WidthType.PERCENTAGE },
                  shading: { fill: idx % 2 === 0 ? "F8FAFC" : "FFFFFF" },
                  margins: { top: 100, bottom: 100, left: 140, right: 140 },
                  children: [new Paragraph({ children: [new TextRun({ text: clase?.tema_unico_y_diferente || clase?.tema_suelto || clase?.tema || '', bold: true, color: "1E293B" })] })]
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  shading: { fill: idx % 2 === 0 ? "F8FAFC" : "FFFFFF" },
                  margins: { top: 100, bottom: 100, left: 140, right: 140 },
                  children: [new Paragraph({ text: String(clase?.detalle_explicacion || clase?.explicacion || '').replace(/<[^>]*>?/gm, '') })]
                })
              ]
            })
          );
        });

        docChildren.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          })
        );
        docChildren.push(new Paragraph({ text: "", spacing: { after: 150 } }));
      }

      // 2. Contenido Principal / Organizador Gráfico / Cuadro Comparativo / Talleres
      if (resultado.contenido_principal) {
        docChildren.push(
          new Paragraph({
            text: "Desarrollo del Recurso Pedagógico",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );

        const parsedMain = parseContentToDocxElements(resultado.contenido_principal, isMindOrConcept);
        parsedMain.forEach(el => docChildren.push(el));
      }

      // 3. Ideas de Diapositivas
      if (resultado.ideas_presentacion || resultado.estructura_presentacion) {
        docChildren.push(
          new Paragraph({
            text: "Estructura para Presentaciones / Diapositivas (PowerPoint / Canva)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
        const presElements = parseContentToDocxElements(resultado.ideas_presentacion || resultado.estructura_presentacion, false);
        presElements.forEach(el => docChildren.push(el));
      }

      // 4. Guía Docente
      if (resultado.guia_docente) {
        docChildren.push(
          new Paragraph({
            text: "Guía Didáctica para el Docente",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
        const guiaElements = parseContentToDocxElements(resultado.guia_docente, false);
        guiaElements.forEach(el => docChildren.push(el));
      }

      // 5. Recursos Online Dinámicos
      if (resultado.recursos_online) {
        docChildren.push(
          new Paragraph({
            text: "Recursos Online y Dinámicas Interactivas",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
        let textoRecursos = '';
        if (Array.isArray(resultado.recursos_online)) {
          textoRecursos = resultado.recursos_online
            .map(r => `• ${r?.plataforma || 'Juego'}: ${r?.url_busqueda || ''}`)
            .join('\n');
        } else if (typeof resultado.recursos_online === 'string') {
          textoRecursos = resultado.recursos_online.replace(/<[^>]*>?/gm, '');
        } else {
          textoRecursos = JSON.stringify(resultado.recursos_online);
        }
        docChildren.push(
          new Paragraph({
            text: textoRecursos,
            spacing: { after: 120 }
          })
        );
      }

      // 6. Adaptación Inclusiva DUA / PIAR
      if (resultado.adaptacion_inclusiva) {
        docChildren.push(
          new Paragraph({
            text: "Estrategias de Adaptación DUA e Inclusión",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
        const duaText = typeof resultado.adaptacion_inclusiva === 'string'
          ? resultado.adaptacion_inclusiva
          : (resultado.adaptacion_inclusiva?.estrategias_generales || JSON.stringify(resultado.adaptacion_inclusiva));
        const duaElements = parseContentToDocxElements(duaText, false);
        duaElements.forEach(el => docChildren.push(el));
      }
    }

    // Pie de página
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "EDUDOCENT — Copiloto Docente e Inteligencia Artificial Educativa",
            italics: true,
            color: "94A3B8",
            size: 18
          })
        ],
        spacing: { before: 400 },
        alignment: AlignmentType.CENTER
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren.filter(Boolean)
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) showToast('Éxito', 'Documento Word (.docx) descargado correctamente', 'success');
  } catch (err) {
    console.error("Error al compilar documento docx:", err);
    if (showToast) showToast('Error', 'No se pudo compilar el archivo Word', 'error');
  }
};

// ==========================================
// Utilidad: Llamar a la API de Gemini con Timeout Estricto y Control de Errores
// ==========================================
export const callGeminiAPI = async (userPrompt, systemPrompt, apiKey, timeoutMs = 90000) => {
  const fallbackKey = typeof atob === 'function' ? atob('QVEuQWI4Uk42SnJHaHVaaFVFTDhhQjJJX21QZ0lDSUVuYmgtVy1UMXZvM0RoYVE2MDRhTHc=') : '';
  let storedKey = '';
  try {
    storedKey = (localStorage.getItem('edudocent_gemini_api_key') || '').trim();
    if (storedKey === 'undefined' || storedKey === 'null') storedKey = '';
  } catch {}
  const cleanApiKey = (apiKey && typeof apiKey === 'string' && apiKey.trim() !== 'undefined' && apiKey.trim() !== 'null') ? apiKey.trim() : '';
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.trim() !== 'undefined') ? import.meta.env.VITE_GEMINI_API_KEY.trim() : '';
  const keyToUse = cleanApiKey || storedKey || envKey || fallbackKey;

  if (!keyToUse) {
    throw new Error('No se detectó la clave de Gemini API. Por favor ingrésala en ⚙️ SETTINGS (abajo en el menú) o configúrala en las variables de Netlify (VITE_GEMINI_API_KEY).');
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Error de conexión con la IA, por favor intenta de nuevo'));
    }, timeoutMs);
  });

  const apiPromise = (async () => {
    const genAI = new GoogleGenerativeAI(keyToUse);
    const candidateModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-flash-latest"];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
          generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(userPrompt);
        const text = result?.response?.text();
        if (text && text.trim().length > 10) {
          return text;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Reintento con modelo alternativo tras fallo en ${modelName}:`, err?.message || err);
      }
    }
    throw lastError || new Error('Error de conexión con la IA, por favor intenta de nuevo');
  })();

  try {
    return await Promise.race([apiPromise, timeoutPromise]);
  } catch (err) {
    console.error("Fallo exacto en la IA:", err);
    throw new Error('Error de conexión con la IA, por favor intenta de nuevo');
  }
};

// Intentar parsear JSON desde una respuesta de texto con sanitización estricta
const tryParseJSON = (rawText) => {
  if (!rawText) return null;
  const cleaned = String(rawText).replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Fallo exacto en la IA:", err);
    return null;
  }
};

// ==========================================
// CSS para tablas HTML y botones de enlaces generados por la IA
// ==========================================
const tableStyles = `
  .notebook-pro-modal {
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  }
  .ai-html-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 13px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }
  .ai-html-content table th {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.06em;
    padding: 14px 16px;
    text-align: left;
    border: 1px solid #4338ca;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .ai-html-content table td {
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-weight: 500;
    line-height: 1.7;
    vertical-align: top;
    font-size: 13px;
  }
  .ai-html-content table tr:nth-child(even) td {
    background-color: #f1f5f9;
  }
  .ai-html-content table tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  .ai-html-content table tr:hover td {
    background-color: #eef2ff;
    transition: background-color 0.2s;
  }
  .notebook-13-table {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }
  .notebook-13-table thead th {
    position: sticky;
    top: 0;
    z-index: 10;
    background: linear-gradient(135deg, #4338ca, #6366f1);
    color: white;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 16px 18px;
    text-align: left;
    border: none;
    border-bottom: 3px solid #312e81;
  }
  .notebook-13-table tbody td {
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
    font-weight: 500;
    line-height: 1.75;
    vertical-align: top;
    font-size: 13.5px;
  }
  .notebook-13-table tbody tr:nth-child(even) td {
    background-color: #f1f5f9;
  }
  .notebook-13-table tbody tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  .notebook-13-table tbody tr:hover td {
    background-color: #eef2ff;
    transition: background-color 0.25s ease;
  }
  .notebook-13-table td.semana-col {
    font-weight: 900;
    color: #4338ca;
    text-align: center;
    font-size: 13px;
    width: 90px;
    white-space: nowrap;
    background-color: inherit;
  }
  .notebook-13-table td.tema-col {
    font-weight: 800;
    color: #0f172a;
    width: 25%;
    font-size: 13px;
  }
  .notebook-13-table td.guia-col {
    font-weight: 500;
    color: #334155;
    line-height: 1.8;
    font-size: 13.5px;
  }
  .ai-html-content a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #0284c7;
    color: #ffffff !important;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 10px;
    text-decoration: none !important;
    margin: 4px 2px;
    font-size: 11px;
    transition: all 0.2s;
    box-shadow: 0 2px 5px rgba(2,132,199,0.2);
  }
  .ai-html-content a:hover {
    background: #0369a1;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(2,132,199,0.3);
  }
  .ai-html-content h1, .ai-html-content h2, .ai-html-content h3 {
    color: #1e293b;
    font-weight: 900;
    margin: 16px 0 8px 0;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }
  .ai-html-content h1 { font-size: 18px; }
  .ai-html-content h2 { font-size: 15px; }
  .ai-html-content h3 { font-size: 13px; }
  .ai-html-content p { margin-bottom: 8px; line-height: 1.7; font-size: 13px; }
  .ai-html-content ul, .ai-html-content ol {
    padding-left: 24px;
    margin: 12px 0;
  }
  .ai-html-content ul {
    list-style-type: disc;
  }
  .ai-html-content ul ul {
    list-style-type: circle;
    margin: 6px 0;
  }
  .ai-html-content ul ul ul {
    list-style-type: square;
  }
  .ai-html-content li {
    margin-bottom: 6px;
    line-height: 1.7;
    font-size: 13.5px;
  }
  .ai-html-content li > ul, .ai-html-content li > ol {
    margin-top: 6px;
    margin-bottom: 0;
  }
  .ai-html-content strong, .ai-html-content b {
    font-weight: 800;
    color: #1e293b;
  }
  .ai-html-content hr {
    border: none;
    border-top: 2px dashed #e2e8f0;
    margin: 16px 0;
  }
  .ai-html-content .quiz-header {
    border: 2px solid #e2e8f0;
    padding: 12px;
    border-radius: 12px;
    margin-bottom: 16px;
    background: #f8fafc;
  }
`;

// Sanitizar HTML básico
const sanitizeHTML = (html) => {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
};


// ==========================================
// COMPONENTE: Modal de Lanzamiento de Juego (abre en pestaña nueva, sin iframe)
// ==========================================
const GameIframeModal = ({ isOpen, onClose, gameUrl, gameTitle }) => {
  if (!isOpen || !gameUrl) return null;

  const handleOpen = () => {
    window.open(gameUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-pageIn">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">
              🎮
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 leading-tight">{gameTitle || "Juego Educativo"}</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">EDUDOCENT PLAY — Acceso Directo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-slate-200 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-8 text-center space-y-5">
          <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-inner">
            🕹️
          </div>
          <div>
            <h4 className="font-black text-xl text-slate-900 mb-1">{gameTitle}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Este sitio de juegos educativos requiere que inicies sesión en su propia plataforma.
              Haz clic abajo para abrirlo en una <strong>pestaña nueva</strong> y usarlo con normalidad.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-left flex items-start gap-2.5">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-xs text-amber-800 font-semibold leading-relaxed">
              <strong>Tip:</strong> Una vez dentro, crea tu actividad de juego basada en el tema de la clase y comparte el código o enlace con tus estudiantes.
            </p>
          </div>

          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm transition-all shadow-lg shadow-emerald-100 cursor-pointer"
          >
            <span className="text-lg">🎮</span>
            Abrir {gameTitle} en Pestaña Nueva ↗
          </a>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// COMPONENTE: Bar de Plataformas de Juegos
// ==========================================
const PlataformasJuegosBar = ({ onLaunchGame, activeTopic = '', currentSubject = '' }) => {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-lg my-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">Plataformas de Juegos Educativos</h4>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">EDUDOCENT PLAY</span>
      </div>
      <p className="text-xs text-slate-300 font-medium">
        {activeTopic
          ? `Juegos interactivos y dinámicas recomendadas para "${activeTopic}":`
          : "Haz clic en cualquier plataforma para abrirla directamente con actividades y cuestionarios:"}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {plataformasJuegos.map((plat) => {
          const directUrl = activeTopic ? getPlataformaSearchUrl(plat.name, activeTopic, currentSubject) : plat.url;
          return (
            <a
              key={plat.name}
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/60 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-3 group no-underline"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{plat.icon}</span>
              <div className="min-w-0 flex-1">
                <h5 className="font-extrabold text-xs text-white truncate">{plat.name}</h5>
                <p className="text-[9px] text-slate-400 group-hover:text-emerald-300 truncate transition-colors">
                  {activeTopic ? 'Abrir juego del tema ↗' : 'Abrir ↗'}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};


// ==========================================
// COMPONENTE: Bar de Plataformas de Diapositivas
// ==========================================
const PlataformasDiapositivasBar = () => {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-lg my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h4 className="font-black text-xs uppercase tracking-wider text-amber-400">Plataformas de Diseño de Presentaciones</h4>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-500/30">EDUDOCENT DESIGN</span>
      </div>
      <p className="text-xs text-slate-300 font-medium">Haz clic para abrir tu plataforma favorita en una pestaña nueva y crear tus diapositivas:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {plataformasDiapositivas.map((plat) => (
          <a
            key={plat.name}
            href={plat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-amber-900/60 border border-slate-700 hover:border-amber-500/60 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-3 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{plat.icon}</span>
            <div className="min-w-0 flex-1">
              <h5 className="font-extrabold text-xs text-white truncate">{plat.name}</h5>
              <p className="text-[9px] text-slate-400 group-hover:text-amber-300 truncate transition-colors">Abrir ↗</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};


// ==========================================
// COMPONENTE: Renderizado Dinámico Múltiple de Recursos Online y Juegos
// ==========================================
const getPlatformBadgeStyle = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('wordwall')) return { icon: '🎯', gradient: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' };
  if (n.includes('kahoot')) return { icon: '⚡', gradient: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' };
  if (n.includes('educaplay')) return { icon: '🧩', gradient: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white' };
  if (n.includes('quizizz')) return { icon: '🎮', gradient: 'from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white' };
  if (n.includes('blooket')) return { icon: '🏰', gradient: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white' };
  if (n.includes('cerebriti')) return { icon: '🧠', gradient: 'from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white' };
  if (n.includes('phet')) return { icon: '🔬', gradient: 'from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white' };
  if (n.includes('baamboozle')) return { icon: '🐼', gradient: 'from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white' };
  return { icon: '🕹️', gradient: 'from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white' };
};

const RecursosOnlineDinamicos = ({ recursos }) => {
  if (!recursos) return null;

  // Renderizado dinámico cuando la IA devuelve un arreglo
  const items = Array.isArray(recursos) ? recursos : [];

  if (items.length > 0) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
          🎮 Juegos interactivos y simuladores específicos para este tema:
        </p>
        <div className="flex flex-wrap gap-3">
          {items.map((item, idx) => {
            const plataformaName = item?.plataforma || `Juego ${idx + 1}`;
            const rawUrl = item?.url_busqueda || item?.url || '#';
            const badge = getPlatformBadgeStyle(plataformaName);

            return (
              <a
                key={idx}
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 no-underline bg-gradient-to-r ${badge.gradient}`}
              >
                <span className="text-base">{badge.icon}</span>
                <span>{plataformaName}</span>
                <span className="text-[10px] opacity-80 font-normal">↗</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback si viene en formato texto/HTML
  if (typeof recursos === 'string') {
    return (
      <div
        className="ai-html-content text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap space-y-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(recursos)) }}
      />
    );
  }

  return null;
};


// ==========================================
// COMPONENTE: Tarjetas de Resultado IA Seccionadas con Pestañas Internas
// ==========================================
const ResultadoIACards = ({ resultado, onReset, onClose, showToast, onLaunchGame, defaultSection = 'todos', customTipo }) => {
  const [activeSection, setActiveSection] = useState(defaultSection);

  if (!resultado) return null;

  // =========================================================================
  // RENDERIZADO CONDICIONAL SEGURO: FORMATO LIBRE / PERSONALIZADO
  // Si tipo_respuesta === 'libre', se prohíbe iterar arreglos o dibujar tablas.
  // =========================================================================
  if (resultado.tipo_respuesta === 'libre' || resultado.contenido_markdown) {
    const markdownContent = resultado.contenido_markdown || resultado.contenido || resultado._texto_libre || "";
    const docTitle = resultado.titulo || resultado.titulo_plan || "Documento_Personalizado_EDUDOCENT";

    return (
      <div className="space-y-4 animate-pageIn notebook-pro-modal">
        <style>{tableStyles}</style>

        {/* Mensaje Empático */}
        {resultado.mensaje_empatico && (
          <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-4 rounded-r-xl">
            <p className="text-sm text-rose-900 font-medium whitespace-pre-wrap">{resultado.mensaje_empatico}</p>
          </div>
        )}

        {/* Bar de Encabezado y Descarga */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/40">
            📝 Documento / Formato Libre Generado
          </span>
          <button
            onClick={() => exportToWord(docTitle, resultado, showToast)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
          >
            <FileText size={14} />
            📄 Descargar en Word (.doc)
          </button>
        </div>

        {/* Contenedor Seguro de Interpretación Markdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div
            className="ai-html-content text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(markdownContent)) }}
          />
        </div>

        {/* Botones de acción inferiores */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onReset}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-0"
          >
            ← Generar Otro
          </button>
          <button
            onClick={() => exportToWord(docTitle, resultado, showToast)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
          >
            <FileText size={15} />
            Descargar Word (.doc)
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md border-0"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const datosPaquete = resultado;
  const docTitle = resultado.titulo_periodo || resultado.titulo_plan || resultado.titulo || "Recurso_EDUDOCENT";

  const hasWeeklyClasses = Array.isArray(resultado.clases_semanales) && resultado.clases_semanales.length > 0;
  const hasPresentation = Boolean(resultado.ideas_presentacion || resultado.estructura_presentacion);
  const hasOnlyPresentation = hasPresentation && !hasWeeklyClasses && !resultado.plan_13_clases && !resultado.contenido_principal;

  const isSlideResource = Boolean(
    (customTipo && (customTipo.includes('Presentación') || customTipo.includes('Canva') || customTipo.includes('PPT') || customTipo.includes('Diapositiva'))) ||
    hasOnlyPresentation ||
    (hasPresentation && !hasWeeklyClasses && !resultado.contenido_principal)
  );

  const isVideoResource = Boolean(
    (customTipo && customTipo.includes('Video')) ||
    docTitle.toLowerCase().includes('video') ||
    Boolean(resultado.busqueda_youtube)
  );

  const isGameResource = Boolean(
    (customTipo && (customTipo.includes('Juego') || customTipo.includes('Trivia'))) ||
    docTitle.toLowerCase().includes('juego') ||
    docTitle.toLowerCase().includes('trivia') ||
    Boolean(resultado.recursos_online)
  );

  const cleanTopicForSearch = (docTitle || "").replace(/guion|video|didactico|explicativo|presentacion|diapositiva|evaluativo|taller|quiz|examen|guia|juego|trivia/gi, '').trim();
  const searchMateria = resultado._materia || resultado.materia || "";
  const youtubeSearchQuery = encodeURIComponent(`${cleanTopicForSearch || "tema"} ${searchMateria} explicacion educacion`);
  const youtubeUrl = resultado.busqueda_youtube || `https://www.youtube.com/results?search_query=${youtubeSearchQuery}`;

  const recommendedApp = getRecommendedGameApp(searchMateria);
  const recommendedGameUrl = getPlataformaSearchUrl(recommendedApp.name, cleanTopicForSearch, searchMateria);

  const handleDownloadPPT = () => {
    descargarPPTX(docTitle, resultado, showToast);
  };

  return (
    <div className="space-y-4 animate-pageIn notebook-pro-modal">
      <style>{tableStyles}</style>

      {/* Mensaje Empático */}
      {resultado.mensaje_empatico && (
        <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-4 rounded-r-xl">
          <p className="text-sm text-rose-900 font-medium whitespace-pre-wrap">{resultado.mensaje_empatico}</p>
        </div>
      )}

      {/* Bar de Encabezado y Descarga */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/40">
          ✅ {isSlideResource
            ? "Presentación de Diapositivas (PowerPoint / Canva)"
            : isVideoResource
            ? "Guion de Video + Recursos de YouTube"
            : isGameResource
            ? "Juego Interactivo y Dinámicas Lúdicas"
            : hasWeeklyClasses
            ? "13 Clases Independientes"
            : (customTipo || "Recurso Pedagógico Listo")}
        </span>

        {isSlideResource ? (
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPPT}
              className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
            >
              <Presentation size={14} />
              📊 PPTX
            </button>
            <a
              href="https://www.canva.com/presentations/templates/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-[11px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer no-underline border-0"
            >
              🎨 Abrir Canva ↗
            </a>
          </div>
        ) : isVideoResource ? (
          <div className="flex gap-2">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer no-underline border-0"
            >
              <PlayCircle size={15} />
              ▶️ Ver Video del Tema en YouTube
            </a>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
            >
              <FileText size={14} />
              📄 Word (.docx)
            </button>
          </div>
        ) : isGameResource ? (
          <div className="flex gap-2">
            <a
              href={recommendedGameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer no-underline border-0"
            >
              <span className="text-sm">{recommendedApp.icon}</span>
              Abrir {recommendedApp.name} ↗
            </a>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
            >
              <FileText size={14} />
              📄 Word (.docx)
            </button>
          </div>
        ) : (
          <button
            onClick={() => exportToWord(docTitle, resultado, showToast)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-0"
          >
            <FileText size={15} />
            📄 Guardar en Word (.docx)
          </button>
        )}
      </div>

      {/* Pestañas Seccionadas de Navegación Interna */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1 overflow-x-auto custom-scrollbar border border-transparent dark:border-slate-700">
        <button
          onClick={() => setActiveSection('todos')}
          className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${activeSection === 'todos' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          <Layers size={13} className="inline mr-1" /> Ver Todo
        </button>
        {(resultado.clases_semanales || resultado.plan_13_clases || resultado.contenido_principal) && (
          <button
            onClick={() => setActiveSection('principal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${activeSection === 'principal' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            {isVideoResource ? "🎬 Guion y Video" : "📅 13 Clases Semanales"}
          </button>
        )}
        {(resultado.ideas_presentacion || resultado.estructura_presentacion) && (
          <button
            onClick={() => setActiveSection('presentacion')}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${activeSection === 'presentacion' ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            📊 Diapositivas
          </button>
        )}
        {resultado.recursos_online && (
          <button
            onClick={() => setActiveSection('juegos')}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${activeSection === 'juegos' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            🎮 Juegos & Web
          </button>
        )}
        {resultado.adaptacion_inclusiva && (
          <button
            onClick={() => setActiveSection('inclusivo')}
            className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${activeSection === 'inclusivo' ? 'bg-white dark:bg-slate-700 text-violet-700 dark:text-violet-300 shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            🧩 Adaptación DUA
          </button>
        )}
      </div>

      {/* Tarjeta Título del Periodo */}
      {(resultado.titulo_periodo || resultado.titulo_plan || resultado.titulo) && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-indigo-950/50 p-5 rounded-2xl border border-indigo-100/60 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-300">Título General del Recurso</span>
          </div>
          <p className="text-sm font-black text-slate-800 dark:text-white leading-snug">{resultado.titulo_periodo || resultado.titulo_plan || resultado.titulo}</p>
        </div>
      )}

      {/* ============== SI SOLO ES PRESENTACIÓN Y ESTÁ EN 'TODOS': VISTA EXPANDIDA Y CENTRADA ============== */}
      {hasOnlyPresentation && activeSection === 'todos' && (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-pageIn">
          <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-850 dark:to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Presentation size={22} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-300">📊 Esquema para Presentación / Diapositivas</span>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">Estructura slide a slide lista para PowerPoint y Canva</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full font-black uppercase tracking-wider">DIAPOSITIVAS READY</span>
                <button onClick={handleDownloadPPT} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-0">
                  <Download size={14} /> DESCARGAR PPTX
                </button>
              </div>
            </div>

            <PlataformasDiapositivasBar />

            <div
              className="ai-html-content text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium overflow-x-auto whitespace-pre-wrap space-y-4 p-2"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.ideas_presentacion || resultado.estructura_presentacion)) }}
            />
          </div>

          {resultado.recursos_online && (
            <div className="w-full max-w-5xl mx-auto bg-sky-50/50 dark:bg-slate-800 p-6 rounded-3xl border border-sky-100/60 dark:border-slate-700 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">🎮 Recursos Online y Juegos Interactivos</span>
              </div>
              <RecursosOnlineDinamicos recursos={resultado.recursos_online} />
              <PlataformasJuegosBar onLaunchGame={onLaunchGame} />
            </div>
          )}

          {resultado.adaptacion_inclusiva && (
            <div className="w-full max-w-5xl mx-auto bg-violet-50/50 dark:bg-slate-800 p-6 rounded-3xl border border-violet-100/60 dark:border-slate-700 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={18} className="text-violet-600" />
                <span className="text-xs font-black uppercase tracking-widest text-violet-600">🧩 Adaptación DUA / Inclusiva</span>
              </div>
              <div className="ai-html-content text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap space-y-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.adaptacion_inclusiva)) }} />
            </div>
          )}

          {resultado.guia_docente && (
            <div className="w-full max-w-5xl mx-auto bg-emerald-50/50 dark:bg-slate-800 p-6 rounded-3xl border border-emerald-100/60 dark:border-slate-700 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={18} className="text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600">📑 Guía para el Docente</span>
              </div>
              <div className="ai-html-content text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap space-y-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.guia_docente)) }} />
            </div>
          )}
        </div>
      )}

      {/* ============== LAYOUT DE 2 COLUMNAS (Cuando existen 13 clases o contenido principal) ============== */}
      {!hasOnlyPresentation && activeSection === 'todos' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 animate-pageIn">
          {/* === COLUMNA PRINCIPAL (2/3): Tabla de 13 Semanas / Guion === */}
          <div className="xl:col-span-2 space-y-4">
            
            {/* Banner Destacado para Videos de YouTube */}
            {isVideoResource && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/30 p-4 rounded-2xl border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 text-red-700 dark:text-red-300">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow">
                    <PlayCircle size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-black leading-tight">Videos Educativos Complementarios</p>
                    <p className="text-[10px] text-red-600/80 dark:text-red-400 font-medium">Accede a explicaciones y recursos audiovisuales listos para el aula</p>
                  </div>
                </div>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 no-underline text-center border-0 cursor-pointer"
                >
                  <PlayCircle size={16} />
                  ▶️ Ver videos sugeridos en YouTube
                </a>
              </div>
            )}

            {/* Tabla de 13 semanas (Solo si se generó un plan curricular de 13 clases) */}
            {hasWeeklyClasses && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">📅 Plan de 13 Clases Semanales</span>
                  </div>
                  <button
                    onClick={() => exportToWord(docTitle, resultado, showToast)}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800/40"
                  >
                    📄 Guardar en Word
                  </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-200 dark:border-slate-700" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <table className="notebook-13-table w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="w-[90px] text-center p-3">Semana</th>
                        <th className="w-[25%] p-3">Tema Específico</th>
                        <th className="p-3">Guía de Explicación (Voz Alta para Alumnos)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.clases_semanales.map((clase, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{clase?.semana || index + 1}</td>
                          <td className="p-3 font-bold">{String(clase?.tema_unico_y_diferente || clase?.tema_suelto || 'Tema ' + (index + 1))}</td>
                          <td className="p-3 whitespace-pre-wrap">{String(clase?.detalle_explicacion || '')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fallback plan_13_clases HTML raw */}
            {resultado.plan_13_clases && !hasWeeklyClasses && (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Plan de 13 Clases Independientes</span>
                  </div>
                  <button onClick={() => exportToWord(docTitle, resultado, showToast)} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">📄 Guardar en Word</button>
                </div>
                <div className="ai-html-content text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium overflow-x-auto" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.plan_13_clases)) }} />
              </div>
            )}

            {/* Contenido Principal (Taller / Quiz / Examen / Guía / Tabla) */}
            {resultado.contenido_principal && !hasWeeklyClasses && !resultado.plan_13_clases && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      {isVideoResource ? "🎬 Guion Didáctico del Video" : (customTipo || "📝 Recurso Pedagógico Generado")}
                    </span>
                  </div>
                  {isVideoResource ? (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-0 shadow-sm no-underline cursor-pointer"
                    >
                      <PlayCircle size={14} />
                      ▶️ Ver videos sugeridos en YouTube
                    </a>
                  ) : (
                    <button onClick={() => exportToWord(docTitle, resultado, showToast)} className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 cursor-pointer transition-all active:scale-95">📄 Guardar en Word (.docx)</button>
                  )}
                </div>
                <div className="ai-html-content text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium overflow-x-auto" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.contenido_principal)) }} />
              </div>
            )}

            {/* Fallback amigable solo si no hay ningún campo reconocido */}
            {!hasWeeklyClasses && !resultado.plan_13_clases && !resultado.contenido_principal && !resultado.ideas_presentacion && (
              <div className="p-5 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-sm overflow-auto rounded-2xl border border-amber-200 dark:border-amber-900/60">
                <p className="font-bold mb-2">Información del recurso generado:</p>
                <div className="ai-html-content" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado._texto_libre || JSON.stringify(resultado, null, 2))) }} />
              </div>
            )}
          </div>

          {/* === PANEL LATERAL (1/3): Presentación + Recursos + DUA + Guía === */}
          <div className="xl:col-span-1 space-y-4">
            {/* Estructura de Presentación */}
            {(resultado.ideas_presentacion || resultado.estructura_presentacion) && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-850 dark:to-amber-950/40 p-5 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Presentation size={16} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300">📊 Presentación</span>
                  </div>
                  <button onClick={handleDownloadPPT} className="bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer border-0">
                    <Download size={10} /> PPTX
                  </button>
                </div>
                <div className="ai-html-content text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium overflow-x-auto whitespace-pre-wrap space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.ideas_presentacion || resultado.estructura_presentacion)) }} />
              </div>
            )}

            {/* Recursos Online */}
            {resultado.recursos_online && (
              <div className="bg-sky-50/50 dark:bg-slate-800 p-5 rounded-2xl border border-sky-100/60 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-sky-600 dark:text-sky-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">🎮 Recursos Online</span>
                </div>
                <RecursosOnlineDinamicos recursos={resultado.recursos_online} />
                <PlataformasJuegosBar onLaunchGame={onLaunchGame} />
              </div>
            )}

            {/* Adaptación Inclusiva */}
            {resultado.adaptacion_inclusiva && (
              <div className="bg-violet-50/50 p-5 rounded-2xl border border-violet-100/60">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-violet-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">🧩 Adaptación DUA</span>
                </div>
                <div className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium max-h-[250px] overflow-y-auto custom-scrollbar" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.adaptacion_inclusiva)) }} />
              </div>
            )}

            {/* Guía Docente */}
            {resultado.guia_docente && (
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={16} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">📑 Guía para el Docente</span>
                </div>
                <div className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium max-h-[250px] overflow-y-auto custom-scrollbar" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.guia_docente)) }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============== VISTAS INDIVIDUALES POR PESTAÑA ============== */}
      {/* Tabla de 13 semanas — vista individual (solo si hay clases semanales) */}
      {hasWeeklyClasses && activeSection === 'principal' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pageIn space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">📅 Plan de 13 Clases Semanales</span>
            </div>
            <button onClick={() => exportToWord(docTitle, resultado, showToast)} className="text-[10px] font-bold text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800/40">📄 Guardar en Word (.docx)</button>
          </div>
          <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-slate-200 dark:border-slate-700" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className="notebook-13-table w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="w-[90px] text-center p-3">Semana</th>
                  <th className="w-[25%] p-3">Tema Específico</th>
                  <th className="p-3">Guía de Explicación (Voz Alta para Alumnos)</th>
                </tr>
              </thead>
              <tbody>
                {resultado.clases_semanales.map((clase, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{clase?.semana || index + 1}</td>
                    <td className="p-3 font-bold">{String(clase?.tema_unico_y_diferente || clase?.tema_suelto || 'Tema ' + (index + 1))}</td>
                    <td className="p-3 whitespace-pre-wrap">{String(clase?.detalle_explicacion || '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido Principal — vista individual cuando NO hay clases semanales */}
      {resultado.contenido_principal && !hasWeeklyClasses && activeSection === 'principal' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pageIn space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {customTipo || "Contenido Principal"}
              </span>
            </div>
            <button onClick={() => exportToWord(docTitle, resultado, showToast)} className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 cursor-pointer transition-all active:scale-95">📄 Guardar en Word (.docx)</button>
          </div>
          <div className="ai-html-content text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium overflow-x-auto" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.contenido_principal)) }} />
        </div>
      )}

      {/* Fallback plan_13_clases — vista individual */}
      {resultado.plan_13_clases && !hasWeeklyClasses && activeSection === 'principal' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pageIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Plan de 13 Clases Independientes</span>
            </div>
            <button onClick={() => exportToWord(docTitle, resultado, showToast)} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">📄 Guardar en Word (.docx)</button>
          </div>
          <div className="ai-html-content text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium overflow-x-auto" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.plan_13_clases)) }} />
        </div>
      )}

      {/* Tarjeta Diapositivas — vista individual */}
      {(resultado.ideas_presentacion || resultado.estructura_presentacion) && activeSection === 'presentacion' && (
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-850 dark:to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm animate-pageIn space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Presentation size={22} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-300">📊 Esquema para Presentación / Diapositivas</span>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">Estructura slide a slide lista para PowerPoint y Canva</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full font-black uppercase tracking-wider">DIAPOSITIVAS READY</span>
              <button onClick={handleDownloadPPT} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-0"><Download size={14} /> DESCARGAR PPTX</button>
            </div>
          </div>

          <PlataformasDiapositivasBar />

          <div className="ai-html-content text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium overflow-x-auto whitespace-pre-wrap space-y-4 p-2" dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(resultado.ideas_presentacion || resultado.estructura_presentacion)) }} />
        </div>
      )}

      {/* Contenido Principal — vista individual */}
      {resultado.contenido_principal && !resultado.plan_13_clases && activeSection === 'principal' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pageIn space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                {isVideoResource ? "🎬 Guion Didáctico del Video" : "Contenido Principal / Quiz / Tabla"}
              </span>
            </div>
            {isVideoResource ? (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-0 shadow-sm no-underline cursor-pointer"
              >
                <PlayCircle size={14} />
                ▶️ Ver videos sugeridos en YouTube
              </a>
            ) : (
              <button onClick={() => exportToWord(docTitle, resultado, showToast)} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">📄 Guardar en Word</button>
            )}
          </div>
          <div className="ai-html-content text-sm text-slate-700 leading-relaxed font-medium overflow-x-auto" dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.contenido_principal) }} />
        </div>
      )}

      {/* Recursos Online — vista individual */}
      {resultado.recursos_online && activeSection === 'juegos' && (
        <div className="bg-sky-50/50 dark:bg-slate-800 p-6 rounded-3xl border border-sky-100/60 dark:border-slate-700 space-y-4 animate-pageIn">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">🎮 Recursos Online y Juegos Interactivos</span>
          </div>
          <RecursosOnlineDinamicos recursos={resultado.recursos_online} />
          <PlataformasJuegosBar onLaunchGame={onLaunchGame} />
        </div>
      )}

      {/* Adaptación Inclusiva — vista individual */}
      {resultado.adaptacion_inclusiva && activeSection === 'inclusivo' && (
        <div className="bg-violet-50/50 p-5 rounded-2xl border border-violet-100/60 animate-pageIn">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-violet-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Adaptación Inclusiva (PIAR / DUA)</span>
          </div>
          <div className="ai-html-content text-sm text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.adaptacion_inclusiva) }} />
        </div>
      )}

      {/* Guía Docente — vista individual */}
      {resultado.guia_docente && activeSection === 'guia' && (
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60 animate-pageIn">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Guía para el Docente</span>
          </div>
          <div className="ai-html-content text-sm text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.guia_docente) }} />
        </div>
      )}

      {/* Botones de acción inferiores */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onReset}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-0"
        >
          ← Generar Otro
        </button>
        {isSlideResource ? (
          <>
            <button
              onClick={handleDownloadPPT}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
            >
              <Presentation size={15} />
              Descargar PowerPoint (.pptx)
            </button>
            <a
              href="https://www.canva.com/presentations/templates/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 no-underline text-center border-0"
            >
              🎨 Diseñar en Canva ↗
            </a>
          </>
        ) : isVideoResource ? (
          <>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 no-underline text-center border-0"
            >
              <PlayCircle size={16} />
              ▶️ Ver Video del Tema en YouTube
            </a>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
            >
              <FileText size={15} />
              Guardar Guion en Word (.docx)
            </button>
          </>
        ) : isGameResource ? (
          <>
            <a
              href={recommendedGameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 no-underline text-center border-0"
            >
              <span className="text-base">{recommendedApp.icon}</span>
              Abrir {recommendedApp.name} ↗
            </a>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
            >
              <FileText size={15} />
              Guardar Juego en Word (.docx)
            </button>
          </>
        ) : (
          <button
            onClick={() => exportToWord(docTitle, resultado, showToast)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
          >
            <FileText size={15} />
            Guardar en Word (.docx)
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md border-0"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};



// Fallback de texto libre
const ResultadoTextoLibre = ({ texto, onReset, onClose, showToast, customTipo }) => {
  const isVideo = Boolean(customTipo === 'Video Explicativo' || (texto && (texto.toLowerCase().includes('guion') || texto.toLowerCase().includes('video'))));
  const fallbackYtUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((customTipo || 'video educativo').replace(/video/gi, '').trim() + " explicacion clase")}`;
  
  return (
    <div className="space-y-4 animate-pageIn">
      <style>{tableStyles}</style>
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          ✅ Contenido Generado
        </span>
        {isVideo ? (
          <a
            href={fallbackYtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer no-underline border-0"
          >
            <PlayCircle size={15} />
            ▶️ Ver videos sugeridos en YouTube
          </a>
        ) : (
          <button
            onClick={() => exportToWord("Recurso_EDUDOCENT", texto, showToast)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-0"
          >
            <FileText size={15} />
            📄 Descargar en Word (.doc)
          </button>
        )}
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div
          className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(formatMarkdownToHTML(texto)) }}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onReset} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-0">← Regenerar</button>
        {isVideo ? (
          <a
            href={fallbackYtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase flex justify-center items-center gap-1.5 border-0 no-underline shadow-md"
          >
            <PlayCircle size={16} />
            ▶️ Ver videos sugeridos en YouTube
          </a>
        ) : (
          <button onClick={() => exportToWord("Recurso_EDUDOCENT", texto, showToast)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase flex justify-center items-center gap-1.5 border-0"><FileText size={16} /> Descargar Word</button>
        )}
        <button onClick={onClose} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md border-0">Cerrar</button>
      </div>
    </div>
  );
};


// ==========================================
// COMPONENTE: Modal de Plan de Clase / Recurso con IA
// ==========================================
const PlanDeClaseModal = ({
  isOpen,
  onClose,
  recurso,
  materiaLabel,
  grado,
  periodo,
  tipoRecurso,
  documentoBaseTexto,
  nombreDocumentoBase,
  apiKey,
  showToast,
  onLaunchGame,
  t
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contenido, setContenido] = useState(null);
  const [instruccionesExtra, setInstruccionesExtra] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !recurso) return null;

  const handleGenerar = async () => {
    setIsLoading(true);
    setContenido(null);
    setError('');

    const materiaActual = materiaLabel;
    const gradoSeleccionado = `${grado}°`;
    const periodoSeleccionado = `Periodo ${periodo}`;
    const necesidad = recurso?.customTipo || tipoRecurso;
    const temaDeLaSemanaSeleccionada = recurso?.tema || recurso?.titulo || recurso?.subtemas?.[0] || 'Tema del Periodo';
    const textoTextarea = instruccionesExtra ? instruccionesExtra.trim() : '';

    let promptFinal = `ASIGNATURA: ${materiaActual} | GRADO: ${gradoSeleccionado} | PERIODO: ${periodoSeleccionado} | RECURSO A GENERAR: ${necesidad} | TEMA ESPECÍFICO: "${temaDeLaSemanaSeleccionada}"`;

    if (textoTextarea) {
      promptFinal += `\n\n🚨 INSTRUCCIONES ESPECÍFICAS Y OBLIGATORIAS DEL DOCENTE (DEBES CUMPLIRLAS EXACTAMENTE AL 100% Y TIENEN MÁXIMA PRIORIDAD):\n"${textoTextarea}"\n(Si el docente solicitó un número o tipo de preguntas determinado, como selección múltiple con opciones A, B, C, D o preguntas abiertas, o formato específico, GENERA EXACTAMENTE ESA CANTIDAD Y ESTRUCTURA SIN OMITIR NADA).`;
    } else {
      promptFinal += `\n\nGenerar ${necesidad} completo, didáctico y estructurado para usar en el aula sobre el tema: "${temaDeLaSemanaSeleccionada}".`;
    }

    if (documentoBaseTexto) {
      promptFinal += ` | DOCUMENTO BASE PROPORCIONADO POR EL DOCENTE: (BASA TU RESPUESTA ESTRICTAMENTE EN ESTE DOCUMENTO)
---------------------
${documentoBaseTexto}
---------------------`;
    }

    try {
      const baseSystemPrompt = getSystemPromptForResource(necesidad, instruccionesExtra);
      const isEnglishSubject = materiaActual.toLowerCase().includes('inglés') || materiaActual.toLowerCase().includes('english');
      const languageRule = isEnglishSubject
        ? "\nCRITICAL REQUIREMENT: YOU MUST GENERATE ALL THE CONTENT STRICTLY IN ENGLISH LANGUAGE, AS THIS IS AN ENGLISH CLASS. DO NOT USE SPANISH."
        : (t.tabTopics === "TOPICS" ? "\nCRITICAL REQUIREMENT: GENERATE ALL CONTENT STRICTLY IN ENGLISH LANGUAGE." : "");
      
      const targetSystemPrompt = baseSystemPrompt + languageRule;

      const rawText = await callGeminiAPI(promptFinal, targetSystemPrompt, apiKey);
      if (!rawText) {
        setError('Error de conexión con la IA, por favor intenta de nuevo');
        return;
      }

      const parsed = tryParseJSON(rawText);
      const metadata = {
        _materia: materiaActual,
        _grado: grado,
        _periodo: periodo,
        _tema: temaDeLaSemanaSeleccionada,
        _tipo: necesidad
      };
      if (parsed) {
        setContenido({ ...parsed, ...metadata });
      } else {
        setContenido({ _texto_libre: rawText, ...metadata });
      }
    } catch (e) {
      console.error("Fallo exacto en la IA:", e);
      setError(e?.message || 'Error de conexión con la IA, por favor intenta de nuevo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContenido(null);
    setError('');
    setInstruccionesExtra('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 animate-pageIn">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-7xl w-[90vw] max-h-[75vh] overflow-hidden flex flex-col relative notebook-pro-modal">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-850 dark:to-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">{t.aiGenerator} {tipoRecurso}</h3>
                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">{t.notebookSectioned}</p>
              </div>
            </div>
            <button onClick={handleClose} className="w-9 h-9 bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-slate-200 shadow-sm">
              <X size={16} />
            </button>
          </div>

          {/* Contexto del recurso */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
            <p className="text-xs font-black text-slate-800 mb-1 leading-snug">{recurso.titulo}</p>
            <p className="text-[11px] text-slate-500 font-medium mb-2">Tema: {recurso.tema}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-500">{materiaLabel}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-600">{grado}° {t.grade}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-600">{t.period} {periodo}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-rose-50 text-rose-500">{tipoRecurso}</span>
            </div>
            {nombreDocumentoBase && (
              <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                <Paperclip size={12} className="text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700">Utilizando documento base: {nombreDocumentoBase}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="flex-1 overflow-y-auto max-h-[75vh] p-6 space-y-5 custom-scrollbar bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">

          {!contenido && !isLoading && (
            <>
              {/* Preset Quick Actions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 block ml-1">🎯 {t.clickToGenerate}</span>
                {((recurso?.customTipo || tipoRecurso) && ((recurso?.customTipo || tipoRecurso).toLowerCase().includes('mapa') || (recurso?.customTipo || tipoRecurso).toLowerCase().includes('gráfico') || (recurso?.customTipo || tipoRecurso).toLowerCase().includes('esquema') || (recurso?.customTipo || tipoRecurso).toLowerCase().includes('organizador'))) ? (
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un mapa conceptual jerárquico usando tablas o listas anidadas que se vea excelente y ordenado al exportar a Word.")}
                      className="text-[10px] bg-teal-50 text-teal-700 font-bold px-3 py-1.5 rounded-xl border border-teal-100 hover:bg-teal-100 transition-colors"
                    >
                      🗺️ Mapa Conceptual
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un mapa mental radial y estructurado usando tablas estilizadas o listas concéntricas.")}
                      className="text-[10px] bg-fuchsia-50 text-fuchsia-700 font-bold px-3 py-1.5 rounded-xl border border-fuchsia-100 hover:bg-fuchsia-100 transition-colors"
                    >
                      🧠 Mapa Mental
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un cuadro sinóptico o esquema estructurado por niveles jerárquicos usando celdas combinadas.")}
                      className="text-[10px] bg-sky-50 text-sky-700 font-bold px-3 py-1.5 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors"
                    >
                      📊 Cuadro Sinóptico
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera una línea de tiempo cronológica usando una tabla de dos columnas (Fecha/Época y Evento).")}
                      className="text-[10px] bg-rose-50 text-rose-700 font-bold px-3 py-1.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
                    >
                      ⏳ Línea de Tiempo
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un diagrama de flujo de procesos o pasos usando arte ASCII dentro de bloques de código y flechas.")}
                      className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      🔄 Diagrama de Flujo
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un diagrama de Venn o cuadro comparativo en tabla para mostrar similitudes y diferencias.")}
                      className="text-[10px] bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors"
                    >
                      ⭕ Diagrama de Venn
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera una estructura de diapositivas slide por slide para Canva o PowerPoint sobre este tema.")}
                      className="text-[10px] bg-orange-50 text-orange-700 font-bold px-3 py-1.5 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors"
                    >
                      📊 Diapositivas Canva / PPT
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un mapa conceptual estructurado con jerarquía, nodos y conceptos clave para este tema.")}
                      className="text-[10px] bg-teal-50 text-teal-700 font-bold px-3 py-1.5 rounded-xl border border-teal-100 hover:bg-teal-100 transition-colors"
                    >
                      🗺️ Mapa Conceptual
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera 2 talleres prácticos con encabezado formal para estudiante (Nombre/Fecha) y ejercicios variados.")}
                      className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                    >
                      📝 Taller Práctico
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un plan de estudio detallado y estructurado en tabla HTML con semanas, actividades y objetivos de aprendizaje.")}
                      className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      📚 Plan de Clase en Tabla
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un quiz imprimible de 5 preguntas variadas con encabezado para estudiante y clave de respuestas para el docente.")}
                      className="text-[10px] bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors"
                    >
                      ⚡ Quiz Imprimible
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera un guion didáctico para video corto de 2 columnas (Visual y Audio).")}
                      className="text-[10px] bg-rose-50 text-rose-700 font-bold px-3 py-1.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
                    >
                      🎬 Guion de Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Recomienda y genera enlaces a juegos interactivos en línea (Wordwall, Kahoot, Educaplay, PhET) para este tema.")}
                      className="text-[10px] bg-sky-50 text-sky-700 font-bold px-3 py-1.5 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors"
                    >
                      🎮 Juegos en Línea
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstruccionesExtra("Genera una guía de adaptación inclusiva DUA con pictogramas y lectura fácil.")}
                      className="text-[10px] bg-violet-50 text-violet-700 font-bold px-3 py-1.5 rounded-xl border border-violet-100 hover:bg-violet-100 transition-colors"
                    >
                      🧩 Adaptación DUA
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  📝 {t.extraInstructions}
                </label>
                <textarea
                  value={instruccionesExtra}
                  onChange={(e) => setInstruccionesExtra(e.target.value)}
                  placeholder={getSubjectPlaceholder(materiaLabel, grado, periodo)}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-xs font-medium leading-relaxed min-h-[110px] outline-none resize-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all placeholder:text-slate-400 font-sans"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleGenerar}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-200 active:scale-[0.98] transition-all cursor-pointer border-0"
              >
                <Sparkles size={16} />
                {t.generateNow}
              </button>
            </>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center animate-pulse">
                <Loader2 size={32} className="text-rose-500 animate-spin" />
              </div>
              <p className="text-xs font-bold text-slate-500 animate-pulse">{t.generatingResource}</p>
              <p className="text-[10px] text-slate-400 font-medium">{t.thisMayTakeAWhile}</p>
            </div>
          )}

          {/* Resultados JSON estructurado */}
          {contenido && !contenido._texto_libre && (
            <ResultadoIACards
              resultado={contenido}
              onReset={() => setContenido(null)}
              onClose={handleClose}
              showToast={showToast}
              onLaunchGame={onLaunchGame}
              customTipo={tipoRecurso}
            />
          )}

          {/* Fallback texto/HTML libre */}
          {contenido && contenido._texto_libre && (
            <ResultadoTextoLibre
              texto={contenido._texto_libre}
              onReset={() => setContenido(null)}
              onClose={handleClose}
              showToast={showToast}
              customTipo={tipoRecurso}
            />
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// COMPONENTE: Modal de Adaptación con IA
// ==========================================
const AdaptacionIAModal = ({
  isOpen,
  onClose,
  recurso,
  materiaLabel,
  grado,
  periodo,
  tipoRecurso,
  apiKey,
  showToast,
  onLaunchGame,
  t
}) => {
  const [necesidad, setNecesidad] = useState('dua_general');
  const [instruccionesExtra, setInstruccionesExtra] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen || !recurso) return null;

  const handleGenerar = async () => {
    setIsLoading(true);
    setResultado(null);
    setError('');

    const materiaActual = materiaLabel;
    const gradoSeleccionado = `${grado}°`;
    const periodoSeleccionado = `Periodo ${periodo}`;
    const necesidadLabel = necesidadesEducativas.find(n => n.value === necesidad)?.label || necesidad;
    const textoTextarea = instruccionesExtra || `Adaptación DUA/PIAR para tema ${recurso.tema}`;

    const promptFinal = `Materia: ${materiaActual} | Grado: ${gradoSeleccionado} | Periodo: ${periodoSeleccionado} | Necesidad: ${necesidadLabel} | Instrucciones: ${textoTextarea}`;

    try {
      const rawText = await callGeminiAPI(promptFinal, SYSTEM_PROMPT_AVANZADO, apiKey);
      if (!rawText) {
        setError('Error de conexión con la IA, por favor intenta de nuevo');
        return;
      }

      const parsed = tryParseJSON(rawText);
      const metadata = {
        _materia: materiaActual,
        _grado: grado,
        _periodo: periodo,
        _tema: recurso?.tema || recurso?.titulo,
        _tipo: `Adaptación DUA (${necesidadLabel})`
      };
      if (parsed) {
        setResultado({ ...parsed, ...metadata });
      } else {
        setResultado({ _texto_libre: rawText, ...metadata });
      }
    } catch (e) {
      console.error("Fallo exacto en la IA:", e);
      setError('Error de conexión con la IA, por favor intenta de nuevo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResultado(null);
    setError('');
    setNecesidad('dua_general');
    setInstruccionesExtra('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 animate-pageIn">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-7xl w-[90vw] max-h-[75vh] overflow-hidden flex flex-col relative notebook-pro-modal">

        {/* Header del Modal */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-slate-850 dark:to-indigo-950/60 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-violet-600" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">Adaptación DUA / PIAR con IA</h3>
                <p className="text-[10px] text-violet-500 font-bold uppercase tracking-wider">{t.notebookSectioned}</p>
              </div>
            </div>
            <button onClick={handleClose} className="w-9 h-9 bg-white hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-slate-200 shadow-sm">
              <X size={16} />
            </button>
          </div>

          {/* Contexto del recurso */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
            <p className="text-xs font-black text-slate-800 mb-1 leading-snug">{recurso.titulo}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-500">{materiaLabel}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-600">{grado}° {t.grade}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-rose-50 text-rose-500">{tipoRecurso}</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="flex-1 overflow-y-auto max-h-[75vh] p-6 space-y-5 custom-scrollbar bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">

          {/* Formulario */}
          {!resultado && !isLoading && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  🎯 {t.selectCondition}
                </label>
                <select
                  value={necesidad}
                  onChange={(e) => setNecesidad(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-sm text-slate-700 outline-none cursor-pointer hover:border-violet-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
                >
                  {necesidadesEducativas.map(n => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  📝 {t.extraInstructions}
                </label>
                <textarea
                  value={instruccionesExtra}
                  onChange={(e) => setInstruccionesExtra(e.target.value)}
                  placeholder={getSubjectPlaceholder(materiaLabel, grado, periodo)}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-xs font-medium leading-relaxed min-h-[110px] outline-none resize-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all placeholder:text-slate-400 font-sans"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleGenerar}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-violet-200 active:scale-[0.98] transition-all cursor-pointer border-0"
              >
                <Sparkles size={16} />
                {t.generateNow}
              </button>
            </>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center animate-pulse">
                <Loader2 size={32} className="text-violet-500 animate-spin" />
              </div>
              <p className="text-xs font-bold text-slate-500 animate-pulse">{t.generatingDUA}</p>
              <p className="text-[10px] text-slate-400 font-medium">{t.thisMayTakeAWhile}</p>
            </div>
          )}

          {/* Resultados JSON */}
          {resultado && !resultado._texto_libre && (
            <ResultadoIACards
              resultado={resultado}
              onReset={() => setResultado(null)}
              onClose={handleClose}
              showToast={showToast}
              onLaunchGame={onLaunchGame}
              defaultSection="inclusivo"
            />
          )}

          {/* Fallback texto libre */}
          {resultado && resultado._texto_libre && (
            <ResultadoTextoLibre
              texto={resultado._texto_libre}
              onReset={() => setResultado(null)}
              onClose={handleClose}
              showToast={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// COMPONENTE PRINCIPAL: NotebookView
// ==========================================
const NotebookView = ({
  selectedSubject,
  setView,
  activeTheme,
  showToast,
  allSubjects,
  setSelectedSubject,
  apiKey,
  language = 'es'
}) => {
  const t = notebookTranslations[language] || notebookTranslations.es;
  const contentTypes = getContentTypes(t);

  // Estado interno del Notebook
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedType, setSelectedType] = useState('temas');
  const [currentMateriaValue, setCurrentMateriaValue] = useState(
    subjectNameToValue[selectedSubject?.name] || 'espanol_lit'
  );
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  // Resetear el tema activo cuando cambian los filtros
  useEffect(() => {
    setActiveTopicIndex(0);
  }, [selectedGrade, selectedPeriod, currentMateriaValue]);

  // Estado de los modales
  const [adaptModalOpen, setAdaptModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);

  // Estado del documento base (Contexto del Profesor)
  const [documentoBaseTexto, setDocumentoBaseTexto] = useState('');
  const [nombreDocumentoBase, setNombreDocumentoBase] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNombreDocumentoBase(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setDocumentoBaseTexto(evt.target.result);
      if(showToast) showToast('Éxito', `Documento "${file.name}" cargado y listo para ser usado por la IA.`, 'success');
    };
    reader.onerror = () => {
      if(showToast) showToast('Error', 'No se pudo leer el archivo.', 'error');
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  const handleRemoveFile = () => {
    setDocumentoBaseTexto('');
    setNombreDocumentoBase('');
  };

  // Estado del visor de juegos interactivos
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [activeGameUrl, setActiveGameUrl] = useState('');
  const [activeGameTitle, setActiveGameTitle] = useState('');

  // Obtener el label visible de la materia seleccionada
  const currentOption = subjectOptions.find(s => s.value === currentMateriaValue);
  const currentLabel = currentOption?.label || selectedSubject?.name || 'Materia';
  const currentIcon = subjectIcons[currentMateriaValue] || '📖';

  // Obtener recursos filtrados
  const resources = getFilteredResources(currentMateriaValue, selectedGrade, selectedPeriod, selectedType);

  // Handler para cambiar materia desde el dropdown
  const handleSubjectChange = (e) => {
    const newValue = e.target.value;
    setCurrentMateriaValue(newValue);
    const matchingSubject = allSubjects?.find(s => subjectNameToValue[s.name] === newValue);
    if (matchingSubject && setSelectedSubject) {
      setSelectedSubject(matchingSubject);
    }
  };

  // Handlers para abrir modales
  const handleOpenAdaptModal = (item) => {
    setRecursoSeleccionado(item);
    setAdaptModalOpen(true);
  };

  const handleOpenPlanModal = (tipo, item) => {
    setRecursoSeleccionado({ ...item, customTipo: tipo });
    setPlanModalOpen(true);
  };

  // Handler para lanzar juegos
  const handleLaunchGame = (url, title) => {
    setActiveGameUrl(url);
    setActiveGameTitle(title);
    setGameModalOpen(true);
  };

  // Obtener el label legible del tipo de recurso
  const tipoRecursoLabel = contentTypes.find(ct => ct.key === selectedType)?.label || selectedType;

  return (
    <div className="flex-1 flex flex-col animate-pageIn pb-24 md:pb-8 transition-all duration-500 bg-[#fcfcfc] dark:bg-slate-950">

      {/* Visor Iframe de Juego Interactivo Integrado */}
      <GameIframeModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        gameUrl={activeGameUrl}
        gameTitle={activeGameTitle}
      />

      {/* Modal de Adaptación IA */}
      <AdaptacionIAModal
        isOpen={adaptModalOpen}
        onClose={() => setAdaptModalOpen(false)}
        recurso={recursoSeleccionado}
        materiaLabel={currentLabel}
        grado={selectedGrade}
        periodo={selectedPeriod}
        tipoRecurso={tipoRecursoLabel}
        apiKey={apiKey}
        showToast={showToast}
        onLaunchGame={handleLaunchGame}
        t={t}
      />

      {/* Modal de Plan de Clase / Quiz / Recurso IA */}
      <PlanDeClaseModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        recurso={recursoSeleccionado}
        materiaLabel={currentLabel}
        grado={selectedGrade}
        periodo={selectedPeriod}
        tipoRecurso={recursoSeleccionado?.customTipo || tipoRecursoLabel}
        documentoBaseTexto={documentoBaseTexto}
        nombreDocumentoBase={nombreDocumentoBase}
        apiKey={apiKey}
        showToast={showToast}
        onLaunchGame={handleLaunchGame}
        t={t}
      />

      {/* ============================================
          HEADER: Materia activa + Selector rápido
          ============================================ */}
      <header className="px-5 pt-6 pb-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('materials')}
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-white transition-all shadow-sm active:scale-90 cursor-pointer border border-slate-200/60 dark:border-slate-700"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl flex items-center justify-center text-2xl">
              {currentIcon}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {currentLabel.replace('🧩 ', '')}
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-400 font-semibold">
                Plan Curricular y Recursos Didácticos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Context File Upload Button */}
            <div className="flex items-center">
              <input 
                type="file" 
                accept=".txt,.csv,.md,.pdf" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
              {nombreDocumentoBase ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                  <Paperclip size={14} className="text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-700 max-w-[100px] truncate">{nombreDocumentoBase}</span>
                  <button onClick={handleRemoveFile} className="text-emerald-500 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-indigo-100"
                >
                  <Paperclip size={14} />
                  <span className="hidden sm:inline">{t.attachDocument}</span>
                  <span className="sm:hidden">Adjuntar</span>
                </button>
              )}
            </div>
            
            <label htmlFor="nbSubjectSelect" className="text-xs font-bold text-slate-500 dark:text-slate-300 hidden sm:block ml-2">
              Materia:
            </label>
            <select
              id="nbSubjectSelect"
              value={currentMateriaValue}
              onChange={handleSubjectChange}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-white text-sm outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {subjectOptions.map(opt => (
                <option key={opt.value} value={opt.value} className={opt.highlight ? 'font-bold text-violet-700 dark:text-violet-300' : 'dark:bg-slate-800 dark:text-white'}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ============================================
          FILTROS: Grados + Periodos
          ============================================ */}
      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3 bg-white/60 dark:bg-slate-900/60 border-b border-slate-100/80 dark:border-slate-800">
        <div className="flex gap-2">
          {grades.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                selectedGrade === g
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 ring-2 ring-indigo-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {g}°
            </button>
          ))}
        </div>

        <div className="flex bg-slate-200/70 dark:bg-slate-900 p-1.5 rounded-2xl gap-1.5 border border-slate-300/70 dark:border-slate-700 shadow-inner">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer border ${
                selectedPeriod === p
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 ring-2 ring-indigo-400/40'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {t.period} {p}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================
          TIPOS DE CONTENIDO (Chips / Pills)
          ============================================ */}
      <div className="px-5 py-3 flex gap-2 flex-wrap">
        {contentTypes.map(ct => (
          <button
            key={ct.key}
            onClick={() => setSelectedType(ct.key)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-all duration-200 cursor-pointer border ${
              selectedType === ct.key
                ? ct.special
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'
                  : 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                : ct.special
                  ? 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60 hover:bg-violet-50 dark:hover:bg-slate-700'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {ct.icon} {ct.label}
          </button>
        ))}
      </div>

      {/* Sección especial si la pestaña activa es JUEGOS */}
      {selectedType === 'juegos' && (
        <div className="px-5 pt-2">
          <PlataformasJuegosBar
            onLaunchGame={handleLaunchGame}
            activeTopic={resources[activeTopicIndex]?.titulo || ''}
            currentSubject={currentMateriaValue}
          />
        </div>
      )}

      {/* Sección especial si la pestaña activa es DIAPOSITIVAS */}
      {selectedType === 'diapositivas' && (
        <div className="px-5 pt-2">
          <PlataformasDiapositivasBar />
        </div>
      )}

      {/* ============================================
          SECCIÓN DE TEMAS EN SECCIONES / TIMELINE (Evita sobrecarga visual)
          ============================================ */}
      <main className="px-5 py-4 overflow-y-auto flex-1 custom-scrollbar">
        {resources.length === 0 ? (
          <div className="col-span-full text-center py-16 px-6 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-2">{t.noResources} {t.subjects?.[selectedSubject.name] || selectedSubject.name}</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">{t.startGenerating}</p>
            <button
              onClick={() => handleOpenPlanModal('Plan de 13 Clases', {})}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 bg-indigo-600`}
            >
              <Sparkles size={18} />
              {t.generatePlan13}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Selector de Secciones / Semanas (Timeline vertical súper limpio) */}
            <div className="lg:col-span-4 space-y-2 lg:max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-2.5 tracking-wider">
                📌 SECCIONES / TEMAS DEL PERIODO (13 SEMANAS):
              </span>
              
              <div className="space-y-2">
                {resources.map((item, idx) => {
                  const isActive = activeTopicIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTopicIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-600 dark:border-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none translate-x-1.5'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs truncate leading-snug">
                          {item.titulo.includes(':') ? item.titulo.split(':')[1].trim() : item.titulo}
                        </h5>
                        <p className={`text-[9px] font-black uppercase tracking-wider ${
                          isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {t.week} {idx + 1}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Enfoque con los Recursos del Tema (FOCUSED) */}
            <div className="lg:col-span-8">
              {resources[activeTopicIndex] && (() => {
                const item = resources[activeTopicIndex];
                return (
                  <article
                    className={`bg-white dark:bg-slate-900 border rounded-[2rem] p-7 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 min-h-[500px] ${
                      item.inclusivo
                        ? 'border-violet-300 dark:border-violet-800 ring-2 ring-violet-100 dark:ring-violet-950'
                        : 'border-slate-200/90 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      {/* Cabecera Interna */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">
                            {subjectIcons[item.materiaOrigen || item.materia] || subjectIcons[item.materia] || '📖'}
                          </span>
                          <span className="text-[10px] px-3.5 py-1 rounded-full font-black uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/40">
                            {t.week} {activeTopicIndex + 1} {t.of} 13
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200/40 dark:border-slate-700/60">
                          Módulo Temático Activo
                        </span>
                      </div>

                      {/* Título y Descripción del Tema Seleccionado */}
                      <h3 className="font-black text-xl text-slate-950 dark:text-white leading-tight mb-2">
                        {item.titulo}
                      </h3>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                        {item.descripcion}
                      </p>

                      {/* Ejes Temáticos del Periodo */}
                      {Array.isArray(item.subtemas) && item.subtemas.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-850 p-4.5 rounded-[1.5rem] mb-6 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 block mb-2 tracking-wider">
                            📌 Ejes Temáticos Principales:
                          </span>
                          <ul className="space-y-1.5">
                            {item.subtemas.map((s, i) => (
                              <li key={i} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block shrink-0"></span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Matriz de Botones de Recursos Didácticos del Tema Seleccionado */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black tracking-widest text-indigo-400 mb-3 uppercase">{t.aiAdaptationTools}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                          {t.clickToGenerate}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Los botones se filtran dinámicamente según la pestaña activa (selectedType) */}
                        {selectedType === 'diapositivas' && (
                          <button
                            onClick={() => handleOpenPlanModal('Presentación Canva / PPT', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer border border-amber-200/80 dark:border-amber-800/40 active:scale-95"
                          >
                            <span className="text-sm">📊</span> {t.genSlides}
                          </button>
                        )}
                        {(selectedType === 'guias' || selectedType === 'temas') && (
                          <button
                            onClick={() => handleOpenPlanModal('Guía de Aprendizaje', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer border border-emerald-100 dark:border-emerald-800/40 active:scale-95"
                          >
                            <span className="text-sm">📑</span> {t.genGuide}
                          </button>
                        )}
                        {selectedType === 'talleres' && (
                          <button
                            onClick={() => handleOpenPlanModal('2 Talleres Prácticos', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all cursor-pointer border border-sky-100 dark:border-sky-800/40 active:scale-95"
                          >
                            <span className="text-sm">📝</span> {t.genWorkshops}
                          </button>
                        )}
                        {selectedType === 'examenes' && (
                          <button
                            onClick={() => handleOpenPlanModal('Examen Evaluativo', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer border border-rose-100 dark:border-rose-800/40 active:scale-95"
                          >
                            <span className="text-sm">✏️</span> {t.genExam}
                          </button>
                        )}
                        {selectedType === 'quizzes' && (
                          <button
                            onClick={() => handleOpenPlanModal('Quiz Rápido de 5 Preguntas', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer border border-amber-100 dark:border-amber-800/40 active:scale-95"
                          >
                            <span className="text-sm">⚡</span> {t.genQuiz}
                          </button>
                        )}
                        {selectedType === 'videos' && (
                          <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-2">
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent((item.titulo || item.tema || '').replace(/video/gi, '').trim() + ' ' + (item.materia || currentMateriaValue || '') + ' explicacion')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer shadow-md shadow-red-200 dark:shadow-none active:scale-95 no-underline border-0"
                            >
                              <PlayCircle size={16} /> ▶️ Abrir Video del Tema en YouTube ↗
                            </a>
                            <button
                              onClick={() => handleOpenPlanModal('Video Explicativo', item)}
                              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all cursor-pointer border border-red-100 dark:border-red-800/40 active:scale-95"
                            >
                              <span className="text-sm">🎬</span> {t.genVideo}
                            </button>
                          </div>
                        )}
                        {selectedType === 'juegos' && (() => {
                          const appRec = getRecommendedGameApp(currentMateriaValue);
                          const appUrl = getPlataformaSearchUrl(appRec.name, item.titulo || item.tema, currentMateriaValue);
                          return (
                            <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-2">
                              <a
                                href={appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md shadow-emerald-200 dark:shadow-none active:scale-95 no-underline border-0"
                              >
                                <span className="text-base">{appRec.icon}</span> Abrir en {appRec.name} (Recomendado) ↗
                              </a>
                              <button
                                onClick={() => handleOpenPlanModal('Juego Interactivo Listo', item)}
                                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all cursor-pointer border border-sky-100 dark:border-sky-800/40 active:scale-95"
                              >
                                <span className="text-sm">🎮</span> {t.genGame}
                              </button>
                            </div>
                          );
                        })()}
                        {selectedType === 'mapas' && (
                          <button
                            onClick={() => handleOpenPlanModal('Organizador Gráfico', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all cursor-pointer border border-teal-100 dark:border-teal-800/40 active:scale-95"
                          >
                            <span className="text-sm">🗺️</span> {t.genConceptMap}
                          </button>
                        )}
                        {selectedType === 'tips_docente' && (
                          <button
                            onClick={() => handleOpenPlanModal('Adaptación DUA', item)}
                            className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-violet-600 dark:bg-violet-700 text-white hover:bg-violet-700 dark:hover:bg-violet-600 transition-all cursor-pointer border border-violet-500 shadow-md shadow-violet-200 dark:shadow-none active:scale-95"
                          >
                            <span className="text-sm">💡</span> {t.genDUA}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })()}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default NotebookView;
