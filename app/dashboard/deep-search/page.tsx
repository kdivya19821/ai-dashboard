"use client";

import { useState } from "react";
import { Search, Sparkles, Link as LinkIcon, ExternalLink, AlertCircle, LayoutDashboard, FolderKanban, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DeepSearch() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{ text: string; links: { title: string; url: string }[] } | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/deep-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            {/* Sidebar (Shared) */}
            <aside className="w-72 bg-card border-r border-border p-8 flex flex-col shadow-2xl shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <LayoutDashboard className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter gradient-text">ANTIGRAVITY</h1>
                </div>

                <nav className="flex-1 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all">
                        <LayoutDashboard size={20} />
                        Home
                    </Link>
                    <Link href="/dashboard/workspaces" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all">
                        <FolderKanban size={20} />
                        Workspaces
                    </Link>
                    <Link href="/dashboard/deep-search" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-all">
                        <Search size={20} />
                        Deep Search
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-border">
                    <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-2xl border border-border">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-sm truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@dashboard.io</p>
                        </div>
                        <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                <header className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-4">
                        Deep Search <Sparkles className="text-primary animate-pulse" />
                    </h2>
                    <p className="text-muted-foreground text-lg">Autonomous web research synthesized with instant intelligence.</p>
                </header>

                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-3 mb-12 p-2 bg-card rounded-2xl border border-border shadow-2xl focus-within:border-primary/50 transition-all">
                        <div className="flex-1 flex items-center px-4">
                            <Search className="text-muted-foreground mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="What do you want to research today?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {loading ? "Searching..." : "Research"}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive font-medium animate-in fade-in slide-in-from-top-4">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="premium-card !p-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Sparkles size={120} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                                    <div className="h-1 w-6 bg-primary rounded-full" />
                                    Synthesized Report
                                </h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-foreground/90 leading-relaxed text-xl whitespace-pre-wrap font-medium">
                                        {result.text}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.links.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-5 bg-card rounded-2xl border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                                <LinkIcon size={20} />
                                            </div>
                                            <span className="font-bold text-foreground truncate max-w-[200px]">{link.title}</span>
                                        </div>
                                        <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {!result && !loading && (
                        <div className="py-20 text-center flex flex-col items-center opacity-20">
                            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6 border border-border">
                                <Search size={40} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Intelligence on Demand</h3>
                            <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest mt-2">Enter a query to start web-scale research</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
