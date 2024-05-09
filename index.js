const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

// - Query params => meusite.com/users?nome=matheus&age=23    //FILTROS
// - Route params => /users/2     //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
// - Request body => {"name": "Matheus", "age":}

//Alguns princípios de REST
// - GET         => Buscar informação no back-end - Apenas lista os usuários. 
// - POST        => Criar informação no back-end - Apenas cria os usuários. 
// - PUT / PATCH => Alterar/Atualizar informação no back-end - Apenas edita os usuários.
// - DELETE      => Deletar informação no banck-end - Apenas deleta os usuários.

// - Middlewarre => INTERCEPTADOR => Tem o pooder de parar ou alterar dados da requisição.

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "user not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}
app.get('/users/', (request, response) => {

    return response.json(users)
});

/*
TRATAMENTOS DE ERROS (TRY CATCH)
*/

app.post('/users/', (request, response) => {
    try {

        const { name, age } = request.body

        if (age < 18) throw new Error("Only allowed users over 18 years old")

        const user = { id: uuid.v4(), name, age }

        users.push(user)

        return response.status(201).json(user)
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
    finally {
        console.log("terminou tudo")
    }
});

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUsers = { id, name, age }

    users[index] = updateUsers

    return response.json(updateUsers)
});


app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
});



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} 🚀`)
});

