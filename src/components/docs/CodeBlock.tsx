import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-6 border border-slate-200/50 shadow-sm">
      <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white backdrop-blur-sm transition-all border border-slate-700/50"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="bg-[#0d1117] px-4 py-2 text-xs font-mono text-slate-400 border-b border-white/10 flex items-center">
        {language.toUpperCase()}
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem 1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          backgroundColor: '#0d1117', // GitHub dark dim style bg
          borderRadius: '0 0 0.75rem 0.75rem',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
