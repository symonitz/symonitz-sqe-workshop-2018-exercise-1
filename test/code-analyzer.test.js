import assert from 'assert';
import {toTable} from '../src/js/code-analyzer';


// describe('The javascript parser', () => {
//     it('is parsing an empty function correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('')),
//             '{"type":"Program","body":[],"sourceType":"script"}, "loc" : '
//         );
//     });
//
//     it('is parsing a simple variable declaration correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('let a = 1;'), {loc:true}),
//             '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
//         );
//     });
// });

describe('Testing obvious fucntions', () => {
    it('parsing emtpy as needed', () => {
        assert.equal(JSON.stringify(Array()), JSON.stringify(toTable('')));
    });

    it('parsing simple expression', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'a'}, {key: 'Type', value: 'variable declaration'},
            {key: 'Line', value: '1'}], [{key:'Name',value:'a'},{key:'Value',value:'a+1'},
            {key:'Type', value:'assignment expression'}, {key:'Line', value:'2'}]]),
        JSON.stringify(toTable('let a = 1;\n' + 'a = a + 1;')));
    });
});


describe('Testing functions', () =>
{

    it('parsing different functions', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'forTests'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'2'}],
        [{key:'Name', value:'x'}, {key:'Type', value: 'variable declaration'},{key:'Line', value:'3'}],
        [{key:'Condition', value:'a<4'}, {key:'Type', value:'if statement'}, {key:'Line', value: '4'}],
        [{key:'Name', value:'x'}, {key:'Value',value:'x+1'}, {key:'Type', value:'assignment expression'}, {key:'Line', value:'5'}],
        [{key:'Name', value:'x'}, {key:'Value', value:'x+2'}, {key:'Type', value:'assignment expression'}, {key: 'Line', value: '8'}]]),
        JSON.stringify(toTable('function forTests(){\n' +
            '    let a = 2;\n' + '    let x = 0;\n' + '    if(a < 4){\n' + '        x = x+1;\n' + '    }\n' + '    else{\n' + '    x = x+2;\n' + '    }\n' + '}')));
        // assert.equal(JSON.stringify('[ [ key: "name", value : "a"}, [ key: "Type", value: "variable declaration" }, ' +
        //     '{key: "Line", value: "1" } ] ]'), JSON.stringify(toTable('let a = 1;')));

    });

});



describe('Testing functions', () =>
{

    it('now with parameters and return value', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'forTests2'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'b'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key:'Name', value:'a'}, {key:'Type', value: 'variable declaration'},{key:'Line', value:'1'}],
        [{key:'Value', value:'a'}, {key:'Type', value:'return statement'}, {key: 'Line', value: '2'}]]),
        JSON.stringify(toTable('function forTests2(a,b){\n' +
            '    return a;\n' +
            '}')));
        // assert.equal(JSON.stringify('[ [ key: "name", value : "a"}, [ key: "Type", value: "variable declaration" }, ' +
        //     '{key: "Line", value: "1" } ] ]'), JSON.stringify(toTable('let a = 1;')));

    });

});

describe('Testing loops', () =>
{

    it(' while statement', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'doWhile'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'2'}],
        [{key:'Condition', value:'a<4'}, {key:'Type', value:'while statement'}, {key: 'Line', value: '3'}],
        [{key:'Name', value:'a'}, {key:'Value',value:'a+1'},{key:'Type',value:'assignment expression'},{key:'Line',value:'4'}]]),
        JSON.stringify(toTable('function doWhile(){\n' +
                '    let a = 3;\n' +
                '    while(a<4){\n' +
                '        a = a + 1;\n' +
                '    }\n' +
                '}')));
    });
});


describe('Testing loops', () =>
{

    it(' for statement', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'doFor'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'2'}],
        [{key:'Condition', value:'i=0;i<1;i=i+1'}, {key:'Type', value: 'for statement'},{key:'Line', value:'3'}],
        [{key:'Name', value:'a'}, {key:'Value', value:'a+1'}, {key: 'Type', value: 'assignment expression'}, {key:'Line', value:'4'}]]),
        JSON.stringify(toTable('function doFor(){\n' +
                '    let a = 3;\n' +
                '    for(i=0;i<1;i=i+1){\n' +
                '        a = a+1;\n' +
                '    }\n' +
                '}')));
        // assert.equal(JSON.stringify('[ [ key: "name", value : "a"}, [ key: "Type", value: "variable declaration" }, ' +
        //     '{key: "Line", value: "1" } ] ]'), JSON.stringify(toTable('let a = 1;')));

    });
});



describe('Testing statement', () =>
{

    it('else if statement', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'test4'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key:'Condition', value:'a<2'}, {key:'Type', value: 'if statement'},{key:'Line', value:'2'}],
        [{key:'Name', value:'a'}, {key:'Value', value:'a+1'}, {key: 'Type', value: 'assignment expression'}, {key:'Line', value:'4'}],
        [{key:'Condition',value:'a>3'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'6'}],
        [{key:'Name',value:'a'},{key:'Value',value:'a-1'}, {key:'Type', value:'assignment expression'}, {key:'Line', value:'7'}]]),
        JSON.stringify(toTable('function test4(a){\n' +
            '    if(a < 2)\n' + '    {\n' + '        a = a + 1;\n' + '    }\n' + '    else if(a > 3){\n' + '        a = a -1;\n' + '    }\n' +
            '}')));
    });
});



describe('Testing statements', () =>
{

    it('else if nested with unary expression', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'testX'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key:'Condition', value:'a<2'}, {key:'Type', value: 'if statement'},{key:'Line', value:'2'}],
        [{key:'Name', value:'a'}, {key:'Value', value:'a+1'}, {key: 'Type', value: 'assignment expression'}, {key:'Line', value:'4'}],
        [{key:'Condition',value:'a>3'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'6'}],
        [{key:'Name',value:'a'},{key:'Value',value:'a-1'}, {key:'Type', value:'assignment expression'}, {key:'Line', value:'7'}],
        [{key:'Condition',value:'a===2'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'9'}],
        [{key:'Value',value:'a'}, {key:'Type',value:'return statement'}, {key:'Line', value:'10'}],
        [{key:'Value',value:'-1'}, {key:'Type',value:'return statement'}, {key:'Line', value:'12'}]]),
        JSON.stringify(toTable('function testX(a){\n' + '    if(a < 2)\n' + '    {\n' +
            '        a = a + 1;\n' + '    }\n' + '    else if(a > 3){\n' + '        a = a -1;\n' +
            '    }\n' + '    else if (a === 2){\n' + '         return a;\n' + '    }\n' + '    return -1;\n' + '}')));
    });
});



describe('Testing statements', () =>
{

    it('else if nested without unary expression', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'testX'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key:'Condition', value:'a<2'}, {key:'Type', value: 'if statement'},{key:'Line', value:'2'}],
        [{key:'Name', value:'a'}, {key:'Value', value:'a+1'}, {key: 'Type', value: 'assignment expression'}, {key:'Line', value:'4'}],
        [{key:'Condition',value:'a>3'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'6'}],
        [{key:'Name',value:'a'},{key:'Value',value:'a-1'}, {key:'Type', value:'assignment expression'}, {key:'Line', value:'7'}],
        [{key:'Condition',value:'a===2'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'9'}],
        [{key:'Value',value:'a'}, {key:'Type',value:'return statement'}, {key:'Line', value:'10'}],
        [{key:'Value',value:'1'}, {key:'Type',value:'return statement'}, {key:'Line', value:'12'}]]),
        JSON.stringify(toTable('function testX(a){\n' + '    if(a < 2)\n' + '    {\n' +
            '        a = a + 1;\n' + '    }\n' + '    else if(a > 3){\n' + '        a = a -1;\n' +
            '    }\n' + '    else if (a === 2){\n' + '         return a;\n' + '    }\n' + '    return 1;\n' + '}')));
    });
});

describe('Testing array case', () =>
{

    it('', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'testV'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'a'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key:'Condition', value:'a<2'}, {key:'Type', value: 'if statement'},{key:'Line', value:'2'}],
        [{key:'Name', value:'a'}, {key:'Value', value:'a+1'}, {key: 'Type', value: 'assignment expression'}, {key:'Line', value:'4'}],
        [{key:'Condition',value:'a>b[3]'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'6'}],
        [{key:'Name',value:'a'},{key:'Value',value:'a-1'}, {key:'Type', value:'assignment expression'}, {key:'Line', value:'7'}],
        [{key:'Condition',value:'a===2'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'9'}],
        [{key:'Value',value:'a'}, {key:'Type',value:'return statement'}, {key:'Line', value:'10'}],
        [{key:'Value',value:'-1'}, {key:'Type',value:'return statement'}, {key:'Line', value:'12'}]]),
        JSON.stringify(toTable('function testV(a){\n' + '    if(a < 2)\n' + '    {\n' +
            '        a = a + 1;\n' + '    }\n' + '    else if(a > b[3]){\n' + '        a = a -1;\n' +
            '    }\n' + '    else if (a === 2){\n' + '         return a;\n' + '    }\n' + '    return -1;\n' + '}')));
    });
});




describe('Testing class example', () =>
{
    it('', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'binarySearch'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value:'n'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key: 'Name', value:'V'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}], [{key: 'Name', value:'X'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'1'}],
        [{key: 'Name', value:'mid'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'2'}],
        [{key: 'Name', value:'high'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'2'}], [{key: 'Name', value:'low'}, {key:'Type', value:'variable declaration'}, {key:'Line',value:'2'}],
        [{key:'Name', value:'low'},{key:'Value',value:'0'},{key:'Type', value:'assignment expression'}, {key:'Line',value:'3'}],
        [{key:'Name', value:'high'},{key:'Value',value:'n-1'},{key:'Type', value:'assignment expression'}, {key:'Line',value:'4'}],
        [{key:'Condition', value:'low<=high'}, {key:'Type', value: 'while statement'},{key:'Line', value:'5'}],
        [{key:'Name', value:'mid'},{key:'Value',value:'low+high/2'},{key:'Type', value:'assignment expression'}, {key:'Line',value:'6'}],
        [{key:'Condition',value:'X<V[mid]'}, {key:'Type',value:'if statement'}, {key:'Line', value:'7'}],
        [{key:'Name', value:'high'},{key:'Value',value:'mid-1'},{key:'Type', value:'assignment expression'}, {key:'Line',value:'8'}],
        [{key:'Condition',value:'X>V[mid]'}, {key:'Type',value:'else if statement'}, {key:'Line', value:'9'}],
        [{key:'Name', value:'low'},{key:'Value',value:'mid+1'},{key:'Type', value:'assignment expression'}, {key:'Line',value:'10'}],
        [{key:'Value', value:'mid'},{key:'Type', value:'return statement'}, {key:'Line',value:'12'}], [{key:'Value', value:'-1'},{key:'Type', value:'return statement'}, {key:'Line',value:'14'}]]),
        JSON.stringify(toTable('function binarySearch(X, V, n){\n' + '    let low, high, mid;\n' + '    low = 0;\n' + '    high = n - 1;\n' + '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' + '        if (X < V[mid])\n' + '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' + '            low = mid + 1;\n' + '        else\n' + '            return mid;\n' + '    }\n' + '    return -1;\n' + '}')));});});


describe('Testing nested expression', () => {
    it('', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'x'}, {key: 'Type', value: 'variable declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value: 'y'}, {key: 'Type', value: 'variable declaration'},
            {key: 'Line', value: '2'}], [{key: 'Condition', value: 'x+y<2'}, {key: 'Type', value: 'if statement'},
            {key: 'Line', value: '3'}], [{key: 'Name', value: 'x'},{key:'Value', value:'1'}, {key: 'Type', value: 'assignment expression'},
            {key: 'Line', value: '4'}]]), JSON.stringify(toTable('let x = 0;\n' +
            'let y = 1;\n' + 'if((x+y) < 2){\n' + '    x = 1;\n' + '}\n')));
    });
});


describe('Testing for loop second vers', () => {
    it('', () => {
        assert.equal(JSON.stringify([[{key: 'Name', value: 'test'}, {key: 'Type', value: 'function declaration'},
            {key: 'Line', value: '1'}],[{key: 'Name', value: 'x'}, {key: 'Type', value: 'variable declaration'},
            {key: 'Line', value: '2'}], [{key: 'Condition', value: 'i=0;i<=5;i++'}, {key: 'Type', value: 'for statement'},
            {key: 'Line', value: '3'}], [{key: 'Name', value: 'x'},{key:'Value', value:'x+i'}, {key: 'Type', value: 'assignment expression'},
            {key: 'Line', value: '4'}]]), JSON.stringify(toTable('function test(){\n' +
            '    let x = 3;\n' + '    for(i=0;i<=5;i++){\n' + '        x = x + i;\n' + '    }\n' + '}\n')));
    });
});