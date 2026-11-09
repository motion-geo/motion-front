export type Locale = "ka" | "en";

export type Service = {
  id: string;
  name: string;
  summary: string;
};

export type WorkItem = {
  id: string;
  serviceId: string;
  title: string;
  summary: string;
};

export type TermSection = {
  title: string;
  body: string;
};

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    services: string;
    works: string;
    partners: string;
    terms: string;
    contact: string;
  };
  sample: string;
  cta: {
    services: string;
    works: string;
    partners: string;
    contact: string;
  };
  hero: { index: string; title: string; lead: string; tagline: string };
  who: { index: string; label: string; body: string };
  mission: { index: string; label: string; body: string };
  vision: { label: string; body: string };
  services: {
    index: string;
    label: string;
    title: string;
    lead: string;
    items: Service[];
  };
  works: {
    index: string;
    label: string;
    title: string;
    lead: string;
    all: string;
    items: WorkItem[];
  };
  reel: { index: string; label: string; title: string; body: string };
  partners: {
    index: string;
    label: string;
    title: string;
    lead: string;
    slot: string;
  };
  terms: {
    label: string;
    title: string;
    lead: string;
    draft: string;
    sections: TermSection[];
  };
  contact: {
    label: string;
    title: string;
    lead: string;
    note: string;
    name: string;
    company: string;
    phone: string;
    email: string;
    message: string;
    submit: string;
    successTitle: string;
    successBody: string;
    again: string;
    required: string;
    emailInvalid: string;
  };
  ctaBand: { title: string; body: string };
  footer: { rights: string; prototype: string };
  menu: { open: string; close: string; label: string };
};
