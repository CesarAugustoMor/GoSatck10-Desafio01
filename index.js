const express = require("express");

const server = express();
server.use(express.json());

const projetos = [{ id: 1, title: "Projeto Padrão", tasks: ["Tarefa Padrão"] }];

/*Calculando o tempo de cada requisição e log em console da mesma */
server.use((req, res, next) => {
  console.log("====================================");
  console.log(
    "Foi realizada uma requisição no método:",
    req.method,
    "Na rota/URL:",
    req.url
  );
  console.time("Tempo da Requisição");

  next();

  console.timeEnd("Tempo da Requisição");
  console.log("====================================");
});
/*************** Middlewares ***************/

/*Middlewares de inserção*/

function checkIdEstaPreenchido(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ erro: "Id requerido" });
  }

  return next();
}

function checkTituloEstaPreenchido(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ erro: "Titulo requerido" });
  }

  return next();
}

function checkTarefaEstaPreenchido(req, res, next) {
  if (!req.body.task) {
    return res.status(400).json({ erro: "Tarefa requerida" });
  }

  return next();
}

function checkIdNaoExiste(req, res, next) {
  for (let i = 0; i < projetos.length; i++) {
    const projeto = projetos[i];
    if (projeto.id === req.body.id) {
      return res.status(409).json({ erro: "Id já existente, utilize outro" });
    }
  }

  return next();
}

function checkTituloNaoExiste(req, res, next) {
  for (let i = 0; i < projetos.length; i++) {
    const projeto = projetos[i];
    if (projeto.title === req.body.title) {
      return res.status(409).json({
        erro: "Titulo já existente, utilize outro ou adicione apenas as tarefas"
      });
    }
  }

  return next();
}

/*Middlewares de verificação se já existe*/

function checkIdJaExiste(req, res, next) {
  for (let i = 0; i < projetos.length; i++) {
    if (projetos[i].id === req.body.id) {
      return next();
    }
  }

  return res.status(400).json({ erro: "Id inexistente" });
}

function checkTituloJaExiste(req, res, next) {
  for (let i = 0; i < projetos.length; i++) {
    if (projetos[i].title === req.body.title) {
      return next();
    }
  }

  return res.status(400).json({ erro: "Titulo inexistente" });
}

function checkTarefaJaExiste(req, res, next) {
  const projeto = projetosreq.params[req.params.index];
  for (let i = 0; i < projeto.length; i++) {
    if (projeto.tasks[i] === req.body.task) {
      return next();
    }
  }

  return res.status(400).json({ erro: "Tarefa inexistente" });
}

server.listen(3000);
