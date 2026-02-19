import YouTubeTool from "@/components/YouTubeTool";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, Search, User, LogOut, PlusCircle } from "lucide-react";

export default function DashboardPage() {
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
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold transition-all">
                        <LayoutDashboard size={20} />
                        Home
                    </Link>
                    <Link href="/dashboard/workspaces" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all">
                        <FolderKanban size={20} />
                        Workspaces
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
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Command Center</h2>
                        <p className="text-muted-foreground text-lg">Harness the power of multi-document AI intelligence.</p>
                    </div>
                    <Link href="/dashboard/workspaces" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                        <PlusCircle size={20} />
                        New Workspace
                    </Link>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div className="premium-card relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <YouTubeTool />
                    </div>

                    <div className="premium-card flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border">
                            <FolderKanban className="text-muted-foreground w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Recent Knowledge</h2>
                        <p className="text-muted-foreground mb-8 max-w-xs">Upload PDFs to your workspaces to start cross-document analysis.</p>

                        <div className="w-full bg-secondary/30 rounded-xl p-8 border border-dashed border-border flex flex-col items-center">
                            <p className="text-sm font-medium text-muted-foreground">No documents found in recent activity</p>
                            <Link href="/dashboard/workspaces" className="mt-4 text-primary font-bold hover:underline">
                                Visit Workspaces
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
