export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Donor insights and campaign performance metrics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Donor Retention Rate</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Retention analysis chart coming soon
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Campaign ROI</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              ROI comparison chart coming soon
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Donor Demographics</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Demographics pie chart coming soon
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Donation by Purpose</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Purpose breakdown chart coming soon
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Journey Stage Funnel</h3>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Donor journey funnel visualization coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
