/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
                // pathname: '/photos/**'
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
