import React, { useState } from 'react';
import { AcademicProgrammeRules } from '../types/curriculum';
import { PROGRAMME_PRESETS, DEFAULT_PROGRAMME_RULES } from '../data/defaultProgrammeConfig';
import { 
  X, SlidersHorizontal, Building2, School, GraduationCap, 
  CheckCircle2, AlertTriangle, ShieldCheck, BookOpen, RotateCcw, 
  Sparkles, Save, Info, Check, HelpCircle
} from 'lucide-react';

interface ProgrammeRulesModalProps {
  currentRules: AcademicProgrammeRules;
  onSaveRules: (rules: AcademicProgrammeRules) => void;
  onClose: () => void;
}

export const ProgrammeRulesModal: React.FC<ProgrammeRulesModalProps> = ({
  currentRules,
  onSaveRules,
  onClose
}) => {
  const [formData, setFormData] = useState<AcademicProgrammeRules>({ ...currentRules });
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('custom');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleApplyPreset = (presetKey: string) => {
    const preset = PROGRAMME_PRESETS[presetKey];
    if (preset) {
      setFormData({
        ...preset,
        isCustomConfigured: false
      });
      setSelectedPresetKey(presetKey);
    }
  };

  const handleInputChange = <K extends keyof AcademicProgrammeRules>(
    field: K,
    value: AcademicProgrammeRules[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      isCustomConfigured: true
    }));
    setSelectedPresetKey('custom');
  };

  const handleResetToDefault = () => {
    setFormData({ ...DEFAULT_PROGRAMME_RULES });
    setSelectedPresetKey('futminna_it');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRules(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  // Validation
  const isValidRange = formData.minSemesterUnits <= formData.maxSemesterUnits;
  const isSensibleUnits = formData.minSemesterUnits >= 8 && formData.maxSemesterUnits <= 36;
  const isSensibleGrad = formData.graduationRequirementUnits >= 60 && formData.graduationRequirementUnits <= 250;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0 mt-0.5">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 font-mono">
                  Programme Configuration Engine
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                Academic Regulations & Unit Thresholds
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calibrate institution, school, programme, semester unit limits, and graduation requirements according to your official departmental handbook.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[40px] min-w-[40px] shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs bg-slate-50/40 dark:bg-slate-950/40">
          
          {/* Quick Presets Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Select Programme Preset
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('futminna_it')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedPresetKey === 'futminna_it'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold truncate">FUTMinna B.Tech IT</div>
                <div className="text-[10px] text-slate-500 mt-0.5">SICT Dept</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('futminna_cs')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedPresetKey === 'futminna_cs'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold truncate">FUTMinna B.Tech CS</div>
                <div className="text-[10px] text-slate-500 mt-0.5">SICT Dept</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('futminna_cyber')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedPresetKey === 'futminna_cyber'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold truncate">FUTMinna Cyber</div>
                <div className="text-[10px] text-slate-500 mt-0.5">SICT Dept</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('generic_nuc_ccmas')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedPresetKey === 'generic_nuc_ccmas'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold truncate">Generic NUC CCMAS</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Standard</div>
              </button>
            </div>
          </div>

          {/* Section 1: Institution & Academic Programme Hierarchy */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              1. Institutional Hierarchy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={e => handleInputChange('institution', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Federal University of Technology, Minna"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Institution Short Code
                </label>
                <input
                  type="text"
                  value={formData.institutionShortCode}
                  onChange={e => handleInputChange('institutionShortCode', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:border-blue-500"
                  placeholder="e.g. FUTMinna"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  School / Faculty
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={e => handleInputChange('school', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                  placeholder="e.g. School of Information and Communication Technology"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  School Code & Programme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formData.schoolShortCode}
                    onChange={e => handleInputChange('schoolShortCode', e.target.value)}
                    className="col-span-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:border-blue-500"
                    placeholder="SICT"
                    required
                  />
                  <input
                    type="text"
                    value={formData.programme}
                    onChange={e => handleInputChange('programme', e.target.value)}
                    className="col-span-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                    placeholder="Information Technology"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Official Unit Limits & Graduation Requirements */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                2. Configurable Academic Unit Parameters
              </h3>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-mono font-bold">
                Handbook Calibrated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Minimum Semester Units */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Minimum Semester Units
                  </label>
                  <span className="text-[10px] text-slate-500">[Official IT Value]</span>
                </div>
                <input
                  type="number"
                  min="8"
                  max="30"
                  value={formData.minSemesterUnits}
                  onChange={e => handleInputChange('minSemesterUnits', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-[10px] text-slate-500">
                  Schedules below this threshold trigger an underload notice.
                </p>
              </div>

              {/* Maximum Semester Units */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Maximum Semester Units
                  </label>
                  <span className="text-[10px] text-slate-500">[Official IT Value]</span>
                </div>
                <input
                  type="number"
                  min="12"
                  max="36"
                  value={formData.maxSemesterUnits}
                  onChange={e => handleInputChange('maxSemesterUnits', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-[10px] text-slate-500">
                  Schedules above this threshold trigger an overload alert.
                </p>
              </div>

              {/* Graduation Requirement (UTME 4/5-Year) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Graduation Requirement (UTME)
                  </label>
                  <span className="text-[10px] text-slate-500">[Official IT Value]</span>
                </div>
                <input
                  type="number"
                  min="80"
                  max="240"
                  value={formData.graduationRequirementUnits}
                  onChange={e => handleInputChange('graduationRequirementUnits', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-[10px] text-slate-500">
                  Total credit units required for degree award & graduation clearance.
                </p>
              </div>

              {/* Direct Entry (DE) Graduation Requirement */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Direct Entry (DE) Requirement
                  </label>
                  <span className="text-[10px] text-slate-500">[Official IT Value]</span>
                </div>
                <input
                  type="number"
                  min="60"
                  max="200"
                  value={formData.directEntryGraduationUnits}
                  onChange={e => handleInputChange('directEntryGraduationUnits', Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono focus:outline-none focus:border-blue-500"
                  required
                />
                <p className="text-[10px] text-slate-500">
                  Applicable for 200L Direct Entry student matriculation.
                </p>
              </div>

            </div>

            {/* Handbook Source & Verification Note */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Official Curriculum / Handbook Citation Note
              </label>
              <input
                type="text"
                value={formData.handbookSourceNote}
                onChange={e => handleInputChange('handbookSourceNote', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="e.g. FUTMinna SICT B.Tech Information Technology Student Handbook (2023–2028 Academic Edition)"
              />
            </div>
          </div>

          {/* Live Preview Summary Box */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Active Programme Rule Preview
            </span>
            <div className="text-xs text-blue-950 dark:text-blue-100 font-medium space-y-1">
              <div>
                <strong>Programme:</strong> {formData.institutionShortCode} • {formData.schoolShortCode} • {formData.programme} ({formData.degreeAward})
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] pt-1">
                <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Min Semester: <strong>{formData.minSemesterUnits} Units</strong>
                </span>
                <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Max Semester: <strong>{formData.maxSemesterUnits} Units</strong>
                </span>
                <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Graduation (UTME): <strong>{formData.graduationRequirementUnits} Units</strong>
                </span>
              </div>
            </div>
          </div>

          {!isValidRange && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Minimum semester units cannot exceed maximum semester units!</span>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {formData.isCustomConfigured ? 'Custom User Configuration' : 'Preset Configuration'}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl transition-colors min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValidRange}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-xs min-h-[40px] ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : isValidRange
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Apply Programme Rules</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
