/**
 * Risk score badge — renders a colored pill.
 *
 * Props:
 *   score – number between 0 and 1
 *   label – optional override text (defaults to score percentage)
 */
export default function RiskBadge({ score, label }) {
  let level = "low";
  if (score >= 0.6) level = "high";
  else if (score >= 0.3) level = "medium";

  const displayLabel = label ?? `${(score * 100).toFixed(0)}%`;

  return (
    <span className={`risk-badge risk-badge--${level}`} title={`Risk: ${displayLabel}`}>
      {displayLabel}
    </span>
  );
}
