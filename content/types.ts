export type Locale = "ka" | "en";

export type Service = {
  id: string;
  name: string;
  summary: string;
  icon?: string;
  iconSvg?: string | null;
  color?: string;
};

export type WorkItem = {
  id: string;
  serviceId: string;
  title: string;
  summary: string;
};

export type Partner = {
  id: string;
  name: string;
  role: string;
  summary: string;
  about: string;
  focus: string[];
  workIds: string[];
  since: string;
};

export type TermSection = {
  title: string;
  body: string;
};

export type PlanPricingTier = {
  unit: "day" | "week" | "month" | "year";
  quantity: number;
  price: string;
  period: string;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  /** Multi-tier pricing from API; static fallback may omit this. */
  pricing?: PlanPricingTier[];
  summary: string;
  features: string[];
  featured?: boolean;
};

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    services: string;
    works: string;
    partners: string;
    plans: string;
    terms: string;
    contact: string;
    login: string;
    register: string;
    profile: string;
    logout: string;
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
  plans: {
    label: string;
    title: string;
    lead: string;
    note: string;
    choose: string;
    from: string;
    items: Plan[];
    custom: {
      label: string;
      title: string;
      body: string;
      cta: string;
    };
  };
  works: {
    label: string;
    title: string;
    lead: string;
    all: string;
    play: string;
    open: string;
    closePlayer: string;
    video: string;
    photo: string;
    items: WorkItem[];
  };
  reel: { label: string; title: string; body: string };
  partners: {
    label: string;
    title: string;
    lead: string;
    slot: string;
    back: string;
    aboutLabel: string;
    focusLabel: string;
    worksLabel: string;
    sinceLabel: string;
    open: string;
    notFound: string;
    items: Partner[];
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
  auth: {
    loginLabel: string;
    loginTitle: string;
    loginLead: string;
    loginSubmit: string;
    loginSuccessTitle: string;
    loginSuccessBody: string;
    registerLabel: string;
    registerTitle: string;
    registerLead: string;
    registerSubmit: string;
    registerSuccessTitle: string;
    registerSuccessBody: string;
    email: string;
    phone: string;
    nameOrCompany: string;
    password: string;
    confirmPassword: string;
    note: string;
    again: string;
    required: string;
    emailInvalid: string;
    phoneInvalid: string;
    passwordShort: string;
    passwordMismatch: string;
    toLogin: string;
    toRegister: string;
    formError: string;
  };
  profile: {
    label: string;
    title: string;
    lead: string;
    personal: string;
    plan: string;
    works: string;
    worksTitle: string;
    allWorks: string;
    viewPlans: string;
    noPlan: string;
    noWorks: string;
    redirecting: string;
  };
  ctaBand: { title: string; body: string };
  footer: { rights: string; prototype: string };
  menu: { open: string; close: string; label: string; language: string };
  theme: {
    label: string;
    names: {
      noir: string;
      day: string;
    };
  };
};
