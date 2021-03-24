function setupProxy() {
  const conf = [
    {
      context: [
        '/api',
        '/services',
        '/management',
        '/swagger-resources',
        '/v2/api-docs',
        '/v3/api-docs',
        '/h2-console',
        '/oauth2',
        '/login',
        '/auth',
        '/health',
      ],
      target: `http://localhost:8080`,
      secure: false,
      changeOrigin: false,
    },
  ];
  return conf;
}

module.exports = setupProxy();
