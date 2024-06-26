const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    // find all categories with its associated Products
    // Retrieve all tags and include related Product data using Sequelize's `findAll` method
    const categoryData = await Tag.findAll({
      include: [
        { model: Product }
      ],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    // find one category by its `id` value and its associated Products 
    // Retrieve a single tag by its primary key (PK) with associated Product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product }
      ],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    // Create a new tag with data provided in the request body
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    });

    // Check if any tag was updated (array returned with the number of affected rows)
    if (!tagData[0]) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    // Attempt to delete a tag where the ID matches the ID specified in the route parameters
    const tagData = await Tag.destroy({
      where: { id: req.params.id, }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json('Tag has been deleted..!!');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;