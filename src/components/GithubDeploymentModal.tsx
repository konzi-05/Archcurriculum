import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, ExternalLink, RefreshCw } from 'lucide-react';

interface GithubDeploymentModalProps {
  onClose: () => void;
}

export const GithubDeploymentModal: React.FC<GithubDeploymentModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "feat: B.Tech IT Curriculum Architect with Light/Dark theme support"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main`;

  const vercelJsonContent = `{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const renderYamlContent = `services:
  - type: web
    name: btech-it-curriculum-engine
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-2xs">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">GitHub Repository & Vercel Deployment Guide</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Push changes to GitHub and deploy automatically on Vercel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs bg-slate-50/30 dark:bg-slate-950/40">
          
          {/* Quick Steps */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-2xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs flex items-center space-x-1.5">
              <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Deploying to Vercel via GitHub (Auto CD/CI)</span>
            </h3>
            <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed pl-1 text-xs">
              <li><strong>Export or Push to GitHub:</strong> Use the commands below to push your latest code changes to your GitHub repository.</li>
              <li><strong>Import Project on Vercel:</strong> Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-bold underline inline-flex items-center gap-0.5">Vercel Dashboard <ExternalLink className="w-3 h-3" /></a>, click <strong>Add New Project</strong> and select your GitHub repo.</li>
              <li><strong>Framework Preset:</strong> Select <strong>Vite</strong>. Set <strong>Build Command</strong> to <code className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">npm run build</code> and <strong>Output Directory</strong> to <code className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">dist</code>.</li>
              <li><strong>Environment Variables:</strong> Add <code className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">GEMINI_API_KEY</code> under Project Settings &gt; Environment Variables.</li>
              <li><strong>Automatic Redeployment:</strong> Every future commit pushed to <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">main</code> branch will automatically trigger a new deployment on Vercel!</li>
            </ol>
          </div>

          {/* Git Commit Commands */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Git Push Terminal Commands</span>
              </span>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold"
              >
                {copiedKey === 'git' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'git' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-2xs">
              {gitCommands}
            </pre>
          </div>

          {/* vercel.json */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">vercel.json Configuration</span>
              <button
                onClick={() => copyToClipboard(vercelJsonContent, 'vercel')}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold"
              >
                {copiedKey === 'vercel' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'vercel' ? 'Copied' : 'Copy vercel.json'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-2xs">
              {vercelJsonContent}
            </pre>
          </div>

          {/* Render Blueprint yaml */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">render.yaml Blueprint Configuration</span>
              <button
                onClick={() => copyToClipboard(renderYamlContent, 'render')}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold"
              >
                {copiedKey === 'render' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'render' ? 'Copied' : 'Copy render.yaml'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-2xs">
              {renderYamlContent}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

