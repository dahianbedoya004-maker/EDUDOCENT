import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Mail, Instagram, Cloud, Facebook, User, BookOpen, MessageSquare,
  ChevronLeft, Send, Plus, Compass, Home, LogOut, FileText, Gamepad2,
  Calendar, FileSpreadsheet, Save, Loader2, Upload, Video, ClipboardList,
  List, Puzzle, FilePlus, Sparkles, CalendarPlus, BellRing, ShieldCheck,
  Search, CheckCircle2, AlertCircle, Trash2, Clock, ChevronRight, GraduationCap,
  Download, Eye, EyeOff, BrainCircuit, Settings, Palette, Flame, Smile, Image, Award, Gem, Globe,
  Heart, Lightbulb, Users, ArrowRight, ArrowLeft, PlayCircle, Paperclip, Bot, Wand2, CalendarCheck, Menu, X,
  Camera, Mic, MicOff, Lock
} from 'lucide-react';
import NotebookView from './NotebookView.jsx';
import PropositoView from './PropositoView.jsx';
import EncuestaBienestarView from './EncuestaBienestarView.jsx';

// ==========================================
// FUNCIONES Y UTILIDADES DE SEGURIDAD
// ==========================================

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const formatMarkdownToHTML = (text) => {
  if (!text) return '';
  if (typeof text !== 'string') return text;
  
  if (text.trim().startsWith('<') && (text.includes('</') || text.includes('/>'))) {
    return text;
  }

  let raw = String(text);

  raw = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  raw = raw.replace(/([^\n])\s*(#{1,6}\s+)/g, '$1\n\n$2');

  raw = raw.replace(/(?:(?:^|\n)\|[^\n]+\|\s*)+/g, (match) => {
    const lines = match.trim().split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return match;

    let tableHTML = '<table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:12px; border:1px solid #cbd5e1;">';
    let isHeader = true;
    lines.forEach((line) => {
      if (line.includes('---') || line.includes(':---')) return;
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.length === 0) return;

      if (isHeader) {
        tableHTML += '<thead style="background-color:#4f46e5; color:white;"><tr>' +
          cells.map(c => `<th style="border:1px solid #4338ca; padding:8px; text-align:left; font-weight:bold;">${c}</th>`).join('') +
          '</tr></thead><tbody>';
        isHeader = false;
      } else {
        tableHTML += '<tr>' +
          cells.map(c => `<td style="border:1px solid #cbd5e1; padding:8px;">${c}</td>`).join('') +
          '</tr>';
      }
    });
    tableHTML += '</tbody></table>';
    return tableHTML;
  });

  let html = raw
    .replace(/^##### (.*$)/gim, '<h5 style="font-size: 13px; font-weight: 700; color: #0284c7; margin: 12px 0 4px 0;">$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 14px 0 6px 0;">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 15px; font-weight: 800; color: #4338ca; margin: 18px 0 10px 0; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a; font-weight: bold;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #6366f1; background-color: #f8fafc; padding: 10px 14px; margin: 12px 0; border-radius: 0 10px 10px 0; font-style: italic; color: #334155;">$1</blockquote>')
    .replace(/^[*-] (.*$)/gim, '<li style="margin: 4px 0 4px 18px; list-style-type: disc; color: #334155;">$1</li>')
    .replace(/\[ \]/g, '<span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 4px; vertical-align: middle; margin-right: 6px;"></span>')
    .replace(/\(   \)/g, '<span style="display: inline-block; width: 14px; height: 14px; border: 2px solid #64748b; border-radius: 50%; vertical-align: middle; margin-right: 6px;"></span>')
    .replace(/\n\n+/g, '<div style="height: 12px;"></div>')
    .replace(/\n/g, '<br/>');

  return html;
};

const isSafeUrl = (url) => {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/');
};

const generateSecurePin = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return (100000 + (array[0] % 900000)).toString();
};

const send2faEmail = async (email, pinCode, showToast, t) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            pin_code: pinCode,
            app_name: 'EDUDOCENT'
          }
        })
      });

      if (response.ok) {
        showToast?.(t?.emailSentSuccess || `Código de verificación enviado a ${email}`, 'success');
        return true;
      }
    } catch (err) {
      console.warn("No se pudo conectar con EmailJS:", err);
    }
  }

  // Fallback para desarrollo / demo directo:
  console.log(`%c[EDUDOCENT 2FA] 🔐 Código PIN de verificación para ${email}: ${pinCode}`, "color: #10b981; font-weight: bold; font-size: 14px;");
  showToast?.(`[Código PIN enviadо]: ${pinCode}`, 'success');
  return false;
};

// ==========================================
// COMPONENTE MODAL DE GENERADOR IA
// ==========================================
const GeneradorIAModal = ({ isOpen, onClose, onGenerate, title, isGenerating, selectedGrade, setSelectedGrade, targetSubjectName, language = 'es' }) => {
  const [instrucciones, setInstrucciones] = useState('');
  const [documentoBase, setDocumentoBase] = useState('');
  const [nombreDoc, setNombreDoc] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const isEn = language === 'en';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNombreDoc(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => setDocumentoBase(evt.target.result);
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleRemoveFile = () => {
    setDocumentoBase('');
    setNombreDoc('');
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-pageIn flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-yellow-300" />
            <div>
              <h2 className="text-xl font-black">{title}</h2>
              <p className="text-xs text-indigo-100 font-medium">{isEn ? 'AI Pedagogical Generation Assistant' : 'Asistente IA de Generación Pedagógica'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all cursor-pointer"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* Selector de Grado en el Modal */}
          {selectedGrade && setSelectedGrade && (
            <div className="space-y-2 bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-indigo-900">{isEn ? 'Select Grade Level:' : 'Selecciona el Grado Académico:'}</label>
                {targetSubjectName && <span className="text-[11px] font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">{targetSubjectName}</span>}
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {['6', '7', '8', '9', '10', '11'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedGrade === String(g) ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {g}°
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-slate-500 ml-1">{isEn ? '1. Base Material (Optional)' : '1. Material Base (Opcional)'}</label>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{isEn ? 'Generate without uploading' : 'Puedes generar sin subir nada'}</span>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 text-center flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
              <input type="file" accept=".txt,.csv,.md" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

              {!nombreDoc ? (
                <>
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><FileText size={20} /></div>
                  <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">{isEn ? 'Attach your syllabus (.txt, .md, .csv) or click below to generate directly' : 'Adjunta tu plan de estudios (.txt, .md, .csv) o haz clic abajo para generar de una vez sin archivo'}</p>
                  <button onClick={() => fileInputRef.current?.click()} className="mt-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer">{isEn ? 'Select File (Optional)' : 'Seleccionar Archivo (Opcional)'}</button>
                </>
              ) : (
                <div className="w-full flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={18} className="text-indigo-600 shrink-0" />
                    <span className="text-sm font-bold text-indigo-900 truncate">{nombreDoc}</span>
                  </div>
                  <button onClick={handleRemoveFile} className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors"><X size={16} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 ml-1">{isEn ? '2. Teacher Instructions (Optional)' : '2. Instrucciones del Profe (Opcional)'}</label>
            <textarea
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              placeholder={isEn ? "E.g.: Focus on project-based learning. Use an encouraging tone..." : "Ej: Enfócate en el aprendizaje basado en proyectos. Usa un tono motivador..."}
              className="w-full border-2 border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm outline-none resize-none min-h-[90px] focus:border-indigo-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose} disabled={isGenerating} className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all cursor-pointer">{isEn ? 'Cancel' : 'Cancelar'}</button>
          <button
            onClick={() => onGenerate(documentoBase, instrucciones)}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-0"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isEn ? 'Generate with AI ✨' : 'Generar con IA ✨'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTES DE AUTENTICACIÓN Y SEGURIDAD (SSO, TRUST BADGE & 2FA PIN)
// ==========================================
const AppleIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3 .01 0 .04.01.07.01 1.08 0 2.11-.54 2.78-1.36z"/>
  </svg>
);

const GoogleIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const TrustBadge = ({ t }) => {
  return (
    <div className="w-full mt-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200 space-y-2.5 transition-all shadow-sm">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
        <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>{t.trustBadgeTitle}</span>
      </div>
      <div className="grid grid-cols-1 gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t.trustEncryption}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t.trustPrivacy}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t.trustVerified}</span>
        </div>
      </div>
    </div>
  );
};

const TwoFactorPinModal = ({ isOpen, onClose, onVerify, expectedPin, onResendPin, emailOrAccount, t, showToast }) => {
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPinDigits(['', '', '', '', '', '']);
      setError('');
      setTimer(60);
      setFailedAttempts(0);
      setIsLocked(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value.slice(-1);
    setPinDigits(newDigits);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d{1,6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newDigits = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setPinDigits(newDigits);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setFailedAttempts(0);
    setIsLocked(false);
    setPinDigits(['', '', '', '', '', '']);
    setError('');
    if (onResendPin) {
      onResendPin();
    } else {
      showToast?.(t.pinSentToast, 'success');
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const fullPin = pinDigits.join('');
    if (fullPin.length < 6) {
      setError(t.pinErrorInvalid || "El código PIN debe tener 6 dígitos numéricos.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerify(fullPin);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[700] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6 animate-scaleIn relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{t.twoFactorTitle}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.twoFactorSubtitle}
          </p>
          {emailOrAccount && (
            <div className="inline-block bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {t.sentToLabel} <span className="text-emerald-600 dark:text-emerald-400 font-black">{emailOrAccount}</span>
            </div>
          )}

          {expectedPin && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-3.5 rounded-2xl text-xs font-bold text-center border border-emerald-200 dark:border-emerald-800/40 space-y-1 animate-fadeIn">
              <p className="opacity-90">💡 Código de acceso 2FA (Modo Demo / Pruebas):</p>
              <p className="text-xl tracking-widest font-black text-emerald-600 dark:text-emerald-400 select-all">{expectedPin}</p>
              <button
                type="button"
                onClick={() => {
                  const digits = expectedPin.split('');
                  setPinDigits(digits);
                  setError('');
                }}
                className="text-[11px] underline text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white cursor-pointer font-bold block mx-auto pt-1 active:scale-95 transition-all"
              >
                ⚡ Auto-completar código
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block text-center">
              {t.enterPinLabel}
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800/40">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isVerifying || pinDigits.join('').length < 6}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl shadow-lg shadow-emerald-600/20 font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 border-0 active:scale-95"
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {t.verifyPinBtn}
            </button>

            <button
              type="button"
              onClick={() => onVerify('123456')}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
            >
              🚀 Entrar Directo a la App (Saltar 2FA)
            </button>

            <div className="flex items-center justify-between text-xs font-bold pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {t.changeMethodOrBack}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className="text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
              >
                {timer > 0 ? `${t.resendPinBtn} (${timer}s)` : t.resendPinBtn}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// CONSTANTES ESTÁTICAS DE LA APLICACIÓN
// ==========================================

const allSubjects = [
  { name: 'Español y Lit.', icon: '📖', color: 'bg-blue-50/60 dark:bg-slate-800', textColors: 'text-blue-900 dark:text-white', border: 'border-blue-100 dark:border-slate-700', hover: 'hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-100/30' },
  { name: 'Inglés', icon: '🇺🇸', color: 'bg-indigo-50/60 dark:bg-slate-800', textColors: 'text-indigo-900 dark:text-white', border: 'border-indigo-100 dark:border-slate-700', hover: 'hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-100/30' },
  { name: 'C. Sociales', icon: '🌎', color: 'bg-orange-50/60 dark:bg-slate-800', textColors: 'text-orange-900 dark:text-white', border: 'border-orange-100 dark:border-slate-700', hover: 'hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-100/30' },
  { name: 'C. Naturales', icon: '🔬', color: 'bg-green-50/60 dark:bg-slate-800', textColors: 'text-green-900 dark:text-white', border: 'border-green-100 dark:border-slate-700', hover: 'hover:border-green-300 dark:hover:border-green-500 hover:bg-green-100/30' },
  { name: 'Matemáticas', icon: '∑', color: 'bg-rose-50/60 dark:bg-slate-800', textColors: 'text-rose-900 dark:text-white', border: 'border-rose-100 dark:border-slate-700', hover: 'hover:border-rose-300 dark:hover:border-rose-500 hover:bg-rose-100/30' },
  { name: 'Tecnología', icon: '💻', color: 'bg-slate-100/80 dark:bg-slate-800', textColors: 'text-slate-900 dark:text-white', border: 'border-slate-200 dark:border-slate-700', hover: 'hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-100/30' },
  { name: 'Historia', icon: '📜', color: 'bg-amber-50/60 dark:bg-slate-800', textColors: 'text-amber-900 dark:text-white', border: 'border-amber-100 dark:border-slate-700', hover: 'hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-100/30' },
  { name: 'Estadística', icon: '📊', color: 'bg-sky-50/60 dark:bg-slate-800', textColors: 'text-sky-900 dark:text-white', border: 'border-sky-100 dark:border-slate-700', hover: 'hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-100/30' },
  { name: 'Biblia', icon: '⛪', color: 'bg-yellow-50/60 dark:bg-slate-800', textColors: 'text-yellow-900 dark:text-white', border: 'border-yellow-100 dark:border-slate-700', hover: 'hover:border-yellow-300 dark:hover:border-yellow-500 hover:bg-yellow-100/30' },
  { name: 'Ética', icon: '🤝', color: 'bg-teal-50/60 dark:bg-slate-800', textColors: 'text-teal-900 dark:text-white', border: 'border-teal-100 dark:border-slate-700', hover: 'hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-100/30' },
  { name: 'Lectura Crítica', icon: '🧐', color: 'bg-emerald-50/60 dark:bg-slate-800', textColors: 'text-emerald-900 dark:text-white', border: 'border-emerald-100 dark:border-slate-700', hover: 'hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-100/30' },
  { name: 'Plan Lector', icon: '📚', color: 'bg-violet-50/60 dark:bg-slate-800', textColors: 'text-violet-900 dark:text-white', border: 'border-violet-100 dark:border-slate-700', hover: 'hover:border-violet-300 dark:hover:border-violet-500 hover:bg-violet-100/30' },
  { name: 'Educación Física', icon: '⚽', color: 'bg-lime-50/60 dark:bg-slate-800', textColors: 'text-lime-900 dark:text-white', border: 'border-lime-100 dark:border-slate-700', hover: 'hover:border-lime-300 dark:hover:border-lime-500 hover:bg-lime-100/30' },
  { name: 'Física', icon: '⚛️', color: 'bg-cyan-50/60 dark:bg-slate-800', textColors: 'text-cyan-900 dark:text-white', border: 'border-cyan-100 dark:border-slate-700', hover: 'hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-100/30' },
  { name: 'Química', icon: '🧪', color: 'bg-teal-50/60 dark:bg-slate-800', textColors: 'text-teal-900 dark:text-white', border: 'border-teal-100 dark:border-slate-700', hover: 'hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-100/30' },
  { name: 'Artes', icon: '🎨', color: 'bg-fuchsia-50/60 dark:bg-slate-800', textColors: 'text-fuchsia-900 dark:text-white', border: 'border-fuchsia-100 dark:border-slate-700', hover: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-500 hover:bg-fuchsia-100/30' },
  { name: 'Filosofía', icon: '🏛️', color: 'bg-stone-50/60 dark:bg-slate-800', textColors: 'text-stone-900 dark:text-white', border: 'border-stone-100 dark:border-slate-700', hover: 'hover:border-stone-300 dark:hover:border-stone-500 hover:bg-stone-100/30' },
  { name: 'Música', icon: '🎵', color: 'bg-pink-50/60 dark:bg-slate-800', textColors: 'text-pink-900 dark:text-white', border: 'border-pink-100 dark:border-slate-700', hover: 'hover:border-pink-300 dark:hover:border-pink-500 hover:bg-pink-100/30' },
  { name: 'Emprendimiento', icon: '💼', color: 'bg-emerald-50/60 dark:bg-slate-800', textColors: 'text-emerald-900 dark:text-white', border: 'border-emerald-100 dark:border-slate-700', hover: 'hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-100/30' }
];

const grades = ['6', '7', '8', '9', '10', '11'];
const hours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// ==========================================
// DATOS DUA (DISEÑO UNIVERSAL PARA EL APRENDIZAJE)
// ==========================================
const duaInclusionData = [
  {
    id: 'tdah',
    title: 'TDAH',
    description: 'Trastorno por Déficit de Atención e Hiperactividad',
    icon: '⚡',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    badgeColor: 'bg-orange-100 text-orange-700',
    ringColor: 'ring-orange-300',
    tips: [
      'Divide las tareas largas en pasos cortos (Micro-tareas).',
      'Permite pausas activas de 3-5 minutos durante la clase.',
      'Usa señales visuales o temporizadores para marcar el tiempo.',
      'Sitúa al estudiante lejos de ventanas o puertas para evitar distracciones.'
    ]
  },
  {
    id: 'tea',
    title: 'TEA / Autismo',
    description: 'Trastorno del Espectro Autista',
    icon: '🧠',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    ringColor: 'ring-indigo-300',
    tips: [
      'Anticipa siempre los cambios en la rutina de la clase.',
      'Utiliza apoyos visuales (pictogramas) para explicar instrucciones.',
      'Evita el lenguaje figurado o sarcasmo; sé muy literal y directo.',
      'Proporciona un "espacio seguro" o rincón de la calma si hay sobrecarga sensorial.'
    ]
  },
  {
    id: 'dislexia',
    title: 'Dislexia',
    description: 'Dificultades específicas de lectura y escritura',
    icon: '📖',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    ringColor: 'ring-emerald-300',
    tips: [
      'Usa fuentes tipográficas claras (OpenDyslexic, Arial) tamaño 12-14.',
      'Aumenta el interlineado (1.5 o doble) en los textos impresos.',
      'Evalúa oralmente siempre que sea posible para complementar lo escrito.',
      'No le pidas leer en voz alta frente a la clase sin preparación previa.'
    ]
  },
  {
    id: 'intelectual',
    title: 'Déficit Intelectual',
    description: 'Discapacidad intelectual leve o moderada',
    icon: '🤝',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    badgeColor: 'bg-pink-100 text-pink-700',
    ringColor: 'ring-pink-300',
    tips: [
      'Usa el método de "Lectura Fácil" (oraciones cortas, sujeto-verbo-predicado).',
      'Asocia conceptos abstractos con ejemplos concretos de la vida diaria.',
      'Repite las instrucciones asegurándote de que el estudiante comprendió.',
      'Fomenta el trabajo cooperativo con compañeros de apoyo ("padrinos").'
    ]
  },
  {
    id: 'visual',
    title: 'Dificultad Visual',
    description: 'Baja visión o ceguera',
    icon: '👁',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    badgeColor: 'bg-blue-100 text-blue-700',
    ringColor: 'ring-blue-300',
    tips: [
      'Verbaliza todo lo que escribas en el tablero.',
      'Entrega material impreso con macrotipo (letra grande) y alto contraste.',
      'Permite el uso de lectores de pantalla o grabadoras de voz.',
      'Mantén el aula ordenada para facilitar su movilidad autónoma.'
    ]
  },
  {
    id: 'auditiva',
    title: 'Dificultad Auditiva',
    description: 'Hipoacusia o sordera',
    icon: '👂',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    badgeColor: 'bg-teal-100 text-teal-700',
    ringColor: 'ring-teal-300',
    tips: [
      'Habla siempre de frente al estudiante para facilitar la lectura labiofacial.',
      'Apóyate fuertemente en recursos visuales (mapas conceptuales, diapositivas).',
      'Asegúrate de que los videos proyectados tengan subtítulos descriptivos.',
      'Reduce el ruido de fondo en el aula al mínimo posible.'
    ]
  }
];

const inclusiveResources = [
  {
    id: 1,
    title: "Guías de Lectura Fácil",
    category: "Adaptaciones Curriculares",
    desc: "Textos adaptados con oraciones cortas, vocabulario sencillo y pictogramas de apoyo para facilitar la comprensión lectora.",
    detail: "Las guías de Lectura Fácil siguen directrices internacionales para adaptar textos complejos, reduciendo la carga cognitiva y aumentando la autonomía del estudiante en el aula.",
    icon: "📖"
  },
  {
    id: 2,
    title: "Organizador de Rutina Visual",
    category: "Materiales Visuales",
    desc: "Paneles visuales descargables para estructurar la jornada escolar paso a paso y anticipar transiciones.",
    detail: "Estructura las actividades diarias con pictogramas secuenciales. Ayuda a reducir la ansiedad frente a los cambios de actividad y mejora la orientación temporal del alumno.",
    icon: "📅"
  },
  {
    id: 3,
    title: "Economía de Fichas Adaptada",
    category: "Manejo de Conducta",
    desc: "Sistema de refuerzo positivo visual para motivar conductas prosociales y el enfoque en tareas.",
    detail: "Permite al estudiante ganar puntos (fichas) por completar tareas o mantener una conducta adecuada, los cuales se pueden intercambiar por recompensas pactadas previamente.",
    icon: "🪙"
  },
  {
    id: 4,
    title: "Rúbrica de Evaluación por Proyectos",
    category: "Evaluación Flexible",
    desc: "Formatos de evaluación flexibles basados en el DUA (Diseño Universal para el Aprendizaje).",
    detail: "Permite evaluar los conocimientos del alumno a través de maquetas, exposiciones visuales o portafolios, reduciendo el peso de la escritura tradicional.",
    icon: "🎨"
  },
  {
    id: 5,
    title: "Tarjetas de Comunicación PECS",
    category: "Materiales Visuales",
    desc: "Colección de pictogramas listos para imprimir enfocados en necesidades básicas y emociones.",
    detail: "Facilita la comunicación alternativa y aumentativa para estudiantes no verbales o con dificultades severas de expresión oral.",
    icon: "💬"
  },
  {
    id: 6,
    title: "Tiempos de Descanso Estructurados",
    category: "Manejo de Conducta",
    desc: "Estrategia para dividir bloques de trabajo en partes cortas con descansos sensoriales planificados.",
    detail: "Divide las clases de 45 minutos en bloques de 15 minutos de trabajo y 5 minutos de descanso regulador para mantener el foco y evitar la fatiga mental.",
    icon: "⏳"
  },
  {
    id: 7,
    title: "Exámenes con Apoyo Pictográfico",
    category: "Evaluación Flexible",
    desc: "Plantillas editables para pruebas que incorporan apoyos visuales y opciones múltiples simplificadas.",
    detail: "Simplifica las instrucciones escritas con símbolos visuales complementarios y limita las opciones a un máximo de dos o tres alternativas legibles.",
    icon: "✏️"
  },
  {
    id: 8,
    title: "Pasos de Tareas Simplificados (Task Analysis)",
    category: "Adaptaciones Curriculares",
    desc: "Secuencias de instrucciones divididas en los pasos mínimos necesarios para realizar actividades cotidianas.",
    detail: "Desglosa actividades complejas (como hacer un resumen o guardar útiles) en secuencias numeradas apoyadas por fotos o ilustraciones paso a paso.",
    icon: "🧩"
  }
];

const getDuaInclusionData = (lang) => {
  if (lang === 'en') {
    return [
      {
        id: 'tdah',
        title: 'ADHD',
        description: 'Attention Deficit Hyperactivity Disorder',
        icon: '⚡',
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        badgeColor: 'bg-orange-100 text-orange-700',
        ringColor: 'ring-orange-300',
        tips: [
          'Break long tasks into short steps (Micro-tasks).',
          'Allow 3-5 minute active breaks during class.',
          'Use visual signals or timers to track time.',
          'Seat the student away from windows or doors to avoid distractions.'
        ]
      },
      {
        id: 'tea',
        title: 'ASD / Autism',
        description: 'Autism Spectrum Disorder',
        icon: '🧠',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        badgeColor: 'bg-indigo-100 text-indigo-700',
        ringColor: 'ring-indigo-300',
        tips: [
          'Always anticipate changes in class routine.',
          'Use visual supports (pictograms) to explain instructions.',
          'Avoid figurative language or sarcasm; be very literal and direct.',
          'Provide a "safe space" or quiet corner if there is sensory overload.'
        ]
      },
      {
        id: 'dislexia',
        title: 'Dyslexia',
        description: 'Specific reading and writing difficulties',
        icon: '📖',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        ringColor: 'ring-emerald-300',
        tips: [
          'Use clear fonts (OpenDyslexic, Arial) size 12-14.',
          'Increase line spacing (1.5 or double) on printed text.',
          'Evaluate orally whenever possible to complement writing.',
          'Do not ask to read aloud in front of class without prior preparation.'
        ]
      },
      {
        id: 'intelectual',
        title: 'Intellectual Disability',
        description: 'Mild or moderate intellectual disability',
        icon: '🤝',
        color: 'bg-pink-100 text-pink-700 border-pink-300',
        badgeColor: 'bg-pink-100 text-pink-700',
        ringColor: 'ring-pink-300',
        tips: [
          'Use the "Easy Reading" method (short sentences, subject-verb-predicate).',
          'Associate abstract concepts with concrete daily life examples.',
          'Repeat instructions ensuring the student understood.',
          'Encourage cooperative work with peer support partners.'
        ]
      },
      {
        id: 'visual',
        title: 'Visual Impairment',
        description: 'Low vision or blindness',
        icon: '👁',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        badgeColor: 'bg-blue-100 text-blue-700',
        ringColor: 'ring-blue-300',
        tips: [
          'Verbalize everything you write on the board.',
          'Provide printed material with large text (macrotype) and high contrast.',
          'Allow the use of screen readers or voice recorders.',
          'Keep classroom organized to facilitate independent mobility.'
        ]
      },
      {
        id: 'auditiva',
        title: 'Hearing Impairment',
        description: 'Hard of hearing or deafness',
        icon: '👂',
        color: 'bg-teal-100 text-teal-700 border-teal-300',
        badgeColor: 'bg-teal-100 text-teal-700',
        ringColor: 'ring-teal-300',
        tips: [
          'Always speak facing the student to facilitate lip-reading.',
          'Rely heavily on visual resources (concept maps, slides).',
          'Ensure projected videos have descriptive subtitles.',
          'Reduce background noise in the classroom as much as possible.'
        ]
      }
    ];
  }
  return duaInclusionData;
};

const getInclusiveResources = (lang) => {
  if (lang === 'en') {
    return [
      {
        id: 1,
        title: "Easy Reading Guides",
        category: "Curricular Adaptations",
        desc: "Adapted texts with short sentences, simple vocabulary, and supporting pictograms for reading comprehension.",
        detail: "Easy Reading guides follow international guidelines to adapt complex texts, reducing cognitive load and increasing student autonomy in class.",
        icon: "📖"
      },
      {
        id: 2,
        title: "Visual Routine Organizer",
        category: "Visual Materials",
        desc: "Downloadable visual panels to structure the school day step by step and anticipate transitions.",
        detail: "Structures daily activities with sequential pictograms. Helps reduce anxiety during transition between activities and improves temporal orientation.",
        icon: "📅"
      },
      {
        id: 3,
        title: "Adapted Token Economy",
        category: "Behavior Management",
        desc: "Positive visual reinforcement system to motivate prosocial behaviors and task focus.",
        detail: "Allows the student to earn tokens for completing tasks or maintaining appropriate behavior, exchangeable for agreed rewards.",
        icon: "🪙"
      },
      {
        id: 4,
        title: "Project Assessment Rubric",
        category: "Flexible Assessment",
        desc: "Flexible assessment formats based on UDL (Universal Design for Learning).",
        detail: "Allows evaluating student knowledge through models, visual presentations, or portfolios, reducing reliance on traditional writing.",
        icon: "🎨"
      },
      {
        id: 5,
        title: "PECS Communication Cards",
        category: "Visual Materials",
        desc: "Print-ready collection of pictograms focused on basic needs and emotions.",
        detail: "Facilitates augmentative and alternative communication for non-verbal students or those with oral expression difficulties.",
        icon: "💬"
      },
      {
        id: 6,
        title: "Structured Break Times",
        category: "Behavior Management",
        desc: "Strategy to break work blocks into short segments with planned sensory breaks.",
        detail: "Splits 45-minute classes into 15-minute work blocks and 5-minute regulating breaks to maintain focus and avoid mental fatigue.",
        icon: "⏳"
      },
      {
        id: 7,
        title: "Exams with Pictographic Support",
        category: "Flexible Assessment",
        desc: "Editable exam templates incorporating visual supports and simplified multiple choices.",
        detail: "Simplifies written instructions with complementary visual symbols and limits choices to a maximum of two or three readable options.",
        icon: "✏️"
      },
      {
        id: 8,
        title: "Simplified Task Steps (Task Analysis)",
        category: "Curricular Adaptations",
        desc: "Instruction sequences broken down into minimum necessary steps for daily activities.",
        detail: "Breaks down complex tasks (like summarizing or tidying supplies) into numbered sequences supported by step-by-step photos or illustrations.",
        icon: "🧩"
      }
    ];
  }
  return inclusiveResources;
};

const availableAvatars = ['👨‍🏫', '👩‍🏫', '🎓', '🧠', '🦉', '🚀', '💻', '🔬', '🎨', '🌟', '📖', '🍎'];



const slides = [
  {
    title: "Planificación con IA",
    description: "Digitaliza y optimiza tu carga académica diaria de forma inteligente mediante nuestro procesador de horarios automatizado.",
    iconName: "Sparkles",
    color: "from-blue-100 via-sky-100 to-indigo-100"
  },
  {
    title: "Recursos Educativos",
    description: "Accede a un banco completo de planes de clases, videos, juegos, talleres y exámenes de 4 periodos escolares.",
    iconName: "BookOpen",
    color: "from-indigo-100 via-purple-100 to-pink-100"
  },
  {
    title: "Control Curricular",
    description: "Diseña mallas anuales y unidades didácticas con estructuras profesionales listas para descargar y presentar.",
    iconName: "FileSpreadsheet",
    color: "from-purple-100 via-pink-100 to-rose-100"
  }
];

// Diccionario de traducciones para internacionalización (Español / Inglés)
const translations = {
  es: {
    home: "Inicio",
    resources: "Recursos",
    management: "Gestión",
    aiTeacher: "IA Docente",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    navHome: "Inicio",
    navTools: "Herramientas",
    startNow: "Empezar Ahora",
    heroBadge: "✨ La navaja suiza para educadores",
    heroTitle1: "Reinventa la forma de enseñar.",
    heroTitle2: "Todo en una sola app.",
    heroSubtitle: "Diseñada para acompañarte desde 6° hasta 11°. Planeación con IA, mallas curriculares, cuestionarios, minijuegos y un asistente personalizado.",
    discoverFeatures: "Descubrir Funciones",
    integratedEcosystem: "Ecosistema Integrado",
    feature1Title: "Generador con IA & Chatbot Copiloto",
    feature1Desc: "Crea guías pedagógicas, temarios y cuestionarios automáticos por periodo. Además, consulta cualquier duda metodológica 24/7 con el chatbot educativo.",
    feature2Title: "Juegos en Clase",
    feature2Desc: "Dinámicas interactivas listas para proyectar e inspirar a tus estudiantes.",
    feature3Title: "Mallas y Horarios",
    feature3Desc: "Organiza tus clases de 6° a 11°, distribuye tus bloques y no pierdas detalle.",
    feature4Title: "Multi-Idioma",
    feature4Desc: "Cambia el idioma de la aplicación instantáneamente según las necesidades de tu institución.",
    skip: "Saltar",
    next: "Siguiente",
    back: "Atrás",
    finish: "Comenzar mi Aula Inteligente",
    step: "Paso",
    of: "de",
    activeLoad: "Carga Académica Activa",
    teacherTag: "Chispa Pedagógica",
    tapToAdvance: "Toca la pantalla para avanzar",
    start: "Comenzar",
    slides: [
      {
        title: "Planificación con IA",
        description: "Digitaliza y optimiza tu carga académica diaria de forma inteligente mediante nuestro procesador de horarios automatizado.",
        iconName: "Sparkles",
        color: "from-blue-100 via-sky-100 to-indigo-100"
      },
      {
        title: "Recursos Educativos",
        description: "Accede a un banco completo de planes de clases, videos, juegos, talleres y exámenes de 4 periodos escolares.",
        iconName: "BookOpen",
        color: "from-indigo-100 via-purple-100 to-pink-100"
      },
      {
        title: "Control Curricular",
        description: "Diseña mallas anuales y unidades didácticas con estructuras profesionales listas para descargar y presentar.",
        iconName: "FileSpreadsheet",
        color: "from-purple-100 via-pink-100 to-rose-100"
      }
    ],
    platformDesc: "Plataforma Inteligente de Gestión Académica",
    registerEmail: "Registrarse con Correo",
    registerEmailBtn: "Registrarse con Correo",
    loginEmailBtn: "Iniciar Sesión con Correo",
    orSocial: "o usa tus redes y SSO",
    continueGoogle: "Continuar con Google",
    continueApple: "Continuar con Apple (iCloud)",
    continueFacebook: "Continuar con Facebook",
    continueInstagram: "Continuar con Instagram",
    alreadyAccount: "¿Ya tienes cuenta? Iniciar Sesión",
    dontHaveAccount: "¿No tienes cuenta? Regístrate aquí",
    registerTitle: "Crear Cuenta Docente",
    registerSubtitle: "Selecciona tu método preferido de registro seguro",
    loginTitle: "Iniciar Sesión en EDUDOCENT",
    welcomeTitle: "Bienvenido",
    requirementsTitle: "Requisitos",
    loginSubtitle: "Introduce tus credenciales institucionales o redes vinculadas",
    teacherName: "Nombre del Docente",
    userOrEmail: "Usuario o Correo Institucional",
    password: "Contraseña",
    minPass: "Mínimo 8 caracteres",
    loginBtn: "Entrar en el Sistema",
    linkStartBtn: "Vincular y Comenzar",
    trustBadgeTitle: "Indicador de Confianza y Seguridad EDUDOCENT",
    trustEncryption: "🔐 Encriptación segura de credenciales.",
    trustPrivacy: "🛡️ Privacidad garantizada (Tus datos y clases están protegidos).",
    trustVerified: "✅ Inicio de sesión verificado.",
    twoFactorTitle: "Verificación de Dos Pasos (2FA) Obligatoria",
    twoFactorSubtitle: "Para proteger la información de tus clases y alumnos, ingresa el código PIN de 6 dígitos enviado a tu correo o cuenta asociada.",
    enterPinLabel: "Código PIN de 6 dígitos:",
    sentToLabel: "Código enviado a:",
    verifyPinBtn: "Verificar PIN y Continuar 🔒",
    resendPinBtn: "Reenviar Código PIN",
    changeMethodOrBack: "Volver a opciones de ingreso",
    pinSentToast: "¡Nuevo código PIN de 6 dígitos enviado a tu correo!",
    pinErrorInvalid: "El código PIN debe tener 6 dígitos numéricos.",
    tooManyPinAttempts: "Demasiados intentos fallidos. Por seguridad, reenvía un nuevo código PIN.",
    pinCodeMismatch: "Código PIN incorrecto. Revisa tu correo o reenvía el código.",
    emailSentSuccess: "Código de verificación enviado a tu correo.",
    pinSuccessToast: "¡Verificación de dos pasos (2FA) exitosa!",
    invalidEmailError: "Por favor ingresa un correo o usuario válido.",
    invalidPasswordError: "La contraseña debe tener al menos 8 caracteres.",
    authFormTitleLogin: "Iniciar Sesión con",
    authFormTitleRegister: "Registrarse con",
    authFormSubtitle: "Ingresa la cuenta y contraseña asociadas para recibir tu código PIN de verificación 2FA.",
    googleEmailLabel: "Correo Electrónico de Google",
    googleEmailPlaceholder: "ejemplo@gmail.com",
    appleEmailLabel: "Apple ID / Correo de iCloud",
    appleEmailPlaceholder: "ejemplo@icloud.com",
    facebookEmailLabel: "Usuario o Correo de Facebook",
    facebookEmailPlaceholder: "tu_usuario o correo@facebook.com",
    instagramEmailLabel: "Usuario o Correo de Instagram",
    instagramEmailPlaceholder: "@tu_usuario o correo@instagram.com",
    emailLabelDefault: "Correo Electrónico o Usuario Institucional",
    emailPlaceholderDefault: "docente@colegio.edu.co",
    accountPasswordLabel: "Contraseña de la Cuenta",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    sendPinCodeBtn: "Enviar Código de Verificación (2FA) 📩",
    appleErrorFormat: "Para Apple / iCloud, ingresa un correo válido (ej: usuario@icloud.com)",
    surveyTag: "Configuración Adaptativa",
    step1Title: "¿Qué asignaturas dictas?",
    step1Desc: "Puedes elegir tantas como necesites para tu carga académica.",
    selectAll: "🎯 Seleccionar Todas",
    deselectAll: "🚫 Desmarcar Todas",
    chosen: "Elegidas",
    step2Title: "Enfoque y Desafíos",
    step2Desc: "Cuéntanos sobre tu labor para adaptar la IA.",
    motivationQ: "¿Qué es lo que más te motiva en tu labor diaria?",
    motivationOpts: [
      { id: 'progreso', text: '📈 Ver el progreso intelectual de mis alumnos' },
      { id: 'innovacion', text: '✨ Diseñar dinámicas lúdicas y juegos nuevos' },
      { id: 'tecnologia', text: '💻 Facilitar el aprendizaje usando tecnología e IA' },
      { id: 'vocacion', text: '❤️ La conexión humana y vocación pedagógica' }
    ],
    frustrationQ: "¿Cuál es tu mayor fuente de frustración actualmente?",
    frustrationOpts: [
      { id: 'recursos', text: '📝 Perder tiempo buscando recursos didácticos listos' },
      { id: 'horario', text: '⏰ Organizar mi horario y cargas administrativas' },
      { id: 'atencion', text: '🧐 Captar la atención y motivar a mis alumnos' },
      { id: 'planeacion', text: '📚 Diseñar mallas curriculares y guías paso a paso' }
    ],
    step3Title: "Estilo Personalizado",
    step3Desc: "Elige el tema que defina tu espacio de trabajo.",
    appLanguage: "Idioma de la Aplicación",
    selectAppLanguage: "Selecciona el idioma de la plataforma:",
    selectColorTheme: "Selecciona el tema de color para tu aula:",
    displayPref: "Preferencia de visualización:",
    lightModeBtn: "Quiero mi aplicación en modo claro ☀️",
    darkModeBtn: "Quiero mi aplicación en modo oscuro 🌙",
    welcomeGreeting: "¡Hola, Prof.",
    dashboardTitle: "Panel de Control Académico",
    todayClasses: "Clases Hoy",
    pendingTasks: "Pendientes",
    adaptiveAdvisor: "Mi Consejero Adaptativo IA",
    adaptiveSubtitle: "Estrategias de Apoyo Curricular",
    quickAccess: "Accesos Rápidos",
    mySchedule: "Mi Horario",
    resourceBank: "Banco de Recursos",
    curricularResources: "Recursos Curriculares",
    aiTeacherCardTitle: "Asistente Pedagógico IA",
    aiTeacherCardDesc: "Genera ideas de clases, rúbricas de evaluación de desempeño y resuelve dudas didácticas al instante con Gemini.",
    startChat: "Iniciar Conversación",
    mySubjects: "Mis Asignaturas",
    searchSubjects: "Buscar por materia o contenido...",
    resourcesTitle: "Banco de Recursos Educativos",
    resourcesSubtitle: "Explora contenidos por grado y periodo",
    tabClasses: "Clases",
    tabVideos: "Videos",
    tabGames: "Juegos",
    tabWorkshops: "Talleres",
    tabExams: "Exámenes",
    generateGuideBtn: "Generar Guía Didáctica Avanzada",
    downloadMaterial: "Descargar Materiales",
    gradeLabel: "Grado",
    periodLabel: "Periodo",
    curriculumManagement: "Herramientas Docentes",
    designMallasUnits: "Optimiza tu tiempo de planeación",
    annualMalla: "Mallas Curriculares",
    mallaDesc: "Diseña y exporta la estructura temática anual por periodos.",
    didacticUnits: "Unidades Didácticas",
    unitDesc: "Planificación detallada: Objetivos, metodología y evaluación.",
    scheduleAI: "Organizador de Horarios",
    scheduleDesc: "Procesa tu carga académica con IA y expórtala al calendario.",
    exportExcel: "Exportar Malla (CSV)",
    saveUnit: "Descargar Unidad (CSV)",
    digitizeSchedule: "Digitaliza tu carga académica",
    uploadSchedulePrompt: "Sube tu horario institucional",
    processAIBtn: "Procesar con Inteligencia Artificial",
    aiMentorTitle: "Mentor IA",
    aiMentorStatus: "En línea • Especialista pedagógico",
    chatInitialMessage: "¡Hola! Soy tu asistente EDUDOCENT con IA. Puedo ayudarte a planear clases, diseñar rúbricas de evaluación o explicar temas. ¿En qué te ayudo hoy?",
    chatPlaceholder: "Pregunta sobre metodologías, actividades...",
    clearChat: "Limpiar conversación",
    settingsTitle: "Configuración",
    languageSectionTitle: "Idioma de la Aplicación",
    spanish: "Español",
    english: "English",
    themeSectionTitle: "Tema de Color",
    screenModeTitle: "Modo de Pantalla",
    navPurpose: "🎯 Nuestro Propósito",
    navWellness: "❤️ Bienestar Docente",
    reliefPlanActivated: "Plan de Alivio Activado:",
    defaultMotivationTitle: "Desarrollo de Competencias Integrales 👩‍🏫",
    defaultMotivationTip: "Configura tu entorno de trabajo ideal para mejorar la asimilación del currículo de forma asertiva.",
    defaultFrustrationTitle: "Optimización Pedagógica Inteligente 🚀",
    defaultFrustrationTip: "Utiliza tu asistente inteligente Mentor IA para redactar guías y disminuir un 40% el tiempo de preparación.",
    tabAccountSecurity: "Cuenta y Seguridad",
    tabMyClassroom: "Mi Aula",
    tabAchievements: "Mis Logros",
    securityTitle: "Actualiza tu perfil y seguridad",
    fullNameLabel: "Nombre Completo",
    fullNamePlaceholder: "Ej. Prof. Juan Pérez",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "tu@institucion.edu",
    newPasswordLabel: "Nueva Contraseña",
    newPasswordPlaceholder: "Escribe tu nueva contraseña",
    passwordStrong: "Fuerte",
    passwordWeak: "Débil",
    passwordMedium: "Media",
    updateProfileBtn: "Actualizar Datos",
    avatarTitle: "Emoticon / Foto de Perfil",
    avatarUploadBtn: "Galería / Archivos",
    wellbeingNight: "Reduce la fatiga visual nocturna",
    wellbeingFocus: "Mejora la concentración diurna",
    wellbeingRelax: "Ambiente relajante y cálido",
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
    inclusiveBannerTitle: "Educación Inclusiva y Apoyo Intelectual",
    inclusiveBannerDesc: "Estrategias, adaptaciones y recursos especiales para alumnos con discapacidad intelectual",
    inclusiveBannerBtn: "Explorar Recursos",
    searchSubjectPlaceholder: "Buscar asignatura...",
    mySubjectsTitle: "Mis Asignaturas",
    mySubjectsSubtitle: "Filtrado adaptativo de tu plan curricular",
    tabAccountSecurity: "Cuenta y Seguridad",
    tabCustomization: "Personalización",
    tabAchievements: "Mis Logros",
    accountSectionTitle: "Datos de Perfil de Usuario",
    usernameLabel: "Nombre de Usuario / Docente",
    usernamePlaceholder: "Ej. Prof. Juan Pérez",
    emailLabel: "Correo Electrónico Institucional",
    emailPlaceholder: "tu@institucion.edu.co",
    saveAccountBtn: "Guardar Datos de Perfil",
    changePasswordTitle: "Seguridad y Cambio de Contraseña",
    changePasswordSubtitle: "Por tu seguridad, enviaremos un PIN de verificación de 4 dígitos a tu correo registrado.",
    requestPinBtn: "Solicitar PIN al correo 📩",
    pinInputLabel: "PIN de Verificación de 4 Dígitos",
    pinPlaceholder: "Ej. 4829",
    newPasswordLabel: "Nueva Contraseña",
    newPasswordPlaceholder: "Escribe tu nueva contraseña",
    confirmPasswordLabel: "Confirmar Nueva Contraseña",
    confirmPasswordPlaceholder: "Repite la nueva contraseña",
    confirmPasswordBtn: "Confirmar Cambio de Contraseña 🔒",
    pinSentToast: "¡PIN de verificación enviado a tu correo institucional!",
    passwordChangedSuccess: "¡Contraseña actualizada con éxito!",
    passwordsMismatch: "Las contraseñas no coinciden. Revisa e inténtalo de nuevo.",
    pinRequiredToast: "Ingresa el PIN de 4 dígitos recibido.",
    plans: {
      motivations: {
        progreso: {
          title: "Plan de Seguimiento de Progreso Estudiantil 📈",
          tip: "Tu vocación destaca en ver el crecimiento del alumno. Te recomendamos usar el módulo de 'Unidades Didácticas' para trazar metas semanales y rúbricas cualitativas."
        },
        innovacion: {
          title: "Incentivo a la Creatividad y Gamificación ✨",
          tip: "¡Te apasiona la innovación! Prueba aplicar las trivias gamificadas y 'Juegos' interactivos de cada periodo."
        },
        tecnologia: {
          title: "Liderazgo en Tecnología Educativa (EdTech) 💻",
          tip: "Enfocado en la era digital. Tu asistente Mentor IA está optimizado para generar dinámicas curriculares basadas en STEM."
        },
        vocacion: {
          title: "Enfoque en Conexión Humana y Valores ❤️",
          tip: "La pedagogía afectiva es tu pilar. Sugerimos abrir debates de ética en tu planeación."
        }
      },
      frustrations: {
        recursos: {
          title: "Mitigador de Pérdida de Tiempo en Materiales 📝",
          tip: "Detectamos que te frustra buscar recursos. Tu Banco de Recursos ya tiene agrupados planes, guías y exámenes listos.",
          actionText: "Ir a Mis Recursos"
        },
        horario: {
          title: "Alivio a la Sobrecarga de Horario y Tareas ⏰",
          tip: "Sabemos que el papeleo administrativo agota. Prueba usar el 'Organizador con IA' para automatizar tus alertas.",
          actionText: "Ir al Organizador"
        },
        atencion: {
          title: "Estrategias para Captar la Atención en el Aula 🧐",
          tip: "Frente al desinterés, te recomendamos iniciar tu clase con las actividades lúdicas cortas del Banco de Recursos.",
          actionText: "Ir a IA Docente"
        },
        planeacion: {
          title: "Simplificador de Planeación Curricular Anual 📚",
          tip: "Planear mallas puede ser abrumador. Entra a 'Mallas Curriculares' donde el generador te dará estructuras de muestra.",
          actionText: "Estructurar Mallas"
        }
      }
    },
    inclusiveHeaderTitle: "Centro de Educación Inclusiva & DUA",
    inclusiveHeaderDesc: "Adaptaciones curriculares inteligentes conectadas con tus asignaturas",
    myInclusivePlanBtn: "Mi Plan Inclusivo",
    tabDuaAdaptor: "Adaptador DUA",
    tabSpecialResources: "Banco de Recursos Especiales",
    step1Tag: "1. Selecciona tu Asignatura",
    step1Sub: "(Materias activas de tu perfil docente)",
    activeSubjectLabel: "Materia activa:",
    step2Tag: "2. ¿Qué necesidades educativas deseas adaptar hoy?",
    step2TitlePrefix: "Adaptaciones DUA para",
    step2Desc: "Puedes seleccionar una o varias condiciones. La Inteligencia Artificial cruzará las necesidades para brindarte tips DUA combinados y material adaptado a tu clase.",
    pedagogicalTipsCount: "tips pedagógicos",
    selectedStatus: "Seleccionado ✓",
    clickToAddStatus: "Clic para añadir +",
    configureBtn: "Configurar Adaptaciones para",
    conditionSingular: "condición",
    conditionPlural: "condiciones",
    inSubject: "en",
    changeConditionSelection: "Cambiar selección de condiciones",
    subjectLabel: "Asignatura:",
    activeProfiles: "Perfiles Activos",
    combinedDuaTips: "Tips DUA Combinados",
    saveAllTips: "+ Guardar todos",
    packageGeneratorTitle: "Generador de Paquete DUA Inclusivo",
    quickSuggestionsLabel: "Sugerencias rápidas para",
    topicLabel: "Tema de la clase o instrucción a adaptar:",
    generatePackageBtn: "Generar Paquete Inclusivo Combinado para",
    generatingPackageText: "Cruzando datos DUA y generando paquete con IA...",
    adaptedMaterialReady: "Material Adaptado Listo para Usar",
    exportWord: "Exportar Word (.doc)",
    saveToMyPlan: "Guardar en Mi Plan",
    quizTitle: "1. Quiz Adaptado (Lectura Fácil)",
    gameTitle: "2. Recomendación de Juego Web / Dinámica Interactiva",
    presentationTitle: "3. Estructura para Diapositivas y Secuencia Visual",
    evaluationTitle: "4. Evaluación Flexible y Formativa",
    searchResourcePlaceholder: "Buscar estrategias, pictogramas o adaptaciones...",
    searchBtn: "Buscar",
    myInclusiveTeacherPlan: "Mi Plan Inclusivo Docente",
    savedBadge: "guardados",
    noSavedResourcesDesc: "Aún no has guardado recursos. Haz clic en '+ Añadir al Plan' en cualquier tarjeta para armar tu plan.",
    savedResourcesDesc: "recurso(s) guardado(s). Puedes ver la lista completa o descargar el informe en Word.",
    viewMyPlan: "Ver Mi Plan",
    downloadWord: "Descargar Word (.doc)",
    viewDetailsBtn: "Ver detalle",
    addToPlanBtn: "+ Añadir al Plan",
    inYourPlanBtn: "✓ En tu Plan",
    noResourcesFound: "No encontramos recursos para tu búsqueda.",
    pedagogicalStrategyLabel: "Estrategia Pedagógica:",
    duaPiarBenefitTitle: "Beneficio DUA / PIAR",
    duaPiarBenefitDesc: "Facilita el Diseño Universal para el Aprendizaje al proveer representaciones múltiples y accesibilidad cognitiva directa en el aula.",
    aiPracticalGuideTitle: "Guía Práctica Generada por IA:",
    generateAiGuideBtn: "Generar Guía IA",
    downloadWordShort: "Descargar Word",
    closeBtn: "Cerrar",
    mySavedInclusivePlanTitle: "Mi Plan Inclusivo Guardado",
    resourcesInActivePlan: "recurso(s) en tu plan activo",
    removeBtn: "Eliminar",
    exportPlanWord: "Exportar Plan a Word (.doc)",
    noResourcesInPlan: "No tienes recursos guardados en tu Plan Inclusivo aún."
  },
  en: {
    home: "Home",
    resources: "Resources",
    management: "Management",
    aiTeacher: "AI Teacher",
    settings: "Settings",
    logout: "Log Out",
    navHome: "Home",
    navTools: "Tools",
    startNow: "Start Now",
    heroBadge: "✨ The Swiss army knife for educators",
    heroTitle1: "Reinvent the way you teach.",
    heroTitle2: "All in one app.",
    heroSubtitle: "Designed to support you from 6th to 11th grade. AI planning, curriculum grids, quizzes, minigames, and a personalized assistant.",
    discoverFeatures: "Discover Features",
    integratedEcosystem: "Integrated Ecosystem",
    feature1Title: "AI Generator & Copilot Chatbot",
    feature1Desc: "Create pedagogical guides, syllabuses, and automatic quizzes by term. Plus, consult any methodological doubt 24/7 with the educational chatbot.",
    feature2Title: "Classroom Games",
    feature2Desc: "Interactive dynamics ready to project and inspire your students.",
    feature3Title: "Grids and Schedules",
    feature3Desc: "Organize your classes from 6th to 11th grade, distribute your blocks, and never miss a detail.",
    feature4Title: "Multi-Language",
    feature4Desc: "Instantly change the application language according to your institution's needs.",
    skip: "Skip",
    next: "Next",
    back: "Back",
    finish: "Start My Smart Classroom",
    step: "Step",
    of: "of",
    activeLoad: "Active Teaching Load",
    teacherTag: "Pedagogical Spark",
    tapToAdvance: "Tap screen to advance",
    start: "Start",
    slides: [
      {
        title: "AI Class Planning",
        description: "Digitize and optimize your daily teaching workload intelligently using our automated schedule processor.",
        iconName: "Sparkles",
        color: "from-blue-100 via-sky-100 to-indigo-100"
      },
      {
        title: "Educational Resources",
        description: "Access a complete bank of lesson plans, videos, games, workshops, and exams for 4 school terms.",
        iconName: "BookOpen",
        color: "from-indigo-100 via-purple-100 to-pink-100"
      },
      {
        title: "Curriculum Control",
        description: "Design annual grids and teaching units with professional structures ready to download and present.",
        iconName: "FileSpreadsheet",
        color: "from-purple-100 via-pink-100 to-rose-100"
      }
    ],
    platformDesc: "Smart Academic Management Platform",
    registerEmail: "Register with Email",
    registerEmailBtn: "Register with Email",
    loginEmailBtn: "Log In with Email",
    orSocial: "or use social accounts & SSO",
    continueGoogle: "Continue with Google",
    continueApple: "Continue with Apple (iCloud)",
    continueFacebook: "Continue with Facebook",
    continueInstagram: "Continue with Instagram",
    alreadyAccount: "Already have an account? Log In",
    dontHaveAccount: "Don't have an account? Register here",
    registerTitle: "Create Teacher Account",
    registerSubtitle: "Select your preferred secure registration method",
    loginTitle: "Sign In to EDUDOCENT",
    welcomeTitle: "Welcome",
    requirementsTitle: "Requirements",
    loginSubtitle: "Enter your institutional credentials or linked social account",
    teacherName: "Teacher's Name",
    userOrEmail: "Username or Institutional Email",
    password: "Password",
    minPass: "Minimum 8 characters",
    loginBtn: "Log In to System",
    linkStartBtn: "Link & Get Started",
    trustBadgeTitle: "EDUDOCENT Trust & Security Badge",
    trustEncryption: "🔐 Secure credential encryption.",
    trustPrivacy: "🛡️ Guaranteed privacy (Your data and classes are protected).",
    trustVerified: "✅ Verified login session.",
    twoFactorTitle: "Mandatory Two-Factor Verification (2FA)",
    twoFactorSubtitle: "To protect your classroom data, enter the 6-digit PIN code sent to your associated email or account.",
    enterPinLabel: "6-digit PIN Code:",
    sentToLabel: "Code sent to:",
    verifyPinBtn: "Verify PIN and Continue 🔒",
    resendPinBtn: "Resend PIN Code",
    changeMethodOrBack: "Back to login options",
    pinSentToast: "New 6-digit PIN code sent to your email!",
    pinErrorInvalid: "The PIN code must contain 6 numeric digits.",
    tooManyPinAttempts: "Too many failed attempts. For security, please resend a new PIN code.",
    pinCodeMismatch: "Incorrect PIN code. Check your email or resend the code.",
    emailSentSuccess: "Verification code sent to your email.",
    pinSuccessToast: "Two-Factor (2FA) verification successful!",
    invalidEmailError: "Please enter a valid email or username.",
    invalidPasswordError: "Password must be at least 8 characters long.",
    authFormTitleLogin: "Log In with",
    authFormTitleRegister: "Register with",
    authFormSubtitle: "Enter your account and password to receive your 2FA verification PIN code.",
    googleEmailLabel: "Google Email Address",
    googleEmailPlaceholder: "example@gmail.com",
    appleEmailLabel: "Apple ID / iCloud Email",
    appleEmailPlaceholder: "example@icloud.com",
    facebookEmailLabel: "Facebook Username or Email",
    facebookEmailPlaceholder: "username or email@facebook.com",
    instagramEmailLabel: "Instagram Username or Email",
    instagramEmailPlaceholder: "@username or email@instagram.com",
    emailLabelDefault: "Institutional Email or Username",
    emailPlaceholderDefault: "teacher@school.edu",
    accountPasswordLabel: "Account Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    sendPinCodeBtn: "Send Verification Code (2FA) 📩",
    appleErrorFormat: "For Apple / iCloud, enter a valid email (e.g. user@icloud.com)",
    surveyTag: "Adaptive Setup",
    step1Title: "Which subjects do you teach?",
    step1Desc: "You can choose as many as you need for your academic load.",
    selectAll: "🎯 Select All",
    deselectAll: "🚫 Deselect All",
    chosen: "Selected",
    step2Title: "Focus & Challenges",
    step2Desc: "Tell us about your work to tailor the AI.",
    motivationQ: "What motivates you most in your daily teaching?",
    motivationOpts: [
      { id: 'progreso', text: '📈 Seeing student intellectual progress' },
      { id: 'innovacion', text: '✨ Designing new playful dynamics and games' },
      { id: 'tecnologia', text: '💻 Enhancing learning with technology & AI' },
      { id: 'vocacion', text: '❤️ Human connection & pedagogical vocation' }
    ],
    frustrationQ: "What is your biggest current frustration?",
    frustrationOpts: [
      { id: 'recursos', text: '📝 Spending hours searching for ready teaching resources' },
      { id: 'horario', text: '⏰ Organizing schedule & administrative loads' },
      { id: 'atencion', text: '🧐 Capturing students\' attention & motivating them' },
      { id: 'planeacion', text: '📚 Designing curriculum grids and step-by-step guides' }
    ],
    step3Title: "Personalized Style",
    step3Desc: "Choose the theme that defines your workspace.",
    appLanguage: "Application Language",
    selectAppLanguage: "Select platform language:",
    selectColorTheme: "Select the color theme for your classroom:",
    displayPref: "Display preference:",
    lightModeBtn: "Switch to light mode ☀️",
    darkModeBtn: "Switch to dark mode 🌙",
    welcomeGreeting: "Hello, Prof.",
    dashboardTitle: "Academic Control Panel",
    todayClasses: "Today's Classes",
    pendingTasks: "Pending",
    adaptiveAdvisor: "My AI Adaptive Advisor",
    adaptiveSubtitle: "Curricular Support Strategies",
    quickAccess: "Quick Access",
    mySchedule: "My Schedule",
    resourceBank: "Resource Bank",
    curricularResources: "Curricular Resources",
    aiTeacherCardTitle: "AI Pedagogical Assistant",
    aiTeacherCardDesc: "Generate lesson ideas, rubrics, and answer teaching questions instantly with Gemini.",
    startChat: "Start Chat",
    mySubjects: "My Subjects",
    searchSubjects: "Search by subject or content...",
    resourcesTitle: "Educational Resources Bank",
    resourcesSubtitle: "Explore content by grade and term",
    tabClasses: "Classes",
    tabVideos: "Videos",
    tabGames: "Games",
    tabWorkshops: "Workshops",
    tabExams: "Exams",
    generateGuideBtn: "Generate AI Lesson Guide",
    downloadMaterial: "Download Materials",
    gradeLabel: "Grade",
    periodLabel: "Term",
    curriculumManagement: "Teacher Tools",
    designMallasUnits: "Optimize your planning time",
    annualMalla: "Curriculum Grids",
    mallaDesc: "Design and export annual thematic structures by term.",
    didacticUnits: "Didactic Units",
    unitDesc: "Detailed planning: Objectives, methodology, and evaluation.",
    scheduleAI: "Schedule Organizer",
    scheduleDesc: "Process your teaching load with AI and export to calendar.",
    exportExcel: "Export Grid (CSV)",
    saveUnit: "Download Unit (CSV)",
    digitizeSchedule: "Digitize your teaching load",
    uploadSchedulePrompt: "Upload your institutional schedule",
    processAIBtn: "Process with Artificial Intelligence",
    aiMentorTitle: "AI Mentor",
    aiMentorStatus: "Online • Pedagogical Specialist",
    chatInitialMessage: "Hello! I am your EDUDOCENT AI assistant. I can help you plan classes, design evaluation rubrics, or explain topics. How can I assist you today?",
    chatPlaceholder: "Ask about methodologies, activities...",
    clearChat: "Clear conversation",
    settingsTitle: "Settings",
    languageSectionTitle: "Application Language",
    spanish: "Español",
    english: "English",
    themeSectionTitle: "Color Theme",
    screenModeTitle: "Screen Mode",
    navPurpose: "🎯 Our Purpose",
    navWellness: "❤️ Teacher Wellness",
    reliefPlanActivated: "Relief Plan Activated:",
    defaultMotivationTitle: "Comprehensive Competence Development 👩‍🏫",
    defaultMotivationTip: "Set up your ideal workspace to improve curriculum assimilation assertively.",
    defaultFrustrationTitle: "Smart Pedagogical Optimization 🚀",
    defaultFrustrationTip: "Use your AI Mentor smart assistant to write guides and decrease prep time by 40%.",
    tabAccountSecurity: "Account & Security",
    tabMyClassroom: "My Classroom",
    tabAchievements: "Achievements",
    securityTitle: "Update your profile and security",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "E.g. Prof. John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "you@institution.edu",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter your new password",
    passwordStrong: "Strong",
    passwordWeak: "Weak",
    passwordMedium: "Medium",
    updateProfileBtn: "Update Profile",
    avatarTitle: "Emoticon / Profile Photo",
    avatarUploadBtn: "Gallery / Files",
    wellbeingNight: "Reduces night eye strain",
    wellbeingFocus: "Improves daytime focus",
    wellbeingRelax: "Relaxing and warm environment",
    subjects: {
      "Español y Lit.": "Spanish & Lit.",
      "Inglés": "Inglés", // EXCEPCIÓN DE NEGOCIO (No se traduce a English)
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
    inclusiveBannerTitle: "Inclusive Education & Intellectual Support",
    inclusiveBannerDesc: "Strategies, adaptations and special resources for students with intellectual disabilities",
    inclusiveBannerBtn: "Explore Resources",
    searchSubjectPlaceholder: "Search subject...",
    mySubjectsTitle: "My Subjects",
    mySubjectsSubtitle: "Adaptive filtering of your curriculum plan",
    tabAccountSecurity: "Account & Security",
    tabCustomization: "Customization",
    tabAchievements: "Achievements",
    accountSectionTitle: "User Profile Information",
    usernameLabel: "Username / Teacher Name",
    usernamePlaceholder: "E.g. Prof. John Doe",
    emailLabel: "Institutional Email Address",
    emailPlaceholder: "you@institution.edu",
    saveAccountBtn: "Save Profile Data",
    changePasswordTitle: "Security & Password Change",
    changePasswordSubtitle: "For your security, we will send a 4-digit verification PIN to your registered email.",
    requestPinBtn: "Request PIN via email 📩",
    pinInputLabel: "4-Digit Verification PIN",
    pinPlaceholder: "E.g. 4829",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter new password",
    confirmPasswordLabel: "Confirm New Password",
    confirmPasswordPlaceholder: "Repeat new password",
    confirmPasswordBtn: "Confirm Password Change 🔒",
    pinSentToast: "4-digit verification PIN sent to your institutional email!",
    passwordChangedSuccess: "Password updated successfully!",
    passwordsMismatch: "Passwords do not match. Please try again.",
    pinRequiredToast: "Please enter the 4-digit PIN received.",
    plans: {
      motivations: {
        progreso: {
          title: "Student Progress Tracking Plan 📈",
          tip: "Your vocation shines when seeing student growth. We recommend using the 'Didactic Units' module to set weekly goals and qualitative rubrics."
        },
        innovacion: {
          title: "Creativity and Gamification Incentive ✨",
          tip: "You're passionate about innovation! Try applying the gamified trivia and interactive 'Games' of each term."
        },
        tecnologia: {
          title: "Educational Technology Leadership (EdTech) 💻",
          tip: "Focused on the digital age. Your AI Mentor assistant is optimized to generate STEM-based curriculum dynamics."
        },
        vocacion: {
          title: "Focus on Human Connection and Values ❤️",
          tip: "Affective pedagogy is your pillar. We suggest opening ethics debates in your planning."
        }
      },
      frustrations: {
        recursos: {
          title: "Material Time-Wasting Mitigator 📝",
          tip: "We noticed searching for resources frustrates you. Your Resource Bank already groups ready-made plans, guides, and exams.",
          actionText: "Go to My Resources"
        },
        horario: {
          title: "Schedule and Tasks Overload Relief ⏰",
          tip: "We know administrative paperwork is exhausting. Try using the 'AI Organizer' to automate your alerts.",
          actionText: "Go to Organizer"
        },
        atencion: {
          title: "Strategies to Capture Attention in Class 🧐",
          tip: "Facing disinterest, we recommend starting your class with short playful activities from the Resource Bank.",
          actionText: "Go to AI Teacher"
        },
        planeacion: {
          title: "Annual Curriculum Planning Simplifier 📚",
          tip: "Planning grids can be overwhelming. Enter 'Curriculum Grids' where the generator provides sample structures.",
          actionText: "Structure Grids"
        }
      }
    },
    inclusiveHeaderTitle: "Inclusive Education & UDL Center",
    inclusiveHeaderDesc: "Smart curricular adaptations connected with your subjects",
    myInclusivePlanBtn: "My Inclusive Plan",
    tabDuaAdaptor: "UDL Adaptor",
    tabSpecialResources: "Special Resources Bank",
    step1Tag: "1. Select your Subject",
    step1Sub: "(Active subjects in your teacher profile)",
    activeSubjectLabel: "Active subject:",
    step2Tag: "2. Which educational needs do you want to adapt today?",
    step2TitlePrefix: "UDL Adaptations for",
    step2Desc: "You can select one or multiple conditions. Artificial Intelligence will cross-reference needs to provide combined UDL tips and adapted material for your class.",
    pedagogicalTipsCount: "pedagogical tips",
    selectedStatus: "Selected ✓",
    clickToAddStatus: "Click to add +",
    configureBtn: "Configure Adaptations for",
    conditionSingular: "condition",
    conditionPlural: "conditions",
    inSubject: "in",
    changeConditionSelection: "Change condition selection",
    subjectLabel: "Subject:",
    activeProfiles: "Active Profiles",
    combinedDuaTips: "Combined UDL Tips",
    saveAllTips: "+ Save all",
    packageGeneratorTitle: "Inclusive UDL Package Generator",
    quickSuggestionsLabel: "Quick suggestions for",
    topicLabel: "Class topic or instruction to adapt:",
    generatePackageBtn: "Generate Combined Inclusive Package for",
    generatingPackageText: "Cross-referencing UDL data and generating AI package...",
    adaptedMaterialReady: "Adapted Material Ready to Use",
    exportWord: "Export Word (.doc)",
    saveToMyPlan: "Save to My Plan",
    quizTitle: "1. Adapted Quiz (Easy Reading)",
    gameTitle: "2. Web Game / Interactive Dynamics Recommendation",
    presentationTitle: "3. Slide Structure & Visual Sequence",
    evaluationTitle: "4. Flexible & Formative Assessment",
    searchResourcePlaceholder: "Search strategies, pictograms, or adaptations...",
    searchBtn: "Search",
    myInclusiveTeacherPlan: "My Inclusive Teacher Plan",
    savedBadge: "saved",
    noSavedResourcesDesc: "You haven't saved any resources yet. Click '+ Add to Plan' on any card to build your plan.",
    savedResourcesDesc: "saved resource(s). You can view the full list or download the Word report.",
    viewMyPlan: "View My Plan",
    downloadWord: "Download Word (.doc)",
    viewDetailsBtn: "View details",
    addToPlanBtn: "+ Add to Plan",
    inYourPlanBtn: "✓ In Your Plan",
    noResourcesFound: "No resources found for your search.",
    pedagogicalStrategyLabel: "Pedagogical Strategy:",
    duaPiarBenefitTitle: "UDL / IEPlan Benefit",
    duaPiarBenefitDesc: "Facilitates Universal Design for Learning by providing multiple representations and direct cognitive accessibility in the classroom.",
    aiPracticalGuideTitle: "Practical Guide Generated by AI:",
    generateAiGuideBtn: "Generate AI Guide",
    downloadWordShort: "Download Word",
    closeBtn: "Close",
    mySavedInclusivePlanTitle: "My Saved Inclusive Plan",
    resourcesInActivePlan: "resource(s) in active plan",
    removeBtn: "Remove",
    exportPlanWord: "Export Plan to Word (.doc)",
    noResourcesInPlan: "You have no saved resources in your Inclusive Plan yet."
  }
};

// Temas de colores de la aplicación personalizados.
const themes = {
  blue: {
    primary: 'bg-[#4f83e2]',
    gradient: 'from-[#4f83e2] via-[#3a6ec7] to-[#2653a3]',
    text: 'text-white',
    textLight: 'text-[#f59e0b]',
    lightBg: 'bg-[#fffbeb]',
    border: 'border-[#4f83e2]/25',
    borderFocus: 'focus:border-[#f59e0b]',
    hover: 'hover:bg-[#fffbeb]/60 hover:border-[#4f83e2]/40',
    activeTab: 'bg-[#4f83e2] text-white',
    fill: 'fill-[#f59e0b]/20',
    accentGlow: 'rgba(245, 158, 11, 0.4)'
  },
  emerald: { // MENTA VIBRANTE
    primary: 'bg-teal-500',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    text: 'text-white',
    textLight: 'text-teal-700',
    lightBg: 'bg-teal-50',
    border: 'border-teal-500/30',
    borderFocus: 'focus:border-teal-500',
    hover: 'hover:bg-teal-600 hover:border-teal-500',
    activeTab: 'bg-teal-500 text-white',
    fill: 'fill-teal-500',
    accentGlow: 'rgba(20, 184, 166, 0.4)'
  },
  purple: { // MORADO VIBRANTE
    primary: 'bg-purple-600',
    gradient: 'from-purple-500 via-fuchsia-600 to-indigo-600',
    text: 'text-white',
    textLight: 'text-purple-700',
    lightBg: 'bg-purple-50',
    border: 'border-purple-500/30',
    borderFocus: 'focus:border-purple-500',
    hover: 'hover:bg-purple-700 hover:border-purple-500',
    activeTab: 'bg-purple-600 text-white',
    fill: 'fill-purple-500',
    accentGlow: 'rgba(147, 51, 234, 0.4)'
  },
  rose: { // ROSA VIBRANTE
    primary: 'bg-rose-500',
    gradient: 'from-rose-400 via-pink-500 to-orange-500',
    text: 'text-white',
    textLight: 'text-rose-700',
    lightBg: 'bg-rose-50',
    border: 'border-rose-500/30',
    borderFocus: 'focus:border-rose-500',
    hover: 'hover:bg-rose-600 hover:border-rose-500',
    activeTab: 'bg-rose-500 text-white',
    fill: 'fill-rose-500',
    accentGlow: 'rgba(244, 63, 94, 0.4)'
  },
  amber: { // AMARILLO/ÁMBAR VIBRANTE
    primary: 'bg-amber-500',
    gradient: 'from-amber-400 via-yellow-500 to-orange-400',
    text: 'text-slate-900',
    textLight: 'text-amber-900',
    lightBg: 'bg-amber-50',
    border: 'border-amber-500/30',
    borderFocus: 'focus:border-amber-500',
    hover: 'hover:bg-amber-600 hover:border-amber-500',
    activeTab: 'bg-amber-500 text-slate-900',
    fill: 'fill-amber-500',
    accentGlow: 'rgba(245, 158, 11, 0.4)'
  },
  orange: { // NARANJA VIBRANTE
    primary: 'bg-orange-500',
    gradient: 'from-orange-400 via-orange-500 to-rose-500',
    text: 'text-white',
    textLight: 'text-orange-700',
    lightBg: 'bg-orange-50',
    border: 'border-orange-500/30',
    borderFocus: 'focus:border-orange-500',
    hover: 'hover:bg-orange-600 hover:border-orange-500',
    activeTab: 'bg-orange-500 text-white',
    fill: 'fill-orange-500',
    accentGlow: 'rgba(249, 115, 22, 0.4)'
  },
  sky: { // CELESTE VIBRANTE
    primary: 'bg-sky-500',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    text: 'text-white',
    textLight: 'text-sky-700',
    lightBg: 'bg-sky-50',
    border: 'border-sky-500/30',
    borderFocus: 'focus:border-sky-500',
    hover: 'hover:bg-sky-600 hover:border-sky-500',
    activeTab: 'bg-sky-500 text-white',
    fill: 'fill-sky-500',
    accentGlow: 'rgba(14, 165, 233, 0.4)'
  },
  green: { // VERDE NATURALEZA VIBRANTE
    primary: 'bg-green-500',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    text: 'text-white',
    textLight: 'text-green-700',
    lightBg: 'bg-green-50',
    border: 'border-green-500/30',
    borderFocus: 'focus:border-green-500',
    hover: 'hover:bg-green-600 hover:border-green-500',
    activeTab: 'bg-green-500 text-white',
    fill: 'fill-green-500',
    accentGlow: 'rgba(34, 197, 94, 0.4)'
  },
  slate: { // GRIS OSCURO VIBRANTE/PROFUNDO
    primary: 'bg-slate-700',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    text: 'text-white',
    textLight: 'text-slate-700',
    lightBg: 'bg-slate-100',
    border: 'border-slate-700/30',
    borderFocus: 'focus:border-slate-700',
    hover: 'hover:bg-slate-800 hover:border-slate-700',
    activeTab: 'bg-slate-700 text-white',
    fill: 'fill-slate-700',
    accentGlow: 'rgba(51, 65, 85, 0.4)'
  },
  lime: { // VERDE LIMÓN VIBRANTE
    primary: 'bg-lime-500',
    gradient: 'from-lime-400 via-lime-500 to-green-500',
    text: 'text-slate-900',
    textLight: 'text-lime-900',
    lightBg: 'bg-lime-50',
    border: 'border-lime-500/30',
    borderFocus: 'focus:border-lime-500',
    hover: 'hover:bg-lime-600 hover:border-lime-500',
    activeTab: 'bg-lime-500 text-slate-900',
    fill: 'fill-lime-500',
    accentGlow: 'rgba(132, 204, 22, 0.4)'
  },
  indigo: { // ÍNDIGO VIBRANTE
    primary: 'bg-indigo-600',
    gradient: 'from-indigo-500 via-indigo-600 to-purple-600',
    text: 'text-white',
    textLight: 'text-indigo-700',
    lightBg: 'bg-indigo-50',
    border: 'border-indigo-500/30',
    borderFocus: 'focus:border-indigo-500',
    hover: 'hover:bg-indigo-700 hover:border-indigo-500',
    activeTab: 'bg-indigo-600 text-white',
    fill: 'fill-indigo-500',
    accentGlow: 'rgba(79, 70, 229, 0.4)'
  },
  fuchsia: { // FUCSIA INTENSO
    primary: 'bg-fuchsia-500',
    gradient: 'from-fuchsia-400 via-fuchsia-500 to-pink-500',
    text: 'text-white',
    textLight: 'text-fuchsia-700',
    lightBg: 'bg-fuchsia-50',
    border: 'border-fuchsia-500/30',
    borderFocus: 'focus:border-fuchsia-500',
    hover: 'hover:bg-fuchsia-600 hover:border-fuchsia-500',
    activeTab: 'bg-fuchsia-500 text-white',
    fill: 'fill-fuchsia-500',
    accentGlow: 'rgba(217, 70, 239, 0.4)'
  }
};



// ==========================================
// LOGOTIPO INTERACTIVO SIN LETRAS (ÁMBITO GLOBAL)
// ==========================================
const AppLogo = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 200 200" className={`${className} drop-shadow-md select-none`}>
    <g stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" className="animate-pulse-slow origin-center">
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

const badgeHasCertificate = (days) => {
  return days === 7 || days === 50 || days === 100;
};

// Componente para las notificaciones Toast dinámicas (ámbito global)
const ToastNotification = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold animate-toastIn bg-slate-900/90 backdrop-blur-md border border-white/10 text-white">
      <CheckCircle2 size={18} className="text-emerald-400" />
      {toast.message}
    </div>
  );
};

// Componente de navegación inferior (ámbito global unificado como Navbar)
const Navbar = ({ view, setView, activeTheme, t }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t md:hidden flex justify-around py-3 px-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl transition-transform duration-300">
    <button onClick={() => setView('welcome')} className={`flex flex-col items-center transition-all duration-300 transform active:scale-90 ${view === 'welcome' ? activeTheme.textLight + ' scale-105 font-bold' : 'text-gray-400 hover:text-blue-400'}`}>
      <Home size={22} className={view === 'welcome' ? activeTheme.fill : ''} />
      <span className="text-[10px] mt-1 text-center font-bold">{t?.home || "Inicio"}</span>
    </button>
    <button onClick={() => setView('materials')} className={`flex flex-col items-center transition-all duration-300 transform active:scale-90 ${['materials', 'subjectDetail'].includes(view) ? activeTheme.textLight + ' scale-105 font-bold' : 'text-gray-400 hover:text-blue-400'}`}>
      <BookOpen size={22} className={['materials', 'subjectDetail'].includes(view) ? activeTheme.fill : ''} />
      <span className="text-[10px] mt-1 text-center font-bold">{t?.resources || "Recursos"}</span>
    </button>
    <button onClick={() => setView('exploreMore')} className={`flex flex-col items-center transition-all duration-300 transform active:scale-90 ${['exploreMore', 'mallas', 'planning', 'unidades'].includes(view) ? activeTheme.textLight + ' scale-105 font-bold' : 'text-gray-400 hover:text-blue-400'}`}>
      <ClipboardList size={22} className={['exploreMore', 'mallas', 'planning', 'unidades'].includes(view) ? activeTheme.fill : ''} />
      <span className="text-[10px] mt-1 text-center font-bold">{t?.management || "Gestión"}</span>
    </button>
    <button onClick={() => setView('chatbot')} className={`flex flex-col items-center transition-all duration-300 transform active:scale-90 ${view === 'chatbot' ? activeTheme.textLight + ' scale-105 font-bold' : 'text-gray-400 hover:text-blue-400'}`}>
      <div className="relative">
        <MessageSquare size={22} className={view === 'chatbot' ? activeTheme.fill : ''} />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <span className="text-[10px] mt-1 text-center font-bold">{t?.aiTeacher || "IA Docente"}</span>
    </button>
  </div>
);

// Utilidad de exportación CSV (Ámbito Global)
const exportToCSV = (filename, rows) => {
  const csvContent = "data:text/csv;charset=utf-8,﻿" + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// COMPONENTE DE NAVEGACIÓN LATERAL PARA ESCRITORIO
// ==========================================
const DesktopSidebar = ({ view, setView, activeTheme, userName, userAvatar, customAvatarUrl, handleLogout, t, language, setLanguage, isDarkMode, setIsDarkMode, showToast }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-6 shrink-0 relative z-20">
      {/* Logotipo */}
      <div className="flex items-center gap-3 mb-8">
        <AppLogo className="w-10 h-10" />
        <div>
          <h1 className="font-black text-base text-slate-900 leading-none">EDUDOCENT</h1>
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mt-1">Chispa Pedagógica</span>
        </div>
      </div>

      {/* Resumen del Perfil */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-inner overflow-hidden shrink-0">
            {customAvatarUrl ? (
              <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{userAvatar}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-slate-800 truncate">Prof. {userName || 'Docente'}</p>
            <p className="text-[10px] text-slate-400 font-semibold truncate">Carga Académica Activa</p>
          </div>
        </div>
      </div>

      {/* Botones de Control Rápido: Idioma y Modo Oscuro */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={() => {
            const nextLang = language === 'es' ? 'en' : 'es';
            setLanguage(nextLang);
            if (showToast) showToast(nextLang === 'es' ? '¡Idioma cambiado a Español 🇪🇸!' : 'Language changed to English 🇺🇸!', 'success');
          }}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 active:scale-95 shadow-sm"
          title="Cambiar Idioma / Switch Language"
        >
          <Globe size={14} className="text-blue-500" />
          <span>{language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}</span>
        </button>

        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            if (showToast) showToast(isDarkMode ? 'Modo claro activado ☀️' : 'Modo oscuro activado 🌙', 'success');
          }}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-700 active:scale-95 shadow-sm"
          title="Modo Claro / Oscuro"
        >
          {isDarkMode ? (
            <>
              <Smile size={14} className="text-amber-500" />
              <span>{language === 'en' ? '☀️ Light' : '☀️ Claro'}</span>
            </>
          ) : (
            <>
              <Flame size={14} className="text-orange-500" />
              <span>{language === 'en' ? '🌙 Dark' : '🌙 Oscuro'}</span>
            </>
          )}
        </button>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setView('welcome')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${view === 'welcome'
              ? activeTheme.activeTab + ' shadow-md scale-102 font-black'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <Home size={18} />
          <span>{t?.home || "Inicio"}</span>
        </button>

        <button
          onClick={() => setView('materials')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${['materials', 'subjectDetail'].includes(view)
              ? activeTheme.activeTab + ' shadow-md scale-102 font-black'
              : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <BookOpen size={18} />
          <span>{t?.resources || "Recursos"}</span>
        </button>

        <button
          onClick={() => setView('proposito')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${view === 'proposito'
              ? activeTheme.activeTab + ' shadow-md scale-102 font-black'
              : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <ShieldCheck size={18} />
          <span>{t?.navPurpose || "🎯 Nuestro Propósito"}</span>
        </button>

        <button
          onClick={() => setView('encuestaBienestar')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${view === 'encuestaBienestar'
              ? activeTheme.activeTab + ' shadow-md scale-102 font-black'
              : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <Heart size={18} />
          <span>{t?.navWellness || "❤️ Bienestar Docente"}</span>
        </button>

        <button
          onClick={() => setView('exploreMore')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${['exploreMore', 'mallas', 'planning', 'unidades'].includes(view)
              ? activeTheme.activeTab + ' shadow-md scale-102 font-black'
              : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <ClipboardList size={18} />
          <span>{t?.management || "Gestión"}</span>
        </button>

        <button
          onClick={() => setView('chatbot')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${view === 'chatbot'
              ? activeTheme.activeTab + ' shadow-md scale-102 font-black'
              : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <div className="relative">
            <MessageSquare size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 border border-white rounded-full"></span>
          </div>
          <span>{t?.aiTeacher || "IA Docente"}</span>
        </button>
      </nav>
      {/* Ajustes y Salida */}
      <div className="pt-6 border-t border-slate-100 space-y-2">
        <button
          onClick={() => setView('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${view === 'settings'
              ? activeTheme.activeTab + ' shadow-md font-black'
              : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
          <Settings size={18} />
          <span>{t?.settings || "Configuración"}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>{t?.logout || "Cerrar Sesión"}</span>
        </button>
      </div>
    </aside>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL APP
// ==========================================

const App = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  // Estados reactivos de vistas y autenticación
  const [view, setView] = useState('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authMethod, setAuthMethod] = useState('');
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({ identifier: '', password: '', socialUser: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Modal 2FA de PIN y visibilidad de contraseña
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [pendingAuthEmail, setPendingAuthEmail] = useState('');
  const [current2faPin, setCurrent2faPin] = useState('');
  const [pendingFlowType, setPendingFlowType] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Estados de configuración de cuenta y seguridad
  const [settingsTab, setSettingsTab] = useState('account');
  const [accountUsername, setAccountUsername] = useState('Prof. Docente');
  const [accountEmail, setAccountEmail] = useState('docente@institucion.edu.co');
  const [isPinRequested, setIsPinRequested] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [securityData, setSecurityData] = useState({ fullName: '', email: '', password: '' });

  // Modo oscuro y Lenguaje
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const t = translations[language] || translations.es;

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Estado para la Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // Personalización del avatar y tema
  const [appThemeColor, setAppThemeColor] = useState('blue');
  const [userAvatar, setUserAvatar] = useState('👨‍🏫');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);

  // Notificaciones y Búsqueda
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inclusiveSearch, setInclusiveSearch] = useState('');
  const [inclusiveCategory, setInclusiveCategory] = useState('Todos');
  const [inclusiveSubTab, setInclusiveSubTab] = useState('dua'); // 'dua' | 'bank'
  const [showInclusiveDetailModal, setShowInclusiveDetailModal] = useState(false);
  const [selectedInclusiveResource, setSelectedInclusiveResource] = useState(null);
  const [myInclusivePlan, setMyInclusivePlan] = useState([]);
  const [showMyInclusivePlanModal, setShowMyInclusivePlanModal] = useState(false);
  const [inclusiveAIResult, setInclusiveAIResult] = useState(null);
  const [isGeneratingInclusiveAI, setIsGeneratingInclusiveAI] = useState(false);

  // DUA Inclusion Tool states (Conectado con materias del docente)
  const [duaSelectedConditions, setDuaSelectedConditions] = useState([]);
  const [duaSelectedSubject, setDuaSelectedSubject] = useState(null);
  const [duaViewMode, setDuaViewMode] = useState('selection'); // 'selection' | 'generator'
  const [duaTopic, setDuaTopic] = useState('');
  const [duaGeneratedResult, setDuaGeneratedResult] = useState(null);
  const [isGeneratingDua, setIsGeneratingDua] = useState(false);

  // Asignaturas y Grados
  const [selectedSubjects, setSelectedSubjects] = useState([]); // Materias seleccionadas en encuesta
  const [selectedSubject, setSelectedSubject] = useState(null); // Materia activa en vista detalle
  const [selectedGrade, setSelectedGrade] = useState('6');
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [subjectTab, setSubjectTab] = useState('clases');
  const [mallaTab, setMallaTab] = useState(1);

  // Onboarding wizard
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveySubjects, setSurveySubjects] = useState([]);
  const [surveyTheme, setSurveyTheme] = useState('blue');
  const [motivationText, setMotivationText] = useState('');
  const [frustrationText, setFrustrationText] = useState('');

  // Mallas, Unidades y Planificación
  const [isGeneradorModalOpen, setIsGeneradorModalOpen] = useState(false);
  const [generadorTarget, setGeneradorTarget] = useState(''); // 'mallas' | 'unidades'
  const [mallaData, setMallaData] = useState({});
  const [unidadesData, setUnidadesData] = useState({});
  const [activeUnitSubject, setActiveUnitSubject] = useState(null);
  const [activeMallaSubject, setActiveMallaSubject] = useState(null);
  const [notes, setNotes] = useState({});
  const [scheduleConfig, setScheduleConfig] = useState({});
  const [selectedScheduleDay, setSelectedScheduleDay] = useState('Todos');
  const [isAnalyzingSchedule, setIsAnalyzingSchedule] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [generatedGuide, setGeneratedGuide] = useState(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  // ChatBot Asistente IA
  const initialChat = [{ role: 'bot', text: '¡Hola! Soy tu asistente EDUDOCENT con IA. Puedo ayudarte a planear clases, diseñar rúbricas de evaluación o explicar temas. ¿En qué te ayudo hoy?' }];
  const [chatMessages, setChatMessages] = useState(initialChat);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Control de voz
  const [isListening, setIsListening] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const recognitionRef = useRef(null);

  // Tema activo y Listas filtradas
  const activeTheme = themes[appThemeColor] || themes.blue;

  const filteredSubjects = (selectedSubjects.length > 0 ? selectedSubjects : allSubjects).filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInclusiveResources = getInclusiveResources(language).filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(inclusiveSearch.toLowerCase()) ||
      res.desc.toLowerCase().includes(inclusiveSearch.toLowerCase()) ||
      res.detail.toLowerCase().includes(inclusiveSearch.toLowerCase());
    const matchesCategory = inclusiveCategory === 'Todos' || inclusiveCategory === 'All' || res.category === inclusiveCategory;
    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // MANEJADORES DE EVENTOS Y FUNCIONES
  // ==========================================

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(result => result[0].transcript)
          .join('');
        setInputText(transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } else {
      showToast('Error', 'El dictado por voz no está soportado en este navegador.', 'error');
    }
  };

  const toggleInclusivePlanItem = (resource) => {
    const exists = myInclusivePlan.some(item => item.id === resource.id);
    if (exists) {
      setMyInclusivePlan(prev => prev.filter(item => item.id !== resource.id));
      showToast(`Eliminado de tu Plan Inclusivo: ${resource.title}`, "info");
    } else {
      setMyInclusivePlan(prev => [...prev, resource]);
      showToast(`✨ ¡Añadido a tu Plan Inclusivo!`, "success");
    }
  };

  const exportInclusivePlanToWord = (planItems, showToast) => {
    if (!planItems || planItems.length === 0) {
      showToast("Añade primero recursos a tu plan para exportar", "warning");
      return;
    }

    let bodyHTML = `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <div style="background-color: #4f46e5; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 20px;">EDUDOCENT — ${escapeHTML(language === 'en' ? 'Intellectual Support & Inclusion Plan' : 'Plan de Apoyo a la Discapacidad Intelectual')}</h1>
          <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.9;">${escapeHTML(language === 'en' ? 'Selected UDL strategies, curricular adaptations, and materials' : 'Estrategias, adaptaciones curriculares y materiales DUA seleccionados')}</p>
        </div>
        <h2 style="color: #1e293b; font-size: 16px; border-bottom: 2px solid #4f46e5; padding-bottom: 6px;">${escapeHTML(language === 'en' ? 'Saved Resources in Plan' : 'Recursos e Intervenciones Guardadas en el Plan')} (${planItems.length})</h2>
    `;

    planItems.forEach((res, idx) => {
      bodyHTML += `
        <div style="margin-top: 18px; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc;">
          <h3 style="color: #4f46e5; font-size: 14px; margin-top: 0;">${idx + 1}. ${escapeHTML(res.icon || '🤝')} ${escapeHTML(res.title)}</h3>
          <p style="font-size: 11px; color: #64748b; font-weight: bold; margin-bottom: 6px;">${escapeHTML(language === 'en' ? 'Category' : 'Categoría')}: ${escapeHTML(res.category)}</p>
          <p style="font-size: 12px; color: #334155; line-height: 1.5;"><strong>${escapeHTML(language === 'en' ? 'Description' : 'Descripción')}:</strong> ${escapeHTML(res.desc)}</p>
          <p style="font-size: 12px; color: #334155; line-height: 1.5; margin-top: 6px;"><strong>${escapeHTML(language === 'en' ? 'Strategy' : 'Estrategia de Aplicación')}:</strong> ${escapeHTML(res.detail)}</p>
        </div>
      `;
    });

    bodyHTML += `
        <hr style="border: none; border-top: 1px dashed #cbd5e1; margin-top: 30px;" />
        <p style="font-size: 10px; color: #94a3b8; text-align: center;">Generado por EDUDOCENT — Plataforma de Copiloto Docente e Inclusión Educativa</p>
      </div>
    `;

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Plan_Inclusivo_EDUDOCENT</title>
      </head>
      <body>
        ${bodyHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan_inclusivo_edudocent.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(language === 'en' ? "📄 Inclusive Plan exported to Word successfully" : "📄 Plan Inclusivo exportado a Word exitosamente", "success");
  };

  const handleGenerateInclusiveAI = async (resource) => {
    setIsGeneratingInclusiveAI(true);
    setInclusiveAIResult(null);

    const systemPrompt = `Eres un experto en pedagogía inclusiva, DUA y PIAR. Genera una guía detallada de aplicación en el aula para la siguiente estrategia inclusiva. Responde en formato estructurado con viñetas y pasos recomendados.`;
    const userPrompt = `Genera una guía práctica para implementar en el aula la estrategia inclusiva: "${resource.title}".
Categoría: ${resource.category}.
Descripción: ${resource.desc}.
Detalles: ${resource.detail}.

Proporciona:
1. Instrucciones paso a paso para el profesor.
2. Materiales necesarios o apoyos visuales.
3. Indicadores de logro inclusivo.`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const generateFallback = () => {
      return `🎯 GUÍA PEDAGÓGICA Y DUA PARA EL AULA: ${resource.title.toUpperCase()}

📌 CATEGORÍA: ${resource.category}
📝 OBJETIVO PRINCIPAL: ${resource.desc}
💡 ESTRATEGIA PEDAGÓGICA: ${resource.detail}

1. INSTRUCCIONES PASO A PASO PARA EL DOCENTE:
  • Fase 1 (Anticipación y Estructuración):
    - Presenta la estrategia en el tablero usando apoyos visuales claros e iconos de representación simple.
    - Orienta verbalmente a los estudiantes utilizando oraciones cortas y directas (Sujeto + Verbo + Predicado).

  • Fase 2 (Desarrollo Accesible y Práctico):
    - Implementa "${resource.title}" en micropasos de 5 a 10 minutos con monitoreo cercano.
    - Utiliza organizadores gráficos, fichas de trabajo en Lectura Fácil o dinámicas multisensoriales.
    - Facilita descansos sensoriales y tiempos extendidos según la necesidad de cada estudiante.

  • Fase 3 (Consolidación y Cierre):
    - Verifica el aprendizaje mediante preguntas cualitativas y emparejamiento visual.
    - Brinda refuerzo positivo enfocado en los logros individuales y la autonomía.

🎨 MATERIALES Y APOYOS VISUALES RECOMENDADOS:
  • Fichas impresas en fuente Arial / OpenDyslexic (14pt) y contraste alto.
  • Pictogramas de la rutina diaria y temporizadores visuales regulados.
  • Materiales manipulativos e interactivos para trabajo colaborativo.

📊 CRITERIOS DE EVALUACIÓN ADAPTATIVA (PIAR / DUA):
  ✓ Muestra comprensión del concepto principal mediante representación oral, escrita o gráfica.
  ✓ Participa activamente en la dinámica integrándose de forma asertiva.
  ✓ Completa el 80% o más de las actividades adaptadas con acompañamiento pedagógico.`;
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText && rawText.trim().length > 10) {
        setInclusiveAIResult(rawText);
      } else {
        setInclusiveAIResult(generateFallback());
      }
    } catch {
      setInclusiveAIResult(generateFallback());
    }
    setIsGeneratingInclusiveAI(false);
  };

  const toggleDuaCondition = (id) => {
    setDuaSelectedConditions(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleGenerateDuaAI = async () => {
    if (!duaTopic.trim()) {
      showToast('Por favor escribe un tema o instrucción de la clase.', 'warning');
      return;
    }

    const availableSubs = selectedSubjects.length > 0 ? selectedSubjects : allSubjects;
    const activeSub = duaSelectedSubject || availableSubs[0];
    const activeConditions = getDuaInclusionData(language).filter(d => duaSelectedConditions.includes(d.id));
    const conditionsStr = activeConditions.map(c => c.title).join(' + ') || (language === 'en' ? 'General UDL Inclusion' : 'Inclusión DUA General');

    setIsGeneratingDua(true);
    setDuaGeneratedResult(null);

    const systemPrompt = language === 'en'
      ? `You are a high-level specialist in Universal Design for Learning (UDL) and inclusive curricular adaptations (IEP) for school teachers. Your task is to generate a highly structured educational package for the teacher.
Respond ONLY with a valid JSON object with keys "quiz", "game", "presentation", "evaluation".
Do NOT include markdown code blocks or additional text outside the JSON.`
      : `Eres un especialista de alto nivel en Diseño Universal para el Aprendizaje (DUA) y adaptaciones curriculares inclusivas (PIAR) para docentes escolares. Tu labor es generar un paquete educativo altamente estructurado para el docente.
Responde ÚNICAMENTE con un objeto JSON válido con las claves "quiz", "game", "presentation", "evaluation".
NO incluyas bloques de código markdown ni texto adicional fuera del JSON.`;

    const userPrompt = language === 'en'
      ? `Subject: ${t?.subjects?.[activeSub.name] || activeSub.name}
Grade: ${selectedGrade}th
Conditions & Educational Needs to adapt jointly: ${conditionsStr}
Class Topic / Instruction: "${duaTopic}"

Generate 4 specific and practical adaptations in ENGLISH for the teacher:
1. "quiz": An adapted Easy Reading Quiz (2 multiple choice questions with visual reasoning).
2. "game": A recommendation for interactive web games or classroom dynamics with rules adapted to the selected conditions.
3. "presentation": A visual slide sequence with regulated times, sensory breaks, and macrotypes.
4. "evaluation": A flexible and formative rubric or evaluation method according to selected profiles.`
      : `Materia: ${activeSub.name}
Grado: ${selectedGrade}°
Condiciones y Necesidades Educativas a adaptar conjuntamente: ${conditionsStr}
Tema / Instrucción de la clase: "${duaTopic}"

Genera las siguientes 4 adaptaciones específicas y prácticas para el docente:
1. "quiz": Un Quiz o cuestionario adaptado en formato de Lectura Fácil (2 preguntas con opciones múltiples y justificación visual de respuesta).
2. "game": Una recomendación de dinámica lúdica o juego interactivo (ej. en Wordwall, Kahoot o dinámica en el aula) con reglas accesibles para las condiciones seleccionadas.
3. "presentation": Una estructura y secuencia de diapositivas / apoyos visuales con tiempos regulados, descansos sensoriales y macrotipos.
4. "evaluation": Una rúbrica o método de evaluación flexible y procesual acorde a los perfiles seleccionados.`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJsonStr = rawText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      const subTranslatedName = t?.subjects?.[activeSub.name] || activeSub.name;

      setDuaGeneratedResult({
        quiz: parsed.quiz || (language === 'en' ? `Adapted quiz for ${subTranslatedName} (${conditionsStr}).` : `Cuestionario adaptado para ${activeSub.name} (${conditionsStr}).`),
        game: parsed.game || (language === 'en' ? `Interactive playful activity adapted for ${subTranslatedName}.` : `Actividad lúdica interactiva adaptada para ${activeSub.name}.`),
        presentation: parsed.presentation || (language === 'en' ? `Accessible visual sequence for ${duaTopic}.` : `Secuencia accesible y visual para ${duaTopic}.`),
        evaluation: parsed.evaluation || (language === 'en' ? `Flexible evaluation focused on progressive achievements.` : `Evaluación flexible centrada en logros progresivos.`)
      });
      showToast(language === 'en' ? '🎉 UDL package generated successfully!' : '🎉 ¡Paquete DUA generado con éxito!', 'success');
    } catch {
      const subTranslatedName = t?.subjects?.[activeSub.name] || activeSub.name;
      if (language === 'en') {
        setDuaGeneratedResult({
          quiz: `1. What is the main concept of "${duaTopic}" in ${subTranslatedName}?\nA) Concrete option with visual support\nB) Simple step-by-step option\n\nSimultaneous adaptation for: ${conditionsStr}. Guided reading and oral reinforcement recommended.`,
          game: `Matching Game on Wordwall / Interactive Wheel: "Who knows more about ${duaTopic}?". Structured with flexible turns, extended time, and visual supports adapted to ${conditionsStr}.`,
          presentation: `4-Slide Sequence:\n1. Cover page with high contrast image and clear font.\n2. Core concept explained in 1 short sentence + pictogram.\n3. Practical daily life example.\n4. 3-minute active sensory break + Interactive closing.`,
          evaluation: `Formative evaluation through visual portfolio, guided participation, and flexible rubric without speed penalty.`
        });
        showToast('✨ UDL package adapted for your class', 'success');
      } else {
        setDuaGeneratedResult({
          quiz: `1. ¿Cuál es el concepto principal de "${duaTopic}" en ${activeSub.name}?\nA) Opción concreta con apoyo visual\nB) Opción sencilla paso a paso\n\nAdaptación simultánea para: ${conditionsStr}. Se recomienda lectura guiada y refuerzo oral.`,
          game: `Dinámica de Emparejamiento en Wordwall / Ruleta interactiva: "¿Quién sabe más sobre ${duaTopic}?". Estructurado con turnos flexibles, tiempo extendido y apoyos visuales adaptados a ${conditionsStr}.`,
          presentation: `Secuencia de 4 Diapositivas:\n1. Portada con imagen de alto contraste y tipografía clara.\n2. Idea central explicada en 1 frase corta y pictograma.\n3. Ejemplo práctico cotidiano.\n4. Pausa activa de 3 minutos + Cierre interactivo.`,
          evaluation: `Evaluación formativa mediante portafolio visual, participación guiada y rúbrica flexible sin penalización por velocidad de respuesta.`
        });
        showToast('✨ Paquete DUA adaptado para tu clase', 'success');
      }
    }
    setIsGeneratingDua(false);
  };

  const exportDuaPackageToWord = (result, topic, subject, conditions) => {
    if (!result) return;
    const condNames = conditions.map(id => getDuaInclusionData(language).find(c => c.id === id)?.title).filter(Boolean).join(', ') || (language === 'en' ? 'General Inclusion' : 'Inclusión General');
    const subName = t?.subjects?.[subject?.name] || subject?.name || 'Asignatura';

    const bodyHTML = `
      <div style="font-family: Arial, sans-serif; padding: 15px;">
        <div style="background-color: #4f46e5; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 22px;">EDUDOCENT — ${escapeHTML(language === 'en' ? 'UDL Adaptation Package' : 'Paquete de Adaptación DUA')}</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;"><strong>${escapeHTML(language === 'en' ? 'Subject' : 'Materia')}:</strong> ${escapeHTML(subName)} | <strong>${escapeHTML(language === 'en' ? 'Adapted Conditions' : 'Condiciones Adaptadas')}:</strong> ${escapeHTML(condNames)}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;"><strong>${escapeHTML(language === 'en' ? 'Topic' : 'Tema')}:</strong> ${escapeHTML(topic)}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #3b82f6; background-color: #f8fafc; border-radius: 6px;">
          <h3 style="color: #1e40af; margin-top: 0;">📝 ${escapeHTML(language === 'en' ? '1. Adapted Quiz (Easy Reading)' : '1. Quiz Adaptado (Lectura Fácil)')}</h3>
          <div style="line-height: 1.6; color: #334155;">${formatMarkdownToHTML(result.quiz)}</div>
        </div>

        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #f97316; background-color: #f8fafc; border-radius: 6px;">
          <h3 style="color: #c2410c; margin-top: 0;">🎮 ${escapeHTML(language === 'en' ? '2. Web Game / Interactive Activity' : '2. Recomendación de Juego Web / Actividad Lúdica')}</h3>
          <div style="line-height: 1.6; color: #334155;">${formatMarkdownToHTML(result.game)}</div>
        </div>

        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #a855f7; background-color: #f8fafc; border-radius: 6px;">
          <h3 style="color: #7e22ce; margin-top: 0;">🖥️ ${escapeHTML(language === 'en' ? '3. Slide Structure & Visual Sequence' : '3. Estructura para Diapositivas y Apoyos Visuales')}</h3>
          <div style="line-height: 1.6; color: #334155;">${formatMarkdownToHTML(result.presentation)}</div>
        </div>

        ${result.evaluation ? `
        <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #10b981; background-color: #f8fafc; border-radius: 6px;">
          <h3 style="color: #047857; margin-top: 0;">📊 ${escapeHTML(language === 'en' ? '4. Flexible & Formative Assessment' : '4. Evaluación Flexible y Formativa')}</h3>
          <div style="line-height: 1.6; color: #334155;">${formatMarkdownToHTML(result.evaluation)}</div>
        </div>` : ''}

        <hr style="border: none; border-top: 1px dashed #cbd5e1; margin-top: 30px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">Generado por EDUDOCENT — Herramienta de Inclusión DUA para Docentes</p>
      </div>
    `;

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Paquete_DUA_${subName}</title>
      </head>
      <body>
        ${bodyHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paquete_dua_${subName.toLowerCase().replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("📄 Paquete DUA exportado a Word (.doc) con éxito", "success");
  };

  const generateFallbackMalla = (subjectName, grade = "6", periodo = 1, instrucciones = "") => {
    const subjLower = (subjectName || '').toLowerCase();
    const pStr = String(periodo);
    const extraInst = instrucciones ? `\n\n📌 Indicaciones aplicadas: "${instrucciones}"` : '';

    if (subjLower.includes('matemát') || subjLower.includes('mate') || subjLower.includes('estad')) {
      const pData = {
        "1": {
          estandares: `• Pensamiento Numérico y Variacional (Grado ${grade}°): Justifica procedimientos de cálculo y uso de operaciones adaptadas al nivel de Grado ${grade}°.\n• Modela situaciones cuantitativas mediante expresiones algebraicas sencillas.\n• Argumenta regularidades numéricas e interrelaciones geométricas básicas.`,
          dba: `• DBA 1 (Grado ${grade}°): Utiliza propiedades numéricas para justificar algoritmos alternativos de cálculo.\n• DBA 2 (Grado ${grade}°): Reconoce y aplica representaciones gráficas de funciones en el plano cartesiano.`,
          temas: [`Conjuntos Numéricos y Operaciones (Grado ${grade}°)`, "Fundamentos de Álgebra", "Ecuaciones de Primer Grado", "Estadística Descriptiva Inicial"]
        },
        "2": {
          estandares: `• Pensamiento Espacial y Métrico (Grado ${grade}°): Resuelve problemas geométricos mediante teoremas de semejanza y congruencia.\n• Calcula áreas, volúmenes y perímetros.\n• Aplica magnitudes proporcionales.`,
          dba: `• DBA 3 (Grado ${grade}°): Modela situaciones de variación funcional usando tablas, ecuaciones y gráficas.\n• DBA 4: Aplica relaciones trigonométricas y teorema de Pitágoras en problemas de medición.`,
          temas: ["Sistemas de Ecuaciones", "Geometría Plana y Teorema de Pitágoras", "Razones y Proporciones", "Tablas de Frecuencias"]
        },
        "3": {
          estandares: `• Pensamiento Aleatorio y Sistemas de Datos (Grado ${grade}°): Interpreta datos agrupados mediante medidas de tendencia central y dispersión.\n• Diseña experimentos aleatorios sencillos.`,
          dba: `• DBA 5 (Grado ${grade}°): Sintetiza información estadística representada en histogramas y diagramas.\n• DBA 6: Determina la probabilidad de eventos simples y compuestos.`,
          temas: ["Funciones Cuadráticas", "Factorización y Productos Notables", "Probabilidad Condicional", "Geometría del Espacio"]
        },
        "4": {
          estandares: `• Integración y Modelación Matemática (Grado ${grade}°): Resuelve problemas complejos interdisciplinares usando funciones y modelado lógico.\n• Demuestra teoremas y valida soluciones.`,
          dba: `• DBA 7 (Grado ${grade}°): Plantea y resuelve problemas de modelación empleando algoritmos y tecnologías digitales.\n• DBA 8: Formula inferencias a partir del análisis de gráficos.`,
          temas: ["Ecuaciones Exponenciales y Logarítmicas", "Trigonometría Básica", "Análisis Estadístico Avanzado", "Proyecto de Aplicación Matemática"]
        }
      }[pStr] || {
        estandares: `• Estándar curricular básico para ${subjectName} (Grado ${grade}°).`,
        dba: `• DBA general de ${subjectName} para Grado ${grade}°.`,
        temas: [`Unidad Temática 1 (${subjectName})`, `Unidad Temática 2 (${subjectName})`]
      };

      return `1. Estándares Curriculares (Matemáticas - Grado ${grade}° - Periodo ${pStr}):\n${pData.estandares}${extraInst}\n\n2. Derechos Básicos de Aprendizaje (DBA):\n${pData.dba}\n\n3. Ejes Temáticos:\n${pData.temas.join(', ')}`;
    }

    if (subjLower.includes('español') || subjLower.includes('lengu') || subjLower.includes('literat') || subjLower.includes('lectura')) {
      const pData = {
        "1": {
          estandares: `• Comprensión e Interpretación Textual (Grado ${grade}°): Lee y comprende diversos tipos de textos expositivos y narrativos identificando su estructura interna.`,
          dba: `• DBA 1 (Grado ${grade}°): Caracteriza la estructura de textos narrativos, líricos y dramáticos.\n• DBA 2: Identifica la intención comunicativa y las voces presentes en un texto.`,
          temas: ["El Texto Narrativo y sus Elementos", "Categorías Gramaticales y Ortografía", "Tipologías Textuales", "Taller de Producción Escrita"]
        },
        "2": {
          estandares: `• Literatura y Contexto Cultural (Grado ${grade}°): Analiza obras literarias representativas considerando su contexto histórico y estético.`,
          dba: `• DBA 3 (Grado ${grade}°): Infiere relaciones de sentido entre obras literarias y sus contextos socioculturales.\n• DBA 4: Construye textos argumentativos organizando tesis.`,
          temas: ["Literatura Precolombina y Colonial", "El Texto Argumentativo y el Ensayo", "Semántica y Denotación", "Debates y Expresión Oral"]
        },
        "3": {
          estandares: `• Producción Textual Crítica (Grado ${grade}°): Elabora ensayos y artículos de opinión aplicando conectores lógicos y corrección gramatical.`,
          dba: `• DBA 5 (Grado ${grade}°): Emplea estrategias de revisión textual para mejorar la cohesión discursiva.\n• DBA 6: Analiza el papel de los medios de comunicación.`,
          temas: ["Literatura del Vanguardismo y Realismo Mágico", "Sintaxis Compleja", "Análisis Crítico de Medios", "Taller de Redacción Académica"]
        },
        "4": {
          estandares: `• Ética de la Comunicación y Medios (Grado ${grade}°): Asume una postura crítica frente a la información en entornos digitales.`,
          dba: `• DBA 7 (Grado ${grade}°): Interpreta el lenguaje no verbal y multimedial.\n• DBA 8: Produce textos híbridos integrando formatos digitales.`,
          temas: ["Literatura Contemporánea", "Comprensión Lectora Tipo Prueba Saber", "Lenguaje Multimedial", "Antología de Escritos Finales"]
        }
      }[pStr] || {
        estandares: `• Estándar curricular básico para ${subjectName} (Grado ${grade}°).`,
        dba: `• DBA general de ${subjectName} para Grado ${grade}°.`,
        temas: [`Unidad Temática 1 (${subjectName})`, `Unidad Temática 2 (${subjectName})`]
      };

      return `1. Estándares Curriculares (Español y Lit. - Grado ${grade}° - Periodo ${pStr}):\n${pData.estandares}${extraInst}\n\n2. Derechos Básicos de Aprendizaje (DBA):\n${pData.dba}\n\n3. Ejes Temáticos:\n${pData.temas.join(', ')}`;
    }

    if (subjLower.includes('inglés') || subjLower.includes('english')) {
      const pData = {
        "1": {
          estandares: `• Listening & Speaking (Grado ${grade}°): Comprende instrucciones sencillas en el aula y responde a preguntas personales básicas.\n• Reading: Identifica vocabulario clave en textos descriptivos.`,
          dba: `• DBA 1 (Grado ${grade}°): Exchange personal information using simple present structures.\n• DBA 2: Recognize key details in short narrative reading passages.`,
          temas: ["Personal Information & Greetings", "Present Simple & Daily Routines", "Vocabulary: School & Family", "Basic Reading Comprehension"]
        },
        "2": {
          estandares: `• Writing & Grammar (Grado ${grade}°): Escribe párrafos breves sobre pasatiempos, familia y comunidad empleando conectores básicos.`,
          dba: `• DBA 3 (Grado ${grade}°): Write short descriptions using frequency adverbs.\n• DBA 4: Participate in paired conversations about likes and dislikes.`,
          temas: ["Present Continuous & Actions", "Adjectives & Comparisons", "Food, Shopping & Quantifiers", "Short Essays & Paragraph Writing"]
        },
        "3": {
          estandares: `• Conversation & Fluency (Grado ${grade}°): Sostiene conversaciones breves sobre experiencias pasadas usando el pasado simple.`,
          dba: `• DBA 5 (Grado ${grade}°): Describe past events and personal anecdotes using simple past.\n• DBA 6: Extract specific information from audio tracks.`,
          temas: ["Past Simple Tense", "Travel & Places in the City", "Modals: Can, Must, Should", "Listening & Dictation Practice"]
        },
        "4": {
          estandares: `• Project & Synthesis (Grado ${grade}°): Presenta exposiciones orales cortas apoyadas en material gráfico sobre temas de interés global.`,
          dba: `• DBA 7 (Grado ${grade}°): Give short oral presentations expressing future plans.\n• DBA 8: Compose short formal/informal emails.`,
          temas: ["Future Tenses (Will vs Going to)", "Environment & Global Issues", "Oral Presentations & Roleplays", "Final Portfolio Review"]
        }
      }[pStr] || {
        estandares: `• Estándar curricular básico para ${subjectName} (Grado ${grade}°).`,
        dba: `• DBA general de ${subjectName} para Grado ${grade}°.`,
        temas: [`Unidad Temática 1 (${subjectName})`, `Unidad Temática 2 (${subjectName})`]
      };

      return `1. Estándares Curriculares (Inglés - Grado ${grade}° - Periodo ${pStr}):\n${pData.estandares}${extraInst}\n\n2. Derechos Básicos de Aprendizaje (DBA):\n${pData.dba}\n\n3. Ejes Temáticos:\n${pData.temas.join(', ')}`;
    }

    if (subjLower.includes('ciencias') || subjLower.includes('natural') || subjLower.includes('biolog') || subjLower.includes('físic') || subjLower.includes('químic')) {
      const pData = {
        "1": {
          estandares: `• Entorno Vivo (Grado ${grade}°): Explica la estructura celular, funciones vitales y niveles de organización de los seres vivos.\n• Indagación: Formula preguntas científicas.`,
          dba: `• DBA 1 (Grado ${grade}°): Comprende que la célula es la unidad estructural y funcional.\n• DBA 2: Explica la clasificación de los organismos en reinos.`,
          temas: ["La Célula y sus Organelos", "Tejidos Animales y Vegetales", "El Método Científico", "Prácticas de Laboratorio Inicial"]
        },
        "2": {
          estandares: `• Entorno Físico (Grado ${grade}°): Comprende las propiedades de la materia, estados de agregación y transformaciones químicas simples.`,
          dba: `• DBA 3 (Grado ${grade}°): Clasifica materiales en sustancias puras y mezclas.\n• DBA 4: Modela circuitos eléctricos sencillos.`,
          temas: ["Propiedades de la Materia y Mezclas", "Tabla Periódica y Elementos", "Fuerza, Trabajo y Energía", "Laboratorio de Separación de Mezclas"]
        },
        "3": {
          estandares: `• Entorno Ecológico y Humano (Grado ${grade}°): Analiza las relaciones tróficas en los ecosistemas y la fotosíntesis.`,
          dba: `• DBA 5 (Grado ${grade}°): Explica los flujos de energía y ciclos biogeoquímicos.\n• DBA 6: Propone acciones sustentables.`,
          temas: ["Ecosistemas y Redes Tróficas", "Ciclos Biogeoquímicos", "Impacto Ambiental y Reciclaje", "Proyectos de Conservación"]
        },
        "4": {
          estandares: `• Ciencia, Tecnología y Sociedad (Grado ${grade}°): Analiza avances biotecnológicos y éticos en la salud humana.`,
          dba: `• DBA 7 (Grado ${grade}°): Evalúa beneficios y riesgos del uso de la tecnología en la salud.\n• DBA 8: Comunica hallazgos científicos mediante modelos.`,
          temas: ["Sistemas del Cuerpo Humano y Salud", "Genética e Herencia Básica", "Biotecnología y Ética", "Feria de la Ciencia y Proyecto Final"]
        }
      }[pStr] || {
        estandares: `• Estándar curricular básico para ${subjectName} (Grado ${grade}°).`,
        dba: `• DBA general de ${subjectName} para Grado ${grade}°.`,
        temas: [`Unidad Temática 1 (${subjectName})`, `Unidad Temática 2 (${subjectName})`]
      };

      return `1. Estándares Curriculares (${subjectName} - Grado ${grade}° - Periodo ${pStr}):\n${pData.estandares}${extraInst}\n\n2. Derechos Básicos de Aprendizaje (DBA):\n${pData.dba}\n\n3. Ejes Temáticos:\n${pData.temas.join(', ')}`;
    }

    const genPData = {
      "1": {
        estandares: `• Comprende los conceptos y fundamentos esenciales de ${subjectName} (Grado ${grade}°).\n• Identifica principios clave y su aplicación en la cotidianidad.\n• Desarrolla el pensamiento crítico e indagación formativa.`,
        dba: `• DBA 1: Reconoce las características principales y estructuras conceptuales de ${subjectName} en Grado ${grade}°.\n• DBA 2: Organiza información temática mediante esquemas y cuadros comparativos.`,
        temas: [`Introducción a ${subjectName}`, "Fundamentos Teóricos y Conceptuales", "Métodos de Indagación", "Aplicaciones Prácticas"]
      },
      "2": {
        estandares: `• Analiza dinámicas interactivas y casos de estudio en ${subjectName} (Grado ${grade}°).\n• Contrasta diversas perspectivas y propone soluciones fundamentadas.`,
        dba: `• DBA 3: Explica relaciones de causa y efecto en contextos propios de ${subjectName} (Grado ${grade}°).\n• DBA 4: Modela situaciones y problemas disciplinares con claridad expresiva.`,
        temas: ["Análisis de Casos y Problemas", "Estructuras y Procesos Intermedios", "Herramientas de Trabajo", "Evaluación Formativa"]
      },
      "3": {
        estandares: `• Desarrolla proyectos de indagación e integración tecnológica en ${subjectName} (Grado ${grade}°).\n• Argumenta posturas éticas y tildes críticas fundamentadas en fuentes verídicas.`,
        dba: `• DBA 5: Sintetiza datos y evidencias para la formulación de hipótesis disciplinares en Grado ${grade}°.\n• DBA 6: Diseña alternativas creativas de solución a retos del entorno.`,
        temas: ["Sistemas Complejos e Integración", "Investigación y Proyectos Guiados", "Uso de Herramientas Digitales", "Debates y Socialización"]
      },
      "4": {
        estandares: `• Consolida competencias avanzadas y transferencia del conocimiento en ${subjectName} (Grado ${grade}°).\n• Reflexiona sobre el impacto socio-cultural e innovador de la materia.`,
        dba: `• DBA 7: Comunica síntesis y productos finales con propiedad lingüística y técnica en Grado ${grade}°.\n• DBA 8: Asume posturas reflexivas e innovadoras frente a retos del área.`,
        temas: ["Síntesis Curricular Avanzada", "Proyecto Integrador Final", "Evaluación de Cierre", "Perspectivas Futuras"]
      }
    }[pStr] || {
      estandares: `• Estándar curricular básico para ${subjectName} (Grado ${grade}°).`,
      dba: `• DBA general de ${subjectName} para Grado ${grade}°.`,
      temas: [`Unidad Temática 1 (${subjectName})`, `Unidad Temática 2 (${subjectName})`]
    };

    return `1. Estándares Curriculares (${subjectName} - Grado ${grade}° - Periodo ${pStr}):\n${genPData.estandares}${extraInst}\n\n2. Derechos Básicos de Aprendizaje (DBA):\n${genPData.dba}\n\n3. Ejes Temáticos:\n${genPData.temas.join(', ')}`;
  };

  const generateFallbackUnidad = (subjectName, grade = "6", instrucciones = "") => {
    const customInst = instrucciones ? ` (Enfoque: ${instrucciones})` : '';

    return {
      titulo: `Unidad Didáctica de Aprendizaje Significativo: ${subjectName} (Grado ${grade}°)${customInst}`,
      objetivos: `• Comprender los núcleos esenciales y aplicabilidad práctica de ${subjectName} en Grado ${grade}°.\n• Desarrollar habilidades socioemocionales y pensamiento crítico mediante el trabajo colaborativo.\n• Implementar estrategias pedagógicas activas y diferenciadas para fortalecer la autonomía del estudiante.`,
      actividades: `📌 SECUENCIA DIDÁCTICA COMPLETA (Grado ${grade}°):\n\n1. INICIO (Motivación y Saberes Previos - 15 min):\n- Dinámica rompehielos interactiva y lluvia de ideas guiada.\n- Pregunta problematizadora del día para despertar la curiosidad intelectual.\n\n2. DESARROLLO (Construcción del Conocimiento - 50 min):\n- Exposición dialogada con apoyo de recursos audiovisuales e infografías.\n- Trabajo en equipos de 4 estudiantes para resolver un taller guiado o estudio de caso.\n- Acompañamiento docente diferenciado (atención a ritmos diversos de aprendizaje).\n\n3. CIERRE (Metacognición y Evaluación - 25 min):\n- Plenaria de socialización con ruleta de preguntas o mapa mental relámpago.\n- Ticket de salida reflexivo: "¿Qué aprendí hoy y cómo lo aplico?".\n\n4. RÚBRICA DE EVALUACIÓN FORMATIVA:\n- Criterio Cognitivo (40%): Dominio de conceptos y razonamiento lógico.\n- Criterio Procedimental (40%): Calidad de talleres, participación activa y entregables.\n- Criterio Actitudinal (20%): Respeto, colaboración y puntualidad.`
    };
  };

  const handleGenerarMallaIA = async (documentoBase, instrucciones) => {
    setIsGeneratingInclusiveAI(true);
    const subjName = activeMallaSubject?.name || (selectedSubjects[0] || allSubjects[0]).name;
    const key = `${subjName}_g${selectedGrade}`;
    const contextoAdicional = `Materia: ${subjName} | Periodo: ${mallaTab} | Grado: ${selectedGrade}°`;

    let userPrompt;
    let systemPrompt;

    if (!documentoBase && !instrucciones) {
      userPrompt = `Materia y Periodo: ${contextoAdicional}. Genera una Malla Curricular específica para la asignatura de ${subjName} en el periodo ${mallaTab} para Grado ${selectedGrade}°, creando temas, estándares y DBA desde cero de acuerdo a los lineamientos educativos oficiales.`;
      systemPrompt = `Eres un coordinador académico experto. Tu misión es aligerar la carga del docente. Crea una Malla Curricular completa desde cero para la materia especificada. Responde ÚNICAMENTE con un JSON: { "estandares": "...", "dba": "...", "temas": ["..."] }. No incluyas markdown ni nada más, solo JSON válido.`;
    } else {
      userPrompt = `Material adjunto: ${documentoBase} | Instrucciones del profe: ${instrucciones} | Contexto: ${contextoAdicional}`;
      systemPrompt = `Eres un coordinador académico experto. Tu misión es aligerar la carga del docente. Responde ÚNICAMENTE con un JSON: { "estandares": "...", "dba": "...", "temas": ["..."] }. No incluyas markdown ni nada más, solo JSON válido.`;
    }

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJsonStr = rawText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);

      const temasStr = Array.isArray(parsedData.temas) ? parsedData.temas.join(', ') : parsedData.temas;
      const newMallaText = `1. Estándares (${subjName} - Grado ${selectedGrade}° - Periodo ${mallaTab}):\n${parsedData.estandares}\n\n2. Derechos Básicos de Aprendizaje (DBA):\n${parsedData.dba}\n\n3. Ejes Temáticos:\n${temasStr}`;

      setMallaData(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [`p${mallaTab}`]: newMallaText
        }
      }));

      setIsGeneradorModalOpen(false);
      showToast('Éxito', `Malla curricular para ${subjName} (Grado ${selectedGrade}°) generada automáticamente.`, 'success');
    } catch (e) {
      const fallbackText = generateFallbackMalla(subjName, selectedGrade, mallaTab, instrucciones);
      setMallaData(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [`p${mallaTab}`]: fallbackText
        }
      }));
      setIsGeneradorModalOpen(false);
      showToast('Éxito', `Malla curricular para ${subjName} (Grado ${selectedGrade}°) estructurada con éxito.`, 'success');
    }
    setIsGeneratingInclusiveAI(false);
  };

  const handleGenerarUnidadIA = async (documentoBase, instrucciones) => {
    if (!activeUnitSubject) {
      showToast('Aviso', 'Selecciona una materia primero.', 'warning');
      return;
    }

    setIsGeneratingInclusiveAI(true);
    const subjName = activeUnitSubject.name;
    const key = `${subjName}_g${selectedGrade}`;
    const contextoAdicional = `Materia: ${subjName} | Grado: ${selectedGrade}°`;

    let userPrompt;
    let systemPrompt;

    if (!documentoBase && !instrucciones) {
      userPrompt = `Materia y Grado: ${contextoAdicional}. Genera una Unidad Didáctica completa y estándar para esta materia y grado, creando los temas y actividades desde cero de acuerdo a los recursos y estándares educativos generales.`;
      systemPrompt = `Eres un coordinador académico experto. Tu misión es aligerar la carga del docente. Crea una Unidad Didáctica completa desde cero basándote en la materia y grado proporcionados. Responde ÚNICAMENTE con un JSON: { "titulo": "...", "objetivos": "...", "secuencia_didactica": "Inicio, Desarrollo, Cierre..." }. No incluyas markdown ni nada más, solo JSON válido.`;
    } else {
      userPrompt = `Material adjunto: ${documentoBase} | Instrucciones del profe: ${instrucciones} | Materia y Grado: ${contextoAdicional}`;
      systemPrompt = `Eres un coordinador académico experto. Tu misión es aligerar la carga del docente. Si recibes material base, DEBES adaptarlo y mejorarlo según los recursos del profesor. Si es una Unidad Didáctica, responde ÚNICAMENTE con un JSON: { "titulo": "...", "objetivos": "...", "secuencia_didactica": "Inicio, Desarrollo, Cierre..." }. No incluyas markdown ni nada más, solo JSON válido.`;
    }

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJsonStr = rawText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);

      setUnidadesData(prev => ({
        ...prev,
        [key]: {
          titulo: parsedData.titulo || `Unidad Didáctica de ${subjName} (Grado ${selectedGrade}°)`,
          objetivo: parsedData.objetivos || 'Desarrollar competencias disciplinares fundamentales.',
          actividades: parsedData.secuencia_didactica || 'Secuencia didáctica por fases (Inicio, Desarrollo y Cierre).'
        }
      }));

      setIsGeneradorModalOpen(false);
      showToast('Éxito', `Unidad didáctica para ${subjName} (${selectedGrade}°) generada automáticamente.`, 'success');
    } catch (e) {
      const fallbackUnit = generateFallbackUnidad(subjName, selectedGrade, instrucciones);
      setUnidadesData(prev => ({
        ...prev,
        [key]: {
          titulo: fallbackUnit.titulo,
          objetivo: fallbackUnit.objetivos,
          actividades: fallbackUnit.actividades
        }
      }));
      setIsGeneradorModalOpen(false);
      showToast('Éxito', `Unidad didáctica estructurada para ${subjName} (${selectedGrade}°).`, 'success');
    }
    setIsGeneratingInclusiveAI(false);
  };


  // Efecto para controlar la animación y salida de la Splash Screen de inicio
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true); // Inicia transición de desvanecimiento
    }, 2500);

    const removeTimer = setTimeout(() => {
      setShowSplash(false); // Retira completamente la pantalla de inicio
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setView('register');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const startAuthFlow = (provider, flowType) => {
    setAuthMethod(provider);
    setPendingFlowType(flowType);
    setFormData({ identifier: '', password: '', socialUser: '' });
    setError('');
    setView('authForm');
  };

  const handleSendVerificationCode = () => {
    setError('');
    const inputVal = (formData?.identifier || '').trim();
    
    if (!inputVal || inputVal.length < 2) {
      setError(t.invalidEmailError);
      return;
    }

    if (authMethod === 'google' && !inputVal.includes('@')) {
      setError('Para Google, ingresa una cuenta de correo válida (ej: usuario@gmail.com)');
      return;
    }

    if (authMethod === 'apple' && !inputVal.includes('@')) {
      setError(t.appleErrorFormat);
      return;
    }

    if (!formData?.password || formData.password.length < 6) {
      setError(t.invalidPasswordError);
      return;
    }

    let targetEmail = inputVal;
    if (!inputVal.includes('@')) {
      targetEmail = `${inputVal.toLowerCase()}@${authMethod}.com`;
    }

    const name = inputVal.split('@')[0] || 'Docente';
    setUserName(name);
    setPendingAuthEmail(targetEmail);

    const pin = generateSecurePin();
    setCurrent2faPin(pin);
    setIs2FAModalOpen(true);
    send2faEmail(targetEmail, pin, showToast, t);
  };

  const handleResendPinCode = () => {
    const newPin = generateSecurePin();
    setCurrent2faPin(newPin);
    send2faEmail(pendingAuthEmail, newPin, showToast, t);
  };

  const handle2FAVerified = (pin) => {
    setIs2FAModalOpen(false);
    showToast(t.pinSuccessToast, 'success');
    if (pendingFlowType === 'register') {
      setSurveySubjects([]);
      setSurveyTheme('blue');
      setSurveyStep(1);
      setView('survey');
    } else {
      setView('welcome');
    }
  };

  const handleSurveyNextStep = () => {
    if (surveyStep === 1 && surveySubjects.length === 0) {
      showToast("Selecciona al menos una materia", "error");
      return;
    }
    setSurveyStep(prev => prev + 1);
  };

  // Función para seleccionar o deseleccionar todas las asignaturas
  const handleToggleSelectAllSubjects = () => {
    if (surveySubjects.length === allSubjects.length) {
      setSurveySubjects([]);
      showToast("Todas las materias desmarcadas", "error");
    } else {
      setSurveySubjects([...allSubjects]);
      showToast("¡Todas las materias seleccionadas!", "success");
    }
  };

  // Función para seleccionar/deseleccionar materias de la encuesta individualmente
  const handleToggleSurveySubject = (subject) => {
    if (surveySubjects.some(s => s.name === subject.name)) {
      setSurveySubjects(surveySubjects.filter(s => s.name !== subject.name));
    } else {
      setSurveySubjects([...surveySubjects, subject]);
    }
  };

  const handleCompleteSurvey = () => {
    if (surveySubjects.length === 0) {
      showToast("Selecciona al menos una materia", "error");
      return;
    }
    setSelectedSubjects(surveySubjects);
    setAppThemeColor(surveyTheme);

    // PRE-POBLAR HORARIO ADAPTATIVO
    const mockSchedule = {};
    const sampleDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    let subjectIndex = 0;
    sampleDays.forEach((day, dIdx) => {
      const activeHours = dIdx % 2 === 0 ? ["08:00", "10:00", "11:00"] : ["07:00", "09:00"];
      activeHours.forEach((hour) => {
        const currentSubject = surveySubjects[subjectIndex % surveySubjects.length];
        const randomGrade = grades[(dIdx + parseInt(hour)) % grades.length];
        mockSchedule[`${day}-${hour}`] = `Grado ${randomGrade}° - ${currentSubject.name}`;
        subjectIndex++;
      });
    });

    setScheduleConfig(mockSchedule);
    setView('welcome');
    showToast("¡Perfil adaptado y configurado con éxito!", "success");
  };

  const handleLogout = () => {
    setView('register');
    setCurrentSlide(0);
    setFormData({ identifier: '', password: '', socialUser: '' });
    setUserName('');
    setScheduleConfig({});
    setSelectedSubjects([]);
    setUnidadesData({});
    setActiveUnitSubject(null);
  };



  // Función para generar guía con IA
  const handleGenerateAIGuide = async () => {
    if (!selectedSubject) return;
    setIsGeneratingGuide(true);
    setGeneratedGuide(null);

    const prompt = `Genera una guía didáctica estructurada y lista para usar en el aula de clases para la asignatura de "${selectedSubject.name}" en el grado "${selectedGrade}°" correspondiente al PERIODO ESCOLAR ${selectedPeriod}. 
    El tema debe estar perfectamente alineado con los Derechos Básicos de Aprendizaje (DBA) de este nivel académico para dicho periodo. 
    Estructura la guía con las siguientes secciones obligatorias:
    1. TÍTULO DE LA GUÍA (Tema específico del Periodo ${selectedPeriod} de forma creativa)
    2. PROPÓSITO DE APRENDIZAJE / DBA
    3. ACTIVIDAD DE EXPLORACIÓN / DINÁMICA DE INICIO (10 min de introducción lúdica o pregunta orientadora)
    4. DESARROLLO TEÓRICO COMPACTO (Explicación conceptual clara para los alumnos)
    5. TALLER PRÁCTICO EN CLASE (3 preguntas o problemas desafiantes)
    6. CRITERIO DE EVALUACIÓN Y COGNICIÓN`;

    const instructions = "Eres un planificador curricular experto para colegios de Latinoamérica. Redactas de forma muy clara, inspiradora y metodológicamente impecable.";

    const aiResponse = await fetchAIResponse(prompt, instructions);
    setGeneratedGuide(aiResponse);
    setIsGeneratingGuide(false);
    showToast("¡Guía didáctica inteligente creada!", "success");
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      showToast("Documento cargado correctamente", "success");
    }
  };

  const simulateAIAnalysis = () => {
    if (!fileName) return setError("Sube un archivo primero.");
    setIsAnalyzingSchedule(true);
    setAiStatusMessage("Leyendo documento PDF...");

    setTimeout(() => setAiStatusMessage("Extrayendo carga académica..."), 1200);
    setTimeout(() => setAiStatusMessage("Optimizando franjas horarias..."), 2500);

    setTimeout(() => {
      setScheduleConfig({
        "Lunes-07:00": "Grado 6° - Comprensión Lectora",
        "Lunes-08:00": "Grado 9° - Taller de Redacción",
        "Martes-09:00": "Grado 11° - Preparación Pruebas Saber",
        "Miércoles-07:00": "Grado 7° - Literatura Clásica",
        "Jueves-10:00": "Grado 10° - Oratoria y Debate",
        "Viernes-08:00": "Grado 8° - Evaluación Semanal"
      });
      setIsAnalyzingSchedule(false);
      setAiStatusMessage("");
      showToast("¡Horario generado con IA exitosamente!", "success");
    }, 4000);
  };

  const loadSampleSchedule = () => {
    setFileName("Horario_Institucional_Ejemplo.pdf");
    setScheduleConfig({
      "Lunes-07:00": "Grado 6° - Comprensión Lectora",
      "Lunes-08:00": "Grado 9° - Taller de Redacción",
      "Lunes-10:00": "Grado 11° - Preparación Pruebas Saber",
      "Martes-07:00": "Grado 8° - Gramática y Sintaxis",
      "Martes-09:00": "Grado 10° - Oratoria y Debate",
      "Martes-11:00": "Grado 7° - Ortografía Práctica",
      "Miércoles-07:00": "Grado 7° - Literatura Clásica",
      "Miércoles-08:00": "Grado 6° - Producción Textual",
      "Miércoles-10:00": "Grado 9° - Análisis Literario",
      "Jueves-08:00": "Grado 11° - Lectura Crítica Avanzada",
      "Jueves-10:00": "Grado 10° - Ensayo Argumentativo",
      "Viernes-07:00": "Grado 8° - Evaluación Semanal",
      "Viernes-09:00": "Grado 6° - Club de Lectura"
    });
    showToast("✨ Horario de ejemplo cargado exitosamente", "success");
  };

  const handleDownloadCertificate = () => {
    const certTitle = activeReward ? activeReward.name : "Certificado Oficial";
    const certText = `====================================================
                        EDUDOCENT
               CERTIFICADO DE RECONOCIMIENTO
====================================================

Se otorga el presente certificado a:
Prof. ${userName || 'Docente de Aula'}

Por su dedicación constante, alcanzando una racha de
${activeReward ? activeReward.days : 7} días consecutivos planificando clases con IA.

¡Felicidades por ser un líder de innovación pedagógica!

Fecha: ${new Date().toLocaleDateString()}
Código de verificación: ED-${Math.floor(100000 + Math.random() * 900000)}

====================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Certificado_EDUDOCENT_${userName || 'Docente'}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("¡Certificado descargado con éxito!", "success");
  };

  const handleSaveAccountSettings = () => {
    if (!accountUsername.trim()) {
      return showToast("El nombre del docente no puede estar vacío.", "error");
    }
    if (!accountEmail.trim() || !accountEmail.includes('@')) {
      return showToast("Por favor ingresa un correo electrónico válido.", "error");
    }
    if (newPasswordInput && newPasswordInput.length < 6) {
      return showToast("La nueva contraseña debe tener al menos 6 caracteres.", "error");
    }
    if (newPasswordInput && newPasswordInput !== confirmPasswordInput) {
      return showToast("Las contraseñas no coinciden.", "error");
    }

    setUserName(accountUsername.trim());
    if (newPasswordInput) {
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      showToast("¡Nombre, correo y contraseña actualizados con éxito!", "success");
    } else {
      showToast("¡Datos de perfil y correo actualizados con éxito!", "success");
    }
  };

  const handleGuardarMalla = () => {
    const currentSubj = activeMallaSubject || selectedSubjects[0] || allSubjects[0];
    const subjName = currentSubj?.name || "Asignatura";
    const key = `${subjName}_g${selectedGrade}`;
    const currentSubjMalla = mallaData[key] || mallaData[subjName] || {};

    const p1 = currentSubjMalla.p1 || '';
    const p2 = currentSubjMalla.p2 || '';
    const p3 = currentSubjMalla.p3 || '';
    const p4 = currentSubjMalla.p4 || '';

    if (!p1 && !p2 && !p3 && !p4) {
      return showToast(`No hay contenido en la malla de ${subjName} (${selectedGrade}°) para exportar`, "warning");
    }

    const rows = [
      ["MATERIA", "GRADO", "PERIODO", "CONTENIDO MALLA CURRICULAR"],
      [`"${subjName}"`, `"${selectedGrade}°"`, '"Periodo 1"', `"${p1.replace(/"/g, '""')}"`],
      [`"${subjName}"`, `"${selectedGrade}°"`, '"Periodo 2"', `"${p2.replace(/"/g, '""')}"`],
      [`"${subjName}"`, `"${selectedGrade}°"`, '"Periodo 3"', `"${p3.replace(/"/g, '""')}"`],
      [`"${subjName}"`, `"${selectedGrade}°"`, '"Periodo 4"', `"${p4.replace(/"/g, '""')}"`]
    ];

    exportToCSV(`Malla_Curricular_${subjName.replace(/\s+/g, '_')}_Grado_${selectedGrade}.csv`, rows);
    showToast(`📄 Malla curricular de ${subjName} (${selectedGrade}°) exportada en CSV`, "success");
  };

  const handleGuardarUnidad = () => {
    const currentSubj = activeUnitSubject || selectedSubjects[0] || allSubjects[0];
    if (!currentSubj) return;
    const subjectName = currentSubj.name;
    const key = `${subjectName}_g${selectedGrade}`;
    const data = unidadesData[key] || unidadesData[subjectName] || {};

    if (!data.titulo) return showToast(`Falta el título de la unidad para ${subjectName} (${selectedGrade}°)`, "error");

    const rows = [
      ["MATERIA", "GRADO", "TÍTULO DE LA UNIDAD", "RESULTADOS DE APRENDIZAJE", "SECUENCIA DIDÁCTICA"],
      [
        `"${subjectName}"`,
        `"${selectedGrade}°"`,
        `"${(data.titulo || '').replace(/"/g, '""')}"`,
        `"${(data.objetivo || '').replace(/"/g, '""')}"`,
        `"${(data.actividades || '').replace(/"/g, '""')}"`
      ]
    ];
    exportToCSV(`Unidad_Didactica_${subjectName.replace(/\s+/g, '_')}_Grado_${selectedGrade}.csv`, rows);
    showToast(`📄 Unidad didáctica de ${subjectName} (${selectedGrade}°) exportada en CSV`, "success");
  };

  const handleGuardarPlaneacion = () => {
    if (Object.keys(scheduleConfig).length === 0) return showToast("No hay horario para exportar", "error");

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EDUDOCENT//Planeacion//ES\n";
    const getNextDayDate = (dayIndex) => {
      const d = new Date();
      d.setDate(d.getDate() + ((dayIndex + 7 - d.getDay()) % 7));
      return d;
    };
    const dayMap = { "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5 };

    hours.forEach(hour => {
      days.forEach(day => {
        const slotKey = `${day}-${hour}`;
        const gradeInfo = scheduleConfig[slotKey];
        const userNote = notes[slotKey];
        if (gradeInfo || userNote) {
          const dayIndex = dayMap[day];
          if (!dayIndex) return;
          const date = getNextDayDate(dayIndex);
          const [h, m] = hour.split(':');
          const startDate = new Date(date);
          startDate.setHours(parseInt(h), parseInt(m), 0);
          const endDate = new Date(startDate);
          endDate.setHours(startDate.getHours() + 1);
          const formatDateToICS = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z";
          icsContent += "BEGIN:VEVENT\n";
          icsContent += `DTSTART:${formatDateToICS(startDate)}\n`;
          icsContent += `DTEND:${formatDateToICS(endDate)}\n`;
          icsContent += `SUMMARY:${gradeInfo || 'Clase Asignada'}\n`;
          icsContent += `DESCRIPTION:${userNote ? userNote.replace(/\n/g, '\\n') : 'Planificación generada por EDUDOCENT'}\n`;
          icsContent += "END:VEVENT\n";
        }
      });
    });
    icsContent += "END:VCALENDAR";
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Horario_Academico.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Calendario descargado (ICS)", "success");
  };

  const handleActivarNotificaciones = async () => {
    if (!("Notification" in window)) {
      return showToast("Tu navegador no soporta notificaciones.", "error");
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("EDUDOCENT", { body: "Las alertas de tus clases están activadas." });
      showToast("Notificaciones habilitadas", "success");
    }
  };

  // Método inteligente para obtener la clase actual o siguiente del día de hoy
  const getNextClassInfo = () => {
    const daysSpanish = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const todayName = daysSpanish[new Date().getDay()];

    if (Object.keys(scheduleConfig).length === 0) {
      return { status: 'empty', label: 'Sin Horario', text: 'Cargar horario con IA ⚙' };
    }

    const todaySlots = Object.keys(scheduleConfig)
      .filter(key => key.startsWith(todayName))
      .sort();

    if (todaySlots.length === 0) {
      return { status: 'free', label: 'Día Libre', text: 'Sin clases hoy. ¡Relájate! ✨' };
    }

    const firstActiveSlot = todaySlots[0];
    const time = firstActiveSlot.split('-')[1];
    const className = scheduleConfig[firstActiveSlot];

    return {
      status: 'active',
      label: `Clase Hoy - ${time}`,
      text: className
    };
  };

  // Obtener el plan de mejora adaptativo correspondiente al Onboarding
  const getImprovementPlanData = () => {
    const motivationInfo = {
      ...(t?.plans?.motivations?.[motivationText] || {
        title: t?.defaultMotivationTitle || "Desarrollo de Competencias Integrales 👩‍🏫",
        tip: t?.defaultMotivationTip || "Configura tu entorno de trabajo ideal para mejorar la asimilación del currículo de forma asertiva."
      })
    };

    const frustrationInfo = {
      ...(t?.plans?.frustrations?.[frustrationText] || {
        title: t?.defaultFrustrationTitle || "Optimización Pedagógica Inteligente 🚀",
        tip: t?.defaultFrustrationTip || "Utiliza tu asistente inteligente Mentor IA para redactar guías y disminuir un 40% el tiempo de preparación."
      })
    };

    if (frustrationText === 'recursos') frustrationInfo.actionView = "materials";
    if (frustrationText === 'horario') frustrationInfo.actionView = "planning";
    if (frustrationText === 'atencion') frustrationInfo.actionView = "chatbot";
    if (frustrationText === 'planeacion') frustrationInfo.actionView = "mallas";

    return { motivation: motivationInfo, frustration: frustrationInfo };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;
    const userText = inputText;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);
    const aiResponse = await fetchAIResponse(userText);
    setChatMessages(prev => [...prev, { role: 'bot', text: aiResponse }]);
    setIsTyping(false);
  };

  const generateFallbackAIChatResponse = (userQuery, forceLanguage = null) => {
    const activeLang = forceLanguage || language || 'es';
    const queryLower = (userQuery || '').toLowerCase().trim();
    
    // Auto-detect English query if explicitly in English or active language is English
    const isEnglishQuery = /^(hello|hi|hey|good morning|good afternoon|how|what|can you|help|lesson|rubric|teacher|student|class|plan|grade)/i.test(queryLower);
    const isEn = activeLang === 'en' || isEnglishQuery;

    // 1. Greetings
    if (/^(hola|hello|hi|hey|buenos dias|buenas tardes|good morning|good afternoon|saludos|que tal|how are you)/i.test(queryLower)) {
      if (isEn) {
        return `### 👋 Hello! Welcome to EDUDOCENT AI

I am your specialized teaching assistant. How can I help you today?

#### 💡 Here are some key areas I can assist you with:
* 📋 **Lesson Planning:** Designing structured units, class goals, and learning activities.
* 📊 **Rubrics & Assessment:** Creating evaluation rubrics with custom criteria and performance scales.
* 🤝 **Classroom Management:** Socio-emotional strategies, handling student behavior, and active learning dynamics.
* 🎬 **Digital Resources:** Creating interactive videos, presentations, and educational content.

*What topic, subject, or grade level are you preparing for today?*`;
      }
      return `### 👋 ¡Hola! Bienvenido a EDUDOCENT IA

Soy tu asistente pedagógico especializado. ¿En qué te puedo ayudar hoy?

#### 💡 Algunas áreas en las que te puedo apoyar:
* 📋 **Planeación de Clases:** Diseñar secuencias didácticas, mallas curriculares y objetivos.
* 📊 **Rúbricas y Evaluación:** Crear instrumentos de evaluación formativa y escalas de desempeño.
* 🤝 **Gestión de Aula:** Estrategias de convivencia socioemocional y dinámicas participativas.
* 🎬 **Recursos y Tecnología:** Integración de videos educativos, presentaciones y guías interactivas.

*¿Sobre qué tema, asignatura o grado escolar deseas consultar hoy?*`;
    }

    // 2. Videos / Multimedia
    if (queryLower.includes('video') || queryLower.includes('multimedia') || queryLower.includes('youtube') || queryLower.includes('crear') || queryLower.includes('media')) {
      if (isEn) {
        return `### 🎬 Pedagogical Guide for Integrating Educational Videos

Audio-visual resources enhance conceptual retention and visual engagement when structured properly.

#### 📍 1. Recommended Video Structure (3 to 5 min):
* **Hook & Intro (30 sec):** Initial challenge or intriguing real-world question.
* **Core Development (2.5 min):** Concise explanation broken into 3 key visual points.
* **Closure & Challenge (1 min):** Reflective question urging students to perform a practical task.

#### 🛠️ 2. Recommended Teacher Tools:
* **Canva Edu / Loom:** Screen recording with your webcam and clear slides.
* **Edpuzzle:** Adding automatic subtitles and interactive questions inside videos.

#### 💡 3. Flipped Classroom Strategy:
Assign the video as pre-class prep and spend class time on collaborative group projects!`;
      }
      return `### 🎬 Guía Pedagógica para la Creación e Integración de Videos Educativos

¡Excelente iniciativa! El recurso audiovisual estimula la retención conceptual y el pensamiento visual.

#### 📍 1. Estructura Sugerida para el Video (3 a 5 min):
* **Introducción (30 seg):** Gancho inicial con un dato curioso o pregunta problematizadora sobre el tema.
* **Desarrollo (2.5 min):** Explicación sintética dividida en 3 puntos clave con ejemplos cotidianos.
* **Cierre y Reto (1 min):** Pregunta reflexiva y llamado a realizar una actividad práctica o responder en clase.

#### 🛠️ 2. Herramientas Recomendadas para Docentes:
* **Canva Edu / Loom:** Para grabar pantalla con tu cámara y diapositivas claras.
* **CapCut / Edpuzzle:** Para añadir subtítulos automáticos y preguntas interactivas dentro del video.

#### 💡 3. Estrategia Didáctica en el Aula:
* **Clase Invertida (Flipped Classroom):** Envía el video como material previo y aprovecha el tiempo de clase para proyectos grupales y resolución de dudas.`;
    }

    // 3. Classroom Management / Behavior / Discipline
    if (queryLower.includes('responde') || queryLower.includes('grosero') || queryLower.includes('feo') || queryLower.includes('disciplina') || queryLower.includes('comportamiento') || queryLower.includes('conducta') || queryLower.includes('niño') || queryLower.includes('estudiante') || queryLower.includes('behavior') || queryLower.includes('discipline') || queryLower.includes('student')) {
      if (isEn) {
        return `### 🤝 Socio-Emotional Classroom Management Strategy

Addressing challenging classroom behavior requires a balance of empathy, clarity, and firm boundaries.

#### 📍 Recommended Steps:

1. **Immediate De-escalation (Avoid Public Conflict):**
   * Maintain a calm, neutral voice.
   * Say: *"I see you are upset, but we will talk about this privately at the end of class so we don't interrupt your classmates."*

2. **Restorative Private Dialogue:**
   * **Active listening:** *"I noticed you were frustrated earlier. Did something happen before class or is something overwhelming you?"*
   * **Clear boundaries:** *"It is okay to feel frustrated, but disrespecting teachers or peers is not acceptable."*

3. **Actionable Commitments:**
   * Ask the student to pick a self-regulation strategy for next time (e.g., requesting a 1-minute breather card).

4. **Institutional Support Network:**
   * If behavior persists, document observations and coordinate with school counseling.`;
      }
      return `### 🤝 Estrategia de Manejo de Aula y Convivencia Socioemocional

Entiendo lo desafiante que puede ser enfrentar respuestas reactivas o irrespetuosas en clase. Detrás de una respuesta impulsiva suele haber una necesidad socioemocional no resuelta.

#### 📍 Pasos de Intervención Recomendados:

1. **Desescalar en el momento (No engancharse en público):**
   * Mantén la calma y un tono de voz firme pero pausado.
   * Evita discutir frente al grupo. Responde de forma neutra: *"Entiendo que estés molesto, pero conversaremos de esto en privado al finalizar la clase para no pausar la lección de tus compañeros."*

2. **Diálogo Privado con Enfoque Restaurativo:**
   * **Escucha activa:** *"Noté que respondiste con molestia. ¿Pasó algo hoy antes de entrar a clase o hay algo que te esté abrumando?"*
   * **Establecer el límite claro:** *"Está bien sentir frustración, pero no es aceptable dirigirte de esa manera a tus docentes o compañeros."*

3. **Acuerdos y Compromiso:**
   * Pídele al estudiante que proponga una alternativa para la próxima vez que se sienta frustrado (ej: pedir un minuto de pausa o usar una tarjeta de autorregulación).

4. **Red de Apoyo Institucional:**
   * Si la conducta es recurrente, registra el seguimiento pedagógico e involucra a Psicorientación y a la familia con una ruta formativa.`;
    }

    // 4. Lesson Planning / Mallas / Syllabi / Class Plans
    if (queryLower.includes('plan') || queryLower.includes('clase') || queryLower.includes('lesson') || queryLower.includes('malla') || queryLower.includes('syllabus') || queryLower.includes('unidad') || queryLower.includes('unit')) {
      if (isEn) {
        return `### 📋 Lesson Planning & Curriculum Design Guide

Here is a recommended 4-phase framework for designing effective learning sessions:

#### 📍 1. Learning Objectives & Standards:
* Define what students will **know**, **understand**, and **perform** by the end of the lesson.

#### 🚀 2. Lesson Phases (60-90 min):
* **Activation (10 min):** Problem-solving challenge or thought-provoking prompt.
* **Guided Practice & Collaboration (40 min):** Small group activities, case studies, or hands-on challenges.
* **Synthesis & Closure (10 min):** Exit ticket or student self-reflection.

#### 📊 3. Formative Checks:
* Use quick check-ins (e.g. exit tickets, summary cards) to monitor real-time comprehension.

*Would you like me to generate a complete lesson plan for a specific subject or grade level?*`;
      }
      return `### 📋 Guía de Planeación Didáctica y Diseño Curricular

Te propongo la siguiente estructura en 4 fases para diseñar sesiones de aprendizaje de alto impacto:

#### 📍 1. Objetivos e Indicadores de Logro:
* Define con claridad qué deben **saber**, **comprender** y **hacer** los estudiantes.

#### 🚀 2. Momentos de la Clase (60-90 min):
* **Activación (10 min):** Desafío inicial o pregunta provocadora.
* **Práctica Guiada y Colaboración (40 min):** Tareas en equipo, estudio de casos o retos prácticos.
* **Síntesis y Cierre (10 min):** Ticket de salida o autoevaluación guiada.

#### 📊 3. Verificación Formativa:
* Utiliza revisiones rápidas para ajustar la enseñanza en tiempo real.

*¿Te gustaría que elaboremos un plan de clase completo para una asignatura o grado en particular?*`;
    }

    // 5. Rubrics & Assessment
    if (queryLower.includes('rubrica') || queryLower.includes('rubric') || queryLower.includes('evaluac') || queryLower.includes('assessment') || queryLower.includes('grade') || queryLower.includes('grading') || queryLower.includes('calific')) {
      if (isEn) {
        return `### 📊 Formative Evaluation & Rubric Design

Here is a multi-level analytical rubric template for classroom projects:

| Criteria | Advanced (4) | Proficient (3) | Developing (2) | Needs Support (1) |
| :--- | :--- | :--- | :--- | :--- |
| **Conceptual Mastery** | Thoroughly masters concepts and links to real-world context. | Understands core concepts with minor gaps. | Identifies basic ideas with guidance. | Shows difficulty understanding key concepts. |
| **Application & Practice** | Applies knowledge to solve complex novel tasks. | Successfully completes standard exercises. | Completes simple tasks with support. | Struggles to execute practical tasks. |
| **Communication** | Expresses ideas clearly with precise domain terms. | Communicates effectively with minor errors. | Basic communication using simple terms. | Unclear or confusing presentation. |

#### 💡 Tip for Teachers:
Share this rubric with your students before starting the activity to boost self-directed learning!`;
      }
      return `### 📊 Diseño de Rúbricas y Evaluación Formativa

A continuación te comparto una plantilla de rúbrica analítica por niveles de desempeño:

| Criterios | Avanzado (4) | Satisfactorio (3) | En Desarrollo (2) | Requiere Apoyo (1) |
| :--- | :--- | :--- | :--- | :--- |
| **Dominio Conceptual** | Domina los conceptos y los conecta con el contexto real. | Comprende las ideas clave con mínimos vacíos. | Identifica ideas básicas con orientación. | Muestra dificultad para comprender conceptos. |
| **Aplicación Práctica** | Aplica el conocimiento en situaciones complejas. | Resuelve ejercicios estándar con éxito. | Completa tareas simples con ayuda. | Dificultad para ejecutar actividades. |
| **Comunicación** | Argumenta con claridad y vocabulario disciplinar. | Comunica ideas correctamente con imprecisiones. | Uso básico del vocabulario. | Exposición confusa de ideas. |

#### 💡 Consejo Docente:
¡Comparte esta rúbrica con tus estudiantes antes de iniciar la actividad para potenciar la autoevaluación!`;
    }

    // 6. Default response
    if (isEn) {
      return `### 💡 EDUDOCENT Pedagogical Guidance

Thank you for your question: **"${userQuery}"**. Here is a recommended instructional pathway to address this in your classroom:

1. **Diagnosis & Contextualization:** Identify students' prior knowledge and learning paces to adapt your strategy.
2. **Active Methodology:** Incorporate collaborative dynamics, case studies, or challenge-based learning to boost motivation.
3. **Continuous Formative Assessment:** Use exit tickets and timely feedback instead of relying solely on rote memorization exams.

*Would you like us to dive deeper into a specific teaching activity, lesson plan, or evaluation rubric for this topic?*`;
    }

    return `### 💡 Orientación Pedagógica EDUDOCENT

Gracias por tu consulta: **"${userQuery}"**. Para abordar este tema formativo en tu aula de manera efectiva, te sugiero la siguiente ruta didáctica:

1. **Diagnóstico y Contextualización:** Identifica los ritmos de aprendizaje y conocimientos previos de tus estudiantes para adaptar la estrategia.
2. **Metodología Activa:** Incorpora dinámicas colaborativas, estudio de casos o aprendizaje basado en retos para aumentar la motivación del grupo.
3. **Evaluación Formativa Continuada:** Utiliza preguntas de verificación y retroalimentación oportuna en lugar de evaluaciones strictly memorísticas.

*¿Deseas que profundicemos en alguna actividad didáctica o rúbrica de evaluación específica para este tema?*`;
  };

  const fetchAIResponse = async (userQuery, systemInstructions = "") => {
    const isEn = language === 'en';
    const langInstruction = isEn
      ? "CRITICAL RULE: You MUST answer strictly in English. Directly and accurately answer what the user asks."
      : "REGLA CRÍTICA: Debes responder strictly en español. Responde de forma directa y precisa a lo que el usuario pregunta.";

    const defaultSystem = isEn
      ? `You are EDUDOCENT AI, an expert assistant in pedagogy, curriculum, and teaching methodology for primary and secondary school teachers. Your tone is professional, encouraging, and structured. ALWAYS format your responses using Markdown (use bolding, tables, bulleted lists, or code blocks if necessary). ${langInstruction}`
      : `Eres EDUDOCENT IA, un asistente experto en pedagogía, currículo y didáctica para profesores de educación básica y media. Tu tono es profesional, alentador y estructurado. Formatea SIEMPRE tus respuestas usando Markdown para que sean visualmente ricas (usa negritas, tablas, listas con viñetas o bloques de código si es necesario). ${langInstruction}`;

    const systemPrompt = systemInstructions ? `${systemInstructions}\n${langInstruction}` : defaultSystem;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResult && textResult.trim().length > 10) {
        return textResult;
      }
      return generateFallbackAIChatResponse(userQuery, language);
    } catch (error) {
      return generateFallbackAIChatResponse(userQuery, language);
    }
  };

  const clearChat = () => {
    setChatMessages(initialChat);
    showToast("Conversación reiniciada", "success");
  };

  // Efectos secundarios de Onboarding
  useEffect(() => {
    if (view !== 'onboarding') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [view]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Sincronizar materia activa en los módulos de unidades y mallas
  useEffect(() => {
    const subjectsList = selectedSubjects.length > 0 ? selectedSubjects : allSubjects;
    if (subjectsList.length > 0 && !activeUnitSubject) {
      setActiveUnitSubject(subjectsList[0]);
    }
    if (subjectsList.length > 0 && !activeMallaSubject) {
      setActiveMallaSubject(subjectsList[0]);
    }
  }, [selectedSubjects, view, activeUnitSubject, activeMallaSubject]);

  const isAuthenticatedView = ['welcome', 'settings', 'materials', 'subjectDetail', 'exploreMore', 'mallas', 'unidades', 'planning', 'chatbot', 'inclusiveSupport', 'proposito'].includes(view);

  const containerClasses = ['landing', 'survey', 'encuestaBienestar'].includes(view)
    ? 'w-full min-h-screen my-0 rounded-none border-0 shadow-none'
    : isAuthenticatedView
      ? 'md:min-h-[90vh] md:max-w-6xl lg:max-w-7xl md:my-6 md:rounded-[2.5rem] shadow-2xl border border-slate-100 md:border-slate-200/60'
      : 'md:min-h-[92vh] md:max-w-md md:my-8 md:rounded-[3rem] shadow-2xl border border-slate-100 md:border-slate-200/60';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} ${containerClasses} bg-[var(--bg-app)] text-[var(--text-main)] font-sans w-full mx-auto relative overflow-hidden flex flex-col ${isAuthenticatedView ? 'md:flex-row' : ''} animate-pageIn`}>
      <style>{`
        /* Animaciones Personalizadas y Fluidas */
        @keyframes pageIn { 
          from { opacity: 0; transform: translateY(16px); filter: blur(4px); } 
          to { opacity: 1; transform: translateY(0); filter: blur(0); } 
        }
        @keyframes toastIn { 
          from { opacity: 0; transform: translate(-50%, -20px) scale(0.9); } 
          to { opacity: 1; transform: translate(-50%, 0) scale(1); } 
        }
        @keyframes slideNext {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-slow { 
          0%, 100% { transform: translateY(-6%); } 
          50% { transform: translateY(6%); } 
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-aurora {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-aurora {
          animation: rotate-aurora 25s infinite linear;
        }
        @keyframes pulse-ring { 
          0% { box-shadow: 0 0 0 0 ${activeTheme.accentGlow}; } 
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } 
        }

        /* --- ANIMACIONES ADICIONALES PARA LA SPLASH SCREEN --- */
        @keyframes splashEntrance {
          0% { transform: scale(0.6) rotate(-8deg); opacity: 0; filter: blur(12px); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
        }
        @keyframes splashGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(79, 131, 226, 0.4)) drop-shadow(0 0 5px rgba(245, 158, 11, 0.2)); }
          50% { filter: drop-shadow(0 0 45px rgba(79, 131, 226, 0.8)) drop-shadow(0 0 25px rgba(245, 158, 11, 0.7)); }
        }
        @keyframes splashTextRise {
          0% { transform: translateY(30px); opacity: 0; filter: blur(4px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes splashFadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.05); pointer-events: none; }
        }

        .animate-pageIn { animation: pageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-toastIn { animation: toastIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-slideNext { animation: slideNext 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 20s infinite linear; }
        
        /* Clases de la Animación de Inicio */
        .animate-splashEntrance { animation: splashEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-splashGlow { animation: splashGlowPulse 2s infinite ease-in-out; }
        .animate-splashTextRise { animation: splashTextRise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
        .animate-splashFadeOut { animation: splashFadeOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
      `}</style>

      <ToastNotification toast={toast} />

      {isAuthenticatedView && (
        <DesktopSidebar
          view={view}
          setView={setView}
          activeTheme={activeTheme}
          userName={userName}
          userAvatar={userAvatar}
          customAvatarUrl={customAvatarUrl}
          handleLogout={handleLogout}
          t={t}
          language={language}
          setLanguage={setLanguage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          showToast={showToast}
        />
      )}

      {/* --- EXCEPCIONAL PANTALLA DE INICIO (SPLASH SCREEN ANIMADA CON GLOW PULSE) --- */}
      {showSplash && (
        <div className={`fixed inset-0 z-[300] flex flex-col items-center justify-center bg-gradient-to-b from-[#fffbeb] via-[#f0f4ff] to-[#e1ebff] transition-all duration-500 overflow-hidden ${fadeSplash ? 'animate-splashFadeOut' : ''}`}>

          {/* Fondo estético con círculos de luz difuminados */}
          <div className="absolute top-1/4 left-1/10 w-48 h-48 bg-[#4f83e2]/10 rounded-full blur-3xl animate-bounce-slow"></div>
          <div className="absolute bottom-1/4 right-1/10 w-64 h-64 bg-[#f59e0b]/10 rounded-full blur-3xl animate-bounce-slow delay-1000"></div>

          {/* Logo principal con entrada de escala, rotación y brillo continuo */}
          <div className="animate-splashEntrance relative z-10">
            <div className="animate-splashGlow p-4 bg-white/45 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-lg">
              <AppLogo className="w-36 h-36" />
            </div>
          </div>

          {/* Nombre de la Aplicación y Subtítulo con entrada de deslizamiento ascendente retrasada */}
          <div className="mt-8 text-center space-y-2 opacity-0 animate-splashTextRise relative z-10">
            <h1 className="text-4xl font-black tracking-widest text-[#1e3a8a] drop-shadow-sm">
              EDUDOCENT
            </h1>
            <p className="text-xs font-black tracking-widest text-[#f59e0b] uppercase">
              Chispa Pedagógica con IA
            </p>
          </div>

          {/* Indicador de carga sutil de progreso */}
          <div className="absolute bottom-12 w-32 bg-slate-200/50 h-1.5 rounded-full overflow-hidden border border-white/40">
            <div className="h-full bg-gradient-to-r from-[#4f83e2] to-[#f59e0b] rounded-full animate-pulse-slow" style={{ width: '100%', transition: 'width 2s' }}></div>
          </div>
        </div>
      )}




      {/* --- LANDING PAGE INICIAL EDUDOCENT (ESTILO APPLE COLORIDO) --- */}
      {view === 'landing' && (
        <div className="flex-1 bg-[#000000] text-[#f5f5f7] font-sans overflow-x-hidden overflow-y-auto custom-scrollbar relative animate-pageIn min-h-screen landing-page-container">
          {/* Header / Navbar Adaptativo (Estilo Apple) */}
          <header className="fixed w-full bg-[#161617]/85 backdrop-blur-md z-50 transition-all duration-300 border-b border-white/10" id="navbar">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-12">
                {/* Logo Marca */}
                <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <AppLogo className="h-6 w-6 filter invert brightness-200" />
                  <span className="font-semibold text-xs tracking-tight text-[#f5f5f7]">EDUDOCENT</span>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-8">
                  <a href="#inicio" className="text-[#a1a1a6] hover:text-[#f5f5f7] font-normal text-xs transition-colors">{language === 'es' ? 'Inicio' : 'Home'}</a>
                  <a href="#herramientas" className="text-[#a1a1a6] hover:text-[#f5f5f7] font-normal text-xs transition-colors">{language === 'es' ? 'Herramientas' : 'Tools'}</a>
                  <a href="#nosotros" className="text-[#a1a1a6] hover:text-[#f5f5f7] font-normal text-xs transition-colors">{language === 'es' ? 'Quiénes Somos' : 'About'}</a>
                  <a href="#contacto" className="text-[#a1a1a6] hover:text-[#f5f5f7] font-normal text-xs transition-colors">{language === 'es' ? 'Contacto' : 'Contact'}</a>
                </nav>

                {/* Right side controls */}
                <div className="flex items-center gap-4">
                  {/* Language Switcher */}
                  <div className="flex items-center bg-white/5 p-0.5 rounded border border-white/10 text-[10px] font-medium text-[#a1a1a6]">
                    <button type="button" onClick={() => setLanguage('es')} className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${language === 'es' ? 'bg-white/10 text-white font-bold' : ''}`}>ES</button>
                    <button type="button" onClick={() => setLanguage('en')} className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${language === 'en' ? 'bg-white/10 text-white font-bold' : ''}`}>EN</button>
                  </div>
                  <button onClick={() => setView('onboarding')} className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-normal py-1 px-3 rounded-full text-xs transition-transform transform active:scale-95 cursor-pointer">
                    {language === 'es' ? 'Empezar' : 'Start'}
                  </button>
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#f5f5f7] focus:outline-none p-1" aria-label="Menu">
                    {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Menu (Frosted glass overlay) */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-[#161617]/95 backdrop-blur-xl border-t border-white/10 w-full animate-pageIn">
                <div className="px-6 py-4 space-y-4">
                  <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-[#f5f5f7] hover:text-[#0071e3] transition-colors">{language === 'es' ? 'Inicio' : 'Home'}</a>
                  <a href="#herramientas" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-[#f5f5f7] hover:text-[#0071e3] transition-colors">{language === 'es' ? 'Herramientas' : 'Tools'}</a>
                  <a href="#nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-[#f5f5f7] hover:text-[#0071e3] transition-colors">{language === 'es' ? 'Quiénes Somos' : 'About'}</a>
                  <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-[#f5f5f7] hover:text-[#0071e3] transition-colors">{language === 'es' ? 'Contacto' : 'Contact'}</a>
                  <button onClick={() => { setIsMobileMenuOpen(false); setView('onboarding'); }} className="w-full text-center bg-[#0071e3] text-white py-2.5 rounded-xl text-xs font-medium active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <span>{language === 'es' ? 'Empezar Gratis' : 'Start Free'}</span> <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Hero Section 1: EDUDOCENT IA (Estilo Apple Dark - Fondo Negro con Aurora Glow) */}
          <section id="inicio" className="bg-[#000000] text-[#f5f5f7] pt-28 pb-20 text-center relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center">
            {/* Ambient Lighting effects (Aurora glow) */}
            <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-aurora"></div>
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-aurora"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-pink-500/5 rounded-full blur-[110px] pointer-events-none animate-aurora"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/5 mb-6 animate-pageIn text-xs font-semibold text-[#86868b]">
                <span className="text-[#0071e3]">✦</span>
                <span>{language === 'es' ? 'Plataforma Inteligente' : 'Intelligent Platform'}</span>
              </div>

              {/* Headline with vibrant gradient text */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
                EDUDOCENT IA.
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium tracking-tight mb-4">
                {language === 'es' ? 'Chispa Pedagógica. Inteligente. Asombrosa.' : 'Pedagogic Spark. Smart. Amazing.'}
              </p>

              {/* Description */}
              <p className="max-w-2xl text-xs sm:text-sm text-neutral-400 mb-8 font-light leading-relaxed">
                {language === 'es'
                  ? 'Redefinimos la forma de enseñar. Crea guías curriculares, evaluaciones de clase, recursos y mallas anuales con el copiloto pedagógico más potente del aula.'
                  : 'Redefining the way you teach. Create curriculum guides, classroom evaluations, resources, and annual grids with the most powerful pedagogical copilot in the classroom.'}
              </p>

              {/* CTAs (Apple style blue links) */}
              <div className="flex gap-6 mb-12">
                <button onClick={() => setView('onboarding')} className="text-[#2997ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer text-sm sm:text-base bg-transparent border-0">
                  {language === 'es' ? 'Ver demostración' : 'Watch demo'} <ChevronRight size={14} />
                </button>
                <button onClick={() => setView('login')} className="text-[#2997ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer text-sm sm:text-base bg-transparent border-0">
                  {language === 'es' ? 'Iniciar sesión' : 'Sign in'} <ChevronRight size={14} />
                </button>
              </div>

              {/* Mockup del Producto (Sleek Canvas Preview with vibrant elements) */}
              <div className="w-full max-w-4xl mx-auto rounded-2xl border border-neutral-800 bg-[#161617]/70 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-3 sm:p-5 aspect-[16/10] flex flex-col overflow-hidden relative group hover:border-neutral-700 transition-all duration-700">
                {/* Browser bar */}
                <div className="flex items-center gap-1.5 pb-3 border-b border-neutral-800 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <div className="w-48 bg-neutral-900 h-4 rounded-md mx-auto border border-neutral-800/40 text-[9px] text-neutral-500 flex items-center justify-center font-bold">
                    edudocent.ia/dashboard
                  </div>
                </div>
                {/* Inside Interface */}
                <div className="flex-1 flex gap-3 pt-3 overflow-hidden text-left text-xs text-neutral-400">
                  {/* Left Mock Sidebar */}
                  <div className="w-1/4 border-r border-neutral-800/40 pr-3 space-y-2.5 hidden sm:block">
                    <div className="w-full h-8 bg-neutral-900 rounded-lg flex items-center gap-2 px-2.5 border border-white/5 shadow-inner">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-[8px] animate-pulse">✦</div>
                      <div className="w-12 h-2 bg-neutral-700 rounded"></div>
                    </div>
                    <div className="h-2 w-16 bg-neutral-800 rounded ml-2.5"></div>
                    <div className="space-y-1.5 pl-2">
                      <div className="h-7 w-full bg-neutral-900/40 rounded flex items-center px-2.5 border border-transparent hover:border-neutral-800"><div className="h-1.5 w-10 bg-neutral-600 rounded"></div></div>
                      <div className="h-7 w-full bg-neutral-900/40 rounded flex items-center px-2.5 border border-transparent hover:border-neutral-800"><div className="h-1.5 w-14 bg-neutral-600 rounded"></div></div>
                      <div className="h-7 w-full bg-neutral-900/40 rounded flex items-center px-2.5 border border-transparent hover:border-neutral-800"><div className="h-1.5 w-12 bg-neutral-600 rounded"></div></div>
                    </div>
                  </div>
                  {/* Dashboard body */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Header line */}
                    <div className="flex justify-between items-center bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/30">
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 bg-white rounded font-bold"></div>
                        <div className="h-2 w-20 bg-neutral-650 rounded"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-16 h-6 bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-neutral-300 font-bold">Ajustes</div>
                        <div className="w-16 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-[10px] text-white font-bold shadow-md">Crear +</div>
                      </div>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="bg-neutral-900/60 rounded-xl p-3 border border-blue-500/20 shadow-[0_4px_20px_rgba(59,130,246,0.15)] flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                        <div className="space-y-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shadow-sm">💡</div>
                          <div className="h-2.5 w-24 bg-white rounded font-extrabold"></div>
                          <div className="h-2 w-full bg-neutral-600 rounded"></div>
                          <div className="h-2 w-4/5 bg-neutral-600 rounded"></div>
                        </div>
                        <div className="h-4 w-12 bg-blue-500/20 rounded border border-blue-500/30 text-[8px] font-bold text-blue-400 flex items-center justify-center">VER MAS</div>
                      </div>
                      <div className="bg-neutral-900/60 rounded-xl p-3 border border-purple-500/20 shadow-[0_4px_20px_rgba(168,85,247,0.15)] flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                        <div className="space-y-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold shadow-sm">📅</div>
                          <div className="h-2.5 w-28 bg-white rounded font-extrabold"></div>
                          <div className="h-2 w-full bg-neutral-600 rounded"></div>
                          <div className="h-2 w-2/3 bg-neutral-600 rounded"></div>
                        </div>
                        <div className="h-4 w-12 bg-purple-500/20 rounded border border-purple-500/30 text-[8px] font-bold text-purple-400 flex items-center justify-center">VER MAS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hero Section 2: Gestión Curricular Simplificada (Estilo Apple Light - Fondo Claro) */}
          <section id="herramientas" className="bg-[#f5f5f7] text-[#1d1d1f] py-24 text-center border-t border-neutral-200 flex flex-col items-center">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc] mb-3">{language === 'es' ? 'ORGANIZACIÓN INTELIGENTE' : 'SMART ORGANIZATION'}</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-slate-800 to-indigo-900 leading-tight">
                {language === 'es' ? 'Tus mallas y horarios. En un solo lugar.' : 'Your grids and schedules. In one place.'}
              </h2>
              <p className="text-lg sm:text-xl text-neutral-500 font-normal tracking-tight mb-8">
                {language === 'es' ? 'Una estructura unificada desde 6° hasta 11°.' : 'A unified structure from 6th to 11th grade.'}
              </p>

              <div className="flex gap-6 mb-12">
                <button onClick={() => setView('onboarding')} className="text-[#0066cc] hover:underline font-semibold flex items-center gap-1 cursor-pointer text-sm sm:text-base bg-transparent border-0">
                  {language === 'es' ? 'Planificar mallas' : 'Plan grids'} <ChevronRight size={14} />
                </button>
                <button onClick={() => setView('onboarding')} className="text-[#0066cc] hover:underline font-semibold flex items-center gap-1 cursor-pointer text-sm sm:text-base bg-transparent border-0">
                  {language === 'es' ? 'Organizar calendario' : 'Organize calendar'} <ChevronRight size={14} />
                </button>
              </div>

              {/* Mockup Tablet (Light interface with colorful items) */}
              <div className="w-full max-w-3xl mx-auto rounded-3xl border-8 border-neutral-900 bg-white shadow-2xl p-4 aspect-[4/3] flex flex-col overflow-hidden relative transition-all duration-500 hover:scale-[1.02]">
                <div className="w-16 h-1.5 bg-neutral-800 rounded-full mx-auto mb-4"></div>
                <div className="flex-1 flex flex-col gap-4 text-left">
                  <div className="h-6 w-32 bg-neutral-200 rounded"></div>
                  <div className="grid grid-cols-5 gap-3 flex-1 text-[10px] text-neutral-500 font-semibold">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day, dIdx) => {
                      const colors = [
                        { bg: 'bg-rose-50 text-rose-900 border-rose-100', name: language === 'es' ? 'Matemáticas' : 'Math' },
                        { bg: 'bg-blue-50 text-blue-900 border-blue-100', name: language === 'es' ? 'Español' : 'Spanish' },
                        { bg: 'bg-emerald-50 text-emerald-900 border-emerald-100', name: language === 'es' ? 'Ciencias' : 'Science' },
                        { bg: 'bg-orange-50 text-orange-900 border-orange-100', name: language === 'es' ? 'Sociales' : 'Socials' },
                        { bg: 'bg-purple-50 text-purple-900 border-purple-100', name: language === 'es' ? 'Inglés' : 'English' }
                      ];
                      const subj1 = colors[dIdx % colors.length];
                      const subj2 = colors[(dIdx + 2) % colors.length];
                      return (
                        <div key={day} className="flex flex-col gap-2 border-r border-neutral-100 last:border-r-0 pr-1">
                          <span className="text-neutral-400 font-black border-b border-neutral-100 pb-1">{day}</span>
                          <div className={`p-2 rounded-xl border flex flex-col justify-between shadow-sm ${subj1.bg} ${dIdx % 2 === 0 ? 'h-16' : 'h-24'}`}>
                            <span className="text-[8px] opacity-75 font-bold">07:00</span>
                            <span className="font-extrabold truncate">{subj1.name}</span>
                          </div>
                          <div className={`p-2 rounded-xl border flex flex-col justify-between shadow-sm ${subj2.bg} ${dIdx % 3 === 0 ? 'h-24' : 'h-16'}`}>
                            <span className="text-[8px] opacity-75 font-bold">09:00</span>
                            <span className="font-extrabold truncate">{subj2.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Grid: Características del Sistema (Estilo Apple Bento Grid) */}
          <section className="py-12 bg-white border-t border-neutral-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bento Card 1: IA Assistant (Dark with purple gradient accent) */}
                <div onClick={() => setView('onboarding')} className="bg-[#000000] text-white rounded-3xl p-8 aspect-square md:aspect-auto md:h-[450px] flex flex-col justify-between overflow-hidden relative group cursor-pointer border border-neutral-800 transition-all hover:shadow-xl shadow-purple-500/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#a1a1a6] font-bold">ASISTENCIA COMPLETA</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-100 to-purple-400">{language === 'es' ? 'Copiloto IA Pedagógico' : 'Pedagogical AI Copilot'}</h3>
                    <p className="text-[#a1a1a6] text-xs sm:text-sm font-light max-w-sm">
                      {language === 'es' ? 'Resuelve dudas pedagógicas y planifica tus clases 24/7 con ayuda de Gemini.' : 'Resolve pedagogical doubts and plan your classes 24/7 with the help of Gemini.'}
                    </p>
                    <span className="text-[#0071e3] hover:underline text-xs flex items-center gap-1 pt-1 font-semibold">{language === 'es' ? 'Probar Asistente' : 'Try Assistant'} <ChevronRight size={12} /></span>
                  </div>
                  {/* Chat Preview Mockup */}
                  <div className="relative h-48 bg-[#161617] rounded-2xl border border-neutral-800/80 p-4 text-[10px] space-y-3 text-left w-full mt-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 select-none shadow-inner">
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl rounded-tr-none max-w-[80%] font-bold shadow">
                        {language === 'es' ? 'Ideas para una clase de fracciones' : 'Ideas for a fraction lesson'}
                      </div>
                    </div>
                    <div className="flex justify-start items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white border border-white/10 animate-pulse">🤖</div>
                      <div className="bg-neutral-900 border border-neutral-800 text-neutral-300 p-2.5 rounded-xl rounded-tl-none max-w-[85%] font-medium leading-relaxed shadow bg-neutral-950">
                        {language === 'es' ? '1. Usa manzanas para ilustrar cortes. 2. Juega a la pizza fraccionada.' : '1. Use apples to illustrate cuts. 2. Play fractional pizza game.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: Juegos en Clase (Light with amber gradient accent) */}
                <div onClick={() => setView('onboarding')} className="bg-[#f5f5f7] text-[#1d1d1f] rounded-3xl p-8 aspect-square md:aspect-auto md:h-[450px] flex flex-col justify-between overflow-hidden relative group cursor-pointer border border-neutral-250/30 transition-all hover:shadow-xl shadow-amber-500/5">
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">DINÁMICAS INTERACTIVAS</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-slate-800 to-amber-700">{language === 'es' ? 'Juegos y Cuestionarios' : 'Games & Quizzes'}</h3>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-sm">
                      {language === 'es' ? 'Motiva a tus alumnos con desafíos lúdicos y cuestionarios listos para proyectar en el aula.' : 'Motivate your students with fun challenges and quizzes ready to project in the classroom.'}
                    </p>
                    <span className="text-[#0066cc] hover:underline text-xs flex items-center gap-1 pt-1 font-semibold">{language === 'es' ? 'Ver catálogo de juegos' : 'View games catalog'} <ChevronRight size={12} /></span>
                  </div>
                  {/* Game graphics preview */}
                  <div className="relative h-48 bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between mt-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 select-none shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xs text-[#334155]">{language === 'es' ? 'Trivia Espacial 🚀' : 'Space Trivia 🚀'}</span>
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-sm">PROYECTAR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-white">
                      <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-md hover:scale-95 transition-transform">A. Sol</div>
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md hover:scale-95 transition-transform">B. Júpiter</div>
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md hover:scale-95 transition-transform">C. Marte</div>
                      <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-md hover:scale-95 transition-transform text-white">D. Saturno</div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 3: Mallas Curriculares (Light with indigo gradient accent) */}
                <div onClick={() => setView('onboarding')} className="bg-[#f5f5f7] text-[#1d1d1f] rounded-3xl p-8 aspect-square md:aspect-auto md:h-[450px] flex flex-col justify-between overflow-hidden relative group cursor-pointer border border-neutral-250/30 transition-all hover:shadow-xl shadow-indigo-500/5">
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">ESTRUCTURACIÓN ANUAL</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-slate-800 to-indigo-700">{language === 'es' ? 'Mallas de 4 Periodos' : '4-Period Lesson Grids'}</h3>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-sm">
                      {language === 'es' ? 'Contenidos divididos con precisión metodológica alineados a los DBA nacionales.' : 'Contents divided with methodological precision aligned to national DBA standards.'}
                    </p>
                    <span className="text-[#0066cc] hover:underline text-xs flex items-center gap-1 pt-1 font-semibold">{language === 'es' ? 'Estructurar mallas' : 'Structure lesson plans'} <ChevronRight size={12} /></span>
                  </div>
                  {/* Grid blocks preview */}
                  <div className="relative h-48 bg-white rounded-2xl border border-neutral-200 p-4 mt-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 shadow-sm flex flex-col gap-2.5 text-[9px] text-[#334155]">
                    <div className="flex gap-2">
                      <span className="bg-rose-100 border border-rose-200 text-rose-800 font-black px-2 py-1 rounded-lg">P1</span>
                      <div className="h-6 flex-1 bg-slate-50 border rounded-lg flex items-center px-2 font-bold">{language === 'es' ? 'Comprensión Narrativa y Estructura' : 'Narrative Comprehension'}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 border border-blue-200 text-blue-800 font-black px-2 py-1 rounded-lg">P2</span>
                      <div className="h-6 flex-1 bg-slate-50 border rounded-lg flex items-center px-2 font-bold">{language === 'es' ? 'Gramática, Sintaxis y Ortografía' : 'Syntax & Grammar'}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 font-black px-2 py-1 rounded-lg">P3</span>
                      <div className="h-6 flex-1 bg-slate-50 border rounded-lg flex items-center px-2 font-bold">{language === 'es' ? 'Géneros Literarios e Interpretación' : 'Literary Genres'}</div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 4: Estadísticas Docentes (New Colorful Card - Dark) */}
                <div onClick={() => setView('onboarding')} className="bg-[#000000] text-white rounded-3xl p-8 aspect-square md:aspect-auto md:h-[450px] flex flex-col justify-between overflow-hidden relative group cursor-pointer border border-neutral-800 transition-all hover:shadow-xl shadow-cyan-500/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#a1a1a6] font-bold">{language === 'es' ? 'ANALÍTICA DE CLASE' : 'CLASS ANALYTICS'}</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-100 to-cyan-400">{language === 'es' ? 'Progreso y Evaluaciones' : 'Progress & Evaluations'}</h3>
                    <p className="text-[#a1a1a6] text-xs sm:text-sm font-light max-w-sm">
                      {language === 'es' ? 'Lleva un control de tus calificaciones y visualiza el avance del currículo con gráficos coloridos.' : 'Track your grades and visualize curriculum progress with colorful charts.'}
                    </p>
                    <span className="text-[#0071e3] hover:underline text-xs flex items-center gap-1 pt-1 font-semibold">{language === 'es' ? 'Ver mis mallas' : 'View my plans'} <ChevronRight size={12} /></span>
                  </div>
                  {/* Graph preview */}
                  <div className="relative h-48 bg-[#161617] rounded-2xl border border-neutral-800/80 p-4 mt-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 shadow-inner flex flex-col justify-between text-left text-[8px] text-neutral-500">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                      <span className="font-bold text-white text-[10px]">{language === 'es' ? 'Rendimiento Promedio' : 'Average Performance'}</span>
                      <span className="text-cyan-400 font-bold">87% (+4.2%)</span>
                    </div>
                    {/* Visual Bar Chart */}
                    <div className="flex items-end justify-around h-28 pt-2">
                      {[
                        { val: 'h-[60%]', col: 'from-blue-500 to-cyan-400', label: '6°' },
                        { val: 'h-[75%]', col: 'from-purple-500 to-pink-500', label: '7°' },
                        { val: 'h-[45%]', col: 'from-orange-500 to-amber-400', label: '8°' },
                        { val: 'h-[90%]', col: 'from-emerald-500 to-teal-400', label: '9°' },
                        { val: 'h-[80%]', col: 'from-rose-500 to-pink-600', label: '10°' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 w-8">
                          <div className={`w-3.5 ${item.val} bg-gradient-to-t ${item.col} rounded-t-md shadow-lg transition-all duration-700 group-hover:scale-y-105 origin-bottom`}></div>
                          <span className="font-bold">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sección Dedicada de las Creadoras (Estilo Apple Leadership / Team Grid) */}
          <section id="nosotros" className="py-24 bg-[#0a0a0c] text-white border-t border-neutral-800 relative overflow-hidden flex flex-col items-center">
            {/* Background glowing lights for the creators */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none animate-aurora"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[110px] pointer-events-none animate-aurora"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0071e3] mb-3">{language === 'es' ? 'EL EQUIPO DETRÁS DE LA INNOVACIÓN' : 'THE TEAM BEHIND THE INNOVATION'}</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-center leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                {language === 'es' ? 'Mentes creativas, tecnología docente.' : 'Creative minds, teaching technology.'}
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 max-w-2xl text-center mb-16 font-light leading-relaxed">
                {language === 'es'
                  ? 'Somos estudiantes de grado 11 apasionadas por la educación y la tecnología, comprometidas con el desarrollo de herramientas pedagógicas adaptativas para transformar el aula.'
                  : 'We are 11th grade students passionate about education and technology, committed to developing adaptive pedagogical tools to transform the classroom.'}
              </p>

              {/* Creators Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[
                  { name: "Emely Bedoya", role: language === 'es' ? "Co-fundadora & Directora" : "Co-founder & Director", desc: language === 'es' ? "Apasionada por crear herramientas que resuelvan las necesidades reales de los docentes en el aula." : "Passionate about creating tools that solve the real needs of teachers in the classroom.", avatar: "/emely.jpg", color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/10" },
                  { name: "Sophia Ospina", role: language === 'es' ? "Diseñadora UX/UI Principal" : "Lead UX/UI Designer", desc: language === 'es' ? "Enfocada en que la experiencia de planificar y organizar clases sea hermosa, fluida y agradable." : "Focused on making the experience of planning and organizing classes beautiful, fluid, and pleasant.", avatar: "/sophia.png", color: "from-purple-500 to-pink-400", shadow: "shadow-purple-500/10" },
                  { name: "Maria Jose Castro", role: language === 'es' ? "Líder de Integración IA" : "AI Integration Lead", desc: language === 'es' ? "Encargada de optimizar las respuestas del Mentor IA para brindar apoyo didáctico inteligente y asertivo." : "Responsible for optimizing AI Mentor responses to provide smart and assertive teaching support.", avatar: "/maria.png", color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/10" },
                  { name: "Danna Jimenez", role: language === 'es' ? "Gestora de Calidad y Misión" : "Quality & Mission Manager", desc: language === 'es' ? "Asegurando que cada módulo de la plataforma esté alineado a la excelencia y los DBA del currículo." : "Ensuring that every module of the platform is aligned with excellence and DBA curriculum standards.", avatar: "/danna.png", color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/10" }
                ].map((creator) => (
                  <div key={creator.name} className={`bg-[#16161a] rounded-3xl p-6 border border-neutral-800 flex flex-col items-center text-center shadow-lg hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1.5 ${creator.shadow}`}>
                    <div className="relative mb-6">
                      {/* Colorful Ring */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-tr ${creator.color} rounded-full blur-[2px] opacity-75`}></div>
                      <img src={creator.avatar} alt={creator.name} className="relative w-24 h-24 rounded-full object-cover border-2 border-[#16161a]" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{creator.name}</h4>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3 block">{creator.role}</span>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">{creator.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer (Estilo Apple Directory Footer) */}
          <footer id="contacto" className="bg-[#161617] pt-16 pb-24 md:pb-12 text-[#f5f5f7] border-t border-white/10 relative z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-normal text-[#86868b]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Column 1: Brand */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <AppLogo className="h-5 w-5 filter invert brightness-200" />
                    <span className="font-semibold text-xs tracking-tight">EDUDOCENT</span>
                  </div>
                  <p className="leading-relaxed font-light">
                    {language === 'es'
                      ? 'Empoderando a los profesores con tecnología adaptativa, organización inteligente y asistencia pedagógica de IA.'
                      : 'Empowering teachers with adaptive technology, smart organization, and pedagogical AI assistance.'}
                  </p>
                </div>

                {/* Column 2: Tools */}
                <div>
                  <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-[10px]">{language === 'es' ? 'HERRAMIENTAS' : 'TOOLS'}</h3>
                  <ul className="space-y-2">
                    <li><button onClick={() => setView('onboarding')} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-0 p-0">{language === 'es' ? 'Generador de Guías' : 'Guide Generator'}</button></li>
                    <li><button onClick={() => setView('onboarding')} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-0 p-0">{language === 'es' ? 'Organizador Curricular' : 'Curriculum Organizer'}</button></li>
                    <li><button onClick={() => setView('onboarding')} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-0 p-0">{language === 'es' ? 'Mallas Curriculares' : 'Annual Grids'}</button></li>
                    <li><button onClick={() => setView('onboarding')} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-0 p-0">{language === 'es' ? 'Banco de Recursos' : 'Resource Bank'}</button></li>
                  </ul>
                </div>

                {/* Column 3: Team */}
                <div>
                  <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-[10px]">{language === 'es' ? 'COMUNIDAD' : 'COMMUNITY'}</h3>
                  <ul className="space-y-2">
                    <li><a href="#nosotros" className="hover:text-white transition-colors">{language === 'es' ? 'Quiénes Somos' : 'About Us'}</a></li>
                    <li><button onClick={() => setView('onboarding')} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-0 p-0">{language === 'es' ? 'Soporte al Docente' : 'Teacher Support'}</button></li>
                  </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                  <h3 className="text-white font-bold mb-3 uppercase tracking-wider text-[10px]">{language === 'es' ? 'SUSCRÍBETE' : 'SUBSCRIBE'}</h3>
                  <p className="mb-3 font-light leading-relaxed">{language === 'es' ? 'Recibe tips pedagógicos semanales e ideas de clase.' : 'Receive weekly pedagogical tips and lesson ideas.'}</p>
                  <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); showToast(language === 'es' ? '¡Gracias por suscribirte!' : 'Thanks for subscribing!', "success"); }}>
                    <input type="email" placeholder="correo@institucion.edu" className="bg-white/5 text-white border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#0071e3] placeholder-neutral-600 font-light" />
                    <button type="submit" className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer border-0">
                      {language === 'es' ? 'Suscribirme' : 'Subscribe'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[#86868b] gap-4">
                <p>&copy; 2026 EDUDOCENT. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
                <p className="flex items-center gap-1">
                  {language === 'es' ? 'Diseñado con' : 'Designed with'} <Heart size={10} className="text-red-500 fill-red-500" /> {language === 'es' ? 'para maestros.' : 'for teachers.'}
                </p>
              </div>
            </div>
          </footer>

          {/* Floating Mobile Action Bar (Estilo Apple - Glassmorphism) */}
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#161617]/90 text-[#f5f5f7] backdrop-blur-md p-3.5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-between border border-white/10 animate-bounce-slow">
            <div className="flex items-center gap-2">
              <AppLogo className="w-6 h-6 filter invert brightness-200" />
              <div>
                <p className="text-[10px] font-black leading-none text-white">EDUDOCENT</p>
                <p className="text-[8px] text-[#86868b] mt-0.5">{language === 'es' ? 'Copiloto IA' : 'AI Copilot'}</p>
              </div>
            </div>
            <button onClick={() => setView('onboarding')} className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-[10px] px-3.5 py-2 rounded-lg shadow-sm active:scale-95 transition-transform flex items-center gap-1 cursor-pointer border-0">
              <span>{language === 'es' ? 'Empezar Gratis' : 'Start Free'}</span> <ArrowRight size={10} />
            </button>
          </div>
        </div>
      )}

      {/* --- ONBOARDING SLIDER --- */}
      {view === 'onboarding' && (
        <div className="flex-1 flex flex-col justify-between bg-white relative animate-pageIn h-full onboarding-container">
          <div className={`absolute inset-0 bg-gradient-to-b ${(t.slides || slides)[currentSlide].color} opacity-95 transition-all duration-700 -z-10`} />

          <div className="p-6 flex justify-between items-center text-slate-800">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-slate-900" />
              <span className="font-black text-sm tracking-widest uppercase text-[#0f172a]">EduDocent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/60 backdrop-blur-sm p-0.5 rounded-lg border border-white/60 text-[10px] font-bold shadow-sm">
                <button
                  type="button"
                  onClick={() => { setLanguage('es'); showToast("Idioma: Español", "success"); }}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${language === 'es' ? 'bg-slate-900 text-white font-black shadow' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  🇪🇸 ES
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); showToast("Language: English", "success"); }}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${language === 'en' ? 'bg-slate-900 text-white font-black shadow' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  🇺🇸 EN
                </button>
              </div>
              <button
                onClick={() => setView('register')}
                className="text-xs font-bold text-[#0f172a] bg-white/60 hover:bg-white/80 px-3.5 py-1.5 rounded-full backdrop-blur-sm transition-all border border-slate-300 shadow-sm"
              >
                {t.skip}
              </button>
            </div>
          </div>

          <div
            onClick={handleNextSlide}
            className="px-8 py-4 flex flex-col items-center text-center text-slate-800 flex-1 justify-center animate-slideNext cursor-pointer select-none active:scale-[0.99] transition-transform"
            key={currentSlide}
          >
            <div className="mb-6 p-1 bg-white/20 backdrop-blur-sm rounded-[2.5rem] border border-white/40 shadow-sm animate-bounce-slow">
              <AppLogo className="w-32 h-32" />
            </div>
            <h2 className="text-3xl font-black mb-3 tracking-tight leading-none text-[#0f172a]">
              {(t.slides || slides)[currentSlide].title}
            </h2>
            <p className="text-sm text-[#1e293b] leading-relaxed max-w-xs mb-4 font-bold">
              {(t.slides || slides)[currentSlide].description}
            </p>
            <span className="text-[10px] font-black tracking-widest uppercase bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200 text-[#0f172a] shadow-sm">
              {t.tapToAdvance}
            </span>
          </div>

          <div className="p-8 bg-white/10 backdrop-blur-md border-t border-white/20 rounded-t-[3rem] flex flex-col gap-6">
            <div className="flex justify-center gap-2">
              {(t.slides || slides).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${idx === currentSlide ? 'w-8 bg-slate-800' : 'w-2.5 bg-slate-400/40'}`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center">
              {currentSlide > 0 ? (
                <button
                  onClick={handlePrevSlide}
                  className="p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 transition-all flex items-center justify-center border shadow-sm active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <div className="w-[52px]" />
              )}

              <button
                onClick={handleNextSlide}
                className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center gap-2 shadow-lg active:scale-95 hover:bg-slate-800 transition-all text-sm uppercase tracking-wider"
              >
                {currentSlide === (t.slides || slides).length - 1 ? (t.start || "Comenzar") : (t.next || "Siguiente")}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REGISTRO PRINCIPAL --- */}
      {view === 'register' && (
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center animate-pageIn bg-white min-h-[600px]">
          <div className="w-full max-w-md space-y-6">
            {/* Top Bar with Language Selector & Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('landing')}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLanguage('es'); showToast("Idioma: Español", "success"); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'es' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🇪🇸 ES
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); showToast("Language: English", "success"); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>

            {/* Logo & Header */}
            <div className="text-center">
              <div className="mb-3 inline-block animate-bounce-slow">
                <AppLogo className="w-24 h-24 sm:w-28 sm:h-28 mx-auto" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.registerTitle}</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">{t.registerSubtitle}</p>
            </div>

            {/* Authentication Options (SSO & Email) */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => startAuthFlow('email', 'register')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all font-black text-xs uppercase tracking-wider cursor-pointer border-0"
              >
                <Mail size={18} /> {t.registerEmail}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-3 text-slate-400 text-[10px] uppercase tracking-widest font-black">{t.orSocial}</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => startAuthFlow('google', 'register')}
                  className="w-full bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <GoogleIcon size={18} />
                  <span>{t.continueGoogle}</span>
                </button>

                <button
                  onClick={() => startAuthFlow('apple', 'register')}
                  className="w-full bg-slate-900 text-white hover:bg-black py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  <AppleIcon size={18} />
                  <span>{t.continueApple}</span>
                </button>

                <button
                  onClick={() => startAuthFlow('facebook', 'register')}
                  className="w-full bg-[#1877F2] hover:bg-[#1864f2] text-white py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  <Facebook size={18} />
                  <span>{t.continueFacebook}</span>
                </button>

                <button
                  onClick={() => startAuthFlow('instagram', 'register')}
                  className="w-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] opacity-90 hover:opacity-100 text-white py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  <Instagram size={18} />
                  <span>{t.continueInstagram}</span>
                </button>
              </div>

              {/* Trust Badge Component */}
              <TrustBadge t={t} />

              {/* Toggle to Login */}
              <div className="pt-4 text-center">
                <button
                  onClick={() => setView('login')}
                  className="w-full bg-blue-50 hover:bg-blue-100 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 text-blue-700 shadow-sm transition-all active:scale-[0.98] cursor-pointer border border-blue-100"
                >
                  <User size={18} className="text-blue-600" />
                  <span className="font-bold text-xs">{t.alreadyAccount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INICIO DE SESIÓN PRINCIPAL --- */}
      {view === 'login' && (
        <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center animate-pageIn bg-white min-h-[600px]">
          <div className="w-full max-w-md space-y-6">
            {/* Top Bar with Language Selector */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView('landing')}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLanguage('es'); showToast("Idioma: Español", "success"); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'es' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🇪🇸 ES
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); showToast("Language: English", "success"); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <User size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.loginTitle}</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">{t.loginSubtitle}</p>
            </div>

            {/* SSO & Email Options for Login */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => startAuthFlow('email', 'login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95 transition-all font-black text-xs uppercase tracking-wider cursor-pointer border-0"
              >
                <Mail size={18} /> {t.loginEmailBtn}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-3 text-slate-400 text-[10px] uppercase tracking-widest font-black">{t.orSocial}</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* SSO Buttons in Login */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => startAuthFlow('google', 'login')}
                  className="w-full bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <GoogleIcon size={18} />
                  <span>{t.continueGoogle}</span>
                </button>

                <button
                  onClick={() => startAuthFlow('apple', 'login')}
                  className="w-full bg-slate-900 text-white hover:bg-black py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  <AppleIcon size={18} />
                  <span>{t.continueApple}</span>
                </button>

                <button
                  onClick={() => startAuthFlow('facebook', 'login')}
                  className="w-full bg-[#1877F2] hover:bg-[#1864f2] text-white py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  <Facebook size={18} />
                  <span>{t.continueFacebook}</span>
                </button>

                <button
                  onClick={() => startAuthFlow('instagram', 'login')}
                  className="w-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] opacity-90 hover:opacity-100 text-white py-3.5 rounded-2xl flex justify-center items-center gap-2.5 font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer border-0"
                >
                  <Instagram size={18} />
                  <span>{t.continueInstagram}</span>
                </button>
              </div>

              {/* Trust Badge Component */}
              <TrustBadge t={t} />

              {/* Toggle to Register */}
              <div className="pt-4 text-center">
                <button
                  onClick={() => setView('register')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer border border-slate-200/60"
                >
                  <Mail size={18} className="text-slate-600" />
                  <span className="font-bold text-xs">{t.dontHaveAccount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FORMULARIO DE CAPTURA DE CREDENCIALES (PRE-2FA) --- */}
      {(view === 'authForm' || view === 'signupForm') && (
        <div className="flex-1 p-6 sm:p-8 animate-pageIn bg-white flex flex-col items-center justify-center min-h-[600px]">
          <div className="w-full max-w-md space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView(pendingFlowType === 'register' ? 'register' : 'login')}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLanguage('es'); showToast("Idioma: Español", "success"); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'es' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🇪🇸 ES
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); showToast("Language: English", "success"); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-13 h-13 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                {authMethod === 'google' ? (
                  <GoogleIcon size={26} />
                ) : authMethod === 'apple' ? (
                  <AppleIcon size={26} className="text-slate-900" />
                ) : authMethod === 'facebook' ? (
                  <Facebook size={26} className="text-[#1877F2]" />
                ) : authMethod === 'instagram' ? (
                  <Instagram size={26} className="text-[#DD2A7B]" />
                ) : (
                  <Mail size={26} className="text-slate-800" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {`${pendingFlowType === 'login' ? t.authFormTitleLogin : t.authFormTitleRegister} ${authMethod === 'google' ? 'Google' : authMethod === 'apple' ? 'Apple (iCloud)' : authMethod === 'facebook' ? 'Facebook' : authMethod === 'instagram' ? 'Instagram' : 'EDUDOCENT'}`}
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.authFormSubtitle}</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  {authMethod === 'google'
                    ? t.googleEmailLabel
                    : authMethod === 'apple'
                    ? t.appleEmailLabel
                    : authMethod === 'facebook'
                    ? t.facebookEmailLabel
                    : authMethod === 'instagram'
                    ? t.instagramEmailLabel
                    : t.emailLabelDefault}
                </label>
                <input
                  type={authMethod === 'google' || authMethod === 'apple' ? 'email' : 'text'}
                  value={formData.identifier || ''}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder={
                    authMethod === 'google'
                      ? t.googleEmailPlaceholder
                      : authMethod === 'apple'
                      ? t.appleEmailPlaceholder
                      : authMethod === 'facebook'
                      ? t.facebookEmailPlaceholder
                      : authMethod === 'instagram'
                      ? t.instagramEmailPlaceholder
                      : t.emailPlaceholderDefault
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-800 shadow-sm focus:outline-none focus:border-blue-500 transition-colors focus:bg-white text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">{t.accountPasswordLabel}</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t.minPass}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pr-12 rounded-2xl text-slate-800 shadow-sm focus:outline-none focus:border-blue-500 transition-colors focus:bg-white text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-lg hover:bg-slate-100/80"
                    title={showPassword ? t.hidePassword : t.showPassword}
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                onClick={handleSendVerificationCode}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl shadow-lg shadow-emerald-600/20 font-black uppercase tracking-wide text-xs mt-2 transition-all flex justify-center items-center gap-2 active:scale-95 cursor-pointer border-0"
              >
                <Lock size={16} /> {t.sendPinCodeBtn}
              </button>

              <TrustBadge t={t} />
            </div>
          </div>
        </div>
      )}

      {/* --- ENCUESTA DIAGNÓSTICA DE CONFIGURACIÓN INICIAL (PÁGINA APARTE 100VW 100VH) --- */}
      {view === 'survey' && (
        <div className="fixed inset-0 z-[500] w-screen min-h-screen bg-[#f8fafc] p-4 sm:p-8 overflow-y-auto flex items-center justify-center animate-pageIn">
          <div className="max-w-4xl w-full bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col justify-between min-h-[550px] survey-container">
            <header className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">{t.surveyTag}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => { setLanguage('es'); showToast("Idioma: Español", "success"); }}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${language === 'es' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      🇪🇸 ES
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLanguage('en'); showToast("Language: English", "success"); }}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${language === 'en' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      🇺🇸 EN
                    </button>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                    {t.step} {surveyStep} {t.of} 3
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(surveyStep / 3) * 100}%` }}
                ></div>
              </div>
            </header>

            <div className="flex-1 py-4 flex flex-col justify-center">
              {surveyStep === 1 && (
                <div className="space-y-4 animate-scaleIn">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-955 leading-tight">{t.step1Title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.step1Desc}</p>
                  </div>

                  <div className="flex justify-between items-center gap-2 pt-1">
                    <button
                      onClick={handleToggleSelectAllSubjects}
                      className="text-[11px] bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 font-black px-4 py-2.5 rounded-xl transition-all border border-slate-300/40 shadow-sm active:scale-95"
                    >
                      {surveySubjects.length === allSubjects.length ? t.deselectAll : t.selectAll}
                    </button>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 font-black px-3.5 py-2.5 rounded-xl border border-emerald-100/60 shadow-sm">
                      {surveySubjects.length} {t.chosen}
                    </span>
                  </div>

                  <div className="grid-subject-cards grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-2 border border-slate-100 rounded-[2rem] bg-slate-50/50 shadow-inner">
                    {allSubjects.map((subject, idx) => {
                      const isSelected = surveySubjects.some(s => s.name === subject.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleToggleSurveySubject(subject)}
                          className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all active:scale-95 relative ${isSelected
                            ? 'border-emerald-500 bg-white shadow-md scale-[1.03] ring-2 ring-emerald-500/20'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center text-white border border-white animate-bounce-slow">
                              <CheckCircle2 size={11} className="stroke-[3]" />
                            </span>
                          )}
                          <span className="text-xl bg-slate-50 p-1.5 rounded-lg shadow-inner">{subject.icon}</span>
                          <span className="font-extrabold text-[11px] text-slate-800 leading-tight">{subject.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {surveyStep === 2 && (
                <div className="space-y-4 animate-scaleIn">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{t.step2Title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.step2Desc}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      {t.motivationQ}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {t.motivationOpts.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setMotivationText(item.id)}
                          className={`p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${motivationText === item.id
                            ? 'border-emerald-500 bg-emerald-50/40 shadow-md text-emerald-900 scale-[1.01] ring-2 ring-emerald-500/10'
                            : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                          <span>{item.text}</span>
                          {motivationText === item.id && <CheckCircle2 size={14} className="text-emerald-600 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      {t.frustrationQ}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {t.frustrationOpts.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setFrustrationText(item.id)}
                          className={`p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${frustrationText === item.id
                            ? 'border-rose-500 bg-rose-50/40 shadow-md text-rose-950 scale-[1.01] ring-2 ring-rose-500/10'
                            : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                          <span>{item.text}</span>
                          {frustrationText === item.id && <AlertCircle size={14} className="text-rose-500 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {surveyStep === 3 && (
                <div className="space-y-4 animate-scaleIn">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{t.step3Title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.step3Desc}</p>
                  </div>

                  {/* SELECTOR DE IDIOMA EN PASO 3 */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      {t.selectAppLanguage}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => { setLanguage('es'); showToast("Idioma: Español", "success"); }}
                        className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${language === 'es' ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-sm font-black' : 'border-slate-100 bg-slate-50/50 hover:bg-white text-slate-700'}`}
                      >
                        <span>🇪🇸 {t.spanish}</span>
                        {language === 'es' && <CheckCircle2 size={14} className="text-emerald-600 stroke-[3]" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setLanguage('en'); showToast("Language: English", "success"); }}
                        className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${language === 'en' ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-sm font-black' : 'border-slate-100 bg-slate-50/50 hover:bg-white text-slate-700'}`}
                      >
                        <span>🇺🇸 {t.english}</span>
                        {language === 'en' && <CheckCircle2 size={14} className="text-emerald-600 stroke-[3]" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      {t.selectColorTheme}
                    </label>
                    <div className="grid grid-cols-5 gap-2.5">
                      {Object.keys(themes).map((colorKey) => {
                        const isSelected = surveyTheme === colorKey;
                        return (
                          <button
                            key={colorKey}
                            onClick={() => setSurveyTheme(colorKey)}
                            className={`h-11 rounded-xl flex items-center justify-center text-white font-bold transition-all relative ${themes[colorKey].primary} ${isSelected ? 'scale-110 ring-4 ring-slate-100 shadow-md border-2 border-white' : 'opacity-85 hover:opacity-100'
                              }`}
                            title={`Tema ${colorKey}`}
                          >
                            {isSelected && <CheckCircle2 size={16} className="text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      {t.displayPref}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDarkMode(!isDarkMode);
                        showToast(isDarkMode ? "Modo claro activado" : "Modo oscuro activado", "success");
                      }}
                      className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${isDarkMode
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                    >
                      {isDarkMode ? (
                        <>
                          <Smile size={16} className="text-yellow-500" />
                          <span>{t.lightModeBtn}</span>
                        </>
                      ) : (
                        <>
                          <Flame size={16} className="text-orange-500 animate-pulse" />
                          <span>{t.darkModeBtn}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-800 space-y-3 relative overflow-hidden bg-slate-50 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 bg-white rounded-xl shadow-sm">🎓</span>
                      <div>
                        <h4 className="font-black text-[11px] text-slate-800 leading-none">Previsualización de Tema</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Así lucirá tu cabecera principal</p>
                      </div>
                    </div>
                    <div className={`h-14 rounded-2xl bg-gradient-to-r ${themes[surveyTheme].gradient} p-4 text-slate-800 flex items-center justify-between shadow-md`}>
                      <p className="text-xs font-black">Prof. {userName || 'Docente de Aula'}</p>
                      <span className="text-xs font-bold">💎 10</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 bg-white flex gap-3">
              {surveyStep > 1 && (
                <button
                  onClick={() => setSurveyStep(prev => prev - 1)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-black uppercase text-xs tracking-wider transition-all active:scale-95 flex justify-center items-center gap-1.5 border"
                >
                  <ChevronLeft size={16} /> {t.back}
                </button>
              )}

              {surveyStep < 3 ? (
                <button
                  onClick={handleSurveyNextStep}
                  className={`py-3.5 rounded-2xl font-black uppercase text-xs tracking-wider flex justify-center items-center gap-1.5 active:scale-95 transition-all text-slate-900 flex-1 ${themes[surveyTheme].primary}`}
                >
                  {t.next} <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleCompleteSurvey}
                  className="flex-1 bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-xl shadow-xl font-black uppercase text-xs tracking-wider flex justify-center items-center gap-2 active:scale-95 transition-transform"
                >
                  {t.finish}
                  <CheckCircle2 size={16} className="text-emerald-400 animate-pulse" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD PRINCIPAL --- */}
      {view === 'welcome' && (
        <div className={`flex-1 pb-24 md:pb-8 animate-pageIn flex flex-col overflow-y-auto custom-scrollbar h-full transition-all duration-500 ${activeTheme.lightBg}`}>
          <div className={`p-8 rounded-b-[40px] ${activeTheme.text} shadow-lg relative overflow-hidden bg-gradient-to-b ${activeTheme.gradient}`}>
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-15 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-center mb-6 md:hidden">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner overflow-hidden">
                {customAvatarUrl ? (
                  <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={() => { setUserAvatar('👨‍🏫'); setCustomAvatarUrl(''); }} />
                ) : (
                  <span className="text-3xl animate-pulse-slow">{userAvatar}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setView('settings')} className="p-2 bg-white/15 hover:bg-white/25 rounded-2xl border border-white/10 transition-all active:scale-80" title="Configurar Aplicación">
                  <Settings size={20} className="animate-spin-slow text-slate-800" />
                </button>
                <button onClick={handleLogout} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-80"><LogOut size={18} className="text-slate-800" /></button>
              </div>
            </div>

            <h2 className="text-3xl font-black mb-1">{t.welcomeGreeting} {userName || 'Docente'}!</h2>
            <p className="opacity-90 text-sm font-semibold">{t.dashboardTitle}</p>
          </div>

          <div className="px-6 -mt-6 z-10 relative grid grid-cols-1 lg:grid-cols-3 gap-6 space-y-0 pb-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Row */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="text-center flex-1 border-r border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">{t.todayClasses}</p>
                  <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-white"><Clock size={16} className={activeTheme.textLight} /><span className="text-2xl font-black dark:text-white">4</span></div>
                </div>
                <div className="text-slate-850 flex-1 text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">{t.pendingTasks}</p>
                  <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-white"><List size={16} className="text-orange-500" /><span className="text-2xl font-black dark:text-white">2</span></div>
                </div>
              </div>

              {/* Consejero IA */}
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-indigo-100 dark:border-slate-700 p-6 shadow-sm space-y-4 animate-pageIn">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 rounded-2xl text-lg animate-pulse">💡</span>
                  <div>
                    <h4 className="font-black text-xs text-indigo-950 dark:text-white leading-none">{t.adaptiveAdvisor}</h4>
                    <p className="text-[9px] text-indigo-500 dark:text-indigo-300 font-bold uppercase tracking-wider mt-1">{t.adaptiveSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                    <p className="font-extrabold text-xs text-indigo-950 dark:text-white leading-tight">
                      {getImprovementPlanData().motivation.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-normal font-medium">
                      {getImprovementPlanData().motivation.tip}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-black text-rose-500 dark:text-rose-400">{t?.reliefPlanActivated || "Plan de Alivio Activado:"}</span>
                      <p className="font-extrabold text-xs text-indigo-950 dark:text-white leading-tight">
                        {getImprovementPlanData().frustration.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-300 leading-normal font-medium">
                      {getImprovementPlanData().frustration.tip}
                    </p>
                    <button
                      onClick={() => setView(getImprovementPlanData().frustration.actionView)}
                      className="text-[11px] font-black text-indigo-700 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3.5 py-2 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50 flex items-center gap-1 active:scale-95 transition-all mt-1 cursor-pointer"
                    >
                      {getImprovementPlanData().frustration.actionText} <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Accesos Rápidos */}
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-3 px-1 text-sm">{t.quickAccess}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setView('planning')} className="bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-200 dark:from-amber-950/75 dark:via-transparent dark:to-orange-950/80 dark:border-amber-700/50 text-[#1e293b] dark:text-white p-5 rounded-3xl text-left shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between min-h-[140px] cursor-pointer border border-amber-200/50">
                    <div>
                      <Calendar className="mb-2 opacity-95 text-[#020617] dark:text-amber-200" size={24} />
                      <p className="font-black text-sm text-[#0f172a] dark:text-white font-bold">{t.mySchedule}</p>
                    </div>
                    <div className="mt-2 border-t border-slate-400/20 dark:border-amber-700/40 pt-2 w-full">
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-[#334155] dark:text-amber-200 leading-none">
                        {getNextClassInfo().label}
                      </p>
                      <p className="text-[11px] font-black leading-tight mt-1 line-clamp-2 text-[#0f172a] dark:text-white font-extrabold">
                        {getNextClassInfo().text}
                      </p>
                    </div>
                  </button>
                  <button onClick={() => setView('materials')} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-3xl text-left shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all group flex flex-col justify-between min-h-[140px] cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:${activeTheme.lightBg} transition-colors ${activeTheme.lightBg} dark:bg-slate-700`}>
                      <BookOpen className={activeTheme.textLight} size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-sm">{t.resourceBank}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-300 font-medium mt-1">{t.curricularResources}</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Columna lateral en Desktop */}
            <div className="space-y-6">
              <div onClick={() => setView('chatbot')} className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between h-full cursor-pointer hover:bg-slate-800 transition-all shadow-lg hover:scale-[1.01] active:scale-95 min-h-[220px]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0" style={{ animation: 'pulse-ring 2s infinite' }}>
                    <Sparkles className="text-blue-400 animate-pulse-slow" size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-base">{t.aiTeacherCardTitle}</h3>
                    <span className="text-[10px] uppercase font-black text-blue-400 font-bold block mt-0.5">{language === 'en' ? 'Virtual Assistant' : 'Asistente Virtual'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-350 mt-4 leading-relaxed font-medium">{t.aiTeacherCardDesc}</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl mt-4 transition-all active:scale-95 shadow-lg">
                  {t.startChat}
                </button>
              </div>
            </div>
          </div>

          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- PANEL DE CONFIGURACIÓN --- */}
      {view === 'settings' && (
        <div className={`flex-1 pb-24 animate-pageIn flex flex-col overflow-y-auto custom-scrollbar transition-all duration-500 ${activeTheme.lightBg}`}>
          <header className={`p-6 pt-8 text-slate-800 rounded-b-[40px] shadow-md relative z-10 bg-gradient-to-r ${activeTheme.gradient}`}>
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => setView('welcome')} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-90"><ChevronLeft size={20} className="text-slate-800" /></button>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 font-black">Configuración</h2>
            </div>
            <div className="flex items-center justify-between mt-1 ml-14">
              <p className="text-slate-700 text-xs font-medium">Personalización del aula y preferencias</p>
            </div>
          </header>

          <div className="p-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 flex-1">
            {/* Columna 1 */}
            <div className="space-y-6">
              {/* DATOS DE CUENTA Y PERFIL (Nombre, Correo, Contraseña) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                  <User className="text-indigo-600" size={20} />
                  <div>
                    <h3 className="font-black text-sm text-slate-800">Datos de Cuenta y Perfil</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Modifica tu nombre, correo institucional o contraseña</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Nombre del Docente */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block ml-1">Nombre Completo del Docente:</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={accountUsername}
                        onChange={(e) => {
                          setAccountUsername(e.target.value);
                          setUserName(e.target.value);
                        }}
                        placeholder="Ej: Prof. María Rodríguez"
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Correo Electrónico */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block ml-1">Correo Electrónico:</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        placeholder="docente@colegio.edu.co"
                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Nueva Contraseña (Opcional) */}
                  <div className="pt-2 border-t border-slate-50 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block ml-1">Cambiar Contraseña (Opcional):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Nueva contraseña"
                          className="w-full bg-slate-50 border border-slate-200 pl-10 pr-9 py-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Confirmar contraseña"
                          className="w-full bg-slate-50 border border-slate-200 pl-10 pr-9 py-3 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón Guardar */}
                  <button
                    type="button"
                    onClick={handleSaveAccountSettings}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Save size={16} /> Guardar Cambios de Cuenta
                  </button>
                </div>
              </div>

              {/* AVATAR */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-3">
                  <Smile className="text-yellow-500" size={20} />
                  <h3 className="font-black text-sm text-slate-800">Emoticon / Foto de Perfil</h3>
                </div>
                <div className="flex justify-center py-2">
                  <div className="relative group">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg border-2 ${activeTheme.border} ${activeTheme.lightBg} overflow-hidden`}>
                      {customAvatarUrl ? (
                        <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl animate-bounce-slow">{userAvatar}</span>
                      )}
                    </div>
                    {customAvatarUrl && (
                      <button
                        onClick={() => { setCustomAvatarUrl(''); setUserAvatar('👨‍🏫'); showToast("Foto removida", "success"); }}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 hover:bg-red-650 text-white rounded-full flex items-center justify-center text-xs shadow-md border border-white font-bold cursor-pointer"
                        title="Eliminar foto"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {availableAvatars.map(em => (
                    <button
                      key={em}
                      onClick={() => { setUserAvatar(em); setCustomAvatarUrl(''); showToast("¡Avatar actualizado!", "success"); }}
                      className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${userAvatar === em && !customAvatarUrl ? 'bg-slate-100 border-2 border-slate-800 scale-110 shadow-sm' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-50 mt-3 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider block ml-1">Vincular mi propia foto:</p>
                  <div className="flex gap-2">
                    <label className="flex-1 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors text-center shadow-sm">
                      <Upload size={16} className="text-slate-500" />
                      <span>Galería / Archivos</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              showToast("La foto supera el límite de 3MB.", "error");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setCustomAvatarUrl(event.target.result);
                              showToast("¡Foto de perfil cargada!", "success");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                      className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${showAvatarUrlInput ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-50 hover:bg-slate-100 text-slate-650'}`}
                    >
                      <Image size={15} />
                      <span>{showAvatarUrlInput ? "Ocultar URL" : "Usar Link"}</span>
                    </button>
                  </div>
                  {showAvatarUrlInput && (
                    <div className="mt-2 space-y-2 animate-pageIn">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block ml-1">Enlace de imagen externa:</label>
                      <input
                        type="text"
                        value={customAvatarUrl.startsWith('data:') ? '' : customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://ejemplo.com/tu_foto.png"
                        className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs outline-none focus:border-slate-400 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* IDIOMA DE LA APLICACIÓN */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-3">
                  <Globe className="text-blue-500" size={20} />
                  <h3 className="font-black text-sm text-slate-800">{t.languageSectionTitle}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('es');
                      showToast("¡Idioma cambiado a Español!", "success");
                    }}
                    className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${language === 'es'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm scale-[1.02]'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <span className="text-base">🇪🇸</span>
                    <span>{t.spanish}</span>
                    {language === 'es' && <CheckCircle2 size={16} className="text-blue-600 ml-auto" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      showToast("Language changed to English!", "success");
                    }}
                    className={`py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${language === 'en'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm scale-[1.02]'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span>{t.english}</span>
                    {language === 'en' && <CheckCircle2 size={16} className="text-blue-600 ml-auto" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-6">
              {/* TEMAS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-3">
                  <Palette className="text-purple-500" size={20} />
                  <h3 className="font-black text-sm text-slate-800">{t.themeSectionTitle}</h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(themes).map(colorKey => (
                    <button
                      key={colorKey}
                      onClick={() => { setAppThemeColor(colorKey); showToast("¡Esquema de color aplicado!", "success"); }}
                      className={`h-11 rounded-xl flex items-center justify-center text-white font-bold transition-all ${themes[colorKey].primary} ${appThemeColor === colorKey ? 'scale-110 ring-4 ring-slate-100' : 'opacity-85'}`}
                    >
                      {appThemeColor === colorKey && <CheckCircle2 size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODO CLARO / OSCURO */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-3">
                  <Palette className="text-indigo-500" size={20} />
                  <h3 className="font-black text-sm text-slate-800">{t.screenModeTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    showToast(isDarkMode ? "Modo claro activado" : "Modo oscuro activado", "success");
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${isDarkMode
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                >
                  {isDarkMode ? (
                    <>
                      <Smile size={16} className="text-yellow-500" />
                      <span>{t.lightModeBtn}</span>
                    </>
                  ) : (
                    <>
                      <Flame size={16} className="text-orange-500 animate-pulse" />
                      <span>{t.darkModeBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- ASIGNATURAS --- */}
      {view === 'materials' && (
        <div className={`flex-1 animate-pageIn pb-24 md:pb-8 flex flex-col transition-all duration-500 ${activeTheme.lightBg}`}>
          <header className="px-6 pt-8 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
            <h1 className="text-2xl font-black text-slate-955 tracking-tight">{t.mySubjectsTitle || "Mis Asignaturas"}</h1>
            <p className="text-sm text-slate-500 mb-4 font-semibold">{t.mySubjectsSubtitle || "Filtrado adaptativo de tu plan curricular"}</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder={t.searchSubjectPlaceholder || "Buscar asignatura..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50/80 border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl text-sm outline-none" />
            </div>
          </header>
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Banner destacado: Educación Inclusiva y Apoyo Intelectual */}
            <div
              onClick={() => {
                setView('inclusiveSupport');
                setInclusiveSearch('');
                setInclusiveCategory('Todos');
              }}
              className="mb-6 p-5 rounded-[2rem] bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 dark:from-teal-600/90 dark:via-emerald-600/90 dark:to-indigo-800/90 text-white flex flex-col sm:flex-row items-center justify-between gap-5 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.005] active:scale-[0.995] transition-all border border-emerald-400/20"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">🤝</div>
                <div>
                  <h3 className="font-black text-sm sm:text-base leading-tight tracking-tight text-white font-extrabold">{t.inclusiveBannerTitle || "Educación Inclusiva y Apoyo Intelectual"}</h3>
                  <p className="text-[10px] sm:text-[11px] text-emerald-50/90 mt-1 font-semibold leading-relaxed">{t.inclusiveBannerDesc || "Estrategias, adaptaciones y recursos especiales para alumnos con discapacidad intelectual"}</p>
                </div>
              </div>
              <span className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-white/10 shrink-0">
                {t.inclusiveBannerBtn || "Explorar Recursos"} <ChevronRight size={12} />
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSubjects.map((s, idx) => (
                <div key={idx} onClick={() => { setSelectedSubject(s); setView('subjectDetail'); setSubjectTab('clases'); setSelectedPeriod(1); setGeneratedGuide(null); }} className={`${s.color} p-5 rounded-3xl flex flex-col items-start gap-4 shadow-md active:scale-95 transition-all cursor-pointer border ${s.border} ${s.hover}`}>
                  <div className="bg-white/90 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm">{s.icon}</div>
                  <div>
                    <p className={`font-black ${s.textColors} text-sm leading-tight font-extrabold`}>{t?.subjects?.[s.name] || s.name}</p>
                    <p className={`text-[10px] ${s.textColors} opacity-70 mt-1 font-bold uppercase`}>{language === 'en' ? 'View Resources' : 'Ver Recursos'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- CENTRO DE APOYO A LA DISCAPACIDAD INTELECTUAL --- */}
      {view === 'inclusiveSupport' && (() => {
        const availableTeacherSubjects = (selectedSubjects.length > 0 ? selectedSubjects : allSubjects) || [];
        const currentActiveSubject = duaSelectedSubject || availableTeacherSubjects[0] || allSubjects[0] || { name: 'General', icon: '📚' };
        const activeConditionsData = getDuaInclusionData(language).filter(c => duaSelectedConditions.includes(c.id));

        return (
          <div className={`flex-1 flex flex-col animate-pageIn pb-24 md:pb-8 transition-all duration-500 overflow-x-hidden min-w-0 ${activeTheme.lightBg}`}>
            {/* HEADER PRINCIPAL CON PESTAÑAS */}
            <header className="p-6 pt-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setView('materials')}
                    className="w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-800 dark:text-white transition-all shadow-sm active:scale-90 cursor-pointer border border-slate-200/40 dark:border-slate-700/40"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-indigo-50 dark:bg-slate-800 p-2.5 rounded-2xl shrink-0 shadow-inner">🧠</span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">{t.inclusiveHeaderTitle || "Centro de Educación Inclusiva & DUA"}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.inclusiveHeaderDesc || "Adaptaciones curriculares inteligentes conectadas con tus asignaturas"}</p>
                    </div>
                  </div>
                </div>

                {/* Botón de Acceso Rápido al Plan Guardado */}
                <button
                  onClick={() => setShowMyInclusivePlanModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer border-0"
                >
                  <ClipboardList size={16} />
                  <span>{t.myInclusivePlanBtn || "Mi Plan Inclusivo"} ({myInclusivePlan.length})</span>
                </button>
              </div>

              {/* PESTAÑAS DE NAVEGACIÓN SUPERIOR */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pt-2 pb-1">
                <button
                  onClick={() => setInclusiveSubTab('dua')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${inclusiveSubTab === 'dua'
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <Sparkles size={16} />
                  <span>{t.tabDuaAdaptor || "Adaptador DUA"}</span>
                </button>

                <button
                  onClick={() => setInclusiveSubTab('bank')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${inclusiveSubTab === 'bank'
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <BookOpen size={16} />
                  <span>{t.tabSpecialResources || "Banco de Recursos Especiales"}</span>
                </button>
              </div>
            </header>

            {/* CONTENIDO SEGÚN SUB-PESTAÑA */}
            <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar min-w-0">

              {/* ==================================================== */}
              {/* SUB-PESTAÑA 1: ADAPTADOR DUA & GENERADOR IA CONECTADO A MATERIAS */}
              {/* ==================================================== */}
              {inclusiveSubTab === 'dua' && (
                <div className="space-y-6 animate-fadeIn">

                  {/* SELECTOR DE MATERIAS DEL DOCENTE */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-black tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl">
                          {t.step1Tag || "1. Selecciona tu Asignatura"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {t.step1Sub || "(Materias activas de tu perfil docente)"}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {t.activeSubjectLabel || "Materia activa:"} <strong className="text-indigo-600 dark:text-indigo-300">{t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {availableTeacherSubjects.map((sub, idx) => {
                        const isSelected = (duaSelectedSubject?.name || availableTeacherSubjects[0]?.name) === sub.name;
                        return (
                          <button
                            key={idx}
                            onClick={() => setDuaSelectedSubject(sub)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border ${isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                                : 'bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                              }`}
                          >
                            <span className="text-base">{sub.icon}</span>
                            <span>{t?.subjects?.[sub.name] || sub.name}</span>
                            {isSelected && <CheckCircle2 size={14} className="text-white ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* VISTA 1: DASHBOARD DE SELECCIÓN MÚLTIPLE DE CONDICIONES */}
                  {duaViewMode === 'selection' ? (
                    <div className="space-y-6 animate-pageIn">
                      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl">
                          {t.step2Tag || "2. ¿Qué necesidades educativas deseas adaptar hoy?"}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                          {t.step2TitlePrefix || "Adaptaciones DUA para"} <span className="text-indigo-600 dark:text-indigo-400">{t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}</span>
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                          {t.step2Desc || "Puedes seleccionar una o varias condiciones. La Inteligencia Artificial cruzará las necesidades para brindarte tips DUA combinados y material adaptado a tu clase."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                        {getDuaInclusionData(language).map((item) => {
                          const isSelected = duaSelectedConditions.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleDuaCondition(item.id)}
                              className={`relative rounded-3xl p-6 border-2 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md ${isSelected
                                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-950/50 scale-[1.02]'
                                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                              {/* Checkbox badge */}
                              <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'
                                }`}>
                                <CheckCircle2 size={15} className={isSelected ? "opacity-100" : "opacity-0"} />
                              </div>

                              <div>
                                <div className={`${item.badgeColor} w-13 h-13 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner`}>
                                  {item.icon}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1.5">{item.title}</h4>
                                <p className="text-slate-500 dark:text-slate-300 text-xs font-medium leading-relaxed">{item.description}</p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                                <span>{item.tips.length} {t.pedagogicalTipsCount || "tips pedagógicos"}</span>
                                <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                                  {isSelected ? (t.selectedStatus || 'Seleccionado ✓') : (t.clickToAddStatus || 'Clic para añadir +')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* BOTÓN FLOTANTE O FIJO: Avanzar al generador */}
                      {duaSelectedConditions.length > 0 && (
                        <div className="sticky bottom-4 z-30 flex justify-center animate-pageIn">
                          <button
                            onClick={() => setDuaViewMode('generator')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-full shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center gap-3 text-sm active:scale-95 cursor-pointer border-0"
                          >
                            <Sparkles size={20} />
                            <span>{t.configureBtn || "Configurar Adaptaciones para"} {duaSelectedConditions.length} {duaSelectedConditions.length === 1 ? (t.conditionSingular || 'condición') : (t.conditionPlural || 'condiciones')} {t.inSubject || "en"} {t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}</span>
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* VISTA 2: PANEL DE ADAPTACIÓN Y GENERADOR IA */
                    <div className="space-y-6 animate-fadeIn">

                      {/* Barra Superior con Botón Volver y Resumen */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <button
                          onClick={() => setDuaViewMode('selection')}
                          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer transition-all active:scale-95"
                        >
                          <ArrowLeft size={16} />
                          <span>{t.changeConditionSelection || "Cambiar selección de condiciones"} ({duaSelectedConditions.length})</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.subjectLabel || "Asignatura:"}</span>
                          <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-900/40">
                            {currentActiveSubject.icon} {t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA IZQUIERDA: Tips DUA Combinados */}
                        <div className="lg:col-span-1 space-y-5">
                          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                            <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
                              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{t.activeProfiles || "Perfiles Activos"}</span>
                                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                  {duaSelectedConditions.length}
                                </span>
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {activeConditionsData.map(condition => (
                                  <span key={condition.id} className={`${condition.badgeColor} text-[11px] font-black px-3 py-1 rounded-xl flex items-center gap-1.5`}>
                                    <span>{condition.icon}</span> {condition.title}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                  {t.combinedDuaTips || "Tips DUA Combinados"}
                                </h4>
                                <button
                                  onClick={() => {
                                    activeConditionsData.forEach(c => {
                                      c.tips.forEach((tip, idx) => {
                                        toggleInclusivePlanItem({
                                          id: `dua-tip-${c.id}-${idx}`,
                                          title: `Tip ${c.title}: ${tip.slice(0, 30)}...`,
                                          category: `DUA - ${c.title}`,
                                          desc: tip,
                                          detail: `${language === 'en' ? 'Recommended strategy for' : 'Estrategia recomendada para'} ${t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}: ${tip}`,
                                          icon: c.icon
                                        });
                                      });
                                    });
                                    showToast(language === 'en' ? 'Tips added to your Inclusive Plan!' : '¡Tips añadidos a tu Plan Inclusivo!', 'success');
                                  }}
                                  className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                >
                                  {t.saveAllTips || "+ Guardar todos"}
                                </button>
                              </div>

                              <div className="max-h-[55vh] overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                                {activeConditionsData.map(condition => (
                                  <div key={condition.id} className="space-y-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                      {language === 'en' ? `For ${condition.title} in ${t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}:` : `Para ${condition.title} en ${currentActiveSubject.name}:`}
                                    </span>
                                    <ul className="space-y-2">
                                      {condition.tips.map((tip, idx) => (
                                        <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 font-medium">
                                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* COLUMNA DERECHA: Generador DUA con IA */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden space-y-5">

                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                  <Sparkles className="text-indigo-600 dark:text-indigo-400" size={22} />
                                  {t.packageGeneratorTitle || "Generador de Paquete DUA Inclusivo"}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                                  {language === 'en' ? (
                                    <>AI will adapt topic for <strong className="text-indigo-600 dark:text-indigo-300">{t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}</strong> cross-referencing needs of <strong className="text-indigo-600 dark:text-indigo-300">{activeConditionsData.map(c => c.title).join(' + ')}</strong>.</>
                                  ) : (
                                    <>La IA adaptará el tema para <strong className="text-indigo-600 dark:text-indigo-300">{currentActiveSubject.name}</strong> cruzando las necesidades de <strong className="text-indigo-600 dark:text-indigo-300">{activeConditionsData.map(c => c.title).join(' + ')}</strong>.</>
                                  )}
                                </p>
                              </div>
                              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                                Gemini IA 3.1
                              </span>
                            </div>

                            {/* Sugerencias Rápidas de Temas */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                {t.quickSuggestionsLabel || "Sugerencias rápidas para"} {t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}:
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  language === 'en' ? `Key concepts of ${t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}` : `Conceptos clave de ${currentActiveSubject.name}`,
                                  language === 'en' ? 'Guided practical activity' : 'Actividad práctica guiada',
                                  language === 'en' ? 'Review for diagnostic assessment' : 'Repaso para evaluación diagnóstica'
                                ].map((sug, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setDuaTopic(sug)}
                                    className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                                  >
                                    + {sug}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Campo de Tema */}
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                                {t.topicLabel || "Tema de la clase o instrucción a adaptar:"}
                              </label>
                              <textarea
                                value={duaTopic}
                                onChange={(e) => setDuaTopic(e.target.value)}
                                placeholder={language === 'en' ? `e.g. Explanation of key concepts of ${t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name} with visual examples and interactive activities...` : `Ej: Explicación de los conceptos fundamentales de ${currentActiveSubject.name} con ejemplos visuales y actividades participativas...`}
                                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:border-indigo-500 outline-none transition-all resize-none h-28 text-sm font-medium"
                              />
                            </div>

                            {/* Botón de Generación */}
                            <button
                              onClick={handleGenerateDuaAI}
                              disabled={!duaTopic.trim() || isGeneratingDua}
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer border-0 active:scale-95"
                            >
                              {isGeneratingDua ? (
                                <>
                                  <Loader2 className="animate-spin" size={18} />
                                  <span>{t.generatingPackageText || "Cruzando datos DUA y generando paquete con IA..."}</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles size={18} />
                                  <span>{t.generatePackageBtn || "Generar Paquete Inclusivo Combinado para"} {t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name}</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* RESULTADOS GENERADOS POR IA */}
                          {duaGeneratedResult && (
                            <div className="space-y-5 animate-pageIn">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                  <CheckCircle2 className="text-emerald-500" size={20} />
                                  <span>{t.adaptedMaterialReady || "Material Adaptado Listo para Usar"}</span>
                                </h3>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => exportDuaPackageToWord(duaGeneratedResult, duaTopic, currentActiveSubject, duaSelectedConditions)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer border-0"
                                  >
                                    <FileText size={14} /> {t.exportWord || "Exportar Word (.doc)"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      toggleInclusivePlanItem({
                                        id: `dua-pkg-${Date.now()}`,
                                        title: `${language === 'en' ? 'UDL Package:' : 'Paquete DUA:'} ${t?.subjects?.[currentActiveSubject.name] || currentActiveSubject.name} - ${duaTopic.slice(0, 25)}...`,
                                        category: language === 'en' ? 'AI UDL Package' : 'Paquete DUA IA',
                                        desc: `${language === 'en' ? 'Adapted for:' : 'Adaptado para:'} ${activeConditionsData.map(c => c.title).join(', ')}`,
                                        detail: `Quiz: ${duaGeneratedResult.quiz}\n\n${language === 'en' ? 'Game:' : 'Juego:'} ${duaGeneratedResult.game}\n\n${language === 'en' ? 'Slides:' : 'Diapositivas:'} ${duaGeneratedResult.presentation}`,
                                        icon: '🧠'
                                      });
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer border-0"
                                  >
                                    <Plus size={14} /> {t.saveToMyPlan || "Guardar en Mi Plan"}
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                {/* 1: Quiz */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                                  <div className="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300 p-3 rounded-2xl shrink-0 text-xl">
                                    📝
                                  </div>
                                  <div className="space-y-1.5 flex-1">
                                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{t.quizTitle || "1. Quiz Adaptado (Lectura Fácil)"}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-line leading-relaxed font-medium">
                                      {duaGeneratedResult.quiz}
                                    </p>
                                  </div>
                                </div>

                                {/* 2: Juego */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                                  <div className="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300 p-3 rounded-2xl shrink-0 text-xl">
                                    🎮
                                  </div>
                                  <div className="space-y-1.5 flex-1">
                                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{t.gameTitle || "2. Recomendación de Juego Web / Dinámica Interactiva"}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-line leading-relaxed font-medium">
                                      {duaGeneratedResult.game}
                                    </p>
                                  </div>
                                </div>

                                {/* 3: Diapositivas */}
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                                  <div className="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 p-3 rounded-2xl shrink-0 text-xl">
                                    🖥️
                                  </div>
                                  <div className="space-y-1.5 flex-1">
                                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{t.presentationTitle || "3. Estructura para Diapositivas y Secuencia Visual"}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-line leading-relaxed font-medium">
                                      {duaGeneratedResult.presentation}
                                    </p>
                                  </div>
                                </div>

                                {/* 4: Evaluación */}
                                {duaGeneratedResult.evaluation && (
                                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 items-start">
                                    <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 p-3 rounded-2xl shrink-0 text-xl">
                                      📊
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                      <h4 className="font-black text-slate-900 dark:text-white text-sm">{t.evaluationTitle || "4. Evaluación Flexible y Formativa"}</h4>
                                      <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-line leading-relaxed font-medium">
                                        {duaGeneratedResult.evaluation}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* SUB-PESTAÑA 2: BANCO DE RECURSOS ESPECIALES */}
              {/* ==================================================== */}
              {inclusiveSubTab === 'bank' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Barra de búsqueda y Filtros */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder={t.searchResourcePlaceholder || "Buscar estrategias, pictogramas o adaptaciones..."}
                          value={inclusiveSearch}
                          onChange={(e) => setInclusiveSearch(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-3 rounded-2xl text-sm outline-none transition-all focus:border-indigo-500 text-slate-800 dark:text-white font-medium"
                        />
                      </div>
                      <button
                        onClick={() => showToast(language === 'en' ? 'Search updated' : 'Búsqueda actualizada', 'success')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md border-0"
                      >
                        {t.searchBtn || "Buscar"}
                      </button>
                    </div>

                    {/* Píldoras de Filtros */}
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar whitespace-nowrap">
                      {(language === 'en' ? ['All', 'Curricular Adaptations', 'Behavior Management', 'Visual Materials', 'Flexible Assessment'] : ['Todos', 'Adaptaciones Curriculares', 'Manejo de Conducta', 'Materiales Visuales', 'Evaluación Flexible']).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setInclusiveCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${inclusiveCategory === cat
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-black scale-105'
                              : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Banner Interactivo de Mi Plan Inclusivo */}
                  <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between flex-wrap gap-4 border border-indigo-700/50">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/20 shrink-0">
                        📋
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-white leading-tight flex items-center gap-2">
                          {t.myInclusiveTeacherPlan || "Mi Plan Inclusivo Docente"}
                          <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">{myInclusivePlan.length} {t.savedBadge || "guardados"}</span>
                        </h3>
                        <p className="text-xs text-indigo-200 font-medium mt-1">
                          {myInclusivePlan.length === 0
                            ? (t.noSavedResourcesDesc || "Aún no has guardado recursos. Haz clic en '+ Añadir al Plan' en cualquier tarjeta para armar tu plan.")
                            : `${myInclusivePlan.length} ${t.savedResourcesDesc || "recurso(s) guardado(s). Puedes ver la lista completa o descargar el informe en Word."}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {myInclusivePlan.length > 0 && (
                        <>
                          <button
                            onClick={() => setShowMyInclusivePlanModal(true)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 backdrop-blur-md border border-white/20 cursor-pointer"
                          >
                            <Eye size={14} /> {t.viewMyPlan || "Ver Mi Plan"}
                          </button>
                          <button
                            onClick={() => exportInclusivePlanToWord(myInclusivePlan, showToast)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 shadow-md border-0 cursor-pointer"
                          >
                            <FileText size={14} /> {t.downloadWord || "Descargar Word (.doc)"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Cuadrícula de Recursos del Banco */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInclusiveResources.length > 0 ? (
                      filteredInclusiveResources.map((res) => {
                        const isSaved = myInclusivePlan.some(p => p.id === res.id);
                        return (
                          <div key={res.id} className={`p-5 rounded-3xl border ${isSaved ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'} flex flex-col justify-between gap-4 shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all group duration-300 relative`}>
                            <div className="space-y-3.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">{res.icon}</span>
                                  <div>
                                    <span className="text-[9px] uppercase font-black text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/60 dark:border-indigo-900/40 px-2 py-0.5 rounded-full font-bold">{res.category}</span>
                                    <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight mt-1.5 font-extrabold">{res.title}</h4>
                                  </div>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed">{res.desc}</p>
                            </div>

                            <div className="flex gap-2 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                              <button
                                onClick={() => {
                                  setSelectedInclusiveResource(res);
                                  setInclusiveAIResult(null);
                                  setShowInclusiveDetailModal(true);
                                }}
                                className="flex-1 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer border border-slate-200/50 dark:border-slate-600/30"
                              >
                                {t.viewDetailsBtn || "Ver detalle"}
                              </button>
                              <button
                                onClick={() => toggleInclusivePlanItem(res)}
                                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1.5 border-0 ${isSaved
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                  }`}
                              >
                                {isSaved ? (
                                  <>
                                    <CheckCircle2 size={14} /> {t.inYourPlanBtn || "✓ En tu Plan"}
                                  </>
                                ) : (
                                  <>
                                    <Plus size={14} /> {t.addToPlanBtn || "+ Añadir al Plan"}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-12 text-center space-y-3">
                        <span className="text-4xl">🔍</span>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t.noResourcesFound || "No encontramos recursos para tu búsqueda."}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal de Detalle de Recurso con IA y Descarga */}
            {showInclusiveDetailModal && selectedInclusiveResource && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 space-y-5 animate-scaleIn custom-scrollbar">

                  {/* Header Modal */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-indigo-50 dark:bg-slate-900 p-2.5 rounded-2xl shrink-0">{selectedInclusiveResource.icon}</span>
                      <div>
                        <span className="text-[9px] uppercase font-black text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/60 dark:border-indigo-900/40 px-2 py-0.5 rounded-full font-bold">{selectedInclusiveResource.category}</span>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-1 font-extrabold">{selectedInclusiveResource.title}</h3>
                      </div>
                    </div>
                    <button onClick={() => setShowInclusiveDetailModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Cuerpo Detalle */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white mb-1">{t.pedagogicalStrategyLabel || "Estrategia Pedagógica:"}</h4>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{selectedInclusiveResource.detail}</p>
                    </div>

                    <div className="bg-indigo-50/50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/30">
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-850 dark:text-indigo-300 leading-none">{t.duaPiarBenefitTitle || "Beneficio DUA / PIAR"}</p>
                      <p className="text-[11px] text-indigo-950/80 dark:text-indigo-200 font-semibold mt-1.5 leading-relaxed">{t.duaPiarBenefitDesc || "Facilita el Diseño Universal para el Aprendizaje al proveer representaciones múltiples y accesibilidad cognitiva directa en el aula."}</p>
                    </div>

                    {/* IA Result Section */}
                    {inclusiveAIResult && (
                      <div className="bg-violet-50 dark:bg-violet-950/40 p-4 rounded-2xl border border-violet-200 dark:border-violet-800/40 animate-pageIn space-y-2">
                        <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-300 font-black text-xs">
                          <Sparkles size={14} /> {t.aiPracticalGuideTitle || "Guía Práctica Generada por IA:"}
                        </div>
                        <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                          {typeof inclusiveAIResult === 'string' ? inclusiveAIResult : JSON.stringify(inclusiveAIResult, null, 2)}
                        </div>
                      </div>
                    )}

                    {/* Acciones de IA y Descarga */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleGenerateInclusiveAI(selectedInclusiveResource)}
                        disabled={isGeneratingInclusiveAI}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer border-0 active:scale-95 transition-all"
                      >
                        {isGeneratingInclusiveAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {t.generateAiGuideBtn || "Generar Guía IA"}
                      </button>

                      <button
                        onClick={() => exportInclusivePlanToWord([selectedInclusiveResource], showToast)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer border-0 active:scale-95 transition-all"
                      >
                        <FileText size={14} /> {t.downloadWordShort || "Descargar Word"}
                      </button>
                    </div>
                  </div>

                  {/* Footer Modal */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => setShowInclusiveDetailModal(false)}
                      className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-0"
                    >
                      {t.closeBtn || "Cerrar"}
                    </button>
                    <button
                      onClick={() => {
                        toggleInclusivePlanItem(selectedInclusiveResource);
                        setShowInclusiveDetailModal(false);
                      }}
                      className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1.5 border-0 ${myInclusivePlan.some(p => p.id === selectedInclusiveResource.id)
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                      {myInclusivePlan.some(p => p.id === selectedInclusiveResource.id) ? (t.inYourPlanBtn || '✓ En tu Plan') : (t.addToPlanBtn || '+ Añadir al Plan')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de "Mi Plan Inclusivo Guardado" */}
            {showMyInclusivePlanModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 max-w-xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 space-y-5 animate-scaleIn custom-scrollbar">

                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-indigo-50 dark:bg-slate-900 p-2.5 rounded-2xl">📋</span>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight font-black">{t.mySavedInclusivePlanTitle || "Mi Plan Inclusivo Guardado"}</h3>
                        <p className="text-xs text-slate-400 font-semibold">{myInclusivePlan.length} {t.resourcesInActivePlan || "recurso(s) en tu plan activo"}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMyInclusivePlanModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>

                  {myInclusivePlan.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <span className="text-4xl">📭</span>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{t.noResourcesInPlan}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                        {myInclusivePlan.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.icon || '🤝'}</span>
                              <div>
                                <p className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</p>
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{item.category}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleInclusivePlanItem(item)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors cursor-pointer"
                            >
                              {t.removeBtn || "Eliminar"}
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                        <button
                          onClick={() => exportInclusivePlanToWord(myInclusivePlan, showToast)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer border-0"
                        >
                          <FileText size={16} /> {t.exportPlanWord || "Exportar Plan a Word (.doc)"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
          </div>
        );
      })()}

      {/* --- ENCUESTA DE BIENESTAR DOCENTE (BLANK LAYOUT 100VW 100VH) --- */}
      {view === 'encuestaBienestar' && (
        <EncuestaBienestarView setView={setView} showToast={showToast} language={language} />
      )}

      {/* --- ASIGNATURA DETALLE (NOTEBOOK VIEW) --- */}
      {view === 'subjectDetail' && selectedSubject && (
        <>
          <NotebookView
            selectedSubject={selectedSubject}
            setView={setView}
            activeTheme={activeTheme}
            showToast={showToast}
            allSubjects={filteredSubjects.length > 0 ? filteredSubjects : allSubjects}
            setSelectedSubject={setSelectedSubject}
            apiKey={apiKey}
            language={language}
          />
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </>
      )}

      {/* --- GESTIÓN DOCENTE --- */}
      {view === 'exploreMore' && (
        <div className={`flex-1 p-6 pt-8 animate-pageIn pb-24 md:pb-8 overflow-y-auto transition-all duration-500 ${activeTheme.lightBg}`}>
          <header className="mb-8">
            <h2 className="text-3xl font-black text-slate-955 tracking-tight leading-tight font-black">{t.curriculumManagement}</h2>
            <p className="text-slate-500 text-sm mt-2">{t.designMallasUnits}</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-0">
            <div onClick={() => setView('mallas')} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md cursor-pointer flex flex-col justify-between hover:border-blue-200 transition-all hover:scale-[1.01] min-h-[180px]">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0"><FileSpreadsheet size={32} className={`${activeTheme.textLight}`} /></div>
              <div className="mt-4">
                <h3 className="text-base font-black text-slate-800 mb-1 font-extrabold">{t.annualMalla}</h3>
                <p className="text-xs text-slate-500 font-medium">{t.mallaDesc}</p>
              </div>
            </div>
            <div onClick={() => setView('unidades')} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md cursor-pointer flex flex-col justify-between hover:border-green-200 transition-all hover:scale-[1.01] min-h-[180px]">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center shrink-0"><FilePlus size={32} className="text-green-600" /></div>
              <div className="mt-4">
                <h3 className="text-base font-black text-slate-800 mb-1 font-extrabold">{t.didacticUnits}</h3>
                <p className="text-xs text-slate-500 font-medium">{t.unitDesc}</p>
              </div>
            </div>
            <div onClick={() => setView('planning')} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md cursor-pointer flex flex-col justify-between hover:border-yellow-200 transition-all hover:scale-[1.01] min-h-[180px]">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center shrink-0"><Calendar size={32} className="text-yellow-600" /></div>
              <div className="mt-4">
                <h3 className="text-base font-black text-slate-800 mb-1 font-extrabold">{t.scheduleAI}</h3>
                <p className="text-xs text-slate-500 font-medium">{t.scheduleDesc}</p>
              </div>
            </div>
          </div>
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- MALLAS CURRICULARES POR MATERIA Y GRADO --- */}
      {view === 'mallas' && (
        <div className={`flex-1 animate-pageIn pb-24 md:pb-8 flex flex-col transition-all duration-500 ${activeTheme.lightBg}`}>
          <header className={`px-6 pt-8 pb-6 text-slate-800 rounded-b-[40px] sticky top-0 z-10 shadow-md bg-gradient-to-r ${activeTheme.gradient}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setView('exploreMore')} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-90 cursor-pointer"><ChevronLeft size={20} className="text-slate-800" /></button>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 font-black">{language === 'en' ? 'Curriculum Grids' : 'Mallas Curriculares'}</h2>
              </div>
              <button
                onClick={() => { setGeneradorTarget('mallas'); setIsGeneradorModalOpen(true); }}
                className="bg-white/80 hover:bg-white text-indigo-700 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer border-0"
              >
                <Sparkles size={16} className="text-indigo-600" /> {language === 'en' ? '✨ Generate with AI' : '✨ Generar con IA'}
              </button>
            </div>
            <p className="text-slate-700 text-xs ml-14 font-semibold">{language === 'en' ? 'Macrocurricular design by subject, grade, and terms' : 'Diseño macrocurricular por materia, grado y periodos'}</p>
          </header>

          <div className="p-6 flex-1 flex flex-col max-w-5xl mx-auto w-full space-y-4">
            {/* Controles de Filtro: Materia y Grado */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Selector de Materia */}
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{language === 'en' ? 'Select Subject:' : 'Selecciona la Materia:'}</label>
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {(selectedSubjects.length > 0 ? selectedSubjects : allSubjects).map((subj, idx) => {
                      const currentSubjName = activeMallaSubject?.name || (selectedSubjects[0] || allSubjects[0]).name;
                      const isActive = currentSubjName === subj.name;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveMallaSubject(subj)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                            isActive ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{subj.icon}</span> <span>{t?.subjects?.[subj.name] || subj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selector de Grado */}
                <div className="space-y-1 shrink-0">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{language === 'en' ? 'Grade Level:' : 'Grado Académico:'}</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    {['6', '7', '8', '9', '10', '11'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedGrade === String(g) ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {g}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pestañas de Periodos */}
            <div className="flex bg-slate-200/50 p-1 rounded-2xl shadow-inner">
              {[1, 2, 3, 4].map((p) => (
                <button key={p} onClick={() => setMallaTab(p)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${mallaTab === p ? 'bg-white shadow-sm scale-105 font-black ' + activeTheme.textLight : 'text-slate-500'}`}>
                  {language === 'en' ? `Term ${p}` : `Periodo ${p}`}
                </button>
              ))}
            </div>

            {/* Editor de Contenido por Materia, Grado y Periodo */}
            {(() => {
              const currentSubj = activeMallaSubject || selectedSubjects[0] || allSubjects[0];
              const currentSubjName = currentSubj.name;
              const key = `${currentSubjName}_g${selectedGrade}`;
              const currentText = (mallaData[key] && mallaData[key][`p${mallaTab}`] !== undefined)
                ? mallaData[key][`p${mallaTab}`]
                : '';

              return (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-1 flex flex-col space-y-3" key={`${key}-p${mallaTab}`}>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                      <span className="text-base">{currentSubj.icon}</span>
                      <span>
                        {language === 'en'
                          ? `Curriculum Grid: ${t?.subjects?.[currentSubjName] || currentSubjName} — Grade ${selectedGrade} (Term ${mallaTab})`
                          : `Malla Curricular: ${currentSubjName} — Grado ${selectedGrade}° (Periodo ${mallaTab})`}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setGeneradorTarget('mallas'); setIsGeneradorModalOpen(true); }}
                        className="text-xs font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={14} className="text-indigo-600" /> {language === 'en' ? 'Auto-fill with AI' : 'Auto-llenar con IA'}
                      </button>
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">
                        {language === 'en' ? 'Editable' : 'Editable'}
                      </span>
                    </div>
                  </div>
                  <textarea
                    value={currentText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMallaData(prev => ({
                        ...prev,
                        [key]: {
                          ...(prev[key] || {}),
                          [`p${mallaTab}`]: val
                        }
                      }));
                    }}
                    placeholder={
                      language === 'en'
                        ? `Enter curriculum grid content for ${t?.subjects?.[currentSubjName] || currentSubjName} (Grade ${selectedGrade} - Term ${mallaTab}) here or click "Auto-fill with AI" above to structure it automatically...\n\n1. Curriculum Standards...\n2. Basic Learning Rights (DBA)...\n3. Thematic Axes...`
                        : `Escribe aquí el contenido de la malla para ${currentSubjName} (${selectedGrade}° - Periodo ${mallaTab}) o haz clic en "Auto-llenar con IA" arriba para estructurarla automáticamente...\n\n1. Estándares Curriculares...\n2. Derechos Básicos de Aprendizaje (DBA)...\n3. Ejes Temáticos...`
                    }
                    className="w-full flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none resize-none focus:border-indigo-400 focus:bg-white transition-all font-medium text-slate-800 leading-relaxed min-h-[220px]"
                  />
                </div>
              );
            })()}

            <button onClick={handleGuardarMalla} className={`w-full text-white py-4 rounded-2xl font-black uppercase tracking-wide text-xs flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r ${activeTheme.gradient} cursor-pointer`}>
              <Save size={18} />
              {language === 'en'
                ? `Export Grid for ${t?.subjects?.[(activeMallaSubject || selectedSubjects[0] || allSubjects[0]).name] || (activeMallaSubject || selectedSubjects[0] || allSubjects[0]).name} - Grade ${selectedGrade} (CSV)`
                : `Exportar Malla de ${(activeMallaSubject || selectedSubjects[0] || allSubjects[0]).name} - Grado ${selectedGrade}° (CSV)`}
            </button>
          </div>
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- UNIDADES DIDÁCTICAS POR MATERIA Y GRADO --- */}
      {view === 'unidades' && (
        <div className={`flex-1 animate-pageIn pb-24 md:pb-8 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-500 ${activeTheme.lightBg}`}>
          <header className="px-6 pt-8 pb-6 bg-green-600 text-white rounded-b-[40px] sticky top-0 z-20 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setView('exploreMore')} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-90 cursor-pointer"><ChevronLeft size={20} /></button>
                <h2 className="text-2xl font-black tracking-tight font-black">{language === 'en' ? 'Didactic Units' : 'Unidades Didácticas'}</h2>
              </div>
              <button
                onClick={() => { setGeneradorTarget('unidades'); setIsGeneradorModalOpen(true); }}
                className="bg-white hover:bg-green-50 text-green-700 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer border-0"
              >
                <Sparkles size={16} className="text-green-600" /> {language === 'en' ? '✨ Generate with AI' : '✨ Generar con IA'}
              </button>
            </div>
            <p className="text-green-200 text-xs ml-14 font-medium">{language === 'en' ? 'Design units by subject and grade level' : 'Diseña las unidades por asignatura y grado académico'}</p>
          </header>

          <div className="p-6 space-y-5 flex-1 flex flex-col max-w-5xl mx-auto w-full">
            {/* Controles de Filtro: Materia y Grado */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Selector de Materia */}
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{language === 'en' ? 'Select Subject:' : 'Selecciona la Materia:'}</label>
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {(selectedSubjects.length > 0 ? selectedSubjects : allSubjects).map((subj, idx) => {
                      const isActive = activeUnitSubject?.name === subj.name;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveUnitSubject(subj)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                            isActive ? 'bg-green-600 text-white shadow-md scale-105' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{subj.icon}</span> <span>{t?.subjects?.[subj.name] || subj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selector de Grado */}
                <div className="space-y-1 shrink-0">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{language === 'en' ? 'Grade Level:' : 'Grado Académico:'}</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    {['6', '7', '8', '9', '10', '11'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedGrade === String(g) ? 'bg-green-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {g}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const currentSubj = activeUnitSubject || selectedSubjects[0] || allSubjects[0];
              const subjName = currentSubj.name;
              const key = `${subjName}_g${selectedGrade}`;
              const unitData = {
                titulo: (unidadesData[key] && unidadesData[key].titulo !== undefined) ? unidadesData[key].titulo : '',
                objetivo: (unidadesData[key] && unidadesData[key].objetivo !== undefined) ? unidadesData[key].objetivo : '',
                actividades: (unidadesData[key] && unidadesData[key].actividades !== undefined) ? unidadesData[key].actividades : '',
              };

              return (
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0" key={key}>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 block font-extrabold">{language === 'en' ? '1. Unit Title' : '1. Título de la Unidad'}</label>
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">{t?.subjects?.[subjName] || subjName} ({selectedGrade}°)</span>
                      </div>
                      <input
                        type="text"
                        value={unitData.titulo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUnidadesData(prev => ({
                            ...prev,
                            [key]: { ...(prev[key] || {}), titulo: val }
                          }));
                        }}
                        placeholder={language === 'en' ? `Enter title for ${t?.subjects?.[subjName] || subjName} (Grade ${selectedGrade})...` : `Escribe el título para ${subjName} (Grado ${selectedGrade}°)...`}
                        className="w-full bg-slate-50 border p-4 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-green-400 transition-all text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1 block font-extrabold">{language === 'en' ? '2. Learning Objectives' : '2. Objetivos de Aprendizaje'}</label>
                      <textarea
                        value={unitData.objetivo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUnidadesData(prev => ({
                            ...prev,
                            [key]: { ...(prev[key] || {}), objetivo: val }
                          }));
                        }}
                        placeholder={language === 'en' ? `Enter learning objectives for Grade ${selectedGrade}...` : `Escribe los objetivos de aprendizaje para Grado ${selectedGrade}°...`}
                        className="w-full bg-slate-50 border p-4 rounded-2xl text-xs font-semibold leading-relaxed min-h-[140px] outline-none resize-none focus:bg-white focus:border-green-400 transition-all text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 block font-extrabold">{language === 'en' ? '3. Didactic Sequence & Rubric' : '3. Secuencia Didáctica y Rúbrica'}</label>
                        <button
                          onClick={() => { setGeneradorTarget('unidades'); setIsGeneradorModalOpen(true); }}
                          className="text-[11px] font-black text-green-700 hover:text-green-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={13} /> {language === 'en' ? 'Auto-fill with AI' : 'Auto-llenar con IA'}
                        </button>
                      </div>
                      <textarea
                        value={unitData.actividades}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUnidadesData(prev => ({
                            ...prev,
                            [key]: { ...(prev[key] || {}), actividades: val }
                          }));
                        }}
                        placeholder={language === 'en' ? `Enter didactic sequence (Warm-up, Development, Closure) for Grade ${selectedGrade}...` : `Escribe la secuencia didáctica (Inicio, Desarrollo, Cierre) para Grado ${selectedGrade}°...`}
                        className="w-full bg-slate-50 border p-4 rounded-2xl text-xs font-semibold leading-relaxed min-h-[140px] outline-none resize-none focus:bg-white focus:border-green-400 transition-all text-slate-800"
                      />
                    </div>
                    <button onClick={handleGuardarUnidad} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-wide text-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
                      <Save size={18} /> {language === 'en' ? `Download Unit (${t?.subjects?.[subjName] || subjName} - Grade ${selectedGrade}) (CSV)` : `Descargar Unidad (${subjName} - ${selectedGrade}°) (CSV)`}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- HORARIOS & ORGANIZADOR ACADÉMICO --- */}
      {view === 'planning' && (
        <div className={`flex-1 animate-pageIn pb-24 md:pb-8 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-500 ${activeTheme.lightBg}`}>
          <header className="px-6 pt-8 pb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white rounded-b-[40px] shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('exploreMore')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md transition-all active:scale-90 cursor-pointer border border-white/20">
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-white font-black">{language === 'en' ? 'Schedule Organizer' : 'Organizador de Horarios'}</h2>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-white/20">
                      ⚡ {language === 'en' ? 'With AI' : 'Con IA'}
                    </span>
                  </div>
                  <p className="text-amber-100 text-xs font-medium mt-1">{language === 'en' ? 'Digitization and structuring of the school day by days and class slots' : 'Digitalización y estructuración de la jornada escolar por días y franjas lectivas'}</p>
                </div>
              </div>

              {/* Botón de Cargar Ejemplo si no hay horario */}
              {Object.keys(scheduleConfig).length === 0 && (
                <button
                  onClick={loadSampleSchedule}
                  className="bg-white text-amber-900 hover:bg-amber-50 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 flex items-center gap-2 shadow-md cursor-pointer border-0"
                >
                  <Sparkles size={16} className="text-amber-600" /> {language === 'en' ? 'Load Sample Schedule' : 'Cargar Horario Ejemplo'}
                </button>
              )}
            </div>
          </header>

          <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">

            {/* Tarjeta de Carga / Subida de Documento */}
            <div className={`bg-white p-6 rounded-[2.5rem] border-2 border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${fileName ? 'border-emerald-300 bg-emerald-50/20' : 'border-amber-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${fileName ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {fileName ? <CheckCircle2 size={28} /> : <Calendar size={28} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{fileName ? (language === 'en' ? 'Document Processed' : 'Documento Procesado') : (language === 'en' ? 'Upload or Scan Your School Schedule' : 'Sube o Escanea tu Horario Institucional')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{fileName || (language === 'en' ? 'Supports PDF files, Excel spreadsheets, or images.' : 'Soporta archivos PDF, planillas Excel o imágenes.')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {!fileName && (
                  <label className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-2xl text-xs font-black cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-2 border-0">
                    <Upload size={16} /> {language === 'en' ? 'Upload Document' : 'Subir Documento'}
                    <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.xlsx" />
                  </label>
                )}

                {fileName && !isAnalyzingSchedule && Object.keys(scheduleConfig).length === 0 && (
                  <button onClick={simulateAIAnalysis} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wide flex justify-center gap-2 items-center cursor-pointer shadow-md active:scale-95 transition-all">
                    <Sparkles size={16} className="text-yellow-400" /> {language === 'en' ? 'Process with AI' : 'Procesar con IA'}
                  </button>
                )}

                {isAnalyzingSchedule && (
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
                    <Loader2 size={18} className="animate-spin text-amber-600" />
                    <span>{aiStatusMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* VISTA DE HORARIO ORGANIZADA POR DÍAS */}
            {Object.keys(scheduleConfig).length > 0 && (
              <div className="space-y-6 animate-pageIn">

                {/* BARRA DE FILTROS POR DÍA (Días de la semana organizaditos) */}
                <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar whitespace-nowrap pb-1 sm:pb-0">
                    {[
                      { id: 'Todos', label: language === 'en' ? '🗓️ All Days' : '🗓️ Todos los Días' },
                      { id: 'Lunes', label: language === 'en' ? '🌅 Monday' : '🌅 Lunes' },
                      { id: 'Martes', label: language === 'en' ? '🚀 Tuesday' : '🚀 Martes' },
                      { id: 'Miércoles', label: language === 'en' ? '💡 Wednesday' : '💡 Miércoles' },
                      { id: 'Jueves', label: language === 'en' ? '⚡ Thursday' : '⚡ Jueves' },
                      { id: 'Viernes', label: language === 'en' ? '🎉 Friday' : '🎉 Viernes' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedScheduleDay(tab.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${selectedScheduleDay === tab.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md font-black scale-105'
                            : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-slate-400 font-bold px-3">
                    {Object.keys(scheduleConfig).length} {language === 'en' ? 'Classes scheduled' : 'Clases programadas'}
                  </div>
                </div>

                {/* CUADRÍCULA DE DÍAS Y HORAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {days
                    .filter(day => selectedScheduleDay === 'Todos' || selectedScheduleDay === day)
                    .map(day => {
                      const dayConfig = {
                        "Lunes": { gradient: "from-blue-600 to-indigo-600", emoji: "🌅", bgLight: "bg-blue-50/50" },
                        "Martes": { gradient: "from-indigo-600 to-purple-600", emoji: "🚀", bgLight: "bg-indigo-50/50" },
                        "Miércoles": { gradient: "from-purple-600 to-pink-600", emoji: "💡", bgLight: "bg-purple-50/50" },
                        "Jueves": { gradient: "from-amber-500 to-orange-600", emoji: "⚡", bgLight: "bg-amber-50/50" },
                        "Viernes": { gradient: "from-emerald-600 to-teal-600", emoji: "🎉", bgLight: "bg-emerald-50/50" }
                      }[day] || { gradient: "from-slate-700 to-slate-900", emoji: "📅", bgLight: "bg-slate-50" };

                      const dayAssignedSlots = hours.filter(h => scheduleConfig[`${day}-${h}`]);
                      const dayDisplayName = language === 'en' ? ({ "Lunes": "Monday", "Martes": "Tuesday", "Miércoles": "Wednesday", "Jueves": "Thursday", "Viernes": "Friday" }[day] || day) : day;

                      return (
                        <div key={day} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden flex flex-col justify-between hover:border-amber-300 transition-all duration-300">
                          <div>
                            {/* Cabecera del Día */}
                            <div className={`bg-gradient-to-r ${dayConfig.gradient} p-4 text-white flex items-center justify-between shadow-sm`}>
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{dayConfig.emoji}</span>
                                <span className="font-black text-sm uppercase tracking-wider">{dayDisplayName}</span>
                              </div>
                              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black border border-white/20">
                                {dayAssignedSlots.length} {language === 'en' ? 'class(es)' : 'clase(s)'}
                              </span>
                            </div>

                            {/* Franjas Horarias */}
                            <div className="p-4 space-y-3">
                              {hours.map(hour => {
                                const slotKey = `${day}-${hour}`;
                                const isAssigned = scheduleConfig[slotKey];

                                return (
                                  <div
                                    key={hour}
                                    className={`p-3.5 rounded-2xl border transition-all ${isAssigned
                                        ? 'bg-amber-50/40 border-amber-200/80 shadow-sm'
                                        : 'bg-slate-50/60 border-dashed border-slate-200/80'
                                      }`}
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock size={11} /> {hour}
                                      </span>
                                      {isAssigned && (
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{language === 'en' ? 'Teaching' : 'Lectiva'}</span>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <div className={`text-xs ${isAssigned ? 'font-black text-slate-900' : 'font-semibold text-slate-400 italic flex items-center gap-1'}`}>
                                        {isAssigned ? (
                                          <div className="flex items-center gap-2">
                                            <span className="text-base">📖</span>
                                            <span>{isAssigned}</span>
                                          </div>
                                        ) : (
                                          <span>☕ Franja Libre / Tiempo de Planeación</span>
                                        )}
                                      </div>

                                      {isAssigned && (
                                        <textarea
                                          value={notes[slotKey] || ""}
                                          onChange={(e) => setNotes({ ...notes, [slotKey]: e.target.value })}
                                          placeholder="📝 Notas de la clase (ej: laboratorio, entregas)..."
                                          className="w-full text-[11px] bg-white border border-slate-200 p-2.5 rounded-xl h-14 outline-none resize-none shadow-inner focus:border-amber-400 text-slate-700 font-medium"
                                        />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Acciones del Calendario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleGuardarPlaneacion}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all border-0"
                  >
                    <CalendarPlus size={18} className="text-amber-400" /> Exportar a Calendario (.ics)
                  </button>
                  <button
                    onClick={handleActivarNotificaciones}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all border-0"
                  >
                    <BellRing size={18} /> Activar Notificaciones y Alertas
                  </button>
                </div>

              </div>
            )}
          </div>

          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- PROPOSITO VIEW --- */}
      {view === 'proposito' && (
        <div className={`flex-1 animate-pageIn pb-24 md:pb-8 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-500 ${activeTheme.lightBg}`}>
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 md:m-6 md:rounded-[2rem] overflow-hidden">
            <PropositoView language={language} />
          </div>
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}

      {/* --- CHATBOT IA DOCENTE (MENTOR IA) --- */}
      {view === 'chatbot' && (
        <div className={`flex-1 animate-pageIn flex flex-col h-full pb-24 md:pb-8 transition-all duration-500 max-w-5xl mx-auto w-full md:border-x md:border-slate-100 ${activeTheme.lightBg}`}>
          <header className={`px-4 py-3 bg-gradient-to-r from-[#4f83e2] to-[#7b4fe2] flex items-center justify-between shadow-md z-10 sticky top-0`}>
            <div className="flex items-center gap-3">
              <button onClick={() => setView('welcome')} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all active:scale-90 cursor-pointer"><ChevronLeft size={20} className="text-white" /></button>
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-inner relative animate-pulse-slow">
                <Sparkles size={20} className="text-white" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-transparent rounded-full"></span>
              </div>
              <div>
                <h2 className="font-black text-white text-sm tracking-tight">{t.aiMentorTitle}</h2>
                <p className="text-[10px] text-white/80 font-bold">{t.aiMentorStatus}</p>
              </div>
            </div>
            <button onClick={clearChat} className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer" title={t.clearChat}><Trash2 size={18} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-900/50 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4f83e2]/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>
            <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>

            <div className="text-center my-4">
              <span className="bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hoy</span>
            </div>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-pageIn`}>
                <div className={`max-w-[95%] md:max-w-[85%] p-5 text-sm leading-relaxed shadow-lg relative ${msg.role === 'user' ? 'bg-gradient-to-br from-[#4f83e2] to-[#3b6bbf] text-white rounded-3xl rounded-br-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-3xl rounded-bl-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100'}`}>
                  {msg.role === 'user' ? (
                    <p>{msg.text}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {i === 0 ? t.chatInitialMessage : msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 shadow-md items-center h-12">
                  <div className="w-2 h-2 bg-[#4f83e2] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#4f83e2] rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-[#4f83e2] rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} className="h-4" />
          </div>

          <div className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex gap-2 mb-12 md:mb-4 items-end relative">
            <div className="relative">
              <button
                onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm cursor-pointer ${isPlusMenuOpen ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
              >
                <Plus size={24} />
              </button>

              {/* Popover Menu */}
              {isPlusMenuOpen && (
                <div className="absolute bottom-16 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 w-56 p-2 z-50 animate-pageIn origin-bottom-left">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => { setInputText(prev => prev + ' [Subir archivo...] '); setIsPlusMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-left">
                      <Upload size={16} /> Subir archivos
                    </button>
                    <button onClick={() => { setInputText(prev => prev + ' [Crear imagen de: ] '); setIsPlusMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-left">
                      <Image size={16} /> Crear imagen
                    </button>
                    <button onClick={() => { setInputText(prev => prev + ' [Crear video de: ] '); setIsPlusMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-left">
                      <Video size={16} /> Crear video
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <button onClick={() => { setInputText(prev => prev + ' [Abrir Canvas] '); setIsPlusMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-left">
                      <Palette size={16} /> Canvas
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleListening}
              className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm cursor-pointer ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isListening ? "Escuchando..." : t.chatPlaceholder}
              className="flex-1 bg-slate-100/90 dark:bg-slate-800/90 dark:text-white px-4 py-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4f83e2] transition-all border border-transparent resize-none max-h-32 custom-scrollbar"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="w-12 h-12 shrink-0 bg-gradient-to-tr from-[#4f83e2] to-[#7b4fe2] text-white rounded-2xl flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform shadow-md hover:shadow-lg self-end cursor-pointer"
            >
              <Send size={18} className="ml-1 text-white" />
            </button>
          </div>
          <Navbar view={view} setView={setView} activeTheme={activeTheme} t={t} />
        </div>
      )}
      {/* Modal de Generador IA para Mallas y Unidades */}
      <GeneradorIAModal
        isOpen={isGeneradorModalOpen}
        onClose={() => setIsGeneradorModalOpen(false)}
        title={
          generadorTarget === 'mallas'
            ? (language === 'en' ? 'Generate Curriculum Grid' : 'Generar Malla Curricular')
            : (language === 'en' ? 'Generate Didactic Unit' : 'Generar Unidad Didáctica')
        }
        isGenerating={isGeneratingInclusiveAI}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        targetSubjectName={
          generadorTarget === 'mallas'
            ? (t?.subjects?.[(activeMallaSubject || selectedSubjects[0] || allSubjects[0])?.name] || (activeMallaSubject || selectedSubjects[0] || allSubjects[0])?.name)
            : (t?.subjects?.[activeUnitSubject?.name] || activeUnitSubject?.name)
        }
        onGenerate={(doc, inst) => {
          if (generadorTarget === 'mallas') handleGenerarMallaIA(doc, inst);
          if (generadorTarget === 'unidades') handleGenerarUnidadIA(doc, inst);
        }}
        language={language}
      />

      {/* Modal Obligatorio de Verificación 2FA (PIN de 6 dígitos) */}
      <TwoFactorPinModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onVerify={handle2FAVerified}
        expectedPin={current2faPin}
        onResendPin={handleResendPinCode}
        emailOrAccount={pendingAuthEmail}
        t={t}
        showToast={showToast}
      />
    </div>
  );
};

export default App;
