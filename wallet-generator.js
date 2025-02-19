/*
 * @Description: 生成web3钱包(地址:私钥:助记词)
 * @Author: xdm xiaodeming1001@gmail.com
 * @Date: 2024-11-19 08:48:52
 * @LastEditors: xdm xiaodeming1001@gmail.com
 * @LastEditTime: 2024-11-19 14:08:47
 * Copyright (c) 2024 by xdm, All Rights Reserved.
 */


const { ethers } = require("ethers");
const readline = require('readline');
const fs = require('fs');
const path = require('path');
 
// 创建readline接口实例
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


main();

async function main() {
  rl.question('请输入要生成的钱包数量（无需联网，按Q退出，按C清除）：', number => {
    // rl.close();

    if(number === 'q' || number ==='Q') process.exit();
    else if(number === 'c' || number ==='C') console.clear();
    else if (+number > 0 && number % 1 === 0) {
      console.log('\x1b[33m%s\x1b[0m', '开始生成...');

      // 输出文件路径
      const exportPath = path.join(process.cwd(), 'wallet-generator.txt');
      fs.writeFileSync(exportPath, `
#####################################################
# 格式: 地址:私钥:助记词
# 生成时间: ${getCurrentDate()}
# Author: xdm xiaodeming1001@gmail.com
# Copyright (c) 2024 by xdm, All Rights Reserved.
#####################################################

`)

      for(let i=0; i<+number; i++) {
        const str = walletGenerator();
        console.log('\x1b[36m%s\x1b[0m', i+1 + ' ' + str);
        fs.appendFileSync(exportPath, str + '\n');
      }
      
      console.log('\x1b[32m%s\x1b[0m\n', `生成完毕（已保存在 ${exportPath}）！`);
    }
    else console.log('\x1b[31m%s\x1b[0m\n', '# 请输入正确的数量！');
    
    main();
  })
}


/**
 * 钱包生成器
 * @returns string 例：address:privateKey:mnemonic
 */
function walletGenerator() {
  // 随机生成助记词
  const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));

  // 创建HD钱包
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
  
  // 设置基路径："m/purpose'/coin_type'/account'/change/index"
  const wallet = hdNode.derivePath(`m/44'/60'/0'/0/0`);

  return `${wallet.address}:${wallet.privateKey}:${mnemonic}`;
}


/**
 * 获取当前时间
 * @returns string YYYY-MM-DD hh:mm:ss
 */
function getCurrentDate() {
  const date = new Date();
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${Y}-${M<10?'0'+M:M}-${D<10?'0'+D:D} ${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
}
