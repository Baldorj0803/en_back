const express = require("express");
const router = express.Router();

const {
  getWords,
  createWord,
  updateWord
} = require("../controller/firebase_words");

//"/api/v1/categories"
router.route("/").get(getWords).post(createWord);

// router.route("/save").put(updateSaveWord);

router.route("/:id").put(updateWord);
// .delete(deleteWord);
// router.route("/allClear").post(allClear);

module.exports = router;
