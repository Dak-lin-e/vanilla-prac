const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportBtn = document.querySelector('#export-btn');
const ROWS = 10;
const COLS = 10;
const spreadsheet=[]
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'
, 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];



class Cell{
    constructor(isHeader,disabled, data,row,column,rowname,columnname,active){
        this.isHeader = isHeader; // true if the cell is a header
        this.disabled = disabled; // true if the cell is disabled
        this.data = data; // data in the cell
        this.row = row; // row index of the cell
        this.column = column; // column index of the cell
        this.rowname = rowname; // row name of the cell
        this.columnname = columnname; // column name of the cell
        this.active = active; // true if the cell is active
    }
}

exportBtn.onclick = function(e){
    console.log("Exporting spreadsheet data...");
    const exportedData = spreadsheet.map(row => row.map(cell => cell.data));
    console.log(exportedData);
    // 엑셀파일 다운로드
    const csvContent = exportedData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "spreadsheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Spreadsheet data exported successfully.");
}

initSpreadsheet();

function initSpreadsheet(){
    for(let i=0; i<ROWS; i++){
        let spreadsheetRow = [];
        for(let j=0; j<COLS; j++){
            let cellData = "";
            let isHeader = false;
            let disabled = false; // Regular cells are not disabled
            if(j === 0){
                cellData = i;
                isHeader = true; // Row header
                disabled = true; // Disable row headers
            }
            if(i===0){
                isHeader = true; // Column header
                disabled = true; // Disable column headers
                cellData = alphabets[j-1]; // Column header
            }
            if(!cellData){
                cellData = ""; // Regular cell// Column name for regular cells
            }

            const rowName=i;
            const columnName =  alphabets[j-1]; 
            spreadsheetRow.push(new Cell(isHeader, disabled, cellData, i, j, rowName,columnName,false));
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    console.log(spreadsheet);
}


function createCellEl(cell){
    const cellEl = document.createElement('input');
    cellEl.className = "cell";
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;
    cellEl.id = "cell_"+cell.row+cell.column;
    if(cell.isHeader){
        cellEl.classList.add('header');
    }

    cellEl.onclick=()=>handleCellClick(cell);
    cellEl.onchange = (e) => {
        cell.data = e.target.value;
    }

    return cellEl;
}

function handleCellClick(cell){
    clearHeaderActiveState();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    
    console.log(`Clicked cell at row: ${cell.row}, column: ${cell.column}`);
    console.log(`Row Header: ${rowHeader.data}, Column Header: ${columnHeader.data}`);
}

function clearHeaderActiveState(){
    const headers = document.querySelectorAll('.header');
    headers.forEach(header => {
        header.classList.remove('active');
    });
}




function getElFromRowCol(row, col){
    return document.querySelector("#cell_" + row + col);
}

function drawSheet(){
    for(let i=0; i<spreadsheet.length;i++){
        const rowContainer = document.createElement('div');
        rowContainer.className = 'cell-row';
        for(let j=0; j<spreadsheet[i].length; j++){
            const cell = spreadsheet[i][j];
            rowContainer.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainer);
    }
}