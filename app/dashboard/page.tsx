import Link from "next/link";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function DotsVertical({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-primary-text mb-1">
          Welcome back
        </h2>
        <p className="text-secondary-text mb-6">
          Here’s what’s happening with your clients and tasks.
        </p>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-card p-5 shadow-card border border-secondary-text/5">
            <p className="text-sm font-medium text-secondary-text mb-1">Total clients</p>
            <p className="text-2xl font-bold text-primary-text">12</p>
            <p className="text-xs text-secondary-text mt-1">3 annual reviews this week</p>
          </div>
          <div className="bg-white rounded-card p-5 shadow-card border border-secondary-text/5">
            <p className="text-sm font-medium text-secondary-text mb-1">Tasks due</p>
            <p className="text-2xl font-bold text-primary-text">5</p>
            <p className="text-xs text-secondary-text mt-1">2 overdue</p>
          </div>
        </div>

        {/* Activity / placeholder */}
        <div className="bg-white rounded-card shadow-card border border-secondary-text/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-secondary-text/10 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-primary-text">Recent activity</h3>
            <div className="flex items-center gap-2">
              <select className="text-sm rounded-lg border border-secondary-text/20 bg-background text-primary-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40">
                <option>All activity</option>
              </select>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full min-w-[140px] rounded-lg border border-secondary-text/20 bg-background py-2 pl-9 pr-3 text-sm text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-secondary-text text-sm">No recent activity yet. Create an opportunity or complete a task to see updates here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
