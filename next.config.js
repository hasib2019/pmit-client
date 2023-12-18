/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 10/11/2022 1.00PM
 * @modify date 10/11/2022 1.00PM
 * @desc [description]
 */

module.exports = {
  reactStrictMode: true,
  poweredByHeader: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
  // distDir: 'build',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    // cache optimized images for 60 seconds    
    minimumCacheTTL: 60,  
  },
  trailingSlash: false,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
    buildActivity: false,
  },
  env: {
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG == true, // Enables debug mode
  },
  compress: false,
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  // front
  webpack(config, { isServer }) {
    if (isServer) {
      config.module.rules.push({
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/fonts/[name].[hash].[ext]',
          },
        },
      });
    }

    return config;
  },
};
