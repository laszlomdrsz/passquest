class StartingPosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class MapEntity {
    constructor(startingPosition, type, stats) {
        this.startingPosition = startingPosition;
        this.type = type;
        this.stats = stats;
    }
}
