export default function DonationsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Donations</h1>
            <p className="text-muted-foreground">
              Track donations and generate receipts
            </p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Record Donation
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
            <p className="text-2xl font-bold">RM 0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">RM 0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Average Donation</p>
            <p className="text-2xl font-bold">RM 0.00</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Recurring</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b flex gap-4">
            <select className="px-4 py-2 border rounded-md">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            <select className="px-4 py-2 border rounded-md">
              <option>All Purposes</option>
              <option>General</option>
              <option>Homeless Care</option>
              <option>Qurbani</option>
              <option>Zakat</option>
            </select>
          </div>

          <div className="p-6">
            <div className="text-center text-muted-foreground py-12">
              <p>No donations recorded yet. Click "Record Donation" to add your first donation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
