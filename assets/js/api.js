import * as charts from "../js/chart.js";

export const base_apiURL = "https://ianfelix.my.id/pertamina/public/";

export function status(response) {
    if (response.status !== 200) {
      console.log("Error : " + response.status);
      return Promise.reject(new Error(response.statusText));
    } else {
    //   console.log(response)
      return Promise.resolve(response);
    }
}
export function json(response) {
    return response.json();
}
export function error(error) {
    console.log("Error : " + error);
    window.location.replace("/index.html")
    // location.reload()
}

export const fetchAPI = url => {
    console.log(url);
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(status)
        // .then(json)
        .catch(error)
};

export function getDataMobil() {
    fetchAPI(`${base_apiURL}/datamobil`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        showData(data);
        // document.getElementById("dataTableMobil").innerHTML += data;
    })
    .catch(error => {
        // window.location.replace("http://127.0.0.1:5501/Front/index.html")
        console.log(error);
    })
}

export function getReasonChart() {
    fetchAPI(`${base_apiURL}/reasongraph`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // console.log(JSON.parse(data))
        let reason = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
        let reasonSum = ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
        let maxValue = 0;
        let reason_detail = [];
        for(var i in data){
            // reason.push(data[i].reason);
            reasonSum[reason.indexOf(data[i].reason)] = data[i].jumlah;
            // reasonSum.push(data[i].jumlah);
            if(data[i].jumlah > maxValue){
                maxValue = data[i].jumlah;
            }
            reason_detail.push(data[i].reason_detail)
        }
        // console.log(maxValue)
        charts.myBarChart(reason,reasonSum, maxValue, reason_detail)
        // document.getElementById("dataTableMobil").innerHTML += data;
    })
    .catch(error => {
        // window.location.replace("http://127.0.0.1:5501/Front/index.html")
        console.log(error);
    })
}

export function getDataMobilById(idMobil) {
    fetchAPI(`${base_apiURL}/datamobil/${idMobil}`)
    .then(response => response.json())
    .then(data => {
        showData(data);
        // document.getElementById("dataTableMobil").innerHTML += data;
    })
    .catch(error => {
        // window.location.replace("http://127.0.0.1:5501/Front/index.html")
        console.log(error);
    })
}

export function showData(data){
    let mobilPertamina = "";
    let angka = 0;
    data.forEach(function(mobil){
        // console.log(mobil)
        angka++
        mobilPertamina += `
        <tr>
            <td>${angka}</td>
            <td>${mobil.id_mobil}</td>
            <td>${mobil.time_on}</td>
            <td>${mobil.time_off}</td>
            <td>${mobil.nama}</td>
            <td>${mobil.personDismiss}</td>
            <td>${mobil.reason}</td>
            <td>${mobil.reason_detail}</td>
        </tr>
        `
    })
    // console.log(mobil)
    $('#dataTableMobil').append(mobilPertamina);
    $(document).ready(function() {
        $('#dataTable').DataTable();
    });
    document.querySelector(".download").addEventListener("click", function(){
        let table2excel = new Table2Excel();
        table2excel.export(document.querySelector(".table"))
    })
    // document.getElementById("dataTableMobil").innerHTML += mobilPertamina;

}

export function login(email, password){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "username": email,
    "password": password
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(`${base_apiURL}/login`, requestOptions)
    .then(response => {
            if(response.status !== 200){
                alert("Email atau Password Salah")
                return response
            }
            return response
    })
    .then(response => response.json())
    .then(result => {
        if(result.status == 200){
                localStorage.setItem("token", result.messages.token)
                window.location.replace("/index.html#dashboard")
                location.reload()
            } 
    })
    .catch(error => console.log('error', error));
}

export function getAuthorization(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`${base_apiURL}/me`, requestOptions)
    .then(response => response.json())
    .then(result => isAuth(result.messages))
    .catch(error => isAuth("error"));
}

export function isAuth(data){
    if(data == "error"){
        console.log("false")
        return false;
    }else if(data == "1"){
        console.log("true")
        return true;
    }
}

export function subscribeUser(endpoint,p256dh,auth){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    let raw = JSON.stringify({
        "endpoint": endpoint,
        "p256dh": p256dh,
        "auth": auth
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${base_apiURL}/subscription`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

