const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

function BDConnect(){
    const dbFile = '../Database/Estoque.db';
    const dbExiste = fs.existsSync(dbFile);
    //nesse caso o fs está sendo para verificar se o BD está presente no diretório passado
    if (!dbExiste) {
        fs.openSync(dbFile, 'w');
    }
    //Conexão sendo executada com o BD
    const database = new sqlite3.Database(dbFile, (err) => {
        if (err){
            //Função para caso a conexão não seja executada seja exibida uma mensagem de erro
            console.error(err.message);
        }
         //Executar um comando para criar a tabela caso o bd seja deletado por acidente :)
        database.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, descrição TEXT, amount INTEGER NOT NULL)");
        console.log(200);
    });
    
}
BDConnect();
function BDInsertFromAPI(data) {
    const dbFile = '../Database/Estoque.db';
  
    const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE);
  
    const { Name, Amount, Description } = data;
  
    if (!Name || !Amount || !Description) {
      console.error('Dados inválidos para inserção do produto');
      db.close();
      return;
    }
  
    const Produtos = [Name, Description, Amount];
  
    let placeholder = Produtos.map(() => '(?)').join(',');
  
    let sql = 'INSERT INTO products (nome, descrição, amount) VALUES (' + placeholder + ')';
  
    db.run(sql, Produtos, function (err) {
      if (err) {
        console.error(err.message);
        db.close();
        return;
      }
      
      const insertedId = this.lastID;
      console.log(`O produto com ID ${insertedId} foi adicionado com sucesso!`);
  
      db.close();
    });
  }
  

function BDSelectAll(){
    //O select tem que retornar um json contendo todos os dados
    //Normalmente ele retorna um json como padrão, mas infelizmente em testes anteriores não foi possível obter esse json
    //Para evitar isso, vou fazer uma gambiarra que crie um json com todos os dados do callback
    const dbFile = '../Database/Estoque.db';

    //O Promisse serve para para o processo assíncrono
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const sql = `SELECT * FROM products`;

        db.all(sql, [], (err, rows) => {
            if (err){
                reject(err);//caso der erro, a promisse será rejeitada e não retornará o Json
            } else {
                resolve(rows);//caso der certo, a promisse terá um callback contendo um Json
            }
        })
        db.close();

    });

}
function dataAllJson(){
    BDSelectAll()
    .then(rows =>{//O .then() retorna converte os dados obtidos da promisse em um Json e  exibirá o mesmo no console
        const jsonData = JSON.stringify(rows);
        console.log(jsonData);
    })
    .catch(err => {
        console.error(err);
    });
}

function BDGetProductById(id){//Consulta por nome de produto
    const dbFile = '../Database/Estoque.db';


    //O Promisse serve para para o processo assíncrono
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const sql = 'SELECT * FROM products WHERE id = ? ';

        db.all(sql, [id], (err, rows) => {
            if (err){
                reject(err);//caso der erro, a promisse será rejeitada e não retornará o Json
            } else {
                resolve(rows);//caso der certo, a promisse terá um callback contendo um Json
            }
        })
        db.close();

    });
}
function dataNameJson(){//Dados de nome de produto
    BDNameQuery()
        .then(rows =>{
            const jsonData = JSON.stringify(rows);
            console.log(jsonData);
        })
        .catch(err => {
            console.error(err);
        });
}
function BDUpdateData(id, newName, newDescription) {
    const dbFile = '../Database/Estoque.db';
  
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbFile);
      const sql = 'UPDATE products SET nome = ?, descrição = ? WHERE id = ?';
  
      db.run(sql, [newName, newDescription, id], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`Os dados do produto com ID ${id} foram atualizados com sucesso!`);
          resolve();
        }
      });
  
      db.close();
    });
  }
function BDDeleteData(id){//Deletar dados de produto
    const dbFile = '../Database/Estoque.db';
    

    //O Promisse serve para para o processo assíncrono
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const sql = 'DELETE FROM products WHERE Id = ? ';//Placeholder para o Id do produto

        db.run(sql, [id], function (err){
            if (err) return console.log(err.message);
            console.log(`O produto ${id} foi deletado com Sucesso!`);//Mensagem de Sucesso 
        });
        db.close();

    });
}
module.exports = {
    BDConnect,
    BDInsertFromAPI,
    BDSelectAll,
    BDUpdateData,
    BDDeleteData,
    BDGetProductById
  };

