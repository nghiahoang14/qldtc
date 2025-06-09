const productRoute = require("./product.route")
const authRoute = require("./auth.route")
const reviewRoute = require("./review.route")

const categoryRoute = require("./category.route")
module.exports = (app) => {
  app.use("/products", productRoute);

  app.use("/auth", authRoute);

  app.use("/reviews", reviewRoute)

  app.use("/category", categoryRoute);

}
