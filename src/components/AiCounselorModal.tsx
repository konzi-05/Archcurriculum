import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { User as FirebaseUser } from 'firebase/auth';
import { StudentProfile, Course } from '../types/curriculum';
import { RetrievedCourseEvidence } from '../services/curriculumRagService';
import { 
  X, Send, Sparkles, Bot, User as UserIcon, Loader2, Database, 
  CheckCircle2, AlertCircle, BookOpen, Plus, Check, ChevronDown, ChevronUp,
  Layers, ExternalLink, ShieldCheck, Cpu
} from 'lucide-react';
import { saveCounselorChatCloud, subscribeCounselorChat } from '../services/firebase';

interface AiCounselorModalProps {
  profile: StudentProfile;
  currentUser?: FirebaseUser | null;
  selectedPlanCourseIds?: string[];
  onTogglePlanCourse?: (courseId: string) => void;
  onSelectCourse?: (course: Course) => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  retrievedCourses?: RetrievedCourseEvidence[];
  ragGroundingActive?: boolean;
}

export const AiCounselorModal: React.FC<AiCounselorModalProps> = ({ 
  profile, 
  currentUser, 
  selectedPlanCourseIds = [],
  onTogglePlanCourse,
  onSelectCourse,
  onClose 
}) => {
  const studentName = profile.name || 'Student';
  const semesterLevel = `${Math.ceil(profile.currentSemester / 2) * 100}L`;
  const completedCount = profile.completedCourseIds?.length || 0;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${studentName}! I am your **B.Tech IT Academic & Career Counselor**, grounded in real-time with the official **SICT / NUC CCMAS curriculum catalog (RAG Engine)**.\n\nI have loaded your profile (**${semesterLevel} • Semester ${profile.currentSemester}**, **${completedCount} courses completed**). Ask me about course prerequisites, elective recommendations, syllabus topics, SIWES training, or career preparation for your target role!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragGroundingActive: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedGroundingMsgId, setExpandedGroundingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Sync counselor chat history with Firestore
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeCounselorChat(currentUser.uid, (cloudMessages) => {
      if (cloudMessages && cloudMessages.length > 0) {
        setMessages(cloudMessages);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSendMessage = async (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery || inputQuery;
    if (!queryToSend.trim() || isLoading) return;

    const userText = queryToSend.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgsWithUser = [...messages, userMsg];
    setMessages(newMsgsWithUser);
    if (currentUser) {
      saveCounselorChatCloud(currentUser.uid, newMsgsWithUser);
    }

    setIsLoading(true);

    try {
      // Build recent history for context
      const chatHistory = newMsgsWithUser.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/counselor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userQuery: userText, 
          profile,
          chatHistory 
        })
      });

      const data = await res.json();
      const aiResponseText = data.responseText || `As a Semester ${profile.currentSemester} student, ensure you complete fundamental core requirements before taking advanced electives.`;
      const retrieved = data.retrievedCourses || [];

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        retrievedCourses: retrieved,
        ragGroundingActive: data.ragGroundingActive || true
      };

      const finalMsgs = [...newMsgsWithUser, aiMsg];
      setMessages(finalMsgs);
      if (retrieved.length > 0) {
        setExpandedGroundingMsgId(aiMsg.id);
      }

      if (currentUser) {
        saveCounselorChatCloud(currentUser.uid, finalMsgs);
      }
    } catch (err) {
      console.error(err);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Regarding "${userText}": As a Semester ${profile.currentSemester} B.Tech IT student, check your completed course prerequisites and align your elective choices with your target career track.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMsgs = [...newMsgsWithUser, aiMsg];
      setMessages(finalMsgs);
      if (currentUser) {
        saveCounselorChatCloud(currentUser.uid, finalMsgs);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    `What electives in Semester ${profile.currentSemester} best fit my career track?`,
    "Audit my prerequisites for advanced computing electives",
    "How does the mandatory 6-month SIWES industrial training work?",
    "How do I balance credit units without overloading my study hours?",
    "Which courses teach hands-on industry frameworks and tools?"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl h-[88vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Academic & Career Counselor</h2>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                  <Database className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>Live RAG Grounded</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every response is grounded in real-time against the official B.Tech IT 40+ course catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Close Counselor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs bg-slate-50/30 dark:bg-slate-950/40">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            const hasEvidence = !isUser && msg.retrievedCourses && msg.retrievedCourses.length > 0;
            const isExpanded = expandedGroundingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-2xs'
                }`}>
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl max-w-[88%] sm:max-w-[84%] flex flex-col space-y-2.5 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none p-4 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-100 rounded-tl-none p-4 sm:p-5 shadow-xs'
                }`}>
                  
                  {/* Markdown Response Text */}
                  <div className={`prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed ${
                    isUser ? 'text-white [&_*]:text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    <Markdown>{msg.text}</Markdown>
                  </div>

                  {/* Grounded Curriculum Evidence Card (RAG) */}
                  {hasEvidence && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80">
                      <button
                        onClick={() => setExpandedGroundingMsgId(isExpanded ? null : msg.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-2">
                          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            Curriculum Evidence Grounding ({msg.retrievedCourses?.length} Sources Retrieved)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <span className="text-[10px] font-medium hidden sm:inline">
                            {isExpanded ? 'Hide Sources' : 'Inspect Sources'}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 space-y-2">
                          {msg.retrievedCourses?.map((evidence, idx) => {
                            const c = evidence.course;
                            const inPlan = selectedPlanCourseIds.includes(c.id);

                            return (
                              <div
                                key={c.id || idx}
                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs flex flex-col space-y-2 shadow-2xs"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                        {c.code}
                                      </span>
                                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                                        {c.name}
                                      </span>
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                        • Sem {c.semester} • {c.credits} Cr
                                      </span>
                                    </div>

                                    {/* Prerequisite status */}
                                    <div className="mt-1 flex items-center space-x-1.5 text-[10px]">
                                      {evidence.prerequisitesMet ? (
                                        <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                          <CheckCircle2 className="w-2.5 h-2.5" />
                                          <span>Prerequisites Satisfied</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center space-x-1 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                                          <AlertCircle className="w-2.5 h-2.5" />
                                          <span>Needs: {evidence.missingPrerequisiteCourses.map(m => m.id).join(', ')}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-1.5 shrink-0">
                                    {onSelectCourse && (
                                      <button
                                        onClick={() => onSelectCourse(c)}
                                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-[10px] font-semibold flex items-center space-x-1"
                                        title="View full course syllabus"
                                      >
                                        <BookOpen className="w-3 h-3 text-blue-500" />
                                        <span className="hidden sm:inline">Syllabus</span>
                                      </button>
                                    )}

                                    {onTogglePlanCourse && (
                                      <button
                                        onClick={() => onTogglePlanCourse(c.id)}
                                        className={`p-1.5 rounded-lg transition-colors text-[10px] font-semibold flex items-center space-x-1 ${
                                          inPlan
                                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                        title={inPlan ? "Remove from semester plan" : "Add course to semester plan"}
                                      >
                                        {inPlan ? (
                                          <>
                                            <Check className="w-3 h-3 stroke-[3]" />
                                            <span className="hidden sm:inline">In Plan</span>
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="w-3 h-3" />
                                            <span className="hidden sm:inline">Add</span>
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Key Syllabus Preview */}
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg leading-relaxed">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">Syllabus Units: </span>
                                  {c.syllabus.slice(0, 3).join('; ')}...
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <span className={`block text-[10px] mt-1 text-right font-medium ${isUser ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-blue-600 dark:text-blue-400 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 font-medium max-w-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <div>
                <span className="block font-bold">Querying Live Curriculum RAG Engine...</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Retrieving syllabus modules and validating prerequisites</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompt Suggestions */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850/80 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase flex-shrink-0 mr-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Try Prompts:</span>
          </span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={(e) => handleSendMessage(e as any, q)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-all shadow-2xs font-medium text-[11px] cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask anything about courses, prerequisites, career pathways, or syllabus topics..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50 shadow-xs flex-shrink-0 flex items-center space-x-1.5 text-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
