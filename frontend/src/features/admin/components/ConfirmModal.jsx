export default function ConfirmModal({
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 text-white rounded-lg w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-400 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                    >
                        {cancelText}    
                    </button>    

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    >
                        {confirmText}    
                    </button>    
                </div>
            </div>
        </div>
    );
}