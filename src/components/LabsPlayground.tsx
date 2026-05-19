import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, HelpCircle, Terminal, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LabsPlaygroundProps {
  moduleName: string;
  courseTitle: string;
  labInstructions: string;
}

export function LabsPlayground({ moduleName, courseTitle, labInstructions }: LabsPlaygroundProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Derive target template based on module name
  const getInitialCode = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('introduction') || nameLower.includes('intro')) {
      return `# Python Lab: First Script\n\nname = "Scout Developer"\nprint("Hello, World!")\nprint("Welcome to " + name + " course!")\n`;
    }
    if (nameLower.includes('type') || nameLower.includes('variable')) {
      return `# Python Lab: Types & Variables\n\nitem_name = "Laptop"\nprice = 999.99\nquantity = 3\n\ntotal_cost = price * quantity\nprint("Item: " + item_name)\nprint("Total calculated cost: $" + str(total_cost))\n`;
    }
    if (nameLower.includes('control') || nameLower.includes('loop') || nameLower.includes('flow')) {
      return `# Python Lab: Control Flow & Loops\n\nlimit = 5\nprint("Counting to boundary:")\nfor i in range(1, limit + 1):\n    if i % 2 == 0:\n        print(str(i) + " is even")\n    else:\n        print(str(i) + " is odd")\n`;
    }
    if (nameLower.includes('function') || nameLower.includes('scope')) {
      return `# Python Lab: Reusable Functions\n\ndef calculate_tip(bill, rate=15):\n    return bill * (rate / 100)\n\ntip = calculate_tip(100, 18)\nprint("The custom tip is: $" + str(tip))\n`;
    }
    if (nameLower.includes('lists') || nameLower.includes('dictionary') || nameLower.includes('tuples')) {
      return `# Python Lab: Collections & Arrays\n\ntech_stack = ["Python", "Docker", "Svelte", "FastAPI"]\nprint("Original stack: " + str(tech_stack))\nprint("First service: " + tech_stack[0])\n`;
    }
    return `# Practice Lab Playground\n\nprint("Executing code...")\nprint("Ready for scripting context!")\n`;
  };

  useEffect(() => {
    setCode(getInitialCode(moduleName));
    setOutput([]);
    setHasError(false);
    setSuccessMsg(null);
  }, [moduleName]);

  const handleReset = () => {
    setCode(getInitialCode(moduleName));
    setOutput([]);
    setHasError(false);
    setSuccessMsg(null);
  };

  // Safe browser executor for python-like standard prints
  const handleRun = () => {
    setIsRunning(true);
    setHasError(false);
    setSuccessMsg(null);

    // Give it a tiny visual delay to feel realistic
    setTimeout(() => {
      const logs: string[] = [];
      let executionError = false;

      try {
        const lines = code.split('\n');
        const scope: Record<string, any> = {};

        // A simple script interpreter block for standard python constructs
        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i].trim();
          if (!rawLine || rawLine.startsWith('#')) continue;

          // Replace python expressions/statements slightly
          // 1. print(...) statement
          if (rawLine.startsWith('print(') && rawLine.endsWith(')')) {
            const inner = lines[i].slice(lines[i].indexOf('print(') + 6, lines[i].lastIndexOf(')'));
            // Try to resolve variable string mappings or basic values
            try {
              // Convert simple str() and variable references to executable JS
              let jsExpression = inner
                .replace(/str\((.*?)\)/g, '$1') // remove str(...) wraps
                .replace(/range\((.*?)\)/g, 'range') // placeholder
                .trim();

              // Evaluate in local variables context
              const evalFn = new Function(...Object.keys(scope), `return (${jsExpression});`);
              const val = evalFn(...Object.values(scope));
              logs.push(String(val));
            } catch (err: any) {
              logs.push(`SyntaxError on line ${i + 1}: Check variable scope or string concatenation.`);
              executionError = true;
              break;
            }
          }
          // 2. Loop ranges: for i in range(...)
          else if (rawLine.startsWith('for ') && rawLine.includes(' in range(')) {
            // Find colon
            const colonIdx = lines[i].indexOf(':');
            const loopHeader = lines[i].slice(0, colonIdx !== -1 ? colonIdx : undefined);
            const loopMatch = loopHeader.match(/for\s+(\w+)\s+in\s+range\((.*?)\)/);
            if (loopMatch) {
              const varName = loopMatch[1];
              const rangeArgs = loopMatch[2].split(',').map(x => x.trim());
              let start = 0;
              let end = 0;
              if (rangeArgs.length === 1) {
                end = parseInt(rangeArgs[0], 10) || 0;
              } else if (rangeArgs.length >= 2) {
                start = parseInt(rangeArgs[0], 10) || 0;
                end = parseInt(rangeArgs[1], 10) || 0;
              }

              // Parse loop block nested lines
              const loopLines: string[] = [];
              let nextIdx = i + 1;
              while (nextIdx < lines.length && (lines[nextIdx].startsWith(' ') || lines[nextIdx].startsWith('\t') || !lines[nextIdx].trim())) {
                loopLines.push(lines[nextIdx]);
                nextIdx++;
              }

              // Simulate loop run
              for (let loopVal = start; loopVal < end; loopVal++) {
                scope[varName] = loopVal;
                // Run interior lines
                for (const loopLine of loopLines) {
                  const subLine = loopLine.trim();
                  if (!subLine || subLine.startsWith('#')) continue;

                  // Simple nested print
                  if (subLine.startsWith('print(') && subLine.endsWith(')')) {
                    const inner = loopLine.slice(loopLine.indexOf('print(') + 6, loopLine.lastIndexOf(')'));
                    try {
                      let jsExpression = inner.replace(/str\((.*?)\)/g, '$1').trim();
                      const evalFn = new Function(...Object.keys(scope), `return (${jsExpression});`);
                      const val = evalFn(...Object.values(scope));
                      logs.push(String(val));
                    } catch (err) {
                      logs.push(`RuntimeError inside loop context.`);
                      executionError = true;
                      break;
                    }
                  } else if (subLine.includes('=')) {
                    // Assignment in loop
                    const parts = subLine.split('=');
                    const vName = parts[0].trim();
                    const expr = parts[1].trim();
                    try {
                      const evalFn = new Function(...Object.keys(scope), `return (${expr});`);
                      scope[vName] = evalFn(...Object.values(scope));
                    } catch (e) {}
                  }
                }
                if (executionError) break;
              }
              // Skip outer interpreter past the loop body we already ran
              i = nextIdx - 1;
            }
          }
          // 3. Simple variable assignments: name = "Developer"
          else if (rawLine.includes('=')) {
            const parts = rawLine.split('=');
            const varName = parts[0].trim();
            const expression = parts.slice(1).join('=').trim();
            
            // Check list bracket format slightly
            if (expression.startsWith('[') && expression.endsWith(']')) {
              try {
                // simple list array parse
                const arrayStr = expression.slice(1, -1);
                scope[varName] = arrayStr.split(',').map(x => {
                  const cleaned = x.trim();
                  if (cleaned.startsWith('"') || cleaned.startsWith("'")) {
                    return cleaned.slice(1, -1);
                  }
                  return parseFloat(cleaned) || cleaned;
                });
              } catch (err) {
                scope[varName] = [];
              }
            } else {
              try {
                // Evaluate mathematical logic or basic string constants
                const evalFn = new Function(...Object.keys(scope), `return (${expression});`);
                scope[varName] = evalFn(...Object.values(scope));
              } catch (err) {
                // String fallback
                if (expression.startsWith('"') || expression.startsWith("'")) {
                  scope[varName] = expression.slice(1, -1);
                } else {
                  scope[varName] = expression;
                }
              }
            }
          }
        }
      } catch (globalErr: any) {
        logs.push(`ParserError: Script execution ran into a boundary limit.`);
        executionError = true;
      }

      setOutput(logs.length > 0 ? logs : ["(Script executed successfully but produced no output)"]);
      setHasError(executionError);
      setIsRunning(false);

      if (!executionError) {
        setSuccessMsg("Great job! Practice exercise completed successfully.");
      }
    }, 600);
  };

  return (
    <div className="bg-surface-elevated/40 border border-brand-border/60 rounded-3xl overflow-hidden mt-6">
      {/* Editor Header */}
      <div className="bg-surface-elevated/80 border-b border-brand-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-500/10 text-green-400 rounded-lg">
            <Terminal size={18} />
          </div>
          <div>
            <h4 className="font-display font-black text-sm text-white">In-Browser Practice Lab</h4>
            <p className="text-[10px] text-muted-text uppercase tracking-wider font-semibold">Active Python Practice Area</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-surface-base text-muted-text hover:text-white border border-brand-border rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            title="Reset code to original template"
          >
            <RotateCcw size={14} /> Reset
          </button>
          
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-1.5 bg-primary hover:bg-secondary text-white rounded-lg text-xs font-black tracking-wider transition-all flex items-center gap-1.5 shadow-purple-glow"
          >
            {isRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
            Run Code
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Code Editor Input */}
        <div className="border-r border-brand-border flex flex-col">
          <div className="px-4 py-2 bg-surface-base/30 border-b border-brand-border/40 flex items-center justify-between text-[11px] text-muted-text font-mono font-bold">
            <span>workspace.py</span>
            <span className="text-secondary select-none">🐍 python 3</span>
          </div>

          <div className="relative font-mono text-sm leading-6 flex flex-1 min-h-[220px]">
            {/* Simple Line Numbers Gutter */}
            <div className="py-4 px-3 bg-surface-base/20 border-r border-brand-border/30 text-right text-muted-text select-none text-xs min-w-[36px]">
              {Array.from({ length: Math.max(8, code.split('\n').length) }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent text-off-white outline-none resize-none p-4 font-mono text-xs border-none focus:ring-0 custom-scrollbar leading-6"
              spellCheck={false}
              placeholder="# Write your custom Python code here..."
            />
          </div>
        </div>

        {/* Right: Output Panel */}
        <div className="flex flex-col bg-black/20">
          <div className="px-4 py-2 bg-surface-base/30 border-b border-brand-border/40 flex items-center justify-between text-[11px] text-muted-text font-mono font-bold">
            <span>terminal_output.log</span>
            {successMsg && <span className="text-emerald-400 font-extrabold flex items-center gap-1"><CheckCircle2 size={11} /> Passed</span>}
          </div>

          <div className="p-5 font-mono text-xs space-y-2.5 flex-1 min-h-[220px] custom-scrollbar overflow-y-auto bg-surface-base/10">
            {output.length > 0 ? (
              output.map((line, idx) => (
                <div 
                  key={idx} 
                  className={
                    line.includes('Error') 
                      ? 'text-red-400 flex items-center gap-2 font-medium' 
                      : 'text-emerald-400 font-bold'
                  }
                >
                  {line.includes('Error') && <AlertTriangle size={14} className="shrink-0" />}
                  {line}
                </div>
              ))
            ) : (
              <div className="text-muted-text italic">
                Click "Run Code" to compile your workspace draft and review output.
              </div>
            )}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-6 py-3 flex items-center gap-2.5 text-xs text-emerald-400 font-bold animate-pulse">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
