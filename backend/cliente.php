<?php
class Cliente
{
    protected int $id;
    protected string $nome;
    private string $email;
    private string $telefone;
    public function __construct(string $id, string $nome, string $email, string $telefone)
    {
        $this->id = $id;
        $this->nome = $nome;
        $this->email = $email;
        $this->telefone = $telefone;
    }
    public function getId(): int
    {
        return $this->id;
    }
    public function getNome(): string
    {
        return $this->nome;
    }
    public function getEmail(): string
    {
        return $this->email;
    }
    public function getTelefone(): string
    {
        return $this->telefone;
    }
}
?>