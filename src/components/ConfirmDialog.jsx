export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]" onClick={onCancel}>
      <div className="bg-white rounded-lg p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn !bg-red-600 hover:!bg-red-700" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}