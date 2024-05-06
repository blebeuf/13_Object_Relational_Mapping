const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    // find all categories with its associated Products
    const productData = await Product.findAll({
      include: [
        {model: Category}, 
        {model: Tag},
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }  
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      // Including associated Category and Tag models to enrich the response with related data.
      include: [
        {model: Category}, // Include details from the Category model.
        {model: Tag}       // Include details from the Tag model.
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  // most of this section was provided by NW

  await Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  // Attempt to update a product using the Product model's update method.
  // The request body is expected to contain the updated product data.
  await Product.update(req.body, {
    where: {
      id: req.params.id, // Specify the product ID to update based on the ID provided in the route parameter.
    },
  })
  .then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then((productTags) => {
    // Extract the current tag IDs associated with the product.
    const productTagIds = productTags.map(({ tag_id }) => tag_id);

    // Filter out any new tag IDs provided in the request that are not already associated with the product.
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    // Identify any existing tags that need to be removed because they are not in the updated list of tag IDs.
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // Execute both removal of old tags and addition of new tags in parallel.
    // Promise.all is used here to handle these asynchronous operations simultaneously.
    return Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }), // Remove tags that are no longer associated.
      ProductTag.bulkCreate(newProductTags), // Add new tags.
    ]);
  })
  .then((updatedProductTags) => {
    // Respond with the updated product tags data once all operations are successful.
    res.json(updatedProductTags);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id, }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
