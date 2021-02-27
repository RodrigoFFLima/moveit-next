import { createContext, useState, ReactNode, useEffect } from 'react'
import challenges from '../../challenges.json'

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengeContextData {
    level: number,
    currentExperience: number,
    exeperienceToNextLevel: number,
    challengesCompleted: number,
    //activeChallenge: object -> não é recomendado porque fica muito escasso de informação,
    activeChallenge: Challenge,
    levelUp: () => void,
    startNewChallange: () => void,
    resetChallenge: () => void,
    completeChallenged: () => void;
}

interface ChallengesProvideProps {
    //REACTNODE aceita qualquer elemento como children (componente, texto...)
    children: ReactNode;
}

//Aqui falamos que ao iniciar esse contexto, ele segue a estrutura do ChallengeContextData
export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children }: ChallengesProvideProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const exeperienceToNextLevel = Math.pow((level + 1) * 4, 2)

    //aqui quer dizer que a primeira funcao vai ser executada uma unica vez em tela - 
    //useEffect(() => { }, []) --> [] 
    useEffect(() => {
        Notification.requestPermission();
    }, [])

    function levelUp() {
        setLevel(level + 1);
    }

    function startNewChallange() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challange = challenges[randomChallengeIndex];

        setActiveChallenge(challange);

        //pelo fato de estar na pasta PUBLIC, NÃO precisa passar nenhum caminho longo ou louco.
        new Audio('/notification.mp3').play();

        //MDN NOTIFICATION -> da pra brincar com esse "carinha", pondo imagem, sons, vibrações e tal.
        if (Notification.permission === 'granted') {
            new Notification('Novo desafio ', {
                body: `Valendo ${challange.amount} xp!`,
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenged() {
        if (!activeChallenge)
            return;

        const { amount } = activeChallenge;

        //xp do usuario + tanto de xp que o desafio da;

        //let e não const, porque a variavel let pode receber um novo valor no futuro 
        //-> afinal, o usuario pode ganhar XP e upar de level,
        //sendo assim, temos que upar o usuario de nivel + o restante de xp que sobrou
        let finalExperience = currentExperience + amount;

        if (finalExperience >= exeperienceToNextLevel) {
            finalExperience = finalExperience - exeperienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                exeperienceToNextLevel,
                challengesCompleted,
                levelUp,
                startNewChallange,
                activeChallenge,
                resetChallenge,
                completeChallenged
            }}>
            {children}
        </ChallengesContext.Provider>
    );
}
