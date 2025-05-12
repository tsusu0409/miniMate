import React, { useEffect, useState} from "react";
import './Recent.css';

type PlayerInfo = {
    player: string;
    character: string;
    rateOld: number;
    rateNew: number;
};

type Battle = {
    timestamp: number;
    winner: PlayerInfo;
    loser: PlayerInfo;
};

type RecentProps = {
    index: number;
};

const Recent: React.FC<RecentProps> = ({ index })=> {
    const [battle, setBattle] = useState<Battle | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("battles.json");
        if (stored) {
            const parsed: Battle[] = JSON.parse(stored);
            const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
            if (sorted[index]) {
                setBattle(sorted[index]);
            }
        }
    }, [index]);

  if (!battle) return null;

    return(
        <div>
            <div className="winner-section">
                <span className="result-tag win">Win</span>
                <img src={`/${battle.winner.character}.png`} className="character-icon" />
                <span className="player-name">{battle.winner.player}</span>
                <span className="rating">
                    {battle.winner.rateOld} → {battle.winner.rateNew}
                </span>
            </div>
            <div className="loser-section">
                <span className="result-tag win">Win</span>
                <img src={`/${battle.winner.character}.png`} className="character-icon" />
                <span className="player-name">{battle.winner.player}</span>
                <span className="rating">
                    {battle.winner.rateOld} → {battle.winner.rateNew}
                </span>
            </div>
            <span className="battle-time">
                {
                    new Date(battle.timestamp).toLocaleDateString("ja-JP",{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })
                }
            </span>
        </div>
    );
};

export default Recent;