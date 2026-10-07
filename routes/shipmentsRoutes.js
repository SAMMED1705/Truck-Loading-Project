const express = require("express");
const router = express.Router();
const controller = require("../controllers/shipmentController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.index);
router.get("/create", auth, controller.create);
router.post("/", auth, controller.store);
router.get("/:id", auth, controller.show);
router.get("/:id/edit", auth, controller.edit);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.destroy);

module.exports = router;
