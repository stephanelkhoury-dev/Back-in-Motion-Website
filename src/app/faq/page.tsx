'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemData {
  question: string;
  answer: string;
  category: string;
}

function FAQAccordion({ item }: { item: FAQItemData }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-foreground pr-4">{item.question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [FAQ_ITEMS, setFaqItems] = useState<FAQItemData[]>([]);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => setFaqItems(data.faq || []))
      .catch(() => {});
  }, []);

  const categories = ['All', ...new Set(FAQ_ITEMS.map((item) => item.category))];
  const filtered = activeCategory === 'All' ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find answers to common questions about our services, booking, pricing, and more.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <FAQAccordion key={i} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
