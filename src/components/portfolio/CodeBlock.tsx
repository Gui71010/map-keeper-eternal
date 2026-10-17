import { useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setError(false); setTimeout(() => setCopied(false), 2000); }
    catch { setError(true); }
  };
  return <div className="code-window">
    <div className="flex items-center justify-between border-b border-border px-5 py-2.5"><span className="flex items-center gap-2 font-mono text-xs text-muted-foreground"><FileCode2 className="size-4 text-primary" />{filename}</span><Button variant="ghost" size="icon" aria-label="Copiar código" title="Copiar código" onClick={copy}>{copied ? <Check className="text-accent" /> : <Copy />}</Button></div>
    {error && <p className="px-5 text-sm text-destructive">Não foi possível copiar o código.</p>}
    <pre className="overflow-x-auto p-5 text-xs leading-7 md:text-sm"><code>{code.split('\n').map((line, index) => <span key={index} className="block"><span className="mr-5 inline-block w-5 select-none text-right text-muted-foreground/50">{index + 1}</span><span className={line.trim().startsWith('#') || line.trim().startsWith('--') ? 'text-muted-foreground' : /^(import|from|SELECT|WITH|WHERE|ORDER|GROUP|JOIN)/.test(line.trim()) ? 'text-primary' : 'text-code'}>{line || ' '}</span></span>)}</code></pre>
  </div>;
}
