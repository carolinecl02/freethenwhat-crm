import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type ClientActivity = {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
};

type ClientPartnerActivity = {
  id: string;
  first_name: string;
  last_name: string;
  type: string;
  niche: string | null;
  status: string;
  created_at: string;
};

type ActivityItem = {
  id: string;
  type: "client" | "partner";
  createdAt: string;
  firstName: string;
  lastName: string;
  status: string;
  partnerType?: string;
  niche?: string | null;
};

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function formatTime(value: string) {
  try {
    return new Date(value).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function getDateLabel(date: Date): string {
  if (isToday(date)) {
    return `Today • ${date.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`;
  }
  if (isYesterday(date)) {
    return `Yesterday • ${date.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`;
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3.375 21a9 9 0 0118 0M12 12.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.396 9.128 9.128 0 003.478-.397M15 19.128v-3.379a2.25 2.25 0 00-.75-1.641l-3.379-3.38a2.25 2.25 0 00-1.641-.75H4.5a2.25 2.25 0 00-2.25 2.25v6.378a2.25 2.25 0 00.75 1.641m9.5-1.378a2.251 2.251 0 01-2.25 2.25v1.378a2.25 2.25 0 01-1.641.75H4.5a2.25 2.25 0 01-2.25-2.25v-6.378a2.25 2.25 0 01.75-1.641M15 19.128v-3.379a2.25 2.25 0 00-.75-1.641l-3.379-3.38a2.25 2.25 0 00-1.641-.75H9m11.25 0a2.25 2.25 0 00-2.25-2.25V9.378a2.25 2.25 0 00-.75-1.641M15 4.128a2.25 2.25 0 012.25 2.25v1.378a2.251 2.251 0 01-.75 1.641m-11.25 0a2.25 2.25 0 00-2.25 2.25v6.378a2.25 2.25 0 00.75 1.641" />
    </svg>
  );
}

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

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Count clients with status 'client'
  // RLS policies automatically ensure users only see their own clients (or all if admin)
  const { count, error } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "client");

  const totalClients = error ? 0 : (count ?? 0);

  // Count client partners with type 'CP' and status 'signed CP'
  // RLS policies automatically ensure users only see their own client partners (or all if admin)
  const { count: cpCount, error: cpError } = await supabase
    .from("client_partners")
    .select("*", { count: "exact", head: true })
    .eq("type", "CP")
    .eq("status", "signed CP");

  const totalClientPartners = cpError ? 0 : (cpCount ?? 0);

  // Recent activity: clients and client partners created in the last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const { data: recentClientsData, error: recentClientsError } = await supabase
    .from("clients")
    .select("id, first_name, last_name, status, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false });

  const { data: recentPartnersData, error: recentPartnersError } = await supabase
    .from("client_partners")
    .select("id, first_name, last_name, type, niche, status, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false });

  const activities: ActivityItem[] = [];

  if (!recentClientsError && recentClientsData) {
    for (const c of recentClientsData as ClientActivity[]) {
      activities.push({
        id: `client_${c.id}`,
        type: "client",
        createdAt: c.created_at,
        firstName: c.first_name,
        lastName: c.last_name,
        status: c.status,
      });
    }
  }

  if (!recentPartnersError && recentPartnersData) {
    for (const p of recentPartnersData as ClientPartnerActivity[]) {
      activities.push({
        id: `partner_${p.id}`,
        type: "partner",
        createdAt: p.created_at,
        firstName: p.first_name,
        lastName: p.last_name,
        status: p.status,
        partnerType: p.type,
        niche: p.niche,
      });
    }
  }

  activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Group activities by date
  const groupedActivities: Record<string, ActivityItem[]> = {};
  for (const activity of activities) {
    const date = new Date(activity.createdAt);
    const dateKey = date.toDateString();
    if (!groupedActivities[dateKey]) {
      groupedActivities[dateKey] = [];
    }
    groupedActivities[dateKey].push(activity);
  }

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
            <p className="text-2xl font-bold text-primary-text">{totalClients}</p>
            
          </div>
          <div className="bg-white rounded-card p-5 shadow-card border border-secondary-text/5">
            <p className="text-sm font-medium text-secondary-text mb-1">Client partners</p>
            <p className="text-2xl font-bold text-primary-text">{totalClientPartners}</p>
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
            {activities.length === 0 ? (
              <p className="text-secondary-text text-sm">
                No recent activity in the last 7 days.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedActivities)
                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                  .map(([dateKey, items]) => {
                    const date = new Date(dateKey);
                    return (
                      <div key={dateKey} className="space-y-3">
                        <h4 className="text-sm font-semibold text-primary-text">
                          {getDateLabel(date)}
                        </h4>
                        <ul className="space-y-3">
                          {items.map((item) => {
                            const isClient = item.type === "client";
                            const badgeColor = isClient
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600";
                            return (
                              <li key={item.id} className="flex items-start gap-3">
                                {/* Circular badge with icon */}
                                <div
                                  className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${badgeColor}`}
                                >
                                  {isClient ? (
                                    <UserPlusIcon className="w-5 h-5" />
                                  ) : (
                                    <UsersIcon className="w-5 h-5" />
                                  )}
                                </div>
                                {/* Activity content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-primary-text">
                                        {isClient ? (
                                          <>
                                            New client/prospect added -{" "}
                                            <span className="font-medium">
                                              "{item.firstName} {item.lastName}"
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            New CP/referrer -{" "}
                                            <span className="font-medium">
                                              "{item.firstName} {item.lastName}"
                                            </span>
                                          </>
                                        )}
                                      </p>
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-secondary-text">
                                          {formatTime(item.createdAt)}
                                        </span>
                                        <span className="text-xs text-secondary-text">
                                          {isClient
                                            ? item.status
                                            : `${item.partnerType}${item.niche ? ` • ${item.niche}` : ""} • ${item.status}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
