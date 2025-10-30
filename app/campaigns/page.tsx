export default function CampaignsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage fundraising campaigns
            </p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Create Campaign
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
            <p className="text-2xl font-bold">RM 0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Campaign Donors</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Avg. Donation</p>
            <p className="text-2xl font-bold">RM 0.00</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-md bg-card">All</button>
            <button className="px-4 py-2 border rounded-md">Active</button>
            <button className="px-4 py-2 border rounded-md">Draft</button>
            <button className="px-4 py-2 border rounded-md">Completed</button>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="text-center text-muted-foreground py-12">
              <p>No campaigns created yet. Click "Create Campaign" to launch your first campaign.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
