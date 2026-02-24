import DocumentQA from "@/components/DocumentQA";
import Sidebar from "@/components/Sidebar";

export default function DocumentQAPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">
            <Sidebar />

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
