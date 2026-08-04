"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/*
  تغییر مهم: (window as any).__lenis = lenis اضافه شد.

  چرا لازم است:
  کامپوننت CinematicConstruction.tsx برای گرفتن مقدار دقیق اسکرول
  به‌جای گوش‌دادن مستقیم به window.scroll (که وقتی Lenis فعال است
  دیگر دقیق نیست، چون Lenis خودش موقعیت را نرم/تاخیردار می‌کند)،
  باید مستقیماً از خودِ Lenis مقدار اسکرول را بخواند. بدون این خط،
  آن کامپوننت هیچ‌وقت به Lenis واقعی دسترسی پیدا نمی‌کند و یا اصلاً
  کار نمی‌کند یا (بدتر) به‌طور موازی از window.scrollY نادرست
  استفاده می‌کند که دوباره باعث تداخل و پرش می‌شود.
*/

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
      /*
        رفع باگ «با تاچ‌پد لپ‌تاپ اسکرول نمی‌شود، فقط ماوس کار می‌کند»:
        بدون wheelMultiplier مشخص، بعضی درایورهای تاچ‌پد (خصوصاً روی
        ویندوز با Precision Touchpad) دلتای بسیار کوچک‌تری نسبت به
        ماوس ارسال می‌کنند و Lenis عملاً حرکت محسوسی تولید نمی‌کند.
        wheelMultiplier: 1 مقدار توصیه‌شده‌ی رسمی Lenis است و پاسخ‌گویی
        به همه‌ی ورودی‌های wheel (چه ماوس چه تاچ‌پد) را یکسان می‌کند.
      */
      wheelMultiplier: 1,
      touchMultiplier: 2,
      gestureOrientation: "vertical",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__lenis;
      lenis.destroy();
    };
  }, []);
}
