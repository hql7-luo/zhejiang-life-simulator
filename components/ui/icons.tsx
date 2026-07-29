import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" {...props}>
      {children}
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" /></IconBase>;
}

export function ArchiveIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v13H4zM3 4h18v3H3zm6 7h6" /></IconBase>;
}

export function SlidersIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" d="M4 6h7m4 0h5M4 12h2m4 0h10M4 18h10m4 0h2" /><circle cx="13" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="18" r="2" /></IconBase>;
}

export function SparkIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3Zm6 11 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14Z" /></IconBase>;
}

export function TimelineIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" d="M7 4v16M7 7h9M7 12h6M7 17h10" /><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" /><circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="7" cy="17" r="1.5" fill="currentColor" stroke="none" /></IconBase>;
}

export function PeopleIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m6.5-10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7-1a3 3 0 0 1 0 5.8M21 20v-2a4 4 0 0 0-3-3.7" /></IconBase>;
}

export function WalletIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12v2m0 5h4v4h-4a2 2 0 1 1 0-4Z" /></IconBase>;
}

export function DownloadIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m-4-4 4 4 4-4M5 20h14" /></IconBase>;
}

export function CopyIcon(props: IconProps) {
  return <IconBase {...props}><rect x="8" y="8" width="12" height="12" rx="2" /><path strokeLinecap="round" d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></IconBase>;
}

export function RestartIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M5.5 16a8 8 0 1 0 .4-8.5L4 10" /></IconBase>;
}

export function CloseIcon(props: IconProps) {
  return <IconBase {...props}><path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" /></IconBase>;
}
