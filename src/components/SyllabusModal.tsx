import React from 'react';
import { Course } from '../types/curriculum';
import { X, BookOpen, Award, Layers, Clock, ShieldCheck } from 'lucide-react';

interface SyllabusModalProps {
  course: Course | null;
  onClose: () => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-400">{course.code}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{course.type}</span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">{course.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Credits</span>
              <span className="font-bold text-slate-200">{course.credits} Credits</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Semester</span>
              <span className="font-bold text-slate-200">Semester {course.semester}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Difficulty</span>
              <span className="font-bold text-slate-200">{course.difficulty} / 5</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Bloom's Level</span>
              <span className="font-bold text-cyan-400">{course.bloomLevel}</span>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h3 className="font-bold text-slate-200 uppercase font-mono mb-1">Course Description</h3>
            <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {course.description}
            </p>
          </div>

          {/* Syllabus Topic Units */}
          <div>
            <h3 className="font-bold text-slate-200 uppercase font-mono mb-2">Syllabus Topic Units</h3>
            <div className="space-y-2">
              {course.syllabus.map((topic, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3">
                  <span className="font-mono text-blue-400 font-bold text-[11px] mt-0.5">Unit {idx + 1}</span>
                  <span className="text-slate-200 leading-normal">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Acquired */}
          <div>
            <h3 className="font-bold text-slate-200 uppercase font-mono mb-2">Skills Acquired</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.skillsAcquired.map(skill => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-blue-950/50 text-blue-300 border border-blue-800/60 font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors"
          >
            Close Syllabus
          </button>
        </div>

      </div>
    </div>
  );
};
