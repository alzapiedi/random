from math import atan, cos, degrees, fabs, inf, radians, sin

def getAngle(point1, point2):
    dx = point2[0] - point1[0]
    dy = point2[1] - point1[1]
    if dx >= 0 and dy <= 0: return 360 - degrees(atan(inf if dy == 0 else fabs(dx/dy)))
    if dx <= 0 and dy <= 0: return degrees(atan(inf if dy == 0 else fabs(dx/dy)))
    if dx <= 0 and dy >= 0: return 90 + degrees(atan(inf if dx == 0 else fabs(dy/dx)))
    if dx >= 0 and dy >= 0: return 180 + degrees(atan(inf if dy == 0 else fabs(dx/dy)))

def getCombinedRect(new_rect, rect1, rect2):
    new_rect.x = min(rect1.x, rect2.x)
    new_rect.y = min(rect1.y, rect2.y)
    new_rect.width = max(rect1.right, rect2.right) - new_rect.x
    new_rect.height = max(rect1.bottom, rect2.bottom) - new_rect.y
    return new_rect

def getBulletVector(bullet_speed, angle):
    if angle >= 0 and angle <= 90: return (0 - bullet_speed * sin(radians(angle)), 0 - bullet_speed * cos(radians(angle)))
    if angle > 90 and angle <= 180: return (0 - bullet_speed * cos(radians(angle - 90)), bullet_speed * sin(radians(angle - 90)))
    if angle > 180 and angle <= 270: return (bullet_speed * sin(radians(angle - 180)), bullet_speed * cos(radians(angle - 180)))
    if angle > 270: return (bullet_speed * cos(radians(angle - 270)), 0 - bullet_speed * sin(radians(angle - 270)))
