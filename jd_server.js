const http = require('http')
const fs = require('fs');
const path = require('path')
const file = path.resolve(__dirname, './config/config.sh') //路径不同需要改改，你当期间脚本文件相对路径

function writeCookietmp(pt_key, pt_pin) {
    const re = new RegExp('.*'+ pt_pin +'.*', 'g')
    const cookie = `${pt_key};${pt_pin};`
    // console.log(re)
    fs.readFile(file,'utf8',function(err,data){
        // console.log('替換前' + data)
        let result = data.replace(re, cookie);
        // console.log('替換後' + result)
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err){
                console.log(err)
            }
        });
    })
}

function writeCookie(pt_key, pt_pin) {
    const re0 = new RegExp('export JD_COOKIE=".*"', 'g')
    const re = new RegExp('pt_key=.*;'+ pt_pin +';', 'g')
    const cookie = `${pt_key};${pt_pin};`
    // console.log(cookie)
    // console.log(re)
    fs.readFile(file,'utf8',function(err,data){
        const origin_ckstr = data.match(re0)[0]
        const ckstr = origin_ckstr.match('".*"')[0].slice(1,-1)
        let newckstr = ''
        for (const v of ckstr.split('&')) {
            newckstr = newckstr + v.replace(re, cookie) + '&'
        }
        newckstr = newckstr.slice(0,-1)
        newckstr = 'export JD_COOKIE="' + newckstr + '"'
        let result = data.replace(origin_ckstr, newckstr);
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err){
                console.log(err)
            }
        });
    })
}

let tmp_key = ''
const server = http.createServer(function(request, response) {
    if (request.method === 'POST') {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            // console.log(Buffer.concat(body).toString())
            try {
                body = JSON.parse(Buffer.concat(body).toString());
                if (body.pt_key && body.pt_pin && body.pt_key != tmp_key) {
                    writeCookie(body.pt_key, body.pt_pin)
                    console.log(body.pt_pin)
                    console.log(body.pt_key)
		    console.log(file)
		    tmp_key = body.pt_key
                    response.end('OK');
                } else {
                    response.statusCode = 400;
                    response.end('Invalid param');
                }
            } catch (e) {
                response.statusCode = 400;
                response.end('Invalid param');
            }
        });
    } else {
        response.statusCode = 404;
        response.end();
    }
})

const port = 5701
const host = '0.0.0.0'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
