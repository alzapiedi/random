class Logger:
    def __init__(self, font, screen):
        self.font = font
        self.screen = screen

    def log(self, data):
        surface = self.font.render(str(data.width)+","+str(data.height), 1, (0, 0, 0))
        self.screen.blit(surface, (0, 800))
