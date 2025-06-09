const systemConfig = require("../../config/system");

const productRoute = require("./product.route")

const categoryRoute = require("./category.route")

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/products",
    productRoute
  );

  app.use(

    PATH_ADMIN + "/category",
    categoryRoute
  )

}