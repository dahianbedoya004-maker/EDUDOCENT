// ==========================================
// EDUDOCENT — COMPONENTE NOTEBOOK VIEW (13 TEMAS SUELTOS EN ARRAY + DIAPOSITIVAS)
// ==========================================

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Download, Eye, X, Loader2, Sparkles, BookOpen, Lightbulb, ClipboardList, GraduationCap, Globe, FileText, PlayCircle, Layers, Presentation, Paperclip } from 'lucide-react';
import pptxgen from "pptxgenjs";
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
const SYSTEM_PROMPT_AVANZADO = `Eres un asistente experto en planificación educativa, DUA y pedagogía. Tu objetivo es ahorrarle tiempo al docente proporcionando material listo para usar.

ALERTA DE ESTRUCTURA Y FORMATO:
- Si piden PLAN DE PERIODO: Está PROHIBIDO agrupar temas. Un periodo tiene 13 semanas. DEBES generar exactamente 13 temas individuales y sueltos en el array "clases_semanales".
- Si piden PRESENTACIÓN CANVA / PPT: Genera en "ideas_presentacion" un esquema estructurado diapositiva por diapositiva (Slide 1: Título, Slide 2: Pregunta generadora, Slide 3: Concepto clave, etc.) listo para copiar a Canva o PowerPoint.
- Si piden TALLERES: Genera en "contenido_principal" 2 talleres prácticos completos e independientes con instrucciones claras y ejercicios.
- Si piden JUEGO INTERACTIVO: Genera en "recursos_online" y "contenido_principal" las preguntas y dinámica para un juego tipo Trivia / Wordwall / Kahoot listo para aplicar en clase.
- Si piden EXAMEN O QUIZ: Genera formato imprimible limpio con encabezado institucional y clave de respuestas para el docente.

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo_periodo": "Título General o del Tema",
  "clases_semanales": [
    { "semana": 1, "tema_suelto": "Tema de la semana 1", "detalle_explicacion": "Información profunda para que el profe explique" }
  ],
  "contenido_principal": "Desarrollo detallado del recurso solicitado (Guía, 2 Talleres, Examen evaluativo, Quiz imprimible, Guion de Video o Dinámica de Juego)",
  "ideas_presentacion": "Esquema completo slide por slide para diapositivas en Canva o PowerPoint",
  "recursos_online": "Juegos interactivos online con botones HTML <a href='...' target='_blank'>🎮 Jugar en línea</a> o trivias listas"
}`;

// ==========================================
// FUNCIÓN: Genera un System Prompt personalizado según el recurso solicitado
// ==========================================
const getSystemPromptForResource = (necesidad) => {
  const baseInstructions = `Eres un asistente experto en planificación educativa, DUA y pedagogía. Tu objetivo es ahorrarle tiempo al docente proporcionando material listo para usar.
REGLA DE ORO: Si el usuario incluye "Instrucciones" específicas (ej. cantidad de talleres, formato, enfoques particulares), DEBES obedecer estrictamente lo que pide el usuario por encima de cualquier regla por defecto de cantidad.
Responde ÚNICAMENTE con un objeto JSON válido. No incluyas explicaciones de introducción o cierre fuera del JSON.`;

  const necesidadClean = (necesidad || '').toLowerCase();

  if (necesidadClean.includes('presentación') || necesidadClean.includes('diapositivas') || necesidadClean.includes('canva') || necesidadClean.includes('ppt')) {
    return `${baseInstructions}
Tu única tarea es diseñar una estructura de diapositivas slide por slide (para PowerPoint o Canva) sobre el tema solicitado.
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Estructura de Diapositivas Canva",
  "ideas_presentacion": "Genera el contenido de las diapositivas usando ESTRICTAMENTE este formato para CADA diapositiva, sin usar HTML:\n[DIAPOSITIVA 1]\n[TITULO] Escribe aquí el título corto\n[CONTENIDO] Escribe aquí el texto explicativo de la diapositiva (viñetas o párrafos cortos).\n\n[DIAPOSITIVA 2]\n[TITULO] ...\n[CONTENIDO] ...\n\n(Debes generar de 5 a 8 diapositivas siguiendo estrictamente este formato con las etiquetas en corchetes).",
  "guia_docente": "Breve indicación de cómo dirigir esta presentación de forma interactiva."
}`;
  }

  if (necesidadClean.includes('taller') || necesidadClean.includes('talleres')) {
    return `${baseInstructions}
Tu única tarea es diseñar los talleres prácticos solicitados. Por defecto diseña DOS (2) talleres, pero si el usuario te pidió expresamente otra cantidad (ej. solo 1), genera EXACTAMENTE la cantidad pedida.
Usa etiquetas HTML (<h1>, <h2>, <p>, <b>, <br>, <ul>, <hr>) para darle formato formal de hoja de trabajo.
Cada taller DEBE tener en la parte superior el siguiente encabezado exacto:
<b>Nombre:</b> ___________________________ <b>Fecha:</b> _________________<br><br>

Taller 1: Ejercicios de fijación conceptual (nivel básico/intermedio).
Taller 2: Ejercicios aplicados o contextualizados (nivel aplicado).

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Talleres Prácticos Evaluativos",
  "contenido_principal": "El código HTML completo de ambos talleres. Incluye el encabezado de Nombre/Fecha en cada taller. Deja espacios generosos (usando múltiples <br>) entre preguntas para que el estudiante pueda escribir su respuesta.",
  "guia_docente": "Criterios rápidos de evaluación y clave de respuestas correctas para el profesor."
}`;
  }

  if (necesidadClean.includes('examen') || necesidadClean.includes('evaluación')) {
    return `${baseInstructions}
Tu única tarea es diseñar un Examen de Unidad estructurado formalmente y listo para imprimir en Word.
Usa etiquetas HTML (<h1>, <p>, <b>, <br>, <ol>, <li>) para darle formato de hoja de examen real.
El examen DEBE tener en la parte superior el siguiente encabezado exacto:
<b>Centro Educativo:</b> ___________________________<br>
<b>Nombre del Estudiante:</b> ___________________________<br>
<b>Fecha:</b> _________________ <b>Grado:</b> _________<br><br>

Luego, incluye por defecto (salvo que el usuario especifique otra cantidad):
1. 5 preguntas de selección múltiple tipo pruebas Saber (A, B, C, D) usando listas y saltos de línea legibles.
2. 2 preguntas abiertas de desarrollo reflexivo con suficiente espacio (múltiples <br>) para responder a mano.

Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Examen de Unidad Imprimible",
  "contenido_principal": "El código HTML completo del examen, incluyendo el encabezado de Nombre/Fecha y las preguntas estructuradas, diseñado de forma limpia para ser impreso.",
  "guia_docente": "Clave de respuestas correctas (A, B, C, D) y criterios de evaluación para las preguntas abiertas."
}`;
  }

  if (necesidadClean.includes('quiz')) {
    return `${baseInstructions}
Tu única tarea es diseñar un Quiz Rápido Imprimible estructurado formalmente para guardarse en Word.
Usa HTML básico (<h1>, <b>, <br>, <ol>).
DEBE tener este encabezado:
<b>Nombre:</b> _______________________ <b>Nota:</b> _____<br><br>

Debe incluir por defecto 4 preguntas sencillas de comprobar saberes básicos (o exactamente la cantidad que el usuario especifique en sus Instrucciones).
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Quiz Diagnóstico Corto",
  "contenido_principal": "El código HTML completo del quiz con el encabezado formal y las 4 preguntas bien espaciadas listas para imprimir.",
  "guia_docente": "Clave de respuestas para calificación rápida."
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
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Guion Didáctico para Video",
  "contenido_principal": "Guion detallado de 2 columnas indicando lo que se muestra visualmente en pantalla y el audio/locución correspondiente que debe decir el docente.",
  "guia_docente": "Consejos rápidos de grabación, tono de voz y plataformas educativas sugeridas."
}`;
  }

  if (necesidadClean.includes('juego')) {
    return `${baseInstructions}
Tu única tarea es diseñar la dinámica y preguntas para un Juego Educativo Interactivo listo para el aula sobre el tema solicitado (tipo trivia o juego cooperativo).
Debe detallar las preguntas, respuestas y dinámica de juego.
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Juego Interactivo para Clase",
  "contenido_principal": "Dinámica detallada de cómo jugar en el aula más 5 preguntas de trivia con sus opciones y respuestas para interactuar con los estudiantes.",
  "recursos_online": "Juegos en línea recomendados con botones HTML <a href='https://wordwall.net/es' target='_blank'>🎮 Jugar en Wordwall</a>",
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
- Diagrama de Flujo: Usa bloques <pre> con arte ASCII estilizado (usando corchetes [ ] y flechas ↓ →).
Tu respuesta debe ser un objeto JSON con esta estructura exacta:
{
  "titulo": "Organizador Gráfico del Tema",
  "contenido_principal": "El código HTML completo con la representación visual estructurada.",
  "guia_docente": "Sugerencias de cómo utilizar este recurso visual en la clase."
}`;
  }

  // Si se pide el plan general de 13 clases
  return SYSTEM_PROMPT_AVANZADO;
};

// ==========================================
// Utilidad: Exportar a documento Word (.doc)
// ==========================================
const exportToWord = (titulo, resultado, showToast) => {
  const docTitle = (typeof resultado === 'object' && (resultado?.titulo_periodo || resultado?.titulo_plan || resultado?.titulo)) || titulo || "Recurso_EDUDOCENT";

  let bodyHTML = `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <div style="background-color: #4f46e5; color: white; padding: 14px 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 20px;">EDUDOCENT — Material Educativo</h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.9;">Generado automáticamente para el docente</p>
      </div>
      <h2 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #6366f1; padding-bottom: 6px;">${docTitle}</h2>
  `;

  if (typeof resultado === 'string') {
    bodyHTML += `<div style="margin-top: 15px;">${resultado}</div>`;
  } else if (resultado) {
    if (Array.isArray(resultado.clases_semanales) && resultado.clases_semanales.length > 0) {
      let tableRows = resultado.clases_semanales.map((c, idx) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center; color: #4f46e5;">Semana ${c.semana || idx + 1}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${c.tema_suelto || ''}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${c.detalle_explicacion || ''}</td>
        </tr>
      `).join('');

      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #4f46e5; font-size: 14px;">1. Plan de 13 Clases Semanales (13 Temas Sueltos)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
            <thead>
              <tr style="background-color: #4f46e5; color: white;">
                <th style="padding: 8px; border: 1px solid #4338ca; width: 80px;">Semana</th>
                <th style="padding: 8px; border: 1px solid #4338ca; width: 30%;">Tema Específico</th>
                <th style="padding: 8px; border: 1px solid #4338ca;">Guía de Explicación (Voz Alta)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;
    }
    if (resultado.plan_13_clases) {
      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #4f46e5; font-size: 14px;">1. Plan de 13 Clases Independientes</h3>
          <div style="font-size: 12px; line-height: 1.6;">${resultado.plan_13_clases}</div>
        </div>
      `;
    }
    if (resultado.contenido_principal) {
      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #4f46e5; font-size: 14px;">Contenido Principal / Recurso</h3>
          <div style="font-size: 12px; line-height: 1.6;">${resultado.contenido_principal}</div>
        </div>
      `;
    }
    if (resultado.ideas_presentacion || resultado.estructura_presentacion) {
      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #d97706; font-size: 14px;">2. Estructura para Presentaciones / Diapositivas (PowerPoint / Canva)</h3>
          <div style="font-size: 12px; line-height: 1.6;">${resultado.ideas_presentacion || resultado.estructura_presentacion}</div>
        </div>
      `;
    }
    if (resultado.recursos_online) {
      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #0284c7; font-size: 14px;">3. Recursos Online y Juegos Recomendados</h3>
          <div style="font-size: 12px; line-height: 1.6;">${resultado.recursos_online}</div>
        </div>
      `;
    }
    if (resultado.adaptacion_inclusiva) {
      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #7c3aed; font-size: 14px;">4. Adaptación Inclusiva (PIAR / DUA)</h3>
          <div style="font-size: 12px; line-height: 1.6;">${resultado.adaptacion_inclusiva}</div>
        </div>
      `;
    }
    if (resultado.guia_docente) {
      bodyHTML += `
        <div style="margin-top: 20px;">
          <h3 style="color: #059669; font-size: 14px;">5. Guía para el Docente</h3>
          <div style="font-size: 12px; line-height: 1.6;">${resultado.guia_docente}</div>
        </div>
      `;
    }
  }

  bodyHTML += `
      <hr style="border: none; border-top: 1px dashed #cbd5e1; margin-top: 30px;" />
      <p style="font-size: 10px; color: #94a3b8; text-align: center;">EDUDOCENT — Copiloto Docente e Inteligencia Artificial Educativa</p>
    </div>
  `;

  try {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
      "xmlns:w='urn:schemas-microsoft-com:office:word' "+
      "xmlns='http://www.w3.org/TR/REC-html40'>"+
      "<head><meta charset='utf-8'><title>Export Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + bodyHTML + footer;

    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) showToast('📄 Documento exportado a Word (.doc) con éxito');
  } catch {
    if (showToast) showToast('⚠️ Error al exportar documento');
  }
};

// ==========================================
// Utilidad: Llamar a la API de Gemini con respaldo inteligente
// ==========================================
const generateFallbackNotebookAIResponse = (userPrompt, systemPrompt) => {
  const isEnglish = (userPrompt || '').toLowerCase().includes('english') || (systemPrompt || '').toLowerCase().includes('english');

  const topicMatch = (userPrompt || '').match(/tema[^:|]*[:|]\s*([^|]+)/i) || (userPrompt || '').match(/materia[^:|]*[:|]\s*([^|]+)/i);
  const topicName = topicMatch ? topicMatch[1].trim() : 'Unidad Temática y Contenidos del Grado';

  const necesidadMatch = (userPrompt || '').match(/necesidad[^:|]*[:|]\s*([^|]+)/i);
  const nStr = necesidadMatch ? necesidadMatch[1].trim().toLowerCase() : (userPrompt + ' ' + systemPrompt).toLowerCase();

  // 5. TALLERES PRÁCTICOS / GUÍAS DE EJERCICIOS
  if (nStr.includes('taller') || nStr.includes('ejercicio') || nStr.includes('worksheet') || nStr.includes('práctica')) {
    if (isEnglish) {
      return `### 📝 Practical Workshop No. 1: Application Exercises
**Topic:** ${topicName} | **Student Name:** ____________________ | **Date:** ________

#### 🔹 Activity 1: Case Study Analysis
> *Instruction:* Read the case below carefully and answer the questions.

*Case Scenario:* A practical situation where students must apply the core concepts of **${topicName}**.

1. What is the key concept required to solve this scenario?
   __________________________________________________________________________________
2. List 2 step-by-step actions to complete the task successfully:
   - Step A: ________________________________________________________________________
   - Step B: ________________________________________________________________________

---

#### 🔹 Activity 2: Matching Column Exercise
> *Instruction:* Match each term on the left with its corresponding description on the right.

1. Core Concept of ${topicName}        ---------> (  ) Practical classroom application.
2. Main Rule / Procedure            ---------> (  ) Fundamental definition.
3. Expected Learning Outcome        ---------> (  ) Goal achieved after completing the exercise.

---

### 📝 Practical Workshop No. 2: Creative Challenge
**Topic:** ${topicName} | **Partner / Group:** ____________________

#### 🚀 Team Challenge:
Create your own original example demonstrating how **${topicName}** is used in everyday life.

1. **Project Title:** ________________________________________________________
2. **Short Description:** __________________________________________________
3. **Diagram / Sketch Box:**
   [ Draw or create your concept map in this box ]

---
#### 🔑 Formative UDL Check
- [ ] I understood the main concept of the workshop.
- [ ] I completed the tasks independently or with teacher support.
`;
    }

    return `### 📝 Taller Práctico No. 1: Ejercicios de Aplicación Directa
**Tema:** ${topicName} | **Estudiante:** ____________________ | **Fecha:** ________

#### 🔹 Actividad 1: Análisis de Caso Práctico
> *Instrucción:* Lee atentamente la siguiente situación y responde las preguntas con claridad.

*Caso:* En una jornada escolar, se presenta un escenario donde los estudiantes deben aplicar los principios fundamentales de **${topicName}**.

1. ¿Cuál es el concepto clave que permite solucionar este escenario?
   __________________________________________________________________________________
2. Explica 2 pasos indispensables para ejecutar la solución de forma correcta:
   - Paso A: ________________________________________________________________________
   - Paso B: ________________________________________________________________________

---

#### 🔹 Actividad 2: Emparejamiento de Términos
> *Instrucción:* Relaciona cada concepto de la columna izquierda con su aplicación correspondiente en la columna derecha escribiendo el número correcto.

1. Concepto Central de ${topicName}    ---------> (  ) Aplicación práctica en el salón de clase.
2. Procedimiento o Regla Principal   ---------> (  ) Definición de base para el entendimiento del tema.
3. Resultado o Conclusión Esperada    ---------> (  ) Meta alcanzada tras el desarrollo de los ejercicios.

---

### 📝 Taller Práctico No. 2: Desafío de Creación y Producción
**Tema:** ${topicName} | **Grupo / Pareja:** ____________________

#### 🚀 Reto Colaborativo:
Diseña una propuesta o ejemplo propio donde demuestres cómo utilizas **${topicName}** en tu entorno cotidiano o escolar.

1. **Título de tu Ejemplo:** __________________________________________________
2. **Descripción Corta:** ____________________________________________________
3. **Representación Gráfica o Esquema:**
   [ Dibuja o realiza un diagrama en este espacio ]

---
#### 🔑 Criterio de Autoevaluación Formativa (DUA)
- [ ] Logré comprender el concepto principal del taller.
- [ ] Completé las actividades con autonomía o el apoyo del docente.
`;
  }

  // 1. PRESENTACIÓN CANVA / PPT (DIAPOSITIVAS)
  if (nStr.includes('presentación') || nStr.includes('ppt') || nStr.includes('diapositiva') || nStr.includes('canva') || nStr.includes('slide')) {
    if (isEnglish) {
      return `### 🖥️ Slide Structure for Canva / PowerPoint Presentation
**Topic:** ${topicName}

---
#### 📄 Slide 1: Title & Overview
- **Main Title:** ${topicName}
- **Subtitle:** Interactive Classroom Guide & Core Concepts
- **Visual Prompt (Canva):** High-contrast educational vector art with key icons.
- **Speaker Notes:** Welcome students, present daily learning goal, and initiate 2-min warmup question.

---
#### 📄 Slide 2: Learning Objectives & Goals
- **What will we master today?:**
  1. Key definitions and historical/conceptual context of ${topicName}.
  2. Practical step-by-step examples and real-world relevance.
  3. Collaborative pair exercise & quick check-for-understanding.
- **Speaker Notes:** Explain objectives in accessible language for all student profiles.

---
#### 📄 Slide 3: Core Concept Breakdown
- **Key Definition:** Main theoretical and practical framework.
- **Visual Layout:** 3-step structured infographic.
- **Speaker Notes:** Pause for diagnostic questions and quick student feedback.

---
#### 📄 Slide 4: Guided Examples & Pair Challenge
- **Real-World Example:** Everyday application of ${topicName}.
- **Pair Activity:** 5-minute partner discussion ticket.
- **Speaker Notes:** Circulate around the room providing UDL scaffolding.

---
#### 📄 Slide 5: Summary & Exit Ticket
- **Key Takeaways:** 3 essential bullet points to remember.
- **Exit Question:** "What was your main insight during today's lesson?"
`;
    }

    return `### 🖥️ Estructura para Presentación Canva / PowerPoint (Diapositivas)
**Tema:** ${topicName}

---
#### 📄 Diapositiva 1: Portada e Introducción
- **Título Principal:** ${topicName}
- **Subtítulo:** Guía Didáctica e Interactiva para el Aula
- **Sugerencia Visual (Canva):** Ilustración vectorial temática de alto contraste con iconos representativos.
- **Notas del Orador:** Bienvenida a los estudiantes, presentación del propósito del día y pregunta activadora.

---
#### 📄 Diapositiva 2: Objetivos de Aprendizaje
- **¿Qué aprenderemos hoy?:**
  1. Definición y conceptos fundamentales de ${topicName}.
  2. Identificación de características clave y ejemplos prácticos.
  3. Aplicación en actividades colaborativas del entorno escolar.
- **Notas del Orador:** Explicar los objetivos en lenguaje accesible de Lectura Fácil.

---
#### 📄 Diapositiva 3: Explicación y Conceptos Clave
- **Contenido Central:** Desglose estructurado de los elementos principales de ${topicName}.
- **Esquema Gráfico:** Mapa visual de 3 pasos o infografía conceptual.
- **Notas del Orador:** Realizar pausas breves de comprensión y resolver dudas iniciales.

---
#### 📄 Diapositiva 4: Ejemplos Prácticos y Desafío en Parejas
- **Ejemplo Cotidiano:** Aplicación directa del tema en la vida real.
- **Reto Práctico:** Ejercicio en parejas de 5 minutos.
- **Notas del Orador:** Monitorear el aula ofreciendo apoyos DUA a quienes lo requieran.

---
#### 📄 Diapositiva 5: Resumen y Ticket de Salida
- **Ideas Clave:** 3 puntos indispensables para recordar.
- **Reflexión de Cierre:** "¿Cuál fue el aprendizaje más valioso de la sesión?"
`;
  }

  // 2. QUIZ IMPRIMIBLE / EXÁMENES / EVALUACIONES
  if (nStr.includes('quiz') || nStr.includes('examen') || nStr.includes('evaluación') || nStr.includes('prueba') || nStr.includes('test')) {
    if (isEnglish) {
      return `### 📝 Printable Quiz & Formative Assessment (Accessible Format)
**Topic:** ${topicName} | **Student Name:** ____________________ | **Grade:** _____

---
#### ❓ Question 1: Multiple Choice
What is the core definition or main purpose of **${topicName}**?
- [ ] A) A theoretical concept without practical application.
- [ ] B) An essential foundation that structures key knowledge in this unit.
- [ ] C) A tool used exclusively in advanced research.
- [ ] D) None of the above.

---
#### ❓ Question 2: True or False
Indicate whether the following statement is True (T) or False (F):
> *"The principles of ${topicName} can be applied to solve real-life classroom problems."*
- (   ) True (T)
- (   ) False (F)

---
#### ❓ Question 3: Multiple Choice (Practical Application)
Which of the following is a direct example of applying **${topicName}**?
- [ ] A) Collaborative problem-solving using structured steps.
- [ ] B) Memorizing facts without understanding their meaning.
- [ ] C) Ignoring instructions and procedures.
- [ ] D) Passive reading with no critical reflection.

---
#### ❓ Question 4: Fill in the Blank
Complete the sentence:
> *"The primary goal of learning ${topicName} is to develop ___________ and meaningful skills."*

---
#### ❓ Question 5: Short Answer & Reflection
In your own words, explain why studying **${topicName}** is useful in daily life:
__________________________________________________________________________________
__________________________________________________________________________________

---
#### 🔑 Teacher Answer Key & Rubric
1. **B** | 2. **True (T)** | 3. **A** | 4. **Practical / Interactive** | 5. **Qualitative Evaluation**
`;
    }

    return `### 📝 Quiz Imprimible y Evaluación Formativa (Lectura Fácil)
**Tema:** ${topicName} | **Nombre del Estudiante:** ____________________ | **Grado:** _____

---
#### ❓ Pregunta 1: Selección Múltiple
¿Cuál es la definición o propósito central de **${topicName}**?
- [ ] A) Una teoría sin aplicación práctica en el aula.
- [ ] B) Un concepto fundamental que organiza los saberes de esta unidad.
- [ ] C) Una herramienta exclusiva de investigaciones avanzadas.
- [ ] D) Ninguna de las anteriores.

---
#### ❓ Pregunta 2: Verdadero o Falso
Indica si la siguiente afirmación es Verdadera (V) o Falsa (F):
> *"Los conceptos de ${topicName} se pueden aplicar para resolver problemas reales del entorno escolar."*
- (   ) Verdadero (V)
- (   ) Falso (F)

---
#### ❓ Pregunta 3: Selección Múltiple (Aplicación Práctica)
¿Cuál de los siguientes ejemplos corresponde a la aplicación directa de **${topicName}**?
- [ ] A) Trabajo colaborativo y resolución de problemas por pasos.
- [ ] B) Memorización mecánica de datos sin comprensión.
- [ ] C) Omisión de reglas y pautas didácticas.
- [ ] D) Lectura pasiva sin interpretación crítica.

---
#### ❓ Pregunta 4: Completar la Oración
Completa el espacio en blanco con la palabra adecuada:
> *"El objetivo de aprender ${topicName} es desarrollar habilidades ___________ e inclusivas."*

---
#### ❓ Pregunta 5: Respuesta Corta y Reflexión
Con tus propias palabras, explica por qué es importante aprender sobre **${topicName}**:
__________________________________________________________________________________
__________________________________________________________________________________

---
#### 🔑 Clave de Respuestas (Para el Docente)
1. **Respuesta B** | 2. **Verdadero (V)** | 3. **Respuesta A** | 4. **Prácticas / Significativas** | 5. **Criterio Cualitativo DUA**
`;
  }

  // 3. JUEGOS EN LÍNEA / ACTIVIDADES LÚDICAS
  if (nStr.includes('juego') || nStr.includes('lúdica') || nStr.includes('game') || nStr.includes('kahoot') || nStr.includes('wordwall') || nStr.includes('educaplay')) {
    if (isEnglish) {
      return `### 🎮 Recommended Interactive Educational Games
**Topic:** ${topicName}

---
#### 🕹️ Game 1: Interactive Question Wheel (Wordwall)
- **Platform:** Wordwall
- **Direct Creation Link:** [Create Game on Wordwall](https://wordwall.net)
- **Game Rules:** Students spin the interactive wheel and answer challenge questions on **${topicName}**.

---
#### 🕹️ Game 2: Real-Time Classroom Trivia (Kahoot / Quizizz)
- **Platform:** Kahoot / Quizizz
- **Direct Creation Link:** [Create Quiz on Kahoot](https://kahoot.com)
- **Game Rules:** 5 to 10 timed questions displayed live on screen for individual or group points.

---
#### 🕹️ Game 3: Concept & Definition Memory Match (Educaplay)
- **Platform:** Educaplay
- **Direct Creation Link:** [Create Game on Educaplay](https://www.educaplay.com)
- **Game Rules:** Pair terms related to **${topicName}** with visual icons or short definitions.
`;
    }

    return `### 🎮 Juegos Educativos e Interactivos Recomendados
**Tema:** ${topicName}

---
#### 🕹️ Juego 1: Ruleta Giratoria de Preguntas (Wordwall)
- **Plataforma Recomendada:** Wordwall
- **Enlace de Creación Directa:** [Crear Ruleta en Wordwall](https://wordwall.net/es)
- **Reglas del Juego:** Los estudiantes giran la ruleta digital y responden la pregunta o reto sobre **${topicName}** donde se detenga la flecha.

---
#### 🕹️ Juego 2: Desafío de Trivia en Vivo (Kahoot / Quizizz)
- **Plataforma Recomendada:** Kahoot / Quizizz
- **Enlace de Creación Directa:** [Crear Quiz en Kahoot](https://kahoot.com)
- **Reglas del Juego:** 5 a 10 preguntas con límite de tiempo proyectadas en pantalla para sumar puntos en equipo.

---
#### 🕹️ Juego 3: Parejas de Memoria y Conceptos (Educaplay)
- **Plataforma Recomendada:** Educaplay
- **Enlace de Creación Directa:** [Crear Juego en Educaplay](https://es.educaplay.com)
- **Reglas del Juego:** Emparejar las tarjetas de conceptos de **${topicName}** con su icono o definición en el menor tiempo posible.
`;
  }

  // 4. VIDEOS Y RECURSOS MULTIMEDIA
  if (nStr.includes('video') || nStr.includes('multimedia') || nStr.includes('youtube')) {
    return `### 🎬 Videos Educativos y Recursos Multimedia Recomendados
**Tema:** ${topicName}

---
#### 🎥 Video 1: Explicación Didáctica Animada (3 - 5 min)
- **Título Recomendado:** Introducción sencilla a ${topicName}
- **Búsqueda en YouTube:** [Buscar Video Explicativo](https://www.youtube.com/results?search_query=${encodeURIComponent(topicName + ' explicacion didactica')})
- **Actividad:** Pausa en el minuto 2:00 para resolver 1 pregunta de verificación en el tablero.

---
#### 🎥 Video 2: Ejemplos Prácticos de la Vida Real (4 min)
- **Título Recomendado:** ${topicName} en el mundo real
- **Búsqueda en YouTube:** [Buscar Ejemplos Reales](https://www.youtube.com/results?search_query=${encodeURIComponent(topicName + ' ejemplos cotidianos')})
- **Actividad:** Discusión guiada de 5 minutos en parejas sobre lo observado.
`;
  }

  // 5. TALLERES / GUÍAS DE EJERCICIOS Y PRÁCTICAS
  if (nStr.includes('taller') || nStr.includes('ejercicio') || nStr.includes('worksheet') || nStr.includes('práctica')) {
    return `### 📝 Taller Práctico de Aplicación y Ejercicios
**Tema:** ${topicName} | **Estudiante:** ____________________

---
#### 🔹 Ejercicio 1: Caso Práctico Guiado
Analiza la siguiente situación sobre **${topicName}**:
> *Situación:* Se presenta un problema cotidiano donde es necesario aplicar los conceptos aprendidos hoy.
- **Paso 1:** Identifica el elemento principal del problema.
- **Paso 2:** Escribe 2 pasos clave para resolverlo.

---
#### 🔹 Ejercicio 2: Relación de Términos
Une con una línea cada concepto con su correspondiente aplicación:
1. Concepto A  ---------> (  ) Aplicación práctica en el salón.
2. Concepto B  ---------> (  ) Definición central del tema.
3. Concepto C  ---------> (  ) Resultado final esperado.

---
#### 🔹 Ejercicio 3: Reto de Creación Propia
Diseña tu propio ejemplo práctico de **${topicName}** y compártelo con tu compañero de mesa.
`;
  }

  // 6. DEFAULT: PLAN DE CLASE Y GUÍA DUA COMPLETA
  if (isEnglish) {
    return `### 📘 AI Educational Guide & Lesson Plan
**Topic:** ${topicName}

#### 🎯 Learning Objectives & Key Competencies
- Understand the core concepts, terminology, and practical applications of the topic.
- Promote active participation and critical thinking through structured activities.
- Apply Universal Design for Learning (UDL) principles to ensure accessibility for all students.

#### 📝 Recommended Class Sequence (90 Minutes)
1. **Initial Engagement (15 min):** Interactive warmup and diagnostic question to activate prior knowledge.
2. **Guided Practice (50 min):** Step-by-step conceptual walkthrough, visual graphic organizers, and pair work.
3. **Assessment & Reflection (25 min):** Formative check-for-understanding quiz and differentiated exit ticket.

#### 🤝 Universal Design for Learning (UDL) Adaptations
- **Visual Support:** High-contrast diagrams, mind maps, and bulleted summary cards.
- **Kinesthetic & Interactive:** Hands-on exercises, digital interactive tools, and small group collaboration.
- **Flexible Pacing:** Extended execution time, simplified reading guides, and multi-modal responses.

#### 📊 Formative Assessment Rubric
| Criteria | Excellent (4) | Good (3) | Developing (2) |
| :--- | :--- | :--- | :--- |
| **Concept Understanding** | Demonstrates full mastery & detail | Clear comprehension with minor gaps | Basic recall, needs guidance |
| **Class Engagement** | Active & constructive contributor | Consistent participation | Passive engagement |
| **Adapted Tasks** | Complete UDL adaptation | Satisfactory adaptation | Partial completion |
`;
  }

  return `### 📘 Guía Pedagógica y Plan de Clase DUA
**Tema / Selección:** ${topicName}

#### 🎯 Objetivos de Aprendizaje y Competencias Clave
- Comprender los conceptos fundamentales, la terminología y la aplicación práctica del tema.
- Fomentar la participación activa y el pensamiento crítico mediante actividades guiadas y colaborativas.
- Aplicar principios del Diseño Universal para el Aprendizaje (DUA) garantizando accesibilidad total.

#### 📝 Estructura y Secuencia de Clase (90 Minutos)
1. **Iniciación y Diagnóstico (15 min):** Pregunta activadora y lluvia de ideas con apoyo de recursos gráficos.
2. **Construcción del Conocimiento (50 min):** Explicación dialogada en bloques breves, organizadores conceptuales y trabajo en parejas.
3. **Cierre Formativo y Refuerzo (25 min):** Quiz de comprobación en lectura fácil y ticket de salida diferenciado.

#### 🤝 Adaptaciones DUA e Inclusión Pedagógica
- **Apoyos Visuales:** Fichas en Lectura Fácil, pictogramas secuenciales y mapas mentales.
- **Canal Sensorial y Práctico:** Dinámicas multisensoriales, tareas manipulativas y trabajo entre pares.
- **Flexibilidad Evaluativa:** Tiempos extendidos, instrucciones divididas en micropasos y respuestas orales o gráficas.

#### 📊 Rúbrica de Evaluación Formativa
| Criterio | Sobresaliente (4) | Aceptable (3) | En Proceso (2) |
| :--- | :--- | :--- | :--- |
| **Dominio Conceptual** | Demuestra comprensión profunda | Entendimiento claro con detalles menores | Conceptos básicos con acompañamiento |
| **Participación** | Colabora activamente en la sesión | Participa de manera constante | Actitud pasiva, requiere estimulación |
| **Trabajo Adaptado** | Completa con excelencia la guía DUA | Cumple las metas de adaptación | Entrega parcial con apoyo |
`;
};

const callGeminiAPI = async (userPrompt, systemPrompt, apiKey) => {
  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  const keyToUse = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (keyToUse) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 10) {
          return text;
        }
      }
    } catch (err) {
      console.warn("API de Gemini en vivo no disponible, usando generador inteligente:", err);
    }
  }

  // Generador inteligente garantizado:
  return generateFallbackNotebookAIResponse(userPrompt, systemPrompt);
};

// Intentar parsear JSON desde una respuesta de texto
const tryParseJSON = (rawText) => {
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
};

// ==========================================
// CSS para tablas HTML y botones de enlaces generados por la IA
// ==========================================
const tableStyles = `
  .ai-html-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 12px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .ai-html-content table th {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.05em;
    padding: 12px 14px;
    text-align: left;
    border: 1px solid #4338ca;
  }
  .ai-html-content table td {
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-weight: 500;
    line-height: 1.5;
    vertical-align: top;
  }
  .ai-html-content table tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .ai-html-content table tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  .ai-html-content table tr:hover td {
    background-color: #eef2ff;
    transition: background-color 0.2s;
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
  }
  .ai-html-content h1 { font-size: 18px; }
  .ai-html-content h2 { font-size: 15px; }
  .ai-html-content h3 { font-size: 13px; }
  .ai-html-content p { margin-bottom: 8px; line-height: 1.6; }
  .ai-html-content ul, .ai-html-content ol {
    padding-left: 20px;
    margin: 8px 0;
  }
  .ai-html-content li {
    margin-bottom: 4px;
    line-height: 1.5;
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
const PlataformasJuegosBar = ({ onLaunchGame }) => {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-lg my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">Plataformas de Juegos Educativos</h4>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">EDUDOCENT PLAY</span>
      </div>
      <p className="text-xs text-slate-300 font-medium">Haz clic en cualquier plataforma para abrirla directamente en una pestaña nueva e iniciar sesión sin problemas:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {plataformasJuegos.map((plat) => (
          <a
            key={plat.name}
            href={plat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/80 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/60 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-3 group no-underline"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{plat.icon}</span>
            <div className="min-w-0 flex-1">
              <h5 className="font-extrabold text-xs text-white truncate">{plat.name}</h5>
              <p className="text-[9px] text-slate-400 group-hover:text-emerald-300 truncate transition-colors">Abrir ↗</p>
            </div>
          </a>
        ))}
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
// COMPONENTE: Tarjetas de Resultado IA Seccionadas con Pestañas Internas
// ==========================================
const ResultadoIACards = ({ resultado, onReset, onClose, showToast, onLaunchGame, defaultSection = 'todos', customTipo }) => {
  const [activeSection, setActiveSection] = useState(defaultSection);

  if (!resultado) return null;
  const docTitle = resultado.titulo_periodo || resultado.titulo_plan || resultado.titulo || "Plan_13_Clases_EDUDOCENT";

  const handleDownloadPPT = () => {
    try {
      let pres = new pptxgen();
      pres.author = 'EDUDOCENT AI';
      pres.company = 'EDUDOCENT';
      pres.title = docTitle;
      pres.layout = 'LAYOUT_16x9';

      const htmlContent = resultado.ideas_presentacion || resultado.estructura_presentacion || resultado.contenido_principal || resultado.plan_13_clases || "";
      
      // Separar por la etiqueta [DIAPOSITIVA
      const slides = htmlContent.split(/\[DIAPOSITIVA\s*\d*\]/i).filter(s => s.trim().length > 0);
      
      if (slides.length === 0 || !htmlContent.includes('[TITULO]')) {
        // Fallback genérico para contenido que no es presentación nativa
        let slide = pres.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addText(docTitle, { x: 0.5, y: 0.5, w: '90%', h: 1.0, fontSize: 32, bold: true, color: "0F172A", align: "center" });
        
        let textClean = htmlContent.replace(/<br\s*[\/]?>/gi, '\n')
                                   .replace(/<\/p>|<\/div>|<\/li>|<\/tr>/gi, '\n')
                                   .replace(/<[^>]*>?/gm, ''); 

        const chunks = textClean.match(/[\s\S]{1,1000}/g) || [textClean];
        chunks.forEach((chunk, index) => {
           let contentSlide = (index === 0) ? slide : pres.addSlide();
           if(index !== 0) contentSlide.background = { color: "FFFFFF" };
           contentSlide.addText(chunk.trim(), { 
             x: 0.5, y: (index === 0) ? 1.8 : 0.5, w: '90%', h: (index === 0) ? 3.5 : 4.8, 
             fontSize: 16, color: "334155", valign: 'top', align: 'left'
           });
        });
      } else {
        slides.forEach((slideData) => {
          let slide = pres.addSlide();
          slide.background = { color: "FFFFFF" };
          
          let textClean = slideData.replace(/<[^>]*>?/gm, ''); // Quitar HTML si lo hay
          
          let titleMatch = textClean.match(/\[TITULO\]([\s\S]*?)\[CONTENIDO\]/i);
          let contentMatch = textClean.match(/\[CONTENIDO\]([\s\S]*)/i);
          
          let titleText = titleMatch ? titleMatch[1].trim() : "Diapositiva";
          let contentText = contentMatch ? contentMatch[1].trim() : textClean.substring(0, 800);

          // Título de la diapositiva
          slide.addText(titleText, { 
            x: 0.5, y: 0.4, w: '90%', h: 0.8, 
            fontSize: 28, bold: true, color: "0D9488" 
          });
          
          // Línea separadora
          slide.addShape(pres.ShapeType.line, { x: 0.5, y: 1.3, w: '90%', h: 0, line: { color: "E2E8F0", width: 2 } });

          // Contenido de la diapositiva
          slide.addText(contentText, { 
            x: 0.5, y: 1.6, w: '90%', h: 3.2, 
            fontSize: 18, color: "334155", valign: 'top' 
          });
          
          // Footer
          slide.addText('EDUDOCENT AI', { x: 0.5, y: 5.2, w: '30%', h: 0.3, fontSize: 10, color: "94A3B8" });
        });
      }

      const fileName = `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
      pres.writeFile({ fileName: fileName }).then(() => {
        if(showToast) showToast('Éxito', 'Presentación PowerPoint descargada correctamente', 'success');
      });
    } catch (error) {
      console.error("Error generating PPTX:", error);
      if(showToast) showToast('Error', 'No se pudo generar el PowerPoint', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-pageIn">
      <style>{tableStyles}</style>

      {/* Bar de Encabezado y Descarga */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/40">
          ✅ 13 Clases Independientes + Diapositivas Generadas
        </span>
        {((customTipo && customTipo === 'Video Explicativo') || docTitle.toLowerCase().includes('video')) ? (
          <button
            onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(docTitle + " tema educativo")}`, '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-0"
          >
            <PlayCircle size={15} />
            ▶ Buscar Video en YouTube
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
            >
              <FileText size={14} />
              📄 Word
            </button>
            <button
              onClick={handleDownloadPPT}
              className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
            >
              <Presentation size={14} />
              📊 PPT
            </button>
          </div>
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
            📅 13 Clases Semanales
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
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-300">Título General del Periodo</span>
          </div>
          <p className="text-sm font-black text-slate-800 dark:text-white leading-snug">{resultado.titulo_periodo || resultado.titulo_plan || resultado.titulo}</p>
        </div>
      )}

      {/* RENDERIZADO DEL ARREGLO clases_semanales (13 Temas Sueltos en Tabla HTML) */}
      {Array.isArray(resultado.clases_semanales) && resultado.clases_semanales.length > 0 && (activeSection === 'todos' || activeSection === 'principal') && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pageIn space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Plan de 13 Clases Semanales (13 Temas Sueltos Desglosados)</span>
            </div>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="text-[10px] font-bold text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800/40"
            >
              📄 Guardar en Word
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse my-2 text-xs">
              <thead>
                <tr className="bg-indigo-600 dark:bg-indigo-700 text-white font-black">
                  <th className="p-3 border border-indigo-700 dark:border-indigo-600 w-20 text-center">Semana</th>
                  <th className="p-3 border border-indigo-700 dark:border-indigo-600 w-1/3">Tema Específico</th>
                  <th className="p-3 border border-indigo-700 dark:border-indigo-600">Guía de Explicación (Voz Alta para Alumnos)</th>
                </tr>
              </thead>
              <tbody>
                {resultado.clases_semanales.map((c, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/60'}>
                    <td className="p-3 border border-slate-200 dark:border-slate-800 font-black text-center text-indigo-600 dark:text-indigo-400">
                      Semana {c.semana || idx + 1}
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                      {c.tema_suelto}
                    </td>
                    <td className="p-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {c.detalle_explicacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fallback para plan_13_clases si se envía como HTML raw */}
      {resultado.plan_13_clases && !resultado.clases_semanales && (activeSection === 'todos' || activeSection === 'principal') && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pageIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Plan de 13 Clases Independientes</span>
            </div>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
            >
              📄 Guardar en Word
            </button>
          </div>
          <div
            className="ai-html-content text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.plan_13_clases) }}
          />
        </div>
      )}

      {/* Tarjeta ideas_presentacion / estructura_presentacion (Diapositivas PowerPoint/Canva) */}
      {(resultado.ideas_presentacion || resultado.estructura_presentacion) && (activeSection === 'todos' || activeSection === 'presentacion') && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-850 dark:to-amber-950/40 p-5 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm animate-pageIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Presentation size={18} className="text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300">Esquema para Presentación / Diapositivas (PowerPoint / Canva)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">DIAPOSITIVAS READY</span>
              <button
                onClick={handleDownloadPPT}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
              >
                <Download size={12} />
                DESCARGAR PPTX
              </button>
            </div>
          </div>
          <div
            className="ai-html-content text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium overflow-x-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.ideas_presentacion || resultado.estructura_presentacion) }}
          />
        </div>
      )}

      {/* Tarjeta Contenido Principal (Fallback) */}
      {resultado.contenido_principal && !resultado.plan_13_clases && (activeSection === 'todos' || activeSection === 'principal') && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pageIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Contenido Principal / Quiz / Tabla</span>
            </div>
            {((customTipo && customTipo === 'Video Explicativo') || docTitle.toLowerCase().includes('video')) ? (
              <button
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(docTitle + " tema educativo")}`, '_blank')}
                className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
              >
                ▶ Buscar Video
              </button>
            ) : (
              <button
                onClick={() => exportToWord(docTitle, resultado, showToast)}
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                📄 Guardar en Word
              </button>
            )}
          </div>
          <div
            className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.contenido_principal) }}
          />
        </div>
      )}

      {/* Tarjeta Recursos Online y Canal de Juegos */}
      {resultado.recursos_online && (activeSection === 'todos' || activeSection === 'juegos') && (
        <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100/60 space-y-3 animate-pageIn">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-sky-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Recursos Online y Juegos Interactivos</span>
          </div>
          <div
            className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.recursos_online) }}
          />
          <PlataformasJuegosBar onLaunchGame={onLaunchGame} />
        </div>
      )}

      {/* Tarjeta Adaptación Inclusiva */}
      {resultado.adaptacion_inclusiva && (activeSection === 'todos' || activeSection === 'inclusivo') && (
        <div className="bg-violet-50/50 p-5 rounded-2xl border border-violet-100/60 animate-pageIn">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-violet-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Adaptación Inclusiva (PIAR / DUA)</span>
          </div>
          <div
            className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.adaptacion_inclusiva) }}
          />
        </div>
      )}

      {/* Tarjeta 5: Guía Docente */}
      {resultado.guia_docente && (activeSection === 'todos' || activeSection === 'guia') && (
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60 animate-pageIn">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap size={16} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Guía para el Docente</span>
          </div>
          <div
            className="ai-html-content text-xs text-slate-700 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(resultado.guia_docente) }}
          />
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
        {((customTipo && customTipo === 'Video Explicativo') || docTitle.toLowerCase().includes('video')) ? (
          <button
            onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(docTitle + " tema educativo")}`, '_blank')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
          >
            <PlayCircle size={16} />
            Buscar Video en YouTube
          </button>
        ) : (
          <>
            <button
              onClick={() => exportToWord(docTitle, resultado, showToast)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
            >
              <FileText size={15} />
              Descargar Word (.doc)
            </button>
            <button
              onClick={handleDownloadPPT}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 border-0"
            >
              <Presentation size={15} />
              Descargar PPT
            </button>
          </>
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

const formatMarkdownToHTML = (text) => {
  if (!text) return '';
  if (text.trim().startsWith('<') && text.includes('</')) {
    return text;
  }

  let html = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 15px; font-weight: 800; color: #4338ca; margin: 18px 0 10px 0; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px;">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 14px 0 6px 0;">$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #6366f1; background-color: #f8fafc; padding: 10px 14px; margin: 12px 0; border-radius: 0 10px 10px 0; font-style: italic; color: #334155;">$1</blockquote>')
    .replace(/^- (.*$)/gim, '<li style="margin: 4px 0 4px 18px; list-style-type: disc; color: #334155;">$1</li>')
    .replace(/\[ \]/g, '<span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 4px; vertical-align: middle; margin-right: 6px;"></span>')
    .replace(/\(   \)/g, '<span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 50%; vertical-align: middle; margin-right: 6px;"></span>')
    .replace(/\n\n/g, '<div style="height: 12px;"></div>')
    .replace(/\n/g, '<br/>');

  return html;
};

// Fallback de texto libre
const ResultadoTextoLibre = ({ texto, onReset, onClose, showToast, customTipo }) => {
  const isVideo = customTipo === 'Video Explicativo';
  
  return (
    <div className="space-y-4 animate-pageIn">
      <style>{tableStyles}</style>
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
        <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          ✅ Contenido Generado
        </span>
        {isVideo ? (
          <button
            onClick={() => window.open(`https://www.youtube.com/results?search_query=Video Educativo`, '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer border-0"
          >
            <PlayCircle size={15} />
            ▶ Buscar Video en YouTube
          </button>
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
          <button onClick={() => window.open(`https://www.youtube.com/results?search_query=Video Educativo`, '_blank')} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase flex justify-center items-center gap-1.5 border-0"><PlayCircle size={16} /> Buscar Video</button>
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
    const temaEspecifico = recurso?.titulo || recurso?.tema || 'Tema del Periodo';
    const textoTextarea = instruccionesExtra || `Generar ${necesidad} específico sobre el tema: "${temaEspecifico}"`;

    let promptFinal = `Materia: ${materiaActual} | Grado: ${gradoSeleccionado} | Periodo: ${periodoSeleccionado} | Necesidad: ${necesidad} | Tema Específico: ${temaEspecifico} | Instrucciones: ${textoTextarea}`;

    if (documentoBaseTexto) {
      promptFinal += ` | DOCUMENTO BASE PROPORCIONADO POR EL DOCENTE: (BASA TU RESPUESTA ESTRICTAMENTE EN ESTE DOCUMENTO)
---------------------
${documentoBaseTexto}
---------------------`;
    }

    try {
      const baseSystemPrompt = getSystemPromptForResource(necesidad);
      const isEnglishSubject = materiaActual.toLowerCase().includes('inglés') || materiaActual.toLowerCase().includes('english');
      const languageRule = isEnglishSubject
        ? "\nCRITICAL REQUIREMENT: YOU MUST GENERATE ALL THE CONTENT STRICTLY IN ENGLISH LANGUAGE, AS THIS IS AN ENGLISH CLASS. DO NOT USE SPANISH."
        : (t.tabTopics === "TOPICS" ? "\nCRITICAL REQUIREMENT: GENERATE ALL CONTENT STRICTLY IN ENGLISH LANGUAGE." : "");
      
      const targetSystemPrompt = baseSystemPrompt + languageRule;

      const rawText = await callGeminiAPI(promptFinal, targetSystemPrompt, apiKey);
      if (!rawText) {
        setError('La IA no devolvió una respuesta. Verifica tu conexión e intenta de nuevo.');
        setIsLoading(false);
        return;
      }

      const parsed = tryParseJSON(rawText);
      if (parsed) {
        setContenido(parsed);
      } else {
        setContenido({ _texto_libre: rawText });
      }
    } catch {
      setError('Error de conexión con el servidor de IA. Verifica tu red e intenta nuevamente.');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setContenido(null);
    setError('');
    setInstruccionesExtra('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-pageIn">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-rose-50 to-orange-50 shrink-0">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

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
                      onClick={() => setInstruccionesExtra("Recomienda y genera enlaces a juegos interactivos en línea (Wordwall, Kahoot, Educaplay, PhET) para este tema.")}
                      className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
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
        setError('La IA no devolvió una respuesta. Verifica tu conexión e intenta de nuevo.');
        setIsLoading(false);
        return;
      }

      const parsed = tryParseJSON(rawText);
      if (parsed) {
        setResultado(parsed);
      } else {
        setResultado({ _texto_libre: rawText });
      }
    } catch {
      setError('Error de conexión con el servidor de IA. Verifica tu red e intenta nuevamente.');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setResultado(null);
    setError('');
    setNecesidad('dua_general');
    setInstruccionesExtra('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-pageIn">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">

        {/* Header del Modal */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50 shrink-0">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

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
                accept=".txt,.csv,.md" 
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
          <PlataformasJuegosBar onLaunchGame={handleLaunchGame} />
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
                          <button
                            onClick={() => handleOpenPlanModal('Video Explicativo', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all cursor-pointer border border-red-100 dark:border-red-800/40 active:scale-95"
                          >
                            <span className="text-sm">🎬</span> {t.genVideo}
                          </button>
                        )}
                        {selectedType === 'juegos' && (
                          <button
                            onClick={() => handleOpenPlanModal('Juego Interactivo Listo', item)}
                            className="flex items-center gap-2 p-3.5 rounded-2xl text-xs font-black bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all cursor-pointer border border-sky-100 dark:border-sky-800/40 active:scale-95"
                          >
                            <span className="text-sm">🎮</span> {t.genGame}
                          </button>
                        )}
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
