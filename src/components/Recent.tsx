import React, { useEffect, useState } from 'react';
import './Recent.css';

// Top.tsxと同じバトル履歴の型定義を再利用
type Battle = {
  timestamp: number;
  winner: {
    player: string;
    character: string;
    rateOld: number;
    rateNew: number;
  };
  loser: {
    player: string;
    character: string;
    rateOld: number;
    rateNew: number;
  };
};

// RecentコンポーネントのProps型定義
type RecentProps = {
  index: number; // 表示する対戦履歴のインデックス（0から始まる）
};

const Recent: React.FC<RecentProps> = ({ index }) => {
  const [battle, setBattle] = useState<Battle | null>(null);

  useEffect(() => {
    // localStorageからバトル履歴を読み込む
    const existingBattles = localStorage.getItem('battles');
    const loadedBattles: Battle[] = existingBattles ? JSON.parse(existingBattles) : [];

    // 最新の対戦がリストの先頭に来るように逆順にする
    const reversedBattles = [...loadedBattles].reverse();

    // 指定されたインデックスの対戦データをセット
    if (reversedBattles && reversedBattles.length > index) {
      setBattle(reversedBattles[`${index}`]);
    } else {
      setBattle(null); // データがない場合はnullを設定
    }
  }, [index]); // indexが変更されたら再実行

  // タイムスタンプを読みやすい日付と時刻の形式に変換 (HH:MM形式)
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24時間形式
    });
  };

  if (!battle) {
    return <div className="recent-item recent-item-empty"></div>;
  }

  return (
    <div className='recent-item'>
      <div className='winner-info'>
        <span className='win-indicator'>Win</span>
        <span className='character-icon'>
                  <img
                    key={battle.winner.character}
                    src={`/assets/images/${battle.winner.character}.png`}
                    alt={battle.winner.character}
                    className="rank-chara"
                  />
        </span>
        <span className='player-name'>{battle.winner.player}</span>
        <span className='rating-change'>{battle.winner.rateOld} → {battle.winner.rateNew}</span>
      </div>
      <div className='loser-info'>
        <span className='lose-indicator'>Lose</span>
        <span className='character-icon'>
                  <img
                    key={battle.loser.character}
                    src={`/assets/images/${battle.loser.character}.png`}
                    alt={battle.loser.character}
                    className="rank-chara"
                  />
        </span>
        <span className='player-name'>{battle.loser.player}</span>
        <span className='rating-change'>{battle.loser.rateOld} → {battle.loser.rateNew}</span>
      </div>
      <span className='match-time'>{formatTime(battle.timestamp)}</span>
    </div>
  );
};

export default Recent;