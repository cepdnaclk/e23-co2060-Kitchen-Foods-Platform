import { useRef, useState } from "react";
import { API_BASE_URL } from "./api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  /** Auth token attached as `Authorization: Bearer <token>`. Omit to upload anonymously. */
  token?: string | null;
  /** "light" suits the admin UI, "dark" suits the chef UI. */
  variant?: "light" | "dark";
  label?: string;
}

const MAX_SIZE = 5 * 1024 * 1024;

export const ImageUploader = ({
  value,
  onChange,
  token,
  variant = "light",
  label = "Food image",
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const isDark = variant === "dark";

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, WebP, GIF, AVIF).");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image is too large — the maximum size is 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange(data.url as string);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const inputCls = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-orange-500"
    : "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500";

  const linkCls = isDark
    ? "text-xs font-medium text-slate-400 transition hover:text-orange-400"
    : "text-xs font-medium text-slate-500 transition hover:text-indigo-600";

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-slate-100"
          }`}
        >
          {value ? (
            <img
              src={value}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className={`px-1 text-center text-[9px] font-semibold uppercase tracking-wide ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                No image
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={
              isDark
                ? "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                : "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {uploading
              ? "Uploading…"
              : value
                ? "Replace image"
                : "Upload image"}
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput((v) => !v)}
            className={linkCls}
          >
            or paste an image URL
          </button>
        </div>
      </div>

      {showUrlInput && (
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/dish.jpg"
          className={inputCls}
        />
      )}

      {error && (
        <p className={`text-xs font-medium ${isDark ? "text-rose-400" : "text-rose-600"}`}>
          {error}
        </p>
      )}
    </div>
  );
};
