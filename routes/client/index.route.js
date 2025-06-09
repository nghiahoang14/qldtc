const productRoute = require("./product.route")

const authRoute = require("./auth.route")
module.exports = (app) => {
  app.use("/products", productRoute);
app.use("/category", categoryRoute);
  app.use("/auth", authRoute);
}
