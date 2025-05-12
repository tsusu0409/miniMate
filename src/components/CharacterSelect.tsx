import React from 'react';
import charactersData from '../data/characters.json';

type CharacterSelectProps = {
  	value: string;
  	onChange: (value: string) => void;
  	id?: string;
};

const CharacterSelect: React.FC<CharacterSelectProps> = ({ value, onChange, id }) => {
  return (
    <div>
      	<select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option id={id} value="">-- キャラクター --</option>
        {charactersData.map((character) => (
          	<option key={character.id} value={character.id}>
            	{character.displayname}
          	</option>
        ))}
      </select>
    </div>
  );
};

export default CharacterSelect;
