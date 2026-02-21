"use client";

import { useState, useRef } from "react";
import {
    Upload,
    FileText,
    Send,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    X,
} from "lucide-react";

export default function DocumentQA() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [documentContent, setDocumentContent] = useState("");
    const [documentName, setDocumentName] = useState("");
    const [error, setError] = useState("");

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            const name = f.name.toLowerCase();
            if (!name.endsWith(".pdf") && !name.endsWith(".txt")) {
                setError("Only PDF and TXT files are supported.");
                return;
            }
            setFile(f);
            setError("");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            const f = e.dataTransfer.files[0];
            const name = f.name.toLowerCase();
            if (!name.endsWith(".pdf") && !name.endsWith(".txt")) {
                setError("Only PDF and TXT files are supported.");
                return;
            }
            setFile(f);
            setError("");
        }
    };

    const uploadFile = async () => {
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/document-qa/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setDocumentContent(data.content);
            setDocumentName(data.filename);
        } catch (err: any) {
            setError(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const askQuestion = async () => {
        if (!query.trim() || !documentContent) return;
        setLoading(true);
        setError("");
        const currentQuery = query;
        setQuery("");

        try {
            const res = await fetch("/api/document-qa/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: currentQuery, context: documentContent }),
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setHistory((prev) => [...prev, { question: currentQuery, answer: data.answer }]);
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (err: any) {
            setError(err.message || "Failed to get answer");
            setQuery(currentQuery);
        } finally {
            setLoading(false);
        }
    };

    const resetDocument = () => {
        setFile(null);
        setDocumentContent("");
        setDocumentName("");
        setHistory([]);
        setError("");
        setQuery("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Upload phase
    if (!documentContent) {
        return (
            <div className="w-full">
                <div className="flex items-center gap-2 mb-6">
                    <FileText className="text-primary w-6 h-6" />
                    <h2 className="text-xl font-bold tracking-tight">Document QA</h2>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                    Upload a PDF or text file and ask questions about its content using AI.
                </p>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors mb-4"
                >
                    <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                    {file ? (
                        <p className="text-foreground font-semibold">{file.name}</p>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            Click or drag a file here (PDF / TXT)
                        </p>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-xs font-medium">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={uploadFile}
                        disabled={!file || uploading}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        {uploading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles size={16} />
                        )}
                        {uploading ? "Processing..." : "Upload & Analyze"}
                    </button>
                </div>
            </div>
        );
    }

    // Chat phase
    return (
        <div className="w-full flex flex-col h-full max-h-[600px]">
            {/* Active document banner */}
            <div className="flex items-center justify-between mb-6 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary" size={18} />
                    <div>
                        <p className="font-bold text-sm">{documentName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            Document Loaded — Ask anything
                        </p>
                    </div>
                </div>
                <button
                    onClick={resetDocument}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                    title="Upload a different file"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-border">
                {history.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                        <p className="max-w-xs text-sm">
                            Ask anything about <span className="font-semibold text-foreground">{documentName}</span>.
                        </p>
                    </div>
                )}

                {history.map((item, i) => (
                    <div key={i} className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        {/* User message */}
                        <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm font-medium shadow-md">
                                {item.question}
                            </div>
                        </div>
                        {/* AI answer */}
                        <div className="flex justify-start">
                            <div className="bg-secondary/50 border border-border px-5 py-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <Sparkles size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        AI Answer
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {item.answer}
                                </p>
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

                <div ref={chatEndRef} />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive text-xs font-medium">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Input */}
            <div className="flex gap-2 p-1.5 bg-card rounded-2xl border border-border shadow-xl focus-within:border-primary/50 transition-colors">
                <input
                    type="text"
                    placeholder="Ask a question about your document..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                    className="flex-1 px-4 py-2 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <button
                    onClick={askQuestion}
                    disabled={loading || !query.trim()}
                    className="w-10 h-10 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] disabled:scale-100 disabled:opacity-50 transition-all flex items-center justify-center"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
