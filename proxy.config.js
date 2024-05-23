const PROXY_CONFIG = [
  {
    context: [
      /* URL du backend */
      "/api",
      /* URL Spring Security OAuth2 (fournit par JRAF) */
      "/oauth2",
      "/login"
    ],
    target: "http://localhost:8080",
    logLevel: "debug",
    cookiePathRewrite: {
      "*": "/"
    },
    secure: false
  }
]
module.exports = PROXY_CONFIG;