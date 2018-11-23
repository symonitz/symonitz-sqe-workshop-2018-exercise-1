import $ from 'jquery';
import {toTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        // console.log(parsedCode);
        let parsedCode = toTable(codeToParse);
        structToTable2('#PARSEDTABLE',parsedCode);
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function addColHeaders(lst, struct) {
    let col = ['Line', 'Type', 'Name', 'Condition', 'Value'];
    let headerTr$ = $('<tr/>');
    for(let i = 0; i< col.length ; i++){
        headerTr$.append($('<th/>').html(col[i]));
    }
    $(struct).append(headerTr$);
    return col;
}


function structToTable2(struct, lst){
    $(struct).html('');
    let columns = addColHeaders(lst, struct);
    for (let i = 0; i < lst.length; i++) {
        let row$ = $('<tr/>');
        let nestedLst = lst[i];
        let res = {'Line' : '', 'Type':'', 'Name':'', 'Condition':'','Value':''};
        let keys = ['Line', 'Type', 'Name', 'Condition', 'Value'];
        for (let j=0;j<nestedLst.length;j++) {
            let dict = nestedLst[j];
            let dictKey = dict['key'];
            res[dictKey] = dict['value'];
        }
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            let cellVal = res[keys[colIndex]];
            row$.append($('<td/>').html(cellVal));
        }
        $(struct).append(row$);
    }
}
