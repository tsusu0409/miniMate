import React from 'react';
import './Ranking.css';

type RankingProps = {
    rank: number;
    name: string;
    character: { [key: string]: number | undefined };
    rating: number;
};

const Ranking: React.FC<RankingProps> = ({ rank, name, character, rating }) => {
    const topCharacters = Object.entries(character)
        .sort(([, aCount], [, bCount]) => (bCount ?? 0) - (aCount ?? 0))
        .slice(0, 3);

    return (
        <li className="rank-personal">
            <p className='rank-rank'>{rank}位</p>
            <p className='rank-name'>{name}</p>
            <div className="rank-charas">
                {topCharacters.map(([char]) => (
                <img
                    key={char}
                    src={`/assets/images/${char}.png`}
                    alt={char}
                    className="rank-chara"
                />
                ))}
            </div>
            <p className="rank-rate">{rating}</p>
        </li>
    );
};

export default Ranking;
