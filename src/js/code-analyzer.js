import * as esprima from 'esprima';
import $ from 'jquery';
//var esprima = require('esprima');

//
// //
//
//


function doNothing(table){
    let x = table;
    return x;
}

function updateName(dict, toUpdate){
    let id = toUpdate['id'];
    let name = id['name'];
    dict.push({key:'Name', value:name});

}

function functionDeclaration(dict, types, table){
    updateName(dict, types, table);
    let to_iterate = types['params'];
    for(let i=0;i<to_iterate.length;i++){
        recursiveFunction(to_iterate[i], table);
    }
    recursiveFunction(types['body'], table);
    return 'function declaration';
}

function variableDeclaration(dict, types, table){
    let to_iterate = types['declarations'];
    for(let i=0;i<to_iterate.length;i++){
        recursiveFunction(to_iterate[i], table);
    }
    return '';
}

function defaultCase(dict, types, table){
    for(let key in types){
        if(key !== 'type'){
            recursiveFunction(types[key], table);
        }
    }
}

function memeberExpression(types, table){
    doNothing(table);
    let arr = types['object'];
    let arr_name = arr['name'];
    let property = types['property'];
    if (property['type'] === 'Literal')
        return arr_name + '[' + property['value'].toString() + ']';
    let property_name = property['name'];
    return arr_name + '[' + property_name + ']';
}

function recursiveExpression(types, table){
    if(types ['name'] !== undefined)
        return types['name'];
    else if(types['type'] === 'MemberExpression')
        return memeberExpression(types, table);
    else if(types['type'] === 'Literal')
        return types['value'].toString();
    else{
        let op = types['operator'];
        let left_expression = recursiveExpression(types['left'], table);
        let right_expression = recursiveExpression(types['right'], table);
        return left_expression + op + right_expression;
    }

}

function testPreProcess(types, table){
    let op = types['operator'];
    let left_expression = recursiveExpression(types['left'], table);
    let right_expression = recursiveExpression(types['right'], table);
    let final_expression = left_expression + op + right_expression;
    return final_expression;
}

function testStatement(dict ,types, table){
    let op = types['operator'];
    let left_expression = recursiveExpression(types['left'], table);
    let right_expression = recursiveExpression(types['right'], table);
    let final_expression = left_expression + op + right_expression;
    dict.push({key:'Condition', value:final_expression});
}

function argumentState(types, table){
    doNothing(table);
    if(types['type']==='UnaryExpression')
    {
        // if (types['operator'] !== undefined)
        return types['operator'] + types['argument']['value'].toString();
    }
    else if (types['type'] === 'Literal')
        return types['value'].toString();
    return types['name'];
}

function returnStatement(dict, types, table){
    let values = argumentState(types['argument'], table);
    dict.push({key:'Value', value:values});
    return 'return statement';
}

function elseIfStatement(dict, types, table){
    let test = types['test'];
    testStatement(dict, test, table);
    recursiveFunction(types['consequent'], table);
    if (types['alternate'] !== null){
        if (types['alternate']['type'] === 'IfStatement'){
            types['alternate']['type'] = 'elseIfStatement';
        }
        recursiveFunction(types['alternate'], table);
    }
    return 'else if statement';
}

function ifStatement(dict, types, table){
    let test = types['test'];
    testStatement(dict, test, table);
    recursiveFunction(types['consequent'], table);
    if (types['alternate'] !== null){
        if (types['alternate']['type'] === 'IfStatement'){
            types['alternate']['type'] = 'elseIfStatement';
        }
        recursiveFunction(types['alternate'], table);
    }
    return 'if statement';
}

function whileStatement(dict, types, table){
    let test = types['test'];
    testStatement(dict, test, table);
    recursiveFunction(types['body'], table);
    return 'while statement';
}

function updateExpression(types, table){
    var arg;
    var name;
    var op;
    switch(types['type']){
    case 'AssignmentExpression':
        return assginmentExpreesionVal(types, table);
    case 'UpdateExpression':
        arg = types['argument'];
        name = arg['name'];
        op = types['operator'];
        return name + op;

    }
}

function forStatement(dict, types, table){
    let init = assginmentExpreesionVal(types['init'], table);
    let test = testPreProcess (types['test'], table);
    let update = updateExpression(types['update'], table);
    let final_condition = init +';' + test +';' + update;
    dict.push({key:'Condition', value:final_condition });
    recursiveFunction(types['body'], table);
    return 'for statement';
}

function evaluateExpression(types, table){
    if(types['name']!==undefined){
        return types['name'];
    }
    else if(types['value']!==undefined)
        return types['value'].toString();
    let op = types['operator'];
    let left_expression = evaluateExpression(types['left'], table);
    let right_expression = evaluateExpression(types['right'], table);
    return left_expression + op + right_expression;

}

function assginmentExpreesionVal(types, table){
    let left = types['left'];
    let variable = left['name'];
    let right = evaluateExpression(types['right'], table);
    return variable + '=' + right;
}

function assignmentExpression(dict, types, table){
    let left = types['left'];
    let variable = left['name'];
    dict.push({key:'Name', value:variable});
    let right = evaluateExpression(types['right'], table);
    dict.push({key: 'Value', value:right});
    return 'assignment expression';
}

function after_cases(type, dict, table, types){
    if(type !== '' && type !== undefined){
        dict.push({key:'Type', value:type});
        let loc = types['loc'];
        let Line = '' + loc['start'].line;
        dict.push({key:'Line', value:Line});
    }
    if(dict.length > 0)
        table.push(dict);
}

function variableDeclerator(dict, types, table){
    updateName(dict, types, table);
    return 'variable declaration';
}

function identifierDeclaration(dict, types, table){
    doNothing(table);
    dict.push({key:'Name', value: types['name']});
    return 'variable declaration';
}


function recursiveDeclarations(dict, types, type, table){
    var functions = {'FunctionDeclaration':functionDeclaration, 'VariableDeclaration':variableDeclaration,
        'VariableDeclarator':variableDeclerator, 'Identifier':identifierDeclaration,
        'WhileStatement':whileStatement, 'IfStatement':ifStatement,
        'ReturnStatement':returnStatement, 'AssignmentExpression':assignmentExpression,
        'ForStatement':forStatement, 'elseIfStatement':elseIfStatement, 'default':defaultCase};
    let keys = Object.keys(functions);
    if(keys.includes(type)){
        return (functions[type](dict, types, table));
    }
    return functions['default'](dict, types, table);
}


function recursiveFunction(types, table) {
    let dict = [];
    let type = '';
    if (types['type'] === undefined) {
        for (let i = 0; i < types.length; i++)
            recursiveFunction(types[i], table);
    }
    else {
        type = recursiveDeclarations(dict, types, types['type'], table);
        after_cases(type, dict, table, types);
    }
}

function toTable(codeToParse){
    let table = [];
    //codeToParse
    let x = esprima.parseScript(codeToParse, {loc:true});
    let to_iterate = x['body'];
    for(let i=0;i<to_iterate.length;i++){
        recursiveFunction(to_iterate[i], table);
    }

    table.sort(function(first, second){
        return second[second.length-1]['value'] - first[first.length-1]['value'];
    });
    return table.reverse();
}




export {toTable};
