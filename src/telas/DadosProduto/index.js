import { Alert, TouchableOpacity, View } from "react-native";
import { EntradaTexto } from "../../componentes/EntradaTexto";
import Botao from "../../componentes/Botao";
import estilos from "./estilos";
import { useState } from "react";
import { atualizarProduto, deletarProduto, salvarProduto } from "../../servicos/firestore";
import { Alerta } from "../../componentes/Alerta";
import Icon from "react-native-vector-icons/Feather";

export default function DadosProduto({ navigation, route }) {
  const [nome, setNome] = useState(route?.params?.nome || '')
  const [preco, setPreco] = useState(route?.params?.preco || '')
  const [mensagem, setMensagem] = useState('')
  const [mostarMensagem, setMostrarMensagem] = useState(false)

  async function salvar() {
    if (nome === '' || preco === '') {
      setMensagem('Todos os campos são obrigatórios')
      setMostrarMensagem(true)
      return
    }

    let resultado = ''
    if (route?.params) {
      resultado = await atualizarProduto(route.params.id, {
        nome, preco
      })
    } else {
      const resultado = await salvarProduto({
        nome,
        preco
      })
    }


    if (resultado === 'erro') {
      setMensagem('Não foi possível salvar o produto')
      setMostrarMensagem(true)
    } else {
      navigation.goBack()
    }
  }

  async function deletar() {
    Alert.alert(
      'Deletar produto',
      'Tem certeza que deseja deletar o produto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Deletar',
          onPress: () => {
            deletarProduto(route?.params?.id);
            navigation.goBack()
          },
          style: 'default'
        }
      ]
    )
  }

  return (
    <View style={estilos.container}>

      { route?.params && 
        <TouchableOpacity onPress={() => deletar()}>
        <Icon
          name="trash-2"
          size={28}
          color="red"
        />
      </TouchableOpacity>}

      <EntradaTexto
        label="Nome do produto"
        value={nome}
        onChangeText={texto => setNome(texto)}
      />
      <EntradaTexto
        label="Preço do produto"
        value={preco}
        onChangeText={texto => setPreco(texto)}
      />

      <Botao onPress={() => salvar()}>Salvar</Botao>

      <Alerta
        mensagem={mensagem}
        error={mostarMensagem}
        setError={setMostrarMensagem}
      />
    </View>
  )
}