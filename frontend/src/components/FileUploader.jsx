import { useCallback, useState, useRef } from "react";

/**
 * Reusable drag-and-drop file uploader for .xlsx / .csv files.
 *
 * Props:
 *   label        – display label (e.g. "Components")
 *   accept       – comma-separated MIME / extensions (default: xlsx + csv)
 *   onUpload     – async (file) => Promise — called when a file is selected
 *   disabled     – disables the uploader
 */
export default function FileUploader({
  label,
  accept = ".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv",
  onUpload,
  disabled = false,
}) {
  const [status, setStatus] = useState("idle"); // idle | dragging | uploading | done | error
  const [fileName, setFileName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file || disabled) return;
      setFileName(file.name);
      setStatus("uploading");
      setErrorMsg(null);
      try {
        await onUpload(file);
        setStatus("done");
      } catch (err) {
        setStatus("error");
        setErrorMsg(err.message ?? "Upload failed");
      }
    },
    [onUpload, disabled]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setStatus("idle");
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setStatus("dragging");
  };

  const onDragLeave = () => setStatus((s) => (s === "dragging" ? "idle" : s));

  const onChange = (e) => handleFile(e.target.files?.[0]);

  const statusClass = `file-uploader file-uploader--${status}`;

  return (
    <div
      className={statusClass}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        hidden
        disabled={disabled}
      />

      <div className="file-uploader__icon">
        {status === "uploading" && <span className="spinner" />}
        {status === "done" && "✅"}
        {status === "error" && "❌"}
        {(status === "idle" || status === "dragging") && "📁"}
      </div>

      <p className="file-uploader__label">{label}</p>

      {fileName && (
        <p className="file-uploader__file">{fileName}</p>
      )}

      {status === "idle" && (
        <p className="file-uploader__hint">
          Drag & drop or click to upload (.xlsx / .csv)
        </p>
      )}
      {status === "dragging" && (
        <p className="file-uploader__hint">Drop file here</p>
      )}
      {status === "uploading" && (
        <p className="file-uploader__hint">Uploading…</p>
      )}
      {status === "done" && (
        <p className="file-uploader__hint file-uploader__hint--success">
          Uploaded successfully
        </p>
      )}
      {status === "error" && (
        <p className="file-uploader__hint file-uploader__hint--error">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
