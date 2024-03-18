const fetch = require('node-fetch');
const fs = require('fs');
const readlineSync = require("readline-sync");
const { HttpsProxyAgent } = require('https-proxy-agent');

const rotatorProxyUrls = [
  'http://kedol-rotate:ApRi1910@p.webshare.io:80/',
  'http://kedol2-rotate:ApRi1910@p.webshare.io:80/'
];

function acakUrlProxy(array) {
  const indeksAcak = Math.floor(Math.random() * array.length);
  return array[indeksAcak];
}

const countdownAndWithdraw = async () => {
  const printCountdown = remainingTime => {
    process.stdout.write(`${Math.floor(remainingTime / 60)} menit ${remainingTime % 60} detik\r`);
  };
  let remainingTime = 130; //dalam detik
  const intervalId = setInterval(async () => {
    remainingTime--;
    printCountdown(remainingTime);
    if (remainingTime === 0) {
      clearInterval(intervalId);
    }
  }, 1000); // Update setiap 1 detik
  await new Promise(resolve => setTimeout(resolve, remainingTime * 1000)); // menunggu sampai hitung mundur selesai
};


const register = (userAgent, email, username, rotatorProxyUrl) => {
  return new Promise((resolve, reject) => {
    fetch('https://www.xrphash.com/api.php?act=register', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        'user-agent': userAgent
      },
      body: JSON.stringify({
        act: "register", // Mengonfirmasi penarikan
        email: email,
        username: username,
        phone: 85788776599,
        password: "ApRi191099",
        password_repeat: "ApRi191099",
        dialCode:"62"
      }),
      agent: new HttpsProxyAgent(rotatorProxyUrl)
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

const getCookie = (userAgent) => {
  return new Promise((resolve, reject) => {
    fetch('https://www.xrphash.com/', {
      headers: {
        'authority': 'www.xrphash.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent
      }
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const setCookieHeader = res.headers.get('Set-Cookie');
      return res.text().then((data) => {
        resolve({ data, setCookieHeader });
      });
    })
    .catch((err) => {
      reject(err);
    });
  });
};

const wihdraw = (myCookie, userAgent, wallet, tag, rotatorProxyUrl) => {
  return new Promise((resolve, reject) => {
    fetch('https://www.xrphash.com/api.php?act=withdraw', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cookie': myCookie,
        'user-agent': userAgent,
        'x-requested-with': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        confirm: 0, // Mengonfirmasi penarikan
        payout_value: 0.000025,
        password: 'ApRi191099',
        xrpAddr: wallet,
        distTag: tag
      }),
      agent: new HttpsProxyAgent(rotatorProxyUrl)
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

const login = (myCookie, userAgent, email,rotatorProxyUrl) => {
  return new Promise((resolve, reject) => {
    fetch('https://www.xrphash.com/api.php?act=login', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        'cookie': myCookie,
        'user-agent': userAgent
      },
      body: JSON.stringify({
        act: "login",
        email: email,
        password: "ApRi191099",
        otp: null
      })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};


(async () => {
  console.clear()
  let type;
  while (true) {
    console.log("Pilih Menu");
    console.log("1. Withdraw");
    console.log("2. Register");

    const choice = readlineSync.questionInt('Masukkan pilihan Anda: ');
    
    if (choice === 1) {
      type = 'wd';
      break;
    } else if (choice === 2) {
      type = 'reg';
      break;
    }
  }


  if(type == 'reg'){
    const selectFile = readlineSync.question('File Akun: ');
    console.log(" ")
  
    const fileAkun = `${selectFile}.json`
    if (!fs.existsSync(fileAkun)) {
      console.log(`File ${fileAkun} tidak ditemukan.`);
      console.clear()
    }
    const totalAkun = await fs.promises.readFile(`${selectFile}.json`, 'utf8');
    const dataAkun = JSON.parse(totalAkun);
    console.log(`Total     : ${dataAkun.length} Akun`);
    console.log(" ");
    
    for (const user of dataAkun) {
      try {
        let username = user.email.split('@')[0];
        if (username.length < 6) {
          username += 'aa66';
        } else if (username.length > 15) {
          username = username.substring(0, 15);
        }
        const rotatorProxyUrl = await acakUrlProxy(rotatorProxyUrls)
        // const rotatorProxyUrl = user.prox
        const userAgent = user.userAgent;
        const email = user.email;
        const wallet = user.wallet;
        const tag = user.tag;
        const noAkun = user.akun;
        
        console.log(`No        : ${noAkun}`);
        console.log(`Email     : ${email}`);

        const hasil = await register(userAgent, email, username, rotatorProxyUrl)

        console.log(hasil)
        
      } catch (error) {
        console.log(error)
      }
    }
  }

  if(type == 'wd'){
    const selectFile = readlineSync.question('File Akun: ');
    console.log(" ")
  
    const fileAkun = `${selectFile}.json`
    if (!fs.existsSync(fileAkun)) {
      console.log(`File ${fileAkun} tidak ditemukan.`);
      console.clear()
    }
    while(true){
      const totalAkun = await fs.promises.readFile(`${selectFile}.json`, 'utf8');
      const dataAkun = JSON.parse(totalAkun);
      console.log(`Total     : ${dataAkun.length} Akun`);
      console.log(" ");
    
      for (const user of dataAkun) {
        try {
          let username = user.email.split('@')[0];
          if (username.length < 6) {
            username += 'aa';
          } else if (username.length > 15) {
            username = username.substring(0, 15);
          }
          const rotatorProxyUrl = await acakUrlProxy(rotatorProxyUrls)
          // const rotatorProxyUrl = user.prox
          const userAgent = user.userAgent;
          const email = user.email;
          const wallet = user.wallet;
          const tag = user.tag;
          const noAkun = user.akun;
          const getCok = await getCookie()
          const myCookie = getCok.setCookieHeader.split(' ')[0]
    
          console.log(`Akun      : ${noAkun}`);
          console.log(`Email     : ${email}`);
          const testLogin = await login(myCookie, userAgent, email)
          if(testLogin.parameters[2] === 'login success'){
            const hasilWd = await wihdraw(myCookie, userAgent, wallet, tag, rotatorProxyUrl)
            if(hasilWd.parameters[2].includes('successful')){
              console.log(`Withdraw  : 0.000025 USD`);
            }else if(hasilWd.parameters[2].includes('5 minutes')){
              console.log(`Withdraw  : Belum 5 Menit`);
            }else{
              console.log(`Withdraw  : ${hasilWd.parameters[2]}`);
            }
          }else{
            // if(testLogin.parameters[1].includes('wrong username or password')){

            //   console.log(`Login     : ${testLogin.parameters[1]}`);
            //   const suksesAccount = {
            //     akun:noAkun,
            //     email,
            //     myCookie,
            //     wallet,
            //     tag,
            //     userAgent,
            //   };

            //   const existingData = await fs.promises.readFile(`belum.json`, 'utf-8').catch(() => "[]");
            //   let parsedData;
            //   try {
            //     parsedData = JSON.parse(existingData);
            //   } catch (error) {
            //     console.error('Error parsing JSON data:', error);
            //     parsedData = [];
            //   }
            //   parsedData.push(suksesAccount);
            //   const suksesJSON = JSON.stringify(parsedData, null, 2);
            //   await fs.promises.writeFile(`belum.json`, suksesJSON).catch(err => console.error('Error writing to file:', err));
            //   console.log(" ")
            // }
          }
        } catch (error) {
          console.log(`Login     : ${error}`);
        }
        console.log(" ")
      }
      await countdownAndWithdraw();
    }
  }
})();