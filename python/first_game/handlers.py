import constants
from keys import *

def handleKeysPressed(pressed, player, walls):
    speed = constants.PLAYER_SPEED_ATTACKING if player.is_attacking else constants.PLAYER_SPEED
    if pressed[W]: player.move(0, 0 - speed, walls)
    if pressed[S]: player.move(0, speed, walls)
    if pressed[D]: player.move(speed, 0, walls)
    if pressed[A]: player.move(0 - speed, 0, walls)
    if not pressed[W] and not pressed[S] and not pressed[A] and not pressed[D]: player.stop_moving()

def handleMousePress(pressed, player):
    if pressed[0]: player.start_attacking()
    else: player.stop_attacking()
