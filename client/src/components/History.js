import { useEffect } from "react";

export default function History() {

    let getHistory = async e => {
        var historyData = await localStorage.getItem("HistoryObj")
        var historyArr = JSON.parse(historyData);
        historyArr = historyArr.reverse();
        var index = 0;
        historyArr.forEach(data => {
            var diseasesString = '';
            if (data.Disease != "Not Predicted") {
                for (var i = 0; i < data.Disease.length; i++) {
                    diseasesString += data.Disease[i];
                    if (i < data.Disease.length - 1) {
                        diseasesString += ", ";
                    }
                }
            }
            else{
                diseasesString = data.Disease;
            }
            var row = document.createElement('tr');
            row.innerHTML =
            `<td>${data.name}</td>
            <td>${data.Date}</td>
            <td>${data.DOB}</td>
            <td>${data.Gender}</td>
            <td>${data.Email}</td>
            <td>${diseasesString}</td>
            <td><span style="display: none">${index}</span>${data.Feedback == "Not Inserted" ? `Was It Accurate ? <span class='ml-2 mr-2 text-blue-600 cursor-pointer fop'>Yes</span><span class='text-blue-600 cursor-pointer fop'>No</span>` : data.Feedback}</td>`
            document.getElementsByTagName("tbody")[0].appendChild(row);
            index++;
        });
        var fop = document.getElementsByClassName('fop');
        [...fop].forEach(element => {
            element.addEventListener('click', function () {
                if (this.innerHTML == "Yes") {
                    var feedbackIndex = this.parentElement.children[0].innerHTML;
                    historyArr[feedbackIndex].Feedback = "Accurate"
                    historyArr = historyArr.reverse();
                    localStorage.setItem("HistoryObj", JSON.stringify(historyArr));
                    window.location.reload();
                }
                else if (this.innerHTML == "No") {
                    var feedbackIndex = this.parentElement.children[0].innerHTML;
                    historyArr[feedbackIndex].Feedback = "Not Accurate"
                    historyArr = historyArr.reverse();
                    localStorage.setItem("HistoryObj", JSON.stringify(historyArr));
                    window.location.reload();
                }
            })
        })
    }

    useEffect(() => {
        getHistory();
    });

    return (
        <div className="content-section">
            <div className="heading_main"><strong>History</strong></div>
            <div className="subtitles">
                Last 5 record(s)
            </div>
            <table className="mt-12">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Disease</th>
                        <th>Feedback</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    );
}