class MapRenderInstructions {
    tiles = [];
    entities = {
        enemies: [],
        rewards: [],
        player: null
    };

    constructor (tiles, entities) {
        this.tiles = tiles;
        this.entities = entities;
    }
}

class MapElement {

    level = 1
    tiles = [];
    occupiedTiles = [];
    entities = {
        enemies: [],
        rewards: [],
        player: null
    };
    size = {
        x: 0,
        y: 0
    };

    constructor (level, size) {
        this.level = level;
        this.size = size;
        this.generateMapTiles();
    }

    generateMapTiles() {
        const mapTilesFactory = new MapTilesFactory(this.size);
        this.tiles = mapTilesFactory.getMapTiles();
    }

    addPlayer(playerStats) {
        let startingPosition;
        let tileOccupied = true;
        while (tileOccupied) {
            startingPosition = {
                x: Math.floor(Math.random() * (this.size.x)),
                y: this.size.y - 1
            }
            tileOccupied = this.isTileOccupied(startingPosition);
        }
        const playerEntity = new MapEntity(startingPosition, 'player', playerStats);
        this.occupiedTiles.push({startingPosition});
        this.entities.player = playerEntity;
    }

    addEnemies(enemiesStats) {
        const enemyEntities = [];
        for (const enemyStats of enemiesStats) {
            let startingPosition;
            let tileOccupied = true;
            while (tileOccupied) {
                startingPosition = {
                    x: Math.floor(Math.random() * (this.size.x)),
                    y: Math.floor(Math.random() * (this.size.y))
                }
                tileOccupied = this.isTileOccupied(startingPosition);
            }
            const enemyEntity = new MapEntity(startingPosition, 'enemy', enemyStats);
            this.occupiedTiles.push({startingPosition});
            enemyEntities.push(enemyEntity);
        }
        this.entities.enemies = enemyEntities;
    }

    addRewards(rewardsStats) {
        const rewardEntities = [];
        for (const rewardStats of rewardsStats) {
            let startingPosition;
            let tileOccupied = true;
            while (tileOccupied) {
                startingPosition = {
                    x: Math.floor(Math.random() * (this.size.x)),
                    y: this.size.y - 1
                }
                tileOccupied = isTileOccupied(startingPosition);
            }
            const rewardEntity = new MapEntity(startingPosition, 'reward', rewardStats);
            this.occupiedTiles.push({startingPosition});
            rewardEntities.push(rewardEntity);
        }
        this.entities.rewards = rewardEntities;
    }

    isTileOccupied(startingPosition) {
        for (const occupiedTile of this.occupiedTiles) {
            if (occupiedTile === startingPosition) {
                return true;
            }
        }
        return false;
    }

    getMapRenderInstructions() {
        return new MapRenderInstructions(this.tiles, this.entities);
    }
    
}

class MapTile {
    constructor(type) {
        this.type = type;
    }
}

class MapTilesFactory {

    density = 0.2;
    freeTypes = ['ground'];
    blockingTypes = ['water', 'hill'];
    mapTiles = [];

    constructor (size) {
        this.mapTiles = this.generateMapTiles(size);
    }

    generateMapTiles(size) {
        const mapTiles = [];
        const rowSize = size.y;
        const columnSize = size.x;
        let lastPathFindingColumn = Math.floor(Math.random() * columnSize);
        for (let rowIndex = 0; rowIndex < rowSize; rowIndex++) {
            if (rowIndex < 2 || rowIndex >= rowSize - 2) {
                const row = this.generateBorderRow(columnSize);
                mapTiles[rowIndex] = row;
                continue;
            }
            let row;
            let currentPathFindingColumn = false;
            while (currentPathFindingColumn === false) {
                row = this.generateRow(columnSize);
                currentPathFindingColumn = this.validateRowPathfinding(row, lastPathFindingColumn);
            }
            lastPathFindingColumn = currentPathFindingColumn;
            mapTiles[rowIndex] = row;
        }
        return mapTiles;
    }

    generateBorderRow(columnSize) {
        const row = [];
        for (let columnIndex = 0; columnIndex < columnSize; columnIndex++) {
            const mapTileTypeDeterminator = Math.random();
            const mapTileType = this.freeTypes[Math.floor(mapTileTypeDeterminator * this.freeTypes.length)];
            row[columnIndex] = {type: mapTileType};
        }
        return row;
    }

    generateRow(columnSize) {
        const row = [];
        for (let columnIndex = 0; columnIndex < columnSize; columnIndex++) {
            const blockingDeterminator = Math.random();
            const mapTileTypeDeterminator = Math.random();
            if (blockingDeterminator < this.density) {
                const mapTileType = this.blockingTypes[Math.floor(mapTileTypeDeterminator * this.blockingTypes.length)];
                row[columnIndex] = {type: mapTileType};
            } else {
                const mapTileType = this.freeTypes[Math.floor(mapTileTypeDeterminator * this.freeTypes.length)];
                row[columnIndex] = {type: mapTileType};
            }
        }
        return row;
    }

    validateRowPathfinding(currentRow, lastPathFindingColumn) {
        if (this.blockingTypes.includes(currentRow[lastPathFindingColumn].type)) { return false; }
        const potentialCurrentPathFindingColumns = [];
        let currentRowColumn = lastPathFindingColumn;
        while (currentRow[currentRowColumn] && this.freeTypes.includes(currentRow[currentRowColumn].type)) {
            potentialCurrentPathFindingColumns.push(currentRowColumn);
            currentRowColumn--;
        }
        currentRowColumn = lastPathFindingColumn + 1;
        while (currentRow[currentRowColumn] && this.freeTypes.includes(currentRow[currentRowColumn].type)) {
            potentialCurrentPathFindingColumns.push(currentRowColumn);
            currentRowColumn++;
        }
        return potentialCurrentPathFindingColumns[Math.floor(Math.random() * potentialCurrentPathFindingColumns.length)];
    }

    getMapTiles() {
        return this.mapTiles;
    }

    getFreeTypes() {
        return this.freeTypes;
    }

    getBlockingTypes() {
        return this.blockingTypes;
    }
}