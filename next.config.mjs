/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      },
        // This makes /uploads publicly accessible
   
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;