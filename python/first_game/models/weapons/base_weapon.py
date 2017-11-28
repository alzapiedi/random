class BaseWeapon:
    def __init__(self, is_projectile, accuracy=100, fire_rate=0):
        self.accuracy = accuracy
        self.fire_rate = fire_rate
        self.is_projectile = is_projectile
