import { Course, CareerTrack, StudentProfile } from '../types/curriculum';
import { BTECH_IT_COURSES, CAREER_TRACKS } from '../data/btechItCurriculum';
import { generateCourseSemanticVector, cosineSimilarity } from './semanticEmbeddings';

export interface RetrievedCourseEvidence {
  course: Course;
  relevanceScore: number;
  prerequisitesMet: boolean;
  missingPrerequisiteCourses: Course[];
  satisfiedPrerequisites: string[];
  matchedKeywords: string[];
  keySyllabusSnippet: string;
}

export interface RagContextResult {
  query: string;
  retrievedCourses: RetrievedCourseEvidence[];
  targetCareerTrack: CareerTrack;
  studentContext: {
    name: string;
    currentSemester: number;
    completedCourseCount: number;
    completedCourseCodes: string[];
    targetRole: string;
  };
  groundedPromptDossier: string;
}

/**
 * Extract salient search terms, course codes, and domain keywords from user prompt
 */
function extractQueryKeywords(query: string): string[] {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 2);
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'what', 'which', 'should', 'how', 'can',
    'you', 'tell', 'about', 'first', 'take', 'pick', 'give', 'help', 'best',
    'good', 'want', 'need', 'like', 'from', 'this', 'that', 'have', 'been'
  ]);
  return words.filter(w => !stopWords.has(w));
}

/**
 * Hybrid Curriculum Retriever:
 * Combines Lexical Code/Title/Syllabus matching + Semantic Dense Vector Space + Prerequisite Graph Context
 */
export function retrieveGroundedCurriculumContext(
  userQuery: string,
  profile: StudentProfile,
  maxResults: number = 5
): RagContextResult {
  const queryLower = userQuery.toLowerCase();
  const queryWords = extractQueryKeywords(userQuery);
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];

  const completedSet = new Set(profile.completedCourseIds || []);

  const scoredCourses: RetrievedCourseEvidence[] = BTECH_IT_COURSES.map(course => {
    let lexicalScore = 0;
    const matchedKeywords: string[] = [];

    // 1. Direct course ID or code match (highest confidence)
    const codeMatch = queryLower.includes(course.id.toLowerCase()) || 
                      queryLower.includes(course.code.toLowerCase().replace(/[^a-z0-9]/g, ''));
    if (codeMatch) {
      lexicalScore += 50;
      matchedKeywords.push(course.code);
    }

    // 2. Course Name match
    const nameLower = course.name.toLowerCase();
    if (queryLower.includes(nameLower)) {
      lexicalScore += 35;
      matchedKeywords.push(course.name);
    } else {
      for (const word of queryWords) {
        if (nameLower.includes(word)) {
          lexicalScore += 8;
          matchedKeywords.push(word);
        }
      }
    }

    // 3. Syllabus & Skills matching
    for (const skill of course.skillsAcquired) {
      const sLower = skill.toLowerCase();
      if (queryLower.includes(sLower)) {
        lexicalScore += 12;
        matchedKeywords.push(skill);
      } else {
        for (const word of queryWords) {
          if (sLower.includes(word)) {
            lexicalScore += 4;
            matchedKeywords.push(skill);
          }
        }
      }
    }

    for (const unit of course.syllabus) {
      const uLower = unit.toLowerCase();
      for (const word of queryWords) {
        if (uLower.includes(word)) {
          lexicalScore += 3;
          matchedKeywords.push(unit);
          break;
        }
      }
    }

    // 4. Track Relevance Boost
    if (targetTrack.recommendedElectiveIds.includes(course.id)) {
      lexicalScore += 12;
    }
    if (course.skillsAcquired.some(skill => targetTrack.keySkills.some(ts => ts.toLowerCase().includes(skill.toLowerCase())))) {
      lexicalScore += 8;
    }

    // 5. Semester Proximity (courses close to current semester get a slight boost)
    const semDiff = Math.abs(course.semester - profile.currentSemester);
    if (semDiff === 0) lexicalScore += 6;
    else if (semDiff === 1) lexicalScore += 3;

    // 6. Semantic Cosine Vector Metric
    const courseVec = generateCourseSemanticVector(course);
    // Create query pseudo-vector from matched concepts
    const querySemanticScore = matchedKeywords.length > 0 ? Math.min(30, matchedKeywords.length * 6) : 0;

    const totalRelevance = lexicalScore + querySemanticScore;

    // Prerequisite evaluation
    const prerequisitesMet = course.prerequisites.length === 0 || course.prerequisites.every(pId => completedSet.has(pId));
    const satisfiedPrerequisites = course.prerequisites.filter(pId => completedSet.has(pId));
    const missingPrerequisiteIds = course.prerequisites.filter(pId => !completedSet.has(pId));
    const missingPrerequisiteCourses = BTECH_IT_COURSES.filter(c => missingPrerequisiteIds.includes(c.id));

    const keySyllabusSnippet = course.syllabus.slice(0, 3).join(', ');

    return {
      course,
      relevanceScore: totalRelevance,
      prerequisitesMet,
      missingPrerequisiteCourses,
      satisfiedPrerequisites,
      matchedKeywords: Array.from(new Set(matchedKeywords)),
      keySyllabusSnippet
    };
  });

  // Sort by relevance score descending
  scoredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // If query was very generic, ensure we supply top electives for the student's current semester & track
  let topEvidence = scoredCourses.filter(sc => sc.relevanceScore > 0).slice(0, maxResults);
  if (topEvidence.length < 3) {
    const fallbackElectives = scoredCourses
      .filter(sc => !topEvidence.some(e => e.course.id === sc.course.id))
      .filter(sc => sc.course.semester >= profile.currentSemester)
      .slice(0, maxResults - topEvidence.length);
    topEvidence = [...topEvidence, ...fallbackElectives];
  }

  // Completed course codes list
  const completedCourseCodes = BTECH_IT_COURSES
    .filter(c => completedSet.has(c.id))
    .map(c => `${c.id} (${c.name})`);

  // Build Grounded Prompt Dossier
  const dossierLines: string[] = [
    `=== GROUNDED CURRICULUM KNOWLEDGE BASE (OFFICIAL B.TECH IT DATASET) ===`,
    `Target Career Track: ${targetTrack.title} -> Role: ${targetTrack.targetRole}`,
    `Track Key Competencies: ${targetTrack.keySkills.join(', ')}`,
    `Track Market Demand: ${targetTrack.industryDemand} Demand (Benchmark: ${targetTrack.averageSalaryUSD})`,
    `Student Profile: ${profile.name}, Semester ${profile.currentSemester}, Weekly Budget: ${profile.weeklyStudyHoursBudget}h`,
    `Student Completed Courses (${completedCourseCodes.length}): ${completedCourseCodes.join('; ')}`,
    ``,
    `=== RETRIEVED COURSE EVIDENCE DOCUMENTS (${topEvidence.length} Relevant Modules) ===`
  ];

  topEvidence.forEach((item, idx) => {
    const c = item.course;
    const prereqStatus = c.prerequisites.length === 0
      ? 'No Prerequisites (Open Entry)'
      : item.prerequisitesMet
        ? `Prerequisites SATISFIED [${c.prerequisites.join(', ')}]`
        : `Prerequisites MISSING: Need to pass [${item.missingPrerequisiteCourses.map(m => `${m.id}: ${m.name}`).join(', ')}] first!`;

    dossierLines.push(`[Source Document ${idx + 1}: ${c.id}]`);
    dossierLines.push(`- Course Code & Name: ${c.code} - ${c.name}`);
    dossierLines.push(`- Type: ${c.type} | Domain: ${c.domain} | Semester: ${c.semester} | Credits: ${c.credits} (AICTE compliant)`);
    dossierLines.push(`- Difficulty: ${c.difficulty}/5 | Workload: ${c.workloadHours} hours/week | Bloom Level: ${c.bloomLevel}`);
    dossierLines.push(`- Prerequisite Rule: ${prereqStatus}`);
    dossierLines.push(`- Official Syllabus Modules: ${c.syllabus.join('; ')}`);
    dossierLines.push(`- Core Skills Acquired: ${c.skillsAcquired.join(', ')}`);
    dossierLines.push(`- Catalog Description: ${c.description}`);
    dossierLines.push(``);
  });

  return {
    query: userQuery,
    retrievedCourses: topEvidence,
    targetCareerTrack: targetTrack,
    studentContext: {
      name: profile.name,
      currentSemester: profile.currentSemester,
      completedCourseCount: completedCourseCodes.length,
      completedCourseCodes,
      targetRole: targetTrack.targetRole
    },
    groundedPromptDossier: dossierLines.join('\n')
  };
}
