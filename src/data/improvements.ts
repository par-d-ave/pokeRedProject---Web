export interface Improvement {
  id: string;
  title: string;
  summary: string;
  detail: string;
}

export const improvements: readonly Improvement[] = [
  {
    id: 'combates',
    title: 'Combates ×4',
    summary: 'Delays y esperas internas reducidos: combates aproximadamente ×4 más rápidos.',
    detail:
      'Se reducen los delays y esperas internas del combate, de modo que las partes afectadas van aproximadamente ×4 más rápido. El cambio se limita a delays, constantes y rutinas existentes, sin tocar las estructuras de datos de la partida. Los combates se aceleran sin alterar las mecánicas originales.',
  },
  {
    id: 'movimiento',
    title: 'Movimiento ×2',
    summary: 'El movimiento del overworld es aproximadamente ×2 más rápido.',
    detail:
      'El movimiento del overworld es aproximadamente ×2 más rápido. Afecta al movimiento normal, a la bicicleta y al surf. Los movimientos especiales mantienen su comportamiento original.',
  },
  {
    id: 'texto-fast',
    title: 'Texto FAST instantáneo',
    summary: 'La opción FAST muestra el texto al instante, sin retraso carácter por carácter.',
    detail:
      'La opción FAST muestra los textos inmediatamente. Se elimina el retraso carácter por carácter con el que se imprime el texto normalmente. Los diálogos y mensajes dejan de ser una espera artificial.',
  },
  {
    id: 'alarma-hp',
    title: 'Silenciar alarma de HP bajo',
    summary: 'Se elimina el sonido repetitivo de alarma cuando el Pokémon activo tiene poca salud.',
    detail:
      'Se elimina el sonido repetitivo de alarma que suena cuando el Pokémon activo tiene poca salud. La condición de HP no cambia: solo se silencia el aviso sonoro. El resto del combate se comporta como en el original.',
  },
  {
    id: 'evoluciones',
    title: 'Evoluciones por intercambio → nivel 36',
    summary: 'Kadabra, Graveler, Machoke y Haunter evolucionan al llegar al nivel 36.',
    detail:
      'Los Pokémon que evolucionan por intercambio ahora lo hacen por nivel. Kadabra evoluciona a Alakazam, Graveler a Golem, Machoke a Machamp y Haunter a Gengar al llegar al nivel 36. Ya no hace falta intercambio para obtenerlos.',
  },
  {
    id: 'safari-zone',
    title: 'Exclusivos de Blue en Safari Zone',
    summary: 'Seis exclusivos de Blue añadidos a la Safari Zone Center.',
    detail:
      'Se añaden a la Safari Zone Center los exclusivos de Blue: Sandshrew, Vulpix, Meowth, Bellsprout, Magmar y Pinsir. Así aumenta la disponibilidad de estos Pokémon. La compatibilidad con los .sav originales se mantiene.',
  },
];