import { AcademicProgrammeRules } from '../types/curriculum';

export const PROGRAMME_PRESETS: Record<string, AcademicProgrammeRules> = {
  'futminna_it': {
    institution: 'Federal University of Technology, Minna',
    institutionShortCode: 'FUTMinna',
    school: 'School of Information and Communication Technology',
    schoolShortCode: 'SICT',
    programme: 'Information Technology',
    programmeCode: 'B.Tech IT',
    degreeAward: 'Bachelor of Technology (B.Tech)',
    curriculumFramework: 'NUC CCMAS & SICT Departmental Regulations',
    minSemesterUnits: 15,
    maxSemesterUnits: 24,
    graduationRequirementUnits: 150,
    directEntryGraduationUnits: 120,
    minimumPassCGPA: 1.00,
    allowDeanOverload: true,
    maxOverloadUnits: 26,
    handbookSourceNote: 'FUTMinna SICT Departmental Handbook (B.Tech IT Regulations)',
    isOfficialHandbookConfirmed: false,
    isCustomConfigured: false,
    siwesRegulations: {
      isRequired: true,
      eligibleLevel: '400L',
      durationMonths: 6,
      durationWeeks: 24,
      creditUnits: 6,
      minCgpaRequired: 1.50,
      minUnitsCompleted: 90,
      regulatoryBody: 'ITF Nigeria & FUT Minna Directorate of SIWES'
    }
  },
  'futminna_cs': {
    institution: 'Federal University of Technology, Minna',
    institutionShortCode: 'FUTMinna',
    school: 'School of Information and Communication Technology',
    schoolShortCode: 'SICT',
    programme: 'Computer Science',
    programmeCode: 'B.Tech CS',
    degreeAward: 'Bachelor of Technology (B.Tech)',
    curriculumFramework: 'NUC CCMAS & SICT Departmental Regulations',
    minSemesterUnits: 15,
    maxSemesterUnits: 24,
    graduationRequirementUnits: 150,
    directEntryGraduationUnits: 120,
    minimumPassCGPA: 1.00,
    allowDeanOverload: true,
    maxOverloadUnits: 26,
    handbookSourceNote: 'FUTMinna SICT Departmental Handbook (B.Tech CS Regulations)',
    isOfficialHandbookConfirmed: false,
    isCustomConfigured: false,
    siwesRegulations: {
      isRequired: true,
      eligibleLevel: '400L',
      durationMonths: 6,
      durationWeeks: 24,
      creditUnits: 6,
      minCgpaRequired: 1.50,
      minUnitsCompleted: 90,
      regulatoryBody: 'ITF Nigeria & FUT Minna Directorate of SIWES'
    }
  },
  'futminna_cyber': {
    institution: 'Federal University of Technology, Minna',
    institutionShortCode: 'FUTMinna',
    school: 'School of Information and Communication Technology',
    schoolShortCode: 'SICT',
    programme: 'Cyber Security Science',
    programmeCode: 'B.Tech CSS',
    degreeAward: 'Bachelor of Technology (B.Tech)',
    curriculumFramework: 'NUC CCMAS & SICT Departmental Regulations',
    minSemesterUnits: 15,
    maxSemesterUnits: 24,
    graduationRequirementUnits: 150,
    directEntryGraduationUnits: 120,
    minimumPassCGPA: 1.00,
    allowDeanOverload: true,
    maxOverloadUnits: 26,
    handbookSourceNote: 'FUTMinna SICT Departmental Handbook (B.Tech CSS Regulations)',
    isOfficialHandbookConfirmed: false,
    isCustomConfigured: false,
    siwesRegulations: {
      isRequired: true,
      eligibleLevel: '400L',
      durationMonths: 6,
      durationWeeks: 24,
      creditUnits: 6,
      minCgpaRequired: 1.50,
      minUnitsCompleted: 90,
      regulatoryBody: 'ITF Nigeria & FUT Minna Directorate of SIWES'
    }
  },
  'generic_nuc_ccmas': {
    institution: 'Nigerian University (Accredited)',
    institutionShortCode: 'NUC-Aligned',
    school: 'Faculty / School of Computing & IT',
    schoolShortCode: 'Computing',
    programme: 'Information Technology',
    programmeCode: 'B.Sc / B.Tech IT',
    degreeAward: 'Bachelor of Technology (B.Tech)',
    curriculumFramework: 'NUC CCMAS Benchmark Standards',
    minSemesterUnits: 15,
    maxSemesterUnits: 24,
    graduationRequirementUnits: 150,
    directEntryGraduationUnits: 120,
    minimumPassCGPA: 1.00,
    allowDeanOverload: false,
    maxOverloadUnits: 24,
    handbookSourceNote: 'NUC Minimum Academic Standards (CCMAS)',
    isOfficialHandbookConfirmed: false,
    isCustomConfigured: false,
    siwesRegulations: {
      isRequired: true,
      eligibleLevel: '400L',
      durationMonths: 6,
      durationWeeks: 24,
      creditUnits: 6,
      minCgpaRequired: 1.50,
      minUnitsCompleted: 90,
      regulatoryBody: 'ITF Nigeria & NUC CCMAS'
    }
  }
};

export const DEFAULT_PROGRAMME_RULES: AcademicProgrammeRules = PROGRAMME_PRESETS['futminna_it'];

export const loadStoredProgrammeRules = (): AcademicProgrammeRules => {
  try {
    const saved = localStorage.getItem('app-programme-rules');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PROGRAMME_RULES, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load stored programme rules', err);
  }
  return DEFAULT_PROGRAMME_RULES;
};

export const saveStoredProgrammeRules = (rules: AcademicProgrammeRules): void => {
  try {
    localStorage.setItem('app-programme-rules', JSON.stringify(rules));
  } catch (err) {
    console.warn('Failed to save programme rules', err);
  }
};
