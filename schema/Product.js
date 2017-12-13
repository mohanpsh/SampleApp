'use strict';

exports = module.exports = function(app, mongoose) {
  var product = new mongoose.Schema({
    name: String,
    price: String,
    colour: String,
    size: String,
    category: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    }],
    status: { type: Number, default: 1}
  });

  product.index({ name: 1 });
  product.index({ 'category.id': 1 });
  app.db.model('Product', product);
};