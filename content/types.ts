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
  hero: { title: string; lead: string; tagline: string };
  who: { label: string; body: string };
  mission: { label: string; body: string };
  vision: { label: string; body: string };
  services: {
    label: string;
    title: string;
    lead: string;
    items: Service[];
  };
  works: {
    label: string;
    title: string;
    lead: string;
    all: string;
    items: WorkItem[];
  };
  reel: { label: string; title: string; body: string };
  partners: {
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
  theme: {
    label: string;
    names: {
      noir: string;
      day: string;
      custom: string;
    };
    customTitle: string;
    customHint: string;
    reset: string;
    close: string;
    groups: {
      surfaces: string;
      text: string;
      accents: string;
    };
    fields: {
      page: string;
      pageFg: string;
      panel: string;
      panelFg: string;
      muted: string;
      mutedFg: string;
      band: string;
      bandFg: string;
      accent: string;
      accentFg: string;
      brand: string;
      card: string;
      cardFg: string;
      line: string;
      fgMuted: string;
      icon: string;
    };
  };
};
