import './Result.css';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CharacterSelect from '../components/CharacterSelect';
import { Link } from 'react-router-dom';

type CharacterMap = {
  [characterId: string]: number | undefined;
};

type Player = {
  name: string;
  character: CharacterMap;
  rating: number;
};

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

const ResultPage: React.FC = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingBattleIndex, setEditingBattleIndex] = useState<number | null>(null);
  const [editedWinnerCharacter, setEditedWinnerCharacter] = useState<string>('');
  const [editedLoserCharacter, setEditedLoserCharacter] = useState<string>('');

  useEffect(() => {
    const existingBattles = localStorage.getItem('battles');
    const loadedBattles: Battle[] = existingBattles ? JSON.parse(existingBattles).reverse() : [];
    setBattles(loadedBattles);

    const existingPlayers = localStorage.getItem('players');
    const loadedPlayers: Player[] = existingPlayers ? JSON.parse(existingPlayers) : [];
    setPlayers(loadedPlayers);
  }, []);

  const saveBattles = (updatedBattles: Battle[]) => {
    localStorage.setItem('battles', JSON.stringify([...updatedBattles].reverse(), null, 2));
    setBattles(updatedBattles);
  };

  const savePlayers = (updatedPlayers: Player[]) => {
    localStorage.setItem('players', JSON.stringify(updatedPlayers, null, 2));
    setPlayers(updatedPlayers);
  };

  const handleDeleteAllBattles = () => {
    if (window.confirm('すべての対戦履歴を削除しますか？\nすべてのプレイヤーのレートと使用キャラ数が初期状態に戻ります。この操作は元に戻せません。')) {
      // 1. すべてのバトル履歴を削除
      saveBattles([]);

      // 2. すべてのプレイヤーのレートとキャラ使用数を初期状態に戻す
      const resetPlayers = players.map(player => ({
        ...player,
        rating: 1500, // 初期レート
        character: {}, // キャラクター使用数をリセット
      }));
      savePlayers(resetPlayers);

      alert('すべての対戦履歴を削除し、プレイヤーデータを初期状態に戻しました');
    }
  };


  const handleDeleteBattle = (indexToDelete: number, battle: Battle) => {
    if (window.confirm('この対戦結果を本当に削除しますか？\nプレイヤーのレートと使用キャラ数も元に戻ります。')) {
      const updatedBattles = battles.filter((_, index) => index !== indexToDelete);
      saveBattles(updatedBattles);

      const originalWinner = players.find(p => p.name === battle.winner.player);
      const originalLoser = players.find(p => p.name === battle.loser.player);

      if (originalWinner && originalLoser) {
        const pointChange = battle.winner.rateNew - battle.winner.rateOld; // 実際に変動したポイントを逆算

        originalWinner.rating -= pointChange;
        originalWinner.rating = Math.floor(originalWinner.rating * 1) / 1;

        originalLoser.rating += pointChange;
        originalLoser.rating = Math.floor(originalLoser.rating * 1) / 1;

        if (originalWinner.character[battle.winner.character]) {
          originalWinner.character[battle.winner.character] = Math.max(0, (originalWinner.character[battle.winner.character] || 1) - 1);
        }
        if (originalLoser.character[battle.loser.character]) {
          originalLoser.character[battle.loser.character] = Math.max(0, (originalLoser.character[battle.loser.character] || 1) - 1);
        }
      }

      savePlayers([...players]);

      alert('対戦結果を削除し、レートと使用キャラ数を元に戻しました');
    }
  };

  const handleEditCharacterStart = (index: number, battle: Battle) => {
    setEditingBattleIndex(index);
    setEditedWinnerCharacter(battle.winner.character);
    setEditedLoserCharacter(battle.loser.character);
  };

  const handleEditCharacterSave = (index: number, originalBattle: Battle) => {
    if (!editedWinnerCharacter || !editedLoserCharacter) {
      alert('勝者と敗者のキャラクターを選択してください');
      return;
    }

    const updatedBattles = battles.map((battle, idx) => {
      if (idx === index) {
        return {
          ...battle,
          winner: { ...battle.winner, character: editedWinnerCharacter },
          loser: { ...battle.loser, character: editedLoserCharacter },
        };
      }
      return battle;
    });

    const currentPlayers = [...players];
    const winnerPlayer = currentPlayers.find(p => p.name === originalBattle.winner.player);
    const loserPlayer = currentPlayers.find(p => p.name === originalBattle.loser.player);

    if (winnerPlayer) {
      if (winnerPlayer.character[originalBattle.winner.character]) {
        winnerPlayer.character[originalBattle.winner.character] = Math.max(0, (winnerPlayer.character[originalBattle.winner.character] || 1) - 1);
      }
      if (editedWinnerCharacter) {
        winnerPlayer.character[editedWinnerCharacter] = (winnerPlayer.character[editedWinnerCharacter] || 0) + 1;
      }
    }

    if (loserPlayer) {
      if (loserPlayer.character[originalBattle.loser.character]) {
        loserPlayer.character[originalBattle.loser.character] = Math.max(0, (loserPlayer.character[originalBattle.loser.character] || 1) - 1);
      }
      if (editedLoserCharacter) {
        loserPlayer.character[editedLoserCharacter] = (loserPlayer.character[editedLoserCharacter] || 0) + 1;
      }
    }

    saveBattles(updatedBattles);
    savePlayers(currentPlayers);

    setEditingBattleIndex(null);
    alert('キャラクター情報を更新しました');
  };

  const handleEditCharacterCancel = () => {
    setEditingBattleIndex(null);
    setEditedWinnerCharacter('');
    setEditedLoserCharacter('');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <Header />
      <div className='result-wrapper'>
        <div className='container'>
          <h1>対戦結果の編集</h1>

          <div className='result-list'>
            <h2>全対戦履歴</h2>
            {battles.length === 0 ? (
              <p>まだ対戦履歴がありません。</p>
            ) : (
              <ul>
                {battles.map((battle, index) => (
                  <li key={battle.timestamp + '-' + index} className='result-item'>
                    {editingBattleIndex === index ? (
                      <div className='editing-battle-controls'>
                        <div className='editing-section'>
                          <p>勝者: {battle.winner.player}</p>
                          <CharacterSelect value={editedWinnerCharacter} onChange={setEditedWinnerCharacter} />
                        </div>
                        <div className='editing-section'>
                          <p>敗者: {battle.loser.player}</p>
                          <CharacterSelect value={editedLoserCharacter} onChange={setEditedLoserCharacter} />
                        </div>
                        <div className='edit-buttons'>
                          <button onClick={() => handleEditCharacterSave(index, battle)} className='save-button'>保存</button>
                          <button onClick={handleEditCharacterCancel} className='cancel-button'>キャンセル</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className='battle-info'>
                          <span className='timestamp'>{formatTimestamp(battle.timestamp)}</span>
                          <p>
                            <span className='winner-name'>{battle.winner.player}</span>
                            <span className='winner-char'>({battle.winner.character})</span>
                            <span className='rate-change'>
                              ({battle.winner.rateOld} → {battle.winner.rateNew})
                            </span>
                          </p>
                          <p className='vs'>VS</p>
                          <p>
                            <span className='loser-name'>{battle.loser.player}</span>
                            <span className='loser-char'>({battle.loser.character})</span>
                            <span className='rate-change'>
                              ({battle.loser.rateOld} → {battle.loser.rateNew})
                            </span>
                          </p>
                        </div>
                        <div className='result-actions'>
                          <button onClick={() => handleEditCharacterStart(index, battle)} className='edit-char-button'>キャラ変更</button>
                          <button onClick={() => handleDeleteBattle(index, battle)} className='delete-button'>削除</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='delete-all-section'>
            <button onClick={handleDeleteAllBattles} className='delete-all-button'>
              すべての対戦履歴を削除
            </button>
            <p className='warning-text'>※この操作を行うと、全ての対戦履歴が消去され、プレイヤーのレートと使用キャラ数が初期状態（レート1500、キャラ使用なし）に戻ります。</p>
          </div>

          <div className='back-link'>
            <Link to='/'>トップページに戻る</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResultPage;