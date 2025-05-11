import './Top.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Ranking from '../components/Ranking';
import rawplayersData from '../data/players.json';
import type React from 'react';
import { useEffect, useState } from 'react';

type CharacterMap = {
    [characterId: string]: number | undefined;
};

type Player = {
    name: string;
    character: CharacterMap;
    rating: number;
};

const playersData: Player[] = rawplayersData as Player[];

const Top: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const sorted = [...playersData as Player[]].sort((a, b) => b.rating - a.rating);
        setPlayers(sorted);
    }, []);

    return(
        <div>
            <Header />
            <div className='top-wrapper'>
                <div className='container'>
                    <div className='contents-left'>
                        <div className='rank'>
                            <h1>現在の順位</h1>
                            <div className='rank-data'>
                                <ul>
                                    {players.map((player, index) => (
                                        <Ranking
                                            key={player.name}
                                            rank={index + 1}
                                            name={player.name}
                                            character={player.character}
                                            rating={player.rating}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='settings'>

                        </div>
                    </div>
                    <div className='contents-right'>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Top;