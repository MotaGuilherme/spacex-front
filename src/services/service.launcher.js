
import {ServiceBase} from "./service.base";

export class ServiceLauncher extends ServiceBase {

    constructor(){
        super("launchers");
    }

    listarTodos() {
        return this.axiosInstance.get(this.url)
            .then(response => {
                console.log(response.data); // Log the actual data
                return response.data;
            })
            .catch(error => {
                console.error("Error:", error);
                throw error;
            });
    }
}
