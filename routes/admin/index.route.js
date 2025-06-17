const systemConfig = require("../../config/system");

const productRoute = require("./product.route")

const categoryRoute = require("./category.route")


const reviewRoute = require("./review.route")
 


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


  app.use(
    PATH_ADMIN + "/reviews",
    reviewRoute
  )

}