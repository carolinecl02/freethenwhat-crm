"use client";

import Link from "next/link";

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({ title = "Dashboard", showBack = false, backHref = "/dashboard" }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-surface border-b border-secondary-text/10 z-30 flex items-center justify-between px-4 sm:px-6 shadow-card">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary-text hover:bg-background hover:text-primary-text transition-colors shrink-0"
            aria-label="Go back"
          >
            <BackIcon className="w-5 h-5" />
          </Link>
        )}
        <h1 className="text-lg font-semibold text-primary-text truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary-text hover:bg-background hover:text-primary-text transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary-text hover:bg-background hover:text-primary-text transition-colors"
          aria-label="Help"
        >
          <HelpIcon className="w-5 h-5" />
        </button>
        <Link
          href="/dashboard/new"
          className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:h-9 rounded-full bg-accent text-white hover:opacity-90 transition-opacity font-medium text-sm shrink-0"
          aria-label="Add new"
        >
          <PlusIcon className="w-5 h-5 sm:mr-1.5" />
          <span className="hidden sm:inline">New</span>
        </Link>
      </div>
    </header>
  );
}
