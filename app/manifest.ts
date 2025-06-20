import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Familienkasse Weissteiner",
    short_name: "Family Cash",
    description: "Kontostände der Sparschweine",
    start_url: "/",
    display: "standalone",
    background_color: "#2196f3",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
