export default function LoadingSpinner({ message }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 border border-slate-700">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-blue-400 font-medium">{message || 'Loading...'}</div>
            </div>
        </div>
    );
}
