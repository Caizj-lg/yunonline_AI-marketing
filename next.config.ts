import type { NextConfig } from "next";

const basePath = process.env.GITHUB_PAGES === "true" ? "/yunonline_AI-marketing" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  devIndicators: false,
};

export default nextConfig;
