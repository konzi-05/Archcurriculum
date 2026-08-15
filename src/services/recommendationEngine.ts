import { Course, StudentProfile, RecommendedCourseResult, SkillGapItem, RecommendationBreakdown, RequirementClassification } from '../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../data/btechItCurriculum';
import { CAREER_SKILL_MAPS } from '../data/careerSkillMaps';
import { calculateSemanticMatchDetails } from './semanticEmbeddings';

/**
 * Calculates topological prerequisite status for a course.
 */
export function validatePrerequisites(course: Course, completedCourseIds: string[]): {
  prerequisitesMet: boolean;
  missingPrerequisites: Course[];
  prerequisiteScore: number;
} {
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return { prerequisitesMet: true, missingPrerequisites: [], prerequisiteScore: 100 };
  }

  const completedSet = new Set(completedCourseIds);
  const missingPrerequisiteIds = course.prerequisites.filter(prereqId => !completedSet.has(prereqId));
  const missingPrerequisites = BTECH_IT_COURSES.filter(c => missingPrerequisiteIds.includes(c.id));

  const fulfilledCount = course.prerequisites.length - missingPrerequisiteIds.length;
  const prerequisiteScore = Math.round((fulfilledCount / course.prerequisites.length) * 100);

  return {
    prerequisitesMet: missingPrerequisiteIds.length === 0,
    missingPrerequisites,
    prerequisiteScore
  };
}

/**
 * Calculates multi-dimensional skill gap matrix between student profile and target career skill map.
 */
export function calculateSkillGapMatrix(profile: StudentProfile): SkillGapItem[] {
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];
  const skillMap = CAREER_SKILL_MAPS[profile.targetCareerTrackId] || targetTrack.skillMap;
  const items: SkillGapItem[] = [];

  // 1. Map from key skills and skillMap required skills
  const allTargetSkills = new Set<string>([...targetTrack.keySkills]);
  if (skillMap) {
    skillMap.requiredSkills.practical.forEach(s => allTargetSkills.add(s.name));
    skillMap.requiredSkills.tools.forEach(s => allTargetSkills.add(s.name));
    skillMap.requiredSkills.knowledge.forEach(s => allTargetSkills.add(s.name));
  }

  for (const skill of Array.from(allTargetSkills)) {
    const currentLevel = profile.skillLevels[skill] ?? 10; // 0 to 100 scale
    const requiredLevel = 85; // B.Tech standard proficiency target
    const gap = Math.max(0, requiredLevel - currentLevel);

    // Find courses that teach this skill
    const coveringCourses = BTECH_IT_COURSES
      .filter(c => 
        c.skillsAcquired.includes(skill) ||
        (c.skills?.practical && c.skills.practical.includes(skill)) ||
        (c.skills?.tools && c.skills.tools.includes(skill)) ||
        (c.skills?.knowledge && c.skills.knowledge.includes(skill))
      )
      .map(c => c.name);

    items.push({
      skill,
      currentLevel,
      requiredLevel,
      gap,
      coveredByRecommendedCourses: coveringCourses
    });
  }

  return items;
}

/**
 * Evaluates how strongly a course's learning outcomes and competencies
 * bridge the required skills and competencies defined in the Career Skill Map.
 */
function evaluateCareerSkillMapMatch(course: Course, profile: StudentProfile): {
  competencyScore: number;
  practicalSkillBoost: number;
  learningOutcomesMatch: number;
  matchingCompetencies: string[];
  matchingSkills: string[];
} {
  const skillMap = CAREER_SKILL_MAPS[profile.targetCareerTrackId] || CAREER_SKILL_MAPS['ai_ml_engineer'];
  if (!skillMap) {
    return {
      competencyScore: 70,
      practicalSkillBoost: Math.min(30, (course.practicalHours || 0) * 8),
      learningOutcomesMatch: 75,
      matchingCompetencies: [],
      matchingSkills: []
    };
  }

  // 1. Competency Matching
  const courseCognitive = course.competencies?.cognitive || [];
  const courseTechnical = course.competencies?.technical || [];
  const courseSoft = course.competencies?.soft || [];
  const allCourseCompetencies = [...courseCognitive, ...courseTechnical, ...courseSoft];

  const mapCognitive = skillMap.requiredCompetencies.cognitive.map(c => c.name.toLowerCase());
  const mapTechnical = skillMap.requiredCompetencies.technical.map(c => c.name.toLowerCase());
  const mapSoft = skillMap.requiredCompetencies.soft.map(c => c.name.toLowerCase());
  const allMapCompetencies = [...mapCognitive, ...mapTechnical, ...mapSoft];

  const matchedCompetencies: string[] = [];
  let competencyHits = 0;

  for (const comp of allCourseCompetencies) {
    const lower = comp.toLowerCase();
    const isDirectMatch = allMapCompetencies.some(target => target.includes(lower) || lower.includes(target));
    if (isDirectMatch) {
      competencyHits++;
      matchedCompetencies.push(comp);
    }
  }

  const competencyScore = Math.min(100, Math.round(
    competencyHits > 0 ? 60 + (competencyHits * 15) : 40
  ));

  // 2. Practical Hours and Lab Tools Boost (NUC CCMAS Practical Skill emphasis)
  const practicalHours = course.practicalHours || 0;
  const courseTools = course.skills?.tools || [];
  const targetTools = skillMap.requiredSkills.tools.map(t => t.name.toLowerCase());
  const toolHits = courseTools.filter(t => targetTools.some(target => target.includes(t.toLowerCase()) || t.toLowerCase().includes(target))).length;

  const practicalSkillBoost = Math.min(100, Math.round(
    (practicalHours * 12) + (toolHits * 18)
  ));

  // 3. Learning Outcomes Relevance (Action verbs and technical outcomes)
  const learningOutcomes = course.learningOutcomes || [];
  let outcomeRelevanceScore = 60;
  if (learningOutcomes.length >= 4) {
    outcomeRelevanceScore += 20;
  } else if (learningOutcomes.length >= 2) {
    outcomeRelevanceScore += 10;
  }

  // Check overlap of course skills with target skills
  const courseSkillsList = [
    ...(course.skills?.knowledge || []),
    ...(course.skills?.practical || []),
    ...(course.skills?.tools || []),
    ...course.skillsAcquired
  ];
  const targetSkillsList = [
    ...skillMap.requiredSkills.knowledge.map(s => s.name.toLowerCase()),
    ...skillMap.requiredSkills.practical.map(s => s.name.toLowerCase()),
    ...skillMap.requiredSkills.tools.map(s => s.name.toLowerCase())
  ];

  const matchedSkills: string[] = [];
  for (const skill of courseSkillsList) {
    if (targetSkillsList.some(target => target.includes(skill.toLowerCase()) || skill.toLowerCase().includes(target))) {
      matchedSkills.push(skill);
    }
  }

  const learningOutcomesMatch = Math.min(100, Math.round(
    outcomeRelevanceScore + (matchedSkills.length * 5)
  ));

  return {
    competencyScore,
    practicalSkillBoost,
    learningOutcomesMatch,
    matchingCompetencies: Array.from(new Set(matchedCompetencies)),
    matchingSkills: Array.from(new Set(matchedSkills))
  };
}

/**
 * Executes the full NUC CCMAS 3-Tier Recommendation Engine:
 * 1. COURSE DATA MODEL: Parses LH, PH, Learning Outcomes, Competencies, Skills
 * 2. CAREER SKILL MAP: Bridges course competencies and practical skills to industry roles
 * 3. RECOMMENDATION ENGINE: Generates dual-lens scoring (University Mandates vs Industry Pathways)
 */
export function generateCourseRecommendations(
  profile: StudentProfile,
  mode: 'semantic-embeddings' | 'legacy-tfidf' = 'semantic-embeddings'
): RecommendedCourseResult[] {
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];
  const skillGapMatrix = calculateSkillGapMatrix(profile);
  const completedSet = new Set(profile.completedCourseIds);

  // Candidate courses:
  // - Not yet completed
  // - Typically in or near current semester or Electives
  const candidateCourses = BTECH_IT_COURSES.filter(course => {
    if (completedSet.has(course.id)) return false;
    return course.type === 'Elective' || course.semester >= profile.currentSemester;
  });

  const results: RecommendedCourseResult[] = candidateCourses.map(course => {
    // 1. Prerequisite Score
    const prereqCheck = validatePrerequisites(course, profile.completedCourseIds);

    // 2. Dense Semantic Vector Embeddings
    const semanticDetails = calculateSemanticMatchDetails(course, targetTrack, profile);
    const semanticScore = semanticDetails.cosineSimilarity; // 0 to 100%

    // 3. Career Match Score (Combines direct track recommendation + semantic cosine similarity)
    let careerMatchScore = 0;
    const isDirectlyRecommended = targetTrack.recommendedElectiveIds.includes(course.id);
    if (isDirectlyRecommended) {
      careerMatchScore += 35;
    }

    if (mode === 'semantic-embeddings') {
      careerMatchScore += Math.round(semanticScore * 0.65);
    } else {
      careerMatchScore += Math.round(semanticDetails.tfidfScore * 0.65);
    }
    careerMatchScore = Math.min(100, Math.max(10, careerMatchScore));

    // 4. Career Skill Map & Competency Evaluation (Tier 2 in Hierarchy)
    const mapEval = evaluateCareerSkillMapMatch(course, profile);

    // 5. Skill Gap Reduction Score
    let skillGapScore = 0;
    let gapReductionPoints = 0;
    for (const skill of [...course.skillsAcquired, ...(course.skills?.practical || [])]) {
      const gapItem = skillGapMatrix.find(item => item.skill === skill);
      if (gapItem && gapItem.gap > 0) {
        gapReductionPoints += gapItem.gap;
      }
    }
    skillGapScore = Math.min(100, Math.round(gapReductionPoints * 1.2));

    // 6. Workload & Practical Hours Balance Score
    let workloadBalanceScore = 80;
    if (profile.preferredPace === 'Light' && (course.workloadHours > 7 || course.difficulty >= 4)) {
      workloadBalanceScore -= 25;
    } else if (profile.preferredPace === 'Intensive' && course.difficulty >= 4) {
      workloadBalanceScore += 20;
    } else if (profile.preferredPace === 'Balanced' && course.workloadHours <= 7 && course.difficulty <= 4) {
      workloadBalanceScore += 15;
    }
    workloadBalanceScore = Math.max(20, Math.min(100, workloadBalanceScore));

    // 7. Difficulty Fit Score
    const averageGradePoint = Object.values(profile.grades).length > 0 ? 80 : 70;
    const difficultyFitScore = Math.max(30, 100 - Math.abs((course.difficulty * 20) - averageGradePoint));

    // 8. NUC CCMAS Statutory Alignment Score
    const isCore = course.type === 'Core' || course.type === 'Project' || course.type === 'Humanities';
    const nucCcmasAlignmentScore = isCore ? 100 : (isDirectlyRecommended ? 88 : 75);

    const breakdown: RecommendationBreakdown = {
      prerequisiteScore: prereqCheck.prerequisiteScore,
      careerMatchScore,
      skillGapScore,
      workloadBalanceScore,
      difficultyFitScore,
      semanticEmbeddingScore: semanticScore,
      competencyScore: mapEval.competencyScore,
      practicalSkillBoost: mapEval.practicalSkillBoost,
      learningOutcomesMatch: mapEval.learningOutcomesMatch,
      nucCcmasAlignmentScore
    };

    // Overall Weighted Score synthesizing the 3-tier hierarchy:
    // Course Prerequisites (25%) + Career Track Fit (25%) + Competency Map (20%) + Practical Boost (15%) + Skill Gap / Workload (15%)
    let overallMatchScore = Math.round(
      0.25 * (prereqCheck.prerequisitesMet ? 100 : Math.max(50, prereqCheck.prerequisiteScore)) +
      0.25 * careerMatchScore +
      0.20 * mapEval.competencyScore +
      0.15 * Math.min(100, mapEval.practicalSkillBoost + 40) +
      0.10 * skillGapScore +
      0.05 * workloadBalanceScore
    );

    if (!prereqCheck.prerequisitesMet) {
      if (isDirectlyRecommended) {
        overallMatchScore = Math.max(70, Math.round(overallMatchScore * 0.88));
      } else {
        overallMatchScore = Math.round(overallMatchScore * 0.75);
      }
    } else if (isDirectlyRecommended) {
      overallMatchScore = Math.min(100, overallMatchScore + 6);
    }

    const matchingSkills = Array.from(new Set([
      ...course.skillsAcquired.filter(s => targetTrack.keySkills.includes(s)),
      ...mapEval.matchingSkills
    ]));

    // --- DUAL-LENS CLASSIFICATION & RATIONALE ---
    const isUniversityMandatory = course.type === 'Core' || course.type === 'Lab' || course.type === 'Project' || course.type === 'Humanities';
    const isCareerRecommended = isDirectlyRecommended || matchingSkills.length > 0 || semanticScore >= 65 || mapEval.competencyScore >= 75;

    let classification: RequirementClassification;
    if (isUniversityMandatory && isCareerRecommended) {
      classification = 'DUAL_VALUE';
    } else if (isUniversityMandatory) {
      classification = 'UNIVERSITY_MANDATORY';
    } else {
      classification = 'CAREER_PATHWAY_RECOMMENDED';
    }

    // University Rationale
    let universityRequirementSummary = '';
    if (course.type === 'Project') {
      universityRequirementSummary = `Mandatory Final Year Capstone Project (${course.credits} Units, 12 Lab/Project Hours) required by NUC CCMAS & FUT Minna Senate for B.Tech degree clearance.`;
    } else if (course.code.includes('499') || course.name.toLowerCase().includes('siwes') || course.name.toLowerCase().includes('industrial')) {
      universityRequirementSummary = `Compulsory 6-Month SIWES Industrial Attachment (${course.credits} Units, 40 Practical Hours) mandated for Nigerian B.Tech accreditation.`;
    } else if (course.type === 'Humanities') {
      universityRequirementSummary = `NUC CCMAS General Studies (GST) statutory requirement (${course.credits} Units, LH: ${course.lectureHours}h) for university degree clearance.`;
    } else if (isUniversityMandatory) {
      universityRequirementSummary = `Compulsory Departmental/Faculty Core (${course.credits} Units, LH: ${course.lectureHours}h, PH: ${course.practicalHours}h). Non-negotiable degree graduation requirement.`;
    } else {
      universityRequirementSummary = `Accredited Elective Pool: Fulfills NUC elective unit requirements for B.Tech specialization.`;
    }

    // Industry / Career Pathway Rationale
    let industryRecommendationSummary = '';
    if (isDirectlyRecommended) {
      industryRecommendationSummary = `Core Recommended Track Elective for ${targetTrack.title} (${targetTrack.targetRole}). Aligns with ${targetTrack.averageSalaryUSD}.`;
    } else if (matchingSkills.length > 0) {
      industryRecommendationSummary = `Industry Skill Target: Imparts ${matchingSkills.slice(0, 3).join(', ')} required in modern tech roles.`;
    } else if (mapEval.competencyScore >= 75) {
      industryRecommendationSummary = `Strong Competency Bridge (${mapEval.competencyScore}% fit with ${targetTrack.targetRole} cognitive & technical standards).`;
    } else if (semanticScore >= 75) {
      industryRecommendationSummary = `High Industry Alignment (${semanticScore}% Semantic Cosine Similarity with ${targetTrack.targetRole}).`;
    } else {
      industryRecommendationSummary = `Broadens computing domain capabilities in ${course.domain}.`;
    }

    const matchReasons: string[] = [];
    if (isUniversityMandatory) {
      matchReasons.push(`🏛️ University Mandate: Compulsory for B.Tech Degree Clearance`);
    }
    if (isDirectlyRecommended) {
      matchReasons.push(`🚀 Career Pathway: Core recommended track module for ${targetTrack.title}`);
    }
    if (mapEval.matchingCompetencies.length > 0) {
      matchReasons.push(`🧠 Competency Bridge: Develops ${mapEval.matchingCompetencies.slice(0, 2).join(' & ')}`);
    }
    if (course.practicalHours && course.practicalHours > 0) {
      matchReasons.push(`🔬 Practical Lab Hours: ${course.practicalHours} hrs/week hands-on NUC laboratory training`);
    }
    if (matchingSkills.length > 0) {
      matchReasons.push(`🎯 Industry Skills: Builds ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    if (semanticScore >= 80) {
      matchReasons.push(`💡 High Semantic Cosine Similarity (${semanticScore}%) with ${targetTrack.targetRole}`);
    }
    if (skillGapScore > 60) {
      matchReasons.push(`⚡ Directly closes identified skill gaps in your profile`);
    }
    if (prereqCheck.prerequisitesMet) {
      matchReasons.push(`✅ All prerequisites satisfied and ready for enrollment`);
    }

    const warningFlags: string[] = [];
    if (!prereqCheck.prerequisitesMet) {
      warningFlags.push(`Missing prerequisite(s): ${prereqCheck.missingPrerequisites.map(p => p.name).join(', ')}`);
    }
    if (course.difficulty >= 5 && profile.preferredPace === 'Light') {
      warningFlags.push(`High course difficulty (${course.difficulty}/5) relative to your Light study pace target`);
    }

    return {
      course,
      matchScore: Math.max(0, Math.min(100, overallMatchScore)),
      breakdown,
      matchReasons,
      warningFlags,
      prerequisitesMet: prereqCheck.prerequisitesMet,
      missingPrerequisites: prereqCheck.missingPrerequisites,
      semanticDetails,
      classification,
      universityRequirementSummary,
      industryRecommendationSummary,
      isUniversityMandatory,
      isCareerRecommended,
      targetedCompetencies: mapEval.matchingCompetencies,
      targetedPracticalSkills: mapEval.matchingSkills,
      targetedTools: course.skills?.tools || ['VS Code', 'Git/GitHub'],
      targetedSoftSkills: course.skills?.soft || ['Technical Communication', 'Teamwork']
    };
  });

  // Sort descending by matchScore
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculates dual-lens degree audit metrics:
 * 1. University Mandate Compliance (Core Units, SIWES, Capstone Project, Lecture & Practical Hours)
 * 2. Industry Career Track Readiness (Specialization Electives, Competencies, Key Skill Acquisition, Employability Index)
 */
export function calculateCurriculumDualAudit(
  profile: StudentProfile,
  selectedPlanCourseIds: string[] = []
) {
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];
  const skillMap = CAREER_SKILL_MAPS[profile.targetCareerTrackId] || targetTrack.skillMap;
  const allCourses = BTECH_IT_COURSES;
  const completedIds = new Set(profile.completedCourseIds);
  const plannedIds = new Set(selectedPlanCourseIds);

  // 1. University Mandate Analysis
  const universityCoreCourses = allCourses.filter(c => c.type === 'Core' || c.type === 'Lab' || c.type === 'Project' || c.type === 'Humanities');
  const totalUniversityCoreUnits = universityCoreCourses.reduce((sum, c) => sum + c.credits, 0); // e.g. ~120-130
  
  const completedCoreCourses = universityCoreCourses.filter(c => completedIds.has(c.id));
  const completedCoreUnits = completedCoreCourses.reduce((sum, c) => sum + c.credits, 0);
  
  const plannedCoreCourses = universityCoreCourses.filter(c => plannedIds.has(c.id) && !completedIds.has(c.id));
  const plannedCoreUnits = plannedCoreCourses.reduce((sum, c) => sum + c.credits, 0);

  const totalLectureHours = universityCoreCourses.reduce((sum, c) => sum + (c.lectureHours || 0) * 15, 0);
  const totalPracticalHours = universityCoreCourses.reduce((sum, c) => sum + (c.practicalHours || 0) * 15, 0);

  const completedLectureHours = completedCoreCourses.reduce((sum, c) => sum + (c.lectureHours || 0) * 15, 0);
  const completedPracticalHours = completedCoreCourses.reduce((sum, c) => sum + (c.practicalHours || 0) * 15, 0);

  const universityDegreeCompliancePercent = Math.min(100, Math.round(((completedCoreUnits + plannedCoreUnits) / totalUniversityCoreUnits) * 100));

  // 2. Industry Career Pathway Analysis
  const trackRecommendedElectiveCourses = allCourses.filter(c => targetTrack.recommendedElectiveIds.includes(c.id));
  const totalTrackElectiveUnits = trackRecommendedElectiveCourses.reduce((sum, c) => sum + c.credits, 0);

  const completedTrackElectives = trackRecommendedElectiveCourses.filter(c => completedIds.has(c.id));
  const completedTrackUnits = completedTrackElectives.reduce((sum, c) => sum + c.credits, 0);

  const plannedTrackElectives = trackRecommendedElectiveCourses.filter(c => plannedIds.has(c.id) && !completedIds.has(c.id));
  const plannedTrackUnits = plannedTrackElectives.reduce((sum, c) => sum + c.credits, 0);

  // Skill Coverage for target track
  let acquiredSkillCount = 0;
  for (const skill of targetTrack.keySkills) {
    const level = profile.skillLevels[skill] ?? 0;
    if (level >= 65) acquiredSkillCount++;
  }
  const skillReadinessPercent = Math.round((acquiredSkillCount / targetTrack.keySkills.length) * 100);

  // Competency Coverage
  let competencyCoverageCount = 0;
  const targetCompetencies = skillMap ? [
    ...skillMap.requiredCompetencies.cognitive,
    ...skillMap.requiredCompetencies.technical,
    ...skillMap.requiredCompetencies.soft
  ] : [];

  for (const comp of targetCompetencies) {
    const level = profile.competencyLevels?.[comp.name] ?? (profile.skillLevels[comp.name] ?? 40);
    if (level >= 60) competencyCoverageCount++;
  }

  const competencyCoveragePercent = targetCompetencies.length > 0 
    ? Math.round((competencyCoverageCount / targetCompetencies.length) * 100) 
    : 75;

  const industryReadinessIndex = Math.min(100, Math.round(
    0.40 * skillReadinessPercent +
    0.35 * (totalTrackElectiveUnits > 0 ? ((completedTrackUnits + plannedTrackUnits) / totalTrackElectiveUnits) * 100 : 80) +
    0.25 * competencyCoveragePercent
  ));

  return {
    targetTrack,
    skillMap,
    universityAudit: {
      totalCoreUnits: totalUniversityCoreUnits,
      completedCoreUnits,
      plannedCoreUnits,
      compliancePercent: universityDegreeCompliancePercent,
      remainingCoreCount: universityCoreCourses.length - completedCoreCourses.length - plannedCoreCourses.length,
      isSiwesCompleted: completedIds.has('CS405') || profile.currentSemester > 8,
      isProjectCompleted: completedIds.has('CS504') || profile.currentSemester > 9,
      totalLectureHours,
      completedLectureHours,
      totalPracticalHours,
      completedPracticalHours
    },
    industryAudit: {
      targetRole: targetTrack.targetRole,
      salaryRange: targetTrack.averageSalaryUSD,
      demandLevel: targetTrack.industryDemand,
      totalTrackUnits: totalTrackElectiveUnits,
      completedTrackUnits,
      plannedTrackUnits,
      readinessIndex: industryReadinessIndex,
      skillsAcquiredCount: acquiredSkillCount,
      totalSkillsCount: targetTrack.keySkills.length,
      competencyCoveragePercent
    }
  };
}
