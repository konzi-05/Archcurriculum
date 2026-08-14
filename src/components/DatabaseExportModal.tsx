import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { StudentProfile } from '../types/curriculum';
import {
  generateDatabaseBundle,
  generateAcademicMarkdownReport,
  generateCoursesCsv
} from '../services/databaseExport';
import {
  X,
  Database,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

interface DatabaseExportModalProps {
  studentProfile: StudentProfile;
  selectedPlanCourseIds: string[];
  currentUser: User | null;
  onClose: () => void;
}

export const DatabaseExportModal: React.FC<DatabaseExportModalProps> = ({
  studentProfile,
  selectedPlanCourseIds,
  currentUser,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'json' | 'dictionary'>('report');
  const [copied, setCopied] = useState(false);

  const bundle = generateDatabaseBundle(
    studentProfile,
    selectedPlanCourseIds,
    [],
    currentUser?.uid || 'student-user-btech-it'
  );

  const markdownReport = generateAcademicMarkdownReport(bundle);
  const jsonString = JSON.stringify(bundle, null, 2);
  const csvString = generateCoursesCsv(bundle.collections.curriculumCourses);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    downloadFile(jsonString, 'BTech_IT_Curriculum_Database_Export.json', 'application/json');
  };

  const handleDownloadMarkdown = () => {
    downloadFile(markdownReport, 'BTech_IT_Database_Architecture_Report.md', 'text/markdown');
  };

  const handleDownloadCsv = () => {
    downloadFile(csvString, 'BTech_IT_Courses_Database.csv', 'text/csv');
  };

  const handleCopyCurrent = () => {
    const textToCopy = activeTab === 'json' ? jsonString : markdownReport;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Export Project Database Documentation</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-mono font-bold">
                  FYP Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate downloadable database schemas, data dictionaries, and records for your final year project report
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[38px] min-w-[38px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Pills */}
        <div className="px-5 py-3 bg-blue-50/50 dark:bg-blue-950/30 border-b border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">Database Engine</span>
              <span className="font-bold truncate">Google Cloud Firestore</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Collections</span>
              <span className="font-bold">4 Collections (34 Courses)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Security Model</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero-Trust ABAC</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">Active Student ID</span>
              <span className="font-mono font-bold truncate">{studentProfile.rollNumber || '2026-IT-001'}</span>
            </div>
          </div>
        </div>

        {/* Action Download Buttons */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadJson}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all min-h-[44px]"
          >
            <FileCode className="w-4 h-4" />
            <span>Download Database JSON</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all min-h-[44px]"
          >
            <FileText className="w-4 h-4" />
            <span>Download FYP Appendix (.md)</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all min-h-[44px]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Courses CSV</span>
          </button>
        </div>

        {/* View Tabs & Copy */}
        <div className="px-5 pt-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('report')}
              className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'report'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Academic Report (.md)
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'json'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Raw JSON Database
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'dictionary'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Data Dictionary
            </button>
          </div>

          <button
            onClick={handleCopyCurrent}
            className="flex items-center space-x-1 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Content Viewer Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto font-mono text-xs bg-slate-900 text-slate-100 leading-relaxed">
          {activeTab === 'report' && (
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200">
              {markdownReport}
            </pre>
          )}

          {activeTab === 'json' && (
            <pre className="whitespace-pre-wrap text-emerald-400 text-[11px]">
              {jsonString}
            </pre>
          )}

          {activeTab === 'dictionary' && (
            <div className="font-sans space-y-4 text-slate-200">
              <h3 className="font-bold text-sm text-blue-400">Database Schema Quick Reference</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-white mb-1">📁 collection: studentProfiles/{'{userId}'}</div>
                  <p className="text-slate-400 text-[11px]">
                    Stores academic profile, current semester, target career track ID, array of passed course IDs, grades map (for CGPA computation), and skill levels (1-10 scale).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-white mb-1">📁 collection: semesterPlans/{'{userId}'}</div>
                  <p className="text-slate-400 text-[11px]">
                    Stores array of selected elective & core course IDs, total credit calculations, contact workload hours, and semester roadmap status.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-white mb-1">📁 collection: counselorChats/{'{userId}'}</div>
                  <p className="text-slate-400 text-[11px]">
                    Stores conversation history with the Gemini-powered AI Academic Counselor for curriculum advice and prerequisite inquiries.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="font-bold text-white mb-1">📁 collection: users/{'{userId}'}</div>
                  <p className="text-slate-400 text-[11px]">
                    Maintains user authentication records, verified email, creation timestamps, and access tokens.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Project Database ID: <code className="text-blue-600 dark:text-blue-400 font-mono">ai-studio-btechitcurriculu-284b15ea</code></span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
