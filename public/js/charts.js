
let ctx = document.querySelector("myChart").getContext("2d")

let labels = ['Groceries', 'Restaurant', 'Going Out', 'Shopping', 'Transportation', 'Home', 'Health', 'Sport', 'Subscriptions', 'Other']
let colorHexHex = ['#ffffff', '#044400', '#005500', '#007770', '#009900', '#003330','#023400', '#003300', '#005500']

let myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        datasets: [{
            data: [20, 30, 40, 40, 40, 40, 40, 40, 40],
            backgroundColor: colorHexHex,
        }],
        labels: labels,
    },
    options: {
        responsive: true,
        legend: {
            position: 'bottom'
        }
    }

})










module.exports = router;