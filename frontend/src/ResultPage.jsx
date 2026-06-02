import { useMemo } from "react";

function scoreColor(score) {
    if (score > 80) {
        return "text-emerald-400";
    }
    if (score >= 60) {
        return "text-amber-400";
    }
    return "text-red-400";
}

function ringColor(score) {
    if (score > 80) {
        return "stroke-emerald-400";
    }
    if (score >= 60) {
        return "stroke-amber-400";
    }
    return "stroke-red-400";
}

function progressColor(score) {
    if (score > 80) {
        return "bg-emerald-400";
    }
    if (score >= 60) {
        return "bg-amber-400";
    }
    return "bg-red-400";
}

function clampScore(score) {
    if (Number.isNaN(score)) {
        return 0;
    }
    return Math.max(0, Math.min(100, score));
}

function SectionCard({ title, data }) {
    const normalizedScore = clampScore(data?.score ?? 0);

    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <span className={`text-sm font-semibold ${scoreColor(normalizedScore)}`}>
                    {normalizedScore}/100
                </span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${progressColor(normalizedScore)}`}
                    style={{ width: `${normalizedScore}%` }}
                />
            </div>
            <p className="mt-4 text-sm text-gray-300">
                {data?.feedback || "No feedback provided."}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {(data?.improvements || []).length === 0 ? (
                    <li className="text-gray-500">No improvements listed.</li>
                ) : (
                    data.improvements.map((item, index) => (
                        <li key={`${title}-improvement-${index}`} className="flex gap-2">
                            <span
                                className={`mt-1 h-1.5 w-1.5 rounded-full ${progressColor(
                                    normalizedScore
                                )}`}
                            />
                            <span>{item}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default function ResultPage({
    overallScore,
    summary,
    sections,
    topStrengths,
    criticalIssues,
    onReset,
}) {
    const normalizedScore = clampScore(overallScore ?? 0);
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

    const sectionCards = useMemo(() => {
        return [
            { title: "Experience", key: "experience" },
            { title: "Projects", key: "projects" },
            { title: "Skills", key: "skills" },
            { title: "Education", key: "education" },
        ];
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
                <header className="flex flex-col gap-6 rounded-3xl border border-gray-800 bg-gray-900/70 p-8">
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="relative h-36 w-36">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="#1f2937"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    className={`transition-all duration-700 ${ringColor(normalizedScore)}`}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-semibold ${scoreColor(normalizedScore)}`}>
                                    {normalizedScore}
                                </span>
                                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                    Score
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                                CV Roaster
                            </p>
                            <h1 className="text-2xl font-semibold text-white">Summary</h1>
                            <p className="text-gray-300">
                                {summary || "No summary provided."}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-6 md:grid-cols-2">
                    {sectionCards.map((section) => (
                        <SectionCard
                            key={section.key}
                            title={section.title}
                            data={sections?.[section.key]}
                        />
                    ))}
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
                        <h3 className="text-lg font-semibold text-white">Top Strengths ✅</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            {(topStrengths || []).length === 0 ? (
                                <li className="text-gray-500">No strengths provided.</li>
                            ) : (
                                topStrengths.map((item, index) => (
                                    <li key={`strength-${index}`} className="flex gap-2">
                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <span>{item}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
                        <h3 className="text-lg font-semibold text-white">Critical Issues ❌</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            {(criticalIssues || []).length === 0 ? (
                                <li className="text-gray-500">No critical issues provided.</li>
                            ) : (
                                criticalIssues.map((item, index) => (
                                    <li key={`issue-${index}`} className="flex gap-2">
                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />
                                        <span>{item}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </section>

                <button
                    type="button"
                    onClick={() => onReset?.()}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/80 px-6 py-3 text-base font-semibold text-gray-100 transition hover:border-gray-500 hover:text-white"
                >
                    Roast Another CV
                </button>
            </div>
        </div>
    );
}
