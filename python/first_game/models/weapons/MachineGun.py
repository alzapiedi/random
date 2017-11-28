from models.weapons.base_weapon import BaseWeapon

class MachineGun(BaseWeapon):
    def __init__(self):
        BaseWeapon.__init__(self, True, 95, 12)
