const express = require('express');
const bodyParser= require('body-parser')
const mongoose = require('mongoose')

var config = require('./config');

// var db;

// MongoClient.connect('mongodb://root:root@ds111565.mlab.com:11565/mongodb-mohan-test', (err, database) => {
//   // ... start the server
// 	if (err) return console.log(err)
// 	db = database
// })



var app = express();

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
});

//config data models
require('./models')(app, mongoose);

app.listen(3000, function() {
  console.log('App listening on 3000');
})

app.use(bodyParser.urlencoded({extended: true}))





// Add category
app.post('/category', (req, res) => {
  if(!req.body.name) {
	res.send({ 'success':false,'message': 'Name Is requiered.'});
  }
  var fields = {name:req.body.name};
  if(req.body.parent_id) {
  	req.app.db.models.Category.findById(req.body.parent_id, function (err, parent) {
        if (err) {
        	res.send({ 'success':false,'message': 'Parent id not matched'});
        } else {
	        fields.parentCategory = {};
	  		fields.parentCategory.id = parent._id;
	        req.app.db.models.Category.create(fields, function (err, category) {
		        if (err) {
		          res.send({ 'success':false,'message': 'Error in save'});
		        }
		        let arr = parent.childCategory;
		        arr.push({id:category._id});
		        parent.childCategory = arr;
		        parent.save();
	        	res.send({ 'success':true,'message': 'Category added successfully.'});
	      	});

	    }
      });
  } else {
  	req.app.db.models.Category.create(fields, function (err, category) {
        if (err) {
          res.send({ 'success':false,'message': 'Error in save'});
        }
    	res.send({ 'success':true,'message': 'Category added successfully.'});
  	});	
  }

})

// Get All category
app.get('/category', (req, res) => {
  req.app.db.models.Category.find({})
    .exec(function(error, categories) {
        unflatten(categories).then(function(result){
           res.send(result);
         }).catch(function(err){
           res.send(err);
         });
    });
});


function unflatten(arr) {
    var httpPromise = new Promise(function(resolve,reject){
      
      var tree = [],
          mappedArr = {},
          arrElem,
          mappedElem;


      for (var ind in arr) {
         arrElem = arr[ind];
         mappedArr[arrElem._id] = {};
         mappedArr[arrElem._id]['id'] = arrElem._id;
         mappedArr[arrElem._id]['name'] = arrElem.name;
        mappedArr[arrElem._id]['child_categories'] = [];
        
        if(arrElem.parentCategory && arrElem.parentCategory.id){
          mappedArr[arrElem._id]['parentid'] = arrElem.parentCategory.id;
          } else {
            mappedArr[arrElem._id]['parentid'] = 0;
          }
      }

      for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id];
          // If the element is not at the root level, add it to its parent array of children.
          if (mappedElem.parentid) {
            mappedArr[mappedElem['parentid']]['child_categories'].push(mappedElem);
          }
          // If the element is at the root level, add it to first level elements array.
          else {
            tree.push(mappedElem);
          }
        }
      }
      return resolve(tree);
    });
    return httpPromise;
}
                 

// Add and update product
app.post('/product', (req, res) => {
  
  if(!req.body.name) {
	res.send({ 'success':false,'message': 'Name Is requiered.'});
  }
  if(!req.body.price) {
	res.send({ 'success':false,'message': 'Price Is requiered.'});
  }

  var fields = {name:req.body.name}
  if(req.body.size) {
	fields.size = req.body.size;
  }
  if(req.body.colour) {
	fields.colour = req.body.colour;
  }
  
  if(req.body.categories) {
  	var categories = req.body.categories.split(',');

	fields.category = [];
	
	categories.forEach(function(val) { 
		fields.category.push({id:val});   
	});
	
	if(req.body.product_id) {        
	  	req.app.db.models.Product.findByIdAndUpdate(req.body.product_id, fields, function (err, task) {
        if (err) {
		  	console.log(err);
	      res.send({ 'success':false,'message': 'Error in save - Please make sure categories are valid.'});
	    } else {
			res.send({ 'success':true,'message': 'Product updated successfully.'});
		}
      });
	} else {
		req.app.db.models.Product.create(fields, function (err, category) {
		    if (err) {
		    	console.log(err);
		      res.send({ 'success':false,'message': 'Error in save - Please make sure categories are valid.'});
		    } else {
				res.send({ 'success':true,'message': 'Product added successfully.'});
			}
		});
	}

  } else {
  		res.send({ 'success':false,'message': 'Please select add at least 1 category.'});
  }

})



// Get All category
app.get('/product', (req, res) => {

	req.app.db.models.Product.find({})
        .populate('category.id')
        .exec(function(error, products) {
            //console.log(JSON.stringify(products, null, "\t"))
            res.send(products)
        });
  
})



// Get All category
app.post('/productFindByCategory', (req, res) => {

	if(!req.body.category) {
		res.send({ 'success':false,'message': 'Please enter a category.'});
	} else {
		req.app.db.models.Product.find({'category.id':req.body.category})
            .populate('category.id')
            .exec(function(error, products) {
                //console.log(JSON.stringify(products, null, "\t"))
                res.send(products)
        });
  	}
})