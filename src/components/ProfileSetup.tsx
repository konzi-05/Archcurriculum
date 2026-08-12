import React, { useState } from 'react';
import { StudentProfile } from '../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../data/btechItCurriculum';
import { X, Check, BookOpen, Target, Clock, Award, RotateCcw } from 'lucide-react';

interface ProfileSetupProps {
  profile: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
  onClose: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ profile, onSaveProfile, onClose }) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [activeSemFilter, setActiveSemFilter] = useState<number>(0); // 0 = all

  const toggleCourseCompletion = (courseId: string) => {
    const isCompleted = formData.completedCourseIds.includes(courseId);
    let newCompleted = [...formData.completedCourseIds];
    
    if (isCompleted) {
      newCompleted = newCompleted.filter(id => id !== courseId);
    } else {
      newCompleted.push(courseId);
    }

    setFormData({
      ...formData,
      completedCourseIds: newCompleted
    });
  };

  const selectSemesterAll = (sem: number) => {
    const semCourseIds = BTECH_IT_COURSES.filter(c => c.semester === sem).map(c => c.id);
    const existing = new Set(formData.completedCourseIds);
    semCourseIds.forEach(id => existing.add(id));
    setFormData({ ...formData, completedCourseIds: Array.from(existing) });
  };

  const clearSemesterAll = (sem: number) => {
    const semCourseIds = new Set(BTECH_IT_COURSES.filter(c => c.semester === sem).map(c => c.id));
    const newCompleted = formData.completedCourseIds.filter(id => !semCourseIds.has(id));
    setFormData({ ...formData, completedCourseIds: newCompleted });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Profile & Academic Transcript</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure completed coursework, target career track, and study budget</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-slate-950/40">
          
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll / Registration Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Academic Semester</label>
              <select
                value={formData.currentSemester}
                onChange={e => setFormData({ ...formData, currentSemester: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Career Track */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Target Career Pathway</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAREER_TRACKS.map(track => {
                const isSelected = formData.targetCareerTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setFormData({ ...formData, targetCareerTrackId: track.id })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all shadow-2xs ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{track.title}</h4>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{track.targetRole}</p>
                    <div className="text-[11px] font-bold text-blue-700">Demand: {track.industryDemand}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferences: Pace & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Weekly Study Hours Budget</span>
              </label>
              <div className="flex items-center space-x-3 mt-2">
                <input
                  type="range"
                  min="15"
                  max="50"
                  value={formData.weeklyStudyHoursBudget}
                  onChange={e => setFormData({ ...formData, weeklyStudyHoursBudget: Number(e.target.value) })}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                  {formData.weeklyStudyHoursBudget} hrs/wk
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Preferred Workload Intensity Pace</span>
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                {(['Light', 'Balanced', 'Intensive'] as const).map(pace => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredPace: pace })}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      formData.preferredPace === pace
                        ? 'bg-blue-600 border-blue-600 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Completed Courses Transcript Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Completed Course Transcript Checklist</h3>
                <p className="text-xs text-slate-500">
                  Check courses you have already passed to calculate prerequisites correctly.
                </p>
              </div>
              <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {formData.completedCourseIds.length} / {BTECH_IT_COURSES.length} Completed
              </div>
            </div>

            {/* Semester Filter Tabs */}
            <div className="flex items-center space-x-1 mb-3 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveSemFilter(0)}
                className={`px-3 py-1 rounded-lg border text-xs font-medium whitespace-nowrap ${
                  activeSemFilter === 0 ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Semesters
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveSemFilter(s)}
                  className={`px-3 py-1 rounded-lg border text-xs font-medium whitespace-nowrap ${
                    activeSemFilter === s ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>

            {/* Semester Groups */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {[1, 2, 3, 4, 5, 6, 7, 8]
                .filter(s => activeSemFilter === 0 || activeSemFilter === s)
                .map(semNum => {
                  const semCourses = BTECH_IT_COURSES.filter(c => c.semester === semNum);
                  if (semCourses.length === 0) return null;

                  return (
                    <div key={semNum} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-800">Semester {semNum}</span>
                        <div className="flex items-center space-x-2 text-xs font-medium">
                          <button
                            type="button"
                            onClick={() => selectSemesterAll(semNum)}
                            className="text-blue-600 hover:underline"
                          >
                            Mark All Completed
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => clearSemesterAll(semNum)}
                            className="text-slate-500 hover:text-slate-800 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {semCourses.map(course => {
                          const isCompleted = formData.completedCourseIds.includes(course.id);
                          return (
                            <div
                              key={course.id}
                              onClick={() => toggleCourseCompletion(course.id)}
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                                isCompleted
                                  ? 'bg-blue-50/80 border-blue-300 text-slate-900 font-medium'
                                  : 'bg-slate-50/60 border-slate-200/80 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate pr-2">
                                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                                  isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="font-bold text-xs text-blue-700 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100">{course.code}</span>
                                <span className="truncate font-medium">{course.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{course.credits} cr</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs shadow-blue-200 transition-all"
            >
              Save Profile & Re-Calculate
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
