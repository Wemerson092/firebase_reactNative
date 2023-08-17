import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";

function erroFirebase(error) {
  let mensagem = '';
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      mensagem = 'E-mail já cadastrado';
      break;
    case AuthErrorCodes.INVALID_EMAIL:
      mensagem = 'E-mail inválido';
      break;
    case AuthErrorCodes.WEAK_PASSWORD:
      mensagem = 'Senha fraca';
      break;
    default:
      mensagem = 'Erro desconhecido';
      break;
  }
}

export async function cadastrar(email, senha) {
  const resultado = await createUserWithEmailAndPassword(auth, email, senha)
    .then((dadosDoUsuario) => {
      console.log(dadosDoUsuario)
      return "sucesso"
    })
    .catch((error) => {
      console.log(error)
      return erroFirebase(error)
    });

  return resultado;
}

export async function logar(email, senha) {
  const resultado = await signInWithEmailAndPassword(auth, email, senha)
    .then((dadosDoUsuario) => {
      console.log(dadosDoUsuario)
      return "sucesso"
    })
    .catch((error) => {
      console.log(error)
      return "Erro ao logar"
    });

  return resultado;
}  