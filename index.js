const express = require("express");

const server = express();
server.use(express.json());

var requisicoes = 0;
const projetos = [
  { id: 0, titulo: "Projeto Padrão", tarefas: ["Tarefa Padrão"] }
];

/*************** Middlewares ***************/
/*Calculando o tempo de cada requisição e log em console da mesma, com numero de requisições já realizadas */
server.use((req, res, next) => {
  console.time("Tempo da Requisição");
  requisicoes++;
  console.log("====================================");
  console.log(
    "Foi realizada uma requisição de número",
    requisicoes,
    "\nMétodo utilizado:",
    req.method,
    "\nNa rota/URL:",
    req.url
  );

  next();

  console.timeEnd("Tempo da Requisição");
  console.log("====================================");
});

/*Middlewares de inserção*/

function checkIdEstaPreenchido(req, res, next) {
  console.log("id preenchido");

  if (req.url.search("tarefas") >= 12) {
    return next();
  }
  if (!req.body.id) {
    console.log("dfkjhbgkfnjgdfjnkj");

    return res.status(400).json({ erro: "Id requerido" });
  }

  return next();
}

function checkTituloEstaPreenchido(req, res, next) {
  console.log("titulo peenchido");

  if (!req.body.titulo) {
    return res.status(400).json({ erro: "Titulo requerido" });
  }

  return next();
}

function checkTarefaEstaPreenchida(req, res, next) {
  console.log("tarefa preenchida");

  if (!req.body.tarefa) {
    return res.status(400).json({ erro: "Tarefa requerida" });
  }

  return next();
}

function checkTarefaAnteriorEstaPreenchida(req, res, next) {
  console.log("tarefa preenchida");

  if (!req.body.tarefaAnterior) {
    return res.status(400).json({ erro: "Tarefa requerida" });
  }

  return next();
}

function checkIdNaoExiste(req, res, next) {
  console.log("id não existe");

  const projeto = projetos.find(p => p.id == req.body.id);
  if (projeto) {
    return res.status(409).json({ erro: "Id já existente, utilize outro" });
  }

  return next();
}

function checkTituloNaoExiste(req, res, next) {
  console.log("titulo não existe");

  const projeto = projetos.find(p => p.titulo == req.body.titulo);
  if (projeto) {
    return res.status(409).json({
      erro: "Titulo já existente, utilize outro ou adicione apenas as tarefas"
    });
  }

  return next();
} //adicionar check tarefas não existe

function checkTarefaNaoExiste(req, res, next) {
  console.log("tarefa existente");

  const projeto = projetos[req.body.index];
  console.log(projeto);

  const tarefa = projeto.tarefas.find(t => t == req.body.tarefa);
  if (tarefa) {
    return res.status(409).json({ erro: "Tarefa já existente" });
  }

  return next();
}

/*Middlewares de verificação se existe*/

function checkIdJaExiste(req, res, next) {
  console.log("id existente");

  const projeto = projetos.find(p => p.id == req.params.id);

  if (projeto) {
    req.body.index = projetos.indexOf(projeto);
    console.log(req.body.index);

    return next();
  }

  return res.status(400).json({ erro: "Id inexistente" });
}

/*************** Rotas ***************/

server.post(
  "/projetos/:id/tarefas",
  checkIdJaExiste,
  checkTarefaEstaPreenchida,
  checkTarefaNaoExiste,
  (req, res) => {
    console.log("post:      /projetos/:id/tarefas");

    projetos[req.body.index].tarefas.push(req.body.tarefa);
    return res.json(projetos);
  }
);

server.post(
  "/projetos",
  checkIdEstaPreenchido,
  checkIdNaoExiste,
  checkTituloNaoExiste,
  checkTituloEstaPreenchido,
  (req, res) => {
    console.log("post:    /projetos");

    const { id, titulo } = req.body;
    projetos.push({ id, titulo: titulo, tarefas: [] });
    return res.json(projetos);
  }
);

server.get("/projetos", (req, res) => {
  return res.json(projetos);
});

server.get("/projetos/:id", checkIdJaExiste, (req, res) => {
  return res.json(req.projeto);
});

server.put(
  "/projetos/:id",
  checkIdJaExiste,
  checkIdEstaPreenchido,
  checkTituloEstaPreenchido,
  (req, res) => {
    const { id, titulo } = req.body;
    const projeto = projetos.find(p => p.id == req.params.id);
    if (projeto) {
      const index = projetos.indexOf(projeto);
      projetos[index].id = id;
      projetos[index].titulo = titulo;
    }
    return res.json(projetos);
  }
);

server.put(
  "/projetos/:id/tarefas",
  checkIdJaExiste,
  checkTarefaEstaPreenchida,
  checkTarefaAnteriorEstaPreenchida,
  (req, res) => {
    const { tarefaAnterior, tarefa } = req.body;
    const projeto = projetos.find(p => p.id == req.params.id);
    if (projeto) {
      const index = projetos[projetos.indexOf(projeto)].tarefas.indexOf(
        tarefaAnterior
      );
      projetos[projetos.indexOf(projeto)].tarefas[index] = tarefa;
    }
    return res.json(projetos);
  }
);

server.delete("/projetos/:id", checkIdJaExiste, (req, res) => {
  const { index } = req.body;

  projetos.splice(index, 1);

  return res.json(projetos);
});

server.delete(
  "/projetos/:id/tarefas",
  checkIdJaExiste,
  checkTarefaEstaPreenchida,
  (req, res) => {
    const { index, tarefa } = req.body;

    const indexTarefa = projetos[index].tarefas.indexOf(tarefa);

    projetos[index].tarefas.splice(indexTarefa, 1);

    return res.json(projetos);
  }
);

server.listen(3000);
