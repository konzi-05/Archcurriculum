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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{course.code}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{course.type}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{course.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs bg-slate-50/30">
          
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white border border-slate-200/80 text-xs shadow-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Credits</span>
              <span className="font-extrabold text-slate-800">{course.credits} Credits</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Semester</span>
              <span className="font-extrabold text-slate-800">Semester {course.semester}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Difficulty</span>
              <span className="font-extrabold text-slate-800">{course.difficulty} / 5</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Bloom's Level</span>
              <span className="font-extrabold text-blue-700">{course.bloomLevel}</span>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase text-xs mb-1.5">Course Description</h3>
            <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              {course.description}
            </p>
          </div>

          {/* Syllabus Topic Units */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase text-xs mb-2">Syllabus Topic Units</h3>
            <div className="space-y-2">
              {course.syllabus.map((topic, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start space-x-3 shadow-2xs">
                  <span className="text-blue-700 font-bold text-xs mt-0.5 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex-shrink-0">Unit {idx + 1}</span>
                  <span className="text-slate-800 leading-normal font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Acquired */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase text-xs mb-2">Skills Acquired</h3>
            <div className="flex flex-wrap gap-2">
              {course.skillsAcquired.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-xl transition-colors"
          >
            Close Syllabus
          </button>
        </div>

      </div>
    </div>
  );
};
