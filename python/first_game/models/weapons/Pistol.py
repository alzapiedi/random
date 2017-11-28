from models.weapons.base_weapon import BaseWeapon

class Pistol(BaseWeapon):
    def __init__(self):
        BaseWeapon.__init__(self, True, 99, 2)
