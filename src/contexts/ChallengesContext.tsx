import { createContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie';
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal';

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
    completeChallenged: () => void,
    closeLevelUpModal: () => void;
}

interface ChallengesProvideProps {
    //REACTNODE aceita qualquer elemento como children (componente, texto...)
    children: ReactNode;
    level: number,
    currentExperience: number,
    challengesCompleted: number
}


//Aqui falamos que ao iniciar esse contexto, ele segue a estrutura do ChallengeContextData
export const ChallengesContext = createContext({} as ChallengeContextData);

//passamos o ...rest aqui para indicar que é pra pegar todas as outras propriedades que não são children
export function ChallengesProvider({ children, ...rest }: ChallengesProvideProps) {
    //DICA: objeto ?? 1 -> traducao, se objeto não existir, vai receber 1, se existir, recebe o valor
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const exeperienceToNextLevel = Math.pow((level + 1) * 4, 2)

    //aqui quer dizer que a primeira funcao vai ser executada uma unica vez em tela - 
    //useEffect(() => { }, []) --> [] 
    useEffect(() => {
        Notification.requestPermission();
    }, [])

    //caso uma das 3 variavéis abaixo sofram mudanças, o metodo em questão será chamado!  
    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
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
                completeChallenged,
                closeLevelUpModal
            }}>
            {children}
            { isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}
