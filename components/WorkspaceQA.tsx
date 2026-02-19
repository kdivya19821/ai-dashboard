"use client";

import { useState } from "react";
import { Send, FileText, Sparkles, MessageSquare, AlertCircle } from "lucide-react";

interface Workspace {
    id: string;
    name: string;
    documents: { id: string; name: string }[];
}

export default function WorkspaceQA({ workspace }: { workspace: Workspace }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [history, setHistory] = useState<{ query: string; answer: { text: string; sources: string[] } }[]>([]);

    const handleAsk = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/qa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, workspaceId: workspace.id }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setHistory(prev => [{ query, answer: data }, ...prev]);
            setQuery("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to get answer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 scrollbar-thin scrollbar-thumb-border">
                {history.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p className="max-w-xs text-sm">Ask anything about the {workspace.documents.length} documents in this workspace.</p>
                    </div>
                )}

                {history.map((item, i) => (
                    <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm font-medium shadow-md">
                                {item.query}
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-secondary/50 border border-border px-5 py-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <Sparkles size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">AI Result</span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{item.answer.text}</p>
                                {item.answer.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                        <span>Sources:</span>
                                        {item.answer.sources.map((s, idx) => (
                                            <span key={idx} className="bg-secondary px-1.5 py-0.5 rounded border border-border flex items-center gap-1">
                                                <FileText size={10} /> {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-secondary/50 border border-border px-5 py-4 rounded-2xl rounded-tl-sm w-full max-w-[70%]">
                            <div className="h-2 w-20 bg-primary/20 rounded mb-3" />
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-border/50 rounded" />
                                <div className="h-2 w-3/4 bg-border/50 rounded" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-xs font-medium">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="flex gap-2 p-1.5 bg-card rounded-2xl border border-border shadow-xl focus-within:border-primary/50 transition-colors">
                <input
                    type="text"
                    placeholder={`Query documents...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    className="flex-1 px-4 py-2 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <button
                    onClick={handleAsk}
                    disabled={loading || !query.trim()}
                    className="w-10 h-10 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] disabled:scale-100 disabled:opacity-50 transition-all flex items-center justify-center"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
