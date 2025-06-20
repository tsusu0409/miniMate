import './Player.css';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

type CharacterMap = {
  [characterId: string]: number | undefined;
};

type Player = {
  name: string;
  character: CharacterMap;
  rating: number;
};

const PlayerPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerName, setEditingPlayerName] = useState<string | null>(null);
  const [editedPlayerName, setEditedPlayerName] = useState('');

  useEffect(() => {
    const existingPlayers = localStorage.getItem('players');
    const loadedPlayers: Player[] = existingPlayers ? JSON.parse(existingPlayers) : [];
    setPlayers(loadedPlayers);
  }, []);

  const savePlayers = (updatedPlayers: Player[]) => {
    localStorage.setItem('players', JSON.stringify(updatedPlayers, null, 2));
    setPlayers(updatedPlayers);
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      alert('プレイヤー名を入力してください');
      return;
    }
    if (players.some(p => p.name === newPlayerName.trim())) {
      alert('同じ名前のプレイヤーが既に存在します');
      return;
    }

    const updatedPlayers = [
      ...players,
      { name: newPlayerName.trim(), character: {}, rating: 1500 } 
    ];
    savePlayers(updatedPlayers);
    setNewPlayerName('');
  };

  const handleDeletePlayer = (playerName: string) => {
    if (window.confirm(`${playerName} を本当に削除しますか？\n関連する対戦履歴も削除されます。`)) {
      const updatedPlayers = players.filter(p => p.name !== playerName);
      savePlayers(updatedPlayers);

      const existingBattles = localStorage.getItem('battles');
      let battles = existingBattles ? JSON.parse(existingBattles) : [];
      const updatedBattles = battles.filter((battle: any) =>
        battle.winner.player !== playerName && battle.loser.player !== playerName
      );
      localStorage.setItem('battles', JSON.stringify(updatedBattles, null, 2));

      alert(`${playerName} と関連する対戦履歴を削除しました`);
    }
  };

  const handleEditStart = (playerName: string) => {
    setEditingPlayerName(playerName);
    setEditedPlayerName(playerName);
  };

  const handleEditSave = (originalName: string) => {
    if (!editedPlayerName.trim()) {
      alert('新しいプレイヤー名を入力してください');
      return;
    }
    if (editedPlayerName.trim() === originalName) {
      setEditingPlayerName(null);
      return;
    }
    if (players.some(p => p.name === editedPlayerName.trim() && p.name !== originalName)) {
      alert('新しいプレイヤー名が既に存在します');
      return;
    }

    const updatedPlayers = players.map(p =>
      p.name === originalName ? { ...p, name: editedPlayerName.trim() } : p
    );
    savePlayers(updatedPlayers);

    const existingBattles = localStorage.getItem('battles');
    let battles = existingBattles ? JSON.parse(existingBattles) : [];
    const updatedBattles = battles.map((battle: any) => {
      if (battle.winner.player === originalName) {
        battle.winner.player = editedPlayerName.trim();
      }
      if (battle.loser.player === originalName) {
        battle.loser.player = editedPlayerName.trim();
      }
      return battle;
    });
    localStorage.setItem('battles', JSON.stringify(updatedBattles, null, 2));

    setEditingPlayerName(null);
    alert(`${originalName} のプレイヤー名を ${editedPlayerName.trim()} に変更しました`);
  };

  const handleEditCancel = () => {
    setEditingPlayerName(null);
    setEditedPlayerName('');
  };

  return (
    <div>
      <Header />
      <div className='player-wrapper'>
        <div className='container'>
          <h1>プレイヤーデータ編集</h1>
          <div className='player-add'>
            <h2>新しいプレイヤーの追加</h2>
            <input
              type='text'
              placeholder='プレイヤー名'
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <button onClick={handleAddPlayer}>追加</button>
          </div>

          <div className='player-list'>
            <ul>
              {players.length === 0 ? (
                <p>プレイヤーがまだいません。新しいプレイヤーを追加してください。</p>
              ) : (
                players.map((player) => (
                  <li key={player.name} className='player-item'>
                    {editingPlayerName === player.name ? (
                      <div className='editing-controls'>
                        <input
                          type='text'
                          value={editedPlayerName}
                          onChange={(e) => setEditedPlayerName(e.target.value)}
                        />
                        <button onClick={() => handleEditSave(player.name)}>保存</button>
                        <button onClick={handleEditCancel}>キャンセル</button>
                      </div>
                    ) : (
                      <>
                        <span className='player-name'>{player.name}</span>
                        <span className='player-rating'>レート: {player.rating}</span>
                        <button onClick={() => handleEditStart(player.name)}>編集</button>
                        <button onClick={() => handleDeletePlayer(player.name)} className='delete-button'>削除</button>
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
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

export default PlayerPage;