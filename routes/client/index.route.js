const productRoute = require("./product.route")
const authRoute = require("./auth.route")
const cartRoute = require("./cart.route")
module.exports = (app) => {
  app.use("/products", productRoute);

  app.use("/auth", authRoute);

  app.use("/cart", cartRoute);
}