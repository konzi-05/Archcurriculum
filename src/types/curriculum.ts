export type CourseType = 'Core' | 'Elective' | 'Lab' | 'Project' | 'Humanities';

export type AcademicDomain = 
  | 'Math & Foundational CS'
  | 'Software Engineering'
  | 'AI & Data Science'
  | 'Cloud & Systems'
  | 'Cybersecurity & Networks'
  | 'Hardware & Embedded';

export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export type AcademicLevel = '100L' | '200L' | '300L' | '400L' | '500L';

export type RequirementClassification = 'UNIVERSITY_MANDATORY' | 'CAREER_PATHWAY_RECOMMENDED' | 'DUAL_VALUE';

export interface UniversityRequirementDetails {
  isCompulsory: boolean;
  category: 'General Studies (GST)' | 'Basic Sciences & Math' | 'Departmental Compulsory Core' | 'SIWES Industrial Training' | 'Final Year Capstone Project' | 'Accredited Elective Pool';
  prescribedBy: string; // e.g., 'NUC CCMAS & FUT Minna Senate'
  graduationClearanceCritical: boolean;
  rationale: string;
}

export interface IndustryRecommendationDetails {
  isCareerRecommended: boolean;
  relevanceScore: number; // 0 to 100
  targetTracks: string[];
  careerDemandLevel: 'Critical' | 'High' | 'Moderate';
  alignedJobRoles: string[];
  inDemandSkillsTaught: string[];
  employabilityRationale: string;
}

/**
 * NUC CCMAS Competencies breakdown:
 * - Cognitive: Theoretical principles, formal modeling, architecture, logic, algorithmic rigor
 * - Technical: Hands-on implementation, tool proficiency, lab debugging, systems integration
 * - Soft: Professional communication, ethics, teamwork, critical inquiry, project management
 */
export interface CourseCompetencies {
  cognitive: string[];
  technical: string[];
  soft: string[];
}

/**
 * NUC CCMAS Multi-Dimensional Skills structure:
 * - Knowledge: Foundational domain knowledge and theoretical constructs
 * - Practical: Hard actionable technical skills and implementation techniques
 * - Soft: Interpersonal, behavioral, and communication skills
 * - Tools: Specific industry frameworks, platforms, and programming tools
 */
export interface CourseSkills {
  knowledge: string[];
  practical: string[];
  soft: string[];
  tools: string[];
}

/**
 * NUC CCMAS Compliant Course Model:
 * COURSE
 *  ├── Course Code
 *  ├── Course Title
 *  ├── Credit Units
 *  ├── Level
 *  ├── Semester
 *  ├── Core/Elective
 *  ├── Prerequisites
 *  ├── Lecture Hours (LH)
 *  ├── Practical Hours (PH)
 *  ├── Learning Outcomes (Bloom's-aligned measurable statements)
 *  ├── Competencies (Cognitive, Technical, Soft)
 *  └── Skills (Knowledge, Practical, Soft, Tools)
 */
export interface Course {
  id: string;
  code: string;
  name: string; // Course Title
  title?: string; // Explicit alias for Course Title
  credits: number; // Credit Units
  academicLevel?: AcademicLevel; // Level: 100L - 500L
  level?: AcademicLevel; // Explicit alias for Level
  semester: number; // 1 to 10
  type: CourseType; // Core/Elective
  courseType?: CourseType; // Explicit alias for Core/Elective
  domain: AcademicDomain;
  prerequisites: string[]; // Prerequisite Course IDs / Codes
  corequisites?: string[];
  lectureHours: number; // LH: Lecture Contact Hours (e.g. 2, 3 hrs/wk)
  practicalHours: number; // PH: Practical / Laboratory Hands-on Hours (e.g. 0, 2, 3 hrs/wk)
  learningOutcomes: string[]; // Explicit NUC CCMAS Learning Outcomes ("Students will be able to...")
  competencies: CourseCompetencies; // Cognitive, Technical, Soft
  skills: CourseSkills; // Knowledge, Practical, Soft, Tools
  skillsAcquired: string[]; // Flat list of primary skills for search/filtering
  difficulty: number; // 1 to 5 scale
  workloadHours: number; // estimated hours per week (LH + PH + independent study)
  syllabus: string[]; // Topic outline units
  description: string;
  bloomLevel: BloomLevel;
  // Accreditation & Curriculum Alignment Standards:
  nucCcmasCode?: string;      // Nigerian Universities Commission CCMAS Code (e.g., CCMAS-COS101, CCMAS-IFT301)
  futMinnaCode?: string;      // Federal University of Technology, Minna Dept. Course Code (e.g., IFT 111, IFT 311)
  ieeeAcmStandard?: string;   // IEEE/ACM IT2017 & CS2023 Curricula guideline alignment
  acmKnowledgeArea?: string;  // ACM IT2017 Body of Knowledge area (e.g., Information Management, Networking, Security)
  // Dual-Lens Metadata
  universityRequirement?: UniversityRequirementDetails;
  industryRecommendation?: IndustryRecommendationDetails;
  // SIWES Statutory Industrial Attachment Scheme Metadata
  isSiwesCourse?: boolean;
  siwesStructure?: SiwesStructure;
  // Timetable & Scheduling
  scheduleSlots?: CourseTimeSlot[];
}

export type TimetableDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface CourseTimeSlot {
  id: string;
  day: TimetableDay;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  slotLabel: string; // e.g. "09:00 - 10:00"
  type: 'Lecture' | 'Lab' | 'Tutorial';
  venue?: string;
}

export type ConflictSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type ConflictType = 
  | 'TIME_SLOT_CLASH' 
  | 'CROSS_SEMESTER_MISMATCH' 
  | 'MULTI_SEMESTER_SPREAD'
  | 'PREREQUISITE_CO_ENROLLMENT'
  | 'DAILY_LAB_OVERLOAD';

export interface ScheduleConflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  title: string;
  description: string;
  courseIds: string[];
  courseCodes: string[];
  day?: TimetableDay;
  timeSlot?: string;
  venue?: string;
  semesterDiscrepancy?: {
    activeSemester: number;
    courseSemesters: Record<string, number>;
  };
  resolutionTip: string;
}

export interface ScheduleAuditReport {
  hasConflicts: boolean;
  totalConflicts: number;
  criticalCount: number;
  warningCount: number;
  conflicts: ScheduleConflict[];
  timeSlotClashes: ScheduleConflict[];
  semesterMismatches: ScheduleConflict[];
  prereqClashes: ScheduleConflict[];
  clashedCourseIds: string[];
  dayWorkloads: Record<TimetableDay, {
    contactHours: number;
    lectureCount: number;
    labCount: number;
    hasLabOverload: boolean;
  }>;
}

export interface CompetencyRequirement {
  name: string;
  category: 'cognitive' | 'technical' | 'soft';
  targetLevel: number; // 0-100
  weight: number;      // 0-1 relative importance
  description: string;
}

export interface SkillRequirement {
  name: string;
  category: 'knowledge' | 'practical' | 'soft' | 'tools';
  minProficiency: number; // 0-100
  benchmark: string;
  industryDemand: 'Critical' | 'High' | 'Moderate';
}

/**
 * CAREER SKILL MAP:
 * Bridges NUC CCMAS Course Competencies, Learning Outcomes, Practical/Lecture hours,
 * and Multi-Dimensional Skills directly to industry career roles.
 */
export interface CareerSkillMap {
  trackId: string;
  trackTitle: string;
  targetRole: string;
  description: string;
  requiredCompetencies: {
    cognitive: CompetencyRequirement[];
    technical: CompetencyRequirement[];
    soft: CompetencyRequirement[];
  };
  requiredSkills: {
    knowledge: SkillRequirement[];
    practical: SkillRequirement[];
    soft: SkillRequirement[];
    tools: SkillRequirement[];
  };
  targetPracticalHoursTotal: number;
  targetLectureHoursTotal: number;
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  keySkills: string[];
  recommendedElectiveIds: string[];
  iconName: string;
  averageSalaryUSD: string;
  industryDemand: 'Critical' | 'High' | 'Moderate';
  acmSpecializationArea?: string; // ACM/IEEE Curricula Track
  skillMap?: CareerSkillMap;
}

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export type SiwesPhaseStatus = 
  | 'NOT_YET_ELIGIBLE'
  | 'ELIGIBLE_AWAITING_PLACEMENT'
  | 'PLACEMENT_CONFIRMED'
  | 'ATTACHMENT_IN_PROGRESS'
  | 'INSTITUTIONAL_SUPERVISION_COMPLETED'
  | 'TECHNICAL_REPORT_SUBMITTED'
  | 'ORAL_DEFENSE_CLEARED'
  | 'SENATE_CREDITED';

export interface SiwesPrerequisiteItem {
  id: string;
  code: string;
  name: string;
  isCompleted: boolean;
  grade?: Grade;
  isCritical: boolean;
}

export interface SiwesAcademicStandingRequirement {
  minCgpa: number;                       // e.g. 1.50 or 2.00 on a 5.0 scale
  minEarnedCredits: number;               // e.g. 90 credit units earned
  standingCategory: 'Good Academic Standing';
  disallowProbation: boolean;
  policyDescription: string;
}

export interface SiwesPlacementDetails {
  companyName: string;
  industrySector: string;
  locationCity: string;
  workArrangement: 'On-Site' | 'Hybrid' | 'Remote';
  roleTitle: string;
  industrySupervisorName: string;
  industrySupervisorPhone?: string;
  institutionalAssessorName?: string;
  itfForm8Submitted: boolean;
  acceptanceLetterApproved: boolean;
  totalWeeksLogged: number;               // 0 to 24 weeks
  logbookSignedBySupervisor: boolean;
  institutionalVisitConducted: boolean;
  technicalReportSubmitted: boolean;
  technicalReportPageCount?: number;
  oralDefensePassed: boolean;
  defenseGradeAwarded?: Grade;
  defenseDate?: string;
  commencementDate?: string;
  completionDate?: string;
}

export interface SiwesStructure {
  isRequired: boolean;                          // ├── Required? (Statutory NUC / ITF Mandate)
  eligibleLevel: AcademicLevel;                 // ├── Eligible Level (400L)
  eligibleSemester: number;                     // 8 (Rain Semester)
  prerequisites: string[];                      // ├── Prerequisites (Core courses & Unit threshold)
  prerequisiteCourseList?: SiwesPrerequisiteItem[];
  duration: string;                             // ├── Duration ("6 Months / 24 Weeks Continuous Attachment")
  durationWeeks: number;                        // 24
  creditUnits: number;                          // ├── Credit Units (6 Units)
  academicStandingRequirement: SiwesAcademicStandingRequirement; // ├── Academic Standing Requirement
  completionStatus: SiwesPhaseStatus;           // └── Completion Status
  regulatoryBodies: string[];                   // ITF, NUC, University Directorate
  statutoryRationale: string;
  placementDetails?: SiwesPlacementDetails;
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  institution: string;
  department?: string;
  faculty?: string;
  program?: string;
  entryMode?: 'UTME' | 'Direct_Entry';
  currentSemester: number;
  academicLevel?: AcademicLevel;
  targetCareerTrackId: string;
  completedCourseIds: string[];
  grades: Record<string, Grade>; // courseId -> Grade
  skillLevels: Record<string, number>; // skill -> 1 to 100 score
  competencyLevels?: Record<string, number>; // competency -> 1 to 100 score
  weeklyStudyHoursBudget: number; // e.g. 25-45 hours
  preferredPace: 'Light' | 'Balanced' | 'Intensive';
  interests: string[];
  siwesPlacement?: SiwesPlacementDetails;
}

/**
 * Programme-Configurable Academic Regulations & Unit Thresholds
 * Allows institution, school, programme, minimum/maximum semester units,
 * and graduation requirements to be calibrated per official handbook.
 */
export interface AcademicProgrammeRules {
  institution: string;               // e.g. "Federal University of Technology, Minna"
  institutionShortCode: string;      // e.g. "FUTMinna"
  school: string;                    // e.g. "School of Information and Communication Technology"
  schoolShortCode: string;           // e.g. "SICT"
  programme: string;                 // e.g. "Information Technology"
  programmeCode: string;             // e.g. "B.Tech IT"
  degreeAward: string;               // e.g. "Bachelor of Technology (B.Tech)"
  curriculumFramework: string;       // e.g. "NUC CCMAS / Departmental Regulations"
  minSemesterUnits: number;          // Official programme minimum units per semester (e.g. 15)
  maxSemesterUnits: number;          // Official programme maximum units per semester (e.g. 24)
  graduationRequirementUnits: number;// Official graduation units for 4/5-year UTME entry (e.g. 150)
  directEntryGraduationUnits: number;// Official graduation units for Direct Entry candidates (e.g. 120)
  minimumPassCGPA: number;           // e.g. 1.00 or 1.50
  allowDeanOverload: boolean;        // Whether overload beyond max is allowed with Dean waiver
  maxOverloadUnits: number;          // e.g. 26 or 28 units
  handbookSourceNote: string;        // e.g. "SICT B.Tech IT Handbook v2023.1"
  isOfficialHandbookConfirmed: boolean; // Flag if student/staff has verified handbook value
  isCustomConfigured: boolean;       // Flag if custom edited by user
  siwesRegulations?: {
    isRequired: boolean;
    eligibleLevel: AcademicLevel;
    durationMonths: number;
    durationWeeks: number;
    creditUnits: number;
    minCgpaRequired: number;
    minUnitsCompleted: number;
    regulatoryBody: string;
  };
}

export interface SemanticEmbeddingVector {
  vector: number[];
  dimensions: number;
  domainWeights: Record<string, number>;
  latentConcepts: string[];
}

export interface SemanticMatchDetails {
  cosineSimilarity: number; // 0 to 100%
  euclideanDistance: number;
  semanticOverlapConcepts: string[];
  embeddingModel: string;
  tfidfScore: number; // For comparative analysis in FYP
  tfidfVsEmbeddingDelta: number;
  dimensionBreakdown: Array<{
    dimension: string;
    studentTrackWeight: number;
    courseWeight: number;
    alignment: number;
  }>;
}

export interface RecommendationBreakdown {
  prerequisiteScore: number; // 0 to 100
  careerMatchScore: number;  // 0 to 100
  competencyScore: number;   // 0 to 100 (Cognitive, Technical, Soft alignment)
  learningOutcomesScore?: number; // 0 to 100 (Relevance of Bloom learning outcomes)
  learningOutcomesMatch?: number;
  practicalSkillScore?: number; // 0 to 100 (Hands-on practical skills & tools gain)
  practicalSkillBoost?: number;
  softSkillsScore?: number;   // 0 to 100 (Professional & soft skills development)
  skillGapScore: number;     // 0 to 100
  workloadBalanceScore: number; // 0 to 100
  difficultyFitScore: number; // 0 to 100
  hoursRatioScore?: number;   // 0 to 100 (Lecture LH vs Practical PH balance)
  nucCcmasAlignmentScore?: number;
  semanticEmbeddingScore?: number; // 0 to 100
}

export interface RecommendedCourseResult {
  course: Course;
  matchScore: number; // 0 to 100 overall
  breakdown: RecommendationBreakdown;
  matchReasons: string[];
  warningFlags: string[];
  prerequisitesMet: boolean;
  missingPrerequisites: Course[];
  semanticDetails?: SemanticMatchDetails;
  // Dual-Lens Distinction
  classification: RequirementClassification;
  universityRequirementSummary: string;
  industryRecommendationSummary: string;
  isUniversityMandatory: boolean;
  isCareerRecommended: boolean;
  // Career Skill Map Impact
  targetedCompetencies: string[];
  targetedPracticalSkills: string[];
  targetedTools: string[];
  targetedSoftSkills: string[];
}

export interface SkillGapItem {
  skill: string;
  currentLevel: number; // 0 to 100
  requiredLevel: number; // 0 to 100
  gap: number;
  category?: 'knowledge' | 'practical' | 'soft' | 'tools' | 'competency';
  coveredByRecommendedCourses: string[]; // course names
}

export interface CompetencyGapItem {
  competency: string;
  category: 'cognitive' | 'technical' | 'soft';
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  impartingCourses: string[];
}

export interface AiInsightResponse {
  summary: string;
  careerReadinessIndex: number; // 0 to 100
  semesterStrategy: string;
  topSkillGaps: string[];
  actionableSteps: string[];
  suggestedCertifications: string[];
  industryTrends: string;
}

export interface SemesterGoal {
  id: string;
  semester: number;
  title: string;
  completed: boolean;
  category: 'Academic' | 'Certification' | 'Project' | 'Career';
}

export type CustomCourseSemesterMap = Record<string, number>;

export const GRADE_POINTS: Record<Grade, number> = {
  'A+': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'F': 0
};

export interface PlanSemesterPayload {
  selectedCourseIds: string[];
  studentProfile: StudentProfile;
}
