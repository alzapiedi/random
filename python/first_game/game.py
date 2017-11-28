import pygame, MathUtils
from models import Player, Wall
from Logger import Logger
from MouseUtils import angleToMouse
from handlers import *
from MathUtils import getCombinedRect

class Game:
    def __init__(self):
        pygame.init()

        self.clock = pygame.time.Clock()
        self.screen = pygame.display.set_mode((1600, 900), pygame.FULLSCREEN | pygame.HWSURFACE | pygame.DOUBLEBUF) # add pygame.FULLSCREEN for full screen
        self.done = False
        sprite = pygame.image.load('./data/images/player.png').convert_alpha()
        self.logger = Logger(pygame.font.Font(None, 60), self.screen) # DEBUG
        self.player = Player.Player(self, sprite, self.logger) # DEBUG
        self.bullets = []
        self.walls = []

    def initialize(self):
        self.screen.fill((255, 255, 255))
        self.last_player_rect = self.player.get_geometry()['rect']
        self.walls.append(Wall.Wall((800, 0), (800, 900)))


    def start(self):
        self.initialize()
        while not self.done:
            self.rectangles = []
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.done = True
                if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                    self.done = True
                if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    self.player.start_attacking()
                if event.type == pygame.MOUSEBUTTONUP and event.button == 1:
                    self.player.stop_attacking()

            handleKeysPressed(pygame.key.get_pressed(), self.player, self.walls)

            self.update_player()
            self.update_bullets()
            self.update_walls()

            self.rectangles.append(getCombinedRect(pygame.Rect(0, 0, 0, 0), self.player_rect, self.last_player_rect))
            pygame.display.update(self.rectangles)
            self.last_player_rect = self.player_rect

            self.clock.tick(60)

    def update_player(self):
        self.player.update()

        mouse_pos = pygame.mouse.get_pos()
        self.player_pos, self.player_rect = self.player.geometry['pos'], self.player.geometry['rect']

        self.screen.fill((255, 255, 255), self.last_player_rect)
        self.player.set_angle(MathUtils.getAngle(self.player_pos, mouse_pos))
        image = self.player.get_image()
        rotated_image = pygame.transform.rotate(image, self.player.angle)

        self.screen.blit(rotated_image, (self.player.x, self.player.y))

    def update_bullets(self):
        for index, bullet in enumerate(self.bullets):
            bullet_rect = bullet.get_rect()
            self.screen.fill((255, 255, 255), bullet_rect)
            self.rectangles.append(bullet_rect)
            if (bullet.age() > 5):
                del self.bullets[index]
                continue

            bullet.update()
            bullet_image = pygame.transform.rotate(bullet.get_image(), bullet.angle)
            self.rectangles.append(bullet.get_rect())
            self.screen.blit(bullet_image, (bullet.x, bullet.y))

    def update_walls(self):
        for index, wall in enumerate(self.walls):
            self.rectangles.append(wall.get_rect())
            self.screen.fill((0, 0, 0), wall.get_rect())
