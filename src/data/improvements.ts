export interface Improvement {
  id: string;
  title: string;
  summary: string;
  detail: string;
  code: string;
  newNote: string;
  originalCode: string;
  originalNote: string;
}

export const improvements: readonly Improvement[] = [
  {
    id: 'combates',
    title: 'Combates ×4',
    summary: 'Delays y esperas internas reducidos: combates aproximadamente ×4 más rápidos.',
    detail:
      'Se reducen los delays y esperas internas del combate, de modo que las partes afectadas van aproximadamente ×4 más rápido. El cambio se limita a delays, constantes y rutinas existentes, sin tocar las estructuras de datos de la partida. Los combates se aceleran sin alterar las mecánicas originales.',
    code: String.raw`	jr z, .advanceFrameBlockDestAddr ;
	ld a, [wSubAnimFrameDelay]
	ld c, a
	srl c
	srl c
	jr nz, .delay
	ld c, 1
	.delay
	call DelayFrames
	ld a, [wFBMode]
	cp FRAMEBLOCKMODE_03`,  
    newNote: ' srl c -> divide el valor entre 2, dos veces (Efectivamente un x4). Si el resultado no es 0 salta la pausa, si lo es, fuerza 1',
    originalCode: String.raw`jr z, .advanceFrameBlockDestAddr ;
	ld a, [wSubAnimFrameDelay]
	ld c, a
          call DelayFrames
	ld a, [wFBMode]
	cp FRAMEBLOCKMODE_03`,
    originalNote: ' ld a, -> Carga fotogramas. ld c, a -> pasa el valor a c. call DelayFrames -> Pausa el juego durante C fotogramas.',
  },  
  {
    id: 'movimiento',
    title: 'Movimiento ×2',
    summary: 'El movimiento del overworld es aproximadamente ×2 más rápido.',
    detail:
      'El movimiento del overworld es aproximadamente ×2 más rápido. Afecta al movimiento normal, a la bicicleta y al surf. Los movimientos especiales mantienen su comportamiento original.',
    code: String.raw`AAAAA`,  
    newNote: 'ZZZZ',
    originalCode: String.raw`AAAAA`,
    originalNote: 'ZZZZ',
  },
  {
    id: 'texto-fast',
    title: 'Texto FAST instantáneo',
    summary: 'La opción FAST muestra el texto al instante, sin retraso carácter por carácter.',
    detail:
      'La opción FAST muestra los textos inmediatamente. Se elimina el retraso carácter por carácter con el que se imprime el texto normalmente. Los diálogos y mensajes dejan de ser una espera artificial.',
    code: String.raw`AAAAA`,  
    newNote: 'ZZZZ',
    originalCode: String.raw`AAAAA`,
    originalNote: 'ZZZZ',
  },
  {
    id: 'alarma-hp',
    title: 'Silenciar alarma de HP bajo',
    summary: 'Se elimina el sonido repetitivo de alarma cuando el Pokémon activo tiene poca salud.',
    detail:
      'Se elimina el sonido repetitivo de alarma que suena cuando el Pokémon activo tiene poca salud. La condición de HP no cambia: solo se silencia el aviso sonoro. El resto del combate se comporta como en el original.',
    code: String.raw`AAAAA`,  
    newNote: 'ZZZZ',
    originalCode: String.raw`AAAAA`,
    originalNote: 'ZZZZ',
  },
  {
    id: 'evoluciones',
    title: 'Evoluciones por intercambio → nivel 36',
    summary: 'Kadabra, Graveler, Machoke y Haunter evolucionan al llegar al nivel 36.',
    detail:
      'Los Pokémon que evolucionan por intercambio ahora lo hacen por nivel. Kadabra evoluciona a Alakazam, Graveler a Golem, Machoke a Machamp y Haunter a Gengar al llegar al nivel 36. Ya no hace falta intercambio para obtenerlos.',
    code: String.raw`AAAAA`,  
    newNote: 'ZZZZ',
    originalCode: String.raw`AAAAA`,
    originalNote: 'ZZZZ',
  },
  {
    id: 'safari-zone',
    title: 'Exclusivos de Blue en Safari Zone',
    summary: 'Seis exclusivos de Blue añadidos a la Safari Zone Center.',
    detail:
      'Se añaden a la Safari Zone Center los exclusivos de Blue: Sandshrew, Vulpix, Meowth, Bellsprout, Magmar y Pinsir. Así aumenta la disponibilidad de estos Pokémon. La compatibilidad con los .sav originales se mantiene.',
    code: String.raw`AAAAA`,  
    newNote: 'ZZZZ',
    originalCode: String.raw`AAAAA`,
    originalNote: 'ZZZZ',
  },
];