export default function ReportViewer() {
  const reportUrl = "/assets/protienreport/protein-report.pdf";

  return (
    <div className="report-viewer">
      <div className="report-viewer__frame">
        <object
          data={reportUrl}
          type="application/pdf"
          aria-label="mTORA protein laboratory report"
        >
          <div className="report-viewer__fallback">
            <p>Unable to display the report here.</p>
            <a href={reportUrl} target="_blank" rel="noreferrer" className="btn btn--primary">
              Open the full report
            </a>
          </div>
        </object>
      </div>

      <div className="report-viewer__actions">
        <a href={reportUrl} target="_blank" rel="noreferrer" className="btn btn--ghost-dark">
          View Full Report
        </a>

        <a href={reportUrl} download className="btn btn--primary">
          Download Report
        </a>
      </div>
    </div>
  );
}
