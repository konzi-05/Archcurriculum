import React, { useState } from 'react';
import { Course, StudentProfile, ScheduleAuditReport } from '../../types/curriculum';
import { BTECH_IT_COURSES } from '../../data/btechItCurriculum';
import { 
  buildTimetableGridMatrix, 
  detectScheduleConflicts,
  STANDARD_TIME_SLOTS, 
  TIMETABLE_DAYS 
} from '../../services/scheduleConflictEngine';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Laptop, 
  AlertCircle, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  MapPin, 
  Layers, 
  ShieldAlert 
} from 'lucide-react';

interface WeeklyTimetableGridProps {
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
  customSemesterMap?: Record<string, number>;
  onRemovePlanCourse?: (courseId: string) => void;
  onOpenSyllabusModal?: (course: Course) => void;
}

export const WeeklyTimetableGrid: React.FC<WeeklyTimetableGridProps> = ({
  studentProfile,
  selectedPlanCourseIds,
  customSemesterMap = {},
  onRemovePlanCourse,
  onOpenSyllabusModal
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'CLASHES_ONLY' | 'LABS_ONLY'>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');

  const selectedCourses = BTECH_IT_COURSES.filter(c => selectedPlanCourseIds.includes(c.id));

  const auditReport = detectScheduleConflicts(
    selectedCourses, 
    studentProfile.currentSemester, 
    customSemesterMap
  );

  const timetableMatrix = buildTimetableGridMatrix(selectedCourses);

  const totalLectureHours = selectedCourses.reduce((sum, c) => sum + (c.type === 'Lab' ? 1 : Math.max(2, c.lectureHours || 2)), 0);
  const totalLabHours = selectedCourses.reduce((sum, c) => sum + (c.type === 'Lab' || c.practicalHours >= 2 ? 2 : 0), 0);
  const totalSelfStudyHours = selectedCourses.reduce((sum, c) => sum + Math.max(1, c.workloadHours - 4), 0);
  const totalWeeklyHours = totalLectureHours + totalLabHours + totalSelfStudyHours;

  // Helper colors for course domain
  const getDomainColor = (domain: string, isClashing: boolean) => {
    if (isClashing) {
      return 'bg-red-500 text-white border-red-600 shadow-md ring-2 ring-red-400 dark:ring-red-500 animate-pulse';
    }

    switch (domain) {
      case 'AI & Data Science': 
        return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200';
      case 'Software Engineering': 
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200';
      case 'Cloud & Systems': 
        return 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200';
      case 'Cybersecurity & Networks': 
        return 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200';
      default: 
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const daysToRender = selectedDayFilter === 'ALL' 
    ? TIMETABLE_DAYS 
    : TIMETABLE_DAYS.filter(d => d === selectedDayFilter);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 px-3 py-1 rounded-full mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Semester {studentProfile.currentSemester} Timetable Simulation</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Weekly Academic Schedule & Slot Conflict Detector
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time schedule allocation across Lecture Theatres and SICT Computer Labs with automatic collision detection.
          </p>
        </div>

        {/* Conflict Pill Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          {auditReport.timeSlotClashes.length > 0 ? (
            <div 
              id="timetable-clash-pill-alert"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 shadow-xs animate-bounce"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-black">
                {auditReport.timeSlotClashes.length} Time Slot {auditReport.timeSlotClashes.length === 1 ? 'Clash' : 'Clashes'}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold">Timetable Clear (No Overlaps)</span>
            </div>
          )}
        </div>
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
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Active Clashes</span>
          <div className={`text-2xl font-extrabold mt-1 ${
            auditReport.timeSlotClashes.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {auditReport.timeSlotClashes.length} Collisions
          </div>
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

      {/* Filter / Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">View Filter:</span>
          
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Slots ({selectedCourses.length} Courses)
          </button>

          {auditReport.timeSlotClashes.length > 0 && (
            <button
              onClick={() => setFilterMode('CLASHES_ONLY')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'CLASHES_ONLY'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100'
              }`}
            >
              ⚠️ Clashing Only ({auditReport.timeSlotClashes.length})
            </button>
          )}

          <button
            onClick={() => setFilterMode('LABS_ONLY')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'LABS_ONLY'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Labs Only
          </button>
        </div>

        {/* Day Selector */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 font-medium">Day:</span>
          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Full Week (Mon - Fri)</option>
            {TIMETABLE_DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs overflow-x-auto transition-colors">
        <table className="w-full text-xs text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <th className="p-3 font-bold uppercase text-[10px] w-36">Time Slot</th>
              {daysToRender.map(day => (
                <th key={day} className="p-3 font-bold uppercase text-[10px] text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span>{day}</span>
                    {auditReport.dayWorkloads[day]?.labCount >= 2 && (
                      <span className="text-[9px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 px-1 rounded font-normal" title="Heavy Lab Day">
                        Lab+
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
            {STANDARD_TIME_SLOTS.map((slot, slotIdx) => {
              const isBreak = slot.type === 'Break';

              return (
                <tr key={slotIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap bg-slate-50/30 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{slot.label}</span>
                    </div>
                  </td>

                  {daysToRender.map((day, dayIdx) => {
                    if (isBreak) {
                      return (
                        <td key={dayIdx} className="p-2 text-center bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 font-bold text-[10px] tracking-wider">
                          LUNCH & PRAYER BREAK
                        </td>
                      );
                    }

                    const occupants = timetableMatrix.matrix[slot.label]?.[day] || [];
                    const isCellClashing = occupants.length > 1;

                    if (filterMode === 'CLASHES_ONLY' && !isCellClashing) {
                      return (
                        <td key={dayIdx} className="p-2 text-center text-slate-300 dark:text-slate-700">
                          —
                        </td>
                      );
                    }

                    if (filterMode === 'LABS_ONLY' && occupants.length > 0 && !occupants.some(o => o.slot.type === 'Lab')) {
                      return (
                        <td key={dayIdx} className="p-2 text-center text-slate-300 dark:text-slate-700">
                          —
                        </td>
                      );
                    }

                    if (occupants.length === 0) {
                      return (
                        <td key={dayIdx} className="p-2 text-center text-slate-300 dark:text-slate-700">
                          —
                        </td>
                      );
                    }

                    return (
                      <td key={dayIdx} className="p-1.5 align-top">
                        {isCellClashing ? (
                          /* CLASH HIGHLIGHT BOX */
                          <div className="p-2 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/70 space-y-2 shadow-xs ring-2 ring-red-400/50 dark:ring-red-800">
                            <div className="flex items-center justify-between text-red-700 dark:text-red-300 text-[10px] font-black uppercase tracking-wider pb-1 border-b border-red-200 dark:border-red-800">
                              <span className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-red-600 animate-bounce" />
                                <span>SCHEDULING CLASH</span>
                              </span>
                              <span className="bg-red-600 text-white px-1.5 py-0.2 rounded text-[9px]">
                                {occupants.length} Courses
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {occupants.map((occ, oIdx) => (
                                <div 
                                  key={oIdx}
                                  className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 text-slate-900 dark:text-white space-y-0.5 shadow-2xs"
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-extrabold text-[11px] text-red-700 dark:text-red-400">
                                      {occ.course.code}
                                    </span>
                                    <span className="text-[9px] font-bold px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                      {occ.slot.type}
                                    </span>
                                  </div>

                                  <div className="font-medium text-[10px] text-slate-700 dark:text-slate-300 truncate">
                                    {occ.course.name}
                                  </div>

                                  {occ.slot.venue && (
                                    <div className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                      <span>{occ.slot.venue}</span>
                                    </div>
                                  )}

                                  {onRemovePlanCourse && (
                                    <div className="pt-1 flex items-center justify-end">
                                      <button
                                        id={`btn-timetable-remove-${occ.course.id}`}
                                        onClick={() => onRemovePlanCourse(occ.course.id)}
                                        className="text-[9px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
                                        title={`Remove ${occ.course.code} to resolve collision`}
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                        <span>Remove to Resolve</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* STANDARD OCCUPIED CELL */
                          <div className="space-y-1">
                            {occupants.map((occ, oIdx) => (
                              <div
                                key={oIdx}
                                onClick={() => onOpenSyllabusModal && onOpenSyllabusModal(occ.course)}
                                className={`p-2 rounded-xl border text-center space-y-0.5 cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${getDomainColor(occ.course.domain, false)}`}
                                title={`Click to view syllabus for ${occ.course.code}: ${occ.course.name}`}
                              >
                                <div className="font-extrabold text-[10px] truncate">{occ.course.code}</div>
                                <div className="font-medium text-[10px] truncate">{occ.course.name}</div>
                                <div className="text-[9px] font-bold uppercase opacity-80 flex items-center justify-center gap-1">
                                  {occ.slot.type === 'Lab' ? (
                                    <Laptop className="w-2.5 h-2.5" />
                                  ) : (
                                    <BookOpen className="w-2.5 h-2.5" />
                                  )}
                                  <span>{occ.slot.type}</span>
                                </div>
                                {occ.slot.venue && (
                                  <div className="text-[8px] opacity-75 truncate">{occ.slot.venue}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Clash Resolution Inspector Card */}
      {auditReport.timeSlotClashes.length > 0 && (
        <div className="bg-red-50/60 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h4 className="font-extrabold text-sm">Timetable Conflict Resolution Advice</h4>
          </div>

          <div className="space-y-2">
            {auditReport.timeSlotClashes.map((clash, cIdx) => (
              <div key={cIdx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-red-200 dark:border-red-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-red-600 font-extrabold">{clash.courseCodes.join(' ⚡ ')}</span>
                    <span className="text-slate-400">•</span>
                    <span>{clash.day} ({clash.timeSlot})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {clash.resolutionTip}
                  </p>
                </div>

                {onRemovePlanCourse && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {clash.courseIds.map((id, iIdx) => (
                      <button
                        key={id}
                        onClick={() => onRemovePlanCourse(id)}
                        className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950 hover:bg-red-200 text-red-700 dark:text-red-300 text-[11px] font-bold transition-colors"
                      >
                        Remove {clash.courseCodes[iIdx]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
