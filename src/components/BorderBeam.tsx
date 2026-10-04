import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BorderBeamProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

/** Wraps content with a rotating conic-gradient light around its 1px border. */
const BorderBeam = ({ children, className, innerClassName }: BorderBeamProps) => (
  <div className={cn("relative overflow-hidden rounded-xl p-px", className)}>
    <div aria-hidden="true" className="border-beam-layer absolute inset-[-100%]" />
    <div className={cn("relative h-full rounded-[calc(0.75rem-1px)]", innerClassName)}>{children}</div>
  </div>
);

export default BorderBeam;
