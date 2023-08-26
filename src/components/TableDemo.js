import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Chart} from "primereact/chart";
import {Tag} from "primereact/tag";
import {ServiceLauncher} from "../services/service.launcher";



const TableDemo = () => {
    const [objetos, setObjetos] = useState([]);

    const [barOptions] = useState(null)
    const [pieOptions] = useState(null)
    const [filters1, setFilters1] = useState(null);

    const [loading, setLoading] = useState(true);

    const objetoService = new ServiceLauncher();

    const [rocketCounts, setRocketCounts] = useState({});
    const [successCount, setSuccessCount] = useState(0);
    const [failureCount, setFailureCount] = useState(0);


    useEffect(() => {
        objetoService.listarTodos().then((res) => {
            setObjetos(res[0].retorno);
            setLoading(false);

            var { successCount, failureCount } = calculateSuccessFailureCount();

            // Grafico de pizza
            const rocketCountMap = {};
            res[0].retorno.forEach(item => {
                rocketCountMap[item.rocket] = (rocketCountMap[item.rocket] ?? 0) + 1;
                if (item.success === true) {
                    successCount++;
                } else if (item.success === false) {
                    failureCount++;
                }
            });

            setRocketCounts(rocketCountMap);

            setSuccessCount(successCount);
            setFailureCount(failureCount);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const calculateSuccessFailureCount = () => {
        let successCount = 0;
        let failureCount = 0;

        objetos.forEach(item => {
            if (item.success) {
                successCount++;
            } else {
                failureCount++;
            }
        });

        return { successCount, failureCount };
    };


    const pieData = {
        labels: Object.keys(rocketCounts),

        datasets: [
            {
                data: Object.values(rocketCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                ],
            }
        ]
    };

    // Grafico de barras
    const calculateRocketData = () => {
        const rocketDataByYear = {};

        objetos.forEach((item) => {
            const year = new Date(item.date).getFullYear();
            if (!rocketDataByYear[year]) {
                rocketDataByYear[year] = {};
            }
            if (!rocketDataByYear[year][item.rocket]) {
                rocketDataByYear[year][item.rocket] = 0;
            }
            rocketDataByYear[year][item.rocket]++;
        });

        return rocketDataByYear;
    };

    const rocketDataByYear = calculateRocketData();

    const rocketColors = {
        'Falcon 1': '#FF6384',    // Red
        'Falcon 9': '#36A2EB',    // Blue
        'Falcon Heavy': '#FFCE56', // Yellow
    };

    const barData = {
        labels: Object.keys(rocketDataByYear),
        datasets: Object.keys(rocketColors).map((rocket) => ({
            label: rocket,
            data: Object.keys(rocketDataByYear).map((year) => rocketDataByYear[year][rocket] || 0),
            backgroundColor: rocketColors[rocket],
        })),
    };

        const formatDate = (value) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

        return (

        <div className="grid table-demo">
            <div className="col-12 lg:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5>Pie Chart</h5>
                    <Chart type="pie" data={pieData} options={pieOptions} style={{ width: '50%' }} />
                    <div className="pie-legend" style={{position: "initial"}}>
                        <div>
                            <span className="legend-color" style={{ backgroundColor: '#FF6384' }}></span>
                            <Tag className="mr-2" severity="success" value={`Success: ${successCount}`} />
                        </div>
                        <div>
                            <span className="legend-color" style={{ backgroundColor: '#36A2EB' }}></span>
                            <Tag severity="danger" value={`Fail: ${failureCount}`} />
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h5>Bar Chart</h5>
                    <Chart type="bar" data={barData} options={barOptions} />
                </div>

            </div>


            <div className="col-12">
                <div className="grid table-demo">
                    <div className="col-12">
                        <div className="card">
                            <h5>Data Table</h5>
                            <DataTable value={objetos} responsiveLayout="scroll" emptyMessage="No data found."
                                       filters={filters1} filterDisplay="menu" responsiveLayout="scroll"
                                       dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                       currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                                       responsiveLayout="scroll">
                                <Column field="flight_number" header="Flight Number" body={(rowData) => rowData.flight_number} />
                                <Column field="logo" header="Logo" body={(rowData) => {
                                        return (
                                            <div>
                                                {rowData.logo ? (
                                                    <img src={rowData.logo} alt="Rocket Logo"  style={{ maxWidth: '25px' }}/>
                                                ) : (
                                                    <div>No logo available</div>
                                                )}
                                            </div>
                                        );
                                    }}
                                />
                                <Column field="name" header="Mission" filter filterPlaceholder="Search by name" body={(rowData) => rowData.name} />
                                <Column field="date" header="Launch Date" body={(rowData) => formatDate(rowData.date)} />
                                <Column field="rocket" header="Rocket" body={(rowData) => rowData.rocket} />
                                <Column field="success" header="Success" body={(rowData) => rowData.success ?
                                    <Tag className="mr-2" severity="success" value="Success"></Tag>
                                    : <Tag severity="danger" value="Fail"></Tag> }/>
                                <Column header="Webcast" body={(rowData) => <a href={rowData.webcast}><i className="pi pi-youtube" style={{ fontSize: '2rem' }} ></i> </a>} />

                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname
        && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(TableDemo, comparisonFn);
