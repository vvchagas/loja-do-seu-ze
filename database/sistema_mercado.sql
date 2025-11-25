-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23/11/2025 às 20:45
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sistema_mercado`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `acesso`
--

CREATE TABLE `acesso` (
  `id_acesso` int(11) NOT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `tipo_acesso` varchar(50) DEFAULT NULL,
  `id_Pessoa` int(11) NOT NULL,
  `id_gestao_conta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `acesso`
--

INSERT INTO `acesso` (`id_acesso`, `status`, `tipo_acesso`, `id_Pessoa`, `id_gestao_conta`) VALUES
(1, 'ativo', 'admin_sistema', 11, 1),
(2, 'ativo', 'admin_sistema', 12, 1),
(3, 'ativo', 'admin_sistema', 13, 1),
(4, 'ativo', 'admin_sistema', 14, 2),
(5, 'ativo', 'admin_sistema', 15, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `cadastro_cliente`
--

CREATE TABLE `cadastro_cliente` (
  `id_cadastro_cliente` int(11) NOT NULL,
  `usuario_cliente` varchar(50) DEFAULT NULL,
  `Restricao` varchar(100) DEFAULT NULL,
  `id_gestao_conta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cadastro_cliente`
--

INSERT INTO `cadastro_cliente` (`id_cadastro_cliente`, `usuario_cliente`, `Restricao`, `id_gestao_conta`) VALUES
(1, 'ana_clara', 'Sem restrições', 2),
(2, 'bruno_silva', 'Sem restrições', 2),
(3, 'carla_souza', 'Bloqueio parcial para fiado', 2),
(4, 'diego_pereira', 'Sem restrições', 2),
(5, 'elisa_santos', 'Limite de fiado R$ 200,00', 2),
(6, 'felipe_alves', 'Sem restrições', 2),
(7, 'gabriela_lima', 'Sem restrições', 2),
(8, 'henrique_costa', 'Cliente em observação', 2),
(9, 'isabela_rocha', 'Sem restrições', 2),
(10, 'joao_pedro', 'Sem restrições', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `saldo` decimal(10,2) DEFAULT 0.00,
  `id_Pessoa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `saldo`, `id_Pessoa`) VALUES
(1, 150.50, 1),
(2, 0.00, 2),
(3, 320.00, 3),
(4, 0.00, 4),
(5, 80.00, 5),
(6, 0.00, 6),
(7, 200.00, 7),
(8, 50.00, 8),
(9, 0.00, 9),
(10, 10.00, 10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `conta_divida`
--

CREATE TABLE `conta_divida` (
  `id_conta_divida` int(11) NOT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `Prazo_pagamento` date DEFAULT NULL,
  `id_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `conta_divida`
--

INSERT INTO `conta_divida` (`id_conta_divida`, `valor`, `Prazo_pagamento`, `id_cliente`) VALUES
(1, 200.00, '2025-12-10', 1),
(2, 150.00, '2025-12-15', 3),
(3, 300.00, '2026-01-05', 5),
(4, 120.00, '2025-11-30', 7),
(5, 90.00, '2025-12-20', 10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `gestao_conta`
--

CREATE TABLE `gestao_conta` (
  `id_gestao_conta` int(11) NOT NULL,
  `Login` varchar(50) DEFAULT NULL,
  `Senha` varchar(100) DEFAULT NULL,
  `id_ze` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `gestao_conta`
--

INSERT INTO `gestao_conta` (`id_gestao_conta`, `Login`, `Senha`, `id_ze`) VALUES
(1, 'admin_principal', 'senha123', 1),
(2, 'caixa_1', 'senha1234', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `logradouro`
--

CREATE TABLE `logradouro` (
  `id_logradouro` int(11) NOT NULL,
  `Nome` varchar(100) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `Bairro` varchar(50) DEFAULT NULL,
  `CEP` char(8) DEFAULT NULL,
  `id_mercado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `logradouro`
--

INSERT INTO `logradouro` (`id_logradouro`, `Nome`, `complemento`, `numero`, `Bairro`, `CEP`, `id_mercado`) VALUES
(1, 'Rua das Laranjeiras', 'Esquina com Av. Central', '100', 'Centro', '19800000', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `mercado`
--

CREATE TABLE `mercado` (
  `id_mercado` int(11) NOT NULL,
  `Nome` varchar(100) DEFAULT NULL,
  `CNPJ` char(14) DEFAULT NULL,
  `itens` text DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `id_ze` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `mercado`
--

INSERT INTO `mercado` (`id_mercado`, `Nome`, `CNPJ`, `itens`, `valor`, `id_ze`) VALUES
(1, 'Mercado do Zé', '12345678000100', 'Arroz, Feijão, Macarrão, Óleo, Leite', 0.00, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `id_Pagamento` int(11) NOT NULL,
  `Tipo_pagamento` varchar(50) DEFAULT NULL,
  `id_conta_divida` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pagamento`
--

INSERT INTO `pagamento` (`id_Pagamento`, `Tipo_pagamento`, `id_conta_divida`) VALUES
(1, 'Dinheiro', 1),
(2, 'PIX', 1),
(3, 'Cartão de débito', 3),
(4, 'PIX', 4);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pessoa`
--

CREATE TABLE `pessoa` (
  `id_Pessoa` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `CPF` char(11) NOT NULL,
  `sexo` enum('M','F','Outro') DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pessoa`
--

INSERT INTO `pessoa` (`id_Pessoa`, `nome`, `CPF`, `sexo`, `Email`) VALUES
(1, 'Ana Clara', '00000000001', 'F', 'ana.cliente@example.com'),
(2, 'Bruno Silva', '00000000002', 'M', 'bruno.cliente@example.com'),
(3, 'Carla Souza', '00000000003', 'F', 'carla.cliente@example.com'),
(4, 'Diego Pereira', '00000000004', 'M', 'diego.cliente@example.com'),
(5, 'Elisa Santos', '00000000005', 'F', 'elisa.cliente@example.com'),
(6, 'Felipe Alves', '00000000006', 'M', 'felipe.cliente@example.com'),
(7, 'Gabriela Lima', '00000000007', 'F', 'gabriela.cliente@example.com'),
(8, 'Henrique Costa', '00000000008', 'M', 'henrique.cliente@example.com'),
(9, 'Isabela Rocha', '00000000009', 'F', 'isabela.cliente@example.com'),
(10, 'João Pedro', '00000000010', 'M', 'joao.cliente@example.com'),
(11, 'Murilo Costa', '00000000011', 'M', 'murilo.dev@example.com'),
(12, 'Pedro Augusto', '00000000012', 'M', 'pedro.augusto.dev@example.com'),
(13, 'Vitim', '00000000013', 'M', 'vitim.dev@example.com'),
(14, 'Willian', '00000000014', 'M', 'willian.dev@example.com'),
(15, 'Pedro Peregrinelle', '00000000015', 'M', 'pedro.peregrinelle.dev@example.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `programador`
--

CREATE TABLE `programador` (
  `id_Pessoa` int(11) NOT NULL,
  `Tipo_Linguagem` varchar(50) DEFAULT NULL,
  `Classe_servico` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `programador`
--

INSERT INTO `programador` (`id_Pessoa`, `Tipo_Linguagem`, `Classe_servico`) VALUES
(11, 'PHP', 'Desenvolvimento'),
(12, 'PHP', 'Desenvolvimento'),
(13, 'PHP', 'Desenvolvimento'),
(14, 'PHP', 'Desenvolvimento'),
(15, 'PHP', 'Desenvolvimento');

-- --------------------------------------------------------

--
-- Estrutura para tabela `telefone`
--

CREATE TABLE `telefone` (
  `id_telefone` int(11) NOT NULL,
  `numero` varchar(15) DEFAULT NULL,
  `id_Pessoa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `telefone`
--

INSERT INTO `telefone` (`id_telefone`, `numero`, `id_Pessoa`) VALUES
(1, '18999990001', 1),
(2, '18999990002', 2),
(3, '18999990003', 3),
(4, '18999990004', 4),
(5, '18999990005', 5),
(6, '18999990006', 6),
(7, '18999990007', 7),
(8, '18999990008', 8),
(9, '18999990009', 9),
(10, '18999990010', 10),
(11, '11988887777', 11),
(12, '11988887778', 12);

-- --------------------------------------------------------

--
-- Estrutura para tabela `ze`
--

CREATE TABLE `ze` (
  `id_ze` int(11) NOT NULL,
  `Responsavel` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `ze`
--

INSERT INTO `ze` (`id_ze`, `Responsavel`) VALUES
(1, 'Zé do Mercado');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `acesso`
--
ALTER TABLE `acesso`
  ADD PRIMARY KEY (`id_acesso`),
  ADD KEY `id_Pessoa` (`id_Pessoa`),
  ADD KEY `id_gestao_conta` (`id_gestao_conta`);

--
-- Índices de tabela `cadastro_cliente`
--
ALTER TABLE `cadastro_cliente`
  ADD PRIMARY KEY (`id_cadastro_cliente`),
  ADD UNIQUE KEY `usuario_cliente` (`usuario_cliente`),
  ADD KEY `id_gestao_conta` (`id_gestao_conta`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `id_Pessoa` (`id_Pessoa`);

--
-- Índices de tabela `conta_divida`
--
ALTER TABLE `conta_divida`
  ADD PRIMARY KEY (`id_conta_divida`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Índices de tabela `gestao_conta`
--
ALTER TABLE `gestao_conta`
  ADD PRIMARY KEY (`id_gestao_conta`),
  ADD UNIQUE KEY `Login` (`Login`),
  ADD KEY `id_ze` (`id_ze`);

--
-- Índices de tabela `logradouro`
--
ALTER TABLE `logradouro`
  ADD PRIMARY KEY (`id_logradouro`),
  ADD KEY `id_mercado` (`id_mercado`);

--
-- Índices de tabela `mercado`
--
ALTER TABLE `mercado`
  ADD PRIMARY KEY (`id_mercado`),
  ADD KEY `id_ze` (`id_ze`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`id_Pagamento`),
  ADD KEY `id_conta_divida` (`id_conta_divida`);

--
-- Índices de tabela `pessoa`
--
ALTER TABLE `pessoa`
  ADD PRIMARY KEY (`id_Pessoa`),
  ADD UNIQUE KEY `CPF` (`CPF`);

--
-- Índices de tabela `programador`
--
ALTER TABLE `programador`
  ADD PRIMARY KEY (`id_Pessoa`);

--
-- Índices de tabela `telefone`
--
ALTER TABLE `telefone`
  ADD PRIMARY KEY (`id_telefone`),
  ADD KEY `id_Pessoa` (`id_Pessoa`);

--
-- Índices de tabela `ze`
--
ALTER TABLE `ze`
  ADD PRIMARY KEY (`id_ze`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `acesso`
--
ALTER TABLE `acesso`
  MODIFY `id_acesso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `cadastro_cliente`
--
ALTER TABLE `cadastro_cliente`
  MODIFY `id_cadastro_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `conta_divida`
--
ALTER TABLE `conta_divida`
  MODIFY `id_conta_divida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `gestao_conta`
--
ALTER TABLE `gestao_conta`
  MODIFY `id_gestao_conta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `logradouro`
--
ALTER TABLE `logradouro`
  MODIFY `id_logradouro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `mercado`
--
ALTER TABLE `mercado`
  MODIFY `id_mercado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `id_Pagamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `pessoa`
--
ALTER TABLE `pessoa`
  MODIFY `id_Pessoa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `telefone`
--
ALTER TABLE `telefone`
  MODIFY `id_telefone` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `ze`
--
ALTER TABLE `ze`
  MODIFY `id_ze` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `acesso`
--
ALTER TABLE `acesso`
  ADD CONSTRAINT `acesso_ibfk_1` FOREIGN KEY (`id_Pessoa`) REFERENCES `programador` (`id_Pessoa`),
  ADD CONSTRAINT `acesso_ibfk_2` FOREIGN KEY (`id_gestao_conta`) REFERENCES `gestao_conta` (`id_gestao_conta`);

--
-- Restrições para tabelas `cadastro_cliente`
--
ALTER TABLE `cadastro_cliente`
  ADD CONSTRAINT `cadastro_cliente_ibfk_1` FOREIGN KEY (`id_gestao_conta`) REFERENCES `gestao_conta` (`id_gestao_conta`);

--
-- Restrições para tabelas `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_Pessoa`) REFERENCES `pessoa` (`id_Pessoa`);

--
-- Restrições para tabelas `conta_divida`
--
ALTER TABLE `conta_divida`
  ADD CONSTRAINT `conta_divida_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);

--
-- Restrições para tabelas `gestao_conta`
--
ALTER TABLE `gestao_conta`
  ADD CONSTRAINT `gestao_conta_ibfk_1` FOREIGN KEY (`id_ze`) REFERENCES `ze` (`id_ze`);

--
-- Restrições para tabelas `logradouro`
--
ALTER TABLE `logradouro`
  ADD CONSTRAINT `logradouro_ibfk_1` FOREIGN KEY (`id_mercado`) REFERENCES `mercado` (`id_mercado`);

--
-- Restrições para tabelas `mercado`
--
ALTER TABLE `mercado`
  ADD CONSTRAINT `mercado_ibfk_1` FOREIGN KEY (`id_ze`) REFERENCES `ze` (`id_ze`);

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`id_conta_divida`) REFERENCES `conta_divida` (`id_conta_divida`);

--
-- Restrições para tabelas `programador`
--
ALTER TABLE `programador`
  ADD CONSTRAINT `programador_ibfk_1` FOREIGN KEY (`id_Pessoa`) REFERENCES `pessoa` (`id_Pessoa`);

--
-- Restrições para tabelas `telefone`
--
ALTER TABLE `telefone`
  ADD CONSTRAINT `telefone_ibfk_1` FOREIGN KEY (`id_Pessoa`) REFERENCES `pessoa` (`id_Pessoa`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
