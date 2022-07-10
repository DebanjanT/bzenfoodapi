import Recipe from "../models/recipe";
import BzUser from "../models/user";
import AWS from "aws-sdk";
import Config from "../aws.config";
var slugify = require("slugify");
import { v4 as uuidv4 } from "uuid";
const S3 = new AWS.S3(Config);
export const uploadImage = async (req, res) => {
  const { image } = req.body;

  try {
    if (!image) return res.status(400).send("No image uploaded");

    //prepare image for uploading
    //as it appears as binary in console we have to remove data:image/jpeg tag from binary
    //remove data:image/jpeg;base64 tag by using regex

    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    //split and saving type of image from binary console data of image
    const type = image.split(";")[0].split("/")[1];

    //params for aws s3 config
    const params = {
      Bucket: "educity-india",
      Key: `${uuidv4()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    //using params config upload image to s3
    //upload takes two args
    //1.params, 2.callback
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error: ");
  }
};

/**
 * Had to comment dute to aws sdk access denined error which is stopping the server
 */
// export const removeImage = async (req, res) => {
//   try {
//     const { image } = req.body;
//     console.log(image);
//     const params = {
//       Bucket: image.Bucket,
//       Key: image.Key,
//     };

//     S3.deleteObject(params, (err, data) => {
//       if (err) {
//         console.log("Aws delete cb err", err);
//         res.sendStatus(400);
//       }
//       res.send({ deleted: true });
//     });
//   } catch (err) {
//     console.log("AWS express err", err);
//   }
// };

export const createRecipe = async (req, res) => {
  try {
    const { name, description, picture, ingredients, steps, raw_steps } =
      req.body;
    console.log(name, description, picture, ingredients, steps, raw_steps);
    // return;
    if (!name || !description || !ingredients || !steps)
      return res.status(404).send("Crerdentials required");
    const newSlug = slugify(`${name}${new Date()}`);
    //create a new Recipe
    const newRecipe = new Recipe({
      name,
      createdBy: req.user._id,
      description,
      picture: picture || {},
      ingredients,
      steps,
      raw_steps,
      slug: newSlug,
    });
    await newRecipe.save();
    return res.json(newRecipe);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const user = await BzUser.findOne({ _id: req.user._id });

    if (!user) return res.status(404).send("User not found");
    const allRecipes = await Recipe.find({ createdBy: req.user._id });
    return res.json(allRecipes);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

export const getSingleRecipe = async (req, res) => {
  try {
    const { slug } = req.params;
    const recipe = await Recipe.findOne({ slug: slug }).populate(
      "createdBy",
      "name"
    );

    return res.json(recipe);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { slug } = req.params;

    const recipe = await Recipe.findOneAndRemove({
      createdBy: req.user._id,
      slug: slug,
    });

    if (!recipe) return res.status(404).send("Recipe not found");

    return res.json({ deleted: true });
  } catch (err) {
    console.log(err);
    return res.statu(500).send("Server Error");
  }
};

export const updateSingleRecipe = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description, picture, ingredients, steps, raw_steps } =
      req.body;
    console.log(name, description, picture, ingredients, steps, raw_steps);
    const recipe = await Recipe.findOne({
      createdBy: req.user._id,
      slug: slug,
    });

    if (!recipe) return res.status(404).send("Recipe not found");
    if (recipe.createdBy != req.user._id)
      return res.status(404).send("Unauthorized action");
    recipe.name = name;
    recipe.description = description;
    recipe.picture = picture;
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    recipe.raw_steps = raw_steps;
    await recipe.save();
    return res.json({ update: true });
  } catch (err) {
    console.log(err);
    return res.statu(500).send("Server Error");
  }
};

export const searchQuery = async (req, res) => {
  try {
    const { query } = req.query;
    const result = await Recipe.find({
      $or: [
        {
          ingredients: { $regex: query, $options: "i" },
        },
        { name: { $regex: query, $options: "i" } },
      ],
    });
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};
