import { useState } from "react";
import { Modal } from "./index";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string) => Promise<void>;
  currentImage?: string | null;
  title: string;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onSave,
  currentImage,
  title,
}: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSave(imageUrl);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full mx-4">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </h2>
        
        {currentImage && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Image:</p>
            <img
              src={currentImage}
              alt="Current"
              className="w-24 h-16 object-cover rounded border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}