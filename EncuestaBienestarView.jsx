// ==========================================
// EDUDOCENT — ENCUESTA DE BIENESTAR DOCENTE
// Vista independiente (Blank Layout 100vw, 100vh) sin Sidebar.
// Diagnóstico de salud emocional y sobrecarga docente por pasos.
// ==========================================

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LogOut, Heart, CheckCircle2, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';

// Logotipo de EDUDOCENT
const AppLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 200 200" className={`${className} drop-shadow-md select-none`}>
    <g stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" className="origin-center">
      <line x1="100" y1="20" x2="100" y2="35" />
      <line x1="43" y1="43" x2="54" y2="54" />
      <line x1="20" y1="100" x2="35" y2="100" />
      <line x1="43" y1="157" x2="54" y2="146" />
      <line x1="157" y1="43" x2="146" y2="54" />
      <line x1="180" y1="100" x2="165" y2="100" />
      <line x1="157" y1="157" x2="146" y2="146" />
    </g>
    <path
      d="M60,100 C60,60 140,60 140,100 C140,120 125,130 120,140 L80,140 C75,130 60,120 60,100 Z"
      fill="#fffbeb"
      stroke="#1e3a8a"
      strokeWidth="10"
      strokeLinejoin="round"
    />
    <path
      d="M100,118 C100,118 78,98 78,85 C78,75 86,68 95,68 C100,68 100,75 100,75 C100,75 100,68 105,68 C114,68 122,75 122,85 C122,98 100,118 100,118 Z"
      fill="#f59e0b"
    />
    <g transform="translate(0, 10)">
      <rect x="80" y="130" width="40" height="15" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="8" strokeLinejoin="round" />
      <polygon points="80,145 120,145 100,175" fill="#fef08a" stroke="#1e3a8a" strokeWidth="8" strokeLinejoin="round" />
      <polygon points="94,165 106,165 100,175" fill="#1e3a8a" />
    </g>
  </svg>
);

const translations = {
  es: {
    headerTag: "Bienestar Docente",
    headerSubtitle: "Diagnóstico de Salud Emocional & Carga Laboral",
    exitSurvey: "Salir de la encuesta",
    step: "Paso",
    of: "de",
    completed: "Completado",
    question: "Pregunta",
    selectAnswer: "Selecciona una respuesta en la escala de 1 a 5:",
    prevBtn: "Anterior",
    nextBtn: "Siguiente",
    finishBtn: "Finalizar Encuesta",
    surveyFinished: "✅ Encuesta Finalizada",
    resultTitle: "Resultado de tu Diagnóstico de Bienestar",
    resultDesc: "Tu salud emocional y equilibrio laboral son fundamentales para transformar el aula.",
    indexLabel: "Índice de Carga Emocional Evaluada",
    scoreHigh: "Nivel de sobrecarga elevado. Te recomendamos apoyarte en las herramientas de IA y descansos estructurados.",
    scoreMedium: "Nivel de carga moderado. Mantienes un equilibrio aceptable, aprovecha la automatización de planeaciones.",
    scoreLow: "¡Excelente equilibrio emocional y laboral! Mantén tus hábitos de autocuidado.",
    recommendationLabel: "Recomendación EDUDOCENT:",
    rec1: "Utiliza el **Organizador con IA** para reducir el tiempo de planeación administrativa.",
    rec2: "Consulta el **Centro de Apoyo Inclusivo** para aplicar estrategias de descanso sensorial en el aula.",
    rec3: "Mantén tu racha de autocuidado y pausas activas durante la jornada.",
    repeatBtn: "Repetir",
    backHomeBtn: "Volver al Inicio",
    footer: "EDUDOCENT © {year} — Plataforma Inteligente de Apoyo y Bienestar Docente",
    toastSelect: "Selecciona una opción para continuar",
    toastFinished: "¡Encuesta de Bienestar completada!",
    preguntas: [
      {
        id: 1,
        pregunta: "¿Al finalizar la jornada me siento agotado(a) emocionalmente?",
        subtitulo: "Evalúa la fatiga acumulada al concluir el trabajo lectivo e institucional del día.",
        icon: "🧘‍♂️"
      },
      {
        id: 2,
        pregunta: "¿Dispongo de tiempo suficiente para mi vida personal y descanso fuera de la labor docente?",
        subtitulo: "Reflexiona sobre el equilibrio entre la preparación de clases en casa y tu tiempo libre.",
        icon: "⏰"
      },
      {
        id: 3,
        pregunta: "¿Siento que la sobrecarga de tareas administrativas interfiere con mi vocación pedagógica?",
        subtitulo: "Evalúa el impacto del diligenciamiento de planillas, informes y actas en tu energía diaria.",
        icon: "📋"
      },
      {
        id: 4,
        pregunta: "¿Cuento con espacios de empatía y apoyo emocional en mi comunidad educativa / colegas?",
        subtitulo: "Reflexiona sobre la contención afectiva y el trabajo colaborativo en tu institución.",
        icon: "🤝"
      }
    ],
    escala: [
      { val: 1, label: "1 — Nunca / Muy Rara Vez", emoji: "🟢", desc: "No experimento este síntoma en mi rutina." },
      { val: 2, label: "2 — Rara Vez", emoji: "🌱", desc: "Ocurre ocasionalmente en momentos pico." },
      { val: 3, label: "3 — A Veces", emoji: "🟡", desc: "Frecuencia moderada durante la semana." },
      { val: 4, label: "4 — Frecuentemente", emoji: "🟠", desc: "Se presenta de manera recurrente en el periodo." },
      { val: 5, label: "5 — Casi Siempre / Diariamente", emoji: "🔴", desc: "Impacto constante en mi bienestar cotidiano." }
    ]
  },
  en: {
    headerTag: "Teacher Well-being",
    headerSubtitle: "Emotional Health & Workload Diagnostics",
    exitSurvey: "Exit Survey",
    step: "Step",
    of: "of",
    completed: "Completed",
    question: "Question",
    selectAnswer: "Select an answer on a scale from 1 to 5:",
    prevBtn: "Previous",
    nextBtn: "Next",
    finishBtn: "Finish Survey",
    surveyFinished: "✅ Survey Finished",
    resultTitle: "Your Well-being Diagnostic Result",
    resultDesc: "Your emotional health and work-life balance are key to transforming the classroom.",
    indexLabel: "Assessed Emotional Load Index",
    scoreHigh: "High overload level. We recommend relying on AI tools and structured rest breaks.",
    scoreMedium: "Moderate load level. You maintain an acceptable balance, take advantage of planning automation.",
    scoreLow: "Excellent emotional and work balance! Keep up your self-care habits.",
    recommendationLabel: "EDUDOCENT Recommendation:",
    rec1: "Use the **AI Organizer** to reduce administrative planning time.",
    rec2: "Check the **Inclusive Support Center** to apply sensory break strategies in the classroom.",
    rec3: "Keep up your self-care streak and active breaks during the day.",
    repeatBtn: "Repeat",
    backHomeBtn: "Back to Home",
    footer: "EDUDOCENT © {year} — Intelligent Platform for Teacher Support and Well-being",
    toastSelect: "Select an option to continue",
    toastFinished: "Well-being survey completed!",
    preguntas: [
      {
        id: 1,
        pregunta: "At the end of the day, do I feel emotionally exhausted?",
        subtitulo: "Evaluate the accumulated fatigue at the end of the teaching and institutional work of the day.",
        icon: "🧘‍♂️"
      },
      {
        id: 2,
        pregunta: "Do I have enough time for my personal life and rest outside of teaching?",
        subtitulo: "Reflect on the balance between preparing classes at home and your free time.",
        icon: "⏰"
      },
      {
        id: 3,
        pregunta: "Do I feel that the overload of administrative tasks interferes with my pedagogical vocation?",
        subtitulo: "Evaluate the impact of filling out spreadsheets, reports, and minutes on your daily energy.",
        icon: "📋"
      },
      {
        id: 4,
        pregunta: "Do I have spaces for empathy and emotional support in my educational community / colleagues?",
        subtitulo: "Reflect on affective containment and collaborative work in your institution.",
        icon: "🤝"
      }
    ],
    escala: [
      { val: 1, label: "1 — Never / Very Rarely", emoji: "🟢", desc: "I do not experience this symptom in my routine." },
      { val: 2, label: "2 — Rarely", emoji: "🌱", desc: "Occurs occasionally during peak times." },
      { val: 3, label: "3 — Sometimes", emoji: "🟡", desc: "Moderate frequency during the week." },
      { val: 4, label: "4 — Frequently", emoji: "🟠", desc: "It presents itself repeatedly during the period." },
      { val: 5, label: "5 — Almost Always / Daily", emoji: "🔴", desc: "Constant impact on my daily well-being." }
    ]
  }
};

const EncuestaBienestarView = ({ setView, showToast, language = 'es' }) => {
  const t = translations[language] || translations.es;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = t.preguntas.length;

  const handleSelectOption = (preguntaId, val) => {
    setAnswers(prev => ({ ...prev, [preguntaId]: val }));
  };

  const handleNext = () => {
    if (!answers[currentStep]) {
      if (showToast) showToast(t.toastSelect, "warning");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      if (showToast) showToast(t.toastFinished, "success");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(1);
    setIsCompleted(false);
  };

  // Cálculo de diagnóstico general
  const calculateScore = () => {
    const values = Object.values(answers);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / (totalSteps * 5)) * 100);
  };

  const scorePercentage = calculateScore();

  return (
    <div className="fixed inset-0 z-[500] w-screen min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between overflow-y-auto animate-pageIn">

      {/* ================= ============================
          ENCABEZADO MINIMALISTA (100% Ancho)
          ============================================ */}
      <header className="w-full px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <AppLogo className="w-9 h-9" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base text-slate-900 leading-none">EDUDOCENT</h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                {t.headerTag}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{t.headerSubtitle}</p>
          </div>
        </div>

        <button
          onClick={() => setView('welcome')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all active:scale-95 cursor-pointer border border-slate-200/60"
        >
          <LogOut size={15} />
          <span>{t.exitSurvey}</span>
        </button>
      </header>

      {/* ================= ============================
          CUERPO PRINCIPAL DE LA ENCUESTA (Centered Card)
          ============================================ */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl w-full mx-auto">

        {!isCompleted ? (
          <div className="w-full space-y-6 animate-pageIn">

            {/* BARRA DE PROGRESO Y PASOS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                <span>{t.step} {currentStep} {t.of} {totalSteps}</span>
                <span className="text-rose-500">{Math.round((currentStep / totalSteps) * 100)}% {t.completed}</span>
              </div>
              <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* TARJETA DE PREGUNTA */}
            {t.preguntas.map((preg) => {
              if (preg.id !== currentStep) return null;
              return (
                <div
                  key={preg.id}
                  className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 animate-pageIn"
                >
                  {/* Título de la pregunta */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-rose-50 p-2.5 rounded-2xl border border-rose-100/60 shrink-0">
                        {preg.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">
                          {t.question} {preg.id}
                        </span>
                        <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                          {preg.pregunta}
                        </h2>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium ml-12">
                      {preg.subtitulo}
                    </p>
                  </div>

                  {/* Escala de opciones (1 a 5) */}
                  <div className="space-y-2.5 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-1">
                      {t.selectAnswer}
                    </label>
                    <div className="space-y-2">
                      {t.escala.map((op) => {
                        const isSelected = answers[preg.id] === op.val;
                        return (
                          <button
                            key={op.val}
                            type="button"
                            onClick={() => handleSelectOption(preg.id, op.val)}
                            className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-rose-500 bg-rose-50/60 text-slate-900 shadow-md font-bold scale-[1.01]'
                                : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{op.emoji}</span>
                              <div>
                                <h3 className="text-xs sm:text-sm font-black">{op.label}</h3>
                                <p className="text-[11px] text-slate-400 font-medium">{op.desc}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* NAVEGACIÓN ENTRE PASOS */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl font-black text-xs transition-all ${
                        currentStep === 1
                          ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer active:scale-95'
                      }`}
                    >
                      <ChevronLeft size={16} /> {t.prevBtn}
                    </button>

                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-200 transition-all active:scale-95 cursor-pointer border-0"
                    >
                      <span>{currentStep === totalSteps ? t.finishBtn : t.nextBtn}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================
             RESULTADO FINAL / DIAGNÓSTICO DE BIENESTAR
             ============================================ */
          <div className="w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6 text-center animate-pageIn">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-rose-100">
              ❤️
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                {t.surveyFinished}
              </span>
              <h2 className="text-2xl font-black text-slate-900">{t.resultTitle}</h2>
              <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
                {t.resultDesc}
              </p>
            </div>

            {/* Score Metric */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 max-w-md mx-auto space-y-3">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">{t.indexLabel}</span>
              <div className="text-4xl font-black text-rose-600">{scorePercentage}%</div>
              <p className="text-xs text-slate-600 font-semibold">
                {scorePercentage > 70 
                  ? t.scoreHigh
                  : scorePercentage > 40
                    ? t.scoreMedium
                    : t.scoreLow}
              </p>
            </div>

            {/* Recomendaciones */}
            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/60 text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-indigo-700 font-black text-xs">
                <Sparkles size={16} /> {t.recommendationLabel}
              </div>
              <ul className="text-xs text-slate-700 font-medium space-y-1.5 list-disc pl-5">
                <li>{t.rec1}</li>
                <li>{t.rec2}</li>
                <li>{t.rec3}</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-0"
              >
                <RefreshCw size={14} /> {t.repeatBtn}
              </button>
              <button
                onClick={() => setView('welcome')}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-lg shadow-rose-200 border-0"
              >
                {t.backHomeBtn}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER DISCRETO */}
      <footer className="py-4 text-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 bg-white">
        {t.footer.replace('{year}', new Date().getFullYear().toString())}
      </footer>
    </div>
  );
};

export default EncuestaBienestarView;
