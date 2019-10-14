#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const runCmdTest = require('./cmd');
const nodeCmd = require('node-cmd');

const {gitUrl,prompt,templatePrompt,templateUrl,resourceUrl} = require('./config');

program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            const spinner = ora('正在下载模板...');
            spinner.start();
            download(gitUrl,name,{clone:true},(err) => {
                if(err){
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                }else{
                    spinner.succeed();
                    console.log(symbols.success, chalk.green('项目初始化完成'));
                    runCmdTest(name);

                }
            })
        }else{
            console.log(symbols.error, chalk.red('目录已存在'))
        }
    });
program.version('1.0.0', '-v, --version')
    .command('create <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt(templatePrompt).then((answers) => {
                const spinner = ora('🚀 正在下载模板...');
                spinner.start();
                let createDir = `src/template/${name}`;
                download(templateUrl,createDir,{clone:true},(err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const indexHtml = `${createDir}/index.html`;

                        const myConfigData = {
                            id:"",
                            version:"1.0.0",
                            title:answers.title,
                            author:answers.author,
                            description:answers.description
                        };
                        let indexHtmlData = fs.readFileSync(indexHtml, {encoding:"utf-8"});
                        indexHtmlData = indexHtmlData.replace(/<title>[\w\-]+<\/title>/,'<title>'+myConfigData.title+'</title>');
                        if(fs.existsSync(indexHtml)){
                            fs.writeFileSync(indexHtml,indexHtmlData);
                        }
                        const spinner1 = ora('🚀 正在下载资源文件...');
                        spinner1.start();
                        let resourcePath = path.resolve(createDir,'../../../public/'+name);
                        let webpackDefault = __dirname+'/webpack/'.replace(/\\/g,'/');
                        let webpackPath = path.resolve(createDir,'../../../node_modules/@vue/cli-service/lib/config');
                        let envPath = path.resolve(createDir,'../../../node_modules/@vue/cli-service/lib/util/resolveClientEnv.js');
                        let devServerPath = path.resolve(createDir,'../../../node_modules/webpack-dev-server/client/index.js');
                        let buildPath = path.resolve(createDir,'../../../node_modules/@vue/cli-service/lib/commands/build/index.js');
                        download(resourceUrl,resourcePath,{clone:true},(err) => {
                            if(err){
                                spinner1.fail();
                                console.log(symbols.error, chalk.red(err));
                            }else{
                                spinner1.succeed();
                                const myConfig = `${resourcePath}/resource/myConfig.json`;
                                if(fs.existsSync(myConfig)){
                                    fs.writeFileSync(myConfig, JSON.stringify(myConfigData));
                                }
                                if(!fs.existsSync(webpackPath+'/app.js')||!fs.existsSync(webpackPath+'/base.js')||!fs.existsSync(envPath)||!fs.existsSync(buildPath)){
                                    console.log(symbols.error,chalk.red('File Update filed'));
                                    console.log('Get started with the following commands:');
                                    console.log(chalk.blue('$ npm install'));
                                    return
                                }
                                fs.chmodSync(webpackPath+'/app.js',0777);
                                fs.chmodSync(webpackPath+'/base.js',0777);
                                fs.chmodSync(envPath,0777);
                                fs.chmodSync(devServerPath,0777);

                                let appJS = fs.readFileSync(webpackDefault+'/app.js',{encoding:"utf-8"});
                                fs.writeFileSync(webpackPath+'/app.js',appJS);
                                let baseJS = fs.readFileSync(webpackDefault+'/base.js',{encoding:"utf-8"});
                                fs.writeFileSync(webpackPath+'/base.js',baseJS);
                                let resolveClientEnvJS = fs.readFileSync(webpackDefault+'/resolveClientEnv.js',{encoding:"utf-8"});
                                fs.writeFileSync(envPath,resolveClientEnvJS);
                                let indexJS = fs.readFileSync(webpackDefault+'/index.js',{encoding:"utf-8"});
                                fs.writeFileSync(devServerPath,indexJS);
                                let buildJS = fs.readFileSync(webpackDefault+'/build.js',{encoding:"utf-8"});
                                fs.writeFileSync(buildPath,buildJS);

                                const packageProgress = ora('🚀 cnpm i xtemplate-editor xes-answer xes-edit-https xes-tem-anend xes-tem-end xes-tem-pend -S');
                                packageProgress.start();
                                nodeCmd.get(
                                    'cnpm i xtemplate-editor xes-answer xes-edit-https xes-tem-anend xes-tem-end xes-tem-pend -S',
                                    function(err, data, stderr){
                                        if(err){
                                            packageProgress.fail();
                                            console.log(chalk.red(`package update failed`));
                                            console.log(chalk.blue(`$ npm run serve --dir=${name}`));

                                        }else{
                                            packageProgress.succeed();
                                            console.log(chalk.green(`package update successful`));
                                            console.log(chalk.blue(`$ npm run serve --dir=${name}`));
                                        }
                                    }
                                );
                                nodeCmd.run('cnpm i xtemplate-editor xes-answer xes-edit-https xes-tem-anend xes-tem-end xes-tem-pend -S');
                            }
                        })

                    }
                })
            })
        }else{
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    });
program.version('1.0.0', '-v, --version')
    .command('update')
    .action((name) => {
        let webpackDefault = __dirname+'/webpack/'.replace(/\\/g,'/');
        let webpackPath = path.resolve('./node_modules/@vue/cli-service/lib/config');
        let envPath = path.resolve('./node_modules/@vue/cli-service/lib/util/resolveClientEnv.js');
        let devServerPath = path.resolve('./node_modules/webpack-dev-server/client/index.js');
        let buildPath = path.resolve('./node_modules/@vue/cli-service/lib/commands/build/index.js');



        if(!fs.existsSync(webpackPath+'/app.js')||!fs.existsSync(webpackPath+'/base.js')||!fs.existsSync(envPath)||!fs.existsSync(buildPath)){
            console.log(symbols.error,chalk.red('File Update filed'));
            console.log('Get started with the following commands:');
            console.log(chalk.blue('$ npm install'));
            return
        }
        fs.chmodSync(webpackPath+'/app.js',0777);
        fs.chmodSync(webpackPath+'/base.js',0777);
        fs.chmodSync(envPath,0777);
        fs.chmodSync(devServerPath,0777);

        let appJS = fs.readFileSync(webpackDefault+'/app.js',{encoding:"utf-8"});
        fs.writeFileSync(webpackPath+'/app.js',appJS);
        let baseJS = fs.readFileSync(webpackDefault+'/base.js',{encoding:"utf-8"});
        fs.writeFileSync(webpackPath+'/base.js',baseJS);
        let resolveClientEnvJS = fs.readFileSync(webpackDefault+'/resolveClientEnv.js',{encoding:"utf-8"});
        fs.writeFileSync(envPath,resolveClientEnvJS);
        let indexJS = fs.readFileSync(webpackDefault+'/index.js',{encoding:"utf-8"});
        fs.writeFileSync(devServerPath,indexJS);
        let buildJS = fs.readFileSync(webpackDefault+'/build.js',{encoding:"utf-8"});
        fs.writeFileSync(buildPath,buildJS);
        console.log(chalk.blue('File Update Successful'));
    });
program.version('1.0.0', '-v, --version')
    .command('resource <name>')
    .action((name) => {
        let resourcePath = path.resolve(`./public/${name}/resource`);
        let resourceJSON = [];
        let resourceDir = [
            {
                type:'image_',
                dir:'/assets/images',
                ext:['jpg','png','JPG','PNG']
            },
            {
                type:'audio_',
                dir:'/assets/audios',
                ext:['mp3','wav']
            },
            {
                type:'sprite_',
                dir:'/assets/sprites',
                ext:['json']
            },
            {
                type:'animation_',
                dir:'/animation',
                ext:['json']
            }

        ]

        if(fs.existsSync(resourcePath)){
            let dirArr = fs.readdirSync(resourcePath);
            if(dirArr.indexOf('animation')>-1&&dirArr.indexOf('assets')>-1){
                resourceDir.forEach((item,index)=>{
                    let dirPath = path.join(resourcePath,item.dir)
                     if(fs.existsSync(dirPath)){
                         let arr = fs.readdirSync(dirPath);
                         arr.forEach((fileItem,fileIndex)=>{
                             if(item.ext.indexOf(fileItem.split('.')[fileItem.split('.').length-1])>-1){
                                 resourceJSON.push({
                                     "name": fileItem,
                                     "key": item.type+fileItem.split('.')[0],
                                     "path": "./resource"+item.dir+'/'+fileItem,
                                     "edit": true
                                 })
                             }
                         })
                     }
                })
                fs.writeFileSync(path.join(resourcePath,'resource.json'),JSON.stringify(resourceJSON));
                console.log(symbols.success, chalk.green('create resource.json successful'));
                resourceJSON = [];
            }else{
                console.log(symbols.error, chalk.red('目录无效'))
            }
        }else{
            console.log(symbols.error, chalk.red('目录无效'))
        }
    });
program.parse(process.argv);