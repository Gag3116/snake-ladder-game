const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/snake_ladder');

const wordLibrarySchema = new mongoose.Schema({
  name: String,
  words: [String],
});

const WordLibrary = mongoose.model('WordLibrary', wordLibrarySchema);

// 获取所有词库
app.get('/api/word-libraries', async (req, res) => {
  const libraries = await WordLibrary.find();
  res.json(libraries);
});

// 获取特定词库
app.get('/api/word-libraries/:id', async (req, res) => {
  const { id } = req.params;
  const library = await WordLibrary.findById(id);
  if (library) {
    res.json(library);
  } else {
    res.status(404).send('Word library not found');
  }
});

// 添加词库
app.post('/api/word-libraries', async (req, res) => {
  const { name, words } = req.body;
  const library = new WordLibrary({ name, words });
  await library.save();
  res.json(library);
});

const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
