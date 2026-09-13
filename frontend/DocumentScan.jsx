import { useState, useRef, useEffect } from "react";
import { ScanLine, Upload, FileText, X, ChevronRight } from "lucide-react";
import { PrimaryButton, GhostButton } from "../common/Buttons.jsx";
import { KioskFrame } from "../common/KioskFrame.jsx";
import { STRINGS } from "../../constants/languages.js";
import { MAX_UPLOAD_BYTES, MAX_UPLOADS, ACCEPTED_TYPES, formatBytes } from "../../constants/uploadConfig.js";
import { C, glassStyle } from "../../constants/theme.js";

function UploadedFileRow({ item, onRemove }) {
  const isImage = item.file.type.startsWith("image/");
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={glassStyle({ boxShadow: "0 10px 26px -18px rgba(0,0,0,0.4)" })}>
      {isImage && item.previewUrl ? (
        <img src={item.previewUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.primaryPale }}>
          <FileText size={18} color={C.primary} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: C.ink }}>{item.file.name}</div>
        <div className="text-xs" style={{ color: C.inkSoft }}>{formatBytes(item.file.size)} · will be reviewed by your doctor</div>
      </div>
      <button onClick={() => onRemove(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
        <X size={14} color={C.inkSoft} />
      </button>
    </div>
  );
}

export function DocumentScan({ onNext, language }) {
  const t = STRINGS[language];
  const [uploads, setUploads] = useState([]); // [{ id, file, previewUrl }]
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const uploadsRef = useRef(uploads);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    return () => {
      uploadsRef.current.forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
  }, []);

  const addFiles = (fileList) => {
    setUploadError("");
    const incoming = Array.from(fileList);
    const accepted = [];
    for (const file of incoming) {
      if (uploads.length + accepted.length >= MAX_UPLOADS) {
        setUploadError(`You can upload up to ${MAX_UPLOADS} files.`);
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only images (JPG, PNG, WEBP, HEIC) and PDFs are supported.");
        continue;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setUploadError(`"${file.name}" is over the 15MB limit.`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
    if (accepted.length) setUploads((prev) => [...prev, ...accepted]);
  };

  const removeUpload = (id) => {
    setUploads((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((u) => u.id !== id);
    });
  };

  const handleContinue = () => {
    const uploadedDocs = uploads.map((u) => ({
      id: u.id,
      label: u.file.name,
      date: new Date().toLocaleDateString(),
      fields: [],
      abnormal: null,
      pendingReview: true,
      previewUrl: u.previewUrl,
    }));
    onNext(uploadedDocs);
  };

  return (
    <KioskFrame hideProgress>
      <div className="text-center mb-8">
        <ScanLine size={28} color={C.primary} className="mx-auto" />
        <h2 className="text-2xl mt-4" style={{ fontFamily: "Fraunces, serif", color: C.ink }}>{t.scanTitle}</h2>
        <p className="text-sm mt-2" style={{ color: C.inkSoft }}>{t.scanSub}</p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className="rounded-2xl p-8 text-center cursor-pointer"
        style={{
          border: `1.5px dashed ${dragOver ? C.primary : C.line}`,
          background: dragOver ? C.primaryPale : "rgba(255,255,255,0.05)",
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Upload size={24} color={C.primary} className="mx-auto" />
        <div className="text-sm font-semibold mt-3" style={{ color: C.ink }}>{t.uploadPrompt}</div>
        <div className="text-xs mt-1" style={{ color: C.inkSoft }}>{t.uploadHint}</div>
      </div>

      {uploadError && (
        <div className="text-xs font-semibold px-3 py-2 rounded-lg mt-3" style={{ background: C.alertPale, color: C.alert }}>{uploadError}</div>
      )}

      {uploads.length > 0 && (
        <div className="space-y-2 mt-4">
          {uploads.map((u) => (
            <UploadedFileRow key={u.id} item={u} onRemove={removeUpload} />
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <GhostButton onClick={() => onNext([])}>{t.skipStep}</GhostButton>
        <PrimaryButton onClick={handleContinue} icon={ChevronRight} full>{t.continueSummary}</PrimaryButton>
      </div>
    </KioskFrame>
  );
}
