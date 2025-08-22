import React from 'react';
import { 

  Terminal, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock

} from 'lucide-react';

interface CommandOutputProps {

  result: any;
  jobId: number;
  timestamp: string;
  className?: string;

}

export const CommandOutput: React.FC<CommandOutputProps> = ({ 

  result, 
  jobId, 
  timestamp, 
  className = ''

}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  
  const copyToClipboard = async (text: string) => {

    try {

      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

    } catch (err) {

      console.error('Failed to copy text: ', err);

    }
  };

  if (result.status === 'error') {

    return (
      <div className={`bg-red-950 border border-red-800 rounded-lg overflow-hidden ${className}`}>
        <div className="bg-red-900 px-3 py-2 border-b border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-200 text-sm">
              <XCircle className="h-3 w-3" />
              <span>Command Failed - Job #{jobId}</span>
            </div>
            <span className="text-xs text-red-300">{timestamp}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="text-red-300 font-mono text-sm">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <Terminal className="h-3 w-3" />
              <span>Error Details:</span>
            </div>
            <div className="bg-red-900/50 p-2 rounded border border-red-800">
              {result.message}
            </div>
            {result.stderr && (
              <div className="mt-2">
                <div className="text-red-400 text-xs mb-1">STDERR:</div>
                <div className="bg-red-900/30 p-2 rounded border border-red-800 text-xs">
                  {result.stderr}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (result.status === 'success' && result.output) {
    return (
      <div className={`bg-gray-950 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
        {/* Terminal Header */}
        <div className="bg-gray-900 px-3 py-2 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Terminal - Job #{jobId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{timestamp}</span>
              <button
                onClick={() => copyToClipboard(result.output)}
                className="p-1 rounded hover:bg-gray-800 transition-colors"
                title="Copy output"
              >
                {isCopied ? (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Command Info */}
        {result.command && (
          <div className="bg-gray-900/50 px-3 py-2 border-b border-gray-800">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono">
              <Terminal className="h-3 w-3" />
              <span className="text-gray-500">$</span>
              <span>{result.command}</span>
              {result.note && (
                <span className="text-yellow-400 text-xs">({result.note})</span>
              )}
            </div>
          </div>
        )}
        
        {/* Output */}
        <div className="p-4 font-mono text-sm text-green-400">
          <pre className="whitespace-pre-wrap break-words leading-relaxed">
            {result.output}
          </pre>
        </div>
        
        {/* Footer with stats */}
        <div className="bg-gray-900/30 px-3 py-1 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Lines: {result.output.split('\n').length}</span>
            <span>Characters: {result.output.length}</span>
          </div>
        </div>
      </div>
    );
  }

  if (result.status === 'pending') {
    return (
      <div className={`bg-yellow-950 border border-yellow-800 rounded-lg overflow-hidden ${className}`}>
        <div className="bg-yellow-900 px-3 py-2 border-b border-yellow-800">
          <div className="flex items-center gap-2 text-yellow-200 text-sm">
            <Clock className="h-3 w-3 animate-spin" />
            <span>Command Executing - Job #{jobId}</span>
          </div>
        </div>
        <div className="p-4 text-yellow-300 font-mono text-sm">
          <div className="flex items-center gap-2">
            <div className="animate-pulse">⚡</div>
            <span>Processing command...</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
