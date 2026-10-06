export type FaqItem = {
  q: string;
  a: string;
};

export const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "What are your check-in and check-out times?",
    a: "Standard check-in is from 12:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged subject to availability.",
  },
  {
    q: "Do you offer luggage storage?",
    a: "Yes. Free luggage storage is available on the day of check-in and check-out. Long-term storage can be arranged for residents on a small monthly fee.",
  },
  {
    q: "What documents do I need to book a seat?",
    a: "A valid government-issued photo ID (Aadhaar, Passport, Driving License, or Student ID) is required at the time of check-in. Foreign nationals must present a valid passport and visa.",
  },
  {
    q: "Are your rooms gender-segregated?",
    a: "Yes, we have separate floors and rooms for male, female, and co-ed dorms. You can choose your preferred option while booking.",
  },
  {
    q: "What's included in the rent?",
    a: "Your rent covers your seat, utilities (electricity & water), high-speed WiFi, housekeeping of common areas, and access to all shared facilities.",
  },
  {
    q: "Do you allow guests or visitors?",
    a: "Visitors are welcome in common areas between 9 AM – 9 PM. Overnight guests are not permitted in shared rooms for the privacy and safety of all residents.",
  },
  {
    q: "What is the minimum stay duration?",
    a: "A minimum stay of 3 months is required. If you leave earlier, the security deposit is not refundable.",
  },
  {
    q: "How much notice do I need to give before leaving?",
    a: "After 3 months, you must give at least 1 month written notice before vacating the hostel.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "Cancellations 7+ days before check-in get a full rent refund. Within 7 days, security is forfeited. Leaving before 3 months also means security is not refundable.",
  },
  { q: "Are pets allowed?", a: "Unfortunately, pets are not allowed in our hostels at this time." },
  {
    q: "Is smoking or alcohol permitted on the premises?",
    a: "Smoking is only allowed in designated outdoor areas. Consumption of alcohol is not permitted in shared rooms or common areas.",
  },
  {
    q: "How is security handled?",
    a: "We have 24/7 CCTV surveillance, smart card access to floors, on-site staff round the clock, and personal lockers in every room.",
  },
  {
    q: "Do you provide meals?",
    a: "We don't provide cooked meals, but our shared kitchens are fully equipped, and our café serves all-day snacks, coffee and tea at affordable prices.",
  },
];

function sanitizeFaqItem(item: Partial<FaqItem> | null | undefined): FaqItem {
  return {
    q: String(item?.q ?? "").trim(),
    a: String(item?.a ?? "").trim(),
  };
}

export function normalizeFaqs(settings: Record<string, unknown>): FaqItem[] {
  const raw = settings.faqs;
  if (Array.isArray(raw) && raw.length > 0) {
    const items = raw.map((item) => sanitizeFaqItem(item as Partial<FaqItem>)).filter((f) => f.q || f.a);
    return items.length > 0 ? items : DEFAULT_FAQS;
  }
  return DEFAULT_FAQS;
}
