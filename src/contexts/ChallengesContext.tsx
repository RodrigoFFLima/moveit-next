import { createContext, useState, ReactNode } from 'react'
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
    resetChallenge: () => void;
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

    function levelUp() {
        setLevel(level + 1);
    }

    function startNewChallange() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challange = challenges[randomChallengeIndex];

        setActiveChallenge(challange);
    }

    function resetChallenge() {
        setActiveChallenge(null);
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
                resetChallenge
            }}>
            {children}
        </ChallengesContext.Provider>
    );
}
