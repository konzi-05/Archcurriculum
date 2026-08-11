import React, { useState } from 'react';
import { X, Github, Copy, Check, Server, Terminal, ShieldCheck } from 'lucide-react';

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

  const dockerfileContent = `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-100 border border-slate-700">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">GitHub Repository & Render Deployment Standard</h2>
              <p className="text-xs text-slate-400">Production-ready Express + Vite bundled artifact setup</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Quick Steps */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-200 uppercase font-mono text-[11px] flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Step-by-Step GitHub & Render Deployment Guide</span>
            </h3>
            <ol className="list-decimal list-inside text-slate-300 space-y-1.5 leading-relaxed pl-1">
              <li>Export or commit this full codebase to your GitHub repository.</li>
              <li>Connect your GitHub repo to <strong>Render.com</strong> (or any Node container runner).</li>
              <li>Set <strong>Build Command</strong>: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 font-mono">npm run build</code></li>
              <li>Set <strong>Start Command</strong>: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 font-mono">npm start</code></li>
              <li>Add Environment Variable: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 font-mono">GEMINI_API_KEY</code></li>
            </ol>
          </div>

          {/* Render Blueprint yaml */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-300 font-mono text-[11px]">render.yaml Blueprint Configuration</span>
              <button
                onClick={() => copyToClipboard(renderYamlContent, 'render')}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold"
              >
                {copiedKey === 'render' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'render' ? 'Copied' : 'Copy render.yaml'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
              {renderYamlContent}
            </pre>
          </div>

          {/* Dockerfile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-300 font-mono text-[11px]">Container Dockerfile (Multi-stage build)</span>
              <button
                onClick={() => copyToClipboard(dockerfileContent, 'docker')}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold"
              >
                {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'docker' ? 'Copied' : 'Copy Dockerfile'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto">
              {dockerfileContent}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
