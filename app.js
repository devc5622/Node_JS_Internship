// let express = require("express");
// let app = express();

// app.get("/", (req, res) => {
//     res.send("Welcome to my first API !!!");
// });
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

let products = [];
let express = require("express");
let app = express();
app.use(express.json());

app.post("/createProduct", (req, res) => {
  console.log("body data===>", req.body);
  let product = req.body;
  if (req.body.name && req.body.cost) {
    product.id = products.length + 1;
    product.isDeleted = false;
    products.push(product);
    // res.send("product is created")
    res.status(201).send({ msg: "added", product: product });
  } else {
    res.status(400).send({ msg: "Product not Added" });
  }
});

app.get("/getproducts", (req, res) => {
  let filteredProducts = products.filter(
    (product) => product.isDeleted === false
  );

  console.log("Filtered array:", filteredProducts);
  res.status(200).send({ filteredProducts });
});

app.get("/getproductsbycostandsort", (req, res) => {
  const minCost = req.query.mincost;
  const maxCost = req.query.maxcost;
  const sort = req.query.sort;

  let filteredProducts = products.filter((product) => {
    if (product.isDeleted === false) {
      if (
        (minCost && product.cost < minCost) ||
        (maxCost && product.cost > maxCost)
      ) {
        return false;
      }
      return true;
    }
    return false;
  });
  console.log("filteredProducts==>", filteredProducts);
  if (sort === "asc") {
    filteredProducts.sort((a, b) => a.cost - b.cost);
  } else if (sort === "dsc") {
    filteredProducts.sort((a, b) => b.cost - a.cost);
  }

  console.log("Filtered and Sorted array:", filteredProducts);
  res.status(200).send({ filteredProducts });
});

app.get("/getproduct", (req, res) => {
  let name = req.query.name;
  var done = products.find((val) => {
    if (val.name === name && !products.isDeleted) {
      return { product: val };
    }
  });
  res.status(200).send(done);
});

app.put("/updateproduct", (req, res) => {
  let name = req.query.name;
  let updatedProductData = req.body;
  let Index = products.findIndex((val) => val.name === name);

  if (Index >= 0) {
    products[Index].cost = updatedProductData.cost;
    products[Index].Description = updatedProductData.Description;
    console.log("Products==>", products, Index, updatedProductData);
    res.status(200).send({ msg: "Product Updated", products: products[Index] });
  } else {
    res.status(404).send({ error: "Product not found." });
  }
});

app.put("/deleteproduct", (req, res) => {
  let name = req.query.name;

  let foundProductIndex = products.findIndex((val) => val.name === name);

  if (foundProductIndex !== -1) {
    products[foundProductIndex].isDeleted = true;
    res
      .status(200)
      .send({ msg: "Product Deleted", product: products[foundProductIndex] });
  } else {
    res.status(404).send({ error: "Product not found." });
  }
});
app.delete("/harddeleteproduct", (req, res) => {
  let name = req.query.name;

  let foundProductIndex = products.findIndex((val) => val.name === name);

  if (foundProductIndex !== -1) {
    products.splice(foundProductIndex, 1);
    res.status(200).send({ msg: "Product Deleted", products: products });
  } else {
    res.status(404).send({ error: "Product not found." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
