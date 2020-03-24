

/*
* 0 query; 1, input; 2, select,
* inputType: 0:text, 1: number
*
*/
const cmd = {
    1: {
        type: 0
    },
    2: {
        type: 0
    },
    3: {
        type: 0
    },
    4: {
       
    },
    5: {
        type: 2,
        option: [{value: 1, name: '断油电'}, {value: 0, name: '恢复油电'}]
    },
    6: {
        type: 0
    },
    7: {
        type: 2,
        option: [{value: 'on', name: '开启'}, {value: 'off', name: '关闭'}]
    },
    8: {
        type: 2,
        option: [{value: 'on', name: '开启'}, {value: 'off', name: '关闭'}]
    },
    9: {
        type: 2,
        option: [{value: 'on', name: '开启'}, {value: 'off', name: '关闭'}]
    },
    10: {
        type: 1,
        inputType: 1
    },
    11: {
        type: 'query'
    },
    999: {
        type: 1,
        inputType: 1
    }
}

export default cmd