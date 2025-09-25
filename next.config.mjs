/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
