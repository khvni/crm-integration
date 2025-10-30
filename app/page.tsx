import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            MyFundAction CRM
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Donor Engagement & Campaign Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Link
            href="/dashboard"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary transition-all"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                View analytics and key metrics
              </p>
            </div>
          </Link>

          <Link
            href="/donors"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary transition-all"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Donors</h2>
              <p className="text-sm text-muted-foreground">
                Manage donor relationships and profiles
              </p>
            </div>
          </Link>

          <Link
            href="/donations"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary transition-all"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Donations</h2>
              <p className="text-sm text-muted-foreground">
                Track donations and generate receipts
              </p>
            </div>
          </Link>

          <Link
            href="/campaigns"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary transition-all"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Campaigns</h2>
              <p className="text-sm text-muted-foreground">
                Create and manage fundraising campaigns
              </p>
            </div>
          </Link>

          <Link
            href="/analytics"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary transition-all"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Donor insights and campaign performance
              </p>
            </div>
          </Link>

          <div className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 opacity-60">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="text-sm text-muted-foreground">
                Coming soon...
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Donors</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">RM -</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">This Year</p>
              <p className="text-2xl font-bold">RM -</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
