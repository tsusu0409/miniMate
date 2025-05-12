import React, {useEffect, useState} from 'react';

type PlayerSelectProps = {
	value: string;
	onChange: (value: string) => void;
	id?: string;
};

const PlayerSelect: React.FC<PlayerSelectProps> = ({ value, onChange, id }) => {
	const [players, setPlayers] = useState<any[]>([]);

	useEffect(() => {
		const storedPlayers = localStorage.getItem('players');
		if(storedPlayers){
			try{
				const parsedPlayers = JSON.parse(storedPlayers);
				setPlayers(parsedPlayers);
			} catch(error) {
				console.error('データのパースに失敗しました', error);
			}
		}
	}, []);

  	return (
		<div>
			<select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
			<option value="">-- プレイヤー名 --</option>
			{players.map((player) => (
				<option key={player.name} value={player.name}>
					{player.name}
				</option>
			))}
		</select>
		</div>
 	);
};

export default PlayerSelect;
