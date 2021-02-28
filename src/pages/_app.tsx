import { useState } from 'react'

import '../styles/global.css'


function MyApp({ Component, pageProps }) {
  // const [level, setLevel] = useState(1);

  // function levelUp() {
  //   setLevel(level + 1);
  // }

  return (

    //todos os elementos do provider vao ter acesso aos dados daquele contexto,
    //todos os dados armazenados nele, ou seja, toda a aplicacao, poderão acessar o contexto dos challenges
    //DESTAQUE -> além de passar varias informações aqui, podemos até passar funções!!!

    //<ChallengesContext.Provider value={{ level, levelUp }}>
    //<ChallengesProvider>
    <Component {...pageProps} />
    //</ChallengesProvider>
  )
}

export default MyApp
