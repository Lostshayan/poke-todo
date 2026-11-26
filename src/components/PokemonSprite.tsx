import React, { useState, useEffect } from 'react';
import { getAnimatedSpriteUrl, getOfficialArtworkUrl } from '../data/pokemonCatalog';

interface PokemonSpriteProps {
  id: number;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  floating?: boolean;
  capturing?: boolean;
}

const SIZE_CLASSES = {
  sm: 'w-14 h-14',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

export const PokemonSprite: React.FC<PokemonSpriteProps> = ({
  id,
  name,
  size = 'lg',
  className = '',
  floating = true,
  capturing = false,
}) => {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setUseFallback(false);
  }, [id]);

  const src = useFallback ? getOfficialArtworkUrl(id) : getAnimatedSpriteUrl(id);

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <img
        src={src}
        alt={name}
        onError={() => {
          if (!useFallback) setUseFallback(true);
        }}
        className={`${SIZE_CLASSES[size]} object-contain sprite-crisp transition-transform duration-300 ${
          capturing ? 'animate-flash-capture' : floating ? 'animate-float-slow' : ''
        }`}
      />
    </div>
  );
};
