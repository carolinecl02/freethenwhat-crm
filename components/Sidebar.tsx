"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";

type NavItem = {
  href: string;
  label: string;
  icon: ({ className }: { className?: string }) => JSX.Element;
  badge?: number | string;
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    items: [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon }
    ],
  },

  {
    label: "CLIENTS",
    items: [
  
      { href: "/dashboard/clients", label: "Clients & leads", icon: ChartIcon },
      { href: "/dashboard/tasks", label: "Tasks", icon: TaskIcon },
    ],
  },
  {
    label: "BUSINESS PARTNERS",
    items: [
      { href: "/dashboard/clientpartners", label: "Client partners & network", icon: MegaphoneIcon },
      /*{ href: "/dashboard/campaigns", label: "Outreach toolkit", icon: TaskIcon },*/
    ],
  },
];

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 011.414-1.414L13.5 9.75 21 18" />
    </svg>
  );
}

function TaskIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069c.18.39.385.768.614 1.127.55.798 1.179 1.498 1.88 2.116.24.21.504.393.78.559.276.166.576.302.888.403.313.102.634.168.96.199.327.031.655.026.982-.004.327-.03.65-.078.963-.145.313-.067.618-.153.913-.259.295-.105.578-.23.848-.374.27-.144.526-.306.767-.482.24-.177.464-.368.669-.571.205-.203.389-.418.552-.653.163-.235.303-.48.42-.734.117-.254.21-.517.278-.785.068-.268.11-.54.126-.814.016-.274.006-.549-.03-.823-.036-.274-.096-.546-.18-.813-.083-.267-.19-.526-.32-.774a4.529 4.529 0 00-.488-.652 11.96 11.96 0 00-1.64-1.372 11.25 11.25 0 00-1.5-1.002 4.529 4.529 0 00-.652-.488 4.25 4.25 0 00-.774-.32c-.267-.084-.54-.144-.813-.18-.274-.036-.549-.046-.823-.03-.274.016-.547.058-.815.126-.264.068-.51.208-.744.42-.235.164-.45.348-.653.552-.204.205-.388.429-.571.669-.144.27-.27.553-.374.848-.106.295-.192.6-.259.913-.067.313-.114.636-.145.963-.03.327-.035.655-.004.982.031.326.097.647.199.96.101.312.237.612.403.888.166.276.35.54.559.78.618.701 1.318 1.33 2.116 1.88.359.229.737.434 1.127.614m6.01-12.015a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75M15.75 9H21m-3.75 9a9 9 0 11-18 0 9 9 0 0118 0m-9-3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  async function handleLogOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    window.location.href = "/login";
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-primary-text hover:bg-sidebar-hover transition-colors shadow-card"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-sidebar border-r border-sidebar-border
          transition-[width] duration-200 ease-out
          lg:translate-x-0
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full"}
        `}
      >
        {/* Logo + collapse – h-16 matches main Header so both bottom borders align */}
        <div className="flex items-center justify-between gap-2 h-16 px-3 border-b border-sidebar-border shrink-0 min-h-0">
          <Link
            href="/dashboard"
            className={`flex items-center min-w-0 ${collapsed ? "justify-center w-full" : "gap-2"}`}
          >
            <Logo
              variant="full"
              className={collapsed ? "text-xs shrink-0" : "shrink-0"}
            />
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex shrink-0 p-1.5 rounded-md text-sidebar-text-muted hover:text-primary-text hover:bg-sidebar-hover transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navSections.map((section) => (
            <div key={section.label} className={collapsed ? "" : "mb-6"}>
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-sidebar-text-muted">
                  {section.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative
                          ${isActive
                            ? "bg-sidebar-active text-primary-text"
                            : "text-sidebar-text-muted hover:bg-sidebar-hover hover:text-primary-text"
                          }
                        `}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r" aria-hidden />
                        )}
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.label}</span>
                            {item.badge != null && (
                              <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500/90 px-1.5 text-xs font-medium text-white">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Help, Settings, User */}
        <div className="shrink-0 border-t border-sidebar-border py-3 px-3 space-y-0.5">
          <Link
            href="/dashboard/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text-muted hover:bg-sidebar-hover hover:text-primary-text transition-colors"
          >
            <HelpIcon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Help and Support</span>}
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text-muted hover:bg-sidebar-hover hover:text-primary-text transition-colors"
          >
            <CogIcon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <div className={`${!collapsed ? "pt-2 mt-2 border-t border-sidebar-border" : "pt-2"} relative`} ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sidebar-text-muted hover:bg-sidebar-hover hover:text-primary-text transition-colors ${collapsed ? "justify-center" : ""}`}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-accent/30 flex items-center justify-center text-primary-text font-semibold text-sm">
                U
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary-text truncate">User</p>
                  <p className="text-xs text-sidebar-text-muted truncate">user@example.com</p>
                </div>
              )}
              {!collapsed && (
                <ChevronRight
                  className={`w-4 h-4 text-sidebar-text-muted shrink-0 transition-transform ${userMenuOpen ? "rotate-90" : ""}`}
                />
              )}
            </button>
            {userMenuOpen && (
              <div
                className={`absolute left-0 bg-sidebar border border-sidebar-border rounded-lg shadow-lg py-1 min-w-[160px] z-50 ${
                  collapsed ? "left-full ml-2 bottom-0" : "bottom-full mb-1"
                }`}
              >
                <button
                  type="button"
                  onClick={handleLogOut}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-sidebar-text-muted hover:bg-sidebar-hover hover:text-primary-text transition-colors"
                >
                  <LogOutIcon className="w-5 h-5 shrink-0" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setMobileOpen(false)} aria-hidden />
      )}
    </>
  );
}
