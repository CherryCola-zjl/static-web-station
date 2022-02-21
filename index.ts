import * as Http from "http";
import {IncomingMessage} from 'http';
import * as Url from "url";
import * as Fs from 'fs';
import * as Path from "path";

const server = Http.createServer();

server.on( 'request', (request: IncomingMessage,response) => {
    const {method, url, headers} = request;
    let {path, query, search} = Url.parse(url)
    const BaseUrl = Path.join(__dirname, 'public');
    path === '/' && (path = 'index.html')
    Fs.readFile(Path.join(BaseUrl,path),(err, data)=>{
        if(err){
            switch(err.errno){
                case -4058:
                    Fs.readFile(Path.join(BaseUrl,'404.html'),(err,data)=>{
                        response.statusCode = 404
                        response.end(data)
                    })
                break;
                case -4068:
                    response.statusCode = 403
                    response.setHeader("Content-Type","text/plain; charset=utf-8");
                    response.end('无权访问。。。sry')
                break;
                default:
                    response.statusCode = 500
                    response.setHeader("Content-Type","text/plain; charset=utf-8");
                    response.end('系统繁忙，请稍后再试~~')
                break;
            }
            console.log(err)
        } else {
            response.end(data)
        }
    })
})

server.listen(8888);