/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BACK_URL: process.env.BACK_URL,
    },
};

module.exports = nextConfig;
