import { createFileRoute } from "@tanstack/react-router";
import { fail, getController, ok } from "@/lib/leads/server-utils.server";

export const Route = createFileRoute("/api/leads/stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const c = await getController(request);
          return ok(await c.stats());
        } catch (e) { return fail(e); }
      },
    },
  },
});
