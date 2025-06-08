const systemConfig = require("../../config/system");

const productRoute = require("./product.route")

const categoryRoute = require("./category.route")

const reviewRoute = require("./review.route")
 

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    "/admin/products",
    productRoute
  );

  app.use(
    PATH_ADMIN + "/categery",
    categoryRoute
  )

  app.use(
    PATH_ADMIN + "/reviews",
    reviewRoute
  )
}