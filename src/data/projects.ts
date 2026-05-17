import { Project } from "@/types/blocks";

export const projects: Project[] = [
  {
    slug: "openai",
    client: "OpenAI",
    title: "Designing the interface for the future of intelligence",
    year: "2023–2024",
    tags: ["Product Design", "Brand", "Web"],
    description:
      "A comprehensive design system and web presence for OpenAI, crafting interfaces that make powerful AI models accessible to everyone.",
    blocks: [
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=2400&q=90",
        alt: "OpenAI hero — abstract neural network visualization",
        caption: "Brand identity and digital presence",
      },
      {
        type: "text",
        width: "half",
        eyebrow: "Challenge",
        heading: "Making AI human",
        body: "OpenAI needed a design language that could communicate both the profound capability and the approachable nature of their models. We built a system that scales from consumer products to developer tools without losing coherence.",
      },
      {
        type: "text",
        width: "half",
        eyebrow: "Approach",
        heading: "System thinking at scale",
        body: "Starting from typographic foundations and a restrained color palette, we developed a modular component library that empowers OpenAI's teams to ship consistently across ChatGPT, the API, and research publications.",
      },
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=2400&q=90",
        alt: "ChatGPT interface design",
        caption: "ChatGPT — conversational interface",
      },
      {
        type: "image",
        width: "half",
        src: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&q=90",
        alt: "API dashboard",
        caption: "Developer API dashboard",
      },
      {
        type: "video",
        width: "half",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=90",
        alt: "Motion design showcase",
        autoplay: true,
        loop: true,
        caption: "Motion language",
      },
      {
        type: "figma",
        width: "full",
        embedUrl:
          "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fdemo%2F",
        title: "Interactive prototype — ChatGPT onboarding flow",
        aspectRatio: "16/9",
      },
      {
        type: "text",
        width: "full",
        align: "center",
        eyebrow: "Outcome",
        heading: "A new standard for AI interfaces",
        body: "The system shipped across ChatGPT, OpenAI.com, and the developer platform — reaching hundreds of millions of users globally. It established a visual grammar for how AI should feel: precise, warm, and trustworthy.",
      },
      {
        type: "image",
        width: "half",
        src: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=1200&q=90",
        alt: "Mobile interface",
        caption: "Mobile — ChatGPT iOS",
      },
      {
        type: "figma",
        width: "half",
        embedUrl:
          "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fdemo2%2F",
        title: "Component library — interactive preview",
        aspectRatio: "4/3",
      },
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1679958157919-b2d3e5c90c71?w=2400&q=90",
        alt: "Design system documentation",
        caption: "Design system — tokens and components",
      },
    ],
  },
];

  {
    slug: "stripe",
    client: "Stripe",
    title: "A checkout experience built for conversion at every scale",
    year: "2022–2023",
    tags: ["Product Design", "Motion", "Systems"],
    description:
      "Redesigning the core checkout and dashboard flows for Stripe, with a focus on reducing friction, building trust, and scaling to hundreds of markets.",
    blocks: [
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=2400&q=90",
        alt: "Stripe checkout redesign",
        caption: "Checkout — simplified to its essence",
      },
      {
        type: "text",
        width: "half",
        eyebrow: "Challenge",
        heading: "Trust at the moment of payment",
        body: "Every checkout is a moment of vulnerability. We redesigned Stripe's payment experience to feel inevitable — removing every unnecessary decision so users could move through confidently.",
      },
      {
        type: "text",
        width: "half",
        eyebrow: "Approach",
        heading: "Motion as a trust signal",
        body: "Micro-interactions communicate system state without words. Loading states, error recovery, and success confirmations were each choreographed to feel reassuring rather than mechanical.",
      },
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=2400&q=90",
        alt: "Stripe dashboard analytics",
        caption: "Dashboard — revenue at a glance",
      },
      {
        type: "image",
        width: "half",
        src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=90",
        alt: "Mobile payment UI",
        caption: "Mobile checkout",
      },
      {
        type: "image",
        width: "half",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90",
        alt: "Analytics dashboard",
        caption: "Revenue analytics",
      },
      {
        type: "text",
        width: "full",
        align: "center",
        eyebrow: "Outcome",
        heading: "Conversion up. Abandonment down.",
        body: "The redesigned checkout shipped across Stripe's entire product surface — increasing conversion by double digits and reducing support contacts related to payment confusion by over a third.",
      },
    ],
  },
  {
    slug: "linear",
    client: "Linear",
    title: "Making project management feel like a superpower",
    year: "2021–2022",
    tags: ["Product Design", "Interaction", "Web"],
    description:
      "Crafting Linear's issue tracking and roadmap experience — optimizing for keyboard-first power users while remaining approachable for entire organizations.",
    blocks: [
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=2400&q=90",
        alt: "Linear issue tracker",
        caption: "Issue tracking — built for speed",
      },
      {
        type: "text",
        width: "half",
        eyebrow: "Challenge",
        heading: "Speed as a design value",
        body: "Linear users measure tool performance in milliseconds. We designed an interface where every common action has a keyboard shortcut, and every transition takes under 100ms.",
      },
      {
        type: "text",
        width: "half",
        eyebrow: "Approach",
        heading: "Hierarchy that scales",
        body: "From individual issues to company-level initiatives, the information architecture needed to remain coherent. We developed a nesting model that engineers could understand immediately.",
      },
      {
        type: "image",
        width: "full",
        src: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=2400&q=90",
        alt: "Linear roadmap view",
        caption: "Roadmap — projects at a glance",
      },
      {
        type: "text",
        width: "full",
        align: "center",
        eyebrow: "Outcome",
        heading: "The tool engineers actually want to use",
        body: "Linear became the fastest-growing project management tool for engineering teams — with NPS scores consistently above 70. The keyboard-first design philosophy became a defining differentiator.",
      },
      {
        type: "image",
        width: "half",
        src: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=90",
        alt: "Command palette",
        caption: "Command palette — instant access",
      },
      {
        type: "image",
        width: "half",
        src: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=90",
        alt: "Team cycles view",
        caption: "Cycles — sprint planning reimagined",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
