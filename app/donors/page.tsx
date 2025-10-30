export default function DonorsPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Donors</h1>
            <p className="text-muted-foreground">
              Manage donor relationships and profiles
            </p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Add Donor
          </button>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b">
            <input
              type="search"
              placeholder="Search donors..."
              className="w-full max-w-sm px-4 py-2 border rounded-md"
            />
          </div>

          <div className="p-6">
            <div className="text-center text-muted-foreground py-12">
              <p>No donors found. Click "Add Donor" to create your first donor profile.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">First Time Donors</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Potential Loyalists</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Loyal Collaborators</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
