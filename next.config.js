
module.exports = {
    exportTrailingSlash: true,
    env: {
        /* Dev environment */
        NEXT_PUBLIC_AUTH0_CLIENT_ID:"Q5AcDJ6XeVJ7IBnqbTGF2m5Ctk3lBxpE",
        NEXT_PUBLIC_AUTH0_SCOPE:"openid profile",
        NEXT_PUBLIC_AUTH0_DOMAIN:"maven-internal.eu.auth0.com",
        NEXT_PUBLIC_REDIRECT_URI:"http://localhost:3000/api/callback",
        NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI:"http://localhost:3000/",
        NEXT_APP_API_ENDPOINT:"https://v0jeilq247.execute-api.us-east-1.amazonaws.com/dev",
        NEXT_APP_MAIN_DOMAIN:"dev.pomeuser.zien.vn",
        NEXT_WEB_SOCKET: "wss://09w076duwc.execute-api.us-east-1.amazonaws.com/dev",
        NEXT_APP_VERSION: `${process.env.NEXT_APP_VERSION}`,
        /* End dev environment */
        /* Staging environment */
        // NEXT_PUBLIC_AUTH0_DOMAIN : "thuyhtx.auth0.com",
        // NEXT_APP_REDIRECT_URI : "https://dev.pomeuser.zien.vn/",
        // NEXT_PUBLIC_AUTH0_CLIENT_ID : "zKeBlVA0uNtmeeAGzfGDbrYB0ahK8NCC",
        // NEXT_APP_API_ENDPOINT :"https://cj93gtsb42.execute-api.us-east-1.amazonaws.com/stg",
        // NEXT_APP_MAIN_DOMAIN:"staging.maven.zien.vn",
        // NEXT_APP_VERSION: `${process.env.NEXT_APP_VERSION}`,
        // NEXT_WEB_SOCKET: "wss://e310gxyc96.execute-api.us-east-1.amazonaws.com/stg"
        /* End staging environment */
    },
}
