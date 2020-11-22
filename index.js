
document.addEventListener("DOMContentLoaded", function(){
// document.addEventListener("click", function(){
    const applicationManager = new ApplicationManager();
    applicationManager.startApplication();
    
});

function generateMap() {
    const size = {
        x: 32, // 64
        y: 32 // 256
    };
    const levelSeed = 'teszt23';
    const mapTileFactory = new MapTilesFactory(size, levelSeed);
    const mapTiles = mapTileFactory.getMapTiles();
    console.log(mapTiles);
    
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapTiles));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
    

   function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
  
    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');
  
      rowData.forEach(function(cellData) {
        let type = '';
        if (cellData.type === 'ground') {
            type = 'O';
        } else {
            type = 'X';
        }
        cellData = cellData.type;
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(type));
        row.appendChild(cell);
      });
  
      tableBody.appendChild(row);
    });
  
    table.appendChild(tableBody);
    document.body.appendChild(table);
  }
  
  createTable(mapTiles);
}
  
