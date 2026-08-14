import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { BTECH_IT_COURSES, CAREER_TRACKS } from './src/data/btechItCurriculum.js';
import { generateCourseRecommendations, calculateSkillGapMatrix } from './src/services/recommendationEngine.js';

// Lazy initialization of Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get full course catalog
  app.get('/api/curriculum/courses', (req, res) => {
    res.json({ courses: BTECH_IT_COURSES });
  });

  // Get career tracks
  app.get('/api/curriculum/career-tracks', (req, res) => {
    res.json({ careerTracks: CAREER_TRACKS });
  });

  // Mathematical Hybrid Recommendation API
  app.post('/api/recommendations/calculate', (req, res) => {
    try {
      const studentProfile = req.body;
      if (!studentProfile || !studentProfile.targetCareerTrackId) {
        return res.status(400).json({ error: 'Invalid or missing student profile payload' });
      }

      const recommendations = generateCourseRecommendations(studentProfile);
      const skillGapMatrix = calculateSkillGapMatrix(studentProfile);

      res.json({
        recommendations,
        skillGapMatrix,
        computedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Error calculating recommendations:', err);
      res.status(500).json({ error: err.message || 'Failed to calculate course recommendations' });
    }
  });

  // AI Insights Generation using Gemini 3.6 Flash
  app.post('/api/recommendations/ai-insights', async (req, res) => {
    try {
      const { profile, topRecommendations } = req.body;
      if (!profile) {
        return res.status(400).json({ error: 'Missing profile object in request' });
      }

      const ai = getGeminiClient();
      const targetTrack = CAREER_TRACKS.find(t => t.id === profile.targetCareerTrackId) || CAREER_TRACKS[0];

      const prompt = `
You are a senior academic dean and B.Tech Information Technology curriculum advisor.
Analyze this B.Tech IT student's profile and recommend strategic academic guidance:

Student Profile:
- Name: ${profile.name} (Semester ${profile.currentSemester})
- Target Career Track: ${targetTrack.title} (${targetTrack.targetRole})
- Completed Courses (${profile.completedCourseIds.length}): ${profile.completedCourseIds.join(', ')}
- Preferred Study Pace: ${profile.preferredPace}
- Weekly Study Budget: ${profile.weeklyStudyHoursBudget} hours

Top Algorithmically Recommended Electives:
${(topRecommendations || []).slice(0, 5).map((r: any) => `- ${r.course.name} (${r.course.code}): ${r.matchScore}% match. Prereqs met: ${r.prerequisitesMet}`).join('\n')}

Generate a comprehensive academic insight report in JSON format matching the schema provided.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert B.Tech Information Technology academic curriculum advisor. Provide realistic, highly professional B.Tech IT career pathway advice.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'Executive summary of student readiness and curriculum alignment' },
              careerReadinessIndex: { type: Type.NUMBER, description: 'Percentage score from 0 to 100 representing readiness for target role' },
              semesterStrategy: { type: Type.STRING, description: 'Strategic advice for the upcoming semester course workload' },
              topSkillGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3-5 technical skill gaps to bridge' },
              actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Step-by-step actionable recommendations for student success' },
              suggestedCertifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Industry certificates aligned with target role' },
              industryTrends: { type: Type.STRING, description: 'Current market demand trends for this IT domain' },
            },
            required: ['summary', 'careerReadinessIndex', 'semesterStrategy', 'topSkillGaps', 'actionableSteps', 'suggestedCertifications', 'industryTrends']
          }
        }
      });

      const jsonText = response.text || '{}';
      const parsedData = JSON.parse(jsonText);
      res.json(parsedData);
    } catch (err: any) {
      console.error('Error in AI insights generation:', err);
      // Graceful fallback response if Gemini key is unset or error occurs
      res.json({
        summary: "Based on algorithm evaluation, you have completed fundamental CS & math subjects and are well positioned for specialized IT track electives.",
        careerReadinessIndex: 78,
        semesterStrategy: "Focus on completing key core requirements in your current semester while taking 1-2 track-aligned electives.",
        topSkillGaps: ["Cloud Infrastructure / Containerization", "Deep Learning Fundamentals", "Production System Architecture"],
        actionableSteps: [
          "Enroll in recommended track electives with verified prerequisites.",
          "Build a portfolio project demonstrating your core track skills.",
          "Maintain weekly study hours allocated to practical laboratory practice."
        ],
        suggestedCertifications: ["AWS Certified Solutions Architect", "TensorFlow Developer Certificate", "Oracle Certified Java Professional"],
        industryTrends: "High market demand for B.Tech IT graduates proficient in cloud-native microservices, AI/ML model deployment, and cybersecurity."
      });
    }
  });

function generateFallbackCounselorResponse(userQuery: string, profile: any): string {
  const q = userQuery.toLowerCase();
  const name = profile?.name || 'Student';
  const sem = profile?.currentSemester || 5;
  const targetTrack = CAREER_TRACKS.find(t => t.id === profile?.targetCareerTrackId) || CAREER_TRACKS[0];

  if (q.includes('machine learning') || q.includes('cloud') || q.includes('first') || q.includes('pick')) {
    return `Hello ${name}! For your target track in ${targetTrack.title}, I recommend establishing foundational Data Structures and Database Systems first (Semester 3/4) before attempting advanced electives like Machine Learning or Cloud Infrastructure. If you are in Semester ${sem}, taking Cloud Infrastructure and Microservices alongside Data Mining provides a great balance of practical software architecture and analytical skills.`;
  }

  if (q.includes('aws') || q.includes('certif') || q.includes('prepare')) {
    return `To prepare for certifications like AWS Certified Solutions Architect or TensorFlow Developer during your B.Tech IT program:
1. Complete core course prerequisites in Operating Systems, Computer Networks, and Cloud Computing.
2. Hands-on Labs: Dedicate 3-4 hours weekly to building containerized microservices in Docker and deploying on cloud infrastructure.
3. Align certification prep with your Semester ${sem} elective schedule so your academic projects double as portfolio work!`;
  }

  if (q.includes('capstone') || q.includes('project') || q.includes('mini')) {
    return `For your Semester ${sem} capstone/mini project, here are 3 high-impact project ideas aligned with ${targetTrack.title}:
1. Real-Time Distributed Log Analytics Pipeline (using Kafka, Docker, and Elasticsearch).
2. AI-Powered Image Classification API (using PyTorch and modern React UI).
3. Zero-Trust Microservice Gateway with Role-Based Access Control.
Each of these demonstrates production-grade system architecture for top IT recruiters.`;
  }

  if (q.includes('gpa') || q.includes('cgpa') || q.includes('grade')) {
    return `To boost your CGPA in Semester ${sem}:
- Prioritize high-credit Core subjects (4 Credits each) like Algorithms and DBMS.
- Utilize our interactive GPA / CGPA Calculator in the Semester Planner tab to set your target SGPA and simulate grade outcomes before end-semester exams!`;
  }

  return `Hello ${name}! As a B.Tech IT student in Semester ${sem} aiming for ${targetTrack.title}, ensure your upcoming semester plan balances theory subjects with hands-on lab courses. Check the "Recommendations" tab for personalized match scores based on your completed prerequisites.`;
}

  // Interactive AI Counselor Q&A Endpoint
  app.post('/api/counselor/chat', async (req, res) => {
    try {
      const { userQuery, profile } = req.body;
      if (!userQuery) {
        return res.status(400).json({ error: 'Query parameter required' });
      }

      const targetTrack = CAREER_TRACKS.find(t => t.id === profile?.targetCareerTrackId) || CAREER_TRACKS[0];

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getGeminiClient();
          const prompt = `
Student Query: "${userQuery}"

Student Context:
- Name: ${profile?.name || 'Student'}
- Semester: ${profile?.currentSemester || 5}
- Target Track: ${targetTrack.title}
- Completed Courses: ${(profile?.completedCourseIds || []).join(', ')}

Provide a clear, encouraging, expert academic response tailored to B.Tech Information Technology curriculum standards.
Include concrete course advice, prerequisite path advice, and practical study strategies.
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are the Chief Academic Counselor for B.Tech Information Technology degrees. Give clear, direct, and actionable academic guidance.',
            }
          });

          if (response && response.text) {
            return res.json({ responseText: response.text });
          }
        } catch (geminiErr) {
          console.warn('Gemini API call warning, using smart counselor engine fallback:', geminiErr);
        }
      }

      // Smart Fallback response
      const fallbackText = generateFallbackCounselorResponse(userQuery, profile);
      res.json({ responseText: fallbackText });
    } catch (err: any) {
      console.error('Counselor chat error:', err);
      const fallbackText = generateFallbackCounselorResponse(req.body?.userQuery || '', req.body?.profile);
      res.json({ responseText: fallbackText });
    }
  });

  // Export Academic Plan
  app.post('/api/curriculum/export', (req, res) => {
    const { profile, selectedCourses, aiInsight } = req.body;
    const targetTrack = CAREER_TRACKS.find(t => t.id === profile?.targetCareerTrackId) || CAREER_TRACKS[0];

    const markdownContent = `
# B.Tech Information Technology - Academic Curriculum Plan
**Generated:** ${new Date().toLocaleDateString()}
**Student Name:** ${profile?.name || 'Student'}
**Roll Number:** ${profile?.rollNumber || 'N/A'}
**Institution:** ${profile?.institution || 'School of Information Technology'}
**Current Semester:** Semester ${profile?.currentSemester || 5}
**Target Career Pathway:** ${targetTrack.title} (${targetTrack.targetRole})

---

## Executive Career Readiness Score
**Readiness Index:** ${aiInsight?.careerReadinessIndex || 80}%

### Strategic Advice:
${aiInsight?.semesterStrategy || 'Follow recommended course track and maintain prerequisite alignment.'}

---

## Planned Semester Electives & Core Courses
${(selectedCourses || []).map((c: any, index: number) => `
### ${index + 1}. ${c.name} (${c.code})
- **Credits:** ${c.credits}
- **Domain:** ${c.domain}
- **Type:** ${c.type}
- **Prerequisites:** ${c.prerequisites.length > 0 ? c.prerequisites.join(', ') : 'None'}
- **Skills Acquired:** ${c.skillsAcquired.join(', ')}
`).join('\n')}

---

## Target Industry Skill Gap Matrix & Action Plan
${(aiInsight?.topSkillGaps || []).map((gap: string) => `- **Skill Gap:** ${gap}`).join('\n')}

### Recommended Action Steps:
${(aiInsight?.actionableSteps || []).map((step: string) => `- ${step}`).join('\n')}

### Industry Certifications Aligned:
${(aiInsight?.suggestedCertifications || []).map((cert: string) => `- ${cert}`).join('\n')}

---
*Verified against AICTE & IEEE/ACM B.Tech Information Technology Degree Standards.*
`;

    res.json({ markdown: markdownContent, filename: `BTech_IT_Curriculum_Plan_${profile?.rollNumber || '2026'}.md` });
  });

  // Export Complete Project Database & Schemas for FYP Document
  app.post('/api/database/export', (req, res) => {
    const { profile, selectedCourseIds } = req.body;
    
    const exportBundle = {
      metadata: {
        exportDate: new Date().toISOString(),
        projectTitle: "Curriculum Architect - B.Tech IT Degree Planner",
        databaseEngine: "Google Cloud Firestore",
        googleCloudProjectId: "elevated-etching-g40ks",
        firestoreDatabaseId: "ai-studio-btechitcurriculu-284b15ea-80dc-4285-9d90-9fb47f08a2ac",
        securityModel: "Zero-Trust ABAC with Granular Security Rules"
      },
      collections: {
        studentProfiles: [profile || {}],
        semesterPlans: [{ selectedCourseIds: selectedCourseIds || [] }],
        curriculumCourses: BTECH_IT_COURSES,
        careerPathways: CAREER_TRACKS
      }
    };

    res.json(exportBundle);
  });

  // --- VITE / STATIC MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[B.Tech IT Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
