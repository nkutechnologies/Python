import React, { useEffect } from "react";
import axios from "axios";
import { Preview, print } from 'react-html2pdf';

export default function DiseaseDescription() {
    var imageSrc = `disease${Math.floor(Math.random() * 5)}.jpg`;
    let getDescription = async e => {
        const queryParams = new URLSearchParams(window.location.search);
        const diseaseName = queryParams.get('disease');
        [...document.getElementsByClassName('DiseaseHeading')].forEach(element => {
            element.innerHTML = diseaseName;
        });
        try {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                baseURL: "http://localhost:5000"
            }
            var diseaseObj = { disease: diseaseName };
            var description = await axios.post("/API/getDescription", diseaseObj, config);
            description = description.data;
            document.getElementsByClassName("DiseaseDescription")[0].innerHTML = description;
            getSeverity();
        } catch (error) {
            alert(error.message)
        }
    }


    let removePrecautions = () => {
        document.getElementById('precautionClickaway').remove();
        document.getElementById('precautionDiv').remove();
    }

    let removeTest = () => {
        document.getElementById('testClickaway').remove();
        document.getElementById('testDiv').remove();
    }

    let showReport = async e => {
        try {
            var diseaseName = JSON.parse(localStorage.getItem("predictedDisease"));
            let symptomsArr = JSON.parse(localStorage.getItem("symptoms"));
            var historyObj = JSON.parse(localStorage.getItem("HistoryObj"));
            if (diseaseName && symptomsArr && historyObj) {
                document.getElementById("report-template").innerHTML =
                `
                <div>
                <div class='reportHeading'>Disease Report</div>
                <div class="reportPersonDetail" style="margin-left: 15%">
                <div>Name: <span>${historyObj[historyObj.length-1].name}</span></div>
                <div>DOB: <span>${historyObj[historyObj.length-1].DOB}</span></div>
                <div>Email: <span>${historyObj[historyObj.length-1].Email}</span></div>
                <div>Date: <span>${historyObj[historyObj.length-1].Date}</span></div>
                </div>
                <div class='ReportHead'>Disease Symptoms</div>
                ${symptomsArr.map(data =>
                    `<li class="testContent text-sm mt-4 p-1"><i class="fa fa-circle" style="font-size: 5px"></i> ${data}</li>`
                ).join('')}
                <div class='ReportHead'>Predicted Disease</div>
                <div class='reportDisease'>
                ${diseaseName.map(data =>
                    `<div class="testContent text-sm mt-4 p-1"><i class="fa fa-circle" style="font-size: 5px"></i> ${data}</div>`
                ).join('')}
                </div>
                <div>
                `
                document.getElementById('reportShow').click();
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    let getSeverity = async e => {
        try {
            var disease_name = document.getElementsByClassName('DiseaseHeading')[0].innerHTML;
            var diseaseObj = { disease: disease_name }
            var severityContainer = document.getElementById("severity");
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                baseURL: 'http://localhost:5000'
            }
            var severityData = await axios.post("/API/getSeverity", diseaseObj, config);
            severityData = severityData.data;
            if (severityData) {
                severityContainer.innerHTML = severityData;
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    let showTests = async e => {
        var disease_name = document.getElementsByClassName('DiseaseHeading')[0].innerHTML;
        var diseaseObj = { disease: disease_name }
        try {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                baseURL: "http://localhost:5000"
            }
            var testContent = await axios.post("/API/getTest", diseaseObj, config);
            testContent = testContent.data;
            testContent = testContent.split("nl");
            testContent = testContent.filter(x => x != "");
            var testbg = document.createElement('div');
            testbg.setAttribute('class', 'clickaway_background');
            testbg.id = "testClickaway";
            var testContainer = document.createElement('div');
            testContainer.id = "testDiv";
            testContainer.innerHTML =
                `
                <div class="testContainer" style="text-align: center; min-width: 40rem; min-height: 15rem;">
                <i class="fa fa-times" id="testRemoveBtn" style="background: #ccc; position: absolute; top: 0px; right: 0px; margin-top: -8px; margin-right: -8px; cursor: pointer; color: black; padding: 0.3rem; border-radius: 50%"></i>            
                <div id="precautionDiseaseHeading" class="font-medium">Test for ${disease_name}</div>
                <div style="text-align: left; width: 100%">
                ${testContent.map(test =>
                    `<li class="testContent text-sm mt-4">${test}</li>`
                ).join('')}
                </div>
                </div>
         
        `
            document.body.prepend(testContainer);
            document.body.prepend(testbg);
            document.getElementById("testClickaway").style.display = "flex";
            document.getElementById("testClickaway").addEventListener('click', removeTest);
            document.getElementById('testRemoveBtn').addEventListener('click', removeTest);
        } catch (error) {
            alert(error.message);
        }
    }

    let showPrecautions = async e => {
        var disease_name = document.getElementsByClassName('DiseaseHeading')[0].innerHTML;
        var diseaseObj = { disease: disease_name }
        try {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                baseURL: "http://localhost:5000"
            }
            var precautionContent = await axios.post("/API/getPrecautions", diseaseObj, config);
            precautionContent = precautionContent.data;
            precautionContent = precautionContent.split("nl");
            precautionContent = precautionContent.filter(x => x != "");
            var precautionbg = document.createElement('div');
            precautionbg.setAttribute('class', 'clickaway_background');
            precautionbg.id = "precautionClickaway";
            var precautionContainer = document.createElement('div');
            precautionContainer.id = "precautionDiv";
            precautionContainer.innerHTML =
                `
        <div class="precautionContainer" style="text-align: center; min-width: 40rem; min-height: 15rem;">
        <i class="fa fa-times" id="precautionRemoveBtn" style="background: #ccc; position: absolute; top: 0px; right: 0px; margin-top: -8px; margin-right: -8px; cursor: pointer; color: black; padding: 0.3rem; border-radius: 50%"></i>            
        <div id="precautionDiseaseHeading" class="font-medium">Precaution for ${disease_name}</div>
        <div style="text-align: left; width: 100%">
        ${precautionContent.map(prec =>
                    `<li class="precautionContent text-sm mt-4">${prec}</li>`
                ).join('')}
        </div>
        </div>
        `
            document.body.prepend(precautionContainer);
            document.body.prepend(precautionbg);
            document.getElementById("precautionClickaway").style.display = "flex";
            document.getElementById("precautionClickaway").addEventListener('click', removePrecautions);
            document.getElementById('precautionRemoveBtn').addEventListener('click', removePrecautions);
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <div className="content-section" onLoad={getDescription}>
            <div className="hidden">
            <Preview id="report-template">
                <div className="ReportHead">Disease Symptoms</div>
                <div id="check"></div>
            </Preview>
            <button id="reportShow" onClick={()=>print('Report', 'report-template')}> print</button>
            </div>
            <img src={imageSrc} id="diseaseImg" className=" h-44 w-full rounded-lg" />
            <div className="DiseaseHeading"></div>
            <div className="DiseaseDescription"></div>
            <div className="DiseaseGroup">
                <div className="mr-auto flex flex-col justify-center">
                    <div className="font-medium text-sm text-left">Diagnostics Detail</div>
                    {/* <div className="text-xs text-gray-400 text-left">Group: Viral Fever</div> */}
                </div>
                <div className="flex flex-row ml-auto">
                    <button className="ReportBtn mr-2" onClick={showReport}>Show Reports</button>
                    <button className="TestBtn mr-2" onClick={showTests}>Tests</button>
                    <button className="PrecautionBtn" onClick={showPrecautions}>precautions</button>
                </div>
            </div>
            <div className="DiseaseSeverity">
                <div className="font-medium text-sm text-left mr-auto">Severity</div>
                <div className="text-sm text-gray-400 text-left ml-auto" id="severity">Medium</div>
            </div>
        </div>
    );
}