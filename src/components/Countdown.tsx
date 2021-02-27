import { useState, useEffect } from 'react';
import styles from '../styles/components/Countdown.module.css'

export function Countdown() {
    //constantes de estado
    const [time, setTime] = useState(25 * 60)
    const [active, setActive] = useState(false);

    //REGION - COUNT SPANS
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');
    //END REGION

    //REGION - ONCLICK START COUNTDOWN
    function startCountdown() {
        setActive(true);
    }
    //END REGION

    //toda vez que o valor de active mudar, ele vai executar a funcao
    useEffect(() => {
        //so entraremos aqui se o time for maior que 0 e se o usuario tiver clicado no botão para setar como ativo
        if (active && time > 0) {
            //ISSO SÓ EXECUTA 1 VEZ NESSE CASO!!!!
            //aqui nos vamos, após 1 segundo, setar o time para timeAtual - 1 segundo
            setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        }
        //agora alem de mudar quando o active muda de false pra true, 
        //colocando o time acontece a magica, entao, cada vez que 1 segundo mudar, ele vai executar de novo!!!
    }, [active, time])

    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            <button
                type="button"
                className={styles.countdownButton}
                onClick={startCountdown}
            >
                Iniciar um ciclo
        </button>

        </div>
    );
}