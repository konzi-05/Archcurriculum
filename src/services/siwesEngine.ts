import { Course, StudentProfile, AcademicProgrammeRules, Grade, SiwesStructure, SiwesPhaseStatus, SiwesPrerequisiteItem, GRADE_POINTS } from '../types/curriculum';
import { BTECH_IT_COURSES } from '../data/btechItCurriculum';

export interface SiwesEvaluationResult {
  isRequired: boolean;
  eligibleLevel: string;
  eligibleSemester: number;
  isEligibleNow: boolean;
  overallStatus: SiwesPhaseStatus;
  statusLabel: string;
  statusColor: string;
  
  // Prerequisite & Credit Audit
  requiredEarnedCredits: number;
  actualEarnedCredits: number;
  creditsMet: boolean;
  
  // Academic Standing Audit
  minCgpaRequirement: number;
  actualCgpa: number;
  standingCategory: 'Good Academic Standing' | 'Academic Warning' | 'Probationary Status';
  isStandingMet: boolean;
  
  // Level & Semester Audit
  currentLevel: string;
  isLevelMet: boolean;
  
  // Specific Core Course Prerequisites
  prerequisites: SiwesPrerequisiteItem[];
  allPrerequisitesMet: boolean;
  missingPrerequisiteCodes: string[];
  
  // Duration & Weight
  durationMonths: number;
  durationWeeks: number;
  durationFormatted: string;
  creditUnits: number;
  
  // Rationale & Guidance
  institutionalGuidance: string;
  nextActionableStep: string;
  regulatoryBodies: string[];
}

export function calculateStudentCgpa(profile: StudentProfile, allCourses: Course[] = BTECH_IT_COURSES): number {
  let totalGradePoints = 0;
  let totalCredits = 0;

  for (const courseId of profile.completedCourseIds) {
    const grade = profile.grades[courseId];
    if (grade) {
      const course = allCourses.find(c => c.id === courseId);
      const credits = course?.credits || 3;
      const gp = GRADE_POINTS[grade] ?? 0;
      totalGradePoints += gp * credits;
      totalCredits += credits;
    }
  }

  if (totalCredits === 0) return 4.0; // Default baseline if not yet populated
  return Math.round((totalGradePoints / totalCredits) * 10) / 10;
}

export function calculateEarnedCredits(profile: StudentProfile, allCourses: Course[] = BTECH_IT_COURSES): number {
  let total = 0;
  for (const courseId of profile.completedCourseIds) {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      total += course.credits;
    }
  }
  return total;
}

/**
 * Key foundational courses required before SIWES deployment at FUT Minna / NUC CCMAS
 */
export const SIWES_CORE_PREREQUISITE_COURSE_IDS = [
  'CS102', // COS 101 - Intro to Computing Sciences
  'CS202', // COS 102 - Problem Solving & C Programming
  'CS301', // IFT 211 - Object-Oriented Programming (Java)
  'CS302', // COS 201 - Data Structures & Algorithms
  'CS402', // IFT 212 - Operating Systems & Systems Programming
  'CS403', // IFT 214 - Computer Networks & Communications
  'CS404', // IFT 311 - Database Systems & SQL Engineering
  'CS501'  // IFT 312 - Web Systems & Full-Stack Technologies
];

/**
 * Evaluates a student against institutional SIWES regulations
 */
export function evaluateSiwesEligibility(
  profile: StudentProfile,
  rules?: AcademicProgrammeRules,
  allCourses: Course[] = BTECH_IT_COURSES
): SiwesEvaluationResult {
  const siwesRules = rules?.siwesRegulations || {
    isRequired: true,
    eligibleLevel: '400L',
    durationMonths: 6,
    durationWeeks: 24,
    creditUnits: 6,
    minCgpaRequired: 1.50,
    minUnitsCompleted: 90,
    regulatoryBody: 'ITF Nigeria & FUT Minna Directorate of SIWES'
  };

  const actualEarnedCredits = calculateEarnedCredits(profile, allCourses);
  const actualCgpa = calculateStudentCgpa(profile, allCourses);
  
  const currentLevelStr = profile.academicLevel || (profile.currentSemester <= 2 ? '100L' : profile.currentSemester <= 4 ? '200L' : profile.currentSemester <= 6 ? '300L' : profile.currentSemester <= 8 ? '400L' : '500L');
  
  // Level check: 400L is eligible (or 300L students preparing for 400L)
  const isLevelMet = currentLevelStr === '400L' || profile.currentSemester >= 7;
  const creditsMet = actualEarnedCredits >= (profile.entryMode === 'Direct_Entry' ? 60 : siwesRules.minUnitsCompleted);
  const isStandingMet = actualCgpa >= siwesRules.minCgpaRequired;
  
  let standingCategory: 'Good Academic Standing' | 'Academic Warning' | 'Probationary Status' = 'Good Academic Standing';
  if (actualCgpa < 1.00) {
    standingCategory = 'Probationary Status';
  } else if (actualCgpa < siwesRules.minCgpaRequired) {
    standingCategory = 'Academic Warning';
  }

  // Audit specific prerequisite courses
  const prerequisiteItems: SiwesPrerequisiteItem[] = SIWES_CORE_PREREQUISITE_COURSE_IDS.map(courseId => {
    const course = allCourses.find(c => c.id === courseId);
    const isCompleted = profile.completedCourseIds.includes(courseId);
    const grade = profile.grades[courseId];
    return {
      id: courseId,
      code: course?.futMinnaCode || course?.code || courseId,
      name: course?.name || 'Departmental Core Prerequisite',
      isCompleted,
      grade,
      isCritical: true
    };
  });

  const missingPrerequisites = prerequisiteItems.filter(p => !p.isCompleted);
  const allPrerequisitesMet = missingPrerequisites.length === 0;

  // Determine Overall Phase Status
  let overallStatus: SiwesPhaseStatus = 'NOT_YET_ELIGIBLE';
  let statusLabel = 'Prerequisites Pending';
  let statusColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';

  if (profile.siwesPlacement?.oralDefensePassed) {
    overallStatus = 'ORAL_DEFENSE_CLEARED';
    statusLabel = 'SIWES Defended & Cleared';
    statusColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700';
  } else if (profile.siwesPlacement?.technicalReportSubmitted) {
    overallStatus = 'TECHNICAL_REPORT_SUBMITTED';
    statusLabel = 'Report Submitted / Defense Pending';
    statusColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  } else if (profile.siwesPlacement?.totalWeeksLogged && profile.siwesPlacement.totalWeeksLogged >= 24) {
    overallStatus = 'INSTITUTIONAL_SUPERVISION_COMPLETED';
    statusLabel = 'Attachment Concluded (24 Wks)';
    statusColor = 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
  } else if (profile.siwesPlacement?.companyName && profile.siwesPlacement.itfForm8Submitted) {
    overallStatus = 'ATTACHMENT_IN_PROGRESS';
    statusLabel = `In Progress at ${profile.siwesPlacement.companyName} (${profile.siwesPlacement.totalWeeksLogged || 0}/24 Wks)`;
    statusColor = 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800';
  } else if (profile.siwesPlacement?.companyName) {
    overallStatus = 'PLACEMENT_CONFIRMED';
    statusLabel = `Placement Secured: ${profile.siwesPlacement.companyName}`;
    statusColor = 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
  } else if (isStandingMet && allPrerequisitesMet && (isLevelMet || currentLevelStr === '300L')) {
    overallStatus = 'ELIGIBLE_AWAITING_PLACEMENT';
    statusLabel = 'Eligible for 400L Attachment';
    statusColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  }

  const isEligibleNow = isStandingMet && allPrerequisitesMet && (isLevelMet || currentLevelStr === '300L');

  let institutionalGuidance = '';
  let nextActionableStep = '';

  if (overallStatus === 'NOT_YET_ELIGIBLE') {
    institutionalGuidance = `Student is currently at ${currentLevelStr} with ${actualEarnedCredits} earned units. Complete remaining foundational core prerequisites and maintain CGPA >= ${siwesRules.minCgpaRequired.toFixed(2)} to secure statutory eligibility.`;
    nextActionableStep = `Clear pending core courses: ${missingPrerequisites.map(p => p.code).join(', ')}`;
  } else if (overallStatus === 'ELIGIBLE_AWAITING_PLACEMENT') {
    institutionalGuidance = `Student is fully cleared by the SIWES Directorate. Collect official SIWES Letter of Introduction from SICT and seek industrial placement at accredited software/network/cloud engineering organizations.`;
    nextActionableStep = 'Submit ITF Form 8 (Endorsement of Attachment) once an employer acceptance letter is received.';
  } else if (overallStatus === 'PLACEMENT_CONFIRMED') {
    institutionalGuidance = `Placement confirmed with ${profile.siwesPlacement?.companyName}. Commence weekly logbook documentation and ensure industry supervisor verifies bi-weekly entries.`;
    nextActionableStep = 'Commence week 1 of 24 and prepare for institutional supervisor on-site assessment.';
  } else if (overallStatus === 'ATTACHMENT_IN_PROGRESS') {
    institutionalGuidance = `Active continuous attachment. Keep weekly records of technical development, production deployments, and system configurations for institutional inspection.`;
    nextActionableStep = `Log remaining weeks (${24 - (profile.siwesPlacement?.totalWeeksLogged || 0)} weeks remaining) and prepare draft technical report.`;
  } else if (overallStatus === 'INSTITUTIONAL_SUPERVISION_COMPLETED') {
    institutionalGuidance = `24-week industrial immersion successfully concluded. Bind 50-page Technical Report adhering to Department of Information Technology dissertation formatting standards.`;
    nextActionableStep = 'Submit final report and register for the Departmental SIWES Defense Panel.';
  } else {
    institutionalGuidance = `SIWES requirements fully satisfied. 6 Credit Units earned and eligible for Senate graduation clearance.`;
    nextActionableStep = 'Maintain transcript record for final degree audit.';
  }

  return {
    isRequired: true,
    eligibleLevel: siwesRules.eligibleLevel,
    eligibleSemester: 8,
    isEligibleNow,
    overallStatus,
    statusLabel,
    statusColor,
    requiredEarnedCredits: siwesRules.minUnitsCompleted,
    actualEarnedCredits,
    creditsMet,
    minCgpaRequirement: siwesRules.minCgpaRequired,
    actualCgpa,
    standingCategory,
    isStandingMet,
    currentLevel: currentLevelStr,
    isLevelMet,
    prerequisites: prerequisiteItems,
    allPrerequisitesMet,
    missingPrerequisiteCodes: missingPrerequisites.map(p => p.code),
    durationMonths: siwesRules.durationMonths,
    durationWeeks: siwesRules.durationWeeks,
    durationFormatted: `${siwesRules.durationMonths} Months (${siwesRules.durationWeeks} Weeks Continuous Industrial Attachment)`,
    creditUnits: siwesRules.creditUnits,
    institutionalGuidance,
    nextActionableStep,
    regulatoryBodies: [
      'Industrial Training Fund (ITF) Nigeria',
      'National Universities Commission (NUC CCMAS)',
      `${rules?.institutionShortCode || 'FUTMinna'} Directorate of SIWES & Senate`
    ]
  };
}

/**
 * Builds the structural breakdown requested by the user:
 * SIWES
 *  ├── Required?
 *  ├── Eligible Level
 *  ├── Prerequisites
 *  ├── Duration
 *  ├── Credit Units
 *  ├── Academic Standing Requirement
 *  └── Completion Status
 */
export function getSiwesConceptualTree(profile: StudentProfile, rules?: AcademicProgrammeRules) {
  const audit = evaluateSiwesEligibility(profile, rules);

  return {
    title: 'Students Industrial Work Experience Scheme (SIWES II)',
    subtitle: 'NUC CCMAS & ITF Statutory Industrial Training Architecture',
    nodes: [
      {
        key: 'required',
        label: 'Required?',
        badge: 'Statutory Mandatory',
        badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        value: 'Yes — Statutory Compulsory Requirement',
        description: 'Mandated by the Federal Government of Nigeria, Industrial Training Fund (ITF), NUC CCMAS, and University Senate. Not an elective. Passing is a non-negotiable prerequisite for graduation and degree award.'
      },
      {
        key: 'eligibleLevel',
        label: 'Eligible Level',
        badge: `${audit.eligibleLevel} (Semester ${audit.eligibleSemester})`,
        badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        value: '400 Level — Second Semester (Rain Semester / 6-Month Block)',
        description: 'Scheduled during the second semester of the penultimate year (400L Rain Semester) to enable full-time uninterrupted industrial immersion without academic lecture clashes.'
      },
      {
        key: 'prerequisites',
        label: 'Prerequisites',
        badge: audit.allPrerequisitesMet ? 'Prerequisites Cleared' : `${audit.missingPrerequisiteCodes.length} Pending`,
        badgeColor: audit.allPrerequisitesMet ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        value: `Minimum ${audit.requiredEarnedCredits} Earned Units + Foundational Core CS/IT Clearance`,
        description: 'Candidates must have passed all 100L-300L foundational computing courses (Data Structures, OOP, Operating Systems, Database Systems, Networks, Software Engineering) with zero critical carryovers.'
      },
      {
        key: 'duration',
        label: 'Duration',
        badge: `${audit.durationMonths} Months / ${audit.durationWeeks} Weeks`,
        badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        value: '6 Months (24 Calendar Weeks) Full-Time Attachment',
        description: 'Continuous full-time workplace immersion (minimum 40 practical hours per week) at an accredited corporate organization, engineering firm, or research enterprise.'
      },
      {
        key: 'creditUnits',
        label: 'Credit Units',
        badge: `${audit.creditUnits} Units (Full Semester Weight)`,
        badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        value: `${audit.creditUnits} Credit Units (Whole Semester Dedicated)`,
        description: 'Occupies the entire academic workload for the semester (0 Lecture Hours, 40 Practical Hours). Graded via institutional supervision (20%), logbook assessment (20%), technical report (30%), and departmental oral defense panel (30%).'
      },
      {
        key: 'academicStanding',
        label: 'Academic Standing Requirement',
        badge: `CGPA >= ${audit.minCgpaRequirement.toFixed(2)} (Good Standing)`,
        badgeColor: audit.isStandingMet ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        value: `CGPA >= ${audit.minCgpaRequirement.toFixed(2)} (Non-Probationary Status)`,
        description: `Students must maintain Good Academic Standing. Candidates on Academic Probation (CGPA < 1.00) or Academic Warning are ineligible for industrial placement until academic deficiencies are remediated.`
      },
      {
        key: 'completionStatus',
        label: 'Completion Status',
        badge: audit.statusLabel,
        badgeColor: audit.statusColor,
        value: audit.statusLabel,
        description: audit.institutionalGuidance
      }
    ]
  };
}
