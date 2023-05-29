const axios = require('axios');

const newProduct = {
    Name: 'Celular',
    Amount: 10,
    Description: 'Descrição do novo produto'
  };

const productIdToDelete = 7;

function ReadProduct(){
    axios.get('http://localhost:3000/api/products/selectall')
    .then(response => {
      const products = response.data;
      console.log(products);
    })
    .catch(error => {
      console.error(error.response.data.error);
    });
}
function CreateProdutct(){
    const newProduct = {
        Name: 'Novo Produto',
        Amount: 10,
        Description: 'Descrição do novo produto'
      };
      
      axios.post('http://localhost:3000/api/products/insertproduct', newProduct)
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.error(error.response.data.error);
        });
      
}
function UpdateProduct(){
    const productIdToUpdate = 1;
    const updatedProduct = {
      Name: 'Produto Atualizado',
      Amount: 20,
      Description: 'Descrição atualizada do produto'
    };
    
    axios.put(`http://localhost:3000/api/products/update/:${productIdToUpdate}`, updatedProduct)
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error(error.response.data.error);
      });
    
}
function DeleteProduct(productIdToDelete) {
    axios.delete(`http://localhost:3000/api/products/delete/:${productIdToDelete}`)
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error(error.response.data.error);
      });
  }
  ReadProduct();
  CreateProdutct();
  DeleteProduct(productIdToDelete);

