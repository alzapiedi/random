import pygame, MathUtils

def angleToMouse(pos):
    mouse_pos = pygame.mouse.get_pos()
    return MathUtils.getAngle(pos, mouse)
