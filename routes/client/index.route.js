const productRoute = require("./product.route")

module.exports = (app) => {
  app.use("/products", productRoute);
}