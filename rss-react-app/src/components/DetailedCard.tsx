import { DetailedCardProps } from '../types/interfaces';
import '../styles/DetailedCard.css';

const DetailedCard = ({ character, onClose }: DetailedCardProps) => {
  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="DetailedCard">
      <h2>{character.name}</h2>
      <p>height: {character.height}</p>
      <p>mass: {character.mass}</p>
      <p>hair color: {character.hair_color}</p>
      <p>skin color: {character.skin_color}</p>
      <p>eye color: {character.eye_color}</p>
      <p>birth year: {character.birth_year}</p>
      <p>gender: {character.gender}</p>
      <button className="closeBtn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};
export default DetailedCard;
