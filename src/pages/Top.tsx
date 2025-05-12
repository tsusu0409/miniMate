import './Top.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Ranking from '../components/Ranking';
import PlayerSelect from '../components/PlayerSelect';
import CharacterSelect from '../components/CharacterSelect';
import Recent from '../components/Recent';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type CharacterMap = {
    [characterId: string]: number | undefined;
};

type Player = {
    name: string;
    character: CharacterMap;
    rating: number;
};

function clamp(point: number, min: number, max: number){
    if(point < min){
        return min;
    }else if(max < point){
        return max;
    }else{
        return point;
    }
}

function calculatePoint(winnerRate: number, loserRate: number){
    const K = 32;
    let point = K / (10 ** ( (winnerRate - loserRate) / 400 ) + 1);
    point = clamp(point, 4, 100);
    return point;
}



const Top: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    const [winnerPlayer, setWinnerPlayer] = useState('');
    const [winnerCharacter, setWinnerCharacter] = useState('');
    const [loserPlayer, setLoserPlayer] = useState('');
    const [loserCharacter, setLoserCharacter] = useState('');

    useEffect(() => {
        const existing = localStorage.getItem('players');
        const players = existing ? JSON.parse(existing) : [];

        const sorted = [...players].sort((a, b) => b.rating - a.rating);
        setPlayers(sorted);
    }, []);


    const handleSubmit = () => {
        if (!winnerPlayer || !winnerCharacter || !loserPlayer || !loserCharacter) {
            alert('全ての項目を選択してください');
            return;
        }

        if( winnerPlayer === loserPlayer){
            alert('勝ちと負けのプレイヤーが同じです')
            return;
        }

        // プレイヤー一覧を取得
        const playersRaw = localStorage.getItem('players');
        const players = playersRaw ? JSON.parse(playersRaw) : [];

        // 該当プレイヤーを見つける
        const winner = players.find((p: Player) => p.name === winnerPlayer);
        const loser = players.find((p: Player) => p.name === loserPlayer);

        if (!winner || !loser) {
            alert('プレイヤーデータが見つかりません');
            return;
        }

        // レート変動を計算
        const pointChange = calculatePoint(winner.rating, loser.rating);
        const winnerOldRate = winner.rating;
        const loserOldRate = loser.rating;

        winner.rating += pointChange;
        winner.rating = Math.floor(winner.rating * 1) / 1;

        loser.rating -= pointChange;
        loser.rating = Math.floor(loser.rating * 1) / 1;

        // 使用キャラクターの回数を1増加
        if (winner.character[winnerCharacter]) {
            winner.character[winnerCharacter] += 1;
        } else {
            winner.character[winnerCharacter] = 1;
        }

        if (loser.character[loserCharacter]) {
            loser.character[loserCharacter] += 1;
        } else {
            loser.character[loserCharacter] = 1;
        }

        // レートを更新したプレイヤー一覧を保存
        localStorage.setItem('players', JSON.stringify(players, null, 2));

        // バトルjsonに書き込み
        const timestamp = Date.now();



        const newBattle = {
            timestamp: timestamp,
            winner: {
            player: winnerPlayer,
            character: winnerCharacter,
            rateOld: winnerOldRate,
            rateNew: winner.rating
            },
            loser: {
            player: loserPlayer,
            character: loserCharacter,
            rateOld: loserOldRate,
            rateNew: loser.rating
            },
        };

        try {
            const existing = localStorage.getItem('battles');
            const battles = existing ? JSON.parse(existing) : [];

            battles.push(newBattle);
            localStorage.setItem('battles', JSON.stringify(battles, null, 2));

            alert('対戦結果を保存しました');

            setWinnerPlayer('');
            setWinnerCharacter('');
            setLoserPlayer('');
            setLoserCharacter('');

            window.location.reload();
        } catch (e) {
            alert('保存時にエラーが発生しました');
            console.error(e);
        }
    };

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
                            <div className='setting-player'>
                                <Link to='/player'>
                                    <h2>プレイヤーデータの編集</h2>
                                    <p>プレイヤーの追加、削除や名前の編集はこちらから</p>
                                </Link>
                            </div>
                            <div className='setting-result'>
                                <Link to='/result'>
                                    <h2>結果の編集</h2>
                                    <p>
                                        登録済みの対戦結果を修正する場合はこちらから<br />
                                        使用したキャラの変更もこちらから行えます
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='contents-right'>
                        <div className='recent'>
                            <h1>直近の対戦結果</h1>
                            <div className='recent-data'>
                                {Array.from({ length: 10 }, (_, index) => (
                                    <Recent key={index} index={index} />
                                ))}
                            </div>
                        </div>
                        <div className='result-submit'>
                            <h1>結果の登録</h1>
                            <div className='submit'>
                                <div className='submit-one winner'>
                                    <h1>勝ち</h1>
                                    <PlayerSelect id='player-select' value={winnerPlayer} onChange={setWinnerPlayer} />
                                    <CharacterSelect id='character-select' value={winnerCharacter} onChange={setWinnerCharacter} />
                                </div>
                                <div className='submit-center'>
                                    <p>VS</p>
                                    <button type='submit' onClick={handleSubmit}>登録</button>
                                </div>
                                <div className='submit-one loser'>
                                    <h1>負け</h1>
                                    <PlayerSelect id='player-select' value={loserPlayer} onChange={setLoserPlayer} />
                                    <CharacterSelect id='character-select' value={loserCharacter} onChange={setLoserCharacter} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Top;