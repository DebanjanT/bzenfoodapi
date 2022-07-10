import express from "express";
import {
  createRecipe,
  getSingleRecipe,
  getUserRecipes,
  // removeImage,
  uploadImage,
  updateSingleRecipe,
  searchQuery,
  deleteRecipe,
} from "../controller/recipe";
import { verifyJwtToken } from "../middlewares/jwtVerify";

const router = express.Router();

router.post("/recipe/create", verifyJwtToken, createRecipe);
router.get("/recipe/get/:slug", getSingleRecipe);
router.post("/recipe/update/:slug", verifyJwtToken, updateSingleRecipe);
router.post("/recipe/delete/:slug", verifyJwtToken, deleteRecipe);
router.post("/recipe/upload/image", verifyJwtToken, uploadImage);
// router.post("/recipe/remove/image", verifyJwtToken, removeImage);
router.get("/user/recipes", verifyJwtToken, getUserRecipes);
router.post("/search", searchQuery);
module.exports = router;
