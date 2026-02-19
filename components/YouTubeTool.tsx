"use client";

import { useState } from "react";
import { Youtube, Sparkles, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function YouTubeTool() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{ summary: string; notes: string[] } | null>(null);

    const handleSummarize = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoUrl: url }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to process video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-6">
                <Youtube className="text-red-500 w-6 h-6" />
                <h2 className="text-xl font-bold tracking-tight">YouTube AI Summarizer</h2>
            </div>

            <div className="flex gap-2 mb-8 p-1.5 bg-secondary/50 rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
                <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-4 py-2 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <button
                    onClick={handleSummarize}
                    disabled={loading || !url}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles size={16} />
                    )}
                    {loading ? "Processing" : "Summarize"}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="relative p-6 bg-secondary/30 rounded-2xl border border-border">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <CheckCircle2 size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">The Gist</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4">
                            "{result.summary}"
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="text-indigo-400" size={18} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Key Study Notes</h3>
                        </div>
                        <ul className="grid grid-cols-1 gap-3">
                            {result.notes.map((note, i) => (
                                <li key={i} className="group p-4 bg-secondary/20 rounded-xl border border-border hover:border-primary/30 transition-all flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm text-foreground/90 leading-tight">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            )}
        </div>
    );
}
