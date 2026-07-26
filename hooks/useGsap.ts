import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";

export function useGsap(
  callback: (context: gsap.Context) => void
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx);
    });

    return () => {
      ctx.revert();
    };
  }, [callback]);
}