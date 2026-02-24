"use client";

import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, FolderKanban, Search, LogOut, FileQuestion } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const menuItems = [
        { label: "Home", href: "/dashboard", icon: LayoutDashboard },
        { label: "Workspaces", href: "/dashboard/workspaces", icon: FolderKanban },
        { label: "Document QA", href: "/dashboard/document-qa", icon: FileQuestion },
        { label: "Deep Search", href: "/dashboard/deep-search", icon: Search },
    ];

    const userInitial = session?.user?.name
        ? session.user.name.substring(0, 2).toUpperCase()
        : session?.user?.email
            ? session.user.email.substring(0, 2).toUpperCase()
            : "??";

    return (
        <aside className="w-72 bg-card border-r border-border p-8 flex flex-col shadow-2xl shrink-0">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <LayoutDashboard className="text-white w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter gradient-text uppercase">ANTIGRAVITY</h1>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-2xl border border-border">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                        {userInitial}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm truncate">{session?.user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{session?.user?.email || "No email"}</p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
