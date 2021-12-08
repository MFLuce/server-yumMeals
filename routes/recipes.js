const { Router } = require("express");
// const upload = require("../middleware/cloudinary");
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");
const router = Router();

router.get("/", (req, res) => {
  Recipe.find({}).then((allRecipes) => {
    res.json({ recipes: allRecipes });
  });
});

//upload.single("juanPostPic")
router.post("/create", isLoggedIn, (req, res) => {
  Recipe.create({
    owner: req.user._id,
    title: req.body.title,
    category: req.body.category,
    ingredients: req.body.ingredients,
    stepsRecipe: req.body.stepsRecipe,

    // image: req.file.path,
  })
    .then((createRecipe) => {
      console.log(createRecipe);
      res.json({ recipes: createRecipe });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ errorMessage: "Something fed up" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  // console.log(req.params);

  Recipe.findById(id)
    .populate("owner")
    .then((recipe) => {
      if (!recipe) {
        return res
          .status(404)
          .json({ errorMessage: `Recipe with the id ${id} does not exist` });
      }

      res.json({ recipe });
      // console.log(recipe);
    });
});

// Deleting singleRecipe goes here in the Backend and then we can go to the related handleDeleteSingleRecipe in the frontend.
router.delete("/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  // console.log(req.params);
  Recipe.findByIdAndDelete(id)
    .then((deletedRecipe) =>
      res.status(200).json({ message: `Recipe ${deletedRecipe} was deleted` })
    )
    .catch((error) =>
      res.status(500).json({ message: "Something went wrong" })
    );
});

// Updating Recipe, similiar as Deleting goes to related handleUpdateRecipe in the recipeService frontend.
router.put("/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { owner } = req.user._id;
  const { titel, category, ingredients, stepsRecipe } = req.body;
  const newRecipe = { titel, category, ingredients, stepsRecipe };

  Recipe.findByIdAndUpdate(id, newRecipe)
    .then((updatedRecipe) =>
      res
        .status(200)
        .json({ message: `Recipe ${updatedRecipe} was succesful updated` })
    )
    .catch((error) =>
      res.status(500).json({ message: "Something went wrong" })
    );
});

module.exports = router;
