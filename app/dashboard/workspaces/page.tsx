"use client";

import { useState, useEffect } from "react";
import WorkspaceQA from "@/components/WorkspaceQA";
import { FolderPlus, FileUp, Files, MessageSquare, ChevronRight, LayoutDashboard, FolderKanban, Search, LogOut, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function WorkspacesPage() {
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
    const [name, setName] = useState("");
    const [isUploading, setIsUploading] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/workspaces").then(res => res.json()).then(data => {
            setWorkspaces(data);
            if (data.length > 0 && !activeWorkspace) setActiveWorkspace(data[0]);
        });
    }, []);

    const createWorkspace = async () => {
        if (!name.trim()) return;
        const res = await fetch("/api/workspaces", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        setWorkspaces([...workspaces, data]);
        setActiveWorkspace(data);
        setName("");
    };

    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, wsId: string) => {
        if (!e.target.files?.[0]) return;
        setIsUploading(wsId);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("workspaceId", wsId);

        try {
            await fetch("/api/documents", { method: "POST", body: formData });
            const res = await fetch("/api/workspaces");
            const data = await res.json();
            setWorkspaces(data);
            const updated = data.find((w: any) => w.id === wsId);
            if (activeWorkspace?.id === wsId) setActiveWorkspace(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            {/* Sidebar (Shared) */}
            <aside className="w-72 bg-card border-r border-border p-8 flex flex-col shadow-2xl">
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
                    <Link href="/dashboard/workspaces" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-all">
                        <FolderKanban size={20} />
                        Workspaces
                    </Link>
                    <Link href="/dashboard/document-qa" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all">
                        <FileQuestion size={20} />
                        Document QA
                    </Link>
                    <Link href="/dashboard/deep-search" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all">
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

            <main className="flex-1 p-10 overflow-hidden flex flex-col gap-10">
                <header className="flex justify-between items-end shrink-0">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">My Workspaces</h2>
                        <p className="text-muted-foreground text-lg">Manage and analyze your document collections.</p>
                    </div>
                    <div className="flex gap-2 p-1 bg-secondary/50 border border-border rounded-2xl">
                        <input
                            type="text"
                            placeholder="Workspace Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-transparent px-4 py-2 outline-none text-sm w-48 placeholder:text-muted-foreground"
                        />
                        <button onClick={createWorkspace} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2">
                            <FolderPlus size={16} />
                            Create
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex gap-10 overflow-hidden">
                    {/* Workspace List */}
                    <div className="w-80 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Collections</h3>
                        <div className="space-y-3">
                            {workspaces.map(ws => (
                                <div
                                    key={ws.id}
                                    onClick={() => setActiveWorkspace(ws)}
                                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${activeWorkspace?.id === ws.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border bg-card hover:border-border/80 hover:bg-secondary/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{ws.name}</h3>
                                        <ChevronRight size={16} className={`transition-transform ${activeWorkspace?.id === ws.id ? 'text-primary' : 'text-muted-foreground group-hover:translate-x-1'}`} />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Files size={12} />
                                        {ws.documents?.length || 0} Documents
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-tighter bg-secondary px-2 py-1 rounded cursor-pointer hover:bg-primary hover:text-white transition-colors flex items-center gap-1">
                                            <FileUp size={10} />
                                            {isUploading === ws.id ? "Uploading..." : "Add File"}
                                            <input type="file" className="hidden" onChange={(e) => uploadFile(e, ws.id)} disabled={!!isUploading} />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Workspace View */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {activeWorkspace ? (
                            <div className="flex-1 premium-card flex flex-col overflow-hidden !p-0">
                                <div className="p-8 border-b border-border flex justify-between items-center bg-secondary/10 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                            <FolderKanban size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">{activeWorkspace.name}</h2>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Active Analysis Session</p>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {activeWorkspace.documents?.slice(0, 3).map((d: any, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[10px] shadow-lg" title={d.name}>
                                                📄
                                            </div>
                                        ))}
                                        {activeWorkspace.documents?.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary shadow-lg">
                                                +{activeWorkspace.documents.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 p-8 overflow-hidden flex flex-col">
                                    <WorkspaceQA workspace={activeWorkspace} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 bg-secondary/20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 bg-background rounded-3xl shadow-xl flex items-center justify-center mb-6">
                                    <MessageSquare className="text-muted-foreground/30 w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Intelligence Ready</h3>
                                <p className="text-muted-foreground max-w-sm">Select a collection from the left to start analyzing documents with AI.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
