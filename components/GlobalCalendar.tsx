
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, MapPin, User, CheckCircle2, AlertCircle, 
  Filter, Search, Plus, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Occurrence, ProjectTask } from '../types';
import { MOCK_OCCURRENCES } from '../services/mockData';

interface CalendarEvent {
  id: string;
  type: 'TASK' | 'OCCURRENCE';
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  responsibleNames?: string[];
  status?: 'COMPLETED' | 'PENDING' | 'POSITIVE' | 'NEGATIVE';
  time?: string;
}

const GlobalCalendar: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'MONTH' | 'LIST'>('MONTH');
  const [filter, setFilter] = useState<'ALL' | 'TASK' | 'OCCURRENCE'>('ALL');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'TASK',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING'
  });
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>([]);

  const events = useMemo(() => {
    const allEvents: CalendarEvent[] = [...localEvents];

    // Add Tasks
    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.scheduledDate) {
          allEvents.push({
            id: `task-${task.id}`,
            type: 'TASK',
            date: task.scheduledDate,
            title: task.name,
            description: task.description,
            projectId: project.id,
            projectName: project.clientName,
            status: task.completed ? 'COMPLETED' : 'PENDING',
            time: task.scheduledTime
          });
        }
      });
    });

    // Add Occurrences
    MOCK_OCCURRENCES.forEach(occ => {
      allEvents.push({
        id: `occ-${occ.id}`,
        type: 'OCCURRENCE',
        date: occ.date,
        title: occ.title,
        description: occ.description,
        projectId: occ.projectId,
        projectName: occ.projectName,
        responsibleNames: occ.involvedTeamNames,
        status: occ.type === 'POSITIVE' ? 'POSITIVE' : 'NEGATIVE'
      });
    });

    return allEvents.filter(e => filter === 'ALL' || e.type === filter);
  }, [projects, filter]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const calendarDays = [];
    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    // Days of current month
    for (let i = 1; i <= days; i++) {
      calendarDays.push(i);
    }
    
    return calendarDays;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();

  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="h-full flex flex-col space-y-8 pb-20 overflow-hidden">
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tighter">Calendário Integrado</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Visão unificada de tarefas e ocorrências</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-onyx p-1 rounded-xl border border-stone-200 dark:border-white/5 shadow-sm">
            <button 
              onClick={() => setView('MONTH')}
              className={`p-2 rounded-lg transition-all ${view === 'MONTH' ? 'gold-bg text-black shadow-md' : 'text-stone-400 hover:text-stone-950 dark:hover:text-white'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('LIST')}
              className={`p-2 rounded-lg transition-all ${view === 'LIST' ? 'gold-bg text-black shadow-md' : 'text-stone-400 hover:text-stone-950 dark:hover:text-white'}`}
            >
              <List size={18} />
            </button>
          </div>
            <button 
              onClick={() => {
                setNewEvent({
                  type: 'TASK',
                  date: new Date().toISOString().split('T')[0],
                  status: 'PENDING'
                });
                setIsAddingEvent(true);
              }}
              className="gold-bg px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Plus size={16} />
              Novo Evento
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/5 shadow-sm flex flex-col h-full overflow-hidden">
          {/* Calendar Header */}
          <div className="p-8 border-b border-stone-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-stone-50/50 dark:bg-black/20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 text-stone-400 hover:text-gold transition-all"><ChevronLeft size={20} /></button>
                <div className="text-center min-w-40">
                  <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">{monthName}</h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{year}</p>
                </div>
                <button onClick={nextMonth} className="p-2 text-stone-400 hover:text-gold transition-all"><ChevronRight size={20} /></button>
              </div>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-1.5 bg-white dark:bg-white/10 border border-stone-200 dark:border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-gold transition-all"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-3">
              {(['ALL', 'TASK', 'OCCURRENCE'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                    filter === t 
                      ? 'gold-bg text-black border-gold shadow-md' 
                      : 'text-stone-400 border-stone-100 dark:border-white/5 hover:border-gold'
                  }`}
                >
                  {t === 'ALL' ? 'Todos' : t === 'TASK' ? 'Tarefas' : 'Ocorrências'}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto custom-scroll">
            {view === 'MONTH' ? (
              <div className="grid grid-cols-7 h-full min-h-[600px]">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-4 text-center border-b border-r border-stone-100 dark:border-white/5 bg-stone-50/30 dark:bg-black/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{day}</span>
                  </div>
                ))}
                {monthData.map((day, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      if (day) {
                        const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setNewEvent({
                          type: 'TASK',
                          date: dateStr,
                          status: 'PENDING'
                        });
                        setIsAddingEvent(true);
                      }
                    }}
                    className={`min-h-32 p-3 border-b border-r border-stone-100 dark:border-white/5 transition-all hover:bg-stone-50/50 dark:hover:bg-white/[0.01] cursor-pointer ${day === null ? 'bg-stone-50/20 dark:bg-black/5' : ''}`}
                  >
                    {day && (
                      <div className="h-full flex flex-col space-y-2">
                        <span className={`text-xs font-bold ${
                          day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && year === new Date().getFullYear()
                            ? 'w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center shadow-md'
                            : 'text-stone-400'
                        }`}>
                          {day}
                        </span>
                        <div className="flex-1 space-y-1.5">
                          {getEventsForDay(day).map(event => (
                            <div 
                              key={event.id}
                              className={`p-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-tight truncate cursor-pointer transition-all hover:scale-105 ${
                                event.type === 'TASK'
                                  ? 'bg-stone-50 dark:bg-white/5 border-stone-100 dark:border-white/5 text-stone-600 dark:text-stone-400'
                                  : event.status === 'POSITIVE'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {event.type === 'TASK' ? <Clock size={8} /> : <AlertCircle size={8} />}
                                {event.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 space-y-4">
                {events.sort((a, b) => a.date.localeCompare(b.date)).map(event => (
                  <div key={event.id} className="flex items-center gap-6 p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5 hover:border-gold transition-all group">
                    <div className="w-24 shrink-0 text-center">
                      <p className="text-[10px] font-bold text-stone-900 dark:text-white uppercase tracking-widest">{event.date}</p>
                      {event.time && <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-0.5">{event.time}</p>}
                    </div>
                    <div className={`w-1 h-10 rounded-full ${event.type === 'TASK' ? 'bg-stone-200 dark:bg-stone-800' : event.status === 'POSITIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          event.type === 'TASK' ? 'bg-stone-100 text-stone-500 border-stone-200' : 'bg-gold/10 text-gold border-gold/20'
                        }`}>
                          {event.type === 'TASK' ? 'Tarefa' : 'Ocorrência'}
                        </span>
                        <h4 className="text-sm font-bold text-stone-950 dark:text-white uppercase tracking-tight">{event.title}</h4>
                      </div>
                      <p className="text-xs text-stone-400 font-serif italic line-clamp-1">{event.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {event.projectName && (
                        <div className="text-right">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Projeto</p>
                          <p className="text-[9px] font-bold text-stone-900 dark:text-white uppercase">{event.projectName}</p>
                        </div>
                      )}
                      <button className="p-2 text-stone-300 group-hover:text-gold transition-all"><MoreVertical size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddingEvent && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingEvent(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Novo Evento</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Adicione uma tarefa ou ocorrência</p>
                  </div>
                  <button onClick={() => setIsAddingEvent(false)} className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white transition-all">
                    <AlertCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Tipo</label>
                    <select 
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    >
                      <option value="TASK">Tarefa</option>
                      <option value="OCCURRENCE">Ocorrência</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Data</label>
                    <input 
                      type="date" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Título</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Medição Técnica"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Descrição</label>
                  <textarea 
                    placeholder="Detalhes do evento..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all min-h-[100px]"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setIsAddingEvent(false)}
                    className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      if (newEvent.title && newEvent.date) {
                        const event: CalendarEvent = {
                          id: Math.random().toString(36).substr(2, 9),
                          type: newEvent.type as any,
                          date: newEvent.date as string,
                          title: newEvent.title as string,
                          description: newEvent.description,
                          status: newEvent.type === 'TASK' ? 'PENDING' : 'POSITIVE'
                        };
                        setLocalEvents([...localEvents, event]);
                        setIsAddingEvent(false);
                      }
                    }}
                    className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    Criar Evento
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalCalendar;
