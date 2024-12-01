import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import Item from './models/Item'; 

const app = express();

connectDatabase();

app.use(express.json({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => res.send('API is running'));

app.post(
  '/api/items',
  [
    check('name', 'Please enter a name for the item').not().isEmpty(),
    check('description', 'Please enter a description for the item').not().isEmpty(),
    check('price', 'Please enter a price for the item').isNumeric()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;
    try {
      const newItem = new Item({
        name,
        description,
        price
      });

      await newItem.save();
      res.json(newItem);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/items/:id', 
  [
    check('name', 'Please enter a name for the item').not().isEmpty(),
    check('description', 'Please enter a description for the item').not().isEmpty(),
    check('price', 'Please enter a price for the item').isNumeric(),
    check('quantity', 'Please enter a valid quantity').isNumeric() 
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, description, price, quantity } = req.body;

    try {
      let item = await Item.findById(req.params.id);

      if (!item) {
        return res.status(404).json({ msg: 'Item not found' });
      }

      item.name = name || item.name;
      item.description = description || item.description;
      item.price = price || item.price;
      item.quantity = quantity || item.quantity; 

      await item.save();
      res.json(item);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

const port = 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

