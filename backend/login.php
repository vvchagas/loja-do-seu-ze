<?php
class Login
{
    private string $user;
    private string $password;
    private int $phone;
    private string $email;
    
    public function __construct(string $user, string $password, int $phone, string $email)
    {
        $this->user = $user;
        $this->phone = $phone;
        $this->password = $password;
        $this->email = $email;
    }

    public function validaUser(): bool
    {
        if(empty($this->user)){
            return false;
        } else{
            return true;
        }
    }

    private function getUser(): string
    {
        return $this->user;
    }

    private function getPassword(): string
    {
        return $this->password;
    }

    private function getPhone(): int
    {
        return $this->phone;
    }

    private function getEmail(): string
    {
        return $this->email;
    }


    private function setPassword(string $password): void
    {
        $this->password = $password;
    }

    private function setPhone(int $phone): void
    {
        $this->phone = $phone;
    }
}

?>
