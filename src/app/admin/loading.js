export default function AdminLoading() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-loading-bar admin-loading-bar--title" />
          <div className="admin-loading-bar admin-loading-bar--subtitle" />
        </div>
      </div>
      <section className="admin-grid admin-grid--kpi">
        <div className="admin-card admin-loading-block" />
        <div className="admin-card admin-loading-block" />
        <div className="admin-card admin-loading-block" />
        <div className="admin-card admin-loading-block" />
      </section>
    </div>
  );
}

