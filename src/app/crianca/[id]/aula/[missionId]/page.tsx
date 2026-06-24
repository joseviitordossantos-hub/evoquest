"use client";

import Link from "next/link";
import { use, useState } from "react";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import CriancaTabBar from "@/components/CriancaTabBar";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";

type LessonStatus = "done" | "in-progress" | "todo";

const COURSE = {
  title: "English Foundations",
  instructor: "Prof. Allie",
  students: 1572,
  videoDuration: "4:15",
  totalDurationLabel: "1h37",
  lessonsCount: 9,
  materials: [
    { name: "Vocabulary cheat sheet", type: "PDF" },
    { name: "Audio practice", type: "MP3" },
  ],
};

const INITIAL_LESSONS: { n: number; title: string; duration: string; status: LessonStatus }[] = [
  { n: 0, title: "Aula 0 - Welcome!", duration: "4 min", status: "in-progress" },
  { n: 1, title: "Aula 1 - Greetings & Introductions", duration: "5 min", status: "todo" },
  { n: 2, title: "Aula 2 - Numbers & Age", duration: "7 min", status: "todo" },
  { n: 3, title: "Aula 3 - Colors & Things", duration: "13 min", status: "todo" },
  { n: 4, title: "Aula 4 - My Family", duration: "15 min", status: "todo" },
  { n: 5, title: "Aula 5 - Food I Like", duration: "12 min", status: "todo" },
  { n: 6, title: "Aula 6 - Daily Routine", duration: "10 min", status: "todo" },
  { n: 7, title: "Aula 7 - Hobbies", duration: "17 min", status: "todo" },
  { n: 8, title: "Aula 8 - Wrap up & Practice", duration: "14 min", status: "todo" },
];

const QUIZ = [
  {
    question: 'Como você diz "Eu tenho 10 anos"?',
    options: ["I'm 10 years old", "I have 10 years old", "My years is 10"],
    correct: 0,
  },
  {
    question: 'O que significa "Nice to meet you"?',
    options: ["Boa noite", "Prazer em conhecer você", "Tchau, até logo"],
    correct: 1,
  },
  {
    question: 'Como se diz "Eu gosto de pizza" em inglês?',
    options: ["I'm pizza", "I like pizza", "I have pizza"],
    correct: 1,
  },
];

export default function AulaPlayer({
  params,
}: {
  params: Promise<{ id: string; missionId: string }>;
}) {
  const { id: childId } = use(params);
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const doneCount = lessons.filter((l) => l.status === "done").length;
  const progress = (doneCount / lessons.length) * 100;
  const currentQuiz = QUIZ[quizIndex];
  const isLastQuiz = quizIndex === QUIZ.length - 1;

  function openQuiz() {
    setQuizOpen(true);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
    setQuizCompleted(false);
  }

  function handleQuizAnswer(idx: number) {
    if (answerRevealed) return;
    setSelectedAnswer(idx);
    setAnswerRevealed(true);
  }

  function handleQuizNext() {
    if (isLastQuiz) {
      setQuizCompleted(true);
      return;
    }
    setQuizIndex((i) => i + 1);
    setSelectedAnswer(null);
    setAnswerRevealed(false);
  }

  function closeQuiz() {
    setQuizOpen(false);
  }

  function finishQuizAndClose() {
    setLessons((ls) =>
      ls.map((l, i) => (i === 0 && l.status !== "done" ? { ...l, status: "done" } : l))
    );
    setQuizOpen(false);
  }

  return (
    <main className="min-h-screen bg-kid-base font-body pb-32">
      {/* Topbar */}
      <nav className="bg-white/80 backdrop-blur-lg sticky top-0 z-20">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
          <EvoQuestLogo height={32} />
          <Link
            href={`/crianca/${childId}`}
            className="w-10 h-10 rounded-full bg-kid-tint-pink flex items-center justify-center shrink-0 text-kid-danger text-lg"
            aria-label="Fechar"
          >
            ✕
          </Link>
        </div>
      </nav>

      <div className="max-w-[480px] mx-auto px-4 pt-4 space-y-5">
        {/* Hero do vídeo */}
        <div className="relative grad-section rounded-kid-xl overflow-hidden aspect-video flex items-center justify-center">
          <div className="pattern-dots-light absolute inset-0" />
          <button className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:-translate-y-1 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="ml-1">
              <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l11.24-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
            </svg>
          </button>
          <span className="absolute bottom-3 right-3 font-body font-extrabold text-[11px] text-white bg-black/30 rounded-pill px-2.5 py-1 uppercase tracking-[0.08em]">
            {COURSE.videoDuration}
          </span>
        </div>

        {/* Header da aula */}
        <header className="px-1">
          <h1 className="font-heading font-bold text-[26px] text-kid-text-strong leading-tight">
            Aula 0 - Welcome!
          </h1>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full grad-primary flex items-center justify-center font-heading font-bold text-[14px] text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-[14px] text-kid-text-strong leading-tight">
                  {COURSE.instructor}
                </p>
                <p className="font-body font-bold text-[12px] text-kid-text-muted">
                  {COURSE.students.toLocaleString("pt-BR")} alunos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-kid-tint-teal flex items-center justify-center hover:-translate-y-0.5 transition-transform">
                <AppIcon name="thumbup" size={22} />
              </button>
              <button className="w-10 h-10 rounded-full bg-kid-tint-pink flex items-center justify-center hover:-translate-y-0.5 transition-transform">
                <AppIcon name="thumbdown" size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* Material de apoio */}
        <section className="bg-white rounded-kid-xl p-4">
          <p className="font-heading font-bold text-[16px] text-kid-text-strong">
            Material de apoio
          </p>
          <p className="font-body font-bold text-[12px] text-kid-text-muted mt-0.5">
            Arquivos complementares para estudo
          </p>
          <ul className="mt-3 space-y-2">
            {COURSE.materials.map((m) => (
              <li
                key={m.name}
                className="flex items-center gap-3 p-2.5 rounded-[10px] bg-kid-base"
              >
                <span className="w-10 h-10 rounded-[6px] bg-white flex items-center justify-center font-body font-extrabold text-[10px] text-kid-text-muted">
                  {m.type}
                </span>
                <span className="flex-1 font-body font-bold text-[14px] text-kid-text-strong">
                  {m.name}
                </span>
                <button
                  className="w-9 h-9 rounded-full bg-kid-tint-violet flex items-center justify-center text-kid-on-violet hover:-translate-y-0.5 transition-transform"
                  aria-label="Baixar"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v9" />
                    <polyline points="4,7 8,11 12,7" />
                    <line x1="3" y1="14" x2="13" y2="14" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Botão Responder perguntas */}
        <button
          onClick={openQuiz}
          className="kid-btn kid-btn-gold w-full text-center"
        >
          Responder perguntas
        </button>

        {/* Módulo do curso */}
        <section className="bg-white rounded-kid-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-heading font-bold text-[18px] text-kid-text-strong leading-tight">
              {COURSE.title}
            </h2>
            <span className="text-kid-text-muted shrink-0 mt-1">⌃</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-kid-text-muted">
            <span className="inline-flex items-center gap-1.5 font-body font-extrabold text-[12px]">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="5.5" /><polyline points="7,4 7,7 9,8.5" />
              </svg>
              {COURSE.totalDurationLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 font-body font-extrabold text-[12px]">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a2 2 0 0 1 2 2v7H4a2 2 0 0 1-2-2V3z" />
                <path d="M12 3h-2v9h2" />
              </svg>
              {COURSE.lessonsCount} aulas
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
              Aula
            </p>
            <p className="font-body font-extrabold text-[12px] text-kid-text-muted">
              {doneCount}/{lessons.length} concluídas
            </p>
          </div>
          <div className="mt-2 h-[10px] bg-kid-sunk rounded-pill overflow-hidden">
            <div
              className="h-full grad-xp rounded-pill transition-[width] duration-500 ease-kid-standard"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="mt-4 space-y-2">
            {lessons.map((l) => (
              <li
                key={l.n}
                className="flex items-center gap-3 p-2.5 rounded-[10px] bg-kid-base"
              >
                <span className="w-8 h-8 rounded-[6px] bg-white flex items-center justify-center font-heading font-bold text-[14px] text-kid-text-strong shrink-0">
                  {l.n + 1}
                </span>
                <LessonStatusIcon status={l.status} />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-[13px] text-kid-text-strong truncate">
                    {l.title}
                  </p>
                  {l.status === "in-progress" && (
                    <span className="inline-flex items-center mt-0.5 font-body font-extrabold text-[10px] uppercase tracking-[0.08em] text-kid-orange">
                      Em progresso
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 font-body font-extrabold text-[11px] text-kid-text-muted shrink-0">
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="7" r="5.5" /><polyline points="7,4 7,7 9,8.5" />
                  </svg>
                  {l.duration}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </div>

      <CriancaTabBar childId={childId} />

      {/* Quiz overlay */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 bg-kid-base overflow-y-auto">
          <div className="max-w-[480px] mx-auto min-h-screen flex flex-col">
            {!quizCompleted && (
              <>
                <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-10">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <button
                      onClick={closeQuiz}
                      className="w-10 h-10 rounded-full bg-kid-tint-pink flex items-center justify-center shrink-0 text-kid-danger text-lg"
                      aria-label="Fechar quiz"
                    >
                      ✕
                    </button>
                    <div className="flex-1">
                      <div className="h-[14px] bg-kid-sunk rounded-pill overflow-hidden">
                        <div
                          className="h-full grad-teal rounded-pill transition-[width] duration-500 ease-kid-standard"
                          style={{ width: `${((quizIndex + 1) / QUIZ.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-body font-extrabold text-[12px] text-kid-text-muted uppercase tracking-[0.08em] shrink-0">
                      {quizIndex + 1}/{QUIZ.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 px-5 pt-6 pb-32">
                  <span className="kid-chip kid-chip-gold inline-flex items-center gap-1"><AppIcon name="brain" size={16} /> Pergunta</span>
                  <h2 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-3">
                    {currentQuiz.question}
                  </h2>

                  <ul className="space-y-3 mt-5">
                    {currentQuiz.options.map((opt, i) => {
                      let style = "bg-white rounded-kid-lg";
                      let extra = "";
                      if (answerRevealed && i === currentQuiz.correct) {
                        style = "bg-kid-tint-teal rounded-kid-lg";
                        if (selectedAnswer === i) extra = "animate-pop";
                      } else if (answerRevealed && selectedAnswer === i && i !== currentQuiz.correct) {
                        style = "bg-kid-tint-pink rounded-kid-lg";
                        extra = "animate-shake";
                      }
                      return (
                        <li key={i}>
                          <button
                            onClick={() => handleQuizAnswer(i)}
                            className={`w-full text-left p-4 ${style} ${extra} transition-transform kid-tappable ${!answerRevealed ? "hover:-translate-y-0.5" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-kid-tint-violet flex items-center justify-center font-heading font-bold text-[14px] text-kid-on-violet shrink-0">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="font-body font-bold text-[15px] text-kid-text-strong">
                                {opt}
                              </span>
                              {answerRevealed && i === currentQuiz.correct && (
                                <span className="ml-auto"><AppIcon name="check" size={20} /></span>
                              )}
                              {answerRevealed && selectedAnswer === i && i !== currentQuiz.correct && (
                                <span className="ml-auto"><AppIcon name="cross" size={20} /></span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {answerRevealed && selectedAnswer === currentQuiz.correct && (
                    <div className="bg-kid-tint-teal rounded-kid-md p-3 mt-3 animate-pop">
                      <p className="font-body font-extrabold text-[13px] text-kid-on-teal inline-flex items-center gap-1">
                        <AppIcon name="party" size={16} /> Resposta certa! Você está arrasando!
                      </p>
                    </div>
                  )}
                  {answerRevealed && selectedAnswer !== null && selectedAnswer !== currentQuiz.correct && (
                    <div className="bg-kid-tint-pink rounded-kid-md p-3 mt-3 animate-pop">
                      <p className="font-body font-extrabold text-[13px] text-kid-danger">
                        Quase lá! A resposta certa está marcada em verde.
                      </p>
                    </div>
                  )}
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-30 bg-white/80 backdrop-blur-lg px-5 py-4">
                  <button
                    onClick={handleQuizNext}
                    disabled={!answerRevealed}
                    className={`kid-btn w-full ${isLastQuiz ? "kid-btn-teal" : ""}`}
                  >
                    {isLastQuiz ? <span className="inline-flex items-center gap-1">Concluir quiz <AppIcon name="party" size={18} /></span> : "Próxima pergunta →"}
                  </button>
                </div>
              </>
            )}

            {quizCompleted && (
              <div className="flex-1 flex items-center justify-center p-5">
                <div className="w-full text-center space-y-6">
                  <div className="grad-xp rounded-kid-xl p-8 relative overflow-hidden">
                    <div className="pattern-dots-light absolute inset-0 rounded-kid-xl" />
                    <div className="relative">
                      <span className="block animate-pop"><AppIcon name="trophy" size={64} /></span>
                      <h1
                        className="font-heading font-bold text-[28px] text-white mt-4 leading-tight animate-bounce-in"
                        style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
                      >
                        Quiz completo!
                      </h1>
                      <p
                        className="font-body font-bold text-[14px] text-white/70 mt-2 animate-fade-in"
                        style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
                      >
                        Você mandou muito bem. Continue assim!
                      </p>
                      <div
                        className="mt-6 inline-flex items-center gap-2 bg-white/30 text-white rounded-pill px-5 py-2 font-heading font-bold text-[20px] animate-bounce-in"
                        style={{ animationDelay: "550ms", animationFillMode: "backwards" }}
                      >
                        +25 XP <AppIcon name="bolt" size={22} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={finishQuizAndClose}
                    className="kid-btn w-full text-center"
                  >
                    Voltar à aula
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function LessonStatusIcon({ status }: { status: LessonStatus }) {
  if (status === "done") {
    return (
      <span className="w-7 h-7 rounded-full bg-kid-tint-teal flex items-center justify-center shrink-0">
        <AppIcon name="check" size={16} />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="w-7 h-7 rounded-full bg-kid-tint-gold flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-kid-orange ml-0.5">
          <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l11.24-7.36a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="w-7 h-7 rounded-full border-2 border-kid-sunk flex items-center justify-center shrink-0" />
  );
}
