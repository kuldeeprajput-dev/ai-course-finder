import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coursenva — Learn without limits",
    short_name: "Coursenva",
    description:
      "Discover high-quality free online courses and build personalized learning paths with AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f6f4",
    theme_color: "#e85d3f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  };
}
