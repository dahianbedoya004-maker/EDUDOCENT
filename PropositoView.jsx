import React from 'react';

const translations = {
  es: {
    title: "🎯 Nuestro Propósito: Protegiendo al Docente",
    subtitle: "EDUDOCENT nace para reducir la carga operativa y proteger la salud emocional de los profesores, brindando herramientas de Inteligencia Artificial listas para usar en el aula inclusiva.",
    privateTitle: "🏫 Contexto: Sector Privado",
    privatePoint1: "El colegio Adventista Norte (privado, n=13) muestra una concentración exclusiva en niveles medio y alto de bienestar.",
    privatePoint2: "Los docentes con 11 a 20 años de experiencia presentan un índice de bienestar alto, con un promedio de M = 4.38.",
    publicTitle: "🏛️ Contexto: Sector Público",
    publicPoint1: "El colegio Nestor Forero (público, n=13) presenta dispersión hacia niveles de bienestar bajo.",
    publicPoint2: "Los docentes con 11 a 20 años de experiencia en el sector público presentan un índice menor (M = 4.02) frente a sus pares en el sector privado (M = 4.38).",
    conclusionTitle: "💡 ¿Por qué es vital EDUDOCENT?",
    conclusionText: "La evidencia demuestra que los profesores del sector público y con mayor trayectoria enfrentan mayores riesgos de desgaste emocional. EDUDOCENT ofrece soluciones automatizadas con IA para democratizar el acceso a recursos pedagógicos de alta calidad y aliviar la carga laboral de todos los educadores."
  },
  en: {
    title: "🎯 Our Purpose: Protecting the Teacher",
    subtitle: "EDUDOCENT was created to reduce the operational burden and protect the emotional health of teachers, providing ready-to-use Artificial Intelligence tools for the inclusive classroom.",
    privateTitle: "🏫 Context: Private Sector",
    privatePoint1: "The Adventista Norte school (private, n=13) shows an exclusive concentration in medium and high levels of well-being.",
    privatePoint2: "Teachers with 11 to 20 years of experience have a high well-being index, with an average of M = 4.38.",
    publicTitle: "🏛️ Context: Public Sector",
    publicPoint1: "The Nestor Forero school (public, n=13) presents dispersion towards low well-being levels.",
    publicPoint2: "Teachers with 11 to 20 years of experience in the public sector present a lower index (M = 4.02) compared to their peers in the private sector (M = 4.38).",
    conclusionTitle: "💡 Why is EDUDOCENT vital?",
    conclusionText: "Evidence shows that public sector teachers and those with more experience face greater risks of emotional burnout. EDUDOCENT offers automated AI solutions to democratize access to high-quality pedagogical resources and ease the workload for all educators."
  }
};

const PropositoView = ({ language = 'es' }) => {
  const t = translations[language] || translations.es;

  return (
    <>
      <style>{`
        .edudocent-impacto-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            padding: 40px 24px;
            max-width: 1000px;
            margin: 0 auto;
            color: #1e293b;
            border-radius: 2rem;
            transition: all 0.3s ease;
        }

        .dark .edudocent-impacto-container {
            background-color: #0f172a;
            color: #f8fafc;
        }

        .impacto-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .impacto-header h1 {
            font-size: 2.2rem;
            font-weight: 900;
            color: #4f46e5;
            margin-bottom: 12px;
            line-height: 1.2;
        }

        .dark .impacto-header h1 {
            color: #818cf8;
        }

        .impacto-header p {
            font-size: 1.1rem;
            color: #475569 !important;
            max-width: 750px;
            margin: 0 auto;
            line-height: 1.6;
            font-weight: 500;
        }

        .dark .impacto-header p {
            color: #cbd5e1 !important;
        }

        .data-cards-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }

        .data-card {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            border-top: 6px solid #4f46e5;
            border-left: 1px solid #f1f5f9;
            border-right: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
            transition: all 0.3s ease;
        }

        .dark .data-card {
            background-color: #1e293b;
            border-left: 1px solid #334155;
            border-right: 1px solid #334155;
            border-bottom: 1px solid #334155;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .data-card.privado {
            border-top-color: #10b981;
        }

        .data-card.publico {
            border-top-color: #f59e0b;
        }

        .data-card h3 {
            font-size: 1.3rem;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #0f172a !important;
        }

        .dark .data-card h3 {
            color: #ffffff !important;
        }

        .data-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .data-list li {
            margin-bottom: 14px;
            line-height: 1.6;
            font-size: 0.95rem;
            position: relative;
            padding-left: 22px;
            color: #334155 !important;
            font-weight: 500;
        }

        .dark .data-list li {
            color: #e2e8f0 !important;
        }

        .data-list li::before {
            content: "•";
            color: #4f46e5;
            font-weight: 900;
            position: absolute;
            left: 0;
            font-size: 1.4rem;
            line-height: 1;
        }

        .data-card.privado .data-list li::before {
            color: #10b981;
        }

        .data-card.publico .data-list li::before {
            color: #f59e0b;
        }

        .conclusion-box {
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            color: #ffffff !important;
            border-radius: 24px;
            padding: 36px 28px;
            text-align: center;
            box-shadow: 0 12px 25px -4px rgba(79, 70, 229, 0.35);
        }

        .conclusion-box h2 {
            margin-top: 0;
            font-size: 1.6rem;
            font-weight: 900;
            color: #ffffff !important;
            margin-bottom: 12px;
        }

        .conclusion-box p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 0;
            color: #f8fafc !important;
            opacity: 0.95;
            font-weight: 500;
        }
      `}</style>

      <div className="edudocent-impacto-container">
        <div className="impacto-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="data-cards-wrapper">
          {/* Tarjeta Sector Privado */}
          <div className="data-card privado">
            <h3>{t.privateTitle}</h3>
            <ul className="data-list">
              <li>{t.privatePoint1}</li>
              <li>{t.privatePoint2}</li>
            </ul>
          </div>

          {/* Tarjeta Sector Público */}
          <div className="data-card publico">
            <h3>{t.publicTitle}</h3>
            <ul className="data-list">
              <li>{t.publicPoint1}</li>
              <li>{t.publicPoint2}</li>
            </ul>
          </div>
        </div>

        {/* Caja de Conclusión / Justificación */}
        <div className="conclusion-box">
          <h2>{t.conclusionTitle}</h2>
          <p>{t.conclusionText}</p>
        </div>
      </div>
    </>
  );
};

export default PropositoView;
