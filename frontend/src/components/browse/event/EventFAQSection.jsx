/**
 * EventFAQSection.jsx
 * FAQ accordion — maps to event.model.js faqs[] (faqItemSchema)
 * Fields: faq.question, faq.answer
 */
import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionHeading } from "./shared/EventShared.jsx";

const MOCK_FAQS = [
  {
    _id: "f1",
    question: "What is the age restriction?",
    answer:
      "This is an all-ages event. Children under 5 enter free with a paying adult.",
  },
  {
    _id: "f2",
    question: "Can I bring my own food or drinks?",
    answer:
      "Outside food and beverages are not permitted. Multiple F&B stalls will be available on site throughout the event.",
  },
  {
    _id: "f3",
    question: "Is re-entry allowed?",
    answer:
      "Re-entry is not permitted once you exit the venue. Please plan accordingly and ensure you have everything you need before leaving.",
  },
  {
    _id: "f4",
    question: "Are tickets refundable?",
    answer:
      "All ticket sales are final. However, tickets may be transferred to another person via the Ticket Bro app up to 2 hours before the event.",
  },
  {
    _id: "f5",
    question: "What should I bring?",
    answer:
      "Please bring your ticket (digital or printed), a valid photo ID, and arrive early to avoid queues at entry.",
  },
  {
    _id: "f6",
    question: "Is there parking available?",
    answer:
      "Limited parking is available at the venue. We strongly recommend using public transport or ride-sharing services to avoid delays.",
  },
];

const EventFAQSection = ({ event }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = event.faqs?.length ? event.faqs : MOCK_FAQS;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>
        <HelpCircle size={18} className="inline mr-1.5 text-muted-foreground" />
        Frequently Asked Questions
      </SectionHeading>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={faq._id || i}
              className="rounded-xl border overflow-hidden transition-all"
              style={{
                borderColor: isOpen ? "var(--foreground)" : "var(--border)",
                background: "var(--card)",
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex items-center justify-between w-full px-4 py-3.5 text-left gap-3 hover:bg-accent/30 transition-colors"
              >
                <p
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {faq.question}
                </p>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  <p
                    className="text-sm text-muted-foreground leading-relaxed pt-3"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventFAQSection;
