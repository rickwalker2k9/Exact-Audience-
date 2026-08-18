import { createApp } from "../server/_core/app";

// Vercel Node.js functions accept an Express app directly as the request
// handler, so no listen()/server wiring happens here (that's Railway's job
// in server/_core/index.ts). Static assets are served by Vercel's CDN per
// vercel.json; this function only handles /api/* and /manus-storage/*.
export default createApp();
