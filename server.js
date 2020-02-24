//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para cocnfigurar os arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true}))

//configurar conxão com BD
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '32465541',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean ou booleano aceita dois valores verdadeiro ou false
})


//Configurar apresentação na pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de Banco de dados.")

        const donors = result.rows;
        
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req,res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    }
    //coloca valores dentro do bd.
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send("Erro no Banco de dados.")

        //fluxo ideal
        return res.redirect("/")

    })
})

//ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function(){
    console.log("inicie o servidor.")
})
