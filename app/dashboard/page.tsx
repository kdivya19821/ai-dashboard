import YouTubeTool from "@/components/YouTubeTool";
import Link from "next/link";
import { PlusCircle, FileQuestion } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            <Sidebar />

            {/* Main Content */}

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

                    <Link href="/dashboard/document-qa" className="premium-card flex flex-col justify-center items-center text-center group hover:border-indigo-500/50 transition-all">
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                            <FileQuestion className="text-muted-foreground w-8 h-8 group-hover:text-primary transition-colors" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Document QA</h2>
                        <p className="text-muted-foreground mb-8 max-w-xs">Upload a PDF or text file and ask questions about its content using AI.</p>

                        <div className="w-full bg-secondary/30 rounded-xl p-6 border border-dashed border-border flex flex-col items-center group-hover:border-primary/30 transition-colors">
                            <p className="text-sm font-medium text-primary">Try it now →</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
