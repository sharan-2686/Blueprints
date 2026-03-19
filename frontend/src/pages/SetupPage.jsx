import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import { uploadSetupFile, buildIndexes } from "../services/api";
import { CheckCircle, Rocket } from "lucide-react";

const UPLOAD_STEPS = [
  {
    key: "projects",
    endpoint: "projects",
    label: "Projects",
    description: "List of your engineering or manufacturing projects (project_name, industry_type, etc).",
  },
  {
    key: "components",
    endpoint: "components",
    label: "Components",
    description: "Master list of all components (component_id, name, type, category...).",
  },
  {
    key: "component-specs",
    endpoint: "component-specs",
    label: "Component Specifications",
    description: "Spec values per component (spec_name, spec_value, spec_unit).",
  },
  {
    key: "suppliers",
    endpoint: "suppliers",
    label: "Suppliers",
    description: "Supplier directory (name, country, reliability scores...).",
  },
  {
    key: "supplier-components",
    endpoint: "supplier-components",
    label: "Supplier-Component Mapping",
    description: "Which suppliers provide which components (prices, lead times).",
  },
  {
    key: "inventory",
    endpoint: "inventory",
    label: "Inventory",
    description: "Current stock levels (quantity, warehouse, reorder levels).",
  },
];

export default function SetupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear setup diversion flag once the user safely lands here
    localStorage.removeItem("needsSetup");
  }, []);
  const [uploadState, setUploadState] = useState({});
  const [buildStatus, setBuildStatus] = useState("idle"); // idle | building | done | error
  const [buildError, setBuildError] = useState(null);

  function markUpload(key, status) {
    setUploadState((prev) => ({ ...prev, [key]: status }));
  }

  async function handleUpload(step, file) {
    markUpload(step.key, "uploading");
    try {
      await uploadSetupFile(step.endpoint, file);
      markUpload(step.key, "done");
    } catch (err) {
      markUpload(step.key, "error");
      throw err;
    }
  }

  const allUploaded =
    UPLOAD_STEPS.every((s) => uploadState[s.key] === "done");

  async function handleBuildIndexes() {
    setBuildStatus("building");
    setBuildError(null);
    try {
      await buildIndexes();
      setBuildStatus("done");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setBuildStatus("error");
      setBuildError(err.message);
    }
  }

  return (
    <div className="setup-page">
      <div className="setup-page__container">
        <div className="setup-page__header">
          <h1>Set Up Your Data</h1>
          <p className="setup-page__subtitle">
            Please upload your supply chain data sheets individually so each table can be populated separately.
          </p>
        </div>

        {/* Progress bar */}
        <div className="setup-page__progress">
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{
                width: `${
                  (Object.values(uploadState).filter((s) => s === "done")
                    .length /
                    UPLOAD_STEPS.length) *
                  100
                }%`,
              }}
            />
          </div>
          <span className="setup-page__progress-text">
            {Object.values(uploadState).filter((s) => s === "done").length} /{" "}
            {UPLOAD_STEPS.length} uploaded
          </span>
        </div>

        {/* Upload grid */}
        <div className="setup-page__grid">
          {UPLOAD_STEPS.map((step) => (
            <div key={step.key} className="setup-page__upload-card">
              <h3>{step.label}</h3>
              <p className="setup-page__card-desc">{step.description}</p>
              <FileUploader
                label={`Upload ${step.label}`}
                onUpload={(file) => handleUpload(step, file)}
                disabled={uploadState[step.key] === "done"}
              />
              {uploadState[step.key] === "error" && <p className="text-red-500 text-xs mt-2">Error uploading file</p>}
            </div>
          ))}
        </div>

        {/* Build indexes */}
        <div className="setup-page__actions">
          <button
            className={`btn btn--primary btn--lg ${
              !allUploaded ? "btn--disabled" : ""
            }`}
            disabled={!allUploaded || buildStatus === "building"}
            onClick={handleBuildIndexes}
          >
            {buildStatus === "building" ? (
              <>
                <span className="spinner spinner--sm" /> Building Indexes…
              </>
            ) : buildStatus === "done" ? (
              <><CheckCircle size={18} style={{ marginRight: '8px' }} /> Setup Complete — Redirecting…</>
            ) : (
              <><Rocket size={18} style={{ marginRight: '8px' }} /> Build Indexes & Finish Setup</>
            )}
          </button>

          {buildStatus === "error" && (
            <p className="setup-page__error">{buildError}</p>
          )}

          {!allUploaded && (
            <p className="setup-page__hint">
              Upload all {UPLOAD_STEPS.length} files to enable index building
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
