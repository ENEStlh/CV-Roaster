import { useCallback, useRef, useState } from "react";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export default function UploadPage({ onAnalysisSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = useCallback((file) => {
        if (!file) {
            return null;
        }

        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setError("Please upload a PDF file.");
            setWarning("");
            return null;
        }

        if (file.size > MAX_FILE_BYTES) {
            setError("That file is too large. Please use a PDF under 5MB.");
            setWarning("Max file size is 5MB.");
            return null;
        }

        setWarning("Max file size is 5MB.");
        setError("");
        return file;
    }, []);

    const handleFileSelection = useCallback((file) => {
        const validated = validateFile(file);
        if (validated) {
            setSelectedFile(validated);
        } else {
            setSelectedFile(null);
        }
    }, [validateFile]);

    const handleInputChange = useCallback((event) => {
        const file = event.target.files?.[0];
        handleFileSelection(file);
    }, [handleFileSelection]);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        handleFileSelection(file);
    }, [handleFileSelection]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const handleSelectClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!selectedFile) {
            setError("Please select a PDF first.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let message = "We could not analyze that CV. Please try again.";
                try {
                    const data = await response.json();
                    if (data?.detail) {
                        message = data.detail;
                    }
                } catch {
                    // Use default message when parsing fails.
                }
                throw new Error(message);
            }

            const data = await response.json();
            onAnalysisSuccess?.(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }, [onAnalysisSuccess, selectedFile]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
                <header className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                        CV Roaster
                    </p>
                    <h1 className="text-3xl font-semibold text-white">
                        Upload your CV for a brutally honest review.
                    </h1>
                    <p className="text-gray-400">
                        Drop a PDF below and we will break down clarity, impact, and ATS fit.
                    </p>
                </header>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
                        isDragging
                            ? "border-amber-400 bg-gray-800/80"
                            : "border-gray-700 bg-gray-800/40"
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    <p className="text-lg font-medium">
                        Drag and drop a PDF here
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                        or click to select a file
                    </p>
                    <button
                        type="button"
                        onClick={handleSelectClick}
                        className="mt-4 rounded-full border border-gray-600 px-5 py-2 text-sm font-semibold text-gray-100 transition hover:border-gray-400 hover:text-white"
                    >
                        Choose PDF
                    </button>
                    {selectedFile && (
                        <p className="mt-4 text-sm text-gray-300">
                            Selected: {selectedFile.name}
                        </p>
                    )}
                </div>

                {warning && (
                    <div className="rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm text-gray-300">
                        {warning}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 rounded-xl bg-amber-500 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-3">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                            Roasting your CV... 🔥
                        </span>
                    ) : (
                        "Analyze CV"
                    )}
                </button>

            </div>
        </div>
    );
}
