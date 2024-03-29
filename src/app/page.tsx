"use client"
import Image from "next/image";
import React, { useState, ReactNode, Dispatch, SetStateAction } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Lock, Person } from '@mui/icons-material';

import principal from '../app/assets/principal.png';
import logo from '../app/assets/logo.svg';
import { FormControl } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserProvider";
import axios from "axios";
import { Input } from "@/components/ui/input";

interface TailwindButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  children: ReactNode;
}

const TailwindButton = ({ onClick, children }: TailwindButtonProps) => {
  return (
    <button onClick={onClick} className="bg-default w-full h-10 rounded self-center hover:bg-default/90 text-white">
      {children}
    </button>
  );
};


export default function Login() {
  const { setUserId } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      console.log('Resposta do login:', response.data);
      setUserId(response.data.id);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro durante o login:', err.response?.data);
      setError('Credenciais inválidas.');
    }
  };


  return (
    <main className="bg-gray-200 flex justify-center items-center h-screen">
      <section className="w-full h-screen bg-white md:w-1/2  md:flex ">
        <div className="w-full md:w-1/2 md:pr-4 bg-grayPrincipal p-6 flex flex-col justify-center">
          <Image
            src={logo}
            alt="logo unicap"
          />
          <FormControl className="space-y-3 mt-4">
            <Input placeholder="E-mail" type="email"/>
            <Input placeholder="Senha" type="password"/>
            <TailwindButton onClick={handleLogin} children="Acessar" />
          </FormControl>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0 flex items-center justify-center">
          <Image
            src={principal}
            alt="Imagem campus"
          />
        </div>
      </section>
    </main>
  );
}
