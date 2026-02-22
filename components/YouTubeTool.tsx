"use client";

import { useState, useEffect } from "react";
import { Youtube, Sparkles, BookOpen, AlertCircle, CheckCircle2, FolderPlus, Loader2, Check } from "lucide-react";

export default function YouTubeTool() {
    const [url, setUrl] = useState("");
    const [manualTranscript, setManualTranscript] = useState("");
    const [showManual, setShowManual] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{ summary: string; notes: string[]; transcript: string } | null>(null);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState("");

    useEffect(() => {
        fetch("/api/workspaces")
            .then(res => res.json())
            .then(data => {
                setWorkspaces(data);
                if (data.length > 0) setSelectedWorkspace(data[0].id);
            })
            .catch(err => console.error("Failed to fetch workspaces", err));
    }, []);

    const handleSummarize = async (isManual = false) => {
        setLoading(true);
        setError("");
        setSaveSuccess(false);
        if (!isManual) setResult(null); // Clear previous result when starting fresh

        try {
            const body: any = { videoUrl: url };
            if (isManual) {
                if (!manualTranscript.trim()) throw new Error("Please paste a transcript first.");
                body.transcript = manualTranscript;
            }

            const res = await fetch("/api/youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            // Try to parse as JSON, but handle errors gracefully
            const contentType = res.headers.get("content-type");
            let data: any;

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                data = { message: text };
            }

            // Check for explicit transcript disabled error
            if (data.error === "TRANSCRIPT_DISABLED" || data.message?.includes("Transcript is disabled")) {
                setShowManual(true);
                setError("Transcripts are disabled for this video. You can try manual pasting below.");
                return; // Stop here, user will see the amber box
            }

            if (!res.ok) throw new Error(data.message || "Failed to process video");

            setResult(data);
            if (isManual) setShowManual(false);
            setError("");
        } catch (err: any) {
            console.error("Summarize Error:", err);
            setError(err.message || "Failed to process video");

            // Fallback: If we see transcript disabled in the error, show manual
            if (err.message?.includes("Transcript") || err.message?.includes("disabled")) {
                setShowManual(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToWorkspace = async () => {
        if (!selectedWorkspace || !result) return;
        setSaving(true);
        setSaveSuccess(false);
        try {
            const formData = new FormData();
            formData.append("workspaceId", selectedWorkspace);
            formData.append("name", `YouTube Summary: ${url.substring(0, 20)}...`);
            formData.append("content", `SUMMARY:\n${result.summary}\n\nTRANSCRIPT:\n${result.transcript}`);

            const res = await fetch("/api/documents", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error(await res.text());
            setSaveSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save to workspace: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Youtube className="text-red-500 w-6 h-6" />
                    <h2 className="text-xl font-bold tracking-tight">YouTube AI Summarizer</h2>
                </div>
                {result && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <select
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="text-xs bg-secondary/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                        >
                            {workspaces.map(ws => (
                                <option key={ws.id} value={ws.id}>{ws.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleSaveToWorkspace}
                            disabled={saving || !selectedWorkspace}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${saveSuccess ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:scale-[1.05]'}`}
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : saveSuccess ? <Check size={14} /> : <FolderPlus size={14} />}
                            {saving ? "Saving..." : saveSuccess ? "Saved" : "Save to Workspace"}
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-2xl border border-border focus-within:border-primary/50 transition-colors">
                    <input
                        type="text"
                        placeholder="Paste YouTube Link..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 px-4 py-2 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    />
                    <button
                        onClick={() => handleSummarize(false)}
                        disabled={loading || !url}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {loading && !showManual ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles size={16} />
                        )}
                        {loading && !showManual ? "Processing" : "Summarize"}
                    </button>
                </div>

                {!showManual && !result && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowManual(true)}
                            className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <BookOpen size={12} /> Can't get transcript? Paste manually
                        </button>
                    </div>
                )}

                {showManual && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <BookOpen size={14} /> Manual Transcript Paste
                            </label>
                            <button
                                onClick={() => {
                                    setShowManual(false);
                                    setError("");
                                }}
                                className="text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                        </div>
                        <textarea
                            placeholder="Paste the transcript or video captions here..."
                            value={manualTranscript}
                            onChange={(e) => setManualTranscript(e.target.value)}
                            className="w-full h-40 p-4 bg-secondary/30 border border-border rounded-xl text-sm outline-none focus:border-primary/50 transition-colors resize-none scrollbar-thin"
                        />
                        <button
                            onClick={() => handleSummarize(true)}
                            disabled={loading || !manualTranscript.trim()}
                            className="w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Summarize Manual Content
                        </button>
                    </div>
                )}
            </div>

            {error && !showManual && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 text-destructive text-sm font-medium">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                    {(error.toLowerCase().includes("transcript") || error.toLowerCase().includes("disabled")) && (
                        <button
                            onClick={() => {
                                setShowManual(true);
                                setError("");
                            }}
                            className="w-fit ml-7 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 rounded-lg text-xs font-bold text-destructive transition-colors border border-destructive/20"
                        >
                            Use Manual Paste Instead
                        </button>
                    )}
                </div>
            )}

            {error && showManual && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-500 text-xs leading-tight animate-in fade-in">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold mb-1">Transcript Issue Detected</p>
                        <p className="opacity-80">We couldn't fetch the transcript automatically. Please paste the captions manually below to continue.</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
