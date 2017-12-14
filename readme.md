# Sample Node App

## Installation Guide
- Copy contents of 'config.example.js` to config.js And add mongo DB path
- Run `npm install` 
- Run node index.js

Your app is working on http://localhost:3000/

## APIs
1. Add a category
    * **Link**: http://localhost:3000/category
    * **Method**: Post
    * **Params**:
`name : required`
` parent_id: if it is link with other we need to send id of parent category `

2. Add Product mapped to a category or categories.
    * **Link**: http://localhost:3000/product
    * **Method**: Post
    * **Params**: 
`            name : required`
`            price : required`
`            colour : optional`
`            size : optional`
`            categories: required (Add multiple categories quamma seperated ex:c1,c2,c3)`
            
3. Get all categories with all its child categories mapped to it.
Note​ : Each category object should look something like this
{Id : 1 , child_categories: [], ...}

    * **Link**: http://localhost:3000/category
    * **Method**: Get
    
4. Get all products by a category.
    * **Link**: http://localhost:3000/productFindByCategory
    * **Method**: Post
    * **Params**: 
`            category : required`

5. Update product details (name,price,etc)
    * **Link**: http://localhost:3000/product
    * **Method**: Post
    * **Params**: 
`            name : required`
`            price : required`
`            colour : optional`
`            size : optional`
`            categories: required (Add multiple categories quamma seperated ex:c1,c2,c3)`
`            product_id: For updating details we need product id`