/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  dynamic: {
    "/login": { mode: "force-dynamic" },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
