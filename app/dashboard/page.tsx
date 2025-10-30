export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of donations, donors, and campaign performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
            <p className="text-2xl font-bold">RM 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Last 12 months</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">RM 0.00</p>
            <p className="text-xs text-muted-foreground mt-1">+0% from last month</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Donation Trends</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart.js / Recharts integration coming soon
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Journey Stage Distribution</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Donor journey funnel chart coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
