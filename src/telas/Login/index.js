import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import Botao from '../../componentes/Botao';
import { EntradaTexto } from '../../componentes/EntradaTexto';
import estilos from './estilos';
import { logar } from '../../servicos/auth';
import { Alerta } from '../../componentes/Alerta';
import { auth } from '../../config/firebase';
import { alterarDados, verificaSeTemEntradaVazia } from '../../utils/comum';
import { entradas } from './entradas';

import animacao from '../../../assets/animacao.gif';

export default function Login({ navigation }) {
  const [dados, setDados] = useState({
    email: '',
    senha: '',
  })

  const [statusError, setStatusError] = useState('');
  const [messagemError, setMessagemError] = useState('');
  const [carrregando, setCarregando] = useState(true);

  useEffect(() => {
    const estadoUsuario = auth.onAuthStateChanged(
      usuario => {
        if (usuario) {
          navigation.replace('Principal');
        }
        setCarregando(false);
      })

      return () => estadoUsuario();
  }, [])

  async function realizarLogin() {
    if(verificaSeTemEntradaVazia(dados, setDados)) return;

    const resultado = await logar(dados.email, dados.senha);
    if (resultado === 'erro') {
      setStatusError(true);
      setMessagemError('E-mail ou senha inválidos');
      return
    }
    navigation.replace('Principal');
  }

  if (carrregando) {
    return(
      <View style={estilos.containerAnimacao}>
        <Image source={animacao} style={estilos.imagem}/>
      </View>
    )
  }

  return (
    <View style={estilos.container}>
      
      {
        entradas.map((entrada, index) => {
          return (
            <EntradaTexto 
              key={entrada.id}
              {...entrada}
              value={dados[entrada.name]}
              onChangeText={valor => alterarDados(entrada.name, valor, dados, setDados)}
            />
          )
        })
      }

      <Alerta
        mensagem={messagemError}
        error={statusError == 'firebase'}
        setError={setStatusError}
      />

      <Botao onPress={() => realizarLogin()}>LOGAR</Botao>
      <Botao
        onPress={() => { navigation.navigate('Cadastro') }}
      >
        CADASTRAR USUÁRIO
      </Botao>
    </View>
  );
}
