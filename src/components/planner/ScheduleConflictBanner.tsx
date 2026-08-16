import React, { useState } from 'react';
import { ScheduleAuditReport, ScheduleConflict, Course } from '../../types/curriculum';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

interface ScheduleConflictBannerProps {
  auditReport: ScheduleAuditReport;
  onRemoveCourse: (courseId: string) => void;
  onSwitchToTimetable: () => void;
  allCourses?: Course[];
}

export const ScheduleConflictBanner: React.FC<ScheduleConflictBannerProps> = ({
  auditReport,
  onRemoveCourse,
  onSwitchToTimetable,
  allCourses = []
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!auditReport.hasConflicts) {
    return (
      <div 
        id="schedule-conflict-status-clean"
        className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                  Timetable & Semester Alignment Verified
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                  0 Conflicts
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                All selected courses have distinct lecture & laboratory time slots with zero seasonal or prerequisite collisions.
              </p>
            </div>
          </div>

          <button
            id="btn-view-clean-timetable"
            onClick={onSwitchToTimetable}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 dark:bg-emerald-900/60 dark:hover:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-colors"
          >
            <span>View Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const criticalConflicts = auditReport.conflicts.filter(c => c.severity === 'CRITICAL');
  const warningConflicts = auditReport.conflicts.filter(c => c.severity === 'WARNING');

  return (
    <div 
      id="schedule-conflict-alert-card"
      className="bg-white dark:bg-slate-900 border-2 border-red-500/80 dark:border-red-600/80 rounded-2xl p-4 sm:p-5 shadow-lg shadow-red-500/5 transition-all space-y-4"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-red-100 dark:border-red-950/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h3 className="text-sm font-extrabold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <span>Scheduling & Semester Conflict Alert</span>
              </h3>
              <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                {auditReport.totalConflicts} {auditReport.totalConflicts === 1 ? 'Issue' : 'Issues'} Detected
              </span>
              {criticalConflicts.length > 0 && (
                <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-md border border-red-300 dark:border-red-800">
                  {criticalConflicts.length} Critical Clash
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Multiple selected subjects conflict on time slots, academic semesters, or prerequisite dependencies.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            id="btn-switch-to-timetable-from-alert"
            onClick={onSwitchToTimetable}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/70 hover:bg-red-100 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Open Timetable Grid</span>
          </button>

          <button
            id="btn-toggle-conflict-details"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle conflict details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Conflict Items List */}
      {isExpanded && (
        <div className="space-y-3 pt-1">
          {auditReport.conflicts.map((conflict, idx) => {
            const isCritical = conflict.severity === 'CRITICAL';

            return (
              <div
                key={conflict.id || idx}
                id={`conflict-card-${conflict.type.toLowerCase()}-${idx}`}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isCritical 
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800/80 text-slate-900 dark:text-slate-100'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isCritical 
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {conflict.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {conflict.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {conflict.description}
                    </p>

                    {conflict.venue && (
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 pt-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Venues:</span>
                        <span>{conflict.venue}</span>
                      </div>
                    )}

                    {conflict.resolutionTip && (
                      <div className="flex items-start space-x-1.5 text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 p-2 rounded-lg border border-blue-200/80 dark:border-blue-900/60 mt-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <strong className="font-bold">Resolution Suggestion: </strong>
                          <span>{conflict.resolutionTip}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Resolution Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0 pt-1 sm:pt-0">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 hidden sm:block">
                      Quick Fix:
                    </span>
                    <div className="flex items-center sm:flex-col gap-1.5 flex-wrap">
                      {conflict.courseIds.map((courseId, cIdx) => {
                        const code = conflict.courseCodes[cIdx] || courseId;
                        return (
                          <button
                            key={courseId}
                            id={`btn-resolve-remove-${courseId}`}
                            onClick={() => onRemoveCourse(courseId)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition-colors shadow-2xs"
                            title={`Remove ${code} from active schedule`}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                            <span>Remove {code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
