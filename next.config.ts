import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep resolution inside this app (not a parent folder with another lockfile).
    root: path.resolve("."),
  },
};

export default nextConfig;
