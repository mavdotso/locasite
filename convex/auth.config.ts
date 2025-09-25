import { convexEnv } from "./lib/env";

export default {
    providers: [
        {
            domain: convexEnv.CONVEX_SITE_URL,
            applicationID: 'convex',
        },
    ],
};
