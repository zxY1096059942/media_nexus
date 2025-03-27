const arr = [
    {
        name: '张三',
        fruit: ['苹果', '香蕉']
    },
    {
        name: '李四',
        fruit: ['梨', '芒果']
    },
    {
        name: '王五',
        fruit: ['樱桃', '西瓜']
    },
    {
        name: '小红',
        fruit: ['菠萝', '芒果']
    },
]
testLoop:
for (let i = 0; i < arr.length; i++) {

    for (let j = 0; j < arr[i].fruit.length; j++) {
        if (arr[i].fruit[j] === '芒果') {
        
            person = arr[i].name
            break;
        }
        console.log(arr[i].name, arr[i].fruit[j])
    }
}
