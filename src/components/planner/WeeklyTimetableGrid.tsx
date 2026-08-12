import React from 'react';
import { Course, StudentProfile } from '../../types/curriculum';
import { BTECH_IT_COURSES } from '../../data/btechItCurriculum';
import { Calendar, Clock, BookOpen, Laptop, AlertCircle, Sparkles } from 'lucide-react';

interface WeeklyTimetableGridProps {
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
}

export const WeeklyTimetableGrid: React.FC<WeeklyTimetableGridProps> = ({
  studentProfile,
  selectedPlanCourseIds
}) => {
  const selectedCourses = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));

  const totalLectureHours = selectedCourses.reduce((sum, c) => sum + (c.type === 'Lab' ? 1 : 3), 0);
  const totalLabHours = selectedCourses.reduce((sum, c) => sum + (c.type === 'Lab' || c.type === 'Project' ? 3 : 1), 0);
  const totalSelfStudyHours = selectedCourses.reduce((sum, c) => sum + Math.max(1, c.workloadHours - 4), 0);
  const totalWeeklyHours = totalLectureHours + totalLabHours + totalSelfStudyHours;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '12:15 - 13:15 (Lunch Break)',
    '13:15 - 15:15 (Lab Practical)',
    '15:30 - 17:00 (Self-Study / Project)'
  ];

  // Helper colors for course domain
  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'AI & Data Science': return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300';
      case 'Software Engineering': return 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
      case 'Cloud & Systems': return 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300';
      case 'Cybersecurity & Networks': return 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 px-3 py-1 rounded-full mb-2">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Semester {studentProfile.currentSemester} Timetable Simulation</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Weekly Academic Schedule & Workload Grid
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Simulated lecture, laboratory, and self-study time blocks for your active course schedule.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Lectures</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{totalLectureHours} hrs/wk</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Practical Labs</span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{totalLabHours} hrs/wk</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Self Study</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{totalSelfStudyHours} hrs/wk</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Budget Usage</span>
          <div className={`text-2xl font-extrabold mt-1 ${
            totalWeeklyHours > studentProfile.weeklyStudyHoursBudget
              ? 'text-red-600 dark:text-red-400'
              : 'text-slate-900 dark:text-white'
          }`}>
            {totalWeeklyHours} / {studentProfile.weeklyStudyHoursBudget} h
          </div>
        </div>
      </div>

      {/* Timetable Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs overflow-x-auto transition-colors">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <th className="p-3 font-bold uppercase text-[10px] w-32">Time Slot</th>
              {days.map(day => (
                <th key={day} className="p-3 font-bold uppercase text-[10px] text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
            {timeSlots.map((slot, slotIdx) => (
              <tr key={slotIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap bg-slate-50/30 dark:bg-slate-800/20">
                  {slot}
                </td>
                {days.map((day, dayIdx) => {
                  if (slot.includes('Lunch')) {
                    return (
                      <td key={dayIdx} className="p-3 text-center bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 font-medium text-[10px]">
                        LUNCH BREAK
                      </td>
                    );
                  }

                  const courseIndex = (slotIdx + dayIdx) % Math.max(1, selectedCourses.length);
                  const course = selectedCourses[courseIndex];

                  if (!course) {
                    return (
                      <td key={dayIdx} className="p-3 text-center text-slate-300 dark:text-slate-700">
                        —
                      </td>
                    );
                  }

                  const isLabSlot = slot.includes('Lab');
                  const isStudySlot = slot.includes('Self-Study');

                  return (
                    <td key={dayIdx} className="p-2">
                      <div className={`p-2 rounded-xl border text-center space-y-0.5 ${getDomainColor(course.domain)}`}>
                        <div className="font-extrabold text-[10px] truncate">{course.code}</div>
                        <div className="font-medium text-[10px] truncate">{course.name}</div>
                        <div className="text-[9px] font-bold uppercase opacity-80">
                          {isLabSlot ? 'Practical Lab' : isStudySlot ? 'Self Study' : 'Lecture'}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
