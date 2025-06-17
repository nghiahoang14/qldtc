const productRoute = require("./product.route")

const authRoute = require("./auth.route")
const categoryRoute = require("./category.route")
module.exports = (app) => {
  app.use("/products", productRoute);
app.use("/category", categoryRoute);
  app.use("/auth", authRoute);
}
