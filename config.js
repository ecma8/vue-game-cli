const gitUrl = 'https://github.com:ecma8/vue-game-basics#master';
const templateUrl = 'https://github.com:ecma8/vue-game-template#master';
const resourceUrl = 'https://github.com:ecma8/vue-game-resource#master';
const templatePrompt =[
    {
        name: 'title',
        message: 'name'
    },
    {
        name: 'author',
        message: 'author'
    },
    {
        name: 'description',
        message: 'description'
    }
];
const prompt =[
    {
        name: 'dir',
        message: 'dir'
    }
];
module.exports.gitUrl = gitUrl;
module.exports.prompt = prompt;
module.exports.templateUrl = templateUrl;
module.exports.resourceUrl = resourceUrl;
module.exports.templatePrompt = templatePrompt;