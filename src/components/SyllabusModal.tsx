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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">{course.code}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">{course.type}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">{course.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[40px] min-w-[40px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs bg-slate-50/30 dark:bg-slate-950/40">
          
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs shadow-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Credits</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{course.credits} Credits</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Semester</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">Semester {course.semester}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Difficulty</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{course.difficulty} / 5</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Bloom's Level</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">{course.bloomLevel}</span>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs mb-1.5">Course Description</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              {course.description}
            </p>
          </div>

          {/* Syllabus Topic Units */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs mb-2">Syllabus Topic Units</h3>
            <div className="space-y-2">
              {course.syllabus.map((topic, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3 shadow-2xs">
                  <span className="text-blue-700 dark:text-blue-300 font-bold text-xs mt-0.5 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900 flex-shrink-0">Unit {idx + 1}</span>
                  <span className="text-slate-800 dark:text-slate-200 leading-normal font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Acquired */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs mb-2">Skills Acquired</h3>
            <div className="flex flex-wrap gap-2">
              {course.skillsAcquired.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl transition-colors min-h-[40px]"
          >
            Close Syllabus
          </button>
        </div>

      </div>
    </div>
  );
};
