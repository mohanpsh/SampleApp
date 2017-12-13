'use strict';

exports = module.exports = function(app, mongoose) {
  var category = new mongoose.Schema({

    name: String,
    status: { type: Number, default: 1 },
    parentCategory: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    },
    childCategory: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    }]
  });
  category.index({ name: 1 });
  category.index({ 'parentCategory.id': 1 });
  app.db.model('Category', category);
};
