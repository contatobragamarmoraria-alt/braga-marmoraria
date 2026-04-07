
import React, { useState, useRef } from 'react';
import { Upload, FileText, Mic, Image as ImageIcon, Check, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, ProjectDocument } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  project: Project;
  updateProject: (p: Project) => void;
}

const ProjectArtifacts: React.FC<Props> = ({ project, updateProject }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [audioText, setAudioText] = useState('');
  const [uploadType, setUploadType] = useState<'drawing' | 'audio' | 'photo' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadType) return;

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        if (uploadType === 'audio') {
          await convertAudioToText(base64Data, file.type);
        } else if (uploadType === 'drawing' || uploadType === 'photo') {
          const newDoc: ProjectDocument = {
            id: `doc_${Date.now()}`,
            name: file.name,
            type: uploadType === 'drawing' ? 'Desenho Técnico' : 'Foto de Obra',
            url: base64Data,
            date: new Date().toISOString().split('T')[0]
          };
          
          const updatedProject = {
            ...project,
            documents: [...project.documents, newDoc],
            photoLog: uploadType === 'photo' 
              ? [{
                  id: `pl_${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  author: 'Sistema',
                  notes: 'Upload manual via painel administrativo',
                  images: [base64Data]
                }, ...project.photoLog]
              : project.photoLog
          };
          updateProject(updatedProject);
        }
        setIsUploading(false);
        setUploadType(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const convertAudioToText = async (base64Data: string, mimeType: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const base64Content = base64Data.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            parts: [
              { text: "Transcreva este áudio de obra para texto em português. Foque em detalhes técnicos, materiais e prazos mencionados." },
              { inlineData: { data: base64Content, mimeType: mimeType } }
            ]
          }
        ]
      });

      const text = response.text || "Não foi possível transcrever o áudio.";
      setAudioText(text);
      
      // Save transcription as a document
      const newDoc: ProjectDocument = {
        id: `audio_trans_${Date.now()}`,
        name: `Transcrição: ${new Date().toLocaleString()}`,
        type: 'Transcrição de Áudio',
        url: 'data:text/plain;base64,' + btoa(text),
        date: new Date().toISOString().split('T')[0]
      };
      
      updateProject({
        ...project,
        documents: [...project.documents, newDoc]
      });
    } catch (error) {
      console.error('Gemini error:', error);
      setAudioText("Erro na transcrição automática.");
    }
  };

  const triggerUpload = (type: 'drawing' | 'audio' | 'photo') => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drawing Card */}
        <div 
          onClick={() => triggerUpload('drawing')}
          className="group bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/50 transition-all hover:shadow-xl hover:shadow-gold/5"
        >
          <div className="w-16 h-16 bg-stone-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-gold transition-colors">
            <FileText size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Upload de Desenho</h4>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Plantas e Detalhamentos</p>
          </div>
        </div>

        {/* Audio Card */}
        <div 
          onClick={() => triggerUpload('audio')}
          className="group bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/50 transition-all hover:shadow-xl hover:shadow-gold/5"
        >
          <div className="w-16 h-16 bg-stone-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-gold transition-colors">
            <Mic size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Nota de Voz (AI)</h4>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Converter Áudio em Texto</p>
          </div>
        </div>

        {/* Photo Card */}
        <div 
          onClick={() => triggerUpload('photo')}
          className="group bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/50 transition-all hover:shadow-xl hover:shadow-gold/5"
        >
          <div className="w-16 h-16 bg-stone-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-gold transition-colors">
            <ImageIcon size={32} />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Registrar Fotos</h4>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Diário de Obra Visual</p>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
        accept={uploadType === 'audio' ? 'audio/*' : 'image/*'}
      />

      {isUploading && (
        <div className="flex items-center justify-center gap-3 py-10 text-stone-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Processando artefato...</span>
        </div>
      )}

      {audioText && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white uppercase">Transcrição Gerada por AI</h4>
            <button onClick={() => setAudioText('')} className="text-stone-400 hover:text-red-500"><Trash2 size={16}/></button>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 font-serif leading-relaxed italic">
            "{audioText}"
          </p>
        </motion.div>
      )}

      <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white uppercase">Acervo Digital Recente</h4>
          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{project.documents.length} Arquivos</span>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-white/5">
          {project.documents.slice(-5).reverse().map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-400">
                  <FileText size={14} />
                </div>
                <div>
                  <p className="text-xs font-serif font-bold text-stone-900 dark:text-white">{doc.name}</p>
                  <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">{doc.type} • {doc.date}</p>
                </div>
              </div>
              <a href={doc.url} download={doc.name} className="p-2 text-stone-400 hover:text-gold transition-colors">
                <Upload size={14} className="rotate-180" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectArtifacts;
