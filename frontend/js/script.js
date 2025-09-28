document.addEventListener("DOMContentLoaded", function() {
  // LOGIN
  const loginForm = document.querySelector("#login-section form");
  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const email = loginForm.querySelector("input[type='email']").value;
      const password = loginForm.querySelector("input[type='password']").value;
      // Lógica de autenticação
      console.log("Login - Email:", email, "Senha:", password);
      // Exemplo de mensagem
      alert("Login realizado!");
    });
  }

  // CADASTRO
  const cadastroForm = document.querySelector("#cadastro-section form");
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const name = cadastroForm.querySelector("input[type='text']").value;
      const email = cadastroForm.querySelector("input[type='email']").value;
      const password = cadastroForm.querySelector("input[type='password']").value;
      // Lógica de cadastro
      console.log("Cadastro - Nome:", name, "Email:", email, "Senha:", password);
      alert("Cadastro realizado!");
    });
  }

  // RECUPERAR SENHA - ETAPA 1
  const formRecuperar = document.getElementById('form-recuperar');
  const recuperarSection = document.getElementById('recuperar-senha');
  const verificaCodigoSection = document.getElementById('verifica-codigo');
  const digiteSection = document.getElementById('digite');
  if (formRecuperar) {
    formRecuperar.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const mensagem = document.getElementById('mensagem');
      mensagem.textContent = `Se o e-mail ${email} estiver cadastrado, você receberá instruções para recuperar sua senha.`;
      mensagem.style.color = 'green';
      // Avança para etapa 2
      recuperarSection.classList.add('hidden');
      verificaCodigoSection.classList.remove('hidden');
    });
  }

  // RECUPERAR SENHA - ETAPA 2
  const formVerifica = document.getElementById('form-verifica');
  if (formVerifica) {
    formVerifica.addEventListener('submit', function(e) {
      e.preventDefault();
      const codigo = document.getElementById('codigo').value;
      const mensagemCodigo = document.getElementById('mensagem-codigo');
      // Simulação de verificação do código
      if (codigo === "123456") {
        mensagemCodigo.textContent = "Código verificado com sucesso!";
        mensagemCodigo.style.color = 'green';
        verificaCodigoSection.classList.add('hidden');
        digiteSection.classList.remove('hidden');
      } else {
        mensagemCodigo.textContent = "Código inválido. Tente novamente.";
        mensagemCodigo.style.color = 'red';
      }
    });
  }

  // RECUPERAR SENHA - ETAPA 3
  const formNovaSenha = document.getElementById('form-nova-senha');
  if (formNovaSenha) {
    formNovaSenha.addEventListener('submit', function(e) {
      e.preventDefault();
      const novaSenha = document.getElementById('nova-senha').value;
      const mensagemNovaSenha = document.getElementById('mensagem-nova-senha');
      mensagemNovaSenha.textContent = "Senha alterada com sucesso!";
      mensagemNovaSenha.style.color = 'green';
      formNovaSenha.querySelector('button').disabled = true;
    });
  }

  // PEDIDOS
  const pedidosForm = document.querySelector("#pedidos-section form");
  if (pedidosForm) {
    pedidosForm.addEventListener("submit", function(event) {
      event.preventDefault();
      // Exemplo: pegar dados do pedido
      const pedidoId = pedidosForm.querySelector("input[name='pedido-id']").value;
      console.log("Consulta de pedido:", pedidoId);
      alert("Pedido consultado!");
    });
  }

  // PERFIL
  const perfilForm = document.querySelector("#perfil-section form");
  if (perfilForm) {
    perfilForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const nome = perfilForm.querySelector("input[name='nome']").value;
      const email = perfilForm.querySelector("input[name='email']").value;
      // Lógica de atualização de perfil
      console.log("Perfil - Nome:", nome, "Email:", email);
      alert("Perfil atualizado!");
    });
  }
});