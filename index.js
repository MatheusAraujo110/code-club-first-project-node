import express from 'express';
import { v4 } from 'uuid';
import cors from "cors"

const port = 3001;
const app = express();
app.use(express.json());
app.use(cors())

// - Query params => meusite.com/users?nome=matheus&age=23    //FILTROS
// - Route params => /users/2     //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
// - Request body => {"name": "Matheus", "age":}

//Alguns princípios de REST
// - GET         => Buscar informação no back-end - Apenas lista os usuários. 
// - POST        => Criar informação no back-end - Apenas cria os usuários. 
// - PUT / PATCH => Alterar/Atualizar informação no back-end - Apenas edita os usuários.
// - DELETE      => Deletar informação no banck-end - Apenas deleta os usuários.

// - Middlewarre => INTERCEPTADOR => Tem o pooder de parar ou alterar dados da requisição.

const users = [];

const checkUserID = (request, response, next) => {
    const { id } = request.params;

    const index = users.findIndex((user) => user.id === id);

    if (index < 0) {
        return response.status(404).json({ messager: "user not found" });
    }

    request.userIndex = index;
    request.userId = id;
    next();
}
app.get('/users/', (request, response) => {
    return response.json(users);
});


app.post('/users/', (request, response) => {
    const { name, age } = request.body;
    const user = { id: v4(), name, age };

    users.push(user);

    return response.status(201).json(user);
});

app.put('/users/:id', checkUserID, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUsers = { id, name, age }

    users[index] = updateUsers

    return response.json(updateUsers)
});


app.delete('/users/:id', checkUserID, (request, response) => {
    const index = request.userIndex;

    users.splice(index, 1);

    return response.status(204).json();
});



app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} 🚀`)
});

