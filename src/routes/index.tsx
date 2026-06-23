import { createFileRoute } from "@tanstack/react-router";
import VoidCourier from "@/game/VoidCourier";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Void Courier — Deliver the Lost" },
      { name: "description", content: "A retro pixel platformer about a postal officer delivering lost things across the void back to Earth." },
      { property: "og:title", content: "Void Courier" },
      { property: "og:description", content: "Retro pixel platformer. Outrun the void. Deliver the lost." },
    ],
  }),
  component: VoidCourier,
});
