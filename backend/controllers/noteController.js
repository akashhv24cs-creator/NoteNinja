const Note = require('../models/Note');

// @desc    Get all notes for logged in user (with optional filtering & search)
// @route   GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const { search, category, tag } = req.query;
    let query = { userId: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notes' });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error('Get Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching note' });
  }
};

// @desc    Create new note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    const note = await Note.create({
      title,
      content,
      category: category || 'General',
      tags: parsedTags || [],
      userId: req.user.id
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error creating note' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    let note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category: category || note.category, tags: parsedTags || note.tags },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating note' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note removed successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting note' });
  }
};
