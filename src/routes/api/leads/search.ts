import { createFileRoute } from "@tanstack/react-router";
import { fail, getController, ok } from "@/lib/leads/server-utils.server";

export const Route = createFileRoute("/api/leads/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const c = await getController(request);
          const q = new URL(request.url).searchParams.get("q") ?? "";
          return ok(await c.search(q));
        } catch (e) { return fail(e); }
      },
    },
  },
});
