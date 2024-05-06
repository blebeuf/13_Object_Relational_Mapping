// Import the router module from express and the Category and Product models from the models directory.
const router = require('express').Router();
const { Category, Product } = require('../../models');

// Define API endpoints for `/api/categories`.

// GET request to retrieve all categories along with their associated Products.
router.get('/', async (req, res) => {
  try {
    // Retrieve all categories and include their related Product data.
    const categoryData = await Category.findAll({
      include: [
        { model: Product } // Association defined in Sequelize model.
      ],
    });
    // Send the category data as a JSON response with status 200 (OK).
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request to find a single category by its ID along with its associated Products.
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    // If no category is found, return a 404 (Not Found) error.
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    // Handle errors with a 500 (Internal Server Error) response.
    res.status(500).json(err);
  }
});

// POST request to create a new category.
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT request to update a category by its ID.
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: { id: req.params.id, }
    });

    if (!categoryData[0]) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {

    res.status(500).json(err);
  }
});

// DELETE request to remove a category by its ID.
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
