import pygame, constants

class Wall:
    def __init__(self, start_pos, end_pos):
        self.start_pos = start_pos
        self.end_pos = end_pos

        if (start_pos[0] == end_pos[0]):
            self.dimensions = (constants.WALL_THICKNESS, abs(end_pos[1] - start_pos[1]))
        else:
            self.dimensions = (abs(end_pos[0] - start_pos[0]), constants.WALL_THICKNESS)

        self.rect = None

    def get_rect(self):
        if (self.rect == None):
            self.rect = pygame.Rect((min(self.start_pos[0], self.end_pos[0]), min(self.start_pos[1], self.end_pos[1])), self.dimensions)
        return self.rect
