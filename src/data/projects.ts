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

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
