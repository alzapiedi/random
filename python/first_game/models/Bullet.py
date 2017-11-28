import pygame, constants
from time import time
from MathUtils import getBulletVector

class Bullet:
    def __init__(self, x, y, angle):
        self.x = x
        self.y = y
        self.width = constants.BULLET_WIDTH
        self.height = constants.BULLET_HEIGHT
        self.angle = angle

        self.image = None
        self.rect = None

        self.created_at = time()

    def update(self):
        vector = getBulletVector(constants.BULLET_SPEED, self.angle)
        self.x += vector[0]
        self.y += vector[1]

    def get_rect(self):
        if (self.rect == None):
            surface = pygame.Surface((self.width, self.height))
            surface = pygame.transform.rotate(surface, self.angle)
            rect = surface.get_rect()
            self.rect = pygame.Rect(self.x, self.y, rect.width, rect.height)
            return self.rect

        self.rect.x = self.x
        self.rect.y = self.y
        return self.rect

    def get_image(self):
        if (self.image == None):
            self.image = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
            self.image.fill((0, 0, 0))
        return self.image

    def age(self):
        return time() - self.created_at
