import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coursefinder",
    short_name: "Coursefinder",
    description:
      "Discover high-quality free courses and build personalized learning paths.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f5",
    theme_color: "#315b4c",
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
