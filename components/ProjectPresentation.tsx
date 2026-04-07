
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Project } from '../types';
import { 
  Maximize2, Minimize2, ChevronLeft, ChevronRight, 
  Sparkles, Award, ShieldCheck, Check,
  ArrowRight, Compass, DollarSign, RotateCw
} from 'lucide-react';

interface Props {
  project: Project;
}

const ProjectPresentation: React.FC<Props> = ({ project }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showRotationHint, setShowRotationHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const meetingType = searchParams.get('meeting') || 'n1';

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        setIsFullScreen(true);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullScreen(isFs);
      if (isFs && window.innerHeight > window.innerWidth) {
        setShowRotationHint(true);
        setTimeout(() => setShowRotationHint(false), 5000);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const n1Slides = [
    {
      type: 'hero-n1',
      title: 'Projeto com Organização e Previsibilidade',
      subtitle: 'Protocolo de Atendimento Mais Obras',
      tag: 'Apresentação Inicial'
    },
    {
      type: 'centered',
      icon: Award,
      title: 'O Que Esperar',
      points: [
        'Clareza total em cada etapa do processo.',
        'Cronograma físico-financeiro sempre alinhado.',
        'Transparência absoluta, sem surpresas.',
        'Equipe de artesãos dedicada ao seu projeto.',
      ]
    },
    {
      type: 'steps',
      title: 'Fluxo Estratégico do Projeto',
      steps: [
        { n: '01', label: 'Lead Fechado', desc: 'Formalização e briefing.' },
        { n: '02', label: 'Medição', desc: 'Visita técnica laser.' },
        { n: '03', label: 'Validação', desc: 'Projeto executivo final.' },
        { n: '04', label: 'Produção', desc: 'Execução no Atelier.' },
        { n: '05', label: 'Instalação', desc: 'Montagem na obra.' },
        { n: '06', label: 'Finalizado', desc: 'Aceite e Garantia.' },
        { n: '07', label: 'Manutenção', desc: 'Suporte pós-obra.' }
      ]
    },
    {
      type: 'experience',
      title: 'Acompanhamento Digital',
      content: 'Você acompanha todas as etapas, fotos e documentos em uma plataforma exclusiva para você.',
      icon: Sparkles
    },
    {
      type: 'centered',
      icon: DollarSign,
      title: 'Transparência Financeira',
      points: [
        'Cronograma físico-financeiro sempre alinhado.',
        'Previsibilidade de custos do início ao fim.',
        'Sem taxas ocultas ou surpresas no faturamento.',
        'Acesso digital a todos os documentos e propostas.'
      ]
    },
    {
      type: 'next-steps',
      title: 'Próximos Passos',
      options: [
        'Agendar Medição Técnica',
        'Reservar Data para Reunião de Missão'
      ]
    }
  ];

  const n2Slides = [
    { type: 'hero', title: project.clientName, subtitle: project.projectType, image: project.image, concept: project.concept, tag: "Apresentação N2 (Vendas)" },
    { type: 'moodboard', title: 'Conceito & Inspiração', images: project.references },
    { type: 'split-grid', title: 'Escopo de Execução', subtitle: 'Inclusos no Projeto', items: project.detailedScope || [] },
    { type: 'investment', title: 'Compromisso Mais Obras', value: project.value, method: project.paymentMethod, warranty: "Garantia Vitalícia Mais Obras." }
  ];

  const slides = meetingType === 'n1' ? n1Slides : n2Slides;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const SlideContent = ({ slide }: { slide: any }) => {
    switch (slide.type) {
      case 'hero-n1':
        return (
          <div className="flex flex-col items-center justify-center text-center h-full space-y-6 md:space-y-10 px-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
              <span className="px-4 py-1 bg-gold/10 text-gold rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em]">
                {slide.tag}
              </span>
              <h1 className="text-3xl md:text-7xl font-serif text-stone-900 dark:text-white leading-tight uppercase tracking-tighter">
                {slide.title}
              </h1>
              <p className="text-base md:text-xl font-serif text-stone-400 italic">{slide.subtitle}</p>
            </motion.div>
          </div>
        );
      case 'experience':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center px-4 overflow-y-auto lg:overflow-visible">
            <div className="space-y-4 md:space-y-6">
               <slide.icon size={40} className="text-gold" />
               <h2 className="text-3xl md:text-5xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter">{slide.title}</h2>
               <p className="text-lg md:text-xl font-serif italic text-stone-500 leading-relaxed">{slide.content}</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="relative mx-auto w-full max-w-[280px] aspect-[9/16] bg-stone-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-stone-800"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-stone-800 rounded-b-lg" />
               <div className="absolute inset-0 pt-8 bg-ivory dark:bg-onyx flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles size={48} className="text-gold opacity-20" />
                  <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-4">ARTESANIO</h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] -mt-1">Portal do Proprietário</p>
               </div>
            </motion.div>
          </div>
        );
      case 'next-steps':
        return (
          <div className="flex flex-col items-center justify-center text-center h-full space-y-8 md:space-y-12 px-4 overflow-y-auto">
            <h2 className="text-2xl md:text-5xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter">{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
              {slide.options.map((opt: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => alert(`Agendamento de ${opt} solicitado com sucesso! Nossa equipe entrará em contato.`)}
                  className="p-6 md:p-10 bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 rounded-[2rem] flex flex-col items-center gap-4 group hover:border-gold transition-all"
                >
                   <div className="w-10 h-10 rounded-full border border-stone-200 dark:border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black">
                      <ArrowRight size={18} />
                   </div>
                   <p className="text-base md:text-xl font-serif italic text-stone-700 dark:text-stone-300">{opt}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'centered':
        return (
          <div className="flex flex-col items-center justify-center text-center h-full max-w-4xl mx-auto space-y-8 px-4 overflow-y-auto">
            <div className="p-5 bg-gold/10 rounded-2xl border border-gold/20">
              <slide.icon size={48} className="text-gold" />
            </div>
            <h2 className="text-3xl md:text-6xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter">{slide.title}</h2>
            {slide.content && <p className="text-lg md:text-2xl font-serif italic text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl">"{slide.content}"</p>}
            {slide.points && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left max-w-3xl mt-8 pt-8 border-t border-stone-200 dark:border-white/10">
                {slide.points.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-4 text-base md:text-lg font-serif italic text-stone-600 dark:text-stone-300">
                    <Check size={24} className="text-gold mt-1 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'steps':
        return (
          <div className="h-full flex flex-col justify-center space-y-8 md:space-y-12 px-4 overflow-y-auto">
            <h2 className="text-4xl md:text-6xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter text-center">{slide.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {slide.steps.map((step: any, i: number) => (
                <div key={i} className={`p-8 bg-amber-50 dark:bg-gold/10 rounded-3xl border border-amber-200 dark:border-gold/20 text-left space-y-3 group hover:shadow-lg transition-all ${i === 6 ? 'lg:col-start-2' : ''}`}>
                   <div className="flex items-start gap-4">
                      <span className="text-4xl font-serif text-gold/40 dark:text-gold/50">{step.n}</span>
                      <div>
                        <h4 className="text-lg font-serif font-bold uppercase tracking-tight text-stone-900 dark:text-white">{step.label}</h4>
                        <p className="text-sm text-stone-600 dark:text-stone-400 italic font-light leading-relaxed mt-2">{step.desc}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center px-4 overflow-y-auto">
            <div className="space-y-4">
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">{slide.tag}</span>
              <h1 className="text-2xl md:text-5xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter">{slide.title}</h1>
              <p className="text-base font-serif italic text-stone-600 dark:text-stone-300 leading-relaxed">"{slide.concept}"</p>
            </div>
            <div className="aspect-video lg:h-full lg:py-4">
               <img src={slide.image} className="w-full h-full object-cover rounded-2xl lg:rounded-3xl shadow-xl" alt="Hero" />
            </div>
          </div>
        );
      case 'moodboard':
        return (
          <div className="h-full flex flex-col justify-center px-4 overflow-y-auto">
            <h2 className="text-2xl md:text-4xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter mb-6 text-center">{slide.title}</h2>
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[50vh] md:h-auto max-w-4xl mx-auto">
              {slide.images?.slice(0, 1).map((img: string, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.1 } }}
                  className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg border-2 border-white/50"
                >
                  <img src={img} className="w-full h-full object-cover" />
                </motion.div>
              ))}
              {slide.images?.slice(1, 5).map((img: string, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: (i + 1) * 0.1 } }}
                  className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/50"
                >
                  <img src={img} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'investment':
        return (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-6 px-4 overflow-y-auto">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">{slide.title}</h2>
            <div className="text-4xl md:text-7xl font-serif font-bold text-stone-950 dark:text-white tracking-tighter">
              R$ {slide.value.toLocaleString()}
            </div>
            <p className="text-lg font-serif italic text-gold">{slide.method}</p>
            <div className="p-6 bg-stone-950 rounded-2xl text-white max-w-sm">
               <ShieldCheck size={40} className="text-gold mx-auto mb-3" />
               <p className="text-xs opacity-80 leading-relaxed italic">"{slide.warranty}"</p>
            </div>
          </div>
        );
      case 'split-grid':
        return (
          <div className="h-full flex flex-col justify-center px-4 overflow-y-auto">
            <div className="mb-6 text-center lg:text-left">
               <h2 className="text-2xl md:text-4xl font-serif text-stone-900 dark:text-white uppercase tracking-tighter">{slide.title}</h2>
               <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-1">{slide.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {slide.items.map((item: any, i: number) => (
                <div key={i} className="p-4 bg-stone-50 dark:bg-white/5 border border-stone-100 rounded-2xl space-y-2">
                   <h4 className="text-[10px] font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                   <ul className="space-y-1">
                     {item.items.slice(0, 3).map((li: string, j: number) => (
                       <li key={j} className="text-[9px] text-stone-500 italic flex gap-1.5">• {li}</li>
                     ))}
                   </ul>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`
        relative flex flex-col transition-all duration-500 overflow-hidden
        ${isFullScreen ? 'fixed inset-0 z-[200] bg-white dark:bg-onyx p-4 md:p-12 lg:p-20' : 'w-full h-full bg-white dark:bg-onyx/40 rounded-[2rem] border border-stone-200 dark:border-white/5 p-4 md:p-8'}
      `}
    >
      <div className="absolute top-4 right-4 flex items-center gap-3 z-[210] print:hidden">
        <button 
          onClick={toggleFullScreen}
          className="p-3 bg-white/90 dark:bg-white/10 hover:bg-stone-950 hover:text-white rounded-xl shadow-lg transition-all border border-stone-200 dark:border-white/10"
        >
          {isFullScreen ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}
        </button>
      </div>

      <AnimatePresence>
        {showRotationHint && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-gold text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl font-bold uppercase text-[10px] tracking-widest"
          >
            <RotateCw size={16} className="animate-spin" />
            Vire o celular para o modo paisagem
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
            onClick={(e) => {
              if (window.innerWidth < 768 && !isFullScreen) {
                toggleFullScreen();
              } else {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x > rect.width * 0.7) nextSlide();
                else if (x < rect.width * 0.3) prevSlide();
              }
            }}
          >
            <SlideContent slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 dark:border-white/5 print:hidden shrink-0">
         <div className="flex items-center gap-4 md:gap-6">
            <button onClick={prevSlide} className="p-3 bg-stone-50 dark:bg-white/5 rounded-xl text-stone-400">
              <ChevronLeft size={18} />
            </button>
            <div className="hidden md:flex gap-1.5">
              {slides.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-gold' : 'w-2 bg-stone-200 dark:bg-white/10'}`} 
                />
              ))}
            </div>
            <button onClick={nextSlide} className="p-3 bg-stone-50 dark:bg-white/5 rounded-xl text-stone-400">
              <ChevronRight size={18} />
            </button>
         </div>
         <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            {currentSlide + 1} / {slides.length}
         </div>
      </div>
    </div>
  );
};

export default ProjectPresentation;
