type IconProps = { className?: string };

export function ArrowIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="16" viewBox="0 0 16 16" width="16"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function BagIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="21" viewBox="0 0 24 24" width="21"><path d="M5.5 8.5h13l.75 11.5H4.75L5.5 8.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /><path d="M9 9V6.75a3 3 0 0 1 6 0V9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function UserIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 19.25c.55-3.05 2.73-4.75 6.5-4.75s5.95 1.7 6.5 4.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function HeartIcon({ className = "", filled = false }: IconProps & { filled?: boolean }) {
  return <svg aria-hidden="true" className={className} fill={filled ? "currentColor" : "none"} height="19" viewBox="0 0 24 24" width="19"><path d="M20.84 8.61c0 5.05-8.84 10.14-8.84 10.14S3.16 13.66 3.16 8.61A4.61 4.61 0 0 1 12 6.44a4.61 4.61 0 0 1 8.84 2.17Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function MenuIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="22" viewBox="0 0 24 24" width="22"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function CloseIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function TrashIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="19" viewBox="0 0 24 24" width="19"><path d="M5 7h14M10 4h4l1 3H9l1-3ZM7 7l.75 13h8.5L17 7M10 11v5M14 11v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function FilterIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="19" viewBox="0 0 24 24" width="19"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function SortIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="19" viewBox="0 0 24 24" width="19"><path d="M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function DashboardIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><rect height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" width="6.5" x="4" y="4" /><rect height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" width="6.5" x="13.5" y="4" /><rect height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" width="6.5" x="4" y="13.5" /><rect height="6.5" rx="1" stroke="currentColor" strokeWidth="1.5" width="6.5" x="13.5" y="13.5" /></svg>;
}

export function UsersIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M3.75 19c.45-3.05 2.18-4.75 5.25-4.75s4.8 1.7 5.25 4.75M15.5 5.5a2.75 2.75 0 0 1 0 5.5M16.25 14.5c2.35.35 3.7 1.85 4 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function EditIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="m4.5 16.75-.75 3.5 3.5-.75L18.5 8.25 15.75 5.5 4.5 16.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><path d="m14.5 6.75 2.75 2.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function EyeIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="19" viewBox="0 0 24 24" width="19"><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function EyeOffIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="19" viewBox="0 0 24 24" width="19"><path d="m4 4 16 16M10.6 7.2A8.9 8.9 0 0 1 12 7c5.5 0 8.5 5 8.5 5a15 15 0 0 1-2.1 2.65M6.1 6.1C4.35 7.4 3.5 9 3.5 9s3 5 8.5 5c.5 0 1-.04 1.45-.12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function ChevronDownIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="m5 9 7 7 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function FolderIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><path d="M4 6.5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function SearchIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="19" viewBox="0 0 24 24" width="19"><circle cx="10.75" cy="10.75" r="5.75" stroke="currentColor" strokeWidth="1.5" /><path d="m15 15 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg>;
}

export function ChevronLeftIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="m14.5 5-7 7 7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function ChevronRightIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="m9.5 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function LocationIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /><circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function PhoneIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><path d="M7.5 4.5 5 6c-.5 4 5.5 10 9 11.5l2.5-1.5-2-3-2 1c-1.5-.75-3.75-3-4.5-4.5l1-2-1.5-3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function ClockIcon({ className = "" }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height="20" viewBox="0 0 24 24" width="20"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}
