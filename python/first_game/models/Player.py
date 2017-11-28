import pygame, constants
from time import time
from models import Bullet
from models.weapons import Pistol, MachineGun
from random import randrange

class Player:
    def __init__(self, game, sprite, logger, x = 30, y = 30):
        self.x = x
        self.y = y
        self.game = game
        self.sprite = sprite
        self.angle = 0
        self.frame_count = 0
        self.is_moving = False
        self.is_attacking = False
        self.motion_start_time = 0
        self.weapon = MachineGun.MachineGun()
        self.time_last_bullet_fired = 0
        self.logger = logger # DEBUG

    def move(self, x, y, walls):
        self.start_moving()
        current_rect = self.geometry['rect']
        new_rect = pygame.Rect(current_rect.left + x, current_rect.top + y, current_rect.width*1.10, current_rect.height*1.10)
        for wall in walls:
            if (wall.get_rect().colliderect(new_rect)):
                return

        self.x += x
        self.y += y

    def update(self):
        self.increment_frame_count()
        self.geometry = self.get_geometry()
        time_now = time()
        if (self.is_attacking and time_now - self.time_last_bullet_fired > 1.0 / self.weapon.fire_rate): self.fire_bullet()

    def get_image(self):
        if (self.frame_count < 60): rect = constants.PLAYER_RUNNING_FRAME_4
        if (self.frame_count < 45): rect = constants.PLAYER_RUNNING_FRAME_3
        if (self.frame_count < 30): rect = constants.PLAYER_RUNNING_FRAME_2
        if (self.frame_count < 15): rect = constants.PLAYER_RUNNING_FRAME_1
        if ((self.get_time_in_motion() < 0.05 and self.get_time_in_motion() > 0) or not self.is_moving): rect = constants.PLAYER_STANDING_FRAME
        if (self.is_attacking): rect = constants.PLAYER_SHOOTING_FRAME

        image = pygame.Surface((rect[2], rect[3]), pygame.SRCALPHA)
        image.blit(self.sprite, (0, 0), rect)
        return image

    def get_pos(self):
        return (self.x, self.y)

    def set_angle(self, angle):
        self.angle = angle

    def increment_frame_count(self):
        self.frame_count += 1
        if self.frame_count == 60: self.frame_count = 0

    def start_moving(self):
        if (not self.is_moving):
            self.is_moving = True
            self.motion_start_time = time()

    def stop_moving(self):
        if (self.is_moving):
            self.is_moving = False
            self.motion_start_time = 0

    def get_time_in_motion(self):
        if (self.motion_start_time == 0): return 0
        return time() - self.motion_start_time

    def get_geometry(self):
        image = self.get_image()
        rotated_image = pygame.transform.rotate(image, self.angle)
        rect = rotated_image.get_rect()
        return {
            'pos': (rect.center[0] + self.x, rect.center[1] + self.y),
            'rect': pygame.Rect(self.x, self.y, rect. width, rect.height)
        }

    def start_attacking(self):
        if (not self.is_attacking):
            self.is_attacking = True

    def stop_attacking(self):
        if (self.is_attacking):
            self.is_attacking = False

    def fire_bullet(self):
        angle = self.angle + randrange(self.weapon.accuracy - 100, 100 - self.weapon.accuracy)
        new_bullet = Bullet.Bullet(self.geometry['pos'][0], self.geometry['pos'][1], angle)
        self.time_last_bullet_fired = time()
        self.game.bullets.append(new_bullet)
