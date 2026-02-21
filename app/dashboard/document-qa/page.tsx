import DocumentQA from "@/components/DocumentQA";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, Search, LogOut, FileQuestion } from "lucide-react";

export default function DocumentQAPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            {/* Sidebar */}
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
                    <Link href="/dashboard/workspaces" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all">
                        <FolderKanban size={20} />
                        Workspaces
                    </Link>
                    <Link href="/dashboard/document-qa" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-all">
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

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-12">
                    <h2 className="text-4xl font-black tracking-tight mb-2">Document QA</h2>
                    <p className="text-muted-foreground text-lg">Upload a document and ask questions — powered by AI.</p>
                </header>

                <div className="max-w-3xl">
                    <div className="premium-card">
                        <DocumentQA />
                    </div>
                </div>
            </main>
        </div>
    );
}
