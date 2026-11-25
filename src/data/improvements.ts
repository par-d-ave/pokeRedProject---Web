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
    code: String.raw`.moveAhead2
	ld hl, wMiscFlags
	res BIT_TURNING, [hl]
	ld a, [wMovementFlags]
	bit BIT_LEDGE_OR_FISHING, a
	jr nz, .normalPlayerSpriteAdvancement
	call AdvancePlayerSprite
.normalPlayerSpriteAdvancement
	call AdvancePlayerSprite
	ld a, [wWalkCounter]
	and a
	jp nz, CheckMapConnections ;`,  
    newNote: 'Limpia BIT_TURNING, omite el avance extra si hay salto de borde o pesca (BIT_LEDGE_OR_FISHING), llama dos veces a AdvancePlayerSprite para duplicar la velocidad al caminar sin bici y mantiene al final la comprobación de wWalkCounter hacia CheckMapConnections',
    originalCode: String.raw`.moveAhead2
	ld hl, wMiscFlags
	res BIT_TURNING, [hl]
	ld a, [wWalkBikeSurfState]
	dec a ; riding a bike?
	jr nz, .normalPlayerSpriteAdvancement
	ld a, [wMovementFlags]
	bit BIT_LEDGE_OR_FISHING, a
	jr nz, .normalPlayerSpriteAdvancement
	call DoBikeSpeedup
.normalPlayerSpriteAdvancement
	call AdvancePlayerSprite
	ld a, [wWalkCounter]
	and a
	jp nz, CheckMapConnections ;`,
    originalNote: 'BIT_TURNING, comprueba si vas en bici (wWalkBikeSurfState == 1) sin estar en borde ni pescando para aplicar un avance extra con DoBikeSpeedup, ejecuta AdvancePlayerSprite una vez de forma estándar y revisa wWalkCounter para comprobar conexiones de mapa.',
  },
  {
    id: 'texto-fast',
    title: 'Texto FAST instantáneo',
    summary: 'La opción FAST muestra el texto al instante, sin retraso carácter por carácter.',
    detail:
      'La opción FAST muestra los textos inmediatamente. Se elimina el retraso carácter por carácter con el que se imprime el texto normalmente. Los diálogos y mensajes dejan de ser una espera artificial.',
    code: String.raw`DEF TEXT_DELAY_FAST   EQU %000 ; 0
DEF TEXT_DELAY_MEDIUM EQU %011 ; 3
DEF TEXT_DELAY_SLOW   EQU %101 ; 5`,  
    newNote: 'Baja TEXT_DELAY_FAST a 0 (%000) para eliminar la pausa de 1 frame entre letras y que el texto rápido avance de inmediato, dejando intactos MEDIUM (3) y SLOW (5)',
    originalCode: String.raw`DEF TEXT_DELAY_FAST   EQU %001 ; 1
DEF TEXT_DELAY_MEDIUM EQU %011 ; 3
DEF TEXT_DELAY_SLOW   EQU %101 ; 5`,
    originalNote: 'TEXT_DELAY_FAST en 1 (%001), por lo que el texto rápido espera 1 frame entre caracteres, mientras que MEDIUM espera 3 y SLOW espera 5',
  },
  {
    id: 'alarma-hp',
    title: 'Silenciar alarma de HP bajo',
    summary: 'Se elimina el sonido repetitivo de alarma cuando el Pokémon activo tiene poca salud.',
    detail:
      'Se elimina el sonido repetitivo de alarma que suena cuando el Pokémon activo tiene poca salud. La condición de HP no cambia: solo se silencia el aviso sonoro. El resto del combate se comporta como en el original.',
    code: String.raw`.setLowHealthAlarm
    ret`,  
    newNote: 'Rutina vacía',
    originalCode: String.raw`.setLowHealthAlarm
	ld hl, wLowHealthAlarm
	set BIT_LOW_HEALTH_ALARM, [hl]
	ret`,
    originalNote: 'Carga wLowHealthAlarm en hl, activa BIT_LOW_HEALTH_ALARM con set para marcar el estado de alarma de salud baja y retorna.',
  },
  {
    id: 'evoluciones',
    title: 'Evoluciones por intercambio → nivel 36',
    summary: 'Kadabra, Graveler, Machoke y Haunter evolucionan al llegar al nivel 36.',
    detail:
      'Los Pokémon que evolucionan por intercambio ahora lo hacen por nivel. Kadabra evoluciona a Alakazam, Graveler a Golem, Machoke a Machamp y Haunter a Gengar al llegar al nivel 36. Ya no hace falta intercambio para obtenerlos.',
    code: String.raw`KadabraEvosMoves:
; Evolutions
	db EVOLVE_LEVEL, 36, ALAKAZAM
	db 0`,  
    newNote: 'Sustituye la condición de intercambio por evolución por nivel (EVOLVE_LEVEL) al alcanzar el nivel 36 para pasar a Alakazam',
    originalCode: String.raw`KadabraEvosMoves:
; Evolutions
	db EVOLVE_TRADE, 1, ALAKAZAM
	db 0`,
    originalNote: 'Define que Kadabra evoluciona a Alakazam mediante intercambio (EVOLVE_TRADE, con parámetro 1)',
  },
  {
    id: 'safari-zone',
    title: 'Exclusivos de Blue en Safari Zone',
    summary: 'Seis exclusivos de Blue añadidos a la Safari Zone Center.',
    detail:
      'Se añaden a la Safari Zone Center los exclusivos de Blue: Sandshrew, Vulpix, Meowth, Bellsprout, Magmar y Pinsir. Así aumenta la disponibilidad de estos Pokémon. La compatibilidad con los .sav originales se mantiene.',
    code: String.raw`SafariZoneCenterWildMons:
	def_grass_wildmons 30 ; encounter rate
IF DEF(_RED)
    db 22, SANDSHREW
    db 25, RHYHORN
    db 22, BELLSPROUT
    db 24, EXEGGCUTE
    db 31, MEOWTH
    db 25, EXEGGCUTE
    db 31, VULPIX
    db 30, MAGMAR
    db 23, PINSIR
ENDC`,  
    newNote: 'Define encuentros exclusivos de Pokemon Blue dentro de la zona Safari',
    originalCode: String.raw`SafariZoneCenterWildMons:
	def_grass_wildmons 30 ; encounter rate
IF DEF(_RED)
	db 22, NIDORAN_M
	db 25, RHYHORN
	db 22, VENONAT
	db 24, EXEGGCUTE
	db 31, NIDORINO
	db 25, EXEGGCUTE
	db 31, NIDORINA
	db 30, PARASECT
	db 23, SCYTHER
ENDC`,
    originalNote: 'Define lista de encuentros originales en Pokemon Red',
  },
];