import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;


interface CountdownProviderProps {
    //REACTNODE aceita qualquer elemento como children (componente, texto...)
    children: ReactNode;
}

export function CountdownProvider({ children }: CountdownProviderProps) {

    //pegar a funcao startNewChallange desestruturando o contexto
    const { startNewChallange } = useContext(ChallengesContext);

    //constantes de estado
    const [time, setTime] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    //REGION - COUNT SPANS
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    //END REGION

    //REGION - ONCLICK START/RESET COUNTDOWN
    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        //nesse caso a gente para o countdownTimeout para que ele desça 1 segundo, o que acontece caso não fizermos isso.
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(25 * 60);
    }

    //END REGION

    //toda vez que o valor de active mudar, ele vai executar a funcao
    useEffect(() => {
        //so entraremos aqui se o time for maior que 0 e se o usuario tiver clicado no botão para setar como ativo
        if (isActive && time > 0) {
            //ISSO SÓ EXECUTA 1 VEZ NESSE CASO!!!!
            //aqui nos vamos, após 1 segundo, setar o time para timeAtual - 1 segundo
            //aqui estamos assinando a variavel countdownTimeout para esse retorno
            countdownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallange();
        }
        //agora alem de mudar quando o active muda de false pra true, 
        //colocando o time acontece a magica, entao, cada vez que 1 segundo mudar, ele vai executar de novo!!!
    }, [isActive, time])

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}