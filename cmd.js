const chalk = require('chalk');
const ora = require('ora');
// const execa = require('execa');
const path = require('path');

// function executeCommand (command, args, targetDir) {
//     return new Promise((resolve, reject) => {
//
//         const child = execa(command, args, {
//             cwd: targetDir
//         });
//         child.stdout.on('data', buffer => {
//             process.stdout.write(buffer)
//         });
//         child.on('close', code => {
//             if (code !== 0) {
//                 reject(`command failed: ${command} ${args.join(' ')}`);
//                 return
//             }
//             resolve()
//         })
//     })
// }
// function runCmdTest(dir) {
//     executeCommand('npm',['install','--registry=https://registry.npm.taobao.org'],path.resolve(dir));
// }



function runCmdTest(dir) {
    var child_process = require('child_process');
    let workerProcess = child_process.exec(`cd ${dir} && cnpm install`,{});
    const spinner = ora('cnpm install ...');
    spinner.start();
    workerProcess.stdout.on('data', function (data) {
        console.log(chalk.white(data));

    });
    workerProcess.stderr.on('data', function (data) {
        if(data.indexOf('cnpm')>-1){
            let workerProcess_1 = child_process.exec(`npm install -g cnpm --registry=https://registry.npm.taobao.org && cd ${dir}&& cnpm install`);
            workerProcess_1.stdout.on('data', function (data) {
                console.log(chalk.white(data));
            });
            workerProcess_1.stderr.on('data', function (data) {
                if(data.indexOf('All packages installed')>-1){
                    console.log(chalk.green(data));
                    spinner.succeed();
                }
                else{
                    if(data.indexOf('error')>-1||data.indexOf('ERROR')>-1){
                        console.log(chalk.rgb(255,0,0)(data));
                    }else{
                        console.log(chalk.rgb(255,255,0)(data));
                    }
                }
            });
        }else{
            if(data.indexOf('All packages installed')>-1){
                console.log(chalk.green(data));
                spinner.succeed();
            }else{
                if(data.indexOf('error')>-1||data.indexOf('ERROR')>-1){
                    console.log(chalk.rgb(255,0,0)(data));
                }else{
                    console.log(chalk.rgb(255,255,0)(data));
                }
            }
        }
    });

    // var workerProcess = child_process.exec(`cd ${dir}&& cnpm install`, {});
    //
    //
    //
    //
    // workerProcess.stdout.on('data', function (data) {
    //     console.log(chalk.blue(data));
    //
    // });
    // workerProcess.stderr.on('data', function (data) {
    //     console.log(chalk.yellow(data));
    // });

}


// var nodeCmd = require('node-cmd');
// function runCmdTest(dir) {
//     const spinner = ora('cnpm install ...');
//     spinner.start();
//     nodeCmd.get(
//         'cd '+dir+'&& npm install --registry=https://registry.npm.taobao.org',
//         function(err, data, stderr){
//             if(err){
//                 spinner.fail();
//             }else{
//                 spinner.succeed();
//                 console.log(data);
//                 console.log(`Successfully created project ${dir}`);
//                 console.log('Get started with the following commands:');
//                 console.log(chalk.blue(`$ cd ${dir}/src/template`));
//                 console.log(chalk.blue(`$ xtemcli create <project name>`));
//                 console.log(chalk.blue(`$ npm run serve`));
//             }
//         }
//     );
//     nodeCmd.run(`cd ${dir} && npm install`);
// }

module.exports = runCmdTest;