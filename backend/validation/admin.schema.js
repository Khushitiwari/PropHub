// Admin routes — mostly Mongo id in params (router already checks admin role)

export { objectIdParamSchema as adminUserIdParamsSchema } from "./common.schema.js";
export { objectIdParamSchema as adminPropertyIdParamsSchema } from "./common.schema.js";
export { objectIdParamSchema as approveSellerParamsSchema } from "./common.schema.js";
