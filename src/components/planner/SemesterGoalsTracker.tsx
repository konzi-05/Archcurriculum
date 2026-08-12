import React, { useState } from 'react';
import { SemesterGoal } from '../../types/curriculum';
import { CheckSquare, Square, Plus, Trash2, Award, BookOpen, Target, Sparkles } from 'lucide-react';

interface SemesterGoalsTrackerProps {
  currentSemester: number;
  goals: SemesterGoal[];
  onAddGoal: (goal: Omit<SemesterGoal, 'id'>) => void;
  onToggleGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SemesterGoalsTracker: React.FC<SemesterGoalsTrackerProps> = ({
  currentSemester,
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal
}) => {
  const [selectedSemFilter, setSelectedSemFilter] = useState<number>(currentSemester);
  const [newGoalTitle, setNewGoalTitle] = useState<string>('');
  const [newGoalCategory, setNewGoalCategory] = useState<SemesterGoal['category']>('Academic');

  const filteredGoals = goals.filter(g => g.semester === selectedSemFilter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    onAddGoal({
      semester: selectedSemFilter,
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      completed: false
    });
    setNewGoalTitle('');
  };

  const getCategoryBadge = (cat: SemesterGoal['category']) => {
    switch (cat) {
      case 'Certification': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Project': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Career': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default: return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800 px-3 py-1 rounded-full mb-2">
          <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Semester Milestones & Goal Tracker</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Personalized Academic & Professional Milestones
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Set custom targets for certifications, publications, internships, and grade honors across Semesters 1 through 8.
        </p>
      </div>

      {/* Semester Filter Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200 dark:border-slate-800">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
          <button
            key={sem}
            onClick={() => setSelectedSemFilter(sem)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              selectedSemFilter === sem
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : sem === currentSemester
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semester {sem} {sem === currentSemester ? '(Current)' : ''}
          </button>
        ))}
      </div>

      {/* Add New Goal Form */}
      <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3 text-xs transition-colors">
        <input
          type="text"
          placeholder={`Add new Semester ${selectedSemFilter} milestone goal (e.g. "AWS Certified Solutions Architect Associate")...`}
          value={newGoalTitle}
          onChange={e => setNewGoalTitle(e.target.value)}
          className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500"
        />

        <select
          value={newGoalCategory}
          onChange={e => setNewGoalCategory(e.target.value as any)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none font-semibold"
        >
          <option value="Academic">Academic</option>
          <option value="Certification">Certification</option>
          <option value="Project">Project</option>
          <option value="Career">Career / Internship</option>
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </form>

      {/* Goal List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 transition-colors">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
          Semester {selectedSemFilter} Milestones ({filteredGoals.length})
        </h4>

        {filteredGoals.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
            No milestones set for Semester {selectedSemFilter}. Add your first academic or certification target above!
          </p>
        ) : (
          <div className="space-y-2">
            {filteredGoals.map(goal => (
              <div
                key={goal.id}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all ${
                  goal.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className="p-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 transition-colors"
                  >
                    {goal.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{goal.title}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadge(goal.category)}`}>
                    {goal.category}
                  </span>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
