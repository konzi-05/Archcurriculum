import { Course, StudentProfile, RecommendedCourseResult, SkillGapItem, RecommendationBreakdown } from '../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../data/btechItCurriculum';

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
 * Calculates skill gap matrix between student profile and target career track.
 */
export function calculateSkillGapMatrix(profile: StudentProfile): SkillGapItem[] {
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];
  const items: SkillGapItem[] = [];

  for (const skill of targetTrack.keySkills) {
    const currentLevel = profile.skillLevels[skill] ?? 10; // 0 to 100 scale
    const requiredLevel = 85; // B.Tech standard proficiency target
    const gap = Math.max(0, requiredLevel - currentLevel);

    // Find courses that teach this skill
    const coveringCourses = BTECH_IT_COURSES
      .filter(c => c.skillsAcquired.includes(skill))
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
 * Executes hybrid course recommendation logic combining:
 * 1. Prerequisite DAG Validation
 * 2. Career Track Vector Space Cosine/Overlap Similarity
 * 3. Skill Gap Reduction Potential
 * 4. Difficulty & Workload Balance
 */
export function generateCourseRecommendations(profile: StudentProfile): RecommendedCourseResult[] {
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];
  const skillGapMatrix = calculateSkillGapMatrix(profile);
  const completedSet = new Set(profile.completedCourseIds);

  // Candidate courses:
  // - Not yet completed
  // - Typically in or near current semester (+/- 1 semester) or Electives
  const candidateCourses = BTECH_IT_COURSES.filter(course => {
    if (completedSet.has(course.id)) return false;
    // Allow electives or courses within current/upcoming semesters
    return course.type === 'Elective' || course.semester >= profile.currentSemester;
  });

  const results: RecommendedCourseResult[] = candidateCourses.map(course => {
    // 1. Prerequisite Score
    const prereqCheck = validatePrerequisites(course, profile.completedCourseIds);

    // 2. Career Match Score
    let careerMatchScore = 0;
    const isDirectlyRecommended = targetTrack.recommendedElectiveIds.includes(course.id);
    if (isDirectlyRecommended) {
      careerMatchScore += 50;
    }

    // Overlap of skills
    const matchingSkills = course.skillsAcquired.filter(s => targetTrack.keySkills.includes(s));
    const skillRatio = targetTrack.keySkills.length > 0 ? matchingSkills.length / targetTrack.keySkills.length : 0;
    careerMatchScore += Math.round(skillRatio * 50);
    careerMatchScore = Math.min(100, careerMatchScore);

    // 3. Skill Gap Reduction Score
    let skillGapScore = 0;
    let gapReductionPoints = 0;
    for (const skill of course.skillsAcquired) {
      const gapItem = skillGapMatrix.find(item => item.skill === skill);
      if (gapItem && gapItem.gap > 0) {
        gapReductionPoints += gapItem.gap;
      }
    }
    skillGapScore = Math.min(100, Math.round(gapReductionPoints * 1.2));

    // 4. Workload Balance Score
    let workloadBalanceScore = 80;
    if (profile.preferredPace === 'Light' && (course.workloadHours > 7 || course.difficulty >= 4)) {
      workloadBalanceScore -= 30;
    } else if (profile.preferredPace === 'Intensive' && course.difficulty >= 4) {
      workloadBalanceScore += 20;
    } else if (profile.preferredPace === 'Balanced' && course.workloadHours <= 7 && course.difficulty <= 4) {
      workloadBalanceScore += 15;
    }
    workloadBalanceScore = Math.max(20, Math.min(100, workloadBalanceScore));

    // 5. Difficulty Fit Score
    const averageGradePoint = Object.values(profile.grades).length > 0 ? 80 : 70; // baseline
    const difficultyFitScore = Math.max(30, 100 - Math.abs((course.difficulty * 20) - averageGradePoint));

    const breakdown: RecommendationBreakdown = {
      prerequisiteScore: prereqCheck.prerequisiteScore,
      careerMatchScore,
      skillGapScore,
      workloadBalanceScore,
      difficultyFitScore
    };

    // Overall Weighted Score
    let overallMatchScore = Math.round(
      0.35 * (prereqCheck.prerequisitesMet ? 100 : Math.max(50, prereqCheck.prerequisiteScore)) +
      0.35 * careerMatchScore +
      0.18 * skillGapScore +
      0.12 * workloadBalanceScore
    );

    // Minor adjustment if prerequisites not yet satisfied
    if (!prereqCheck.prerequisitesMet) {
      if (isDirectlyRecommended) {
        // Track specialization electives remain high-priority for degree planning
        overallMatchScore = Math.max(72, Math.round(overallMatchScore * 0.88));
      } else {
        overallMatchScore = Math.round(overallMatchScore * 0.75);
      }
    } else if (isDirectlyRecommended) {
      overallMatchScore = Math.min(100, overallMatchScore + 10);
    }

    const matchReasons: string[] = [];
    if (isDirectlyRecommended) {
      matchReasons.push(`Core specialization elective for ${targetTrack.title}`);
    }
    if (matchingSkills.length > 0) {
      matchReasons.push(`Teaches key track skills: ${matchingSkills.join(', ')}`);
    }
    if (skillGapScore > 60) {
      matchReasons.push(`Directly targets identified skill gaps in your profile`);
    }
    if (prereqCheck.prerequisitesMet) {
      matchReasons.push(`All prerequisites satisfied and ready for enrollment`);
    } else if (isDirectlyRecommended && course.semester > profile.currentSemester) {
      matchReasons.push(`Sequential track module scheduled for Semester ${course.semester}`);
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
      missingPrerequisites: prereqCheck.missingPrerequisites
    };
  });

  // Sort descending by matchScore
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
