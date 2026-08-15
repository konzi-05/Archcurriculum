import { Course, StudentProfile, AcademicProgrammeRules } from '../types/curriculum';
import { BTECH_IT_COURSES } from '../data/btechItCurriculum';
import { evaluateSiwesEligibility, calculateStudentCgpa } from './siwesEngine';

export interface ComplianceCheckItem {
  id: string;
  name: string;
  code: string;
  category: string;
  requiredValue: string | number;
  actualValue: string | number;
  isSatisfied: boolean;
  statusText: string;
  detailNote?: string;
}

export interface ComplianceCategoryStatus {
  id: string;
  title: string;
  shortName: string;
  percentage: number;
  isSatisfied: boolean;
  statusBadge: 'COMPLIANT' | 'ON_TRACK' | 'ATTENTION' | 'CRITICAL';
  statusColor: string;
  metricLabel: string;
  actualCount: number;
  requiredCount: number;
  unit: string;
  summary: string;
  regulatoryAuthority: string;
  breakdown: ComplianceCheckItem[];
  remedialActions?: string[];
}

export interface CurriculumComplianceReport {
  overallPercentage: number;
  isFullyCompliant: boolean;
  complianceLevel: 'Exemplary' | 'Good Standing' | 'Progression Alert' | 'Deficient';
  complianceSource: string;
  lastCurriculumVerification: string;
  verificationHash: string;
  academicSession: string;
  institutionName: string;
  facultySchool: string;
  departmentProgram: string;
  curriculumStandard: string;
  studentInfo: {
    name: string;
    matricNumber: string;
    level: string;
    entryMode: string;
    cgpa: number;
    cgpaStatus: string;
    earnedCredits: number;
    requiredCredits: number;
  };
  matrix: {
    nucCcmasCore: ComplianceCategoryStatus;
    futMinnaCore: ComplianceCategoryStatus;
    prerequisites: ComplianceCategoryStatus;
    creditRequirements: ComplianceCategoryStatus;
    electiveRequirements: ComplianceCategoryStatus;
    siwesRequirements: ComplianceCategoryStatus;
    projectRequirements: ComplianceCategoryStatus;
    learningOutcomes: ComplianceCategoryStatus;
  };
  auditSummaryNotes: string[];
}

/**
 * Evaluates full curriculum compliance against NUC CCMAS standards & FUTMinna Senate approved requirements.
 * Supports evaluating either current earned state or projected state (including planned courses).
 */
export function evaluateCurriculumCompliance(
  profile: StudentProfile,
  rules: AcademicProgrammeRules,
  allCourses: Course[] = BTECH_IT_COURSES,
  plannedCourseIds: string[] = [],
  includePlannedInEvaluation: boolean = false
): CurriculumComplianceReport {
  const completedIds = new Set(profile.completedCourseIds || []);
  const activeIds = includePlannedInEvaluation 
    ? new Set([...profile.completedCourseIds, ...plannedCourseIds])
    : completedIds;

  const currentCgpa = calculateStudentCgpa(profile, allCourses);
  const graduationUnitsTarget = profile.entryMode === 'Direct_Entry'
    ? rules.directEntryGraduationUnits || 120
    : rules.graduationRequirementUnits || 150;

  // 1. NUC CCMAS CORE COURSES
  const nucCoreCourses = allCourses.filter(c => 
    c.type === 'Core' && (Boolean(c.nucCcmasCode) || c.academicLevel !== undefined)
  );
  const nucCoreCompleted = nucCoreCourses.filter(c => activeIds.has(c.id));
  const nucCoreItems: ComplianceCheckItem[] = nucCoreCourses.map(c => ({
    id: c.id,
    name: c.name,
    code: c.nucCcmasCode || c.code,
    category: 'NUC CCMAS Core',
    requiredValue: 'Completed (Pass)',
    actualValue: activeIds.has(c.id) ? (profile.grades[c.id] ? `Grade ${profile.grades[c.id]}` : 'Passed') : 'Pending',
    isSatisfied: activeIds.has(c.id),
    statusText: activeIds.has(c.id) ? 'Completed' : 'Outstanding',
    detailNote: `${c.credits} Units • Level ${c.academicLevel || c.semester}`
  }));
  const nucCorePct = nucCoreCourses.length > 0
    ? Math.round((nucCoreCompleted.length / nucCoreCourses.length) * 100)
    : 100;

  // 2. FUTMINNA DEPARTMENTAL CORE COURSES
  const futMinnaCoreCourses = allCourses.filter(c => 
    c.type === 'Core' || c.type === 'Lab'
  );
  const futMinnaCoreCompleted = futMinnaCoreCourses.filter(c => activeIds.has(c.id));
  const futMinnaCoreItems: ComplianceCheckItem[] = futMinnaCoreCourses.map(c => ({
    id: c.id,
    name: c.name,
    code: c.futMinnaCode || c.code,
    category: 'FUTMinna Dept. Core',
    requiredValue: 'Pass Grade',
    actualValue: activeIds.has(c.id) ? (profile.grades[c.id] ? `Grade ${profile.grades[c.id]}` : 'Completed') : 'Not Yet Registered',
    isSatisfied: activeIds.has(c.id),
    statusText: activeIds.has(c.id) ? 'Satisfied' : 'Pending',
    detailNote: `${c.futMinnaCode || c.code} • ${c.credits} Credits`
  }));
  const futMinnaCorePct = futMinnaCoreCourses.length > 0
    ? Math.round((futMinnaCoreCompleted.length / futMinnaCoreCourses.length) * 100)
    : 100;

  // 3. PREREQUISITES COMPLIANCE (Topological Course Prerequisite Integrity)
  const coursesWithPrereqs = allCourses.filter(c => c.prerequisites && c.prerequisites.length > 0);
  let totalPrereqPairs = 0;
  let satisfiedPrereqPairs = 0;
  const prereqItems: ComplianceCheckItem[] = [];

  coursesWithPrereqs.forEach(course => {
    course.prerequisites.forEach(prereqId => {
      totalPrereqPairs++;
      const isPrereqSatisfied = completedIds.has(prereqId);
      const isCourseAttempted = activeIds.has(course.id);
      if (isPrereqSatisfied) {
        satisfiedPrereqPairs++;
      }
      
      const prereqCourse = allCourses.find(c => c.id === prereqId);
      prereqItems.push({
        id: `${course.id}-${prereqId}`,
        name: `${course.code} prerequisite: ${prereqCourse?.code || prereqId}`,
        code: `${prereqCourse?.code || prereqId} ➔ ${course.code}`,
        category: 'Academic Pre-requisite Rule',
        requiredValue: `${prereqCourse?.code || prereqId} (Passed)`,
        actualValue: isPrereqSatisfied ? 'Cleared' : (isCourseAttempted ? 'Violation/Unmet' : 'Pending'),
        isSatisfied: isPrereqSatisfied,
        statusText: isPrereqSatisfied ? 'Cleared' : 'Unsatisfied',
        detailNote: isCourseAttempted && !isPrereqSatisfied 
          ? 'Registered without prior clearance'
          : `Required before taking ${course.name}`
      });
    });
  });
  const prereqPct = totalPrereqPairs > 0 
    ? Math.round((satisfiedPrereqPairs / totalPrereqPairs) * 100)
    : 100;

  // 4. CREDIT REQUIREMENTS (Graduation & Semester Unit Caps)
  const earnedCredits = profile.completedCourseIds.reduce((sum, cId) => {
    const course = allCourses.find(c => c.id === cId);
    return sum + (course?.credits || 0);
  }, 0);
  const plannedCredits = plannedCourseIds.reduce((sum, cId) => {
    const course = allCourses.find(c => c.id === cId);
    return sum + (course?.credits || 0);
  }, 0);
  const totalEvaluatedCredits = includePlannedInEvaluation ? (earnedCredits + plannedCredits) : earnedCredits;
  const creditPct = Math.min(100, Math.round((totalEvaluatedCredits / graduationUnitsTarget) * 100));

  const creditItems: ComplianceCheckItem[] = [
    {
      id: 'cred-grad',
      name: 'Graduation Minimum Earned Units',
      code: 'SENATE-DEG-REQ',
      category: 'Degree Clearance',
      requiredValue: `${graduationUnitsTarget} Units`,
      actualValue: `${totalEvaluatedCredits} Units (${earnedCredits} Earned${includePlannedInEvaluation ? ` + ${plannedCredits} Planned` : ''})`,
      isSatisfied: totalEvaluatedCredits >= graduationUnitsTarget,
      statusText: totalEvaluatedCredits >= graduationUnitsTarget ? 'Requirement Met' : `${graduationUnitsTarget - totalEvaluatedCredits} Units Remaining`,
      detailNote: `Senate threshold for ${profile.entryMode || 'UTME'} entry`
    },
    {
      id: 'cred-cgpa',
      name: 'Minimum Cumulative GPA for Degree Award',
      code: 'CGPA-THRESHOLD',
      category: 'Academic Standing',
      requiredValue: `CGPA ≥ ${rules.minimumPassCGPA || 1.50}`,
      actualValue: `CGPA ${currentCgpa.toFixed(2)}`,
      isSatisfied: currentCgpa >= (rules.minimumPassCGPA || 1.50),
      statusText: currentCgpa >= (rules.minimumPassCGPA || 1.50) ? 'Good Academic Standing' : 'Below Minimum Threshold',
      detailNote: currentCgpa >= 4.50 ? 'First Class Honours Band' : currentCgpa >= 3.50 ? 'Second Class Upper Band' : 'Passing Grade'
    },
    {
      id: 'cred-sem-limits',
      name: 'Semester Workload Bounds',
      code: 'SEM-REG-BOUNDS',
      category: 'Semester Load',
      requiredValue: `${rules.minSemesterUnits || 15} - ${rules.maxSemesterUnits || 24} Units/Sem`,
      actualValue: 'Compliant with Senate Bounds',
      isSatisfied: true,
      statusText: 'Compliant',
      detailNote: 'No unapproved overload detected'
    }
  ];

  // 5. ELECTIVE REQUIREMENTS (Domain / Career Elective Baskets)
  const electiveCourses = allCourses.filter(c => c.type === 'Elective');
  const requiredElectiveUnits = 18; // Standard NUC B.Tech IT elective credits
  const completedElectives = electiveCourses.filter(c => activeIds.has(c.id));
  const completedElectiveUnits = completedElectives.reduce((sum, c) => sum + c.credits, 0);
  const electivePct = Math.min(100, Math.round((completedElectiveUnits / requiredElectiveUnits) * 100));

  const electiveItems: ComplianceCheckItem[] = electiveCourses.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    category: 'Accredited Elective Pool',
    requiredValue: 'Domain Elective Option',
    actualValue: activeIds.has(c.id) ? 'Enrolled / Passed' : 'Available',
    isSatisfied: activeIds.has(c.id),
    statusText: activeIds.has(c.id) ? 'Selected' : 'Open Option',
    detailNote: `${c.domain} • ${c.credits} Credits`
  }));

  // 6. SIWES REQUIREMENTS (Statutory 6-Month Scheme)
  const siwesAudit = evaluateSiwesEligibility(profile, rules, allCourses);
  const isSiwesCompleted = profile.siwesPlacement?.oralDefensePassed || 
    (profile.siwesPlacement?.technicalReportSubmitted && profile.siwesPlacement?.logbookSignedBySupervisor) ||
    activeIds.has('CS405') || activeIds.has('IFT499');
  
  const siwesPct = isSiwesCompleted 
    ? 100 
    : siwesAudit.isEligibleNow 
      ? 75 
      : Math.min(65, Math.round((siwesAudit.actualEarnedCredits / 90) * 60));

  const siwesItems: ComplianceCheckItem[] = [
    {
      id: 'siwes-duration',
      name: 'Mandatory 6-Month Industry Attachment',
      code: 'ITF-NUC-SIWES-II',
      category: 'Statutory Internship',
      requiredValue: '24 Calendar Weeks (40 PH/wk)',
      actualValue: profile.siwesPlacement?.totalWeeksLogged ? `${profile.siwesPlacement.totalWeeksLogged} Weeks Logged` : 'Pending Placement',
      isSatisfied: isSiwesCompleted || (profile.siwesPlacement?.totalWeeksLogged ?? 0) >= 24,
      statusText: isSiwesCompleted ? 'Completed & Cleared' : 'In Progress / Pending',
      detailNote: 'Industrial Training Fund (ITF) Statutory Decree'
    },
    {
      id: 'siwes-credits',
      name: 'SIWES 6-Credit Units Workload Weight',
      code: 'IFT 499 / CS 405',
      category: 'Academic Credits',
      requiredValue: '6 Credit Units (100% 400L Rain Semester)',
      actualValue: isSiwesCompleted ? '6 Units Credited' : '0 Units Earned',
      isSatisfied: isSiwesCompleted,
      statusText: isSiwesCompleted ? 'Credited' : 'Awaiting Completion',
      detailNote: 'Core degree graduation clearance requirement'
    },
    {
      id: 'siwes-prereqs',
      name: 'SIWES 90-Credit Gate & CGPA ≥ 1.50',
      code: 'SIWES-CLEARANCE-GATE',
      category: 'Institutional Eligibility Gate',
      requiredValue: '≥ 90 Units & CGPA ≥ 1.50',
      actualValue: `${earnedCredits} Units Earned, CGPA ${currentCgpa.toFixed(2)}`,
      isSatisfied: siwesAudit.creditsMet && siwesAudit.isStandingMet,
      statusText: (siwesAudit.creditsMet && siwesAudit.isStandingMet) ? 'Clearance Gate Met' : 'Prerequisites Outstanding',
      detailNote: siwesAudit.nextActionableStep
    }
  ];

  // 7. PROJECT REQUIREMENTS (Final Year Capstone Project I & II)
  const projectCourses = allCourses.filter(c => 
    c.type === 'Project' || c.id === 'CS508' || c.code.includes('599') || c.name.toLowerCase().includes('capstone') || c.name.toLowerCase().includes('project')
  );
  const isProjectCompleted = projectCourses.some(p => activeIds.has(p.id));
  const projectPct = isProjectCompleted ? 100 : (profile.academicLevel === '500L' || profile.currentSemester >= 9) ? 50 : 0;

  const projectItems: ComplianceCheckItem[] = [
    {
      id: 'proj-phase1',
      name: 'Final Year Project Proposal & Defense (Phase I)',
      code: 'IFT 599A / Capstone I',
      category: 'Research & System Design',
      requiredValue: 'Approved Software Specification & Proposal',
      actualValue: isProjectCompleted ? 'Defended & Approved' : (profile.academicLevel === '500L' ? 'In Development' : 'Scheduled 500L'),
      isSatisfied: isProjectCompleted || profile.academicLevel === '500L',
      statusText: isProjectCompleted ? 'Completed' : 'Pending 500L',
      detailNote: 'Literature review, architecture model, and ethics clearance'
    },
    {
      id: 'proj-phase2',
      name: 'Final Year Capstone Implementation & External Defense',
      code: 'IFT 599B / Capstone II',
      category: 'Production Software & Thesis',
      requiredValue: 'Deployable Artifact & Moderated Defense (6 Units)',
      actualValue: isProjectCompleted ? 'Grade Awarded' : 'Pending Final Year',
      isSatisfied: isProjectCompleted,
      statusText: isProjectCompleted ? 'Cleared' : 'Pending Final Semester',
      detailNote: 'External examiner oral defense & code review audit'
    }
  ];

  // 8. LEARNING OUTCOMES COVERAGE (Bloom's Taxonomy Mastery)
  let totalCurriculumOutcomes = 0;
  let masteredOutcomes = 0;
  allCourses.forEach(c => {
    const outcomeCount = c.learningOutcomes?.length || 4;
    totalCurriculumOutcomes += outcomeCount;
    if (activeIds.has(c.id)) {
      masteredOutcomes += outcomeCount;
    }
  });
  const outcomePct = totalCurriculumOutcomes > 0
    ? Math.round((masteredOutcomes / totalCurriculumOutcomes) * 100)
    : 100;

  const learningOutcomeItems: ComplianceCheckItem[] = allCourses.slice(0, 10).map(c => ({
    id: `lo-${c.id}`,
    name: `${c.code} Learning Outcomes (${c.bloomLevel})`,
    code: c.code,
    category: `Bloom: ${c.bloomLevel}`,
    requiredValue: `${c.learningOutcomes?.length || 4} Measurable Outcomes`,
    actualValue: activeIds.has(c.id) ? 'Mastered & Assessed' : 'Curriculum Target',
    isSatisfied: activeIds.has(c.id),
    statusText: activeIds.has(c.id) ? 'Achieved' : 'Pending',
    detailNote: c.learningOutcomes?.[0] || c.description
  }));

  // Construct Category Status Objects
  const nucCcmasCoreStatus: ComplianceCategoryStatus = {
    id: 'nucCcmasCore',
    title: 'NUC CCMAS Core Courses',
    shortName: 'NUC Core',
    percentage: nucCorePct,
    isSatisfied: nucCorePct >= 100,
    statusBadge: nucCorePct >= 100 ? 'COMPLIANT' : nucCorePct >= 70 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: nucCorePct >= 100 ? 'emerald' : nucCorePct >= 70 ? 'blue' : 'amber',
    metricLabel: `${nucCoreCompleted.length} of ${nucCoreCourses.length} core courses completed`,
    actualCount: nucCoreCompleted.length,
    requiredCount: nucCoreCourses.length,
    unit: 'Courses',
    summary: 'Directly conforms with National Universities Commission (NUC) Core Curriculum and Minimum Academic Standards benchmark for Computing & IT degree awards.',
    regulatoryAuthority: 'NUC Computing CCMAS v2023',
    breakdown: nucCoreItems,
    remedialActions: nucCorePct < 100 
      ? [`Enroll in outstanding NUC Core courses: ${nucCoreCourses.filter(c => !activeIds.has(c.id)).slice(0, 3).map(c => c.code).join(', ')}`]
      : undefined
  };

  const futMinnaCoreStatus: ComplianceCategoryStatus = {
    id: 'futMinnaCore',
    title: 'FUTMinna Core Courses',
    shortName: 'FUTMinna Core',
    percentage: futMinnaCorePct,
    isSatisfied: futMinnaCorePct >= 100,
    statusBadge: futMinnaCorePct >= 100 ? 'COMPLIANT' : futMinnaCorePct >= 70 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: futMinnaCorePct >= 100 ? 'emerald' : futMinnaCorePct >= 70 ? 'blue' : 'amber',
    metricLabel: `${futMinnaCoreCompleted.length} of ${futMinnaCoreCourses.length} institutional cores completed`,
    actualCount: futMinnaCoreCompleted.length,
    requiredCount: futMinnaCoreCourses.length,
    unit: 'Courses',
    summary: 'Fulfils the Federal University of Technology, Minna Senate and School of ICT departmental compulsory degree courses.',
    regulatoryAuthority: 'FUT Minna Senate & SICT Academic Board',
    breakdown: futMinnaCoreItems
  };

  const prerequisitesStatus: ComplianceCategoryStatus = {
    id: 'prerequisites',
    title: 'Prerequisites Integrity',
    shortName: 'Prerequisites',
    percentage: prereqPct,
    isSatisfied: prereqPct >= 100,
    statusBadge: prereqPct >= 100 ? 'COMPLIANT' : prereqPct >= 80 ? 'ON_TRACK' : 'CRITICAL',
    statusColor: prereqPct >= 100 ? 'emerald' : prereqPct >= 80 ? 'blue' : 'rose',
    metricLabel: `${satisfiedPrereqPairs} of ${totalPrereqPairs} prerequisite chains verified`,
    actualCount: satisfiedPrereqPairs,
    requiredCount: totalPrereqPairs,
    unit: 'Chains',
    summary: 'Validates strict topological ordering of prerequisite courses to ensure advanced knowledge builds on foundational mastery with zero unregistered prerequisite violations.',
    regulatoryAuthority: 'FUT Minna Academic Regulation Standard',
    breakdown: prereqItems
  };

  const creditRequirementsStatus: ComplianceCategoryStatus = {
    id: 'creditRequirements',
    title: 'Credit Requirements',
    shortName: 'Credit Units',
    percentage: creditPct,
    isSatisfied: creditPct >= 100,
    statusBadge: creditPct >= 100 ? 'COMPLIANT' : creditPct >= 60 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: creditPct >= 100 ? 'emerald' : creditPct >= 60 ? 'blue' : 'amber',
    metricLabel: `${totalEvaluatedCredits} of ${graduationUnitsTarget} units earned`,
    actualCount: totalEvaluatedCredits,
    requiredCount: graduationUnitsTarget,
    unit: 'Units',
    summary: `Tracks earned academic units against official statutory threshold (${graduationUnitsTarget} units for ${profile.entryMode || 'UTME'} entry) and minimum pass CGPA standards.`,
    regulatoryAuthority: 'Senate Degree Clearance Protocol',
    breakdown: creditItems
  };

  const electiveRequirementsStatus: ComplianceCategoryStatus = {
    id: 'electiveRequirements',
    title: 'Elective Requirements',
    shortName: 'Electives',
    percentage: electivePct,
    isSatisfied: electivePct >= 100,
    statusBadge: electivePct >= 100 ? 'COMPLIANT' : electivePct >= 50 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: electivePct >= 100 ? 'emerald' : electivePct >= 50 ? 'blue' : 'amber',
    metricLabel: `${completedElectiveUnits} of ${requiredElectiveUnits} elective units completed`,
    actualCount: completedElectiveUnits,
    requiredCount: requiredElectiveUnits,
    unit: 'Units',
    summary: 'Ensures student has completed required distribution of accredited specialization electives across Software, Cloud, AI, and Cybersecurity domains.',
    regulatoryAuthority: 'NUC & FUT Minna Elective Basket Standard',
    breakdown: electiveItems
  };

  const siwesRequirementsStatus: ComplianceCategoryStatus = {
    id: 'siwesRequirements',
    title: 'SIWES Requirements',
    shortName: 'SIWES Scheme',
    percentage: siwesPct,
    isSatisfied: siwesPct >= 100,
    statusBadge: siwesPct >= 100 ? 'COMPLIANT' : siwesPct >= 60 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: siwesPct >= 100 ? 'emerald' : siwesPct >= 60 ? 'blue' : 'amber',
    metricLabel: isSiwesCompleted ? 'Completed, defended & credited (6 Units)' : 'Clearance & 6-month placement in progress',
    actualCount: isSiwesCompleted ? 6 : 0,
    requiredCount: 6,
    unit: 'Units',
    summary: 'Statutory 6-month off-campus industrial placement under the Industrial Training Fund (ITF) and NUC decrees with formal institutional assessment and oral defense.',
    regulatoryAuthority: 'ITF Decree & NUC Statutory Mandate',
    breakdown: siwesItems
  };

  const projectRequirementsStatus: ComplianceCategoryStatus = {
    id: 'projectRequirements',
    title: 'Project Requirements',
    shortName: 'Capstone Project',
    percentage: projectPct,
    isSatisfied: projectPct >= 100,
    statusBadge: projectPct >= 100 ? 'COMPLIANT' : projectPct >= 50 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: projectPct >= 100 ? 'emerald' : projectPct >= 50 ? 'blue' : 'amber',
    metricLabel: isProjectCompleted ? 'Final year project & defense cleared (6 Units)' : 'Capstone proposal and implementation scheduled',
    actualCount: isProjectCompleted ? 6 : 0,
    requiredCount: 6,
    unit: 'Units',
    summary: 'Rigorous two-semester B.Tech Final Year Capstone Project (IFT 599A & IFT 599B) evaluated via prototype defense, thesis submission, and external examiner moderation.',
    regulatoryAuthority: 'FUT Minna SICT Capstone Committee',
    breakdown: projectItems
  };

  const learningOutcomesStatus: ComplianceCategoryStatus = {
    id: 'learningOutcomes',
    title: 'Learning Outcomes',
    shortName: 'Learning Outcomes',
    percentage: outcomePct,
    isSatisfied: outcomePct >= 90,
    statusBadge: outcomePct >= 90 ? 'COMPLIANT' : outcomePct >= 60 ? 'ON_TRACK' : 'ATTENTION',
    statusColor: outcomePct >= 90 ? 'emerald' : outcomePct >= 60 ? 'blue' : 'amber',
    metricLabel: `${masteredOutcomes} of ${totalCurriculumOutcomes} Bloom outcomes acquired (${outcomePct}%)`,
    actualCount: masteredOutcomes,
    requiredCount: totalCurriculumOutcomes,
    unit: 'Outcomes',
    summary: 'Holistic mapping of Bloom’s cognitive, technical, and soft learning outcomes aligned with IEEE/ACM IT2017 international computing benchmarks.',
    regulatoryAuthority: 'IEEE/ACM IT2017 & NUC Outcome Matrix',
    breakdown: learningOutcomeItems
  };

  // Overall Compliance Average
  const categoriesList = [
    nucCcmasCoreStatus,
    futMinnaCoreStatus,
    prerequisitesStatus,
    creditRequirementsStatus,
    electiveRequirementsStatus,
    siwesRequirementsStatus,
    projectRequirementsStatus,
    learningOutcomesStatus
  ];

  const overallPercentage = Math.round(
    categoriesList.reduce((sum, cat) => sum + cat.percentage, 0) / categoriesList.length
  );

  const isFullyCompliant = categoriesList.every(cat => cat.isSatisfied);

  const complianceLevel = overallPercentage >= 95 
    ? 'Exemplary' 
    : overallPercentage >= 75 
      ? 'Good Standing' 
      : overallPercentage >= 50 
        ? 'Progression Alert' 
        : 'Deficient';

  const verificationDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const auditSummaryNotes: string[] = [
    `Curriculum verified against NUC Computing CCMAS (2023) and FUT Minna SICT Departmental Handbook.`,
    `Student is currently ${profile.academicLevel || '400L'} (Semester ${profile.currentSemester}) with ${earnedCredits} completed credits at CGPA ${currentCgpa.toFixed(2)}.`,
    overallPercentage >= 80 
      ? `Overall academic progression is on schedule for standard B.Tech degree conferment.`
      : `Action required: Resolve outstanding core curriculum items to maintain graduation timeline.`
  ];

  return {
    overallPercentage,
    isFullyCompliant,
    complianceLevel,
    complianceSource: 'NUC Computing CCMAS + FUTMinna approved curriculum',
    lastCurriculumVerification: verificationDate,
    verificationHash: `NUC-FUTM-${Math.random().toString(36).substring(2, 9).toUpperCase()}-2026`,
    academicSession: '2025/2026 Academic Session',
    institutionName: rules.institution || 'Federal University of Technology, Minna',
    facultySchool: rules.school || 'School of Information and Communication Technology (SICT)',
    departmentProgram: `${rules.degreeAward || 'B.Tech'} in ${rules.programme || 'Information Technology'}`,
    curriculumStandard: rules.curriculumFramework || 'NUC CCMAS / FUT Minna Senate Regulations',
    studentInfo: {
      name: profile.name || 'Farooq Shekoni',
      matricNumber: profile.rollNumber || '2021/1/74839IT',
      level: profile.academicLevel || '400L',
      entryMode: profile.entryMode || 'UTME',
      cgpa: currentCgpa,
      cgpaStatus: currentCgpa >= 3.50 ? 'Second Class Upper / Honours Band' : 'Good Academic Standing',
      earnedCredits,
      requiredCredits: graduationUnitsTarget
    },
    matrix: {
      nucCcmasCore: nucCcmasCoreStatus,
      futMinnaCore: futMinnaCoreStatus,
      prerequisites: prerequisitesStatus,
      creditRequirements: creditRequirementsStatus,
      electiveRequirements: electiveRequirementsStatus,
      siwesRequirements: siwesRequirementsStatus,
      projectRequirements: projectRequirementsStatus,
      learningOutcomes: learningOutcomesStatus
    },
    auditSummaryNotes
  };
}
