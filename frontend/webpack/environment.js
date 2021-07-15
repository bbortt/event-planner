module.exports = {
  __TIMESTAMP__: String(new Date().getTime()),
  __VERSION__: process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : 'DEV',
  __DEBUG_INFO_ENABLED__: false,
  __SERVER_API_URL__: `'${process.env.hasOwnProperty('SERVER_API_URL') ? process.env.SERVER_API_URL : ''}'`,
};
