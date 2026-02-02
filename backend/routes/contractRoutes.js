const express = require("express");
const router = express.Router();

const {
  selectApplicant,
  confirmContract,
  getMyContracts
} = require("../controllers/contractController");

const { isLoggedIn } = require("../middlewares/middleware");

router.post("/contracts/select", isLoggedIn, selectApplicant);
router.post("/contracts/:id/confirm", isLoggedIn, confirmContract);
router.get("/contracts/my", isLoggedIn, getMyContracts);


module.exports = router;
