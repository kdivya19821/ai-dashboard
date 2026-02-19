import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black text-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-20">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-white/10 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 lg:static lg:w-auto lg:rounded-xl lg:border lg:p-4">
                    Empowering your productivity with AI
                </p>
            </div>

            <div className="relative flex flex-col items-center mb-16">
                <h1 className="text-7xl font-extrabold tracking-tight mb-4 gradient-text text-center">
                    AI Workspace
                </h1>
                <p className="text-xl text-slate-400 text-center max-w-2xl">
                    Summarize YouTube videos, chat with multiple documents, and perform deep web research—all in one place.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link
                    href="/login"
                    className="premium-card group hover:border-blue-500/50 transition-all"
                >
                    <h2 className="mb-3 text-2xl font-semibold">
                        Login{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                            -&gt;
                        </span>
                    </h2>
                    <p className="m-0 text-slate-400">
                        Access your secure workspace and pick up where you left off.
                    </p>
                </Link>

                <Link
                    href="/signup"
                    className="premium-card group hover:border-indigo-500/50 transition-all border-indigo-500/20"
                >
                    <h2 className="mb-3 text-2xl font-semibold">
                        Get Started{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                            -&gt;
                        </span>
                    </h2>
                    <p className="m-0 text-slate-400">
                        Create an account and join the future of AI-powered work.
                    </p>
                </Link>
            </div>
        </main>
    );
}
