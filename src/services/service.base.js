import axios from 'axios';

export class ServiceBase {

    constructor(urlBase) {
        this.url = '//localhost:3003/api' + '/' + urlBase;

        this.inicializarAxios();

    }

    inicializarAxios() {
        this.axiosInstance = axios.create({
            baseURL: this.url,
        });
    }

    listarTodos() {
        let a = this.axiosInstance.get(this.url);
        console.log(a)
        return a
    }
}
