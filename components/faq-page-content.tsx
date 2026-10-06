"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteSettings } from "@/components/site-settings-provider";
import { normalizeFaqs } from "@/lib/faqs";

export function FaqPageContent() {
  const settings = useSiteSettings();
  const faqs = normalizeFaqs(settings as unknown as Record<string, unknown>).filter(
    (f) => f.q.trim() || f.a.trim(),
  );

  return (
    <>
      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24">
        <div className="max-w-3xl">
          {settings.faqBadgeText.trim() ? (
            <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
              {settings.faqBadgeText}
            </Badge>
          ) : null}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            {settings.faqTitleLine1.trim() ? <>{settings.faqTitleLine1} </> : null}
            {settings.faqTitleAccent.trim() ? (
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                {settings.faqTitleAccent}
              </span>
            ) : null}
          </h1>
          {settings.faqIntro.trim() ? (
            <p className="mt-6 text-lg text-muted-foreground">{settings.faqIntro}</p>
          ) : null}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="rounded-3xl border-2 bg-card p-4 md:p-8 shadow-[var(--shadow-card)]">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base pb-5 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {settings.faqCtaLabel.trim() ? (
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-8 font-bold">
              <Link href={settings.faqCtaHref.trim() || "/contact"}>{settings.faqCtaLabel}</Link>
            </Button>
          </div>
        ) : null}
      </section>
    </>
  );
}
