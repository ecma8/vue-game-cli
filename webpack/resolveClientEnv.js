const prefixRE = /^VUE_APP_/
const templatedir = process.env.npm_config_dir;
const path = require('path');

module.exports = function resolveClientEnv (options, raw) {
  const env = {}
  Object.keys(process.env).forEach(key => {
    if (prefixRE.test(key) || key === 'NODE_ENV') {
      env[key] = process.env[key]
    }
  })
    env.BASE_URL = options.publicPath;
    env.PROJECT_NAME = templatedir;
    env.DEFAULT_PATH = path.resolve(__dirname,'../../../../../');
  if (raw) {
    return env
  }

  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }
  return {
    'process.env': env
  }
}
