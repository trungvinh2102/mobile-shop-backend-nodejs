module.exports = {
    port: process.env.SERVER_PORT,
    prefixApiVersion: process.env.PREFIX_API_VERSION || "/api/v1",
    jwtAccessKey: process.env.JWT_ACCESS_KEY || "test",
};
