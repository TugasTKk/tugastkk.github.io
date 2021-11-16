import * as api from "../js/api.js";
document.addEventListener("DOMContentLoaded", function() {
    function hideSidebar(){
        document.querySelector(".navbar").style.display = "none";
        document.querySelector(".components-nav").style.display = "none";
        document.querySelector("footer").style.display = "none";
    }
    // hideSidebar();
    loadNav();
    function loadNav() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status != 200) return;
   
          // Muat daftar tautan menu
          document.querySelectorAll(".components-nav").forEach(function(elm) {
            elm.innerHTML = xhttp.responseText;
          });
        //   hideSidebar();

          document.querySelectorAll(".components-nav a").forEach(function(elm) {
            elm.addEventListener("click", function(event) {
                // Muat konten halaman yang dipanggil
                page = event.target.getAttribute("href");
                console.log(`Ini page ${page}`)
                loadPage(page);
                window.location.reload();
            });
          });
        }
      };
      xhttp.open("GET", "nav.html", true);
      xhttp.send();
    }

    function showSidebar(){
        document.querySelector(".navbar").style.display = "block";
        document.querySelector(".components-nav").style.display = "block";
        document.querySelector("footer").style.display = "block";
    }

    // console.log(api.getAuthorization())
    // const auth = api.getAuthorization()
    // console.log(auth)
    var page = window.location.hash.substr(1);
    // const auth = api.getAuthorization();
    // console.log(auth)
    // if(auth == "true"){
    //     page = "dashboard";
    // }else if(api.getAuthorization() == false){
    //     page = "login";
    // }
    // console.log(api.getAuthorization());
    // console.log(page)
    // if(localStorage.getItem("token") == null){
    //     page = "login";
    //     console.log(page)
    // }else if(localStorage.getItem("token") != null && api.getAuthorization()){
    //     page = "dashboard"
    //     console.log(page)
    // }else if(page == ""){
    //     page = "login"
    // }
    // console.log(page)
    if(page == "" ){
        if(localStorage.getItem("token") != null){
            console.log(localStorage.getItem("token"))
            page = "dashboard"
        }else{
            page = "login"
        }
    }
    loadPage(page)
    // location.reload()

    function loadPage(page){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4){
                var content =  document.querySelector(".body-content");
                if(page == "dashboard"){
                    api.getDataMobil();
                }else if(page == "mobil1"){
                    api.getDataMobilById("1");
                }else if(page == "mobil2"){
                    api.getDataMobilById("2");
                }
                if(this.status == 200){
                    // hideSidebar();
                    content.innerHTML = xhttp.responseText;
                    if(page=="login"){
                        hideSidebar();
                        const thisForm = document.getElementById("myForm");
                        thisForm.addEventListener("submit", function(e){
                            e.preventDefault();
                            let password = document.querySelector(".password-input").value;
                            let email = document.querySelector(".email-input").value;
                            api.login(email, password);
                        });
                    }else if(page=="dashboard" || page=="mobil1" || page=="mobil2"){
                        // showSidebar();
                        // location.reload()
                        // $(document).ready(function() {
                        //     $('#dataTable').DataTable();
                        // });
                    }else if(page == "charts"){
                        // console.log("iniCharts")

                        // showSidebar();
                        api.getReasonChart()
                        // console.log("iniSetelahApi")

                    }
                }else if(this.status == 404){
                    content.innerHTML = `<p>Konten tidak ditemukan</p>`
                }else{
                    content.innerHTML = `<p>Halaman tidak dapat diakses</p>`
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }
});

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});
let date = new Date().toDateString()

document.querySelector(".date-today").innerHTML = date;

function login(e){
    let password = document.querySelector(".password-input").value;
    let email = document.querySelector(".email-input").value;
    api.login(email, password);
}

const logout = document.querySelector(".logout-btn")

logout.addEventListener('click', function(e){
    localStorage.removeItem("token");
    window.location.replace("/Front/index.html")
})

// function logout(){
//     localStorage.removeItem("token");
// }