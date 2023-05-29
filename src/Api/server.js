const express = require('express');
const { BDConnect, BDInsertFromAPI, BDSelectAll, BDGetProductById, BDUpdateData, BDDeleteData } = require('../Functions/BD');

const app = express();
const port = 3000;

BDConnect();

app.get('/api/products/selectall', (req, res) => {//Faz o Select de todos os produtos e retorna um Json do mesmo
  BDSelectAll()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/api/products/insertproduct', (req, res) => {//Recebe um Json contendo os dados do produto a ser Inserido
  const dataFromAPI = req.body;
  BDInsertFromAPI(dataFromAPI)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/api/products/select/:id', (req, res) => {
    const productId = req.params.id;
  
    BDGetProductById(productId)
      .then(product => {
        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ error: 'Produto não encontrado.' });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter o produto.' });
      });
  });


  app.put('/api/products/update/:id', (req, res) => {
    const productId = req.params.id;
    const { Name, Description } = req.body;
  
    BDUpdateData(productId, Name, Description)
      .then(() => {
        res.status(200).json({ message: 'Dados do produto atualizados com sucesso.' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar os dados do produto.' });
      });
  });

  app.delete('/api/products/delete/:id', (req, res) => {
    const productId = req.params.id;
  
    BDDeleteData(productId)
      .then(() => {
        res.status(200).json({ message: 'Produto excluído com sucesso.' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir o produto.' });
      });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*Colinha contendo todas as rotas
GET:
http://localhost:3000 -- Endereço pra acessar a api
http://localhost:3000/api/products/selectall -- Faz um select e retorna um Json contendo todos os produtos No banco
http://localhost:3000/api/products/select/:id -- Faz um SelectQuery Específico pelo id fornecido e retorna(caso exista o id no banco) um Json com os dados do produto
POST:
http://localhost:3000/api/products/insertproduct -- Recebe os dados e adiciona um novo produto no banco de dados .
PUT:
http://localhost:3000/api/products/update/:id -- Recebe os dados e atualiza um produto específico com base no ID.
DELETE:
http://localhost:3000/api/products/delete/:id -- Recebe o id do produto e deleta o mesmo do banco de dados

o id do produto e atualizado a cada nova entrada no banco de dados, então não se faz necessário na hora de inserir os dados
inserir um id para o produto, isso é gerado automáticamente.
caso um produto seja deletado o id do próxmo produto vai ser o LastId(o ultimo id adicionado no banco) + 1.

*/