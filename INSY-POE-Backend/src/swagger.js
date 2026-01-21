//Site -> https://medium.com/@samuelnoye35/simplifying-api-development-in-node-js-with-swagger-a5021ac45742
//Site -> https://dev.to/qbentil/swagger-express-documenting-your-nodejs-rest-api-4lj7
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'INSY POE API',
        version: '1.0.0',
        description: 'API Stuff'
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 5000}`,
        },
    ],
      components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
  

const options = {
    swaggerDefinition,
     apis: ["./routes/*.js"], // path to api docs
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
