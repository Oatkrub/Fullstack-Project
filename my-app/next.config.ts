import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    'expo-modules-core', 
    'expo-router', 
    'expo-status-bar', 
    '@expo/vector-icons'
  ],
};

export default nextConfig;
