import { Container } from "@/components/ui/container";

function LoadingRow({ count }: { count: number }) {
  return <div className="mobile-navigation-scroll -mx-4 flex gap-5 overflow-x-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">{Array.from({ length: count }, (_, index) => <div className="w-[calc(100vw-2rem)] shrink-0 animate-pulse sm:w-[calc(50vw-2rem)] lg:w-[calc(25vw-2.5rem)]" key={index}><div className="aspect-[6/7] bg-brand-light-gray" /><div className="space-y-3 px-5 py-8"><div className="h-4 w-1/3 bg-brand-light-gray" /><div className="h-7 w-3/4 bg-brand-light-gray" /><div className="h-4 w-full bg-brand-light-gray" /></div></div>)}</div>;
}

export default function Loading() {
  return <main aria-label="Loading homepage" className="space-y-16 py-20 sm:space-y-24 sm:py-24"><Container><div className="mx-auto mb-10 h-12 w-56 animate-pulse bg-brand-light-gray" /><LoadingRow count={4} /></Container><Container><div className="mx-auto mb-10 h-12 w-56 animate-pulse bg-brand-light-gray" /><LoadingRow count={3} /></Container><Container><div className="mx-auto mb-10 h-12 w-56 animate-pulse bg-brand-light-gray" /><LoadingRow count={3} /></Container><Container><div className="mx-auto mb-10 h-12 w-56 animate-pulse bg-brand-light-gray" /><LoadingRow count={4} /></Container></main>;
}
