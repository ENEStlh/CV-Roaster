import { useCallback, useState } from "react";
import ResultPage from "./ResultPage";
import UploadPage from "./UploadPage";

export default function App() {
    const [analysis, setAnalysis] = useState(null);

    const handleAnalysisSuccess = useCallback((data) => {
        setAnalysis(data);
    }, []);

    const handleReset = useCallback(() => {
        setAnalysis(null);
    }, []);

    if (!analysis) {
        return <UploadPage onAnalysisSuccess={handleAnalysisSuccess} />;
    }

    return (
        <ResultPage
            overallScore={analysis.overallScore}
            summary={analysis.summary}
            sections={analysis.sections}
            topStrengths={analysis.topStrengths}
            criticalIssues={analysis.criticalIssues}
            onReset={handleReset}
        />
    );
}
